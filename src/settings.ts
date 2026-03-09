import { App, PluginSettingTab, Setting } from "obsidian";
import AutoNumberedHeadingsPlugin from "./main";
import { NumberingFormat } from "./types";

export interface AutoNumberedHeadingsSettings {
	enabled: boolean;
	numberingFormat: NumberingFormat;
	separator: string;
}

export const DEFAULT_SETTINGS: AutoNumberedHeadingsSettings = {
	enabled: true,
	numberingFormat: 'hierarchical',
	separator: '. '
};

export class AutoNumberedHeadingsSettingTab extends PluginSettingTab {
	plugin: AutoNumberedHeadingsPlugin;

	constructor(app: App, plugin: AutoNumberedHeadingsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// Toggle: Enable/disable auto-numbering
		new Setting(containerEl)
			.setName('Enable auto-numbering')
			.setDesc('Enable or disable automatic heading numbering')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enabled)
				.onChange(async (value) => {
					this.plugin.settings.enabled = value;
					await this.plugin.saveSettings();
					this.app.workspace.updateOptions();
				}));

		// Dropdown: Numbering format
		new Setting(containerEl)
			.setName('Numbering format')
			.setDesc('Choose the numbering format for headings')
			.addDropdown(dropdown => dropdown
				.addOption('hierarchical', 'Hierarchical (1, 1.1, 1.1.1)')
				.addOption('flat', 'Flat (1, 2, 3, ...)')
				.addOption('per-level', 'Per-Level')
				.setValue(this.plugin.settings.numberingFormat)
				.onChange(async (value: string) => {
					this.plugin.settings.numberingFormat = value as NumberingFormat;
					await this.plugin.saveSettings();
					this.app.workspace.updateOptions();
				}));

		// Text input: Separator
		new Setting(containerEl)
			.setName('Separator')
			.setDesc('String between number and heading title (default ". ")')
			.addText(text => text
				.setPlaceholder('. ')
				.setValue(this.plugin.settings.separator)
				.onChange(async (value) => {
					this.plugin.settings.separator = value;
					await this.plugin.saveSettings();
					this.app.workspace.updateOptions();
				}));

}
}
