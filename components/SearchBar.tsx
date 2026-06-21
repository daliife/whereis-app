"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from "react";
import UiIcon from "@/components/icons/UiIcon";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  clearLabel?: string;
  autoFocus?: boolean;
  /** Focus on desktop only — avoids opening the mobile keyboard on home load */
  autoFocusDesktop?: boolean;
  /** Larger field for the home page primary search */
  prominent?: boolean;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  function SearchBar(
    {
      value,
      onChange,
      placeholder = "",
      clearLabel = "Clear search",
      autoFocus = false,
      autoFocusDesktop = false,
      prominent = false,
    },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const inputId = useId();

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    useEffect(() => {
      if (autoFocus) {
        inputRef.current?.focus();
        return;
      }

      if (!autoFocusDesktop) return;

      const desktop = window.matchMedia("(min-width: 640px)");
      if (desktop.matches) {
        inputRef.current?.focus();
      }
    }, [autoFocus, autoFocusDesktop]);

    const iconClass = prominent
      ? "text-amber-700 dark:text-amber-400"
      : "text-zinc-400 transition-colors group-focus-within/search:text-amber-600 dark:text-zinc-500 dark:group-focus-within/search:text-amber-400";

    return (
      <div className="group/search relative w-full" role="search">
        <label htmlFor={inputId} className="sr-only">
          {placeholder}
        </label>
        <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
          <UiIcon name="search" className={`h-[18px] w-[18px] ${iconClass}`} />
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
            <UiIcon name="close" className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  },
);

export default SearchBar;
