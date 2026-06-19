import { Suspense } from "react";
import { getAllSpaces, getSpace } from "@/lib/inventory";
import { ca } from "@/lib/translations/ca";
import SpaceClient from "./SpaceClient";

export function generateStaticParams() {
  return getAllSpaces().map((s) => ({ id: s.id }));
}

export default function SpacePage({ params }: { params: { id: string } }) {
  const space = getSpace(params.id);

  if (!space) {
    return (
      <main id="main-content" className="mx-auto max-w-lg px-4 pt-16 text-center">
        <p className="text-4xl" aria-hidden="true">
          📦
        </p>
        <p className="mt-4 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
          {ca.space.notFound}
        </p>
      </main>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 pt-8 text-zinc-400">
          {ca.common.loading}
        </div>
      }
    >
      <SpaceClient space={space} />
    </Suspense>
  );
}
