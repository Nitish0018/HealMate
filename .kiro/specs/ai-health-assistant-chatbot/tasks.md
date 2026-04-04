# Implementation Plan: AI Health Assistant Chatbot

## Overview

This plan implements a frontend-only conversational chatbot interface for HealMate patients. The chatbot uses a floating action button pattern with a modal chat window, featuring mock AI responses via keyword matching. The implementation follows React best practices with component composition, service layer separation, and preparation for future backend API integration.

## Tasks

- [x] 1. Set up chat service layer with mock response engine
  - Create `frontend/src/services/chatService.js` with mock response engine
  - Implement keyword matching logic for medication, adherence, schedule, and missed dose queries
  - Define message format structure (id, text, sender, timestamp)
  - Add placeholder functions for future API integration (sendMessageToAPI)
  - Include error handling structure for API failures
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 1.1 Write unit tests for chat service
  - Test keyword matching for all response patterns
  - Test message formatting and ID generation
  - Test default response for unmatched input
  - Test empty input handling
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 2. Implement ChatMessage component
  - Create `frontend/src/components/ChatMessage.jsx`
  - Accept props: text, sender ('user' | 'bot'), timestamp
  - Implement user message styling (right-aligned, forest-500 bg, cream-50 text)
  - Implement bot message styling (left-aligned, cream-200 bg, forest-500 text)
  - Add rounded chat bubble styling (rounded-2xl)
  - Add fade-in animation class
  - Display timestamp in readable format
  - _Requirements: 2.2, 2.3, 2.4, 8.2, 8.5_

- [ ]* 2.1 Write unit tests for ChatMessage component
  - Test rendering with user sender type
  - Test rendering with bot sender type
  - Test timestamp display
  - Test styling classes applied correctly
  - Test fade-in animation class
  - _Requirements: 2.2, 2.3, 2.4_

- [x] 3. Implement Chatbot component with floating button
  - Create `frontend/src/components/Chatbot.jsx`
  - Implement state management (isOpen, messages, inputValue, isTyping, showQuickActions)
  - Create floating action button (fixed bottom-right, rounded-full, chat icon)
  - Implement toggleChat function to open/close chat window
  - Add slide-up/slide-down animation (300ms transition)
  - Style floating button with shadow-warm and hover effects
  - Make button responsive (56px mobile, 64px tablet/desktop)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 8.1, 8.4_

- [x] 4. Implement chat window modal with header
  - Create chat window container with fixed positioning (bottom-right)
  - Add header with title "HealMate AI Assistant" and online status indicator
  - Add close button in header with aria-label
  - Implement responsive sizing (full-width mobile, 400px tablet, 420px desktop)
  - Apply rounded-[2rem] border radius and shadow-warm-lg
  - Add role="dialog" and aria-labelledby for accessibility
  - _Requirements: 1.2, 1.5, 2.1, 8.4_

- [x] 5. Implement message list and scrolling behavior
  - Create message list container with scroll overflow
  - Map messages array to ChatMessage components
  - Implement auto-scroll to bottom when new message added (useEffect with ref)
  - Add role="log" and aria-live="polite" for accessibility
  - Style with appropriate padding and spacing
  - _Requirements: 2.6, 2.7, 8.4_

- [x] 6. Implement welcome message and quick action buttons
  - Add welcome message on first chat open: "Hello! I'm your HealMate AI Assistant..."
  - Create three quick action buttons: "Did I miss my medicine?", "What is my adherence?", "Remind me my schedule"
  - Style buttons with btn-pill-outline class
  - Implement handleQuickAction function to send button text as message
  - Hide quick action buttons after first click (showQuickActions state)
  - Display quick actions below welcome message
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 9.1, 9.2, 9.3_

- [x] 7. Implement typing indicator animation
  - Create typing indicator component with three pulsing dots
  - Implement staggered animation (0ms, 200ms, 400ms delays)
  - Show indicator when isTyping is true
  - Hide indicator when bot response is ready
  - Style with cream-200 background and forest-500 dots
  - _Requirements: 4.7, 6.3_

- [x] 8. Implement message input and send functionality
  - Create input field with input-warm styling
  - Add send button with paper airplane icon and aria-label
  - Implement handleSendMessage function
  - Clear input field after sending (setInputValue(''))
  - Disable send button when input is empty
  - Add Enter key handler for sending messages
  - Prevent sending empty or whitespace-only messages
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6, 3.7_

- [x] 9. Integrate mock response generation with UI
  - Call chatService.generateMockResponse when user sends message
  - Set isTyping to true before generating response
  - Add simulated delay (300-500ms) for realistic typing indicator
  - Add bot message to messages array after delay
  - Set isTyping to false after response added
  - Add fade-in animation to new messages
  - _Requirements: 4.1, 4.7, 3.5, 6.2_

- [x] 10. Checkpoint - Test core chat functionality
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Implement chat persistence and session management
  - Maintain messages in component state during session
  - Preserve chat history when closing and reopening chat window
  - Clear messages on component unmount (page refresh)
  - Add useEffect to clear messages on logout (listen to auth context)
  - _Requirements: 10.1, 10.2, 10.3_

- [x] 12. Add animations and transitions
  - Implement chat window open animation (slide-up, 300ms ease-out)
  - Implement chat window close animation (slide-down, 300ms ease-in)
  - Add message fade-in animation (fadeSlideUp, 200ms ease-out)
  - Define animation keyframes in CSS if not already in index.css
  - Test animation smoothness (60fps target)
  - _Requirements: 6.1, 6.2, 6.4_

- [x] 13. Implement responsive design for all screen sizes
  - Add mobile styles (< 768px): full-width with 16px margins, 56px button, 14px font
  - Add tablet styles (768px-1024px): 400px width, 64px button, 15px font
  - Add desktop styles (> 1024px): 420px width, 64px button, 16px font
  - Ensure message bubbles have max-width (80% mobile, 75% tablet, 70% desktop)
  - Test on various viewport sizes
  - _Requirements: 8.6_

- [x] 14. Implement accessibility features
  - Add aria-label to floating button: "Open AI Health Assistant"
  - Add aria-label to close button: "Close chat"
  - Add aria-label to send button: "Send message"
  - Add aria-label to input field: "Type your message"
  - Implement focus management (focus input on open, return focus on close)
  - Add Escape key handler to close chat
  - Ensure keyboard navigation works (Tab, Enter, Escape)
  - Test with screen reader
  - _Requirements: 1.1, 1.2, 1.3, 3.2, 3.3_

- [ ]* 14.1 Write integration tests for chat flow
  - Test opening chatbot shows welcome message
  - Test clicking quick action sends message and receives response
  - Test typing and sending message shows user message and bot response
  - Test typing indicator appears and disappears correctly
  - Test conversation history persists when closing and reopening
  - Test Enter key sends message
  - Test empty input disables send button
  - _Requirements: 3.2, 3.3, 4.1, 5.5, 10.1, 10.2_

- [x] 15. Integrate Chatbot into patient pages
  - Import Chatbot component in PatientDashboard.jsx
  - Add `<Chatbot />` at the end of PatientDashboard component
  - Verify floating button appears on patient dashboard
  - Ensure chatbot doesn't block critical UI elements
  - Test navigation between pages maintains chat state
  - _Requirements: 1.1, 1.5_

- [x] 16. Final checkpoint - End-to-end testing
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The design document uses React/JavaScript, so all implementation is in JavaScript/JSX
- The chatbot is frontend-only with mock responses; backend integration is prepared but not implemented
- All styling uses existing Tailwind classes and Raus design system (cream/forest/gold palette)
- Chat history persists during session but clears on page refresh or logout
- The service layer is structured for easy transition to real API in future phases
