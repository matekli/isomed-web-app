/*
 * Název souboru:    useDialog.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro správu dialogového okna
 */

import { useState, useRef } from "react";

export const useDialog = () => {
  const [isDialogOpened, setIsDialogOpened] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const toggleDialog = () => {
    if (!dialogRef.current) {
      return;
    }

    if (dialogRef.current?.hasAttribute("open")) {
      setIsDialogOpened(false);
      dialogRef.current.close();
    } else {
      setIsDialogOpened(true);
      dialogRef.current?.showModal();
    }
  };

  return { isDialogOpened, toggleDialog, dialogRef };
};
