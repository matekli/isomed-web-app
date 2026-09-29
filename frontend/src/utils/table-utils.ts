/*
 * Název souboru:    table-utils.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Pomocná funkce pro obsluhu filtrů pro tabulku
 */

import { ColumnFilter } from "@tanstack/react-table";

export const handleFilterChange = (
  setFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>,
  id: string,
  value: string,
) => {
  setFilters((prev) => {
    const updatedFilters = prev.filter((filter) => filter.id !== id);
    if (value) {
      updatedFilters.push({ id, value });
    }
    return updatedFilters;
  });
};

export const getFilterValue = (filters: ColumnFilter[], id: string): string => {
  return filters.find((filter) => filter.id === id)?.value?.toString() || "";
};
