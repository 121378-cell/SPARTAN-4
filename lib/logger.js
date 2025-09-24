"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.LogLevel = void 0;
exports.useLogger = useLogger;
// Comprehensive logging and error reporting system
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["CRITICAL"] = 4] = "CRITICAL";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
var Logger = /** @class */ (function () {
    function Logger() {
        this.logs = [];
        this.maxLogs = 1000;
        this.sessionId = this.generateSessionId();
        this.currentLogLevel = process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG;
        // Capture unhandled errors
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }
    Logger.prototype.generateSessionId = function () {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };
    Logger.prototype.createLogEntry = function (level, message, data) {
        return {
            timestamp: new Date().toISOString(),
            level: level,
            message: message,
            data: data,
            sessionId: this.sessionId,
            url: window.location.href,
            userAgent: navigator.userAgent,
            stackTrace: level >= LogLevel.ERROR ? new Error().stack : undefined,
        };
    };
    Logger.prototype.addLog = function (entry) {
        this.logs.push(entry);
        // Trim logs if exceeding max
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }
        // Console output based on level
        if (entry.level >= this.currentLogLevel) {
            var consoleMethod = this.getConsoleMethod(entry.level);
            consoleMethod("[".concat(LogLevel[entry.level], "] ").concat(entry.message), entry.data || '');
        }
        // Send critical errors immediately
        if (entry.level >= LogLevel.CRITICAL) {
            this.sendToErrorService(entry);
        }
    };
    Logger.prototype.getConsoleMethod = function (level) {
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
    };
    Logger.prototype.handleGlobalError = function (event) {
        var _a;
        this.error('Global Error Caught', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: (_a = event.error) === null || _a === void 0 ? void 0 : _a.toString(),
        });
    };
    Logger.prototype.handleUnhandledRejection = function (event) {
        var _a;
        this.error('Unhandled Promise Rejection', {
            reason: (_a = event.reason) === null || _a === void 0 ? void 0 : _a.toString(),
            promise: event.promise,
        });
    };
    Logger.prototype.sendToErrorService = function (entry) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(process.env.NODE_ENV === 'development')) return [3 /*break*/, 1];
                        console.group('🚨 Critical Error Report');
                        console.error('Entry:', entry);
                        console.error('Recent logs:', this.logs.slice(-10));
                        console.groupEnd();
                        return [3 /*break*/, 4];
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetch('/api/errors', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(__assign(__assign({}, entry), { recentLogs: this.logs.slice(-10) })),
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Failed to send error to service:', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Public logging methods
    Logger.prototype.debug = function (message, data) {
        this.addLog(this.createLogEntry(LogLevel.DEBUG, message, data));
    };
    Logger.prototype.info = function (message, data) {
        this.addLog(this.createLogEntry(LogLevel.INFO, message, data));
    };
    Logger.prototype.warn = function (message, data) {
        this.addLog(this.createLogEntry(LogLevel.WARN, message, data));
    };
    Logger.prototype.error = function (message, data) {
        this.addLog(this.createLogEntry(LogLevel.ERROR, message, data));
    };
    Logger.prototype.critical = function (message, data) {
        this.addLog(this.createLogEntry(LogLevel.CRITICAL, message, data));
    };
    // Context-aware error logging
    Logger.prototype.logError = function (error, context) {
        this.error('Application Error', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            context: context,
        });
    };
    // Performance logging
    Logger.prototype.logPerformance = function (operation, duration, metadata) {
        this.info("Performance: ".concat(operation), {
            duration: "".concat(duration, "ms"),
            metadata: metadata,
        });
    };
    // User action logging
    Logger.prototype.logUserAction = function (action, details) {
        this.info("User Action: ".concat(action), details);
    };
    // API call logging
    Logger.prototype.logAPICall = function (method, url, status, duration, error) {
        var level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
        var entry = this.createLogEntry(level, "API ".concat(method, " ").concat(url), {
            status: status,
            duration: "".concat(duration, "ms"),
            error: error === null || error === void 0 ? void 0 : error.toString(),
        });
        this.addLog(entry);
    };
    // Get logs for debugging
    Logger.prototype.getLogs = function (level) {
        if (level !== undefined) {
            return this.logs.filter(function (log) { return log.level >= level; });
        }
        return __spreadArray([], this.logs, true);
    };
    // Clear logs
    Logger.prototype.clearLogs = function () {
        this.logs = [];
    };
    // Export logs for analysis
    Logger.prototype.exportLogs = function () {
        return JSON.stringify(this.logs, null, 2);
    };
    // Set user context
    Logger.prototype.setUser = function (userId) {
        this.logs.forEach(function (log) {
            if (!log.userId) {
                log.userId = userId;
            }
        });
    };
    return Logger;
}());
// Export singleton instance
exports.logger = new Logger();
// React hook for component-level logging
function useLogger(componentName) {
    return {
        debug: function (message, data) { return exports.logger.debug(message, __assign(__assign({}, data), { component: componentName })); },
        info: function (message, data) { return exports.logger.info(message, __assign(__assign({}, data), { component: componentName })); },
        warn: function (message, data) { return exports.logger.warn(message, __assign(__assign({}, data), { component: componentName })); },
        error: function (message, data) { return exports.logger.error(message, __assign(__assign({}, data), { component: componentName })); },
        critical: function (message, data) { return exports.logger.critical(message, __assign(__assign({}, data), { component: componentName })); },
    };
}
exports.default = Logger;
