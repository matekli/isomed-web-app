/*
 * Název souboru:    axios.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Konfigurace Axios pro API komunikaci.
 */

import * as a from "axios";

export const axios = a.default.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/",
});
