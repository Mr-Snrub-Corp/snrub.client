import {
  ALARM_LEVELS,
  ALARM_METRICS,
  type AlarmLevel,
  type AlarmMetric,
  type AlarmPayload,
} from "@/types/alarm";

export function isAlarmAckTopic(topic: string): boolean {
  return topic.endsWith("/ack");
}

function isAlarmMetric(value: unknown): value is AlarmMetric {
  return typeof value === "string" && (ALARM_METRICS as readonly string[]).includes(value);
}

function isAlarmLevel(value: unknown): value is AlarmLevel {
  return typeof value === "string" && (ALARM_LEVELS as readonly string[]).includes(value);
}

export function parseAlarmPayload(raw: unknown): AlarmPayload | null {
  if (typeof raw !== "object" || raw === null) return null;

  const record = raw as Record<string, unknown>;
  const { metric, level, value, ts } = record;

  if (!isAlarmMetric(metric)) return null;
  if (!isAlarmLevel(level)) return null;
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (typeof ts !== "string" || ts.length === 0) return null;

  return { metric, level, value, ts };
}
