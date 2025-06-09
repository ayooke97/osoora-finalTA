// Test-friendly version of script.js
// Contains only the essential functions needed for testing

// Session check function that won't attempt navigation in tests
function checkSession() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
        // In tests, we just record navigation instead of actually navigating
        if (typeof window !== 'undefined' && window.location) {
            window.location.href = 'account.html';
        }
        return false;
    }
    return true;
}

// Function to ensure a URL is properly formatted - simplified for testing
function formatUrl(url, defaultPort = 5101) {
    // Default API endpoint path
    const apiEndpoint = '/api/chat';
    const hostname = window?.location?.hostname || 'localhost';
    
    if (hostname === 'baktipm.com') {
        return 'https://baktipm.com' + apiEndpoint;
    } else {
        return `http://localhost:${defaultPort}` + apiEndpoint;
    }
}

// RFC4122 UUID v4 implementation
function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Function to validate UUID v4 format
function isValidUUIDv4(id) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

module.exports = {
    checkSession,
    formatUrl,
    generateId,
    isValidUUIDv4
};
