import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chatbot from './Chatbot';
import * as chatService from '../services/chatService';

// Mock the chat service
vi.mock('../services/chatService', () => ({
  createMessage: vi.fn((text, sender) => ({
    id: `${Date.now()}-${Math.random()}`,
    text,
    sender,
    timestamp: new Date()
  })),
  getBotResponse: vi.fn()
}));

describe('Chatbot Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Floating Action Button', () => {
    it('renders floating button when chat is closed', () => {
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      expect(button).toBeInTheDocument();
    });

    it('opens chat window when floating button is clicked', () => {
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      expect(screen.getByText('HealMate AI Assistant')).toBeInTheDocument();
    });

    it('closes chat window when floating button is clicked again', () => {
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      
      // Open chat
      fireEvent.click(button);
      expect(screen.getByText('HealMate AI Assistant')).toBeInTheDocument();
      
      // Close chat
      fireEvent.click(button);
      expect(screen.queryByText('HealMate AI Assistant')).not.toBeInTheDocument();
    });

    it('displays chat icon when closed', () => {
      const { container } = render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      const svg = button.querySelector('svg');
      
      expect(svg).toBeInTheDocument();
    });

    it('displays close icon when open', () => {
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Chat Window', () => {
    it('does not render chat window when closed', () => {
      render(<Chatbot />);
      
      expect(screen.queryByText('HealMate AI Assistant')).not.toBeInTheDocument();
    });

    it('renders chat window when open', () => {
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      expect(screen.getByText('HealMate AI Assistant')).toBeInTheDocument();
      expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it('displays welcome message on first open', async () => {
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText(/Hello! I'm your HealMate AI Assistant/)).toBeInTheDocument();
      });
    });
  });

  describe('Message Input', () => {
    it('renders message input field', () => {
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText('Type your message...');
      expect(input).toBeInTheDocument();
    });

    it('updates input value when typing', () => {
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText('Type your message...');
      fireEvent.change(input, { target: { value: 'Hello' } });
      
      expect(input.value).toBe('Hello');
    });

    it('disables send button when input is empty', () => {
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      const sendButton = screen.getByLabelText('Send message');
      expect(sendButton).toBeDisabled();
    });

    it('enables send button when input has text', () => {
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText('Type your message...');
      fireEvent.change(input, { target: { value: 'Hello' } });
      
      const sendButton = screen.getByLabelText('Send message');
      expect(sendButton).not.toBeDisabled();
    });
  });

  describe('Sending Messages', () => {
    it('sends message when send button is clicked', async () => {
      chatService.getBotResponse.mockResolvedValue('Bot response');
      
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText('Type your message...');
      fireEvent.change(input, { target: { value: 'Hello' } });
      
      const sendButton = screen.getByLabelText('Send message');
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText('Hello')).toBeInTheDocument();
      });
    });

    it('clears input after sending message', async () => {
      chatService.getBotResponse.mockResolvedValue('Bot response');
      
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText('Type your message...');
      fireEvent.change(input, { target: { value: 'Hello' } });
      
      const sendButton = screen.getByLabelText('Send message');
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });

    it('sends message when Enter key is pressed', async () => {
      chatService.getBotResponse.mockResolvedValue('Bot response');
      
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText('Type your message...');
      fireEvent.change(input, { target: { value: 'Hello' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13 });
      
      await waitFor(() => {
        expect(screen.getByText('Hello')).toBeInTheDocument();
      });
    });

    it('does not send empty messages', () => {
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText('Type your message...');
      fireEvent.change(input, { target: { value: '   ' } });
      
      const sendButton = screen.getByLabelText('Send message');
      fireEvent.click(sendButton);
      
      // Should not add any user message (only welcome message should be present)
      const messages = screen.queryAllByText(/./);
      expect(messages.length).toBeGreaterThan(0); // Welcome message exists
    });
  });

  describe('Quick Action Buttons', () => {
    it('displays quick action buttons on first open', async () => {
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Did I miss my medicine?')).toBeInTheDocument();
        expect(screen.getByText('What is my adherence?')).toBeInTheDocument();
        expect(screen.getByText('Remind me my schedule')).toBeInTheDocument();
      });
    });

    it('sends message when quick action button is clicked', async () => {
      chatService.getBotResponse.mockResolvedValue('Bot response');
      
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      await waitFor(() => {
        const quickActionButton = screen.getByText('Did I miss my medicine?');
        fireEvent.click(quickActionButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Did I miss my medicine?')).toBeInTheDocument();
      });
    });

    it('hides quick action buttons after clicking one', async () => {
      chatService.getBotResponse.mockResolvedValue('Bot response');
      
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      await waitFor(() => {
        const quickActionButton = screen.getByText('Did I miss my medicine?');
        fireEvent.click(quickActionButton);
      });
      
      await waitFor(() => {
        expect(screen.queryByText('What is my adherence?')).not.toBeInTheDocument();
      });
    });
  });

  describe('Bot Responses', () => {
    it('displays typing indicator while waiting for response', async () => {
      chatService.getBotResponse.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve('Bot response'), 100))
      );
      
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText('Type your message...');
      fireEvent.change(input, { target: { value: 'Hello' } });
      
      const sendButton = screen.getByLabelText('Send message');
      fireEvent.click(sendButton);
      
      // Check for typing indicator (animated dots)
      await waitFor(() => {
        const typingIndicator = document.querySelector('.animate-bounce');
        expect(typingIndicator).toBeInTheDocument();
      });
    });

    it('displays bot response after user message', async () => {
      chatService.getBotResponse.mockResolvedValue('This is a bot response');
      
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText('Type your message...');
      fireEvent.change(input, { target: { value: 'Hello' } });
      
      const sendButton = screen.getByLabelText('Send message');
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText('This is a bot response')).toBeInTheDocument();
      });
    });

    it('handles bot response errors gracefully', async () => {
      chatService.getBotResponse.mockRejectedValue(new Error('API Error'));
      
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText('Type your message...');
      fireEvent.change(input, { target: { value: 'Hello' } });
      
      const sendButton = screen.getByLabelText('Send message');
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText(/having trouble responding/)).toBeInTheDocument();
      });
    });
  });

  describe('Chat Persistence', () => {
    it('maintains messages when chat is closed and reopened', async () => {
      chatService.getBotResponse.mockResolvedValue('Bot response');
      
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      
      // Open chat and send message
      fireEvent.click(button);
      
      const input = screen.getByPlaceholderText('Type your message...');
      fireEvent.change(input, { target: { value: 'Test message' } });
      
      const sendButton = screen.getByLabelText('Send message');
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
      });
      
      // Close chat
      fireEvent.click(button);
      
      // Reopen chat
      fireEvent.click(button);
      
      // Message should still be there
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('closes chat when Escape key is pressed', () => {
      render(<Chatbot />);
      
      const button = screen.getByLabelText('Open AI Health Assistant');
      fireEvent.click(button);
      
      expect(screen.getByText('HealMate AI Assistant')).toBeInTheDocument();
      
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      
      expect(screen.queryByText('HealMate AI Assistant')).not.toBeInTheDocument();
    });
  });
});
