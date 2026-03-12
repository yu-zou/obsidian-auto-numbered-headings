import { HeadingChange, NumberingConfig, ParsedHeading } from "./types";

function recordChange(
  changes: HeadingChange[],
  heading: ParsedHeading,
  expectedNumber: string,
  insertText: string
): void {
  if (heading.existingNumber === expectedNumber) {
    return;
  }

  changes.push({
    from: heading.from,
    to: heading.to,
    insert: insertText,
  });
}

export function computeRenumbering(
  headings: ParsedHeading[],
  config: NumberingConfig
): HeadingChange[] {
  const changes: HeadingChange[] = [];

  if (headings.length === 0) {
    return changes;
  }

  if (config.format === "hierarchical") {
    const counters: number[] = [];
    const levelToDepth = new Map<number, number>();
    let prevLevel = 0;
    let currentDepth = 0;

    for (const heading of headings) {
      const level = Math.max(1, heading.level);

      if (level > prevLevel) {
        // Going deeper: increment depth
        currentDepth++;
        levelToDepth.set(level, currentDepth);
        counters.push(1);
      } else if (level < prevLevel) {
        // Going shallower: look up the depth for this level
        currentDepth = levelToDepth.get(level) ?? currentDepth;
        counters.length = currentDepth;
        // Increment the counter at current depth
        counters[currentDepth - 1] = (counters[currentDepth - 1] ?? 0) + 1;
      } else {
        // Same level: increment the current counter
        counters[currentDepth - 1] = (counters[currentDepth - 1] ?? 0) + 1;
      }

      const expectedNumber = counters.join(".");
      const insertText = counters.length === 1
        ? expectedNumber + ". "
        : expectedNumber + " ";
      recordChange(changes, heading, expectedNumber, insertText);
      prevLevel = level;
    }

    return changes;
  }

  const counters: number[] = [];

  for (const heading of headings) {
    const level = Math.max(1, heading.level);

    while (counters.length < level) {
      counters.push(0);
    }

    const current = (counters[level - 1] ?? 0) + 1;
    counters[level - 1] = current;

    const expectedNumber = String(counters[level - 1]);
    const insertText = expectedNumber + ". ";
    recordChange(changes, heading, expectedNumber, insertText);
  }

  return changes;
}
