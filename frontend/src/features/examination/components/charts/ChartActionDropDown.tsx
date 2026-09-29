/*
 * Název souboru:    ChartActionDropdown.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení dropdown menu pro interakci s grafem,
 *                   umožňuje skrýt nebo zobrazit tooltip.
 */

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "components/ui/dropdown-menu";
import { useChartContext } from "contexts/ChartContext";
import { Settings } from "lucide-react";
import { useState } from "react";
import { isAthletic } from "utils/utils";

type ChartActionDropdownProps = {};
const ChartActionDropdown = ({}: ChartActionDropdownProps) => {
  const {
    examination,
    showTooltip,
    onShowTooltip,
    hideSide,
    onHideSide,
    dialogRef,
  } = useChartContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (side: "left" | "right" | "main") => {
    const updated = {
      left: hideSide.left,
      right: hideSide.right,
      main: hideSide.main,
    };

    if (side === "left") {
      updated.left = !hideSide.left;
    }

    if (side === "right") {
      updated.right = !hideSide.right;
    }

    if (side === "main") {
      updated.main = !hideSide.main;
    }

    onHideSide(updated);
  };
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="outline-none">
        <Settings className="h-4 w-4 text-gray-600" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-min"
        container={
          dialogRef && typeof dialogRef !== "function"
            ? dialogRef.current
            : undefined
        }
      >
        {isAthletic(examination) && (
          <>
            <div className="flex items-center justify-between gap-x-2 px-2">
              <div className="flex items-center text-base font-semibold">
                Total force
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-[1em] w-[1em] rounded-sm align-middle"
                  onChange={() => handleChange("main")}
                  checked={!hideSide.main}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-x-2 px-2">
              <div className="flex items-center text-base font-semibold">
                Left
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-[1em] w-[1em] rounded-sm align-middle"
                  onChange={() => handleChange("left")}
                  checked={!hideSide.left}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-x-2 px-2">
              <div className="flex items-center text-base font-semibold">
                Right
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-[1em] w-[1em] rounded-sm align-middle"
                  onChange={() => handleChange("right")}
                  checked={!hideSide.right}
                />
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        <div className="flex items-center justify-start gap-x-2 px-2">
          <div className="flex items-center text-base font-semibold">
            Show tooltip
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-[1em] w-[1em] rounded-sm align-middle"
              onChange={() => {
                onShowTooltip();
                setIsOpen(false);
              }}
              checked={showTooltip}
            />
          </div>
        </div>

        {/* <DropdownMenuSeparator />
        <div
          onClick={onExport}
          className="cursor-pointer px-2 hover:bg-slate-200"
        >
          Export
        </div> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChartActionDropdown;
