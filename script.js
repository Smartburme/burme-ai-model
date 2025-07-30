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
                if (msg.image) {
                    imageMessages.push(msg);
                }
            });
        });

        if (imageMessages.length === 0) {
            imageOutputContainer.innerHTML = '<p class="empty-message">ပုံများမရှိသေးပါ</p>';
            return;
        }

        imageMessages.forEach(msg => {
            const imageCard = document.createElement('div');
            imageCard.className = 'image-card';
            
            imageCard.innerHTML = `
                <img src="${msg.image}" alt="Uploaded image">
                <div class="image-actions">
                    <button class="icon-btn" onclick="viewImage('${msg.image}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="icon-btn" onclick="shareImage('${msg.image}')">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="icon-btn" onclick="downloadImage('${msg.image}')">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            `;
            
            imageOutputContainer.appendChild(imageCard);
        });
    }

    function addUserMessage(text, image = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div>${text}</div>
            ${image ? `<img src="${image}" class="message-image" alt="User uploaded image">` : ''}
        `;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function addAIMessage(text, isTemp = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';
        messageDiv.textContent = text;
        if (isTemp) messageDiv.id = 'temp-' + Date.now();
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        
        // Text-to-speech if enabled
        if (SettingsManager.getSettings().textToSpeech) {
            speakText(text);
        }
        
        return isTemp ? messageDiv.id : null;
    }

    function updateAIMessage(id, newText) {
        const messageDiv = document.getElementById(id);
        if (messageDiv) {
            messageDiv.textContent = newText;
            messageDiv.removeAttribute('id');
            
            // Text-to-speech if enabled
            if (SettingsManager.getSettings().textToSpeech) {
                speakText(newText);
            }
        }
    }

    function speakText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = SettingsManager.getSettings().language === 'my' ? 'my-MM' : 'en-US';
            speechSynthesis.speak(utterance);
        }
    }

    function generateChatId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    function formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
});

// Global functions for image actions
function viewImage(imageSrc) {
    window.open(imageSrc, '_blank');
}

function shareImage(imageSrc) {
    if (navigator.share) {
        fetch(imageSrc)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], 'image.png', { type: blob.type });
                navigator.share({
                    files: [file],
                    title: 'Burme AI Image',
                    text: 'Check out this image from Burme AI'
                });
            });
    } else {
        // Fallback for browsers that don't support Web Share API
        prompt('Copy this link to share:', imageSrc);
    }
}

function downloadImage(imageSrc) {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = 'burme-ai-image-' + new Date().toISOString().slice(0, 10) + '.png';
    link.click();
                }
