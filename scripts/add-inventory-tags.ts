import { readFileSync, writeFileSync } from "node:fs";

const STOP = new Set([
  "caixa",
  "caixeta",
  "caixetes",
  "capsa",
  "bossa",
  "bosses",
  "cartró",
  "cartró",
  "plàstic",
  "plast",
  "fusta",
  "gris",
  "negra",
  "diferents",
  "diversos",
  "similars",
  "buit",
  "buida",
  "buides",
  "amb",
  "etc",
  "altres",
  "peces",
  "coses",
  "materials",
  "tamanys",
]);

const EXTRA: Record<string, string[]> = {
  barbacoa: ["barbacoa", "graella", "cuina"],
  taladro: ["taladro", "trepant", "eines", "eina"],
  borrassa: ["borrassa", "pintura", "neteja"],
  pintura: ["pintura", "pintures"],
  bombetes: ["bombeta", "bombetes", "llum", "focus"],
  focus: ["focus", "llum", "bombeta"],
  endolls: ["endoll", "endolls", "electricitat"],
  electricitat: ["electricitat", "cables", "fil"],
  vi: ["vi", "ampolla", "garrafa", "beguda"],
  brides: ["brides", "fixació"],
  regletes: ["regleta", "regletes", "endoll"],
  cargols: ["cargol", "cargols", "fixació"],
  broques: ["broca", "broques", "eines"],
  serres: ["serra", "serres", "eines"],
  infladors: ["inflador", "piscina"],
  cortina: ["cortina", "cortines"],
  telèfon: ["telefon", "telèfon", "dutxa"],
  bateria: ["bateria", "cotxe"],
  claus: ["clau", "claus", "hexagonal"],
  cinta: ["cinta", "aïllant", "aillant"],
  cel·lo: ["cello", "cel·lo", "embalatge"],
};

function tagsFromName(name: string): string[] {
  const normalized = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");

  const tags = new Set<string>();

  for (const [key, values] of Object.entries(EXTRA)) {
    if (normalized.includes(key.normalize("NFD").replace(/\p{M}/gu, ""))) {
      for (const value of values) tags.add(value);
    }
  }

  for (const word of normalized.split(/[^a-z0-9]+/)) {
    if (word.length > 2 && !STOP.has(word)) {
      tags.add(word);
    }
  }

  if (tags.size === 0) {
    tags.add("objecte");
  }

  return [...tags].slice(0, 8);
}

const inventory = JSON.parse(readFileSync("data/inventory.json", "utf8"));

for (const space of inventory.spaces) {
  for (const section of space.sections) {
    for (const item of section.items) {
      item.tags = tagsFromName(item.name);
    }
  }
}

writeFileSync("data/inventory.json", `${JSON.stringify(inventory, null, 2)}\n`);

console.log("Added tags to all inventory items.");
