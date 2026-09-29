/*
 * Název souboru:    useRepetitions.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook rozdělení vyšetření na jednotlivá opakování
 */

import { useMemo } from "react";
import { divideMeasurements } from "utils/repetitions";
import { Measurement, Repetition } from "types/types";
import { ExaminationWithPatient } from "features/examination/types/types";

interface useRepetitionsProps {
  measurements: Measurement[] | undefined;
  examination: ExaminationWithPatient | undefined;
  currentSet: number;
}
const useRepetitions = ({
  measurements,
  examination,
  currentSet,
}: useRepetitionsProps) => {
  return useMemo(() => {
    if (!measurements || !examination) return [];

    const isokineticRepetitions = divideMeasurements(measurements, examination);

    const currentSetRepetitions =
      examination.test_mode !== "6"
        ? (isokineticRepetitions.filter(
            (rep) => rep.set === currentSet,
          ) as Repetition[])
        : isokineticRepetitions;

    return currentSetRepetitions;
  }, [measurements, examination, currentSet]);
};

export default useRepetitions;
