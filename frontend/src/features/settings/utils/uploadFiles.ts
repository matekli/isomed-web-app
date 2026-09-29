/*
 * Název souboru:    uploadFiles.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Funkce spravující nahrávání souborů
 */

import { successToast, errorToast } from "components/ui/toast";
import { axios } from "utils/api/axios";
import { setItem } from "utils/localStorage";
import { SettingsType } from "../contexts/SettingsContext";
import { CustomAxiosError, CustomError, UploadResult } from "../types/types";

export const uploadFiles = async (
  selectedFiles: File[],
  setUploadedFiles: (count: number) => void,
  setIsSynchronizing: (isSyncing: boolean) => void,
  settings: SettingsType | undefined,
  refreshSettings: () => void,
): Promise<UploadResult> => {
  setIsSynchronizing(true);

  let uploadedCount = 0;
  const failedFiles: CustomError[] = [];

  const startTime = performance.now();
  try {
    const chunkSize = 1;

    for (let i = 0; i < selectedFiles.length; i += chunkSize) {
      const chunk = selectedFiles.slice(i, i + chunkSize);

      const uploadPromises = chunk.map((file) => {
        const formData = new FormData();
        formData.append("file", file);

        return axios
          .post("sync", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then(() => {
            uploadedCount++;
            setUploadedFiles(uploadedCount);
          })
          .catch((error: CustomAxiosError) => {
            failedFiles.push({
              message: error.response?.data?.message ?? "Chyba při nahrávání",
            });
          });
      });

      await Promise.all(uploadPromises);
    }

    setItem("settings", {
      safeMode: settings?.safeMode,
      lastSync: Date.now(),
    });

    refreshSettings();

    successToast("Successfully synchronized");
  } catch (error) {
    errorToast("File upload failed. ");

    return { success: false, failedFiles };
  } finally {
    setIsSynchronizing(false);
  }

  const endTime = performance.now();

  console.log(
    `Uploading ${selectedFiles.length} took ${endTime - startTime} ms.`,
  );

  return { success: true, failedFiles };
};
