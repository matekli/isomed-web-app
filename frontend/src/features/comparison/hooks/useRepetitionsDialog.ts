/*
 * Název souboru:    useRepetitionsDialog.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook poskytující obslužné funkce pro
 *                   práci s dialogem
 */

import { useState, useEffect } from "react";
import { useDialog } from "hooks/useDialog";
import { Repetition } from "types/types";
import { ExaminationWithPatient } from "features/examination/types/types";

export default function useRepetitionDialog() {
  const { dialogRef, isDialogOpened, toggleDialog } = useDialog();

  const [dialogExamination, setDialogExamination] = useState<
    ExaminationWithPatient | undefined
  >();
  const [dialogRepetitions, setDialogRepetitions] = useState<Repetition[]>([]);

  // Nastaví potřebné data pro dialog do stavu
  const openDialog = (
    examination: ExaminationWithPatient | undefined,
    repetitions: Repetition[],
  ) => {
    setDialogExamination(examination);
    setDialogRepetitions(repetitions);
    toggleDialog();
  };

  // tenhle close se používá pro zavření po kliknutí na submit
  const closeDialog = () => {
    resetDialogState();
  };

  // čistí stav
  const resetDialogState = () => {
    setDialogExamination(undefined);
    setDialogRepetitions([]);
  };

  // Když se nastaví vyšetření a opakování, otevře se dialog
  useEffect(() => {
    if (dialogExamination && dialogRepetitions.length > 0) {
      toggleDialog();
    }
  }, [dialogExamination, dialogRepetitions]);

  // Když dojde k zavření třeba kliknutím mimo, nebo přímo křížkem dialogu, vyčistí stav
  useEffect(() => {
    if (!isDialogOpened) {
      resetDialogState();
    }
  }, [isDialogOpened]);

  return {
    dialogRef,
    isDialogOpened,
    toggleDialog,
    dialogExamination,
    dialogRepetitions,
    openDialog,
    closeDialog,
  };
}
