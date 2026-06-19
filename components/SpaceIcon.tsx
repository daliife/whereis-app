import type { SpaceType } from "@/lib/inventory";

export const TYPE_COLOR: Record<SpaceType, string> = {
  cabinet:
    "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200/80 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700/80",
  drawers:
    "bg-stone-100 text-stone-700 ring-1 ring-stone-200/80 dark:bg-stone-900/50 dark:text-stone-300 dark:ring-stone-700/50",
  shelf:
    "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200/80 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700/80",
};

interface Props {
  type: SpaceType;
  className?: string;
}

export default function SpaceIcon({ type, className = "h-5 w-5" }: Props) {
  if (type === "drawers") {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 3.5h14a2 2 0 012 2v14a1 1 0 01-1 1H4a1 1 0 01-1-1v-14a2 2 0 012-2z" />
        <line x1="3" y1="8.5" x2="21" y2="8.5" />
        <line x1="3" y1="14.5" x2="21" y2="14.5" />
        <line x1="9.5" y1="6" x2="14.5" y2="6" strokeWidth={2} />
        <line x1="9.5" y1="11.5" x2="14.5" y2="11.5" strokeWidth={2} />
        <line x1="9.5" y1="17.5" x2="14.5" y2="17.5" strokeWidth={2} />
        <line x1="6" y1="20.5" x2="6" y2="22" />
        <line x1="18" y1="20.5" x2="18" y2="22" />
      </svg>
    );
  }

  if (type === "shelf") {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="4" y1="3" x2="4" y2="21" />
        <line x1="20" y1="3" x2="20" y2="21" />
        <line x1="3" y1="8" x2="21" y2="8" />
        <line x1="3" y1="14" x2="21" y2="14" />
        <line x1="3" y1="20" x2="21" y2="20" />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2.5h12a2 2 0 012 2v17H4v-17a2 2 0 012-2z" />
      <line x1="12" y1="2.5" x2="12" y2="21.5" />
      <line x1="4" y1="19" x2="20" y2="19" />
      <circle cx="10" cy="11.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="14" cy="11.5" r="0.75" fill="currentColor" stroke="none" />
      <path d="M8 5.5h2.5" />
      <path d="M13.5 5.5H16" />
    </svg>
  );
}
