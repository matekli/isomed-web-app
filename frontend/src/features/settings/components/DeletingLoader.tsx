/*
 * Název souboru:    DeletingLoader.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Indikátor probíhajícího mazání dat
 */

const DeletingLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
      <div className="text-[clamp(2rem,5vw,4rem)] font-semibold text-red-500">
        Deleting in progress
        <span className="animate-ellipsis" />
      </div>
    </div>
  );
};

export default DeletingLoader;
