/*
 * Název souboru:    Summary.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Souhrn výsledků detailu vyšetření
 */

import {
  IsokineticResultsData,
  ExaminationWithPatient,
} from "features/examination/types/types";
import M1Summary from "./M1Summary";
import ResultsSummaryHeaders from "./Headers";
import M2Summary from "./M2Summary";
import { getSummary } from "utils/calculations/isokineticCalculations";
import M1PlusM1 from "./M1PlusM1";
import M1ByM1 from "./M1ByM2";
import { evaluatePlane } from "features/comparison/utils/comparison";
type SummaryProps = {
  examination: ExaminationWithPatient;
  results: IsokineticResultsData[];
};

const Summary = ({ examination, results }: SummaryProps) => {
  const labels = evaluatePlane(examination);

  const data = getSummary(results);
  return (
    <div className="flex items-center justify-center gap-x-4 p-2">
      <ResultsSummaryHeaders />
      <M1Summary label={labels.M1Label} data={data} />
      <M2Summary label={labels.M2Label} data={data} />
      <M1ByM1 data={data} />
      <M1PlusM1 data={data} />
    </div>
  );
};

export default Summary;
