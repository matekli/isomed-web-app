/*
 * Název souboru:    useExaminationTableData.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro připravení dat pro zobrazení v tabulce
 */

import { useMemo } from "react";
import { getMappedPlane } from "utils/converting";
import { ExaminationWithPatient, ExaminationTableData } from "../types/types";

interface useExaminationTableDataProps {
  examinations: ExaminationWithPatient[];
}
export const useExaminationTableData = ({
  examinations,
}: useExaminationTableDataProps) => {
  const prepareData = (
    examinations: ExaminationWithPatient[],
  ): ExaminationTableData[] => {
    if (!Array.isArray(examinations)) {
      return [];
    }
    return examinations.map((examination) => {
      const {
        id,
        patient,
        test_mode,
        plane,
        datetime,
        joint_side,
        joint,
        number_of_repetitions,
        number_of_sets,
        examination_groups,
        speed_1,
        speed_2,
      } = examination;

      const name = patient
        ? `${patient.firstname} ${patient.lastname}`
        : "Unknown Patient";

      const groupIds = examination_groups.map((group) =>
        group.group_id.toString(),
      );
      return {
        id,
        patient: name,
        test_mode: test_mode,
        plane: getMappedPlane(plane.toString(), test_mode.toString()),
        datetime,
        joint: joint,
        side: joint_side,
        number_of_repetitions,
        number_of_sets,
        groups: groupIds,
        speed: `${speed_1.toString()} / ${speed_2.toString()}`,
      };
    });
  };

  return useMemo(() => prepareData(examinations), [examinations]);
};
