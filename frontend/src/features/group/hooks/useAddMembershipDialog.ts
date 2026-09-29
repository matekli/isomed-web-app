/*
 * Název souboru:    useAddMembershipDialog.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook poskytující funkce pro práci s dialogem
 *                   pro přidávání do skupin
 */

import { useState } from "react";
import { useDialog } from "hooks/useDialog";

export const useAddMembershipDialog = <T extends { id: string }>() => {
  const { isDialogOpened, toggleDialog, dialogRef } = useDialog();
  const [itemsToAdd, setItemsToAdd] = useState<T[]>([]);

  const handleSelection = (ids: string[], items: T[]) => {
    const selectedItems = items.filter((item) => ids.includes(item.id));
    setItemsToAdd(selectedItems);
  };

  return {
    isDialogOpened,
    toggleDialog,
    dialogRef,
    itemsToAdd,
    handleSelection,
  };
};
