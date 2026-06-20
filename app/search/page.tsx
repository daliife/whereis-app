import { Suspense } from "react";
import SearchResults from "./SearchResults";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="page-shell pt-8">
          <div className="pt-8 pb-4">
            <div className="h-6 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-2 h-8 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-14 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
