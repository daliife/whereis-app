"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "@/components/QRCode";

interface Props {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  includeMargin?: boolean;
  className?: string;
  placeholderClassName?: string;
}

export default function LazyQRCode({
  placeholderClassName = "h-full w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800",
  ...props
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "160px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={props.className ?? "h-[100px] w-[100px]"}>
      {visible ? (
        <QRCode {...props} />
      ) : (
        <div className={placeholderClassName} aria-hidden="true" />
      )}
    </div>
  );
}
