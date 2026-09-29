/*
 * Název souboru:    anonymize.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Funkce pro nahrazení citlivého údaje, pokud
 *                   je aplikace v anonymizovaném režimu
 */

export const anonymize = (value: string, anonymize: boolean = false) => {
  return anonymize ? "(hidden)" : value;
};
