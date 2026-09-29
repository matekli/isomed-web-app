/*
 * Název souboru:    isokineticChart.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Sada funkcí pro připravu dat pro
 *                   graf v porovnání
 */

import { MeasurementPhase } from "types/types";
import {
  AveragesByExamination,
  BoundsByExamination,
  IndexedExamination,
  RepetitionsByExamination,
  TestType,
} from "../types/types";
import { isAthletic } from "utils/utils";
import { divideBy10AndRound, safeDivide } from "utils/math";

export const mergeChartData = (
  type: MeasurementPhase,
  examinations: IndexedExamination[],
  averagesByExamination: AveragesByExamination[],
  boundsByExamination: BoundsByExamination[],
  overlapBuffer: number = 1,
): {
  relative_position: string;
  [key: string]: string;
}[] => {
  const mergedDataMap = new Map<number, any>();

  examinations.forEach((examination) => {
    const averages = averagesByExamination.find(
      (avg) =>
        avg.examination_id === examination.data.id &&
        avg.set === examination.set,
    );

    const bounds = boundsByExamination.find(
      (bound) =>
        bound.examination_id === examination.data.id &&
        bound.set === examination.set,
    );

    if (!averages || !bounds) {
      return null;
    }

    const averagesByType =
      type === "M1" ? averages.averages.M1Data : averages.averages.M2Data;

    // Slouží pro zarovnání jednotlivých vyšetření "nad sebe", aby měly všechny stejný počet datových bodů.
    // _out záznamy se používají pro zobrazování černé barvy v grafu detailu porovnání,
    // která ukazuje, že dané pozice nebylo dosaženo pro všechna opakování v rámci vyšetření
    averagesByType.forEach((average) => {
      const { relative_position, torque, type } = average;

      const normalizedTorque = isAthletic(examination.data)
        ? Math.round(torque)
        : Math.round(torque / 10);
      if (!mergedDataMap.has(relative_position)) {
        const newEntry: any = { relative_position: relative_position };

        examinations.forEach((examination) => {
          newEntry[`${examination.data.id}_${examination.set}`] = null;
          newEntry[`${examination.data.id}_${examination.set}_out`] = null;
        });
        mergedDataMap.set(relative_position, newEntry);
      }

      if (type === "M1") {
        if (
          relative_position > bounds.bounds[0] - overlapBuffer &&
          relative_position < bounds.bounds[1] + overlapBuffer
        ) {
          mergedDataMap.get(relative_position)[
            `${examination.data.id}_${examination.set}`
          ] = normalizedTorque;
        }
        if (
          relative_position < bounds.bounds[0] + overlapBuffer ||
          relative_position > bounds.bounds[1] - overlapBuffer
        ) {
          mergedDataMap.get(relative_position)[
            `${examination.data.id}_${examination.set}_out`
          ] = normalizedTorque;
        }
      } else {
        if (
          relative_position < bounds.bounds[0] + overlapBuffer &&
          relative_position > bounds.bounds[1] - overlapBuffer
        ) {
          mergedDataMap.get(relative_position)[
            `${examination.data.id}_${examination.set}`
          ] = normalizedTorque;
        }
        if (
          relative_position > bounds.bounds[0] - overlapBuffer ||
          relative_position < bounds.bounds[1] + overlapBuffer
        ) {
          mergedDataMap.get(relative_position)[
            `${examination.data.id}_${examination.set}_out`
          ] = normalizedTorque;
        }
      }
    });
  });

  // Převod mapy na pole, seřazení podle relative_position
  const mergedDataArray = Array.from(mergedDataMap.values());
  const sorted = mergedDataArray.sort(
    (a, b) => a.relative_position - b.relative_position,
  );

  return sorted;
};

// Výpočet značek pro osu X
export const getXTicksComparison = (
  examinations: IndexedExamination[],
  repetitions: RepetitionsByExamination[] | undefined,
  type: MeasurementPhase,
) => {
  if (!repetitions) {
    return [];
  }

  return examinations.flatMap((examination) => {
    const rep = repetitions.find(
      (r) =>
        r.examination_id === examination.data.id && r.set === examination.set,
    );

    if (!rep) {
      return [];
    }

    const filteredReps = rep.repetitions.filter((r) => r.type === type);

    const startPositions = filteredReps.map(
      (r) => r.measurements[0].relative_position,
    );
    const endPositions = filteredReps.map(
      (r) => r.measurements[r.measurements.length - 1].relative_position,
    );

    let startBound = startPositions[0];
    let endBound = endPositions[0];

    for (let i = 1; i < startPositions.length; i++) {
      if (type === "M1") {
        if (startPositions[i] > startBound) {
          startBound = startPositions[i];
        }
        if (endPositions[i] < endBound) {
          endBound = endPositions[i];
        }
      } else {
        if (startPositions[i] < startBound) {
          startBound = startPositions[i];
        }
        if (endPositions[i] > endBound) {
          endBound = endPositions[i];
        }
      }
    }

    return [
      {
        examination_id: rep.examination_id,
        set: rep.set,
        bounds: [startBound, endBound],
      },
    ];
  });
};

// Výpočet značek pro osu Y
export const getIsokineticYTicks = (
  data: AveragesByExamination[] | undefined,
  type: TestType,
) => {
  if (!data) {
    return [];
  }
  let max = -Infinity;

  for (const exam of data) {
    for (const item of exam.averages.M1Data) {
      max = Math.max(max, item.torque);
    }
    for (const item of exam.averages.M2Data) {
      max = Math.max(max, item.torque);
    }
  }

  const maxValue = type === "isokinetic" ? divideBy10AndRound(max) : max;

  const step = safeDivide(maxValue, 6) ?? 20; // 6 kroků = 7 hodnot (0 + 6 dalších)

  const ticks = Array.from({ length: 7 }, (_, i) => Math.round(i * step));

  return ticks;
};

export const findIdByValueFromBounds = (
  boundsByExamination: BoundsByExamination[],
  value: number,
) => {
  const ids: { id: string; set: number }[] = [];

  boundsByExamination.forEach((bounds) => {
    const found = bounds.bounds.find((b) => b === value);
    if (found !== undefined) {
      ids.push({ id: bounds.examination_id, set: bounds.set });
    }
  });

  return ids;
};

// Slouží pro detekci jestli se dané značky na ose X překrývají
export const isTickOverlapping = (
  lastXCoordinate: number,
  xCoordinate: number,
) => {
  const isOverlaping =
    lastXCoordinate !== undefined &&
    Math.abs(lastXCoordinate - xCoordinate) < 18
      ? true
      : false;

  return isOverlaping;
};
