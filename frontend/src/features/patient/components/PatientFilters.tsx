/*
 * Název souboru:    PatientFilters.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Filtry pro seznam pacientů
 */

import { ColumnFilter } from "@tanstack/react-table";
import { Group } from "features/group/types/types";
import { FilterVisibility } from "types/types";
import { getFilterValue, handleFilterChange } from "utils/table-utils";

interface PatientFiltersProps {
  filters: ColumnFilter[];
  setFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
  groups?: Group[];
  filterVisibility?: FilterVisibility;
}

interface FilterByPatientProps {
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

const PatientFilters = ({
  filters,
  setFilters,
  groups,
}: PatientFiltersProps) => (
  <div className="mb-2 flex flex-wrap gap-4">
    <FilterByName filters={filters} setFilters={setFilters} />
    <FilterByGroup filters={filters} setFilters={setFilters} groups={groups} />
  </div>
);

const FilterByName = ({
  filters,
  setFilters,
  filterVisibility,
}: FilterByPatientProps) => {
  if (filterVisibility?.name === false) return null;
  return (
    <input
      placeholder="Filter by name"
      value={getFilterValue(filters, "name")}
      onChange={(e) => handleFilterChange(setFilters, "name", e.target.value)}
      className="w-48 rounded border p-2"
    />
  );
};

const FilterByGroup = ({
  filters,
  setFilters,
  groups,
  filterVisibility,
}: FilterByGroupProps) => {
  if (filterVisibility?.patient_groups === false) return null;
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

export default PatientFilters;
