// Access environment variables in client-side JS through webpack
// These will be injected at build time

// Session check at the start of the file
function checkSession() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
        window.location.href = 'account.html';
        return false;
    }
    return true;
}

// Run session check immediately, but only if not in test environment
if (typeof process === 'undefined' || !process.env.JEST_WORKER_ID) {
    // Not running in Jest environment, perform authentication check
    if (!checkSession()) {
        // Stop further script execution if not authenticated
        throw new Error('Not authenticated');
    }
}

// Global variables
let conversations = [];
let currentConversationId = null;

// Function to ensure a URL is properly formatted
function formatUrl(url, defaultPort = 5101) {
    // Determine the base URL based on where the app is running
    const hostname = window.location.hostname;
    
    // Default API endpoint path
    const apiEndpoint = '/api/chat';
    
    // Dynamic base URL determination
    let baseUrl;
    
    if (hostname === 'baktipm.com') {
        // We're running on the production domain
        baseUrl = 'https://baktipm.com';
        console.log('Running on baktipm.com domain, using:', baseUrl + apiEndpoint);
        return baseUrl + apiEndpoint;
    } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // We're running locally
        baseUrl = `http://localhost:${defaultPort}`;
        console.log('Running locally, using:', baseUrl + apiEndpoint);
        return baseUrl + apiEndpoint;
    }
    
    // If we got here, we're using a custom URL provided as an argument
    if (!url) return `http://localhost:${defaultPort}/api/chat`;
    
    // Make sure URL has protocol
    let formattedUrl = url;
    if (!formattedUrl.startsWith('http')) {
        formattedUrl = 'http://' + formattedUrl;
    }   
    
    // Make sure localhost URLs include port
    if (formattedUrl.includes('localhost') && !formattedUrl.includes(`:${defaultPort}`)) {
        formattedUrl = formattedUrl.replace('localhost', `localhost:${defaultPort}`);
    }
    
    console.log('Using custom URL:', formattedUrl);
    return formattedUrl;
}

// Configuration object for API
const config = {
    // Access environment variables through process.env (injected by webpack)
    port: process.env.PORT || 5101,
    apiUrl: formatUrl(process.env.API_URL, 5101),
    dashscopeApiKey: process.env.DASHSCOPE_API_KEY,
    dashscopeUrl: process.env.DASHSCOPE_URL,
    // Determine the best proxyUrl based on hostname
    proxyUrl: window.location.hostname === 'baktipm.com' 
        ? 'https://baktipm.com/api/chat' 
        : formatUrl(process.env.PROXY_URL, 5101)
};

// Create axios instance with default config
const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// DOM Elements
const chatContainer = document.getElementById('chat-container');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const chatHistory = document.getElementById('chat-history');
const conversationList = document.getElementById('conversation-list');
const historyList = document.getElementById('history-list');
const emptyHistory = document.getElementById('empty-history');
const newChatButton = document.getElementById('new-chat');
const connectionStatus = document.getElementById('connection-status');
const menuToggle = document.getElementById('menu-toggle');
const closeSidebar = document.getElementById('close-sidebar');
const loadingElement = document.getElementById('loading');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
const userButton = document.getElementById('user-button');
const userDropdown = document.getElementById('user-dropdown');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const dropdownUserName = document.getElementById('dropdown-user-name');
const userEmail = document.getElementById('user-email');
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const clearHistoryButton = document.getElementById('clear-history');

// Log DOM elements to console
// console.log('DOM Elements loaded:', {
//     chatMessages,
//     userInput,
//     sendButton,
//     connectionStatus,
//     historyList,
//     newChatButton,
//     clearHistoryButton,
//     emptyHistory,
//     themeToggle,
//     themeIcon,
//     userButton,
//     userDropdown,
//     loginButton,
//     logoutButton,
//     userAvatar,
//     userName,
//     dropdownUserName,
//     userEmail
// });

// Function to generate a UUID v4 that's compatible with the backend
function generateId() {
    // RFC4122 UUID v4 implementation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Function to format timestamp
function formatTimestamp(date) {
    const now = new Date();
    const messageDate = new Date(date);
    
    // If today, show time
    if (messageDate.toDateString() === now.toDateString()) {
        return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show month and day
    if (messageDate.getFullYear() === now.getFullYear()) {
        return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show full date
    return messageDate.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
}

// Function to create a new conversation
function createNewConversation() {
    const conversation = {
        id: generateId(),
        messages: [],
        timestamp: new Date(),
        preview: '',
        topic: 'New Chat'  // Default topic
    };
    conversations.unshift(conversation);
    currentConversationId = conversation.id;
    saveConversations();
    updateHistoryList();
    clearChat();

    // Add welcome message
    const welcomeMessage = "👋 Hello! I'm your AI assistant. How can I help you today?";
    
    // Check if the conversation already has messages or if welcome message already exists
    const hasWelcomeMessage = conversation.messages.some(
        msg => msg.role === 'assistant' && msg.content === welcomeMessage
    );

    // Get the current index of this conversation in the array
    const currentIndex = conversations.findIndex(c => c.id === conversation.id);
    // console.log(`Current conversation index: ${currentIndex}`);

    if (conversation.messages.length === 0 && !hasWelcomeMessage) {
        addMessage(welcomeMessage, false);
        conversation.messages.push({ role: 'assistant', content: welcomeMessage });
        conversation.preview = welcomeMessage;
    }
    saveConversations();
    updateHistoryList();

    return conversation;
}

// Function to generate topic from messages
function generateTopic(messages) {
    if (messages.length === 0) return 'New Chat';
    // Get the first user message as the topic
    const firstMessage = messages.find(m => m.role === 'user');
    if (!firstMessage) return 'New Chat';
    
    // Truncate the message to create a topic
    const topic = firstMessage.content.split('\n')[0].trim();
    return topic.length > 40 ? topic.substring(0, 37) + '...' : topic;
}

// Function to update conversation topic
function updateConversationTopic(conversationId) {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
        conversation.topic = generateTopic(conversation.messages);
        saveConversations();
        updateHistoryList();
    }
}

// Function to clear chat messages
function clearChat() {
    chatMessages.innerHTML = '';
    userInput.value = '';
    userInput.focus();
}

// Function to save conversations to localStorage
function saveConversations() {
    localStorage.setItem('conversations', JSON.stringify(conversations));
    toggleEmptyState();
}

// Function to validate UUID v4 format
function isValidUUIDv4(id) {
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4Regex.test(id);
}

// Function to load saved conversations from localStorage
function loadConversations() {
    const saved = localStorage.getItem('conversations');
    if (saved) {
        conversations = JSON.parse(saved);
        
        // Check if any conversations use old ID format and migrate them
        let needsMigration = false;
        conversations.forEach(conv => {
            if (!isValidUUIDv4(conv.id)) {
                // If not a valid UUID v4, generate a new one
                console.log(`Converting old conversation ID ${conv.id} to UUID format`);
                conv.id = generateId();
                needsMigration = true;
            }
        });
        
        // Save back if we made changes
        if (needsMigration) {
            console.log('Saving migrated conversation IDs');
            localStorage.setItem('conversations', JSON.stringify(conversations));
        }
        
        // Set current conversation to the most recent one, if available
        if (conversations.length > 0) {
            currentConversationId = conversations[0].id;
            
            // Convert stored timestamps back to Date objects
            conversations.forEach(conv => {
                conv.timestamp = new Date(conv.timestamp);
            });
        }
    } else {
        conversations = [];
    }
    
    updateHistoryList();
    toggleEmptyState();
}

// Function to toggle empty state
function toggleEmptyState() {
    if (conversations.length === 0) {
        emptyHistory.style.display = 'flex';
    } else {
        emptyHistory.style.display = 'none';
    }
}

// Function to delete conversation
function deleteConversation(id, event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
        conversations = conversations.filter(c => c.id !== id);
        if (id === currentConversationId) {
            currentConversationId = conversations.length > 0 ? conversations[0].id : null;
            if (currentConversationId) {
                loadConversation(currentConversationId);
            } else {
                clearChat();
            }
        }
        saveConversations();
        updateHistoryList();
    }
}

// Function to update the history list UI
function updateHistoryList() {
    historyList.innerHTML = '';
    
    if (conversations.length === 0) {
        historyList.appendChild(emptyHistory);
        emptyHistory.style.display = 'flex';
    } else {
        emptyHistory.style.display = 'none';
        conversations.forEach(conv => {
            const item = document.createElement('div');
            item.className = 'history-item';
            if (conv.id === currentConversationId) {
                item.classList.add('active');
                // console.log('Current conversation:', conv);
            }
            
            const header = document.createElement('div');
            header.className = 'history-item-header';
            
            const topic = document.createElement('div');
            topic.className = 'topic';
            topic.textContent = conv.topic || 'New Chat';
            
            const timestamp = document.createElement('div');
            timestamp.className = 'timestamp';
            timestamp.textContent = formatTimestamp(conv.timestamp);
            
            const preview = document.createElement('div');
            preview.className = 'preview';
            preview.textContent = conv.preview || 'Empty conversation';
            
            const actions = document.createElement('div');
            actions.className = 'actions';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="ri-delete-bin-line"></i>';
            deleteBtn.title = 'Delete conversation';
            deleteBtn.onclick = (e) => deleteConversation(conv.id, e);
            
            header.appendChild(topic);
            header.appendChild(deleteBtn);
            
            item.appendChild(header);
            item.appendChild(timestamp);
            item.appendChild(preview);
            
            item.addEventListener('click', () => loadConversation(conv.id));
            historyList.appendChild(item);
        });
    }
}

// Function to load a specific conversation
function loadConversation(conversationId) {
    currentConversationId = conversationId;
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
        chatMessages.innerHTML = '';
        conversation.messages.forEach(msg => {
            addMessage(msg.content, msg.role === 'user', false);
        });
        updateHistoryList();
    }
}

// Function to update connection status
function updateConnectionStatus(message, type = '') {
    // Status update handling
    connectionStatus.textContent = message;
    connectionStatus.className = 'connection-status ' + type;
}

// Configure marked with options
marked.setOptions({
    highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'hljs language-',
    gfm: true,
    breaks: true
});

// Function to create a message element
function createMessageElement(content, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'avatar';
    avatarDiv.innerHTML = isUser ? '<i class="ri-user-line"></i>' : '<i class="ri-robot-line"></i>';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (isUser) {
        contentDiv.textContent = content;
    } else {
        // For bot messages, render as Markdown
        contentDiv.innerHTML = marked.parse(content);
        // Highlight any code blocks
        contentDiv.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    }

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);

    return { messageDiv, contentDiv };
}

// Function to add a message to the chat
function addMessage(content, isUser, save = true) {
    const { messageDiv, contentDiv } = createMessageElement(content, isUser);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    if (save) {
        if (!currentConversationId) {
            createNewConversation();
        }
        
        const conversation = conversations.find(c => c.id === currentConversationId);
        if (conversation) {
            conversation.messages.push({ role: isUser ? 'user' : 'assistant', content });
            conversation.preview = content;
            conversation.timestamp = new Date();
            // Update topic after adding first user message
            if (isUser && conversation.messages.filter(m => m.role === 'user').length === 1) {
                updateConversationTopic(currentConversationId);
            }
            saveConversations();
            updateHistoryList();
        }
    }
}

// Function to show typing indicator
function showTypingIndicator() {
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = '<i class="ri-robot-line"></i>';
    
    const bubble = document.createElement('div');
    bubble.className = 'typing-bubble';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        bubble.appendChild(dot);
    }
    
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(bubble);
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to remove typing indicator
function removeTypingIndicator() {
    // Remove typing indicator
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Function to send message to API
async function sendToAPI(message) {
    try {
        // Send message to API
        updateConnectionStatus('Connecting...', '');
        
        // The config.proxyUrl is already formatted with the formatUrl utility
        const apiEndpoint = config.proxyUrl;
        
        // Get authentication token
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required. Please login again.');
        }
        
        // Create event source for streaming
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                message,
                conversationId: currentConversationId // Include conversation ID in the request
            })
        });

        // Create a reader to read the stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        updateConnectionStatus('Connected', 'connected');

        // Return a promise that resolves with an array of all responses
        return new Promise(async (resolve, reject) => {
            try {
                let fullResponse = '';
                
                while (true) {
                    const { done, value } = await reader.read();
                    
                    if (done) {
                        break;
                    }

                    // Decode the chunk and add to buffer
                    buffer += decoder.decode(value, { stream: true });
                    
                    // Process complete events
                    let newlineIndex;
                    while ((newlineIndex = buffer.indexOf('\n\n')) !== -1) {
                        const event = buffer.slice(0, newlineIndex);
                        buffer = buffer.slice(newlineIndex + 2);

                        // Parse the event
                        const lines = event.split('\n');
                        for (const line of lines) {
                            if (!line.startsWith('data:')) continue;
                            
                            const data = line.slice(5).trim();
                            if (!data) continue;
                            
                            if (data === '[DONE]') {
                                resolve({
                                    choices: [{
                                        message: {
                                            content: fullResponse
                                        }
                                    }]
                                });
                                return;
                            }

                            try {
                                const parsedData = JSON.parse(data);
                                if (parsedData.error) {
                                    throw new Error(parsedData.error);
                                }
                                // Handle different API response formats
                                let content = '';
                                
                                // Check for different response formats
                                if (parsedData.choices?.[0]?.message?.content) {
                                    // OpenAI-like format
                                    content = parsedData.choices[0].message.content;
                                } else if (parsedData.output?.text) {
                                    // DashScope format
                                    content = parsedData.output.text;
                                } else if (parsedData.text) {
                                    // Simple format
                                    content = parsedData.text;
                                } else if (parsedData.content) {
                                    // Another common format
                                    content = parsedData.content;
                                } else {
                                    // Handle unknown response format
                                    // Try to extract any string we can find
                                    content = JSON.stringify(parsedData);
                                }
                                
                                if (content && content.trim()) {
                                    fullResponse += content;
                                    // Emit partial response for real-time updates
                                    window.dispatchEvent(new CustomEvent('partialResponse', {
                                        detail: { content }
                                    }));
                                }
                            } catch (e) {
                                if (!data.startsWith('id:')) {  // Ignore ID lines
                                    // Silently handle parsing errors
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                reject(error);
            }
        });
    } catch (error) {
        // Handle API errors silently
        // Update UI with error message
        updateConnectionStatus(`Error: ${error.response?.data?.message || error.message}`, 'error');
        throw error;
    }
}

// Function to handle sending messages
async function handleSendMessage() {
    const message = userInput.value.trim();
    if (!message) {
        alert("Please enter a message before sending.");
        return;
    }
    
    // Check if we have a current conversation, if not create one
    if (!currentConversationId || !conversations.find(c => c.id === currentConversationId)) {
        // Create a new conversation automatically
        const newConversation = createNewConversation();
        currentConversationId = newConversation.id;
    }
    
    // Process new message
    
    // Clear input
    userInput.value = '';

    // Add user message to chat
    addMessage(message, true);

    // Show typing indicator
    showTypingIndicator();

    try {
        // Remove typing indicator before creating new message
        removeTypingIndicator();

        // Create a temporary message element for streaming updates
        const tempMessageId = 'temp-' + Date.now();
        const { messageDiv, contentDiv } = createMessageElement('', false);
        contentDiv.id = tempMessageId;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        let accumulatedMarkdown = '';

        // Listen for partial responses
        const handlePartialResponse = (event) => {
            const content = event.detail.content;
            accumulatedMarkdown += content;
            const messageElement = document.getElementById(tempMessageId);
            
            if (messageElement) {
                messageElement.textContent = accumulatedMarkdown;
                
                try {
                    messageElement.innerHTML = marked.parse(accumulatedMarkdown);
                    messageElement.querySelectorAll('pre code').forEach((block) => {
                        hljs.highlightBlock(block);
                    });
                } catch (e) {
                    // Silent fail on markdown parsing errors
                }
                
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } else {
                // Silent fail if element not found (element might not be in DOM yet)
                // This prevents console error messages
            }
        };
        window.addEventListener('partialResponse', handlePartialResponse);

        // Send message to API
        const response = await sendToAPI(message);
        
        // Remove event listener
        window.removeEventListener('partialResponse', handlePartialResponse);

        // Update the final message
        // Extract the response content based on its format
        let botResponse = '';
        
        if (response) {
            // Process full API response
            
            // Handle different API response formats
            if (response.choices && response.choices[0] && response.choices[0].message) {
                // OpenAI-like format
                botResponse = response.choices[0].message.content;
            } else if (response.output && response.output.text) {
                // DashScope format
                botResponse = response.output.text;
            } else if (response.text) {
                // Simple format
                botResponse = response.text;
            } else if (response.content) {
                // Another common format
                botResponse = response.content;
            } else {
                // If we can't find a known format, use the accumulated markdown
                botResponse = accumulatedMarkdown;
            }
            
            // Use extracted bot response
            
            const messageElement = document.getElementById(tempMessageId);
            if (messageElement) {
                try {
                    messageElement.innerHTML = marked.parse(botResponse);
                    // Highlight any code blocks
                    messageElement.querySelectorAll('pre code').forEach((block) => {
                        hljs.highlightBlock(block);
                    });
                } catch (e) {
                    // Silent fail on final markdown parsing error
                    // Fallback to plain text
                    messageElement.textContent = botResponse;
                }
            } else {
                // Silent fail if element not found in final response handling
                // This prevents console error messages
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Save the bot's response to conversation history
            const conversation = conversations.find(c => c.id === currentConversationId);
            if (conversation) {
                conversation.messages.push({ role: 'assistant', content: botResponse });
                conversation.preview = botResponse;
                conversation.timestamp = new Date();
                saveConversations();
                updateHistoryList();
            }
        } else {
            throw new Error('Invalid API response format');
        }
    } catch (error) {
        console.error('Chat error:', error);
        removeTypingIndicator();
        addMessage('Sorry, I encountered an error. Please try again later.', false);
    }
}

// Function to clear all history
// function clearAllHistory() {
//     if (confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
//         conversations = [];
//         currentConversationId = null;
//         localStorage.removeItem('conversations');
//         clearChat();
//         updateHistoryList();
//         toggleEmptyState();
//         // // Create a new conversation after clearing
//         // createNewConversation();
//     }
// }

// Theme management
function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function updateThemeIcon(theme) {
    const isDark = theme === 'dark';
    if (themeIcon) {
        themeIcon.className = isDark ? 'ri-sun-line' : 'ri-moon-line';
    }
    if (themeToggle) {
        themeToggle.setAttribute('title', `Switch to ${isDark ? 'light' : 'dark'} mode`);
        themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    }
}

function setTheme(theme, updateStorage = true) {
    // Make sure we have a string value, not a promise
    const themeValue = typeof theme === 'string' ? theme : 'system';
    
    document.documentElement.style.setProperty('--transition-normal', 'none');
    document.body.classList.remove('light-theme', 'dark-theme');
    
    requestAnimationFrame(() => {
        // Ensure we're adding a valid class name
        document.body.classList.add(`${themeValue}-theme`);
        document.documentElement.style.setProperty('--transition-normal', 'all 0.3s ease');
        
        if (updateStorage) {
            localStorage.setItem('theme', themeValue);
        }
        
        updateThemeIcon(themeValue);
    });
}

// Initialize theme with proper type checking to avoid Promise errors
const initialTheme = getPreferredTheme();
if (typeof initialTheme === 'string') {
    setTheme(initialTheme, false);
} else if (initialTheme instanceof Promise) {
    // If it's a promise, wait for it to resolve
    initialTheme.then(theme => setTheme(theme || 'system', false))
              .catch(() => setTheme('system', false));
} else {
    // Fallback to system theme
    setTheme('system', false);
}

// Theme toggle event listener
addSafeEventListener(themeToggle, 'click', () => {
    const currentTheme = localStorage.getItem('theme') || getPreferredTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Watch for system theme changes
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
if (mediaQuery) {
    mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light', false);
        }
    });
}

// Mobile menu toggle
addSafeEventListener(menuToggle, 'click', () => {
    if (chatHistory) {
        chatHistory.classList.toggle('show');
    }
});

// Close sidebar button
addSafeEventListener(closeSidebar, 'click', () => {
    if (chatHistory) {
        chatHistory.classList.remove('show');
    }
});

// Close menu when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        const isClickInsideHistory = chatHistory.contains(e.target);
        const isClickOnToggle = menuToggle.contains(e.target);
        
        if (!isClickInsideHistory && !isClickOnToggle && chatHistory.classList.contains('show')) {
            chatHistory.classList.remove('show');
        }
    }
});

// User Account Management
addSafeEventListener(userButton, 'click', () => {
    if (userDropdown) {
        userDropdown.classList.toggle('hidden');
    }
});

// Document-level event listener for click outside dropdown
if (document) {
    document.addEventListener('click', (e) => {
        if (userButton && userDropdown && 
            !userButton.contains(e.target) && 
            !userDropdown.contains(e.target)) {
            userDropdown.classList.add('hidden');
        }
    });
}

// Login button functionality
addSafeEventListener(loginButton, 'click', () => {
    window.location.href = 'account.html';
});

// Logout button functionality
addSafeEventListener(logoutButton, 'click', () => {
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        updateUserInterface();
        window.location.href = 'account.html';
    }
});

function updateUserInterface() {
    const user = JSON.parse(localStorage.getItem('user'));
    const isAuthenticated = !!localStorage.getItem('token');

    if (isAuthenticated && user) {
        // Update avatar
        const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7c3aed&color=fff`;
        userAvatar.src = avatarUrl;
        document.querySelector('.user-info img').src = avatarUrl;

        // Update name and email with safety checks
        if (userName) userName.textContent = user.name;
        if (dropdownUserName) dropdownUserName.textContent = user.name;
        if (userEmail) userEmail.textContent = user.email;

        // Show/hide buttons with safety checks
        if (loginButton) loginButton.classList.add('hidden');
        if (logoutButton) logoutButton.classList.remove('hidden');
    } else {
        // Reset to guest state
        const guestAvatar = 'https://ui-avatars.com/api/?name=Guest&background=7c3aed&color=fff';
        userAvatar.src = guestAvatar;
        document.querySelector('.user-info img').src = guestAvatar;

        userName.textContent = 'Guest';
        dropdownUserName.textContent = 'Guest';
        userEmail.textContent = 'Not signed in';

        loginButton.classList.remove('hidden');
        logoutButton.classList.add('hidden');
    }
}

updateUserInterface();

// Helper function to safely add event listeners
function addSafeEventListener(element, eventType, handler) {
    if (element) {
        element.addEventListener(eventType, handler);
    } else {
        console.error(`Element for event ${eventType} not found`);
    }
}

// Event listeners - with safety checks
addSafeEventListener(sendButton, 'click', handleSendMessage);
addSafeEventListener(newChatButton, 'click', createNewConversation);
addSafeEventListener(clearHistoryButton, 'click', clearAllHistory);

if (userInput) {
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
} else {
    console.error('User input element not found');
}

// Function to clear all conversation history with confirmation
function clearAllHistory() {
    if (confirm('Are you sure you want to delete all conversation history? This action cannot be undone.')) {
        const userId = getUserId();
        
        if (userId) {
            // For logged in users, call API to delete conversations from database
            fetch('/api/conversations/clear', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                if (response.ok) {
                    // Clear local conversations
                    conversations = [];
                    saveConversations();
                    updateHistoryList();
                    createNewConversation(); // Create a fresh conversation
                    return response.json();
                }
                throw new Error('Failed to clear conversation history');
            })
            .then(data => {
                console.log('Cleared history:', data);
            })
            .catch(error => {
                console.error('Error clearing history:', error);
                alert('Failed to clear conversation history. Please try again.');
            });
        } else {
            // For anonymous users, just clear local storage
            conversations = [];
            saveConversations();
            updateHistoryList();
            createNewConversation(); // Create a fresh conversation
        }
    }
}

// Helper function to get user ID if logged in
function getUserId() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.id : null;
}

// Load conversations on startup
loadConversations();

// Add initial greeting only if there are no existing conversations
if (conversations.length === 0) {
    // Create a new conversation but prevent duplicate welcome messages
    const newConversation = {
        id: generateId(),
        messages: [],
        timestamp: new Date(),
        preview: '',
        topic: 'New Chat'
    };
    
    conversations.unshift(newConversation);
    currentConversationId = newConversation.id;
    
    // Add welcome message only once
    const welcomeMessage = "👋 Hello! I'm your AI assistant. How can I help you today?";
    addMessage(welcomeMessage, false);
    newConversation.messages.push({ role: 'assistant', content: welcomeMessage });
    newConversation.preview = welcomeMessage;
    saveConversations();
    updateHistoryList();
    clearChat();
}
