/*
 * Název souboru:    formatting.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Sada funkcí pro fomátováí různých hodnot
 */

import { format } from "date-fns";

export const extractDate = (date: Date | null | undefined) => {
  if (!date) return "--";

  const newDate = new Date(date).toLocaleDateString("cs-CZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  });
  return newDate;
};

export const extractTime = (time: Date | null | undefined): string => {
  if (!time) return "--";

  const newTime = new Date(time).toLocaleTimeString("en", {
    timeStyle: "short",
    hour12: false,
    timeZone: "UTC",
  });
  return newTime;
};

export const formatDate = (timestamp: number): string => {
  return format(timestamp, "dd.MM.yyyy HH:mm:ss");
};

export const formatPercentage = (
  first: number | null | undefined,
  second: number | null | undefined,
): string => {
  // Pokud je první nebo druhá hodnota undefined nebo null, vrátíme "-- %"
  if (first == null || second == null) {
    return "-- %";
  }

  // Pokud je druhá hodnota nula, vyhneme se dělení nulou
  if (second === 0) {
    return "-- %";
  }

  // Jinak provedeme výpočet a zaokrouhlíme na celé číslo
  return Math.round((first / second) * 100) + " %";
};

export const formatPercentageOneDecimal = (
  first: number | null | undefined,
  second: number | null | undefined,
): string => {
  // Pokud je první nebo druhá hodnota undefined nebo null, vrátíme "-- %"
  if (first == null || second == null) {
    return "-- %";
  }

  // Pokud je druhá hodnota nula, vyhneme se dělení nulou
  if (second === 0) {
    return "-- %";
  }

  // Jinak provedeme výpočet a zaokrouhlíme na jedno desetinné místo
  return ((first / second) * 100).toFixed(1) + " %";
};

export const formatPercentageNoRound = (
  first: number | null | undefined,
  second: number | null | undefined,
): string => {
  if (first == null || second == null) {
    return "-- %";
  }

  if (second === 0) {
    return "-- %";
  }

  // Výpočet s jedním desetinným místem
  const percentage = (first / second) * 100;
  return percentage.toFixed(1) + " %";
};

// Vrátí číslo, nebo "--" pokud je hodnota null nebo undefined
export const formatValue = (
  value: number | null | undefined,
): string | number => {
  return value === null || value === undefined ? "--" : value;
};
