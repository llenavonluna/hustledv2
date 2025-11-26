# HustlEd - Student-Company Matching Platform

A comprehensive web application connecting Letran students with partner companies for On-the-Job Training (OJT), internships, and real-world experience opportunities.

## 🎯 Project Overview

**HustlEd** is a dedicated platform that streamlines the matching process between students and employers. The platform features:

- **Dynamic Header System** - Single-source-of-truth header across 58+ HTML pages
- **State-Based Authentication UI** - Show/hide buttons based on login status
- **Student Profiles** - Comprehensive CV and resume management
- **Job Listings** - Browse and apply for OJT positions
- **Company Directory** - Discover partner companies
- **Real-time Synchronization** - Multi-tab login state sync via localStorage

## 🏗️ Architecture

### Tech Stack

- **Backend**: Spring Boot 3.5.7 (Java 17) with MySQL
- **Frontend**: HTML5, CSS3 (SCSS), Vanilla JavaScript (ES6+)
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome 6.4.0+, Bootstrap Icons
- **Database**: MySQL on Hostinger
- **Build Tool**: Maven
- **Features**: LocalStorage for client-side auth, AJAX for dynamic updates

### Project Structure

```
hustled/
├── src/
│   ├── main/
│   │   ├── java/com/example/hustled/     # Java backend code
│   │   ├── resources/
│   │   │   ├── application.properties    # Spring Boot config
│   │   │   ├── jobzilla/                 # Frontend files
│   │   │   │   ├── jobzilla/            # Main HTML pages (58+)
│   │   │   │   ├── js/                  # JavaScript (header-injector.js, auth.js)
│   │   │   │   ├── css/                 # Stylesheets
│   │   │   │   └── images/              # Assets
│   │   │   ├── sql/
│   │   │   │   ├── schema.sql           # Database schema
│   │   │   │   └── data.sql             # Sample data
│   │   │   └── static/                  # Static resources
│   │   └── templates/                   # Thymeleaf templates
│   └── test/java/                       # Unit tests
├── pom.xml                              # Maven dependencies
├── mvnw / mvnw.cmd                      # Maven wrapper
└── README.md
```

## 🚀 Key Features

### 1. Dynamic Header System

**Problem Solved**: Eliminated 55+ hardcoded header duplicates across the site

**Solution**:
- **header.html** - Single template with dual-state UI (guest & logged-in views)
- **header-injector.js** - Async JS manager that injects header into 58+ pages
- Graceful degradation with fallback hardcoded headers
- Multi-tab synchronization via storage events

**Files**:
- `src/main/resources/jobzilla/jobzilla/header.html`
- `src/main/resources/jobzilla/jobzilla/js/header-injector.js`

### 2. Authentication System

**Features**:
- Candidate & Employer sign-up/login
- Bcrypt password hashing (10 rounds)
- localStorage-based session management
- Multi-tab authentication sync
- Role-based UI rendering

**Files**:
- `src/main/resources/jobzilla/jobzilla/js/auth.js`
- Backend: `src/main/java/com/example/hustled/controller/AuthController.java`

### 3. Dynamic Button Visibility

**Implementation**:
```html
<!-- Button container with ID for JavaScript targeting -->
<div class="extra-cell" id="nav-auth-buttons">
    <button>Sign Up</button>
    <button>Login</button>
</div>

<script>
function updateAuthUI() {
    const user = localStorage.getItem('user');
    const container = document.getElementById('nav-auth-buttons');
    
    if (user) {
        container.style.display = 'none';  // Hide for logged-in users
    } else {
        container.style.display = 'block'; // Show for guests
    }
}

// Listen to storage changes for multi-tab sync
window.addEventListener('storage', updateAuthUI);
</script>
```

## 🔧 Installation & Setup

### Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8.0+
- Node.js (optional, for frontend dependencies)

### Local Development

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/hustled.git
cd hustled
```

2. **Configure Database**
```bash
# Update application.properties
vim src/main/resources/application.properties

# Configure:
spring.datasource.url=jdbc:mysql://localhost:3306/hustleddb
spring.datasource.username=root
spring.datasource.password=your_password
```

3. **Create Database**
```bash
mysql -u root -p < src/main/resources/sql/schema.sql
mysql -u root -p hustleddb < src/main/resources/sql/data.sql
```

4. **Build & Run**
```bash
# Clean build
./mvnw clean package -DskipTests

# Run locally
./mvnw spring-boot:run

# Application runs on: http://localhost:3000
```

### Production Deployment (Hostinger)

1. **Create Hostinger Database**
   - Database: `u454581444_hustleddb`
   - User: `u454581444_hustled_user`
   - Grant ALL PRIVILEGES

2. **Import Schema & Data**
   - Use Hostinger phpMyAdmin
   - Upload `schema.sql` then `data.sql`

3. **Update Configuration**
```properties
spring.datasource.url=jdbc:mysql://hostinger-db-host:3306/u454581444_hustleddb
spring.datasource.username=u454581444_hustled_user
spring.datasource.password=your_password
```

4. **Build & Deploy**
```bash
./mvnw clean package -DskipTests
# Upload JAR to Hostinger and run
```

## 📋 Database Schema

### Tables

**users**
- id (INT, PRIMARY KEY)
- username (VARCHAR 255, UNIQUE)
- password (VARCHAR 255, bcrypt hash)
- email (VARCHAR 255, UNIQUE)
- phone (VARCHAR 20)
- role (ENUM: 'USER', 'ADMIN')
- created_at (TIMESTAMP)

**jobs**
- id (INT, PRIMARY KEY)
- title (VARCHAR 255)
- company (VARCHAR 255)
- location (VARCHAR 255)
- description (TEXT)
- posted_by (INT, FOREIGN KEY → users.id)
- created_at (TIMESTAMP)

### Sample Data

- Test Candidate: `nhyll` / `password`
- Test Admin: `admin` / `password`

## 🎨 Frontend Architecture

### Header Injection Flow

```
1. Browser loads HTML page
2. Script tag in <head> loads header-injector.js
3. DOMContentLoaded event fired
4. Fetches header.html template
5. Checks localStorage for user state
6. Injects appropriate header (#header-guest or #header-loggedin)
7. Fallback: Show hardcoded header if injection fails
8. updateAuthUI() called to show/hide auth buttons
```

### Authentication Flow

```
1. User submits login form
2. POST to /api/auth/login/{role}
3. Server validates credentials (bcrypt)
4. Returns JSON with user data
5. Frontend stores in localStorage
6. storage event fires across tabs
7. updateAuthUI() called → buttons hidden
8. Page redirects to dashboard
```

## 🔒 Security Features

- **Password Hashing**: Bcrypt with 10 salt rounds
- **CORS**: Configured for same-origin requests
- **Input Validation**: Server-side validation on all endpoints
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: HTML encoding on output
- **HTTPS Ready**: Can be deployed with SSL on Hostinger

## 📱 Pages Included

**Public Pages** (58+ total):
- index.html - Home page
- job-grid.html - Browse jobs
- candidate-grid.html - Browse candidates
- job-view.html - Job details
- register.html - Sign up
- login.html - Login
- about-1.html - About page
- And 51+ more pages

**Protected Pages**:
- candidate-dashboard.html - Student dashboard
- candidate-profile.html - Profile management
- dash-post-job.html - Post job (employer)
- admin-jobs.html - Admin panel

## 🤝 API Endpoints

### Authentication
- `POST /api/auth/signup/candidate` - Register student
- `POST /api/auth/signup/admin` - Register employer
- `POST /api/auth/login/candidate` - Student login
- `POST /api/auth/login/admin` - Employer login

### Jobs
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create job (admin only)
- `GET /api/jobs/{id}` - Get job details

### Users
- `GET /api/users` - List candidates
- `GET /api/users/{id}` - Get candidate profile

## 🐛 Troubleshooting

### Header not appearing
```javascript
// Check in browser console:
fetch('/header.html').then(r => r.text()).then(console.log)
// If fails, check path in header-injector.js
```

### Auth buttons still showing after login
```javascript
// Check localStorage:
localStorage.getItem('user')
// If null, login didn't save properly
// Check browser console for errors
```

### Database connection error
```bash
# Verify connection:
mysql -u u454581444_hustled_user -p -h hostinger-db-host u454581444_hustleddb

# Check Spring logs:
tail -f /tmp/server.log | grep -i "database\|connection"
```

## 📈 Performance Optimizations

- Header caching: 1-minute client-side cache
- Lazy loading: Images use native `loading="lazy"`
- CSS/JS minification via Maven build
- Bootstrap 5 grid system for responsive design
- Database indexing on frequently queried columns

## 🎓 Code Examples

### Dynamic Header Usage

Every HTML page includes:
```html
<script src="js/header-injector.js"></script>
<div id="dynamic-header-container"></div>
<header class="site-header">
    <!-- Fallback hardcoded header -->
</header>
```

### Authentication Check

```javascript
function isLoggedIn() {
    return !!localStorage.getItem('user');
}

function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Protect page:
if (!isLoggedIn()) {
    window.location.href = 'register.html';
}
```

## 📝 Recent Changes

### Latest Modifications (November 26, 2025)
- Implemented container-based auth button hiding
- Added `id="nav-auth-buttons"` to button container
- Updated `updateAuthUI()` to toggle entire container
- Deployed to local Java server
- Set up Hostinger database

## 📞 Contact & Support

**Team Members**:
- John Lloyd Calizo - Lead Web Developer
- Justine Coz - Database Administrator
- Ma. Florence Jayme - Documentation Specialist
- Charlotte Uraga - Content Writer
- Justin Gomez - Researcher
- Kennieth Dulay - Researcher

**Email**: hustled2025@gmail.com

## 📄 License

Proprietary - Letran BSIT 4 Block 1

## 🙏 Acknowledgments

- Letran Manaoag for platform opportunity
- Partner companies for supporting OJT program
- Bootstrap & FontAwesome communities

---

**Last Updated**: November 26, 2025  
**Version**: 1.0.0-SNAPSHOT  
**Status**: In Development
