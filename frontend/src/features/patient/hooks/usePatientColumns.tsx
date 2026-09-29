/*
 * Název souboru:    usePatientColumns.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro definici sloupců tabulky pro pacienty
 */

import { ColumnDef } from "@tanstack/react-table";
import RowActionDropdown from "components/RowActionDropdown";
import SortingButton from "components/SortingButton";
import { useMemo } from "react";
import { extractDate } from "utils/formatting";
import { PatientTableData } from "../types/types";
import { anonymize } from "utils/anonymize";
import { useSettingsContext } from "features/settings/contexts/SettingsContext";

interface PatientColumnsProps {
  onDelete: (e: React.MouseEvent, ids: string[]) => void;
  onMembershipAdd: (e: React.MouseEvent, ids: string[]) => void;
  onMembershipRemove: (e: React.MouseEvent, ids: string[]) => void;
}

const usePatientColumns = ({
  onDelete,
  onMembershipAdd,
  onMembershipRemove,
}: PatientColumnsProps) => {
  const { settings } = useSettingsContext();

  return useMemo<ColumnDef<PatientTableData>[]>(
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
              <RowActionDropdown
                ids={ids}
                onDelete={onDelete}
                onMembershipAdd={onMembershipAdd}
                onMembershipRemove={onMembershipRemove}
              />
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
        cell: ({ row }) => {
          return <div>{anonymize(row.original.name, settings?.safeMode)}</div>;
        },
      },
      {
        accessorKey: "birthday",
        header: ({ column }) => (
          <SortingButton column={column} text="Birthday" />
        ),
        cell: ({ row }) => {
          return anonymize(
            extractDate(row.getValue("birthday")),
            settings?.safeMode,
          );
        },
        sortingFn: "datetime",
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const patient = row.original;
          return (
            <RowActionDropdown
              ids={Array(patient.id)}
              onDelete={onDelete}
              onMembershipAdd={onMembershipAdd}
              onMembershipRemove={onMembershipRemove}
            />
          );
        },
      },
      {
        accessorKey: "groups",
        header: "Group",
        cell: ({ row }) => {
          return row.original.groups.join(", ");
        },
        filterFn: "arrIncludes",
      },
    ],
    [],
  );
};

export default usePatientColumns;
