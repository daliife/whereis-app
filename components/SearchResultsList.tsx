"use client";

import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import type { SearchResult } from "@/lib/inventory";
import { sameSearchResult } from "@/lib/search-result-utils";
import { useWindowedRange } from "@/lib/useWindowedRange";

interface Props {
  results: SearchResult[];
  selectedResult: SearchResult | null;
  onSelect: (result: SearchResult) => void;
  locateLabel: string;
  itemTagsLabel?: string;
  nothingFoundTitle: string;
  nothingFoundHint: string;
  footer?: React.ReactNode;
}

function ResultButton({
  result,
  index,
  isActive,
  onSelect,
  locateLabel,
  itemTagsLabel,
}: {
  result: SearchResult;
  index: number;
  isActive: boolean;
  onSelect: (result: SearchResult) => void;
  locateLabel: string;
  itemTagsLabel?: string;
}) {
  return (
    <button
      key={`${result.space.id}-${result.section.id}-${result.item.name}-${index}`}
      type="button"
      onClick={() => onSelect(result)}
      className="card-focus-wrap list-item-optimized"
    >
      <ItemCard
        itemName={result.item.name}
        tags={result.item.tags}
        spaceName={result.space.name}
        sectionName={result.section.name}
        highlighted={isActive}
        embedded
        showAction
        locateLabel={locateLabel}
        itemTagsLabel={itemTagsLabel}
      />
    </button>
  );
}

export default function SearchResultsList({
  results,
  selectedResult,
  onSelect,
  locateLabel,
  itemTagsLabel,
  nothingFoundTitle,
  nothingFoundHint,
  footer,
}: Props) {
  const { range, topSpacerHeight, bottomSpacerHeight } = useWindowedRange(
    results.length,
  );

  if (results.length === 0) {
    return (
      <>
        <EmptyState title={nothingFoundTitle} hint={nothingFoundHint} />
        {footer}
      </>
    );
  }

  const visible = results.slice(range.start, range.end);

  return (
    <>
      <div className="results-grid grid gap-2 sm:grid-cols-2">
        {topSpacerHeight > 0 && (
          <div
            className="col-span-full"
            style={{ height: topSpacerHeight }}
            aria-hidden="true"
          />
        )}
        {visible.map((result, offset) => {
          const index = range.start + offset;
          const isActive =
            selectedResult !== null && sameSearchResult(selectedResult, result);

          return (
            <ResultButton
              key={`${result.space.id}-${result.section.id}-${result.item.name}-${index}`}
              result={result}
              index={index}
              isActive={isActive}
              onSelect={onSelect}
              locateLabel={locateLabel}
              itemTagsLabel={itemTagsLabel}
            />
          );
        })}
        {bottomSpacerHeight > 0 && (
          <div
            className="col-span-full"
            style={{ height: bottomSpacerHeight }}
            aria-hidden="true"
          />
        )}
      </div>
      {footer}
    </>
  );
}
