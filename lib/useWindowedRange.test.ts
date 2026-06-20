import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VIRTUALIZE_THRESHOLD } from "./list-threshold";
import { useWindowedRange } from "./useWindowedRange";

describe("useWindowedRange", () => {
  it("returns the full range below the virtualization threshold", () => {
    const itemCount = VIRTUALIZE_THRESHOLD - 1;
    const { result } = renderHook(() => useWindowedRange(itemCount));

    expect(result.current.enabled).toBe(false);
    expect(result.current.range).toEqual({ start: 0, end: itemCount });
    expect(result.current.topSpacerHeight).toBe(0);
    expect(result.current.bottomSpacerHeight).toBe(0);
  });

  it("enables windowing at the threshold", () => {
    const { result } = renderHook(() => useWindowedRange(VIRTUALIZE_THRESHOLD));

    expect(result.current.enabled).toBe(true);
    expect(result.current.range.end).toBeLessThanOrEqual(VIRTUALIZE_THRESHOLD);
  });
});
