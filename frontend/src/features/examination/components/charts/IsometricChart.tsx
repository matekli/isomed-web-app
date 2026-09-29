/*
 * Název souboru:    IsometricChart.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta interaktivního grafu pro isometrické vyšetření.
 */

import { useRef } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  ResponsiveContainer,
} from "recharts";
import { IsometricChartData } from "types/types";
import useChartInteractions from "hooks/useChartInteractions";
import { ExaminationWithPatient } from "features/examination/types/types";
import IsometricTooltip from "./IsometricTooltip";
import { useChartContext } from "contexts/ChartContext";
import { getDefaultColors } from "utils/colors";
import { getXTicksIsometric } from "features/examination/utils/isometric";

interface IsometricChartProps {
  examination: ExaminationWithPatient;
  chartData: IsometricChartData[];
}

const IsometricChart = ({ examination, chartData }: IsometricChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  const { showTooltip } = useChartContext();

  const {
    chartStart,
    chartEnd,
    handleStartDragging,
    handleDragging,
    handleStopDragging,
  } = useChartInteractions({
    chartDataLength: chartData.length,
    chartContainerRef: chartContainerRef,
  });

  const ticks = getXTicksIsometric(chartData);

  if (!chartData || chartData.length === 0) {
    return <div className="m-auto flex">No data</div>;
  }

  return (
    <div
      className="chart-container h-full w-full select-none"
      ref={chartContainerRef}
      onMouseDown={handleStartDragging}
      onMouseMove={handleDragging}
      onMouseUp={handleStopDragging}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData.slice(chartStart, chartEnd)}
          margin={{ right: 5, left: 5, bottom: 17 }}
        >
          <CartesianGrid />

          <XAxis
            dataKey={"time"}
            ticks={ticks}
            padding={{ left: 10, right: 10 }}
            tickFormatter={(value) => {
              const tickData = chartData.find((entry) => entry.time === value);
              return tickData
                ? Math.round((tickData.time - ticks[0]) / 1000)
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

          <YAxis
            type="number"
            interval={0}
            padding={{ top: 10 }}
            axisLine={false}
            tickFormatter={(value) => {
              return Math.round(value / 10).toString();
            }}
            label={{
              value: "Torque ( N*m )",
              offset: -10,
              position: "left",
              angle: -90,
              fill: "#000000",
              dy: -50,
            }}
          />

          <Line
            dataKey="torque"
            isAnimationActive={false}
            dot={false}
            stroke={getDefaultColors(examination).M1Color}
            strokeWidth={1.3}
          />

          {showTooltip && (
            <Tooltip
              content={
                <IsometricTooltip
                  examination={examination}
                  holdAngle={chartData[0].angle}
                  startTime={chartData[0].time}
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
