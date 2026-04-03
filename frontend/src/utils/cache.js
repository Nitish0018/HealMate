/**
 * Simple in-memory cache with expiration
 * Cache expires after 5 minutes by default
 */

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

class Cache {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Set a value in cache with expiration
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} [duration] - Cache duration in milliseconds (default: 5 minutes)
   */
  set(key, value, duration = CACHE_DURATION) {
    const expiresAt = Date.now() + duration;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   * @returns {any|null} Cached value or null if expired/not found
   */
  get(key) {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    // Check if cache has expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return cached.value;
  }

  /**
   * Check if a key exists and is not expired
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Remove a specific key from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Remove all expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, { expiresAt }] of this.cache.entries()) {
      if (now > expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Create singleton instance
const cache = new Cache();

// Run cleanup every minute
setInterval(() => cache.cleanup(), 60 * 1000);

export default cache;
