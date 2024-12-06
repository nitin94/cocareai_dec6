class ClinikoLogger {
  private readonly prefix = '[Cliniko]';

  private formatMessage(message: string): string {
    return `${this.prefix} ${message}`;
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage(message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    console.info(this.formatMessage(message), ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(this.formatMessage(message), ...args);
  }

  error(message: string, error?: unknown): void {
    console.error(this.formatMessage(message), error);
  }

  group(label: string, fn: () => void): void {
    if (process.env.NODE_ENV !== 'production') {
      console.group(this.formatMessage(label));
      fn();
      console.groupEnd();
    }
  }
}

export const logger = new ClinikoLogger();