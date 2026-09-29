/*
 * Název souboru:    useFetchMeasurementsById.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook pro načtení měření podle ID vyšetření z databáze
 */

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "utils/api/fetchData";
import { Measurement } from "types/types";

type useFetchMeasurementsByIdProps = {
  id: string | undefined;
};

const useFetchMeasurementsById = ({ id }: useFetchMeasurementsByIdProps) => {
  return useQuery({
    queryFn: () => fetchData<Measurement[]>("measurement/" + id),
    queryKey: ["measurements", id],
    refetchOnWindowFocus: false,
  });
};

export default useFetchMeasurementsById;
