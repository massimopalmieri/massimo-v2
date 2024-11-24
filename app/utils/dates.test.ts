import { describe, it, expect, afterEach, vi } from "vitest";
import { isChristmasSeason } from "./dates";

describe("isChristmasSeason", () => {
  // Store the actual Date implementation
  const originalDate = global.Date;

  // Cleanup after each test
  afterEach(() => {
    global.Date = originalDate;
  });

  it("returns true during December", () => {
    // Mock Date to return December
    const december = new Date(2023, 11, 25);
    global.Date = vi.fn(() => december) as unknown as DateConstructor;

    expect(isChristmasSeason()).toBe(true);
  });

  it("returns false during other months", () => {
    // Test a few different months
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    months.forEach((month) => {
      const date = new Date(2023, month, 15);
      global.Date = vi.fn(() => date) as unknown as DateConstructor;

      expect(isChristmasSeason()).toBe(false);
    });
  });
});
