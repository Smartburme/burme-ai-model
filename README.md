# burme-ai-model

# Burme AI Assistant App Development with Acode and GitHub

## Project Overview
Let's build "Burme AI" - a Burmese language assistant using Gemini API in Acode app. Here's the complete step-by-step guide:

## Project Structure
```
/BurmeAI
│── index.html        # Main app interface
│── style.css         # Styling
│── script.js         # Main JavaScript logic
│── gemini-api.js     # Gemini API handling
│── app-manifest.json # PWA manifest
│── /assets          # For images/icons
│   ├── icon.png
│   └── logo.png
│── README.md        # Project documentation
```

## Step 1: Set Up Project in Acode

1. Open Acode app
2. Tap "+" to create new project
3. Name it "BurmeAI"
4. Create the folder structure above

## Step 2: Create Basic Files

### index.html
```html
<!DOCTYPE html>
<html lang="my">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Burme AI</title>
    <link rel="stylesheet" href="style.css">
    <link rel="manifest" href="app-manifest.json">
</head>
<body>
    <div class="container">
        <header>
            <img src="assets/logo.png" alt="Burme AI Logo" class="logo">
            <h1>Burme AI</h1>
        </header>
        
        <div class="chat-container">
            <div id="chat-history" class="chat-history"></div>
            
            <div class="input-area">
                <textarea id="user-input" placeholder="သင့်မေးခွန်းကိုရေးပါ..."></textarea>
                <button id="send-btn">စေလွှတ်ပါ</button>
            </div>
        </div>
    </div>

    <script src="gemini-api.js"></script>
    <script src="script.js"></script>
</body>
</html>
```

### style.css
```css
body {
    font-family: 'Padauk', 'Noto Sans Myanmar', sans-serif;
    background-color: #f5f5f5;
    margin: 0;
    padding: 0;
    color: #333;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

header {
    text-align: center;
    margin-bottom: 20px;
}

.logo {
    width: 80px;
    height: 80px;
}

.chat-container {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 20px;
}

.chat-history {
    height: 400px;
    overflow-y: auto;
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
}

.input-area {
    display: flex;
    gap: 10px;
}

textarea {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    resize: none;
    font-family: inherit;
    font-size: 16px;
}

button {
    background-color: #4285f4;
    color: white;
    border: none;
    padding: 0 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

/* Message styling */
.message {
    margin-bottom: 10px;
    padding: 8px 12px;
    border-radius: 18px;
    max-width: 80%;
}

.user-message {
    background-color: #e3f2fd;
    margin-left: auto;
    border-bottom-right-radius: 0;
}

.ai-message {
    background-color: #f1f1f1;
    margin-right: auto;
    border-bottom-left-radius: 0;
}
```

## Step 3: Gemini API Integration

### gemini-api.js
```javascript
const API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with your actual API key
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

async function queryGemini(prompt) {
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return "တောင်းပန်ပါသည်၊ အချိန်အနည်းငယ်ကြာပြီးနောက် ထပ်ကြိုးစားပါ။";
    }
}
```

## Step 4: Main Application Logic

### script.js
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.getElementById('chat-history');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    // Initial greeting
    addAIMessage("မင်္ဂလာပါ! Burme AI မှကြိုဆိုပါသည်။ ဘာကူညီရမလဲ?");
    
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        addUserMessage(message);
        userInput.value = '';
        
        // Show loading indicator
        const loadingId = addAIMessage("စဉ်းစားနေပါသည်...", true);
        
        try {
            const response = await queryGemini(message);
            updateAIMessage(loadingId, response);
        } catch (error) {
            updateAIMessage(loadingId, "အမှားတစ်ခုဖြစ်နေပါသည်။ နောက်မှထပ်ကြိုးစားပါ။");
        }
    }
    
    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.textContent = text;
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
        return isTemp ? messageDiv.id : null;
    }
    
    function updateAIMessage(id, newText) {
        const messageDiv = document.getElementById(id);
        if (messageDiv) {
            messageDiv.textContent = newText;
            messageDiv.removeAttribute('id');
        }
    }
});
```

## Step 5: PWA Configuration

### app-manifest.json
```json
{
    "name": "Burme AI",
    "short_name": "BurmeAI",
    "start_url": "index.html",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#4285f4",
    "description": "Burmese Language AI Assistant",
    "icons": [
        {
            "src": "assets/icon.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "assets/icon-large.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

## Step 6: GitHub Integration in Acode

1. In Acode, go to Settings → Version Control
2. Connect your GitHub account
3. Initialize Git repository in your project:
   - Open terminal in Acode
   - Run:
     ```
     git init
     git add .
     git commit -m "Initial commit"
     ```
4. Create a new repository on GitHub
5. Push your code:
   ```
   git remote add origin https://github.com/yourusername/BurmeAI.git
   git push -u origin main
   ```

## Step 7: Testing and Deployment

1. Test your app in Acode's preview mode
2. For PWA deployment:
   - All files must be served via HTTPS
   - You can use GitHub Pages or Netlify for free hosting
3. To build as native app:
   - Follow Cordova/Capacitor steps mentioned earlier

## Additional Features to Consider Adding Later

1. Burmese language detection and optimization
2. Voice input/output
3. Conversation history saving
4. Dark mode toggle
5. Customizable AI personality

Remember to:
- Keep your Gemini API key secure (don't commit it to GitHub)
- Test thoroughly on different devices
- Add loading indicators for better UX
- Implement error handling for network issues

Would you like me to elaborate on any specific part of this implementation?
