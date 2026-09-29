/*
 * Název souboru:    IsokineticChart.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta interaktivního grafu pro porovnání vyšetření.
 */

import { useRef } from "react";
import {
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
} from "recharts";
import {
  getXTicksComparison,
  mergeChartData,
} from "features/comparison/utils/isokineticChart";
import { AveragesByExamination } from "features/comparison/types/types";
import { MeasurementPhase } from "types/types";
import useChartInteractions from "hooks/useChartInteractions";
import CustomXAxis from "features/comparison/components/charts/IsokineticChart/CustomXAxis";
import ChartLines from "./ChartLines";
import { useCompChartContext } from "contexts/CompChartContext";
import IsokineticTooltip from "./IsokineticTooltip";
import { isHidden } from "features/comparison/utils/comparison";
import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";

type IsokineticChartProps = {
  type: MeasurementPhase;
  chartData: AveragesByExamination[];
  yTicks: number[];
};

const IsokineticChart = ({ type, chartData, yTicks }: IsokineticChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    colors,
    examinations,
    type: examType,
    repetitions: repetitionsByExamination,
  } = useCurrentComparisonStore();

  const { showTooltip, idsToHide } = useCompChartContext();

  const bounds = getXTicksComparison(
    examinations,
    repetitionsByExamination,
    type,
  );

  const mergedData = mergeChartData(type, examinations, chartData, bounds);

  const {
    chartStart,
    chartEnd,
    handleStartDragging,
    handleDragging,
    handleStopDragging,
  } = useChartInteractions({
    chartDataLength: mergedData.length,
    chartContainerRef: chartContainerRef,
  });

  const filteredBounds = bounds.filter(
    (bound) => !isHidden(idsToHide, bound.examination_id, bound.set),
  );

  const isZoomed = chartStart !== 0 || chartEnd !== mergedData.length;

  const yLabel = examType === "athletic" ? "Force ( N )" : "Torque ( N*m )";

  return (
    <div
      className="chart-container w-full flex-grow select-none py-2"
      ref={chartContainerRef}
      onMouseDown={handleStartDragging}
      onMouseMove={handleDragging}
      onMouseUp={handleStopDragging}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={mergedData.slice(chartStart, chartEnd)}
          margin={{ right: 5, left: 5, bottom: 15 }}
        >
          <CartesianGrid />

          <YAxis
            type="number"
            ticks={yTicks}
            interval={0}
            padding={{ top: 10 }}
            axisLine={false}
            label={{
              value: yLabel,
              offset: -5,
              position: "left",
              angle: -90,
              fill: "#000000",
              dy: -50,
            }}
          />

          {CustomXAxis(filteredBounds, colors, type, isZoomed)}

          {ChartLines(chartData, idsToHide, colors, type)}

          {showTooltip && (
            <Tooltip
              content={<IsokineticTooltip type={type} />}
              position={{
                y: 5,
                x: 50,
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IsokineticChart;
