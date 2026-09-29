/*
 * Název souboru:    DeleteData.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro mazání všech dat
 */

import { Button } from "components/ui/button";
import { successToast, errorToast } from "components/ui/toast";
import { axios } from "utils/api/axios";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { useDialog } from "hooks/useDialog";
import { useSettingsContext } from "../contexts/SettingsContext";

const DeleteData = () => {
  const { toggleDialog, dialogRef } = useDialog();
  const { setIsDeleting, isSynchronizing } = useSettingsContext();
  const handleDeleteData = async () => {
    return axios
      .delete("sync")
      .then((response) => {
        if (response.status === 200) {
          successToast("Deletion successful");
        }
      })
      .catch(() => {
        errorToast("Deletion failed");
      });
  };

  const handleSubmit = async () => {
    toggleDialog();
    setIsDeleting(true);
    await handleDeleteData();
    setIsDeleting(false);
  };

  return (
    <>
      <div>
        <Button
          className="bg-red-500 hover:bg-red-700"
          disabled={isSynchronizing}
          onClick={toggleDialog}
        >
          Delete all data
        </Button>
      </div>
      <ConfirmDeleteDialog
        ref={dialogRef}
        toggleDialog={toggleDialog}
        submitDialog={handleSubmit}
      />
    </>
  );
};

export default DeleteData;
