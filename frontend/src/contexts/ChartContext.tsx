/*
 * Název souboru:    ChartContext.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Soubor obsahující kontext pro sdílení stavu grafu.
 */

import {
  ExaminationWithPatient,
  HideSide,
} from "features/examination/types/types";
import { createContext, useContext } from "react";

type ChartContextType = {
  showTooltip: boolean;
  hideSide: HideSide;
  onShowTooltip: () => void;
  onHideSide: (hideSide: HideSide) => void;
  examination: ExaminationWithPatient;
  dialogRef?: React.ForwardedRef<HTMLDialogElement>;
};

export const ChartContext = createContext<ChartContextType | undefined>(
  undefined,
);

export const useChartContext = () => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChartContext must be used within a ChartProvider");
  }
  return context;
};
