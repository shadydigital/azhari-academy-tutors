# Azhari Academy Tutors — Product & Implementation Brief

> Living reference for the design, implementation, review, and deployment of `tutors.azhariacademy.com`.
>
> Status: Approved discovery scope — ready for implementation.
> Last updated: 2026-09-19.

## 1. Product Summary

**Azhari Academy Tutors** is a bilingual recruitment portal and applicant tracking system for teachers who want to work with Azhari Academy.

It is not a public tutor directory, student booking platform, or learning management system. Its purpose is to:

- Attract qualified teaching applicants.
- Collect consistent, complete applications.
- Let academy staff review, assign, evaluate, interview, accept, reject, and archive applicants.
- Preserve an auditable history of every application and hiring decision.

## 2. Product Principles

- The application form is the primary product experience.
- English is the default language; Arabic is fully supported with RTL layout.
- The public landing page stays intentionally short and sends users directly to the application.
- Applicants should not need to create a password-based account.
- Sensitive documents are requested only when operationally necessary.
- Hiring decisions remain human decisions; scores may assist but must not reject applicants automatically.
- Internal notes, ratings, and decision reasons are never visible to applicants.
- All privileged actions are authorized on the server and recorded in an audit log.

## 3. Users and Roles

### Applicant

A teacher who starts, saves, completes, or updates an application.

### Super Admin

Has full access to applications, settings, staff accounts, permissions, exports, sensitive files, and audit logs.

### Recruitment Manager

Manages applicants, assignments, workflow stages, interviews, evaluations, messages, and hiring decisions within granted permissions.

### Assistant

Reviews assigned applications, requests missing information, records notes, and schedules interviews. Cannot make a final hiring decision unless explicitly granted permission.

### Interviewer

Can view assigned applicants and interviews, then submit interview or demo-lesson evaluations.

### Viewer

Has limited read-only access to permitted application data.

## 4. Languages

- Default: English (`en`).
- Secondary: Arabic (`ar`).
- Arabic uses a complete RTL layout.
- Switching languages must preserve the current application step and entered data.
- System content, validation messages, emails, question labels, and workflow labels must be localizable.
- Applicant-entered content is displayed as entered and is not automatically translated.

## 5. Public Experience

### 5.1 Minimal Landing Page

The landing page should contain only:

- Azhari Academy logo and identity.
- Language switcher.
- A simple headline such as **Teach with Azhari Academy**.
- A short, general description of the opportunity to join the academy's teaching team.
- A dominant **Start Your Application** call to action.
- A secondary **Continue an Existing Application** action.
- Privacy and contact links in the footer.
- A discreet staff login link in the footer.

Long sections about the academy, benefits, testimonials, frequently asked questions, and marketing content are outside the initial scope.

### 5.2 Applicant Access Model

- Applicants do not create passwords.
- After entering an email address, the system verifies ownership and issues a secure, expiring link.
- The secure link allows the applicant to resume a draft or provide requested information.
- Submitted applications receive a human-readable reference number.
- Links and verification codes must expire and be single-use or safely revocable where appropriate.

## 6. Application Form

The application is a mobile-friendly multi-step form with clear progress, step-level validation, automatic saving, and a final review screen.

### Step 1 — Personal and Contact Information

- Full name in Arabic.
- Full name in English as written on official documents.
- Email address.
- WhatsApp/mobile number with country code.
- Country and city.
- Time zone.
- Gender.
- Confirmation that the applicant is at least 18 years old.
- Preferred contact method.
- Professional photo, optional initially.

Do not request full date of birth, marital status, or other data that is not required for recruitment.

### Step 2 — Education

- Al-Azhar affiliation or graduation status.
- University or institute.
- Faculty and department.
- Qualification or degree.
- Graduation year.
- Additional academic qualifications.
- Ability to add multiple education records.

Al-Azhar graduation must not be an automatic rejection rule in the initial release. Staff review the applicant's overall qualifications.

### Step 3 — Ijazahs and Certifications

- Whether the applicant holds a Quran ijazah.
- Ijazah type, narration, or qira'at.
- Granting sheikh or institution.
- Arabic-teaching certificates.
- Teaching or education certificates.
- Other relevant certificates.
- Ability to add multiple records.

Questions in this step should be conditional on earlier answers.

### Step 4 — Teaching Specializations

Supported initial specializations:

- Quran recitation.
- Tajweed.
- Memorization and revision.
- Qira'at and ijazah preparation.
- Noor Al-Bayan or foundational Arabic reading.
- Arabic for non-native speakers.
- Arabic conversation and grammar.
- Islamic studies.
- Teaching children.
- Teaching adults and advanced learners.

For each selected specialization, collect a self-declared proficiency level and relevant experience.

Also collect:

- Preferred learner age groups.
- Ability to teach non-Arabic speakers.
- Ability to teach male or female students according to academy policy.
- Relevant experience with different learning needs, if applicable.

### Step 5 — Work Experience

- Total years of teaching experience.
- Years of online teaching experience.
- Previous employers or academies.
- Responsibilities and subjects taught.
- Learner profiles and age groups.
- Typical class load, if relevant.
- Reason for leaving the latest position, if appropriate.
- Optional professional references.
- CV upload in PDF format.

### Step 6 — Languages

For every language:

- Language name.
- Speaking level.
- Writing level.
- Ability to teach or explain in that language.

The initial interface should support common choices and an `Other` option.

### Step 7 — Remote Teaching Readiness

- Primary computer or teaching device.
- Camera availability.
- Microphone or headset availability.
- Internet quality.
- Quiet teaching space.
- Backup option for internet or electricity interruptions.
- Experience with Zoom, Google Meet, screen sharing, and digital whiteboards.
- Optional internet speed evidence, preferably deferred until interview if not needed initially.

### Step 8 — Availability

- Available days.
- One or more available time ranges per day.
- Applicant time zone.
- Weekly teaching-hour capacity.
- Evening availability.
- Weekend availability.
- Earliest start date.
- Preference for fixed or flexible hours.
- Willingness to commit to a regular schedule.

Availability is stored in a time-zone-safe format and displayed to staff in both the applicant's time zone and Cairo time.

### Step 9 — Initial Evaluation Questions

Initial long-form questions should cover:

- Motivation for applying to Azhari Academy.
- Handling a child who loses focus during a lesson.
- Explaining Tajweed or Arabic to a non-Arabic speaker.
- Characteristics of an effective online lesson.
- Tracking learner progress.
- A difficult teaching situation and how it was handled.
- Expectations from the academy.

Questions may vary by specialization and must be manageable from the admin settings in a later iteration. The first release may seed a fixed approved question set.

### Step 10 — Media and Documents

- CV.
- Optional professional photo.
- Relevant certificates.
- Introductory video link.

The introductory video should normally be a private/unlisted YouTube or Google Drive link in the MVP. Direct video uploads are deferred unless external object storage and operational limits are confirmed.

Government ID or passport documents should be requested only after the applicant passes the early stages.

### Step 11 — Review, Consent, and Submission

- Review and edit all answers.
- Confirm that submitted information is accurate.
- Accept the privacy notice.
- Consent to recruitment-related communication.
- Consent to qualification verification where necessary.
- Confirm that submitting an application is not an employment offer.
- Submit the application.

On successful submission:

- Generate an application reference number.
- Show a confirmation page.
- Send a confirmation email.
- Explain the next step without promising a guaranteed response date.

## 7. Form Behavior and Validation

- Autosave completed and partially completed steps.
- Preserve data when switching languages.
- Validate each step before continuing.
- Show clear bilingual validation errors.
- Support keyboard navigation and accessible labels.
- Prevent accidental duplicate submissions.
- Detect likely duplicates by normalized email and phone number; staff decide whether to merge or retain them.
- Enforce allowed file types and sizes.
- Scan or quarantine uploads where the hosting/storage setup allows it.
- Protect public endpoints from bots, spam, and excessive requests.
- Do not use browser storage as the authoritative source for application data.

## 8. Application Workflow

Initial workflow statuses:

1. `draft` — Draft.
2. `submitted` — Submitted.
3. `under_review` — Under Review.
4. `more_information_required` — More Information Required.
5. `shortlisted` — Shortlisted.
6. `interview_scheduled` — Interview Scheduled.
7. `assessment_required` — Assessment / Demo Required.
8. `documents_verification` — Documents Verification.
9. `accepted` — Accepted.
10. `waiting_list` — Waiting List.
11. `rejected` — Rejected.
12. `withdrawn` — Withdrawn.
13. `archived` — Archived.

Every transition must record:

- Previous and new status.
- Staff member responsible.
- Timestamp.
- Internal reason or note.
- Applicant-facing message, if one was sent.

Applications are archived instead of being hard-deleted through normal admin workflows.

## 9. Admin Portal

### 9.1 Authentication

- Staff-only sign-in.
- Secure password reset.
- Server-managed sessions using secure, HTTP-only cookies.
- Optional or required two-factor authentication for privileged roles in a later hardening step.
- Rate limiting and temporary lockout for repeated failed sign-ins.

### 9.2 Dashboard

Show actionable operational counts:

- New applications.
- Applications awaiting review.
- Applications requiring follow-up.
- Upcoming interviews.
- Overdue tasks.
- Shortlisted applicants.
- Accepted, rejected, waiting-list, and withdrawn counts.
- Distribution by specialization, language, gender, and qualification where useful.

### 9.3 Applicants List

Support search and filtering by:

- Name, email, phone, or reference number.
- Status.
- Specialization.
- Gender.
- Language.
- Country.
- Al-Azhar education.
- Years of experience.
- Availability.
- Assigned staff member.
- Submission date.
- Evaluation score or recommendation.

The MVP uses a clear table/list view. A Kanban pipeline view may follow later.

### 9.4 Applicant Detail

The staff view contains:

- Applicant summary.
- Complete form answers.
- Education, qualifications, ijazahs, languages, and experience.
- Availability.
- CV and permitted attachments.
- Introductory video link.
- Status and assignment.
- Evaluations.
- Interviews and demo lessons.
- Internal notes.
- Applicant communication history.
- Complete workflow timeline.

Core actions:

- Assign or reassign applicant.
- Request more information.
- Change workflow stage.
- Schedule an interview.
- Record assessment or demo outcome.
- Add evaluation and internal notes.
- Add to waiting list.
- Accept or reject with a reason.

### 9.5 Evaluation

Standard evaluation categories:

- Subject-matter knowledge.
- Quran recitation or specialization quality.
- Teaching and explanation ability.
- Language proficiency.
- Communication and professional presence.
- Ability to work with children.
- Remote-teaching readiness.
- Availability and commitment.
- Overall assessment.
- Recommendation.

Scores support comparison but never trigger automatic rejection.

### 9.6 Interviews and Demo Lessons

- Interview or assessment type.
- Date, time, and time zone.
- Assigned interviewer or panel.
- Meeting link.
- Applicant invitation and reminder.
- Attendance state.
- Structured evaluation.
- Outcome and next recommended action.

### 9.7 Communication Templates

Initial bilingual email templates:

- Application received.
- Email verification.
- Additional information requested.
- Interview invitation.
- Interview reminder.
- Demo lesson or assessment invitation.
- Waiting-list notification.
- Preliminary acceptance.
- Rejection/decline message.

All sent messages should be logged against the application.

## 10. Permissions

Permissions must be granular rather than relying only on broad role names.

Key permission groups:

- View all or assigned applications.
- View sensitive fields.
- View or download sensitive files.
- Add internal notes.
- Assign applications.
- Change workflow stages.
- Schedule interviews.
- Submit evaluations.
- Accept applicants.
- Reject applicants.
- Export data.
- Manage questions and templates.
- Manage staff and roles.
- View audit logs.

## 11. Privacy, Security, and Data Handling

- HTTPS is mandatory in production.
- Files must not be stored in a publicly accessible directory.
- Sensitive-document access must be authorized and logged.
- CSRF protection is required for state-changing staff actions.
- Public forms and staff authentication require rate limiting.
- Uploaded files require MIME/type checks, extension checks, and size limits.
- Do not store passwords in plain text; use an appropriate password-hashing algorithm.
- Do not expose internal notes or rejection reasons through applicant endpoints.
- Database backups are required before launch.
- Define a retention policy for rejected, withdrawn, and incomplete applications.
- Provide a privacy notice explaining recruitment data usage and retention.
- Normal staff workflows archive records instead of permanently deleting them.

## 12. MVP Scope

### Included

- Minimal bilingual landing page.
- English default and complete Arabic RTL support.
- Multi-step application form.
- Email verification and secure draft-resume links.
- Draft saving and final submission.
- CV, image, and certificate attachments within approved limits.
- Confirmation page, reference number, and transactional emails.
- Staff authentication and role-based access control.
- Admin dashboard and applicants list.
- Search, filters, assignment, internal notes, and evaluations.
- Workflow status management and history.
- Interview and demo scheduling.
- Acceptance, waiting-list, rejection, withdrawal, and archive actions.
- Email templates and message history.
- Audit logging.
- Basic settings for specialties, staff, and permitted configuration.
- cPanel-compatible production build and health check.

### Deferred

- Public tutor directory.
- Student accounts, lesson booking, or payments.
- Full password-based applicant accounts.
- Direct video upload unless storage is confirmed.
- Built-in video interviewing.
- Automated AI scoring or rejection.
- Electronic contract signing.
- WhatsApp Business API integration.
- Mobile applications.
- Full HR/payroll integration.
- Advanced analytics and Kanban board.

## 13. Recommended Technical Architecture

The application will be a single, maintainable Node.js 22 deployment suitable for cPanel AI App Hosting.

- Full-stack web application using TypeScript.
- Server-rendered public pages where useful.
- MySQL or MariaDB for durable relational data.
- Database migrations committed to source control.
- Private S3-compatible object storage for applicant files where possible.
- Database-backed staff sessions with secure cookies.
- Transactional email through SMTP or an approved email provider.
- Scheduled reminders through cPanel Cron.
- Structured server logs, error reporting, and `/healthz` endpoint.
- Environment-specific secrets managed outside source control.

The final framework and libraries must preserve these operational requirements:

- Bind to `0.0.0.0`.
- Read the port from `process.env.PORT`.
- Provide deterministic `npm run build` and `npm start` commands.
- Avoid relying on ephemeral local files for authoritative applicant data.
- Run correctly on Node.js 22 in production mode.

## 14. Core Data Model

Initial logical entities:

- `staff_users`
- `roles`
- `permissions`
- `staff_role_assignments`
- `applications`
- `applicant_profiles`
- `education_records`
- `certifications`
- `ijazahs`
- `specializations`
- `application_specializations`
- `language_skills`
- `work_experiences`
- `availability_rules`
- `application_answers`
- `application_files`
- `application_status_history`
- `application_assignments`
- `internal_notes`
- `evaluations`
- `interviews`
- `tasks`
- `email_templates`
- `email_messages`
- `secure_access_tokens`
- `audit_logs`
- `system_settings`

Exact fields, indexes, foreign keys, uniqueness constraints, and retention rules must be defined in the implementation schema before feature work proceeds.

## 15. Primary Screens

### Applicant-facing

- Minimal landing page.
- Start/verify application.
- Multi-step application form.
- Resume existing application.
- Review and submit.
- Submission confirmation.
- Provide requested information.
- Privacy notice.

### Staff-facing

- Login and password recovery.
- Dashboard.
- Applicants list.
- Applicant detail.
- Interview and task views.
- Communication templates.
- Application-form configuration.
- Staff and permission management.
- Settings.
- Audit log.

## 16. Implementation Phases

### Phase 1 — Foundation

- Confirm application questions and workflow rules.
- Establish the application structure and bilingual design system.
- Define database schema and migrations.
- Configure environments, secrets, health checks, and deployment scripts.
- Implement staff authentication and authorization foundation.

### Phase 2 — Applicant Experience

- Build the minimal landing page.
- Build email verification and secure resume links.
- Build the multi-step form, validation, and autosave.
- Add approved upload handling.
- Implement review, submission, reference number, and confirmation email.

### Phase 3 — Recruitment Operations

- Build dashboard, applicants list, and filters.
- Build applicant details, assignment, notes, and status workflow.
- Add evaluations, interviews, tasks, and decision actions.
- Implement message templates and communication history.

### Phase 4 — Administration and Hardening

- Add staff, roles, permissions, settings, and audit views.
- Add security controls, upload restrictions, and data-retention behavior.
- Add backups, operational logging, and monitoring.

### Phase 5 — Release

- Test both languages, RTL, mobile, accessibility, workflow, permissions, email, files, and time zones.
- Seed the initial admin securely.
- Prepare MySQL/MariaDB and private file storage.
- Deploy to cPanel with Node.js 22.
- Run production smoke tests and confirm backups.

## 17. Launch Acceptance Criteria

The MVP is ready to publish when:

- A new applicant can verify an email, save a draft, resume it, and submit a complete application.
- Switching between English and Arabic does not lose application data.
- A reference number and confirmation email are generated exactly once per successful submission.
- Unauthorized users cannot access staff pages, internal notes, or private files.
- Staff can search, filter, assign, review, evaluate, and move applications through the approved workflow.
- Interview invitations and key email templates work in both languages.
- All privileged actions create audit records.
- Duplicate submission and upload limits behave correctly.
- The app passes responsive, accessibility, security, and time-zone checks.
- The production build starts on cPanel using the provided port and reports a healthy status.
- Database and file backups have been tested.

## 18. Open Operational Inputs

These inputs can be supplied during implementation and should not block the technical foundation:

- Final approved logo and brand assets.
- Official contact and sender email addresses.
- Exact list of required and optional specializations.
- Final wording and required/optional state of each application question.
- File-size limits and permitted document formats.
- Recruitment inbox and SMTP/provider credentials.
- cPanel database and deployment credentials.
- External private file-storage credentials, if used.
- Initial staff users and their roles.
- Final privacy notice and data-retention period.
- Final interview, assessment, and demo-lesson process.

## 19. Change Control

This document is the implementation reference for the initial release. Material changes to product purpose, workflow, roles, data collection, storage, or launch scope should be recorded here before implementation so product behavior and deployment remain aligned.
