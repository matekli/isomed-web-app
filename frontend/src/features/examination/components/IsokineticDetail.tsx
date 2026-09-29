/*
 * Název souboru:    IsokineticDetail.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení detailu isokinetického vyšetření
 */

import { Comparison } from "features/comparison/types/types";
import { useChartData } from "hooks/useChartData";
import { useDialog } from "hooks/useDialog";
import useRepetitions from "hooks/useRepetitions";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsokineticResults } from "../hooks/useIsokineticResults";
import { ExaminationWithPatient, testModes } from "../types/types";
import { Measurement } from "types/types";
import RepetitionSelectionDialog from "components/RepetitionSelectionDialog/RepetitionSelectionDialog";
import ResultsSummary from "./Summary/Summary";
import Controls from "./Controls";
import ChartWithControls from "components/ChartWithControls";
import IsokineticChart from "./charts/IsokineticChart";
import ExaminationInfo from "./ExaminationInfo";
import { useComparison } from "features/comparison/hooks/useComparison";
import IsokineticResults from "./IsokineticResults/IsokineticResults";
import { isAthletic, isIsometric } from "utils/utils";
import { getBounds } from "../utils/isokinetic";

import { NUMBER_OF_TABLES } from "constants/constants";
import { useComparisonStore } from "features/comparison/store/comparisonStore";

type IsokineticDetailProps = {
  examination: ExaminationWithPatient;
  measurements: Measurement[];
};
const IsokineticDetail = ({
  examination,
  measurements,
}: IsokineticDetailProps) => {
  const navigate = useNavigate();

  const [tableDataStart, setTableDataStart] = useState(0);
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [offset, setOffset] = useState<number | null>(0);
  const [onlyIsokinetic, setOnlyIsokinetic] = useState<boolean>(true);
  const [itemPerView, setItemsPerView] = useState(NUMBER_OF_TABLES);

  const { setLoaded } = useComparisonStore();
  const { dialogRef, isDialogOpened, toggleDialog } = useDialog();
  const { addComparison } = useComparison();

  const repetitions = useRepetitions({ measurements, examination, currentSet });

  const chartData = useChartData({
    repetitions,
    examination,
  });

  const tableData = useIsokineticResults({
    repetitions: repetitions,
    examination,
    offset,
    onlyIsokinetic,
  });

  const handleScrollPrev = () => {
    setTableDataStart(tableDataStart - 2);
  };

  const handleScrollNext = () => {
    setTableDataStart(tableDataStart + 2);
  };

  const handleSubmitDialog = (deletedRepetitions: number[]) => {
    const comparison: Comparison[] = [
      {
        id: examination.id,
        repetitionsToDelete: deletedRepetitions,
        set: currentSet,
        type:
          examination.test_mode === testModes.ATHLETIC
            ? "athletic"
            : "isokinetic",
        joint: examination.joint,
      },
    ];

    const queryString = encodeURIComponent(JSON.stringify(comparison));
    toggleDialog();

    setLoaded(false);
    navigate(`/comparison/${queryString}`);
  };

  const handleAverage = () => {
    toggleDialog();
  };

  const handleAddComparison = () => {
    const comp: Comparison = {
      id: examination.id,
      repetitionsToDelete: [],
      set: currentSet,
      type: isIsometric(examination)
        ? "isometric"
        : isAthletic(examination)
          ? "athletic"
          : "isokinetic",
      joint: examination.joint,
    };
    addComparison(comp);
  };

  const handleTorqOffChange = (value: number | null) => {
    setOffset(value);
  };

  const handleOnlyIsokineticChange = (value: boolean) => {
    setOnlyIsokinetic(value);
  };

  const handleItemsPerViewChange = (itemPerView: number) => {
    setItemsPerView(itemPerView);
  };

  useEffect(() => {
    setTableDataStart(0);
  }, [tableData]);

  return (
    <>
      <div className="mx-auto flex h-full w-full max-w-[1920px] flex-col gap-4 border-x border-gray-400 bg-background p-1 text-fluid-base xl:grid xl:grid-cols-12 xl:grid-rows-9 xl:p-4">
        <div className="col-span-6 row-span-3 flex w-full gap-x-4">
          <div className="max-w-1/2 order-1 w-full rounded-lg border-2 border-solid border-primary xl:order-1">
            <ExaminationInfo examination={examination} />
          </div>
        </div>

        <div className="col-span-5 row-span-3 hidden w-full rounded-lg border-2 border-solid border-primary bg-primary sm:block xl:order-2">
          <ResultsSummary examination={examination} results={tableData} />
        </div>
        <div className="row-span-3 rounded-lg border-2 border-solid border-primary bg-primary xl:order-3">
          <Controls
            examination={examination}
            currentSet={currentSet}
            onAverage={handleAverage}
            onAddComparison={handleAddComparison}
            onPreviousSet={() => {
              setCurrentSet(currentSet - 1);
              setTableDataStart(0);
            }}
            onNextSet={() => {
              setCurrentSet(currentSet + 1);
              setTableDataStart(0);
            }}
            offset={offset}
            onOffsetChange={handleTorqOffChange}
          />
        </div>

        <div
          id="my-chart"
          className="col-span-7 row-span-6 min-h-[66%] w-full rounded-lg border-2 border-solid border-primary xl:order-4 xl:h-full"
        >
          <ChartWithControls examination={examination}>
            <IsokineticChart
              chartData={chartData}
              examination={examination}
              area={getBounds(
                repetitions.slice(
                  tableDataStart,
                  tableDataStart + itemPerView * 2,
                ),
              )}
            />
          </ChartWithControls>
        </div>

        <div className="col-span-5 row-span-6 rounded-lg border-2 border-solid border-primary bg-primary xl:order-5">
          <IsokineticResults
            tableData={tableData}
            examination={examination}
            onScrollPrev={handleScrollPrev}
            onScrollNext={handleScrollNext}
            offset={offset}
            onlyIsokinetic={onlyIsokinetic}
            onOnlyIsokineticChange={handleOnlyIsokineticChange}
            onItemsPerViewChange={handleItemsPerViewChange}
          />
        </div>
      </div>

      <RepetitionSelectionDialog
        examination={examination}
        repetitions={repetitions}
        toggleDialog={toggleDialog}
        ref={dialogRef}
        isDialogOpened={isDialogOpened}
        submitDialog={handleSubmitDialog}
      />
    </>
  );
};

export default IsokineticDetail;
