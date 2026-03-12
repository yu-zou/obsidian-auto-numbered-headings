# Auto Numbered Headings

Automatically numbers headings in your Markdown notes as you type. This plugin uses CodeMirror 6's transactionFilter to update heading numbers in real-time. Unlike other plugins that only decorate headings, this plugin writes the numbers directly into your note content.

## Description

The Auto Numbered Headings plugin provides transparent, real-time heading renumbering. It ensures your document structure remains consistent by automatically updating heading numbers as you move, add, or delete sections. Because it modifies the actual document text, the numbering is preserved across all Markdown editors and exports.

## How it works

The plugin follows an opt-in pattern. It only manages headings that you have already started numbering. To activate auto-numbering for a section, prefix your heading with a number followed by a dot and a space.

The renumbering logic is implemented using CodeMirror 6's **transactionFilter**, allowing it to intercept edits and apply numbering changes in the same transaction. This ensures a smooth editing experience without flickering or undo-history fragmentation.

Plain headings like `# My Title` are ignored. Once you change it to `# 1. My Title`, the plugin takes over and ensures all subsequent headings in that document remain correctly numbered and ordered.

## Usage

### Opt-in pattern

Add a number and a dot to any heading to start auto-numbering:

- `# 1. Introduction` activates numbering for level 1 headings.
- `## 1.1. Background` activates numbering for level 2 headings.

### Hierarchical numbering

The plugin supports multi-segment hierarchical numbering:

- `# 1. First Section`
- `## 1.1. Subsection`
- `### 1.1.1. Deep Section`

### Trailing dot behavior

The plugin follows specific rules for trailing dots to balance automatic management with manual control:

- **Single-segment numbers** (e.g., `# 1. `) keep their trailing dot after renumbering.
- **Multi-segment numbers** (e.g., `## 1.1 `) have their trailing dot removed after renumbering.

If a multi-segment heading becomes "unmanaged" because the dot was removed, simply re-type the dot at the end of the number to re-trigger the auto-numbering logic.

## Settings

Access settings via **Settings → Community plugins → Auto Numbered Headings**.

- **Enable auto-numbering**: Toggle the entire plugin on or off.
- **Numbering format**: Choose between different styles:
  - **Hierarchical**: Standard 1, 1.1, 1.1.1 format.
  - **Flat**: Sequential 1, 2, 3 across all levels.
  - **Per-Level**: Independent numbering for each heading level.
- **Separator**: Customize the string between the number and the title. The default is ". ".

## Installation

### Manual installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the latest release.
2. Create a folder named `auto-numbered-headings` in your vault's plugin directory: `<Vault>/.obsidian/plugins/auto-numbered-headings/`.
3. Copy the downloaded files into that folder.
4. Reload Obsidian and enable the plugin in **Settings → Community plugins**.

### BRAT

1. Install the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat).
2. Go to **Settings → BRAT → Add Beta plugin**.
3. Enter `yu-zou/obsidian-auto-numbered-headings`.
4. Click **Add Plugin**.

## Development

To modify the plugin or build it from source:

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the build process in watch mode.
4. Run `npm run build` for a production build.
