import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useSearchShortcut } from "./useSearchShortcut";

describe("useSearchShortcut", () => {
  it("focuses the search input when / is pressed outside editable fields", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);

    const ref = { current: input };
    const focusSpy = vi.spyOn(input, "focus");
    const selectSpy = vi.spyOn(input, "select");

    renderHook(() => useSearchShortcut(ref));

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "/" }));

    expect(focusSpy).toHaveBeenCalledTimes(1);
    expect(selectSpy).toHaveBeenCalledTimes(1);

    input.remove();
  });

  it("does not intercept / while typing in another input", () => {
    const searchInput = document.createElement("input");
    const otherInput = document.createElement("input");
    document.body.append(searchInput, otherInput);

    const ref = { current: searchInput };
    const focusSpy = vi.spyOn(searchInput, "focus");

    renderHook(() => useSearchShortcut(ref));

    otherInput.focus();
    otherInput.dispatchEvent(
      new KeyboardEvent("keydown", { key: "/", bubbles: true }),
    );

    expect(focusSpy).not.toHaveBeenCalled();

    searchInput.remove();
    otherInput.remove();
  });
});
