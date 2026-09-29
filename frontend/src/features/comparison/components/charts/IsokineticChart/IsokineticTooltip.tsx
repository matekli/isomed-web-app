/*
 * Název souboru:    IsokineticTooltip.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení interaktivního tooltipu v grafu pro
 *                   porovnání vyšetření.
 */

import React from "react";
import { TooltipProps } from "recharts";
import { evaluatePlane } from "features/comparison/utils/comparison";
import { Payload } from "recharts/types/component/DefaultTooltipContent";
import { MeasurementPhase } from "types/types";
import { evaluatePlaneColor } from "utils/colors";
import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";

type IsokineticTooltipProps = {
  type: MeasurementPhase;
};

const IsokineticTooltip: React.FC<
  TooltipProps<number, number> & IsokineticTooltipProps
> = ({ active, payload, type }) => {
  const { examinations, colors, type: examType } = useCurrentComparisonStore();

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const getMatchingIds = (payload: Payload<number, number>[]) => {
    const idSet = new Set<string>();
    const outSet = new Set<string>();
    const matchingIds = new Set<string>();

    // Projdeme payload a zjistíme, která ID mají odpovídající "_out"
    payload.forEach((item) => {
      const id = item.name?.toString().endsWith("_out")
        ? item.name.toString().slice(0, -4)
        : item.name;

      // Pokud id je string nebo number (a není undefined), přidáme do Set
      if (id !== undefined) {
        const idStr = String(id); // Přetypujeme id na string (pokud je number)
        if (item.name?.toString().endsWith("_out")) {
          outSet.add(idStr); // Přidáme id bez "_out" do outSet
        } else {
          idSet.add(idStr); // Přidáme id do idSet
        }
      }
    });

    // Zjistíme, která ID mají odpovídající "_out"
    idSet.forEach((id) => {
      if (outSet.has(id)) {
        matchingIds.add(id); // Pokud máme odpovídající "_out", přidáme id do matchingIds
      }
    });

    return Array.from(matchingIds); // Vrátí seznam matching ID
  };

  return (
    <div className="grid max-h-32 grid-cols-2 gap-1 overflow-hidden border-2 bg-slate-200 bg-opacity-70 p-2 text-sm">
      <div className="col-span-2 flex gap-x-1">
        <p>{examType === "athletic" ? "Centimeters" : "Degree:"}</p>
        <p className="font-semibold">
          {Math.round(payload[0].payload.relative_position / 10)}
        </p>
      </div>

      {payload.map((item, index) => {
        const name = item.name?.toString();
        if (!name) return null;

        const cleanedName = name.endsWith("_out") ? name.slice(0, -4) : name;
        const [idPart, setPart] = cleanedName.split("_");

        const id = idPart;
        const set = Number(setPart);

        const examination = examinations.find(
          (e) => e.data.id === id && e.set === set,
        );

        if (!examination) return null;

        const matchingIds = getMatchingIds(payload);

        const color = evaluatePlaneColor(colors, examination.data, type, set);
        const label = evaluatePlane(examination.data, type);
        const torque =
          item.payload[`${id}_${set}`] || item.payload[`${id}_${set}_out`];

        if (
          matchingIds.includes(`${examination.data.id}_${examination.set}`) &&
          name === `${id}_${set}_out`
        ) {
          return null;
        }

        return (
          <div key={`${examination.data.id}_${examination.set}_${index}`}>
            <p className="font-semibold" style={{ color: color.planeColor }}>
              {`T${examination.index} (${label.M1Label})`}
            </p>
            <div className="flex gap-x-1">
              <p>{examType === "athletic" ? "Force:" : "Torque:"}</p>
              <p className="font-semibold">{torque}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IsokineticTooltip;
