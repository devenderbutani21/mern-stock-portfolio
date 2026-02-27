/**
 * Rate Limiter with Queue System
 * Enforces rate limiting for Finnhub free tier (60 requests/minute)
 * Default: 10 requests/second to stay well within limits
 */

class RateLimiter {
  constructor(requestsPerSecond = 10) {
    this.requestsPerSecond = requestsPerSecond;
    this.queue = [];
    this.processing = false;
    this.lastRequestTime = 0;
    this.interval = 1000 / requestsPerSecond; // ms between requests
  }

  /**
   * Add a request to the queue and wait for execution
   * @param {Function} requestFn - Async function to execute
   * @returns {Promise} - Result of the request function
   */
  async execute(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject });
      this.processQueue();
    });
  }

  /**
   * Process the queue with rate limiting
   */
  async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      const delayNeeded = Math.max(0, this.interval - timeSinceLastRequest);

      if (delayNeeded > 0) {
        await new Promise(resolve => setTimeout(resolve, delayNeeded));
      }

      const { requestFn, resolve, reject } = this.queue.shift();
      this.lastRequestTime = Date.now();

      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    this.processing = false;
  }

  /**
   * Get current queue length
   */
  getQueueLength() {
    return this.queue.length;
  }
}

// Singleton instance for the app
const rateLimiter = new RateLimiter(1); // 1 request per second

export default rateLimiter;
