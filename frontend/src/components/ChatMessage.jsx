import PropTypes from 'prop-types';

/**
 * ChatMessage Component
 * 
 * Displays individual chat messages with appropriate styling based on sender type.
 * Supports user messages (right-aligned, forest-500 bg) and bot messages (left-aligned, cream-200 bg).
 * 
 * **Validates: Requirements 2.2, 2.3, 2.4, 8.2, 8.5**
 * 
 * @param {Object} props
 * @param {string} props.text - Message content to display
 * @param {'user'|'bot'} props.sender - Message sender type
 * @param {Date} props.timestamp - Message creation timestamp
 */
const ChatMessage = ({ text, sender, timestamp }) => {
  // Format timestamp to readable format (e.g., "2:30 PM")
  const formatTimestamp = (date) => {
    if (!date) return '';
    
    const messageDate = new Date(date);
    const hours = messageDate.getHours();
    const minutes = messageDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  // Determine alignment and styling based on sender
  const isUser = sender === 'user';
  
  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}
    >
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
        {/* Message bubble */}
        <div
          className={`
            rounded-2xl px-4 py-3 break-words
            ${isUser 
              ? 'bg-forest-500 text-cream-50' 
              : 'bg-cream-200 text-forest-500'
            }
          `}
        >
          <p className="text-sm leading-relaxed">{text}</p>
        </div>
        
        {/* Timestamp */}
        <span className="text-xs text-forest-500/40 mt-1 px-1">
          {formatTimestamp(timestamp)}
        </span>
      </div>
    </div>
  );
};

ChatMessage.propTypes = {
  text: PropTypes.string.isRequired,
  sender: PropTypes.oneOf(['user', 'bot']).isRequired,
  timestamp: PropTypes.instanceOf(Date).isRequired,
};

export default ChatMessage;
