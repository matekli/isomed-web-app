/*
 * Název souboru:    useFetchExaminationById.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro načtení vyšetření podle ID z databáze
 */

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "utils/api/fetchData";
import { ExaminationWithPatient } from "../types/types";

type useFetchExaminationByIdProps = {
  examination_id: string | undefined;
};

const useFetchExaminationById = ({
  examination_id,
}: useFetchExaminationByIdProps) => {
  return useQuery({
    queryFn: () =>
      fetchData<ExaminationWithPatient>("examination/" + examination_id),
    queryKey: ["examination", examination_id],
    refetchOnWindowFocus: false,
  });
};

export default useFetchExaminationById;
