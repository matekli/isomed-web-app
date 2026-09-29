/*
 * Název souboru:    useFiltredRepetitions.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro filtrování lokálně smazaných opakování
 *                   (smazány v detaulu porovnání) s využitím useMemo,
 *                   který optimalizuje výpočty.
 */

import { useMemo } from "react";
import {
  DeletedRepsByExamination,
  RepetitionsByExamination,
} from "../types/types";
import { excludeLocalDeletes } from "../utils/comparison";

type UseFilteredRepetitionsByExaminationProps = {
  repetitionsByExamination: RepetitionsByExamination[];
  deleteReps: DeletedRepsByExamination[];
};

function useFilteredRepetitionsByExamination({
  repetitionsByExamination,
  deleteReps,
}: UseFilteredRepetitionsByExaminationProps) {
  return useMemo(
    () => excludeLocalDeletes(repetitionsByExamination, deleteReps),
    [deleteReps, repetitionsByExamination],
  );
}

export default useFilteredRepetitionsByExamination;
