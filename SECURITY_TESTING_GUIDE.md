# Security Testing Guide

## Quick Setup for Testing

### Step 1: Simulate User Login (For Testing)
Open browser console (F12 or Cmd+Option+I) and paste:

```javascript
// Simulate a candidate login
localStorage.setItem('currentUser', JSON.stringify({
    username: 'testcandidate',
    role: 'candidate',
    loginTime: new Date().getTime()
}));
```

Or for employer:
```javascript
// Simulate an employer login
localStorage.setItem('currentUser', JSON.stringify({
    username: 'testemployer',
    role: 'employer',
    loginTime: new Date().getTime()
}));
```

### Step 2: Test Protected Page Access
1. After setting localStorage above, navigate to: `candidate-profile.html`
2. Page should load normally with full content visible
3. Check browser console - should show logged-in user data

### Step 3: Test Guest Blocking
1. Clear the login session: Open console and paste:
```javascript
localStorage.removeItem('currentUser');
```

2. Navigate to: `candidate-profile.html`
3. Should see the beautiful purple login popup
4. Content should be invisible/grayed out in background

### Step 4: Test Login Popup Actions
1. With guest access popup visible:
   - Click **"Log In"** button → Should redirect to `after-login.html`
   - Go back, the popup appears again
   - Click **"Sign Up"** button → Should redirect to `register.html`

## Test All Protected Pages

Try navigating to these while logged out. All should show the login popup:

### Candidate Pages:
```
http://localhost:port/candidate-profile.html
http://localhost:port/candidate-dashboard.html
http://localhost:port/candidate-jobs-applied.html
http://localhost:port/candidate-saved-jobs.html
http://localhost:port/candidate-my-resume.html
http://localhost:port/candidate-cv-manager.html
http://localhost:port/candidate-job-alert.html
http://localhost:port/candidate-change-password.html
```

### Employer Pages:
```
http://localhost:port/employer-profile.html
http://localhost:port/employer-post-job.html
http://localhost:port/employer-manage-jobs.html
```

### Dashboard Pages:
```
http://localhost:port/dash-post-job.html
http://localhost:port/dash-employer.html
http://localhost:port/dash-manage-jobs.html
```

## Verify Public Pages Still Work

These should work for guests (no popup):
```
http://localhost:port/index.html
http://localhost:port/job-grid.html
http://localhost:port/candidate-grid.html
http://localhost:port/employer-list.html
```

## Integration with Your Login API

When your backend login API succeeds, add this JavaScript:

```javascript
// After successful login API response
const response = await fetch('your-login-endpoint', {
    method: 'POST',
    body: JSON.stringify({ username, password })
});

if (response.ok) {
    const user = await response.json();
    
    // Store user session
    localStorage.setItem('currentUser', JSON.stringify({
        username: user.username,
        role: user.role, // 'candidate' or 'employer'
        loginTime: new Date().getTime()
    }));
    
    // Redirect to dashboard
    window.location.href = user.role === 'candidate' 
        ? 'candidate-dashboard.html' 
        : 'dash-employer.html';
}
```

## Console Commands for Testing

```javascript
// Check if user is logged in
localStorage.getItem('currentUser')

// Get current user object
JSON.parse(localStorage.getItem('currentUser'))

// Check username
JSON.parse(localStorage.getItem('currentUser')).username

// Check role
JSON.parse(localStorage.getItem('currentUser')).role

// Logout
localStorage.removeItem('currentUser')

// Check all localStorage
Object.keys(localStorage).forEach(key => console.log(key, localStorage.getItem(key)))
```

## Common Issues & Solutions

### Issue: Popup doesn't appear
**Solution:** 
- Check browser console for errors (F12)
- Verify `js/auth.js` is loading correctly
- Check that localStorage is enabled

### Issue: Page content is visible behind popup
**Solution:**
- This shouldn't happen. If it does, hard-refresh page (Ctrl+Shift+R)
- Clear browser cache
- Check browser console for JavaScript errors

### Issue: Buttons don't work in popup
**Solution:**
- Ensure popup is in focus (click on it)
- Check that page paths in redirect functions are correct
- Verify CSS isn't hiding buttons

### Issue: User stays logged in after closing browser
**Solution:**
- This is expected with localStorage
- To implement session-based logout on close, modify `auth.js`:
```javascript
// Add to auth.js
window.addEventListener('beforeunload', () => {
    // Optional: logout when closing browser
    // logoutUser();
});
```

## Debugging with Console

Add this to check page protection status:
```javascript
// In browser console on any protected page
console.log('Current user:', getCurrentUser());
console.log('Can access page:', canAccessProfilePage());
console.log('User role:', getUserRole());
```

## Performance Notes

- Page protection happens in milliseconds
- localStorage access is instant
- No API calls needed for guest blocking
- Minimal impact on page load time

## Security Considerations

⚠️ **Important:** This is client-side security only. For production:
1. Always validate on backend
2. Use secure tokens (JWT)
3. Set token expiration
4. Implement HTTPS
5. Use secure session cookies
6. Validate permissions server-side
