/*
 * Název souboru:    constants.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Definice konstant používaných na backendu.
 */

export const DEFAULT_DATE = '2000-01-01';

export const BATCHSIZE = 90;
export const MAX_SQLITE_VARIABLES = 999;
export const COLUMNS_PER_ROW = 11;

export const MAX_ROWS_PER_INSERT = Math.floor(
  MAX_SQLITE_VARIABLES / COLUMNS_PER_ROW,
);

export const EXPECTED_PROPERTIES = new Set([
  'Name of Person',
  'Joint-Side',
  'Test-Mode',
  'Joint',
  'Plane',
  'No. of sets',
  'No. of repetitions',
]);
