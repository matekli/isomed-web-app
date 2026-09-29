/*
 * Název souboru:    ExaminationDataTable.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Tabulka pro zobrazení všech vyšetření
 */

import { VisibilityState } from "@tanstack/react-table";
import { FilterVisibility } from "types/types";
import DataTable from "components/ui/data-table";
import { Loader } from "components/ui/loader";
import { useExaminationColumns } from "features/examination/hooks/useExaminationColumns";
import { useExaminationTableData } from "features/examination/hooks/useExaminationTableData";
import { useExaminationTableInstance } from "hooks/useTableInstance";
import { useTableFilters } from "hooks/useTableFilters";
import { useTableActions } from "hooks/useTableActions";
import { useParams } from "react-router-dom";
import AddMembershipDialog from "features/group/components/AddGroupMembershipDialog";
import PageTitle from "components/PageTitle";
import {
  convertJoint,
  convertPlane,
  convertSide,
  convertTestMode,
} from "utils/converting";
import { extractDate, extractTime } from "utils/formatting";
import { Group } from "features/group/types/types";
import { ExaminationWithPatient } from "features/examination/types/types";
import ExaminationFilters from "./ExaminationFilters";
import MobileExaminationList from "./MobileExaminationList";
import { useSettingsContext } from "features/settings/contexts/SettingsContext";
import { anonymize } from "utils/anonymize";

interface ExaminationDataTableProps {
  examinations: ExaminationWithPatient[];
  groups: Group[];
  getClickedRowId?: (id: string) => void;
  rowClickRedirectURL?: string;
  columnVisibility?: VisibilityState;
  filterVisibility?: FilterVisibility;
}

const ExaminationDataTable = ({
  examinations,
  groups,
  getClickedRowId,
  rowClickRedirectURL,
  columnVisibility,
  filterVisibility,
}: ExaminationDataTableProps) => {
  const { patient_id } = useParams();
  const { tableInstance, updateTableInstance } = useExaminationTableInstance();
  const { filters, setFilters } = useTableFilters();
  const data = useExaminationTableData({ examinations });
  const { settings } = useSettingsContext();

  const {
    handleDelete,
    handleMembershipRemove,
    handleMembershipAdd,
    handleComparison,
    isDeleting,
    dialogRef,
    isDialogOpened,
    itemsToAdd,
    toggleDialog,
  } = useTableActions({
    items: examinations,
    tableInstance,
    filters,
    baseUrl: "/examination",
    queryKey: !patient_id
      ? ["examination"]
      : ["patient", patient_id, "examination"],
  });

  const columns = useExaminationColumns({
    onMembershipAdd: handleMembershipAdd,
    onDelete: handleDelete,
    onMembershipRemove: handleMembershipRemove,
    onComparison: handleComparison,
  });

  return (
    <>
      <ExaminationFilters
        filters={filters}
        setFilters={setFilters}
        groups={groups}
        filterVisibility={filterVisibility}
        data={data}
      />

      {!isDeleting ? (
        <>
          <DataTable
            columns={columns}
            data={data}
            rowClickRedirectURL={rowClickRedirectURL}
            columnFilters={filters}
            columnVisibility={columnVisibility}
            onTableInstance={updateTableInstance}
            getClickedRowId={getClickedRowId}
            className="hidden w-full xl:table"
          />
          <MobileExaminationList
            tableInstance={tableInstance}
            filters={filters}
            data={data}
          />
        </>
      ) : (
        <Loader />
      )}
      {groups && (
        <AddMembershipDialog
          toggleDialog={toggleDialog}
          ref={dialogRef}
          items={itemsToAdd}
          isOpened={isDialogOpened}
          groups={groups}
          createMembershipQuery="examination/group/membership"
          createGroupQuery="examination/group"
          groupsQueryKey={["examinationGroups"]}
          itemsQueryKey={
            !patient_id
              ? ["examination"]
              : ["patient", patient_id, "examination"]
          }
        >
          <>
            <PageTitle text="add examination to group" />
            <div className="scrollbar mb-4 flex h-1/2 flex-col gap-y-2 overflow-auto rounded-lg border border-primary bg-white px-4 py-1">
              {itemsToAdd.map((examination, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-y-1 rounded-lg border border-gray-300 px-2 py-1"
                  >
                    <div>{`Test mode: ${convertTestMode(examination.test_mode)}`}</div>
                    <div>{`Plane: ${convertPlane(examination.plane, examination.test_mode)}`}</div>
                    <div>{`Speed: ${examination.speed_1}/${examination.speed_2}`}</div>
                    <div>{`Joint: ${convertSide(examination.joint_side)} ${convertJoint(examination.joint)}`}</div>
                    <div>{`Date of test: ${extractDate(examination.datetime)}, ${extractTime(examination.datetime)}`}</div>
                    <div>{`Patient: ${anonymize(`${examination.patient.firstname} ${examination.patient.lastname}`, settings?.safeMode)}`}</div>
                  </div>
                );
              })}
            </div>
          </>
        </AddMembershipDialog>
      )}
    </>
  );
};

export default ExaminationDataTable;
