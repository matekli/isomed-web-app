/*
 * Název souboru:    useMultipleRepetitions.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro rozdělení isokinetických dat na opakování s využitím useMemo,
 *                   který optimalizuje výpočty
 */

import { useMemo } from "react";
import {
  Comparison,
  MeasurementsByExamination,
  RepetitionsByExamination,
} from "../types/types";
import { ExaminationWithPatient } from "features/examination/types/types";
import { divideMeasurements } from "utils/repetitions";
import { excludeComparisonDeletes } from "../utils/comparison";
import { useComparisonStore } from "../store/comparisonStore";

interface UseMultipleRepetitionsProps {
  measurementsByExamination: MeasurementsByExamination[] | undefined;
  examinations: ExaminationWithPatient[] | undefined;
  comparisons: Comparison[];
  index: number;
}

const useMultipleRepetitions = ({
  measurementsByExamination,
  examinations,
  comparisons,
  index,
}: UseMultipleRepetitionsProps): RepetitionsByExamination[] => {
  const { repetitions, loaded } = useComparisonStore();
  return useMemo(() => {
    if (loaded) {
      const data = repetitions.find((c) => c.index === index);
      if (!data) {
        return [];
      }
      return data.repetitions;
    }
    if (!examinations || !measurementsByExamination) {
      return [{ examination_id: "", set: 0, repetitions: [] }];
    }

    return comparisons.map((comparison) => {
      const examination = examinations.find((e) => e.id === comparison.id);

      if (!examination) {
        return { examination_id: "", set: 0, repetitions: [] };
      }

      const measurements = measurementsByExamination.find(
        (measurement) => measurement.examination_id === examination.id,
      );

      if (!comparison || !measurements)
        return { examination_id: "", set: 0, repetitions: [] };

      const isokineticRepetitions = divideMeasurements(
        measurements.measurements,
        examination,
      );

      const currentSetRepetitions = isokineticRepetitions.filter(
        (rep) => rep.set === comparison.set,
      );

      const filteredRepetitionsByExamination = excludeComparisonDeletes(
        currentSetRepetitions,
        comparison,
      );

      return {
        examination_id: examination.id,
        set: comparison.set,
        repetitions: filteredRepetitionsByExamination,
      };
    });
  }, [measurementsByExamination, examinations, comparisons]);
};

export default useMultipleRepetitions;
