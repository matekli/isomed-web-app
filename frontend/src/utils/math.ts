/*
 * Název souboru:    math.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Matematické pomocné funkce pro dělení a zaokrouhlování čísel.
 */

export const divideBy10AndRound = (value: number | null | undefined) => {
  if (value == null) return null;
  return Math.abs(Math.round(value / 10));
};

export const roundOnOneDecimal = (value: number | null | undefined) => {
  if (value === null || value === undefined) return null;
  return Math.round(value * 10) / 10;
};

// pokud je b null, undefined nebo 0, vrati null
// pokud je a null nebo undefined, vrati null
// jinak vraci a/b
export const safeDivide = (
  a: number | null | undefined,
  b: number | null | undefined,
): number | null => {
  if (a == null || b == null || b === 0) {
    return null;
  }
  return a / b;
};

export const divideAndRoundOnOneDecimal = (
  a: number | null | undefined,
  b: number | null | undefined,
) => {
  const result = safeDivide(a, b);
  if (result === null) return null;
  return parseFloat(result.toFixed(1));
};

export const divideAndRoundOnTwoDecimal = (
  a: number | null | undefined,
  b: number | null | undefined,
) => {
  const result = safeDivide(a, b);
  if (result === null) return null;
  return parseFloat(result.toFixed(2));
};
