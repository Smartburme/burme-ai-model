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
