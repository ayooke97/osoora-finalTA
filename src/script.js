// Access environment variables in client-side JS through webpack
// These will be injected at build time

// Enhanced session validation function
function validateSession() {
    console.log('🔐 Validating user session...');
    
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    console.log('Token exists:', !!token);
    console.log('User data exists:', !!userStr);
    
    // Check if both token and user data exist
    if (!token || !userStr) {
        console.log('❌ Missing authentication credentials');
        console.log('Token:', token ? 'Present' : 'Missing');
        console.log('User:', userStr ? 'Present' : 'Missing');
        
        // Clear any remaining session data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('authChecked');
        
        console.log('🚀 Redirecting to login page...');
        window.location.href = 'account.html';
        return false;
    }
    
    // Try to parse user data
    let user;
    try {
        user = JSON.parse(userStr);
        console.log('✅ User data parsed successfully:', user.username || 'No username');
    } catch (error) {
        console.log('❌ Invalid user data format');
        
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('authChecked');
        
        console.log('🚀 Redirecting to login page...');
        window.location.href = 'account.html';
        return false;
    }
    
    // Validate user object structure
    if (!user.user_id || !user.username || !user.email) {
        console.log('❌ Incomplete user data:', user);
        
        // Clear incomplete data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('authChecked');
        
        console.log('🚀 Redirecting to login page...');
        window.location.href = 'account.html';
        return false;
    }
    
    // Validate token format (should be a UUID)
    const tokenPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!tokenPattern.test(token)) {
        console.log('❌ Invalid token format');
        
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('authChecked');
        
        console.log('🚀 Redirecting to login page...');
        window.location.href = 'account.html';
        return false;
    }
    
    console.log('✅ Session validation passed');
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('authChecked', 'true');
    return true;
}

// Run comprehensive session check immediately
if (typeof process === 'undefined' || !process.env.JEST_WORKER_ID) {
    console.log('🔍 Checking authentication status on page load...');
    
    if (!validateSession()) {
        // validateSession already handles the redirect
        throw new Error('Authentication failed - redirecting to login');
    }
    
    console.log('🎉 User authenticated successfully!');
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
    // Browser-safe defaults (no process.env)
    port: 5101,
    apiUrl: formatUrl(null, 5101),
    dashscopeApiKey: null,
    dashscopeUrl: null,
    // Determine the best proxyUrl based on hostname
    proxyUrl: window.location.hostname === 'baktipm.com' 
        ? 'https://baktipm.com/api/chat' 
        : formatUrl(null, 5101)
};

// Global error handler for authentication failures
async function handleAuthError(response) {
    if (response && (response.status === 403 || response.status === 401)) {
        console.log('Authentication failed, clearing tokens and redirecting...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('authChecked');
        window.location.href = 'account.html';
        return true; // Indicates we handled the error
    }
    return false; // Let other errors be handled normally
}

// Enhanced fetch wrapper that handles authentication errors automatically
async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    
    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }
    
    try {
        const response = await fetch(url, options);
        
        // Handle authentication errors automatically
        if (await handleAuthError(response)) {
            return null; // Request was redirected due to auth error
        }
        
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

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

// Helper function to ensure user is authenticated
function requireAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
        console.log('🔒 No authentication token found, redirecting to login...');
        // Clear any partial session data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('authChecked');
        
        // Redirect to login page
        window.location.href = 'account.html';
        return false;
    }
    
    return token;
}

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
    const welcomeMessage = "👋 Halo! Saya Osoora. Silahkan tanyakan seputar KTP dan tanah.";
    
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

// Function to save conversations to server via API
async function saveConversations() {
    try {
        console.log('Saving conversations to server...');
        
        // Ensure user is authenticated, redirect to login if not
        const token = requireAuth();
        if (!token) return; // requireAuth handles redirect
        
        const response = await authenticatedFetch('/api/conversations/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ conversations })
        });
        
        if (response && response.ok) {
            const result = await response.json();
            console.log(`✅ Successfully saved ${result.count} conversations`);
        } else {
            console.error('Failed to save conversations:', response?.status);
            // Fall back to localStorage as backup
            localStorage.setItem('conversations', JSON.stringify(conversations));
            console.log('💾 Saved to localStorage as backup');
        }
        
    } catch (error) {
        console.error('Error saving conversations:', error);
        // Fall back to localStorage as backup
        localStorage.setItem('conversations', JSON.stringify(conversations));
        console.log('💾 Saved to localStorage as backup');
    } finally {
        toggleEmptyState();
    }
}

// Function to validate UUID v4 format
function isValidUUIDv4(id) {
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4Regex.test(id);
}

// Function to load conversations from server via API
async function loadConversations() {
    try {
        console.log('Loading conversations from server...');
        
        // Ensure user is authenticated, redirect to login if not
        const token = requireAuth();
        if (!token) return; // requireAuth handles redirect
        
        const response = await authenticatedFetch('/api/conversations', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response && response.ok) {
            const serverConversations = await response.json();
            console.log(`✅ Loaded ${serverConversations.length} conversations from server`);
            
            conversations = serverConversations;
            
            // Convert timestamps to Date objects
            conversations.forEach(conv => {
                conv.timestamp = new Date(conv.timestamp);
            });
            
            // Set current conversation to the most recent one, if available
            if (conversations.length > 0) {
                currentConversationId = conversations[0].id;
            }
            
        } else {
            console.error('Failed to load conversations from server:', response?.status);
            // Fall back to localStorage
            loadConversationsFromLocalStorage();
        }
        
    } catch (error) {
        console.error('Error loading conversations from server:', error);
        // Fall back to localStorage
        loadConversationsFromLocalStorage();
    } finally {
        updateHistoryList();
        toggleEmptyState();
    }
}

// Backup function to load from localStorage
function loadConversationsFromLocalStorage() {
    console.log('💾 Loading conversations from localStorage backup...');
    const saved = localStorage.getItem('conversations');
    if (saved) {
        conversations = JSON.parse(saved);
        
        // Check if any conversations use old ID format and migrate them
        let needsMigration = false;
        conversations.forEach(conv => {
            if (!isValidUUIDv4(conv.id)) {
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

// Function to load a specific conversation (local first, server if needed)
async function loadConversation(conversationId) {
    try {
        console.log(`Loading conversation ${conversationId}...`);
        
        // Ensure user is authenticated, redirect to login if not
        const token = requireAuth();
        if (!token) return; // requireAuth handles redirect
        
        currentConversationId = conversationId;
        
        // First try to find in local conversations array
        const localConversation = conversations.find(c => c.id === conversationId);
        
        // Check if we have complete local data
        const hasCompleteLocalData = localConversation && 
            localConversation.messages && 
            Array.isArray(localConversation.messages);
        
        if (hasCompleteLocalData) {
            // Use local data without API call
            console.log(`📱 Using local cache for "${localConversation.topic}" (${localConversation.messages.length} messages)`);
            
            chatMessages.innerHTML = '';
            localConversation.messages.forEach(msg => {
                addMessage(msg.content, msg.role === 'user', false);
            });
            updateHistoryList();
            
            // No server fetch needed - we have complete data locally
            return;
        }
        
        // If no local data or incomplete, fetch from server
        console.log(hasCompleteLocalData ? '🔄 Refreshing from server...' : '🌐 Fetching from server...');
        
        // Clear chat before loading
        chatMessages.innerHTML = '';
        
        const response = await authenticatedFetch(`/api/conversations/${conversationId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response && response.ok) {
            const serverConversation = await response.json();
            console.log(`✅ Loaded conversation "${serverConversation.topic}" from server (${serverConversation.messages?.length || 0} messages)`);
            
            // Convert timestamp to Date object
            serverConversation.timestamp = new Date(serverConversation.timestamp);
            
            // Update local conversations array with fresh data
            const existingIndex = conversations.findIndex(c => c.id === conversationId);
            if (existingIndex >= 0) {
                conversations[existingIndex] = serverConversation;
            } else {
                // Add to local array if not found
                conversations.unshift(serverConversation);
            }
            
            // Render messages from server
            chatMessages.innerHTML = '';
            if (serverConversation.messages && serverConversation.messages.length > 0) {
                serverConversation.messages.forEach(msg => {
                    addMessage(msg.content, msg.role === 'user', false);
                });
            }
            
            updateHistoryList();
            
            // Save updated conversations to localStorage for future use
            localStorage.setItem('conversations', JSON.stringify(conversations));
            
        } else if (response?.status === 404) {
            console.error('❌ Conversation not found on server');
            updateConnectionStatus('Conversation not found', 'error');
            
            // Remove from local array if it doesn't exist on server
            const index = conversations.findIndex(c => c.id === conversationId);
            if (index >= 0) {
                conversations.splice(index, 1);
                updateHistoryList();
            }
            
            // Load first available conversation or create new one
            if (conversations.length > 0) {
                await loadConversation(conversations[0].id);
            } else {
                createNewConversation();
            }
            
        } else {
            console.error('Failed to load conversation from server:', response?.status);
            
            // If server fails but we have local data, use it
            if (localConversation) {
                console.log('💾 Using local cache as fallback');
                chatMessages.innerHTML = '';
                localConversation.messages?.forEach(msg => {
                    addMessage(msg.content, msg.role === 'user', false);
                });
                updateConnectionStatus('Using cached conversation', 'warning');
            } else {
                updateConnectionStatus('Failed to load conversation', 'error');
            }
        }
        
    } catch (error) {
        console.error('Error loading conversation:', error);
        
        // Fallback to local version if available
        const localConversation = conversations.find(c => c.id === conversationId);
        if (localConversation) {
            console.log('💾 Using local cache due to error');
            chatMessages.innerHTML = '';
            localConversation.messages?.forEach(msg => {
                addMessage(msg.content, msg.role === 'user', false);
            });
            updateConnectionStatus('Using cached conversation', 'warning');
        } else {
            updateConnectionStatus('Failed to load conversation', 'error');
        }
        
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
        
        // Ensure user is authenticated, redirect to login if not
        const token = requireAuth();
        if (!token) return; // requireAuth handles redirect
        
        // Create event source for streaming
        const response = await authenticatedFetch(apiEndpoint, {
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
    // BULLETPROOF Promise protection - same as account.js
    if (theme && typeof theme.then === 'function') {
        console.error('setTheme received a Promise! Rejecting and using system theme. Promise:', theme);
        theme = 'system';
    }
    
    // EXTRA PROTECTION: Check for stringified Promise objects
    if (typeof theme === 'string' && (theme.includes('[object Promise]') || theme.includes('Promise'))) {
        console.error('setTheme received stringified Promise! Using system theme. Value:', theme);
        theme = 'system';
    }
    
    // FINAL CHECK: Force to string and validate
    if (typeof theme !== 'string') {
        console.error('setTheme theme is not a string! Type:', typeof theme, 'Value:', theme);
        theme = 'system';
    }
    
    // Make sure we have a string value, not a promise or other object
    let themeValue = 'system'; // default fallback
    
    if (typeof theme === 'string' && (theme === 'light' || theme === 'dark' || theme === 'system')) {
        themeValue = theme;
    } else {
        console.warn('setTheme received unsafe value, defaulting to system:', typeof theme, theme);
    }
    
    document.documentElement.style.setProperty('--transition-normal', 'none');
    document.body.classList.remove('light-theme', 'dark-theme');
    
    requestAnimationFrame(() => {
        // Ensure we're adding a valid class name - double check it's still a string
        if (typeof themeValue === 'string') {
            document.body.classList.add(`${themeValue}-theme`);
        }
        document.documentElement.style.setProperty('--transition-normal', 'all 0.3s ease');
        
        if (updateStorage) {
            localStorage.setItem('theme', themeValue);
        }
        
        updateThemeIcon(themeValue);
    });
}

// Initialize theme with proper type checking to avoid Promise errors
(async () => {
    const initialTheme = getPreferredTheme();
    if (typeof initialTheme === 'string') {
        setTheme(initialTheme, false);
    } else if (initialTheme instanceof Promise) {
        try {
            const resolvedTheme = await initialTheme;
            setTheme(resolvedTheme || 'system', false);
        } catch {
            setTheme('system', false);
        }
    } else {
        setTheme('system', false);
    }
})();

// Theme toggle event listener
addSafeEventListener(themeToggle, 'click', () => {
    const currentTheme = localStorage.getItem('theme') || getPreferredTheme();
    // Ensure currentTheme is a string, not a promise
    const themeValue = typeof currentTheme === 'string' ? currentTheme : 'system';
    const newTheme = themeValue === 'dark' ? 'light' : 'dark';
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

// Logout functionality will be handled by attachLogoutHandler function

function updateUserInterface() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token && !!user;
    const isLoggedInSession = sessionStorage.getItem('isLoggedIn') === 'true';
    const dropdownItems = document.querySelector('.dropdown-items');
    
    console.log('Updating UI - Auth state:', { isAuthenticated, isLoggedInSession, hasUser: !!user, hasToken: !!token });

    // Check both localStorage token and sessionStorage flag for authentication
    if ((isAuthenticated && user) || isLoggedInSession) {
        console.log('User is authenticated, showing logout button');
        
        // Update avatar - safely handle user object which might be null in some edge cases
        let avatarUrl = 'https://ui-avatars.com/api/?name=User&background=7c3aed&color=fff';
        if (user && user.username) {
            avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=7c3aed&color=fff`;
        }
        
        if (userAvatar) userAvatar.src = avatarUrl;
        const userInfoImg = document.querySelector('.user-info img');
        if (userInfoImg) userInfoImg.src = avatarUrl;

        // Update name and email with safety checks
        if (userName && user) userName.textContent = user.username || 'User';
        if (dropdownUserName && user) dropdownUserName.textContent = user.username || 'User';
        if (userEmail && user) userEmail.textContent = user.email || 'user@example.com';
        
        // IMPORTANT: Always check for and remove the login button when logged in
        // This runs on every UI update to ensure consistency
        const existingLoginButton = document.getElementById('login-button');
        if (existingLoginButton && dropdownItems) {
            try {
                dropdownItems.removeChild(existingLoginButton);
                console.log('Login button removed successfully');
            } catch (error) {
                console.error('Error removing login button:', error);
            }
        }
        
        // Show logout button and ensure it's available for event attachment
        const logoutBtn = document.getElementById('logout-button');
        if (logoutBtn) {
            logoutBtn.classList.remove('hidden');
            console.log('Logout button shown:', logoutBtn);
            
            // Re-attach logout handler after making button visible
            setTimeout(() => {
                attachLogoutHandler();
            }, 100);
        } else {
            console.error('Logout button not found in DOM');
        }
    } else {
        console.log('User not authenticated, hiding logout button');
        
        // Reset to guest state
        const guestAvatar = 'https://ui-avatars.com/api/?name=Guest&background=7c3aed&color=fff';
        userAvatar.src = guestAvatar;
        document.querySelector('.user-info img').src = guestAvatar;

        userName.textContent = 'Guest';
        dropdownUserName.textContent = 'Guest';
        userEmail.textContent = 'Not signed in';

        // Add login button back if it doesn't exist
        if (!document.getElementById('login-button') && dropdownItems) {
            const loginBtn = document.createElement('button');
            loginBtn.className = 'dropdown-item';
            loginBtn.id = 'login-button';
            loginBtn.innerHTML = '<i class="ri-login-circle-line"></i><span>Sign In</span>';
            loginBtn.addEventListener('click', () => {
                window.location.href = 'account.html';
            });
            
            // Insert before logout button if it exists
            const logoutBtn = document.getElementById('logout-button');
            if (logoutBtn) {
                dropdownItems.insertBefore(loginBtn, logoutBtn);
            } else {
                dropdownItems.appendChild(loginBtn);
            }
        }
        
        // Hide logout button
        const logoutBtn = document.getElementById('logout-button');
        if (logoutBtn) {
            logoutBtn.classList.add('hidden');
            console.log('Logout button hidden');
        }
    }
}

updateUserInterface();

// Helper function to safely add event listeners
function addSafeEventListener(element, eventType, handler) {
    if (element) {
        console.log(`Adding event listener for ${eventType} to element:`, element);
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

// Debug logout button state
console.log('Logout button element:', logoutButton);
console.log('Logout button classes:', logoutButton?.className);
console.log('Logout button visible:', logoutButton && !logoutButton.classList.contains('hidden'));

// Function to clear all conversation history with confirmation
function clearAllHistory() {
    if (confirm('Are you sure you want to delete all conversation history? This action cannot be undone.')) {
        // Ensure user is authenticated, redirect to login if not
        const token = requireAuth();
        if (!token) return; // requireAuth handles redirect
        
        const userId = getUserId();
        
        if (userId) {
            // For logged in users, call API to delete conversations from database
            authenticatedFetch('/api/conversations/clear', {
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

// Initialize conversations on startup
(async function initializeConversations() {
    // Load conversations from server
    await loadConversations();
    
    // Add initial greeting only if there are no existing conversations
    if (conversations.length === 0) {
        console.log('No conversations found, creating welcome conversation...');
        
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
        
        // Save the new conversation to server
        await saveConversations();
        updateHistoryList();
        clearChat();
    } else {
        console.log(`Loaded ${conversations.length} existing conversations`);
        // Load the most recent conversation if available
        if (currentConversationId && conversations.find(c => c.id === currentConversationId)) {
            loadConversation(currentConversationId);
        }
    }
})();

// Update user interface to show current authentication status
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateUserInterface);
} else {
    updateUserInterface();
}

function attachLogoutHandler() {
    const logoutButton = document.getElementById('logout-button');
    console.log('Attaching logout handler to:', logoutButton);
    
    if (!logoutButton) {
        console.error('Logout button not found when attaching handler');
        return;
    }
    
    // Remove any existing event listeners to prevent duplicates
    const newLogoutButton = logoutButton.cloneNode(true);
    logoutButton.parentNode.replaceChild(newLogoutButton, logoutButton);
    
    // Add event listener to the new button
    newLogoutButton.addEventListener('click', function(event) {
        console.log('Logout button clicked');
        event.preventDefault();
        event.stopPropagation();
        
        try {
            // Store the original button content
            const originalContent = newLogoutButton.innerHTML;
            
            // Ask for confirmation immediately
            const confirmed = confirm('Are you sure you want to sign out?');
            console.log('User confirmation:', confirmed);
            
            if (confirmed) {
                console.log('Starting logout process...');
                
                // Show loading state
                newLogoutButton.disabled = true;
                newLogoutButton.innerHTML = '<i class="ri-loader-4-line rotating"></i> <span>Signing out...</span>';
                
                // Clear ALL session storage related to authentication
                console.log('Clearing session data...');
                sessionStorage.removeItem('authChecked');
                sessionStorage.removeItem('isLoggedIn');
                
                // Clear all authentication data from localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                console.log('Authentication data cleared');
                
                // Update UI immediately
                updateUserInterface();
                
                // Close the dropdown
                if (userDropdown) {
                    userDropdown.classList.add('hidden');
                    console.log('Dropdown closed');
                }
                
                // Redirect immediately
                console.log('Redirecting to account.html');
                window.location.href = 'account.html';
                
            } else {
                console.log('User cancelled logout');
            }
            
        } catch (error) {
            console.error('Error during logout:', error);
            updateConnectionStatus('There was an error signing out. Please try again.', 'error');
            
            // Reset the button if there was an error
            if (newLogoutButton) {
                newLogoutButton.disabled = false;
                newLogoutButton.innerHTML = '<i class="ri-logout-circle-line"></i> <span>Sign Out</span>';
            }
        }
    });
    
    console.log('Logout handler attached successfully');
}
