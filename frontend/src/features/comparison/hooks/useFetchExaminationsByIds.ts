/*
 * Název souboru:    useFetchExaminationsByIds.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro načtení vyšetření podle zadaných ID, využíva useQuery
 */

import { useQuery } from "@tanstack/react-query";
import { ExaminationWithPatient } from "features/examination/types/types";
import { fetchData } from "utils/api/fetchData";
import { Comparison } from "../types/types";
import { useComparisonStore } from "../store/comparisonStore";
import { useMemo } from "react";

type useFetchExaminationsByIdsProps = {
  comparisons: Comparison[];
  ids?: string[];
};
const useFetchExaminationsByIds = ({
  comparisons,
  ids,
}: useFetchExaminationsByIdsProps) => {
  const { loaded, examinations } = useComparisonStore();
  const joinedIds = useMemo(() => {
    return ids ? ids.join(",") : comparisons.map((item) => item.id).join(",");
  }, [ids, comparisons]);

  const query = useQuery({
    queryFn: () => {
      return fetchData<ExaminationWithPatient[]>(
        `examination/many?ids=${joinedIds}`,
      );
    },
    queryKey: ["examination", "many", joinedIds],
    refetchOnWindowFocus: false,
    enabled: !loaded,
  });

  return {
    ...query,
    data: loaded ? examinations : query.data,
    isFetching: !loaded && query.isFetching,
  };
};

export default useFetchExaminationsByIds;
