# Advanced Burme AI Implementation with Enhanced Features

Here's the upgraded version of Burme AI with all the requested features:

## Enhanced Project Structure
```
/BurmeAI
├── index.html
├── style.css
├── script.js
├── gemini-api.js
├── app-manifest.json
├── service-worker.js
├── /assets
│   ├── icons/
│   ├── images/
│   └── sounds/
├── /scripts
│   ├── history-manager.js
│   ├── settings-manager.js
│   └── image-processor.js
├── /pages
│   ├── about.html
│   └── settings.html
└── README.md
```

## 1. Enhanced index.html with Bottom Navigation
```html
<!DOCTYPE html>
<html lang="my">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Burme AI</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
    <link rel="manifest" href="app-manifest.json">
</head>
<body>
    <div class="app-container">
        <!-- Header -->
        <header class="app-header">
            <div class="header-left">
                <img src="assets/icons/logo.png" alt="Burme AI" class="logo">
                <h1>Burme AI</h1>
            </div>
            <button id="settings-btn" class="icon-btn">
                <i class="fas fa-cog"></i>
            </button>
        </header>

        <!-- Main Content -->
        <main class="app-main">
            <!-- Chat View -->
            <div id="chat-view" class="view active-view">
                <div id="chat-history" class="chat-history"></div>
                
                <div class="input-container">
                    <div class="input-actions">
                        <button id="image-upload-btn" class="icon-btn">
                            <i class="fas fa-image"></i>
                            <input type="file" id="image-upload" accept="image/*" hidden>
                        </button>
                        <button id="voice-input-btn" class="icon-btn">
                            <i class="fas fa-microphone"></i>
                        </button>
                    </div>
                    <textarea id="user-input" placeholder="သင့်မေးခွန်းကိုရေးပါ..."></textarea>
                    <button id="send-btn" class="send-btn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>

            <!-- History View -->
            <div id="history-view" class="view">
                <div class="history-header">
                    <h2>စကားပြောမှတ်တမ်း</h2>
                    <button id="clear-history" class="text-btn">ဖျက်ပစ်မည်</button>
                </div>
                <div id="history-list" class="history-list"></div>
            </div>

            <!-- Image Output View -->
            <div id="image-view" class="view">
                <div id="image-output-container"></div>
            </div>
        </main>

        <!-- Bottom Navigation -->
        <nav class="bottom-nav">
            <button class="nav-btn active" data-view="chat-view">
                <i class="fas fa-comment"></i>
                <span>Chat</span>
            </button>
            <button class="nav-btn" data-view="history-view">
                <i class="fas fa-history"></i>
                <span>History</span>
            </button>
            <button class="nav-btn" data-view="image-view">
                <i class="fas fa-images"></i>
                <span>Images</span>
            </button>
        </nav>
    </div>

    <!-- Settings Modal -->
    <div id="settings-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>ဆက်တင်များ</h2>
                <button id="close-settings" class="icon-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <!-- Settings content will be loaded here -->
            </div>
        </div>
    </div>

    <script src="scripts/history-manager.js"></script>
    <script src="scripts/settings-manager.js"></script>
    <script src="scripts/image-processor.js"></script>
    <script src="gemini-api.js"></script>
    <script src="script.js"></script>
</body>
</html>
```

## 2. Enhanced style.css
```css
:root {
    --primary-color: #4285f4;
    --secondary-color: #34a853;
    --accent-color: #ea4335;
    --bg-color: #f5f5f5;
    --card-color: #ffffff;
    --text-color: #333333;
    --text-secondary: #666666;
    --border-color: #e0e0e0;
    --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
    --bg-color: #121212;
    --card-color: #1e1e1e;
    --text-color: #f5f5f5;
    --text-secondary: #bbbbbb;
    --border-color: #333333;
    --shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/* Base Styles */
body {
    font-family: 'Padauk', 'Noto Sans Myanmar', sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    margin: 0;
    padding: 0;
    transition: background-color 0.3s;
}

.app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 800px;
    margin: 0 auto;
}

.app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: var(--primary-color);
    color: white;
    box-shadow: var(--shadow);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.icon-btn {
    background: none;
    border: none;
    color: inherit;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 8px;
}

.app-main {
    flex: 1;
    overflow: hidden;
    position: relative;
}

.view {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 15px;
    overflow-y: auto;
    display: none;
}

.view.active-view {
    display: block;
}

/* Chat View Styles */
.chat-history {
    height: calc(100% - 70px);
    overflow-y: auto;
    padding-bottom: 15px;
}

.input-container {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 10px 0;
}

.input-actions {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

textarea {
    flex: 1;
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: 20px;
    resize: none;
    font-family: inherit;
    font-size: 16px;
    background-color: var(--card-color);
    color: var(--text-color);
    min-height: 50px;
    max-height: 150px;
}

.send-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
}

/* Message Styles */
.message {
    margin-bottom: 15px;
    padding: 12px 16px;
    border-radius: 18px;
    max-width: 80%;
    word-wrap: break-word;
    box-shadow: var(--shadow);
}

.user-message {
    background-color: var(--primary-color);
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 5px;
}

.ai-message {
    background-color: var(--card-color);
    margin-right: auto;
    border-bottom-left-radius: 5px;
}

.message-image {
    max-width: 100%;
    border-radius: 10px;
    margin-top: 8px;
}

/* Bottom Navigation */
.bottom-nav {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    background-color: var(--card-color);
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}

.nav-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 0.9rem;
    cursor: pointer;
    padding: 5px 10px;
}

.nav-btn.active {
    color: var(--primary-color);
}

.nav-btn i {
    font-size: 1.4rem;
    margin-bottom: 3px;
}

/* History View */
.history-list {
    margin-top: 15px;
}

.history-item {
    background-color: var(--card-color);
    padding: 12px;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: var(--shadow);
    cursor: pointer;
}

.history-item:hover {
    background-color: var(--border-color);
}

.history-preview {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--text-secondary);
}

/* Image View */
#image-output-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    margin-top: 15px;
}

.image-card {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: var(--shadow);
}

.image-card img {
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.image-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: space-around;
    padding: 5px;
}

/* Modal Styles */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal.active {
    display: flex;
}

.modal-content {
    background-color: var(--card-color);
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-header {
    padding: 15px;
    background-color: var(--primary-color);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-body {
    padding: 15px;
    overflow-y: auto;
    max-height: 60vh;
}

/* Settings Styles */
.setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid var(--border-color);
}

.setting-label {
    font-weight: bold;
}

.switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: var(--primary-color);
}

input:checked + .slider:before {
    transform: translateX(26px);
}

/* Responsive Design */
@media (max-width: 600px) {
    .app-container {
        max-width: 100%;
    }
    
    .message {
        max-width: 90%;
    }
}
```

## 3. Enhanced script.js
```javascript
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatView = document.getElementById('chat-view');
    const historyView = document.getElementById('history-view');
    const imageView = document.getElementById('image-view');
    const navButtons = document.querySelectorAll('.nav-btn');
    const chatHistory = document.getElementById('chat-history');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const imageUploadBtn = document.getElementById('image-upload-btn');
    const imageUploadInput = document.getElementById('image-upload');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    const clearHistoryBtn = document.getElementById('clear-history');
    const historyList = document.getElementById('history-list');
    const imageOutputContainer = document.getElementById('image-output-container');

    // State
    let currentChatId = generateChatId();
    let isProcessing = false;
    let currentImage = null;

    // Initialize modules
    HistoryManager.init();
    SettingsManager.init();
    ImageProcessor.init();

    // Load initial data
    loadHistory();
    applySettings();

    // Event Listeners
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', handleKeyDown);
    imageUploadBtn.addEventListener('click', () => imageUploadInput.click());
    imageUploadInput.addEventListener('change', handleImageUpload);
    settingsBtn.addEventListener('click', openSettings);
    closeSettings.addEventListener('click', closeSettingsModal);
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Initial greeting
    addAIMessage("မင်္ဂလာပါ! Burme AI မှကြိုဆိုပါသည်။ ဘာကူညီရမလဲ?");

    // Functions
    function switchView(viewId) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active-view');
        });
        document.getElementById(viewId).classList.add('active-view');

        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewId);
        });

        if (viewId === 'history-view') {
            loadHistory();
        } else if (viewId === 'image-view') {
            loadImageHistory();
        }
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message || isProcessing) return;

        addUserMessage(message);
        userInput.value = '';
        
        // Save to history immediately
        HistoryManager.addMessage(currentChatId, {
            type: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });

        // Show loading indicator
        const loadingId = addAIMessage("စဉ်းစားနေပါသည်...", true);
        isProcessing = true;

        try {
            let response;
            if (currentImage) {
                response = await queryGeminiWithImage(message, currentImage);
                currentImage = null; // Clear after use
            } else {
                response = await queryGemini(message);
            }

            updateAIMessage(loadingId, response);
            
            // Save AI response to history
            HistoryManager.addMessage(currentChatId, {
                type: 'ai',
                content: response,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error:', error);
            updateAIMessage(loadingId, "အမှားတစ်ခုဖြစ်နေပါသည်။ နောက်မှထပ်ကြိုးစားပါ။");
        } finally {
            isProcessing = false;
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            currentImage = event.target.result;
            addUserMessage("ပုံကိုတင်ပြီးပါပြီ", currentImage);
            
            // Save to history
            HistoryManager.addMessage(currentChatId, {
                type: 'user',
                content: "ပုံတစ်ပုံတင်ထားပါသည်",
                image: currentImage,
                timestamp: new Date().toISOString()
            });
        };
        reader.readAsDataURL(file);
    }

    function openSettings() {
        settingsModal.classList.add('active');
        loadSettingsContent();
    }

    function closeSettingsModal() {
        settingsModal.classList.remove('active');
    }

    function loadSettingsContent() {
        const settings = SettingsManager.getSettings();
        const modalBody = document.querySelector('.modal-body');
        
        modalBody.innerHTML = `
            <div class="setting-item">
                <span class="setting-label">အမှောင်အပြင်</span>
                <label class="switch">
                    <input type="checkbox" id="dark-mode-toggle" ${settings.darkMode ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="setting-item">
                <span class="setting-label">အသံဖွင့်ဖတ်ခြင်း</span>
                <label class="switch">
                    <input type="checkbox" id="tts-toggle" ${settings.textToSpeech ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
            <div class="setting-item">
                <span class="setting-label">ဘာသာစကား</span>
                <select id="language-select" class="setting-select">
                    <option value="my" ${settings.language === 'my' ? 'selected' : ''}>မြန်မာ</option>
                    <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
                </select>
            </div>
            <div class="about-section">
                <h3>Burme AI အကြောင်း</h3>
                <p>ဗားရှင်း 1.0.0</p>
                <p>Developed with Gemini API</p>
            </div>
        `;

        // Add event listeners for settings changes
        document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
            SettingsManager.updateSetting('darkMode', e.target.checked);
            applySettings();
        });

        document.getElementById('tts-toggle').addEventListener('change', (e) => {
            SettingsManager.updateSetting('textToSpeech', e.target.checked);
        });

        document.getElementById('language-select').addEventListener('change', (e) => {
            SettingsManager.updateSetting('language', e.target.value);
        });
    }

    function applySettings() {
        const settings = SettingsManager.getSettings();
        document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
    }

    function loadHistory() {
        const history = HistoryManager.getHistory();
        historyList.innerHTML = '';

        if (history.length === 0) {
            historyList.innerHTML = '<p class="empty-message">စကားပြောမှတ်တမ်းမရှိသေးပါ</p>';
            return;
        }

        history.forEach(chat => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            // Get the first few messages as preview
            const preview = chat.messages.slice(0, 2).map(msg => {
                return msg.type === 'user' ? `You: ${msg.content.substring(0, 30)}` 
                                         : `AI: ${msg.content.substring(0, 30)}`;
            }).join(' | ');
            
            historyItem.innerHTML = `
                <div class="history-date">${formatDate(chat.timestamp)}</div>
                <div class="history-preview">${preview}...</div>
            `;
            
            historyItem.addEventListener('click', () => loadChat(chat.id));
            historyList.appendChild(historyItem);
        });
    }

    function loadChat(chatId) {
        const chat = HistoryManager.getChat(chatId);
        if (!chat) return;

        currentChatId = chatId;
        chatHistory.innerHTML = '';

        chat.messages.forEach(msg => {
            if (msg.type === 'user') {
                addUserMessage(msg.content, msg.image);
            } else {
                addAIMessage(msg.content);
            }
        });

        switchView('chat-view');
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function clearHistory() {
        if (confirm('စကားပြောမှတ်တမ်းအားလုံးကိုဖျက်ပစ်မည်။ သေချာပါသလား?')) {
            HistoryManager.clearHistory();
            loadHistory();
        }
    }

    function loadImageHistory() {
        const history = HistoryManager.getHistory();
        imageOutputContainer.innerHTML = '';

        const imageMessages = [];
        history.forEach(chat => {
            chat.messages.forEach(msg => {
                
