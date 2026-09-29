/*
 * Název souboru:    converting.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Sada funkcí pro převod číselných hodnot na textové reprezentace
 */

import { planeLabelsDefault, planeLabelsIsometric } from "constants/constants";
import { TestMode } from "features/examination/types/types";
import { MeasurementPhase } from "types/types";

const joints = new Map<string, string>([
  ["0", "Knee"],
  ["1", "thigh"],
  ["2", "shoulder"],
  ["3", "elbow"],
  ["4", "forearm"],
  ["5", "wrist"],
  ["6", "ankle"],
  ["7", "k. chain"],
  ["8", "back"],
  ["9", "X-series"],
]);

const sides = new Map<string, string>([
  ["0", "R."],
  ["1", "L."],
  ["2", "Both"],
]);

const isometricPlanes = new Map<string, string>([
  ["0", "Flex"],
  ["1", "Ext"],
  ["2", "Pl.Ext"],
  ["3", "Do.Ext"],
  ["4", "Pl. 90° F."],
  ["5", "Do. 90° F."],
  ["6", "Inversion"],
  ["7", "Eversion"],
  ["8", "Abduction"],
  ["9", "Adduction"],
  ["10", "Hor.Abd."],
  ["11", "Hor.Add."],
  ["12", "Int.Rotation"],
  ["13", "Ext.Rotation"],
  ["14", "Int.R.90° A."],
  ["15", "Ext.R.90° A."],
  ["16", "Int.Rot.Neu"],
  ["17", "Ext.Rot.Neu"],
  ["18", "Int.R.90° F."],
  ["19", "Ext.R.90° F."],
  ["20", "Pronation"],
  ["21", "Supination"],
  ["22", "Radial Dev."],
  ["23", "Ulnar Dev."],
  ["30", "Left Rot."],
  ["31", "Right Rot."],
]);

const standartPlanes = new Map<string, string>([
  ["0", "Flex / Ext"],
  ["1", "Plantar / Dorsal Ext."],
  ["2", "Plantar / Dorsal 90° F."],
  ["3", "Inversion / Eversion"],
  ["4", "Abduction / Adduction"],
  ["5", "Horizontal Abd. / Add."],
  ["6", "Int Rot. / Ext Rot."],
  ["7", "Int / Ext Rot. 90° A."],
  ["8", "Int / Ext Rot. Neu."],
  ["9", "Int / Ext Rot. 90° F."],
  ["10", "Pronation / Supination"],
  ["11", "Radial / Ulnar Deviation"],
  ["15", "Left Rot. / Right Rot."],
]);

const standartPlanesShort = new Map<string, string>([
  ["0", "Flex/Ext"],
  ["1", "Pl/Dor Ext."],
  ["2", "Pl/Dor 90° F."],
  ["3", "Inver/Evers"],
  ["4", "Abduc/Adduc"],
  ["5", "Hor Abd/Add"],
  ["6", "Int R/Ext R"],
  ["7", "Int/Ext R 90° A."],
  ["8", "Int/Ext R. N."],
  ["9", "Int/Ext R. 90° F."],
  ["10", "Pronat/Supin"],
  ["11", "Rad/Uln Devia"],
  ["15", "Left R/Right R"],
]);

const testModes = new Map<TestMode, string>([
  ["1", "ISOKINETIC CON/CON"],
  ["2", "ISOKINETIC CON/ECC"],
  ["3", "ISOKINETIC ECC/CON"],
  ["4", "ISOKINETIC ECC/ECC"],
  ["6", "ISOMETRIC"],
  ["7", "ACTIVE/ASSISTIVE"],
  ["21", "DUAL ATHLETIC"],
]);

const testModesShort = new Map<TestMode, string>([
  ["1", "Isokin con/con"],
  ["2", "Isokin con/ecc"],
  ["3", "Isokin ecc/con"],
  ["4", "Isokin ecc/ecc"],
  ["6", "Isometric"],
  ["7", "Active/assistive"],
  ["21", "Dual athletic"],
]);

const gravComp = new Map<string, string>([
  ["0", "off"],
  ["1", "on"],
]);

export const convertJoint = (joint: string) => {
  return joints.get(joint.toString()) || "not defined";
};

export const convertSide = (side: string) => {
  return sides.get(side) || "not defined";
};

export const convertPlane = (plane: string, testMode: string) => {
  return (
    (testMode === "6" ? isometricPlanes : standartPlanes).get(plane) ||
    "not defined"
  );
};

export const convertPlaneShort = (plane: string, testMode: string) => {
  return (
    (testMode === "6" ? isometricPlanes : standartPlanesShort).get(plane) ||
    "not defined"
  );
};

export const convertTestMode = (testMode: TestMode) => {
  return testModes.get(testMode) || "not defined";
};

export const convertTestModeShort = (testMode: TestMode) => {
  return testModesShort.get(testMode) || "not defined";
};

export const convertGravComp = (comp: string) => {
  return gravComp.get(comp) || "not defined";
};

export const getMappedPlane = (plane: string, testMode: string) => {
  const planeMappings = new Map<string, string>([
    ["0", "32"],
    ["1", "33"],
    ["2", "34"],
    ["3", "35"],
    ["4", "36"],
    ["5", "37"],
    ["6", "38"],
    ["7", "39"],
    ["8", "40"],
    ["9", "41"],
    ["10", "42"],
    ["11", "43"],
    ["15", "44"],
  ]);

  if (testMode === "6") {
    return plane;
  }

  return planeMappings.get(plane) || "-1";
};

export const getDemappedPlane = (plane: string, testMode: string) => {
  const planeMappings = new Map<string, string>([
    ["32", "0"],
    ["33", "1"],
    ["34", "2"],
    ["35", "3"],
    ["36", "4"],
    ["37", "5"],
    ["38", "6"],
    ["39", "7"],
    ["40", "8"],
    ["41", "9"],
    ["42", "10"],
    ["43", "11"],
    ["44", "15"],
  ]);
  if (testMode === "6") {
    return plane;
  }

  return planeMappings.get(plane) || "-1";
};

export const getPlaneLabels = (
  testMode: string,
  plane: string,
  type?: MeasurementPhase,
): [string, string] => {
  const labels = (testMode === "6"
    ? planeLabelsIsometric
    : planeLabelsDefault
  ).get(plane) || ["not defined"];

  if (labels.length === 1) {
    return [labels[0], labels[0]];
  } else if (labels.length === 2) {
    if (type === "M1") {
      return [labels[0], labels[0]];
    }
    if (type === "M2") {
      return [labels[1], labels[1]];
    }
    return [labels[0], labels[1]];
  } else {
    return ["not defined", "not defined"];
  }
};
