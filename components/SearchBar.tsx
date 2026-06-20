"use client";

import { useEffect, useId, useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  clearLabel?: string;
  autoFocus?: boolean;
  /** Larger field for the home page primary search */
  prominent?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "",
  clearLabel = "Clear search",
  autoFocus = false,
  prominent = false,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const iconClass = prominent
    ? "text-amber-700 dark:text-amber-400"
    : "text-zinc-400 transition-colors group-focus-within/search:text-amber-600 dark:text-zinc-500 dark:group-focus-within/search:text-amber-400";

  return (
    <div className="group/search relative w-full" role="search">
      <label htmlFor={inputId} className="sr-only">
        {placeholder}
      </label>
      <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
        <svg
          className={`h-[18px] w-[18px] transition-colors ${iconClass}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
      </div>
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        role="searchbox"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={prominent ? "search-field-primary" : "search-field"}
        style={{ minHeight: 44 }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="btn-toolbar absolute right-1 top-1/2 h-11 w-11 -translate-y-1/2"
          aria-label={clearLabel}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
