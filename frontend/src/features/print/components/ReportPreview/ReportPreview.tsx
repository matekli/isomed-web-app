/*
 * Název souboru:    ReportPreview.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Náhled exportované zprávy
 */

import React, { useMemo } from "react";
import { ExtendedResults, PrintResults, ReportData } from "../../types/types";
import { assignReportColors } from "utils/colors";
import IsokineticChart from "../IsokineticChart.tsx/IsokineticChart";
import useAveragesByExamination from "features/comparison/hooks/useAveragesByExamination";
import { getIsokineticYTicks } from "features/comparison/utils/isokineticChart";
import {
  Comparison,
  IndexedExamination,
  RepetitionsByExamination,
  TestType,
} from "features/comparison/types/types";
import Header from "./Header";
import Comment from "./Comment";
import useIsokineticResults from "features/comparison/hooks/useIsokineticResults";
import Results from "./Results";
import { getPlaneLabels } from "utils/converting";
import { evaluatePlane } from "features/comparison/utils/comparison";
import { formatRepetitions } from "utils/repetitions";
import usePrintResults from "../../hooks/usePrintResults";
type ReportPreviewProps = {
  reportData: ReportData;
  onlyIsokinetic: boolean;
  previewRef: React.RefObject<HTMLDivElement>;
  comparisons: Comparison[];
  examinations: IndexedExamination[];
  repetitions: RepetitionsByExamination[];
  examType: TestType;
};
const ReportPreview = ({
  reportData,
  onlyIsokinetic,
  previewRef,
  comparisons,
  examinations,
  repetitions,
  examType,
}: ReportPreviewProps) => {
  const colors = useMemo(() => assignReportColors(comparisons), [comparisons]);

  const averagesByExamination = useAveragesByExamination({
    examinations,
    repetitions,
  });

  const resultsFromAvgCurve = useIsokineticResults({
    examinations,
    averagesByExamination,
    onlyIsokinetic,
  });

  const resultsFromRepetitions = usePrintResults({
    examinations,
    repetitions,
    onlyIsokinetic,
  });

  const yTicks = getIsokineticYTicks(averagesByExamination, examType);

  const yLabel = examType === "athletic" ? "Force (N)" : "Torque (N*m)";

  const planes = getPlaneLabels(
    examinations[0].data.test_mode,
    examinations[0].data.plane,
  );

  const mergedResults: ExtendedResults[] = examinations.map((exam) => {
    // Najde odpovídající výsledky pro každé vyšetření
    const repetitionResult = resultsFromRepetitions.find(
      (r) => r.examination_id === exam.data.id,
    );
    const avgCurveResult = resultsFromAvgCurve.find(
      (r) => r.examination_id === exam.data.id && r.set === exam.set,
    );

    // Sestavení sloučeného výsledku
    return {
      examination_id: exam.data.id,
      set: exam.set,
      // Sloučení výsledků z repetition a avgCurve
      results: {
        ...(repetitionResult?.results as PrintResults), // Převezme existující results z repetitionResult, pokud existují
        maxTorque: avgCurveResult?.data.maxTorque ?? { M1: null, M2: null }, // maxTorque z avgCurveResult
        rangeMotion: avgCurveResult?.data.rangeMotion ?? { M1: null, M2: null },
      },
    };
  });

  return (
    <div
      ref={previewRef}
      className="w-[210mm] min-w-[210mm] bg-white font-['Roboto'] text-sm"
    >
      <div className="flex h-[297mm] min-h-[297mm] w-[210mm] min-w-[210mm] break-after-page flex-col overflow-hidden bg-white px-[8mm] py-[5mm] font-['Roboto']">
        <div className="flex flex-col gap-2">
          <Header reportData={reportData} examinations={examinations} />
          <div className="flex w-full flex-col items-center">
            {examinations.map((e, index) => {
              const color = colors.find(
                (c) => c.examination_id === e.data.id && c.set === e.set,
              );
              const repetition = repetitions.find(
                (c) => c.examination_id === e.data.id && c.set === e.set,
              );
              if (!repetition) {
                return null;
              }
              const planes = evaluatePlane(e.data);

              const formattedReps = formatRepetitions(repetition);
              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    style={{
                      backgroundColor: color?.color ?? "#FFFFFF",
                      width: "10px",
                      height: "8px",
                      borderRadius: "2px",
                      border: "1px solid #ccc",
                    }}
                  ></div>

                  <div>{`Average curve: Test ${e.index + 1} (${planes.M1Label}: ${formattedReps.M1},  ${planes.M2Label}: ${formattedReps.M2})`}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-1 flex gap-2">
          <div className="flex w-4 items-center justify-center">
            <div className="inline-block origin-center -rotate-90 whitespace-nowrap">
              {yLabel}
            </div>
          </div>

          <div className="flex h-[245px] w-full gap-2">
            <div className="h-[230px] w-full">
              <div className="flex w-full justify-center">{planes[0]}</div>
              <IsokineticChart
                chartData={averagesByExamination}
                type="M1"
                examinations={examinations}
                yTicks={yTicks}
                colors={colors}
                repetitions={repetitions}
                examType={examType}
              />
            </div>
            <div className="h-[230px] w-full">
              <div className="flex w-full justify-center">{planes[1]}</div>
              <IsokineticChart
                chartData={averagesByExamination}
                type="M2"
                examinations={examinations}
                yTicks={yTicks}
                colors={colors}
                repetitions={repetitions}
                examType={examType}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 h-auto flex-grow overflow-hidden">
          <Results
            examinations={examinations}
            results={mergedResults}
            colors={colors}
          />
        </div>

        <div className="mt-1 h-[26mm] overflow-hidden">
          <Comment reportData={reportData} />
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
