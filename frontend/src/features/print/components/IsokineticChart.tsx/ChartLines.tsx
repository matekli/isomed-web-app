/*
 * Název souboru:    ChartLines.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Vykreslení čar v grafu
 */

import {
  AveragesByExamination,
  IndexedExamination,
  ReportColor,
} from "features/comparison/types/types";
import React from "react";
import { Line } from "recharts";

const ChartLines = (
  chartData: AveragesByExamination[],
  colors: ReportColor[],
  examinations: IndexedExamination[],
) => {
  return chartData.map((data) => {
    const examination = examinations.find(
      (e) => e.data.id === data.examination_id && e.set === data.set,
    );
    if (!examination) {
      return null;
    }
    const color = colors.find(
      (c) =>
        c.examination_id === examination.data.id && c.set === examination.set,
    );

    return (
      <React.Fragment key={`line_group_${data.examination_id}`}>
        <Line
          key={`${data.examination_id}-${data.set}`}
          type="monotone"
          dataKey={`${data.examination_id}_${examination.set}`}
          stroke={color?.color}
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
