/*
 * Název souboru:    useIsometricSets.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro rozdělení isometrického vyšetření na jednotlivé sety
 */

import { useMemo } from "react";
import { divideIsometric } from "utils/isometricSets";
import { Measurement } from "types/types";
import { ExaminationWithPatient } from "features/examination/types/types";

interface useIsometricSetsProps {
  measurements: Measurement[] | undefined;
  examination: ExaminationWithPatient | undefined;
}
const useIsometricSets = ({
  measurements,
  examination,
}: useIsometricSetsProps) => {
  return useMemo(() => {
    if (!measurements || !examination) return [];

    const sets = divideIsometric(measurements, examination);

    return sets;
  }, [measurements, examination]);
};

export default useIsometricSets;
