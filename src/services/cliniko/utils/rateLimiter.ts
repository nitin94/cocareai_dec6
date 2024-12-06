interface RateLimiterConfig {
  maxRequests: number;
  timeWindow: number; // in milliseconds
}

export class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(config: RateLimiterConfig) {
    this.maxRequests = config.maxRequests;
    this.timeWindow = config.timeWindow;
  }

  async canMakeRequest(): Promise<boolean> {
    const now = Date.now();
    this.requests = this.requests.filter(timestamp => 
      now - timestamp < this.timeWindow
    );

    if (this.requests.length >= this.maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }

  async waitForAvailability(): Promise<void> {
    while (!(await this.canMakeRequest())) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}