/*
 * Název souboru:    RepetitionsCard.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení karty opakování pro dané vyšetření.
 */

import { RepetitionsByExamination } from "features/comparison/types/types";
import { evaluatePlane } from "features/comparison/utils/comparison";
import { ExaminationWithPatient } from "features/examination/types/types";
import { Pencil } from "lucide-react";
import { formatRepetitions } from "utils/repetitions";

type RepetitionsCardProps = {
  examination: ExaminationWithPatient;
  repetitions: RepetitionsByExamination;
  onRepetitionChange: (id: string) => void;
};

const RepetitionsCard = ({
  examination,
  repetitions,
  onRepetitionChange,
}: RepetitionsCardProps) => {
  const labels = evaluatePlane(examination);

  const formattedRepetitions = formatRepetitions(repetitions);

  return (
    <div className="col-span-2 rounded-lg border-2 border-dashed border-primary px-2 py-2">
      <div className="mb-2 flex items-center justify-between">
        <div className="font-semibold">
          {`Repetitions : ${examination.number_of_repetitions}`}
        </div>
        <Pencil
          size={16}
          onClick={() => onRepetitionChange(examination.id)}
          className="cursor-pointer hover:scale-125"
        />
      </div>

      <div className="space-y-1">
        <div className="flex gap-x-1">
          <div>{`${labels.M1Label}:`}</div>
          <div className="font-semibold">{formattedRepetitions.M1}</div>
        </div>

        <div className="flex gap-x-1">
          <div>{`${labels.M2Label}:`}</div>
          <div className="font-semibold">{formattedRepetitions.M2}</div>
        </div>
      </div>
    </div>
  );
};

export default RepetitionsCard;
