/*
 * Název souboru:    DeleteMiddleRepetitions.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení opakování vybraných k mazání a tlačítko pro potvrzení
 */

import { evaluatePlane } from "features/comparison/utils/comparison";
import { ExaminationWithPatient } from "features/examination/types/types";
import { Repetition } from "types/types";
import { Check } from "lucide-react";
import { formatRepetitions } from "utils/repetitions";

type DeleteMiddleRepetitionsProps = {
  examination: ExaminationWithPatient;
  repetitionsToDelete: Repetition[];
  onDelete: () => void;
};
const DeleteMiddleRepetitions = ({
  examination,
  repetitionsToDelete,
  onDelete,
}: DeleteMiddleRepetitionsProps) => {
  const labels = evaluatePlane(examination);
  const selectedRepetitions = formatRepetitions(repetitionsToDelete);
  return (
    <div className="flex max-w-fit grid-cols-[auto,1fr] items-center gap-x-2 rounded-lg border-2 border-primary bg-white px-2 sm:grid">
      <div className="col-span-2 flex justify-between gap-x-4">
        <div className="font-semibold">To delete</div>
        <Check className="hover:scale-110" onClick={onDelete} />
      </div>
      <div>{`${labels.M1Label}: `}</div>
      <div className="font-semibold">{selectedRepetitions.M1}</div>
      <div>{`${labels.M2Label}: `}</div>
      <div className="font-semibold">{selectedRepetitions.M2}</div>
      <div className="flex items-center"></div>
    </div>
  );
};

export default DeleteMiddleRepetitions;
