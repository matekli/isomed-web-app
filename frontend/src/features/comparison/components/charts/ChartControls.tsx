/*
 * Název souboru:    ChartControls.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení ovládacích prvků pro graf,
 *                   zahrnující legendu.
 */

import { evaluatePlane } from "features/comparison/utils/comparison";
import ChartActionDropdown from "./ChartActionDropdown";
import { evaluatePlaneColor } from "utils/colors";
import { useCompChartContext } from "contexts/CompChartContext";
import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";

type ChartControlsProps = {
  label?: string;
};

const ChartControls = ({ label }: ChartControlsProps) => {
  const { colors, examinations } = useCurrentComparisonStore();
  const { type, linesToHide } = useCompChartContext();

  return (
    <div className="flex items-center justify-between gap-x-1 rounded-t-lg border-b-2 border-primary pl-2 font-semibold">
      {label && <div className="text-sm font-semibold">{label}</div>}

      {/* Zobrazení legendy */}
      <div className="flex flex-wrap gap-x-2 px-4 text-sm">
        {examinations.map((examination) => {
          if (linesToHide.includes(examination.data.id)) {
            return null;
          }

          const color = evaluatePlaneColor(
            colors,
            examination.data,
            type,
            examination.set,
          );
          const label = evaluatePlane(examination.data, type);

          return (
            <div
              className="flex items-center whitespace-nowrap"
              key={`${examination.data.id}-${examination.set}`}
            >
              <hr
                style={{
                  backgroundColor: color.planeColor,
                  height: "3px",
                  width: "10px",
                  marginRight: "3px",
                }}
              />
              <div
                style={{ color: color.planeColor }}
                className="flex font-semibold"
              >{`T${examination.index} (${label.M1Label})`}</div>
            </div>
          );
        })}
      </div>
      <ChartActionDropdown />
    </div>
  );
};

export default ChartControls;
