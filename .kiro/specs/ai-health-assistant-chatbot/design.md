# Design Document: AI Health Assistant Chatbot

## Overview

The AI Health Assistant Chatbot is a frontend-only conversational interface that provides patients with instant access to medication reminders, adherence insights, and basic health guidance. The chatbot is implemented as a floating action button that opens a modal chat window, featuring a modern chat interface with smooth animations and a mock AI response engine.

### Key Design Decisions

1. **Frontend-Only Implementation**: The initial version uses client-side keyword matching for responses, with a service layer structured for future backend API integration.

2. **Floating UI Pattern**: The chatbot uses a fixed-position floating button accessible from all patient pages, ensuring help is always one click away without disrupting the main interface.

3. **Session-Based Persistence**: Chat history persists during the browser session but clears on page refresh or logout, avoiding the complexity of persistent storage while maintaining conversation context during active use.

4. **Component Composition**: The design follows React best practices with separate components for the chatbot container, individual messages, and the service layer, ensuring maintainability and testability.

5. **Raus Design System Integration**: The chatbot adopts the existing warm, editorial design language with cream/forest/gold color palette, rounded corners, and smooth animations.

## Architecture

### Component Hierarchy

```
PatientDashboard (or any patient page)
└── Chatbot
    ├── ChatButton (floating action button)
    └── ChatWindow (modal overlay)
        ├── ChatHeader
        ├── ChatMessageList
        │   └── ChatMessage (repeated)
        ├── QuickActionButtons (conditional)
        ├── TypingIndicator (conditional)
        └── ChatInput
```

### State Management

The Chatbot component manages state using React hooks:

- `isOpen` (boolean): Controls chat window visibility
- `messages` (array): Stores conversation history
- `inputValue` (string): Tracks current message input
- `isTyping` (boolean): Controls typing indicator display
- `showQuickActions` (boolean): Controls quick action button visibility

State flows unidirectionally from the Chatbot parent component down to child components via props.

### Service Layer Architecture

The `chatService.js` module provides:

1. **Mock Response Engine**: Client-side keyword matching function
2. **API Integration Structure**: Placeholder functions for future backend calls
3. **Message Formatting**: Standardized message object creation
4. **Error Handling**: Structure for handling API failures

This separation allows the UI components to remain unchanged when transitioning from mock to real API responses.

## Components and Interfaces

### Chatbot Component

**File**: `frontend/src/components/Chatbot.jsx`

**Responsibilities**:
- Manage chat state (open/closed, messages, typing indicator)
- Handle user interactions (button clicks, message sending)
- Coordinate between UI components and service layer
- Implement session-based persistence

**Props**: None (self-contained)

**State**:
```javascript
{
  isOpen: boolean,
  messages: Array<Message>,
  inputValue: string,
  isTyping: boolean,
  showQuickActions: boolean
}
```

**Key Methods**:
- `toggleChat()`: Opens/closes the chat window
- `handleSendMessage(text)`: Processes user message and triggers response
- `handleQuickAction(text)`: Handles quick action button clicks
- `addMessage(text, sender)`: Adds a message to the conversation

### ChatMessage Component

**File**: `frontend/src/components/ChatMessage.jsx`

**Responsibilities**:
- Render individual chat messages
- Apply appropriate styling based on sender type
- Display timestamp

**Props**:
```javascript
{
  text: string,
  sender: 'user' | 'bot',
  timestamp: Date
}
```

**Styling**:
- User messages: Right-aligned, forest-500 background, cream-50 text
- Bot messages: Left-aligned, cream-200 background, forest-500 text
- Both: Rounded chat bubbles (rounded-2xl), fade-in animation

### ChatInput Component

**File**: Inline within `Chatbot.jsx`

**Responsibilities**:
- Accept text input from user
- Handle Enter key and send button clicks
- Disable send button when input is empty

**Features**:
- Input field with warm styling (input-warm class)
- Send button with icon (paper airplane or arrow)
- Enter key support for message sending

### QuickActionButtons Component

**File**: Inline within `Chatbot.jsx`

**Responsibilities**:
- Display pre-defined question buttons
- Handle button clicks
- Hide after first interaction

**Buttons**:
1. "Did I miss my medicine?"
2. "What is my adherence?"
3. "Remind me my schedule"

**Styling**: Small pill buttons (btn-pill-outline) with hover effects

### TypingIndicator Component

**File**: Inline within `Chatbot.jsx`

**Responsibilities**:
- Display animated typing indicator
- Show while bot is "thinking"

**Animation**: Three pulsing dots with staggered animation timing

## Data Models

### Message Object

```javascript
{
  id: string,              // Unique identifier (timestamp-based)
  text: string,            // Message content
  sender: 'user' | 'bot',  // Message sender type
  timestamp: Date          // Message creation time
}
```

### Chat State

```javascript
{
  isOpen: boolean,         // Chat window visibility
  messages: Message[],     // Conversation history
  inputValue: string,      // Current input field value
  isTyping: boolean,       // Bot typing indicator state
  showQuickActions: boolean // Quick action buttons visibility
}
```

### API Request Payload (Future)

```javascript
{
  message: string,         // User message text
  userId: string,          // Patient user ID
  sessionId: string,       // Chat session identifier
  context: {               // Optional context
    medications: string[],
    adherenceScore: number
  }
}
```

### API Response Payload (Future)

```javascript
{
  response: string,        // Bot response text
  suggestions: string[],   // Optional follow-up suggestions
  actions: {               // Optional actionable items
    type: string,
    data: object
  }
}
```

## Error Handling

### Client-Side Error Handling

1. **Empty Message Validation**: Prevent sending empty or whitespace-only messages
2. **Service Layer Errors**: Catch and log errors from chatService
3. **Graceful Degradation**: Display fallback message if response generation fails

### Future API Error Handling

The service layer includes structure for handling:

1. **Network Errors**: Display "Connection lost" message, allow retry
2. **Timeout Errors**: Display "Request timed out" message after 10 seconds
3. **Server Errors (5xx)**: Display "Service temporarily unavailable" message
4. **Authentication Errors (401)**: Redirect to login
5. **Rate Limiting (429)**: Display "Too many requests" message

Error messages should use the same ChatMessage component with a distinct error styling variant.

## Testing Strategy

### Unit Testing

**Component Tests** (using React Testing Library + Vitest):

1. **Chatbot Component**:
   - Renders floating button correctly
   - Opens/closes chat window on button click
   - Displays welcome message on first open
   - Adds user messages to conversation
   - Triggers bot responses after user messages
   - Clears input field after sending
   - Disables send button when input is empty
   - Handles Enter key for sending messages

2. **ChatMessage Component**:
   - Renders user messages with correct styling
   - Renders bot messages with correct styling
   - Displays timestamp correctly
   - Applies fade-in animation class

3. **Quick Action Buttons**:
   - Renders all three quick action buttons initially
   - Sends message when button is clicked
   - Hides buttons after first click

4. **Typing Indicator**:
   - Displays when isTyping is true
   - Hides when isTyping is false
   - Shows animated dots

**Service Tests** (using Vitest):

1. **Mock Response Engine**:
   - Returns correct response for "missed dose" keywords
   - Returns correct response for "medicine" keywords
   - Returns correct response for "adherence" keywords
   - Returns correct response for "schedule" keywords
   - Returns default response for unmatched input
   - Handles empty input gracefully

2. **Message Formatting**:
   - Creates message objects with correct structure
   - Generates unique IDs
   - Includes timestamp

### Integration Testing

1. **End-to-End Chat Flow**:
   - Open chatbot → see welcome message → click quick action → receive response
   - Type message → press Enter → see user message → see typing indicator → see bot response
   - Send multiple messages → verify conversation history persists
   - Close and reopen chat → verify messages remain
   - Refresh page → verify messages clear

2. **Responsive Behavior**:
   - Test chat window on mobile viewport (320px-768px)
   - Test chat window on tablet viewport (768px-1024px)
   - Test chat window on desktop viewport (1024px+)
   - Verify floating button doesn't overlap critical UI elements

### Snapshot Testing

1. **Component Snapshots**:
   - Chatbot closed state
   - Chatbot open with welcome message
   - Chatbot with conversation history
   - ChatMessage (user variant)
   - ChatMessage (bot variant)
   - Quick action buttons
   - Typing indicator

### Accessibility Testing

1. **Keyboard Navigation**:
   - Tab to floating button and activate with Enter/Space
   - Tab through chat interface elements
   - Focus management when opening/closing chat
   - Escape key closes chat window

2. **Screen Reader Support**:
   - Floating button has descriptive aria-label
   - Chat messages have appropriate ARIA roles
   - Typing indicator has aria-live region
   - Input field has descriptive label

3. **Visual Accessibility**:
   - Sufficient color contrast for text (WCAG AA)
   - Focus indicators visible on all interactive elements
   - Text remains readable at 200% zoom

### Manual Testing Checklist

- [ ] Floating button visible on all patient pages
- [ ] Chat opens with smooth slide-up animation
- [ ] Welcome message displays on first open
- [ ] Quick action buttons work correctly
- [ ] User can type and send messages
- [ ] Bot responses appear with typing indicator
- [ ] Conversation scrolls to show latest message
- [ ] Chat persists when navigating between pages
- [ ] Chat clears on page refresh
- [ ] Mobile responsive layout works correctly
- [ ] Animations are smooth (60fps)
- [ ] No console errors or warnings

## Implementation Notes

### Styling Approach

The chatbot uses the existing Raus design system with Tailwind CSS:

**Color Palette**:
- Primary background: `bg-white`
- Secondary background: `bg-cream-50`, `bg-cream-100`
- Text: `text-forest-500`
- Accent: `bg-gold-300`
- User message bubble: `bg-forest-500 text-cream-50`
- Bot message bubble: `bg-cream-200 text-forest-500`

**Border Radius**:
- Chat window: `rounded-[2rem]` (32px)
- Message bubbles: `rounded-2xl` (16px)
- Floating button: `rounded-full`

**Shadows**:
- Chat window: `shadow-warm-lg`
- Floating button: `shadow-warm`

**Animations**:
- Chat window open/close: CSS transition with `transform` and `opacity`
- Message fade-in: `animate-fade-in` class (defined in index.css)
- Typing indicator: Custom keyframe animation with staggered dots

### Responsive Design

**Mobile (< 768px)**:
- Chat window: Full width with 16px margins, positioned at bottom
- Floating button: 56px diameter, 16px from bottom-right
- Message bubbles: Max width 80% of container
- Font size: 14px for messages

**Tablet (768px - 1024px)**:
- Chat window: 400px width, positioned bottom-right
- Floating button: 64px diameter, 24px from bottom-right
- Message bubbles: Max width 75% of container
- Font size: 15px for messages

**Desktop (> 1024px)**:
- Chat window: 420px width, 600px height, positioned bottom-right
- Floating button: 64px diameter, 32px from bottom-right
- Message bubbles: Max width 70% of container
- Font size: 16px for messages

### Animation Specifications

**Chat Window Open**:
```css
transition: transform 300ms ease-out, opacity 300ms ease-out
from: transform: translateY(20px), opacity: 0
to: transform: translateY(0), opacity: 1
```

**Chat Window Close**:
```css
transition: transform 300ms ease-in, opacity 300ms ease-in
from: transform: translateY(0), opacity: 1
to: transform: translateY(20px), opacity: 0
```

**Message Fade-In**:
```css
animation: fadeSlideUp 200ms ease-out forwards
from: opacity: 0, transform: translateY(8px)
to: opacity: 1, transform: translateY(0)
```

**Typing Indicator**:
```css
animation: pulse 1.4s ease-in-out infinite
dot 1: animation-delay: 0ms
dot 2: animation-delay: 200ms
dot 3: animation-delay: 400ms
```

### Mock Response Engine Logic

The keyword matching follows this priority order:

1. Check for "missed dose" or "missed medicine" → Missed dose response
2. Check for "medicine" or "medication" → Medication schedule response
3. Check for "adherence" or "compliance" → Adherence insights response
4. Check for "schedule" or "reminder" → Schedule reminder response
5. Default → General help response

Keywords are matched case-insensitively using `String.prototype.toLowerCase()` and `String.prototype.includes()`.

### Future API Integration

When transitioning to a real backend API:

1. **Update chatService.js**:
   - Replace `generateMockResponse()` with `sendMessageToAPI()`
   - Implement actual HTTP POST to `/api/chat` endpoint
   - Add authentication token to request headers
   - Handle API response parsing

2. **No UI Changes Required**:
   - Chatbot component remains unchanged
   - Message format stays the same
   - Error handling structure already in place

3. **API Endpoint Specification**:
   - Endpoint: `POST /api/chat`
   - Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
   - Request body: `{ message: string, userId: string, sessionId: string }`
   - Response body: `{ response: string, suggestions?: string[] }`
   - Timeout: 10 seconds
   - Rate limit: 20 requests per minute per user

### Performance Considerations

1. **Message List Virtualization**: Not needed initially (conversations typically < 50 messages), but consider `react-window` if performance degrades with long conversations

2. **Debouncing**: Not needed for send button (explicit user action), but could add typing indicator for future "bot is typing" feature

3. **Memoization**: Use `React.memo` for ChatMessage component to prevent unnecessary re-renders

4. **Animation Performance**: Use CSS transforms and opacity (GPU-accelerated) instead of layout properties

### Accessibility Implementation

1. **ARIA Labels**:
   - Floating button: `aria-label="Open AI Health Assistant"`
   - Close button: `aria-label="Close chat"`
   - Send button: `aria-label="Send message"`

2. **ARIA Roles**:
   - Chat window: `role="dialog"` with `aria-labelledby="chat-header"`
   - Message list: `role="log"` with `aria-live="polite"`
   - Input: `role="textbox"` with `aria-label="Type your message"`

3. **Focus Management**:
   - When chat opens, focus moves to input field
   - When chat closes, focus returns to floating button
   - Trap focus within chat window when open

4. **Keyboard Support**:
   - Escape key closes chat
   - Enter key sends message
   - Tab/Shift+Tab navigates through interactive elements

## Integration with Existing Application

### Placement in App Structure

The Chatbot component should be added to patient-facing pages:

1. **PatientDashboard**: Add `<Chatbot />` at the end of the component (before closing div)
2. **Other Patient Pages**: Add `<Chatbot />` similarly to maintain consistency

The floating button's fixed positioning ensures it appears consistently across all pages without requiring route-specific logic.

### Authentication Context

The Chatbot should access the current user context via the existing `AuthContext`:

```javascript
import { useAuth } from '../context/AuthContext';

// Inside Chatbot component
const { user } = useAuth();
```

This allows the chatbot to:
- Display personalized welcome messages
- Include user ID in future API requests
- Hide on non-patient pages (optional)

### Routing Considerations

The Chatbot does not affect routing. It's a modal overlay that maintains its state independently of the current route. However, chat history should clear when:
- User logs out (listen to auth state changes)
- Page is refreshed (natural behavior with component state)

### Styling Integration

The Chatbot uses the existing design system defined in:
- `frontend/src/index.css`: Utility classes (btn-pill, card-warm, input-warm)
- `frontend/tailwind.config.js`: Color palette and theme extensions

No new global styles are required. All chatbot-specific styles use Tailwind utility classes or inline styles.

## Future Enhancements

### Phase 2: Backend Integration

1. Implement real AI/NLP backend service
2. Add conversation context and memory
3. Implement user-specific personalization
4. Add medication data integration
5. Enable actionable responses (e.g., "Log missed dose" button)

### Phase 3: Advanced Features

1. Voice input/output support
2. Multi-language support
3. Rich media responses (images, charts)
4. Conversation history persistence (database)
5. Proactive notifications (e.g., "Time to take your medicine!")
6. Integration with calendar and reminders
7. Sentiment analysis for patient mood tracking

### Phase 4: Analytics and Optimization

1. Track common questions and improve responses
2. A/B test different response strategies
3. Measure user satisfaction and engagement
4. Optimize response latency
5. Implement caching for common queries

