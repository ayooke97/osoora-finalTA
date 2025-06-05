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
    // Make sure we have a string value, not a promise
    const themeValue = typeof theme === 'string' ? theme : 'system';
    const effectiveTheme = getEffectiveTheme(themeValue);
    
    document.documentElement.style.setProperty('--transition-normal', 'none');
    document.body.classList.remove('light-theme', 'dark-theme');
    
    requestAnimationFrame(() => {
        // Ensure effectiveTheme is a string
        const themeClass = `${effectiveTheme}-theme`;
        document.body.classList.add(themeClass);
        document.documentElement.style.setProperty('--transition-normal', 'all 0.3s ease');
        
        if (updateStorage) {
            localStorage.setItem('theme', themeValue);
        }
        
        updateThemeIcon(themeValue);
        updateActiveTheme(themeValue);
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
    option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        setTheme(theme);
        themeDropdown.classList.add('hidden');
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
        // TODO: Implement registration API call
        console.log('Register:', { name, email, password });
        showForm('login');
    } catch (error) {
        console.error('Registration error:', error);
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
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        // TODO: Validate token and load user data
        showForm('profile');
    } else {
        showForm('login');
    }
}

// Initialize page
checkAuth();
