import { EditorState, Text } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import type { SyntaxNode } from "@lezer/common";
import type { ParsedHeading } from "./types";

const NUMBERED_HEADING_REGEX = /^(#{1,6})\s+(\d[\d.]*)\.\s+(.*)$/;
const EXCLUDED_NODE_TYPES = new Set([
  "FencedCode",
  "CodeBlock",
  "HTMLBlock",
  "FrontMatter",
  "YAMLFrontMatter",
  "Frontmatter",
]);

export function isNumberedHeading(line: string): boolean {
  return NUMBERED_HEADING_REGEX.test(line);
}

function isExcludedBySyntaxTree(state: EditorState, pos: number): boolean {
  const tree = syntaxTree(state);
  if (!tree || tree.length !== state.doc.length) {
    return false;
  }

  let node: SyntaxNode | null = tree.resolve(pos, 1);
  while (node) {
    if (EXCLUDED_NODE_TYPES.has(node.type.name)) {
      return true;
    }
    node = node.parent;
  }
  return false;
}

function findNumberStart(line: string, numberText: string, minIndex: number): number {
  const idx = line.indexOf(numberText, minIndex);
  return idx >= 0 ? idx : minIndex;
}

export function parseHeadings(doc: Text, state: EditorState): ParsedHeading[] {
  const headings: ParsedHeading[] = [];
  const tree = syntaxTree(state);
  const useTree = !!tree && tree.length === state.doc.length;

  let inFence = false;
  let inFrontmatter = false;

  for (let i = 1; i <= doc.lines; i += 1) {
    const line = doc.line(i);
    const text = line.text;

    if (useTree) {
      if (isExcludedBySyntaxTree(state, line.from)) {
        continue;
      }
    } else {
      const trimmed = text.trim();

      if (i === 1 && trimmed === "---") {
        inFrontmatter = true;
        continue;
      }

      if (inFrontmatter) {
        if (trimmed === "---") {
          inFrontmatter = false;
        }
        continue;
      }

      if (/^```/.test(trimmed)) {
        inFence = !inFence;
        continue;
      }

      if (inFence) {
        continue;
      }
    }

    const match = text.match(NUMBERED_HEADING_REGEX);
    if (!match || !match[1] || !match[2] || match[3] === undefined) {
      continue;
    }

    const level = match[1].length;
    const existingNumber = match[2];
    const title = match[3];
    const numberStartInLine = findNumberStart(text, existingNumber, level);
    const from = line.from + numberStartInLine;
    const to = from + existingNumber.length;

    headings.push({
      line: line.number - 1,
      level,
      existingNumber,
      title,
      from,
      to,
    });
  }

  return headings;
}
