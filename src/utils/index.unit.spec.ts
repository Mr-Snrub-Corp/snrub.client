import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Router } from "vue-router";
import {
  formatLabel,
  capitalizeFirstLetter,
  timeAgo,
  enumToSelectOptions,
  navigateBack,
} from "./index";

describe("capitalizeFirstLetter", () => {
  it("capitalizes the first letter of a lowercase word", () => {
    expect(capitalizeFirstLetter("hello")).toBe("Hello");
  });

  it("capitalizes the first letter of an uppercase word", () => {
    expect(capitalizeFirstLetter("WORLD")).toBe("WORLD");
  });

  it("handles single character strings", () => {
    expect(capitalizeFirstLetter("a")).toBe("A");
  });

  it("returns empty string for empty input", () => {
    expect(capitalizeFirstLetter("")).toBe("");
  });

  it("handles strings with leading spaces", () => {
    expect(capitalizeFirstLetter(" hello")).toBe(" hello");
  });

  it("handles strings with numbers", () => {
    expect(capitalizeFirstLetter("123abc")).toBe("123abc");
  });
});

describe("formatLabel", () => {
  it("converts snake_case to sentence case", () => {
    expect(formatLabel("hello_world")).toBe("Hello world");
  });

  it("capitalizes only the first word", () => {
    expect(formatLabel("first_second_third")).toBe("First second third");
  });

  it("handles single word without underscores", () => {
    expect(formatLabel("hello")).toBe("Hello");
  });

  it("handles multiple consecutive underscores", () => {
    expect(formatLabel("hello__world")).toBe("Hello  world");
  });

  it("handles leading underscores", () => {
    expect(formatLabel("_hello_world")).toBe(" hello world");
  });

  it("handles trailing underscores", () => {
    expect(formatLabel("hello_world_")).toBe("Hello world ");
  });

  it("returns empty string for empty input", () => {
    expect(formatLabel("")).toBe("");
  });

  it("preserves original casing of non-first words", () => {
    expect(formatLabel("hello_WORLD")).toBe("Hello WORLD");
  });

  it("handles strings with no underscores and mixed case", () => {
    expect(formatLabel("HelloWorld")).toBe("HelloWorld");
  });
});

describe("enumToSelectOptions", () => {
  it("maps each enum value to a formatted label and raw value", () => {
    const options = enumToSelectOptions({ A: "first_one", B: "second" });
    expect(options).toEqual([
      { label: "First one", value: "first_one" },
      { label: "Second", value: "second" },
    ]);
  });

  it("returns an empty array for an empty enum object", () => {
    expect(enumToSelectOptions({})).toEqual([]);
  });
});

describe("navigateBack", () => {
  const router = { back: vi.fn(), push: vi.fn() } as unknown as Router;

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("calls router.back when a previous history entry exists", () => {
    vi.stubGlobal("history", { state: { back: "/dashboard/employees" } });
    navigateBack(router, { name: "employees" });
    expect(router.back).toHaveBeenCalled();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("pushes the fallback when there is no previous history entry", () => {
    vi.stubGlobal("history", { state: {} });
    navigateBack(router, { name: "employees" });
    expect(router.push).toHaveBeenCalledWith({ name: "employees" });
    expect(router.back).not.toHaveBeenCalled();
  });
});

describe("timeAgo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns hours ago for less than 24h", () => {
    expect(timeAgo("2025-01-15T06:00:00Z")).toBe("6h ago");
  });

  it("returns minimum 1h for very recent times", () => {
    expect(timeAgo("2025-01-15T11:55:00Z")).toBe("1h ago");
  });

  it("returns days ago for 24h or more", () => {
    expect(timeAgo("2025-01-12T12:00:00Z")).toBe("3d ago");
  });

  it("returns 1d ago at exactly 24h boundary", () => {
    expect(timeAgo("2025-01-14T12:00:00Z")).toBe("1d ago");
  });
});
