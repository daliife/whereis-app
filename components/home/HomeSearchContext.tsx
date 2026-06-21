"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { SearchResult } from "@/lib/inventory";

interface HomeSearchContextValue {
  query: string;
  setQuery: (value: string) => void;
  isSearching: boolean;
  locateResult: SearchResult | null;
  setLocateResult: (result: SearchResult | null) => void;
  aboutOpen: boolean;
  setAboutOpen: (open: boolean) => void;
  goHome: () => void;
}

const HomeSearchContext = createContext<HomeSearchContextValue | null>(null);

export function HomeSearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [locateResult, setLocateResult] = useState<SearchResult | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  const goHome = useCallback(() => {
    setQuery("");
    setLocateResult(null);
    setAboutOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      isSearching: query.trim().length > 0,
      locateResult,
      setLocateResult,
      aboutOpen,
      setAboutOpen,
      goHome,
    }),
    [query, locateResult, aboutOpen, goHome],
  );

  return (
    <HomeSearchContext.Provider value={value}>
      {children}
    </HomeSearchContext.Provider>
  );
}

export function useHomeSearch() {
  const context = useContext(HomeSearchContext);
  if (!context) {
    throw new Error("useHomeSearch must be used within HomeSearchProvider");
  }
  return context;
}
