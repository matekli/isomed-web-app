/*
 * Název souboru:    SyncStatus.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení stavu synchronizace
 */

import { useSettingsContext } from "features/settings/contexts/SettingsContext";
import { twMerge } from "tailwind-merge";
import { formatDate } from "utils/formatting";

type SyncStatusProps = {
  className?: string;
};
const SyncStatus = ({ className }: SyncStatusProps) => {
  const { settings, isSynchronizing, filesCount, uploadedFiles } =
    useSettingsContext();
  if (!settings) {
    return null;
  }

  return (
    <div
      className={twMerge(
        "flex h-full min-w-fit items-center text-sm",
        className,
      )}
    >
      {isSynchronizing ? (
        <div className="flex">
          <p>Syncing in progress..&nbsp;</p>
          <p className="align-middle text-secondary">
            {uploadedFiles} / {filesCount}
          </p>
        </div>
      ) : (
        <div className="flex align-middle">
          <p>Last sync:&nbsp;</p>
          <p className="text-secondary">
            {settings.lastSync
              ? formatDate(settings.lastSync)
              : "Waiting for sync"}
          </p>
        </div>
      )}
    </div>
  );
};

export default SyncStatus;
