/*
 * Název souboru:    IsometricPeakChart.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro vykreslení grafu isometrických maximálních hodnot
 *                   napříc jednotlivými sety.
 */

import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  LineChart,
} from "recharts";
import {
  getXTicksIsometricPeak,
  mergeIsometricPeakData,
} from "../../utils/isometricChart";
import { evaluatePlaneColor } from "utils/colors";
import { useCompChartContext } from "contexts/CompChartContext";
import IsometricTooltip from "./IsometricTooltip";
import { IsometricResultsByExamination } from "features/comparison/types/types";
import { isHidden } from "features/comparison/utils/comparison";
import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";

type IsometricPeakChartProps = {
  data: IsometricResultsByExamination[][];
  index: number;
  yTicks: number[];
};
const IsometricPeakChart = ({
  data,
  index,
  yTicks,
}: IsometricPeakChartProps) => {
  const { idsToHide, showTooltip } = useCompChartContext();

  const { colors, examinations, isometricSets } = useCurrentComparisonStore();

  const merged = mergeIsometricPeakData(examinations, data.flat());

  const selectedAngles = data[index]?.map((d) => d.holdAngle);
  const xTicks = getXTicksIsometricPeak(isometricSets, idsToHide);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={merged} margin={{ right: 5, left: 5, bottom: 17 }}>
        <CartesianGrid />

        <XAxis
          dataKey="angle"
          interval={0}
          ticks={xTicks}
          padding={{ right: 10, left: 10 }}
          dx={-3}
          dy={5}
          label={{
            value: "Hold angle (°)",
            position: "bottom",
            fill: "#000000",
            offset: 0,
          }}
        />

        <YAxis
          type="number"
          interval={0}
          padding={{ top: 25 }}
          axisLine={false}
          ticks={yTicks}
          tickFormatter={(value) => {
            return Math.round(value).toString();
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

        {examinations.map((examination) => {
          const { id } = examination.data;

          if (isHidden(idsToHide, examination.data.id, examination.set)) {
            return null;
          }

          const color = evaluatePlaneColor(colors, examination.data);

          return (
            <Line
              key={`${id}`}
              dataKey={`${id}`}
              isAnimationActive={false}
              stroke={color.planeColor}
              connectNulls
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (payload[id] === null)
                  return <g key={`dot-${id}-${payload.angle}`} />;

                return (
                  <CustomDot
                    key={`dot-${id}-${payload.angle}`}
                    cx={cx}
                    cy={cy}
                    color={color.planeColor}
                    selected={selectedAngles.includes(payload.angle)}
                  />
                );
              }}
              strokeWidth={1.3}
            />
          );
        })}

        {showTooltip && (
          <Tooltip
            content={<IsometricTooltip examination={examinations[0].data} />}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default IsometricPeakChart;

type CustomDotProps = {
  cx: number;
  cy: number;
  color: string;
  selected: boolean;
};

const CustomDot = ({ cx, cy, color, selected }: CustomDotProps) => (
  <circle
    cx={cx}
    cy={cy}
    r={3}
    fill={selected ? color : "white"}
    stroke={color}
    strokeWidth={2}
  />
);
