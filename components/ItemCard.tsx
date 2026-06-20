interface ItemCardProps {
  itemName: string;
  spaceName: string;
  sectionName: string;
  tags?: string[];
  highlighted?: boolean;
  /** Inside card-focus-wrap — no outer border */
  embedded?: boolean;
  /** Chevron + locate hint for tappable results */
  showAction?: boolean;
  locateLabel?: string;
}

function CardChevron() {
  return (
    <svg
      className="card-action-chevron"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

export default function ItemCard({
  itemName,
  spaceName,
  sectionName,
  tags = [],
  highlighted = false,
  embedded = false,
  showAction = false,
  locateLabel,
}: ItemCardProps) {
  const surfaceClass = embedded
    ? highlighted
      ? "card-inner card-inner--highlighted"
      : "card-inner"
    : highlighted
      ? "card-highlighted px-4 py-3.5"
      : "card-interactive px-4 py-3.5";

  return (
    <div
      className={[
        surfaceClass,
        showAction ? "flex items-center gap-3" : "",
        "transition-all",
      ].join(" ")}
    >
      <div className={showAction ? "min-w-0 flex-1" : undefined}>
        <p className="card-title">{itemName}</p>
        {tags.length > 0 && (
          <ul className="item-tags" aria-label="Tags">
            {tags.slice(0, 4).map((tag) => (
              <li key={tag} className="item-tag">
                {tag}
              </li>
            ))}
            {tags.length > 4 && (
              <li className="item-tag item-tag--more">+{tags.length - 4}</li>
            )}
          </ul>
        )}
        <p className="card-meta">
          {showAction && locateLabel ? (
            <>
              <span className="text-amber-800/90 dark:text-amber-400/90">
                {locateLabel}
              </span>
              <span className="mx-1.5 text-zinc-300 dark:text-zinc-600">·</span>
            </>
          ) : null}
          {spaceName}
          <span className="mx-1 text-zinc-300 dark:text-zinc-600" aria-hidden="true">
            ›
          </span>
          {sectionName}
        </p>
      </div>
      {showAction && <CardChevron />}
    </div>
  );
}
