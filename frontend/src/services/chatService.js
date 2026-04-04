/**
 * Chat Service
 * 
 * Handles message processing and response generation for the AI Health Assistant Chatbot.
 * Supports both mock responses (keyword matching) and OpenAI GPT integration.
 * Structured for future backend API integration.
 */

// OpenAI Configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const USE_AI = OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here';

// System prompt for healthcare context
const SYSTEM_PROMPT = `You are HealMate AI Assistant, a helpful and empathetic healthcare chatbot specializing in medication management.

Your role is to help patients with:
- Medication reminders and schedules
- Adherence tracking and insights
- Basic health guidance
- Answering medication-related questions

Guidelines:
- Keep responses concise (2-3 sentences max)
- Be empathetic and supportive
- Always remind users to consult their doctor for medical advice
- Focus on medication adherence and management
- Use simple, clear language
- Be encouraging about their health journey

Important: You provide general guidance only. For specific medical advice, users should consult their healthcare provider.`;

/**
 * Message format structure
 * @typedef {Object} Message
 * @property {string} id - Unique identifier (timestamp-based)
 * @property {string} text - Message content
 * @property {'user'|'bot'} sender - Message sender type
 * @property {Date} timestamp - Message creation time
 */

/**
 * Creates a formatted message object
 * @param {string} text - Message content
 * @param {'user'|'bot'} sender - Message sender type
 * @returns {Message} Formatted message object
 */
export const createMessage = (text, sender) => {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text,
    sender,
    timestamp: new Date()
  };
};

/**
 * OpenAI GPT Integration
 * Generates intelligent responses using OpenAI's GPT model
 * 
 * @param {string} userMessage - User's input message
 * @param {Array} conversationHistory - Previous messages for context
 * @param {object} translations - Translation object for current language
 * @returns {Promise<string>} AI-generated response
 */
export const getAIResponse = async (userMessage, conversationHistory = [], translations = null) => {
  if (!USE_AI) {
    console.warn('OpenAI API key not configured. Using mock responses.');
    return generateMockResponse(userMessage, translations);
  }

  try {
    // Build messages array for OpenAI
    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage
      }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 150,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Fallback to mock responses if AI fails
    return generateMockResponse(userMessage, translations);
  }
};

/**
 * Mock Response Engine
 * Generates responses based on keyword matching with multi-language support
 * Used as fallback when OpenAI is not available
 * 
 * Keyword Priority:
 * 1. "missed dose" or "missed medicine" → Missed dose response
 * 2. "medicine" or "medication" → Medication schedule response
 * 3. "adherence" or "compliance" → Adherence insights response
 * 4. "schedule" or "reminder" → Schedule reminder response
 * 5. Default → General help response
 * 
 * @param {string} userMessage - User's input message
 * @param {object} translations - Translation object for current language
 * @returns {Promise<string>} Bot response text
 */
export const generateMockResponse = async (userMessage, translations = null) => {
  // Simulate network delay (within 500ms requirement)
  await new Promise(resolve => setTimeout(resolve, 300));

  const message = userMessage.toLowerCase().trim();

  // Default English responses if no translations provided
  const responses = translations?.responses || {
    missedDose: "It seems you missed a dose. Please take it if safe or consult your doctor.",
    medicine: "Make sure to follow your prescribed schedule for best results.",
    adherence: "Your adherence is important for your health. Check your dashboard for detailed insights.",
    schedule: "I can help you stay on track with your medication schedule. Check your medication list for timing details.",
    default: "I'm here to help with your medication and health queries."
  };

  // Check for empty input
  if (!message) {
    return responses.default;
  }

  // Multi-language keyword matching
  // English keywords
  const hasMissedDose = (message.includes('missed') && message.includes('dose')) || 
                        (message.includes('missed') && message.includes('medicine'));
  const hasMedicine = message.includes('medicine') || message.includes('medication');
  const hasAdherence = message.includes('adherence') || message.includes('compliance');
  const hasSchedule = message.includes('schedule') || message.includes('reminder');

  // Hindi keywords (Devanagari)
  const hasMissedDoseHi = message.includes('भूल') || message.includes('चूक') || message.includes('मिस');
  const hasMedicineHi = message.includes('दवा') || message.includes('औषध');
  const hasAdherenceHi = message.includes('पालन');
  const hasScheduleHi = message.includes('शेड्यूल') || message.includes('समय');

  // Tamil keywords
  const hasMissedDoseTa = message.includes('தவற') || message.includes('மிஸ்');
  const hasMedicineTa = message.includes('மருந்து');
  const hasAdherenceTa = message.includes('கடைபிடிப்பு');
  const hasScheduleTa = message.includes('அட்டவணை');

  // Telugu keywords
  const hasMissedDoseTe = message.includes('మిస్') || message.includes('తప్పిపోయింది');
  const hasMedicineTe = message.includes('మందు');
  const hasAdherenceTe = message.includes('కట్టుబడి');
  const hasScheduleTe = message.includes('షెడ్యూల్');

  // Bengali keywords
  const hasMissedDoseBn = message.includes('মিস') || message.includes('চুকে');
  const hasMedicineBn = message.includes('ওষুধ');
  const hasAdherenceBn = message.includes('মেনে চলা');
  const hasScheduleBn = message.includes('সময়সূচী');

  // Marathi keywords
  const hasMissedDoseMr = message.includes('चुकव') || message.includes('मिस');
  const hasMedicineMr = message.includes('औषध');
  const hasAdherenceMr = message.includes('पालन');
  const hasScheduleMr = message.includes('वेळापत्रक');

  // Gujarati keywords
  const hasMissedDoseGu = message.includes('ચૂક') || message.includes('મિસ');
  const hasMedicineGu = message.includes('દવા');
  const hasAdherenceGu = message.includes('પાલન');
  const hasScheduleGu = message.includes('શેડ્યૂલ');

  // Priority 1: Missed dose queries
  if (hasMissedDose || hasMissedDoseHi || hasMissedDoseTa || hasMissedDoseTe || 
      hasMissedDoseBn || hasMissedDoseMr || hasMissedDoseGu) {
    return responses.missedDose;
  }

  // Priority 2: Medicine/medication queries
  if (hasMedicine || hasMedicineHi || hasMedicineTa || hasMedicineTe || 
      hasMedicineBn || hasMedicineMr || hasMedicineGu) {
    return responses.medicine;
  }

  // Priority 3: Adherence/compliance queries
  if (hasAdherence || hasAdherenceHi || hasAdherenceTa || hasAdherenceTe || 
      hasAdherenceBn || hasAdherenceMr || hasAdherenceGu) {
    return responses.adherence;
  }

  // Priority 4: Schedule/reminder queries
  if (hasSchedule || hasScheduleHi || hasScheduleTa || hasScheduleTe || 
      hasScheduleBn || hasScheduleMr || hasScheduleGu) {
    return responses.schedule;
  }

  // Default response for unmatched input
  return responses.default;
};

/**
 * Placeholder function for future API integration
 * 
 * Future API Endpoint Specification:
 * - Endpoint: POST /api/chat
 * - Headers: Authorization: Bearer <token>, Content-Type: application/json
 * - Request body: { message: string, userId: string, sessionId: string }
 * - Response body: { response: string, suggestions?: string[] }
 * - Timeout: 10 seconds
 * - Rate limit: 20 requests per minute per user
 * 
 * @param {string} message - User message text
 * @param {string} userId - Patient user ID
 * @param {string} sessionId - Chat session identifier
 * @returns {Promise<Object>} API response
 */
export const sendMessageToAPI = async (message, userId, sessionId) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        message,
        userId,
        sessionId,
        context: {
          // Optional context can be added here
          // medications: [],
          // adherenceScore: 0
        }
      }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Error handling structure for API failures
 * 
 * @param {Error} error - Error object from API call
 * @returns {string} User-friendly error message
 */
export const handleAPIError = (error) => {
  // Network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return "Connection lost. Please check your internet connection and try again.";
  }

  // Timeout errors
  if (error.name === 'AbortError' || error.message.includes('timeout')) {
    return "Request timed out. Please try again.";
  }

  // Authentication errors (401)
  if (error.message.includes('401')) {
    // Redirect to login would be handled by the component
    return "Your session has expired. Please log in again.";
  }

  // Rate limiting (429)
  if (error.message.includes('429')) {
    return "Too many requests. Please wait a moment and try again.";
  }

  // Server errors (5xx)
  if (error.message.includes('500') || error.message.includes('503')) {
    return "Service temporarily unavailable. Please try again later.";
  }

  // Generic error
  return "Something went wrong. Please try again.";
};

/**
 * Main function to get bot response
 * Automatically uses AI if available, falls back to mock responses
 * 
 * @param {string} userMessage - User's input message
 * @param {string} userId - Patient user ID (for future API use)
 * @param {string} sessionId - Chat session identifier (for future API use)
 * @param {object} translations - Translation object for current language
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} Bot response text
 */
export const getBotResponse = async (userMessage, userId = null, sessionId = null, translations = null, conversationHistory = []) => {
  try {
    // Try AI response first if available
    if (USE_AI) {
      console.log('Using OpenAI GPT for response');
      const response = await getAIResponse(userMessage, conversationHistory, translations);
      return response;
    }
    
    // Fallback to mock response engine with multi-language support
    console.log('Using mock response engine');
    const response = await generateMockResponse(userMessage, translations);
    return response;

    // Future implementation: Backend API integration
    // Uncomment below when backend is ready
    /*
    const apiResponse = await sendMessageToAPI(userMessage, userId, sessionId);
    return apiResponse.response;
    */
  } catch (error) {
    console.error('Error getting bot response:', error);
    const errorMessage = handleAPIError(error);
    throw new Error(errorMessage);
  }
};
