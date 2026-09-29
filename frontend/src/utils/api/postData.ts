/*
 * Název souboru:    postData.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Generická funkce pro nahrání dat
 */

import { axios } from "./axios";

export const postData = async <TRequest, TResponse>(
  url: string,
  data: TRequest,
): Promise<TResponse> => {
  const response = await axios.post<TResponse>(url, data);
  return response.data;
};
