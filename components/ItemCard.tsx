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
          ? "border-amber-200 bg-amber-50 ring-1 ring-amber-200 dark:border-amber-800 dark:bg-amber-900/20 dark:ring-amber-900"
          : "border-slate-100 bg-white dark:border-slate-700/60 dark:bg-slate-800/80"
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
