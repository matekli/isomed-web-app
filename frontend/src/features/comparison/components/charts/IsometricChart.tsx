/*
 * Název souboru:    IsometricChart.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro vykreslení isometrického grafu pro porovnání vyšetření.
 */

import {
  ResponsiveContainer,
  CartesianGrid,
  YAxis,
  LineChart,
  Line,
  XAxis,
  Tooltip,
} from "recharts";

import useChartInteractions from "hooks/useChartInteractions";
import { useRef } from "react";
import { IsometricResultsByExamination } from "features/comparison/types/types";
import {
  getXTicksIsometric,
  mergeIsometricData,
} from "features/comparison/utils/isometricChart";
import { evaluatePlaneColor } from "utils/colors";
import { useCompChartContext } from "contexts/CompChartContext";
import IsometricTooltip from "./IsometricTooltip";
import { isHidden } from "features/comparison/utils/comparison";
import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";

type IsometricChartProps = {
  currentData: IsometricResultsByExamination[];
  yTicks: number[];
};
const IsometricChart = ({ currentData, yTicks }: IsometricChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const { examinations, isometricSets, colors } = useCurrentComparisonStore();

  const { showTooltip, idsToHide } = useCompChartContext();

  const mergedData = mergeIsometricData(
    examinations,
    isometricSets,
    currentData,
  );
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

  const xTicks = getXTicksIsometric(mergedData);

  return (
    <div
      className="chart-container w-full flex-grow select-none"
      ref={chartContainerRef}
      onMouseDown={handleStartDragging}
      onMouseMove={handleDragging}
      onMouseUp={handleStopDragging}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={mergedData.slice(chartStart, chartEnd)}
          margin={{ right: 5, left: 5, bottom: 17 }}
        >
          <CartesianGrid />
          <YAxis
            type="number"
            interval={0}
            ticks={yTicks}
            padding={{ top: 25 }}
            axisLine={false}
            label={{
              value: "Torque ( N*m )",
              offset: -10,
              position: "left",
              angle: -90,
              fill: "#000000",
              dy: -50,
            }}
          />

          <XAxis
            dataKey={"time"}
            ticks={xTicks}
            padding={{ left: 10, right: 10 }}
            tickFormatter={(value) => {
              const tickData = mergedData.find((entry) => entry.time === value);
              return tickData
                ? Math.round((Number(tickData.time) - xTicks[0]) / 1000)
                : value;
            }}
            dx={-3}
            dy={5}
            label={{
              value: "Time in seconds",
              position: "bottom",
              fill: "#000000",
              offset: 0,
            }}
          />
          {examinations.map((examination) => {
            if (isHidden(idsToHide, examination.data.id, examination.set)) {
              return null;
            }
            const color = evaluatePlaneColor(colors, examination.data);
            return (
              <Line
                key={`${examination.data.id}`}
                type="monotone"
                dataKey={`${examination.data.id}`}
                stroke={color.planeColor}
                dot={false}
                strokeWidth={1.3}
                isAnimationActive={false}
                connectNulls
              />
            );
          })}

          {showTooltip && (
            <Tooltip
              content={
                <IsometricTooltip
                  examination={examinations[0].data}
                  holdAngle={currentData[0].holdAngle!}
                />
              }
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IsometricChart;
