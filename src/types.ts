/** Represents a single heading found in the document */
export interface ParsedHeading {
  line: number;                    // 0-based line index
  level: number;                   // 1-6 (number of #)
  existingNumber: string | null;   // e.g., "1", "1.1", null if unnumbered
  title: string;                   // text after the number
  from: number;                    // character offset in document (number portion start)
  to: number;                      // character offset in document (number portion + trailing separator end)
}

/** Numbering format style */
export type NumberingFormat = 'hierarchical' | 'flat' | 'per-level';

/** Represents a renumbering operation */
export interface HeadingChange {
  from: number;        // character position of number portion to replace
  to: number;          // character position of number portion to replace
  insert: string;     // new number string (CM6 ChangeSpec field)
}

/** Settings consumed by the numbering engine */
export interface NumberingConfig {
  format: NumberingFormat;  // numbering style
  separator: string;        // string between number and title (default ". ")
}
