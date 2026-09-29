/*
 * Název souboru:    colors.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Definice barev používaných v aplikaci a pomocné funkce
 *                   pro práci s nimi
 */

import {
  Comparison,
  ComparisonColors,
  ComparisonColorSet,
} from "features/comparison/types/types";
import {
  ExaminationWithPatient,
  testModes,
} from "features/examination/types/types";
import { MeasurementPhase } from "types/types";

const COMPARISON_COLORS_M1 = [
  "hsl(225, 100%, 50%)",
  "hsl(200, 100%, 50%)",
  "hsl(168, 100%, 48%)",
  "hsl(103, 62%, 39%)",
];

const COMPARISON_COLORS_M2 = [
  "hsl(0, 100%, 50%)",
  "hsl(34, 100%, 50%)",
  "hsl(310, 95%, 49%)",
  "hsl(31, 100%, 29%)",
];

const COMPARISON_COLORS_MAIN = [
  "hsl(255, 100%, 80%)",
  "hsl(127, 80%, 80%)",
  "hsl(46, 80%, 80%)",
  "hsl(90, 100%, 50%)",
];

const REPORT_COLORS = [
  "hsl(213, 50%, 48%)",
  "hsl(355, 89%, 60%)",
  "hsl(128 71.7% 33.8%)",
];

export const DEFAULT_COLOR_M1 = "hsl(246, 100%, 51%)";

export const DEFAULT_COLOR_M2 = "hsl(0, 100%, 51%)";

export const DEFAULT_COLOR_M1_LEFT = "hsl(200, 100%, 50%)";

export const DEFAULT_COLOR_M2_LEFT = "hsl(34, 100%, 50%)";

export const DEFAULT_COLOR_M1_RIGHT = "hsl(168, 100%, 48%)";

export const DEFAULT_COLOR_M2_RIGHT = "hsl(310, 95%, 49%)";

const planesWithM1Color = [
  "0",
  "2",
  "4",
  "6",
  "8",
  "10",
  "12",
  "14",
  "16",
  "18",
  "20",
  "22",
  "30",
];

export const getDefaultColors = (examination: ExaminationWithPatient) => {
  const { test_mode, plane } = examination;
  if (test_mode === testModes.ISOMETRIC) {
    const color = planesWithM1Color.includes(plane)
      ? DEFAULT_COLOR_M1
      : DEFAULT_COLOR_M2;

    return {
      M1Color: color,
      M2Color: color,
      M1ColorLeft: DEFAULT_COLOR_M1_LEFT,
      M1ColorRight: DEFAULT_COLOR_M1_RIGHT,
      M2ColorLeft: DEFAULT_COLOR_M2_LEFT,
      M2ColorRight: DEFAULT_COLOR_M2_RIGHT,
    };
  }

  return {
    M1Color: DEFAULT_COLOR_M1,
    M2Color: DEFAULT_COLOR_M2,
    M1ColorLeft: DEFAULT_COLOR_M1_LEFT,
    M1ColorRight: DEFAULT_COLOR_M1_RIGHT,
    M2ColorLeft: DEFAULT_COLOR_M2_LEFT,
    M2ColorRight: DEFAULT_COLOR_M2_RIGHT,
  };
};

// Inicializuje barvy pro kazde vysetreni
export const assignColorsToComparisons = (
  comparisons: Comparison[],
): ComparisonColors[] => {
  return comparisons.map((comparison, index) => {
    const mainColor = COMPARISON_COLORS_MAIN[index];
    const M1Color = COMPARISON_COLORS_M1[index];
    const M2color = COMPARISON_COLORS_M2[index];
    return {
      examination_id: comparison.id,
      set: comparison.set,
      colors: { mainColor: mainColor, M1Color: M1Color, M2Color: M2color },
    };
  });
};

export const assignReportColors = (comparisons: Comparison[]) => {
  return comparisons.map((comparison, index) => {
    const color = REPORT_COLORS[index];

    return {
      examination_id: comparison.id,
      set: comparison.set,
      color,
    };
  });
};

export const evaluatePlaneColor = (
  colors: ComparisonColors[],
  examination: ExaminationWithPatient,
  type?: MeasurementPhase,
  set: number = 1,
) => {
  const color =
    examination.test_mode === testModes.ISOMETRIC
      ? getIsometricColor(colors, examination)
      : getColorByType(
          findColorsById(colors, examination.id, set),
          type ?? "M1",
        );

  return color;
};
const getIsometricColor = (
  colors: ComparisonColors[],
  examination: ExaminationWithPatient,
) => {
  const planesForBlue = [
    "0",
    "2",
    "4",
    "6",
    "8",
    "10",
    "12",
    "14",
    "16",
    "18",
    "20",
    "22",
    "30",
  ];
  const { id, plane } = examination;

  const isBlue = planesForBlue.includes(plane);

  const colorSet = findColorsById(colors, id);

  return {
    mainColor: colorSet.mainColor,
    planeColor: isBlue ? colorSet.M1Color : colorSet.M2Color,
  };
};

export const findColorsById = (
  colors: ComparisonColors[],
  id: string,
  set: number = 1,
) => {
  const result = colors.find((c) => c.examination_id === id && c.set === set);

  return result
    ? result.colors
    : {
        M1Color: "hsl(0, 0%, 100%)",
        M2Color: "hsl(0, 0%, 100%)",
        mainColor: "hsl(0, 0%, 100%)",
      };
};

const getColorByType = (colors: ComparisonColorSet, type: MeasurementPhase) => {
  return {
    planeColor: type === "M1" ? colors.M1Color : colors.M2Color,
    mainColor: colors.mainColor,
  };
};
