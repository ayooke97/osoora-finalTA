// DOM Elements
// API Configuration
const API_BASE_URL = 'http://localhost:5101';

// DOM Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const profileForm = document.getElementById('profile-form');
const themeButton = document.getElementById('theme-button');
const themeDropdown = document.getElementById('theme-dropdown');
const themeIcon = document.getElementById('theme-icon');
const themeOptions = document.querySelectorAll('.theme-option');

// Show/Hide forms
function showForm(formType) {
    loginForm.classList.add('hidden');
    registerForm.classList.add('hidden');
    profileForm.classList.add('hidden');

    switch (formType) {
        case 'login':
            loginForm.classList.remove('hidden');
            break;
        case 'register':
            registerForm.classList.remove('hidden');
            break;
        case 'profile':
            profileForm.classList.remove('hidden');
            break;
    }
}

// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
        const input = button.parentElement.querySelector('input');
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'ri-eye-line';
        } else {
            input.type = 'password';
            icon.className = 'ri-eye-off-line';
        }
    });
});

// Theme management
function getPreferredTheme() {
    // Get theme preference from localStorage or API
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    
    // Default to system theme if no saved preference
    return 'system';
}

function getEffectiveTheme(theme) {
    if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
}

function updateThemeIcon(theme) {
    const effectiveTheme = getEffectiveTheme(theme);
    themeIcon.className = effectiveTheme === 'dark' ? 'ri-moon-line' : 'ri-sun-line';
}

function updateActiveTheme(theme) {
    themeOptions.forEach(option => {
        if (option.dataset.theme === theme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

function setTheme(theme, updateStorage = true) {
    // EMERGENCY FIX: Explicitly reject Promises
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
    
    // Force everything to be a string
    let safeTheme = 'system';
    
    // Only accept exact string matches
    if (theme === 'light' || theme === 'dark' || theme === 'system') {
        safeTheme = theme;
    } else {
        console.warn('setTheme received unsafe value, defaulting to system:', typeof theme, theme);
    }
    
    const effectiveTheme = getEffectiveTheme(safeTheme);
    
    document.documentElement.style.setProperty('--transition-normal', 'none');
    document.body.classList.remove('light-theme', 'dark-theme');
    
    requestAnimationFrame(() => {
        // BULLETPROOF: Only allow exact strings
        let finalTheme = 'system';
        if (effectiveTheme === 'light' || effectiveTheme === 'dark') {
            finalTheme = effectiveTheme;
        }
        
        // TRIPLE CHECK: Ensure finalTheme is never a Promise before creating CSS class
        if (typeof finalTheme !== 'string' || finalTheme.includes('object Promise')) {
            console.error('EMERGENCY: finalTheme is not a safe string!', typeof finalTheme, finalTheme);
            finalTheme = 'system'; // Force to safe value
        }
        
        // Add the theme class with guaranteed string
        const themeClass = `${finalTheme}-theme`;
        console.log('Adding CSS class:', themeClass); // Debug log
        
        // EMERGENCY: Final validation before adding to DOM
        if (typeof themeClass !== 'string' || themeClass.includes('Promise') || themeClass.includes('object')) {
            console.error('CRITICAL: themeClass is unsafe!', themeClass);
            const safeClass = 'system-theme';
            console.log('Using safe fallback:', safeClass);
            document.body.classList.add(safeClass);
        } else {
            document.body.classList.add(themeClass);
        }
        document.documentElement.style.setProperty('--transition-normal', 'all 0.3s ease');
        
        if (updateStorage) {
            localStorage.setItem('theme', safeTheme);
        }
        
        updateThemeIcon(safeTheme);
        updateActiveTheme(safeTheme);
    });
}

// Theme dropdown toggle
themeButton.addEventListener('click', () => {
    themeDropdown.classList.toggle('hidden');
});

// Close theme dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!themeButton.contains(e.target) && !themeDropdown.contains(e.target)) {
        themeDropdown.classList.add('hidden');
    }
});

// Theme option selection
themeOptions.forEach(option => {
    option.addEventListener('click', async () => {
        const theme = option.dataset.theme;
        setTheme(theme); // Update UI immediately
        themeDropdown.classList.add('hidden');
        
        // Update server preferences if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            try {
                console.log('Updating server theme preference to:', theme);
                const response = await authenticatedFetch(`${API_BASE_URL}/api/user/preferences`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ theme })
                });
                if (response && response.ok) {
                    console.log('Server theme preference updated successfully');
                } else {
                    console.log('Failed to update server theme preference');
                }
            } catch (error) {
                console.error('Error updating server theme:', error);
            }
        }
    });
});

// Watch for system theme changes
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', (e) => {
    const currentTheme = localStorage.getItem('theme') || 'system';
    if (currentTheme === 'system') {
        setTheme('system', false);
    }
});

// Initialize theme with string value to avoid Promise issues
(async () => {
    try {
        const token = localStorage.getItem('token');
        let initialTheme = 'system';
        
        if (token) {
            // User is logged in, try to get preferences from API
            try {
                const prefsResponse = await authenticatedFetch(`${API_BASE_URL}/api/user/preferences`);
                if (prefsResponse && prefsResponse.ok) {
                    const prefs = await prefsResponse.json();
                    initialTheme = prefs.theme || 'system';
                    console.log('Account.js loaded theme from API:', initialTheme);
                } else if (prefsResponse && prefsResponse.status === 404) {
                    // Preferences don't exist, POST to create them first
                    console.log('No preferences found, creating default with POST...');
                    const createResponse = await authenticatedFetch(`${API_BASE_URL}/api/user/preferences`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ theme: 'system' })
                    });
                    if (createResponse && createResponse.ok) {
                        initialTheme = 'system';
                        console.log('Account.js created preferences with POST, theme:', initialTheme);
                    } else {
                        initialTheme = getPreferredTheme();
                        console.log('Account.js POST failed, using localStorage:', initialTheme);
                    }
                } else {
                    // Other API error, fallback to localStorage
                    initialTheme = getPreferredTheme();
                    console.log('Account.js API error, using localStorage:', initialTheme);
                }
            } catch (error) {
                console.log('Failed to load preferences from API, using localStorage:', error.message);
                initialTheme = getPreferredTheme();
            }
        } else {
            // No token, use localStorage theme
            initialTheme = getPreferredTheme();
            console.log('Account.js no token, using localStorage theme:', initialTheme);
        }
        
        // Force to string to prevent any Promise issues
        if (typeof initialTheme === 'string') {
            setTheme(initialTheme, false);
        } else if (initialTheme && typeof initialTheme.then === 'function') {
            // Handle if somehow we still get a Promise
            try {
                const resolvedTheme = await initialTheme;
                setTheme(resolvedTheme || 'system', false);
            } catch {
                setTheme('system', false);
            }
        } else {
            setTheme('system', false);
        }
    } catch (error) {
        console.error('Error initializing theme in account.js:', error);
        setTheme('system', false);
    }
})();

// Form submissions
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        // Make login API call with absolute URL
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            throw new Error(`Login failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Store user data and token
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        // Auto-create user preferences if they don't exist
        try {
            const prefsResponse = await authenticatedFetch(`${API_BASE_URL}/api/user/preferences`);
            if (!prefsResponse || prefsResponse.status === 404) {
                console.log('Creating default user preferences...');
                const createResponse = await authenticatedFetch(`${API_BASE_URL}/api/user/preferences`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ theme: 'system' })
                });
                if (createResponse && createResponse.ok) {
                    console.log('Default preferences created successfully');
                }
            }
        } catch (error) {
            console.log('Preferences will be created when needed:', error.message);
        }
        
        // Redirect to chat
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    try {
        // Make registration API call
        const response = await authenticatedFetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                username: name, 
                email: email, 
                password: password 
            })
        });
        
        if (!response) {
            return; // Request was redirected due to auth error
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Registration failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Registration successful - show success message and switch to login
        alert('Registration successful! Please login with your new account.');
        showForm('login');
        
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed: ' + error.message);
    }
});

profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('profile-name').value;
    const currentPassword = document.getElementById('profile-current-password').value;
    const newPassword = document.getElementById('profile-new-password').value;
    
    try {
        // TODO: Implement profile update API call
        console.log('Update profile:', { name, currentPassword, newPassword });
    } catch (error) {
        console.error('Profile update error:', error);
    }
});

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login page - fixed incorrect function call syntax
        window.location.href = 'account.html';
    }
}

// Check authentication status on page load
async function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        // Auto-create user preferences if they don't exist (for existing users)
        try {
            const prefsResponse = await authenticatedFetch(`${API_BASE_URL}/api/user/preferences`);
            if (!prefsResponse || prefsResponse.status === 404) {
                console.log('Creating default user preferences for existing user...');
                const createResponse = await authenticatedFetch(`${API_BASE_URL}/api/user/preferences`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ theme: 'system' })
                });
                if (createResponse && createResponse.ok) {
                    console.log('Default preferences created successfully');
                }
            }
        } catch (error) {
            console.log('Preferences will be created when needed:', error.message);
        }
        
        showForm('profile');
    } else {
        showForm('login');
    }
}

// Initialize page
checkAuth();
