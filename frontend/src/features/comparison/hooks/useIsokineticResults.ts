/*
 * Název souboru:    useIsokineticResults.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro výpočet isokinetických výsledků pro více vyšetření s využitím useMemo,
 *                   který optimalizuje výpočty.
 */

import { useMemo } from "react";
import { AveragesByExamination, IndexedExamination } from "../types/types";
import { getIsokineticResultsComp } from "../utils/isokinetic";

type useIsokineticResultsProps = {
  examinations: IndexedExamination[];
  averagesByExamination: AveragesByExamination[];
  offset?: number | null;
  onlyIsokinetic?: boolean;
};

const useIsokineticResults = ({
  examinations,
  averagesByExamination,
  offset = 0,
  onlyIsokinetic = true,
}: useIsokineticResultsProps) => {
  return useMemo(() => {
    if (!examinations) {
      return [];
    }

    return getIsokineticResultsComp(
      averagesByExamination,
      examinations,
      offset,
      onlyIsokinetic,
    );
  }, [examinations, averagesByExamination, offset, onlyIsokinetic]);
};

export default useIsokineticResults;
