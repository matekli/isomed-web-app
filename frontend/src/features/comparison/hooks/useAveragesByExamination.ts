/*
 * Název souboru:    useAveragesByExamination.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Custom hook, který pomocí `useMemo` optimalizuje výpočet průměrného točivého momentu
 *                   na základě opakování a vyšetření.
 */

import { useMemo } from "react";
import { calculateAverageTorque } from "../utils/isokinetic";
import { IndexedExamination, RepetitionsByExamination } from "../types/types";

interface useAveragesByExaminationProps {
  examinations: IndexedExamination[];
  repetitions: RepetitionsByExamination[];
}
const useAveragesByExamination = ({
  examinations,
  repetitions,
}: useAveragesByExaminationProps) => {
  return useMemo(
    () =>
      repetitions.flatMap((repetitions) => {
        const examination = examinations.find(
          (e) =>
            e.data.id === repetitions.examination_id &&
            e.set === repetitions.set,
        );
        if (!examination) {
          return [];
        }

        return {
          examination_id: repetitions.examination_id,
          set: repetitions.set,
          averages: calculateAverageTorque(examination, repetitions),
        };
      }),
    [repetitions, examinations],
  );
};

export default useAveragesByExamination;
