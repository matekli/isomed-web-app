/*
 * Název souboru:    DialogActions.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro akce dialogového okna, která poskytuje tlačítka pro resetování a
 *                   potvrzení výběru.
 */

import { Button } from "components/ui/button";
import { RotateCcw } from "lucide-react";

type DialogActionsProps = {
  onReset: () => void;
  onSubmit: () => void;
};
const DialogActions = ({ onReset, onSubmit }: DialogActionsProps) => {
  return (
    <div className="flex items-end justify-end gap-2">
      <RotateCcw className="hover:scale-110" onClick={onReset} />
      <Button onClick={onSubmit}>Select</Button>
    </div>
  );
};

export default DialogActions;
