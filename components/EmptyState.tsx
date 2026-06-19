import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  hint?: ReactNode;
  icon?: "search";
}

function SearchIcon() {
  return (
    <svg
      className="h-5 w-5 text-zinc-500 dark:text-zinc-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
      />
    </svg>
  );
}

export default function EmptyState({
  title,
  hint,
  icon = "search",
}: EmptyStateProps) {
  return (
    <div className="py-8 text-center sm:py-10">
      <div className="empty-state-icon">
        {icon === "search" && <SearchIcon />}
      </div>
      <p className="mt-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 sm:text-base">
        {title}
      </p>
      {hint && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
          {hint}
        </p>
      )}
    </div>
  );
}
