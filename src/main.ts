import { Plugin } from 'obsidian';
import { AutoNumberedHeadingsSettings, DEFAULT_SETTINGS, AutoNumberedHeadingsSettingTab } from './settings';
import { createAutoNumberingExtension } from './transaction-filter';

export default class AutoNumberedHeadingsPlugin extends Plugin {
	settings: AutoNumberedHeadingsSettings;

	async onload() {
		await this.loadSettings();
		this.registerEditorExtension(createAutoNumberingExtension(this));
		this.addSettingTab(new AutoNumberedHeadingsSettingTab(this.app, this));
	}


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<AutoNumberedHeadingsSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
