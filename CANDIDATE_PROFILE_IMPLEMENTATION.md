# Candidate Profile - Hybrid Save System Implementation Guide

## Overview
This implementation provides a professional hybrid save system for candidate profiles with:
- ✅ Instant save to browser (localStorage)
- ✅ Automatic database sync
- ✅ Automatic retry on failure
- ✅ Offline support
- ✅ Multi-device sync when logged in

---

## Files Created

### 1. Backend Controller
**File:** `src/main/java/com/example/hustled/controller/CandidateProfileController.java`

**Endpoints:**
- `POST /api/candidate/profile/save` - Save/update profile
- `GET /api/candidate/profile` - Load profile
- `GET /api/candidate/id` - Get candidate ID

### 2. Data Transfer Object
**File:** `src/main/java/com/example/hustled/dto/CandidateProfileDTO.java`

Handles profile data from frontend with fields:
- firstName, lastName, headline, bio
- phone, city, province, postalCode, address
- dateOfBirth, gender
- portfolio, linkedin, github, website

### 3. Repository Interface
**File:** `src/main/java/com/example/hustled/repository/CandidateProfileRepository.java`

Database operations:
- `findByUserId(userId)` - Find profile by user
- `existsByUserId(userId)` - Check if profile exists

### 4. Frontend Manager
**File:** `src/main/resources/static/js/candidate-profile-manager.js`

Complete profile management with:
- Hybrid save (localStorage + database)
- Profile loading from database/localStorage
- Automatic retry logic
- User feedback (success/warning alerts)
- Loading state management

---

## How to Use

### Step 1: Add Script to candidate-profile.html

Add this line in the `<head>` or before closing `</body>`:

```html
<script src="js/candidate-profile-manager.js"></script>
```

### Step 2: Add Save Button

In your candidate-profile.html, create a save button:

```html
<button id="saveProfileBtn" class="btn btn-primary">
    <i class="feather-save"></i> Save Profile
</button>
```

### Step 3: Form Field IDs

Ensure your form fields have these IDs:

```html
<!-- Personal Information -->
<input id="firstName" type="text" placeholder="First Name">
<input id="lastName" type="text" placeholder="Last Name">
<input id="headline" type="text" placeholder="Professional Headline">
<textarea id="bio" placeholder="Bio/About You"></textarea>

<!-- Contact Information -->
<input id="phone" type="tel" placeholder="Phone Number">
<input id="city" type="text" placeholder="City">
<input id="province" type="text" placeholder="Province">
<input id="postalCode" type="text" placeholder="Postal Code">
<input id="address" type="text" placeholder="Address">

<!-- Additional Information -->
<input id="dob" type="date" placeholder="Date of Birth">
<select id="gender">
    <option>Select Gender</option>
    <option>Male</option>
    <option>Female</option>
    <option>Other</option>
</select>

<!-- Social Links -->
<input id="portfolio" type="url" placeholder="Portfolio URL">
<input id="linkedin" type="url" placeholder="LinkedIn Profile">
<input id="github" type="url" placeholder="GitHub Profile">
<input id="website" type="url" placeholder="Personal Website">
```

### Step 4: Deploy to Hostinger

When deploying to Hostinger, the JavaScript automatically detects the domain:

```javascript
// Local development
http://localhost:3000/api/candidate

// Hostinger production
https://yourdomain.com/api/candidate
```

---

## How It Works

### Save Flow

```
User fills form → Clicks Save → Instant localStorage save (visual feedback)
                                 ↓
                        Sync to database (background)
                                 ↓
                        Success? → Show ✅
                                 ↓
                        No internet? → Show ⚠️ (will retry)
                                 ↓
                        Retry after 5 seconds
```

### Load Flow

```
Page loads → Try to load from database
              ↓
           Success? → Populate form ✅
              ↓
           Failed? → Fall back to localStorage
                     ↓
                  Any saved data? → Populate form ✅
                     ↓
                  No data? → Show empty form
```

---

## API Response Format

### Success Response
```json
{
    "message": "✅ Profile saved successfully",
    "success": true
}
```

### Error Response
```json
{
    "message": "❌ Error saving profile: [error details]",
    "success": false
}
```

---

## LocalStorage Keys

Profile data is stored in browser with key:
```
candidateProfile_{userId}
```

Example: `candidateProfile_1` for user with ID 1

Data structure:
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "headline": "Software Engineer",
    "bio": "Passionate developer...",
    "phone": "09123456789",
    "city": "Manila",
    "province": "NCR",
    "postalCode": "1234",
    "address": "123 Main St",
    "dateOfBirth": "1990-01-01",
    "gender": "Male",
    "portfolio": "https://john.com",
    "linkedin": "https://linkedin.com/in/john",
    "github": "https://github.com/john",
    "website": "https://john.com"
}
```

---

## Features in Detail

### ✅ Hybrid Save System
- **Instant:** Data saved to localStorage immediately
- **Persistent:** Data synced to database in background
- **Resilient:** Works offline, retries on failure

### ✅ Automatic Retry
- If database sync fails (no internet, server error), system retries after 5 seconds
- User sees warning message: "⚠️ Saved locally. Retrying..."
- No data loss - all changes remain in localStorage

### ✅ Multi-Device Sync
- When user logs in on another device, profile loads from database
- Database acts as central source of truth
- All devices stay in sync

### ✅ User Feedback
- **✅ Success:** "Profile saved successfully!" (green)
- **⚠️ Warning:** "Saved locally. Retrying..." (yellow)
- **❌ Error:** "Profile saved locally (check connection)" (red)
- All alerts auto-dismiss after 3-5 seconds

### ✅ Loading State
- Save button shows spinner during database sync
- Button disabled to prevent double-submit
- Button re-enabled when sync completes

---

## Troubleshooting

### 1. Save Button Not Working
**Check:**
- Button has ID `saveProfileBtn`
- Script is loaded: `<script src="js/candidate-profile-manager.js"></script>`
- User is logged in (required for save)

### 2. Data Not Loading
**Check:**
- Form field IDs match the required list above
- User is logged in
- Check browser console for errors: F12 → Console

### 3. Database Not Syncing
**Check:**
- API URL is correct (check browser console logs)
- Spring Boot server is running
- CandidateProfileController is deployed
- Database tables are created (use schema.sql)

### 4. Auth Token Missing
**Check:**
- User is logged in (check localStorage for `authToken`)
- Login functionality working
- Token is stored with key: `authToken`

---

## Console Debugging

Open browser console (F12) to see logs:

```
🚀 CandidateProfileManager initialized
API URL: http://localhost:3000/api/candidate
✅ Loaded from database
✅ Save button listener attached
✅ Saved to browser (localStorage)
✅ Synced to database successfully
```

---

## Database Schema

Ensure candidate_profiles table exists (created by schema.sql):

```sql
CREATE TABLE candidate_profiles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNIQUE NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  headline VARCHAR(150),
  bio TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(10),
  address VARCHAR(255),
  date_of_birth DATE,
  gender ENUM('Male', 'Female', 'Other'),
  portfolio_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  github_url VARCHAR(255),
  website_url VARCHAR(255),
  is_profile_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Deployment Checklist

- [ ] Backend controller deployed to Spring Boot
- [ ] DTO class deployed
- [ ] Repository interface created
- [ ] Frontend script added to static/js/
- [ ] Script tag added to candidate-profile.html
- [ ] Form field IDs match required list
- [ ] Database tables created via schema.sql
- [ ] Spring Boot server running
- [ ] API endpoints accessible
- [ ] Test on localhost first
- [ ] Test save functionality
- [ ] Test load functionality
- [ ] Test offline behavior
- [ ] Deploy to Hostinger
- [ ] Update API URL in script if needed
- [ ] Test on production domain

---

## Support

For issues or questions:
1. Check console logs (F12)
2. Check network tab for API calls
3. Verify database connectivity
4. Ensure user is logged in
5. Check that all form field IDs are correct

---

## Notes

- Data persists in browser even after close
- Data syncs to database when internet available
- On new device, loads from database
- No duplicate profiles - updates existing one
- Automatic retry handles temporary outages
- All data encrypted in transit (HTTPS on production)

---

## Future Enhancements

Optional features you can add later:
- [ ] Auto-save on every field change
- [ ] Profile progress percentage
- [ ] Field validation before save
- [ ] File upload for photo/resume
- [ ] Versioning/history tracking
- [ ] Undo/redo functionality
- [ ] Export profile as PDF
