/*
 * Název souboru:    Headers.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hlavičky pro souhrn výsledků vyšetření
 */

const Headers = () => {
  return (
    <div className="grid min-w-max grid-cols-1 grid-rows-[2fr_repeat(4,1fr)] whitespace-nowrap text-white">
      <div className="row-span-1 flex items-center justify-center text-lg">
        Summary
      </div>
      <div className="mb-1 flex rounded-lg bg-[#595959] px-2">
        Total work (J)
      </div>
      <div className="mb-1 flex rounded-lg bg-[#595959] px-2">
        Average work (J)
      </div>
      <div className="mb-1 flex rounded-lg bg-[#595959] px-2">Max. torque</div>
      <div className="mb-1 flex rounded-lg bg-[#595959] px-2">Max. work</div>
    </div>
  );
};

export default Headers;
