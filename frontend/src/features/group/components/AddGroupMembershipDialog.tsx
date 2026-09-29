/*
 * Název souboru:    AddGroupMembershipDialog.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Dialog pro přidání do skupiny
 */

import { forwardRef, ReactNode, useState } from "react";
import Dialog from "components/Dialog";
import { Button } from "components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "utils/api/postData";
import { errorToast, successToast } from "components/ui/toast";
import { AxiosError } from "axios";
import { Group, CreateGroupMembership, CreateGroup } from "../types/types";

interface AddGroupMembershipDialogProps<T extends { id: string }> {
  toggleDialog: () => void;
  items: T[];
  isOpened: boolean;
  groups: Group[];
  createGroupQuery: string;
  createMembershipQuery: string;
  itemsQueryKey: string[];
  groupsQueryKey: string[];
  children: ReactNode;
}
const AddGroupMembershipDialog = forwardRef(
  <T extends { id: string }>(
    {
      toggleDialog,
      items,
      isOpened,
      groups,
      createGroupQuery,
      createMembershipQuery,
      itemsQueryKey,
      groupsQueryKey,
      children,
    }: AddGroupMembershipDialogProps<T>,
    ref: React.Ref<HTMLDialogElement>,
  ) => {
    const [inputValue, setInputValue] = useState<string>("");
    const [selectValue, setSelectValue] = useState<string>("");
    const queryClient = useQueryClient();

    const { mutateAsync: addGroupMembership } = useMutation({
      mutationFn: (data: CreateGroupMembership[]) =>
        postData(createMembershipQuery, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: groupsQueryKey });
        queryClient.invalidateQueries({ queryKey: itemsQueryKey });
      },
    });

    const { mutateAsync: addGroup } = useMutation({
      mutationFn: (data: CreateGroup) =>
        postData<CreateGroup, Group>(createGroupQuery, data),
    });

    const handleSubmit = async () => {
      try {
        let groupId: string;

        if (selectValue.length === 0) {
          try {
            const newGroup = await addGroup({ name: inputValue });
            groupId = newGroup.id;
          } catch (error) {
            if ((error as AxiosError).response?.status === 409) {
              errorToast("Group already exists!");
            }
          }
        } else {
          groupId = selectValue;
        }

        const memberships = items.map((item) => {
          return { item_id: item.id, group_id: groupId };
        });

        await addGroupMembership(memberships);
      } catch (error) {
        errorToast("Error adding to group!");
      } finally {
        toggleDialog();
        setInputValue("");
        setSelectValue("");
        successToast("Added to group");
      }
    };

    return (
      <Dialog ref={ref} toggleDialog={toggleDialog} className="h-2/3 w-1/2">
        {isOpened && items && (
          <div className="h-full w-full px-4">
            {children}
            <div className="flex flex-col">
              <label htmlFor="group-text">Create a new group and add</label>
              <input
                id="group-text"
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                disabled={selectValue.length !== 0}
                className="w-1/3 bg-white px-2"
              />
              <label htmlFor="group-select">Add to existing group</label>
              <select
                id="group-select"
                disabled={inputValue.length !== 0}
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                className="mb-2 w-1/3"
              >
                <option></option>
                {groups &&
                  groups.map((group, index) => (
                    <option key={index} value={group.id}>
                      {group.name}
                    </option>
                  ))}
              </select>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={inputValue.length === 0 && selectValue.length === 0}
            >
              Add
            </Button>
          </div>
        )}
      </Dialog>
    );
  },
);

export default AddGroupMembershipDialog;
