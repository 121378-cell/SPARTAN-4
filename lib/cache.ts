// API caching utilities for improved performance
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  persistToStorage?: boolean; // Persist to localStorage
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes
  private maxSize = 100;
  private persistToStorage = false;
  private storageKey = 'spartan4-api-cache';

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl || this.defaultTTL;
    this.maxSize = options.maxSize || this.maxSize;
    this.persistToStorage = options.persistToStorage || false;

    if (this.persistToStorage) {
      this.loadFromStorage();
    }

    // Cleanup expired entries periodically
    setInterval(() => this.cleanup(), 60000); // Every minute
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const actualTTL = ttl || this.defaultTTL;
    const timestamp = Date.now();
    const expiresAt = timestamp + actualTTL;

    // If cache is at max size, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp,
      expiresAt,
    });

    if (this.persistToStorage) {
      this.saveToStorage();
    }
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      if (this.persistToStorage) {
        this.saveToStorage();
      }
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    
    if (deleted && this.persistToStorage) {
      this.saveToStorage();
    }
    
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    
    if (this.persistToStorage) {
      localStorage.removeItem(this.storageKey);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));

    if (keysToDelete.length > 0 && this.persistToStorage) {
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    try {
      const serializable = Array.from(this.cache.entries());
      localStorage.setItem(this.storageKey, JSON.stringify(serializable));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const entries = JSON.parse(stored);
        this.cache = new Map(entries);
        
        // Clean up any expired entries
        this.cleanup();
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      defaultTTL: this.defaultTTL,
      persistToStorage: this.persistToStorage,
    };
  }
}

// Create cache instances for different types of data
export const workoutCache = new APICache({
  ttl: 10 * 60 * 1000, // 10 minutes for workout data
  maxSize: 50,
  persistToStorage: true,
});

export const userCache = new APICache({
  ttl: 30 * 60 * 1000, // 30 minutes for user data
  maxSize: 20,
  persistToStorage: true,
});

export const aiResponseCache = new APICache({
  ttl: 60 * 60 * 1000, // 1 hour for AI responses
  maxSize: 30,
  persistToStorage: true,
});

// Cached API wrapper function
export function withCache<T>(
  cache: APICache,
  key: string,
  apiCall: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Check cache first
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return Promise.resolve(cached);
  }

  // Make API call and cache result
  return apiCall().then(result => {
    cache.set(key, result, ttl);
    return result;
  });
}

// Cache invalidation utilities
export const cacheUtils = {
  invalidateUser: (userId: string) => {
    userCache.delete(`user-${userId}`);
    userCache.delete(`profile-${userId}`);
  },
  
  invalidateWorkouts: (userId: string) => {
    // Pattern-based deletion for workout-related keys
    for (const [key] of (workoutCache as any).cache.entries()) {
      if (key.startsWith(`workouts-${userId}`) || key.startsWith(`workout-${userId}`)) {
        workoutCache.delete(key);
      }
    }
  },
  
  invalidateAll: () => {
    workoutCache.clear();
    userCache.clear();
    aiResponseCache.clear();
  },
};

export default APICache;