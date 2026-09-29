/*
 * Název souboru:    comparisonStore.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Globální stav seznamu porovnání, drží jednotlivá
 *                   vyšetření a jejich měření a jednotlivá opakování
 */

import { create } from "zustand";
import {
  MeasurementsByExamination,
  RepetitionsByExamination,
} from "../types/types";
import { ExaminationWithPatient } from "features/examination/types/types";

type ComparisonStore = {
  examinations: ExaminationWithPatient[];
  measurements: MeasurementsByExamination[];
  repetitions: {
    repetitions: RepetitionsByExamination[];
    index: number;
  }[];
  loaded: boolean;
  setComparisonData: (
    examinations: ExaminationWithPatient[],
    measurements: MeasurementsByExamination[],
    repetitions: RepetitionsByExamination[],
    index: number,
  ) => void;
  setLoaded: (loaded: boolean) => void;
};
export const useComparisonStore = create<ComparisonStore>((set) => ({
  examinations: [],
  measurements: [],
  repetitions: [],
  loaded: false,
  setComparisonData: (examinations, measurements, repetitions, index) =>
    set((state) => {
      const updatedRepetitions = state.repetitions.map((item) =>
        item.index === index
          ? {
              ...item,
              repetitions,
            }
          : item,
      );

      // Pokud položka s tímto indexem neexistuje, přidej novou
      if (!updatedRepetitions.some((item) => item.index === index)) {
        updatedRepetitions.push({
          repetitions,
          index,
        });
      }

      return {
        repetitions: updatedRepetitions,
        examinations: examinations,
        measurements: measurements,
      };
    }),

  setLoaded: (loaded) => set({ loaded }),
}));
