/*
 * Název souboru:    IsometricResultsTable.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení výsledků isometrického vyšetření
 */

import {
  IsometricResultsData,
  ExaminationWithPatient,
} from "features/examination/types/types";
import { getDefaultColors } from "utils/colors";
import { getPlaneLabels } from "utils/converting";
import { formatValue } from "utils/formatting";
type IsometricResultsTableProps = {
  data: IsometricResultsData;
  examination: ExaminationWithPatient;
};
const IsometricResultsTable = ({
  data,
  examination,
}: IsometricResultsTableProps) => {
  const { test_mode, plane } = examination;
  const {
    holdAngle,
    maxTorque,
    maxTorqueTime,
    maxTorqueWeight,
    torqueAtOff,
    torqueoffMsWt,
    averageTorque,
  } = data.data;
  const label = getPlaneLabels(test_mode, plane);

  const color = getDefaultColors(examination);
  return (
    <div className="grid grid-cols-1 grid-rows-[2fr_repeat(7,1fr)] whitespace-nowrap px-1 text-white">
      <div
        className="mb-1 flex min-w-[120px] items-center justify-center rounded-lg px-1 text-lg font-semibold"
        style={{ color: color.M1Color }}
      >
        {label[0]}
      </div>
      <div className="mb-1 flex rounded-lg bg-[#595959] px-1">
        {formatValue(holdAngle)}
      </div>
      <div className="mb-1 flex rounded-lg bg-[#595959] px-1">
        {formatValue(maxTorque)}
      </div>
      <div className="mb-1 flex rounded-lg bg-[#595959] px-1">
        {formatValue(maxTorqueTime)}
      </div>
      <div className="mb-1 flex rounded-lg bg-[#595959] px-1">
        {formatValue(maxTorqueWeight)}
      </div>
      <div className="mb-1 flex rounded-lg bg-[#595959] px-1">
        {formatValue(torqueAtOff)}
      </div>
      <div className="mb-1 flex rounded-lg bg-[#595959] px-1">
        {formatValue(torqueoffMsWt)}
      </div>
      <div className="mb-1 flex rounded-lg bg-[#595959] px-1">
        {formatValue(averageTorque)}
      </div>
    </div>
  );
};

export default IsometricResultsTable;
