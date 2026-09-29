/*
 * Název souboru:    useGroupColumns.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro definici sloupců tabulky pro skupiny
 */

import { ColumnDef } from "@tanstack/react-table";
import SortingButton from "components/SortingButton";
import { useMemo } from "react";
import GroupActionDropdown from "features/group/components/GroupActionDropdown";
import { GroupTableData } from "../types/types";

interface GroupColumnsProps {
  onDelete: (e: React.MouseEvent, ids: string[]) => void;
  editGroup: (e: React.MouseEvent, id: string) => void;
}

const useGroupColumns = ({ onDelete, editGroup }: GroupColumnsProps) => {
  return useMemo<ColumnDef<GroupTableData>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => {
          const examinations = table.getSelectedRowModel().flatRows;
          const ids = examinations.map((examination) => {
            return examination.original.id;
          });

          return (
            <div className="flex gap-4 px-1">
              <input
                type="checkbox"
                checked={
                  table.getIsAllPageRowsSelected() ||
                  table.getIsSomePageRowsSelected()
                }
                onMouseDown={(e) => e.stopPropagation()}
                onChange={(e) =>
                  table.toggleAllPageRowsSelected(e.target.checked)
                }
                aria-label="Select all"
              />
              <GroupActionDropdown ids={ids} handleDeleteClick={onDelete} />
            </div>
          );
        },
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onMouseDown={(e) => e.stopPropagation()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
            aria-label="Select row"
          />
        ),
      },
      {
        accessorKey: "id",
        header: "Id",
      },
      {
        accessorKey: "name",
        header: "Name",
        filterFn: "includesString",
      },
      {
        accessorKey: "count",
        header: ({ column }) => <SortingButton column={column} text="Count" />,
        cell: ({ row }) => {
          return row.original.count;
        },
      },

      {
        id: "actions",
        cell: ({ row }) => {
          const group_id = row.original.id;
          return (
            <GroupActionDropdown
              ids={Array(group_id)}
              groupToUpdate={group_id}
              handleDeleteClick={onDelete}
              handleEditClick={editGroup}
            />
          );
        },
      },
    ],
    [],
  );
};

export default useGroupColumns;
