/*
 * Název souboru:    ChartActionDropdown.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení dropdown menu pro interakci s grafem,
 *                   umožňuje schování jednotlivých čar a skrýt nebo zobrazit tooltip.
 */

import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import { useState } from "react";
import { evaluatePlane, isHidden } from "../../utils/comparison";
import { evaluatePlaneColor } from "utils/colors";
import { useCompChartContext } from "contexts/CompChartContext";
import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";

const ChartActionDropdown = () => {
  const {
    type,
    idsToHide,
    showTooltip,
    linesToHide,
    onShowTooltip,
    onIdsToHideChange,
  } = useCompChartContext();

  const [isOpen, setIsOpen] = useState(false);
  const { examinations, colors } = useCurrentComparisonStore();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
    set: number,
  ) => {
    let updatedIdsToHide = idsToHide.slice();
    if (!e.target.checked) {
      updatedIdsToHide.push({ id, set });
    } else {
      updatedIdsToHide = idsToHide.filter(
        (item) => !(item.id === id && item.set === set),
      );
    }

    onIdsToHideChange(updatedIdsToHide);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-6 p-0">
          <Settings className="h-4 w-4 text-gray-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-min">
        {examinations.map((examination) => {
          const {
            data: { id },
            set,
          } = examination;
          if (linesToHide.includes(id)) {
            return null;
          }
          const color = evaluatePlaneColor(colors, examination.data, type, set);
          const label = evaluatePlane(examination.data, type);

          return (
            <div
              key={examination.index}
              className="flex items-center justify-between gap-x-2 px-2"
            >
              <div
                style={{ color: color.planeColor }}
                className="flex items-center text-base font-semibold"
              >
                {"T" + examination.index + " (" + label.M1Label + ")"}
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-[1em] w-[1em] rounded-sm align-middle checked:bg-red-500"
                  onChange={(e) => handleChange(e, id, set)}
                  checked={!isHidden(idsToHide, id, set)}
                />
              </div>
            </div>
          );
        })}
        <DropdownMenuSeparator />
        <div className="flex items-center justify-start gap-x-2 px-2">
          <div className="flex items-center text-base font-semibold">
            Show tooltip
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-[1em] w-[1em] rounded-sm align-middle checked:bg-red-500"
              onChange={onShowTooltip}
              checked={showTooltip}
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChartActionDropdown;
