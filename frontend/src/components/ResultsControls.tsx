/*
 * Název souboru:    ResultsControls.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro ovládací prvky pro výsledky testu.
 *                   Umožňuje uživateli upravit offset, nebo vynutit
 *                   výpočty pouze pro izokinetickou fázi opakování
 */

import { Settings } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "components/ui/dropdown-menu";
import { TestType } from "features/comparison/types/types";

type ResultsControlsProps = {
  offset?: number | null;
  onOffsetChange?: (value: number | null) => void;
  onlyIsokinetic?: boolean;
  onOnlyIsokineticChange?: (value: boolean) => void;
  type: TestType;
};
const ResultsControls = ({
  offset,
  onOffsetChange,
  onlyIsokinetic,
  onOnlyIsokineticChange,
  type,
}: ResultsControlsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const step = type === "isometric" ? 5 : 1;
  const unit = type === "isometric" ? "ms" : type === "athletic" ? "cm" : "°";

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Settings className="m-1 h-4 w-4 text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-lg border border-gray-300 bg-primary px-2 py-1"
      >
        {onOffsetChange && (
          <div className="flex gap-x-2 rounded-lg p-1 text-white">
            <div>{type === "athletic" ? "Force at " : "Torque at"}</div>
            <div className="flex gap-x-3 rounded-lg px-1">
              <div className="w-16 border border-background">
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
        )}
        {onOnlyIsokineticChange && onOffsetChange && <DropdownMenuSeparator />}

        {onOnlyIsokineticChange && (
          <div className="flex items-center justify-between gap-x-2 px-2 text-white">
            <div className="flex items-center text-base">Only isokinetic</div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-[1em] w-[1em] rounded-sm align-middle"
                onChange={(e) => onOnlyIsokineticChange(e.target.checked)}
                checked={onlyIsokinetic}
              />
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ResultsControls;
