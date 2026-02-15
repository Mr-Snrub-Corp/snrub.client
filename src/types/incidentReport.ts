import { INCIDENT_STATUS, ESCALATION_LEVEL, SUBJECT_ROLE } from "@/constants/enums";
import type { IncidentType } from "./incidentType";

export type IncidentStatus = (typeof INCIDENT_STATUS)[keyof typeof INCIDENT_STATUS];

export type EscalationLevel = (typeof ESCALATION_LEVEL)[keyof typeof ESCALATION_LEVEL];

export type SubjectRole = (typeof SUBJECT_ROLE)[keyof typeof SUBJECT_ROLE];

export interface IncidentReportSubject {
  uid: string;
  user_id: string;
  role: SubjectRole;
}

export interface IncidentReport {
  uid: string;
  incident_type_id: string;
  description: string | null;
  severity: number;
  status: IncidentStatus;
  escalation_level: EscalationLevel;
  reported_by_user_id: string;
  occurred_at: string;
  subjects: IncidentReportSubject[];
  created: string;
  updated: string;
}

export interface IncidentReportSubjectCreate {
  user_id: string;
  role: SubjectRole;
}

export interface IncidentReportCreate {
  incident_type_id: string;
  description?: string | null;
  severity: number;
  occurred_at: string;
  subjects?: IncidentReportSubjectCreate[];
}

export interface EnrichedReport extends IncidentReport {
  incidentType: IncidentType;
}
