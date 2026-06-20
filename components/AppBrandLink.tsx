"use client";

import Link from "next/link";
import AppIcon from "@/components/AppIcon";
import { useI18n } from "@/lib/i18n";

interface Props {
  onNavigate?: () => void;
  iconSize?: number;
}

export default function AppBrandLink({ onNavigate, iconSize = 36 }: Props) {
  const { t } = useI18n();

  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="flex min-w-0 items-center gap-2 rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      aria-label={t.common.goHome}
    >
      <AppIcon size={iconSize} />
      <h1 className="truncate text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
        {t.home.appName}
      </h1>
    </Link>
  );
}
