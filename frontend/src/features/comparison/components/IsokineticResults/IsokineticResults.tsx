/*
 * Název souboru:    IsokineticResults.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení tabulky výsledků isokinetických vyšetření, včetně
 *                   tabulky pro porovnání výsledků dvou vyšetření
 */

import { useEffect, useState } from "react";
import CompareTable from "./IsokineticCompareTable";
import { IsokineticResultsByExamination } from "features/comparison/types/types";
import TableSlider from "components/TableSlider";
import ComparisonTable from "./IsokineticComparisonTable";
import RowDescriptions from "../RowDescription";
import ResultsControls from "../../../../components/ResultsControls";
import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";

interface IsokineticResultsProps {
  tableData: IsokineticResultsByExamination[];
  offset: number | null;
  onOffsetChange: (value: number | null) => void;
  onlyIsokinetic: boolean;
  onOnlyIsokineticChange: (value: boolean) => void;
}
const IsokineticResults = ({
  tableData,
  offset,
  onOffsetChange,
  onlyIsokinetic,
  onOnlyIsokineticChange,
}: IsokineticResultsProps) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const { examinations, type } = useCurrentComparisonStore();
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 880) {
        setItemsPerView(1);
      } else if (width < 1425) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);

    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg border-primary bg-primary py-1 text-base sm:flex-row">
      <div className="flex h-full w-fit justify-center px-4">
        <RowDescriptions
          hoveredRow={hoveredRow}
          setHoveredRow={setHoveredRow}
          type={type}
          offset={offset}
        />
      </div>

      <div className="border-x border-gray-300 px-2">
        <TableSlider
          tableData={tableData}
          itemsPerView={itemsPerView}
          renderItem={(data, index) => {
            const examination = examinations.find(
              (e) => e.data.id === data.examination_id && e.set === data.set,
            );

            if (!examination) return null;

            return (
              <ComparisonTable
                key={index}
                data={data.data}
                examination={examination}
                setHoveredRow={setHoveredRow}
                hoveredRow={hoveredRow}
              />
            );
          }}
        />
      </div>

      <div className="flex min-w-fit justify-center px-4">
        <CompareTable
          tableData={tableData}
          hoveredRow={hoveredRow}
          setHoveredRow={setHoveredRow}
        />
      </div>
      <div className="ml-auto flex h-full flex-col justify-start">
        <ResultsControls
          offset={offset}
          onOffsetChange={onOffsetChange}
          onlyIsokinetic={onlyIsokinetic}
          onOnlyIsokineticChange={onOnlyIsokineticChange}
          type={type}
        />
      </div>
    </div>
  );
};

export default IsokineticResults;
