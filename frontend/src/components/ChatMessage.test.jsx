import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChatMessage from './ChatMessage';

describe('ChatMessage Component', () => {
  const mockTimestamp = new Date('2024-01-15T14:30:00');

  describe('User Messages', () => {
    it('renders user message with correct text', () => {
      render(
        <ChatMessage 
          text="Hello, I need help with my medication" 
          sender="user" 
          timestamp={mockTimestamp} 
        />
      );
      
      expect(screen.getByText('Hello, I need help with my medication')).toBeInTheDocument();
    });

    it('applies correct styling for user messages', () => {
      const { container } = render(
        <ChatMessage 
          text="User message" 
          sender="user" 
          timestamp={mockTimestamp} 
        />
      );
      
      const messageContainer = container.querySelector('.flex.justify-end');
      expect(messageContainer).toBeInTheDocument();
      
      const messageBubble = container.querySelector('.bg-forest-500.text-cream-50');
      expect(messageBubble).toBeInTheDocument();
    });

    it('aligns user messages to the right', () => {
      const { container } = render(
        <ChatMessage 
          text="User message" 
          sender="user" 
          timestamp={mockTimestamp} 
        />
      );
      
      const messageContainer = container.querySelector('.justify-end');
      expect(messageContainer).toBeInTheDocument();
    });
  });

  describe('Bot Messages', () => {
    it('renders bot message with correct text', () => {
      render(
        <ChatMessage 
          text="I can help you with your medication schedule" 
          sender="bot" 
          timestamp={mockTimestamp} 
        />
      );
      
      expect(screen.getByText('I can help you with your medication schedule')).toBeInTheDocument();
    });

    it('applies correct styling for bot messages', () => {
      const { container } = render(
        <ChatMessage 
          text="Bot message" 
          sender="bot" 
          timestamp={mockTimestamp} 
        />
      );
      
      const messageContainer = container.querySelector('.flex.justify-start');
      expect(messageContainer).toBeInTheDocument();
      
      const messageBubble = container.querySelector('.bg-cream-200.text-forest-500');
      expect(messageBubble).toBeInTheDocument();
    });

    it('aligns bot messages to the left', () => {
      const { container } = render(
        <ChatMessage 
          text="Bot message" 
          sender="bot" 
          timestamp={mockTimestamp} 
        />
      );
      
      const messageContainer = container.querySelector('.justify-start');
      expect(messageContainer).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies rounded-2xl styling to message bubbles', () => {
      const { container } = render(
        <ChatMessage 
          text="Test message" 
          sender="user" 
          timestamp={mockTimestamp} 
        />
      );
      
      const messageBubble = container.querySelector('.rounded-2xl');
      expect(messageBubble).toBeInTheDocument();
    });

    it('applies fade-in animation class', () => {
      const { container } = render(
        <ChatMessage 
          text="Test message" 
          sender="user" 
          timestamp={mockTimestamp} 
        />
      );
      
      const messageContainer = container.querySelector('.animate-fade-in');
      expect(messageContainer).toBeInTheDocument();
    });
  });

  describe('Timestamp Display', () => {
    it('displays timestamp in readable format (2:30 PM)', () => {
      render(
        <ChatMessage 
          text="Test message" 
          sender="user" 
          timestamp={mockTimestamp} 
        />
      );
      
      expect(screen.getByText('2:30 PM')).toBeInTheDocument();
    });

    it('formats morning time correctly (9:15 AM)', () => {
      const morningTime = new Date('2024-01-15T09:15:00');
      render(
        <ChatMessage 
          text="Test message" 
          sender="user" 
          timestamp={morningTime} 
        />
      );
      
      expect(screen.getByText('9:15 AM')).toBeInTheDocument();
    });

    it('formats midnight correctly (12:00 AM)', () => {
      const midnight = new Date('2024-01-15T00:00:00');
      render(
        <ChatMessage 
          text="Test message" 
          sender="user" 
          timestamp={midnight} 
        />
      );
      
      expect(screen.getByText('12:00 AM')).toBeInTheDocument();
    });

    it('formats noon correctly (12:00 PM)', () => {
      const noon = new Date('2024-01-15T12:00:00');
      render(
        <ChatMessage 
          text="Test message" 
          sender="user" 
          timestamp={noon} 
        />
      );
      
      expect(screen.getByText('12:00 PM')).toBeInTheDocument();
    });

    it('pads single-digit minutes with zero', () => {
      const timeWithSingleDigitMinute = new Date('2024-01-15T14:05:00');
      render(
        <ChatMessage 
          text="Test message" 
          sender="user" 
          timestamp={timeWithSingleDigitMinute} 
        />
      );
      
      expect(screen.getByText('2:05 PM')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles long messages without breaking layout', () => {
      const longMessage = 'This is a very long message that should wrap properly within the message bubble without breaking the layout or causing overflow issues in the chat interface.';
      
      const { container } = render(
        <ChatMessage 
          text={longMessage} 
          sender="user" 
          timestamp={mockTimestamp} 
        />
      );
      
      expect(screen.getByText(longMessage)).toBeInTheDocument();
      
      const messageBubble = container.querySelector('.break-words');
      expect(messageBubble).toBeInTheDocument();
    });

    it('handles empty timestamp gracefully', () => {
      const { container } = render(
        <ChatMessage 
          text="Test message" 
          sender="user" 
          timestamp={null} 
        />
      );
      
      const timestamp = container.querySelector('.text-xs');
      expect(timestamp).toHaveTextContent('');
    });
  });
});
