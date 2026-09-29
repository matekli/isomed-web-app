/*
 * Název souboru:    GroupActionDropdown.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Rozbalovací menu s akcemi nad skupinami
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
import { useEffect, useState } from "react";

interface GroupActionDropdownProps {
  ids: string[];
  groupToUpdate?: string;
  handleEditClick?: (e: React.MouseEvent, id: string) => void;
  handleDeleteClick: (e: React.MouseEvent, ids: string[]) => void;
}

const GroupActionDropdown: React.FC<GroupActionDropdownProps> = ({
  ids,
  groupToUpdate,
  handleEditClick,
  handleDeleteClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEditClickWithPreventClose = (e: React.MouseEvent) => {
    if (!handleEditClick || !groupToUpdate) return;
    handleEditClick(e, groupToUpdate);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!groupToUpdate) {
      setIsOpen(false);
    }
  }, [groupToUpdate]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {groupToUpdate && handleEditClick && (
          <>
            <DropdownMenuItem onMouseDown={handleEditClickWithPreventClose}>
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onMouseDown={(e) => handleDeleteClick(e, ids)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GroupActionDropdown;
