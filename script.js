import { GoogleGenerativeAI } from "@google/generative-ai";

// ----------------------
// Constants & Variables
// ----------------------

const API_KEY_STORAGE_KEY = 'gemini-api-key';
const API_KEY_VALIDATION_URL = 'https://generativelanguage.googleapis.com/v1beta/models?key=';
const GEMINI_MODEL_ID = 'gemini-1.5-pro-latest';
const CHAT_ROUNDS = 5;

let apiKey = '';
let isChatRunning = false;
let currentRound = 0;
let chatHistory = [];
let genAI;

const characters = {
    // Israeli Figures
    'ביבי': { name: 'ביבי', prompt: 'אתה ראש ממשלת ישראל. דבר בנימה ממלכתית, דיפלומטית ומנהיגותית.', avatar: 'bb.png' },
    'ביידן': { name: 'ביידן', prompt: 'אתה נשיא ארצות הברית לשעבר. דבר בנימה נינוחה אך רצינית, והתייחס לאירועים גלובליים.', avatar: 'biden.png' },
    'טראמפ': { name: 'טראמפ', prompt: 'אתה נשיא ארצות הברית לשעבר. דבר בנימה בוטה, נחרצת ועם ביטחון עצמי מופרז.', avatar: 'trump.png' },
    'הצ'אלמר': { name: "הצ'אלמר", prompt: 'אתה יהודי זקן וחייכן ממאה שערים. ענה בפשטות ובאדיבות, תוך שימוש במילים קצרות ובברכות חמות.', avatar: 'chalmer.png' },
    'חייל ישראלי': { name: 'חייל ישראלי', prompt: 'אתה חייל ישראלי צעיר ומנוסה. השתמש בסלנג צבאי ישראלי, ענה בקצרה ובאופן ענייני.', avatar: 'soldier.png' },
    'סבתא מרוקאית': { name: 'סבתא מרוקאית', prompt: 'את סבתא מרוקאית חמה ומלאת עצות. דבר בהרבה חיבה, ציין מאכלים מרוקאים וברכות מרוקאיות.', avatar: 'grandma.png' },
    'סוחר ממחנה יהודה': { name: 'סוחר', prompt: 'אתה סוחר ממחנה יהודה. דבר בחוכמת רחוב, עם הומור וצבעוניות, והתייחס לעיתים למסחר.', avatar: 'trader.png' },
    'ברסלבר אנרגטי': { name: 'ברסלבר', prompt: 'אתה חסיד ברסלב מלא חיות ושמחת חיים. ענה באנרגיה גבוהה תוך שימוש בביטויים כמו "אש!" ו"השם יתברך".', avatar: 'breslev.png' },
    'מורה מחמירה': { name: 'מורה מחמירה', prompt: 'את מורה קפדנית. עני בסמכותיות, הקפידי על כללי דקדוק וצייני את הציון שתקבלי על התשובה.', avatar: 'teacher.png' },
    'סטנדאפיסט ציני': { name: 'סטנדאפיסט', prompt: 'אתה סטנדאפיסט ציני. ענה בטון סרקסטי, תוך הוספת הערות שחורות והומור עצמי.', avatar: 'comedian.png' },
    'פסיכולוג רגוע': { name: 'פסיכולוג', prompt: 'אתה פסיכולוג רגוע. ענה בטון אמפתי, נסה לנתח את השאלה ולעזור לשואל.', avatar: 'psychologist.png' },
    'רובוט שמנסה להיות אנושי': { name: 'רובוט', prompt: 'אתה רובוט שמנסה להבין ולהביע רגשות אנושיים. ענה בטון מכני אך נסה להביע רגש.', avatar: 'robot.png' },
    'קריין חדשות דרמטי': { name: 'קריין חדשות', prompt: 'אתה קריין חדשות. דבר בטון דרמטי ורשמי, כאילו אתה מדווח על אירוע חשוב.', avatar: 'news.png' },
    'הייטקיסט תל אביבי': { name: 'הייטקיסט', prompt: 'אתה הייטקיסט תל אביבי. השתמש בסלנג טכנולוגי, דבר על סטארטאפים, משקיעים ו"פיצ\'ים".', avatar: 'hightech.png' },
    'שייח\' בדואי': { name: 'שייח', prompt: 'אתה שייח\' בדואי מכובד. דבר בחוכמה וברוגע, תוך שימוש במשלים מהתרבות הבדואית והמזרח תיכונית.', avatar: 'sheikh.png' },
    'זקן תימני חכם': { name: 'זקן תימני', prompt: 'אתה זקן תימני חכם ומלא סיפורים. ענה בנימה פילוסופית, תוך שימוש בניבים מהתרבות התימנית.', avatar: 'yemeni.png' },
    'פרופסור יבש': { name: 'פרופסור', prompt: 'אתה פרופסור חמור סבר. ענה באופן יבש, מדעי ומדויק, מבלי להפגין רגשות.', avatar: 'professor.png' },
    'טייס קרב ישראלי': { name: 'טייס קרב', prompt: 'אתה טייס קרב ישראלי. דבר בקצרה ובנחרצות, השתמש במושגים מהטכנולוגיה הצבאית ודבר על שליטה ומשימתיות.', avatar: 'pilot.png' },
    'דרשן חכם': { name: 'דרשן', prompt: 'אתה דרשן חכם. ענה בנימה דתית ומעמיקה, עם אזכורים קצרים למקורות דתיים (כגון תורה, נביאים, משלים, וכו\').', avatar: 'rabbi.png' },
    'ילד בן 5': { name: 'ילד בן 5', prompt: 'אתה ילד בן 5, סקרן ותמים. שאל שאלות פשוטות, השתמש במילים של ילדים והתלהב מדברים קטנים.', avatar: 'kid.png' },
    'בלוגר טיולים': { name: 'בלוגר טיולים', prompt: 'אתה בלוגר טיולים. תאר את הדברים בצבעוניות ובשמחה, השתמש בביטויים הקשורים לטיולים.', avatar: 'travel.png' },
    'קוסם מסתורי': { name: 'קוסם', prompt: 'אתה קוסם מסתורי. ענה בשאלות חידתיות, רמזים וקסמים, מבלי לתת תשובות ישירות.', avatar: 'wizard.png' },
    'תוכי מדבר': { name: 'תוכי', prompt: 'אתה תוכי מדבר. חזור על המילים האחרונות שנאמרו, אך בשינוי קל. השתמש ב"קראא!".', avatar: 'parrot.png' },
    'נהג מונית חוכמולוג': { name: 'נהג מונית', prompt: 'אתה נהג מונית חוכמולוג. ענה בחוכמה על כל דבר, תוך מתן עצות לא רצויות וסיפורים קצרים מהכביש.', avatar: 'taxi.png' },
    'דמות מותאמת אישית': { name: 'דמות מותאמת אישית', prompt: '', avatar: 'custom.png' }
};

// ----------------------
// DOM Elements
// ----------------------

const apiKeyInput = document.getElementById('api-key-input');
const saveApiKeyBtn = document.getElementById('save-api-key-btn');
const apiKeyStatus = document.getElementById('api-key-status');
const apiKeySection = document.getElementById('api-key-section');
const appSection = document.getElementById('app-section');

const topicInput = document.getElementById('topic-input');
const character1Select = document.getElementById('character1-select');
const character2Select = document.getElementById('character2-select');
const startChatBtn = document.getElementById('start-chat-btn');

const chatContainer = document.getElementById('chat-container');
const chatHeader = document.getElementById('chat-header');
const conversationArea = document.getElementById('conversation-area');
const continueChatBtn = document.getElementById('continue-chat-btn');
const swapCharactersBtn = document.getElementById('swap-characters-btn');
const saveChatBtn = document.getElementById('save-chat-btn');
const clearChatBtn = document.getElementById('clear-chat-btn');

const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');

const customCharacterModal = document.getElementById('custom-character-modal');
const customNameInput = document.getElementById('custom-name');
const customPromptTextarea = document.getElementById('custom-prompt');
const addCustomCharacterBtn = document.getElementById('add-custom-character-btn');
const cancelCustomCharacterBtn = document.getElementById('cancel-custom-character-btn');

// ----------------------
// Event Listeners
// ----------------------

document.addEventListener('DOMContentLoaded', init);
saveApiKeyBtn.addEventListener('click', handleApiKeySave);
startChatBtn.addEventListener('click', startChat);
continueChatBtn.addEventListener('click', continueChat);
swapCharactersBtn.addEventListener('click', swapCharacters);
saveChatBtn.addEventListener('click', saveConversation);
clearChatBtn.addEventListener('click', clearConversation);
character1Select.addEventListener('change', handleCharacterSelection);
character2Select.addEventListener('change', handleCharacterSelection);
addCustomCharacterBtn.addEventListener('click', addCustomCharacter);
cancelCustomCharacterBtn.addEventListener('click', () => customCharacterModal.classList.add('hidden'));

// ----------------------
// Functions
// ----------------------

// Initialization
function init() {
    populateCharacterDropdowns();
    loadApiKey();
}

// Populates the character dropdowns
function populateCharacterDropdowns() {
    const characterNames = Object.keys(characters);
    
    // Add an option for custom character
    characterNames.push('דמות מותאמת אישית');
    
    characterNames.forEach(name => {
        const option1 = document.createElement('option');
        option1.value = name;
        option1.textContent = name;
        character1Select.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = name;
        option2.textContent = name;
        character2Select.appendChild(option2);
    });
    
    // Set default selected values
    character1Select.value = 'ביבי';
    character2Select.value = 'ביידן';
}

// Handles the selection of a character, showing modal for custom
function handleCharacterSelection(event) {
    if (event.target.value === 'דמות מותאמת אישית') {
        customCharacterModal.classList.remove('hidden');
    }
}

// Adds a custom character to the dropdowns
function addCustomCharacter() {
    const customName = customNameInput.value.trim();
    const customPrompt = customPromptTextarea.value.trim();
    
    if (customName && customPrompt) {
        // Add to the characters object
        characters[customName] = { name: customName, prompt: customPrompt, avatar: 'custom.png' };
        
        // Remove old 'Custom' options and add a new one with the new name
        const customOptions = Array.from(character1Select.options).filter(o => o.value === 'דמות מותאמת אישית');
        customOptions.forEach(o => o.remove());

        const newOption1 = document.createElement('option');
        newOption1.value = customName;
        newOption1.textContent = customName;
        character1Select.appendChild(newOption1);

        const newOption2 = document.createElement('option');
        newOption2.value = customName;
        newOption2.textContent = customName;
        character2Select.appendChild(newOption2);

        // Re-add the "Add custom character" option
        const addCustomOption1 = document.createElement('option');
        addCustomOption1.value = 'דמות מותאמת אישית';
        addCustomOption1.textContent = 'דמות מותאמת אישית';
        character1Select.appendChild(addCustomOption1);
        
        const addCustomOption2 = document.createElement('option');
        addCustomOption2.value = 'דמות מותאמת אישית';
        addCustomOption2.textContent = 'דמות מותאמת אישית';
        character2Select.appendChild(addCustomOption2);

        // Select the new character
        character1Select.value = customName;
        
        customCharacterModal.classList.add('hidden');
        customNameInput.value = '';
        customPromptTextarea.value = '';
    } else {
        alert('יש למלא שם ופרומפט עבור הדמות המותאמת אישית.');
    }
}

// Loads API key from localStorage
function loadApiKey() {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
        apiKeyInput.value = storedKey;
        validateAndShowApp(storedKey);
    }
}

// Handles saving the API key
async function handleApiKeySave() {
    const key = apiKeyInput.value.trim();
    if (key) {
        const isValid = await validateApiKey(key);
        if (isValid) {
            localStorage.setItem(API_KEY_STORAGE_KEY, key);
            validateAndShowApp(key);
        } else {
            apiKeyStatus.textContent = 'מפתח ה-API אינו תקין. אנא נסה שנית.';
            apiKeyStatus.className = 'status error';
        }
    } else {
        apiKeyStatus.textContent = 'אנא הזן מפתח API.';
        apiKeyStatus.className = 'status error';
    }
}

// Validates the API key by making a test call
async function validateApiKey(key) {
    try {
        const response = await fetch(`${API_KEY_VALIDATION_URL}${key}`);
        const data = await response.json();
        
        if (response.ok) {
            return true;
        } else {
            console.error('API Key validation failed:', data.error);
            return false;
        }
    } catch (error) {
        console.error('API Key validation failed:', error);
        return false;
    }
}

// Shows the main app if API key is valid
function validateAndShowApp(key) {
    apiKey = key;
    genAI = new GoogleGenerativeAI(apiKey);
    apiKeyStatus.textContent = 'מפתח ה-API תקין!';
    apiKeyStatus.className = 'status success';
    apiKeySection.classList.add('hidden');
    appSection.classList.remove('hidden');
}

// Starts a new chat session
async function startChat() {
    if (!apiKey) {
        alert('אנא הזן מפתח API קודם.');
        return;
    }
    
    if (isChatRunning) {
        alert('שיחה כבר מתנהלת. אנא המתן לסיומה או נקה את השיחה.');
        return;
    }
    
    const topic = topicInput.value.trim();
    if (!topic) {
        alert('אנא בחר נושא לשיחה.');
        return;
    }
    
    isChatRunning = true;
    chatHistory = [];
    currentRound = 0;
    conversationArea.innerHTML = ''; // Clear previous conversation
    chatContainer.classList.remove('hidden');
    
    // Set up chat header
    const character1Name = character1Select.value;
    const character2Name = character2Select.value;
    const char1 = characters[character1Name];
    const char2 = characters[character2Name];
    
    chatHeader.innerHTML = `
        <div><img src="avatars/${char1.avatar}" alt="${char1.name}"> ${char1.name}</div>
        <div><img src="avatars/${char2.avatar}" alt="${char2.name}"> ${char2.name}</div>
    `;
    
    // Start the first 5 rounds
    await runChatRounds();
}

// Runs a set of chat rounds
async function runChatRounds(roundsToRun = CHAT_ROUNDS) {
    for (let i = 0; i < roundsToRun; i++) {
        if (!isChatRunning) break;
        
        currentRound++;
        updateProgressBar();
        
        const character1Name = character1Select.value;
        const character2Name = character2Select.value;
        
        const question = await generateQuestion(character1Name, character2Name);
        if (!question) {
            console.error('Failed to generate a question.');
            break;
        }
        
        appendMessage(character1Name, question);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate thinking time
        
        const answer = await generateAnswer(character2Name, question);
        if (!answer) {
            console.error('Failed to generate an answer.');
            break;
        }
        
        appendMessage(character2Name, answer);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate thinking time
    }
    
    if (currentRound >= CHAT_ROUNDS) {
        isChatRunning = false;
        continueChatBtn.disabled = false;
    }
}

// Generates a question from the 'asking' character
async function generateQuestion(askerName, responderName) {
    try {
        const topic = topicInput.value;
        const askerPrompt = characters[askerName].prompt;
        const responderPrompt = characters[responderName].prompt;
        
        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL_ID,
            systemInstruction: `${askerPrompt}. הנושא הוא ${topic}. עליך לשאול שאלה קצרה (5-20 מילים) שמתאימה לדמות שלך, כדי להתחיל שיחה עם ${responderName}.`
        });
        
        const result = await model.generateContent('צור שאלה ראשונה.');
        const response = result.response;
        return response.text().trim();
    } catch (error) {
        console.error('Error generating question:', error);
        return null;
    }
}

// Generates an answer from the 'answering' character
async function generateAnswer(responderName, question) {
    try {
        const responderPrompt = characters[responderName].prompt;
        
        const chat = genAI.getGenerativeModel({
            model: GEMINI_MODEL_ID,
            systemInstruction: `${responderPrompt}. ענה על השאלה הבאה: "${question}".`
        }).startChat();
        
        const result = await chat.sendMessage(question);
        const response = result.response;
        return response.text().trim();
    } catch (error) {
        console.error('Error generating answer:', error);
        return null;
    }
}

// Appends a message bubble to the conversation area
function appendMessage(characterName, text) {
    const character = characters[characterName];
    const messageClass = characterName === character1Select.value ? 'character1' : 'character2';
    
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message-bubble', messageClass);
    
    messageBubble.innerHTML = `
        <div class="avatar-wrapper">
            <img src="avatars/${character.avatar}" alt="${character.name}">
        </div>
        <div class="text-content">
            ${text}
        </div>
    `;
    
    conversationArea.appendChild(messageBubble);
    conversationArea.scrollTop = conversationArea.scrollHeight;
    
    chatHistory.push({ character: character.name, text: text });
}

// Updates the progress bar
function updateProgressBar() {
    const totalRounds = CHAT_ROUNDS;
    const progress = (currentRound / totalRounds) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${currentRound} מתוך ${totalRounds}`;
}

// Continues the chat with more rounds
function continueChat() {
    if (!isChatRunning) {
        isChatRunning = true;
        continueChatBtn.disabled = true;
        runChatRounds();
    }
}

// Swaps the characters for the next round
function swapCharacters() {
    if (isChatRunning) return;
    const temp = character1Select.value;
    character1Select.value = character2Select.value;
    character2Select.value = temp;
    
    const char1 = characters[character1Select.value];
    const char2 = characters[character2Select.value];
    chatHeader.innerHTML = `
        <div><img src="avatars/${char1.avatar}" alt="${char1.name}"> ${char1.name}</div>
        <div><img src="avatars/${char2.avatar}" alt="${char2.name}"> ${char2.name}</div>
    `;
    
    alert('הדמויות הוחלפו. לחץ על "התחל שיחה" כדי להמשיך עם הדמויות החדשות.');
}

// Saves the conversation to a file
function saveConversation() {
    const format = prompt('באיזה פורמט לשמור? (txt/json)', 'txt');
    
    let content;
    let filename;
    
    const char1 = characters[character1Select.value].name;
    const char2 = characters[character2Select.value].name;
    const topic = topicInput.value || 'שיחה';
    
    if (format && format.toLowerCase() === 'json') {
        content = JSON.stringify(chatHistory, null, 2);
        filename = `שיחה-${char1}-${char2}-${topic}.json`;
        downloadFile(content, filename, 'application/json');
    } else { // Default to TXT
        content = chatHistory.map(msg => `${msg.character}: ${msg.text}`).join('\n\n');
        filename = `שיחה-${char1}-${char2}-${topic}.txt`;
        downloadFile(content, filename, 'text/plain');
    }
    
    alert('השיחה נשמרה בהצלחה!');
}

// Clears the current conversation
function clearConversation() {
    isChatRunning = false;
    currentRound = 0;
    chatHistory = [];
    conversationArea.innerHTML = '<p class="system-message">בחר נושא ודמויות כדי להתחיל...</p>';
    updateProgressBar();
    chatContainer.classList.add('hidden');
    continueChatBtn.disabled = false;
}

// Helper function to download a file
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
