class SettingsManager {
    static STORAGE_KEY = 'burmeAI_settings';

    static DEFAULT_SETTINGS = {
        darkMode: false,
        textToSpeech: false,
        language: 'my' // 'my' or 'en'
    };

    static init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.DEFAULT_SETTINGS));
        }
    }

    static getSettings() {
        const settings = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
        return { ...this.DEFAULT_SETTINGS, ...settings };
    }

    static updateSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    }
}
