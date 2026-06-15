import { Suspense } from "react";
import SearchResults from "./SearchResults";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4">
          <div className="pt-8 pb-4">
            <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-8 w-40 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="h-14 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
