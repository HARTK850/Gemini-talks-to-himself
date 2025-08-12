class GeminiChatApp {
    constructor() {
        this.apiKey = '';
        this.currentTopic = '';
        this.askerCharacter = null;
        this.answererCharacter = null;
        this.chatHistory = [];
        this.currentRound = 0;
        this.totalRounds = 5;
        this.isApiValid = false;
        
        this.initializeElements();
        this.loadSavedApiKey();
        this.setupEventListeners();
        this.populateCharacterSelects();
    }
    
    initializeElements() {
        // API Setup Elements
        this.apiKeyInput = document.getElementById('apiKey');
        this.validateApiBtn = document.getElementById('validateApi');
        this.apiStatus = document.getElementById('apiStatus');
        this.apiSetup = document.getElementById('apiSetup');
        this.mainApp = document.getElementById('mainApp');
        
        // Configuration Elements
        this.topicInput = document.getElementById('topic');
        this.askerSelect = document.getElementById('askerSelect');
        this.answererSelect = document.getElementById('answererSelect');
        this.askerCustom = document.getElementById('askerCustom');
        this.answererCustom = document.getElementById('answererCustom');
        this.askerNameInput = document.getElementById('askerName');
        this.askerPromptInput = document.getElementById('askerPrompt');
        this.answererNameInput = document.getElementById('answererName');
        this.answererPromptInput = document.getElementById('answererPrompt');
        
        // Action Buttons
        this.startChatBtn = document.getElementById('startChat');
        this.swapCharactersBtn = document.getElementById('swapCharacters');
        this.continueChatBtn = document.getElementById('continueChat');
        this.newChatBtn = document.getElementById('newChat');
        this.saveChatBtn = document.getElementById('saveChat');
        this.clearChatBtn = document.getElementById('clearChat');
        
        // Chat Elements
        this.chatSection = document.getElementById('chatSection');
        this.chatMessages = document.getElementById('chatMessages');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.loading = document.getElementById('loading');
        
        // Save Dialog Elements
        this.saveDialog = document.getElementById('saveDialog');
        this.saveTxtBtn = document.getElementById('saveTxt');
        this.saveJsonBtn = document.getElementById('saveJson');
        this.closeSaveDialogBtn = document.getElementById('closeSaveDialog');
    }
    
    loadSavedApiKey() {
        const savedApiKey = localStorage.getItem('gemini_api_key');
        if (savedApiKey) {
            this.apiKeyInput.value = savedApiKey;
            this.validateApiKey();
        }
    }
    
    setupEventListeners() {
        // API Setup
        this.validateApiBtn.addEventListener('click', () => this.validateApiKey());
        this.apiKeyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.validateApiKey();
        });
        
        // Character Selection
        this.askerSelect.addEventListener('change', () => this.handleCharacterSelect('asker'));
        this.answererSelect.addEventListener('change', () => this.handleCharacterSelect('answerer'));
        
        // Action Buttons
        this.startChatBtn.addEventListener('click', () => this.startChat());
        this.swapCharactersBtn.addEventListener('click', () => this.swapCharacters());
        this.continueChatBtn.addEventListener('click', () => this.continueChat());
        this.newChatBtn.addEventListener('click', () => this.newChat());
        this.saveChatBtn.addEventListener('click', () => this.showSaveDialog());
        this.clearChatBtn.addEventListener('click', () => this.clearChat());
        
        // Save Dialog
        this.saveTxtBtn.addEventListener('click', () => this.saveChat('txt'));
        this.saveJsonBtn.addEventListener('click', () => this.saveChat('json'));
        this.closeSaveDialogBtn.addEventListener('click', () => this.hideSaveDialog());
        
        // Close dialog on background click
        this.saveDialog.addEventListener('click', (e) => {
            if (e.target === this.saveDialog) this.hideSaveDialog();
        });
    }
    
    populateCharacterSelects() {
        const askerOptions = '<option value="">בחר דמות שואלת...</option>' +
            Object.entries(CHARACTERS).map(([key, char]) => 
                `<option value="${key}">${char.avatar} ${char.name}</option>`
            ).join('');
            
        const answererOptions = '<option value="">בחר דמות עונה...</option>' +
            Object.entries(CHARACTERS).map(([key, char]) => 
                `<option value="${key}">${char.avatar} ${char.name}</option>`
            ).join('');
            
        this.askerSelect.innerHTML = askerOptions;
        this.answererSelect.innerHTML = answererOptions;
    }
    
    async validateApiKey() {
        const apiKey = this.apiKeyInput.value.trim();
        if (!apiKey) {
            this.showApiStatus('נא הזן מפתח API', 'error');
            return;
        }
        
        this.validateApiBtn.disabled = true;
        this.validateApiBtn.textContent = 'בודק...';
        
        const maxRetries = 3;
        let retryCount = 0;
        
        while (retryCount <= maxRetries) {
            try {
                // Test query to validate API key
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: 'היי, זה בדיקה של מפתח ה-API. אנא השב בקצרה שהמפתח עובד.'
                            }]
                        }]
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.candidates && data.candidates[0]) {
                        this.apiKey = apiKey;
                        this.isApiValid = true;
                        localStorage.setItem('gemini_api_key', apiKey);
                        this.showApiStatus('מפתח API תקין! ✅', 'success');
                        setTimeout(() => {
                            this.apiSetup.style.display = 'none';
                            this.mainApp.style.display = 'block';
                        }, 1500);
                        break; // Success, exit retry loop
                    } else {
                        throw new Error('תגובה לא תקינה מהשרת');
                    }
                } else {
                    const errorData = await response.json();
                    const errorMessage = errorData.error?.message || 'מפתח API לא תקין';
                    
                    // Check if it's a retryable error (5xx status or overloaded message)
                    if ((response.status >= 500 || errorMessage.toLowerCase().includes('overloaded')) && retryCount < maxRetries) {
                        retryCount++;
                        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 2s, 4s, 8s
                        console.log(`API overloaded during validation, retrying in ${delay/1000} seconds... (attempt ${retryCount}/${maxRetries})`);
                        this.validateApiBtn.textContent = `בודק... (ניסיון ${retryCount}/${maxRetries})`;
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                    
                    throw new Error(errorMessage);
                }
                
            } catch (error) {
                // If it's a network error or fetch error, retry
                if (retryCount < maxRetries && (error.name === 'TypeError' || error.message.includes('fetch'))) {
                    retryCount++;
                    const delay = Math.pow(2, retryCount) * 1000;
                    console.log(`Network error during validation, retrying in ${delay/1000} seconds... (attempt ${retryCount}/${maxRetries})`);
                    this.validateApiBtn.textContent = `בודק... (ניסיון ${retryCount}/${maxRetries})`;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                
                console.error('API Validation Error:', error);
                this.showApiStatus(`שגיאה: ${error.message}`, 'error');
                this.isApiValid = false;
                break; // Non-retryable error, exit loop
            }
        }
        
        this.validateApiBtn.disabled = false;
        this.validateApiBtn.textContent = 'בדוק מפתח';
    }
    
    showApiStatus(message, type) {
        this.apiStatus.textContent = message;
        this.apiStatus.className = `status-message ${type}`;
    }
    
    handleCharacterSelect(type) {
        const select = type === 'asker' ? this.askerSelect : this.answererSelect;
        const customDiv = type === 'asker' ? this.askerCustom : this.answererCustom;
        
        if (select.value === 'custom') {
            customDiv.style.display = 'block';
        } else {
            customDiv.style.display = 'none';
        }
    }
    
    getCharacterData(type) {
        const select = type === 'asker' ? this.askerSelect : this.answererSelect;
        const nameInput = type === 'asker' ? this.askerNameInput : this.answererNameInput;
        const promptInput = type === 'asker' ? this.askerPromptInput : this.answererPromptInput;
        
        if (select.value === 'custom') {
            return {
                key: 'custom',
                name: nameInput.value.trim() || 'דמות מותאמת',
                avatar: '⭐',
                color: '#6366f1',
                prompt: promptInput.value.trim() || 'אתה דמות מותאמת אישית.'
            };
        } else if (select.value && CHARACTERS[select.value]) {
            return {
                key: select.value,
                ...CHARACTERS[select.value]
            };
        }
        return null;
    }
    
    validateConfiguration() {
        if (!this.isApiValid) {
            alert('נא ודא שמפתח ה-API תקין');
            return false;
        }
        
        const topic = this.topicInput.value.trim();
        if (!topic) {
            alert('נא הזן נושא לשיחה');
            return false;
        }
        
        const asker = this.getCharacterData('asker');
        const answerer = this.getCharacterData('answerer');
        
        if (!asker || !answerer) {
            alert('נא בחר שתי דמויות');
            return false;
        }
        
        if (asker.key === 'custom') {
            if (!this.askerNameInput.value.trim()) {
                alert('נא הזן שם לדמות השואלת');
                return false;
            }
            if (!this.askerPromptInput.value.trim()) {
                alert('נא הזן תיאור לדמות השואלת');
                return false;
            }
        }
        
        if (answerer.key === 'custom') {
            if (!this.answererNameInput.value.trim()) {
                alert('נא הזן שם לדמות העונה');
                return false;
            }
            if (!this.answererPromptInput.value.trim()) {
                alert('נא הזן תיאור לדמות העונה');
                return false;
            }
        }
        
        this.currentTopic = topic;
        this.askerCharacter = asker;
        this.answererCharacter = answerer;
        
        return true;
    }
    
    startChat() {
        if (!this.validateConfiguration()) return;
        
        this.currentRound = 0;
        this.totalRounds = 5;
        this.chatHistory = [];
        this.clearChatDisplay();
        this.chatSection.style.display = 'block';
        this.updateProgress();
        
        this.runChatRound();
    }
    
    continueChat() {
        this.totalRounds += 5;
        this.runChatRound();
    }
    
    async runChatRound() {
        if (this.currentRound >= this.totalRounds) {
            this.continueChatBtn.style.display = 'inline-block';
            return;
        }
        
        this.currentRound++;
        this.updateProgress();
        this.continueChatBtn.style.display = 'none';
        
        try {
            // Step 1: Generate question
            this.showLoading(true);
            const question = await this.generateQuestion();
            this.addMessageToChat('asker', question);
            
            // Step 2: Generate answer
            const answer = await this.generateAnswer(question);
            this.addMessageToChat('answerer', answer);
            
            this.showLoading(false);
            
            // Continue to next round
            setTimeout(() => {
                this.runChatRound();
            }, 1500);
            
        } catch (error) {
            console.error('Chat round error:', error);
            this.showLoading(false);
            alert(`שגיאה בסבב השיחה: ${error.message}`);
        }
    }
    
    async generateQuestion() {
        const contextPrompt = this.chatHistory.length > 0 ? 
            `\n\nהיסטוריה קודמת:\n${this.chatHistory.map(msg => `${msg.character}: ${msg.text}`).join('\n')}` : '';
            
        const prompt = `${this.askerCharacter.prompt}
        
אתה מוזמן לשיחה על הנושא: "${this.currentTopic}".

הנחיות:
- שאל שאלה אחת קצרה ומעניינת (5-20 מילים בלבד)
- השאלה צריכה להיות רלוונטית לנושא
- אל תכתוב הקדמות או הסברים
- רק את השאלה בלבד
${contextPrompt}

שאלה:`;

        return await this.callGeminiAPI(prompt);
    }
    
    async generateAnswer(question) {
        const contextPrompt = this.chatHistory.length > 0 ? 
            `\n\nהיסטוריה קודמת:\n${this.chatHistory.map(msg => `${msg.character}: ${msg.text}`).join('\n')}` : '';
            
        const prompt = `${this.answererCharacter.prompt}
        
אתה מוזמן לשיחה על הנושא: "${this.currentTopic}".

השאלה שנשאלה: "${question}"

הנחיות:
- ענה על השאלה בסגנון הדמות שלך
- התשובה צריכה להיות באורך של 20-100 מילים
- היה טבעי ואמיתי לדמות
- אל תחזור על השאלה בתשובה
${contextPrompt}

תשובה:`;

        return await this.callGeminiAPI(prompt);
    }
    
    async callGeminiAPI(prompt) {
        const maxRetries = 3;
        let retryCount = 0;
        
        while (retryCount <= maxRetries) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.8,
                            maxOutputTokens: 200,
                        }
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = errorData.error?.message || 'שגיאה בקריאה ל-API';
                    
                    // Check if it's a retryable error (5xx status or overloaded message)
                    if ((response.status >= 500 || errorMessage.toLowerCase().includes('overloaded')) && retryCount < maxRetries) {
                        retryCount++;
                        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 2s, 4s, 8s
                        console.log(`API overloaded, retrying in ${delay/1000} seconds... (attempt ${retryCount}/${maxRetries})`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                    
                    throw new Error(errorMessage);
                }
                
                const data = await response.json();
                if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                    throw new Error('תגובה לא תקינה מהשרת');
                }
                
                return data.candidates[0].content.parts[0].text.trim();
                
            } catch (error) {
                // If it's a network error or fetch error, retry
                if (retryCount < maxRetries && (error.name === 'TypeError' || error.message.includes('fetch'))) {
                    retryCount++;
                    const delay = Math.pow(2, retryCount) * 1000;
                    console.log(`Network error, retrying in ${delay/1000} seconds... (attempt ${retryCount}/${maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                
                throw error;
            }
        }
    }
    
    addMessageToChat(type, text) {
        const character = type === 'asker' ? this.askerCharacter : this.answererCharacter;
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="avatar" style="background-color: ${character.color};">
                    ${character.avatar}
                </div>
                <div class="message-bubble">
                    <div class="character-name">${character.name}</div>
                    <div class="message-text">${text}</div>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        // Add to history
        this.chatHistory.push({
            character: character.name,
            text: text,
            type: type,
            timestamp: new Date()
        });
    }
    
    updateProgress() {
        const progress = (this.currentRound / this.totalRounds) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.progressText.textContent = `${this.currentRound} מתוך ${this.totalRounds}`;
        
        if (this.currentRound >= this.totalRounds) {
            this.continueChatBtn.style.display = 'inline-block';
        }
    }
    
    showLoading(show) {
        this.loading.style.display = show ? 'block' : 'none';
    }
    
    swapCharacters() {
        const askerValue = this.askerSelect.value;
        const answererValue = this.answererSelect.value;
        
        this.askerSelect.value = answererValue;
        this.answererSelect.value = askerValue;
        
        this.handleCharacterSelect('asker');
        this.handleCharacterSelect('answerer');
        
        // Swap custom data if needed
        if (askerValue === 'custom' || answererValue === 'custom') {
            const tempName = this.askerNameInput.value;
            const tempPrompt = this.askerPromptInput.value;
            
            this.askerNameInput.value = this.answererNameInput.value;
            this.askerPromptInput.value = this.answererPromptInput.value;
            
            this.answererNameInput.value = tempName;
            this.answererPromptInput.value = tempPrompt;
        }
    }
    
    newChat() {
        if (confirm('האם אתה בטוח שברצונך להתחיל שיחה חדשה? השיחה הנוכחית תאבד.')) {
            this.chatSection.style.display = 'none';
            this.clearChatDisplay();
            this.currentRound = 0;
            this.totalRounds = 5;
            this.chatHistory = [];
        }
    }
    
    clearChat() {
        if (confirm('האם אתה בטוח שברצונך לנקות את השיחה? הפעולה לא ניתנת לביטול.')) {
            this.clearChatDisplay();
            this.currentRound = 0;
            this.totalRounds = 5;
            this.chatHistory = [];
            this.updateProgress();
        }
    }
    
    clearChatDisplay() {
        this.chatMessages.innerHTML = '';
    }
    
    showSaveDialog() {
        if (this.chatHistory.length === 0) {
            alert('אין שיחה לשמירה');
            return;
        }
        this.saveDialog.style.display = 'flex';
    }
    
    hideSaveDialog() {
        this.saveDialog.style.display = 'none';
    }
    
    saveChat(format) {
        if (this.chatHistory.length === 0) {
            alert('אין שיחה לשמירה');
            return;
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `gemini-chat-${timestamp}`;
        
        let content = '';
        let mimeType = '';
        
        if (format === 'txt') {
            content = this.generateTxtContent();
            mimeType = 'text/plain;charset=utf-8';
        } else if (format === 'json') {
            content = this.generateJsonContent();
            mimeType = 'application/json;charset=utf-8';
        }
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.hideSaveDialog();
    }
    
    generateTxtContent() {
        let content = `שיחה בין דמויות - ${new Date().toLocaleString('he-IL')}\n`;
        content += `נושא: ${this.currentTopic}\n`;
        content += `דמות שואלת: ${this.askerCharacter.name}\n`;
        content += `דמות עונה: ${this.answererCharacter.name}\n`;
        content += `\n${'='.repeat(50)}\n\n`;
        
        this.chatHistory.forEach((message, index) => {
            content += `${message.character}: ${message.text}\n\n`;
        });
        
        return content;
    }
    
    generateJsonContent() {
        const chatData = {
            timestamp: new Date().toISOString(),
            topic: this.currentTopic,
            askerCharacter: this.askerCharacter,
            answererCharacter: this.answererCharacter,
            totalRounds: this.currentRound,
            messages: this.chatHistory
        };
        
        return JSON.stringify(chatData, null, 2);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GeminiChatApp();
});
