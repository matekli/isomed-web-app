/*
 * Název souboru:    IsokineticTableRow.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení řádku v tabulce výsledků isokinetických
 *                   testů.
 */

import { twMerge } from "tailwind-merge";

interface IsokineticTableRowProps {
  M1: number | string;
  M2: number | string;
  M1toM2: string;
  color: string;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const IsokineticTableRow = ({
  M1,
  M2,
  M1toM2,
  color,
  className,
  onMouseEnter,
  onMouseLeave,
}: IsokineticTableRowProps) => {
  return (
    <div
      className={twMerge(
        "mb-1 flex w-full rounded-lg px-1 text-black",
        className,
      )}
      style={{ backgroundColor: color }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex w-1/3 justify-start whitespace-nowrap rounded-l-lg">
        {M1}
      </div>
      <div className="flex w-1/3 justify-center whitespace-nowrap">{M2}</div>
      <div className="flex w-1/3 justify-end whitespace-nowrap rounded-r-lg">
        {M1toM2}
      </div>
    </div>
  );
};

export default IsokineticTableRow;
