/*
 * Název souboru:    ChartControls.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení ovládacích prvků pro graf,
 *                   zahrnující legendu.
 */

import { convertTestMode, convertPlane } from "utils/converting";
import ChartActionDropdown from "./ChartActionDropDown";
import { getDefaultColors } from "utils/colors";
import { evaluatePlane } from "features/comparison/utils/comparison";
import { useChartContext } from "contexts/ChartContext";
import { isIsometric } from "utils/utils";

type ChartControlsProps = {
  label?: string;
};
const ChartControls = ({ label }: ChartControlsProps) => {
  const { examination } = useChartContext();
  const { test_mode, plane } = examination;

  const labels = evaluatePlane(examination);

  const colors = getDefaultColors(examination);
  return (
    <div className="item-center flex justify-between border-b-2 border-primary px-2 py-1">
      {!label ? (
        <div className="flex items-center">
          <p className="border-r-2 border-gray-300 pr-3 font-semibold">
            {convertTestMode(test_mode)}
          </p>
          <p className="pl-3 font-semibold">{convertPlane(plane, test_mode)}</p>
        </div>
      ) : (
        <div className="font-semibold">{label}</div>
      )}
      <div className="flex items-center gap-x-4">
        <div className="flex items-center whitespace-nowrap">
          <hr
            style={{
              backgroundColor: colors.M1Color,
              height: "3px",
              width: "10px",
              marginRight: "3px",
            }}
          />
          <div style={{ color: colors.M1Color }} className="flex font-semibold">
            {labels.M1Label}
          </div>
        </div>
        {!isIsometric(examination) && (
          <>
            <div className="flex items-center whitespace-nowrap">
              <hr
                style={{
                  backgroundColor: colors.M2Color,
                  height: "3px",
                  width: "10px",
                  marginRight: "3px",
                }}
              />
              <div
                style={{ color: colors.M2Color }}
                className="flex font-semibold"
              >
                {labels.M2Label}
              </div>
            </div>

            <div></div>
          </>
        )}
      </div>
      <ChartActionDropdown />
    </div>
  );
};

export default ChartControls;
