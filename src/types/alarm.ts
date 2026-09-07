import type { ReactorStatus } from "./reactorTelemetry";

export const ALARM_LEVELS = ["normal", "warning", "danger"] as const;
export type AlarmLevel = ReactorStatus;

export const ALARM_METRICS = [
  "reactor_power",
  "core_temperature",
  "reactivity",
  "coolant_flow_rate",
  "coolant_pressure",
  "radiation_level",
  "containment_integrity",
] as const;

export type AlarmMetric = (typeof ALARM_METRICS)[number];

export interface AlarmPayload {
  metric: AlarmMetric;
  level: AlarmLevel;
  value: number;
  ts: string;
}
