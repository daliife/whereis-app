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
        "px-4 py-3.5 transition-all",
        highlighted ? "card-highlighted" : "card-interactive",
      ].join(" ")}
    >
      <p className="card-title">{itemName}</p>
      <p className="card-meta">
        {spaceName}
        <span className="mx-1 text-zinc-300 dark:text-zinc-600" aria-hidden="true">
          ›
        </span>
        {sectionName}
      </p>
    </div>
  );
}
