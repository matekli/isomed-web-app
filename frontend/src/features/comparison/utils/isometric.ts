/*
 * Název souboru:    isometric.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Sada funkcí používaných v detailu porovnání
 */

import {
  getIsometricPeakTorque,
  getIsometricTorqueOff,
  getIsometricAverageTorque,
} from "utils/calculations/isometricCalculations";
import {
  IsometricSetsByExamination,
  IndexedExamination,
  IsometricResultsByExamination,
} from "../types/types";
import { roundOnOneDecimal, safeDivide } from "utils/math";

const groupByHoldAngle = (
  results: IsometricResultsByExamination[],
  examinations: IndexedExamination[],
  tolerance = 0,
) => {
  if (examinations.length === 0) return [];

  const filtered = results
    .filter((r) => r.holdAngle !== null && r.set !== null)
    .sort((a, b) => a.holdAngle! - b.holdAngle!);

  const groups: IsometricResultsByExamination[][] = [];

  for (const entry of filtered) {
    const group = groups.find((group) =>
      group.some(
        (g) =>
          Math.abs((g.holdAngle ?? 0) - (entry.holdAngle ?? 0)) <= tolerance &&
          g.examination_id !== entry.examination_id,
      ),
    );

    if (group) {
      const alreadyExists = group.some(
        (g) => g.examination_id === entry.examination_id,
      );
      if (!alreadyExists) group.push(entry);
    } else {
      groups.push([entry]);
    }
  }

  groups.forEach((group) =>
    group.sort((a, b) => {
      const first = examinations.find((e) => e.data.id === a.examination_id);
      const second = examinations.find((e) => e.data.id === b.examination_id);
      return (first?.index ?? 0) - (second?.index ?? 0);
    }),
  );

  return groups;
};

export const getHoldAngles = (sets: IsometricSetsByExamination[]) => {
  const holdAngles: number[][] = [];
  for (let index = 0; index < sets.length; index++) {
    const element = sets[index];
    const angles = element.sets.map((s) => Math.round(s.angle / 10));
    holdAngles.push(angles);
  }

  return holdAngles.flat().sort((a, b) => a - b);
};

export const getIsometricResults = (
  sets: IsometricSetsByExamination[],
  examinations: IndexedExamination[] | undefined,
  offset: number | null,
) => {
  if (!examinations) return [];

  const results: IsometricResultsByExamination[] = [];

  for (const setByExam of sets) {
    const examination = examinations.find(
      (e) => e.data.id === setByExam.examination_id,
    );
    if (!examination) continue;

    const { weight } = examination.data;

    for (const set of setByExam.sets) {
      const holdAngle = Math.round(set.angle / 10);
      const max = getIsometricPeakTorque(set);
      const maxTorque = max.peak;
      const maxTorqueTime = max.peakAt;
      const maxTorqueWeight = safeDivide(maxTorque, weight);
      const torqueAtOff = getIsometricTorqueOff(set.measurements, offset);
      const torqueoffMsWt = safeDivide(torqueAtOff, weight);
      const averageTorque = getIsometricAverageTorque(set);

      results.push({
        examination_id: setByExam.examination_id,
        holdAngle,
        set: set.set,
        data: {
          holdAngle,
          maxTorque,
          maxTorqueTime,
          maxTorqueWeight: roundOnOneDecimal(maxTorqueWeight),
          torqueAtOff,
          torqueoffMsWt: roundOnOneDecimal(torqueoffMsWt),
          averageTorque,
        },
      });
    }
  }

  const grouped = groupByHoldAngle(results, examinations);

  return grouped;
};
