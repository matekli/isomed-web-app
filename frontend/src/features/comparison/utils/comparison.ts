/*
 * Název souboru:    comparison.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Sada funkcí používaných v detailu porovnání
 */

import { ExaminationWithPatient } from "features/examination/types/types";
import { MeasurementPhase, Repetition } from "types/types";
import {
  IsokineticResultsByExamination,
  Comparison,
  RepetitionsByExamination,
  IndexedExamination,
  DeletedRepsByExamination,
  IdToHide,
} from "../types/types";
import { getPlaneLabels } from "utils/converting";

export const decodeComparisonQueryString = (
  encodedQuery: string | undefined,
) => {
  if (!encodedQuery) {
    return [];
  }
  const queryString = decodeURIComponent(encodedQuery);

  const decodedComparisons: Comparison[] = JSON.parse(queryString);

  return decodedComparisons;
};

export const initializeIndexedExaminations = (
  examinations: ExaminationWithPatient[],
  comparisons: Comparison[],
) => {
  if (examinations) {
    const indexedExaminations: IndexedExamination[] = [];
    comparisons.forEach((comparison, index) => {
      const examination = examinations.find(
        (exam) => exam.id === comparison.id,
      );
      if (!examination) {
        return;
      }
      indexedExaminations.push({
        data: examination,
        index,
        set: comparison.set,
      });
    });
    const firstTwoExaminations = indexedExaminations.slice(0, 2);
    const compareIds = firstTwoExaminations.map((exam) => {
      return { id: exam.data.id, set: exam.set };
    });

    return { indexedExaminations, compareIds };
  }
  return { indexedExaminations: [], compareIds: [] };
};

export const excludeComparisonDeletes = (
  repetitions: Repetition[],
  comparison: Comparison,
) => {
  const filteredRepetitions = repetitions.filter(
    (repetition) =>
      !comparison.repetitionsToDelete.includes(repetition.repetition),
  );

  return filteredRepetitions;
};

export const excludeLocalDeletes = (
  repetitionsByExamination: RepetitionsByExamination[],
  toDelete: DeletedRepsByExamination[],
) => {
  return repetitionsByExamination.map((repetitions) => {
    const item = toDelete.find(
      (d) => d.examination_id === repetitions.examination_id,
    );

    const filtered = repetitions.repetitions.filter(
      (repetition) => !item?.toDelete?.includes(repetition.repetition),
    );

    return {
      examination_id: repetitions.examination_id,
      set: repetitions.set,
      repetitions: filtered,
    };
  });
};

export const evaluatePlane = (
  examination: ExaminationWithPatient,
  type?: MeasurementPhase,
) => {
  const { plane, test_mode } = examination;
  const [M1Label, M2Label] = getPlaneLabels(test_mode, plane, type);

  return { M1Label, M2Label };
};

export const findExaminationById = (
  examinations: IndexedExamination[],
  id: string,
  set: number = 1,
) => {
  return examinations.find((e) => e.data.id === id && e.set === set);
};

export const findTableDataById = (
  tableData: IsokineticResultsByExamination[],
  id: string,
  set: number,
) => {
  return tableData.find((t) => t.examination_id === id && t.set === set)?.data;
};

export const isHidden = (
  idsToHide: IdToHide[],
  id: string,
  set: number = 1,
) => {
  return idsToHide.some((item) => item.id === id && item.set === set);
};
