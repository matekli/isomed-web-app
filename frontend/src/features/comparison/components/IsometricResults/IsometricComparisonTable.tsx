/*
 * Název souboru:    IsokineticComparisonTable.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení výsledků jednoho isometrického vyšetření.
 */

import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";
import { IsometricResults } from "features/comparison/types/types";
import { evaluatePlane } from "features/comparison/utils/comparison";
import { ExaminationWithPatient } from "features/examination/types/types";
import { evaluatePlaneColor } from "utils/colors";
import { formatValue } from "utils/formatting";

type IsometricComparisonTableProps = {
  data: IsometricResults;
  examination: ExaminationWithPatient | undefined;
  hoveredRow: number | null;
  setHoveredRow: React.Dispatch<React.SetStateAction<number | null>>;
};
const IsometricComparisonTable = ({
  data,
  examination,
  hoveredRow,
  setHoveredRow,
}: IsometricComparisonTableProps) => {
  const { colors } = useCurrentComparisonStore();
  if (!examination || !data) return null;

  const label = evaluatePlane(examination);

  const color = evaluatePlaneColor(colors, examination);

  return (
    <div className="grid w-full max-w-[100px] grid-cols-1 grid-rows-[2fr_11fr] px-1 text-background">
      <div
        className="row-span-2 flex items-center justify-center whitespace-nowrap text-left text-lg font-semibold"
        style={{ color: color.planeColor }}
      >
        {label.M1Label}
      </div>

      {Object.entries(data).map(([key, row], index) => {
        return (
          <div
            key={key}
            style={{ background: color.mainColor }}
            onMouseEnter={() => setHoveredRow(index)}
            onMouseLeave={() => setHoveredRow(null)}
            className={`${hoveredRow === index ? "scale-105 duration-300" : ""} mb-1 min-w-[75px] rounded-lg px-1 text-black`}
          >
            {formatValue(row)}
          </div>
        );
      })}
    </div>
  );
};

export default IsometricComparisonTable;
