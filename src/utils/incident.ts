import { INCIDENT_STATUS, ESCALATION_LEVEL } from "@/constants/enums";

export const getTagSeverity = (status: string): string => {
  switch (status) {
    case INCIDENT_STATUS.REPORTED:
    case INCIDENT_STATUS.UNDER_REVIEW:
    case INCIDENT_STATUS.MITIGATION_IN_PROGRESS:
      return "warn";
    case INCIDENT_STATUS.FALSE_ALARM:
      return "info";
    case INCIDENT_STATUS.CONTAINED:
    case INCIDENT_STATUS.RESOLVED:
      return "success";
    default:
      return "info";
  }
};

export const getEscalationSeverity = (level: string): string => {
  switch (level) {
    case ESCALATION_LEVEL.NONE:
      return "secondary";
    case ESCALATION_LEVEL.MONITORING:
      return "info";
    case ESCALATION_LEVEL.ESCALATED:
      return "warn";
    case ESCALATION_LEVEL.EMERGENCY_STATE_DECLARED:
      return "danger";
    default:
      return "info";
  }
};

const severityClasses: Record<number, string> = {
  1: "bg-emerald-700 text-white",
  2: "bg-lime-600 text-white",
  3: "bg-yellow-300 text-black",
  4: "bg-amber-400 text-black",
  5: "bg-orange-500 text-white",
  6: "bg-red-600 text-white",
  7: "bg-fuchsia-600 text-white",
};

export const getSeverityClass = (severity: number): string => {
  return severityClasses[severity] ?? "bg-gray-500 text-white";
};
