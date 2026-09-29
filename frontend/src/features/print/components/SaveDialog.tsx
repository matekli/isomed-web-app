/*
 * Název souboru:    SaveDialog.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Dialog zobrazují se před uložením zprávy s
 *                   možností přidání popisku
 */

import Dialog from "components/Dialog";
import { Button } from "components/ui/button";
import { forwardRef, useState } from "react";
type SaveDialogProps = {
  description: string;
  toggleDialog: () => void;
  submitDialog: (description: string) => void;
};
const SaveDialog = forwardRef<HTMLDialogElement, SaveDialogProps>(
  ({ description: initialDescription, toggleDialog, submitDialog }, ref) => {
    const [description, setDescription] = useState(initialDescription);
    return (
      <Dialog
        toggleDialog={toggleDialog}
        ref={ref}
        className="relative h-min w-max"
      >
        <div className="flex h-full flex-col justify-center gap-y-4 px-8 py-8">
          <div className="mx-auto whitespace-nowrap px-4 text-2xl font-bold">
            Description
          </div>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            className="h-28 w-80 resize-none rounded border border-gray-300 p-2"
            placeholder="Description"
          />
          <div className="flex w-full justify-center gap-x-2">
            <Button className="" onClick={() => submitDialog(description)}>
              Save
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
  },
);

export default SaveDialog;
