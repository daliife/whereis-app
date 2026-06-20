import type { SpaceType } from "@/lib/inventory";

export const TYPE_COLOR: Record<SpaceType, string> = {
  cabinet:
    "bg-amber-50 text-amber-800 ring-1 ring-amber-200/60 dark:bg-amber-950/45 dark:text-amber-400 dark:ring-amber-800/40",
  drawers:
    "bg-stone-100 text-stone-700 ring-1 ring-stone-200/80 dark:bg-stone-900/55 dark:text-stone-300 dark:ring-stone-700/50",
  shelf:
    "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200/80 dark:bg-zinc-800/90 dark:text-zinc-400 dark:ring-zinc-700/60",
};

interface Props {
  type: SpaceType;
  className?: string;
}

const svgProps = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export default function SpaceIcon({ type, className = "h-6 w-6" }: Props) {
  if (type === "drawers") {
    return (
      <svg className={className} viewBox="0 0 24 24" {...svgProps}>
        <path d="M4.5 2.5h15A1.5 1.5 0 0121 4v16a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 20V4a1.5 1.5 0 011.5-1.5z" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="8.5" y1="5.75" x2="15.5" y2="5.75" strokeWidth={2.25} />
        <line x1="8.5" y1="11.75" x2="15.5" y2="11.75" strokeWidth={2.25} />
        <line x1="8.5" y1="17.75" x2="15.5" y2="17.75" strokeWidth={2.25} />
      </svg>
    );
  }

  if (type === "shelf") {
    return (
      <svg className={className} viewBox="0 0 24 24" {...svgProps}>
        <line x1="4" y1="3" x2="4" y2="21" />
        <line x1="20" y1="3" x2="20" y2="21" />
        <line x1="3" y1="8" x2="21" y2="8" />
        <line x1="3" y1="14" x2="21" y2="14" />
        <line x1="3" y1="20" x2="21" y2="20" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" {...svgProps}>
      <path d="M4.5 2h15A1.5 1.5 0 0121 3.5v16H3V3.5A1.5 1.5 0 014.5 2z" />
      <line x1="12" y1="2" x2="12" y2="19.5" />
      <line x1="3" y1="19.5" x2="21" y2="19.5" />
      <line x1="7" y1="10.5" x2="10" y2="10.5" strokeWidth={2.25} />
      <line x1="14" y1="10.5" x2="17" y2="10.5" strokeWidth={2.25} />
      <line x1="5" y1="21.5" x2="19" y2="21.5" strokeWidth={2} />
    </svg>
  );
}
