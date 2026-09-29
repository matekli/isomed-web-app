/*
 * Název souboru:    ConfirmDeleteDialog.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Dialog pro potvrzení mazání všech dat
 */

import Dialog from "components/Dialog";
import { Button } from "components/ui/button";
import { forwardRef } from "react";
type ConfirmDeleteDialogProps = {
  toggleDialog: () => void;
  submitDialog: () => void;
};
const ConfirmDeleteDialog = forwardRef<
  HTMLDialogElement,
  ConfirmDeleteDialogProps
>(({ toggleDialog, submitDialog }, ref) => {
  return (
    <Dialog
      toggleDialog={toggleDialog}
      ref={ref}
      className="relative h-min w-max"
    >
      <div className="flex h-full flex-col justify-center gap-y-4 py-8">
        <div className="mx-auto whitespace-nowrap px-4 text-3xl font-bold text-red-500">
          WARNING!
        </div>
        <div className="mx-auto px-4 text-xl font-semibold">
          This action will delete all your data. Continue?
        </div>
        <div className="flex w-full justify-center gap-x-2">
          <Button
            className="bg-red-500 hover:bg-red-400"
            onClick={submitDialog}
          >
            Delete
          </Button>
          <Button
            className="border border-gray-500 bg-white text-black hover:bg-slate-200"
            onClick={toggleDialog}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
});

export default ConfirmDeleteDialog;
