# OpenAI GPT Integration - Setup Instructions

## ✅ Implementation Complete!

Your chatbot now supports **AI-powered responses** using OpenAI GPT-3.5-turbo!

## 🚀 Quick Start (5 Minutes)

### Step 1: Get OpenAI API Key

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the API key (starts with `sk-...`)

### Step 2: Add API Key to Your Project

1. Open `frontend/.env` file
2. Find this line:
   ```env
   VITE_OPENAI_API_KEY=your-openai-api-key-here
   ```
3. Replace `your-openai-api-key-here` with your actual API key:
   ```env
   VITE_OPENAI_API_KEY=sk-proj-abc123...
   ```
4. Save the file

### Step 3: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd frontend
npm run dev
```

### Step 4: Test It!

1. Open your app in browser
2. Click the chatbot button
3. Ask a complex question like:
   - "What should I do if I accidentally took two doses?"
   - "Can you explain why medication adherence is important?"
   - "I'm traveling to a different timezone, how should I adjust my schedule?"

You should now get intelligent AI responses instead of simple keyword matches!

---

## 🎯 How It Works

### Automatic Fallback System

The chatbot automatically detects if OpenAI is available:

```javascript
// If API key is configured → Use OpenAI GPT
// If API key is missing → Use mock responses (keyword matching)
```

**Benefits:**
- ✅ Works without API key (demo mode)
- ✅ Automatically upgrades when API key is added
- ✅ Falls back to mock if API fails
- ✅ No code changes needed

### Conversation Context

The chatbot now remembers previous messages:

```
User: "I missed my morning dose"
Bot: "It's important to take your medication..."

User: "What should I do now?"
Bot: "Since you missed your morning dose..." ← Remembers context!
```

### Multi-Language Support

AI responses work in all supported languages:
- English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati

---

## 💰 Cost Estimate

### OpenAI GPT-3.5-turbo Pricing

- **Input**: $0.0015 per 1,000 tokens
- **Output**: $0.002 per 1,000 tokens

### Real-World Examples

**Average conversation** (5 messages):
- Tokens: ~500
- Cost: ~$0.001 (less than 1 cent)

**100 conversations**:
- Cost: ~$0.10 (10 cents)

**1,000 conversations**:
- Cost: ~$1.00 (1 dollar)

**For hackathon demo**: Probably less than $0.50 total! 🎉

---

## 🔧 Configuration Options

### Adjust AI Behavior

Edit `frontend/src/services/chatService.js`:

```javascript
// Make responses more creative
temperature: 0.9  // Default: 0.7

// Make responses longer
max_tokens: 200   // Default: 150

// Make responses more focused
presence_penalty: 0.8  // Default: 0.6
```

### Customize System Prompt

Edit the `SYSTEM_PROMPT` in `chatService.js`:

```javascript
const SYSTEM_PROMPT = `You are HealMate AI Assistant...

Add your custom instructions here:
- Speak in a friendly, casual tone
- Use emojis occasionally
- Focus on mental health support
- etc.
`;
```

---

## 🧪 Testing

### Test Mock Responses (No API Key)

1. Remove or comment out API key in `.env`
2. Restart server
3. Chatbot uses keyword matching

### Test AI Responses (With API Key)

1. Add valid API key to `.env`
2. Restart server
3. Chatbot uses OpenAI GPT

### Check Which Mode Is Active

Open browser console (F12) and look for:
```
Using OpenAI GPT for response  ← AI mode
Using mock response engine     ← Mock mode
```

---

## 🐛 Troubleshooting

### Issue: "OpenAI API key not configured"

**Solution:**
- Check `.env` file has correct API key
- Restart development server
- API key should start with `sk-`

### Issue: "OpenAI API error: 401"

**Solution:**
- API key is invalid or expired
- Generate new key at platform.openai.com
- Update `.env` file

### Issue: "OpenAI API error: 429"

**Solution:**
- Rate limit exceeded or quota reached
- Check your OpenAI account billing
- Add payment method if needed

### Issue: Chatbot still uses mock responses

**Solution:**
- Verify API key in `.env` is correct
- Restart development server (Ctrl+C, then `npm run dev`)
- Check browser console for errors

### Issue: Responses are in wrong language

**Solution:**
- AI responds in the language of the question
- System prompt is in English
- For better multi-language support, translate system prompt

---

## 📊 Monitoring Usage

### Check OpenAI Dashboard

1. Go to [https://platform.openai.com/usage](https://platform.openai.com/usage)
2. View your API usage
3. Monitor costs in real-time

### Add Usage Logging

Add to `chatService.js`:

```javascript
export const getAIResponse = async (userMessage, conversationHistory = []) => {
  const startTime = Date.now();
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    // ... existing code
  });
  
  const data = await response.json();
  
  // Log usage
  console.log('OpenAI Usage:', {
    tokens: data.usage.total_tokens,
    cost: (data.usage.total_tokens / 1000) * 0.002,
    time: Date.now() - startTime
  });
  
  return data.choices[0].message.content.trim();
};
```

---

## 🎬 Demo Script for Hackathon

### Show Both Modes

**1. Start with Mock Mode** (No API key)
```
"First, let me show you the basic version with keyword matching..."
Ask: "I missed my medicine"
Response: Pre-defined response
```

**2. Switch to AI Mode** (Add API key)
```
"Now, let me enable our AI integration..."
[Add API key, restart]
Ask: "I missed my medicine and I'm worried about side effects"
Response: Intelligent, contextual response
```

**3. Show Context Awareness**
```
Ask: "I missed my morning dose"
Bot: [Responds about missed dose]
Ask: "What should I do now?"
Bot: [Remembers previous context and gives relevant advice]
```

**4. Show Complex Questions**
```
Ask: "I'm traveling to a different timezone, how should I adjust my medication schedule?"
Bot: [Provides detailed, intelligent guidance]
```

**5. Show Multi-Language**
```
Switch to Hindi
Ask: "मैं अपनी दवा भूल गया"
Bot: [Responds intelligently in context]
```

---

## 🔒 Security Best Practices

### ⚠️ IMPORTANT: Never Commit API Keys

**Add to `.gitignore`:**
```
# Environment variables
.env
.env.local
.env.production
```

**Verify:**
```bash
git status
# .env should NOT appear in changes
```

### For Production

1. **Use Environment Variables**
   - Store API key in hosting platform (Vercel, Netlify, etc.)
   - Never hardcode in source code

2. **Use Backend Proxy**
   - Don't expose API key in frontend
   - Create backend endpoint that calls OpenAI
   - Frontend calls your backend

3. **Add Rate Limiting**
   - Limit requests per user
   - Prevent abuse

4. **Monitor Usage**
   - Set up billing alerts
   - Track unusual patterns

---

## 📈 Next Steps

### Enhance AI Responses

1. **Add User Context**
   ```javascript
   const userContext = {
     medications: ['Aspirin', 'Metformin'],
     adherenceScore: 85,
     lastMissedDose: '2 days ago'
   };
   
   // Include in system prompt
   ```

2. **Add Intent Recognition**
   ```javascript
   const intent = detectIntent(userMessage);
   // Customize response based on intent
   ```

3. **Add Feedback Loop**
   ```javascript
   // Let users rate responses
   <button onClick={() => rateResponse(messageId, 'helpful')}>
     👍 Helpful
   </button>
   ```

### Upgrade to GPT-4

For even better responses:

```javascript
// In chatService.js
model: 'gpt-4'  // Instead of 'gpt-3.5-turbo'
```

**Note:** GPT-4 is more expensive but provides higher quality responses.

---

## ✅ Checklist

Before your hackathon demo:

- [ ] OpenAI API key added to `.env`
- [ ] Development server restarted
- [ ] Tested AI responses work
- [ ] Tested fallback to mock responses
- [ ] Tested conversation context
- [ ] Tested multi-language support
- [ ] Prepared demo script
- [ ] Checked OpenAI usage dashboard
- [ ] Verified `.env` not in git

---

## 🎉 You're Ready!

Your chatbot now has:
- ✅ AI-powered intelligent responses
- ✅ Conversation context memory
- ✅ Automatic fallback system
- ✅ Multi-language support
- ✅ Healthcare-focused guidance
- ✅ Cost-effective implementation

**Total setup time**: 5 minutes
**Total cost for demo**: < $1
**Impact**: Huge! 🚀

Good luck with your hackathon! 🏆
