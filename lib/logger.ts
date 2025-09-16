// Comprehensive logging and error reporting system
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  stackTrace?: string;
}

export interface ErrorContext {
  userId?: string;
  action?: string;
  component?: string;
  props?: any;
  state?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private sessionId = this.generateSessionId();
  private currentLogLevel = process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG;
  
  constructor() {
    // Capture unhandled errors
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      stackTrace: level >= LogLevel.ERROR ? new Error().stack : undefined,
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    
    // Trim logs if exceeding max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output based on level
    if (entry.level >= this.currentLogLevel) {
      const consoleMethod = this.getConsoleMethod(entry.level);
      consoleMethod(`[${LogLevel[entry.level]}] ${entry.message}`, entry.data || '');
    }

    // Send critical errors immediately
    if (entry.level >= LogLevel.CRITICAL) {
      this.sendToErrorService(entry);
    }
  }

  private getConsoleMethod(level: LogLevel) {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return console.error;
      default:
        return console.log;
    }
  }

  private handleGlobalError(event: ErrorEvent) {
    this.error('Global Error Caught', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.toString(),
    });
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    this.error('Unhandled Promise Rejection', {
      reason: event.reason?.toString(),
      promise: event.promise,
    });
  }

  private async sendToErrorService(entry: LogEntry) {
    // In production, send to your error reporting service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Critical Error Report');
      console.error('Entry:', entry);
      console.error('Recent logs:', this.logs.slice(-10));
      console.groupEnd();
    } else {
      // Example: Send to error reporting service
      try {
        await fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...entry,
            recentLogs: this.logs.slice(-10),
          }),
        });
      } catch (error) {
        console.error('Failed to send error to service:', error);
      }
    }
  }

  // Public logging methods
  debug(message: string, data?: any) {
    this.addLog(this.createLogEntry(LogLevel.DEBUG, message, data));
  }

  info(message: string, data?: any) {
    this.addLog(this.createLogEntry(LogLevel.INFO, message, data));
  }

  warn(message: string, data?: any) {
    this.addLog(this.createLogEntry(LogLevel.WARN, message, data));
  }

  error(message: string, data?: any) {
    this.addLog(this.createLogEntry(LogLevel.ERROR, message, data));
  }

  critical(message: string, data?: any) {
    this.addLog(this.createLogEntry(LogLevel.CRITICAL, message, data));
  }

  // Context-aware error logging
  logError(error: Error, context?: ErrorContext) {
    this.error('Application Error', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  // Performance logging
  logPerformance(operation: string, duration: number, metadata?: any) {
    this.info(`Performance: ${operation}`, {
      duration: `${duration}ms`,
      metadata,
    });
  }

  // User action logging
  logUserAction(action: string, details?: any) {
    this.info(`User Action: ${action}`, details);
  }

  // API call logging
  logAPICall(method: string, url: string, status: number, duration: number, error?: any) {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const entry = this.createLogEntry(level, `API ${method} ${url}`, {
      status,
      duration: `${duration}ms`,
      error: error?.toString(),
    });
    this.addLog(entry);
  }

  // Get logs for debugging
  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Export logs for analysis
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Set user context
  setUser(userId: string) {
    this.logs.forEach(log => {
      if (!log.userId) {
        log.userId = userId;
      }
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// React hook for component-level logging
export function useLogger(componentName: string) {
  return {
    debug: (message: string, data?: any) => logger.debug(message, { ...data, component: componentName }),
    info: (message: string, data?: any) => logger.info(message, { ...data, component: componentName }),
    warn: (message: string, data?: any) => logger.warn(message, { ...data, component: componentName }),
    error: (message: string, data?: any) => logger.error(message, { ...data, component: componentName }),
    critical: (message: string, data?: any) => logger.critical(message, { ...data, component: componentName }),
  };
}

export default Logger;