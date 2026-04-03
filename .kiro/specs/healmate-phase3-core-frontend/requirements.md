# Requirements Document

## Introduction

HealMate Phase 3: Core Frontend implements the user-facing interfaces for a medication adherence tracking system. This feature builds upon existing backend APIs (user management, medication management, adherence logging) and Firebase Authentication to provide role-based dashboards for patients and doctors. The system enables patients to track their medication schedules and adherence, while doctors can monitor patient compliance and identify high-risk cases.

## Glossary

- **System**: The HealMate Phase 3 Core Frontend application
- **Patient**: A user with patient role who tracks medication adherence
- **Doctor**: A user with doctor role who monitors patient compliance
- **Medication_Schedule**: A daily view of medications with scheduled times
- **Adherence_Log**: A record of medication intake (taken/missed)
- **Compliance_Score**: A percentage representing patient adherence over time
- **Protected_Route**: A route component that requires authentication
- **Authentication_Guard**: Logic that prevents unauthorized access to routes
- **High_Risk_Patient**: A patient with compliance score below threshold

## Requirements

### Requirement 1: Authentication and Route Protection

**User Story:** As a system administrator, I want secure authentication and route protection, so that only authorized users can access the application.

#### Acceptance Criteria

1. WHEN an unauthenticated user attempts to access a protected route, THEN THE System SHALL redirect them to the login page
2. WHEN a user successfully authenticates via Firebase, THEN THE System SHALL store the authentication token and allow access to protected routes
3. WHEN an authenticated user's session expires, THEN THE System SHALL redirect them to the login page and clear stored credentials
4. WHEN a user logs out, THEN THE System SHALL clear authentication state and redirect to the login page
5. THE System SHALL validate authentication state on initial application load

### Requirement 2: Role-Based Access Control

**User Story:** As a system administrator, I want role-based access control, so that users only access features appropriate to their role.

#### Acceptance Criteria

1. WHEN a Patient attempts to access doctor-only routes, THEN THE System SHALL deny access and redirect to the patient dashboard
2. WHEN a Doctor attempts to access patient-only routes, THEN THE System SHALL deny access and redirect to the doctor dashboard
3. WHEN a user authenticates, THEN THE System SHALL retrieve their role from the backend and store it in application state
4. THE System SHALL render navigation elements based on the authenticated user's role

### Requirement 3: Patient Medication Schedule Display

**User Story:** As a patient, I want to view my daily medication schedule, so that I know which medications to take and when.

#### Acceptance Criteria

1. WHEN a Patient views their dashboard, THEN THE System SHALL display all medications scheduled for the current day with times
2. WHEN displaying medications, THEN THE System SHALL show medication name, dosage, scheduled time, and intake status
3. WHEN a medication's scheduled time has passed, THEN THE System SHALL visually indicate if it was taken or missed
4. WHEN the current time matches a medication's scheduled time, THEN THE System SHALL highlight that medication
5. THE System SHALL sort medications by scheduled time in ascending order

### Requirement 4: Medication Intake Logging

**User Story:** As a patient, I want to log when I take my medications, so that my adherence is accurately tracked.

#### Acceptance Criteria

1. WHEN a Patient clicks a "Mark as Taken" button for a medication, THEN THE System SHALL create an adherence log with timestamp and update the UI
2. WHEN a medication is marked as taken, THEN THE System SHALL send the adherence data to the backend API
3. IF the API request fails, THEN THE System SHALL display an error message and revert the UI state
4. WHEN a medication is successfully logged, THEN THE System SHALL update the medication's status to "taken" in the schedule view
5. THE System SHALL prevent logging the same medication multiple times for the same scheduled time

### Requirement 5: Patient Adherence Visualization

**User Story:** As a patient, I want to see my adherence progress, so that I can understand how well I'm following my medication schedule.

#### Acceptance Criteria

1. WHEN a Patient views their dashboard, THEN THE System SHALL display their daily adherence percentage
2. WHEN a Patient views their dashboard, THEN THE System SHALL display their weekly adherence percentage
3. WHEN calculating adherence percentage, THEN THE System SHALL divide taken medications by total scheduled medications
4. THE System SHALL visualize adherence data using a chart component (Chart.js or Recharts)
5. WHEN adherence data is loading, THEN THE System SHALL display a loading indicator

### Requirement 6: Doctor Patient List Management

**User Story:** As a doctor, I want to view and search my patient list, so that I can quickly find specific patients.

#### Acceptance Criteria

1. WHEN a Doctor views their dashboard, THEN THE System SHALL display a list of all assigned patients
2. WHEN a Doctor types in the search field, THEN THE System SHALL filter the patient list by name in real-time
3. WHEN displaying patients, THEN THE System SHALL show patient name, current compliance score, and last activity date
4. THE System SHALL sort patients by compliance score in ascending order (lowest first)
5. WHEN a Doctor clicks on a patient, THEN THE System SHALL navigate to that patient's detail view

### Requirement 7: Patient Compliance Score Visualization

**User Story:** As a doctor, I want to see patient compliance scores visually, so that I can quickly assess adherence patterns.

#### Acceptance Criteria

1. WHEN a Doctor views a patient's detail page, THEN THE System SHALL display the patient's compliance score as a percentage
2. WHEN displaying compliance scores, THEN THE System SHALL use a chart component to visualize trends over time
3. THE System SHALL display compliance scores for daily, weekly, and monthly time periods
4. WHEN a compliance score is below 80%, THEN THE System SHALL display it with a warning color indicator
5. WHEN a compliance score is below 60%, THEN THE System SHALL display it with a critical color indicator

### Requirement 8: Missed Dose Timeline Display

**User Story:** As a doctor, I want to see a timeline of missed doses, so that I can identify patterns in non-adherence.

#### Acceptance Criteria

1. WHEN a Doctor views a patient's detail page, THEN THE System SHALL display a chronological list of missed medications
2. WHEN displaying missed doses, THEN THE System SHALL show medication name, scheduled time, and date
3. THE System SHALL sort missed doses by date and time in descending order (most recent first)
4. WHEN there are no missed doses, THEN THE System SHALL display a message indicating perfect adherence
5. THE System SHALL limit the missed dose timeline to the most recent 30 days

### Requirement 9: High-Risk Patient Alerts

**User Story:** As a doctor, I want to see alerts for high-risk patients, so that I can prioritize interventions.

#### Acceptance Criteria

1. WHEN a Doctor views their dashboard, THEN THE System SHALL display a section for high-risk patient alerts
2. WHEN a patient's compliance score falls below 60%, THEN THE System SHALL include them in the high-risk alerts
3. WHEN displaying high-risk alerts, THEN THE System SHALL show patient name, compliance score, and number of consecutive missed doses
4. THE System SHALL sort high-risk patients by compliance score in ascending order
5. WHEN a Doctor clicks on a high-risk alert, THEN THE System SHALL navigate to that patient's detail view

### Requirement 10: Responsive UI Design

**User Story:** As a user, I want the application to work on different screen sizes, so that I can access it from any device.

#### Acceptance Criteria

1. WHEN the viewport width is below 768px, THEN THE System SHALL display a mobile-optimized layout
2. WHEN the viewport width is 768px or above, THEN THE System SHALL display a desktop-optimized layout
3. THE System SHALL use Tailwind CSS responsive utilities for all layout components
4. WHEN navigation elements are displayed on mobile, THEN THE System SHALL use a collapsible menu
5. THE System SHALL ensure all interactive elements have touch-friendly sizes on mobile (minimum 44x44px)

### Requirement 11: Data Fetching and Loading States

**User Story:** As a user, I want clear feedback when data is loading, so that I understand the application is working.

#### Acceptance Criteria

1. WHEN the System fetches data from backend APIs, THEN THE System SHALL display a loading indicator
2. IF an API request fails, THEN THE System SHALL display an error message with retry option
3. WHEN data is successfully loaded, THEN THE System SHALL remove loading indicators and display the data
4. THE System SHALL cache fetched data to minimize redundant API calls
5. WHEN cached data becomes stale, THEN THE System SHALL refresh it from the backend

### Requirement 12: Chart Integration for Analytics

**User Story:** As a user, I want visual charts for data analytics, so that I can understand trends at a glance.

#### Acceptance Criteria

1. THE System SHALL use either Chart.js or Recharts library for all chart components
2. WHEN displaying adherence data, THEN THE System SHALL use line charts for trend visualization
3. WHEN displaying compliance scores, THEN THE System SHALL use bar charts or progress indicators
4. THE System SHALL ensure all charts are responsive and adapt to container width
5. WHEN chart data is empty, THEN THE System SHALL display a message indicating no data available
