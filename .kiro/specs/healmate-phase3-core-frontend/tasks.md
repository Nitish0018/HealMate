# Implementation Plan: HealMate Phase 3 Core Frontend

## Overview

This implementation plan breaks down the HealMate Phase 3 Core Frontend into discrete coding tasks. The approach follows an incremental development strategy: authentication layer first, then patient features, followed by doctor features, and finally integration and testing. Each task builds on previous work to ensure continuous validation.

## Tasks

- [x] 1. Set up project structure and routing foundation
  - Initialize React project with TypeScript and Tailwind CSS
  - Install dependencies: react-router-dom, firebase, axios, recharts, fast-check
  - Configure Tailwind CSS with custom theme colors for compliance indicators
  - Set up basic routing structure with React Router v6
  - Create route constants file for all application routes
  - _Requirements: 1.1, 2.1, 2.2_

- [x] 2. Implement authentication layer
  - [x] 2.1 Create Firebase authentication configuration
    - Initialize Firebase with project credentials
    - Create Firebase auth service module with login/logout methods
    - _Requirements: 1.2, 1.4_
  
  - [x] 2.2 Implement AuthContext and authentication state management
    - Create AuthContext with user, role, loading, and error state
    - Implement login function that authenticates with Firebase and fetches user role from backend
    - Implement logout function that clears auth state and redirects
    - Add authentication state persistence using localStorage
    - Implement initial auth state validation on app load
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 2.3_
  
  - [x] 2.3 Create ProtectedRoute component with role-based access control
    - Implement authentication check and redirect logic
    - Implement role-based access control with requiredRole prop
    - Add redirect logic for unauthorized role access
    - _Requirements: 1.1, 2.1, 2.2_
  
  - [ ]* 2.4 Write property tests for authentication
    - **Property 1: Unauthenticated redirect**
    - **Validates: Requirements 1.1**
    - **Property 2: Authentication token storage**
    - **Validates: Requirements 1.2**
    - **Property 3: Role-based route access control**
    - **Validates: Requirements 2.1, 2.2**
    - **Property 4: Role retrieval and storage**
    - **Validates: Requirements 2.3**
  
  - [ ]* 2.5 Write unit tests for authentication flows
    - Test login success and failure scenarios
    - Test logout clears state and redirects
    - Test initial auth state validation on app load
    - Test session expiration handling
    - _Requirements: 1.2, 1.3, 1.4, 1.5_

- [x] 3. Implement API client and data fetching utilities
  - Create axios instance with base URL and interceptors
  - Implement request interceptor to add authentication token
  - Implement response interceptor for error handling (401, 403, 5xx)
  - Create API service functions for all backend endpoints
  - Implement caching utility with 5-minute expiration
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ]* 3.1 Write property tests for data fetching
  - **Property 32: Loading indicator display**
  - **Validates: Requirements 11.1**
  - **Property 33: API error handling with retry**
  - **Validates: Requirements 11.2**
  - **Property 34: Loading state cleanup**
  - **Validates: Requirements 11.3**
  - **Property 35: Data caching behavior**
  - **Validates: Requirements 11.4**
  - **Property 36: Cache invalidation and refresh**
  - **Validates: Requirements 11.5**

- [x] 4. Create shared UI components
  - [x] 4.1 Implement LoadingSpinner component
    - Create reusable spinner with Tailwind CSS animations
    - _Requirements: 5.5, 11.1_
  
  - [x] 4.2 Implement ErrorMessage component
    - Create error display with message and optional retry button
    - _Requirements: 11.2_
  
  - [x] 4.3 Implement ChartWrapper component
    - Create wrapper with title, loading state, and error handling
    - _Requirements: 12.4_
  
  - [x] 4.4 Implement responsive navigation component
    - Create navigation with role-based menu items
    - Implement collapsible mobile menu
    - Ensure touch-friendly sizing (44x44px minimum)
    - _Requirements: 2.4, 10.1, 10.2, 10.4, 10.5_

- [ ]* 4.5 Write property tests for shared components
  - **Property 5: Role-based navigation rendering**
  - **Validates: Requirements 2.4**
  - **Property 30: Mobile collapsible navigation**
  - **Validates: Requirements 10.4**
  - **Property 31: Touch-friendly element sizing**
  - **Validates: Requirements 10.5**

- [x] 5. Checkpoint - Ensure foundation is solid
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement patient medication schedule features
  - [x] 6.1 Create MedicationSchedule component
    - Fetch medications for selected date from backend API
    - Display medications with name, dosage, scheduled time, and status
    - Implement time-based sorting (ascending order)
    - Add visual indicators for taken/missed status on past medications
    - Implement highlighting for current time medications
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [x] 6.2 Implement AdherenceLogger component
    - Create "Mark as Taken" button for each medication
    - Implement optimistic UI update on button click
    - Send adherence log to backend API
    - Handle API failures with error display and state reversion
    - Prevent duplicate logging for same medication/time
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 6.3 Write property tests for medication schedule
    - **Property 6: Complete medication display**
    - **Validates: Requirements 3.1**
    - **Property 7: Medication information completeness**
    - **Validates: Requirements 3.2**
    - **Property 8: Past medication status indication**
    - **Validates: Requirements 3.3**
    - **Property 9: Current medication highlighting**
    - **Validates: Requirements 3.4**
    - **Property 10: Medication time ordering**
    - **Validates: Requirements 3.5**
  
  - [ ]* 6.4 Write property tests for adherence logging
    - **Property 11: Medication logging creates record**
    - **Validates: Requirements 4.1, 4.4**
    - **Property 12: Adherence API integration**
    - **Validates: Requirements 4.2**
    - **Property 13: API failure error handling**
    - **Validates: Requirements 4.3**
    - **Property 14: Duplicate logging prevention**
    - **Validates: Requirements 4.5**

- [x] 7. Implement patient adherence visualization
  - [x] 7.1 Create AdherenceVisualization component
    - Fetch daily and weekly adherence metrics from backend
    - Calculate adherence percentage (taken / scheduled × 100)
    - Display daily and weekly percentages with progress indicators
    - Implement line chart for daily adherence trend (last 7 days)
    - Implement bar chart for weekly adherence (last 4 weeks)
    - Apply color coding: green (≥80%), yellow (60-79%), red (<60%)
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [ ]* 7.2 Write property test for adherence calculation
    - **Property 15: Adherence percentage calculation**
    - **Validates: Requirements 5.3**
  
  - [ ]* 7.3 Write unit tests for adherence visualization
    - Test daily and weekly percentage display
    - Test loading indicator during data fetch
    - Test empty data state handling
    - _Requirements: 5.1, 5.2, 5.5_

- [x] 8. Create patient dashboard page
  - Integrate MedicationSchedule component
  - Integrate AdherenceLogger component
  - Integrate AdherenceVisualization component
  - Implement responsive layout with Tailwind CSS
  - Add date selector for viewing different days
  - _Requirements: 3.1, 5.1, 5.2, 10.1, 10.2_

- [x] 9. Checkpoint - Validate patient features
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implement doctor patient list features
  - [x] 10.1 Create PatientList component
    - Fetch all assigned patients from backend API
    - Display patient name, compliance score, and last activity date
    - Implement real-time search filtering by patient name
    - Sort patients by compliance score ascending (lowest first)
    - Implement click handler to navigate to patient detail view
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 10.2 Write property tests for patient list
    - **Property 16: Real-time search filtering**
    - **Validates: Requirements 6.2**
    - **Property 17: Patient information completeness**
    - **Validates: Requirements 6.3**
    - **Property 18: Patient compliance score sorting**
    - **Validates: Requirements 6.4**
    - **Property 19: Patient selection navigation**
    - **Validates: Requirements 6.5**
  
  - [ ]* 10.3 Write unit tests for patient list
    - Test patient list display with all patients
    - Test search filtering updates list in real-time
    - Test click navigation to patient detail
    - _Requirements: 6.1, 6.2, 6.5_

- [x] 11. Implement doctor compliance visualization
  - [x] 11.1 Create ComplianceVisualization component
    - Fetch compliance data for daily, weekly, and monthly periods
    - Display compliance score as percentage
    - Implement line chart for daily compliance (30 days)
    - Implement bar chart for weekly compliance (12 weeks)
    - Implement area chart for monthly compliance (6 months)
    - Apply color indicators: warning (<80%), critical (<60%)
    - Add threshold lines at 80% and 60%
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 11.2 Write property test for compliance color indicators
    - **Property 20: Compliance score color indicators**
    - **Validates: Requirements 7.4, 7.5**
  
  - [ ]* 11.3 Write unit tests for compliance visualization
    - Test compliance score display
    - Test all three time period displays (daily, weekly, monthly)
    - _Requirements: 7.1, 7.3_

- [x] 12. Implement missed dose timeline
  - [x] 12.1 Create MissedDoseTimeline component
    - Fetch missed doses for patient from backend API
    - Display medication name, scheduled time, and date for each missed dose
    - Sort missed doses by date and time descending (most recent first)
    - Filter to only show doses from last 30 days
    - Display "perfect adherence" message when no missed doses
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ]* 12.2 Write property tests for missed dose timeline
    - **Property 21: Missed dose information completeness**
    - **Validates: Requirements 8.2**
    - **Property 22: Missed dose chronological sorting**
    - **Validates: Requirements 8.3**
    - **Property 23: Missed dose date filtering**
    - **Validates: Requirements 8.5**
  
  - [ ]* 12.3 Write unit tests for missed dose timeline
    - Test missed dose list display
    - Test empty state message for perfect adherence
    - _Requirements: 8.1, 8.4_

- [x] 13. Implement high-risk patient alerts
  - [x] 13.1 Create HighRiskAlerts component
    - Fetch high-risk patients from backend API
    - Filter patients with compliance score < 60%
    - Display patient name, compliance score, and consecutive missed doses
    - Sort by compliance score ascending
    - Implement click handler to navigate to patient detail view
    - Add auto-refresh every 5 minutes
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 13.2 Write property tests for high-risk alerts
    - **Property 24: High-risk patient identification**
    - **Validates: Requirements 9.2**
    - **Property 25: High-risk alert information completeness**
    - **Validates: Requirements 9.3**
    - **Property 26: High-risk patient sorting**
    - **Validates: Requirements 9.4**
    - **Property 27: High-risk alert navigation**
    - **Validates: Requirements 9.5**
  
  - [ ]* 13.3 Write unit tests for high-risk alerts
    - Test high-risk section display on dashboard
    - Test click navigation to patient detail
    - _Requirements: 9.1, 9.5_

- [x] 14. Create patient detail view page
  - Integrate ComplianceVisualization component
  - Integrate MissedDoseTimeline component
  - Display patient header with name and overall compliance
  - Display current medication list
  - Implement responsive layout with Tailwind CSS
  - _Requirements: 7.1, 8.1, 10.1, 10.2_

- [x] 15. Create doctor dashboard page
  - Integrate PatientList component
  - Integrate HighRiskAlerts component
  - Implement responsive layout with Tailwind CSS
  - Add search functionality for patient list
  - _Requirements: 6.1, 9.1, 10.1, 10.2_

- [x] 16. Checkpoint - Validate doctor features
  - Ensure all tests pass, ask the user if questions arise.

- [x] 17. Implement responsive design enhancements
  - [x] 17.1 Add responsive breakpoints and mobile optimizations
    - Implement mobile layout for viewport < 768px
    - Implement desktop layout for viewport ≥ 768px
    - Ensure all interactive elements are 44x44px minimum on mobile
    - Test all pages on different viewport sizes
    - _Requirements: 10.1, 10.2, 10.5_
  
  - [ ]* 17.2 Write property tests for responsive design
    - **Property 28: Mobile layout activation**
    - **Validates: Requirements 10.1**
    - **Property 29: Desktop layout activation**
    - **Validates: Requirements 10.2**

- [ ] 18. Implement chart responsiveness
  - [x] 18.1 Configure Recharts for responsive behavior
    - Set ResponsiveContainer for all charts
    - Ensure charts adapt to container width
    - Test chart rendering on different screen sizes
    - Add empty data state messages for all charts
    - _Requirements: 12.4, 12.5_
  
  - [ ]* 18.2 Write property test for chart responsiveness
    - **Property 37: Chart container responsiveness**
    - **Validates: Requirements 12.4**
  
  - [ ]* 18.3 Write unit tests for chart empty states
    - Test empty data message display
    - _Requirements: 12.5_

- [x] 19. Implement error boundaries and error handling
  - Create React Error Boundary component for major sections
  - Add fallback UI for component errors
  - Implement offline detection and banner display
  - Add error logging to console for debugging
  - Test error scenarios and fallback rendering
  - _Requirements: 11.2_

- [ ] 20. Integration and final wiring
  - [x] 20.1 Wire all routes and navigation
    - Connect all page components to routes
    - Implement navigation between pages
    
    - Test all navigation flows
    - _Requirements: 1.1, 2.1, 2.2_
  
  - [x] 20.2 Implement login and registration pages
    - Create login form with email/password fields
    - Create registration form with role selection
    - Connect forms to Firebase authentication
    - Add form validation and error display
    - _Requirements: 1.2, 1.4_
  
  - [x] 20.3 Add unauthorized page
    - Create page for role-based access denial
    - Display appropriate message and link to correct dashboard
    - _Requirements: 2.1, 2.2_
  
  - [ ]* 20.4 Write integration tests
    - Test complete authentication flow (login to dashboard)
    - Test patient workflow (view schedule, log medication, view adherence)
    - Test doctor workflow (view patients, select patient, view details)
    - Test role-based access control across all routes
    - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [x] 21. Final checkpoint - Comprehensive validation
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all requirements are implemented
  - Test application end-to-end manually
  - Check responsive design on multiple devices

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout development
- Property tests validate universal correctness properties with 100+ iterations each
- Unit tests validate specific examples, edge cases, and error conditions
- Use fast-check library for property-based testing
- Use Jest + React Testing Library for unit and integration tests
- All property tests must include comment tag: `// Feature: healmate-phase3-core-frontend, Property {number}: {property_text}`
