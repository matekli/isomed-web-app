/*
 * Název souboru:    SavedStatus.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta zobrazující, zda je zpráva uložena v databázi
 *                   nebo jestli byla upravena
 */

type SavedStatusProps = {
  savedId: string | null;
  edited: boolean;
};
const SavedStatus = ({ savedId, edited }: SavedStatusProps) => {
  return (
    <div className="flex justify-end gap-x-2">
      {edited && (
        <div className="rounded-lg border-2 border-dashed border-primary p-2 font-bold">
          Edited
        </div>
      )}
      {savedId && !edited ? (
        <div className="rounded-lg border-2 border-dashed border-green-500 p-2 font-bold text-green-500">
          Saved
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-red-500 p-2 font-bold text-red-500">
          Not saved
        </div>
      )}
    </div>
  );
};

export default SavedStatus;
