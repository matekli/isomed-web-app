/*
 * Název souboru:    IsokineticResultsTable.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení výsledků.
 */

import { formatValue, formatPercentage } from "utils/formatting";

import ExaminationTableRow from "./IsokineticTableRow";
import {
  ExaminationWithPatient,
  IsokineticResultsData,
} from "features/examination/types/types";
import { evaluatePlane } from "features/comparison/utils/comparison";

interface IsokineticResultsTableProps {
  tableData: IsokineticResultsData;
  examination: ExaminationWithPatient;
}
const IsokineticResultsTable = ({
  tableData,
  examination,
}: IsokineticResultsTableProps) => {
  const label = evaluatePlane(examination);

  return (
    <div className="px-1">
      <div className="grid grid-cols-3">
        <div className="mb-1 whitespace-nowrap text-left font-semibold text-[#1e03ff]">
          {label.M1Label}
        </div>
        <div className="mb-1 whitespace-nowrap text-center font-semibold text-[#ff0303]">
          {label.M2Label}
        </div>
        <div className="mb-1 flex justify-end gap-x-0.5 whitespace-nowrap font-semibold">
          <p className="text-[#1e03ff]">M1</p>
          <p className="text-white">/</p>
          <p className="text-[#ff0303]">M2</p>
        </div>
        <div className="col-span-3 mb-1 text-center text-white">
          {tableData.repetition}
        </div>
      </div>

      <div className="grid grid-cols-1">
        {Object.entries(tableData.data).map(([key, row]) => (
          <ExaminationTableRow
            key={key}
            M1={formatValue(row.M1)}
            M2={formatValue(row.M2)}
            M1toM2={formatPercentage(row.M1, row.M2)}
          />
        ))}
      </div>
    </div>
  );
};

export default IsokineticResultsTable;
