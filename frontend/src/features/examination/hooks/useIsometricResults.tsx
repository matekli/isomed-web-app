/*
 * Název souboru:    useIsometricResults.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro výpočet výsledků isometrického vyšetření
 */

import { ExaminationWithPatient } from "../types/types";
import { IsometricSet } from "types/types";
import { useMemo } from "react";
import { getIsometricResults } from "../utils/isometric";

interface useIsometricResultsProps {
  sets: IsometricSet[];
  examination: ExaminationWithPatient | undefined;
  timeOffset: number | null;
}
export const useIsometricResults = ({
  sets,
  examination,
  timeOffset,
}: useIsometricResultsProps) => {
  return useMemo(() => {
    if (!examination) return [];
    return getIsometricResults(examination, sets, timeOffset);
  }, [sets, timeOffset]);
};
