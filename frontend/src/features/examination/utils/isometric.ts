/*
 * Název souboru:    isometric.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Pomocné funkce pro isometrická vyšetření
 */

import { IsometricSet, IsometricChartData } from "types/types";
import {
  getIsometricPeakTorque,
  getIsometricTorqueOff,
  getIsometricAverageTorque,
} from "utils/calculations/isometricCalculations";
import { safeDivide, roundOnOneDecimal } from "utils/math";
import { ExaminationWithPatient, IsometricResultsData } from "../types/types";

export const getIsometricChartData = (
  sets: IsometricSet[],
  set: number,
): IsometricChartData[] => {
  const currentSet = sets.find((s) => s.set === set);
  if (!currentSet) {
    return [];
  }
  const angle = currentSet.angle;

  const result = currentSet.measurements.map((m) => {
    return {
      time: m.time,
      angle: angle,
      torque: Math.abs(m.torque),
      relative_position: m.relative_position,
      current_set: set,
    };
  });

  return result;
};

export const getIsometricResults = (
  examination: ExaminationWithPatient,
  sets: IsometricSet[],
  torqOff: number | null,
) => {
  const results: IsometricResultsData[] = [];
  for (let index = 0; index < sets.length; index++) {
    const currentSet = sets[index];

    const max = getIsometricPeakTorque(currentSet);
    const holdAngle = Math.round(currentSet.angle / 10);
    const maxTorque = max.peak;
    const maxTorqueTime = max.peakAt;
    const maxTorqueWeight = safeDivide(maxTorque, examination.weight);
    const torqueAtOff = getIsometricTorqueOff(currentSet.measurements, torqOff);
    const torqueoffMsWt = safeDivide(torqueAtOff, examination.weight);
    const averageTorque = getIsometricAverageTorque(currentSet);

    const result: IsometricResultsData = {
      set: currentSet.set,
      data: {
        holdAngle,
        maxTorque,
        maxTorqueTime,
        maxTorqueWeight: roundOnOneDecimal(maxTorqueWeight),
        torqueAtOff,
        torqueoffMsWt: roundOnOneDecimal(torqueoffMsWt),
        averageTorque,
      },
    };

    results.push(result);
  }
  return results;
};

export const getXTicksIsometric = (chartData: IsometricChartData[]) => {
  let ticks: number[] = [];
  for (let index = 0; index < chartData.length; index += 200) {
    const time = chartData[index].time;

    ticks.push(time);
  }
  return ticks;
};
