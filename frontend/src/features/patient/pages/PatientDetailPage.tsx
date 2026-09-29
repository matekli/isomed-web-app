/*
 * Název souboru:    PatientDetailPage.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Stránka pro zobrazení detailu pacienta
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { extractDate } from "utils/formatting";
import { Loader } from "components/ui/loader";
import PageTitle from "components/PageTitle";
import { fetchData } from "utils/api/fetchData";
import { useEffect, useState } from "react";
import { ExaminationWithPatient } from "features/examination/types/types";
import { Group } from "features/group/types/types";
import { Patient } from "../types/types";
import ExaminationDataTable from "features/examination/components/ExaminationList/ExaminationDataTable";
import { anonymize } from "utils/anonymize";
import { useSettingsContext } from "features/settings/contexts/SettingsContext";

const PatietDetailPage = () => {
  const [clickedRowId, setClickedRowId] = useState<string>("");

  const { patient_id } = useParams();

  const { settings } = useSettingsContext();
  const queryClient = useQueryClient();
  const { data: patient, isLoading: isPatientLoading } = useQuery({
    queryFn: () => fetchData<Patient>("patient/" + patient_id),
    queryKey: ["patient", patient_id],
  });

  const { data: examinations, isLoading: isExaminationLoading } = useQuery({
    queryFn: () =>
      fetchData<ExaminationWithPatient[]>(
        "patient/" + patient_id + "/examination",
      ),
    queryKey: ["patient", patient_id, "examination"],
  });

  const { data: groups, isLoading: isGroupsLoading } = useQuery({
    queryFn: () => fetchData<Group[]>("examination/group"),
    queryKey: ["examinationGroups"],
  });

  useEffect(() => {
    queryClient.removeQueries({
      queryKey: ["patient", patient_id, "examination"],
    });
  }, [patient_id]);

  return (
    <>
      <PageTitle text="patient detail" />
      {!isPatientLoading &&
      !isExaminationLoading &&
      examinations &&
      !isGroupsLoading &&
      groups ? (
        <div className="m-auto mb-8 flex w-11/12 max-w-[1536px] flex-col gap-2 rounded-lg border-2 border-primary bg-white p-4 md:flex-row">
          {patient && (
            <div className="h-min w-4/12 min-w-[250px] rounded-lg border-2 border-primary p-2">
              <h2 className="pb-4 text-left text-xl font-bold">
                {anonymize(
                  patient.firstname + " " + patient.lastname,
                  settings?.safeMode,
                )}
              </h2>
              <div className="flex gap-x-2">
                <div>Birthday:</div>
                <div className="font-semibold">
                  {anonymize(extractDate(patient.birthday), settings?.safeMode)}
                </div>
              </div>
              <div className="flex gap-x-2">
                <div>Weight:</div>{" "}
                <div className="font-semibold">
                  {patient.weight ? patient.weight + " kg" : "--"}
                </div>
              </div>
              <div className="flex gap-x-2">
                <div>Height:</div>{" "}
                <div className="font-semibold">
                  {patient.height ? patient.height + " cm" : "--"}
                </div>
              </div>
              <div className="flex gap-x-2">
                <div>Sex:</div>
                <div className="font-semibold">
                  {patient.sex ? patient.sex : "--"}
                </div>
              </div>
            </div>
          )}
          <div className="w-full">
            <ExaminationDataTable
              examinations={examinations}
              groups={groups}
              getClickedRowId={(id) => setClickedRowId(id)}
              rowClickRedirectURL={"/examination/" + clickedRowId}
              columnVisibility={{
                id: true,
                patient: false,
                groups: false,
              }}
              filterVisibility={{ id: false, patient: false }}
            />
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default PatietDetailPage;
