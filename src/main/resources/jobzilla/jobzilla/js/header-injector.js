// Header Injection and Management System
// Dynamically loads and manages the header for all pages

class HeaderManager {
    constructor() {
        this.headerContainerId = 'dynamic-header-container';
        this.headerPath = this.resolveHeaderPath();
        this.initialized = false;
    }

    /**
     * Intelligently resolve the path to header.html based on current page location
     */
    resolveHeaderPath() {
        const currentPath = window.location.pathname;
        
        // Count how many directory levels deep we are
        const pathParts = currentPath.split('/').filter(part => part && part !== 'jobzilla');
        
        // If we're in root or /jobzilla/, header.html is in the same directory
        if (pathParts.length <= 1) {
            return 'header.html';
        }
        
        // If we're in a subdirectory, go back to parent
        return '../header.html';
    }

    /**
     * Initialize - Load header and setup auth management
     */
    async init() {
        if (this.initialized) {
            console.log('[HeaderManager] Already initialized, skipping');
            return;
        }
        
        try {
            console.log('[HeaderManager] Starting initialization...');
            
            // Create container if it doesn't exist
            if (!document.getElementById(this.headerContainerId)) {
                // Wait for body if needed
                let attempts = 0;
                while (!document.body && attempts < 50) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    attempts++;
                }
                
                if (document.body) {
                    const container = document.createElement('div');
                    container.id = this.headerContainerId;
                    document.body.insertBefore(container, document.body.firstChild);
                    console.log('[HeaderManager] Created container');
                }
            }

            // Load header HTML
            console.log('[HeaderManager] Loading header from', this.headerPath);
            await this.loadHeader();
            console.log('[HeaderManager] Header HTML injected');
            
            // Setup event listeners
            this.setupEventListeners();
            
            // NOW update auth UI (after header is loaded)
            this.updateAuthUI();
            
            // NOW hide old headers (after everything is in place)
            setTimeout(() => this.hideOldHeaders(), 50);
            
            // Setup periodic checks for auth changes
            this.setupAuthListener();
            
            this.initialized = true;
            console.log('[HeaderManager] Initialization complete');
        } catch (error) {
            console.error('[HeaderManager] Initialization failed:', error);
        }
    }

    /**
     * Load header.html into the page
     */
    async loadHeader() {
        try {
            // Wait for body to exist if it doesn't yet
            let attempts = 0;
            while (!document.body && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            // Ensure container exists in the body
            let container = document.getElementById(this.headerContainerId);
            if (!container && document.body) {
                container = document.createElement('div');
                container.id = this.headerContainerId;
                document.body.insertBefore(container, document.body.firstChild);
            }
            
            if (!container) {
                console.error('[HeaderManager] Could not create container');
                return;
            }
            
            const response = await fetch(this.headerPath);
            if (!response.ok) throw new Error(`Failed to load header: ${response.status}`);
            
            const html = await response.text();
            container.innerHTML = html;
            console.log('[HeaderManager] Header loaded successfully');
        } catch (error) {
            console.error('[HeaderManager] Error loading header:', error);
            throw error;
        }
    }

    /**
     * Update header based on auth status
     */
    updateAuthUI() {
        const user = this.getUser();
        const guestHeader = document.getElementById('header-guest');
        const loggedinHeader = document.getElementById('header-loggedin');

        console.log('[HeaderManager] Updating auth UI. User:', user ? user.username : 'none');
        console.log('[HeaderManager] Guest header:', guestHeader ? 'found' : 'not found');
        console.log('[HeaderManager] Logged-in header:', loggedinHeader ? 'found' : 'not found');

        if (user) {
            // User is logged in
            if (guestHeader) {
                guestHeader.style.display = 'none';
                console.log('[HeaderManager] Hidden guest header');
            }
            if (loggedinHeader) {
                loggedinHeader.style.display = 'flex';
                console.log('[HeaderManager] Showed logged-in header');
            }
            this.populateUserInfo(user);
        } else {
            // User is a guest
            if (guestHeader) {
                guestHeader.style.display = 'block';
                console.log('[HeaderManager] Showed guest header');
            }
            if (loggedinHeader) {
                loggedinHeader.style.display = 'none';
                console.log('[HeaderManager] Hidden logged-in header');
            }
        }
    }

    /**
     * Hide all old hardcoded header elements from original pages
     */
    hideOldHeaders() {
        // Get a reference to our dynamic header first
        const dynamicHeader = document.getElementById('dynamic-header');
        
        // Find ALL headers with the site-header class
        const allHeaders = document.querySelectorAll('header.site-header');
        
        allHeaders.forEach(header => {
            // Only hide if this is NOT our dynamically injected header
            // Compare by element reference, not just ID
            if (header !== dynamicHeader) {
                header.style.display = 'none';
            }
        });

        // Hide old Sign Up buttons (but NOT inside our dynamic header)
        const signUpButtons = document.querySelectorAll('.twm-nav-sign-up');
        signUpButtons.forEach(btn => {
            if (!dynamicHeader || !dynamicHeader.contains(btn)) {
                btn.style.display = 'none';
                console.log('[HeaderManager] Hidden old Sign Up button');
            }
        });

        // Hide old "Post a job" button (but NOT inside our dynamic header)
        const postJobButtons = document.querySelectorAll('.twm-nav-post-a-job');
        postJobButtons.forEach(btn => {
            if (!dynamicHeader || !dynamicHeader.contains(btn)) {
                btn.style.display = 'none';
                console.log('[HeaderManager] Hidden old Post Job button');
            }
        });

        // Hide old Login buttons (but NOT inside our dynamic header)
        const loginButtons = document.querySelectorAll('#nav-login-btn');
        loginButtons.forEach(btn => {
            if (!dynamicHeader || !dynamicHeader.contains(btn)) {
                btn.style.display = 'none';
                console.log('[HeaderManager] Hidden old Login button');
            }
        });

        // Hide old profile dropdown containers (but NOT inside our dynamic header)
        const oldProfileContainers = document.querySelectorAll('.header-nav-btn-section');
        oldProfileContainers.forEach(container => {
            if (!dynamicHeader || !dynamicHeader.contains(container)) {
                container.style.display = 'none';
                console.log('[HeaderManager] Hidden old button section');
            }
        });

        // Hide old header-nav-profile divs (but NOT inside our dynamic header)
        const oldProfileMenus = document.querySelectorAll('.header-nav-profile');
        oldProfileMenus.forEach(menu => {
            if (!dynamicHeader || !dynamicHeader.contains(menu)) {
                menu.style.display = 'none';
                console.log('[HeaderManager] Hidden old profile menu');
            }
        });

        // Hide extra-cell containers with buttons (but NOT search or inside our dynamic header)
        const extraCells = document.querySelectorAll('.extra-nav.header-2-nav .extra-cell');
        extraCells.forEach(cell => {
            // Check if this cell is inside our dynamic header
            if (!dynamicHeader || !dynamicHeader.contains(cell)) {
                // Check if this cell has auth buttons
                const hasAuthButtons = cell.querySelector('.twm-nav-sign-up') || 
                                      cell.querySelector('.twm-nav-post-a-job') ||
                                      cell.querySelector('#nav-login-btn');
                if (hasAuthButtons) {
                    cell.style.display = 'none';
                    console.log('[HeaderManager] Hidden old auth button cell');
                }
            }
        });
    }

    /**
     * Populate user information in the header
     */
    populateUserInfo(user) {
        const username = user.username || 'User';
        const role = this.formatRole(user.role);

        // Update header toggle username
        const profileUsername = document.getElementById('header-profile-username');
        if (profileUsername) {
            profileUsername.textContent = username;
        }

        // Update dropdown username
        const dropdownUsername = document.getElementById('header-dropdown-username');
        if (dropdownUsername) {
            dropdownUsername.textContent = username;
        }

        // Update role
        const dropdownRole = document.getElementById('header-dropdown-role');
        if (dropdownRole) {
            dropdownRole.textContent = role;
        }
    }

    /**
     * Format role for display
     */
    formatRole(role) {
        if (!role) return 'User';
        if (role === 'USER') return 'Candidate';
        if (role === 'ADMIN' || role === 'EMPLOYER') return 'Employer';
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    }

    /**
     * Get user from localStorage
     */
    getUser() {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    /**
     * Setup event listeners for header interactions
     */
    setupEventListeners() {
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('header-profile-dropdown');
            const toggle = document.querySelector('.profile-toggle');
            
            if (dropdown && toggle && !toggle.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

    /**
     * Toggle profile dropdown
     */
    toggleDropdown() {
        const dropdown = document.getElementById('header-profile-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    /**
     * Navigate to user's profile page
     */
    goToProfile() {
        const user = this.getUser();
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        const role = user.role?.toUpperCase();
        
        if (role === 'ADMIN' || role === 'EMPLOYER') {
            window.location.href = 'employer-profile.html';
        } else {
            window.location.href = 'candidate-profile.html';
        }
    }

    /**
     * Navigate to settings page
     */
    goToSettings() {
        const user = this.getUser();
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        const role = user.role?.toUpperCase();
        
        if (role === 'ADMIN' || role === 'EMPLOYER') {
            window.location.href = 'employer-change-password.html';
        } else {
            window.location.href = 'candidate-change-password.html';
        }
    }

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem('user');
        this.updateAuthUI();
        
        // Close dropdown if open
        const dropdown = document.getElementById('header-profile-dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
        
        window.location.href = 'index.html';
    }

    /**
     * Setup listener for auth changes (multi-tab sync)
     */
    setupAuthListener() {
        // Listen for storage changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'user' || e.key === null) {
                setTimeout(() => {
                    this.updateAuthUI();
                }, 100);
            }
        });

        // Listen for visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.updateAuthUI();
            }
        });

        // Also listen for custom auth events (if your login/logout triggers them)
        document.addEventListener('authStateChanged', () => {
            setTimeout(() => this.updateAuthUI(), 100);
        });
    }

    /**
     * Get header path based on current location
     */
    getHeaderPath() {
        // Detect if we're in a subdirectory
        const path = window.location.pathname;
        const depth = (path.match(/\//g) || []).length;
        
        if (depth > 2) {
            // We're in a subdirectory
            return '../'.repeat(depth - 2) + 'header.html';
        }
        
        return 'header.html';
    }
}

// Create global instance
window.headerManager = null;

// Function to safely initialize
async function initializeHeader() {
    console.log('[HeaderManager] Attempting to initialize...');
    try {
        if (!window.headerManager) {
            window.headerManager = new HeaderManager();
        }
        
        // Always call init (it checks if already initialized)
        await window.headerManager.init();
        console.log('[HeaderManager] Successfully initialized');
    } catch (error) {
        console.error('[HeaderManager] Initialization error:', error);
    }
}

// Wait for DOM to be fully ready before initializing
function waitForDOM() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeHeader);
    } else {
        // DOM is already loaded
        initializeHeader();
    }
}

// Also wait for document body to exist
if (!document.body) {
    document.addEventListener('DOMContentLoaded', waitForDOM);
} else {
    waitForDOM();
}

// Additional safety timeout
setTimeout(initializeHeader, 1000);
