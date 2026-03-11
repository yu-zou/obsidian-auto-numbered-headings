import {
  Annotation,
  EditorState,
  Extension,
  StateField,
  Transaction,
} from "@codemirror/state";
import type { default as AutoNumberedHeadingsPlugin } from "./main";
import { parseHeadings } from "./heading-parser";
import { computeRenumbering } from "./numbering-engine";
import type { NumberingConfig, ParsedHeading } from "./types";

const isAutoNumbering = Annotation.define<boolean>();

const headingsField = StateField.define<ParsedHeading[]>({
  create(state) {
    return parseHeadings(state.doc, state);
  },
  update(headings, tr) {
    if (tr.docChanged) {
      return parseHeadings(tr.state.doc, tr.state);
    }
    return headings;
  },
});

export function createAutoNumberingExtension(
  plugin: AutoNumberedHeadingsPlugin
): Extension {
  const filter = EditorState.transactionFilter.of((tr: Transaction) => {
    if (!tr.docChanged) {
      return tr;
    }

    if (tr.annotation(isAutoNumbering)) {
      return tr;
    }

    if (!plugin.settings.enabled) {
      return tr;
    }

    const headings = parseHeadings(tr.newDoc, tr.state);
    const config: NumberingConfig = {
      format: plugin.settings.numberingFormat,
      separator: plugin.settings.separator,
    };
    const changes = computeRenumbering(headings, config);

    if (changes.length === 0) {
      return tr;
    }

    return [
      tr,
      {
        changes,
        annotations: isAutoNumbering.of(true),
        sequential: true,
      },
    ];
  });

  return [headingsField, filter];
}
