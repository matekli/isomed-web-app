/*
 * Název souboru:    RowActionDropdown.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení dropdown menu s akcemi pro řádky v tabulce,
 *                   jako je přidání do skupiny, smazání nebo odstranění ze skupiny.
 */

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { Button } from "components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { ExaminationTableData } from "features/examination/types/types";
import { Comparison } from "features/comparison/types/types";
import AddToComparisonItems from "./AddToComparisonItems";

interface RowActionDropdownProps {
  ids: string[];
  onMembershipAdd: (e: React.MouseEvent, ids: string[]) => void;
  onDelete: (e: React.MouseEvent, ids: string[]) => void;
  onMembershipRemove: (e: React.MouseEvent, ids: string[]) => void;
  examination?: ExaminationTableData;
  onComparison?: (e: React.MouseEvent, comparison: Comparison) => void;
}

const RowActionDropdown: React.FC<RowActionDropdownProps> = ({
  ids,
  onMembershipAdd,
  onDelete,
  onMembershipRemove,
  examination,
  onComparison,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddClickWithPreventClose = (e: React.MouseEvent) => {
    onMembershipAdd(e, ids);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onComparison && examination && (
          <AddToComparisonItems
            examination={examination}
            handleAddComparison={onComparison}
          />
        )}
        <DropdownMenuItem onMouseDown={handleAddClickWithPreventClose}>
          Add to group
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onMouseDown={(e) => onDelete(e, ids)}>
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem onMouseDown={(e) => onMembershipRemove(e, ids)}>
          Remove from group
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RowActionDropdown;
