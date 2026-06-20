"use client";

import { useEffect, useState } from "react";
import { VIRTUALIZE_THRESHOLD } from "@/lib/list-threshold";

const ROW_HEIGHT = 88;
const OVERSCAN = 6;

/** Window slice for long page-scrolled grids (2-column layout estimate). */
export function useWindowedRange(itemCount: number) {
  const [range, setRange] = useState({ start: 0, end: itemCount });

  useEffect(() => {
    if (itemCount < VIRTUALIZE_THRESHOLD) {
      setRange({ start: 0, end: itemCount });
      return;
    }

    function update() {
      const rows = Math.ceil(itemCount / 2);
      const scrollRow = Math.floor(window.scrollY / ROW_HEIGHT);
      const visibleRows = Math.ceil(window.innerHeight / ROW_HEIGHT);
      const startRow = Math.max(0, scrollRow - OVERSCAN);
      const endRow = Math.min(rows, scrollRow + visibleRows + OVERSCAN);
      setRange({
        start: startRow * 2,
        end: Math.min(itemCount, endRow * 2),
      });
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [itemCount]);

  return {
    enabled: itemCount >= VIRTUALIZE_THRESHOLD,
    range,
    topSpacerHeight:
      itemCount >= VIRTUALIZE_THRESHOLD
        ? Math.floor(range.start / 2) * ROW_HEIGHT
        : 0,
    bottomSpacerHeight:
      itemCount >= VIRTUALIZE_THRESHOLD
        ? Math.max(0, Math.ceil((itemCount - range.end) / 2) * ROW_HEIGHT)
        : 0,
  };
}
