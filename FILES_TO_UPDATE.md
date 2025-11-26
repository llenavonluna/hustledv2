# Files to Update for Dynamic Header Implementation

## Summary
This document lists all HTML files that need updating to use the new dynamic header system.

## Update Instructions for Each File

For each file:
1. **REMOVE** the `<header>` element (keep everything after it)
2. **ADD** `<script src="js/header-injector.js"></script>` in the body
3. **VERIFY** the file still works correctly

## Files to Update

### 📄 Core Pages (5 files)
- [ ] `index.html` - Homepage
- [ ] `home.html` - Home after login
- [ ] `register.html` - Registration page
- [ ] `login.html` - Login page  
- [ ] `after-login.html` - Post-login home

### 📄 Job Browsing Pages (5 files)
- [ ] `job-grid.html` - Jobs grid view
- [ ] `job-list.html` - Jobs list view
- [ ] `job-detail.html` - Job detail view
- [ ] `job-detail-v2.html` - Job detail alternate
- [ ] `apply-job.html` - Job application

### 📄 Candidate Pages (13 files)
- [ ] `candidate-profile.html` - Candidate profile
- [ ] `candidate-dashboard.html` - Dashboard
- [ ] `candidate-jobs-applied.html` - Applied jobs
- [ ] `candidate-saved-jobs.html` - Saved jobs
- [ ] `candidate-my-resume.html` - Resume management
- [ ] `candidate-cv-manager.html` - CV manager
- [ ] `candidate-job-alert.html` - Job alerts
- [ ] `candidate-change-password.html` - Change password
- [ ] `candidate-detail.html` - Candidate detail
- [ ] `candidate-detail-v2.html` - Candidate detail v2
- [ ] `candidate-grid.html` - Candidates grid
- [ ] `candidate-list.html` - Candidates list
- [ ] `candidate-chat.html` - Chat

### 📄 Employer Pages (13 files)
- [ ] `employer-profile.html` - Employer profile
- [ ] `employer-resume.html` - Resume management
- [ ] `employer-manage-jobs.html` - Manage jobs
- [ ] `employer-post-job.html` - Post a job
- [ ] `employer-transaction.html` - Transactions
- [ ] `employer-detail.html` - Employer detail
- [ ] `employer-detail-v2.html` - Employer detail v2
- [ ] `employer-grid.html` - Employers grid
- [ ] `employer-list.html` - Employers list
- [ ] `employer-change-password.html` - Change password
- [ ] `employer-account-fresher.html` - Register fresher
- [ ] `employer-account-professional.html` - Register professional
- [ ] `employer-post-job.html` - Post job (duplicate?)

### 📄 Dashboard Pages (10 files)
- [ ] `dash-bookmark.html` - Bookmarks
- [ ] `dash-candidates.html` - Candidates
- [ ] `dash-change-password.html` - Change password
- [ ] `dash-company-profile.html` - Company profile
- [ ] `dash-employer.html` - Employer dashboard
- [ ] `dash-manage-jobs.html` - Manage jobs
- [ ] `dash-messages.html` - Messages
- [ ] `dash-messages_2.html` - Messages v2
- [ ] `dash-my-profile.html` - My profile
- [ ] `dash-post-job.html` - Post job

### 📄 Info Pages (7 files)
- [ ] `about-1.html` - About us
- [ ] `contact.html` - Contact
- [ ] `pricing.html` - Pricing
- [ ] `error-404.html` - 404 error
- [ ] `faq.html` - FAQ
- [ ] `under-maintenance.html` - Maintenance
- [ ] `coming-soon.html` - Coming soon

### 📄 Utility Pages (2 files)
- [ ] `dashboard.html` - Dashboard main
- [ ] `icons.html` - Icons page

## Implementation Checklist

### Phase 1: Core Pages (Do these first)
- [ ] index.html
- [ ] home.html
- [ ] register.html
- [ ] login.html

### Phase 2: Job Pages
- [ ] job-grid.html
- [ ] job-list.html
- [ ] job-detail.html
- [ ] apply-job.html

### Phase 3: Candidate Pages
- [ ] candidate-profile.html
- [ ] candidate-dashboard.html
- [ ] Rest of candidate-*.html

### Phase 4: Employer Pages
- [ ] employer-profile.html
- [ ] Rest of employer-*.html

### Phase 5: Dashboard Pages
- [ ] All dash-*.html files

### Phase 6: Info Pages
- [ ] All remaining pages

## Template for Each File

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <!-- All your existing <head> content -->
    <title>Page Title</title>
    <!-- Keep all stylesheets, etc -->
</head>

<body>
    <!-- ADD THIS LINE: -->
    <script src="js/header-injector.js"></script>

    <!-- DELETE THE ENTIRE OLD HEADER SECTION -->
    <!-- (Remove <header class="site-header ..."> and all its contents) -->

    <!-- KEEP EVERYTHING ELSE: -->
    <div class="page-content">
        <!-- Your page content -->
    </div>

    <!-- All your existing scripts -->
    <script src="js/..."></script>
</body>

</html>
```

## Quick Reference: What to Remove

Search for these in each HTML file and remove them:

```html
<!-- REMOVE THIS ENTIRE BLOCK: -->
<header class="site-header header-style-3 mobile-sider-drawer-menu">
    <div class="pattern-layer" ...></div>
    <div class="sticky-header main-bar-wraper ...">
        <div class="main-bar">
            <div class="container-fluid clearfix">
                <!-- Logo -->
                <!-- Navigation -->
                <!-- Auth buttons / Profile menu -->
                ...
            </div>
        </div>
        <!-- Search bar -->
        <div id="search">...</div>
    </div>
</header>
```

## Testing Each File

After updating each file:

1. **Open in Browser** - Page should load
2. **Check Header** - Header should appear at top
3. **Guest Mode** - Should see Login/Sign Up buttons
4. **Test Login** - Run in console:
   ```javascript
   localStorage.setItem('user', JSON.stringify({
       username: 'testuser',
       role: 'USER'
   }));
   location.reload();
   ```
5. **Logged-In Mode** - Should see profile dropdown
6. **Check Links** - Click through navigation
7. **Test Logout** - Click logout button

## Verification Checklist

After completing all updates:

- [ ] All files have `<script src="js/header-injector.js"></script>`
- [ ] All hardcoded headers are removed
- [ ] No duplicate headers appear
- [ ] Login/Signup buttons show for guests
- [ ] Profile menu shows for logged-in users
- [ ] Navigation menu works on all pages
- [ ] Multi-tab sync works
- [ ] Mobile responsive works
- [ ] Console has no errors

## Support Files

Created files that support this system:
- ✅ `header.html` - The dynamic header template
- ✅ `js/header-injector.js` - The injection and management script
- ✅ `js/header-auth.js` - Can be removed (no longer needed)
- ✅ `DYNAMIC_HEADER_GUIDE.md` - Full implementation guide

## Notes

- The `header.html` file is in: `jobzilla/header.html`
- The injector script is in: `jobzilla/js/header-injector.js`
- All paths are relative, so `js/header-injector.js` works from any page
- No special configuration needed - it just works!
