/*
 * Název souboru:    ExaminationFilters.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Filtry pro seznam vyšetření
 */

import { ColumnFilter } from "@tanstack/react-table";
import {
  IsometricPlaneOptions,
  JointOptions,
  OtherPlaneOptions,
  PlaneOption,
  TestModeOptions,
} from "constants/constants";
import { FilterVisibility } from "types/types";
import { getFilterValue, handleFilterChange } from "utils/table-utils";
import { useState } from "react";
import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { convertPlane } from "utils/converting";
import { ChevronDown } from "lucide-react";
import { getDemappedPlane } from "utils/converting";
import { Group } from "features/group/types/types";
import { ExaminationTableData } from "features/examination/types/types";

interface ExaminationFiltersProps {
  filters: ColumnFilter[];
  setFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
  groups?: Group[];
  filterVisibility?: FilterVisibility;
  data?: ExaminationTableData[];
}

interface FilterByPatientProps {
  filters: ColumnFilter[];
  setFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
  filterVisibility?: FilterVisibility;
}

interface FilterById {
  filters: ColumnFilter[];
  setFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
  filterVisibility?: FilterVisibility;
}

interface FilterByPlaneProps {
  filters: ColumnFilter[];
  setFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
  filterVisibility?: FilterVisibility;
  data?: ExaminationTableData[];
}

interface FilterByJointProps {
  filters: ColumnFilter[];
  setFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
  filterVisibility?: FilterVisibility;
}

interface FilterByTestModeProps {
  filters: ColumnFilter[];
  setFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
  filterVisibility?: FilterVisibility;
}

interface FilterByGroupProps {
  filters: ColumnFilter[];
  setFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
  groups: Group[] | undefined;
  filterVisibility?: FilterVisibility;
}

const ExaminationFilters = ({
  filters,
  setFilters,
  groups,
  filterVisibility,
  data,
}: ExaminationFiltersProps) => (
  <div className="mb-2 flex flex-wrap gap-4">
    <FilterById
      filters={filters}
      setFilters={setFilters}
      filterVisibility={filterVisibility}
    />
    <FilterByPatient
      filters={filters}
      setFilters={setFilters}
      filterVisibility={filterVisibility}
    />
    <FilterByGroup
      filters={filters}
      setFilters={setFilters}
      groups={groups}
      filterVisibility={filterVisibility}
    />
    <FilterByJoint
      filters={filters}
      setFilters={setFilters}
      filterVisibility={filterVisibility}
    />
    <FilterByTestMode
      filters={filters}
      setFilters={setFilters}
      filterVisibility={filterVisibility}
    />
    <FilterByPlane
      filters={filters}
      setFilters={setFilters}
      filterVisibility={filterVisibility}
      data={data}
    />
  </div>
);

const FilterByPatient = ({
  filters,
  setFilters,
  filterVisibility,
}: FilterByPatientProps) => {
  if (filterVisibility?.patient === false) return null;
  return (
    <input
      id="filter by patient"
      placeholder="Filter by patient"
      value={getFilterValue(filters, "patient")}
      onChange={(e) =>
        handleFilterChange(setFilters, "patient", e.target.value)
      }
      className="w-48 rounded border p-2"
    />
  );
};

const FilterById = ({
  filters,
  setFilters,
  filterVisibility,
}: FilterByPatientProps) => {
  if (filterVisibility?.id === false) return null;
  return (
    <input
      id="filter by ID"
      placeholder="Filter by ID"
      value={getFilterValue(filters, "id")}
      onChange={(e) => handleFilterChange(setFilters, "id", e.target.value)}
      className="w-48 rounded border p-2"
    />
  );
};

const FilterByPlane = ({
  filters,
  setFilters,
  filterVisibility,
  data,
}: FilterByPlaneProps) => {
  const [planeOptions, setPlaneOptions] =
    useState<PlaneOption[]>(OtherPlaneOptions);

  const isIsometric = planeOptions === IsometricPlaneOptions;

  const groupedCount = data?.reduce(
    (acc, item) => {
      const key = item.plane;

      if (acc[key]) {
        acc[key] += 1;
      } else {
        acc[key] = 1;
      }

      return acc;
    },
    {} as Record<string, number>,
  );

  const getPlaneFilterValue = () => {
    const filterValue = getFilterValue(filters, "plane");
    const testMode = isIsometric ? "6" : "";
    const demappedPlane = getDemappedPlane(filterValue, testMode);
    return filterValue
      ? convertPlane(demappedPlane, testMode)
      : "Filter by plane";
  };

  if (filterVisibility?.plane === false) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`border-1 flex h-11 w-48 items-center justify-between rounded border p-2 pr-0 font-light`}
        >
          <Button
            variant="ghost"
            className="p-0 text-[100%] font-normal hover:bg-white"
          >
            {getPlaneFilterValue()}
          </Button>
          <ChevronDown size={16} strokeWidth={3} />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="h-80 overflow-y-auto rounded-lg border bg-white"
      >
        <div className="flex gap-4 p-2">
          <Button
            variant="ghost"
            className={`w-full text-left ${isIsometric ? "bg-accent" : "bg-white"}`}
            onClick={() => {
              handleFilterChange(setFilters, "plane", "");
              setPlaneOptions(IsometricPlaneOptions);
            }}
          >
            Isometric
          </Button>

          <Button
            variant="ghost"
            className={`w-full text-left ${!isIsometric ? "bg-accent" : "bg-white"}`}
            onClick={() => {
              handleFilterChange(setFilters, "plane", "");
              setPlaneOptions(OtherPlaneOptions);
            }}
          >
            Other
          </Button>
        </div>

        {planeOptions.map((item, index) => {
          if (!groupedCount) {
            return null;
          }
          return (
            <DropdownMenuItem
              onClick={() =>
                handleFilterChange(setFilters, "plane", item.value)
              }
              key={index}
              className="block w-full p-2 text-left hover:bg-gray-100"
            >
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FilterByJoint = ({
  filters,
  setFilters,
  filterVisibility,
}: FilterByJointProps) => {
  if (filterVisibility?.test_mode === false) return null;

  return (
    <select
      className="w-48 rounded border p-2"
      value={getFilterValue(filters, "joint")}
      onChange={(e) => handleFilterChange(setFilters, "joint", e.target.value)}
    >
      <option value="" className="hover:bg-gray-100">
        Filter by joint
      </option>
      {JointOptions.map((item, index) => (
        <option key={index} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
};

const FilterByTestMode = ({
  filters,
  setFilters,
  filterVisibility,
}: FilterByTestModeProps) => {
  if (filterVisibility?.test_mode === false) return null;
  return (
    <select
      className="w-48 rounded border p-2"
      value={getFilterValue(filters, "test_mode")}
      onChange={(e) =>
        handleFilterChange(setFilters, "test_mode", e.target.value)
      }
    >
      <option value="" className="hover:bg-gray-100">
        Filter by test mode
      </option>
      {TestModeOptions.map((item, index) => (
        <option key={index} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
};

const FilterByGroup = ({
  filters,
  setFilters,
  groups,
  filterVisibility,
}: FilterByGroupProps) => {
  if (filterVisibility?.examination_groups === false) return null;
  return (
    <select
      className="w-48 rounded border p-2"
      value={getFilterValue(filters, "groups")}
      onChange={(e) => handleFilterChange(setFilters, "groups", e.target.value)}
    >
      <option value="">Filter by group</option>
      {groups &&
        groups.map((item, index) => (
          <option key={index} value={item.id}>
            {item.name}
          </option>
        ))}
    </select>
  );
};

export default ExaminationFilters;
