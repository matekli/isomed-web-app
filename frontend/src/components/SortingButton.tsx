/*
 * Název souboru:    SortingButton.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro tlačítko umožňující třídění sloupců v tabulce,
 *                   používá ikony pro zobrazení aktuálního směru třídění.
 */

import { Column } from "@tanstack/react-table";
import { Button } from "components/ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface SortingButtonProps {
  column: Column<any>;
  text: string;
}

const SortingButton = ({ column, text }: SortingButtonProps) => {
  const isSorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(isSorted === "asc")}
      className="p-0"
    >
      {text}
      {isSorted === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : isSorted === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
};

export default SortingButton;
