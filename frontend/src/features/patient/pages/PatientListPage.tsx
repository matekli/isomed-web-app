/*
 * Název souboru:    PatientListPage.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Stránka pro zobrazení seznamu pacientů
 */

import { useQuery } from "@tanstack/react-query";
import PageTitle from "components/PageTitle";
import { Loader } from "components/ui/loader";
import { useState } from "react";
import { fetchData } from "utils/api/fetchData";
import PatientDataTable from "features/patient/components/PatientDataTable";
import { Group } from "features/group/types/types";
import { Patient } from "../types/types";

const PatientListPage = () => {
  const [clickedRowId, setClickedRowId] = useState<string>("");

  const { data: patients, isLoading: isPatientsLoading } = useQuery({
    queryFn: () => fetchData<Patient[]>("patient"),
    queryKey: ["patient"],
  });

  const { data: groups, isLoading: isGroupsLoading } = useQuery({
    queryFn: () => fetchData<Group[]>("patient/group"),
    queryKey: ["patientGroups"],
  });

  return (
    <div className="f-full h-full">
      <PageTitle text="patients" />
      {!isPatientsLoading && patients && !isGroupsLoading && groups ? (
        <div className="m-auto mb-8 w-1/2 min-w-96 max-w-[800px] overflow-hidden rounded-lg border-2 border-primary bg-white p-2">
          <PatientDataTable
            patients={patients}
            groups={groups}
            getClickedRowId={(id) => setClickedRowId(id)}
            rowClickRedirectURL={"/patient/" + clickedRowId}
            columnVisibility={{ id: false, groups: false }}
          />
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default PatientListPage;
