/*
 * Název souboru:    PatientTableData.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Tabulka pro zobrazení seznamu pacientů
 */

import { FilterVisibility } from "types/types";
import { VisibilityState } from "@tanstack/react-table";
import { useTableFilters } from "hooks/useTableFilters";
import PageTitle from "components/PageTitle";
import DataTable from "components/ui/data-table";
import usePatientTableData from "features/patient/hooks/usePatientTableData";
import { useTableActions } from "hooks/useTableActions";
import { useExaminationTableInstance } from "hooks/useTableInstance";
import { Loader } from "components/ui/loader";
import { extractDate } from "utils/formatting";
import PatientFilters from "features/patient/components/PatientFilters";
import usePatientColumns from "features/patient/hooks/usePatientColumns";
import AddGroupMembershipDialog from "features/group/components/AddGroupMembershipDialog";
import { Group } from "features/group/types/types";
import { Patient } from "../types/types";
import { useSettingsContext } from "features/settings/contexts/SettingsContext";
import { anonymize } from "utils/anonymize";

export interface PatientDataTableProps {
  patients: Patient[];
  groups: Group[] | undefined;
  getClickedRowId?: (id: string) => void;
  rowClickRedirectURL?: string;
  columnVisibility?: VisibilityState;
  filterVisibility?: FilterVisibility;
}

const PatientDataTable = ({
  patients,
  groups,
  getClickedRowId,
  rowClickRedirectURL,
  columnVisibility,
  filterVisibility,
}: PatientDataTableProps) => {
  const { tableInstance, updateTableInstance } = useExaminationTableInstance();

  const { filters, setFilters } = useTableFilters();

  const data = usePatientTableData({ patients });
  const { settings } = useSettingsContext();

  const {
    handleDelete,
    handleMembershipAdd,
    handleMembershipRemove,
    isDeleting,
    dialogRef,
    isDialogOpened,
    itemsToAdd,
    toggleDialog,
  } = useTableActions({
    items: patients,
    tableInstance,
    filters,
    baseUrl: "/patient",
    queryKey: ["patient"],
  });

  const columns = usePatientColumns({
    onDelete: handleDelete,
    onMembershipAdd: handleMembershipAdd,
    onMembershipRemove: handleMembershipRemove,
  });

  return (
    <>
      <PatientFilters
        filters={filters}
        setFilters={setFilters}
        groups={groups}
        filterVisibility={filterVisibility}
      />
      {!isDeleting ? (
        <DataTable
          columns={columns}
          data={data}
          getClickedRowId={getClickedRowId}
          rowClickRedirectURL={rowClickRedirectURL}
          columnFilters={filters}
          columnVisibility={columnVisibility}
          onTableInstance={updateTableInstance}
        />
      ) : (
        <Loader />
      )}
      {groups && (
        <AddGroupMembershipDialog
          toggleDialog={toggleDialog}
          ref={dialogRef}
          items={itemsToAdd}
          isOpened={isDialogOpened}
          groups={groups}
          createMembershipQuery="patient/group/membership"
          createGroupQuery="patient/group"
          groupsQueryKey={["patientGroups"]}
          itemsQueryKey={["patient"]}
        >
          <>
            <PageTitle text="add patient to group" />
            <div className="scrollbar mb-4 h-1/2 overflow-auto rounded-lg border border-primary bg-white px-4">
              {itemsToAdd.map((patient, index) => {
                return (
                  <p key={index} className="py-1">
                    {`Patient: ${anonymize(
                      patient.firstname + " " + patient.lastname,
                      settings?.safeMode,
                    )} 
                      , Birthday: ${anonymize(extractDate(patient.birthday), settings?.safeMode)}
                    `}
                  </p>
                );
              })}
            </div>
          </>
        </AddGroupMembershipDialog>
      )}
    </>
  );
};

export default PatientDataTable;
