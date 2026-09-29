/*
 * Název souboru:    calculations.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Sada funkcí pro výpočet výsledků pro exportovanou zprávu
 */

import {
  IndexedExamination,
  RepetitionsByExamination,
} from "features/comparison/types/types";
import { getIsokineticResults } from "features/examination/utils/isokinetic";
import { PrintRepetitionsResults, PrintResultsWithId } from "../types/types";
import {
  getAveragePower,
  getAverageWork,
  getMaxValueAcrossReps,
  getTotalWork,
} from "utils/calculations/isokineticCalculations";
import { divideAndRoundOnTwoDecimal, safeDivide } from "utils/math";

const getRepetitonResults = (
  examinations: IndexedExamination[],
  repetitions: RepetitionsByExamination[],
  onlyIsokinetic: boolean,
) => {
  const results: PrintRepetitionsResults[] = [];

  for (const e of examinations) {
    const reps = repetitions.find(
      (r) => r.examination_id === e.data.id && r.set === e.set,
    );
    if (!reps) continue;

    results.push({
      examination_id: e.data.id,
      results: getIsokineticResults(
        reps.repetitions,
        e.data,
        0,
        onlyIsokinetic,
      ),
    });
  }

  return results;
};

export const getPrintResults = (
  examinations: IndexedExamination[],
  repetitions: RepetitionsByExamination[],
  onlyIsokinetic: boolean,
) => {
  const repsResult = getRepetitonResults(
    examinations,
    repetitions,
    onlyIsokinetic,
  );

  const results: PrintResultsWithId[] = [];

  examinations.forEach((exam, i) => {
    const examResults = repsResult[i];
    if (!examResults) return;

    const peakTorqueWhole = getMaxValueAcrossReps(
      examResults.results,
      "maxTorque",
    );
    const peakTorque = {
      M1: peakTorqueWhole.M1.value,
      M2: peakTorqueWhole.M2.value,
    };
    const peakTorqueRep = {
      M1: peakTorqueWhole.M1.repetition,
      M2: peakTorqueWhole.M2.repetition,
    };

    const peakWorkWhole = getMaxValueAcrossReps(examResults.results, "work");

    const peakWork = {
      M1: peakWorkWhole.M1.value,
      M2: peakWorkWhole.M2.value,
    };
    const peakWorkRep = {
      M1: peakWorkWhole.M1.repetition,
      M2: peakWorkWhole.M2.repetition,
    };
    const atAngle = {
      M1:
        examResults.results.find((r) => r.repetition === peakTorqueRep.M1)?.data
          .maxTorqueAt.M1 ?? null,
      M2:
        examResults.results.find((r) => r.repetition === peakTorqueRep.M2)?.data
          .maxTorqueAt.M2 ?? null,
    };
    const peakTorqueM1ByM2 = {
      M1: safeDivide(peakTorque.M1, peakTorque.M2),
      M2: null,
    };
    const peakTorqueM2ByM1 = {
      M1: safeDivide(peakTorque.M2, peakTorque.M1),
      M2: null,
    };
    const peakWorkM1ByM2 = {
      M1: safeDivide(peakWork.M1, peakWork.M2),
      M2: null,
    };
    const peakWorkM2ByM1 = {
      M1: safeDivide(peakWork.M2, peakWork.M1),
      M2: null,
    };

    const peakTorqueWeight = {
      M1: divideAndRoundOnTwoDecimal(peakTorque.M1, exam.data.weight),
      M2: divideAndRoundOnTwoDecimal(peakTorque.M2, exam.data.weight),
    };

    const peakWorkWeight = {
      M1: divideAndRoundOnTwoDecimal(peakWork.M1, exam.data.weight),
      M2: divideAndRoundOnTwoDecimal(peakWork.M2, exam.data.weight),
    };

    const averageWork = getAverageWork(examResults.results);
    const totalWork = getTotalWork(examResults.results);
    const peakPowerWhole = getMaxValueAcrossReps(examResults.results, "power");
    const peakPower = {
      M1: peakPowerWhole.M1.value,
      M2: peakPowerWhole.M2.value,
    };
    const peakPowerRep = {
      M1: peakPowerWhole.M1.repetition,
      M2: peakPowerWhole.M2.repetition,
    };
    const averagePower = getAveragePower(examResults.results);

    results.push({
      examination_id: exam.data.id,
      set: exam.set,
      results: {
        peakTorque,
        peakTorqueRep,
        atAngle,
        peakWork,
        peakWorkRep,
        peakTorqueM1ByM2: {
          M1:
            peakTorqueM1ByM2.M1 == null
              ? null
              : Number((peakTorqueM1ByM2.M1 * 100).toFixed(1)),
          M2: null,
        },

        peakTorqueM2ByM1: {
          M1:
            peakTorqueM2ByM1.M1 == null
              ? null
              : Number((peakTorqueM2ByM1.M1 * 100).toFixed(1)),
          M2: null,
        },

        peakWorkM1ByM2: {
          M1:
            peakWorkM1ByM2.M1 == null
              ? null
              : Number((peakWorkM1ByM2.M1 * 100).toFixed(1)),
          M2: null,
        },

        peakWorkM2ByM1: {
          M1:
            peakWorkM2ByM1.M1 == null
              ? null
              : Number((peakWorkM2ByM1.M1 * 100).toFixed(1)),
          M2: null,
        },

        peakTorqueWeight,
        peakWorkWeight,
        averageWork,
        totalWork,
        peakPower,
        peakPowerRep,
        averagePower,
      },
    });
  });
  return results;
};
