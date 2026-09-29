/*
 * Název souboru:    GroupManagementPage.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Stránka pro zobrazení skupin pacientů a skupin vyšetření
 */

import GroupManagementDataTable from "features/group/components/GroupManagementDataTable";
import PageTitle from "components/PageTitle";
import { fetchData } from "utils/api/fetchData";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "components/ui/loader";
import { useState } from "react";
import { Group, GroupMembership } from "../types/types";

const GroupManagementPage = () => {
  const [clickedRowId, setClickedRowId] = useState<string>("");

  const { data: examination_groups, isLoading: examinationGroupsIsLoading } =
    useQuery({
      queryFn: () => fetchData<Group[]>("/examination/group"),
      queryKey: ["examinationGroups"],
    });
  const {
    data: examination_group_memberships,
    isLoading: examinationGroupMembershipsIsLoading,
  } = useQuery({
    queryFn: () =>
      fetchData<GroupMembership[]>("/examination/group/membership"),
    queryKey: ["examination_group_memberships"],
  });

  const { data: patient_groups, isLoading: patientGroupsIsLoading } = useQuery({
    queryFn: () => fetchData<Group[]>("/patient/group"),
    queryKey: ["patientGroups"],
  });

  const {
    data: patient_group_memberships,
    isLoading: patientGroupMembershipsIsLoading,
  } = useQuery({
    queryFn: () => fetchData<GroupMembership[]>("/patient/group/membership"),
    queryKey: ["patient_group_memberships"],
  });

  return (
    <div>
      <PageTitle text="groups" />
      <div className="m-auto mb-4 block w-5/6 gap-4 rounded-lg border-2 border-primary bg-white p-4 lg:flex">
        <div className="w-full">
          <PageTitle text="examinations" />
          {!examinationGroupsIsLoading &&
          !examinationGroupMembershipsIsLoading &&
          examination_groups &&
          examination_group_memberships ? (
            <GroupManagementDataTable
              key={JSON.stringify(examination_groups)}
              groups={examination_groups}
              memberships={examination_group_memberships}
              getClickedRowId={(id) => setClickedRowId(id)}
              rowClickRedirectURL={"/examination"}
              rowClickRedirectData={{
                id: clickedRowId,
              }}
              columnVisibility={{ id: false }}
              type="examination"
            />
          ) : (
            <Loader />
          )}
        </div>
        {
          <div className="w-full">
            <PageTitle text="patients" />

            {!patientGroupsIsLoading &&
            patient_groups &&
            !patientGroupMembershipsIsLoading &&
            patient_group_memberships ? (
              <>
                <GroupManagementDataTable
                  key={JSON.stringify(patient_groups)}
                  groups={patient_groups}
                  memberships={patient_group_memberships}
                  getClickedRowId={(id) => setClickedRowId(id)}
                  rowClickRedirectURL={"/patient"}
                  rowClickRedirectData={{
                    id: clickedRowId,
                  }}
                  columnVisibility={{ id: false }}
                  type="patient"
                />
              </>
            ) : (
              <Loader />
            )}
          </div>
        }
      </div>
    </div>
  );
};

export default GroupManagementPage;
