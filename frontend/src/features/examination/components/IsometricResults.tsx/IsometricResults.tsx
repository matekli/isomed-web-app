/*
 * Název souboru:    IsometricResults.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení tabulky výsledků isometrického vyšetření
 */

import {
  ExaminationWithPatient,
  IsometricResultsData,
} from "features/examination/types/types";
import IsometricResultsHeaders from "./IsometricResultsHeaders";
import TableSlider from "components/TableSlider";
import IsometricResultsTable from "./IsometricResultsTable";
type IsometricResultsProps = {
  data: IsometricResultsData[];
  examination: ExaminationWithPatient;
  onScrollPrev: () => void;
  onScrollNext: () => void;
  offset: number | null;
};
const IsometricResults = ({
  data,
  examination,
  onScrollPrev,
  onScrollNext,
  offset,
}: IsometricResultsProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center px-1">
      <div className="flex justify-center px-2">
        <IsometricResultsHeaders offset={offset} />
      </div>
      <div>
        <TableSlider
          tableData={data}
          itemsPerView={1}
          onScrollPrev={onScrollPrev}
          onScrollNext={onScrollNext}
          renderItem={(data, index) => (
            <IsometricResultsTable
              key={index}
              data={data}
              examination={examination}
            />
          )}
        />
      </div>
    </div>
  );
};

export default IsometricResults;
