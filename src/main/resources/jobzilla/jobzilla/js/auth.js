// Authentication utility functions
// Store user data in localStorage when logged in
// Check authentication when accessing protected pages

// Check if user is logged in
function isUserLoggedIn() {
    const user = localStorage.getItem('currentUser');
    return user !== null;
}

// Get current logged-in user
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Get user role (candidate or admin/employer)
function getUserRole() {
    const user = getCurrentUser();
    return user ? user.role : null;
}

// Save user to localStorage after login
function saveUserSession(username, role) {
    const userData = {
        username: username,
        role: role,
        loginTime: new Date().getTime()
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    console.log('User session saved:', userData);
}

// Logout user
function logoutUser() {
    localStorage.removeItem('currentUser');
    console.log('User logged out');
}

// Check access for protected pages
function checkPageAccess(requiredRole) {
    const user = getCurrentUser();
    
    if (!user) {
        // Not logged in - show login required popup
        showLoginRequiredPopup();
        return false;
    }
    
    if (requiredRole && user.role !== requiredRole) {
        // Logged in but wrong role
        showAccessDeniedPopup();
        return false;
    }
    
    return true;
}

// Show "Login Required" popup with styled modal
function showLoginRequiredPopup() {
    const modal = document.createElement('div');
    modal.id = 'loginRequiredModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 15px;
        padding: 40px;
        max-width: 450px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease-out;
    `;
    
    modalContent.innerHTML = `
        <div style="margin-bottom: 20px;">
            <i class="fas fa-lock" style="font-size: 48px; color: white; margin-bottom: 20px;"></i>
        </div>
        <h2 style="color: white; margin-bottom: 15px; font-size: 28px; font-weight: bold;">Authentication Required</h2>
        <p style="color: rgba(255, 255, 255, 0.9); margin-bottom: 30px; font-size: 16px; line-height: 1.6;">
            You need to log in first to access this page. Please log in or register to continue.
        </p>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button onclick="redirectToLogin()" style="
                background-color: white;
                color: #667eea;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                Log In
            </button>
            <button onclick="redirectToSignup()" style="
                background-color: rgba(255, 255, 255, 0.2);
                color: white;
                border: 2px solid white;
                padding: 12px 30px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                transition: all 0.3s ease;
            " onmouseover="this.style.backgroundColor='rgba(255, 255, 255, 0.3)'" onmouseout="this.style.backgroundColor='rgba(255, 255, 255, 0.2)'">
                Sign Up
            </button>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// Show "Access Denied" popup
function showAccessDeniedPopup() {
    const modal = document.createElement('div');
    modal.id = 'accessDeniedModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        border-radius: 15px;
        padding: 40px;
        max-width: 450px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease-out;
    `;
    
    modalContent.innerHTML = `
        <div style="margin-bottom: 20px;">
            <i class="fas fa-ban" style="font-size: 48px; color: white; margin-bottom: 20px;"></i>
        </div>
        <h2 style="color: white; margin-bottom: 15px; font-size: 28px; font-weight: bold;">Access Denied</h2>
        <p style="color: rgba(255, 255, 255, 0.9); margin-bottom: 30px; font-size: 16px; line-height: 1.6;">
            You don't have permission to access this page. Please make sure you're logged in with the correct account.
        </p>
        <button onclick="redirectToIndex()" style="
            background-color: white;
            color: #f5576c;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            transition: all 0.3s ease;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Go to Home
        </button>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// Redirect functions
function redirectToLogin() {
    window.location.href = 'after-login.html';
}

function redirectToSignup() {
    window.location.href = 'register.html';
}

function redirectToIndex() {
    window.location.href = 'index.html';
}

// Close modal and redirect
function closeLoginModalAndRedirect(redirectUrl) {
    const modal = document.getElementById('loginRequiredModal');
    if (modal) {
        modal.remove();
    }
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, 500);
}

// Protected page check - call this in the <head> or beginning of <body> of protected pages
function protectPage(requiredRole = null) {
    const user = getCurrentUser();
    
    if (!user) {
        // Not logged in - show login popup and prevent page load
        showLoginRequiredPopup();
        // Prevent page content from loading
        document.body.style.opacity = '0';
        document.body.style.pointerEvents = 'none';
        return false;
    }
    
    if (requiredRole && user.role !== requiredRole) {
        // Wrong role - show access denied and prevent page load
        showAccessDeniedPopup();
        document.body.style.opacity = '0';
        document.body.style.pointerEvents = 'none';
        return false;
    }
    
    // User has access - make page visible
    if (document.body.style.opacity === '0') {
        document.body.style.opacity = '1';
        document.body.style.pointerEvents = 'auto';
    }
    return true;
}

// Quick check for profile pages - returns true if user can view, false otherwise
function canAccessProfilePage() {
    const user = getCurrentUser();
    return user !== null;
}

// Update modal buttons to work with closing
function updateLoginModalActions() {
    // Update button actions to close modal after redirect
    const buttons = document.querySelectorAll('button[onclick="redirectToLogin()"]');
    buttons.forEach(btn => {
        btn.onclick = () => closeLoginModalAndRedirect('after-login.html');
    });
    
    const signupButtons = document.querySelectorAll('button[onclick="redirectToSignup()"]');
    signupButtons.forEach(btn => {
        btn.onclick = () => closeLoginModalAndRedirect('register.html');
    });
}

// ============================================
// PROFILE DISPLAY & DROPDOWN MENU
// ============================================

// Initialize user profile display in header
function initializeUserProfileDisplay() {
    const user = getCurrentUser();
    
    // Only show profile if user is logged in
    if (!user) {
        console.log('No user logged in, skipping profile display');
        return;
    }
    
    // Create profile display container if it doesn't exist
    let profileContainer = document.getElementById('user-profile-container');
    if (!profileContainer) {
        profileContainer = createProfileContainer();
    }
    
    // Update profile info
    updateProfileDisplay(user);
}

// Create profile container in header
function createProfileContainer() {
    // Find the header's nav area - look for extra-nav or similar
    let navArea = document.querySelector('.extra-nav') || 
                  document.querySelector('.header-nav-btn-section') ||
                  document.querySelector('.header-2-nav');
    
    if (!navArea) {
        console.warn('Header nav area not found');
        return null;
    }
    
    const profileHTML = `
        <div id="user-profile-container" class="user-profile-menu">
            <style>
                .user-profile-menu {
                    position: relative;
                    display: flex;
                    align-items: center;
                    margin: 0 15px;
                }
                
                .profile-toggle {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    padding: 5px 10px;
                    border-radius: 25px;
                    transition: all 0.3s ease;
                    background: rgba(102, 126, 234, 0.1);
                }
                
                .profile-toggle:hover {
                    background: rgba(102, 126, 234, 0.2);
                }
                
                .profile-photo {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid #667eea;
                    background: #f0f0f0;
                }
                
                .profile-username {
                    font-weight: 500;
                    color: #333;
                    display: none;
                }
                
                @media (min-width: 768px) {
                    .profile-username {
                        display: block;
                        max-width: 120px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
                
                .profile-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background: white;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    min-width: 200px;
                    margin-top: 8px;
                    z-index: 1000;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                }
                
                .profile-dropdown.active {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
                
                .dropdown-header {
                    padding: 12px 16px;
                    border-bottom: 1px solid #f0f0f0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .dropdown-user-info {
                    flex: 1;
                }
                
                .dropdown-username {
                    font-weight: 600;
                    color: #333;
                    font-size: 14px;
                }
                
                .dropdown-role {
                    font-size: 12px;
                    color: #999;
                    text-transform: capitalize;
                }
                
                .dropdown-menu-item {
                    padding: 10px 16px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #333;
                    transition: all 0.2s ease;
                    border: none;
                    background: none;
                    width: 100%;
                    text-align: left;
                    font-size: 14px;
                }
                
                .dropdown-menu-item:hover {
                    background: #f8f9fa;
                    color: #667eea;
                    padding-left: 20px;
                }
                
                .dropdown-menu-item i {
                    width: 16px;
                    text-align: center;
                }
                
                .dropdown-divider {
                    height: 1px;
                    background: #f0f0f0;
                    margin: 5px 0;
                }
                
                .logout-btn {
                    color: #f5576c !important;
                }
                
                .logout-btn:hover {
                    background: #ffe0e6 !important;
                }
            </style>
            
            <div class="profile-toggle" onclick="toggleProfileDropdown()">
                <img id="profile-photo" class="profile-photo" src="images/user-avtar/pic4.jpg" alt="Profile">
                <span class="profile-username" id="profile-username">Loading...</span>
                <i class="fas fa-chevron-down" style="font-size: 12px; color: #667eea;"></i>
            </div>
            
            <div id="profile-dropdown" class="profile-dropdown">
                <div class="dropdown-header">
                    <img id="dropdown-photo" class="profile-photo" src="images/user-avtar/pic4.jpg" alt="Profile" style="width: 35px; height: 35px;">
                    <div class="dropdown-user-info">
                        <div class="dropdown-username" id="dropdown-username">Username</div>
                        <div class="dropdown-role" id="dropdown-role">role</div>
                    </div>
                </div>
                
                <button class="dropdown-menu-item" onclick="goToProfile()">
                    <i class="fas fa-user"></i>
                    My Profile
                </button>
                
                <button class="dropdown-menu-item" onclick="goToSettings()">
                    <i class="fas fa-cog"></i>
                    Settings
                </button>
                
                <div class="dropdown-divider"></div>
                
                <button class="dropdown-menu-item logout-btn" onclick="handleLogout()">
                    <i class="fas fa-sign-out-alt"></i>
                    Logout
                </button>
            </div>
        </div>
    `;
    
    // Insert profile container before sign up button if exists, or at end
    const signUpBtn = navArea.querySelector('[data-bs-target="#sign_up_popup"]') || 
                      navArea.querySelector('.twm-nav-sign-up');
    
    if (signUpBtn) {
        signUpBtn.parentElement.insertAdjacentHTML('beforebegin', profileHTML);
    } else {
        navArea.insertAdjacentHTML('beforeend', profileHTML);
    }
    
    return document.getElementById('user-profile-container');
}

// Update profile display with user data
function updateProfileDisplay(user) {
    // Update username
    const usernameEl = document.getElementById('profile-username');
    if (usernameEl) usernameEl.textContent = user.username;
    
    const dropdownUsername = document.getElementById('dropdown-username');
    if (dropdownUsername) dropdownUsername.textContent = user.username;
    
    // Update role
    const roleEl = document.getElementById('dropdown-role');
    if (roleEl) roleEl.textContent = user.role === 'ADMIN' ? 'Employer' : 'Candidate';
    
    // Update photo if available
    if (user.photoUrl) {
        const photoEl = document.getElementById('profile-photo');
        const dropdownPhotoEl = document.getElementById('dropdown-photo');
        if (photoEl) photoEl.src = user.photoUrl;
        if (dropdownPhotoEl) dropdownPhotoEl.src = user.photoUrl;
    }
}

// Toggle profile dropdown visibility
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const profileContainer = document.getElementById('user-profile-container');
    const dropdown = document.getElementById('profile-dropdown');
    
    if (profileContainer && dropdown && !profileContainer.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

// Profile menu actions
function goToProfile() {
    const user = getCurrentUser();
    const role = user?.role;
    
    if (role === 'CANDIDATE') {
        window.location.href = 'candidate-profile.html';
    } else if (role === 'ADMIN') {
        window.location.href = 'employer-profile.html';
    }
}

function goToSettings() {
    const user = getCurrentUser();
    const role = user?.role;
    
    if (role === 'CANDIDATE') {
        window.location.href = 'candidate-change-password.html';
    } else if (role === 'ADMIN') {
        window.location.href = 'employer-change-password.html';
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        logoutUser();
        window.location.href = 'index.html';
    }
}

// Call this on every page load to initialize profile display
window.addEventListener('load', function() {
    // Initialize profile display for logged-in users
    const user = getCurrentUser();
    if (user) {
        setTimeout(initializeUserProfileDisplay, 100); // Small delay to ensure DOM is ready
    }
});
