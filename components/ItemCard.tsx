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
        "rounded-lg border px-3.5 py-3 transition-colors",
        highlighted
          ? "border-amber-400/60 border-l-[3px] border-l-amber-500 bg-amber-50/60 pl-[calc(0.875rem-2px)] dark:border-amber-600/50 dark:bg-amber-950/20"
          : "border-zinc-200/80 bg-white group-hover:border-zinc-300 group-hover:bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900 dark:group-hover:border-zinc-700 dark:group-hover:bg-zinc-800/40",
      ].join(" ")}
    >
      <p className="text-sm font-medium leading-snug text-zinc-900 dark:text-zinc-100">
        {itemName}
      </p>
      <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
        {spaceName}
        <span
          className="mx-1 text-zinc-400 dark:text-zinc-500"
          aria-hidden="true"
        >
          ›
        </span>
        {sectionName}
      </p>
    </div>
  );
}
