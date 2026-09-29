/*
 * Název souboru:    utils.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Obsahuje pomocné funkce pro práci s třídami CSS, testovými režimy a extrahování hodnot z objektů.
 */

import { type ClassValue, clsx } from "clsx";
import {
  ExaminationWithPatient,
  testModes,
} from "features/examination/types/types";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pluck = <T, K extends keyof T>(array: T[], key: K) => {
  return array.map((item) => item[key]);
};

export const isIsometric = (examination: ExaminationWithPatient) => {
  return examination.test_mode === testModes.ISOMETRIC ? true : false;
};

export const isIsokinetic = (examination: ExaminationWithPatient) => {
  return (
    [
      testModes.ISOKINETIC_CONC_CONC,
      testModes.ISOKINETIC_CONC_ECC,
      testModes.ISOKINETIC_ECC_CONC,
      testModes.ISOKINETIC_ECC_ECC,
    ] as string[]
  ).includes(examination.test_mode);
};

export const isAthletic = (examination: ExaminationWithPatient) => {
  return examination.test_mode === testModes.ATHLETIC ? true : false;
};
