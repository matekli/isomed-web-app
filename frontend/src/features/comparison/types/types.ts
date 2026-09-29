/*
 * Název souboru:    types.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Typy používané v kontextu porovnání
 */

import { ExaminationWithPatient } from "features/examination/types/types";
import {
  IsometricSet,
  Measurement,
  MeasurementPhase,
  Repetition,
} from "types/types";

export type TestType = "isokinetic" | "isometric" | "assisitive" | "athletic";

export type ComparisonList = {
  index: number;
  type: TestType;
  joint: string;
  comparisons: Comparison[];
};

// Takhle vypadá comparison v localStorage
export type Comparison = {
  id: string;
  set: number;
  repetitionsToDelete: number[];
  type: TestType;
  joint: string;
};

export type MeasurementsByExamination = {
  examination_id: string;
  measurements: Measurement[];
};

export type RepetitionsByExamination = {
  examination_id: string;
  set: number;
  repetitions: Repetition[];
};

export type IsometricSetsByExamination = {
  examination_id: string;
  sets: IsometricSet[];
};

type Row = {
  M1: number | null;
  M2: number | null;
};

export type IsokineticResults = {
  speed: Row;
  maxTorque: Row;
  maxTorqueAt: Row;
  maxTorqueWeight: Row;
  torqueAtOff: Row;
  torqueOffWeight: Row;
  work: Row;
  workWeight: Row;
  power: Row;
  mSecMaxTorque: Row;
  rangeMotion: Row;
};

export type IsokineticResultsByExamination = {
  examination_id: string;
  set: number;
  data: IsokineticResults;
};

export type IsometricResults = {
  holdAngle: number | null;
  maxTorque: number | null;
  maxTorqueTime: number | null;
  maxTorqueWeight: number | null;
  torqueAtOff: number | null;
  torqueoffMsWt: number | null;
  averageTorque: number | null;
};

export type IsometricResultsByExamination = {
  examination_id: string;
  holdAngle: number | null;
  set: number | null;
  data: IsometricResults;
};

//----------------------------------------------------------------------//
export type Averages = {
  type: MeasurementPhase;
  relative_position: number;
  torque: number;
  speed: number;
};

export type AveragesByExamination = {
  examination_id: string;
  set: number;
  averages: {
    M1Data: Averages[];
    M2Data: Averages[];
  };
};

export type BoundsByExamination = {
  examination_id: string;
  set: number;
  bounds: number[];
};

export type IndexedExamination = {
  data: ExaminationWithPatient;
  set: number;
  index: number;
};

export type DeletedRepsByExamination = {
  examination_id: string;
  set: number | null;
  toDelete: number[];
};

export type IdToCompare = {
  id: string;
  set: number;
};

export const joint = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export type ComparisonColorSet = {
  mainColor: string;
  M1Color: string;
  M2Color: string;
};

export type ComparisonColors = {
  examination_id: string;
  set: number;
  colors: ComparisonColorSet;
};

export type ReportColor = {
  examination_id: string;
  set: number;
  color: string;
};

export type IdToHide = {
  id: string;
  set: number;
};
