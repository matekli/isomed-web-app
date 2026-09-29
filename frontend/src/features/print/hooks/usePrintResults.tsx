/*
 * Název souboru:    usePrintResults.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro výpočet výsledků pro exportovanou zprávu
 */

import { useMemo } from "react";
import { getPrintResults } from "../calculations/calculations";
import {
  IndexedExamination,
  RepetitionsByExamination,
} from "features/comparison/types/types";
type usePrintResultsProps = {
  examinations: IndexedExamination[];
  repetitions: RepetitionsByExamination[];
  onlyIsokinetic?: boolean;
};
const usePrintResults = ({
  examinations,
  repetitions,
  onlyIsokinetic = true,
}: usePrintResultsProps) => {
  return useMemo(() => {
    return getPrintResults(examinations, repetitions, onlyIsokinetic);
  }, [examinations, repetitions, onlyIsokinetic]);
};

export default usePrintResults;
