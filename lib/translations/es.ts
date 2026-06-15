import type { ca } from "./ca";

export const es: typeof ca = {
  home: {
    subtitle: "Encuentra dónde están tus cosas guardadas",
    qrLink: "Códigos QR",
    searchPlaceholder: "Buscar cualquier objeto…",
    spacesHeading: "Espacios de almacenamiento",
    items: (n: number) => (n === 1 ? "1 elemento" : `${n} elementos`),
    results: (n: number) => (n === 1 ? "1 resultado" : `${n} resultados`),
    seeAll: (n: number) => `Ver los ${n} resultados`,
    nothingFound: "Sin resultados",
    nothingFoundHint: "Prueba con otra palabra",
  },
  space: {
    back: "← Inicio",
    searchPlaceholder: (name: string) => `Buscar en ${name}…`,
    searchEverywhereBtn: "Buscar en todos →",
    nothingFoundHere: "Sin resultados aquí",
    nothingFoundHint: "Prueba con otra palabra, o",
    searchEverywhereLink: "busca en todos los espacios",
    listView: "Lista",
    planView: "Plano",
  },
  search: {
    back: "← Inicio",
    title: "Buscar en todo",
    typeToSearch: "Escribe para buscar en todos los espacios",
    results: (n: number) => (n === 1 ? "1 resultado" : `${n} resultados`),
    nothingFound: "Sin resultados",
    nothingFoundHint: "Prueba con otra palabra",
  },
  qr: {
    back: "← Inicio",
    title: "Códigos QR",
    subtitle: "Imprime y pega en tus espacios de almacenamiento",
    printButton: "Imprimir códigos QR",
  },
};
