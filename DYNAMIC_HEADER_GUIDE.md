# Dynamic Smart Header System - Implementation Guide

## Overview

A **centralized, reusable header system** that:
- ✅ Loads dynamically on every page via JavaScript
- ✅ Automatically switches between guest & logged-in UI
- ✅ Syncs authentication state across all pages in real-time
- ✅ Requires only **one script tag** per page
- ✅ No duplicate code, no manual header management
- ✅ Single source of truth (`header.html`)

## Architecture

### Three Core Files

#### 1. **header.html** (The Template)
- Location: `jobzilla/header.html`
- Contains the complete header structure with BOTH states
- Includes all navigation menus
- Includes styling for profile dropdown
- States:
  - `#header-guest` - Login/Signup buttons (hidden when logged in)
  - `#header-loggedin` - Profile menu (hidden when guest)

#### 2. **js/header-injector.js** (The Manager)
- Location: `jobzilla/js/header-injector.js`
- Injects header into any page automatically
- Manages authentication logic
- Handles user interactions
- Syncs across browser tabs

#### 3. **Your HTML Pages** (The Consumers)
- Just add: `<script src="js/header-injector.js"></script>`
- Remove old hardcoded headers
- That's it!

## How It Works

```
Page Loads
   ↓
Script loads: <script src="js/header-injector.js"></script>
   ↓
HeaderManager class initializes
   ↓
Fetches header.html via fetch API
   ↓
Injects into page at top
   ↓
Checks localStorage for 'user' object
   ↓
   ├─ If logged in:
   │  ├─ Hide #header-guest
   │  ├─ Show #header-loggedin
   │  └─ Populate username/role
   │
   └─ If guest:
      ├─ Show #header-guest
      └─ Hide #header-loggedin
   ↓
Listen for changes:
   ├─ Storage events (multi-tab sync)
   ├─ Visibility events (tab switching)
   └─ Auto-update when user logs in/out
```

## Implementation Steps

### Step 1: Prepare Your Pages

For each HTML page that needs the header:

**REMOVE:**
- Delete the entire `<header>` element (the old hardcoded one)
- Delete any `<div class="page-content">` that comes right after header

**KEEP:**
- Everything after the header (`<div class="page-content">`, content, footer, scripts)

### Step 2: Add Header Container and Script

At the very beginning of `<body>`, add:

```html
<body>
    <!-- This div will be replaced with the dynamic header -->
    <script src="js/header-injector.js"></script>
    
    <!-- Rest of your page content below -->
    <div class="page-content">
        <!-- Your page content here -->
    </div>
</body>
```

That's it! The header will be injected automatically.

### Step 3: Update All Pages

Files to update (remove old headers, add script):

**Main Pages:**
- `index.html`
- `after-login.html`
- `home.html`

**Job Pages:**
- `job-grid.html`
- `job-list.html`
- `job-detail.html`
- `job-detail-v2.html`
- `apply-job.html`

**Candidate Pages:**
- `candidate-dashboard.html`
- `candidate-profile.html`
- `candidate-jobs-applied.html`
- `candidate-saved-jobs.html`
- `candidate-my-resume.html`
- `candidate-cv-manager.html`
- `candidate-job-alert.html`
- `candidate-change-password.html`
- `candidate-detail.html`
- `candidate-grid.html`
- `candidate-list.html`
- `candidate-chat.html`

**Employer Pages:**
- `employer-profile.html`
- `employer-resume.html`
- `employer-manage-jobs.html`
- `employer-post-job.html`
- `employer-transaction.html`
- `employer-detail.html`
- `employer-detail-v2.html`
- `employer-grid.html`
- `employer-list.html`
- `employer-change-password.html`
- `employer-account-fresher.html`
- `employer-account-professional.html`

**Dashboard Pages:**
- `dash-*.html` (all dashboard pages)

**Other Pages:**
- `about-1.html`
- `contact.html`
- `pricing.html`
- `error-404.html`
- `faq.html`
- `under-maintenance.html`
- `coming-soon.html`
- `register.html`
- `login.html`

## Before & After Example

### BEFORE (Old Way - Hardcoded):
```html
<!DOCTYPE html>
<html>
<head>...</head>
<body>
    <!-- 100+ lines of header HTML duplicated on every page -->
    <header class="site-header">
        <div class="main-bar">
            <!-- All navigation, buttons, profile, etc. -->
            <!-- Hundreds of lines... -->
        </div>
    </header>

    <div class="page-content">
        <!-- Your actual content -->
    </div>
</body>
</html>
```

### AFTER (New Way - Dynamic):
```html
<!DOCTYPE html>
<html>
<head>...</head>
<body>
    <script src="js/header-injector.js"></script>

    <div class="page-content">
        <!-- Your actual content -->
    </div>
</body>
</html>
```

## Authentication State Management

### When User Logs In
```javascript
// After successful login (done in your auth handler):
localStorage.setItem('user', JSON.stringify({
    id: 123,
    username: 'john_doe',
    email: 'john@example.com',
    role: 'USER' // or 'ADMIN', 'EMPLOYER'
}));

// Header automatically switches:
// - Login/Signup buttons disappear
// - Profile menu appears with username
```

### When User Logs Out
```javascript
// When logout button clicked:
localStorage.removeItem('user');

// Header automatically switches:
// - Profile menu disappears
// - Login/Signup buttons reappear
```

## Features

### ✅ Two States
- **Guest State**: Shows "Login" and "Sign Up" buttons
- **Logged-In State**: Shows user avatar, username, and dropdown menu

### ✅ Profile Dropdown Menu
- Avatar image
- Username (from localStorage)
- User role (Candidate/Employer)
- My Profile link (routes to correct page based on role)
- Settings link (routes to role-specific settings)
- Logout button

### ✅ Smart Navigation
```javascript
// Profile links route based on user role:
if (role === 'ADMIN' || role === 'EMPLOYER') {
    → Goes to employer-profile.html
    → Settings goes to employer-change-password.html
} else {
    → Goes to candidate-profile.html
    → Settings goes to candidate-change-password.html
}
```

### ✅ Multi-Tab Synchronization
- Login in Tab A → Tab B automatically shows logged-in state
- Logout in Tab A → Tab B automatically reverts to guest state
- No page refresh needed

### ✅ Responsive Design
- Mobile: Only avatar and chevron show
- Desktop: Avatar + username + chevron show
- Menu adapts to screen size

### ✅ Smooth Animations
- Dropdown slides in (0.3s)
- Hover effects on menu items
- Color transitions

## File Locations

```
jobzilla/
├── header.html                          (NEW - The header template)
├── js/
│   ├── header-injector.js              (NEW - The manager)
│   ├── header-auth.js                  (Can be removed - no longer needed)
│   └── auth.js                         (Keep - handles page protection)
├── index.html                          (UPDATE - add script, remove header)
├── home.html                           (UPDATE - add script, remove header)
├── register.html                       (UPDATE - add script, remove header)
├── login.html                          (UPDATE - add script, remove header)
├── after-login.html                    (UPDATE - add script, remove header)
│
├── job-grid.html                       (UPDATE - add script, remove header)
├── job-list.html                       (UPDATE - add script, remove header)
├── job-detail.html                     (UPDATE - add script, remove header)
│
├── candidate-profile.html              (UPDATE - add script, remove header)
├── candidate-dashboard.html            (UPDATE - add script, remove header)
├── candidate-*.html                    (UPDATE - add script, remove header)
│
├── employer-profile.html               (UPDATE - add script, remove header)
├── employer-*.html                     (UPDATE - add script, remove header)
│
└── dash-*.html                         (UPDATE - add script, remove header)
```

## Troubleshooting

### Header Not Appearing
1. Check browser console for errors
2. Verify `header.html` path is correct
3. Check that script tag is in `<body>`
4. Check network tab - is header.html being fetched?

### Auth UI Not Switching
1. Verify localStorage has 'user' key set correctly
2. Open DevTools → Storage → Local Storage
3. Check that user object has `username` and `role` properties
4. Try clearing cache and reloading

### Buttons Not Working
1. Check console for JavaScript errors
2. Verify onclick handlers exist on window.headerManager
3. Clear browser cache
4. Check that header-injector.js is loading

### Path Issues (Relative Links)
If pages are in subdirectories, the script auto-detects depth.
- Main pages: `src/main/resources/jobzilla/jobzilla/*.html`
- Script: `js/header-injector.js`
- Header: `header.html`
- Should work from anywhere!

## Future Enhancements

- [ ] Load user avatar from user object
- [ ] Add notification bell with count
- [ ] Add saved jobs quick access
- [ ] Add recent searches dropdown
- [ ] Add theme switcher
- [ ] Add language selector
- [ ] Add dark mode toggle

## Browser Compatibility

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Requires: Fetch API, localStorage, ES6 classes
- Minimum: Chrome 51+, Firefox 52+, Safari 10.1+, Edge 15+

## Performance

- Header loads once per page (~5KB)
- Cached in browser
- No impact on page performance
- Fetch completes in <100ms typically
- Lightweight (~300 lines of code)
