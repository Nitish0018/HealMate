import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createMessage,
  generateMockResponse,
  handleAPIError,
  getBotResponse
} from './chatService';

describe('chatService', () => {
  describe('createMessage', () => {
    it('should create a message object with correct structure', () => {
      const text = 'Hello, world!';
      const sender = 'user';
      const message = createMessage(text, sender);

      expect(message).toHaveProperty('id');
      expect(message).toHaveProperty('text', text);
      expect(message).toHaveProperty('sender', sender);
      expect(message).toHaveProperty('timestamp');
      expect(message.timestamp).toBeInstanceOf(Date);
    });

    it('should generate unique IDs for different messages', () => {
      const message1 = createMessage('Test 1', 'user');
      const message2 = createMessage('Test 2', 'bot');

      expect(message1.id).not.toBe(message2.id);
    });

    it('should create bot messages correctly', () => {
      const message = createMessage('Bot response', 'bot');
      expect(message.sender).toBe('bot');
    });
  });

  describe('generateMockResponse', () => {
    it('should return response within 500ms', async () => {
      const startTime = Date.now();
      const response = await generateMockResponse('test message');
      const endTime = Date.now();

      expect(response).toBeDefined();
      expect(endTime - startTime).toBeLessThanOrEqual(500);
    });

    it('should return missed dose response for "missed dose" keyword', async () => {
      const response = await generateMockResponse('I missed dose today');
      expect(response).toBe("It seems you missed a dose. Please take it if safe or consult your doctor.");
    });

    it('should return missed dose response for "missed medicine" keyword', async () => {
      const response = await generateMockResponse('I missed medicine this morning');
      expect(response).toBe("It seems you missed a dose. Please take it if safe or consult your doctor.");
    });

    it('should return medication response for "medicine" keyword', async () => {
      const response = await generateMockResponse('Tell me about my medicine');
      expect(response).toBe("Make sure to follow your prescribed schedule for best results.");
    });

    it('should return medication response for "medication" keyword', async () => {
      const response = await generateMockResponse('What medication should I take?');
      expect(response).toBe("Make sure to follow your prescribed schedule for best results.");
    });

    it('should return adherence response for "adherence" keyword', async () => {
      const response = await generateMockResponse('How is my adherence?');
      expect(response).toBe("Your adherence is important for your health. Check your dashboard for detailed insights.");
    });

    it('should return adherence response for "compliance" keyword', async () => {
      const response = await generateMockResponse('Check my compliance rate');
      expect(response).toBe("Your adherence is important for your health. Check your dashboard for detailed insights.");
    });

    it('should return schedule response for "schedule" keyword', async () => {
      const response = await generateMockResponse('What is my schedule?');
      expect(response).toBe("I can help you stay on track with your medication schedule. Check your medication list for timing details.");
    });

    it('should return schedule response for "reminder" keyword', async () => {
      const response = await generateMockResponse('Set a reminder for me');
      expect(response).toBe("I can help you stay on track with your medication schedule. Check your medication list for timing details.");
    });

    it('should return default response for unmatched input', async () => {
      const response = await generateMockResponse('random unrelated query');
      expect(response).toBe("I'm here to help with your medication and health queries.");
    });

    it('should handle empty input gracefully', async () => {
      const response = await generateMockResponse('');
      expect(response).toBe("I'm here to help with your medication and health queries.");
    });

    it('should be case-insensitive for keyword matching', async () => {
      const response = await generateMockResponse('I MISSED DOSE');
      expect(response).toBe("It seems you missed a dose. Please take it if safe or consult your doctor.");
    });

    it('should prioritize "missed dose" over "medicine" keyword', async () => {
      const response = await generateMockResponse('I missed my medicine dose');
      expect(response).toBe("It seems you missed a dose. Please take it if safe or consult your doctor.");
    });
  });

  describe('handleAPIError', () => {
    it('should handle network errors', () => {
      const error = new TypeError('fetch failed');
      const message = handleAPIError(error);

      expect(message).toBe("Connection lost. Please check your internet connection and try again.");
    });

    it('should handle timeout errors', () => {
      const error = new Error('Request timeout');
      const message = handleAPIError(error);

      expect(message).toBe("Request timed out. Please try again.");
    });

    it('should handle AbortError for timeout', () => {
      const error = new Error('AbortError');
      error.name = 'AbortError';
      const message = handleAPIError(error);

      expect(message).toBe("Request timed out. Please try again.");
    });

    it('should handle 401 authentication errors', () => {
      const error = new Error('API error: 401');
      const message = handleAPIError(error);

      expect(message).toBe("Your session has expired. Please log in again.");
    });

    it('should handle 429 rate limiting errors', () => {
      const error = new Error('API error: 429');
      const message = handleAPIError(error);

      expect(message).toBe("Too many requests. Please wait a moment and try again.");
    });

    it('should handle 500 server errors', () => {
      const error = new Error('API error: 500');
      const message = handleAPIError(error);

      expect(message).toBe("Service temporarily unavailable. Please try again later.");
    });

    it('should handle 503 service unavailable errors', () => {
      const error = new Error('API error: 503');
      const message = handleAPIError(error);

      expect(message).toBe("Service temporarily unavailable. Please try again later.");
    });

    it('should handle generic errors', () => {
      const error = new Error('Unknown error');
      const message = handleAPIError(error);

      expect(message).toBe("Something went wrong. Please try again.");
    });
  });

  describe('getBotResponse', () => {
    it('should return mock response successfully', async () => {
      const response = await getBotResponse('What is my schedule?');
      expect(response).toBe("I can help you stay on track with your medication schedule. Check your medication list for timing details.");
    });

    it('should verify error handling structure exists', () => {
      // This test verifies error handling structure exists
      expect(handleAPIError).toBeDefined();
      expect(typeof handleAPIError).toBe('function');
    });
  });
});
