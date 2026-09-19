-- Azhari Academy Tutors — MySQL/MariaDB initial schema
-- Run against a dedicated UTF8MB4 database before starting the application.

CREATE TABLE IF NOT EXISTS roles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_ar VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY roles_code_unique (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS permissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY permissions_code_unique (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS staff_users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(190) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY staff_users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS staff_role_assignments (
  staff_user_id BIGINT UNSIGNED NOT NULL,
  role_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (staff_user_id, role_id),
  CONSTRAINT staff_roles_user_fk FOREIGN KEY (staff_user_id) REFERENCES staff_users(id) ON DELETE CASCADE,
  CONSTRAINT staff_roles_role_fk FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id BIGINT UNSIGNED NOT NULL,
  permission_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT role_permissions_role_fk FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT role_permissions_permission_fk FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS applications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  reference_number VARCHAR(32) NOT NULL,
  email VARCHAR(190) NOT NULL,
  preferred_locale ENUM('en', 'ar') NOT NULL DEFAULT 'en',
  status ENUM(
    'draft', 'submitted', 'under_review', 'more_information_required', 'shortlisted',
    'interview_scheduled', 'assessment_required', 'documents_verification', 'accepted',
    'waiting_list', 'rejected', 'withdrawn', 'archived'
  ) NOT NULL DEFAULT 'draft',
  current_step SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  form_data JSON NOT NULL,
  assigned_to BIGINT UNSIGNED NULL,
  submitted_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  archived_at DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY applications_reference_unique (reference_number),
  KEY applications_email_index (email),
  KEY applications_status_index (status),
  KEY applications_assigned_index (assigned_to),
  KEY applications_submitted_index (submitted_at),
  CONSTRAINT applications_assigned_fk FOREIGN KEY (assigned_to) REFERENCES staff_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS secure_access_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  application_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  purpose ENUM('applicant_access', 'email_verification', 'information_request') NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY access_tokens_hash_unique (token_hash),
  KEY access_tokens_lookup (application_id, purpose, expires_at),
  CONSTRAINT access_tokens_application_fk FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS application_status_history (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  application_id BIGINT UNSIGNED NOT NULL,
  from_status VARCHAR(50) NULL,
  to_status VARCHAR(50) NOT NULL,
  changed_by BIGINT UNSIGNED NULL,
  reason_code VARCHAR(100) NULL,
  note TEXT NULL,
  applicant_message TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY status_history_application_index (application_id, created_at),
  CONSTRAINT status_history_application_fk FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  CONSTRAINT status_history_staff_fk FOREIGN KEY (changed_by) REFERENCES staff_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS internal_notes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  application_id BIGINT UNSIGNED NOT NULL,
  author_id BIGINT UNSIGNED NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY internal_notes_application_index (application_id, created_at),
  CONSTRAINT internal_notes_application_fk FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  CONSTRAINT internal_notes_author_fk FOREIGN KEY (author_id) REFERENCES staff_users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS evaluations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  application_id BIGINT UNSIGNED NOT NULL,
  evaluator_id BIGINT UNSIGNED NOT NULL,
  evaluation_type ENUM('initial_review', 'interview', 'assessment', 'demo_lesson') NOT NULL,
  subject_knowledge TINYINT UNSIGNED NULL,
  recitation_quality TINYINT UNSIGNED NULL,
  teaching_ability TINYINT UNSIGNED NULL,
  language_proficiency TINYINT UNSIGNED NULL,
  communication TINYINT UNSIGNED NULL,
  child_teaching TINYINT UNSIGNED NULL,
  technical_readiness TINYINT UNSIGNED NULL,
  availability_commitment TINYINT UNSIGNED NULL,
  recommendation ENUM('accept', 'next_stage', 'hold', 'reject') NULL,
  notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY evaluations_application_index (application_id, created_at),
  CONSTRAINT evaluations_application_fk FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  CONSTRAINT evaluations_staff_fk FOREIGN KEY (evaluator_id) REFERENCES staff_users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS interviews (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  application_id BIGINT UNSIGNED NOT NULL,
  interview_type ENUM('introductory', 'subject_assessment', 'language_assessment', 'demo_lesson', 'final') NOT NULL,
  starts_at DATETIME NOT NULL,
  duration_minutes SMALLINT UNSIGNED NOT NULL DEFAULT 30,
  meeting_url VARCHAR(1000) NULL,
  interviewer_id BIGINT UNSIGNED NULL,
  status ENUM('scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled') NOT NULL DEFAULT 'scheduled',
  notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY interviews_schedule_index (starts_at, status),
  KEY interviews_application_index (application_id),
  CONSTRAINT interviews_application_fk FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  CONSTRAINT interviews_staff_fk FOREIGN KEY (interviewer_id) REFERENCES staff_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS application_files (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  application_id BIGINT UNSIGNED NOT NULL,
  category ENUM('cv', 'photo', 'certificate', 'ijazah', 'identity', 'other') NOT NULL,
  storage_key VARCHAR(500) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  size_bytes BIGINT UNSIGNED NOT NULL,
  uploaded_by_staff_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY application_files_application_index (application_id, category),
  CONSTRAINT application_files_application_fk FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  CONSTRAINT application_files_staff_fk FOREIGN KEY (uploaded_by_staff_id) REFERENCES staff_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS staff_sessions (
  id CHAR(64) NOT NULL,
  staff_user_id BIGINT UNSIGNED NOT NULL,
  expires_at DATETIME NOT NULL,
  last_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ip_hash CHAR(64) NULL,
  user_agent VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY staff_sessions_expiry_index (expires_at),
  CONSTRAINT staff_sessions_user_fk FOREIGN KEY (staff_user_id) REFERENCES staff_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  application_id BIGINT UNSIGNED NULL,
  template_code VARCHAR(100) NULL,
  recipient VARCHAR(190) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  status ENUM('queued', 'sent', 'failed') NOT NULL DEFAULT 'queued',
  provider_message_id VARCHAR(255) NULL,
  error_message TEXT NULL,
  sent_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY email_messages_application_index (application_id, created_at),
  CONSTRAINT email_messages_application_fk FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  staff_user_id BIGINT UNSIGNED NULL,
  application_id BIGINT UNSIGNED NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NULL,
  metadata JSON NULL,
  ip_hash CHAR(64) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY audit_logs_application_index (application_id, created_at),
  KEY audit_logs_staff_index (staff_user_id, created_at),
  CONSTRAINT audit_logs_staff_fk FOREIGN KEY (staff_user_id) REFERENCES staff_users(id) ON DELETE SET NULL,
  CONSTRAINT audit_logs_application_fk FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO roles (code, name_en, name_ar) VALUES
  ('super_admin', 'Super Admin', 'مدير عام'),
  ('recruitment_manager', 'Recruitment Manager', 'مدير التوظيف'),
  ('assistant', 'Assistant', 'مساعد'),
  ('interviewer', 'Interviewer', 'مسؤول مقابلة'),
  ('viewer', 'Viewer', 'مشاهد');

INSERT IGNORE INTO permissions (code, description) VALUES
  ('applications.view_all', 'View all applications'),
  ('applications.view_assigned', 'View assigned applications'),
  ('applications.assign', 'Assign applications'),
  ('applications.change_status', 'Change application status'),
  ('applications.accept', 'Accept applicants'),
  ('applications.reject', 'Reject applicants'),
  ('applications.export', 'Export application data'),
  ('files.view_sensitive', 'View sensitive applicant files'),
  ('notes.create', 'Create internal notes'),
  ('evaluations.create', 'Create evaluations'),
  ('interviews.manage', 'Manage interviews'),
  ('staff.manage', 'Manage staff users and roles'),
  ('settings.manage', 'Manage system settings'),
  ('audit.view', 'View audit logs');
