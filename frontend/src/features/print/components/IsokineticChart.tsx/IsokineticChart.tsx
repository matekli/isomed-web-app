/*
 * Název souboru:    IsokineticChart.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Graf zobrazovaný v exportované zprávě
 */

import { memo, useRef } from "react";
import { YAxis, CartesianGrid, ResponsiveContainer, LineChart } from "recharts";
import {
  getXTicksComparison,
  mergeChartData,
} from "features/comparison/utils/isokineticChart";
import {
  AveragesByExamination,
  IndexedExamination,
  RepetitionsByExamination,
  ReportColor,
  TestType,
} from "features/comparison/types/types";
import { MeasurementPhase } from "types/types";
import ChartLines from "./ChartLines";
import CustomXAxis from "./CustomXAxis";

type IsokineticChartProps = {
  type: MeasurementPhase;
  chartData: AveragesByExamination[];
  yTicks: number[];
  examinations: IndexedExamination[];
  colors: ReportColor[];
  repetitions: RepetitionsByExamination[];
  examType: TestType;
};

const IsokineticChart = ({
  type,
  chartData,
  yTicks,
  examinations,
  colors,
  repetitions,
  examType,
}: IsokineticChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  const bounds = getXTicksComparison(examinations, repetitions, type);

  const mergedData = mergeChartData(type, examinations, chartData, bounds);

  return (
    <div
      className="chart-container h-full w-full flex-grow select-none"
      ref={chartContainerRef}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={mergedData}
          margin={{ right: 5, left: 5, bottom: 15 }}
          className="border border-primary"
        >
          <CartesianGrid
            stroke="#000000"
            strokeDasharray="1 10"
            vertical={false}
          />

          <YAxis
            type="number"
            ticks={yTicks}
            interval={0}
            padding={{ top: 10 }}
            axisLine={false}
          />

          {CustomXAxis(bounds, colors, examinations, examType)}

          {ChartLines(chartData, colors, examinations)}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default memo(IsokineticChart);
