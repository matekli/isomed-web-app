/*
 * Název souboru:    IsometricComparison.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení detailu porovnání isometrických vyšetření
 */

import CompChartWithControls from "components/CompChartWithControls";
import IsometricChart from "./charts/IsometricChart";
import IsometricPeakChart from "./charts/IsometricPeakChart";
import { useEffect, useState } from "react";
import { getIsometricYTicks } from "../utils/isometricChart";
import useIsometricResults from "../hooks/useIsometricResults";
import IsometricResults from "./IsometricResults/IsometricResults";
import { useCurrentComparisonStore } from "../store/currentComparisonStore";

const IsometricComparison = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [offset, setOffset] = useState<number | null>(1000);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { examinations, isometricSets } = useCurrentComparisonStore();

  const tableData = useIsometricResults({
    examinations,
    isometricSets,
    offset,
  });

  const handleIndexChange = (index: number) => {
    setCurrentIndex(index);
  };

  const linesToHide = examinations
    ?.map((e) => e.data.id)
    .filter((id) => !selectedIds.has(id));

  const yTicks = getIsometricYTicks(tableData);

  const handleTorqOffChange = (value: number | null) => {
    setOffset(value);
  };

  // Prenastavení current index když je index vetší než délka tableData
  // To se může stát když je na posledním indexu slideru a vymaže se nějaké vyšetření
  // Dále se zde nastavují selectedIds (to jsou aktualní vyšetření, které jdou vidět ve slideru)
  useEffect(() => {
    if (currentIndex >= tableData.length) {
      const newIndex = tableData.length - 1;
      setCurrentIndex(newIndex < 0 ? 0 : newIndex);
      return;
    }

    const newSelectedIds = new Set<string>();
    currentData.forEach((m) => newSelectedIds.add(m.examination_id));
    setSelectedIds(newSelectedIds);
  }, [tableData, currentIndex]);

  const currentData = tableData[currentIndex];
  const hasValidData = currentData && currentData.length > 0;

  if (examinations.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-500 bg-opacity-35 text-5xl">
        No data
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-2 gap-x-4 bg-background px-2 xl:grid xl:grid-cols-8 xl:grid-rows-7">
      <div className="xl:col-span-8 xl:row-span-4">
        <IsometricResults
          tableData={tableData}
          currentIndex={currentIndex}
          onIndexChange={handleIndexChange}
          offset={offset}
          onOffsetChange={handleTorqOffChange}
        />
      </div>

      <div className="flex w-full flex-col gap-4 lg:col-span-8 lg:row-span-3 lg:flex-row">
        <div className="min-h-[250px] w-full max-w-[600px] rounded-lg border-2 border-primary">
          {hasValidData && (
            <CompChartWithControls
              type="M1"
              linesToHide={linesToHide}
              label="ISOMETRIC"
            >
              <IsometricChart
                currentData={tableData[currentIndex]}
                yTicks={yTicks}
              />
            </CompChartWithControls>
          )}
        </div>

        <div className="min-h-[250px] w-full max-w-[600px] rounded-lg border-2 border-primary">
          {hasValidData && (
            <CompChartWithControls type="M1" label="PEAKS">
              <IsometricPeakChart
                data={tableData}
                index={currentIndex}
                yTicks={yTicks}
              />
            </CompChartWithControls>
          )}
        </div>
      </div>
    </div>
  );
};

export default IsometricComparison;
