/*
 * Název souboru:    types.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Typy používané napříč celou aplikací
 */

export type Measurement = {
  id: number;
  time: number;
  relative_position: number;
  torque: number;
  speed: number;
  torque_without_g_calibration: number;
  current_repetition: number;
  current_set: number;
  torque_on_dynamometer: number;
  force_on_right_leg: number;
  force_on_left_leg: number;
};

export type MeasurementPhase = "M1" | "M2";

export type Repetition = {
  type: MeasurementPhase;
  repetition: number;
  set: number;
  measurements: Measurement[];
};

export type IsometricSet = {
  set: number;
  angle: number;
  measurements: Measurement[];
};

export type ChartData = {
  time: number;
  relative_position: number;
  current_repetition: number;
  current_set: number;
  M1: number | null;
  M2: number | null;
  M1_left: number | null;
  M1_right: number | null;
  M2_left: number | null;
  M2_right: number | null;
  speed: number;
};

export type IsometricChartData = {
  time: number;
  angle: number;
  torque: number;
  relative_position: number;
  current_set: number;
};

// Slouzi pro zvyraznovani grafu bud v detailu nebo v dialogu pro vyber opakovani
export type AreaChartData = {
  M1Starts: number[];
  M1Ends: number[];
  M2Starts: number[];
  M2Ends: number[];
};

export type FilterVisibility = {
  [key: string]: boolean;
};

type Row = {
  M1: number | null;
  M2: number | null;
};

export type SummaryData = {
  totalWork: Row;
  averageWork: Row;
  maxTorque: {
    M1: { value: number | null; repetition: number | null };
    M2: { value: number | null; repetition: number | null };
  };
  maxWork: {
    M1: { value: number | null; repetition: number | null };
    M2: { value: number | null; repetition: number | null };
  };
};

export type DataForCalculations = {
  torque: number;
  relative_position: number;
  speed: number;
  time: number | null;
};
