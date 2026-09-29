/*
 * Název souboru:    constants.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Soubor obsahující konstanty a definice pro testy, jako jsou
 *                   možnosti testování, limity a popisky pro výsledky
 *                   isokinetických a izometrických testů.
 */

import {
  IsokineticResults,
  IsometricResults,
} from "features/comparison/types/types";

export const NUMBER_OF_TABLES = 2;
export const THRESHOLD_TORQUE = 0.35;
export const THRESHOLD_REP_LENGTH = 0.35;
export const CHART_ZOOM_IN = 0.8;
export const CHART_ZOOM_OUT = 1.2;
export const INITIAL_CHART_START = 0;
export const INITIAL_CHART_END = 1000;
export const CHART_BOUNDS_RATIO = 1.0;

export type TestModeOption = {
  value: string;
  label: string;
};

export type PlaneOption = {
  value: string;
  label: string;
};

export type JointOption = {
  value: string;
  label: string;
};

export const JointOptions: JointOption[] = [
  { value: "0", label: "Knee" },
  { value: "1", label: "Thigh" },
  { value: "2", label: "Shoulder" },
  { value: "3", label: "Elbow" },
  { value: "4", label: "Forearm" },
  { value: "5", label: "Wrist" },
  { value: "6", label: "Ankle" },
  { value: "7", label: "Kinetic chain" },
  { value: "8", label: "Back" },
  { value: "9", label: "X-Series" },
];

export const TestModeOptions: TestModeOption[] = [
  { value: "1", label: "ISOKINETIC CON/CON" },
  { value: "2", label: "ISOKINETIC CON/ECC" },
  { value: "3", label: "ISOKINETIC ECC/CON" },
  { value: "4", label: "ISOKINETIC ECC/ECC" },
  { value: "6", label: "ISOMETRIC" },
  { value: "7", label: "ACTIVE/ASSISTIVE" },
  { value: "21", label: "DUAL ATHLETIC" },
];

export const IsometricPlaneOptions: PlaneOption[] = [
  { value: "", label: "Filter by plane" },
  { value: "0", label: "Flexion" },
  { value: "1", label: "Extension" },
  { value: "2", label: "Plantar Extension" },
  { value: "3", label: "Dorsal Extension" },
  { value: "4", label: "Plantar 90° F." },
  { value: "5", label: "Dorsal 90° F." },
  { value: "6", label: "Inversion" },
  { value: "7", label: "Eversion" },
  { value: "8", label: "Abduction" },
  { value: "9", label: "Adduction" },
  { value: "10", label: "Horizontal Abduction" },
  { value: "11", label: "Horizontal Adduction" },
  { value: "12", label: "Internal Rotation" },
  { value: "13", label: "External Rotation" },
  { value: "14", label: "Internal Rotation 90° A." },
  { value: "15", label: "External Rotation 90° A." },
  { value: "16", label: "Internal Rotation Neutral" },
  { value: "17", label: "External Rotation Neutral" },
  { value: "18", label: "Internal Rotation 90° F." },
  { value: "19", label: "External Rotation 90° F." },
  { value: "20", label: "Pronation" },
  { value: "21", label: "Supination" },
  { value: "22", label: "Radial Deviation" },
  { value: "23", label: "Ulnar Deviation" },
  { value: "30", label: "Left Rotation" },
  { value: "31", label: "Right Rotation" },
];

export const OtherPlaneOptions: PlaneOption[] = [
  { value: "", label: "Filter by plane" },
  { value: "32", label: "Flexion / Extension" },
  { value: "33", label: "Plantar / Dorsal Ext." },
  { value: "34", label: "Plantar / Dorsal 90° F." },
  { value: "35", label: "Inversion / Eversion" },
  { value: "36", label: "Abduction / Adduction" },
  { value: "37", label: "Horizontal Abd. / Add." },
  { value: "38", label: "Internal Rot. / External Rot." },
  { value: "39", label: "Internal Rot. / External Rot. 90° A." },
  { value: "40", label: "Internal Rot. / External Rot. Neutral" },
  { value: "41", label: "Internal Rot. / External Rot. 90° F." },
  { value: "42", label: "Pronation / Supination" },
  { value: "43", label: "Radial / Ulnar Deviation" },
  { value: "44", label: "Left Rot. / Right Rot." },
];

export const planeLabelsIsometric = new Map<string, string[]>([
  ["0", ["Flex"]],
  ["1", ["Ext"]],
  ["2", ["P.Ext"]],
  ["3", ["D.Ext"]],
  ["4", ["P.Flex"]],
  ["5", ["D.Flex"]],
  ["6", ["Inv"]],
  ["7", ["Evr"]],
  ["8", ["Abd"]],
  ["9", ["Add"]],
  ["10", ["H.Abd"]],
  ["11", ["H.Add"]],
  ["12", ["I.Rot"]],
  ["13", ["E.Rot"]],
  ["14", ["I.R.90A"]],
  ["15", ["E.R.90A"]],
  ["16", ["I.R.Neu."]],
  ["17", ["E.R.Neu."]],
  ["18", ["I.R.90F"]],
  ["19", ["E.R.90F"]],
  ["20", ["Pro"]],
  ["21", ["Sup"]],
  ["22", ["Rad.D."]],
  ["23", ["Uln.D."]],
  ["30", ["L.Rot"]],
  ["31", ["R.Rot"]],
]);

export const planeLabelsDefault = new Map<string, string[]>([
  ["0", ["Flex", "Ext"]],
  ["1", ["P.Ext", "D.Ext"]],
  ["2", ["P.90F", "D.90F"]],
  ["3", ["Inv", "Evr"]],
  ["4", ["Abd", "Add"]],
  ["5", ["H.Abd", "H.Add"]],
  ["6", ["I.Rot", "E.Rot"]],
  ["7", ["I.Ro.", "E.Ro."]],
  ["8", ["I.Ro.", "E.Ro."]],
  ["9", ["I.Ro.", "E.Ro."]],
  ["10", ["Pro", "Sup"]],
  ["11", ["Rad.D.", "Uln.D."]],
  ["15", ["L.Rot", "R.Rot"]],
]);

export const isokineticResultsHeaders: Record<keyof IsokineticResults, string> =
  {
    speed: "Speed (°/s)",
    maxTorque: "Max Torque",
    maxTorqueAt: "Degree at Max. Torque",
    maxTorqueWeight: "Max Torque/Weight",
    torqueAtOff: "Torque at",
    torqueOffWeight: "Torque at off/Weight",
    work: "Work (J)",
    workWeight: "Work/Weight",
    power: "Power (W)",
    mSecMaxTorque: "mSec Max. torque",
    rangeMotion: "Range Motion (°)",
  };

export const isometricResultsHeaders: Record<keyof IsometricResults, string> = {
  holdAngle: "Hold angle",
  maxTorque: "Max Torque",
  maxTorqueTime: "Time at Max. Torque",
  maxTorqueWeight: "Max Torque/Weight",
  torqueAtOff: "Torque at ",
  torqueoffMsWt: "Torque at off/Weight",
  averageTorque: "⌀ Torque",
};

export const athleticResultsHeaders: Record<keyof IsokineticResults, string> = {
  speed: "Speed (cm/s)",
  maxTorque: "Max Force (N)",
  maxTorqueAt: "cm at Max. Force",
  maxTorqueWeight: "Max Force/Weight",
  torqueAtOff: "Force at ",
  torqueOffWeight: "Force at off/Weight",
  work: "Work (J)",
  workWeight: "Work/Weight",
  power: "Power (W)",
  mSecMaxTorque: "mSec Max. force",
  rangeMotion: "Range Motion (cm)",
};
