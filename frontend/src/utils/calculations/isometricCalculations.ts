/*
 * Název souboru:    isometricCalculations.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Výpočty související s isometrickými vyšetřeními
 */

import { IsometricSet, Measurement } from "types/types";

export const getIsometricPeakTorque = (set: IsometricSet) => {
  let peakTorque = -Infinity;
  let timeAtPeak = 0;
  for (let i = 0; i < set.measurements.length; i++) {
    const currentTorque = Math.abs(set.measurements[i].torque);
    const currentTime = set.measurements[i].time;

    if (currentTorque > peakTorque) {
      peakTorque = currentTorque;
      timeAtPeak = currentTime;
    }
  }

  const peakAt =
    Math.round(((timeAtPeak - set.measurements[0].time) / 1000) * 10) / 10;

  return { peak: Math.abs(Math.round(peakTorque / 10)), peakAt: peakAt };
};

export const getIsometricPeakTorqueWeight = (
  maxTorque?: number | null,
  weight?: number,
) => {
  if (!weight || !maxTorque) {
    return null;
  }
  return Math.round((maxTorque / weight) * 10) / 10;
};

export const getIsometricTorqueOff = (
  measurements: Measurement[],
  off: number | null,
) => {
  if (off === null || off === undefined) {
    return null;
  }
  const index = Math.floor(off / 5);
  if (index < measurements.length) {
    return Math.abs(Math.round(measurements[index].torque / 10));
  }

  return null;
};

export const getIsometricAverageTorque = (set: IsometricSet): number => {
  let temp = 0;
  let i = 0;
  while (i < set.measurements.length) {
    temp += set.measurements[i].torque;
    i++;
  }
  return set.measurements.length > 0
    ? Math.abs(Math.round(temp / set.measurements.length / 10))
    : 0;
};

export const getIsometricTorqueAtOffWeight = (
  torque?: number | null,
  weight?: number,
) => {
  if (!weight || !torque) {
    return null;
  }
  return Math.round((torque / weight) * 10) / 10;
};
