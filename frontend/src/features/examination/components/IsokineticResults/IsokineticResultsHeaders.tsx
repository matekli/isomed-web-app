/*
 * Název souboru:    IsokineticResultsHeaders.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro popisů řádků tabulky
 */

import {
  athleticResultsHeaders,
  isokineticResultsHeaders,
} from "constants/constants";
import { ExaminationWithPatient } from "features/examination/types/types";
import { formatValue } from "utils/formatting";
import { isAthletic } from "utils/utils";

type IsokineticResultsHeadersProps = {
  examination: ExaminationWithPatient;
  offset: number | null;
};
const IsokineticResultsHeaders = ({
  examination,
  offset,
}: IsokineticResultsHeadersProps) => {
  const headers = isAthletic(examination)
    ? athleticResultsHeaders
    : isokineticResultsHeaders;

  const unit = isAthletic(examination) ? "cm" : "°";
  return (
    <div className="grid min-w-max grid-cols-1 grid-rows-[2fr_repeat(11,1fr)] whitespace-nowrap text-white">
      <div className="flex items-center justify-center text-lg">
        Reconstruction
      </div>
      {Object.entries(headers).map(([key, label]) => {
        return (
          <div key={key} className="mb-1 rounded-lg bg-[#595959] px-2">
            {key === "torqueAtOff"
              ? `${label}  ${formatValue(offset)} ${unit}`
              : label}
          </div>
        );
      })}
    </div>
  );
};

export default IsokineticResultsHeaders;
