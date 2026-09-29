/*
 * Název souboru:    putData.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Generická funkce pro aktualizaci dat
 */

import { axios } from "utils/api/axios";

export const putData = async <TRequest, TResponse>(
  url: string,
  data: TRequest,
): Promise<TResponse> => {
  const response = await axios.put<TResponse>(url, data);
  return response.data;
};
