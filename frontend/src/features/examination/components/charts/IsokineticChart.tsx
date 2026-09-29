/*
 * Název souboru:    IsokineticChart.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta interaktivního grafu pro vyšetření.
 */

import { useMemo, useRef } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ComposedChart,
  ResponsiveContainer,
} from "recharts";
import { AreaChartData, ChartData } from "types/types";
import { twMerge } from "tailwind-merge";
import { CategoricalChartState } from "recharts/types/chart/types";
import useChartInteractions from "hooks/useChartInteractions";
import { ExaminationWithPatient } from "features/examination/types/types";
import IsokineticTooltip from "./IsokineticTooltip";
import { useChartContext } from "contexts/ChartContext";
import { getDefaultColors } from "utils/colors";
import AthleticTooltip from "./AthleticTooltip";
import { isIsokinetic, isAthletic } from "utils/utils";
import {
  getAreaData,
  getXTicks,
  getYTicks,
} from "features/examination/utils/isokinetic";

interface IsokineticChartProps {
  examination: ExaminationWithPatient;
  chartData: ChartData[];
  area?: AreaChartData;
  onMouseDown?: (event: CategoricalChartState) => void;
  onMouseUp?: (event: CategoricalChartState) => void;
  classname?: string;
}

const IsokineticChart = ({
  examination,
  chartData,
  area,
  onMouseDown,
  onMouseUp,
  classname,
}: IsokineticChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const { showTooltip, hideSide } = useChartContext();
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

  const xTicks = useMemo(() => getXTicks(chartData), [chartData]);
  const yTicks = useMemo(() => getYTicks(chartData), [chartData]);

  const xLabel = isIsokinetic(examination)
    ? "Position in degree"
    : "Position in centimeters";

  const yLabel = isIsokinetic(examination) ? "Torque ( N*m )" : "Force ( N )";

  const slicedChartData = useMemo(() => {
    return chartData.slice(chartStart, chartEnd);
  }, [chartData, chartStart, chartEnd]);

  if (!chartData || chartData.length === 0) {
    return <div className="m-auto flex">No data</div>;
  }
  return (
    <div
      className={twMerge(
        "chart-container h-full w-full select-none",
        classname,
      )}
      ref={chartContainerRef}
      onMouseDown={handleStartDragging}
      onMouseMove={handleDragging}
      onMouseUp={handleStopDragging}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={slicedChartData}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          margin={{ right: 5, left: 5, bottom: 17 }}
        >
          <CartesianGrid />

          <XAxis
            dataKey={"time"}
            ticks={xTicks}
            interval={0}
            padding={{ left: 10, right: 10 }}
            tickFormatter={(value) => {
              const tickData = chartData.find((entry) => entry.time === value);
              return tickData
                ? Math.round(tickData.relative_position / 10)
                : value;
            }}
            dx={-3}
            dy={5}
            label={{
              value: xLabel,
              position: "bottom",
              fill: "#000000",
              offset: 0,
            }}
          />
          <XAxis
            xAxisId="hidden"
            dataKey="time"
            hide
            padding={{ left: 10, right: 10 }}
            domain={[chartStart, chartEnd]}
            dx={-3}
          />

          <YAxis
            type="number"
            ticks={yTicks}
            interval={0}
            padding={{ top: 10 }}
            axisLine={false}
            label={{
              value: yLabel,
              offset: -10,
              position: "left",
              angle: -90,
              fill: "#000000",
              dy: -50,
            }}
          />

          {!hideSide.main && (
            <>
              <Line
                dataKey="M1"
                isAnimationActive={false}
                dot={false}
                stroke={getDefaultColors(examination).M1Color}
                strokeWidth={1.3}
              />

              <Line
                dataKey="M2"
                isAnimationActive={false}
                dot={false}
                stroke={getDefaultColors(examination).M2Color}
                strokeWidth={1.3}
              />
            </>
          )}

          {isAthletic(examination) && (
            <>
              {!hideSide.left && (
                <>
                  <Line
                    dataKey="M1_left"
                    isAnimationActive={false}
                    dot={false}
                    stroke={getDefaultColors(examination).M1ColorLeft}
                    strokeWidth={1.3}
                  />
                  <Line
                    dataKey="M2_left"
                    isAnimationActive={false}
                    dot={false}
                    stroke={getDefaultColors(examination).M2ColorLeft}
                    strokeWidth={1.3}
                  />
                </>
              )}

              {!hideSide.right && (
                <>
                  <Line
                    dataKey="M1_right"
                    isAnimationActive={false}
                    dot={false}
                    stroke={getDefaultColors(examination).M1ColorRight}
                    strokeWidth={1.3}
                  />
                  <Line
                    dataKey="M2_right"
                    isAnimationActive={false}
                    dot={false}
                    stroke={getDefaultColors(examination).M2ColorRight}
                    strokeWidth={1.3}
                  />
                </>
              )}
            </>
          )}

          {area && !hideSide.main && (
            <>
              <Area
                data={getAreaData(chartData, chartStart, chartEnd, area, "M1")}
                xAxisId="hidden"
                type="monotone"
                dataKey="M1"
                stroke="none"
                fill="rgba(136, 132, 216, 0.2)"
                activeDot={false}
                isAnimationActive={false}
              />
              <Area
                data={getAreaData(chartData, chartStart, chartEnd, area, "M2")}
                type="monotone"
                dataKey="M2"
                stroke="none"
                fill="rgba(235, 93, 84, 0.2)"
                activeDot={false}
                isAnimationActive={false}
              />
            </>
          )}

          {showTooltip && (
            <Tooltip
              content={
                isAthletic(examination) ? (
                  <AthleticTooltip examination={examination} />
                ) : (
                  <IsokineticTooltip examination={examination} />
                )
              }
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IsokineticChart;
