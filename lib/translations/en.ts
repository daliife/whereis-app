import type { ca } from "./ca";

export const en: typeof ca = {
  home: {
    subtitle: "Find where things are stored",
    qrLink: "QR codes",
    searchPlaceholder: "Search any item…",
    spacesHeading: "Storage spaces",
    items: (n: number) => (n === 1 ? "1 item" : `${n} items`),
    results: (n: number) => (n === 1 ? "1 result" : `${n} results`),
    seeAll: (n: number) => `See all ${n} results`,
    nothingFound: "Nothing found",
    nothingFoundHint: "Try a different keyword",
  },
  space: {
    back: "← Home",
    searchPlaceholder: (name: string) => `Search in ${name}…`,
    searchEverywhereBtn: "Search everywhere →",
    nothingFoundHere: "Nothing found here",
    nothingFoundHint: "Try a different keyword, or",
    searchEverywhereLink: "search everywhere",
    listView: "List",
    planView: "Plan",
  },
  search: {
    back: "← Home",
    title: "Search everywhere",
    typeToSearch: "Type to search all spaces",
    results: (n: number) => (n === 1 ? "1 result" : `${n} results`),
    nothingFound: "Nothing found",
    nothingFoundHint: "Try a different keyword",
  },
  qr: {
    back: "← Home",
    title: "QR Codes",
    subtitle: "Print and stick on your storage units",
    printButton: "Print QR codes",
  },
};
