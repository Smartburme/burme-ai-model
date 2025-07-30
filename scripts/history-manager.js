class HistoryManager {
    static STORAGE_KEY = 'burmeAI_chatHistory';

    static init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
        }
    }

    static getHistory() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    }

    static getChat(chatId) {
        const history = this.getHistory();
        return history.find(chat => chat.id === chatId);
    }

    static addMessage(chatId, message) {
        const history = this.getHistory();
        let chat = history.find(chat => chat.id === chatId);

        if (!chat) {
            chat = {
                id: chatId,
                timestamp: new Date().toISOString(),
                messages: []
            };
            history.unshift(chat); // Add new chat to beginning
        }

        chat.messages.push(message);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    }

    static clearHistory() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
}
