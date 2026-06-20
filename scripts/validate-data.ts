import { readFileSync } from "node:fs";
import { validateInventory } from "../lib/validate-inventory";

const inventory = JSON.parse(readFileSync("data/inventory.json", "utf8"));
const { errors, warnings, spaceCount } = validateInventory(inventory);

for (const warning of warnings) {
  console.warn(`Warning: ${warning}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`Error: ${error}`);
  }
  process.exit(1);
}

console.log(
  `Inventory OK: ${spaceCount} spaces, ${warnings.length} warning(s)`,
);
