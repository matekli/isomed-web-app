/*
 * Název souboru:    SelectableExaminationChart.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení interaktivního grafu vyšetření, který umožňuje uživateli
 *                   vybírat opakování kliknutím na graf.
 */

import { ExaminationWithPatient } from "features/examination/types/types";
import { ChartData, Repetition } from "types/types";
import { useRef } from "react";
import { CategoricalChartState } from "recharts/types/chart/types";
import ChartWithControls from "components/ChartWithControls";
import IsokineticChart from "features/examination/components/charts/IsokineticChart";
import { getBounds } from "features/examination/utils/isokinetic";

type SelectableExaminationChartProps = {
  examination: ExaminationWithPatient;
  repetitions: Repetition[];
  selectedRepetitions: Repetition[];
  chartData: ChartData[];
  setSelectedRepetitions: React.Dispatch<React.SetStateAction<Repetition[]>>;
  dialogRef: React.ForwardedRef<HTMLDialogElement>;
};
const SelectableExaminationChart = ({
  examination,
  repetitions,
  selectedRepetitions,
  chartData,
  setSelectedRepetitions,
  dialogRef,
}: SelectableExaminationChartProps) => {
  const lastMouseX = useRef<number | undefined>(0);

  const handleMouseDown = (event: CategoricalChartState) => {
    const initialMouseX = event.chartX;
    lastMouseX.current = initialMouseX;
  };

  const handleMouseUp = (event: CategoricalChartState) => {
    if (repetitions.length <= 2) {
      return;
    }

    if (event.chartX === lastMouseX.current) {
      if (event.activePayload && event.activePayload.length > 0) {
        const time = event.activePayload[0].payload.time;

        for (let index = 0; index < repetitions.length; index++) {
          const element = repetitions[index];
          const lastIndex = element.measurements.length - 1;
          if (time <= element.measurements[lastIndex].time) {
            if (!selectedRepetitions.includes(element)) {
              setSelectedRepetitions([...selectedRepetitions, element]);
            } else {
              setSelectedRepetitions(
                selectedRepetitions.filter((item) => item !== element),
              );
            }
            index = repetitions.length;
          }
        }
      }
    }
  };

  return (
    <ChartWithControls
      key={chartData.length}
      examination={examination}
      dialogRef={dialogRef}
    >
      <IsokineticChart
        chartData={chartData}
        examination={examination}
        area={getBounds(
          repetitions.filter((rep) => selectedRepetitions.includes(rep)),
        )}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </ChartWithControls>
  );
};

export default SelectableExaminationChart;
