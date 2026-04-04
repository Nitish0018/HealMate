# Chatbot Testing Guide

## How to Check if Your Chatbot is Working Properly

This guide will help you verify that the HealMate AI Assistant Chatbot is functioning correctly.

---

## Prerequisites

Before testing, ensure:
1. ✅ Frontend server is running (`npm run dev` in the `frontend` directory)
2. ✅ You have the `.env` file configured (check `frontend/.env`)
3. ✅ OpenAI API key is set (optional - will use mock responses if not set)

---

## Quick Start Testing

### Step 1: Start the Application

```bash
cd frontend
npm run dev
```

The app should start at `http://localhost:5173` (or the port shown in terminal)

---

## Manual Testing Checklist

### ✅ 1. Chatbot Button Visibility

**What to check:**
- [ ] Floating chat button appears in bottom-right corner
- [ ] Button shows chat icon
- [ ] Button is visible on all pages (Patient Dashboard, Doctor Dashboard, etc.)
- [ ] Button has proper z-index (doesn't hide behind other elements)

**How to test:**
1. Open the application in your browser
2. Look for the floating button in the bottom-right corner
3. Navigate to different pages and verify button is always visible

**Expected Result:** 
- Blue/green circular button with chat icon visible on all pages

---

### ✅ 2. Chat Window Opens/Closes

**What to check:**
- [ ] Clicking the button opens the chat window
- [ ] Chat window slides up smoothly (animation)
- [ ] Clicking the button again closes the chat window
- [ ] Chat window doesn't overlap with navigation header
- [ ] Close button (X) in header works

**How to test:**
1. Click the floating chat button
2. Observe the chat window opening animation
3. Click the button again or the X button to close
4. Verify smooth animations

**Expected Result:**
- Chat window opens/closes smoothly without overlapping header

---

### ✅ 3. Language Selector Functionality

**What to check:**
- [ ] Language button is visible in chat header
- [ ] Button shows current language (e.g., "🌐 English ▼")
- [ ] Clicking opens dropdown menu
- [ ] All 7 languages are listed (English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati)
- [ ] Selected language has checkmark (✓)
- [ ] Clicking a language changes the interface
- [ ] Dropdown closes after selection

**How to test:**
1. Open the chat window
2. Click the language button in the header
3. Select different languages from the dropdown
4. Verify UI text changes to selected language

**Expected Result:**
- Language selector works, UI translates to selected language

---

### ✅ 4. Sending Messages (Mock Mode)

**What to check:**
- [ ] Text input field is visible and functional
- [ ] Send button appears
- [ ] Typing in input field works
- [ ] Pressing Enter sends message
- [ ] Clicking Send button sends message
- [ ] User message appears on right side (blue bubble)
- [ ] Bot response appears on left side (gray bubble)
- [ ] Messages have timestamps
- [ ] Chat scrolls to bottom automatically

**How to test:**
1. Type a message in the input field
2. Press Enter or click Send
3. Verify message appears in chat
4. Wait for bot response (should be instant in mock mode)

**Test Messages:**
- "Hello" → Should get greeting response
- "missed dose" → Should get missed dose guidance
- "medicine" → Should get medication schedule advice
- "Random text" → Should get default helpful response

**Expected Result:**
- Messages send successfully, bot responds instantly with relevant mock responses

---

### ✅ 5. AI Mode (OpenAI Integration)

**What to check:**
- [ ] OpenAI API key is set in `.env` file
- [ ] Bot shows "typing..." indicator
- [ ] Bot responses are contextual and intelligent
- [ ] Conversation history is maintained
- [ ] Responses are healthcare-focused

**How to test:**
1. Ensure `VITE_OPENAI_API_KEY` is set in `frontend/.env`
2. Restart the dev server
3. Send healthcare-related questions
4. Verify AI provides intelligent, contextual responses

**Test Questions:**
- "What should I do if I missed my morning medication?"
- "How can I improve my medication adherence?"
- "What are the side effects of missing doses?"
- "Can you remind me about my medication schedule?"

**Expected Result:**
- AI provides intelligent, healthcare-focused responses
- Conversation flows naturally with context awareness

---

### ✅ 6. Suggested Questions (Quick Buttons)

**What to check:**
- [ ] Suggested question buttons appear below input
- [ ] Buttons show relevant healthcare questions
- [ ] Clicking a button sends that question
- [ ] Bot responds to suggested questions

**How to test:**
1. Open chat window
2. Look for suggested question buttons
3. Click each button
4. Verify bot responds appropriately

**Expected Buttons:**
- "Did I miss my medicine?"
- "What is my adherence?"
- "Remind me my schedule"

**Expected Result:**
- Clicking buttons sends questions and gets relevant responses

---

### ✅ 7. Multi-Language Support

**What to check:**
- [ ] All UI elements translate (header, input placeholder, buttons)
- [ ] Suggested questions translate
- [ ] Bot responses are in selected language (if using AI mode)

**How to test:**
1. Switch to Hindi (हिंदी)
2. Verify header shows "HealMate AI सहायक"
3. Verify input placeholder is in Hindi
4. Send a message and check response language

**Languages to test:**
- English
- Hindi (हिंदी)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Bengali (বাংলা)
- Marathi (मराठी)
- Gujarati (ગુજરાતી)

**Expected Result:**
- All UI elements translate correctly for each language

---

### ✅ 8. Responsive Design

**What to check:**
- [ ] Chat works on desktop (>768px width)
- [ ] Chat works on tablet (768px width)
- [ ] Chat works on mobile (<768px width)
- [ ] Chat window resizes appropriately
- [ ] Touch interactions work on mobile

**How to test:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes:
   - Desktop: 1920x1080
   - Tablet: 768x1024
   - Mobile: 375x667 (iPhone SE)
4. Verify chat is usable on all sizes

**Expected Result:**
- Chat is fully functional and properly sized on all devices

---

### ✅ 9. Error Handling

**What to check:**
- [ ] Network errors are handled gracefully
- [ ] API failures show error messages
- [ ] Empty messages are prevented
- [ ] Long messages are handled properly

**How to test:**
1. Try sending empty message (should be prevented)
2. If using AI mode, temporarily set wrong API key
3. Send message and verify error handling
4. Send very long message (500+ characters)

**Expected Result:**
- Errors are handled gracefully with user-friendly messages

---

### ✅ 10. Performance

**What to check:**
- [ ] Chat opens quickly (<500ms)
- [ ] Messages send instantly
- [ ] No lag when typing
- [ ] Smooth animations
- [ ] No memory leaks (chat can be opened/closed multiple times)

**How to test:**
1. Open and close chat 10 times rapidly
2. Send 20+ messages in quick succession
3. Check browser console for errors
4. Monitor browser memory usage

**Expected Result:**
- Chat performs smoothly without lag or errors

---

## Automated Testing

### Run Existing Tests

```bash
cd frontend
npm test
```

**What tests cover:**
- Component rendering
- Message sending
- Language switching
- Button interactions
- Mock response logic

**Expected Result:**
- All tests pass (24/24 tests should pass)

---

## Common Issues & Solutions

### Issue 1: Chatbot button not visible
**Solution:** 
- Check z-index in CSS
- Verify component is imported in App.jsx
- Clear browser cache

### Issue 2: Language selector not working
**Solution:**
- Check that translations.js is imported
- Verify click handlers are not blocked
- Check z-index of dropdown menu

### Issue 3: Messages not sending
**Solution:**
- Check browser console for errors
- Verify chatService.js is properly imported
- Check network tab for API calls (if using AI mode)

### Issue 4: AI responses not working
**Solution:**
- Verify OpenAI API key is set in `.env`
- Check API key is valid and has credits
- Restart dev server after adding API key
- Check browser console for API errors

### Issue 5: Chat overlaps header
**Solution:**
- Verify z-index hierarchy (Navigation: 50, Button: 45, Window: 40)
- Check max-height calculation
- Verify bottom positioning

---

## Browser Console Checks

Open browser console (F12) and check for:

### ✅ No Errors
- No red error messages
- No 404 errors for missing files
- No CORS errors

### ✅ Successful API Calls (AI Mode)
- Look for OpenAI API calls in Network tab
- Verify 200 status codes
- Check response payloads

### ✅ State Updates
- React DevTools should show state changes
- Conversation history should update
- Language state should change

---

## Final Verification Checklist

Before considering the chatbot "working properly", verify:

- [ ] ✅ Chatbot button visible on all pages
- [ ] ✅ Chat window opens/closes smoothly
- [ ] ✅ Language selector works for all 7 languages
- [ ] ✅ Messages can be sent and received
- [ ] ✅ Mock responses work correctly
- [ ] ✅ AI responses work (if API key configured)
- [ ] ✅ Suggested questions work
- [ ] ✅ Responsive on mobile, tablet, and desktop
- [ ] ✅ No console errors
- [ ] ✅ All automated tests pass
- [ ] ✅ Performance is smooth
- [ ] ✅ Error handling works

---

## Quick Test Script

Run this quick 2-minute test:

1. **Open app** → Chat button visible? ✅
2. **Click button** → Chat opens? ✅
3. **Send "Hello"** → Bot responds? ✅
4. **Click language button** → Dropdown opens? ✅
5. **Select Hindi** → UI translates? ✅
6. **Send message in Hindi** → Bot responds? ✅
7. **Click suggested question** → Works? ✅
8. **Close chat** → Closes smoothly? ✅
9. **Open DevTools** → No errors? ✅
10. **Run `npm test`** → All tests pass? ✅

If all 10 checks pass → **Chatbot is working properly!** ✅

---

## Need Help?

If you encounter issues:

1. Check browser console for errors
2. Review `frontend/CHATBOT_TRAINING_GUIDE.md` for setup
3. Verify all dependencies are installed (`npm install`)
4. Restart dev server
5. Clear browser cache and reload

---

## Demo Video Recording Checklist

When recording a demo:

1. Show chatbot button on different pages
2. Open chat and show interface
3. Demonstrate language switching
4. Send various test messages
5. Show suggested questions
6. Demonstrate on mobile view (DevTools)
7. Show AI responses (if configured)
8. Highlight smooth animations

---

**Last Updated:** Based on HealMate AI Assistant Chatbot implementation
**Version:** 1.0
**Status:** Production Ready ✅
