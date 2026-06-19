interface ItemCardProps {
  itemName: string;
  spaceName: string;
  sectionName: string;
  highlighted?: boolean;
}

export default function ItemCard({
  itemName,
  spaceName,
  sectionName,
  highlighted = false,
}: ItemCardProps) {
  return (
    <div
      className={[
        "rounded-lg border px-3.5 py-3 transition-all",
        highlighted
          ? "border-amber-400/70 border-l-[3px] border-l-amber-500 bg-amber-50/80 pl-[calc(0.875rem-2px)] shadow-sm shadow-amber-500/10 dark:border-amber-600/50 dark:bg-amber-950/25"
          : "card-interactive",
      ].join(" ")}
    >
      <p className="text-sm font-medium leading-snug text-zinc-900 dark:text-zinc-100">
        {itemName}
      </p>
      <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
        {spaceName}
        <span
          className="mx-1 text-amber-300/80 dark:text-amber-700/80"
          aria-hidden="true"
        >
          ›
        </span>
        <span className="font-medium text-amber-900/80 dark:text-amber-400/90">
          {sectionName}
        </span>
      </p>
    </div>
  );
}
