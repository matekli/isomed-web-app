/*
 * Název souboru:    IsometricTooltip.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení interaktivního tooltipu v grafu pro izometrické vyšetření.
 */

import { ExaminationWithPatient } from "features/examination/types/types";
import React from "react";
import { TooltipProps } from "recharts";
import { getDefaultColors } from "utils/colors";
import { getPlaneLabels } from "utils/converting";
import { divideBy10AndRound } from "utils/math";

type IsometricTooltipProps = {
  examination: ExaminationWithPatient;
  holdAngle?: number;
  startTime?: number;
};
const IsometricTooltip: React.FC<
  TooltipProps<number, number> & IsometricTooltipProps
> = ({ active, payload, examination, holdAngle, startTime }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const label = getPlaneLabels(examination.test_mode, examination.plane)[0];

  const color = getDefaultColors(examination);

  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-1 border-2 bg-slate-200 bg-opacity-70 p-2">
      <div
        className="col-span-2 text-lg font-semibold"
        style={{ color: color.M1Color }}
      >
        {label}
      </div>
      <div className="flex gap-x-1">
        <p>Hold angle:</p>
        <p className="font-semibold">
          {holdAngle ? Math.round(holdAngle / 10) : payload[0].payload.angle}
        </p>
      </div>
      <div className="flex gap-x-1">
        <p>Torque:</p>
        <p className="font-semibold">{divideBy10AndRound(payload[0].value)}</p>
      </div>

      {startTime && (
        <div className="flex gap-x-1">
          <p>Time:</p>
          <p className="font-semibold">
            {((payload[0].payload.time - startTime) / 1000).toFixed(1)}
          </p>
        </div>
      )}
    </div>
  );
};

export default IsometricTooltip;
