/*
 * Název souboru:    IsokinetictableRow.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení řádku tabulky.
 */

type IsokineticTableRowProps = {
  M1: number | string;
  M2: number | string;
  M1toM2: string;
};

const IsokineticTableRow = ({ M1, M2, M1toM2 }: IsokineticTableRowProps) => {
  return (
    <div className="mb-1 flex w-full rounded-lg bg-[#595959] px-1 text-white">
      <div className="flex w-1/3 items-center justify-start whitespace-nowrap rounded-l-lg">
        {M1}
      </div>
      <div className="flex w-1/3 items-center justify-center whitespace-nowrap">
        {M2}
      </div>
      <div className="flex w-1/3 items-center justify-end whitespace-nowrap rounded-r-lg">
        {M1toM2}
      </div>
    </div>
  );
};

export default IsokineticTableRow;
