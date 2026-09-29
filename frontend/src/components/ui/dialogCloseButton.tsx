/*
 * Název souboru:    dialogCloseButton.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Tlačítko pro zavření dialogu
 */

import { X } from "lucide-react";
import { Button } from "./button";

interface dialogCloseButtonProps {
  onClick: () => void;
}
const DialogCloseButton = ({ onClick }: dialogCloseButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className="absolute right-0 h-8 w-8 bg-slate-200 px-2 py-1 text-gray-700 outline-none hover:bg-slate-400"
    >
      <X />
    </Button>
  );
};

export default DialogCloseButton;
