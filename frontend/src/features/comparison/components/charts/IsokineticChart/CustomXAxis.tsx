/*
 * Název souboru:    CustomXAxis.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro vykreslení osy X pro více vyšetření.
 */

import { XAxis } from "recharts";
import {
  BoundsByExamination,
  ComparisonColors,
} from "features/comparison/types/types";

import { useRef } from "react";
import { MeasurementPhase } from "types/types";
import { evaluatePlaneColor } from "utils/colors";
import {
  findIdByValueFromBounds,
  isTickOverlapping,
} from "features/comparison/utils/isokineticChart";
import { useCurrentComparisonStore } from "features/comparison/store/currentComparisonStore";

const CustomXAxis = (
  bounds: BoundsByExamination[],
  colors: ComparisonColors[],
  type: MeasurementPhase,
  isZoomed: boolean,
) => {
  const lastXCoordinate = useRef<number>(0);
  const { examinations, type: examType } = useCurrentComparisonStore();
  const ticks = Array.from(new Set(bounds.map((b) => b.bounds).flat())).sort(
    (a, b) => a - b,
  );

  const xLabel =
    examType === "athletic" ? "Position in centimeters" : "Position in degree";

  return bounds.length !== 0 ? (
    <XAxis
      dataKey="relative_position"
      interval={0}
      ticks={ticks}
      padding={!isZoomed ? { left: 20, right: 20 } : { left: 5, right: 5 }}
      tick={(props) => {
        const { x, y, payload } = props;

        // Funkce vyhledává všechna ID vyšetření, kde je hodnota (payload.value) stejná.
        // Výsledkem bude pole 'examinationIds', které může obsahovat buď jedno, nebo více ID,
        // v závislosti na tom, zda je hodnota nalezena v jednom nebo více různých vyšetřeních.
        const foundBounds = findIdByValueFromBounds(bounds, payload.value);
        const col = foundBounds.map((bound) => {
          const examination = examinations.find(
            (e) => e.data.id === bound.id && e.set === bound.set,
          );
          if (!examination) {
            return null;
          }
          return evaluatePlaneColor(
            colors,
            examination.data,
            type,
            examination.set,
          );
        });

        const isOverlapping = isTickOverlapping(lastXCoordinate.current, x);

        if (isOverlapping) {
          return <></>;
        }

        lastXCoordinate.current = x;
        return (
          <>
            {foundBounds.map((_, index) => (
              <text
                key={`${payload.value}-${index}`}
                x={x}
                y={y + 15}
                fill={col[0]?.planeColor}
                textAnchor="middle"
                fontSize="1rem"
              >
                {Math.round(payload.value / 10)}
              </text>
            ))}
          </>
        );
      }}
      dx={-3}
      dy={5}
      label={{
        value: xLabel,
        position: "bottom",
        fill: "#000000",
        offset: 0,
      }}
    />
  ) : (
    <XAxis
      ticks={[-100000000000, 1000000000000]}
      padding={{ left: 10, right: 10 }}
      dx={-3}
      dy={5}
      label={{
        value: "Position in degree",
        position: "bottom",
        fill: "#000000",
        offset: 0,
      }}
    />
  );
};

export default CustomXAxis;
