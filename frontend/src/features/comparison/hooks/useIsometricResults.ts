/*
 * Název souboru:    useIsometricResults.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro výpočet isometrických výsledků pro více vyšetření s využitím useMemo,
 *                   který optimalizuje výpočty.
 */

import { useMemo } from "react";
import { IndexedExamination, IsometricSetsByExamination } from "../types/types";
import { getIsometricResults } from "../utils/isometric";

type useIsometricResultsProps = {
  examinations: IndexedExamination[];
  isometricSets: IsometricSetsByExamination[];
  offset: number | null;
};

const useIsometricResults = ({
  examinations,
  isometricSets,
  offset,
}: useIsometricResultsProps) => {
  return useMemo(() => {
    if (!examinations) {
      return [];
    }
    return getIsometricResults(isometricSets, examinations, offset);
  }, [examinations, isometricSets, offset]);
};

export default useIsometricResults;
