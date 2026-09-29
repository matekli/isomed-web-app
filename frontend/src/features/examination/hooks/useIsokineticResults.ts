/*
 * Název souboru:    useIsokineticResults.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro výpočet výsledků isokinetického vyšetření
 */

import { Repetition } from "types/types";
import { useMemo } from "react";
import { ExaminationWithPatient } from "../types/types";
import { getIsokineticResults } from "../utils/isokinetic";

interface useIsokineticResultsProps {
  repetitions: Repetition[];
  examination: ExaminationWithPatient;
  offset: number | null;
  onlyIsokinetic: boolean;
}
export const useIsokineticResults = ({
  repetitions,
  examination,
  offset,
  onlyIsokinetic,
}: useIsokineticResultsProps) => {
  return useMemo(() => {
    return getIsokineticResults(
      repetitions,
      examination,
      offset,
      onlyIsokinetic,
    );
  }, [repetitions, offset, onlyIsokinetic]);
};
