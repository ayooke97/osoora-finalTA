/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (c = i[4] || 3, u = i[5] === e ? i[3] : i[5], i[4] = 3, i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Access environment variables in client-side JS through webpack
// These will be injected at build time

// Session check at the start of the file
function checkSession() {
  var token = localStorage.getItem('token');
  var user = localStorage.getItem('user');
  if (!token || !user) {
    window.location.href = 'account.html';
    return false;
  }
  return true;
}

// Run session check immediately
if (!checkSession()) {
  // Stop further script execution if not authenticated
  throw new Error('Not authenticated');
}

// Global variables
var conversations = [];
var currentConversationId = null;

// Function to ensure a URL is properly formatted
function formatUrl(url) {
  var defaultPort = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5101;
  // Determine the base URL based on where the app is running
  var hostname = window.location.hostname;

  // Default API endpoint path
  var apiEndpoint = '/api/chat';

  // Dynamic base URL determination
  var baseUrl;
  if (hostname === 'baktipm.com') {
    // We're running on the production domain
    baseUrl = 'https://baktipm.com';
    console.log('Running on baktipm.com domain, using:', baseUrl + apiEndpoint);
    return baseUrl + apiEndpoint;
  } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // We're running locally
    baseUrl = "http://localhost:".concat(defaultPort);
    console.log('Running locally, using:', baseUrl + apiEndpoint);
    return baseUrl + apiEndpoint;
  }

  // If we got here, we're using a custom URL provided as an argument
  if (!url) return "http://localhost:".concat(defaultPort, "/api/chat");

  // Make sure URL has protocol
  var formattedUrl = url;
  if (!formattedUrl.startsWith('http')) {
    formattedUrl = 'http://' + formattedUrl;
  }

  // Make sure localhost URLs include port
  if (formattedUrl.includes('localhost') && !formattedUrl.includes(":".concat(defaultPort))) {
    formattedUrl = formattedUrl.replace('localhost', "localhost:".concat(defaultPort));
  }
  console.log('Using custom URL:', formattedUrl);
  return formattedUrl;
}

// Configuration object for API
var config = {
  // Access environment variables through process.env (injected by webpack)
  port: "5101" || 0,
  apiUrl: formatUrl("http://localhost:5101", 5101),
  dashscopeApiKey: "sk-0054022384a64f03abfdbcae8c001cbb",
  dashscopeUrl: "https://dashscope-intl.aliyuncs.com/api/v1/apps/172f5d2e8d1b4b9da47dada83dcb7f19/completion",
  // Determine the best proxyUrl based on hostname
  proxyUrl: window.location.hostname === 'baktipm.com' ? 'https://baktipm.com/api/chat' : formatUrl("http://localhost:5101/api/chat", 5101)
};

// Create axios instance with default config
var api = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// DOM Elements
var chatContainer = document.getElementById('chat-container');
var chatMessages = document.getElementById('chat-messages');
var userInput = document.getElementById('user-input');
var sendButton = document.getElementById('send-button');
var chatHistory = document.getElementById('chat-history');
var conversationList = document.getElementById('conversation-list');
var historyList = document.getElementById('history-list');
var emptyHistory = document.getElementById('empty-history');
var newChatButton = document.getElementById('new-chat');
var connectionStatus = document.getElementById('connection-status');
var menuToggle = document.getElementById('menu-toggle');
var closeSidebar = document.getElementById('close-sidebar');
var loadingElement = document.getElementById('loading');
var themeToggle = document.getElementById('theme-toggle');
var themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
var userButton = document.getElementById('user-button');
var userDropdown = document.getElementById('user-dropdown');
var userAvatar = document.getElementById('user-avatar');
var userName = document.getElementById('user-name');
var dropdownUserName = document.getElementById('dropdown-user-name');
var userEmail = document.getElementById('user-email');
var loginButton = document.getElementById('login-button');
var logoutButton = document.getElementById('logout-button');
var clearHistoryButton = document.getElementById('clear-history');

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
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

// Function to format timestamp
function formatTimestamp(date) {
  var now = new Date();
  var messageDate = new Date(date);

  // If today, show time
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // If this year, show month and day
  if (messageDate.getFullYear() === now.getFullYear()) {
    return messageDate.toLocaleDateString([], {
      month: 'short',
      day: 'numeric'
    });
  }

  // Otherwise show full date
  return messageDate.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Function to create a new conversation
function createNewConversation() {
  var conversation = {
    id: generateId(),
    messages: [],
    timestamp: new Date(),
    preview: '',
    topic: 'New Chat' // Default topic
  };
  conversations.unshift(conversation);
  currentConversationId = conversation.id;
  saveConversations();
  updateHistoryList();
  clearChat();

  // Add welcome message
  var welcomeMessage = "👋 Hello! I'm your AI assistant. How can I help you today?";

  // Check if the conversation already has messages or if welcome message already exists
  var hasWelcomeMessage = conversation.messages.some(function (msg) {
    return msg.role === 'assistant' && msg.content === welcomeMessage;
  });

  // Get the current index of this conversation in the array
  var currentIndex = conversations.findIndex(function (c) {
    return c.id === conversation.id;
  });
  // console.log(`Current conversation index: ${currentIndex}`);

  if (conversation.messages.length === 0 && !hasWelcomeMessage) {
    addMessage(welcomeMessage, false);
    conversation.messages.push({
      role: 'assistant',
      content: welcomeMessage
    });
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
  var firstMessage = messages.find(function (m) {
    return m.role === 'user';
  });
  if (!firstMessage) return 'New Chat';

  // Truncate the message to create a topic
  var topic = firstMessage.content.split('\n')[0].trim();
  return topic.length > 40 ? topic.substring(0, 37) + '...' : topic;
}

// Function to update conversation topic
function updateConversationTopic(conversationId) {
  var conversation = conversations.find(function (c) {
    return c.id === conversationId;
  });
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
  var uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(id);
}

// Function to load saved conversations from localStorage
function loadConversations() {
  var saved = localStorage.getItem('conversations');
  if (saved) {
    conversations = JSON.parse(saved);

    // Check if any conversations use old ID format and migrate them
    var needsMigration = false;
    conversations.forEach(function (conv) {
      if (!isValidUUIDv4(conv.id)) {
        // If not a valid UUID v4, generate a new one
        console.log("Converting old conversation ID ".concat(conv.id, " to UUID format"));
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
      conversations.forEach(function (conv) {
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
    conversations = conversations.filter(function (c) {
      return c.id !== id;
    });
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
    conversations.forEach(function (conv) {
      var item = document.createElement('div');
      item.className = 'history-item';
      if (conv.id === currentConversationId) {
        item.classList.add('active');
        // console.log('Current conversation:', conv);
      }
      var header = document.createElement('div');
      header.className = 'history-item-header';
      var topic = document.createElement('div');
      topic.className = 'topic';
      topic.textContent = conv.topic || 'New Chat';
      var timestamp = document.createElement('div');
      timestamp.className = 'timestamp';
      timestamp.textContent = formatTimestamp(conv.timestamp);
      var preview = document.createElement('div');
      preview.className = 'preview';
      preview.textContent = conv.preview || 'Empty conversation';
      var actions = document.createElement('div');
      actions.className = 'actions';
      var deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.innerHTML = '<i class="ri-delete-bin-line"></i>';
      deleteBtn.title = 'Delete conversation';
      deleteBtn.onclick = function (e) {
        return deleteConversation(conv.id, e);
      };
      header.appendChild(topic);
      header.appendChild(deleteBtn);
      item.appendChild(header);
      item.appendChild(timestamp);
      item.appendChild(preview);
      item.addEventListener('click', function () {
        return loadConversation(conv.id);
      });
      historyList.appendChild(item);
    });
  }
}

// Function to load a specific conversation
function loadConversation(conversationId) {
  currentConversationId = conversationId;
  var conversation = conversations.find(function (c) {
    return c.id === conversationId;
  });
  if (conversation) {
    chatMessages.innerHTML = '';
    conversation.messages.forEach(function (msg) {
      addMessage(msg.content, msg.role === 'user', false);
    });
    updateHistoryList();
  }
}

// Function to update connection status
function updateConnectionStatus(message) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  // Status update handling
  connectionStatus.textContent = message;
  connectionStatus.className = 'connection-status ' + type;
}

// Configure marked with options
marked.setOptions({
  highlight: function highlight(code, lang) {
    var language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, {
      language: language
    }).value;
  },
  langPrefix: 'hljs language-',
  gfm: true,
  breaks: true
});

// Function to create a message element
function createMessageElement(content, isUser) {
  var messageDiv = document.createElement('div');
  messageDiv.className = "message ".concat(isUser ? 'user-message' : 'bot-message');
  var avatarDiv = document.createElement('div');
  avatarDiv.className = 'avatar';
  avatarDiv.innerHTML = isUser ? '<i class="ri-user-line"></i>' : '<i class="ri-robot-line"></i>';
  var contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  if (isUser) {
    contentDiv.textContent = content;
  } else {
    // For bot messages, render as Markdown
    contentDiv.innerHTML = marked.parse(content);
    // Highlight any code blocks
    contentDiv.querySelectorAll('pre code').forEach(function (block) {
      hljs.highlightBlock(block);
    });
  }
  messageDiv.appendChild(avatarDiv);
  messageDiv.appendChild(contentDiv);
  return {
    messageDiv: messageDiv,
    contentDiv: contentDiv
  };
}

// Function to add a message to the chat
function addMessage(content, isUser) {
  var save = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var _createMessageElement = createMessageElement(content, isUser),
    messageDiv = _createMessageElement.messageDiv,
    contentDiv = _createMessageElement.contentDiv;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  if (save) {
    if (!currentConversationId) {
      createNewConversation();
    }
    var conversation = conversations.find(function (c) {
      return c.id === currentConversationId;
    });
    if (conversation) {
      conversation.messages.push({
        role: isUser ? 'user' : 'assistant',
        content: content
      });
      conversation.preview = content;
      conversation.timestamp = new Date();
      // Update topic after adding first user message
      if (isUser && conversation.messages.filter(function (m) {
        return m.role === 'user';
      }).length === 1) {
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
  var typingDiv = document.createElement('div');
  typingDiv.className = 'typing-indicator';
  typingDiv.id = 'typing-indicator';
  var avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.innerHTML = '<i class="ri-robot-line"></i>';
  var bubble = document.createElement('div');
  bubble.className = 'typing-bubble';
  for (var i = 0; i < 3; i++) {
    var dot = document.createElement('div');
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
  var typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Function to send message to API
function sendToAPI(_x) {
  return _sendToAPI.apply(this, arguments);
} // Function to handle sending messages
function _sendToAPI() {
  _sendToAPI = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(message) {
    var apiEndpoint, token, response, reader, decoder, buffer, _error$response, _t4;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.p = 0;
          // Send message to API
          updateConnectionStatus('Connecting...', '');

          // The config.proxyUrl is already formatted with the formatUrl utility
          apiEndpoint = config.proxyUrl; // Get authentication token
          token = localStorage.getItem('token');
          if (token) {
            _context2.n = 1;
            break;
          }
          throw new Error('Authentication required. Please login again.');
        case 1:
          _context2.n = 2;
          return fetch(apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': "Bearer ".concat(token)
            },
            body: JSON.stringify({
              message: message,
              conversationId: currentConversationId // Include conversation ID in the request
            })
          });
        case 2:
          response = _context2.v;
          // Create a reader to read the stream
          reader = response.body.getReader();
          decoder = new TextDecoder();
          buffer = '';
          updateConnectionStatus('Connected', 'connected');

          // Return a promise that resolves with an array of all responses
          return _context2.a(2, new Promise(/*#__PURE__*/function () {
            var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(resolve, reject) {
              var fullResponse, _yield$reader$read, done, value, newlineIndex, event, lines, _iterator, _step, line, data, _parsedData$choices, _parsedData$output, parsedData, content, _t, _t2, _t3;
              return _regenerator().w(function (_context) {
                while (1) switch (_context.n) {
                  case 0:
                    _context.p = 0;
                    fullResponse = '';
                  case 1:
                    if (false) // removed by dead control flow
{}
                    _context.n = 2;
                    return reader.read();
                  case 2:
                    _yield$reader$read = _context.v;
                    done = _yield$reader$read.done;
                    value = _yield$reader$read.value;
                    if (!done) {
                      _context.n = 3;
                      break;
                    }
                    return _context.a(3, 18);
                  case 3:
                    // Decode the chunk and add to buffer
                    buffer += decoder.decode(value, {
                      stream: true
                    });

                    // Process complete events
                    newlineIndex = void 0;
                  case 4:
                    if (!((newlineIndex = buffer.indexOf('\n\n')) !== -1)) {
                      _context.n = 17;
                      break;
                    }
                    event = buffer.slice(0, newlineIndex);
                    buffer = buffer.slice(newlineIndex + 2);

                    // Parse the event
                    lines = event.split('\n');
                    _iterator = _createForOfIteratorHelper(lines);
                    _context.p = 5;
                    _iterator.s();
                  case 6:
                    if ((_step = _iterator.n()).done) {
                      _context.n = 13;
                      break;
                    }
                    line = _step.value;
                    if (line.startsWith('data:')) {
                      _context.n = 7;
                      break;
                    }
                    return _context.a(3, 12);
                  case 7:
                    data = line.slice(5).trim();
                    if (data) {
                      _context.n = 8;
                      break;
                    }
                    return _context.a(3, 12);
                  case 8:
                    if (!(data === '[DONE]')) {
                      _context.n = 9;
                      break;
                    }
                    resolve({
                      choices: [{
                        message: {
                          content: fullResponse
                        }
                      }]
                    });
                    return _context.a(2);
                  case 9:
                    _context.p = 9;
                    parsedData = JSON.parse(data);
                    if (!parsedData.error) {
                      _context.n = 10;
                      break;
                    }
                    throw new Error(parsedData.error);
                  case 10:
                    // Handle different API response formats
                    content = ''; // Check for different response formats
                    if ((_parsedData$choices = parsedData.choices) !== null && _parsedData$choices !== void 0 && (_parsedData$choices = _parsedData$choices[0]) !== null && _parsedData$choices !== void 0 && (_parsedData$choices = _parsedData$choices.message) !== null && _parsedData$choices !== void 0 && _parsedData$choices.content) {
                      // OpenAI-like format
                      content = parsedData.choices[0].message.content;
                    } else if ((_parsedData$output = parsedData.output) !== null && _parsedData$output !== void 0 && _parsedData$output.text) {
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
                        detail: {
                          content: content
                        }
                      }));
                    }
                    _context.n = 12;
                    break;
                  case 11:
                    _context.p = 11;
                    _t = _context.v;
                    if (!data.startsWith('id:')) {// Ignore ID lines
                      // Silently handle parsing errors
                    }
                  case 12:
                    _context.n = 6;
                    break;
                  case 13:
                    _context.n = 15;
                    break;
                  case 14:
                    _context.p = 14;
                    _t2 = _context.v;
                    _iterator.e(_t2);
                  case 15:
                    _context.p = 15;
                    _iterator.f();
                    return _context.f(15);
                  case 16:
                    _context.n = 4;
                    break;
                  case 17:
                    _context.n = 1;
                    break;
                  case 18:
                    _context.n = 20;
                    break;
                  case 19:
                    _context.p = 19;
                    _t3 = _context.v;
                    reject(_t3);
                  case 20:
                    return _context.a(2);
                }
              }, _callee, null, [[9, 11], [5, 14, 15, 16], [0, 19]]);
            }));
            return function (_x2, _x3) {
              return _ref.apply(this, arguments);
            };
          }()));
        case 3:
          _context2.p = 3;
          _t4 = _context2.v;
          // Handle API errors silently
          // Update UI with error message
          updateConnectionStatus("Error: ".concat(((_error$response = _t4.response) === null || _error$response === void 0 || (_error$response = _error$response.data) === null || _error$response === void 0 ? void 0 : _error$response.message) || _t4.message), 'error');
          throw _t4;
        case 4:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 3]]);
  }));
  return _sendToAPI.apply(this, arguments);
}
function handleSendMessage() {
  return _handleSendMessage.apply(this, arguments);
} // Function to clear all history
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
function _handleSendMessage() {
  _handleSendMessage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var message, _newConversation, tempMessageId, _createMessageElement2, messageDiv, contentDiv, accumulatedMarkdown, handlePartialResponse, response, botResponse, messageElement, conversation, _t5;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          message = userInput.value.trim();
          if (message) {
            _context3.n = 1;
            break;
          }
          alert("Please enter a message before sending.");
          return _context3.a(2);
        case 1:
          // Check if we have a current conversation, if not create one
          if (!currentConversationId || !conversations.find(function (c) {
            return c.id === currentConversationId;
          })) {
            // Create a new conversation automatically
            _newConversation = createNewConversation();
            currentConversationId = _newConversation.id;
          }

          // Process new message

          // Clear input
          userInput.value = '';

          // Add user message to chat
          addMessage(message, true);

          // Show typing indicator
          showTypingIndicator();
          _context3.p = 2;
          // Remove typing indicator before creating new message
          removeTypingIndicator();

          // Create a temporary message element for streaming updates
          tempMessageId = 'temp-' + Date.now();
          _createMessageElement2 = createMessageElement('', false), messageDiv = _createMessageElement2.messageDiv, contentDiv = _createMessageElement2.contentDiv;
          contentDiv.id = tempMessageId;
          chatMessages.appendChild(messageDiv);
          chatMessages.scrollTop = chatMessages.scrollHeight;
          accumulatedMarkdown = ''; // Listen for partial responses
          handlePartialResponse = function handlePartialResponse(event) {
            var content = event.detail.content;
            accumulatedMarkdown += content;
            var messageElement = document.getElementById(tempMessageId);
            if (messageElement) {
              messageElement.textContent = accumulatedMarkdown;
              try {
                messageElement.innerHTML = marked.parse(accumulatedMarkdown);
                messageElement.querySelectorAll('pre code').forEach(function (block) {
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
          _context3.n = 3;
          return sendToAPI(message);
        case 3:
          response = _context3.v;
          // Remove event listener
          window.removeEventListener('partialResponse', handlePartialResponse);

          // Update the final message
          // Extract the response content based on its format
          botResponse = '';
          if (!response) {
            _context3.n = 4;
            break;
          }
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
          messageElement = document.getElementById(tempMessageId);
          if (messageElement) {
            try {
              messageElement.innerHTML = marked.parse(botResponse);
              // Highlight any code blocks
              messageElement.querySelectorAll('pre code').forEach(function (block) {
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
          conversation = conversations.find(function (c) {
            return c.id === currentConversationId;
          });
          if (conversation) {
            conversation.messages.push({
              role: 'assistant',
              content: botResponse
            });
            conversation.preview = botResponse;
            conversation.timestamp = new Date();
            saveConversations();
            updateHistoryList();
          }
          _context3.n = 5;
          break;
        case 4:
          throw new Error('Invalid API response format');
        case 5:
          _context3.n = 7;
          break;
        case 6:
          _context3.p = 6;
          _t5 = _context3.v;
          console.error('Chat error:', _t5);
          removeTypingIndicator();
          addMessage('Sorry, I encountered an error. Please try again later.', false);
        case 7:
          return _context3.a(2);
      }
    }, _callee3, null, [[2, 6]]);
  }));
  return _handleSendMessage.apply(this, arguments);
}
function getPreferredTheme() {
  var savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function updateThemeIcon(theme) {
  var isDark = theme === 'dark';
  if (themeIcon) {
    themeIcon.className = isDark ? 'ri-sun-line' : 'ri-moon-line';
  }
  if (themeToggle) {
    themeToggle.setAttribute('title', "Switch to ".concat(isDark ? 'light' : 'dark', " mode"));
    themeToggle.setAttribute('aria-label', "Switch to ".concat(isDark ? 'light' : 'dark', " mode"));
  }
}
function setTheme(theme) {
  var updateStorage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  // Make sure we have a string value, not a promise
  var themeValue = typeof theme === 'string' ? theme : 'system';
  document.documentElement.style.setProperty('--transition-normal', 'none');
  document.body.classList.remove('light-theme', 'dark-theme');
  requestAnimationFrame(function () {
    // Ensure we're adding a valid class name
    document.body.classList.add("".concat(themeValue, "-theme"));
    document.documentElement.style.setProperty('--transition-normal', 'all 0.3s ease');
    if (updateStorage) {
      localStorage.setItem('theme', themeValue);
    }
    updateThemeIcon(themeValue);
  });
}

// Initialize theme with proper type checking to avoid Promise errors
var initialTheme = getPreferredTheme();
if (typeof initialTheme === 'string') {
  setTheme(initialTheme, false);
} else if (initialTheme instanceof Promise) {
  // If it's a promise, wait for it to resolve
  initialTheme.then(function (theme) {
    return setTheme(theme || 'system', false);
  })["catch"](function () {
    return setTheme('system', false);
  });
} else {
  // Fallback to system theme
  setTheme('system', false);
}

// Theme toggle event listener
addSafeEventListener(themeToggle, 'click', function () {
  var currentTheme = localStorage.getItem('theme') || getPreferredTheme();
  var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

// Watch for system theme changes
var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
if (mediaQuery) {
  mediaQuery.addEventListener('change', function (e) {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light', false);
    }
  });
}

// Mobile menu toggle
addSafeEventListener(menuToggle, 'click', function () {
  if (chatHistory) {
    chatHistory.classList.toggle('show');
  }
});

// Close sidebar button
addSafeEventListener(closeSidebar, 'click', function () {
  if (chatHistory) {
    chatHistory.classList.remove('show');
  }
});

// Close menu when clicking outside on mobile
document.addEventListener('click', function (e) {
  if (window.innerWidth <= 768) {
    var isClickInsideHistory = chatHistory.contains(e.target);
    var isClickOnToggle = menuToggle.contains(e.target);
    if (!isClickInsideHistory && !isClickOnToggle && chatHistory.classList.contains('show')) {
      chatHistory.classList.remove('show');
    }
  }
});

// User Account Management
addSafeEventListener(userButton, 'click', function () {
  if (userDropdown) {
    userDropdown.classList.toggle('hidden');
  }
});

// Document-level event listener for click outside dropdown
if (document) {
  document.addEventListener('click', function (e) {
    if (userButton && userDropdown && !userButton.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.add('hidden');
    }
  });
}

// Login button functionality
addSafeEventListener(loginButton, 'click', function () {
  window.location.href = 'account.html';
});

// Logout button functionality
addSafeEventListener(logoutButton, 'click', function () {
  if (confirm('Are you sure you want to sign out?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateUserInterface();
    window.location.href = 'account.html';
  }
});
function updateUserInterface() {
  var user = JSON.parse(localStorage.getItem('user'));
  var isAuthenticated = !!localStorage.getItem('token');
  if (isAuthenticated && user) {
    // Update avatar
    var avatarUrl = user.avatar || "https://ui-avatars.com/api/?name=".concat(encodeURIComponent(user.name), "&background=7c3aed&color=fff");
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
    var guestAvatar = 'https://ui-avatars.com/api/?name=Guest&background=7c3aed&color=fff';
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
    console.error("Element for event ".concat(eventType, " not found"));
  }
}

// Event listeners - with safety checks
addSafeEventListener(sendButton, 'click', handleSendMessage);
addSafeEventListener(newChatButton, 'click', createNewConversation);
addSafeEventListener(clearHistoryButton, 'click', clearAllHistory);
if (userInput) {
  userInput.addEventListener('keypress', function (e) {
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
    var userId = getUserId();
    if (userId) {
      // For logged in users, call API to delete conversations from database
      fetch('/api/conversations/clear', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer ".concat(localStorage.getItem('token'))
        }
      }).then(function (response) {
        if (response.ok) {
          // Clear local conversations
          conversations = [];
          saveConversations();
          updateHistoryList();
          createNewConversation(); // Create a fresh conversation
          return response.json();
        }
        throw new Error('Failed to clear conversation history');
      }).then(function (data) {
        console.log('Cleared history:', data);
      })["catch"](function (error) {
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
  var user = JSON.parse(localStorage.getItem('user'));
  return user ? user.id : null;
}

// Load conversations on startup
loadConversations();

// Add initial greeting only if there are no existing conversations
if (conversations.length === 0) {
  // Create a new conversation but prevent duplicate welcome messages
  var newConversation = {
    id: generateId(),
    messages: [],
    timestamp: new Date(),
    preview: '',
    topic: 'New Chat'
  };
  conversations.unshift(newConversation);
  currentConversationId = newConversation.id;

  // Add welcome message only once
  var welcomeMessage = "👋 Hello! I'm your AI assistant. How can I help you today?";
  addMessage(welcomeMessage, false);
  newConversation.messages.push({
    role: 'assistant',
    content: welcomeMessage
  });
  newConversation.preview = welcomeMessage;
  saveConversations();
  updateHistoryList();
  clearChat();
}
/******/ })()
;
//# sourceMappingURL=main.bundle.js.map