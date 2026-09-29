/*
 * Název souboru:    useComparisonhandlers.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook který poskytuje funkce pro operace na seznamy
 *                   porovnání a jednotlivými porovnáními
 */

import { Comparison, ComparisonList } from "../types/types";

export const useComparisonHandlers = (
  updateComparison: (comp: Comparison, index: number) => void,
  removeComparison: (id: string, set: number, index: number) => void,
  removeComparisonList: (index: number) => void,
  comparisons: ComparisonList[],
) => {
  const handleDeleteComparison = (id: string, set: number, index: number) => {
    removeComparison(id, set, index);
  };

  const handleReset = (comparison: Comparison, index: number) => {
    const updatedComp = { ...comparison, repetitionsToDelete: [] };
    updateComparison(updatedComp, index);
  };

  const handleDeleteComparisonList = (index: number) => {
    removeComparisonList(index);
  };

  const goToDetail = (index: number) => {
    const comp = comparisons.find((c) => c.index === index);
    const queryString = encodeURIComponent(JSON.stringify(comp?.comparisons));
    return `/comparison/${queryString}`;
  };

  return {
    handleDeleteComparison,
    handleDeleteComparisonList,
    handleReset,
    goToDetail,
  };
};
