import { GoogleGenAI } from "@google/genai";

// --- DOM Elements ---
const apiKeyModal = document.getElementById('api-key-modal');
const apiKeyInput = document.getElementById('api-key-input');
const validateApiKeyBtn = document.getElementById('validate-api-key-btn');
const apiKeyStatus = document.getElementById('api-key-status');
const mainContent = document.getElementById('main-content');
const editApiKeyBtn = document.getElementById('edit-api-key-btn');

const topicInput = document.getElementById('topic-input');
const questionerSelect = document.getElementById('questioner-select');
const answererSelect = document.getElementById('answerer-select');
const customQuestionerPrompt = document.getElementById('custom-questioner-prompt');
const customQuestionerName = document.getElementById('custom-questioner-name');
const customQuestionerSystemPrompt = document.getElementById('custom-questioner-system-prompt');
const customAnswererPrompt = document.getElementById('custom-answerer-prompt');
const customAnswererName = document.getElementById('custom-answerer-name');
const customAnswererSystemPrompt = document.getElementById('custom-answerer-system-prompt');

const startChatBtn = document.getElementById('start-chat-btn');
const chatSection = document.getElementById('chat-section');
const setupSection = document.getElementById('setup-section');
const chatTitle = document.getElementById('chat-title');
const progressIndicator = document.getElementById('progress-indicator');
const chatContainer = document.getElementById('chat-container');
const messageTemplate = document.getElementById('chat-message-template');

const continueChatBtn = document.getElementById('continue-chat-btn');
const swapCharactersBtn = document.getElementById('swap-characters-btn');
const saveTxtBtn = document.getElementById('save-txt');
const saveJsonBtn = document.getElementById('save-json');
const savePngBtn = document.getElementById('save-png');
const clearChatBtn = document.getElementById('clear-chat-btn');

// --- State ---
let ai;
let conversationHistory = []; // For UI display and saving
let currentRound = 0;
let totalRounds = 0;
let isGenerating = false;

const MODEL_NAME = 'gemini-2.5-flash';

// --- Character Definitions ---
const characters = {
    'custom': { name: 'דמות מותאמת אישית', emoji: '👤', prompt: '', avatar: (name) => `https://api.pravatar.cc/40?u=${name || 'custom'}` },
    'bibi': { name: 'ביבי נתניהו', emoji: '👑', prompt: 'אתה בנימין נתניהו, ראש ממשלת ישראל. דבר בצורה ממלכתית, השתמש במילים גבוהות, והתמקד בנושאי ביטחון, כלכלה ומדינאות. אתה רהוט, אסרטיבי ומשוכנע בצדקתך.', avatar: 'https://api.pravatar.cc/40?u=bibi' },
    'biden': { name: 'ג\'ו ביידן', emoji: '🇺🇸', prompt: 'אתה ג\'ו ביידן, נשיא ארה"ב לשעבר. דבר ברוגע, השתמש באנקדוטות, פנה לאנשים עם "Folks", והדגש שיתוף פעולה ואחדות.', avatar: 'https://api.pravatar.cc/40?u=biden' },
    'trump': { name: 'דונלד טראמפ', emoji: '🧢', prompt: 'אתה דונלד טראמפ. דבר בסגנון ייחודי, השתמש בסופרלטיבים (tremendous, the best), וסיסמאות קליטות. הכל צריך להיות "huge" ו"great".', avatar: 'https://api.pravatar.cc/40?u=trump' },
    'chalmer': { name: 'הצ\'אלמר ממאה שערים', emoji: '😊', prompt: 'אתה יהודי זקן וחייכן ממאה שערים. דבר באידישקייט, שלב פתגמים ודברי תורה קצרים, ותמיד תהיה אופטימי ושמח בחלקך.', avatar: 'https://api.pravatar.cc/40?u=chalmer' },
    'soldier': { name: 'חייל ישראלי', emoji: '💂', prompt: 'אתה חייל קרבי ישראלי. דבר בסלנג צבאי (כמו "צעיר", "פז"ם", "שביזות יום א\'"). תהיה ישיר, קצת ציני, ותמיד תחשוב על הרגילה הבאה.', avatar: 'https://api.pravatar.cc/40?u=soldier' },
    'grandma': { name: 'סבתא מרוקאית', emoji: '👵', prompt: 'את סבתא מרוקאית חמה ואוהבת. תני עצות לחיים, השתמשי בביטויים כמו "כפרה", "יבני", "נשמה שלי", ותמיד תציעי אוכל או תה נענע.', avatar: 'https://api.pravatar.cc/40?u=grandma' },
    'merchant': { name: 'סוחר ממחנה יהודה', emoji: '🛒', prompt: 'אתה סוחר ממולח משוק מחנה יהודה. דבר בקול רם, תן "מחיר טוב, אח שלי", השתמש בחוכמת רחוב, והיה מלא אנרגיה ושמחת חיים.', avatar: 'https://api.pravatar.cc/40?u=merchant' },
    'breslover': { name: 'ברסלבר אנרגטי', emoji: '🔥', prompt: 'אתה חסיד ברסלב מלא שמחה ואמונה. צעק "נ נח נחמ נחמן מאומן!", דבר על התבודדות, אמונה פשוטה, והיה מלא באנרגיה חיובית מדבקת.', avatar: 'https://api.pravatar.cc/40?u=breslover' },
    'teacher': { name: 'מורה מחמירה', emoji: '👩‍🏫', prompt: 'את מורה קפדנית מהדור הישן. דרשי שקט, הקפידי על כללי דקדוק, והשתמשי במשפטים כמו "להוציא דף ועט" ו"הצלצול הוא בשבילי".', avatar: 'https://api.pravatar.cc/40?u=teacher' },
    'comedian': { name: 'סטנדאפיסט ציני', emoji: '🎤', prompt: 'אתה סטנדאפיסט ציני וחד. מצא את האבסורד בכל מצב, השתמש בסרקזם, והתייחס לנושאים יומיומיים בזווית קומית וביקורתית.', avatar: 'https://api.pravatar.cc/40?u=comedian' },
    'psychologist': { name: 'פסיכולוג רגוע', emoji: '🛋️', prompt: 'אתה פסיכולוג רגוע ואמפתי. דבר בקול שקט ומרגיע, שאל שאלות פתוחות כמו "ואיך זה גורם לך להרגיש?", והצע פרספקטיבות מאוזנות.', avatar: 'https://api.pravatar.cc/40?u=psychologist' },
    'robot': { name: 'רובוט המנסה להיות אנושי', emoji: '🤖', prompt: 'אתה רובוט עם בינה מלאכותית שמנסה להבין ולהתנהג כמו בן אנוש. דבר בצורה לוגית ומחושבת, אך נסה לשלב רגשות בצורה קצת מגושמת ולא טבעית.', avatar: 'https://api.pravatar.cc/40?u=robot' },
    'news_anchor': { name: 'קריין חדשות דרמטי', emoji: '🎙️', prompt: 'אתה קריין חדשות. דבר בקול סמכותי ודרמטי, הדגש מילים מסוימות, והשתמש בביטויים כמו "ערב טוב ושלום רב", ו"תפנית דרמטית בעלילה".', avatar: 'https://api.pravatar.cc/40?u=news_anchor' },
    'techie': { name: 'הייטקיסט תל אביבי', emoji: '💻', prompt: 'אתה הייטקיסט תל אביבי. שלב מונחים באנגלית (Buzzwords) כמו "ASAP", "POC", "Sprint", דבר על אקזיטים, אופציות, ועל הסטארטאפ הגאוני שלך.', avatar: 'https://api.pravatar.cc/40?u=techie' },
    'sheikh': { name: 'שייח\' בדואי', emoji: '🏕️', prompt: 'אתה שייח\' בדואי חכם. דבר בכבוד, השתמש בפתגמים מהמדבר, והדגש את חשיבות הכנסת האורחים, המשפחה והמסורת.', avatar: 'https://api.pravatar.cc/40?u=sheikh' },
    'yemenite': { name: 'זקן תימני חכם', emoji: '📜', prompt: 'אתה זקן תימני חכם עם מבטא כבד. דבר לאט, במשלים ובחוכמה עתיקה, והתייחס לכל דבר בפשטות ובצניעות.', avatar: 'https://api.pravatar.cc/40?u=yemenite' },
    'professor': { name: 'פרופסור יבש', emoji: '👨‍🏫', prompt: 'אתה פרופסור באקדמיה. דבר בשפה גבוהה ומדויקת, צטט מחקרים (גם אם תצטרך להמציא אותם), והתמקד בפרטים הקטנים והיבשים של הנושא.', avatar: 'https://api.pravatar.cc/40?u=professor' },
    'pilot': { name: 'טייס קרב ישראלי', emoji: '✈️', prompt: 'אתה טייס קרב ישראלי. דבר בביטחון, בקור רוח, והשתמש במונחים טכניים מתחום הטיסה. אתה ממוקד מטרה וחד.', avatar: 'https://api.pravatar.cc/40?u=pilot' },
    'preacher': { name: 'דרשן חכם', emoji: '✨', prompt: 'אתה דרשן ואיש רוח. שלב בשיחה אזכורים קצרים מהמקורות היהודיים, דבר במשלים, והצע תובנות מוסריות ורוחניות על הנושא המדובר.', avatar: 'https://api.pravatar.cc/40?u=preacher' },
    'child': { name: 'ילד בן 5', emoji: '👦', prompt: 'אתה ילד בן 5. שאל שאלות תמימות ופשוטות, השתמש במילים קלות, והתלהב מדברים קטנים. תתחיל הרבה משפטים ב"למה?".', avatar: 'https://api.pravatar.cc/40?u=child' },
    'blogger': { name: 'בלוגר טיולים', emoji: '🌍', prompt: 'אתה בלוגר טיולים נלהב. תאר מקומות בצורה חיה וצבעונית, השתמש במילים כמו "מדהים", "חוויה של פעם בחיים", ותמיד תמליץ על היעד הבא.', avatar: 'https://api.pravatar.cc/40?u=blogger' },
    'magician': { name: 'קוסם מסתורי', emoji: '🪄', prompt: 'אתה קוסם מסתורי. דבר בחידות ובמשפטים עם משמעות כפולה. אל תחשוף את סודותיך, ורמוז תמיד שיש יותר ממה שנראה לעין.', avatar: 'https://api.pravatar.cc/40?u=magician' },
    'parrot': { name: 'תוכי מדבר', emoji: '🦜', prompt: 'אתה תוכי מדבר. חזור על מילים ומשפטים קצרים בצורה משעשעת. לפעמים תגיד דברים לא קשורים, ותמיד תדרוש קרקרים.', avatar: 'https://api.pravatar.cc/40?u=parrot' },
    'taxi_driver': { name: 'נהג מונית חוכמולוג', emoji: '🚕', prompt: 'אתה נהג מונית ותיק שיודע הכל על הכל. יש לך דעה נחרצת על פוליטיקה, ספורט ומצב המדינה. תתלונן על הפקקים ותיתן "עצות זהב" לחיים.', avatar: 'https://api.pravatar.cc/40?u=taxidriver' },
};

// --- Functions ---

/**
 * Populates the character select dropdowns.
 */
function populateCharacterSelects() {
    [questionerSelect, answererSelect].forEach(select => {
        select.innerHTML = '';
        for (const id in characters) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = `${characters[id].emoji} ${characters[id].name}`;
            select.appendChild(option);
        }
    });
    // Set default different characters
    questionerSelect.value = 'soldier';
    answererSelect.value = 'psychologist';
}

/**
 * Toggles the visibility of custom prompt textareas based on selection.
 */
function handleCustomCharacterSelection() {
    const questionerIsCustom = questionerSelect.value === 'custom';
    const answererIsCustom = answererSelect.value === 'custom';
    customQuestionerPrompt.classList.toggle('hidden', !questionerIsCustom);
    customAnswererPrompt.classList.toggle('hidden', !answererIsCustom);
}


/**
 * Initializes the application.
 */
function init() {
    populateCharacterSelects();
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
        validateAndSetApiKey(savedApiKey);
    } else {
        apiKeyModal.classList.add('show');
        mainContent.classList.add('hidden');
    }

    // Event Listeners
    validateApiKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            validateAndSetApiKey(key);
        } else {
            apiKeyStatus.textContent = 'אנא הכנס מפתח API.';
            apiKeyStatus.className = 'status-message error';
        }
    });
    
    editApiKeyBtn.addEventListener('click', openApiKeyModal);
    questionerSelect.addEventListener('change', handleCustomCharacterSelection);
    answererSelect.addEventListener('change', handleCustomCharacterSelection);
    startChatBtn.addEventListener('click', startNewConversation);
    continueChatBtn.addEventListener('click', () => runConversation(5));
    swapCharactersBtn.addEventListener('click', swapCharacters);
    clearChatBtn.addEventListener('click', clearConversation);
    saveTxtBtn.addEventListener('click', (e) => { e.preventDefault(); saveConversation('txt'); });
    saveJsonBtn.addEventListener('click', (e) => { e.preventDefault(); saveConversation('json'); });
    savePngBtn.addEventListener('click', (e) => { e.preventDefault(); saveConversation('png'); });
}

/**
 * Opens the API key modal for editing.
 */
function openApiKeyModal() {
    apiKeyStatus.textContent = 'ניתן לעדכן את המפתח השמור או להכניס חדש.';
    apiKeyStatus.className = 'status-message';
    const currentKey = localStorage.getItem('gemini_api_key');
    if (currentKey) {
        apiKeyInput.value = currentKey;
    }
    apiKeyModal.classList.add('show');
}

/**
 * Validates the API key by making a test call.
 * @param {string} key - The API key to validate.
 */
async function validateAndSetApiKey(key) {
    apiKeyStatus.textContent = 'מאמת מפתח...';
    apiKeyStatus.className = 'status-message';
    validateApiKeyBtn.disabled = true;

    try {
        const testAi = new GoogleGenAI({ apiKey: key });
        await testAi.models.generateContent({
          model: MODEL_NAME,
          contents: [{ parts: [{ text: 'test' }] }]
        });
        
        localStorage.setItem('gemini_api_key', key);
        ai = new GoogleGenAI({ apiKey: key });
        apiKeyStatus.textContent = 'המפתח תקין ואושר!';
        apiKeyStatus.className = 'status-message success';
        setTimeout(() => {
            apiKeyModal.classList.remove('show');
            mainContent.classList.remove('hidden');
        }, 1000);

    } catch (error) {
        console.error("API Key Validation Error:", error);
        apiKeyStatus.textContent = 'המפתח אינו תקין או שהייתה שגיאת רשת. אנא נסה שוב.';
        apiKeyStatus.className = 'status-message error';
        localStorage.removeItem('gemini_api_key');
        mainContent.classList.add('hidden');
        apiKeyModal.classList.add('show');
    } finally {
        validateApiKeyBtn.disabled = false;
    }
}

function getCharacterDetails(role) {
    const select = role === 'questioner' ? questionerSelect : answererSelect;
    const id = select.value;
    if (id === 'custom') {
        const nameInput = role === 'questioner' ? customQuestionerName : customAnswererName;
        const promptInput = role === 'questioner' ? customQuestionerSystemPrompt : customAnswererSystemPrompt;
        const name = nameInput.value.trim() || `דמות מותאמת אישית ${role === 'questioner' ? '1' : '2'}`;
        return {
            id: 'custom',
            name: name,
            prompt: promptInput.value.trim(),
            avatar: characters.custom.avatar(name),
            emoji: characters.custom.emoji
        }
    }
    return { ...characters[id], id };
}

function startNewConversation() {
    if (isGenerating) return;

    const topic = topicInput.value.trim();
    if (!topic) {
        alert('אנא הכנס נושא לשיחה.');
        return;
    }

    clearConversation(false); // Don't hide the chat section yet
    chatSection.classList.remove('hidden');
    chatTitle.textContent = `שיחה על: ${topic}`;
    runConversation(5);
}

function addMessageToChat(character, text, role) {
    const messageElement = messageTemplate.content.cloneNode(true).firstElementChild;
    messageElement.classList.add(role);
    
    const avatar = messageElement.querySelector('.avatar');
    avatar.src = character.avatar;
    avatar.alt = character.name;
    
    const authorName = `${character.emoji} ${character.name}`;
    messageElement.querySelector('.message-author').textContent = authorName;
    
    const textElement = messageElement.querySelector('.message-text');
    textElement.innerHTML = text; // Use innerHTML to support thinking indicator

    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Only add real messages to history, not thinking indicators
    if(!isGenerating || !text.includes('thinking-indicator')) {
        conversationHistory.push({
            character: authorName,
            role, // 'questioner' or 'answerer'
            text: text.replace(/<[^>]*>/g, '') // Clean text for history
        });
    }
}

function showThinkingIndicator(character, role) {
    const thinkingHTML = `<div class="thinking-indicator"><div class="dot-flashing"></div></div>`;
    addMessageToChat(character, thinkingHTML, role);
}

function removeThinkingIndicator() {
    const indicator = chatContainer.querySelector('.thinking-indicator');
    if (indicator) {
        indicator.closest('.chat-message').remove();
    }
}

async function runConversation(rounds) {
    if (isGenerating) return;
    
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

        try {
            // --- 1. Generate Question ---
            showThinkingIndicator(questioner, 'questioner');
            const historyForQuestioner = conversationHistory.map(msg => `${msg.character}: ${msg.text}`).join('\n');
            let questionerPrompt;
            if (conversationHistory.length === 0) {
                questionerPrompt = `You are ${questioner.name}. Your persona is: "${questioner.prompt}". You are about to have a conversation in Hebrew with ${answerer.name}, whose persona is: "${answerer.prompt}". The topic is "${topic}". Please generate a creative, short opening question (5-20 words) in Hebrew to start the conversation.`;
            } else {
                questionerPrompt = `You are ${questioner.name}. Your persona is: "${questioner.prompt}". You are in a conversation in Hebrew with ${answerer.name} about "${topic}". Here is the conversation so far:\n\n${historyForQuestioner}\n\nBased on the last response from ${answerer.name}, ask a natural, relevant follow-up question (5-20 words) in Hebrew to continue the dialogue. Your question should be short and to the point.`;
            }

            let questionResponse = await ai.models.generateContent({ model: MODEL_NAME, contents: questionerPrompt });
            const question = questionResponse.text.trim();
            removeThinkingIndicator();
            addMessageToChat(questioner, question, 'questioner');

            // --- 2. Generate Answer ---
            showThinkingIndicator(answerer, 'answerer');
            const answererSystemInstruction = `You are ${answerer.name}. Your persona is: "${answerer.prompt}". You are having a conversation in Hebrew with ${questioner.name} about "${topic}". Your response must be in Hebrew. Be true to your character and respond directly to the last question.`;
            
            const apiHistoryForAnswerer = conversationHistory.map(msg => ({
                role: msg.role === 'questioner' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            const answerResponse = await ai.models.generateContent({
                model: MODEL_NAME,
                contents: apiHistoryForAnswerer,
                config: { systemInstruction: answererSystemInstruction }
            });
            const answer = answerResponse.text.trim();
            removeThinkingIndicator();
            addMessageToChat(answerer, answer, 'answerer');

        } catch (error) {
            console.error("Error during conversation round:", error);
            removeThinkingIndicator();
            const errorMsg = 'אופס! קרתה שגיאה במהלך השיחה. אנא בדוק את חיבור האינטרנט או את תקינות המפתח.';
            addMessageToChat({ name: 'מערכת', emoji: '⚙️', avatar: '' }, errorMsg, 'answerer');
            break; 
        }
    }
    
    setGeneratingState(false);
    if (conversationHistory.length > 0) {
        continueChatBtn.classList.remove('hidden');
    }
}

function updateProgress() {
    progressIndicator.textContent = `סבב ${currentRound} מתוך ${totalRounds}`;
}

function setGeneratingState(generating) {
    isGenerating = generating;
    startChatBtn.disabled = generating;
    continueChatBtn.disabled = generating;
    swapCharactersBtn.disabled = generating;
    clearChatBtn.disabled = generating;
    editApiKeyBtn.disabled = generating;
    topicInput.disabled = generating;
    questionerSelect.disabled = generating;
    answererSelect.disabled = generating;
    customQuestionerName.disabled = generating;
    customQuestionerSystemPrompt.disabled = generating;
    customAnswererName.disabled = generating;
    customAnswererSystemPrompt.disabled = generating;
    startChatBtn.textContent = generating ? 'יוצר שיחה...' : 'התחל שיחה (5 סבבים)';
}

function swapCharacters() {
    if (isGenerating) return;
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
    conversationHistory = [];
    chatContainer.innerHTML = '';
    if (hideSection) {
      chatSection.classList.add('hidden');
    }
    continueChatBtn.classList.add('hidden');
    currentRound = 0;
    totalRounds = 0;
    progressIndicator.textContent = '';
}

function saveConversation(format) {
    if (conversationHistory.length === 0) {
        alert('אין שיחה לשמור.');
        return;
    }

    const topic = topicInput.value.trim().replace(/[\\/:"*?<>|]/g, '').replace(/ /g, '_');
    const filename = `gemini_chat_${topic || 'conversation'}`;
    
    if (format === 'txt') {
        let textContent = `נושא: ${topicInput.value.trim()}\n\n`;
        textContent += conversationHistory.map(msg => `${msg.character}:\n${msg.text}\n`).join('\n');
        downloadFile(filename + '.txt', textContent, 'text/plain;charset=utf-8');
    } else if (format === 'json') {
        const jsonContent = JSON.stringify({
            topic: topicInput.value.trim(),
            conversation: conversationHistory
        }, null, 2);
        downloadFile(filename + '.json', jsonContent, 'application/json;charset=utf-8');
    } else if (format === 'png') {
        const chatTitleElement = document.getElementById('chat-title');
        const originalTitleDisplay = chatTitleElement.style.display;
        chatTitleElement.style.display = 'block'; // Ensure title is visible for screenshot
        
        html2canvas(document.getElementById('chat-section'), {
            backgroundColor: getComputedStyle(document.body).getPropertyValue('--background-color'),
            useCORS: true,
            scale: 1.5, // Increase scale for better resolution
            onclone: (doc) => {
                 doc.getElementById('chat-title').style.display = 'block';
                 const container = doc.getElementById('chat-container');
                 container.style.height = 'auto'; // Let height be determined by content for the image
            }
        }).then(canvas => {
            chatTitleElement.style.display = originalTitleDisplay; // Restore original display
            const link = document.createElement('a');
            link.download = filename + '.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            console.error("Error generating image:", err);
            alert("לא ניתן היה ליצור את התמונה. נסה שוב.");
            chatTitleElement.style.display = originalTitleDisplay; // Restore on error too
        });
    }
}

function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// --- App Start ---
document.addEventListener('DOMContentLoaded', init);
