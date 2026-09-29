/*
 * Název souboru:    types.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Typy používané v kontextu vyšetření
 */

import { IsokineticResults } from "features/comparison/types/types";
import { GroupMembership } from "features/group/types/types";
import { Patient } from "features/patient/types/types";

export const testModes = {
  ISOKINETIC_CONC_CONC: "1",
  ISOKINETIC_CONC_ECC: "2",
  ISOKINETIC_ECC_CONC: "3",
  ISOKINETIC_ECC_ECC: "4",
  ISOMETRIC: "6",
  ASSISTIVE: "7",
  ATHLETIC: "21",
} as const;

export type TestMode = (typeof testModes)[keyof typeof testModes];

export const joints = {
  KNEE: "0",
  THIGH: "1",
  SHOULDER: "2",
  ELBOW: "3",
  FOREARM: "4",
  WRIST: "5",
  ANKLE: "6",
  KINETIC_CHAIN: "7",
  BACK: "8",
  X_SERIES: "9",
} as const;

export type Joint = (typeof joints)[keyof typeof joints];

export const sides = {
  UNDEFINED: "-1",
  RIGHT: "0",
  LEFT: "1",
  BOTH_SIDES: "2",
} as const;

export type Side = (typeof sides)[keyof typeof sides];

export const isometricPlanes = {
  FLEXION: "0",
  EXTENSION: "1",
  PLANTAR_EXTENSION: "2",
  DORSAL_EXTENSION: "3",
  PLANTAR_90F: "4",
  DORSAL_90F: "5",
  INVERSION: "6",
  EVERSION: "7",
  ABDUCTION: "8",
  ADDUCTION: "9",
  HORIZONTAL_ABDUCTION: "10",
  HORIZONTAL_ADDUCTION: "11",
  INTERNAL_ROTATION: "12",
  EXTERNAL_ROTATION: "13",
  INTERNAL_ROTATION_90A: "14",
  EXTERNAL_ROTATION_90A: "15",
  INTERNAL_ROTATION_NEUTRAL: "16",
  EXTERNAL_ROTATION_NEUTRAL: "17",
  INTERNAL_ROTATION_90F: "18",
  EXTERNAL_ROTATION_90F: "19",
  PRONATION: "20",
  SUPINATION: "21",
  RADIAL_DEVIATION: "22",
  ULNAR_DEVIATION: "23",
  LEFT_ROTATION: "30",
  RIGHT_ROTATION: "31",
} as const;

export type IsometricPlane =
  (typeof isometricPlanes)[keyof typeof isometricPlanes];

export const defaultPlanes = {
  FLEXION_EXTENSION: "0",
  PLANTAR_DORSAL_EXTENSION: "1",
  PLANTAR_DORSAL_90F: "2",
  INVERSION_EVERSION: "3",
  ABDUCTION_ADDUCTION: "4",
  HORIZONTAL_ABD_ADDUCTION: "5",
  INTERNAL_EXTERNAL_ROTATION: "6",
  INTERNAL_EXTERNAL_ROTATION_90A: "7",
  INTERNAL_EXTERNAL_ROTATION_NEUTRAL: "8",
  INTERNAL_EXTERNAL_ROTATION_90F: "9",
  PRONATION_SUPINATION: "10",
  RADIAL_ULNAR_DEVIATION: "11",
  LEFT_RIGHT_ROTATION: "15",
} as const;

export type DefaultPlane = (typeof defaultPlanes)[keyof typeof defaultPlanes];

export type Examination = {
  id: string;
  datetime: Date;
  joint_side: string;
  test_mode: TestMode;
  joint: string;
  plane: string;
  motion_start: number;
  motion_end: number;
  speed_1: number;
  speed_2: number;
  acceleration_conc: number;
  acceleration_ecc: number;
  decceleration_conc: number;
  decceleration_ecc: number;
  number_of_sets: number;
  number_of_repetitions: number;
  grafity_compensation: string;
  hold_time: number;
  break: number;
  weight: number;
};

export type ExaminationWithPatient = Examination & {
  patient: Patient;
  examination_groups: GroupMembership[];
};

// Isokinetické výsledky v detailu vyšetření
export type IsokineticResultsData = {
  repetition: number | null;
  data: IsokineticResults;
};

// Isometrické výsledky v detailu vyšetření
export type IsometricResultsData = {
  set: number | null;
  data: {
    holdAngle: number | null;
    maxTorque: number | null;
    maxTorqueTime: number | null;
    maxTorqueWeight: number | null;
    torqueAtOff: number | null;
    torqueoffMsWt: number | null;
    averageTorque: number | null;
  };
};

// Typ pro data, která se zobrazuji v data-table
export type ExaminationTableData = {
  id: string;
  patient: string;
  test_mode: TestMode;
  plane: string;
  datetime: Date;
  joint: string;
  side: string;
  number_of_repetitions: number;
  number_of_sets: number;
  groups: string[];
  speed: string;
};

// Slouží pro skrývání čar v grafu pro typ athletic
export type HideSide = {
  left: boolean;
  right: boolean;
  main: boolean;
};
