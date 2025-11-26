/**
 * ========================================
 * CANDIDATE PROFILE MANAGER
 * Hybrid Save System: localStorage + Database
 * ========================================
 * 
 * This system provides:
 * - Instant save to browser (localStorage)
 * - Background sync to database
 * - Automatic retry on failure
 * - Offline support
 * - Multi-device sync when logged in
 */

class CandidateProfileManager {
    constructor() {
        this.userId = this.extractUserIdFromToken();
        this.storageKey = `candidateProfile_${this.userId}`;
        this.apiUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api/candidate'
            : 'https://' + window.location.hostname + '/api/candidate';
        
        console.log('🚀 CandidateProfileManager initialized');
        console.log('API URL:', this.apiUrl);
    }
    
    /**
     * Extract user ID from stored authentication data
     */
    extractUserIdFromToken() {
        try {
            const user = localStorage.getItem('user');
            if (user) {
                const userData = JSON.parse(user);
                const userId = userData.id || userData.userId;
                console.log('User data found:', userData);
                console.log('Extracted userId:', userId);
                return userId || null;
            }
            console.warn('No user data in localStorage');
            return null;
        } catch (error) {
            console.warn('Could not extract user ID:', error);
            return null;
        }
    }
    
    /**
     * Gather all form data from profile form
     */
    gatherProfileData() {
        return {
            userId: this.userId,
            firstName: document.getElementById('firstName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            headline: document.getElementById('headline')?.value || '',
            bio: document.getElementById('bio')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            city: document.getElementById('city')?.value || '',
            province: document.getElementById('province')?.value || '',
            postalCode: document.getElementById('postalCode')?.value || '',
            address: document.getElementById('address')?.value || '',
            dateOfBirth: document.getElementById('dob')?.value || '',
            gender: document.getElementById('gender')?.value || '',
            portfolio: document.getElementById('portfolio')?.value || '',
            linkedin: document.getElementById('linkedin')?.value || '',
            github: document.getElementById('github')?.value || '',
            website: document.getElementById('website')?.value || ''
        };
    }
    
    /**
     * HYBRID SAVE: localStorage (instant) + database (sync)
     * 1. Save to browser immediately
     * 2. Sync to database in background
     * 3. Show user feedback
     */
    async saveProfile() {
        try {
            if (!this.userId) {
                this.showWarningMessage('⚠️ Please login before saving profile');
                return;
            }
            
            const profile = this.gatherProfileData();
            
            // 1. INSTANT SAVE to localStorage
            localStorage.setItem(this.storageKey, JSON.stringify(profile));
            console.log('✅ Saved to browser (localStorage)');
            
            // 2. Show loading state
            this.showLoadingState();
            
            // 3. SYNC to database in background
            await this.syncToDatabase(profile);
            
            // 4. Hide loading state
            this.hideLoadingState();
            
        } catch (error) {
            console.error('Save error:', error);
            this.showWarningMessage('⚠️ Profile saved locally (check connection)');
            this.hideLoadingState();
            this.scheduleRetry();
        }
    }
    
    /**
     * Sync profile data to database
     */
    async syncToDatabase(profile) {
        try {
            const response = await fetch(`${this.apiUrl}/profile/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(profile)
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                this.showSuccessMessage('✅ Profile saved successfully!');
                console.log('✅ Synced to database successfully');
            } else {
                this.showWarningMessage('⚠️ Saved locally. Retrying database sync...');
                console.warn('Database sync failed:', data.message);
                this.scheduleRetry(profile);
            }
            
        } catch (error) {
            console.error('Database sync error:', error);
            this.showWarningMessage('⚠️ Saved locally. Retrying database sync...');
            this.scheduleRetry(profile);
        }
    }
    
    /**
     * Load profile from database OR localStorage
     */
    async loadProfile() {
        try {
            if (!this.userId) {
                console.warn('No user ID available for loading profile');
                return;
            }
            
            // 1. Try loading from database first
            const response = await fetch(`${this.apiUrl}/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            
            if (response.ok) {
                const profile = await response.json();
                if (profile && profile.id) {
                    this.populateForm(profile);
                    console.log('✅ Loaded from database');
                    return;
                }
            }
        } catch (error) {
            console.warn('Database load failed, checking localStorage...', error);
        }
        
        // 2. Fallback to localStorage
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try {
                const profile = JSON.parse(saved);
                this.populateForm(profile);
                console.log('✅ Loaded from browser (localStorage)');
            } catch (e) {
                console.error('Error parsing localStorage:', e);
            }
        }
    }
    
    /**
     * Populate HTML form with profile data
     */
    populateForm(profile) {
        const fieldMap = {
            'firstName': profile.firstName || profile.first_name,
            'lastName': profile.lastName || profile.last_name,
            'headline': profile.headline,
            'bio': profile.bio,
            'phone': profile.phone || profile.phoneNumber,
            'city': profile.city,
            'province': profile.province,
            'postalCode': profile.postalCode || profile.postal_code,
            'address': profile.address,
            'dob': profile.dateOfBirth || profile.date_of_birth,
            'gender': profile.gender,
            'portfolio': profile.portfolio || profile.portfolioUrl || profile.portfolio_url,
            'linkedin': profile.linkedin || profile.linkedinUrl || profile.linkedin_url,
            'github': profile.github || profile.githubUrl || profile.github_url,
            'website': profile.website || profile.websiteUrl || profile.website_url
        };
        
        for (const [elementId, value] of Object.entries(fieldMap)) {
            const element = document.getElementById(elementId);
            if (element && value) {
                element.value = value;
            }
        }
    }
    
    /**
     * Retry logic for failed saves
     */
    scheduleRetry(profile = null) {
        setTimeout(() => {
            console.log('🔄 Retrying database sync...');
            if (profile) {
                this.syncToDatabase(profile);
            } else {
                this.saveProfile();
            }
        }, 5000); // Retry after 5 seconds
    }
    
    /**
     * Show success alert message
     */
    showSuccessMessage(msg) {
        this.showAlert(msg, 'alert-success', 3000);
    }
    
    /**
     * Show warning alert message
     */
    showWarningMessage(msg) {
        this.showAlert(msg, 'alert-warning', 4000);
    }
    
    /**
     * Show error alert message
     */
    showErrorMessage(msg) {
        this.showAlert(msg, 'alert-danger', 5000);
    }
    
    /**
     * Generic alert display
     */
    showAlert(msg, type, duration) {
        // Remove existing alerts
        document.querySelectorAll('.profile-alert').forEach(a => a.remove());
        
        const alert = document.createElement('div');
        alert.className = `alert ${type} alert-dismissible fade show profile-alert`;
        alert.setAttribute('role', 'alert');
        alert.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
        alert.innerHTML = `
            ${msg}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alert);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, duration);
    }
    
    /**
     * Show loading state on save button
     */
    showLoadingState() {
        const btn = document.getElementById('saveProfileBtn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
        }
    }
    
    /**
     * Hide loading state on save button
     */
    hideLoadingState() {
        const btn = document.getElementById('saveProfileBtn');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="feather-save"></i> Save Profile';
        }
    }
}

/**
 * Initialize on page load
 */
let profileManager;
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Initializing Candidate Profile Manager');
    
    profileManager = new CandidateProfileManager();
    
    // Load existing profile from database or localStorage
    profileManager.loadProfile();
    
    // Attach save button listener
    const saveBtn = document.getElementById('saveProfileBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            profileManager.saveProfile();
        });
        console.log('✅ Save button listener attached');
    } else {
        console.warn('⚠️ Save button not found in DOM');
    }
    
    // Optional: Enable auto-save on form changes (uncomment to enable)
    // document.addEventListener('change', () => {
    //     profileManager.saveProfile();
    // });
});

/**
 * Handle page unload - save any pending changes
 */
window.addEventListener('beforeunload', function() {
    if (profileManager) {
        const profile = profileManager.gatherProfileData();
        localStorage.setItem(profileManager.storageKey, JSON.stringify(profile));
    }
});
