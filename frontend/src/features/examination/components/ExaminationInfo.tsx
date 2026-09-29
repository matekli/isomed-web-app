/*
 * Název souboru:    ExaminationInfo.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení parametrů vyšetření
 */

import {
  convertJoint,
  convertPlane,
  convertSide,
  convertTestMode,
} from "utils/converting";
import { extractDate, formatValue } from "utils/formatting";
import { Link } from "react-router-dom";
import { ExaminationWithPatient, testModes } from "../types/types";
import { useSettingsContext } from "features/settings/contexts/SettingsContext";
import { anonymize } from "utils/anonymize";

type ExaminationInfoProps = {
  examination: ExaminationWithPatient;
};
const ExaminationInfo = ({ examination }: ExaminationInfoProps) => {
  const { settings } = useSettingsContext();
  const {
    patient,
    joint_side,
    joint,
    test_mode,
    plane,
    speed_1,
    speed_2,
    motion_start,
    motion_end,
    number_of_sets,
    hold_time,
    number_of_repetitions,
    break: break_in_seconds,
    weight,
  } = examination;

  return (
    <div className="grid h-full grid-cols-[1fr_2fr] gap-x-2 gap-y-1 bg-primary px-3 py-1 text-white">
      <div className="col-span-2 h-fit text-fluid-xl font-semibold">
        {convertTestMode(test_mode)}
      </div>
      <div className="grid grid-cols-2 gap-1 rounded-lg border border-background p-2">
        <div className="col-span-2">
          <Link to={"/patient/" + patient.id}>
            <div className="text-lg font-semibold hover:underline">
              {anonymize(
                patient.firstname + " " + patient?.lastname,
                settings?.safeMode,
              )}
            </div>
          </Link>
        </div>

        <div>
          <div className="text-sm">Weight</div>
          <div className="font-semibold">{`${formatValue(weight)} kg`}</div>
        </div>
        <div>
          <div className="text-sm">Height</div>
          <div className="font-semibold">{`${formatValue(patient.height)} cm`}</div>
        </div>
        <div>
          <div className="text-sm">Birthday</div>
          <div className="font-semibold">
            {anonymize(extractDate(patient.birthday), settings?.safeMode)}
          </div>
        </div>
        <div>
          <div className="text-sm">Sex</div>
          <div className="font-semibold">{patient.sex ?? "--"}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 rounded-lg border border-background p-2">
        <div>
          <div className="text-sm">Plane</div>
          <div className="font-semibold">{convertPlane(plane, test_mode)}</div>
        </div>
        <div>
          <div className="text-sm">Joint</div>
          <div className="font-semibold">{`${convertSide(joint_side)} ${convertJoint(joint)}`}</div>
        </div>

        {test_mode !== testModes.ISOMETRIC ? (
          <div>
            <div className="text-sm">Speed</div>
            <div className="font-semibold">{`${speed_1} / ${speed_2}`}</div>
          </div>
        ) : (
          <div>
            <div className="text-sm">Break</div>
            <div className="font-semibold">{`${break_in_seconds} s`}</div>
          </div>
        )}

        <div>
          <div className="text-sm">Range</div>
          <div className="flex gap-x-1">
            <div className="font-semibold">{`${motion_start}°`}</div>
            <div>-</div>
            <div className="font-semibold">{`${motion_end}°`}</div>
          </div>
        </div>
        <div>
          <div className="text-sm">Number of sets</div>
          <div className="font-semibold">{number_of_sets}</div>
        </div>
        {test_mode !== testModes.ISOMETRIC ? (
          <div>
            <div className="text-sm">Number of rep.</div>
            <div className="font-semibold">{number_of_repetitions}</div>
          </div>
        ) : (
          <div>
            <div className="text-sm">Hold time</div>
            <div className="font-semibold">{`${hold_time} s`}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExaminationInfo;
