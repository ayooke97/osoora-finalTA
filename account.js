// DOM Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const profileForm = document.getElementById('profile-form');
const themeButton = document.getElementById('theme-button');
const themeDropdown = document.getElementById('theme-dropdown');
const themeIcon = document.getElementById('theme-icon');
const themeOptions = document.querySelectorAll('.theme-option');

// API Base URL
const API_BASE_URL = '';

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
async function getPreferredTheme() {
    // Try to get theme from API if authenticated
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/preferences`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const preferences = await response.json();
                return preferences.theme || 'system';
            }
        } catch (error) {
            console.error('Error fetching user preferences:', error);
        }
    }
    
    // Fallback to local storage if API fails or user not authenticated
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
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

async function setTheme(theme, updateStorage = true) {
    const effectiveTheme = getEffectiveTheme(theme);
    
    document.documentElement.style.setProperty('--transition-normal', 'none');
    document.body.classList.remove('light-theme', 'dark-theme');
    
    requestAnimationFrame(() => {
        document.body.classList.add(`${effectiveTheme}-theme`);
        document.documentElement.style.setProperty('--transition-normal', 'all 0.3s ease');
        
        if (updateStorage) {
            // Always update localStorage for fallback
            localStorage.setItem('theme', theme);
            
            // Update theme in MongoDB if user is authenticated
            const token = localStorage.getItem('token');
            if (token) {
                fetch(`${API_BASE_URL}/api/user/preferences`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ theme })
                }).catch(error => console.error('Error updating theme preference:', error));
            }
        }
        
        updateThemeIcon(theme);
        updateActiveTheme(theme);
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

// Initialize theme
const initialTheme = getPreferredTheme();
setTheme(initialTheme, false);

// Form submissions
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Clear previous error messages
    const errorElement = document.getElementById('login-error');
    if (errorElement) errorElement.textContent = '';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        
        // Store token and basic user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            user_id: data.user.user_id,
            username: data.user.username,
            email: data.user.email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.username)}&background=7c3aed&color=fff`
        }));
        
        // Apply user's preferred theme
        if (data.user.preferences && data.user.preferences.theme) {
            setTheme(data.user.preferences.theme, false);
        }
        
        // Redirect to chat
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Login error:', error);
        // Display error to user
        if (errorElement) {
            errorElement.textContent = error.message;
        } else {
            alert(`Login failed: ${error.message}`);
        }
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Clear previous error messages
    const errorElement = document.getElementById('register-error');
    if (errorElement) errorElement.textContent = '';
    
    if (password !== confirmPassword) {
        if (errorElement) {
            errorElement.textContent = 'Passwords do not match';
        } else {
            alert('Passwords do not match');
        }
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }
        
        // Show success message
        alert('Registration successful! Please log in.');
        showForm('login');
    } catch (error) {
        console.error('Registration error:', error);
        // Display error to user
        if (errorElement) {
            errorElement.textContent = error.message;
        } else {
            alert(`Registration failed: ${error.message}`);
        }
    }
});

profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('profile-name').value;
    const currentPassword = document.getElementById('profile-current-password').value;
    const newPassword = document.getElementById('profile-new-password').value;
    
    // Clear previous error messages
    const errorElement = document.getElementById('profile-error');
    const successElement = document.getElementById('profile-success');
    if (errorElement) errorElement.textContent = '';
    if (successElement) successElement.textContent = '';
    
    // Check if any fields are filled
    if (!username && !currentPassword && !newPassword) {
        if (errorElement) {
            errorElement.textContent = 'No changes provided';
        }
        return;
    }
    
    // Validate password change
    if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
        if (errorElement) {
            errorElement.textContent = 'Both current and new password must be provided to change password';
        }
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('You are not logged in');
        }
        
        const requestBody = {};
        if (username) requestBody.username = username;
        if (currentPassword && newPassword) {
            requestBody.current_password = currentPassword;
            requestBody.new_password = newPassword;
        }
        
        const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Profile update failed');
        }
        
        // Update local storage user data
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (data.user && data.user.username) {
            userData.username = data.user.username;
            userData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.username)}&background=7c3aed&color=fff`;
            localStorage.setItem('user', JSON.stringify(userData));
        }
        
        // Display success message
        if (successElement) {
            successElement.textContent = 'Profile updated successfully';
        }
        
        // Reset password fields
        document.getElementById('profile-current-password').value = '';
        document.getElementById('profile-new-password').value = '';
        
    } catch (error) {
        console.error('Profile update error:', error);
        // Display error to user
        if (errorElement) {
            errorElement.textContent = error.message;
        } else {
            alert(`Profile update failed: ${error.message}`);
        }
    }
});

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Remove user data and token from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = 'account.html';
    }
}

// Check authentication status on page load
async function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            // Validate token by fetching user preferences
            const response = await fetch(`${API_BASE_URL}/api/user/preferences`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                // Token is valid, show profile form
                showForm('profile');
                
                // Fill profile form with user data
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                if (userData.username) {
                    document.getElementById('profile-name').value = userData.username;
                }
                
                return;
            }
        } catch (error) {
            console.error('Token validation error:', error);
        }
        
        // If we got here, token is invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    
    // No valid token, show login form
    showForm('login');
}

// Initialize page
checkAuth();
