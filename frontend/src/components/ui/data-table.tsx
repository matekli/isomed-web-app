/*
 * Název souboru:    data-table.tsx
 * Autor:            ShadCN + Matěj Honzek (xhonze01)
 * Popis:            Komponenta tabulky, která používá knihovnu TanStack Table pro
 *                   zobrazení a manipulaci s daty. Umožňuje stránkování, filtrování
 *                   a třídění.
 *
 * Tento kód je inspirovaný knihovnou ShadCN, konkrétně z komponentou Data Table https://ui.shadcn.com/docs/components/data-table.
 */

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFilter,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Button } from "./button";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getClickedRowId?: (id: string) => void;
  rowClickRedirectURL?: string;
  rowClickRedirectData?: Record<string, any>;
  columnFilters?: ColumnFilter[];
  columnVisibility?: VisibilityState;
  onTableInstance?: (table: any) => void;
  className?: string;
}

const DataTable = <TData extends { id: string }, TValue>({
  columns,
  data,
  getClickedRowId,
  rowClickRedirectURL,
  rowClickRedirectData,
  columnFilters,
  columnVisibility = {},
  onTableInstance,
  className,
}: DataTableProps<TData, TValue>) => {
  const { pathname } = useLocation();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters: columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 30,
      },
      columnVisibility: columnVisibility,
    },
  });

  useEffect(() => {
    if (onTableInstance) {
      onTableInstance(table);
    }
  }, [table, onTableInstance, table.getState().pagination.pageIndex]);

  return (
    <>
      <div className={twMerge("rounded-md border", className)}>
        <Table className="text-xm h-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="px-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="text-base">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onMouseDown={() => getClickedRowId?.(row.original.id)}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell key={cell.id} className="px-1 py-2">
                      {index === 0 ||
                      index === row.getVisibleCells().length - 1 ? (
                        <div className="px-1">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </div>
                      ) : (
                        <Link
                          to={rowClickRedirectURL || pathname}
                          state={rowClickRedirectData}
                          className="flex h-full w-full items-center"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Link>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-end space-x-2 py-4 pr-4">
          <p>{table.getRowCount()}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};
export default DataTable;
