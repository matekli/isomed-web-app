/*
 * Název souboru:    isometricSets.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Funkce pro rozdělení isometrického vyšetření na jednotlivé sety
 */

import { ExaminationWithPatient } from "features/examination/types/types";
import { Measurement, IsometricSet } from "types/types";

export const divideIsometric = (
  measurements: Measurement[] = [],
  _examination: ExaminationWithPatient,
) => {
  const positiveMeasurements = measurements.filter((m) => m.time > 0);

  let divided: IsometricSet[] = [];
  let currentGroup: Measurement[] = [];

  const pushRepetition = (group: Measurement[]) => {
    const isometricSet: IsometricSet = {
      set: group[currentGroup.length - 1].current_set,
      angle: group[0].relative_position,
      measurements: group,
    };
    divided.push(isometricSet);
    currentGroup = [];
  };

  for (const current of positiveMeasurements) {
    if (current.current_set === null) {
      if (currentGroup.length > 0) {
        pushRepetition(currentGroup);
        currentGroup = [];
      }
      continue;
    }

    currentGroup.push(current);
  }

  if (currentGroup.length > 0) {
    pushRepetition(currentGroup);
  }

  return divided;
};
