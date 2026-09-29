/*
 * Název souboru:    RowDescription.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení popisku řádků pro tabulky s výsledky
 */

import {
  athleticResultsHeaders,
  isokineticResultsHeaders,
  isometricResultsHeaders,
} from "constants/constants";
import { TestType } from "../types/types";
import { formatValue } from "utils/formatting";

interface RowDescriptionsProps {
  hoveredRow: number | null;
  setHoveredRow: React.Dispatch<React.SetStateAction<number | null>>;
  type: TestType;
  offset: number | null;
}
const RowDescriptions = ({
  hoveredRow,
  setHoveredRow,
  type,
  offset,
}: RowDescriptionsProps) => {
  const headers =
    type === "isometric"
      ? isometricResultsHeaders
      : type === "athletic"
        ? athleticResultsHeaders
        : isokineticResultsHeaders;

  const unit = type === "isometric" ? "ms" : type === "athletic" ? "cm" : "°";

  return (
    <div className="grid h-full w-max grid-cols-1 grid-rows-[2fr_10fr] overflow-hidden whitespace-nowrap text-white">
      <div className="row-span-2 flex items-center justify-center text-lg">
        Comparison
      </div>

      {Object.entries(headers).map(([key, label], index) => {
        if (key === "mSecMaxTorque") {
          return null;
        }
        return (
          <div
            key={key}
            className={`mb-1 rounded-lg bg-[#595959] px-2 ${index === hoveredRow ? "scale-105 duration-300" : ""}`}
            onMouseEnter={() => setHoveredRow(index)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            {key === "torqueAtOff"
              ? `${label}  ${formatValue(offset)} ${unit}`
              : label}
          </div>
        );
      })}
    </div>
  );
};

export default RowDescriptions;
