/*
 * Název souboru:    IsokineticComparison.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení detailu porovnání izokinetických vyšetření
 */

import CompChartWithControls from "components/CompChartWithControls";
import { useState } from "react";
import useAveragesByExamination from "../hooks/useAveragesByExamination";
import IsokineticChart from "./charts/IsokineticChart/IsokineticChart";
import useIsokineticResults from "../hooks/useIsokineticResults";
import { getIsokineticYTicks } from "../utils/isokineticChart";
import IsokineticResults from "./IsokineticResults/IsokineticResults";
import { useCurrentComparisonStore } from "../store/currentComparisonStore";
type IsokineticComparisonProps = {
  onlyIsokinetic: boolean;
  setOnlyIsokinetic: React.Dispatch<React.SetStateAction<boolean>>;
  setEdited: React.Dispatch<React.SetStateAction<boolean>>;
};
const IsokineticComparison = ({
  onlyIsokinetic,
  setOnlyIsokinetic,
  setEdited,
}: IsokineticComparisonProps) => {
  const [offset, setOffset] = useState<number | null>(20);

  const {
    examinations,
    repetitions: repetitionsByExamination,
    type,
  } = useCurrentComparisonStore();

  const averagesByExamination = useAveragesByExamination({
    examinations,
    repetitions: repetitionsByExamination,
  });

  const tableData = useIsokineticResults({
    examinations,
    averagesByExamination,
    offset,
    onlyIsokinetic,
  });

  const yTicks = getIsokineticYTicks(averagesByExamination, type);

  const handleTorqOffChange = (value: number | null) => {
    setOffset(value);
  };

  const handleOnlyIsokineticChange = (value: boolean) => {
    setOnlyIsokinetic(value);
    setEdited(true);
  };

  if (examinations.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-500 bg-opacity-35 text-5xl">
        No data
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-between gap-y-2 bg-background">
      <div className="">
        <IsokineticResults
          tableData={tableData}
          offset={offset}
          onOffsetChange={handleTorqOffChange}
          onlyIsokinetic={onlyIsokinetic}
          onOnlyIsokineticChange={handleOnlyIsokineticChange}
        />
      </div>

      <div className="flex h-full flex-col justify-between gap-4 lg:flex-row">
        <div className="min-h-[250px] max-w-[600px] flex-1 rounded-lg border-2 border-primary">
          <CompChartWithControls type="M1" label="M1's">
            <IsokineticChart
              type="M1"
              chartData={averagesByExamination}
              yTicks={yTicks}
            />
          </CompChartWithControls>
        </div>

        <div className="min-h-[250px] max-w-[600px] flex-1 rounded-lg border-2 border-primary">
          <CompChartWithControls type="M2" label="M2's">
            <IsokineticChart
              type="M2"
              chartData={averagesByExamination}
              yTicks={yTicks}
            />
          </CompChartWithControls>
        </div>
      </div>
    </div>
  );
};

export default IsokineticComparison;
