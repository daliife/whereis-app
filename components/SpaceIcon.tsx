export const TYPE_COLOR: Record<string, string> = {
  cabinet:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  drawers: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  shelf:
    "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
};

interface Props {
  type: string;
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
        <rect x="2" y="3.5" width="20" height="5" rx="1.5" />
        <rect x="2" y="10.5" width="20" height="5" rx="1.5" />
        <rect x="2" y="17.5" width="20" height="5" rx="1.5" />
        <line x1="10" y1="6" x2="14" y2="6" strokeWidth={2} />
        <line x1="10" y1="13" x2="14" y2="13" strokeWidth={2} />
        <line x1="10" y1="20" x2="14" y2="20" strokeWidth={2} />
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

  // cabinet (default)
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
      <rect x="3" y="2" width="18" height="20" rx="2" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="10" y1="7.5" x2="14" y2="7.5" strokeWidth={2} />
      <line x1="10" y1="16.5" x2="14" y2="16.5" strokeWidth={2} />
    </svg>
  );
}
