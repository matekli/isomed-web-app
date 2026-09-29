/*
 * Název souboru:    ExaminationListPage.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Stránka seznamu vyšetření
 */

import { useQuery } from "@tanstack/react-query";
import PageTitle from "components/PageTitle";
import { Loader } from "components/ui/loader";
import { useState } from "react";
import { fetchData } from "utils/api/fetchData";
import { Group } from "features/group/types/types";
import { ExaminationWithPatient } from "../types/types";
import ExaminationDataTable from "../components/ExaminationList/ExaminationDataTable";

const ExaminationListPage = () => {
  const [clickedRowId, setClickedRowId] = useState<string>("");
  const { data: examinations, isLoading: isExaminationLoading } = useQuery({
    queryFn: () => fetchData<ExaminationWithPatient[]>("examination"),
    queryKey: ["examination"],
  });

  const { data: groups, isLoading: isGroupsLoading } = useQuery({
    queryFn: () => fetchData<Group[]>("examination/group"),
    queryKey: ["examinationGroups"],
  });

  if (isExaminationLoading || !examinations || isGroupsLoading || !groups) {
    return <Loader />;
  }

  return (
    <div className="bg-background">
      <PageTitle text="examinations" />

      <div className="m-auto mb-4 w-[98%] max-w-[1200px] rounded-lg border-2 border-solid border-primary bg-white p-2">
        <ExaminationDataTable
          examinations={examinations}
          groups={groups}
          getClickedRowId={(id) => setClickedRowId(id)}
          rowClickRedirectURL={"/examination/" + clickedRowId}
          columnVisibility={{ id: true, groups: false }}
          filterVisibility={{ id: true }}
        />
      </div>
    </div>
  );
};

export default ExaminationListPage;
