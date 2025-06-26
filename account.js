// DOM Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const profileForm = document.getElementById('profile-form');
const themeButton = document.getElementById('theme-button');
const themeDropdown = document.getElementById('theme-dropdown');
const themeIcon = document.getElementById('theme-icon');
const themeOptions = document.querySelectorAll('.theme-option');

// API Base URL - Using empty string for relative URLs
const API_BASE_URL = '';

// Show/Hide forms
function showForm(formType) {
    // First, hide all forms
    loginForm.classList.add('hidden');
    registerForm.classList.add('hidden');
    profileForm.classList.add('hidden');

    // Then show only the requested form
    switch (formType) {
        case 'login':
            loginForm.classList.remove('hidden');
            // Reset display style that might have been set
            loginForm.style.display = '';
            break;
        case 'register':
            registerForm.classList.remove('hidden');
            break;
        case 'profile':
            profileForm.classList.remove('hidden');
            // Ensure login form is hidden when profile is shown
            loginForm.style.display = 'none';
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
    
    // Get login button for loading state
    const loginButton = loginForm.querySelector('button[type="submit"]');
    const originalButtonText = loginButton.textContent;
    
    // Show loading state
    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';
    
    try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            // Try to parse the JSON response
            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                console.error('Error parsing JSON response:', jsonError);
                throw new Error('Unexpected response from server. Please try again.');
            }
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            
            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Show profile form
            showForm('profile');
            
            // Set session flag to prevent redirect loops
            sessionStorage.setItem('authChecked', 'true');
            
            // Populate profile form with user data
            if (data.user) {
                if (data.user.username) {
                    document.getElementById('profile-name').value = data.user.username;
                }
                if (data.user.email) {
                    document.getElementById('profile-email').value = data.user.email;
                }
            }
        } catch (fetchError) {
            console.error('Fetch error during login:', fetchError);
            
            // Handle specific network errors
            if (fetchError.name === 'AbortError') {
                throw new Error('Login request timed out. Please try again.');
            } else if (fetchError.message === 'Failed to fetch' || fetchError.name === 'TypeError') {
                throw new Error('Network error. Please check your internet connection and try again.');
            }
            
            // Re-throw other errors
            throw fetchError;
        }
    } catch (error) {
        console.error('Login error:', error);
        // Display error to user
        if (errorElement) {
            errorElement.textContent = error.message;
        } else {
            alert(`Login failed: ${error.message}`);
        }
    } finally {
        // Reset button state
        loginButton.disabled = false;
        loginButton.textContent = originalButtonText;
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    // Clear previous error messages
    const errorElement = document.getElementById('register-error');
    const successElement = document.getElementById('register-success');
    if (errorElement) errorElement.textContent = '';
    if (successElement) successElement.textContent = '';
    
    // Get register button for loading state
    const registerButton = registerForm.querySelector('button[type="submit"]');
    const originalButtonText = registerButton.textContent;
    
    // Show loading state
    registerButton.disabled = true;
    registerButton.textContent = 'Registering...';
    
    try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            // Try to parse the JSON response
            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                console.error('Error parsing JSON response:', jsonError);
                throw new Error('Unexpected response from server. Please try again.');
            }
            
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }
            
            // Show success message
            if (successElement) {
                successElement.textContent = 'Registration successful! You can now log in.';
            }
            
            // Clear form
            document.getElementById('register-name').value = '';
            document.getElementById('register-email').value = '';
            document.getElementById('register-password').value = '';
            
            // Switch to login form after a delay
            setTimeout(() => {
                showForm('login');
            }, 2000);
        } catch (fetchError) {
            console.error('Fetch error during registration:', fetchError);
            
            // Handle specific network errors
            if (fetchError.name === 'AbortError') {
                throw new Error('Registration request timed out. Please try again.');
            } else if (fetchError.message === 'Failed to fetch' || fetchError.name === 'TypeError') {
                throw new Error('Network error. Please check your internet connection and try again.');
            }
            
            // Re-throw other errors
            throw fetchError;
        }
    } catch (error) {
        console.error('Registration error:', error);
        // Display error to user
        if (errorElement) {
            errorElement.textContent = error.message;
        } else {
            alert(`Registration failed: ${error.message}`);
        }
    } finally {
        // Reset button state
        registerButton.disabled = false;
        registerButton.textContent = originalButtonText;
    }
});

profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form elements
    const username = document.getElementById('profile-name').value;
    const currentPassword = document.getElementById('profile-current-password').value;
    const newPassword = document.getElementById('profile-new-password').value;
    const confirmPassword = document.getElementById('profile-confirm-password').value;
    
    // Get UI elements for feedback
    const errorElement = document.getElementById('profile-error');
    const successElement = document.getElementById('profile-success');
    const saveButton = document.getElementById('save-profile-btn');
    const saveButtonText = saveButton.querySelector('.btn-text');
    const saveButtonLoader = saveButton.querySelector('.btn-loader');
    
    // Clear previous messages
    if (errorElement) errorElement.textContent = '';
    if (successElement) successElement.textContent = '';
    
    // Get current user data to check for actual changes
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUsername = userData.username || '';
    
    // Check if username was actually changed
    const isUsernameChanged = username && username !== currentUsername;
    
    // Check if any fields are filled or changed
    if (!isUsernameChanged && !currentPassword && !newPassword && !confirmPassword) {
        if (errorElement) {
            errorElement.textContent = 'No changes provided';
        }
        return;
    }
    
    // Validate password change
    const isPasswordChangeAttempted = currentPassword || newPassword || confirmPassword;
    
    if (isPasswordChangeAttempted) {
        // Check if all password fields are filled
        if (!currentPassword) {
            if (errorElement) {
                errorElement.textContent = 'Current password is required to change password';
            }
            return;
        }
        
        if (!newPassword) {
            if (errorElement) {
                errorElement.textContent = 'New password is required';
            }
            return;
        }
        
        if (!confirmPassword) {
            if (errorElement) {
                errorElement.textContent = 'Please confirm your new password';
            }
            return;
        }
        
        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            if (errorElement) {
                errorElement.textContent = 'New passwords do not match';
            }
            return;
        }
        
        // Basic password strength validation
        if (newPassword.length < 8) {
            if (errorElement) {
                errorElement.textContent = 'New password must be at least 8 characters long';
            }
            return;
        }
    }
    
    try {
        // Show loading state
        saveButtonText.textContent = 'Saving...';
        saveButtonLoader.classList.remove('hidden');
        saveButton.disabled = true;
        
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('You are not logged in');
        }
        
        const requestBody = {};
        
        // Only include username if it was actually changed
        if (isUsernameChanged) {
            requestBody.username = username;
        }
        
        // Handle password change if attempted
        const isPasswordChangeAttempted = currentPassword && newPassword && confirmPassword;
        if (isPasswordChangeAttempted) {
            requestBody.current_password = currentPassword;
            requestBody.new_password = newPassword;
        }
        
        // Check if there are any changes to submit
        if (Object.keys(requestBody).length === 0) {
            if (errorElement) {
                errorElement.textContent = 'No changes to save';
            }
            // Reset button state
            saveButtonText.textContent = 'Save Changes';
            saveButtonLoader.classList.add('hidden');
            saveButton.disabled = false;
            return;
        }
        
        try {
            // Add a small delay to show loading state
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Make the API call with proper error handling
            let data;
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
                
                const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody),
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                // Check if the response is ok before trying to parse JSON
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Your session has expired. Please log in again.');
                    } else if (response.status === 403) {
                        throw new Error('You do not have permission to update this profile.');
                    } else if (response.status === 400) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Invalid request. Please check your inputs.');
                    } else {
                        throw new Error(`Server error (${response.status}). Please try again later.`);
                    }
                }
                
                // Try to parse the JSON response
                try {
                    data = await response.json();
                } catch (jsonError) {
                    console.error('Error parsing JSON response:', jsonError);
                    throw new Error('Unexpected response from server. Please try again.');
                }
            } catch (fetchError) {
                console.error('Fetch error:', fetchError);
                
                // If it's a network error (Failed to fetch), provide a more user-friendly message
                if (fetchError.message === 'Failed to fetch' || fetchError.name === 'TypeError') {
                    throw new Error('Network error. Please check your internet connection and try again.');
                }
                
                // Re-throw the error if it's not a network error
                throw fetchError;
            }
            
            // If we couldn't get data from the server, use local data for demo purposes
            if (!data) {
                console.log('Using fallback data for demo');
                data = {
                    success: true,
                    user: {
                        username: username || userData.username,
                        email: userData.email
                    }
                };
            }
            
            // Update local storage user data
            if (isUsernameChanged) {
                userData.username = data.user.username;
                userData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.username)}&background=7c3aed&color=fff`;
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Update profile image if it exists
                const profileImage = document.getElementById('profile-image');
                if (profileImage) {
                    profileImage.src = userData.avatar;
                }
            }
            
            // Display appropriate success message
            if (successElement) {
                if (isPasswordChangeAttempted && isUsernameChanged) {
                    successElement.textContent = 'Profile and password updated successfully';
                } else if (isPasswordChangeAttempted) {
                    successElement.textContent = 'Password updated successfully';
                } else if (isUsernameChanged) {
                    successElement.textContent = 'Profile name updated successfully';
                } else {
                    successElement.textContent = 'No changes were made';
                }
            }
            
            // Reset all password fields
            document.getElementById('profile-current-password').value = '';
            document.getElementById('profile-new-password').value = '';
            document.getElementById('profile-confirm-password').value = '';
            
            // Scroll to the success message
            if (successElement) {
                successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                if (successElement && successElement.textContent) {
                    successElement.textContent = '';
                }
            }, 5000);
        } catch (error) {
            throw error;
        }
        
    } catch (error) {
        console.error('Profile update error:', error);
        
        // Display error to user
        if (errorElement) {
            errorElement.textContent = error.message;
            // Scroll to the error message
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            alert(`Profile update failed: ${error.message}`);
        }
    } finally {
        // Reset button state regardless of success or failure
        saveButtonText.textContent = 'Save Changes';
        saveButtonLoader.classList.add('hidden');
        saveButton.disabled = false;
    }
});

// Logout function with improved UX and error handling
function logout() {
    try {
        // Get the logout button to show loading state
        const logoutButton = document.querySelector('.btn-danger');
        const originalText = logoutButton.textContent;
        
        // Ask for confirmation
        if (confirm('Are you sure you want to sign out?')) {
            // Show loading state
            logoutButton.disabled = true;
            logoutButton.textContent = 'Signing out...';
            
            // Clear session storage first
            sessionStorage.removeItem('authChecked');
            
            // Clear all authentication data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Add a small delay to show the loading state
            setTimeout(() => {
                // Show the login form
                showForm('login');
                
                // Reset the button
                logoutButton.disabled = false;
                logoutButton.textContent = originalText;
                
                // Show a success message
                const loginSuccessElement = document.getElementById('login-success');
                if (loginSuccessElement) {
                    loginSuccessElement.textContent = 'You have been successfully signed out.';
                    
                    // Auto-hide the message after 5 seconds
                    setTimeout(() => {
                        if (loginSuccessElement.textContent) {
                            loginSuccessElement.textContent = '';
                        }
                    }, 5000);
                }
            }, 500);
        }
    } catch (error) {
        console.error('Error during logout:', error);
        alert('There was an error signing out. Please try again.');
    }
}

// Check authentication status
async function checkAuth() {
    // If we've already checked auth in this session, don't redirect again
    if (sessionStorage.getItem('authChecked')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    // If we have a token, show the profile form immediately
    if (token) {
        showForm('profile');
        
        // Then validate the token in the background
        try {
            // Add a small timeout to prevent immediate validation
            // This gives the UI time to render first
            await new Promise(resolve => setTimeout(resolve, 100));
            
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
                
                const response = await fetch(`${API_BASE_URL}/api/user/preferences`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    // If token is invalid, clear it and show login form
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    showForm('login');
                } else {
                    // Mark that we've checked auth in this session
                    sessionStorage.setItem('authChecked', 'true');
                }
            } catch (fetchError) {
                console.error('Error validating token:', fetchError);
                
                // Handle specific network errors
                if (fetchError.name === 'AbortError') {
                    console.warn('Token validation request timed out');
                    // Don't log out the user on timeout, just mark as checked
                    sessionStorage.setItem('authChecked', 'true');
                } else if (fetchError.message === 'Failed to fetch' || fetchError.name === 'TypeError') {
                    console.warn('Network error during token validation');
                    // Don't log out the user on network error, just mark as checked
                    sessionStorage.setItem('authChecked', 'true');
                }
                
                // On network error, keep showing profile form (don't log user out)
                // This prevents users from being logged out when offline
            }
        } catch (error) {
            console.error('Token validation error:', error);
            // Don't clear token on network errors to prevent poor user experience
            // Just ensure profile form is shown if we already have user data
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            if (userData.username && userData.email) {
                // Keep showing profile form on network errors
                return;
            }
        }
    } else {
        // No token, show login form
        showForm('login');
    }
}

// Validate token in background without blocking UI
async function validateTokenInBackground(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/user/preferences`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            // Token is invalid, clear storage and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            showForm('login');
        }
    } catch (error) {
        console.error('Background token validation error:', error);
        // Don't redirect on network errors to prevent poor user experience
    }
}

// Initialize page - run this code immediately, not waiting for DOMContentLoaded
(function() {
    // Check if token exists and show profile form immediately
    const token = localStorage.getItem('token');
    
    // Set a flag in sessionStorage to indicate we've already checked
    // This prevents any race conditions or multiple redirects
    if (!sessionStorage.getItem('auth_checked')) {
        sessionStorage.setItem('auth_checked', 'true');
        
        if (token) {
            // Force profile form to be shown immediately
            window.addEventListener('DOMContentLoaded', function() {
                // Force display of profile form
                document.getElementById('login-form').classList.add('hidden');
                document.getElementById('login-form').style.display = 'none';
                document.getElementById('register-form').classList.add('hidden');
                document.getElementById('profile-form').classList.remove('hidden');
                
                // Fill profile form with user data
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                if (userData.username) {
                    document.getElementById('profile-name').value = userData.username;
                }
                if (userData.email) {
                    document.getElementById('profile-email').value = userData.email;
                }
                
                // Validate token in background
                setTimeout(validateTokenInBackground, 500, token);
            });
        } else {
            // No token, show login form
            window.addEventListener('DOMContentLoaded', function() {
                showForm('login');
            });
        }
    }
})();
