/*
 * Název souboru:    isokinetic.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Pomocné funkce pro isokinetická vyšetření
 */

import {
  Measurement,
  MeasurementPhase,
  Repetition,
  ChartData,
  AreaChartData,
} from "types/types";
import { isAthletic, isIsokinetic } from "utils/utils";
import { ExaminationWithPatient, IsokineticResultsData } from "../types/types";
import {
  computeAthleticResults,
  computeIsokineticResults,
} from "utils/calculations/isokineticCalculations";

const stickToZero = (
  measurement: Measurement,
  type: MeasurementPhase,
  hasDataForLeftAndRight: boolean,
) => {
  return {
    time: measurement.time,
    relative_position: measurement.relative_position,
    M1: type === "M1" ? 0 : null,
    M2: type === "M2" ? 0 : null,
    M1_left: type === "M1" && hasDataForLeftAndRight ? 0 : null,
    M2_left: type === "M2" && hasDataForLeftAndRight ? 0 : null,
    M1_right: type === "M1" && hasDataForLeftAndRight ? 0 : null,
    M2_right: type === "M2" && hasDataForLeftAndRight ? 0 : null,
    speed: measurement.speed,
    current_repetition: measurement.current_repetition,
    current_set: measurement.current_set,
  };
};

const hasDataForLeftAndRight = (measurements: Measurement[]) => {
  const hasDataForLeftAndRight = measurements.some(
    (m) => m.force_on_left_leg !== 0 || m.force_on_right_leg !== 0,
  );

  return hasDataForLeftAndRight;
};

export const getIsokineticChartData = (
  repetitions: Repetition[],
  examination: ExaminationWithPatient,
) => {
  let newMeasurements: ChartData[] = [];

  repetitions.forEach((rep) => {
    const measurements = rep.measurements;
    const type = rep.type;

    newMeasurements.push(
      stickToZero(measurements[0], type, hasDataForLeftAndRight(measurements)),
    );

    for (let index = 0; index < measurements.length; index++) {
      const rawTorque = measurements[index].torque;
      const rawLeftForce = measurements[index].force_on_left_leg;
      const rawRightForce = measurements[index].force_on_right_leg;

      const torque = isIsokinetic(examination) ? rawTorque / 10 : rawTorque;
      const leftForce =
        !isIsokinetic(examination) && hasDataForLeftAndRight(measurements)
          ? rawLeftForce
          : null;
      const rightForce =
        !isIsokinetic(examination) && hasDataForLeftAndRight(measurements)
          ? rawRightForce
          : null;

      // Vytvoření nového záznamu pro každý index
      newMeasurements.push({
        time: measurements[index].time,
        relative_position: measurements[index].relative_position,
        M1: type === "M1" ? torque : null,
        M2: type === "M2" ? torque : null,
        M1_left: type === "M1" ? leftForce : null,
        M1_right: type === "M1" ? rightForce : null,
        M2_left: type === "M2" ? leftForce : null,
        M2_right: type === "M2" ? rightForce : null,
        speed: measurements[index].speed,
        current_repetition: measurements[index].current_repetition,
        current_set: measurements[index].current_set,
      });
    }
  });

  return newMeasurements;
};

/*----------------------------------------------------------------------------------------------*/
const prepareDataForCalculations = (measurements: Measurement[]) => {
  const data = measurements.map((m) => {
    return {
      torque: m.torque,
      relative_position: m.relative_position,
      speed: m.speed,
      time: m.time,
    };
  });

  return data;
};

const processRepetition = (
  rep: Repetition,
  result: IsokineticResultsData,
  examination: ExaminationWithPatient,
  offset: number | null,
  onlyIsokinetic: boolean,
) => {
  const data = prepareDataForCalculations(rep.measurements);

  result.repetition =
    rep.type === "M1" ? Math.round(rep.repetition / 2) : rep.repetition / 2;

  isAthletic(examination)
    ? computeAthleticResults(
        data,
        result,
        examination,
        rep.type,
        offset,
        onlyIsokinetic,
      )
    : computeIsokineticResults(
        data,
        result,
        examination,
        rep.type,
        offset,
        onlyIsokinetic,
      );
};

//Vraci jednotlive vypocty pro vsechny opakovani daneho vysetreni
export const getIsokineticResults = (
  repetitions: Repetition[],
  examination: ExaminationWithPatient,
  offset: number | null,
  onlyIsokinetic: boolean,
) => {
  let results: IsokineticResultsData[] = [];

  // Funkce pro zpracování jednotlivé repetice

  for (let i = 0; i < repetitions.length; i += 2) {
    if (!repetitions[i] || !repetitions[i + 1]) {
      continue;
    }

    const result: IsokineticResultsData = {
      repetition: null,
      data: {
        speed: { M1: null, M2: null },
        maxTorque: { M1: null, M2: null },
        maxTorqueAt: { M1: null, M2: null },
        maxTorqueWeight: { M1: null, M2: null },
        torqueAtOff: { M1: null, M2: null },
        torqueOffWeight: { M1: null, M2: null },
        work: { M1: null, M2: null },
        workWeight: { M1: null, M2: null },
        power: { M1: null, M2: null },
        mSecMaxTorque: { M1: null, M2: null },
        rangeMotion: { M1: null, M2: null },
      },
    };

    // Zpracování dvou repeticí (flex a ext) a naplnění set objektu
    processRepetition(
      repetitions[i],
      result,
      examination,
      offset,
      onlyIsokinetic,
    );
    processRepetition(
      repetitions[i + 1],
      result,
      examination,
      offset,
      onlyIsokinetic,
    );

    // Vyplnění všech nezadaných hodnot nulami

    results.push(result);
  }
  //return Array(defaultData);
  return results;
};

/*--------------------------------------------------------------------------------------------------*/

export const getXTicks = (data: ChartData[]): number[] => {
  let ticks: number[] = [];

  if (data.length === 0) {
    return ticks;
  }

  ticks.push(data[0].time);

  for (let index = 0; index < data.length - 1; index++) {
    if (data[index].M1 === null) {
      if (data[index + 1].M2 == null) {
        ticks.push(data[index + 1].time);
      }
    } else if (data[index].M2 === null) {
      if (data[index + 1].M1 === null) {
        ticks.push(data[index + 1].time);
      }
    }
  }
  ticks.push(data[data.length - 1].time);
  return ticks;
};

export const getYTicks = (data: ChartData[]) => {
  let maxM1 = -Infinity;
  let maxM2 = -Infinity;

  // Iterativně projdeme data a najdeme maximální hodnoty pro flex a ext
  for (let i = 0; i < data.length; i++) {
    const M1 = data[i].M1 || 0;
    const M2 = data[i].M2 || 0;

    if (M1 > maxM1) maxM1 = M1;
    if (M2 > maxM2) maxM2 = M2;
  }

  // Získáme maximální hodnotu mezi flex a ext
  const maxValue = Math.ceil(Math.max(maxM1, maxM2) + 10) + 10;

  // Výpočet kroku pro osy
  const step = Math.round(maxValue / 8);

  // Generování hodnot pro ticky
  const ticks = [];
  for (let i = 0; i <= maxValue; i += step) {
    ticks.push(i);
  }

  return ticks;
};

// Pro vypočítání hranic area v isokinetických grafech
export const getBounds = (repetitions: Repetition[]) => {
  let M1Starts: number[] = [];
  let M1Ends: number[] = [];
  let M2Starts: number[] = [];
  let M2Ends: number[] = [];

  for (let index = 0; index < repetitions.length; index++) {
    const rep = repetitions[index];

    if (rep.type === "M1") {
      M1Starts.push(rep.measurements[0].time);
      M1Ends.push(rep.measurements[rep.measurements.length - 1].time);
    } else if (rep.type === "M2") {
      M2Starts.push(rep.measurements[0].time);
      M2Ends.push(rep.measurements[rep.measurements.length - 1].time);
    }
  }

  return { M1Starts, M1Ends, M2Starts, M2Ends };
};

export const getAreaData = (
  chartData: ChartData[],
  chartStart: number,
  chartEnd: number,
  bounds: AreaChartData,
  type: MeasurementPhase,
) => {
  if (!bounds) {
    return [];
  }
  if (type === "M1") {
    return chartData.slice(chartStart, chartEnd).map((measurement) => ({
      ...measurement,
      M1: bounds.M1Starts.some(
        (start, index) =>
          measurement.time >= start && measurement.time <= bounds.M1Ends[index],
      )
        ? measurement.M1
        : null,
    }));
  }
  return chartData.slice(chartStart, chartEnd).map((measurement) => ({
    ...measurement,
    M2: bounds.M2Starts.some(
      (start, index) =>
        measurement.time >= start && measurement.time <= bounds.M2Ends[index],
    )
      ? measurement.M2
      : null,
  }));
};
