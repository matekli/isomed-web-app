/*
 * Název souboru:    ComparisonExamCard.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení karty vyšetření v rámci
 *                   detailu porovnání, která umožňuje interakci,
 *                   jako je přidání do srovnání, resetování, mazání,
 *                   a změna opakování.
 */

import {
  convertJoint,
  convertPlane,
  convertSide,
  convertTestMode,
} from "utils/converting";
import { extractDate, extractTime } from "utils/formatting";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw, ScanSearch, X } from "lucide-react";
import { IndexedExamination } from "features/comparison/types/types";
import RepetitionsCard from "./RepetitionsCard";
import { isIsometric } from "utils/utils";
import { findColorsById } from "utils/colors";
import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";
import { anonymize } from "utils/anonymize";
import { useSettingsContext } from "features/settings/contexts/SettingsContext";

interface ComparisonExamCardProps {
  examination: IndexedExamination;
  onSelect: (id: string, set: number) => void;
  onReset: (id: string, set: number) => void;
  onDelete: (id: string, set: number) => void;
  onRepetitionChange: (id: string, set: number) => void;
}

const ComparisonExamCard = ({
  examination,
  onSelect,
  onReset,
  onDelete,
  onRepetitionChange,
}: ComparisonExamCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    colors,
    repetitions: repetitionsByExamination,
    compareIds,
  } = useCurrentComparisonStore();
  const { settings } = useSettingsContext();

  const {
    id,
    test_mode,
    joint_side,
    joint,
    plane,
    speed_1,
    speed_2,
    motion_start,
    motion_end,
    patient,
    datetime,
  } = examination.data;

  const colorSet = findColorsById(colors, examination.data.id, examination.set);

  const repetitions = repetitionsByExamination.find(
    (rep) =>
      rep.examination_id === examination.data.id && rep.set === examination.set,
  );

  if (!repetitions) {
    return null;
  }

  return (
    <>
      <div
        style={{ backgroundColor: colorSet.mainColor }}
        className="flex w-full min-w-[325px] justify-between rounded-lg px-2 py-2 xl:min-w-fit"
      >
        <div>
          <div className="grid auto-rows-auto grid-cols-2 flex-col gap-x-2 gap-y-1 rounded-t-lg">
            <div className="col-span-2 flex text-lg font-semibold">
              <div>{convertTestMode(test_mode)}</div>
            </div>
            {!isIsometric(examination.data) && (
              <div className="col-span-2 font-semibold">{`Set ${examination.set}`}</div>
            )}
            <div>
              <div className="text-sm">Joint</div>
              <div className="font-semibold">
                {`${convertSide(joint_side)} ${convertJoint(joint)}`}
              </div>
            </div>

            <div>
              <div className="text-sm">Plane</div>
              <div className="font-semibold">
                {convertPlane(plane, test_mode)}
              </div>
            </div>

            {!isIsometric(examination.data) ? (
              <div>
                <div className="text-sm">Speed</div>
                <div className="font-semibold">{`${speed_1} / ${speed_2}`}</div>
              </div>
            ) : (
              <div>
                <div className="text-sm">Hold time</div>
                <div className="font-semibold">
                  {`${examination.data.hold_time}s`}
                </div>
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

            <div className="mt-4">
              <div className="text-sm">Patient</div>
              <Link to={"/patient/" + patient.id} target="_blank">
                <div className="font-semibold hover:underline">
                  {anonymize(
                    ` ${patient.firstname} ${patient.lastname}`,
                    settings?.safeMode,
                  )}
                </div>
              </Link>
            </div>

            <div className="mt-4">
              <div className="text-sm">Date of test</div>
              <div className="font-semibold">
                {`${extractDate(datetime)},
                 ${extractTime(datetime)}`}
              </div>
            </div>
          </div>

          <div
            className={`mt-2 grid grid-cols-2 gap-y-1 overflow-hidden transition-all duration-500 ${isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <RepetitionsCard
              examination={examination.data}
              repetitions={repetitions}
              onRepetitionChange={() => onRepetitionChange(id, examination.set)}
            />
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-y-2">
            <div className="flex rounded-lg border-2 border-primary px-4 text-lg font-semibold">
              {`T${examination.index}`}
            </div>
            <div className="flex justify-end">
              <X
                className="h-6 w-6 text-red-600 duration-300 hover:scale-125"
                onClick={() => onDelete(id, examination.set)}
              />
            </div>
            <div className="flex justify-end">
              <Link to={"/examination/" + id} target="_blank">
                <ScanSearch className="duration-300 hover:scale-110" />
              </Link>
            </div>
            <div className="flex justify-end">
              <input
                type="checkbox"
                className="h-6 w-6"
                style={{ accentColor: colorSet.mainColor }}
                checked={compareIds.some(
                  (item) => item.id === id && item.set === examination.set,
                )}
                onChange={() => onSelect(id, examination.set)}
              />
            </div>
            {!isIsometric(examination.data) && (
              <div className="flex justify-end">
                <RotateCcw
                  onClick={() => onReset(id, examination.set)}
                  className="h-6 w-6 duration-300 hover:scale-110"
                />
              </div>
            )}
          </div>
          {!isIsometric(examination.data) && (
            <div className="flex w-full justify-end">
              {!isExpanded ? (
                <ChevronDown
                  className="duration-300 hover:scale-125"
                  onClick={() => setIsExpanded(true)}
                />
              ) : (
                <ChevronUp
                  className="duration-300 hover:scale-125"
                  onClick={() => setIsExpanded(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ComparisonExamCard;
