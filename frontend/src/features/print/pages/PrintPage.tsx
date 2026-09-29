/*
 * Název souboru:    PrintPage.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Stránka pro tisk, uložení a editaci zprávy
 */

import { useReactToPrint } from "react-to-print";
import { useMemo, useRef } from "react";
import { decodeComparisonQueryString } from "features/comparison/utils/comparison";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Comparison } from "features/comparison/types/types";
import useFilteredRepetitionsByExamination from "features/comparison/hooks/useFilteredRepetitions";
import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";
import ReportForm from "../components/ReportForm";
import { ReportData } from "../types/types";
import PageTitle from "components/PageTitle";
import { Button } from "components/ui/button";
import ReportPreview from "../components/ReportPreview/ReportPreview";
import { useMutation } from "@tanstack/react-query";
import { postData } from "utils/api/postData";
import { putData } from "utils/api/putData";
import { errorToast, successToast } from "components/ui/toast";
import { ArrowLeft } from "lucide-react";
import { useDialog } from "hooks/useDialog";
import SaveDialog from "../components/SaveDialog";
import SavedStatus from "../components/SavedStatus";

type CreateComparison = {
  description: string | null;
  title: string | null;
  onlyIsokinetic: boolean;
  createdAt: Date;
  comment: string | null;
  paramsJson: Comparison[];
};

type UpdateComparison = {
  id: number;
  data: CreateComparison;
};

type PrintPageProps = {
  reportData: ReportData;
  onlyIsokinetic: boolean;
  edited: boolean;
  setReportData: React.Dispatch<React.SetStateAction<ReportData>>;
  setOnlyIsokinetic: React.Dispatch<React.SetStateAction<boolean>>;
  setEdited: React.Dispatch<React.SetStateAction<boolean>>;
  onShowReport: () => void;
};

const PrintPage = ({
  reportData,
  onlyIsokinetic,
  edited,
  setReportData,
  setOnlyIsokinetic,
  setEdited,
  onShowReport,
}: PrintPageProps) => {
  const { data } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toggleDialog, dialogRef } = useDialog();

  const rawId = searchParams.get("id");
  const savedId = useMemo(() => rawId ?? null, [rawId]);

  const comparisons = useMemo(() => decodeComparisonQueryString(data), [data]);

  const examType = comparisons[0].type;
  const {
    locallyDeleted,
    examinations,
    repetitions: repetitionsByExamination,
  } = useCurrentComparisonStore();

  const { mutateAsync: saveComparison } = useMutation<
    Comparison,
    Error,
    CreateComparison
  >({
    mutationFn: (data: CreateComparison) => postData("/saved", data),
  });

  const { mutateAsync: editComparison } = useMutation({
    mutationFn: (data: UpdateComparison) => putData("/saved", data),
  });

  const handleSave = async (description: string) => {
    const updatedComparisons: Comparison[] = [];

    examinations.forEach((e) => {
      const deletedReps = locallyDeleted.find(
        (d) => d.examination_id === e.data.id && d.set === e.set,
      );

      const comparison = comparisons.find(
        (c) => c.id === e.data.id && c.set === e.set,
      );

      if (!comparison) return;

      if (deletedReps) {
        comparison.repetitionsToDelete = [
          ...new Set([
            ...(comparison.repetitionsToDelete || []),
            ...deletedReps.toDelete,
          ]),
        ];
      }

      updatedComparisons.push(comparison);
    });
    const data: CreateComparison = {
      description: description,
      title: reportData.title,
      comment: reportData.comment,
      onlyIsokinetic: onlyIsokinetic,
      createdAt: new Date(),
      paramsJson: updatedComparisons,
    };

    try {
      if (savedId) {
        editComparison({
          id: Number(savedId),
          data,
        });
        successToast("Comparison updated");
        setEdited(false);
        toggleDialog();
      } else {
        const response = await saveComparison(data);
        successToast("Comparison saved");
        setEdited(false);

        const searchParams = new URLSearchParams(location.search);
        searchParams.set("id", response.id);
        const encoded = encodeURIComponent(JSON.stringify(updatedComparisons));
        navigate(`/comparison/${encoded}?${searchParams.toString()}`, {
          replace: true,
        });
      }
    } catch (error) {
      errorToast("Comparison saving failed");
    }
  };

  const previewref = useRef<HTMLDivElement>(null);
  const print = useReactToPrint({
    contentRef: previewref,
    documentTitle: "comparison",
  });

  const filteredRepetitionsByExamination = useFilteredRepetitionsByExamination({
    repetitionsByExamination,
    deleteReps: locallyDeleted,
  });

  const slicedComparisons = useMemo(
    () => comparisons.slice(0, 2),
    [comparisons],
  );
  const slicedExaminations = useMemo(
    () => examinations.slice(0, 2),
    [examinations],
  );

  return (
    <>
      <div className="bg-background">
        <div className="mx-auto grid w-11/12 grid-cols-3 items-center">
          <div className="flex justify-start">
            <ArrowLeft onClick={onShowReport} className="hover:scale-125" />
          </div>

          <div className="flex justify-center">
            <PageTitle text="Print preview" />
          </div>

          <SavedStatus savedId={savedId} edited={edited} />
        </div>

        {examinations.length !== 0 ? (
          <div className="mx-auto flex w-11/12 justify-between gap-4 rounded-lg border-2 border-primary p-4">
            <ReportPreview
              reportData={reportData}
              onlyIsokinetic={onlyIsokinetic}
              previewRef={previewref}
              comparisons={slicedComparisons}
              examinations={slicedExaminations}
              repetitions={filteredRepetitionsByExamination}
              examType={examType}
            />
            <div className="flex-1 gap-2">
              <div className="mb-2 flex justify-end gap-2">
                <Button onClick={toggleDialog}>Save to database</Button>
                <Button onClick={print}>Print</Button>
              </div>
              <div className="sticky top-4 h-fit self-start rounded-lg border-2 border-primary p-2">
                <ReportForm
                  data={reportData}
                  onlyIsokinetic={onlyIsokinetic}
                  setData={setReportData}
                  setOnlyIsokinetic={setOnlyIsokinetic}
                  setEdited={setEdited}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex min-h-screen w-11/12 items-center justify-center rounded-lg bg-gray-500 bg-opacity-35 text-5xl">
            No data
          </div>
        )}
      </div>
      <SaveDialog
        description={reportData.description}
        submitDialog={handleSave}
        toggleDialog={toggleDialog}
        ref={dialogRef}
      />
    </>
  );
};

export default PrintPage;
