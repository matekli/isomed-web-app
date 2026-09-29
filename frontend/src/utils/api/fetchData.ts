/*
 * Název souboru:    fetchData.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Generická funkce pro získání dat z API
 */

import { axios } from "utils/api/axios";

export const fetchData = async <T>(url: string): Promise<T> => {
  const response = await axios.get<T>(url);
  return response.data;
};
