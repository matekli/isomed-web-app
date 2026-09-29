/*
 * Název souboru:    Controls.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Ovládací panel pro detail vyšetření
 */

import { Button } from "components/ui/button";
import { ExaminationWithPatient } from "features/examination/types/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isIsometric, isIsokinetic, isAthletic } from "utils/utils";

type ControlsProps = {
  examination: ExaminationWithPatient;
  currentSet?: number;
  onAverage?: () => void;
  onAddComparison: () => void;
  onPreviousSet?: () => void;
  onNextSet?: () => void;
  offset: number | null;
  onOffsetChange: (value: number | null) => void;
};
const Controls = ({
  examination,
  currentSet,
  onAverage,
  onAddComparison,
  onPreviousSet,
  onNextSet,
  offset,
  onOffsetChange,
}: ControlsProps) => {
  const { number_of_sets } = examination;

  const step = isIsometric(examination) ? 5 : 1;

  const unit = isIsometric(examination)
    ? "ms"
    : !isIsokinetic(examination)
      ? "cm"
      : "°";

  return (
    <div className="mx-1 flex h-full flex-col justify-center gap-y-1 py-1">
      {onAverage && (
        <Button size="sm" onClick={onAverage}>
          Average
        </Button>
      )}
      <Button size="sm" onClick={onAddComparison}>
        Comparison
      </Button>
      {!isIsometric(examination) && currentSet && (
        <div className="flex items-center gap-x-1 rounded-lg border border-background px-1">
          <div className="flex justify-center text-white">{`Set ${currentSet}`}</div>
          <div className="flex items-center justify-center text-sm text-white">
            <Button
              onClick={onPreviousSet}
              variant="ghost"
              className="p-0 hover:scale-125 hover:bg-transparent hover:text-white"
              disabled={currentSet - 1 < 1}
            >
              <ChevronLeft />
            </Button>

            <Button
              onClick={onNextSet}
              variant="ghost"
              className="p-0 hover:scale-125 hover:bg-transparent hover:text-white"
              disabled={currentSet + 1 > number_of_sets}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
      <div className="rounded-lg border border-background p-1 text-white">
        <div>{isAthletic(examination) ? "Force at " : "Torque at"}</div>
        <div className="flex gap-x-1 rounded-lg px-1">
          <div className="w-full border border-background">
            <input
              step={step}
              min={0}
              value={offset ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  onOffsetChange(null);
                } else {
                  onOffsetChange(Number(val));
                }
              }}
              type="number"
              className="w-full bg-primary pl-1 outline-none"
            />
          </div>
          <div>{unit}</div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
