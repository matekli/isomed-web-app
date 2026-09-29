/*
 * Název souboru:    useExaminationsColumns.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro definici sloupců tabulky pro vyšetření
 */

import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  convertTestMode,
  convertPlane,
  convertSide,
  convertJoint,
} from "utils/converting";
import RowActionDropdown from "components/RowActionDropdown";
import { extractDate, extractTime } from "utils/formatting";
import SortingButton from "components/SortingButton";
import { getDemappedPlane } from "utils/converting";
import { Comparison } from "features/comparison/types/types";
import { ExaminationTableData } from "../types/types";
import { useSettingsContext } from "features/settings/contexts/SettingsContext";
import { anonymize } from "utils/anonymize";

type ExaminationColumnsProps = {
  onMembershipAdd: (e: React.MouseEvent, ids: string[]) => void;
  onDelete: (e: React.MouseEvent, ids: string[]) => void;
  onMembershipRemove: (e: React.MouseEvent, ids: string[]) => void;
  onComparison?: (e: React.MouseEvent, comparison: Comparison) => void;
};

export const useExaminationColumns = ({
  onMembershipAdd,
  onDelete,
  onMembershipRemove,
  onComparison,
}: ExaminationColumnsProps) => {
  const { settings } = useSettingsContext();
  return useMemo<ColumnDef<ExaminationTableData>[]>(
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
                onMembershipAdd={onMembershipAdd}
                onDelete={onDelete}
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
        accessorKey: "patient",
        header: "Patient",
        filterFn: "includesString",
        cell: ({ row }) => {
          return (
            <div>{anonymize(row.original.patient, settings?.safeMode)}</div>
          );
        },
      },
      {
        accessorKey: "test_mode",
        header: "Test mode",
        cell: ({ row }) => {
          const test_mode = convertTestMode(row.original.test_mode);
          return <div>{test_mode}</div>;
        },
        filterFn: "equals",
      },
      {
        accessorKey: "plane",
        header: "Plane",
        cell: ({ row }) => {
          const plane = convertPlane(
            getDemappedPlane(row.original.plane, row.original.test_mode),
            row.original.test_mode,
          );
          return <div>{plane}</div>;
        },
        filterFn: "equals",
      },
      {
        accessorKey: "joint",
        header: "Joint",
        cell: ({ row }) => {
          return `${convertSide(row.original.side)} ${convertJoint(row.original.joint)}`;
        },
      },
      {
        accessorKey: "speed",
        header: "Speed",
      },
      {
        accessorKey: "datetime",
        header: ({ column }) => <SortingButton column={column} text="Date" />,
        cell: ({ row }) => {
          return (
            extractDate(row.getValue("datetime")) +
            " " +
            extractTime(row.getValue("datetime"))
          );
        },
        sortingFn: "datetime",
      },
      {
        accessorKey: "number_of_repetitions",
        header: ({ column }) => <SortingButton column={column} text="Reps" />,
      },
      {
        accessorKey: "number_of_sets",
        header: ({ column }) => <SortingButton column={column} text="Sets" />,
      },

      {
        id: "actions",
        cell: ({ row }) => {
          const examination = row.original;

          return (
            <RowActionDropdown
              ids={Array(examination.id)}
              onMembershipAdd={onMembershipAdd}
              onDelete={onDelete}
              onMembershipRemove={onMembershipRemove}
              examination={examination}
              onComparison={onComparison}
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
