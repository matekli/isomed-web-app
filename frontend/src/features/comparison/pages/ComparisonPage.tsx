/*
 * Název souboru:    ComparisonPage.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Stránka seznamu porovnání
 */

import PageTitle from "components/PageTitle";
import { useComparison } from "features/comparison/hooks/useComparison";
import RepetitionSelectionDialog from "components/RepetitionSelectionDialog/RepetitionSelectionDialog";
import { useEffect, useState } from "react";
import { ExaminationWithPatient } from "features/examination/types/types";
import { Comparison, RepetitionsByExamination } from "../types/types";
import useFetchExaminationsByIds from "../hooks/useFetchExaminationsByIds";
import useFetchMeasurementsByIds from "../hooks/useFetchMeasurementsByIds";
import { Loader } from "components/ui/loader";
import useRepetitionDialog from "../hooks/useRepetitionsDialog";
import { useComparisonHandlers } from "../hooks/useComparisonHandlers";
import ComparisonList from "../components/ComparisonList/ComparisonList";

const ComparisonPage = () => {
  const [ids, setIds] = useState<Comparison[]>([]);
  const [comparisonToUpdate, setComparisonToUpdate] = useState<{
    comparison: Comparison;
    index: number;
  } | null>(null);

  // Hook pro operaci na localStorage
  const {
    comparisons,
    removeComparison,
    removeComparisonList,
    updateComparison,
  } = useComparison();

  // Hook pro obsluhu dialogu pro vybírání opakování
  const {
    dialogRef,
    isDialogOpened,
    toggleDialog,
    openDialog,
    closeDialog,
    dialogExamination,
    dialogRepetitions,
  } = useRepetitionDialog();

  // Hook, který vrací všechny handlery pro opakování,
  // je potřeba mu poslat aktuální instaci comparisons a funkci pro operaci s localStorage
  const {
    handleReset,
    handleDeleteComparison,
    handleDeleteComparisonList,
    goToDetail,
  } = useComparisonHandlers(
    updateComparison,
    removeComparison,
    removeComparisonList,
    comparisons,
  );

  // Slouží k tomu, aby se znova spustily queries na základě změny ids, ale jen při přidání, při odebráni není potřeba
  useEffect(() => {
    const newIds = comparisons.map((c) => c.comparisons).flat();
    if (newIds.length >= ids.length) {
      setIds(comparisons.map((c) => c.comparisons).flat());
    }
  }, [comparisons]);

  // Fetch examinations
  const { data: examinations, isFetching } = useFetchExaminationsByIds({
    comparisons: ids,
  });

  // Fetch measurements
  const { data: measurements, isFetching: isMeasurementsLoading } =
    useFetchMeasurementsByIds({ comparisons: ids });

  // Přijímá repetitions,comparison, examination a index listu podle toho, na jaký item bylo kliknuto.
  // Otevře dialog a nastaví do stavu aktuálně otevřené comparison a index
  const handleOpenDialog = (
    repetitions: RepetitionsByExamination,
    comparison: Comparison,
    examination: ExaminationWithPatient | undefined,
    index: number,
  ) => {
    openDialog(examination, repetitions.repetitions);
    setComparisonToUpdate({ comparison, index });
  };

  // Po submit dialogu updatuje comparison v localstorage a zavře dialog
  const handleSubmitDialog = (deletedRepetitions: number[]) => {
    if (!comparisonToUpdate) {
      return;
    }

    const { comparison, index } = comparisonToUpdate;

    const updatedComp = {
      ...comparison,
      repetitionsToDelete: [
        ...comparison.repetitionsToDelete,
        ...deletedRepetitions,
      ],
    };

    updateComparison(updatedComp, index);
    closeDialog();
    setComparisonToUpdate(null);
  };

  if (comparisons.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-500 bg-opacity-35 text-5xl">
        No comparisons
      </div>
    );
  }

  if (!examinations || isFetching || isMeasurementsLoading || !measurements) {
    return <Loader />;
  }

  return (
    <div>
      <PageTitle text="comparisons" />
      <div className="m-auto mb-4 flex max-w-[80%] flex-col gap-y-4 rounded-lg border-2 border-solid border-primary">
        {comparisons.map((c) => (
          <ComparisonList
            key={c.index}
            index={c.index}
            comparisons={c.comparisons}
            examinations={examinations}
            measurements={measurements}
            onReset={handleReset}
            onDelete={handleDeleteComparison}
            onDeleteList={handleDeleteComparisonList}
            onRepetitionsChange={handleOpenDialog}
            onDetail={goToDetail}
          />
        ))}
      </div>

      {dialogExamination && dialogRepetitions && (
        <RepetitionSelectionDialog
          repetitions={dialogRepetitions}
          examination={dialogExamination}
          isDialogOpened={isDialogOpened}
          toggleDialog={toggleDialog}
          submitDialog={handleSubmitDialog}
          ref={dialogRef}
        />
      )}
    </div>
  );
};

export default ComparisonPage;
