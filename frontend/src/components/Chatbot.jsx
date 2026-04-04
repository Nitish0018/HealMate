import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { createMessage, getBotResponse } from '../services/chatService';
import { getTranslation, getAvailableLanguages } from '../services/translations';

/**
 * Chatbot Component
 * 
 * AI Health Assistant chatbot with floating button and modal chat window.
 * Provides patients with instant access to medication reminders, adherence insights,
 * and basic health guidance through a conversational interface.
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 8.1, 8.4**
 * 
 * Features:
 * - Floating action button (fixed bottom-right)
 * - Slide-up/slide-down animations (300ms)
 * - Session-based chat persistence
 * - Mock AI response engine with keyword matching
 * - Quick action buttons for common queries
 * - Responsive design (mobile/tablet/desktop)
 * - Multi-language support (English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati)
 */
const Chatbot = () => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const languageMenuRef = useRef(null);

  // Get current translations
  const t = getTranslation(currentLanguage);
  const availableLanguages = getAvailableLanguages();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Add welcome message on first open
  useEffect(() => {
    if (isOpen && isFirstOpen && messages.length === 0) {
      const welcomeMsg = createMessage(t.welcomeMessage, 'bot');
      setMessages([welcomeMsg]);
      setIsFirstOpen(false);
    }
  }, [isOpen, isFirstOpen, messages.length, t.welcomeMessage]);

  // Update messages when language changes
  useEffect(() => {
    if (messages.length > 0) {
      // Update welcome message if it's the first message
      const firstMessage = messages[0];
      if (firstMessage.sender === 'bot' && messages.length === 1) {
        const updatedWelcome = createMessage(t.welcomeMessage, 'bot');
        setMessages([updatedWelcome]);
        setShowQuickActions(true);
      }
    }
  }, [currentLanguage]);

  const scrollToBottom = () => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * Toggle chat window open/closed
   * **Validates: Requirements 1.2, 1.3**
   */
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Handle sending a message
   * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
   */
  const handleSendMessage = async (text) => {
    const trimmedText = text.trim();
    
    // Validate non-empty message
    if (!trimmedText) return;

    // Add user message
    const userMessage = createMessage(trimmedText, 'user');
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input
    setInputValue('');

    // Show typing indicator
    setIsTyping(true);

    // Update conversation history for AI context
    const newHistory = [
      ...conversationHistory,
      { role: 'user', content: trimmedText }
    ];

    try {
      // Get bot response with current language translations and conversation history
      const responseText = await getBotResponse(trimmedText, null, null, t, conversationHistory);
      
      // Hide typing indicator
      setIsTyping(false);

      // Add bot message
      const botMessage = createMessage(responseText, 'bot');
      setMessages(prev => [...prev, botMessage]);

      // Update conversation history
      setConversationHistory([
        ...newHistory,
        { role: 'assistant', content: responseText }
      ]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      setIsTyping(false);
      
      // Add error message in current language
      const errorMessage = createMessage(
        t.errorMessage,
        'bot'
      );
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  /**
   * Handle quick action button click
   * **Validates: Requirements 5.5, 5.6**
   */
  const handleQuickAction = (text) => {
    setShowQuickActions(false);
    handleSendMessage(text);
  };

  /**
   * Handle Enter key press in input
   * **Validates: Requirement 3.3**
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  /**
   * Handle Escape key to close chat
   */
  const handleEscapeKey = (e) => {
    if (e.key === 'Escape' && isOpen) {
      toggleChat();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen]);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
    };

    if (showLanguageMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showLanguageMenu]);

  /**
   * Handle language change
   */
  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    setShowLanguageMenu(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      {/* **Validates: Requirements 1.1, 1.4, 8.4** */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 
                   w-14 h-14 md:w-16 md:h-16 
                   bg-forest-500 text-cream-50 rounded-full 
                   shadow-warm-lg hover:shadow-gold hover:bg-forest-600 
                   transition-all duration-300 active:scale-95 
                   flex items-center justify-center z-[45]"
        aria-label="Open AI Health Assistant"
      >
        {isOpen ? (
          // Close icon (X)
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        ) : (
          // Chat icon
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
            />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {/* **Validates: Requirements 1.2, 1.5, 2.1, 6.1, 6.4, 8.6** */}
      {isOpen && (
        <div 
          className="fixed bottom-20 right-4 md:bottom-24 md:right-6 lg:bottom-24 lg:right-8 
                     w-[calc(100vw-2rem)] max-w-[420px] h-[500px] max-h-[calc(100vh-200px)]
                     bg-white rounded-[2rem] shadow-warm-lg border border-cream-200/60 
                     flex flex-col overflow-hidden z-40
                     animate-slide-up"
          role="dialog"
          aria-labelledby="chat-header"
        >
          {/* Chat Header */}
          {/* **Validates: Requirement 2.1** */}
          <div 
            id="chat-header"
            className="bg-forest-500 text-cream-50 px-6 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold-300 rounded-full flex items-center justify-center">
                <svg 
                  className="w-5 h-5 text-forest-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t.chatTitle}</h3>
                <div className="flex items-center gap-1.5 text-xs text-cream-100">
                  <span className="w-2 h-2 bg-gold-300 rounded-full animate-pulse"></span>
                  <span>{t.online}</span>
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <div className="relative" ref={languageMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLanguageMenu(!showLanguageMenu);
                }}
                className="flex items-center gap-2 px-3 py-2 hover:bg-forest-600 rounded-lg transition-colors relative z-10"
                aria-label="Change language"
                type="button"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" 
                  />
                </svg>
                <span className="text-xs font-medium">{t.name}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
              </button>

              {/* Language Menu */}
              {showLanguageMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-cream-200 py-2 min-w-[160px] z-[100] animate-fade-in">
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLanguageChange(lang.code);
                      }}
                      type="button"
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        currentLanguage === lang.code
                          ? 'bg-forest-50 text-forest-500 font-semibold'
                          : 'text-forest-500/70 hover:bg-cream-50'
                      }`}
                    >
                      {lang.name}
                      {currentLanguage === lang.code && (
                        <span className="ml-2">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Messages Container */}
          {/* **Validates: Requirements 2.6, 2.7, 10.1, 10.2** */}
          <div 
            className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
            role="log"
            aria-live="polite"
          >
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                text={message.text}
                sender={message.sender}
                timestamp={message.timestamp}
              />
            ))}

            {/* Quick Action Buttons */}
            {/* **Validates: Requirements 5.1, 5.2, 5.3, 5.4** */}
            {showQuickActions && messages.length === 1 && (
              <div className="space-y-2 animate-fade-in">
                <p className="text-xs text-forest-500/40 font-medium mb-3">{t.quickActionsLabel}</p>
                {t.quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="btn-pill-outline w-full text-left justify-start"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            {/* Typing Indicator */}
            {/* **Validates: Requirements 4.7, 6.3** */}
            {isTyping && (
              <div className="flex justify-start mb-4 animate-fade-in">
                <div className="bg-cream-200 text-forest-500 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-forest-500/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-forest-500/40 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
                    <span className="w-2 h-2 bg-forest-500/40 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {/* **Validates: Requirements 3.1, 3.6, 3.7** */}
          <div className="border-t border-cream-200 px-6 py-4">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.placeholder}
                className="input-warm flex-1 py-3 text-sm"
                aria-label="Type your message"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim()}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${inputValue.trim() 
                    ? 'bg-forest-500 text-cream-50 hover:bg-forest-600 active:scale-95' 
                    : 'bg-cream-200 text-forest-500/30 cursor-not-allowed'
                  }
                `}
                aria-label="Send message"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom animation styles */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 300ms ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Chatbot;
