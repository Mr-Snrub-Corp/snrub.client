import type { IncidentStatus } from "./incidentReport";

// God-mode lever keys (mirror app/models/godmode.py GodModeLever)
export const GOD_MODE_LEVER = {
  COOLANT_FLOW: "coolant_flow",
  CONTROL_ROD: "control_rod",
  PRIMARY_COOLANT_LOSS: "primary_coolant_loss",
  STEAM_PRESSURE: "steam_pressure",
  XENON: "xenon",
} as const;

export type GodModeLever = (typeof GOD_MODE_LEVER)[keyof typeof GOD_MODE_LEVER];

export interface LeverState {
  lever: GodModeLever;
  incident_type_code: string;
  active: boolean;
  status: IncidentStatus | null;
  intensity: number;
  report_uid: string | null;
}

export interface LeverSetRequest {
  status: IncidentStatus;
  severity?: number;
}
