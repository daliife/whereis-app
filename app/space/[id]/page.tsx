import { Suspense } from "react";
import { getAllSpaces, getSpace } from "@/lib/search";
import SpaceClient from "./SpaceClient";

export function generateStaticParams() {
  return getAllSpaces().map((s) => ({ id: s.id }));
}

export default function SpacePage({ params }: { params: { id: string } }) {
  const space = getSpace(params.id);

  if (!space) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-16 text-center">
        <p className="text-4xl">📦</p>
        <p className="mt-4 text-lg font-semibold text-slate-700">
          Space not found
        </p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 pt-8 text-slate-400">
          Loading…
        </div>
      }
    >
      <SpaceClient space={space} />
    </Suspense>
  );
}
