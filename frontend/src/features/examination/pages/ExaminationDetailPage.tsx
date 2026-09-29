/*
 * Název souboru:    ExaminationDetailPage.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Stránka detailu vyšetření
 */

import { useParams } from "react-router-dom";
import { Loader } from "components/ui/loader";
import useFetchExaminationById from "../hooks/useFetchExaminationById";
import useFetchMeasurementsById from "../hooks/useFetchMeasurementsById";
import IsokineticDetail from "../components/IsokineticDetail";
import IsometricDetail from "../components/IsometricDetail";
import { isIsometric } from "utils/utils";

const ExaminationDetailPage = () => {
  const { examination_id } = useParams();

  const { data: examination, isFetching: isExaminationFetching } =
    useFetchExaminationById({ examination_id });

  const { data: measurements, isFetching: isMeasurementsFetching } =
    useFetchMeasurementsById({ id: examination_id });

  const isLoading = isExaminationFetching || isMeasurementsFetching;

  if (isLoading || !examination || !measurements) {
    return <Loader />;
  }

  return isIsometric(examination) ? (
    <IsometricDetail examination={examination} measurements={measurements} />
  ) : (
    <IsokineticDetail examination={examination} measurements={measurements} />
  );
};

export default ExaminationDetailPage;
