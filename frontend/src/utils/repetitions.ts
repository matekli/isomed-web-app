/*
 * Název souboru:    repetitions.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Sada funkcí pro rozdělení vyšetření na jednotlivé opakování
 */

import { ExaminationWithPatient } from "features/examination/types/types";
import { Measurement, MeasurementPhase, Repetition } from "types/types";
import { hasIsokineticPhase } from "./calculations/isokineticCalculations";
import { RepetitionsByExamination } from "features/comparison/types/types";

/**
 * Rozděluje pole měření na opakování na základě změn směru točivého momentu.
 * Nové opakování je zahájeno, když točivý moment překročí nulu se změnou směru.
 *
 * Po sobě jdoucí hodnoty točivého momentu rovné nule jsou zahrnuty v aktuálním opakování,
 * dokud se neobjeví nenulová hodnota točivého momentu, což zajišťuje plynulé segmentování.
 *
 * @param {Measurement[]} measurements - Pole objektů měření.
 * @returns {Repetition[]} - Pole opakování, z nichž každé obsahuje skupinu měření.
 */
export const divideMeasurements = (
  measurements: Measurement[] = [],
  examination: ExaminationWithPatient,
): Repetition[] => {
  if (!Array.isArray(measurements) || measurements.length === 0) {
    return [];
  }

  const test_mode = examination.test_mode;

  switch (test_mode) {
    case "1":
      return divideConcConc(measurements, examination);

    case "2":
      return divideBySpeedDirection(measurements, examination);

    case "3":
      return divideBySpeedDirection(measurements, examination);

    case "4":
      return divideBySpeedDirection(measurements, examination);

    case "7":
      return divideBySpeedDirection(measurements, examination);

    case "21":
      return divideBySpeedDirection(measurements, examination);

    default:
      return [];
  }
};

const mergeRepsWithSameNumber = (data: Repetition[]): Repetition[] => {
  return data.reduce((acc: Repetition[], curr: Repetition) => {
    const existing = acc.find(
      (item) =>
        item.repetition === curr.repetition &&
        item.type === curr.type &&
        item.set === curr.set,
    );

    if (existing) {
      existing.measurements = existing.measurements.concat(curr.measurements);
    } else {
      acc.push(curr);
    }

    return acc;
  }, []);
};

// Rozděluje na základě znaménka u rychlosti, odfiltruje opakování, které nedosáhly ani v jednom bodě nastavené rychlosti
// Převádí všechny torque na kladné hodnoty a případně sloučí chybně rozdělené opakování
// (Může se stát, že v rámci jednoho opakování chvilkově rychlost přejde do opačné rychlosti a zase zpět, nejčastěji u ECC)
// Číslo opakování bere z půlky dat v rámci daného opakování
const divideBySpeedDirection = (
  measurements: Measurement[] = [],
  examination: ExaminationWithPatient,
): Repetition[] => {
  let divided: Repetition[] = [];
  let currentGroup: Measurement[] = [];

  for (let index = 0; index < measurements.length; index++) {
    const currentSpeed = measurements[index].speed;
    const currentSet = measurements[index].current_set;

    currentGroup.push(measurements[index]);

    if (
      (index < measurements.length - 1 &&
        currentSpeed !== 0 &&
        ((currentSpeed > 0 && nextNonZeroSpeed(measurements, index + 1) < 0) ||
          (currentSpeed < 0 &&
            nextNonZeroSpeed(measurements, index + 1) > 0))) ||
      (index < measurements.length - 1 &&
        currentSet !== measurements[index + 1].current_set)
    ) {
      while (
        index + 1 < measurements.length &&
        measurements[index + 1].speed === 0 &&
        currentSet === measurements[index + 1].current_set
      ) {
        currentGroup.push(measurements[index]);
        index++;
      }

      const type =
        currentGroup[Math.floor(currentGroup.length / 2)].speed < 0
          ? "M2"
          : "M1";
      if (!hasIsokineticPhase(currentGroup, examination, type)) {
        currentGroup = [];
        continue;
      }
      const repetition =
        currentGroup[Math.floor(currentGroup.length / 2)].current_repetition;
      const set = currentGroup[Math.floor(currentGroup.length / 2)].current_set;
      divided.push({ type, repetition, set, measurements: currentGroup });

      currentGroup = [];
    }
  }

  // Ošetření poslední skupiny
  if (currentGroup.length > 0) {
    let max = -Infinity;
    for (let i = 0; i < currentGroup.length; i++) {
      const speed = Math.abs(currentGroup[i].speed);
      if (speed > max) {
        max = speed;
      }
    }

    if (currentGroup.length === 0) {
      return makeTorquePositive(divided);
    }

    const type =
      currentGroup[Math.floor(currentGroup.length / 2)].speed < 0 ? "M2" : "M1";

    if (!hasIsokineticPhase(currentGroup, examination, type)) {
      currentGroup = [];
      return mergeRepsWithSameNumber(makeTorquePositive(divided));
    }

    const repetition =
      currentGroup[Math.floor(currentGroup.length / 2)].current_repetition;
    const set = currentGroup[Math.floor(currentGroup.length / 2)].current_set;
    divided.push({ type, repetition, set, measurements: currentGroup });
  }
  return mergeRepsWithSameNumber(makeTorquePositive(divided));
};

/**
 * Najde další nenulovou hodnotu točivého momentu v poli měření, počínaje daným indexem.
 *
 * @param {Measurement[]} measurements - Pole objektů měření.
 * @param {number} startIndex - Index, od kterého se začne hledat.
 * @returns {number} - Další nenulová hodnota točivého momentu, nebo 0, pokud žádná není nalezena.
 */
const nextNonZeroTorque = (measurements: Measurement[], startIndex: number) => {
  for (let i = startIndex; i < measurements.length; i++) {
    if (measurements[i].torque !== 0) return measurements[i].torque;
  }
  return 0;
};

const makeTorquePositive = (repetitions: Repetition[]) => {
  const formatted = repetitions.map((r) => {
    return {
      ...r,
      measurements: r.measurements.map((m) => ({
        ...m,
        torque: Math.abs(m.torque),
      })),
    };
  });

  return formatted;
};

const divideConcConc = (
  measurements: Measurement[] = [],
  examination: ExaminationWithPatient,
) => {
  let divided: Repetition[] = [];
  let currentGroup: Measurement[] = [];

  for (let index = 0; index < measurements.length; index++) {
    const current = measurements[index].torque;
    const set = measurements[index].current_set;

    currentGroup.push(measurements[index]);

    if (
      (index < measurements.length - 1 &&
        current !== 0 &&
        ((current > 0 && nextNonZeroTorque(measurements, index + 1) < 0) ||
          (current < 0 && nextNonZeroTorque(measurements, index + 1) > 0))) ||
      (index < measurements.length - 1 &&
        set !== measurements[index + 1].current_set)
    ) {
      while (
        index + 1 < measurements.length &&
        measurements[index + 1].torque === 0
      ) {
        currentGroup.push(measurements[index + 1]);
        index++;
      }

      const type =
        currentGroup[Math.floor(currentGroup.length / 2)].speed < 0
          ? "M2"
          : "M1";

      if (!hasIsokineticPhase(currentGroup, examination, type)) {
        currentGroup = [];
        continue;
      }

      const repetition =
        currentGroup[Math.floor(currentGroup.length / 2)].current_repetition;
      const set = currentGroup[Math.floor(currentGroup.length / 2)].current_set;
      divided.push({ type, repetition, set, measurements: currentGroup });

      currentGroup = [];
    }
  }

  // Ošetření poslední skupiny
  if (currentGroup.length > 0) {
    const type =
      currentGroup[Math.floor(currentGroup.length / 2)].torque < 0
        ? "M2"
        : "M1";
    if (!hasIsokineticPhase(currentGroup, examination, type)) {
      return mergeRepsWithSameNumber(makeTorquePositive(divided));
    }
    const repetition =
      currentGroup[Math.floor(currentGroup.length / 2)].current_repetition;
    const set = currentGroup[Math.floor(currentGroup.length / 2)].current_set;
    divided.push({ type, repetition, set, measurements: currentGroup });
  }

  return mergeRepsWithSameNumber(makeTorquePositive(divided));
};

const nextNonZeroSpeed = (measurements: Measurement[], startIndex: number) => {
  for (let i = startIndex; i < measurements.length; i++) {
    if (measurements[i].speed !== 0) return measurements[i].speed;
  }
  return 0;
};

const checkContinuousRepetitions = (repetitions: number[]) => {
  if (repetitions.length === 1) {
    return false;
  }
  for (let index = 0; index < repetitions.length - 1; index++) {
    const element = repetitions[index];
    const next = repetitions[index + 1];

    if (next - element > 1) {
      return false;
    }
  }
  return true;
};

// Pomocná funkce pro získání formátovaných opakování
const formatReps = (reps: number[]) => {
  if (reps.length === 0) return "--";
  return checkContinuousRepetitions(reps)
    ? `${reps[0]} - ${reps[reps.length - 1]}`
    : reps.join(", ");
};

export const formatRepetitions = (
  data: RepetitionsByExamination | Repetition[],
) => {
  const isWithExamination = "repetitions" in data;
  // Vratí čísla opakování pro daný typ
  const repetitions = isWithExamination ? data.repetitions : data;
  const groupReps = (type: MeasurementPhase): number[] =>
    repetitions
      .filter((r) => r.type === type)
      .sort((a, b) => a.repetition - b.repetition)
      .map((r) =>
        type === "M1" ? Math.round(r.repetition / 2) : r.repetition / 2,
      );

  const M1Reps = groupReps("M1");
  const M2Reps = groupReps("M2");

  return {
    M1: formatReps(M1Reps),
    M2: formatReps(M2Reps),
  };
};
