import Link from "next/link";

interface Props {
  title: string;
  backLabel: string;
  backHref?: string;
  trailing?: React.ReactNode;
}

export default function PageHeader({
  title,
  backLabel,
  backHref = "/",
  trailing,
}: Props) {
  return (
    <header className="page-header">
      <div className="flex items-center gap-2">
        <Link
          href={backHref}
          className="btn-toolbar-icon flex-shrink-0"
          aria-label={backLabel}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <h1 className="page-header-title min-w-0 flex-1 truncate">{title}</h1>
        {trailing}
      </div>
    </header>
  );
}
