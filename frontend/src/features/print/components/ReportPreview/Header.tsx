/*
 * Název souboru:    Header.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta zobrazující hlavičku exportované zprávy
 */

import { IndexedExamination } from "features/comparison/types/types";
import { ReportData } from "../../types/types";
import {
  convertJoint,
  convertPlaneShort,
  convertSide,
  convertTestModeShort,
} from "utils/converting";
import { extractDate, extractTime, formatValue } from "utils/formatting";
import { useSettingsContext } from "features/settings/contexts/SettingsContext";
import { anonymize } from "utils/anonymize";

type HeaderProps = {
  reportData: ReportData;
  examinations: IndexedExamination[];
};

const Header = ({ reportData, examinations }: HeaderProps) => {
  const { settings } = useSettingsContext();

  return (
    <div>
      <h1 className="mb-1 flex w-full justify-center overflow-hidden whitespace-nowrap font-semibold">
        {reportData.title}
      </h1>
      <div className="flex w-full justify-between border border-black text-sm">
        <div className="flex w-full text-xs">
          {examinations.map((examination) => (
            <div
              className="w-1/2 border-x border-black px-1"
              key={examination.index}
            >
              <div>{`Test ${examination.index + 1}`}</div>
              <div className="grid grid-cols-[auto_auto] gap-x-2 gap-y-1">
                <div className="flex gap-2">
                  <div>Patient:</div>
                  <div>
                    {anonymize(
                      `${examination.data.patient.firstname} ${examination.data.patient.lastname}`,
                      settings?.safeMode,
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div>Mode:</div>
                  <div>{convertTestModeShort(examination.data.test_mode)}</div>
                </div>

                <div className="flex gap-2">
                  <div>Birthday:</div>
                  <div>{`${extractDate(examination.data.patient.birthday)}`}</div>
                </div>
                <div className="flex gap-2">
                  <div>Plane:</div>
                  <div>
                    {convertPlaneShort(
                      examination.data.plane,
                      examination.data.test_mode,
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div>Weight:</div>
                  <div>{`${formatValue(examination.data.weight)} kg`}</div>
                </div>
                <div className="flex gap-2">
                  <div>Speed:</div>
                  <div>{`${examination.data.speed_1}/${examination.data.speed_2}`}</div>
                </div>
                <div className="flex gap-2">
                  <div>Date of test:</div>
                  <div>{`${extractDate(examination.data.datetime)}, ${extractTime(examination.data.datetime)}`}</div>
                </div>
                <div className="flex gap-2">
                  <div>Joint:</div>
                  <div>{`${convertSide(examination.data.joint_side)} ${convertJoint(examination.data.joint)}`}</div>
                </div>
                <div className="flex gap-2">
                  <div>Sex:</div>
                  <div>{`${examination.data.patient.sex ?? "--"}`}</div>
                </div>
                <div className="flex gap-2">
                  <div>Set:</div>
                  <div>{`${examination.set}`}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
