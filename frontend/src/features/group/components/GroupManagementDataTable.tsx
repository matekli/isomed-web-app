/*
 * Název souboru:    GroupManagementDataTable.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Tabulka pro zobrazení skupin pacientů nebo vyšetření
 */

import { useEffect, useState } from "react";
import { Loader } from "components/ui/loader";
import { ColumnFilter, VisibilityState } from "@tanstack/react-table";
import DataTable from "components/ui/data-table";
import { getFilterValue, handleFilterChange } from "utils/table-utils";
import useGroupTableData from "features/group/hooks/useGroupTableData";
import useGroupColumns from "features/group/hooks/useGroupColumns";
import { useTableActions } from "hooks/useTableActions";
import EditGroupDialog from "features/group/components/EditGroupDialog";
import { useDialog } from "hooks/useDialog";
import { Group, GroupMembership } from "../types/types";

interface GroupManagementDataTableProps {
  groups: Group[];
  memberships: GroupMembership[];
  getClickedRowId?: (id: string) => void;
  rowClickRedirectURL?: string;
  rowClickRedirectData?: Record<string, any>;
  columnVisibility?: VisibilityState;
  type: "patient" | "examination";
}

const GroupManagementDataTable = ({
  groups,
  memberships,
  getClickedRowId,
  rowClickRedirectURL,
  rowClickRedirectData,
  columnVisibility,
  type,
}: GroupManagementDataTableProps) => {
  const [filters, setFilters] = useState<ColumnFilter[]>([]);
  const [groupToUpdate, setGroupToUpdate] = useState<Group | null>(null);

  const { dialogRef, isDialogOpened, toggleDialog } = useDialog();
  const data = useGroupTableData({ groups, memberships });
  const { isDeleting, handleDelete } = useTableActions({
    items: groups.map((group) => ({ ...group, id: group.id.toString() })),
    filters,
    baseUrl: type === "examination" ? "/examination/group" : "/patient/group",
    queryKey:
      type === "examination" ? ["examinationGroups"] : ["patientGroups"],
  });

  const editGroup = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const selectedGroup = groups.find((group) => group.id === id) || null;
    setGroupToUpdate(selectedGroup);
  };

  useEffect(() => {
    if (groupToUpdate !== null) {
      toggleDialog();
    }
  }, [groupToUpdate]);

  useEffect(() => {
    if (!isDialogOpened) {
      setGroupToUpdate(null);
    }
  }, [isDialogOpened]);

  const columns = useGroupColumns({ onDelete: handleDelete, editGroup });

  return (
    <>
      <div className="mb-2 flex gap-4">
        <input
          placeholder="Filter by name"
          value={getFilterValue(filters, "name")}
          onChange={(e) =>
            handleFilterChange(setFilters, "name", e.target.value)
          }
          className="rounded border p-2"
        />
      </div>
      {!isDeleting ? (
        <DataTable
          columns={columns}
          data={data}
          getClickedRowId={getClickedRowId}
          rowClickRedirectURL={rowClickRedirectURL}
          rowClickRedirectData={rowClickRedirectData}
          columnFilters={filters}
          columnVisibility={columnVisibility}
        />
      ) : (
        <Loader />
      )}

      {groupToUpdate && (
        <EditGroupDialog
          group={groupToUpdate}
          isOpened={isDialogOpened}
          toggleDialog={toggleDialog}
          ref={dialogRef}
          editGroupQuery={
            type === "examination" ? "/examination/group" : "/patient/group"
          }
          editGroupQueryKey={
            type === "examination" ? ["examinationGroups"] : ["patientGroups"]
          }
        />
      )}
    </>
  );
};

export default GroupManagementDataTable;
