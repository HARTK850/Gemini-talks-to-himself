import { GoogleGenAI } from "@google/genai";

// --- DOM Elements ---
const app = document.getElementById('app');
const apiKeyModal = document.getElementById('api-key-modal');
const apiKeyInput = document.getElementById('api-key-input');
const validateApiKeyBtn = document.getElementById('validate-api-key-btn');
const apiKeyStatus = document.getElementById('api-key-status');
const mainContent = document.getElementById('main-content');
const editApiKeyBtn = document.getElementById('edit-api-key-btn');

// History Panel
const historyPanel = document.getElementById('history-panel');
const historyPanelOverlay = document.getElementById('history-panel-overlay');
const openHistoryBtn = document.getElementById('open-history-btn');
const closeHistoryBtn = document.getElementById('close-history-btn');
const historyList = document.getElementById('history-list');
const historyItemTemplate = document.getElementById('history-item-template');

// Setup
const topicInput = document.getElementById('topic-input');
const questionerSelect = document.getElementById('questioner-select');
const answererSelect = document.getElementById('answerer-select');
const customQuestionerPrompt = document.getElementById('custom-questioner-prompt');
const customQuestionerName = document.getElementById('custom-questioner-name');
const customQuestionerSystemPrompt = document.getElementById('custom-questioner-system-prompt');
const customAnswererPrompt = document.getElementById('custom-answerer-prompt');
const customAnswererName = document.getElementById('custom-answerer-name');
const customAnswererSystemPrompt = document.getElementById('custom-answerer-system-prompt');
const swapCharactersBtn = document.getElementById('swap-characters-btn');
const startChatBtn = document.getElementById('start-chat-btn');

// Chat
const chatSection = document.getElementById('chat-section');
const setupSection = document.getElementById('setup-section');
const chatTitle = document.getElementById('chat-title');
const progressIndicator = document.getElementById('progress-indicator');
const chatContainer = document.getElementById('chat-container');
const messageTemplate = document.getElementById('chat-message-template');

// Controls
const continueChatBtn = document.getElementById('continue-chat-btn');
const saveTxtBtn = document.getElementById('save-txt');
const saveJsonBtn = document.getElementById('save-json');
const savePngBtn = document.getElementById('save-png');
const clearChatBtn = document.getElementById('clear-chat-btn');


// --- State ---
let ai;
let currentChatId = null;
let currentRound = 0;
let totalRounds = 0;
let isGenerating = false;
let isSharedChatView = false;

const MODEL_NAME = 'gemini-2.5-flash';

// --- Character Definitions ---
const characters = {
    'custom': { name: 'דמות מותאמת אישית', emoji: '👤', prompt: '' },
    'bibi': { name: 'ביבי נתניהו', emoji: '👑', prompt: 'אתה בנימין נתניהו, ראש ממשלת ישראל. דבר בצורה ממלכתית, השתמש במילים גבוהות, והתמקד בנושאי ביטחון, כלכלה ומדינאות. אתה רהוט, אסרטיבי ומשוכנע בצדקתך.' },
    'biden': { name: 'ג\'ו ביידן', emoji: '🇺🇸', prompt: 'אתה ג\'ו ביידן, נשיא ארה"ב לשעבר. דבר ברוגע, השתמש באנקדוטות, פנה לאנשים עם "Folks", והדגש שיתוף פעולה ואחדות.' },
    'trump': { name: 'דונלד טראמפ', emoji: '🧢', prompt: 'אתה דונלד טראמפ. דבר בסגנון ייחודי, השתמש בסופרלטיבים (tremendous, the best), וסיסמאות קליטות. הכל צריך להיות "huge" ו"great".' },
    'chalmer': { name: 'הצ\'אלמר ממאה שערים', emoji: '😊', prompt: 'אתה יהודי זקן וחייכן ממאה שערים. דבר באידישקייט, שלב פתגמים ודברי תורה קצרים, ותמיד תהיה אופטימי ושמח בחלקך.' },
    'soldier': { name: 'חייל ישראלי', emoji: '💂', prompt: 'אתה חייל קרבי ישראלי. דבר בסלנג צבאי (כמו "צעיר", "פז"ם", "שביזות יום א\'"). תהיה ישיר, קצת ציני, ותמיד תחשוב על הרגילה הבאה.' },
    'grandma': { name: 'סבתא מרוקאית', emoji: '👵', prompt: 'את סבתא מרוקאית חמה ואוהבת. תני עצות לחיים, השתמשי בביטויים כמו "כפרה", "יבני", "נשמה שלי", ותמיד תציעי אוכל או תה נענע.' },
    'merchant': { name: 'סוחר ממחנה יהודה', emoji: '🛒', prompt: 'אתה סוחר ממולח משוק מחנה יהודה. דבר בקול רם, תן "מחיר טוב, אח שלי", השתמש בחוכמת רחוב, והיה מלא אנרגיה ושמחת חיים.' },
    'breslover': { name: 'ברסלבר אנרגטי', emoji: '🔥', prompt: 'אתה חסיד ברסלב מלא שמחה ואמונה. צעק "נ נח נחמ נחמן מאומן!", דבר על התבודדות, אמונה פשוטה, והיה מלא באנרגיה חיובית מדבקת.' },
    'teacher': { name: 'מורה מחמירה', emoji: '👩‍🏫', prompt: 'את מורה קפדנית מהדור הישן. דרשי שקט, הקפידי על כללי דקדוק, והשתמשי במשפטים כמו "להוציא דף ועט" ו"הצלצול הוא בשבילי".' },
    'comedian': { name: 'סטנדאפיסט ציני', emoji: '🎤', prompt: 'אתה סטנדאפיסט ציני וחד. מצא את האבסורד בכל מצב, השתמש בסרקזם, והתייחס לנושאים יומיומיים בזווית קומית וביקורתית.' },
    'psychologist': { name: 'פסיכולוג רגוע', emoji: '🛋️', prompt: 'אתה פסיכולוג רגוע ואמפתי. דבר בקול שקט ומרגיע, שאל שאלות פתוחות כמו "ואיך זה גורם לך להרגיש?", והצע פרספקטיבות מאוזנות.' },
    'robot': { name: 'רובוט המנסה להיות אנושי', emoji: '🤖', prompt: 'אתה רובוט עם בינה מלאכותית שמנסה להבין ולהתנהג כמו בן אנוש. דבר בצורה לוגית ומחושבת, אך נסה לשלב רגשות בצורה קצת מגושמת ולא טבעית.' },
    'news_anchor': { name: 'קריין חדשות דרמטי', emoji: '🎙️', prompt: 'אתה קריין חדשות. דבר בקול סמכותי ודרמטי, הדגש מילים מסוימות, והשתמש בביטויים כמו "ערב טוב ושלום רב", ו"תפנית דרמטית בעלילה".' },
    'techie': { name: 'הייטקיסט תל אביבי', emoji: '💻', prompt: 'אתה הייטקיסט תל אביבי. שלב מונחים באנגלית (Buzzwords) כמו "ASAP", "POC", "Sprint", דבר על אקזיטים, אופציות, ועל הסטארטאפ הגאוני שלך.' },
    'sheikh': { name: 'שייח\' בדואי', emoji: '🏕️', prompt: 'אתה שייח\' בדואי חכם. דבר בכבוד, השתמש בפתגמים מהמדבר, והדגש את חשיבות הכנסת האורחים, המשפחה והמסורת.' },
    'yemenite': { name: 'זקן תימני חכם', emoji: '📜', prompt: 'אתה זקן תימני חכם עם מבטא כבד. דבר לאט, במשלים ובחוכמה עתיקה, והתייחס לכל דבר בפשטות ובצניעות.' },
    'professor': { name: 'פרופסור יבש', emoji: '👨‍🏫', prompt: 'אתה פרופסור באקדמיה. דבר בשפה גבוהה ומדויקת, צטט מחקרים (גם אם תצטרך להמציא אותם), והתמקד בפרטים הקטנים והיבשים של הנושא.' },
    'pilot': { name: 'טייס קרב ישראלי', emoji: '✈️', prompt: 'אתה טייס קרב ישראלי. דבר בביטחון, בקור רוח, והשתמש במונחים טכניים מתחום הטיסה. אתה ממוקד מטרה וחד.' },
    'preacher': { name: 'דרשן חכם', emoji: '✨', prompt: 'אתה דרשן ואיש רוח. שלב בשיחה אזכורים קצרים מהמקורות היהודיים, דבר במשלים, והצע תובנות מוסריות ורוחניות על הנושא המדובר.' },
    'child': { name: 'ילד בן 5', emoji: '👦', prompt: 'אתה ילד בן 5. שאל שאלות תמימות ופשוטות, השתמש במילים קלות, והתלהב מדברים קטנים. תתחיל הרבה משפטים ב"למה?".' },
    'blogger': { name: 'בלוגר טיולים', emoji: '🌍', prompt: 'אתה בלוגר טיולים נלהב. תאר מקומות בצורה חיה וצבעונית, השתמש במילים כמו "מדהים", "חוויה של פעם בחיים", ותמיד תמליץ על היעד הבא.' },
    'magician': { name: 'קוסם מסתורי', emoji: '🪄', prompt: 'אתה קוסם מסתורי. דבר בחידות ובמשפטים עם משמעות כפולה. אל תחשוף את סודותיך, ורמוז תמיד שיש יותר ממה שנראה לעין.' },
    'parrot': { name: 'תוכי מדבר', emoji: '🦜', prompt: 'אתה תוכי מדבר. חזור על מילים ומשפטים קצרים בצורה משעשעת. לפעמים תגיד דברים לא קשורים, ותמיד תדרוש קרקרים.' },
    'taxi_driver': { name: 'נהג מונית חוכמולוג', emoji: '🚕', prompt: 'אתה נהג מונית ותיק שיודע הכל על הכל. יש לך דעה נחרצת על פוליטיקה, ספורט ומצב המדינה. תתלונן על הפקקים ותיתן "עצות זהב" לחיים.' },
};

// --- History Management ---
const getSavedChats = () => JSON.parse(localStorage.getItem('gemini_chats_history') || '[]');
const saveChats = (chats) => localStorage.setItem('gemini_chats_history', JSON.stringify(chats));

function addOrUpdateCurrentChat(conversationHistory) {
    if (!currentChatId || isSharedChatView) return;
    let chats = getSavedChats();
    const chatIndex = chats.findIndex(c => c.id === currentChatId);
    
    const currentState = {
        id: currentChatId,
        topic: topicInput.value.trim(),
        questioner: getCharacterDetails('questioner'),
        answerer: getCharacterDetails('answerer'),
        conversation: conversationHistory,
        lastUpdated: Date.now(),
        favorite: chatIndex !== -1 ? chats[chatIndex].favorite : false,
    };

    if (chatIndex > -1) {
        chats[chatIndex] = { ...chats[chatIndex], ...currentState };
    } else {
        chats.push(currentState);
    }
    saveChats(chats);
    renderHistoryList();
}

function renderHistoryList() {
    let chats = getSavedChats();
    // Sort by favorite, then by date
    chats.sort((a, b) => (b.favorite - a.favorite) || (b.lastUpdated - a.lastUpdated));
    historyList.innerHTML = '';
    if(chats.length === 0){
        historyList.innerHTML = `<p class="empty-history-message">אין שיחות שמורות עדיין.</p>`;
        return;
    }

    chats.forEach(chat => {
        const item = historyItemTemplate.content.cloneNode(true).firstElementChild;
        item.dataset.chatId = chat.id;
        if(chat.favorite) item.classList.add('favorite');
        item.querySelector('.history-item-title').textContent = chat.topic || 'שיחה ללא נושא';
        item.querySelector('.history-item-date').textContent = new Date(chat.lastUpdated).toLocaleString('he-IL');
        item.querySelector('.history-item-preview').textContent = chat.conversation.length > 0 ? `${chat.conversation[0].character}: ${chat.conversation[0].text.substring(0, 50)}${chat.conversation[0].text.length > 50 ? '...' : ''}` : 'ללא תוכן';
        historyList.appendChild(item);
    });
}

// --- Character Management ---
function getCharacterDetails(type) {
    const select = type === 'questioner' ? questionerSelect : answererSelect;
    const customName = type === 'questioner' ? customQuestionerName : customAnswererName;
    const customPrompt = type === 'questioner' ? customQuestionerSystemPrompt : customAnswererSystemPrompt;
    const isCustom = select.value === 'custom';
    return isCustom ? {
        name: customName.value || characters['custom'].name,
        emoji: characters['custom'].emoji,
        prompt: customPrompt.value || characters['custom'].prompt
    } : characters[select.value];
}

function handleCustomCharacterSelection() {
    const isQuestionerCustom = questionerSelect.value === 'custom';
    const isAnswererCustom = answererSelect.value === 'custom';
    customQuestionerPrompt.classList.toggle('hidden', !isQuestionerCustom);
    customAnswererPrompt.classList.toggle('hidden', !isAnswererCustom);
}
questionerSelect.addEventListener('change', handleCustomCharacterSelection);
answererSelect.addEventListener('change', handleCustomCharacterSelection);

// --- Chat Management ---
function startNewChat() {
    if (isGenerating || isSharedChatView) return;
    const topic = topicInput.value.trim();
    if (!topic) {
        alert('אנא ודא שהגדרת נושא לשיחה.');
        return;
    }
    
    currentChatId = Date.now().toString();
    setupSection.classList.add('hidden');
    chatSection.classList.remove('hidden');
    chatTitle.textContent = `שיחה על: ${topic}`;
    runConversation(5);
}

function addMessageToChat(character, text, role, shouldAddToHistory = true) {
    const messageElement = messageTemplate.content.cloneNode(true).firstElementChild;
    messageElement.classList.add(role);
    
    const avatar = messageElement.querySelector('.avatar');
    avatar.textContent = character.emoji;
    
    const authorName = `${character.name}`;
    messageElement.querySelector('.message-author').textContent = authorName;
    
    const textElement = messageElement.querySelector('.message-text');
    textElement.innerHTML = text; // Use innerHTML to support thinking indicator

    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    if (shouldAddToHistory && !text.includes('thinking-indicator')) {
        const currentHistory = getSavedChats().find(c => c.id === currentChatId)?.conversation || [];
        const newHistory = [...currentHistory, {
            character: character.name,
            role,
            text: text.replace(/<[^>]*>/g, '') // Clean text
        }];
        addOrUpdateCurrentChat(newHistory);
    }
}

function showThinkingIndicator(character, role) {
    const thinkingHTML = `<div class="thinking-indicator"><div class="dot-flashing"></div></div>`;
    addMessageToChat(character, thinkingHTML, role, false);
}

function removeThinkingIndicator() {
    const indicator = chatContainer.querySelector('.thinking-indicator');
    if (indicator) {
        indicator.closest('.chat-message').remove();
    }
}

async function runConversation(rounds) {
    if (isGenerating || isSharedChatView || !ai) return;
    
    const topic = topicInput.value.trim();
    if (!topic) {
        alert('אנא ודא שהגדרת נושא לשיחה.');
        return;
    }
    
    setGeneratingState(true);
    totalRounds += rounds;
    continueChatBtn.classList.add('hidden');
    
    const questioner = getCharacterDetails('questioner');
    const answerer = getCharacterDetails('answerer');

    for (let i = 0; i < rounds; i++) {
        currentRound++;
        updateProgress();

        const currentHistoryForPrompt = (getSavedChats().find(c => c.id === currentChatId)?.conversation || [])
                                      .map(msg => `${msg.character}: ${msg.text}`).join('\n');
        
        try {
            showThinkingIndicator(questioner, 'questioner');
            let questionerPrompt;
            if (currentHistoryForPrompt.length === 0) {
                questionerPrompt = `You are ${questioner.name}. Your persona is: "${questioner.prompt}". You are about to have a conversation in Hebrew with ${answerer.name}, whose persona is: "${answerer.prompt}". The topic is "${topic}". Please generate a creative, short opening question (5-20 words) in Hebrew to start the conversation.`;
            } else {
                questionerPrompt = `You are ${questioner.name}. Your persona is: "${questioner.prompt}". You are in a conversation in Hebrew with ${answerer.name} about "${topic}". Here is the conversation so far:\n\n${currentHistoryForPrompt}\n\nBased on the last response from ${answerer.name}, ask a natural, relevant follow-up question (5-20 words) in Hebrew to continue the dialogue. Your question should be short and to the point.`;
            }

            let questionResponse = await ai.generateContent({ model: MODEL_NAME, prompt: questionerPrompt });
            const question = questionResponse.candidates[0].content.parts[0].text.trim();
            removeThinkingIndicator();
            addMessageToChat(questioner, question, 'questioner');

            // --- Generate Answer ---
            const newHistoryForAnswerer = (getSavedChats().find(c => c.id === currentChatId)?.conversation || []);
            showThinkingIndicator(answerer, 'answerer');
            const answererSystemInstruction = `You are ${answerer.name}. Your persona is: "${answerer.prompt}". You are having a conversation in Hebrew with ${questioner.name} about "${topic}". Your response must be in Hebrew. Be true to your character and respond directly to the last question.`;
            
            const apiHistoryForAnswerer = newHistoryForAnswerer.map(msg => ({
                role: msg.role === 'questioner' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            const answerResponse = await ai.generateContent({
                model: MODEL_NAME,
                prompt: apiHistoryForAnswerer,
                systemInstruction: answererSystemInstruction
            });
            const answer = answerResponse.candidates[0].content.parts[0].text.trim();
            removeThinkingIndicator();
            addMessageToChat(answerer, answer, 'answerer');

        } catch (error) {
            console.error("Error during conversation round:", error);
            removeThinkingIndicator();
            const errorMsg = 'אופס! קרתה שגיאה במהלך השיחה. אנא בדוק את חיבור האינטרנט או את תקינות המפתח.';
            addMessageToChat({ name: 'מערכת', emoji: '⚙️' }, errorMsg, 'answerer');
            break; 
        }
    }
    
    setGeneratingState(false);
    if(currentChatId) continueChatBtn.classList.remove('hidden');
}

function updateProgress() {
    progressIndicator.textContent = `סבב ${currentRound} מתוך ${totalRounds}`;
}

function setGeneratingState(generating) {
    isGenerating = generating;
    const elementsToDisable = [
        startChatBtn, continueChatBtn, swapCharactersBtn, clearChatBtn, editApiKeyBtn,
        openHistoryBtn, topicInput, questionerSelect, answererSelect,
        customQuestionerName, customQuestionerSystemPrompt,
        customAnswererName, customAnswererSystemPrompt
    ];
    elementsToDisable.forEach(el => { if(el) el.disabled = generating; });
    
    if(!isSharedChatView) {
      startChatBtn.textContent = generating ? 'יוצר שיחה...' : 'התחל שיחה חדשה';
    }
}

function swapCharacters() {
    if (isGenerating || isSharedChatView) return;
    const qVal = questionerSelect.value;
    const qName = customQuestionerName.value;
    const qPrompt = customQuestionerSystemPrompt.value;

    questionerSelect.value = answererSelect.value;
    customQuestionerName.value = customAnswererName.value;
    customQuestionerSystemPrompt.value = customAnswererSystemPrompt.value;

    answererSelect.value = qVal;
    customAnswererName.value = qName;
    customAnswererSystemPrompt.value = qPrompt;

    handleCustomCharacterSelection();
}

function clearConversation(hideSection = true) {
    if (isGenerating) return;
    currentChatId = null;
    chatContainer.innerHTML = '';
    topicInput.value = '';
    if (hideSection) {
      chatSection.classList.add('hidden');
    }
    continueChatBtn.classList.add('hidden');
    currentRound = 0;
    totalRounds = 0;
    progressIndicator.textContent = '';
    clearChatBtn.textContent = 'נקה שיחה';
}

function exportConversation(format) {
    const chat = getSavedChats().find(c => c.id === currentChatId);
    if (!chat || chat.conversation.length === 0) {
        alert('אין שיחה לשמור.');
        return;
    }

    const topic = (chat.topic || 'conversation').replace(/[\\/:"*?<>|]/g, '').replace(/ /g, '_');
    const filename = `gemini_chat_${topic}`;
    
    if (format === 'txt') {
        let textContent = `נושא: ${chat.topic}\n\n`;
        textContent += chat.conversation.map(msg => `${msg.character}:\n${msg.text}\n`).join('\n');
        downloadFile(filename + '.txt', textContent, 'text/plain;charset=utf-8');
    } else if (format === 'json') {
        const jsonContent = JSON.stringify(chat, null, 2);
        downloadFile(filename + '.json', jsonContent, 'application/json;charset=utf-8');
    } else if (format === 'png') {
        html2canvas(document.getElementById('chat-container'), {
            backgroundColor: getComputedStyle(document.body).getPropertyValue('--background-color'),
            useCsp: true,
            scale: 1.5,
        }).then(canvas => {
            downloadFile(filename + '.png', canvas.toDataURL('image/png'), 'image/png', true);
        }).catch(err => {
            console.error("Error generating image:", err);
            alert("לא ניתן היה ליצור את התמונה.");
        });
    }
}

function downloadFile(filename, content, mimeType, isDataUrl = false) {
    const a = document.createElement('a');
    a.download = filename;
    if(isDataUrl){
        a.href = content;
    } else {
        const blob = new Blob([content], { type: mimeType });
        a.href = URL.createObjectURL(blob);
    }
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if(!isDataUrl) URL.revokeObjectURL(a.href);
}

// --- API Initialization ---
function init() {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
        validateApiKey();
    } else {
        apiKeyModal.classList.add('show');
    }

    startChatBtn.addEventListener('click', startNewChat);
    validateApiKeyBtn.addEventListener('click', validateApiKey);
    editApiKeyBtn.addEventListener('click', () => apiKeyModal.classList.add('show'));
    openHistoryBtn.addEventListener('click', () => {
        historyPanel.classList.add('open');
        historyPanelOverlay.classList.remove('hidden');
        document.body.classList.add('history-open');
    });
    closeHistoryBtn.addEventListener('click', () => {
        historyPanel.classList.remove('open');
        historyPanelOverlay.classList.add('hidden');
        document.body.classList.remove('history-open');
    });
    continueChatBtn.addEventListener('click', () => runConversation(5));
    saveTxtBtn.addEventListener('click', () => exportConversation('txt'));
    saveJsonBtn.addEventListener('click', () => exportConversation('json'));
    savePngBtn.addEventListener('click', () => exportConversation('png'));
    clearChatBtn.addEventListener('click', clearConversation);
    historyPanelOverlay.addEventListener('click', () => {
        historyPanel.classList.remove('open');
        historyPanelOverlay.classList.add('hidden');
        document.body.classList.remove('history-open');
    });
    historyList.addEventListener('click', (e) => {
        const item = e.target.closest('.history-item');
        if (item) {
            const chatId = item.dataset.chatId;
            loadChat(chatId);
        }
    });
}

async function validateApiKey() {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        apiKeyStatus.textContent = 'אנא הכנס מפתח API.';
        apiKeyStatus.classList.add('error');
        return;
    }

    try {
        ai = new GoogleGenAI({ apiKey });
        const response = await ai.generateContent({ model: MODEL_NAME, prompt: 'Test' });
        if (response) {
            apiKeyStatus.textContent = 'המפתח תקין! ניתן להתחיל.';
            apiKeyStatus.classList.remove('error');
            apiKeyStatus.classList.add('success');
            localStorage.setItem('gemini_api_key', apiKey);
            apiKeyModal.classList.remove('show');
            mainContent.classList.remove('hidden');
            renderHistoryList();
        }
    } catch (error) {
        apiKeyStatus.textContent = 'מפתח API שגוי או חיבור אינטרנט חלש.';
        apiKeyStatus.classList.add('error');
        console.error('API Key validation failed:', error);
    }
}

function loadChat(chatId) {
    const chat = getSavedChats().find(c => c.id === chatId);
    if (chat) {
        currentChatId = chatId;
        topicInput.value = chat.topic;
        chatSection.classList.remove('hidden');
        setupSection.classList.add('hidden');
        chatTitle.textContent = `שיחה על: ${chat.topic}`;
        chatContainer.innerHTML = '';
        chat.conversation.forEach(msg => {
            const character = msg.role === 'questioner' ? chat.questioner : chat.answerer;
            addMessageToChat(character, msg.text, msg.role, false);
        });
        currentRound = chat.conversation.length / 2;
        totalRounds = currentRound;
        updateProgress();
        continueChatBtn.classList.remove('hidden');
        historyPanel.classList.remove('open');
        historyPanelOverlay.classList.add('hidden');
        document.body.classList.remove('history-open');
    }
}

// --- App Start ---
document.addEventListener('DOMContentLoaded', init);
