/*
 * Název souboru:    types.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Typy použivané v kontextu exportu a editace zprávy
 */

import { IsokineticResultsData } from "features/examination/types/types";

export type ReportData = {
  description: string;
  title: string;
  comment: string;
};

export type PrintRepetitionsResults = {
  examination_id: string;
  results: IsokineticResultsData[];
};

export type Row = {
  M1: number | null;
  M2: number | null;
};

export type PrintResults = {
  peakTorque: Row;
  peakTorqueRep: Row;
  atAngle: Row;
  peakWork: Row;
  peakWorkRep: Row;
  peakTorqueM1ByM2: Row;
  peakTorqueM2ByM1: Row;
  peakWorkM1ByM2: Row;
  peakWorkM2ByM1: Row;
  peakTorqueWeight: Row;
  peakWorkWeight: Row;
  averageWork: Row;
  totalWork: Row;
  peakPower: Row;
  peakPowerRep: Row;
  averagePower: Row;
};

export type PrintResultsWithId = {
  examination_id: string;
  set: number;
  results: PrintResults;
};

export type ExtendedResults = PrintResultsWithId & {
  results: PrintResults & {
    maxTorque: Row;
    rangeMotion: Row;
  };
};
