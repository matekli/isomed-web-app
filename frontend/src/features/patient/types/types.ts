/*
 * Název souboru:    types.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Typy používané v kontextu pacientů
 */

import { GroupMembership } from "features/group/types/types";

export type Patient = {
  id: string;
  firstname: string;
  lastname: string;
  birthday: Date | null;
  height: number;
  weight: number;
  sex: string;
  patient_groups: GroupMembership[];
};

export type PatientTableData = {
  id: string;
  name: string;
  birthday: Date | null;
  groups: string[];
};
