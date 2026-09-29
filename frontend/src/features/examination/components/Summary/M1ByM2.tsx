/*
 * Název souboru:    M1ByM2.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Rozdíl roviny M1 a M2
 */

import { SummaryData } from "types/types";
import { DEFAULT_COLOR_M1, DEFAULT_COLOR_M2 } from "utils/colors";
import { formatPercentage } from "utils/formatting";

type M1ByM2Props = {
  data: SummaryData;
};
const M1ByM2 = ({ data }: M1ByM2Props) => {
  return (
    <div className="grid min-w-max grid-rows-[2fr_repeat(4,1fr)] gap-x-2 whitespace-nowrap text-white">
      <div className="flex items-center gap-x-1">
        <div
          className="col-span-1 row-span-1 flex w-full items-center justify-center text-lg"
          style={{ color: DEFAULT_COLOR_M1 }}
        >
          M1
        </div>
        <div>/</div>
        <div
          className="col-span-1 row-span-1 flex w-full items-center justify-center text-lg"
          style={{ color: DEFAULT_COLOR_M2 }}
        >
          M2
        </div>
      </div>
      <div className="mb-1 flex justify-center rounded-lg bg-[#595959] px-2">
        {formatPercentage(data.totalWork.M1, data.totalWork.M2)}
      </div>
      <div className="mb-1 flex justify-center rounded-lg bg-[#595959] px-2">
        {formatPercentage(data.averageWork.M1, data.averageWork.M2)}
      </div>
    </div>
  );
};

export default M1ByM2;
