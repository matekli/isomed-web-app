/*
 * Název souboru:    ChartWithControls.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro graf s ovládacími prvky, využívá kontext pro
 *                   sdílení stavu grafu
 */

import { ChartContext } from "contexts/ChartContext";
import ChartControls from "features/examination/components/charts/ChartControls";
import {
  ExaminationWithPatient,
  HideSide,
} from "features/examination/types/types";
import { ReactNode, useState } from "react";

type ChartWithControlsProps = {
  examination: ExaminationWithPatient;
  dialogRef?: React.ForwardedRef<HTMLDialogElement>;
  children: ReactNode;
};

const ChartWithControls = ({
  examination,
  dialogRef,
  children,
}: ChartWithControlsProps) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const [hideSide, setHideSide] = useState<HideSide>({
    left: false,
    right: false,
    main: false,
  });

  const handleShowTooltip = () => {
    setShowTooltip((prevState) => !prevState);
  };

  const handleHideSide = (hideSide: HideSide) => {
    setHideSide(hideSide);
  };

  return (
    <ChartContext.Provider
      value={{
        showTooltip,
        examination,
        hideSide,
        onShowTooltip: handleShowTooltip,
        onHideSide: handleHideSide,
        dialogRef,
      }}
    >
      <div className="flex h-full flex-col">
        <ChartControls />

        {children}
      </div>
    </ChartContext.Provider>
  );
};

export default ChartWithControls;
