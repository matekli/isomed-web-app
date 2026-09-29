/*
 * Název souboru:    MobileExaminationList.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Mobilní zobrazení seznamu vyšetření
 */

import { ColumnFilter, Row, Table, flexRender } from "@tanstack/react-table";
import { Button } from "components/ui/button";
import {
  ExaminationTableData,
  ExaminationWithPatient,
} from "features/examination/types/types";
import { ScanSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type MobileExaminationListProps = {
  tableInstance?: Table<ExaminationWithPatient>;
  filters: ColumnFilter[];
  data: ExaminationTableData[];
};
const MobileExaminationList = ({
  tableInstance,
  filters,
  data,
}: MobileExaminationListProps) => {
  const [rows, setRows] = useState<Row<ExaminationWithPatient>[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (tableInstance) {
      setRows(tableInstance.getRowModel().rows);
    }
  }, [filters, data, page]);

  const hide = ["Id", "select", "number_of_sets", "number_of_repetitions"];

  return (
    <div className="xl:hidden">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.id}
            className="relative rounded border border-primary p-4"
          >
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2">
              {row.getVisibleCells().map((cell) => {
                let header =
                  typeof cell.column.columnDef.header !== "function"
                    ? cell.column.columnDef.header
                    : cell.column.id;

                if (hide.includes(header ?? "")) {
                  return null;
                }

                if (header === "actions") {
                  return (
                    <div key={cell.id} className="absolute right-2 top-2 flex">
                      <Link
                        to={"/examination/" + row.original.id}
                        target="_blank"
                      >
                        <ScanSearch className="duration-300 hover:scale-110" />
                      </Link>
                      <div>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={cell.id}>
                    <div>{header}</div>
                    <div className="font-semibold">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 pr-4">
        <p>{tableInstance?.getRowCount()}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            tableInstance?.previousPage();
            setPage(page - 1);
          }}
          disabled={!tableInstance?.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            tableInstance?.nextPage();
            setPage(page + 1);
          }}
          disabled={!tableInstance?.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default MobileExaminationList;
