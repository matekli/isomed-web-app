/*
 * Název souboru:    IsometricPeakChart.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro vykreslení grafu isometrických maximálních hodnot
 *                   napříc jednotlivými sety.
 */

import { ExaminationWithPatient } from "features/examination/types/types";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  Line,
  LineChart,
  YAxis,
  Tooltip,
} from "recharts";
import IsometricTooltip from "./IsometricTooltip";
import { useChartContext } from "contexts/ChartContext";
import { getDefaultColors } from "utils/colors";

type IsometricPeakChartProps = {
  examination: ExaminationWithPatient;
  current_set: number;
  data: { peak: number | null; angle: number | null }[];
};
const IsometricPeakChart = ({
  examination,
  current_set,
  data,
}: IsometricPeakChartProps) => {
  const { showTooltip } = useChartContext();

  const color = getDefaultColors(examination).M1Color;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ right: 5, left: 5, bottom: 17 }}>
        <CartesianGrid />

        <XAxis
          dataKey="angle"
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

        <Line
          dataKey="peak"
          isAnimationActive={false}
          stroke={color}
          dot={(props) => {
            const { cx, cy, payload } = props;
            if (payload.current_set === current_set) {
              return (
                <circle
                  key={`${current_set}-${cx}`}
                  cx={cx}
                  cy={cy}
                  r={3}
                  fill={color}
                  stroke={color}
                  strokeWidth={2}
                />
              );
            } else {
              return (
                <circle
                  key={`${current_set}-${cx}`}
                  cx={cx}
                  cy={cy}
                  r={3}
                  fill="white"
                  stroke={color}
                  strokeWidth={2}
                />
              );
            }
          }}
          activeDot
          strokeWidth={1.3}
        />

        {showTooltip && (
          <Tooltip content={<IsometricTooltip examination={examination} />} />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default IsometricPeakChart;
