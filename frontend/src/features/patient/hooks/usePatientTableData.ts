/*
 * Název souboru:    usePatientTableDat.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro připravení dat pro zobrazení v tabulce
 */

import { useMemo } from "react";
import { Patient, PatientTableData } from "../types/types";

interface usePatientTableDataProps {
  patients: Patient[];
}
const usePatientTableData = ({ patients }: usePatientTableDataProps) => {
  const prepareData = (patients: Patient[]): PatientTableData[] => {
    if (!Array.isArray(patients)) {
      return [];
    }
    return patients.map((patient) => {
      const { id, firstname, lastname, birthday, patient_groups } = patient;

      const name = `${firstname} ${lastname}`;

      const groupIds = patient_groups.map((group) => group.group_id.toString());

      return {
        id: id.toString(),
        name: name,
        birthday,
        groups: groupIds,
      };
    });
  };

  return useMemo(() => prepareData(patients), [patients]);
};

export default usePatientTableData;
