/*
 * Název souboru:    useFetchMeasurementsByIds.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro načtení meření podle zadaných ID, využíva useQuery
 */

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "utils/api/fetchData";
import { Comparison, MeasurementsByExamination } from "../types/types";
import { useComparisonStore } from "../store/comparisonStore";

type useFetchMeasurementsByIdsProps = {
  comparisons: Comparison[];
};

const useFetchMeasurementsByIds = ({
  comparisons,
}: useFetchMeasurementsByIdsProps) => {
  const { loaded, measurements } = useComparisonStore();

  const joinedIds = comparisons.map((item) => item.id).join(",");
  const query = useQuery({
    queryFn: () => {
      return fetchData<MeasurementsByExamination[]>(
        `measurement/many?ids=${joinedIds}`,
      );
    },
    queryKey: ["measurements", "many", joinedIds],
    refetchOnWindowFocus: false,
    enabled: !loaded,
  });
  return {
    ...query,
    data: loaded ? measurements : query.data,
    isFetching: !loaded && query.isFetching,
  };
};

export default useFetchMeasurementsByIds;
