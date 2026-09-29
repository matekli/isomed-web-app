/*
 * Název souboru:    AthleticTooltip.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení interaktivního tooltipu v grafu pro
 *                   legpress vyšetření.
 */

import { evaluatePlane } from "features/comparison/utils/comparison";
import { ExaminationWithPatient } from "features/examination/types/types";
import React from "react";
import { TooltipProps } from "recharts";
import { MeasurementPhase } from "types/types";
import {
  DEFAULT_COLOR_M1_LEFT,
  DEFAULT_COLOR_M1_RIGHT,
  DEFAULT_COLOR_M2_LEFT,
  DEFAULT_COLOR_M2_RIGHT,
  getDefaultColors,
} from "utils/colors";
import { formatValue } from "utils/formatting";

type AthleticTooltipProps = {
  examination: ExaminationWithPatient;
};
const AthleticTooltip: React.FC<
  TooltipProps<number, number> & AthleticTooltipProps
> = ({ active, payload, examination }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const { relative_position, current_repetition } = payload[0].payload;

  const name = payload[0].name?.toString();
  if (!name) {
    return null;
  }
  const label = evaluatePlane(examination, name as MeasurementPhase);

  const color = getDefaultColors(examination);

  const validDatakeys = ["M1_left", "M2_left", "M1_right", "M2_right"];

  const totalForce = payload.find(
    (p) => p.dataKey === "M2" || p.dataKey === "M1",
  );

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-1 border-2 bg-slate-200 bg-opacity-70 p-2">
      <div
        className="col-span-2 text-lg font-semibold"
        style={{ color: name === "M1" ? color.M1Color : color.M2Color }}
      >
        {label.M1Label}
      </div>
      <div className="col-span-2 flex gap-x-1">
        <p>Centimeters:</p>
        <p className="font-semibold">{Math.round(relative_position / 10)}</p>
      </div>

      <div className="col-span-2 flex gap-x-1">
        <p>Total force:</p>
        <p className="font-semibold">{`${formatValue(totalForce?.value)} (N)`}</p>
      </div>
      <div className="col-span-2">{current_repetition}</div>

      {payload.map((item) => {
        if (!validDatakeys.includes(item.dataKey?.toString() ?? "")) {
          return null;
        }
        const datakey = item.dataKey?.toString();

        if (!datakey) {
          return null;
        }

        const isLeft = datakey.includes("left");
        const isM1 = datakey.includes("M1");

        const color = isLeft
          ? isM1
            ? DEFAULT_COLOR_M1_LEFT
            : DEFAULT_COLOR_M2_LEFT
          : isM1
            ? DEFAULT_COLOR_M1_RIGHT
            : DEFAULT_COLOR_M2_RIGHT;

        const side = isLeft ? "Left" : "Right";

        return (
          <div key={datakey}>
            <div style={{ color }}>{side}</div>
            <div className="flex gap-x-1">
              <div>Force:</div>
              <div className="font-semibold">{`${item.value} (N)`}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AthleticTooltip;
