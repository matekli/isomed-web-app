/*
 * Název souboru:    useMultipleIsometricSets.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro rozdělení isometrických dat na sety s využitím useMemo,
 *                   který optimalizuje výpočty.
 */

import { useMemo } from "react";
import { divideIsometric } from "utils/isometricSets";
import {
  IndexedExamination,
  IsometricSetsByExamination,
  MeasurementsByExamination,
} from "../types/types";
import { ExaminationWithPatient } from "features/examination/types/types";

interface useMultipleIsometricSetsProps {
  measurementsByExamination: MeasurementsByExamination[] | undefined;
  examinations: IndexedExamination[] | ExaminationWithPatient[] | undefined;
}

const useMultipleIsometricSets = ({
  measurementsByExamination,
  examinations,
}: useMultipleIsometricSetsProps): IsometricSetsByExamination[] => {
  return useMemo(() => {
    if (!examinations || !measurementsByExamination) {
      return [{ examination_id: "", sets: [] }];
    }

    return examinations.map((examination) => {
      const isIndexed = "data" in examination;

      const data: ExaminationWithPatient = isIndexed
        ? examination.data
        : examination;

      const { id: examination_id } = data;

      const measurements = measurementsByExamination.find(
        (measurement) => measurement.examination_id === examination_id,
      );

      if (!measurements) return { examination_id: "", sets: [] };

      const isometricSets = divideIsometric(measurements.measurements, data);

      return {
        examination_id: examination_id,
        sets: isometricSets,
      };
    });
  }, [measurementsByExamination, examinations]);
};

export default useMultipleIsometricSets;
