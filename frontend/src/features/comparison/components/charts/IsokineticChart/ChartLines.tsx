/*
 * Název souboru:    ChartLines.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro vykreslení čar na grafu pro porovnání vyšetření.
 */

import {
  AveragesByExamination,
  ComparisonColors,
} from "features/comparison/types/types";
import { isHidden } from "features/comparison/utils/comparison";
import { MeasurementPhase } from "types/types";
import React from "react";
import { Line } from "recharts";
import { evaluatePlaneColor } from "utils/colors";
import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";

const ChartLines = (
  chartData: AveragesByExamination[],
  idsToHide: { id: string; set: number }[],
  colors: ComparisonColors[],
  type: MeasurementPhase,
) => {
  const { examinations } = useCurrentComparisonStore();
  return chartData.map((data) => {
    if (isHidden(idsToHide, data.examination_id, data.set)) {
      return null;
    }
    const examination = examinations.find(
      (e) => e.data.id === data.examination_id && e.set === data.set,
    );
    if (!examination) {
      return null;
    }
    const color = evaluatePlaneColor(
      colors,
      examination.data,
      type,
      examination.set,
    );

    return (
      <React.Fragment key={`line_group_${data.examination_id}`}>
        <Line
          key={`${data.examination_id}-${data.set}`}
          type="monotone"
          dataKey={`${data.examination_id}_${examination.set}`}
          stroke={color.planeColor}
          dot={false}
          strokeWidth={1.3}
          isAnimationActive={false}
          connectNulls
        />
        <Line
          key={`${data.examination_id}_out-${data.set}`}
          type="monotone"
          dataKey={`${data.examination_id}_${examination.set}_out`}
          stroke="#000000"
          dot={false}
          isAnimationActive={false}
        />
      </React.Fragment>
    );
  });
};

export default ChartLines;
