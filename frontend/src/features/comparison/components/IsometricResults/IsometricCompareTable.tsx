/*
 * Název souboru:    IsometricCompareTable.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení porovnávací tabulky isometrických výsledků dvou vyšetření.
 */

import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";
import {
  IsometricResultsByExamination,
  IsometricResults,
} from "features/comparison/types/types";
import { findExaminationById } from "features/comparison/utils/comparison";
import React from "react";
import { findColorsById } from "utils/colors";
import { formatPercentage } from "utils/formatting";
interface IsometricCompareTableProps {
  tableData: IsometricResultsByExamination[];
  hoveredRow: number | null;
  setHoveredRow: React.Dispatch<React.SetStateAction<number | null>>;
}
const IsometricCompareTable = ({
  tableData,
  hoveredRow,
  setHoveredRow,
}: IsometricCompareTableProps) => {
  const { examinations, colors, compareIds } = useCurrentComparisonStore();

  const examination1 = findExaminationById(examinations, compareIds[0]?.id);
  const examination2 = findExaminationById(examinations, compareIds[1]?.id);

  const tableData1 = tableData?.find(
    (t) => t.examination_id === compareIds[0]?.id,
  )?.data;
  const tableData2 = tableData?.find(
    (t) => t.examination_id === compareIds[1]?.id,
  )?.data;

  const examination1Color = findColorsById(colors, compareIds[0]?.id);
  const examination2Color = findColorsById(colors, compareIds[1]?.id);

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
      <div className="grid w-full grid-cols-3 px-1 text-background">
        <div className="col-span-3 flex justify-center gap-x-2 px-1 text-lg">
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
      {hasData && (
        <div className="grid grid-cols-1 text-white">
          {Object.entries(tableData[0].data).map(([key], index) => {
            const table1row = hasData
              ? tableData1[key as keyof IsometricResults]
              : null;
            const table2row = hasData
              ? tableData2[key as keyof IsometricResults]
              : null;

            return (
              <div
                key={key}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`bg-[#595959] text-background ${hoveredRow === index ? "scale-105 duration-300" : ""} mb-1 rounded-lg px-1`}
              >
                {formatPercentage(Number(table1row), Number(table2row))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IsometricCompareTable;
