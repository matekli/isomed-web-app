/*
 * Název souboru:    RepetitionSelectionDialog.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro dialogové okno, které umožňuje uživatelům vybrat a smazat opakování
 *                   (repetice) z vyšetření.
 */

import { forwardRef, useEffect, useState } from "react";
import Dialog from "components/Dialog";
import { ChartData, Repetition } from "types/types";
import PageTitle from "components/PageTitle";
import { ExaminationWithPatient } from "features/examination/types/types";
import SelectedRepetitions from "./SelectedRepetitions";
import DeleteMiddleRepetitions from "./DeleteMiddleRepetitions";
import SelectableExaminationChart from "./SelectableExaminationChart";
import DialogActions from "./DialogActions";
import { getIsokineticChartData } from "features/examination/utils/isokinetic";

type RepetitionSelectionDialogProps = {
  repetitions: Repetition[];
  examination: ExaminationWithPatient;
  toggleDialog: () => void;
  isDialogOpened: boolean;
  submitDialog: (deletedRepetitions: number[]) => void;
};
const RepetitionSelectionDialog = forwardRef<
  HTMLDialogElement,
  RepetitionSelectionDialogProps
>(
  (
    { repetitions, examination, toggleDialog, isDialogOpened, submitDialog },
    ref,
  ) => {
    const [dialogReps, setDialogReps] = useState<Repetition[]>([]);
    const [dialogChartData, setDialogChartData] = useState<ChartData[]>([]);
    const [repsToDelete, setRepsToDelete] = useState<Repetition[]>([]);

    const handleDeleteMiddle = () => {
      const newRepetitions = dialogReps.filter(
        (repetition) => !repsToDelete.includes(repetition),
      );
      setDialogReps(newRepetitions);
      setRepsToDelete([]);
    };

    const handleReset = () => {
      setDialogReps(repetitions);
      setRepsToDelete([]);
    };

    const handleSubmit = () => {
      setDialogReps([]);
      setRepsToDelete([]);
      submitDialog(deletedRepetitions);
    };

    useEffect(() => {
      if (isDialogOpened) {
        if (dialogReps.length === 0) {
          setDialogReps(repetitions);
        }
        setDialogChartData(getIsokineticChartData(dialogReps, examination));
      }
    }, [dialogReps, repetitions, isDialogOpened]);

    const reps = repetitions.map((r) => r.repetition);
    const dialogRepsNumbers = dialogReps.map((r) => r.repetition);

    const deletedRepetitions = reps.filter(
      (repetition) => !dialogRepsNumbers.includes(repetition),
    );

    return (
      <Dialog
        toggleDialog={toggleDialog}
        ref={ref}
        className="relative h-4/5 w-4/5"
      >
        {isDialogOpened && (
          <div className="flex h-full w-full flex-col">
            <div className="flex w-full items-center justify-center">
              <PageTitle text="Select repetitions" />
            </div>

            <div className="mx-4 flex flex-col justify-end gap-x-4 gap-y-2 sm:flex sm:flex-row">
              <DeleteMiddleRepetitions
                examination={examination}
                repetitionsToDelete={repsToDelete}
                onDelete={handleDeleteMiddle}
              />

              <SelectedRepetitions
                examination={examination}
                repetitions={dialogReps}
              />
              <DialogActions onReset={handleReset} onSubmit={handleSubmit} />
            </div>

            <div className="m-4 flex h-full flex-col rounded-lg border-2 border-primary bg-white">
              <SelectableExaminationChart
                examination={examination}
                chartData={dialogChartData}
                repetitions={dialogReps}
                selectedRepetitions={repsToDelete}
                setSelectedRepetitions={setRepsToDelete}
                dialogRef={ref}
              />
            </div>
          </div>
        )}
      </Dialog>
    );
  },
);

export default RepetitionSelectionDialog;
