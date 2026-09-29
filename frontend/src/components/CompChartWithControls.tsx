/*
 * Název souboru:    CompChartWithControls.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro graf porovnání s ovládacími prvky, využívá kontext pro
 *                   sdílení stavu grafu
 */

import { CompChartContext } from "contexts/CompChartContext";
import ChartControls from "features/comparison/components/charts/ChartControls";
import { ReactNode, useState } from "react";
import { MeasurementPhase } from "types/types";
import { memo } from "react";
import { IdToHide } from "features/comparison/types/types";
type CompChartWithControlsProps = {
  type: MeasurementPhase;
  children: ReactNode;
  linesToHide?: string[];
  label?: string;
};

const CompChartWithControls = ({
  type,
  children,
  linesToHide = [],
  label,
}: CompChartWithControlsProps) => {
  const [idsToHide, setIdsToHide] = useState<IdToHide[]>([]);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);

  const handleIdsToHideChange = (toHide: IdToHide[]) => {
    setIdsToHide(toHide);
  };
  const handleShowTooltip = () => {
    setShowTooltip((prevState) => !prevState);
  };

  return (
    <CompChartContext.Provider
      value={{
        type,
        showTooltip,
        idsToHide,
        linesToHide,
        onShowTooltip: handleShowTooltip,
        onIdsToHideChange: handleIdsToHideChange,
      }}
    >
      <div className="flex h-full flex-col">
        <ChartControls label={label} />

        {children}
      </div>
    </CompChartContext.Provider>
  );
};

export default memo(CompChartWithControls);
