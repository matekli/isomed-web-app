/*
 * Název souboru:    IsokineticComparisonTable.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení výsledků jednoho isokinetického vyšetření.
 */

import {
  IndexedExamination,
  IsokineticResults,
} from "features/comparison/types/types";
import ComparisonTableRow from "./IsokineticTableRow";
import { formatPercentage, formatValue } from "utils/formatting";
import { evaluatePlane } from "features/comparison/utils/comparison";
import { findColorsById } from "utils/colors";
import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";

type IsokineticComparisonTableProps = {
  data: IsokineticResults;
  examination: IndexedExamination | undefined;
  hoveredRow: number | null;
  setHoveredRow: React.Dispatch<React.SetStateAction<number | null>>;
};

const IsokineticComparisonTable = ({
  data,
  examination,
  hoveredRow,
  setHoveredRow,
}: IsokineticComparisonTableProps) => {
  const { colors } = useCurrentComparisonStore();
  if (!examination || !data) return null;

  const label = evaluatePlane(examination.data);

  const { M1Color, M2Color, mainColor } = findColorsById(
    colors,
    examination.data.id,
    examination.set,
  );

  return (
    <div className="px-2">
      <div className="grid grid-cols-3 px-1 text-background">
        <div
          className="whitespace-nowrap text-left font-semibold"
          style={{ color: M1Color }}
        >
          {label.M1Label}
        </div>
        <div
          className="whitespace-nowrap text-center font-semibold"
          style={{ color: M2Color }}
        >
          {label.M2Label}
        </div>
        <div className="flex gap-x-1 whitespace-nowrap text-right font-semibold">
          <p style={{ color: M1Color }}>M1</p>
          <p>/</p>
          <p style={{ color: M2Color }}>M2</p>
        </div>
        <div className="col-span-3 flex justify-center whitespace-nowrap">
          {`Selected reps T${examination.index}`}
        </div>
      </div>

      <div className="grid grid-cols-1 text-background">
        {Object.entries(data).map(([key, row], index) => {
          if (key === "mSecMaxTorque") {
            return null;
          }
          return (
            <ComparisonTableRow
              key={key}
              M1={formatValue(row.M1)}
              M2={formatValue(row.M2)}
              M1toM2={formatPercentage(row.M1, row.M2)}
              color={mainColor}
              onMouseEnter={() => setHoveredRow(index)}
              onMouseLeave={() => setHoveredRow(null)}
              className={`${hoveredRow === index ? "scale-105 duration-300" : ""}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default IsokineticComparisonTable;
