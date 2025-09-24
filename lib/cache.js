"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheUtils = exports.aiResponseCache = exports.userCache = exports.workoutCache = exports.APICache = void 0;
exports.withCache = withCache;
var APICache = /** @class */ (function () {
    function APICache(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.cache = new Map();
        this.defaultTTL = 5 * 60 * 1000; // 5 minutes
        this.maxSize = 100;
        this.persistToStorage = false;
        this.storageKey = 'spartan4-api-cache';
        this.defaultTTL = options.ttl || this.defaultTTL;
        this.maxSize = options.maxSize || this.maxSize;
        this.persistToStorage = options.persistToStorage || false;
        if (this.persistToStorage) {
            this.loadFromStorage();
        }
        // Cleanup expired entries periodically
        setInterval(function () { return _this.cleanup(); }, 60000); // Every minute
    }
    APICache.prototype.set = function (key, data, ttl) {
        var actualTTL = ttl || this.defaultTTL;
        var timestamp = Date.now();
        var expiresAt = timestamp + actualTTL;
        // If cache is at max size, remove oldest entry
        if (this.cache.size >= this.maxSize) {
            var oldestKey = this.cache.keys().next().value;
            if (oldestKey) {
                this.cache.delete(oldestKey);
            }
        }
        this.cache.set(key, {
            data: data,
            timestamp: timestamp,
            expiresAt: expiresAt,
        });
        if (this.persistToStorage) {
            this.saveToStorage();
        }
    };
    APICache.prototype.get = function (key) {
        var entry = this.cache.get(key);
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
        return entry.data;
    };
    APICache.prototype.has = function (key) {
        var entry = this.cache.get(key);
        if (!entry) {
            return false;
        }
        // Check if expired
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return false;
        }
        return true;
    };
    APICache.prototype.delete = function (key) {
        var deleted = this.cache.delete(key);
        if (deleted && this.persistToStorage) {
            this.saveToStorage();
        }
        return deleted;
    };
    APICache.prototype.clear = function () {
        this.cache.clear();
        if (this.persistToStorage) {
            localStorage.removeItem(this.storageKey);
        }
    };
    APICache.prototype.cleanup = function () {
        var _this = this;
        var now = Date.now();
        var keysToDelete = [];
        for (var _i = 0, _a = this.cache.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], entry = _b[1];
            if (now > entry.expiresAt) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(function (key) { return _this.cache.delete(key); });
        if (keysToDelete.length > 0 && this.persistToStorage) {
            this.saveToStorage();
        }
    };
    APICache.prototype.saveToStorage = function () {
        try {
            var serializable = Array.from(this.cache.entries());
            localStorage.setItem(this.storageKey, JSON.stringify(serializable));
        }
        catch (error) {
            console.warn('Failed to save cache to storage:', error);
        }
    };
    APICache.prototype.loadFromStorage = function () {
        try {
            var stored = localStorage.getItem(this.storageKey);
            if (stored) {
                var entries = JSON.parse(stored);
                this.cache = new Map(entries);
                // Clean up any expired entries
                this.cleanup();
            }
        }
        catch (error) {
            console.warn('Failed to load cache from storage:', error);
        }
    };
    APICache.prototype.getStats = function () {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            defaultTTL: this.defaultTTL,
            persistToStorage: this.persistToStorage,
        };
    };
    return APICache;
}());
exports.APICache = APICache;
// Create cache instances for different types of data
exports.workoutCache = new APICache({
    ttl: 10 * 60 * 1000, // 10 minutes for workout data
    maxSize: 50,
    persistToStorage: true,
});
exports.userCache = new APICache({
    ttl: 30 * 60 * 1000, // 30 minutes for user data
    maxSize: 20,
    persistToStorage: true,
});
exports.aiResponseCache = new APICache({
    ttl: 60 * 60 * 1000, // 1 hour for AI responses
    maxSize: 30,
    persistToStorage: true,
});
// Cached API wrapper function
function withCache(cache, key, apiCall, ttl) {
    // Check cache first
    var cached = cache.get(key);
    if (cached !== null) {
        return Promise.resolve(cached);
    }
    // Make API call and cache result
    return apiCall().then(function (result) {
        cache.set(key, result, ttl);
        return result;
    });
}
// Cache invalidation utilities
exports.cacheUtils = {
    invalidateUser: function (userId) {
        exports.userCache.delete("user-".concat(userId));
        exports.userCache.delete("profile-".concat(userId));
    },
    invalidateWorkouts: function (userId) {
        // Pattern-based deletion for workout-related keys
        for (var _i = 0, _a = exports.workoutCache.cache.entries(); _i < _a.length; _i++) {
            var key = _a[_i][0];
            if (key.startsWith("workouts-".concat(userId)) || key.startsWith("workout-".concat(userId))) {
                exports.workoutCache.delete(key);
            }
        }
    },
    invalidateAll: function () {
        exports.workoutCache.clear();
        exports.userCache.clear();
        exports.aiResponseCache.clear();
    },
};
exports.default = APICache;
