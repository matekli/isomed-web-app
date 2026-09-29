/*
 * Název souboru:    SelectedRepetitions.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení vybraných opakování.
 */

import { evaluatePlane } from "features/comparison/utils/comparison";
import { ExaminationWithPatient } from "features/examination/types/types";
import { Repetition } from "types/types";
import { formatRepetitions } from "utils/repetitions";

type SelectedRepetitionsProps = {
  examination: ExaminationWithPatient;
  repetitions: Repetition[];
};

const SelectedRepetitions = ({
  examination,
  repetitions,
}: SelectedRepetitionsProps) => {
  const labels = evaluatePlane(examination);
  const selectedRepetitions = formatRepetitions(repetitions);

  return (
    <div className="flex max-w-fit grid-cols-[auto,1fr] items-center gap-x-2 rounded-lg border-2 border-primary bg-white px-2 sm:grid">
      <div className="col-span-2 font-semibold">Selected </div>
      <div>{`${labels.M1Label}: `}</div>
      <div className="font-semibold">{selectedRepetitions.M1}</div>
      <div>{`${labels.M2Label}: `}</div>
      <div className="font-semibold">{selectedRepetitions.M2}</div>
    </div>
  );
};

export default SelectedRepetitions;
