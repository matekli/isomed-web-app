/*
 * Název souboru:    CustonXAxis.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Vykreslení osy X v grafu
 */

import { XAxis } from "recharts";
import {
  BoundsByExamination,
  IndexedExamination,
  ReportColor,
  TestType,
} from "features/comparison/types/types";
import { useRef } from "react";
import {
  findIdByValueFromBounds,
  isTickOverlapping,
} from "features/comparison/utils/isokineticChart";

const CustomXAxis = (
  bounds: BoundsByExamination[],
  colors: ReportColor[],
  examinations: IndexedExamination[],
  examType: TestType,
) => {
  const lastXCoordinate = useRef<number>(0);
  const ticks = Array.from(new Set(bounds.map((b) => b.bounds).flat())).sort(
    (a, b) => a - b,
  );

  return bounds.length !== 0 ? (
    <XAxis
      dataKey="relative_position"
      interval={0}
      ticks={ticks}
      padding={{ left: 20, right: 20 }}
      tick={(props) => {
        const { x, y, payload } = props;

        // Funkce najde všechny ID vyšetření, kde hodnota (payload.value) je stejná.
        // Výsledkem bude pole 'examinationIds', které může obsahovat jedno nebo více ID,
        // v závislosti na tom, zda byla hodnota nalezena v jednom nebo více vyšetřeních.
        const foundBounds = findIdByValueFromBounds(bounds, payload.value);
        const col = foundBounds.map((bound) => {
          const examination = examinations.find(
            (e) => e.data.id === bound.id && e.set === bound.set,
          );
          if (!examination) {
            return null;
          }
          return colors.find(
            (c) =>
              c.examination_id === examination.data.id &&
              c.set === examination.set,
          );
        });
        const isOverlapping = isTickOverlapping(lastXCoordinate.current, x);

        lastXCoordinate.current = x;

        return (
          <>
            {foundBounds.map((_, index) => {
              return (
                <text
                  key={`${payload.value}-${index}`}
                  x={x}
                  y={y + 15 + (isOverlapping ? 15 : 0)}
                  fill={col[index]?.color}
                  textAnchor="middle"
                  fontSize="1rem"
                >
                  {`${Math.round(payload.value / 10)} ${examType === "isokinetic" ? "°" : "cm"}`}
                </text>
              );
            })}
          </>
        );
      }}
      dx={-3}
      dy={5}
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
