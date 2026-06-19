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
        "px-3.5 py-3 transition-all",
        highlighted ? "card-highlighted" : "card-interactive",
      ].join(" ")}
    >
      <p className="text-sm font-medium leading-snug text-zinc-900 dark:text-zinc-100">
        {itemName}
      </p>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {spaceName}
        <span className="mx-1 text-zinc-300 dark:text-zinc-600" aria-hidden="true">
          ›
        </span>
        {sectionName}
      </p>
    </div>
  );
}
