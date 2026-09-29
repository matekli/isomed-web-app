/*
 * Název souboru:    isokinetic.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Sada funkcí používaných v detailu porovnání
 */

import {
  DataForCalculations,
  Measurement,
  MeasurementPhase,
} from "types/types";
import {
  Averages,
  AveragesByExamination,
  IndexedExamination,
  IsokineticResultsByExamination,
  RepetitionsByExamination,
} from "../types/types";
import {
  ExaminationWithPatient,
  IsokineticResultsData,
} from "features/examination/types/types";
import { isAthletic } from "utils/utils";
import {
  computeAthleticResults,
  computeIsokineticResults,
} from "utils/calculations/isokineticCalculations";

// Funkce pro linární interpolaci
const interpolate = (
  data: Measurement[],
  targetPosition: number,
  _type: MeasurementPhase,
) => {
  const sortedData = [...data].sort(
    (a, b) => a.relative_position - b.relative_position,
  );

  // Pokud je požadovaná pozice mimo rozsah, extrapolujeme
  if (targetPosition <= sortedData[0].relative_position) {
    return { torque: sortedData[0].torque, speed: sortedData[0].speed };
  }
  if (targetPosition >= sortedData[sortedData.length - 1].relative_position) {
    return {
      torque: sortedData[sortedData.length - 1].torque,
      speed: sortedData[sortedData.length - 1].speed,
    };
  }

  // Procházíme data a hledáme dvě sousední hodnoty pro interpolaci
  for (let i = 0; i < sortedData.length - 1; i++) {
    const p1 = sortedData[i];
    const p2 = sortedData[i + 1];

    if (
      targetPosition >= p1.relative_position &&
      targetPosition <= p2.relative_position
    ) {
      const ratio =
        (targetPosition - p1.relative_position) /
        (p2.relative_position - p1.relative_position);
      return {
        torque: p1.torque + ratio * (p2.torque - p1.torque),
        speed: p1.speed + ratio * (p2.speed - p1.speed),
      };
    }
  }

  return {
    torque: sortedData[0].torque,
    speed: sortedData[0].speed,
  };
};

// Funkce pro výpočet průměrného torque pro pevné rozmezí relative_position s interpolací
export const calculateAverageTorque = (
  examination: IndexedExamination,
  data: RepetitionsByExamination,
  step = 1,
): { M1Data: Averages[]; M2Data: Averages[] } => {
  if (!data) {
    return { M1Data: [], M2Data: [] };
  }

  // Rozdělení na flex a ext
  const M1Measurements = data.repetitions
    .filter((rep) => rep.type === "M1")
    .flatMap((r) => r.measurements);
  const M2Measurements = data.repetitions
    .filter((rep) => rep.type === "M2")
    .flatMap((r) => r.measurements);

  // Zjištění minima a maxima pro každý typ
  const minFlex = Math.min(...M1Measurements.map((m) => m.relative_position));
  const maxFlex = Math.max(...M1Measurements.map((m) => m.relative_position));

  const minExt = Math.min(...M2Measurements.map((m) => m.relative_position));
  const maxExt = Math.max(...M2Measurements.map((m) => m.relative_position));

  // Funkce pro výpočet průměru torque v daných intervalech
  const computeAverages = (
    minPos: number,
    maxPos: number,
    type: MeasurementPhase,
  ): Averages[] => {
    const averages: Averages[] = [];

    for (let pos = minPos; pos <= maxPos; pos += step) {
      const interpolatedTorques: number[] = [];
      const interpolatedSpeeds: number[] = [];

      data.repetitions
        .filter((rep) => rep.type === type)
        .forEach((repetition) => {
          const interpolatedValue = interpolate(
            repetition.measurements,
            pos,
            type,
          );
          interpolatedTorques.push(
            isAthletic(examination.data)
              ? Math.round(interpolatedValue.torque)
              : Math.round(interpolatedValue.torque),
          );
          interpolatedSpeeds.push(interpolatedValue.speed);
        });

      const avgTorque =
        interpolatedTorques.reduce((sum, t) => sum + t, 0) /
        interpolatedTorques.length;

      const avgSpeed =
        interpolatedSpeeds.reduce((sum, t) => sum + t, 0) /
        interpolatedSpeeds.length;

      averages.push({
        type,
        relative_position: pos,
        torque: Math.abs(Math.round(avgTorque)),
        speed: Math.abs(Math.round(avgSpeed)),
      });
    }
    return averages;
  };

  return {
    M1Data: computeAverages(minFlex, maxFlex, "M1"),
    M2Data: computeAverages(minExt, maxExt, "M2"),
  };
};

// Převede averages do požadovaného formátu pro kalkulace
const prepareDataForCalculations = (averages: AveragesByExamination) => {
  const M1Data = averages.averages.M1Data.map((m) => {
    return {
      torque: m.torque,
      relative_position: m.relative_position,
      speed: m.speed,
      time: null,
    };
  });
  const M2Data = averages.averages.M2Data.map((m) => {
    return {
      torque: m.torque,
      relative_position: m.relative_position,
      speed: m.speed,
      time: null,
    };
  });

  return {
    M1Data,
    M2Data,
  };
};

const computeResultsByType = (
  data: DataForCalculations[],
  result: IsokineticResultsData,
  examination: ExaminationWithPatient,
  type: MeasurementPhase,
  offset: number | null,
  onlyIsokinetic: boolean,
) => {
  if (isAthletic(examination)) {
    computeAthleticResults(
      data,
      result,
      examination,
      type,
      offset,
      onlyIsokinetic,
    );
  } else {
    computeIsokineticResults(
      data,
      result,
      examination,
      type,
      offset,
      onlyIsokinetic,
    );
  }
};

// Funkce pro výpočet výsledků v detailu porovnání
export const getIsokineticResultsComp = (
  averagesByExamination: AveragesByExamination[],
  examinations: IndexedExamination[],
  offset: number | null,
  onlyIsokinetic: boolean,
) => {
  const results: IsokineticResultsByExamination[] = [];
  for (const examination of examinations) {
    const avg = averagesByExamination.find(
      (a) =>
        a.examination_id === examination.data.id && a.set === examination.set,
    );

    if (!avg) {
      continue;
    }

    const data = prepareDataForCalculations(avg);

    let result: IsokineticResultsData = {
      repetition: null,
      data: {
        speed: { M1: null, M2: null },
        maxTorque: { M1: null, M2: null },
        maxTorqueAt: { M1: null, M2: null },
        maxTorqueWeight: { M1: null, M2: null },
        torqueAtOff: { M1: null, M2: null },
        torqueOffWeight: { M1: null, M2: null },
        work: { M1: null, M2: null },
        workWeight: { M1: null, M2: null },
        power: { M1: null, M2: null },
        mSecMaxTorque: { M1: null, M2: null },
        rangeMotion: { M1: null, M2: null },
      },
    };

    computeResultsByType(
      data.M1Data,
      result,
      examination.data,
      "M1",
      offset,
      onlyIsokinetic,
    );

    computeResultsByType(
      data.M2Data,
      result,
      examination.data,
      "M2",
      offset,
      onlyIsokinetic,
    );

    results.push({
      examination_id: examination.data.id,
      set: avg.set,
      data: result.data,
    });
  }

  return results;
};
