# Header Authentication Management - Implementation Guide

## Overview
A smart header authentication system that:
- **Shows Login/Signup buttons** for guests (not logged in)
- **Shows User Profile Menu** for authenticated users
- **Syncs across browser tabs** in real-time
- **Persists across page reloads**
- **Works on all HTML pages**

## Architecture

### Core Components

#### 1. **header-auth.js** (New utility file)
Location: `js/header-auth.js`

Provides functions:
- `initializeHeaderAuth()` - Main initialization function
- `updateAuthUI()` - Shows/hides elements based on login status
- `initializeProfile()` - Populates user info from localStorage
- `toggleProfileDropdown()` - Open/close dropdown menu
- `goToProfile()` - Navigate to user's profile
- `goToSettings()` - Navigate to settings
- `handleLogout()` - Logout and redirect

### HTML Structure

#### Two States in Header:

**1. Guest (Not Logged In) - DEFAULT**
```html
<div id="auth-buttons-container" style="display: block;">
    <a id="nav-signup-btn" href="register.html">Sign Up</a>
    <a id="nav-login-btn" href="after-login.html">Login</a>
</div>

<div id="user-profile-container" style="display: none;">
    <!-- Profile menu hidden -->
</div>
```

**2. Logged In - AUTOMATIC**
```html
<div id="auth-buttons-container" style="display: none;">
    <!-- Buttons hidden -->
</div>

<div id="user-profile-container" style="display: flex;">
    <!-- Profile menu visible with username -->
</div>
```

## Implementation Steps

### Step 1: Add Script to HTML Head
```html
<script src="js/header-auth.js"></script>
```

### Step 2: Add Header Elements
Copy the header structure from `candidate-profile.html` which includes:
- Search box
- Auth buttons container (`auth-buttons-container`)
- User profile container (`user-profile-container`)

### Step 3: IDs Required in HTML
Ensure these IDs exist in your header:
- `auth-buttons-container` - Container for login/signup buttons
- `nav-signup-btn` - Sign up button
- `nav-login-btn` - Login button
- `user-profile-container` - User profile menu container
- `profile-username` - Username display in header toggle
- `dropdown-username` - Username in dropdown header
- `dropdown-role` - User role display
- `profile-dropdown` - The dropdown menu itself

## How It Works

### Logic Flow:

```
1. Page Loads
   ↓
2. header-auth.js Executes
   ↓
3. Check localStorage for 'user' object
   ↓
   ├─ IF logged in (user object exists):
   │  ├─ Hide auth buttons
   │  ├─ Show profile menu
   │  └─ Populate username & role
   │
   └─ IF guest (no user object):
      ├─ Show auth buttons
      └─ Hide profile menu
   ↓
4. Listen for changes (multi-tab sync)
   ├─ Storage events (login/logout in another tab)
   ├─ Visibility changes (tab switching)
   └─ Auto-update UI
```

### Authentication Data (localStorage)
```javascript
// After successful login, store user data:
localStorage.setItem('user', JSON.stringify({
    id: 123,
    username: 'john_doe',
    email: 'john@example.com',
    role: 'USER' // or 'ADMIN', 'EMPLOYER'
}));
```

## Features

### ✅ Real-Time Sync
- Changes in one tab instantly appear in others
- Uses browser `storage` events

### ✅ Responsive Design
- Profile username hidden on mobile (< 768px)
- Only avatar and dropdown arrow show
- Full menu on desktop

### ✅ Smart Navigation
- Profile link routes to correct page based on role
- Settings link routes to role-specific settings
- Logout clears localStorage and redirects

### ✅ Smooth Animations
- Dropdown slides in smoothly (0.3s)
- Hover effects on menu items
- Color transitions

## Applying to All Pages

To add this system to any HTML page:

1. **Add script to `<head>`:**
```html
<script src="js/header-auth.js"></script>
```

2. **In header's `extra-nav` section, replace existing buttons with:**
```html
<div class="extra-nav header-2-nav">
    <div class="extra-cell">
        <div class="header-search">
            <a href="#search" class="header-search-icon">
                <i class="feather-search"></i>
            </a>
        </div>
    </div>

    <!-- Auth Buttons (guests) -->
    <div id="auth-buttons-container" class="extra-cell" style="display: block;">
        <div class="header-nav-btn-section">
            <div class="twm-nav-btn-left">
                <a id="nav-signup-btn" class="twm-nav-sign-up" href="register.html">
                    <i class="feather-log-in"></i> Sign Up
                </a>
            </div>
            <div class="twm-nav-btn-right">
                <a id="nav-login-btn" class="twm-nav-post-a-job" href="after-login.html">
                    <i class="feather-log-in"></i> Login
                </a>
            </div>
        </div>
    </div>

    <!-- Profile Menu (logged-in users) -->
    <div id="user-profile-container" class="user-profile-menu" style="display: none;">
        <!-- (copy full menu from candidate-profile.html) -->
    </div>
</div>
```

## Testing

### Test Guest Flow:
```javascript
// In browser console:
localStorage.removeItem('user');
location.reload();
// Should see Login/Sign Up buttons
```

### Test Logged-In Flow:
```javascript
// In browser console:
localStorage.setItem('user', JSON.stringify({
    username: 'testuser',
    role: 'USER'
}));
location.reload();
// Should see profile menu with username
```

### Test Multi-Tab Sync:
1. Open page in Tab A - logged in (profile menu showing)
2. Open same page in Tab B
3. In Tab A, click Logout
4. Tab B should automatically hide profile menu and show buttons

## CSS Classes

All styling is inline in the HTML, but key classes:

- `.user-profile-menu` - Main container
- `.profile-toggle` - Header button
- `.profile-dropdown` - Dropdown menu
- `.profile-dropdown.active` - Visible dropdown
- `.dropdown-menu-item` - Menu buttons
- `.logout-btn` - Logout button (red color)

## Browser Compatibility

- Works in all modern browsers
- Uses localStorage (IE 8+)
- Uses CSS Flexbox (IE 11+)
- Uses modern JavaScript (ES6+)

## Future Enhancements

- [ ] Load profile photo from user object
- [ ] Add notification bell in header
- [ ] Add saved jobs quick access
- [ ] Add recent searches quick access
