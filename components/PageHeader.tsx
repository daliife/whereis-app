import Link from "next/link";
import UiIcon from "@/components/icons/UiIcon";

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
          <UiIcon name="back" className="h-5 w-5" />
        </Link>
        <h1 className="page-header-title min-w-0 flex-1 truncate">{title}</h1>
        {trailing}
      </div>
    </header>
  );
}
