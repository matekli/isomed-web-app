/*
 * Název souboru:    IsokineticResults.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení tabulky výsledků isokinetického vyšetření
 */

import {
  IsokineticResultsData,
  ExaminationWithPatient,
} from "features/examination/types/types";
import ExaminationResultsHeaders from "./IsokineticResultsHeaders";
import TableSlider from "components/TableSlider";
import ExaminationResultsTable from "./IsokineticResultsTable";
import ResultsControls from "components/ResultsControls";
import { isAthletic } from "utils/utils";
import { useState, useEffect } from "react";

type IsokineticResultsProps = {
  tableData: IsokineticResultsData[];
  examination: ExaminationWithPatient;
  onScrollPrev: (step: number) => void;
  onScrollNext: (step: number) => void;
  offset: number | null;
  onlyIsokinetic: boolean;
  onOnlyIsokineticChange: (value: boolean) => void;
  onItemsPerViewChange: (itemsPerView: number) => void;
};
const IsokineticResults = ({
  tableData,
  examination,
  onScrollPrev,
  onScrollNext,
  offset,
  onlyIsokinetic,
  onOnlyIsokineticChange,
  onItemsPerViewChange,
}: IsokineticResultsProps) => {
  const [itemsPerView, setItemsPerView] = useState(2);

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerView(1);
        onItemsPerViewChange(1);
      } else if (width < 1425) {
        setItemsPerView(2);
        onItemsPerViewChange(2);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);

    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const type = isAthletic(examination) ? "athletic" : "isokinetic";
  return (
    <div className="flex h-full w-full items-center px-1">
      <div className="flex justify-center px-2">
        <ExaminationResultsHeaders examination={examination} offset={offset} />
      </div>
      <div className="px-1">
        <TableSlider
          tableData={tableData}
          itemsPerView={itemsPerView}
          onScrollPrev={() => onScrollPrev(itemsPerView)}
          onScrollNext={() => onScrollNext(itemsPerView)}
          scrollOnDataChange={true}
          renderItem={(data, index) => {
            if (!data || !data.repetition) {
              return null;
            }
            return (
              <ExaminationResultsTable
                key={index}
                tableData={data}
                examination={examination}
              />
            );
          }}
        />
      </div>
      <div className="ml-auto flex h-full flex-col justify-start">
        <ResultsControls
          onlyIsokinetic={onlyIsokinetic}
          onOnlyIsokineticChange={onOnlyIsokineticChange}
          type={type}
        />
      </div>
    </div>
  );
};

export default IsokineticResults;
