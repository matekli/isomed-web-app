/*
 * Název souboru:    isometricChart.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Sada funkcí používaných v detailu porovnání isometrických vyšetření
 */

import { divideBy10AndRound } from "utils/math";
import {
  IdToHide,
  IndexedExamination,
  IsometricResultsByExamination,
  IsometricSetsByExamination,
} from "../types/types";
import { getHoldAngles } from "./isometric";
import { isHidden } from "./comparison";

export const mergeIsometricData = (
  examinations: IndexedExamination[],
  setsByExamination: IsometricSetsByExamination[],
  currentData: IsometricResultsByExamination[],
): {
  time: string;
  [key: string]: string;
}[] => {
  const allSets = setsByExamination.flatMap((s) =>
    s.sets.map((set) => ({
      ...set,
      examination_id: s.examination_id,
    })),
  );

  const filtered = allSets.filter((item) =>
    currentData.some(
      (a) => a.examination_id === item.examination_id && a.set === item.set,
    ),
  );
  const mergedDataMap = new Map<number, any>();

  filtered.forEach((item) => {
    const startTime = item.measurements[0].time;
    item.measurements.forEach((set) => {
      const validTime = set.time - startTime;
      if (!mergedDataMap.has(validTime)) {
        const newEntry: any = { time: validTime };
        examinations.forEach(() => (newEntry[`${item.examination_id}`] = null));
        mergedDataMap.set(validTime, newEntry);
      }

      mergedDataMap.get(validTime)[`${item.examination_id}`] =
        divideBy10AndRound(Math.abs(set.torque));
    });
  });
  return Array.from(mergedDataMap.values());
};

export const mergeIsometricPeakData = (
  examinations: IndexedExamination[],
  setsByExamination: IsometricResultsByExamination[],
): {
  angle: string;
  [key: string]: string;
}[] => {
  const mergedDataMap = new Map<number, any>();

  examinations.forEach(() => {
    setsByExamination.forEach((set) => {
      if (!mergedDataMap.has(set.holdAngle!)) {
        const newEntry: any = { angle: set.holdAngle };

        examinations.forEach((examination) => {
          newEntry[`${examination.data.id}`] = null;
        });
        mergedDataMap.set(set.holdAngle!, newEntry);
      }

      mergedDataMap.get(set.holdAngle!)[`${set.examination_id}`] = Math.round(
        set.data.maxTorque!,
      );
    });
  });
  return Array.from(mergedDataMap.values());
};

export const getIsometricYTicks = (
  tableData: IsometricResultsByExamination[][],
) => {
  const values = tableData.flatMap((t) => t.map((o) => o.data?.maxTorque ?? 0));

  const maxValue = Math.ceil(Math.max(...values));
  const step = Math.round(maxValue / 5);

  const ticks = Array.from({ length: 6 }, (_, i) => i * step);
  return ticks;
};

export const getXTicksIsometric = (
  chartData: { [key: string]: string; time: string }[],
) => {
  let ticks: number[] = [];
  for (let index = 0; index < chartData.length; index += 200) {
    const time = chartData[index].time;

    ticks.push(Number(time));
  }
  ticks.push(Number(chartData[chartData.length - 1].time));
  return ticks;
};

export const getXTicksIsometricPeak = (
  isometricSetsByExamination: IsometricSetsByExamination[],
  idsToHide: IdToHide[],
) => {
  const visibleSets = isometricSetsByExamination.filter(
    (set) => !isHidden(idsToHide, set.examination_id),
  );

  // Získáme zaokrouhlené úhly z setů
  const holdAngles = getHoldAngles(visibleSets);

  // Odstraníme duplicity pomocí Setu
  const xTicks = Array.from(new Set(holdAngles));

  if (xTicks.length === 1) {
    xTicks.unshift(0); // přidáme začátek, pokud by byl jen jeden tick
  }
  return xTicks;
};
