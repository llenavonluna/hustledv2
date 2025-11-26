
-- ========================================
-- HUSTLED RECRUITMENT PLATFORM DATABASE
-- Complete Normalized Schema v1.0
-- ========================================

CREATE DATABASE IF NOT EXISTS hustleddb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hustleddb;

-- ========================================
-- SECTION 1: CORE USER MANAGEMENT
-- ========================================

-- Users table - Base authentication for both candidates and employers
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('candidate', 'employer', 'admin') NOT NULL DEFAULT 'candidate',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username),
  INDEX idx_role (role)
) ENGINE=InnoDB;

-- ========================================
-- SECTION 2: CANDIDATE PROFILE TABLES
-- ========================================

-- Candidate profile - Main candidate information
CREATE TABLE IF NOT EXISTS candidate_profiles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNIQUE NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  headline VARCHAR(150),
  bio TEXT,
  photo_url VARCHAR(255),
  resume_url VARCHAR(255),
  date_of_birth DATE,
  gender ENUM('Male', 'Female', 'Other'),
  address VARCHAR(255),
  city VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(10),
  website_url VARCHAR(255),
  portfolio_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  github_url VARCHAR(255),
  is_profile_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_candidate_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- Skills - Candidate skills and proficiencies
CREATE TABLE IF NOT EXISTS candidate_skills (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  candidate_id BIGINT NOT NULL,
  skill_name VARCHAR(100) NOT NULL,
  proficiency_level ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') DEFAULT 'Intermediate',
  years_of_experience INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_candidate_skill FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  INDEX idx_candidate_id (candidate_id),
  INDEX idx_skill_name (skill_name)
) ENGINE=InnoDB;

-- Work Experience - Candidate employment history
CREATE TABLE IF NOT EXISTS candidate_experiences (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  candidate_id BIGINT NOT NULL,
  job_title VARCHAR(150) NOT NULL,
  company_name VARCHAR(150) NOT NULL,
  employment_type ENUM('Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship') NOT NULL,
  location VARCHAR(150),
  start_date DATE NOT NULL,
  end_date DATE,
  is_current_job BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_experience_candidate FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  INDEX idx_candidate_id (candidate_id),
  INDEX idx_start_date (start_date)
) ENGINE=InnoDB;

-- Education - Candidate educational background
CREATE TABLE IF NOT EXISTS candidate_education (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  candidate_id BIGINT NOT NULL,
  school_name VARCHAR(200) NOT NULL,
  degree VARCHAR(100) NOT NULL,
  field_of_study VARCHAR(150),
  start_date DATE NOT NULL,
  end_date DATE,
  grade_gpa VARCHAR(10),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_education_candidate FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  INDEX idx_candidate_id (candidate_id)
) ENGINE=InnoDB;

-- Certifications - Professional certifications and achievements
CREATE TABLE IF NOT EXISTS candidate_certifications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  candidate_id BIGINT NOT NULL,
  certification_name VARCHAR(200) NOT NULL,
  issuing_organization VARCHAR(150) NOT NULL,
  issue_date DATE NOT NULL,
  expiration_date DATE,
  credential_url VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_certification_candidate FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  INDEX idx_candidate_id (candidate_id)
) ENGINE=InnoDB;

-- ========================================
-- SECTION 3: EMPLOYER/COMPANY PROFILE
-- ========================================

-- Employer Company Profile
CREATE TABLE IF NOT EXISTS employer_profiles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNIQUE NOT NULL,
  company_name VARCHAR(200) NOT NULL,
  company_logo_url VARCHAR(255),
  company_website VARCHAR(255),
  company_description TEXT,
  industry VARCHAR(100),
  company_size ENUM('1-10', '11-50', '51-200', '201-1000', '1000+'),
  founded_year INT,
  headquarters_location VARCHAR(255),
  phone_number VARCHAR(20),
  address VARCHAR(255),
  city VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(10),
  social_media_linkedin VARCHAR(255),
  social_media_twitter VARCHAR(255),
  social_media_facebook VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_employer_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_company_name (company_name)
) ENGINE=InnoDB;

-- ========================================
-- SECTION 4: JOBS & APPLICATIONS
-- ========================================

-- Job Listings
CREATE TABLE IF NOT EXISTS jobs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employer_id BIGINT NOT NULL,
  job_title VARCHAR(150) NOT NULL,
  job_description TEXT NOT NULL,
  job_type ENUM('Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Temporary') NOT NULL,
  location VARCHAR(150) NOT NULL,
  salary_min DECIMAL(10, 2),
  salary_max DECIMAL(10, 2),
  currency VARCHAR(10) DEFAULT 'PHP',
  salary_negotiable BOOLEAN DEFAULT FALSE,
  experience_required INT,
  education_required VARCHAR(100),
  required_skills TEXT,
  responsibilities TEXT,
  benefits TEXT,
  status ENUM('Open', 'Closed', 'Draft', 'On Hold') DEFAULT 'Open',
  posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  application_deadline DATE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_job_employer FOREIGN KEY (employer_id) REFERENCES employer_profiles(id) ON DELETE CASCADE,
  INDEX idx_employer_id (employer_id),
  INDEX idx_status (status),
  INDEX idx_posted_date (posted_date),
  INDEX idx_job_title (job_title)
) ENGINE=InnoDB;

-- Job Applications
CREATE TABLE IF NOT EXISTS job_applications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  job_id BIGINT NOT NULL,
  candidate_id BIGINT NOT NULL,
  applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cover_letter TEXT,
  resume_url VARCHAR(255),
  status ENUM('Applied', 'Reviewed', 'Interview Scheduled', 'Rejected', 'Accepted', 'Withdrawn') DEFAULT 'Applied',
  rating INT,
  notes TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_application_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  CONSTRAINT fk_application_candidate FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  INDEX idx_job_id (job_id),
  INDEX idx_candidate_id (candidate_id),
  INDEX idx_status (status),
  UNIQUE KEY unique_application (job_id, candidate_id)
) ENGINE=InnoDB;

-- ========================================
-- SECTION 5: MESSAGING & COMMUNICATION
-- ========================================

-- Conversations (threads between users)
CREATE TABLE IF NOT EXISTS conversations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  sender_id BIGINT NOT NULL,
  recipient_id BIGINT NOT NULL,
  subject VARCHAR(200),
  last_message_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_conversation_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_conversation_recipient FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sender_id (sender_id),
  INDEX idx_recipient_id (recipient_id),
  UNIQUE KEY unique_conversation (sender_id, recipient_id)
) ENGINE=InnoDB;

-- Messages (individual messages within conversations)
CREATE TABLE IF NOT EXISTS messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  conversation_id BIGINT NOT NULL,
  sender_id BIGINT NOT NULL,
  message_text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  attachment_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_message_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  CONSTRAINT fk_message_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_conversation_id (conversation_id),
  INDEX idx_sender_id (sender_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ========================================
-- SECTION 6: ADDITIONAL FEATURES
-- ========================================

-- Saved Jobs - Candidates can save/bookmark jobs
CREATE TABLE IF NOT EXISTS saved_jobs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  candidate_id BIGINT NOT NULL,
  job_id BIGINT NOT NULL,
  saved_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_saved_job_candidate FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_saved_job_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  INDEX idx_candidate_id (candidate_id),
  INDEX idx_job_id (job_id),
  UNIQUE KEY unique_saved_job (candidate_id, job_id)
) ENGINE=InnoDB;

-- Job Alerts - Email notification preferences
CREATE TABLE IF NOT EXISTS job_alerts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  candidate_id BIGINT NOT NULL,
  job_title_keywords VARCHAR(255),
  location VARCHAR(150),
  job_type ENUM('Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'),
  salary_min DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  frequency ENUM('Daily', 'Weekly', 'Monthly') DEFAULT 'Weekly',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_alert_candidate FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  INDEX idx_candidate_id (candidate_id)
) ENGINE=InnoDB;

-- Interviews - Track scheduled interviews
CREATE TABLE IF NOT EXISTS interviews (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  application_id BIGINT NOT NULL,
  interview_date DATETIME NOT NULL,
  interview_type ENUM('Phone', 'Video', 'In-Person') DEFAULT 'Video',
  location VARCHAR(255),
  interviewer_id BIGINT,
  interview_notes TEXT,
  feedback TEXT,
  status ENUM('Scheduled', 'Completed', 'Cancelled', 'No-Show') DEFAULT 'Scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_interview_application FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE,
  CONSTRAINT fk_interview_interviewer FOREIGN KEY (interviewer_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_application_id (application_id),
  INDEX idx_interview_date (interview_date)
) ENGINE=InnoDB;

-- ========================================
-- SECTION 7: AUDIT & TRACKING
-- ========================================

-- Audit Log - Track user activities
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id BIGINT,
  old_value TEXT,
  new_value TEXT,
  ip_address VARCHAR(45),
  user_agent VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_action (action)
) ENGINE=InnoDB;

-- ========================================
-- DATABASE COMPLETE & READY FOR USE
-- ========================================