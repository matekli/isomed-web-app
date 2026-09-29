/*
 * Název souboru:    IsometricTooltip.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení interaktivního tooltipu v grafu pro
 *                   porovnání izometrických vyšetření.
 */

import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";
import { evaluatePlane } from "features/comparison/utils/comparison";
import { ExaminationWithPatient } from "features/examination/types/types";
import React from "react";
import { TooltipProps } from "recharts";
import { evaluatePlaneColor } from "utils/colors";

type IsometricTooltipProps = {
  examination: ExaminationWithPatient;
  holdAngle?: number;
};
const IsometricTooltip: React.FC<
  TooltipProps<number, number> & IsometricTooltipProps
> = ({ active, payload, holdAngle }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const { examinations, colors } = useCurrentComparisonStore();

  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-1 border-2 bg-slate-200 bg-opacity-70 p-2 text-sm">
      <div className="col-span-2 font-semibold">
        {`Hold angle: ${holdAngle ? holdAngle : payload[0].payload.angle}`}
      </div>
      {payload[0].payload.time !== undefined && (
        <div className="col-span-2 font-semibold">
          {`Time: ${(payload[0].payload.time / 1000).toFixed(1)}`}
        </div>
      )}
      {payload.map((item) => {
        const datakey = item.dataKey;
        const examination = examinations.find((e) => e.data.id === datakey);
        if (!examination) {
          return null;
        }

        const plane = evaluatePlane(examination.data);
        const color = evaluatePlaneColor(colors, examination.data);

        return (
          <div key={datakey}>
            <div
              className="font-semibold"
              style={{ color: color.planeColor }}
            >{`T${examination.index} (${plane.M1Label})`}</div>
            <div className="flex gap-x-1">
              <p>Torque:</p>
              <p className="font-semibold">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IsometricTooltip;
