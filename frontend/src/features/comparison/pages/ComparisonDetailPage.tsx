/*
 * Název souboru:    ComparisonDetailPage.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Stránka detailu porovnání
 */

import { useParams, useSearchParams } from "react-router-dom";
import { Loader } from "components/ui/loader";
import {
  decodeComparisonQueryString,
  initializeIndexedExaminations,
} from "features/comparison/utils/comparison";
import { useEffect, useMemo, useState } from "react";
import useFetchExaminationsByIds from "../hooks/useFetchExaminationsByIds";
import RepetitionSelectionDialog from "components/RepetitionSelectionDialog/RepetitionSelectionDialog";
import ExaminationCardList from "../components/ExaminationCardList/ExaminationCardList";
import useFilteredRepetitionsByExamination from "../hooks/useFilteredRepetitions";
import useRepetitionDialog from "../hooks/useRepetitionsDialog";
import useMultipleIsometricSets from "../hooks/useMultipleIsometricSets";
import { assignColorsToComparisons } from "utils/colors";
import IsokineticComparison from "../components/IsokineticComparison";
import IsometricComparison from "../components/IsometricComparison";
import useMultipleRepetitions from "../hooks/useMultipleRepetitions";
import useFetchMeasurementsByIds from "../hooks/useFetchMeasurementsByIds";
import { useCurrentComparisonStore } from "../store/currentComparisonStore";
import PrintPage from "features/print/pages/PrintPage";
import { fetchData } from "utils/api/fetchData";
import { useQuery } from "@tanstack/react-query";
import { ReportData } from "features/print/types/types";
import { Comparison } from "../types/types";

export type Saved = {
  id: number;
  description: string;
  title: string;
  onlyIsokinetic: boolean;
  createdAt: Date;
  comment: string;
  paramsJson: Comparison[];
};

const ComparisonDetailPage = () => {
  const { data } = useParams();
  const comparisons = useMemo(() => decodeComparisonQueryString(data), [data]);
  const [searchParams] = useSearchParams();
  const rawId = searchParams.get("id");
  const savedId = useMemo(() => rawId ?? null, [rawId]);
  const type = comparisons[0].type;
  const colors = useMemo(() => assignColorsToComparisons(comparisons), []);
  const [isInitializing, setIsInitializing] = useState(true);
  const [openedSet, setOpenedSet] = useState<number | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [edited, setEdited] = useState(false);
  const [onlyIsokinetic, setOnlyIsokinetic] = useState<boolean>(true);

  const [reportData, setReportData] = useState<ReportData>({
    description: "",
    title: "",
    comment: "",
  });

  const {
    setType,
    setExaminations,
    setComparisons,
    setRepetitions,
    setIsometricSets,
    setColors,
    compareIds,
    setCompareIds,
    index,
    examinations: indexedExaminations,
    locallyDeleted,
    setLocallyDeleted,
  } = useCurrentComparisonStore();

  const {
    dialogRef,
    isDialogOpened,
    toggleDialog,
    openDialog,
    closeDialog,
    dialogExamination,
    dialogRepetitions,
  } = useRepetitionDialog();

  const { data: examinations, isFetching: isExaminationFetching } =
    useFetchExaminationsByIds({
      comparisons,
    });

  const { data: measurementsByExamination, isFetching: isMeasurementFetching } =
    useFetchMeasurementsByIds({
      comparisons,
    });

  // Fetchuje se pouze když je porovnáni otevřeno z Saved
  const { data: saved, isFetching: isSavedFetching } = useQuery({
    queryFn: () => fetchData<Saved>(`/saved/${savedId}`),
    queryKey: ["saved", savedId],
    enabled: !!savedId,
    refetchOnWindowFocus: false,
  });

  // Inicializace indexedExaminations, aby se při mazání nepřehazovaly barvy
  useEffect(() => {
    setIsInitializing(true);
    if (examinations) {
      const { indexedExaminations, compareIds } = initializeIndexedExaminations(
        examinations,
        comparisons,
      );
      setExaminations(() => indexedExaminations);
      setCompareIds(() => compareIds);
    }
    setIsInitializing(false);
  }, [examinations]);

  const repetitionsByExamination = useMultipleRepetitions({
    comparisons,
    measurementsByExamination,
    examinations,
    index,
  });

  // Repetitions očištěné o lokalní mazání
  const filteredRepetitionsByExamination = useFilteredRepetitionsByExamination({
    repetitionsByExamination,
    deleteReps: locallyDeleted,
  });

  const isometricSetsByExamination = useMultipleIsometricSets({
    measurementsByExamination,
    examinations,
  });

  const handleListReset = () => {
    if (examinations) {
      const { indexedExaminations, compareIds } = initializeIndexedExaminations(
        examinations,
        comparisons,
      );
      setExaminations(() => indexedExaminations);
      setCompareIds(() => compareIds);
      setLocallyDeleted(() => []);
      setEdited(true);
    }
  };

  const handleReset = (id: string, set: number) => {
    setLocallyDeleted((prev) =>
      prev.filter((p) => !(p.examination_id === id && p.set === set)),
    );
    setEdited(true);
  };

  const handleSelect = (id: string, set: number) => {
    setCompareIds((prev) => {
      // Vytvoříme objekt pro porovnání
      const newItem = { id, set };

      if (prev.some((item) => item.id === id && item.set === set)) {
        // Pokud je už tento objekt v poli, odstraníme ho
        return prev.filter((item) => !(item.id === id && item.set === set));
      }

      if (prev.length < 2) {
        // Pokud pole má méně než 2 položky, přidáme tento objekt
        return [...prev, newItem];
      }

      // Jinak vrátíme původní stav (když už je tam 2 nebo více položek)
      return prev;
    });
  };

  const handleExaminationDelete = (id: string, set: number) => {
    const updatedExaminations = indexedExaminations?.filter(
      (examination) => !(examination.data.id === id && examination.set === set),
    );

    setExaminations(() => updatedExaminations);
    setCompareIds((prev) =>
      prev.filter((compare) => compare.id !== id || compare.set !== set),
    );
    setEdited(true);
  };

  const handleOpenDialog = (id: string, set: number) => {
    const examination = indexedExaminations?.find(
      (examination) => examination.data.id === id && examination.set === set,
    );
    if (examination) {
      setOpenedSet(set);
      openDialog(
        examination.data,
        filteredRepetitionsByExamination.find(
          (p) => p.examination_id === id && p.set === set,
        )?.repetitions ?? [],
      );
    }
  };

  const handleDialogSubmit = (deletedRepetitions: number[]) => {
    toggleDialog();

    const newDelete = {
      examination_id: dialogExamination!.id,
      set: openedSet,
      toDelete: deletedRepetitions,
    };

    setLocallyDeleted((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.examination_id === newDelete.examination_id &&
          item.set === openedSet,
      );

      if (existingIndex !== -1) {
        // Pokud existuje, aktualizujeme toDelete (např. přepíšeme nebo sloučíme)
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],

          toDelete: [...updated[existingIndex].toDelete, ...newDelete.toDelete],
        };
        return updated;
      }

      // Pokud neexistuje, přidáme nový
      return [...prev, newDelete];
    });
    setEdited(true);

    closeDialog();
  };

  useEffect(() => {
    if (
      filteredRepetitionsByExamination &&
      isometricSetsByExamination &&
      comparisons &&
      measurementsByExamination
    ) {
      setType(type);
      setComparisons(comparisons);
      setRepetitions(filteredRepetitionsByExamination);
      setIsometricSets(isometricSetsByExamination);
      setColors(colors);
    }
  }, [
    comparisons,
    filteredRepetitionsByExamination,
    isometricSetsByExamination,
    compareIds,
    colors,
    type,
  ]);

  // Pokud je tato stránka otevřena z Saved, nastaví se reportData do formuláře
  useEffect(() => {
    if (savedId && saved) {
      setReportData({
        description: saved.description,
        comment: saved.comment,
        title: saved.title,
      });
      setOnlyIsokinetic(saved.onlyIsokinetic);
    }
  }, [savedId, saved]);

  const isLoading =
    isExaminationFetching ||
    isMeasurementFetching ||
    isInitializing ||
    !data ||
    !measurementsByExamination ||
    isSavedFetching;
  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {!showReport ? (
        <div className="flex h-full w-full flex-col gap-2 gap-x-4 border-x border-gray-400 bg-background p-2 xl:grid xl:grid-cols-11 xl:grid-rows-7">
          <div className="scrollbar xl:scrollbar-left min-w-[28%] gap-2 rounded-lg bg-primary px-4 py-2 xl:col-span-3 xl:row-span-7 xl:overflow-y-auto">
            <ExaminationCardList
              onReset={handleListReset}
              onItemReset={handleReset}
              onSelect={handleSelect}
              onDelete={handleExaminationDelete}
              onRepetitionChange={handleOpenDialog}
              onShowReport={() => setShowReport(!showReport)}
            />
          </div>

          <div className="xl:col-span-8 xl:row-span-7">
            {type !== "isometric" ? (
              <IsokineticComparison
                onlyIsokinetic={onlyIsokinetic}
                setOnlyIsokinetic={setOnlyIsokinetic}
                setEdited={setEdited}
              />
            ) : (
              <IsometricComparison />
            )}
          </div>
        </div>
      ) : (
        <PrintPage
          reportData={reportData}
          onlyIsokinetic={onlyIsokinetic}
          edited={edited}
          setReportData={setReportData}
          setOnlyIsokinetic={setOnlyIsokinetic}
          setEdited={setEdited}
          onShowReport={() => setShowReport(!showReport)}
        />
      )}

      {dialogExamination && dialogRepetitions && (
        <RepetitionSelectionDialog
          examination={dialogExamination}
          repetitions={dialogRepetitions}
          ref={dialogRef}
          toggleDialog={toggleDialog}
          isDialogOpened={isDialogOpened}
          submitDialog={handleDialogSubmit}
        />
      )}
    </>
  );
};

export default ComparisonDetailPage;
