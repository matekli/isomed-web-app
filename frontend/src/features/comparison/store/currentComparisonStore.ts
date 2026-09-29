/*
 * Název souboru:    currentComparisonStore.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Stav detailu porovnání, drží veškeré
 *                   informace potřebné k vizualizaci porovnání
 */

import { create } from "zustand";
import {
  Comparison,
  ComparisonColors,
  DeletedRepsByExamination,
  IdToCompare,
  IndexedExamination,
  IsometricSetsByExamination,
  MeasurementsByExamination,
  RepetitionsByExamination,
  TestType,
} from "../types/types";

type CurrentComparisonStore = {
  type: TestType;
  index: number;
  examinations: IndexedExamination[];
  measurements: MeasurementsByExamination[];
  comparisons: Comparison[];
  repetitions: RepetitionsByExamination[];
  isometricSets: IsometricSetsByExamination[];
  compareIds: IdToCompare[];
  locallyDeleted: DeletedRepsByExamination[];
  colors: ComparisonColors[];
  setType: (type: TestType) => void;
  setIndex: (index: number) => void;
  setExaminations: (
    updater: (prev: IndexedExamination[]) => IndexedExamination[],
  ) => void;
  setMeasurements: (measurements: MeasurementsByExamination[]) => void;
  setComparisons: (comparisons: Comparison[]) => void;
  setRepetitions: (repetitions: RepetitionsByExamination[]) => void;
  setIsometricSets: (isometricSets: IsometricSetsByExamination[]) => void;

  setCompareIds: (updater: (prev: IdToCompare[]) => IdToCompare[]) => void;
  setLocallyDeleted: (
    updater: (prev: DeletedRepsByExamination[]) => DeletedRepsByExamination[],
  ) => void;

  setColors: (colors: ComparisonColors[]) => void;
  setAll: (payload: Partial<CurrentComparisonStore>) => void;
};
export const useCurrentComparisonStore = create<CurrentComparisonStore>(
  (set) => ({
    type: "isokinetic",
    index: 0,
    examinations: [],
    measurements: [],
    comparisons: [],
    repetitions: [],
    isometricSets: [],
    compareIds: [],
    locallyDeleted: [],
    colors: [],
    setType: (type) => set(() => ({ type })),
    setIndex: (index) => set(() => ({ index })),
    setExaminations: (updater) =>
      set((state) => ({
        examinations: updater(state.examinations),
      })),
    setMeasurements: (measurements) => set(() => ({ measurements })),
    setComparisons: (comparisons) => set(() => ({ comparisons })),
    setRepetitions: (repetitions) => set(() => ({ repetitions })),
    setIsometricSets: (isometricSets) => set(() => ({ isometricSets })),

    setCompareIds: (updater) =>
      set((state) => ({
        compareIds: updater(state.compareIds),
      })),

    setLocallyDeleted: (updater) =>
      set((state) => ({
        locallyDeleted: updater(state.locallyDeleted),
      })),
    setColors: (colors) => set(() => ({ colors })),

    setAll: (payload) => set((state) => ({ ...state, ...payload })),
  }),
);
