interface SearchStatusProps {
  query: string;
  resultCount: number;
  resultsLabel: (count: number) => string;
  nothingFoundLabel: string;
}

export default function SearchStatus({
  query,
  resultCount,
  resultsLabel,
  nothingFoundLabel,
}: SearchStatusProps) {
  if (!query.trim()) return null;

  const message =
    resultCount > 0 ? resultsLabel(resultCount) : nothingFoundLabel;

  return (
    <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </p>
  );
}
