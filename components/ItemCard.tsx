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
      className={`rounded-xl border px-4 py-3.5 transition-colors ${
        highlighted
          ? "border-amber-300 bg-amber-50 ring-1 ring-amber-300 dark:border-amber-700 dark:bg-amber-950/30 dark:ring-amber-800"
          : "border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      }`}
    >
      <p className="text-base font-medium text-slate-900 dark:text-slate-100">
        {itemName}
      </p>
      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
        {spaceName}
        <span className="mx-1.5 text-slate-300 dark:text-slate-600">›</span>
        {sectionName}
      </p>
    </div>
  );
}
