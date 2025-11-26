// Header Authentication Management
// Handles showing/hiding auth UI based on login status

function initializeHeaderAuth() {
    updateAuthUI();
    
    // Listen for storage changes (multi-tab sync)
    window.addEventListener('storage', updateAuthUI);
    
    // Listen for visibility changes (tab switching)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            updateAuthUI();
        }
    });
}

function updateAuthUI() {
    const user = localStorage.getItem('user');
    
    // Get auth and profile elements
    const authButtons = document.getElementById('auth-buttons-container');
    const profileMenu = document.getElementById('user-profile-container');
    const navSignupBtn = document.getElementById('nav-signup-btn');
    const navLoginBtn = document.getElementById('nav-login-btn');
    
    if (user) {
        // User is logged in
        // Hide login/signup buttons
        if (authButtons) authButtons.style.display = 'none';
        if (navSignupBtn) navSignupBtn.style.display = 'none';
        if (navLoginBtn) navLoginBtn.style.display = 'none';
        
        // Show profile menu
        if (profileMenu) profileMenu.style.display = 'flex';
        
        // Initialize profile data
        initializeProfile();
    } else {
        // User is a guest
        // Show login/signup buttons
        if (authButtons) authButtons.style.display = 'block';
        if (navSignupBtn) navSignupBtn.style.display = 'block';
        if (navLoginBtn) navLoginBtn.style.display = 'block';
        
        // Hide profile menu
        if (profileMenu) profileMenu.style.display = 'none';
    }
}

function initializeProfile() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (user && user.username) {
        // Update profile username in header toggle
        const profileUsername = document.getElementById('profile-username');
        if (profileUsername) {
            profileUsername.textContent = user.username;
        }
        
        // Update profile username in dropdown header
        const dropdownUsername = document.getElementById('dropdown-username');
        if (dropdownUsername) {
            dropdownUsername.textContent = user.username;
        }
        
        // Update role
        const dropdownRole = document.getElementById('dropdown-role');
        if (dropdownRole && user.role) {
            const roleText = user.role === 'USER' ? 'Candidate' : user.role === 'ADMIN' ? 'Employer' : user.role;
            dropdownRole.textContent = roleText;
        }
    }
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

function goToProfile() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'ADMIN' || user.role === 'EMPLOYER') {
        window.location.href = 'employer-profile.html';
    } else {
        window.location.href = 'candidate-profile.html';
    }
}

function goToSettings() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'ADMIN' || user.role === 'EMPLOYER') {
        window.location.href = 'employer-change-password.html';
    } else {
        window.location.href = 'candidate-change-password.html';
    }
}

function handleLogout() {
    localStorage.removeItem('user');
    // Close dropdown if open
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
    window.location.href = 'index.html';
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initializeHeaderAuth();
        setupDropdownOutsideClick();
    });
} else {
    initializeHeaderAuth();
    setupDropdownOutsideClick();
}

// Setup closing dropdown when clicking outside
function setupDropdownOutsideClick() {
    document.addEventListener('click', function(e) {
        const profileContainer = document.getElementById('user-profile-container');
        if (profileContainer && !profileContainer.contains(e.target)) {
            const dropdown = document.getElementById('profile-dropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        }
    });
}

// Run initialization with delay to ensure DOM is fully ready
setTimeout(function() {
    initializeHeaderAuth();
}, 100);
