import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebouncedValue } from "./useDebouncedValue";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("hello", 200));
    expect(result.current).toBe("hello");
  });

  it("updates after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delayMs }) => useDebouncedValue(value, delayMs),
      { initialProps: { value: "a", delayMs: 200 } },
    );

    rerender({ value: "abc", delayMs: 200 });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("abc");
  });

  it("cancels pending updates when value changes quickly", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 200),
      { initialProps: { value: "first" } },
    );

    rerender({ value: "second" });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ value: "third" });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("third");
  });
});
