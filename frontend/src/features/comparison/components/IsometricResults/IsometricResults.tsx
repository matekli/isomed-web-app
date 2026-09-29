/*
 * Název souboru:    IsokineticResults.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení tabulky výsledků isometrických vyšetření, včetně
 *                   tabulky pro porovnání výsledků dvou vyšetření
 */

import TableSlider from "components/TableSlider";
import { useState } from "react";
import IsometricCompareTable from "./IsometricCompareTable";
import { IsometricResultsByExamination } from "features/comparison/types/types";
import IsometricComparisonTable from "./IsometricComparisonTable";
import RowDescriptions from "../RowDescription";
import ResultsControls from "../../../../components/ResultsControls";
import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";

type IsometricResults = {
  tableData: IsometricResultsByExamination[][];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  offset: number | null;
  onOffsetChange: (value: number | null) => void;
};
const IsometricResults = ({
  tableData,
  currentIndex,
  onIndexChange,
  offset,
  onOffsetChange,
}: IsometricResults) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const { examinations, type } = useCurrentComparisonStore();

  const handleScrollNext = (index: number) => {
    onIndexChange(index);
  };

  const handleScrollPrev = (index: number) => {
    onIndexChange(index);
  };

  return (
    <div className="flex h-full w-full flex-col items-center rounded-lg border-primary bg-primary text-base lg:flex-row">
      <div className="flex w-fit justify-center px-4">
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
          itemsPerView={1}
          onScrollNext={handleScrollNext}
          onScrollPrev={handleScrollPrev}
          renderItem={(data) => {
            return (
              <div className="grid h-full w-full grid-flow-col">
                {data.map((item) => {
                  const examination = examinations.find(
                    (e) => e.data.id === item.examination_id,
                  );

                  if (!examination) return null;
                  return (
                    <IsometricComparisonTable
                      key={item.examination_id}
                      data={item.data}
                      examination={examination.data}
                      setHoveredRow={setHoveredRow}
                      hoveredRow={hoveredRow}
                    />
                  );
                })}
              </div>
            );
          }}
        />
      </div>

      <div className="flex min-w-fit justify-center px-4">
        <IsometricCompareTable
          tableData={tableData[currentIndex]}
          hoveredRow={hoveredRow}
          setHoveredRow={setHoveredRow}
        />
      </div>
      <div className="ml-auto flex h-full flex-col justify-start">
        <ResultsControls
          offset={offset}
          onOffsetChange={onOffsetChange}
          type={type}
        />
      </div>
    </div>
  );
};

export default IsometricResults;
