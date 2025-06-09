// Mock implementation of the script.js functions needed for tests
// This avoids all the JSDOM window.location issues

const checkSession = jest.fn(() => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    // Just record that we would navigate, don't actually try to do it
    if (window && window.location) {
      window.location.href = 'account.html';
    }
    return false;
  }
  return true;
});

const formatUrl = jest.fn((url, defaultPort = 5101) => {
  const hostname = window.location.hostname || 'localhost';
  
  if (hostname === 'baktipm.com') {
    return 'https://baktipm.com/api/chat';
  } else {
    return `http://localhost:${defaultPort}/api/chat`;
  }
});

const generateId = jest.fn(() => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
});

const isValidUUIDv4 = jest.fn((id) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
});

module.exports = {
  checkSession,
  formatUrl,
  generateId,
  isValidUUIDv4
};
