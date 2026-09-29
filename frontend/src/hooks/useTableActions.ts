/*
 * Název souboru:    useTableActions.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro správu akcí nad tabulkou
 */

import { useState, useRef, useEffect } from "react";
import { axios } from "utils/api/axios";
import { useQueryClient } from "@tanstack/react-query";
import { errorToast, successToast } from "components/ui/toast";
import { useComparison } from "features/comparison/hooks/useComparison";
import { ColumnFilter } from "@tanstack/react-table";
import { getFilterValue } from "utils/table-utils";
import { useAddMembershipDialog } from "features/group/hooks/useAddMembershipDialog";
import { Comparison } from "features/comparison/types/types";
import { CreateGroupMembership } from "features/group/types/types";

interface useTableActionsProps<T extends { id: string }> {
  items: T[];
  tableInstance?: any;
  filters: ColumnFilter[];
  baseUrl: string;
  queryKey: string[];
}
export const useTableActions = <T extends { id: string }>({
  items,
  tableInstance,
  filters,
  baseUrl,
  queryKey,
}: useTableActionsProps<T>) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const tableRef = useRef(tableInstance);
  const {
    isDialogOpened,
    dialogRef,
    itemsToAdd,
    toggleDialog,
    handleSelection,
  } = useAddMembershipDialog<T>();
  const groupFilterRef = useRef<string>("");
  const queryClient = useQueryClient();
  const { addComparison } = useComparison();

  const handleDelete = async (e: React.MouseEvent, ids: string[]) => {
    e.stopPropagation();
    if (ids.length === 0) {
      errorToast("No item selected for deletion");
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(baseUrl, { data: ids });
      queryClient.invalidateQueries({ queryKey: queryKey });
      successToast("Deleted successfully");
    } catch (error) {
      console.error("Error deleting:", error);
      errorToast("Error while deleting");
    }
    setIsDeleting(false);
  };

  const handleMembershipAdd = (e: React.MouseEvent, ids: string[]) => {
    if (ids.length === 0) {
      errorToast("No item selected to add to the group");
      return;
    }
    e.stopPropagation();

    handleSelection(ids, items);

    if (tableRef.current) {
      tableRef.current?.toggleAllPageRowsSelected(false);
    }
    toggleDialog();
    dialogRef.current?.focus();
  };

  const handleMembershipRemove = async (e: React.MouseEvent, ids: string[]) => {
    e.stopPropagation();

    if (!groupFilterRef.current) {
      errorToast("A group filter must be set to delete membership");
      return;
    }

    if (ids.length === 0) {
      errorToast("No item selected for deletion");
      return;
    }

    setIsDeleting(true);

    const memberships: CreateGroupMembership[] = ids.map((id) => ({
      item_id: id,
      group_id: groupFilterRef.current,
    }));

    try {
      await axios.delete(baseUrl + "/group/membership", {
        data: memberships,
      });
      queryClient.invalidateQueries({ queryKey: queryKey });
      successToast("Removed successfully");
    } catch (error) {
      console.error("Error deleting:", error);
      errorToast("Error while removing");
    }

    setIsDeleting(false);
  };

  const handleComparison = (e: React.MouseEvent, comparison: Comparison) => {
    e.stopPropagation();
    addComparison(comparison);
  };

  //useEffect for getting group id from filter (needed for deleting membership)
  useEffect(() => {
    groupFilterRef.current = getFilterValue(filters, "groups");
  }, [filters]);

  useEffect(() => {
    tableRef.current = tableInstance;
  }, [tableInstance]);

  return {
    handleDelete,
    handleMembershipRemove,
    isDeleting,
    handleMembershipAdd,
    isDialogOpened,
    dialogRef,
    itemsToAdd,
    toggleDialog,
    handleComparison,
  };
};
