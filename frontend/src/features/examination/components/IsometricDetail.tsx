/*
 * Název souboru:    IsometricDetail.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení detailu isometrického vyšetření
 */

import { Measurement } from "types/types";
import { ExaminationWithPatient } from "../types/types";
import useIsometricSets from "hooks/useIsometricSets";
import { useState } from "react";
import IsometricResults from "./IsometricResults.tsx/IsometricResults";
import { useIsometricResults } from "../hooks/useIsometricResults";
import Controls from "./Controls";
import { useComparison } from "features/comparison/hooks/useComparison";
import { Comparison } from "features/comparison/types/types";
import IsometricPeakChart from "./charts/IsometricPeakChart";
import ChartWithControls from "components/ChartWithControls";
import IsometricChart from "./charts/IsometricChart";
import ExaminationInfo from "./ExaminationInfo";
import { getIsometricChartData } from "../utils/isometric";

type IsometricDetailProps = {
  examination: ExaminationWithPatient;
  measurements: Measurement[];
};

const IsometricDetail = ({
  examination,
  measurements,
}: IsometricDetailProps) => {
  const [currentSet, setCurrentSet] = useState(1);
  const [timeOffset, setTimeOffset] = useState<number | null>(100);

  const sets = useIsometricSets({ examination, measurements });

  const chartData = getIsometricChartData(sets, currentSet);

  const results = useIsometricResults({ sets, examination, timeOffset });

  const handleScrollPrev = () => {
    setCurrentSet(currentSet - 1);
  };

  const handleScrollNext = () => {
    setCurrentSet(currentSet + 1);
  };

  const { addComparison } = useComparison();

  const handleAddComparison = () => {
    const comp: Comparison = {
      id: examination.id,
      repetitionsToDelete: [],
      set: currentSet,
      type: "isometric",
      joint: examination.joint,
    };
    addComparison(comp);
  };

  const handleOffsetChange = (value: number | null) => {
    setTimeOffset(value);
  };

  const peakChartData = results.map((r) => {
    return {
      peak: r.data.maxTorque,
      angle: r.data.holdAngle,
      current_set: r.set,
    };
  });

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4 text-fluid-base xl:grid xl:grid-cols-12 xl:grid-rows-9">
      <div className="rounded-lg border-2 border-solid border-primary xl:col-span-6 xl:row-span-4">
        <ExaminationInfo examination={examination} />
      </div>

      <div className="max-h-[450px] w-full rounded-lg border-2 border-solid border-primary xl:col-span-5 xl:row-span-4">
        <ChartWithControls examination={examination}>
          <IsometricPeakChart
            data={peakChartData}
            examination={examination}
            current_set={currentSet}
          />
        </ChartWithControls>
      </div>
      <div className="rounded-lg bg-primary xl:row-span-4">
        <Controls
          examination={examination}
          onAddComparison={handleAddComparison}
          onOffsetChange={handleOffsetChange}
          offset={timeOffset}
        />
      </div>
      <div className="w-full rounded-lg border-2 border-solid border-primary xl:col-span-8 xl:row-span-5 xl:h-full">
        <ChartWithControls examination={examination}>
          <IsometricChart chartData={chartData} examination={examination} />
        </ChartWithControls>
      </div>
      <div className="rounded-lg border-2 border-solid border-primary bg-primary xl:col-span-4 xl:row-span-5">
        <IsometricResults
          data={results}
          examination={examination}
          onScrollPrev={handleScrollPrev}
          onScrollNext={handleScrollNext}
          offset={timeOffset}
        />
      </div>
    </div>
  );
};

export default IsometricDetail;
