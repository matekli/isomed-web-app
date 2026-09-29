/*
 * Název souboru:    Results.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komopnenta zobrazující výsledky v exportované zprávě
 */

import {
  IndexedExamination,
  ReportColor,
} from "features/comparison/types/types";
import { formatPercentageOneDecimal, formatValue } from "utils/formatting";
import { ExtendedResults } from "../../types/types";
import { getPlaneLabels } from "utils/converting";
import { isAthletic } from "utils/utils";
import { MeasurementPhase } from "types/types";

type ResultsProps = {
  examinations: IndexedExamination[];
  results: ExtendedResults[];
  colors: ReportColor[];
};
const Results = ({ examinations, results, colors }: ResultsProps) => {
  const planes = getPlaneLabels(
    examinations[0].data.test_mode,
    examinations[0].data.plane,
  );

  const loadType = isAthletic(examinations[0].data) ? "force" : "torque";
  const loadUnit = isAthletic(examinations[0].data) ? "N" : "Nm";
  const positionType = isAthletic(examinations[0].data) ? "distance" : "angle";
  const positionUnit = isAthletic(examinations[0].data) ? "cm" : "°";

  const createLabel = (
    labelTemplate: { label: string; type: MeasurementPhase },
    planes: string[],
  ) => {
    const { label: rawLabel, type } = labelTemplate;
    let label = rawLabel;

    // Nahrazení všech variant
    label = label
      .replace(/\$plane1/g, planes[0])
      .replace(/\$plane2/g, planes[1])
      .replace(/\$plane/g, type === "M1" ? planes[0] : planes[1]);

    return <div>{label}</div>;
  };

  const groupSizes = [3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2];

  let index = 0;

  const labels: {
    label: string;
    type: MeasurementPhase;
    key: keyof ExtendedResults["results"];
  }[] = [
    { label: `Peak ${loadType} $plane (Rep):`, type: "M1", key: "peakTorque" },
    { label: `at ${positionType}:`, type: "M1", key: "atAngle" },
    { label: "Peak work $plane (Rep):", type: "M1", key: "peakWork" },
    { label: `Peak ${loadType} $plane (Rep):`, type: "M2", key: "peakTorque" },
    { label: `at ${positionType}:`, type: "M2", key: "atAngle" },
    { label: "Peak work $plane (Rep):", type: "M2", key: "peakWork" },
    {
      label: `Peak ${loadType} of the average curve $plane:`,
      type: "M1",
      key: "maxTorque",
    },
    {
      label: `Peak ${loadType} of the average curve $plane:`,
      type: "M2",
      key: "maxTorque",
    },
    {
      label: `Peak ${loadType} $plane1/$plane2 ( $plane2/$plane1 ):`,
      type: "M1",
      key: "peakTorqueM1ByM2",
    },
    {
      label: "Peak work $plane1/$plane2 ( $plane2/$plane1 ):",
      type: "M1",
      key: "peakWorkM1ByM2",
    },
    {
      label: `Peak ${loadType} $plane / weight:`,
      type: "M1",
      key: "peakTorqueWeight",
    },
    {
      label: `Peak ${loadType} $plane / weight:`,
      type: "M2",
      key: "peakTorqueWeight",
    },
    { label: "Peak work $plane / weight:", type: "M1", key: "peakWorkWeight" },
    { label: "Peak work $plane / weight:", type: "M2", key: "peakWorkWeight" },
    { label: "Average work $plane:", type: "M1", key: "averageWork" },
    { label: "Average work $plane:", type: "M2", key: "averageWork" },
    { label: "Total work $plane:", type: "M1", key: "totalWork" },
    { label: "Total work $plane:", type: "M2", key: "totalWork" },
    { label: "Peak power $plane (Rep):", type: "M1", key: "peakPower" },
    { label: "Peak power $plane (Rep):", type: "M2", key: "peakPower" },
    { label: "Average power $plane:", type: "M1", key: "averagePower" },
    { label: "Average power $plane:", type: "M2", key: "averagePower" },
    { label: "Range of motion $plane:", type: "M1", key: "rangeMotion" },
    { label: "Range of motion $plane:", type: "M2", key: "rangeMotion" },
  ];

  const units: {
    key: keyof ExtendedResults["results"];
    type: MeasurementPhase;
    element: JSX.Element;
  }[] = [
    {
      key: "peakTorque",
      type: "M1",
      element: <div>{`${loadUnit} ( $peakTorqueRepM1 )`}</div>,
    },
    {
      key: "atAngle",
      type: "M1",
      element: <div>{positionUnit}</div>,
    },
    {
      key: "peakWork",
      type: "M1",
      element: <div>{`J ( $peakWorkRepM1 )`}</div>,
    },
    {
      key: "peakTorque",
      type: "M2",
      element: <div>{`${loadUnit} ( $peakTorqueRepM2 )`}</div>,
    },
    {
      key: "atAngle",
      type: "M2",
      element: <div>{positionUnit}</div>,
    },
    {
      key: "peakWork",
      type: "M2",
      element: <div>{`J ( $peakWorkRepM2 )`}</div>,
    },
    {
      key: "maxTorque",
      type: "M1",
      element: <div>{loadUnit}</div>,
    },
    {
      key: "maxTorque",
      type: "M2",
      element: <div>{loadUnit}</div>,
    },
    {
      key: "peakTorqueM1ByM2",
      type: "M1",
      element: (
        <div className="flex w-1/2 text-black">{`($peakTorqueM2ByM1) %`}</div>
      ),
    },
    {
      key: "peakWorkM1ByM2",
      type: "M1",
      element: (
        <div className="flex w-1/2 text-black">{`($peakWorkM2ByM1) %`}</div>
      ),
    },
    {
      key: "peakTorqueWeight",
      type: "M1",
      element: <div>{`${loadUnit}/kg`}</div>,
    },
    {
      key: "peakTorqueWeight",
      type: "M2",
      element: <div>{`${loadUnit}/kg`}</div>,
    },
    {
      key: "peakWorkWeight",
      type: "M1",
      element: <div>{`J/kg`}</div>,
    },
    {
      key: "peakWorkWeight",
      type: "M2",
      element: <div>{`J/kg`}</div>,
    },
    {
      key: "averageWork",
      type: "M1",
      element: <div>{`J`}</div>,
    },
    {
      key: "averageWork",
      type: "M2",
      element: <div>{`J`}</div>,
    },
    {
      key: "totalWork",
      type: "M1",
      element: <div>{`J`}</div>,
    },
    {
      key: "totalWork",
      type: "M2",
      element: <div>{`J`}</div>,
    },
    {
      key: "peakPower",
      type: "M1",
      element: <div>{`W ( $peakPowerRepM1 )`}</div>,
    },
    {
      key: "peakPower",
      type: "M2",
      element: <div>{`W ( $peakPowerRepM2 )`}</div>,
    },
    {
      key: "averagePower",
      type: "M1",
      element: <div>{`W`}</div>,
    },
    {
      key: "averagePower",
      type: "M2",
      element: <div>{`W`}</div>,
    },
    {
      key: "rangeMotion",
      type: "M1",
      element: <div>{positionUnit}</div>,
    },
    {
      key: "rangeMotion",
      type: "M2",
      element: <div>{positionUnit}</div>,
    },
  ];

  const getUnit = (
    key: keyof ExtendedResults["results"],
    type: MeasurementPhase,
    params: Record<string, string | number | null>,
  ) => {
    // Najde správný objekt v `units`
    const unit = units.find((u) => u.key === key && u.type === type);

    if (!unit) return null;

    // Nahradíme všechna výskyt `$parametry` v elementu odpovídajícími hodnotami
    let element = unit.element;

    // Použijeme regulární výraz k nalezení všech $parametrů v elementu
    const matches = element.props.children.match(/\$(\w+)/g);

    if (matches) {
      matches.forEach((match: string) => {
        const param = match.slice(1); // Získáme název parametru (bez `$`)
        const value = params[param]; // Najdeme hodnotu z params podle názvu

        if (value != null) {
          // Nahradí `$param` ve stringu hodnotou
          element = (
            <div>{element.props.children.replace(match, String(value))}</div>
          );
        }
      });
    }

    return element;
  };
  return (
    <div>
      <div className="grid h-full grid-cols-[2fr_1fr_1fr_1fr] border-2 border-black text-sm">
        <div></div>
        <div className="flex items-center justify-center border-l border-black px-2">
          Test 1
        </div>
        <div className="flex items-center justify-center border-l border-black px-2">
          Test 2
        </div>
        <div className="border-l border-black px-2">
          <div>{`Test 1 / Test 2 %`}</div>
          <div>{`(Test 2 / Test 1 %) `}</div>
        </div>
      </div>
      <div className="flex flex-col border-b border-black">
        {groupSizes.map((size, blockIndex) => {
          const block = labels.slice(index, index + size);
          index += size;

          return (
            <div key={blockIndex} className="border-b border-black">
              {block.map((row, rowIndex) => {
                // Zde projdeme všechny výsledky
                return (
                  <div
                    key={rowIndex}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr]"
                  >
                    <div className="border-l-2 border-r border-black px-2">
                      {createLabel(row, planes)}
                    </div>

                    {results.map((testResults, testIndex) => {
                      // Params pro každý test
                      const params = {
                        peakTorqueRepM1: testResults.results.peakTorqueRep.M1,
                        peakWorkRepM1: testResults.results.peakWorkRep.M1,
                        peakTorqueRepM2: testResults.results.peakTorqueRep.M2,
                        peakWorkRepM2: testResults.results.peakWorkRep.M2,
                        peakTorqueM2ByM1:
                          testResults.results.peakTorqueM2ByM1.M1,
                        peakWorkM2ByM1: testResults.results.peakWorkM2ByM1.M1,
                        peakPowerRepM1: testResults.results.peakPowerRep.M1,
                        peakPowerRepM2: testResults.results.peakPowerRep.M2,
                      };

                      return (
                        <div
                          key={testIndex}
                          className="flex w-full gap-x-4 border-r border-black px-1"
                        >
                          <div
                            className="flex w-1/2 justify-end"
                            style={{ color: colors[testIndex].color }}
                          >
                            {formatValue(
                              testResults.results[row.key][row.type],
                            )}
                          </div>
                          <div className="flex w-1/2">
                            {getUnit(row.key, row.type, params)}
                          </div>
                        </div>
                      );
                    })}

                    {results.length < 2 && (
                      <div className="flex justify-center border-r border-black">
                        {" "}
                        --{" "}
                      </div>
                    )}

                    <div className="flex justify-between border-r-2 border-black px-2">
                      <div>{`${formatPercentageOneDecimal(
                        results[0].results[row.key][row.type],
                        results[1]?.results[row.key][row.type] ?? null,
                      )}`}</div>
                      <div>{`( ${formatPercentageOneDecimal(
                        results[1]?.results[row.key][row.type] ?? null,
                        results[0].results[row.key][row.type],
                      )} )`}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Results;
