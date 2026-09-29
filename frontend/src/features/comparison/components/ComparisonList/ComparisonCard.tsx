/*
 * Název souboru:    ComparisonCard.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení detailů jednoho vyšetření v rámci porovnání,
 *                   včetně informací o pacientovi, testovacím režimu, opakováních společně
 *                   s ovládacími prvky.
 */

import {
  convertJoint,
  convertPlane,
  convertSide,
  convertTestMode,
} from "utils/converting";
import { Pencil, RotateCcw, ScanSearch, X } from "lucide-react";
import { ExaminationWithPatient } from "features/examination/types/types";
import {
  Comparison,
  RepetitionsByExamination,
} from "features/comparison/types/types";
import { Loader } from "components/ui/loader";
import { extractDate, extractTime } from "utils/formatting";
import { evaluatePlane } from "../../utils/comparison";
import { isIsometric } from "utils/utils";
import { Link } from "react-router-dom";
import { formatRepetitions } from "utils/repetitions";
import { useSettingsContext } from "features/settings/contexts/SettingsContext";
import { anonymize } from "utils/anonymize";

type ComparisonItemProps = {
  index: number;
  comparison: Comparison;
  examination: ExaminationWithPatient;
  repetitions: RepetitionsByExamination;
  onReset: (comparison: Comparison, index: number) => void;
  onDelete: (id: string, set: number, index: number) => void;
  onRepetitionsChange: (
    repetitions: RepetitionsByExamination,
    comparison: Comparison,
    examination: ExaminationWithPatient | undefined,
    index: number,
  ) => void;
};

const ComparisonCard = ({
  index,
  comparison,
  examination,
  repetitions,
  onReset,
  onDelete,
  onRepetitionsChange,
}: ComparisonItemProps) => {
  const { settings } = useSettingsContext();

  const {
    id,
    test_mode,
    plane,
    joint_side,
    joint,
    patient,
    datetime,
    speed_1,
    speed_2,
  } = examination;

  if (!examination) {
    return <Loader className="h-6 w-6" />;
  }
  const formattedRepetitions = formatRepetitions(repetitions);
  const labels = evaluatePlane(examination);

  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-lg border-2 border-primary p-2">
      <div className="col-span-2 flex justify-between gap-x-2">
        <div className="text-fluid-lg font-semibold">
          {convertTestMode(test_mode)}
        </div>
        <div className="flex items-center gap-x-2">
          <Link to={"/examination/" + id} target="_blank">
            <ScanSearch className="duration-300 hover:scale-110" />
          </Link>
          {!isIsometric(examination) && (
            <>
              <RotateCcw
                className="hover:scale-125"
                size={16}
                onClick={() => onReset(comparison, index)}
              />

              <Pencil
                className="hover:scale-125"
                onClick={() =>
                  onRepetitionsChange(
                    repetitions,
                    comparison,
                    examination,
                    index,
                  )
                }
                size={16}
              />
            </>
          )}
          <X
            className="text-red-400 hover:scale-125"
            size={24}
            onClick={() => onDelete(id, comparison.set, index)}
          />
        </div>
      </div>
      <div className="col-span-2">
        <div className="font-semibold">{`Set ${comparison.set}`}</div>
      </div>
      <div>
        <div className="text-sm">Joint</div>
        <div className="font-semibold">{`${convertSide(joint_side)} ${convertJoint(
          joint,
        )}`}</div>
      </div>
      <div>
        <div className="text-sm">Plane</div>
        <div className="font-semibold">{convertPlane(plane, test_mode)}</div>
      </div>
      <div className="">
        <div className="text-sm">Patient</div>
        <Link to={`/patient/${patient.id}`} target="_blank">
          <div className="font-semibold hover:underline">
            {anonymize(
              `${patient.firstname} ${patient.lastname}`,
              settings?.safeMode,
            )}
          </div>
        </Link>
      </div>
      <div>
        <div className="text-sm">Date of test</div>
        <div className="font-semibold">
          {`${extractDate(datetime)}, ${extractTime(datetime)}`}
        </div>
      </div>
      {!isIsometric(examination) ? (
        <>
          <div>
            <div className="text-sm">Selected reps</div>
            <div className="space-y-1 whitespace-nowrap">
              <div className="flex gap-x-1">
                <div>{`${labels.M1Label}:`}</div>
                <div className="font-semibold">{formattedRepetitions.M1}</div>
              </div>

              <div className="flex gap-x-1">
                <div>{`${labels.M2Label}:`}</div>
                <div className="font-semibold">{formattedRepetitions.M2}</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm">Speed</div>
            <div className="font-semibold">{`${speed_1}/ ${speed_2}`}</div>
          </div>
        </>
      ) : (
        <>
          <div>
            <div className="text-sm">Hold time</div>
            <div className="font-semibold">{`${examination.hold_time}s`}</div>
          </div>
          <div>
            <div className="text-sm">break</div>
            <div className="font-semibold">{`${examination.break}s`}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default ComparisonCard;
