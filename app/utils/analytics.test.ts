import { describe, test, expect, vi, beforeEach } from "vitest";
import { trackEvent } from "./analytics";

describe("trackEvent", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Reset window.umami
    delete window.umami;
  });

  test("should log to console in development environment", () => {
    // Mock console.log
    const consoleSpy = vi.spyOn(console, "log");

    // Mock process.env.NODE_ENV
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const eventName = "test_event";
    const eventData = { type: "click", value: "button" };

    trackEvent(eventName, eventData);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Track event (dev):",
      eventName,
      eventData
    );

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });

  test("should track event via umami in production when umami exists", () => {
    // Mock process.env.NODE_ENV
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    // Mock window.umami
    const trackMock = vi.fn();
    window.umami = {
      track: trackMock,
    };

    const eventName = "test_event";
    const eventData = { type: "click", value: "button" };

    trackEvent(eventName, eventData);

    expect(trackMock).toHaveBeenCalledWith(eventName, eventData);

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });

  test("should not track event in production when umami does not exist", () => {
    // Mock process.env.NODE_ENV
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const eventName = "test_event";
    const eventData = { type: "click", value: "button" };

    // Should not throw error when umami is undefined
    expect(() => trackEvent(eventName, eventData)).not.toThrow();

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });
});
