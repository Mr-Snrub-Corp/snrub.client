import { describe, it, expect } from "vitest";
import { isAlarmAckTopic, parseAlarmPayload } from "./alarm";
import type { AlarmPayload } from "@/types/alarm";

const valid: AlarmPayload = {
  metric: "core_temperature",
  level: "danger",
  value: 1050,
  ts: "2026-09-07T03:32:09.976515+00:00",
};

describe("isAlarmAckTopic", () => {
  it("is true for inbound ack topics", () => {
    expect(isAlarmAckTopic("snrub/alarms/core_temperature/ack")).toBe(true);
    expect(isAlarmAckTopic("snrub/alarms/reactor_power/ack")).toBe(true);
  });

  it("is false for metric alarm topics", () => {
    expect(isAlarmAckTopic("snrub/alarms/core_temperature")).toBe(false);
    expect(isAlarmAckTopic("snrub/alarms/#")).toBe(false);
  });
});

describe("parseAlarmPayload", () => {
  it("returns the parsed payload for a valid message", () => {
    expect(parseAlarmPayload({ ...valid })).toEqual(valid);
  });

  it.each([null, undefined, 42, "alarm", true])("returns null for non-object input: %s", (raw) => {
    expect(parseAlarmPayload(raw)).toBeNull();
  });

  it("returns null for an empty object", () => {
    expect(parseAlarmPayload({})).toBeNull();
  });

  it("returns null for an unknown metric", () => {
    expect(parseAlarmPayload({ ...valid, metric: "steam_quality" })).toBeNull();
  });

  it("returns null for an invalid level", () => {
    expect(parseAlarmPayload({ ...valid, level: "critical" })).toBeNull();
  });

  it("returns null when value is not a finite number", () => {
    expect(parseAlarmPayload({ ...valid, value: "1050" })).toBeNull();
    expect(parseAlarmPayload({ ...valid, value: Number.NaN })).toBeNull();
  });

  it("returns null when ts is missing or not a string", () => {
    expect(parseAlarmPayload({ ...valid, ts: "" })).toBeNull();
    expect(parseAlarmPayload({ ...valid, ts: 123 })).toBeNull();
  });
});
