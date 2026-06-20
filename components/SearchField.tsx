"use client";

import { useEffect, useRef } from "react";
import SearchBar from "@/components/SearchBar";
import RecentSearches from "@/components/RecentSearches";
import { addRecentSearch } from "@/lib/recent-searches";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useSearchShortcut } from "@/lib/useSearchShortcut";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  clearLabel?: string;
  autoFocus?: boolean;
  autoFocusDesktop?: boolean;
  prominent?: boolean;
}

export default function SearchField({
  value,
  onChange,
  ...searchBarProps
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedValue = useDebouncedValue(value, 400);

  useSearchShortcut(inputRef);

  useEffect(() => {
    const trimmed = debouncedValue.trim();
    if (trimmed.length >= 2) {
      addRecentSearch(trimmed);
    }
  }, [debouncedValue]);

  return (
    <div>
      <SearchBar
        ref={inputRef}
        value={value}
        onChange={onChange}
        {...searchBarProps}
      />
      <RecentSearches onSelect={onChange} hidden={value.trim().length > 0} />
    </div>
  );
}
