/*
 * Název souboru:    IsometricResultsHeaders.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro popisů řádků tabulky
 */

import { formatValue } from "utils/formatting";

type IsometricResultsHeadersProps = {
  offset: number | null;
};
const IsometricResultsHeaders = ({ offset }: IsometricResultsHeadersProps) => {
  return (
    <div className="grid min-w-max grid-cols-1 grid-rows-[2fr_repeat(6,1fr)] whitespace-nowrap text-white">
      <div className="flex items-center justify-center text-lg">
        Reconstruction
      </div>
      <div className="mb-1 flex rounded-lg bg-[#595959] px-1">
        Hold angle (°)
      </div>
      <div className="mb-1 flex rounded-lg bg-[#595959] px-1">
        Max. Torque (Nm)
      </div>
      <div className="mb-1 flex rounded-lg bg-[#595959] px-1">
        Time at Max. Torque (s)
      </div>
      <div className="mb-1 flex rounded-lg bg-[#595959] px-1">
        Max torque/Weight
      </div>
      <div className="mb-1 flex rounded-lg bg-[#595959] px-1">
        {`Torque at ${formatValue(offset)} ms`}
      </div>
      <div className="mb-1 flex rounded-lg bg-[#595959] px-1">
        Torqueatoffms/Wt
      </div>
      <div className="mb-1 flex rounded-lg bg-[#595959] px-1">⌀ Torque</div>
    </div>
  );
};

export default IsometricResultsHeaders;
