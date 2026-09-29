/*
 * Název souboru:    M1Summary.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Souhrn pro rovinu M1
 */

import { SummaryData } from "types/types";
import { DEFAULT_COLOR_M1 } from "utils/colors";
import { formatValue } from "utils/formatting";

type M1SummaryProps = {
  label: string;
  data: SummaryData;
};
const M1Summary = ({ label, data }: M1SummaryProps) => {
  const { totalWork, averageWork, maxTorque, maxWork } = data;
  return (
    <div className="grid min-w-max grid-cols-[auto_auto] grid-rows-[2fr_repeat(4,1fr)] gap-x-1 whitespace-nowrap text-white">
      <div
        className="col-span-1 row-span-1 flex w-full items-center justify-center text-lg"
        style={{ color: DEFAULT_COLOR_M1 }}
      >
        {label}
      </div>
      <div className="col-start-1 col-end-2 row-start-2 row-end-2 mb-1 flex rounded-lg bg-[#595959] px-2">
        {formatValue(totalWork.M1)}
      </div>
      <div className="col-start-1 col-end-2 row-start-3 row-end-3 mb-1 flex rounded-lg bg-[#595959] px-2">
        {formatValue(averageWork.M1)}
      </div>
      <div className="col-start-1 col-end-2 row-start-4 row-end-4 mb-1 flex rounded-lg bg-[#595959] px-2">
        {formatValue(maxTorque.M1.value)}
      </div>
      <div className="col-start-2 col-end-2 row-start-4 row-end-4 mb-1 flex rounded-lg bg-[#595959] px-2">
        {formatValue(maxTorque.M1.repetition)}
      </div>
      <div className="col-start-1 col-end-2 row-start-5 row-end-5 mb-1 flex rounded-lg bg-[#595959] px-2">
        {formatValue(maxWork.M1.value)}
      </div>
      <div className="col-start-2 col-end-2 row-start-5 row-end-5 mb-1 flex rounded-lg bg-[#595959] px-2">
        {formatValue(maxWork.M1.repetition)}
      </div>
    </div>
  );
};

export default M1Summary;
