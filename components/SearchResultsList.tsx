import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import type { SearchResult } from "@/lib/inventory";
import { sameSearchResult } from "@/lib/search-result-utils";

interface Props {
  results: SearchResult[];
  selectedResult: SearchResult | null;
  onSelect: (result: SearchResult) => void;
  locateLabel: string;
  nothingFoundTitle: string;
  nothingFoundHint: string;
  footer?: React.ReactNode;
}

export default function SearchResultsList({
  results,
  selectedResult,
  onSelect,
  locateLabel,
  nothingFoundTitle,
  nothingFoundHint,
  footer,
}: Props) {
  if (results.length === 0) {
    return (
      <>
        <EmptyState title={nothingFoundTitle} hint={nothingFoundHint} />
        {footer}
      </>
    );
  }

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-2">
        {results.map((result, index) => {
          const isActive =
            selectedResult !== null &&
            sameSearchResult(selectedResult, result);

          return (
            <button
              key={`${result.space.id}-${result.section.id}-${result.item.name}-${index}`}
              type="button"
              onClick={() => onSelect(result)}
              className="group card-focus-wrap"
            >
              <ItemCard
                itemName={result.item.name}
                spaceName={result.space.name}
                sectionName={result.section.name}
                highlighted={isActive}
                embedded
                showAction
                locateLabel={locateLabel}
              />
            </button>
          );
        })}
      </div>
      {footer}
    </>
  );
}
