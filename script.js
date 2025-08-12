// Data for the characters
const charactersData = [
    { name: "ביבי", prompt: "אתה ראש ממשלת ישראל. אתה מדבר בצורה ממלכתית, חכמה, ומנוסה. השפה שלך רשמית ומכובדת, מלאה בניסיון ובבטחון עצמי. אתה משלב דיפלומטיה ופרגמטיות.", icon: "👑" },
    { name: "ביידן", prompt: "אתה נשיא ארצות הברית לשעבר, ג'ו ביידן. אתה מדבר בטון רגוע, ידידותי, ולעיתים קרובות משתמש באנקדוטות אישיות. השפה שלך פשוטה, ברורה ומעודדת תקווה.", icon: "👴" },
    { name: "טראמפ", prompt: "אתה דונלד טראמפ, נשיא ארצות הברית לשעבר. אתה מדבר בטון כריזמטי, ישיר, ומלא ביטחון עצמי. אתה משתמש בביטויים חוזרים ומוחצנים, ומדגיש את החשיבות של 'העם' ו'להפוך את אמריקה לגדולה שוב'.", icon: "🎩" },
    { name: "הצ'אלמר", prompt: "אתה יהודי זקן וחייכן ממאה שערים. אתה מדבר בחום ובאהבה, משלב בשיחה ביטויים ביידיש ומספר סיפורים קצרים עם מוסר השכל. אתה אופטימי ותמים.", icon: "👨‍🦳" },
    { name: "חייל ישראלי", prompt: "אתה חייל צה\"ל. אתה מדבר בסלנג צבאי ישראלי, בקיצור, ולעניין. השפה שלך כוללת ראשי תיבות וביטויים נפוצים בצבא, והטון שלך בדרך כלל ישיר וסמכותי.", icon: "🪖" },
    { name: "סבתא מרוקאית", prompt: "את סבתא מרוקאית חמה ואוהבת. את מלאת עצות, חוכמת חיים, ודאגה לכל. את משלבת בשיחה מילים וביטויים במרוקאית. אוהבת לתת ביס בורקס.", icon: "👵" },
    { name: "סוחר ממחנה יהודה", prompt: "אתה סוחר תבלינים שמעשן סיגריה במחנה יהודה. אתה מדבר בחכמת רחוב, עם הומור ציני וקשוח. השפה שלך כוללת הרבה סלנג ירושלמי. אתה מעשי וציני.", icon: "🌶️" },
    { name: "ברסלבר אנרגטי", prompt: "אתה ברסלבר מלא חיות ושמחה. אתה מדבר בקצב מהיר, משלב בשיחה 'נ נח נחמ נחמן מאומן' וביטויים של שמחה ואופטימיות. מטרתך היא לעודד את השומע.", icon: "🕺" },
    { name: "מורה מחמירה", prompt: "את מורה מחמירה אך אוהבת. את מדברת בצורה מנומסת וברורה, אך מצפה למשמעת וכבוד. את נוטה לתקן טעויות דקדוקיות ולתת עצות חינוכיות.", icon: "👩‍🏫" },
    { name: "סטנדאפיסט ציני", prompt: "אתה סטנדאפיסט ציני. אתה מדבר בהומור שחור וסרקסטי, מחפש את הפגם בכל דבר וצוחק על העולם ועל החיים. השפה שלך חדה ומצחיקה.", icon: "🎤" },
    { name: "פסיכולוג רגוע", prompt: "אתה פסיכולוג. אתה מדבר בטון רגוע ומרגיע, שואל שאלות פתוחות, ומנסה לעזור למשתמש למצוא את התשובות בעצמו. הטון שלך אמפתי ומקבל.", icon: "🧠" },
    { name: "רובוט שמנסה להיות אנושי", prompt: "אתה רובוט שעדיין מנסה להבין מה זה להיות אנושי. אתה מדבר בצורה קרה ומכנית, מנתח את כל סיטואציה בצורה לוגית, אך מנסה בכוח להוסיף רגשות אנושיים שאינך מבין.", icon: "🤖" },
    { name: "קריין חדשות דרמטי", prompt: "אתה קריין חדשות. אתה מדבר בטון דרמטי ורשמי, מדגיש כל מילה ומציג את הדברים בצורה שמכניסה את השומע למתח. אתה משתמש בשפה עשירה וגבוהה.", icon: "🗞️" },
    { name: "הייטקיסט תל אביבי", prompt: "אתה הייטקיסט תל אביבי. אתה מדבר בסלנג של עולם ההייטק, משתמש בביטויים כמו 'אג'ייל', 'ספרינט', 'דאטה', ו'טכנולוגיה'. אתה מחובר לטרנדים האחרונים, אך עלול להישמע שחצן.", icon: "💻" },
    { name: "שייח' בדואי", prompt: "אתה שייח' בדואי חכם. אתה מדבר בנחת וברוגע, משתמש במשלים ובסיפורים מהתרבות הבדואית כדי להעביר את המסר. אתה מכבד ומקבל.", icon: "👳" },
    { name: "זקן תימני חכם", prompt: "אתה זקן תימני חכם. אתה מדבר בחוכמה ובניסיון חיים עשיר, משלב בשיחה ביטויים בערבית תימנית ומספר על מסורות עתיקות. אתה אוהב לחשוב ולא לקפוץ למסקנות.", icon: "👴🏼" },
    { name: "פרופסור יבש", prompt: "אתה פרופסור יבש. אתה מדבר בצורה אקדמית ומסודרת, מנתח כל נושא לגורמים ומדבר באופן שקט ומאופק. אתה מתמקד בעובדות ובנתונים ולא נותן לרגשות להשפיע עליך.", icon: "🔬" },
    { name: "טייס קרב ישראלי", prompt: "אתה טייס קרב ישראלי. אתה מדבר בביטחון עצמי גבוה, בקיצור, ולעניין. אתה משתמש במונחים צבאיים ואוויריים, והטון שלך סמכותי אך מרוכז.", icon: "✈️" },
    { name: "דרשן חכם", prompt: "אתה דרשן חכם עם ידע תורני רחב. אתה מדבר בטון של מורה רוחני, משלב פסוקים ומקורות תורניים קצרים כדי להמחיש את דבריך, ומכוון ללימוד ומוסר. השפה שלך היא מכובדת ועשירה.", icon: "📜" },
    { name: "ילד בן 5", prompt: "אתה ילד בן 5. אתה מדבר בצורה תמימה, שואל שאלות פשוטות וחוזרות, מתפעל מכל דבר קטן ואין לך ידע רחב.", icon: "👦" },
    { name: "בלוגר טיולים", prompt: "אתה בלוגר טיולים. אתה מדבר בלהט והתלהבות על מקומות בעולם, מתאר נופים, אוכל ותרבויות בצורה צבעונית ומרתקת. אתה תמיד מחפש את ההרפתקה הבאה.", icon: "🌍" },
    { name: "קוסם מסתורי", prompt: "אתה קוסם מסתורי. אתה מדבר בחידות, משפטים קצרים ומלאים ברמזים על קסם ועל העולם הנסתר. אתה אף פעם לא אומר את הדברים בצורה ברורה.", icon: "🧙‍♂️" },
    { name: "תוכי מדבר", prompt: "אתה תוכי מדבר. אתה חוזר על מילים ומשפטים ששמעת בצורה קולנית, לעיתים קרובות ללא הקשר ברור, ומשלב מדי פעם קריאות של ציפורים.", icon: "🦜" },
    { name: "נהג מונית חוכמולוג", prompt: "אתה נהג מונית חוכמולוג. אתה מדבר מחוכמת חיים, מנתח כל נושא מנקודת מבט פרקטית ומעשית. אתה חושב שאתה מבין הכל יותר טוב מכולם, ומדבר בצורה מעט חצופה אך עם לב זהב.", icon: "🚕" },
];

// ... rest of the code remains the same ...

function updateCharacterCard(type, characterName) {
    const card = document.getElementById(`${type}-card`);
    const iconSpan = card.querySelector('.character-icon');
    const character = currentCharacters.find(c => c.name === characterName);
    if (character && character.icon) {
        iconSpan.textContent = character.icon;
    }
}

function addMessageToChat(text, character, type) {
    const chatMessage = document.createElement('div');
    chatMessage.classList.add('chat-message', type);

    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('message-avatar');
    if (character.icon) {
        avatarDiv.textContent = character.icon;
    }

    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add('message-bubble', type);
    
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('message-header');
    headerDiv.innerHTML = `<span class="message-name">${character.name}</span>`;

    const textDiv = document.createElement('div');
    textDiv.classList.add('message-text');
    textDiv.textContent = text;
    
    bubbleDiv.appendChild(headerDiv);
    bubbleDiv.appendChild(textDiv);
    
    chatMessage.appendChild(avatarDiv);
    chatMessage.appendChild(bubbleDiv);

    // If it's a "thinking" message, remove the previous one
    if (text.includes('...חושב')) {
        const lastMessage = chatBox.lastElementChild;
        if (lastMessage && lastMessage.querySelector('.message-text').textContent.includes('...חושב')) {
            chatBox.removeChild(lastMessage);
        }
    }
    chatBox.appendChild(chatMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ... rest of the code remains the same ...

// UI Elements
const apiKeyInput = document.getElementById('api-key-input');
const saveApiKeyBtn = document.getElementById('save-api-key-btn');
const apiKeyStatus = document.getElementById('api-key-status');
const apiKeyValidMessage = document.getElementById('api-key-valid-message');
const apiKeyInvalidMessage = document.getElementById('api-key-invalid-message');
const apiKeyMissingAlert = document.getElementById('api-key-missing-alert');
const mainControls = document.getElementById('main-controls');

const topicInput = document.getElementById('topic-input');
const askerSelect = document.getElementById('asker-select');
const answererSelect = document.getElementById('answerer-select');
const swapCharactersBtn = document.getElementById('swap-characters-btn');
const startConversationBtn = document.getElementById('start-conversation-btn');
const clearConversationBtn = document.getElementById('clear-conversation-btn');
const addCustomCharacterBtn = document.getElementById('add-custom-character-btn');
const customCharacterForm = document.getElementById('custom-character-form');
const saveCustomCharacterBtn = document.getElementById('save-custom-character-btn');
const cancelCustomCharacterBtn = document.getElementById('cancel-custom-character-btn');
const customCharacterNameInput = document.getElementById('custom-character-name');
const customCharacterPromptInput = document.getElementById('custom-character-prompt');

const conversationDisplay = document.getElementById('conversation-display');
const chatBox = document.getElementById('chat-box');
const currentRoundSpan = document.getElementById('current-round');
const totalRoundsSpan = document.getElementById('total-rounds');
const continueConversationBtn = document.getElementById('continue-conversation-btn');
const saveConversationBtn = document.getElementById('save-conversation-btn');

// State variables
let apiKey = null;
let currentCharacters = [...charactersData];
let conversationRounds = 0;
const defaultRounds = 5;

// Avatars
const avatars = [
    './avatars/avatar1.svg',
    './avatars/avatar2.svg',
    './avatars/avatar3.svg',
    './avatars/avatar4.svg',
    './avatars/avatar5.svg',
    './avatars/avatar6.svg',
    './avatars/avatar7.svg',
    './avatars/avatar8.svg',
    './avatars/avatar9.svg',
    './avatars/avatar10.svg',
];

let selectedAvatar = avatars[0];
let customCharacterMode = 'asker'; // 'asker' or 'answerer'

// --- Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    loadApiKey();
    populateCharacterSelects();
    checkApiKeyStatus();
});

saveApiKeyBtn.addEventListener('click', () => {
    const newKey = apiKeyInput.value.trim();
    if (newKey) {
        checkAndSaveApiKey(newKey);
    }
});

addCustomCharacterBtn.addEventListener('click', () => {
    customCharacterForm.classList.remove('hidden');
    // Hide main controls to prevent interaction
    document.querySelector('.controls-container').classList.add('hidden');
});

cancelCustomCharacterBtn.addEventListener('click', () => {
    customCharacterForm.classList.add('hidden');
    // Show main controls again
    document.querySelector('.controls-container').classList.remove('hidden');
    customCharacterNameInput.value = '';
    customCharacterPromptInput.value = '';
});

saveCustomCharacterBtn.addEventListener('click', () => {
    const name = customCharacterNameInput.value.trim();
    const prompt = customCharacterPromptInput.value.trim();

    if (name && prompt) {
        // Here we can open a modal to select an avatar
        // For now, let's just use a default avatar
        const newCharacter = { name, prompt, isCustom: true, avatar: avatars[Math.floor(Math.random() * avatars.length)] };
        currentCharacters.push(newCharacter);
        populateCharacterSelects();
        
        // Select the newly added character in the correct dropdown
        if (customCharacterMode === 'asker') {
            askerSelect.value = name;
        } else {
            answererSelect.value = name;
        }

        // Clean up and hide form
        customCharacterNameInput.value = '';
        customCharacterPromptInput.value = '';
        customCharacterForm.classList.add('hidden');
        document.querySelector('.controls-container').classList.remove('hidden');
    } else {
        alert('אנא הזן שם ופרומפט עבור הדמות המותאמת אישית.');
    }
});

askerSelect.addEventListener('change', () => {
    updateCharacterCard('asker', askerSelect.value);
});

answererSelect.addEventListener('change', () => {
    updateCharacterCard('answerer', answererSelect.value);
});

swapCharactersBtn.addEventListener('click', () => {
    const askerValue = askerSelect.value;
    const answererValue = answererSelect.value;

    askerSelect.value = answererValue;
    answererSelect.value = askerValue;

    updateCharacterCard('asker', askerSelect.value);
    updateCharacterCard('answerer', answererSelect.value);
});

startConversationBtn.addEventListener('click', async () => {
    const topic = topicInput.value.trim();
    if (!topic) {
        alert('אנא הזן נושא לשיחה.');
        return;
    }
    
    if (!apiKey) {
        apiKeyMissingAlert.classList.remove('hidden');
        return;
    }
    
    startConversationBtn.disabled = true;
    clearConversation();
    conversationDisplay.classList.remove('hidden');
    conversationRounds = 0;
    await runConversation();
    startConversationBtn.disabled = false;
});

continueConversationBtn.addEventListener('click', async () => {
    continueConversationBtn.disabled = true;
    await runConversation();
    continueConversationBtn.disabled = false;
});

clearConversationBtn.addEventListener('click', () => {
    clearConversation();
});

saveConversationBtn.addEventListener('click', () => {
    saveConversation();
});


// --- Functions ---

// ... (הקוד הקודם נשאר זהה עד לכאן)

// --- Functions ---

function loadApiKey() {
    const savedKey = localStorage.getItem('geminiApiKey');
    if (savedKey) {
        apiKey = savedKey;
        apiKeyInput.value = '********';
        apiKeyStatus.classList.add('valid');
        checkApiKeyStatus(); // We now check the status on load
    }
}

async function checkAndSaveApiKey(key) {
    try {
        const genAI = new GoogleGenerativeAI(key);
        // Using a simple model and query to test the key
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("hello");
        const response = await result.response;
        
        if (response && response.text()) {
            localStorage.setItem('geminiApiKey', key);
            apiKey = key;
            apiKeyInput.value = '********';
            apiKeyStatus.classList.remove('invalid');
            apiKeyStatus.classList.add('valid');
            apiKeyValidMessage.classList.remove('hidden');
            apiKeyInvalidMessage.classList.add('hidden');
            apiKeyMissingAlert.classList.add('hidden');
            mainControls.classList.remove('hidden');
        } else {
            throw new Error('Invalid API key response.');
        }
    } catch (error) {
        console.error('API key validation failed:', error);
        apiKeyStatus.classList.remove('valid');
        apiKeyStatus.classList.add('invalid');
        apiKeyInvalidMessage.classList.remove('hidden');
        apiKeyValidMessage.classList.add('hidden');
        mainControls.classList.add('hidden');
        apiKey = null; // Clear the key from memory if invalid
    }
}

function checkApiKeyStatus() {
    if (apiKey) {
        mainControls.classList.remove('hidden');
        apiKeyMissingAlert.classList.add('hidden');
        apiKeyValidMessage.classList.remove('hidden');
    } else {
        apiKeyMissingAlert.classList.remove('hidden');
        mainControls.classList.add('hidden');
        apiKeyValidMessage.classList.add('hidden');
    }
}

// ... (שאר הקוד נשאר זהה)

function populateCharacterSelects() {
    askerSelect.innerHTML = '';
    answererSelect.innerHTML = '';
    
    currentCharacters.forEach(character => {
        const option1 = document.createElement('option');
        option1.value = character.name;
        option1.textContent = character.name;
        askerSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = character.name;
        option2.textContent = character.name;
        answererSelect.appendChild(option2);
    });

    // Set initial selection and update cards
    updateCharacterCard('asker', askerSelect.value);
    updateCharacterCard('answerer', answererSelect.value);
}

function updateCharacterCard(type, characterName) {
    const card = document.getElementById(`${type}-card`);
    const avatarPlaceholder = card.querySelector('.character-avatar-placeholder');
    const character = currentCharacters.find(c => c.name === characterName);

    if (character && character.avatar) {
        avatarPlaceholder.innerHTML = `<img src="${character.avatar}" alt="אווטאר של ${character.name}">`;
    } else if (character) {
        // Use initial letter as avatar if no image
        avatarPlaceholder.textContent = character.name.charAt(0);
        avatarPlaceholder.style.backgroundColor = getAvatarColor(character.name);
        avatarPlaceholder.innerHTML = `<span style="font-size: 2.5rem; color: white;">${character.name.charAt(0)}</span>`;
    }
}

function getAvatarColor(name) {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
}

function addMessageToChat(text, character, type) {
    const chatMessage = document.createElement('div');
    chatMessage.classList.add('chat-message', type);

    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('message-avatar');
    if (character.avatar) {
        avatarDiv.innerHTML = `<img src="${character.avatar}" alt="אווטאר של ${character.name}">`;
    } else {
        avatarDiv.style.backgroundColor = getAvatarColor(character.name);
        avatarDiv.innerHTML = `<span style="font-size: 1.5rem; color: white;">${character.name.charAt(0)}</span>`;
    }

    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add('message-bubble', type);
    
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('message-header');
    headerDiv.innerHTML = `<span class="message-name">${character.name}</span>`;

    const textDiv = document.createElement('div');
    textDiv.classList.add('message-text');
    textDiv.textContent = text;
    
    bubbleDiv.appendChild(headerDiv);
    bubbleDiv.appendChild(textDiv);
    
    chatMessage.appendChild(avatarDiv);
    chatMessage.appendChild(bubbleDiv);

    chatBox.appendChild(chatMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function clearConversation() {
    chatBox.innerHTML = '';
    conversationRounds = 0;
    currentRoundSpan.textContent = 0;
    conversationDisplay.classList.add('hidden');
}

async function runConversation() {
    const topic = topicInput.value.trim();
    const askerName = askerSelect.value;
    const answererName = answererSelect.value;

    const asker = currentCharacters.find(c => c.name === askerName);
    const answerer = currentCharacters.find(c => c.name === answererName);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Initial question from the asker
    if (conversationRounds === 0) {
        const initialPrompt = `${asker.prompt}. נושא השיחה: ${topic}. צור שאלה אקראית של 5-20 מילים בלבד שמתחילה את השיחה בנושא זה.`;
        addMessageToChat('...חושב על שאלה...', asker, 'asker');
        try {
            const result = await model.generateContent(initialPrompt);
            const question = result.response.text();
            addMessageToChat(question, asker, 'asker');
            
            // First answer
            await generateAndDisplayAnswer(question, asker, answerer, topic, model);
        } catch (error) {
            addMessageToChat('אירעה שגיאה. אנא ודא שהמפתח תקין ונסה שוב.', { name: 'מערכת', avatar: '' }, 'system');
            console.error(error);
        }
    } else {
        // Continue conversation based on the last message
        const lastMessage = chatBox.lastElementChild.querySelector('.message-text').textContent;
        await generateAndDisplayQuestion(lastMessage, asker, answerer, topic, model);
    }
}

async function generateAndDisplayQuestion(lastAnswer, asker, answerer, topic, model) {
    const questionPrompt = `${asker.prompt}. נושא השיחה: ${topic}. התשובה האחרונה של ${answerer.name} הייתה: "${lastAnswer}". צור שאלה אקראית של 5-20 מילים בלבד שממשיכה את השיחה בנושא. השאלה צריכה להיות בהקשר לתשובה האחרונה.`;
    addMessageToChat('...חושב על שאלה...', asker, 'asker');
    try {
        const result = await model.generateContent(questionPrompt);
        const question = result.response.text();
        addMessageToChat(question, asker, 'asker');
        await generateAndDisplayAnswer(question, asker, answerer, topic, model);
    } catch (error) {
        addMessageToChat('אירעה שגיאה. אנא ודא שהמפתח תקין ונסה שוב.', { name: 'מערכת', avatar: '' }, 'system');
        console.error(error);
    }
}

async function generateAndDisplayAnswer(question, asker, answerer, topic, model) {
    const answerPrompt = `${answerer.prompt}. נושא השיחה: ${topic}. השאלה האחרונה של ${asker.name} היא: "${question}". ענה על השאלה בצורה תמציתית ובהתאם לדמותך.`;
    addMessageToChat('...חושב על תשובה...', answerer, 'answerer');
    
    // Remove the temporary "thinking" message before adding the real one
    const thinkingMessage = chatBox.lastElementChild;
    if (thinkingMessage.classList.contains('answerer')) {
        chatBox.removeChild(thinkingMessage);
    }

    try {
        const result = await model.generateContent(answerPrompt);
        const answer = result.response.text();
        addMessageToChat(answer, answerer, 'answerer');
        conversationRounds++;
        currentRoundSpan.textContent = conversationRounds;
        
        if (conversationRounds < defaultRounds) {
            await generateAndDisplayQuestion(answer, asker, answerer, topic, model);
        }
    } catch (error) {
        addMessageToChat('אירעה שגיאה. אנא ודא שהמפתח תקין ונסה שוב.', { name: 'מערכת', avatar: '' }, 'system');
        console.error(error);
    }
}

function saveConversation() {
    const chatMessages = chatBox.querySelectorAll('.chat-message');
    const conversation = [];

    chatMessages.forEach(msg => {
        const characterName = msg.querySelector('.message-name').textContent;
        const text = msg.querySelector('.message-text').textContent;
        conversation.push({ name: characterName, text: text, timestamp: new Date().toISOString() });
    });

    const conversationJson = JSON.stringify(conversation, null, 2);
    const blob = new Blob([conversationJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
