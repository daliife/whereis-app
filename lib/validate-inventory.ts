export interface InventoryValidationResult {
  errors: string[];
  warnings: string[];
  spaceCount: number;
}

const allowedTypes = new Set(["cabinet", "drawers", "shelf"]);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function path(parts: Array<string | number>): string {
  return parts.join(".");
}

export function validateInventory(inventory: unknown): InventoryValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (
    typeof inventory !== "object" ||
    inventory === null ||
    !Array.isArray((inventory as { spaces?: unknown }).spaces)
  ) {
    errors.push("inventory.spaces must be an array");
    return { errors, warnings, spaceCount: 0 };
  }

  const spaces = (inventory as { spaces: unknown[] }).spaces;
  const spaceIds = new Set<string>();

  for (const [spaceIndex, spaceValue] of spaces.entries()) {
    const spacePath = path(["spaces", spaceIndex]);
    const space =
      typeof spaceValue === "object" && spaceValue !== null
        ? (spaceValue as Record<string, unknown>)
        : {};

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

    if (!allowedTypes.has(String(space.type))) {
      errors.push(
        `${spacePath}.type must be one of: ${[...allowedTypes].join(", ")}`,
      );
    }

    if (!Array.isArray(space.sections) || space.sections.length === 0) {
      errors.push(`${spacePath}.sections must be a non-empty array`);
      continue;
    }

    const sectionIds = new Set<string>();
    const itemNames = new Map<string, string>();

    for (const [sectionIndex, sectionValue] of space.sections.entries()) {
      const sectionPath = path([spacePath, "sections", sectionIndex]);
      const section =
        typeof sectionValue === "object" && sectionValue !== null
          ? (sectionValue as Record<string, unknown>)
          : {};

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

      for (const [itemIndex, itemValue] of section.items.entries()) {
        const itemPath = path([sectionPath, "items", itemIndex]);
        const item =
          typeof itemValue === "object" && itemValue !== null
            ? (itemValue as Record<string, unknown>)
            : {};

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
            itemNames.set(
              normalizedName,
              String(section.name || section.id || sectionIndex),
            );
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

  return { errors, warnings, spaceCount: spaces.length };
}
