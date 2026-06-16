import { readFileSync } from "node:fs";

const inventory = JSON.parse(readFileSync("data/inventory.json", "utf8"));

const allowedTypes = new Set(["cabinet", "drawers", "shelf"]);
const errors = [];
const warnings = [];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function path(parts) {
  return parts.join(".");
}

if (!Array.isArray(inventory.spaces)) {
  errors.push("inventory.spaces must be an array");
} else {
  const spaceIds = new Set();

  for (const [spaceIndex, space] of inventory.spaces.entries()) {
    const spacePath = path(["spaces", spaceIndex]);

    if (!isNonEmptyString(space.id)) {
      errors.push(`${spacePath}.id must be a non-empty string`);
    } else if (spaceIds.has(space.id)) {
      errors.push(`duplicate space id: ${space.id}`);
    } else {
      spaceIds.add(space.id);
    }

    if (!isNonEmptyString(space.name)) {
      errors.push(`${spacePath}.name must be a non-empty string`);
    }

    if (!allowedTypes.has(space.type)) {
      errors.push(
        `${spacePath}.type must be one of: ${[...allowedTypes].join(", ")}`,
      );
    }

    if (!Array.isArray(space.sections) || space.sections.length === 0) {
      errors.push(`${spacePath}.sections must be a non-empty array`);
      continue;
    }

    const sectionIds = new Set();
    const itemNames = new Map();

    for (const [sectionIndex, section] of space.sections.entries()) {
      const sectionPath = path([spacePath, "sections", sectionIndex]);

      if (!isNonEmptyString(section.id)) {
        errors.push(`${sectionPath}.id must be a non-empty string`);
      } else if (sectionIds.has(section.id)) {
        errors.push(`duplicate section id in ${space.id}: ${section.id}`);
      } else {
        sectionIds.add(section.id);
      }

      if (!isNonEmptyString(section.name)) {
        errors.push(`${sectionPath}.name must be a non-empty string`);
      }

      if (!Array.isArray(section.items) || section.items.length === 0) {
        warnings.push(`${sectionPath}.items is empty`);
        continue;
      }

      for (const [itemIndex, item] of section.items.entries()) {
        const itemPath = path([sectionPath, "items", itemIndex]);

        if (!isNonEmptyString(item.name)) {
          errors.push(`${itemPath}.name must be a non-empty string`);
        } else {
          const normalizedName = item.name.trim().toLowerCase();
          const previous = itemNames.get(normalizedName);
          if (previous) {
            warnings.push(
              `duplicate item name in ${space.id}: "${item.name}" also appears in ${previous}`,
            );
          } else {
            itemNames.set(normalizedName, section.name || section.id);
          }
        }

        if (!Array.isArray(item.tags) || item.tags.length === 0) {
          warnings.push(`${itemPath}.tags is empty`);
        } else {
          for (const [tagIndex, tag] of item.tags.entries()) {
            if (!isNonEmptyString(tag)) {
              errors.push(`${itemPath}.tags.${tagIndex} must be non-empty`);
            }
          }
        }
      }
    }
  }
}

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
  `Inventory OK: ${inventory.spaces.length} spaces, ${warnings.length} warning(s)`,
);
