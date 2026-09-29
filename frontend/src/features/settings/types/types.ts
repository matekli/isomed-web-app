/*
 * Název souboru:    types.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Type používané v kontextu nastavení
 */

import { AxiosError } from "axios";

export type CustomError = {
  message: string | undefined;
};

export type UploadResult = {
  success: boolean;
  failedFiles: CustomError[];
};

export type CustomAxiosError = AxiosError<CustomError>;
