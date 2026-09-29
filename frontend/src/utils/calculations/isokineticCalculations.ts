/*
 * Název souboru:    isokineticCalculations.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Výpočty související s isokinetickými vyšetřeními
 */

import { Averages } from "features/comparison/types/types";
import {
  IsokineticResultsData,
  ExaminationWithPatient,
} from "features/examination/types/types";
import {
  DataForCalculations,
  Measurement,
  MeasurementPhase,
  SummaryData,
} from "types/types";
import { safeDivide, divideBy10AndRound, roundOnOneDecimal } from "utils/math";

export const hasIsokineticPhase = (
  measurements: Measurement[],
  examination: ExaminationWithPatient,
  type: MeasurementPhase,
) => {
  const speedThreshold =
    type === "M1" ? examination.speed_1 * 10 : examination.speed_2 * 10;
  return measurements.some(
    (m) => Math.abs(m.speed) > speedThreshold - speedThreshold / 10,
  );
};

// Kontroluje jestli je dosaženo zadané rychlosti s tolerancí 10% zadané rychlosti
export const filterIsokineticPhaseNew = (
  data: DataForCalculations[],
  examination: ExaminationWithPatient,
  type: MeasurementPhase,
) => {
  const speedThreshold =
    type === "M1" ? examination.speed_1 * 10 : examination.speed_2 * 10;

  const filteredData = data.filter(
    (d) => Math.abs(d.speed) >= speedThreshold - speedThreshold / 10,
  );

  return filteredData;
};

/*----------------------------------------------------------------------------------*/
/*------------------------------ Calculations --------------------------------------*/
/*----------------------------------------------------------------------------------*/
export const getMaxTorque = (
  data: DataForCalculations[],
  examination: ExaminationWithPatient | undefined,
) => {
  if (!data || !examination || data.length === 0)
    return { maxTorque: null, maxTorqueAt: null, mSecMaxTorque: null };

  if (!data || data.length === 0) {
    return { maxTorque: null, maxTorqueAt: null, mSecMaxTorque: null };
  }

  let maxTorque = -Infinity;

  for (let i = 0; i < data.length; i++) {
    const torque = Math.abs(data[i].torque); // Získáme absolutní hodnotu
    if (torque > maxTorque) {
      maxTorque = torque; // Aktualizujeme maxTorque, pokud je aktuální hodnoty větší
    }
  }

  const index = data.findIndex((item) => Math.abs(item.torque) === maxTorque);

  return {
    maxTorque: Math.abs(maxTorque),
    maxTorqueAt: Math.round(Math.abs(data[index].relative_position / 10)),
    mSecMaxTorque:
      data[0].time !== null && data[index].time !== null
        ? data[index].time - data[0].time
        : null,
  };
};

export const divideByWeight = (value?: number | null, weight?: number) => {
  if (!weight || !value) {
    return null;
  }
  return Math.round(value / weight);
};

// Veme torque v danem uhlu
export const getTorqueAtOff = (
  data: DataForCalculations[],
  off: number | null,
) => {
  const found = data.find((m) => Math.round(m.relative_position / 10) === off);
  return found ? Math.abs(found.torque) : null;
};

const trapz = (power: number[], xAxis: number[]) => {
  // Pokud je délka pole 'power' menší než 2, nelze počítat práci, vracíme 0.
  if (power.length < 2) {
    return 0;
  }

  // Výpočet numerického integrálu pomocí Trapezoidálního pravidla:
  // △x/2 * [f(x0) + 2*f(x1) + 2*f(x2) + ... + 2*f(xn-1) + f(xn)]

  let work = 0;

  for (let i = 0; i < power.length - 1; i++) {
    const dt = xAxis[i + 1] - xAxis[i];
    work += 0.5 * (power[i] + power[i + 1]) * dt;
  }

  return work;
};

export const getPowerAndWorkComp = (measurements: Averages[]) => {
  const power: number[] = [];

  for (let index = 0; index < measurements.length; index++) {
    const speed = Math.abs(measurements[index].speed / 10);
    const torque = Math.abs(measurements[index].torque / 10);

    const speedRad = (speed * Math.PI) / 180;

    power.push(torque * speedRad);
  }

  const time_axis: number[] = [0];

  for (let i = 1; i < measurements.length; i++) {
    const deltaAngleDeg =
      (measurements[i].relative_position -
        measurements[i - 1].relative_position) /
      10; // stupně
    const avgSpeedDegPerSec =
      (measurements[i].speed + measurements[i - 1].speed) / 2 / 10;
    const deltaTime = Math.abs(deltaAngleDeg / avgSpeedDegPerSec); // sekundy
    time_axis.push(time_axis[i - 1] + deltaTime);
  }
  const work = trapz(power, time_axis);
  const averagePower = Math.round(
    power.reduce((acc, curr) => acc + curr, 0) / measurements.length,
  );

  return {
    power: averagePower,
    work: Math.round(work),
  };
};

export const getPowerAndWork = (data: DataForCalculations[]) => {
  if (data.length === 0) {
    return {
      power: null,
      work: null,
    };
  }
  const power: number[] = [];

  for (let index = 0; index < data.length; index++) {
    const speed = Math.abs(data[index].speed / 10);
    const torque = Math.abs(data[index].torque / 10);

    const speedRad = (speed * Math.PI) / 180;

    power.push(torque * speedRad);
  }

  const time_axis = Array.from({ length: data.length }, (_, i) => i * 0.005);

  const work = trapz(power, time_axis);
  const averagePower = Math.round(
    power.reduce((acc, curr) => acc + curr, 0) / data.length,
  );
  return {
    power: averagePower,
    work: Math.round(work),
  };
};

export const getPowerAndWorkAthletic = (data: DataForCalculations[]) => {
  if (data.length === 0) {
    return {
      power: null,
      work: null,
    };
  }
  const power: number[] = [];

  for (let index = 0; index < data.length; index++) {
    const speed = Math.abs(data[index].speed / 10000); // from 1/10 millimeter/second to m/s
    const torque = Math.abs(data[index].torque);

    power.push(torque * speed);
  }

  const force = data.map((m) => Math.abs(m.torque));
  const position = data.map((m) => m.relative_position / 1000); // from mm to m

  const work = trapz(force, position);

  const averagePower = Math.round(
    power.reduce((acc, curr) => acc + curr, 0) / data.length,
  );
  return {
    power: averagePower,
    work: Math.abs(Math.round(work)),
  };
};

export const getRangeMotion = (data: DataForCalculations[]) => {
  if (!data || data.length === 0) return null;
  const length = data.length;
  const motionStart = Math.round(data[0].relative_position / 10);
  const motionEnd = Math.round(data[length - 1].relative_position / 10);
  return Math.abs(motionStart - motionEnd);
};

export const computeIsokineticResults = (
  data: DataForCalculations[],
  result: IsokineticResultsData,
  examination: ExaminationWithPatient,
  type: MeasurementPhase,
  offset: number | null,
  onlyIsokinetic: boolean,
) => {
  const filtered = onlyIsokinetic
    ? filterIsokineticPhaseNew(data, examination, type)
    : data;

  const { maxTorque, maxTorqueAt, mSecMaxTorque } = getMaxTorque(
    filtered,
    examination,
  );
  const maxTorqueWeight = safeDivide(
    divideBy10AndRound(maxTorque),
    examination.weight,
  );

  const torqueAtOf = getTorqueAtOff(filtered, offset);
  const torqueAtOfWeight = safeDivide(
    divideBy10AndRound(torqueAtOf),
    examination.weight,
  );
  const { power, work } = getPowerAndWork(filtered);

  const workWeight = safeDivide(work, examination.weight);
  const rangeMotion = getRangeMotion(data);

  result.data.speed[type] =
    type === "M1" ? examination.speed_1 : examination.speed_2;
  result.data.maxTorque[type] = divideBy10AndRound(maxTorque);
  result.data.maxTorqueAt[type] = maxTorqueAt;
  result.data.maxTorqueWeight[type] = roundOnOneDecimal(maxTorqueWeight);
  result.data.torqueAtOff[type] = divideBy10AndRound(torqueAtOf);
  result.data.torqueOffWeight[type] = roundOnOneDecimal(torqueAtOfWeight);
  result.data.work[type] = work;
  result.data.workWeight[type] = roundOnOneDecimal(workWeight);
  result.data.power[type] = power;
  result.data.mSecMaxTorque[type] = mSecMaxTorque;
  result.data.rangeMotion[type] = rangeMotion;
};

export const computeAthleticResults = (
  data: DataForCalculations[],
  result: IsokineticResultsData,
  examination: ExaminationWithPatient,
  type: MeasurementPhase,
  offset: number | null,
  onlyIsokinetic: boolean,
) => {
  const filtered = onlyIsokinetic
    ? filterIsokineticPhaseNew(data, examination, type)
    : data;

  const { maxTorque, maxTorqueAt, mSecMaxTorque } = getMaxTorque(
    filtered,
    examination,
  );
  const maxTorqueWeight = safeDivide(maxTorque, examination.weight);
  const torqueAtOf = getTorqueAtOff(filtered, offset);
  const torqueAtOfWeight = safeDivide(torqueAtOf, examination.weight);
  const { power, work } = getPowerAndWorkAthletic(filtered);
  const workWeight = safeDivide(work, examination.weight);
  const rangeMotion = getRangeMotion(data);

  result.data.speed[type] =
    type === "M1"
      ? divideBy10AndRound(examination.speed_1)
      : divideBy10AndRound(examination.speed_2);
  result.data.maxTorque[type] = maxTorque;
  result.data.maxTorqueAt[type] = maxTorqueAt;
  result.data.maxTorqueWeight[type] = roundOnOneDecimal(maxTorqueWeight);
  result.data.torqueAtOff[type] = torqueAtOf;
  result.data.torqueOffWeight[type] = roundOnOneDecimal(torqueAtOfWeight);
  result.data.work[type] = work;
  result.data.workWeight[type] = roundOnOneDecimal(workWeight);
  result.data.power[type] = power;
  result.data.mSecMaxTorque[type] = mSecMaxTorque;
  result.data.rangeMotion[type] = rangeMotion;
};

/*----------------------------------------------------------------------------------*/
/*----------------------- Summary calculations -------------------------------------*/
/*----------------------------------------------------------------------------------*/
export const getTotalWork = (data: IsokineticResultsData[]) => {
  let totalWorkM1: number | null = null;
  let totalWorkM2: number | null = null;

  for (const item of data) {
    const workM1 = item.data.work.M1;
    const workM2 = item.data.work.M2;

    if (workM1) {
      totalWorkM1 = totalWorkM1 === null ? workM1 : totalWorkM1 + workM1;
    }

    if (workM2) {
      totalWorkM2 = totalWorkM2 === null ? workM2 : totalWorkM2 + workM2;
    }
  }

  return {
    M1: totalWorkM1,
    M2: totalWorkM2,
  };
};

export const getAverageWork = (data: IsokineticResultsData[]) => {
  let tempM1 = 0;
  let tempM2 = 0;
  let countM1 = 0;
  let countM2 = 0;

  for (const item of data) {
    const m1 = item.data.work.M1;
    if (m1) {
      tempM1 += m1;
      countM1++;
    }

    const m2 = item.data.work.M2;
    if (m2) {
      tempM2 += m2;
      countM2++;
    }
  }

  return {
    M1: countM1 > 0 ? Math.round(tempM1 / countM1) : null,
    M2: countM2 > 0 ? Math.round(tempM2 / countM2) : null,
  };
};

export const getAveragePower = (data: IsokineticResultsData[]) => {
  let tempM1 = 0;
  let tempM2 = 0;
  let countM1 = 0;
  let countM2 = 0;

  for (const item of data) {
    const m1 = item.data.power.M1;
    if (m1) {
      tempM1 += m1;
      countM1++;
    }

    const m2 = item.data.power.M2;
    if (m2) {
      tempM2 += m2;
      countM2++;
    }
  }

  return {
    M1: countM1 > 0 ? Math.round(tempM1 / countM1) : null,
    M2: countM2 > 0 ? Math.round(tempM2 / countM2) : null,
  };
};

export const getMaxValueAcrossReps = (
  data: IsokineticResultsData[],
  type: "maxTorque" | "work" | "power",
) => {
  let maxM1: number | null = null;
  let repetitionM1: number | null = null;

  let maxM2: number | null = null;
  let repetitionM2: number | null = null;

  for (const item of data) {
    const valueM1 = item.data[type].M1;
    const valueM2 = item.data[type].M2;

    // Pro M1 hledáme první maximum
    if (valueM1 !== null && (maxM1 === null || valueM1 > maxM1)) {
      maxM1 = valueM1;
      repetitionM1 = item.repetition;
    }

    // Pro M2 hledáme první maximum
    if (valueM2 !== null && (maxM2 === null || valueM2 > maxM2)) {
      maxM2 = valueM2;
      repetitionM2 = item.repetition;
    }
  }

  return {
    M1: { value: maxM1, repetition: repetitionM1 },
    M2: { value: maxM2, repetition: repetitionM2 },
  };
};

export const getSummary = (data: IsokineticResultsData[]): SummaryData => {
  return {
    totalWork: getTotalWork(data),
    averageWork: getAverageWork(data),
    maxTorque: getMaxValueAcrossReps(data, "maxTorque"),
    maxWork: getMaxValueAcrossReps(data, "work"),
  };
};
