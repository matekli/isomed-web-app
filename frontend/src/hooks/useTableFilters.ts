/*
 * Název souboru:    useTableFilters.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro správu stavu filtrů
 */

import { useState, useEffect } from "react";
import { ColumnFilter } from "@tanstack/react-table";
import { handleFilterChange } from "utils/table-utils";
import { useLocation } from "react-router-dom";

export const useTableFilters = () => {
  const [filters, setFilters] = useState<ColumnFilter[]>([]);
  const location = useLocation();
  const { id } = location.state || {};

  useEffect(() => {
    handleFilterChange(setFilters, "groups", id);
  }, [id]);

  return {
    filters,
    setFilters,
  };
};
