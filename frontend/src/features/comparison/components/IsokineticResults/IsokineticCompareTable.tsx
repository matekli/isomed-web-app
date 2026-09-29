/*
 * Název souboru:    IsokineticCompareTable.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení porovnávací tabulky isokinetických výsledků dvou vyšetření.
 */

import {
  IsokineticResults,
  IsokineticResultsByExamination,
} from "features/comparison/types/types";
import { formatPercentage } from "utils/formatting";
import {
  findExaminationById,
  findTableDataById,
} from "features/comparison/utils/comparison";
import { findColorsById } from "utils/colors";
import IsokineticTableRow from "./IsokineticTableRow";
import { safeDivide } from "utils/math";
import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";

interface IsokineticCompareTableProps {
  tableData: IsokineticResultsByExamination[];
  hoveredRow: number | null;
  setHoveredRow: React.Dispatch<React.SetStateAction<number | null>>;
}

const IsokineticCompareTable = ({
  tableData,
  hoveredRow,
  setHoveredRow,
}: IsokineticCompareTableProps) => {
  const { examinations, colors, compareIds } = useCurrentComparisonStore();

  const examination1 = findExaminationById(
    examinations,
    compareIds[0]?.id,
    compareIds[0]?.set,
  );
  const examination2 = findExaminationById(
    examinations,
    compareIds[1]?.id,
    compareIds[1]?.set,
  );

  const tableData1 = findTableDataById(
    tableData,
    compareIds[0]?.id,
    compareIds[0]?.set,
  );
  const tableData2 = findTableDataById(
    tableData,
    compareIds[1]?.id,
    compareIds[1]?.set,
  );

  const examination1Color = findColorsById(
    colors,
    compareIds[0]?.id,
    compareIds[0]?.set,
  );
  const examination2Color = findColorsById(
    colors,
    compareIds[1]?.id,
    compareIds[1]?.set,
  );

  const hasData =
    tableData &&
    compareIds.length === 2 &&
    examination1 &&
    examination2 &&
    tableData1 &&
    tableData2 &&
    examination1Color &&
    examination2Color;

  return (
    <div>
      <div className="grid grid-cols-3 px-1 text-background">
        <div className="font-semibold" style={{ color: "#FFFFFF" }}>
          M1
        </div>
        <div className="text-center font-semibold" style={{ color: "#FFFFFF" }}>
          M2
        </div>
        <div className="flex gap-x-1 text-right font-semibold">
          <p>M1</p>
          <p>/</p>
          <p>M2</p>
        </div>

        <div className="col-span-3 flex justify-center gap-x-2 px-1">
          <div>Comparison</div>
          <div className="flex gap-x-1 text-right font-semibold">
            <p
              style={{
                color: hasData ? examination1Color.mainColor : "#FFFFFF",
              }}
            >
              {hasData ? ` T${examination1.index}` : `--`}
            </p>
            <p>/</p>
            <p
              style={{
                color: hasData ? examination2Color.mainColor : "#FFFFFF",
              }}
            >
              {hasData ? `T${examination2.index}` : `--`}
            </p>
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="col-span-3 flex h-full w-full items-center justify-center text-xl font-semibold text-white">
          No Data
        </div>
      ) : (
        <div className="grid grid-cols-1 text-white">
          {Object.entries(tableData[0].data).map(([key], index) => {
            const table1row = tableData1[key as keyof IsokineticResults];
            const table2row = tableData2[key as keyof IsokineticResults];
            if (key === "mSecMaxTorque") {
              return null;
            }
            return (
              <IsokineticTableRow
                key={key}
                M1={formatPercentage(table1row.M1, table2row.M1)}
                M2={formatPercentage(table1row.M2, table2row.M2)}
                M1toM2={formatPercentage(
                  safeDivide(table1row.M1, table1row.M2),
                  safeDivide(table2row.M1, table2row.M2),
                )}
                color="#595959"
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`bg-[#595959] text-background ${hoveredRow === index ? "scale-105 duration-300" : ""}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IsokineticCompareTable;
