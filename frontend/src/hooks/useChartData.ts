/*
 * Název souboru:    useChartData.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro převod dat do formátu pro zobrazení v grafu
 */

import { useMemo } from "react";
import { Repetition } from "types/types";
import { ExaminationWithPatient } from "features/examination/types/types";
import { getIsokineticChartData } from "features/examination/utils/isokinetic";

interface useChartDataProps {
  repetitions: Repetition[];
  examination: ExaminationWithPatient;
}
export const useChartData = ({
  repetitions,
  examination,
}: useChartDataProps) => {
  return useMemo(() => {
    return getIsokineticChartData(repetitions, examination);
  }, [repetitions]);
};
