/*
 * Název souboru:    IsokineticTooltip.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení interaktivního tooltipu v grafu pro
 *                   isokinetické vyšetření.
 */

import { evaluatePlane } from "features/comparison/utils/comparison";
import { ExaminationWithPatient } from "features/examination/types/types";
import React from "react";
import { TooltipProps } from "recharts";
import { MeasurementPhase } from "types/types";
import { getDefaultColors } from "utils/colors";

type IsokineticTooltipProps = {
  examination: ExaminationWithPatient;
};
const IsokineticTooltip: React.FC<
  TooltipProps<number, number> & IsokineticTooltipProps
> = ({ active, payload, examination }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const { relative_position, speed, current_repetition } = payload[0].payload;

  const name = payload[0].name?.toString();
  if (!name) {
    return null;
  }
  const label = evaluatePlane(examination, name as MeasurementPhase);

  const color = getDefaultColors(examination);

  const repetition =
    name === "M1" ? Math.round(current_repetition / 2) : current_repetition / 2;

  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-1 border-2 bg-slate-200 bg-opacity-70 p-2">
      <div
        className="col-span-2 text-lg font-semibold"
        style={{ color: name === "M1" ? color.M1Color : color.M2Color }}
      >
        {label.M1Label}
      </div>
      <div className="flex gap-x-1">
        <p>Degree:</p>
        <p className="font-semibold">{Math.round(relative_position / 10)}</p>
      </div>
      <div className="flex gap-x-1">
        <p>Torque:</p>
        <p className="font-semibold">{Math.round(payload[0].value ?? 0)}</p>
      </div>
      <div className="flex gap-x-1">
        <p>Repetition:</p>
        <p className="font-semibold">{`${Math.round(repetition)}`}</p>
      </div>
      <div className="flex gap-x-1">
        <p>Speed:</p>
        <p className="font-semibold">{Math.round(speed / 10)}</p>
      </div>
      <div className="flex gap-x-1">
        <p>Set:</p>
        <p className="font-semibold">{payload[0].payload.current_set}</p>
      </div>
      <div className="flex gap-x-1">
        <p>Time:</p>
        <p className="font-semibold">{payload[0].payload.time}</p>
      </div>
    </div>
  );
};

export default IsokineticTooltip;
