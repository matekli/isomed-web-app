/*
 * Název souboru:    ComparisonList.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení seznamu porovnání vyšetření,
 *                   včetně možnosti přejít na detail nebo vymazání.
 */

import { Button } from "components/ui/button";
import ComparisonItem from "./ComparisonCard";
import {
  Comparison,
  MeasurementsByExamination,
  RepetitionsByExamination,
} from "features/comparison/types/types";
import { ExaminationWithPatient } from "features/examination/types/types";
import useMultipleRepetitions from "features/comparison/hooks/useMultipleRepetitions";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { convertJoint } from "utils/converting";
import { useComparisonStore } from "features/comparison/store/comparisonStore";
import { useEffect } from "react";
import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";

type ComparisonListProps = {
  index: number;
  comparisons: Comparison[];
  examinations: ExaminationWithPatient[];
  measurements: MeasurementsByExamination[];
  onReset: (comparison: Comparison, index: number) => void;
  onDelete: (id: string, set: number, index: number) => void;
  onDeleteList: (index: number) => void;
  onRepetitionsChange: (
    repetitions: RepetitionsByExamination,
    comparison: Comparison,
    examination: ExaminationWithPatient | undefined,
    index: number,
  ) => void;
  onDetail: (index: number) => string;
};
const ComparisonList = ({
  index,
  comparisons,
  examinations,
  measurements,
  onReset,
  onDelete,
  onDeleteList,
  onRepetitionsChange,
  onDetail,
}: ComparisonListProps) => {
  const repetitionsByExamination = useMultipleRepetitions({
    comparisons,
    measurementsByExamination: measurements,
    examinations,
    index,
  });

  const { setComparisonData, setLoaded } = useComparisonStore();
  const { setAll } = useCurrentComparisonStore();

  useEffect(() => {
    setComparisonData(
      examinations,
      measurements,
      repetitionsByExamination,
      index,
    );
    setLoaded(true);
  }, [repetitionsByExamination, examinations, measurements]);

  if (comparisons.length === 0) {
    return null;
  }

  // Tohle je pro to, aby když třeba někdo smaže z databáze ty vyšetření,které jsou v porovnání,
  // tak ať se nezobrazuje prázdná karta
  const ids = examinations.map((e) => e.id);
  const currentExaminations = comparisons.filter((c) => ids.includes(c.id));

  if (
    currentExaminations.length === 0 ||
    repetitionsByExamination.length === 0
  ) {
    return null;
  }
  return (
    <div className="m-1 rounded-lg border-2 border-primary px-4">
      <div className="flex items-center text-lg font-semibold uppercase">
        <div>{`${comparisons[0].type} - ${convertJoint(comparisons[0].joint)}`}</div>
        <span
          title="Delete comparison"
          className="my-2 ml-auto flex cursor-pointer justify-end hover:scale-125"
        >
          <X onClick={() => onDeleteList(index)} />
        </span>
      </div>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {comparisons.map((comparison) => {
          const examination = examinations.find((e) => e.id === comparison.id);
          const repetitions = repetitionsByExamination.find(
            (r) =>
              r.examination_id === comparison.id && r.set === comparison.set,
          );

          if (!examination || !repetitions) {
            return null;
          }
          return (
            <ComparisonItem
              key={`${comparison.id} ${comparison.set}`}
              index={index}
              comparison={comparison}
              examination={examination}
              repetitions={repetitions}
              onReset={onReset}
              onDelete={onDelete}
              onRepetitionsChange={onRepetitionsChange}
            />
          );
        })}
      </div>
      <div className="flex justify-end py-2">
        <Link
          to={onDetail(index)}
          state={{ index }}
          onClick={() => setAll({ index })}
          className="w-auto"
        >
          <Button>View comparison</Button>
        </Link>
      </div>
    </div>
  );
};

export default ComparisonList;
