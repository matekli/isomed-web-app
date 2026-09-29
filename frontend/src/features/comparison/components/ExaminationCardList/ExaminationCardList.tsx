/*
 * Název souboru:    ExaminationCardList.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení seznamu karet vyšetření v porovnání.
 */

import { RotateCcw } from "lucide-react";
import ComparisonExamCard from "./ComparisonExamCard";
import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";

type ExaminationCardListProps = {
  onReset: () => void;
  onItemReset: (id: string, set: number) => void;
  onSelect: (id: string, set: number) => void;
  onDelete: (id: string, set: number) => void;
  onRepetitionChange: (id: string, set: number) => void;
  onShowReport: () => void;
};
const ExaminationCardList = ({
  onReset,
  onItemReset,
  onSelect,
  onDelete,
  onRepetitionChange,
  onShowReport,
}: ExaminationCardListProps) => {
  const { examinations, type } = useCurrentComparisonStore();

  return (
    <>
      <div className="relative mb-2 flex w-full items-center border-b-2 border-solid border-gray-300 bg-primary text-xl text-white">
        {type !== "isometric" && (
          <div
            className="mb-1 cursor-pointer rounded-lg border border-white px-2 hover:scale-105 hover:bg-primary"
            onClick={onShowReport}
          >
            Export
          </div>
        )}
        <div className="absolute left-1/2 -translate-x-1/2">Examinations</div>

        <RotateCcw onClick={onReset} className="ml-auto p-1 hover:scale-125" />
      </div>
      <div className="scrollbar flex gap-2 overflow-x-auto xl:flex-col">
        {examinations.map((examination) => {
          return (
            <ComparisonExamCard
              key={`${examination.data.id}-${examination.set}`}
              examination={examination}
              onSelect={onSelect}
              onReset={onItemReset}
              onDelete={onDelete}
              onRepetitionChange={onRepetitionChange}
            />
          );
        })}
      </div>
    </>
  );
};

export default ExaminationCardList;
