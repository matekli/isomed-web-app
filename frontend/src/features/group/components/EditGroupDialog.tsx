/*
 * Název souboru:    EditGroupDialog.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Dialog pro editaci skupiny
 */

import React, { forwardRef, useEffect, useRef, useState } from "react";
import Dialog from "components/Dialog";
import { Button } from "components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putData } from "utils/api/putData";
import { Group, UpdateGroup } from "../types/types";
import { errorToast } from "components/ui/toast";

interface EditGroupDialogProps {
  toggleDialog: () => void;
  group: Group;
  isOpened: boolean;
  editGroupQuery: string;
  editGroupQueryKey: string[];
}
const EditGroupDialog = forwardRef(
  (
    {
      toggleDialog,
      group,
      isOpened,
      editGroupQuery,
      editGroupQueryKey,
    }: EditGroupDialogProps,
    ref: React.Ref<HTMLDialogElement>,
  ) => {
    const [inputValue, setInputValue] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();

    const { mutateAsync: updateGroup } = useMutation({
      mutationFn: (data: UpdateGroup) => {
        return putData<UpdateGroup, Group>(editGroupQuery, data);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: editGroupQueryKey });
      },
    });

    const handleSubmit = async () => {
      try {
        await updateGroup({ id: group.id, name: inputValue });
      } catch (error) {
        errorToast("Failed to update the group");
      } finally {
        toggleDialog();
        setInputValue("");
      }
    };

    useEffect(() => {
      setInputValue(group.name);
    }, [isOpened]);

    useEffect(() => {
      if (isOpened && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isOpened]);

    return (
      <Dialog ref={ref} toggleDialog={toggleDialog} className="h-1/3 w-1/3">
        {isOpened && group && (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="flex justify-center">
                <label className="mr-4" htmlFor="group-text">
                  Name
                </label>
                <input
                  ref={inputRef}
                  id="group-text"
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  className="w-full rounded-md bg-white px-2"
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={inputValue.length === 0}
                className="mt-4 flex justify-center"
              >
                Upravit
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    );
  },
);

export default EditGroupDialog;
