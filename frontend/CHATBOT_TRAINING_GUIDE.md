# How to Train Your HealMate Chatbot

## Current State: Mock Responses

Right now, your chatbot uses **keyword matching** with pre-defined responses. It's great for demos but limited in capability.

### Current Implementation
```javascript
// frontend/src/services/chatService.js
if (message.includes('missed dose')) {
  return "It seems you missed a dose...";
}
```

## Training Options

### Option 1: OpenAI GPT Integration (Recommended for Hackathon)
**Best for:** Quick setup, powerful AI, minimal training needed

#### Step 1: Get OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up and get API key
3. Add to `.env` file:
```env
VITE_OPENAI_API_KEY=sk-your-key-here
```

#### Step 2: Update Chat Service
```javascript
// frontend/src/services/chatService.js

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const getBotResponseWithAI = async (userMessage, conversationHistory = []) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // or 'gpt-4' for better quality
        messages: [
          {
            role: 'system',
            content: `You are HealMate AI Assistant, a helpful healthcare chatbot for medication management. 
            You help patients with:
            - Medication reminders and schedules
            - Adherence tracking and insights
            - Basic health guidance
            - Answering medication-related questions
            
            Keep responses concise, empathetic, and healthcare-focused.
            Always remind users to consult their doctor for medical advice.`
          },
          ...conversationHistory,
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};
```

#### Step 3: Update Chatbot Component
```javascript
// frontend/src/components/Chatbot.jsx

// Add conversation history state
const [conversationHistory, setConversationHistory] = useState([]);

// Update handleSendMessage
const handleSendMessage = async (text) => {
  const trimmedText = text.trim();
  if (!trimmedText) return;

  // Add user message
  const userMessage = createMessage(trimmedText, 'user');
  setMessages(prev => [...prev, userMessage]);
  setInputValue('');
  setIsTyping(true);

  // Update conversation history
  const newHistory = [
    ...conversationHistory,
    { role: 'user', content: trimmedText }
  ];

  try {
    // Get AI response
    const responseText = await getBotResponseWithAI(trimmedText, newHistory);
    
    setIsTyping(false);

    // Add bot message
    const botMessage = createMessage(responseText, 'bot');
    setMessages(prev => [...prev, botMessage]);

    // Update history
    setConversationHistory([
      ...newHistory,
      { role: 'assistant', content: responseText }
    ]);
  } catch (error) {
    console.error('Error:', error);
    setIsTyping(false);
    const errorMessage = createMessage(t.errorMessage, 'bot');
    setMessages(prev => [...prev, errorMessage]);
  }
};
```

**Cost:** ~$0.002 per conversation (very affordable for hackathon)

---

### Option 2: Custom Backend with Fine-Tuned Model
**Best for:** Production, custom training, data privacy

#### Architecture
```
Frontend (React) 
    ↓
Backend API (Node.js/Python)
    ↓
AI Model (Fine-tuned GPT/Custom)
    ↓
Database (Training data, logs)
```

#### Step 1: Create Backend API

**Backend Structure:**
```
backend/
├── ai-service/
│   ├── app.py              # Flask/FastAPI server
│   ├── model.py            # AI model handler
│   ├── training_data.json  # Your training data
│   └── requirements.txt
```

**Example Backend (Python + Flask):**
```python
# backend/ai-service/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)

openai.api_key = os.getenv('OPENAI_API_KEY')

# System prompt for healthcare context
SYSTEM_PROMPT = """You are HealMate AI Assistant, a healthcare chatbot specializing in medication management.
Your role is to help patients with medication adherence, reminders, and basic health guidance.
Always be empathetic, clear, and remind users to consult healthcare professionals for medical advice."""

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message')
        conversation_history = data.get('history', [])
        
        # Build messages for OpenAI
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ] + conversation_history + [
            {"role": "user", "content": user_message}
        ]
        
        # Get AI response
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7,
            max_tokens=150
        )
        
        bot_response = response.choices[0].message.content
        
        return jsonify({
            'response': bot_response,
            'success': True
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
```

**requirements.txt:**
```
flask==2.3.0
flask-cors==4.0.0
openai==0.27.0
python-dotenv==1.0.0
```

#### Step 2: Update Frontend to Use Backend

```javascript
// frontend/src/services/chatService.js

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export const getBotResponseFromBackend = async (userMessage, conversationHistory = []) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory,
        userId: localStorage.getItem('userId')
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Backend API error:', error);
    throw error;
  }
};
```

---

### Option 3: Fine-Tune Your Own Model
**Best for:** Maximum customization, specific healthcare domain

#### Step 1: Prepare Training Data

Create a dataset of healthcare conversations:

```json
// training_data.json
[
  {
    "prompt": "I missed my morning medication",
    "completion": "It's important to take your medication as prescribed. If it's been less than a few hours, you can take it now. However, if it's close to your next dose time, skip the missed dose and continue with your regular schedule. Never double up on doses. If you're unsure, please contact your healthcare provider."
  },
  {
    "prompt": "What is my adherence score?",
    "completion": "Your adherence score shows how consistently you're taking your medications. You can check your detailed adherence insights on your dashboard. Maintaining good adherence is crucial for your treatment effectiveness. Would you like tips on improving your medication routine?"
  },
  {
    "prompt": "Remind me about my schedule",
    "completion": "I can help you stay on track with your medication schedule. Please check your medication list in the app for specific timing details. You can also set up automatic reminders for each medication. Would you like me to guide you through setting up reminders?"
  },
  {
    "prompt": "I'm feeling side effects from my medication",
    "completion": "I'm sorry to hear you're experiencing side effects. This is important to address. Please contact your doctor or healthcare provider immediately to discuss these symptoms. They can assess whether you should continue the medication or if adjustments are needed. In case of severe reactions, seek emergency medical attention."
  },
  {
    "prompt": "Can I take my medicine with food?",
    "completion": "Whether you should take your medication with food depends on the specific medication. Some work better with food, while others should be taken on an empty stomach. Please check the instructions on your medication label or consult your pharmacist or doctor for specific guidance about your medications."
  }
]
```

#### Step 2: Fine-Tune OpenAI Model

```python
# fine_tune_model.py
import openai
import json

openai.api_key = 'your-api-key'

# Prepare training file
with open('training_data.json', 'r') as f:
    training_data = json.load(f)

# Convert to OpenAI format
formatted_data = []
for item in training_data:
    formatted_data.append({
        "messages": [
            {"role": "system", "content": "You are HealMate AI Assistant."},
            {"role": "user", "content": item["prompt"]},
            {"role": "assistant", "content": item["completion"]}
        ]
    })

# Save formatted data
with open('training_formatted.jsonl', 'w') as f:
    for item in formatted_data:
        f.write(json.dumps(item) + '\n')

# Upload training file
file = openai.File.create(
    file=open('training_formatted.jsonl', 'rb'),
    purpose='fine-tune'
)

# Create fine-tuning job
fine_tune = openai.FineTuningJob.create(
    training_file=file.id,
    model="gpt-3.5-turbo"
)

print(f"Fine-tuning job created: {fine_tune.id}")
```

---

## Training Data Sources

### 1. Medical Knowledge Bases
- **MedlinePlus**: Consumer health information
- **Mayo Clinic**: Medication guides
- **FDA Drug Database**: Official medication information
- **WHO Essential Medicines**: Global medication standards

### 2. Conversation Datasets
- **Medical Dialog Dataset**: Doctor-patient conversations
- **HealthTap**: Q&A from healthcare professionals
- **Reddit r/AskDocs**: Real patient questions (anonymized)

### 3. Your Own Data
- Collect anonymized patient interactions
- Log common questions and responses
- Track which responses are most helpful
- Continuously improve based on feedback

---

## Improving Chatbot Intelligence

### 1. Add Context Awareness

```javascript
// Include user's medication data in context
const getUserContext = async (userId) => {
  const medications = await fetchUserMedications(userId);
  const adherence = await fetchAdherenceScore(userId);
  
  return {
    medications: medications.map(m => m.name),
    adherenceScore: adherence.score,
    lastMissedDose: adherence.lastMissed
  };
};

// Use in AI prompt
const contextPrompt = `User context:
- Current medications: ${context.medications.join(', ')}
- Adherence score: ${context.adherenceScore}%
- Last missed dose: ${context.lastMissedDose}

User question: ${userMessage}`;
```

### 2. Add Intent Recognition

```javascript
const detectIntent = (message) => {
  const intents = {
    missedDose: /missed|forgot|skip/i,
    adherence: /adherence|compliance|score/i,
    schedule: /schedule|reminder|when|time/i,
    sideEffects: /side effect|reaction|symptom/i,
    dosage: /how much|dosage|amount/i
  };
  
  for (const [intent, pattern] of Object.entries(intents)) {
    if (pattern.test(message)) {
      return intent;
    }
  }
  
  return 'general';
};
```

### 3. Add Multi-Turn Conversations

```javascript
// Track conversation state
const [conversationState, setConversationState] = useState({
  topic: null,
  followUpExpected: false,
  context: {}
});

// Handle follow-up questions
if (conversationState.followUpExpected) {
  // Use previous context
  prompt = `Previous topic: ${conversationState.topic}
  Previous context: ${JSON.stringify(conversationState.context)}
  Follow-up question: ${userMessage}`;
}
```

---

## Testing Your Trained Chatbot

### 1. Unit Tests
```javascript
describe('AI Chatbot', () => {
  it('should respond to medication questions', async () => {
    const response = await getBotResponse('What is my medication schedule?');
    expect(response).toContain('schedule');
  });
  
  it('should handle missed dose queries', async () => {
    const response = await getBotResponse('I missed my dose');
    expect(response).toContain('dose');
  });
});
```

### 2. Quality Metrics
- **Response Relevance**: Does it answer the question?
- **Response Accuracy**: Is the information correct?
- **Response Tone**: Is it empathetic and professional?
- **Response Length**: Is it concise but complete?

### 3. User Feedback
```javascript
// Add feedback buttons to messages
<div className="flex gap-2 mt-2">
  <button onClick={() => rateBotResponse(message.id, 'helpful')}>
    👍 Helpful
  </button>
  <button onClick={() => rateBotResponse(message.id, 'not-helpful')}>
    👎 Not Helpful
  </button>
</div>
```

---

## Cost Estimates

### OpenAI GPT-3.5-turbo
- **Input**: $0.0015 per 1K tokens
- **Output**: $0.002 per 1K tokens
- **Average conversation**: ~500 tokens = $0.001
- **1000 conversations**: ~$1

### OpenAI GPT-4
- **Input**: $0.03 per 1K tokens
- **Output**: $0.06 per 1K tokens
- **Average conversation**: ~500 tokens = $0.045
- **1000 conversations**: ~$45

### Fine-Tuning
- **Training**: $0.008 per 1K tokens
- **Usage**: Same as base model + 20%
- **One-time cost**: $10-50 depending on dataset size

---

## Quick Start for Hackathon

### Fastest Path (30 minutes):

1. **Get OpenAI API Key** (5 min)
   - Sign up at platform.openai.com
   - Get API key

2. **Add to Frontend** (15 min)
   - Update `chatService.js` with OpenAI integration
   - Add conversation history tracking
   - Test with a few questions

3. **Customize System Prompt** (10 min)
   - Add healthcare-specific instructions
   - Include medication management focus
   - Test responses

### Demo Script:
1. Show keyword-based responses (current)
2. Switch to AI-powered responses
3. Ask complex questions AI can handle
4. Show multi-turn conversation
5. Demonstrate context awareness

---

## Production Checklist

Before deploying to production:

- [ ] Secure API keys (use environment variables)
- [ ] Add rate limiting
- [ ] Implement error handling
- [ ] Add conversation logging
- [ ] Set up monitoring
- [ ] Add user feedback mechanism
- [ ] Test with real users
- [ ] Ensure HIPAA compliance (if handling PHI)
- [ ] Add content moderation
- [ ] Implement fallback to human support

---

## Resources

### Documentation
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Fine-Tuning Guide](https://platform.openai.com/docs/guides/fine-tuning)
- [Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering)

### Tools
- [LangChain](https://langchain.com) - AI application framework
- [Pinecone](https://pinecone.io) - Vector database for context
- [Weights & Biases](https://wandb.ai) - ML experiment tracking

### Communities
- [OpenAI Community Forum](https://community.openai.com)
- [r/MachineLearning](https://reddit.com/r/MachineLearning)
- [AI Stack Exchange](https://ai.stackexchange.com)

---

## Need Help?

The current mock implementation is perfect for your hackathon demo. When you're ready to add real AI:

1. Start with OpenAI GPT-3.5-turbo (easiest)
2. Customize the system prompt for healthcare
3. Add conversation history for context
4. Test thoroughly with healthcare scenarios
5. Collect feedback and iterate

Good luck with your hackathon! 🚀
