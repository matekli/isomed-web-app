/*
 * Název souboru:    CompChartContext.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Soubor obsahující kontext pro sdílení stavu grafu porovnání.
 */

import { IdToHide } from "features/comparison/types/types";
import { createContext, useContext } from "react";
import { MeasurementPhase } from "types/types";

type CompChartContextType = {
  type: MeasurementPhase;
  showTooltip: boolean;
  idsToHide: { id: string; set: number }[];
  linesToHide: string[];
  onIdsToHideChange: (toHide: IdToHide[]) => void;
  onShowTooltip: () => void;
};

export const CompChartContext = createContext<CompChartContextType | undefined>(
  undefined,
);

export const useCompChartContext = () => {
  const context = useContext(CompChartContext);
  if (!context) {
    throw new Error("useCompChartContext must be used within a ChartProvider");
  }
  return context;
};
