import { describe, expect, it } from "vitest";
import { VIRTUALIZE_THRESHOLD } from "./list-threshold";

describe("list-threshold", () => {
  it("virtualization activates above 100 items", () => {
    expect(VIRTUALIZE_THRESHOLD).toBe(100);
  });
});
