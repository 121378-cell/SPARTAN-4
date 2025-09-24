"use strict";
/**
 * Real-Time Data Integration Service - "La Sangre de Spartan"
 * Orchestrates real-time data flow between all SPARTAN 4 modules
 *
 * This service handles:
 * - Real-time data synchronization between modules
 * - Cross-modal data sharing
 * - Event-driven data updates
 * - Conflict resolution
 * - Data consistency maintenance
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.realTimeDataIntegrationService = exports.RealTimeDataIntegrationService = void 0;
var logger_1 = require("./logger");
var data_management_service_1 = require("./data-management-service");
var wearable_integration_service_1 = require("./wearable-integration-service");
var recovery_service_1 = require("./recovery-service");
var storage_1 = require("./storage");
var spartan_nervous_system_1 = require("./spartan-nervous-system");
var RealTimeDataIntegrationService = /** @class */ (function () {
    function RealTimeDataIntegrationService() {
        var _this = this;
        this.eventQueue = [];
        this.processingInterval = null;
        this.subscribers = new Map();
        // Start processing events
        this.processingInterval = setInterval(function () {
            _this.processEventQueue();
        }, 1000); // Process events every second
    }
    RealTimeDataIntegrationService.getInstance = function () {
        if (!RealTimeDataIntegrationService.instance) {
            RealTimeDataIntegrationService.instance = new RealTimeDataIntegrationService();
        }
        return RealTimeDataIntegrationService.instance;
    };
    /**
     * Emit a data event to notify all interested modules
     */
    RealTimeDataIntegrationService.prototype.emitEvent = function (event) {
        logger_1.logger.info("RealTimeDataIntegration: Emitting event ".concat(event.type, " from ").concat(event.sourceModule));
        // Add to queue for processing
        this.eventQueue.push(event);
        // Notify immediate subscribers
        var subscribers = this.subscribers.get(event.type) || [];
        subscribers.forEach(function (callback) {
            try {
                callback(event);
            }
            catch (error) {
                logger_1.logger.error("RealTimeDataIntegration: Error in event callback for ".concat(event.type), error);
            }
        });
        // Also notify the Spartan Nervous System
        spartan_nervous_system_1.spartanNervousSystem.emitEvent({
            type: this.mapToNervousSystemEventType(event.type),
            timestamp: event.timestamp,
            userId: event.userId,
            payload: event.payload,
            sourceModule: event.sourceModule,
            priority: event.priority
        });
    };
    /**
     * Map DataEventType to NervousSystemEventType
     */
    RealTimeDataIntegrationService.prototype.mapToNervousSystemEventType = function (dataEventType) {
        switch (dataEventType) {
            case 'user_data_updated':
                return 'data_updated';
            case 'workout_started':
            case 'workout_completed':
                return 'user_action';
            case 'biometric_data_received':
                return 'data_updated';
            case 'nutrition_logged':
                return 'data_updated';
            case 'recovery_metric_updated':
                return 'data_updated';
            case 'progression_adjusted':
                return 'data_updated';
            case 'habit_tracked':
                return 'user_action';
            case 'goal_achieved':
                return 'alert_triggered';
            case 'chat_interaction':
                return 'chat_interaction';
            default:
                return 'data_updated';
        }
    };
    /**
     * Subscribe to specific data events
     */
    RealTimeDataIntegrationService.prototype.subscribe = function (eventType, callback) {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, []);
        }
        this.subscribers.get(eventType).push(callback);
    };
    /**
     * Process the event queue
     */
    RealTimeDataIntegrationService.prototype.processEventQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var event_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.eventQueue.length === 0)
                            return [2 /*return*/];
                        // Sort events by priority and timestamp
                        this.eventQueue.sort(function (a, b) {
                            var priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
                            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                                return priorityOrder[a.priority] - priorityOrder[b.priority];
                            }
                            return a.timestamp.getTime() - b.timestamp.getTime();
                        });
                        _a.label = 1;
                    case 1:
                        if (!(this.eventQueue.length > 0)) return [3 /*break*/, 4];
                        event_1 = this.eventQueue.shift();
                        if (!event_1) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.processEvent(event_1)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Process a single event
     */
    RealTimeDataIntegrationService.prototype.processEvent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 23, , 24]);
                        logger_1.logger.info("RealTimeDataIntegration: Processing event ".concat(event.type, " from ").concat(event.sourceModule));
                        _a = event.type;
                        switch (_a) {
                            case 'user_data_updated': return [3 /*break*/, 1];
                            case 'workout_started': return [3 /*break*/, 3];
                            case 'workout_completed': return [3 /*break*/, 5];
                            case 'biometric_data_received': return [3 /*break*/, 7];
                            case 'nutrition_logged': return [3 /*break*/, 9];
                            case 'recovery_metric_updated': return [3 /*break*/, 11];
                            case 'progression_adjusted': return [3 /*break*/, 13];
                            case 'habit_tracked': return [3 /*break*/, 15];
                            case 'goal_achieved': return [3 /*break*/, 17];
                            case 'chat_interaction': return [3 /*break*/, 19];
                        }
                        return [3 /*break*/, 21];
                    case 1: return [4 /*yield*/, this.handleUserDataUpdated(event)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 22];
                    case 3: return [4 /*yield*/, this.handleWorkoutStarted(event)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 22];
                    case 5: return [4 /*yield*/, this.handleWorkoutCompleted(event)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 22];
                    case 7: return [4 /*yield*/, this.handleBiometricDataReceived(event)];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 22];
                    case 9: return [4 /*yield*/, this.handleNutritionLogged(event)];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 22];
                    case 11: return [4 /*yield*/, this.handleRecoveryMetricUpdated(event)];
                    case 12:
                        _b.sent();
                        return [3 /*break*/, 22];
                    case 13: return [4 /*yield*/, this.handleProgressionAdjusted(event)];
                    case 14:
                        _b.sent();
                        return [3 /*break*/, 22];
                    case 15: return [4 /*yield*/, this.handleHabitTracked(event)];
                    case 16:
                        _b.sent();
                        return [3 /*break*/, 22];
                    case 17: return [4 /*yield*/, this.handleGoalAchieved(event)];
                    case 18:
                        _b.sent();
                        return [3 /*break*/, 22];
                    case 19: return [4 /*yield*/, this.handleChatInteraction(event)];
                    case 20:
                        _b.sent();
                        return [3 /*break*/, 22];
                    case 21:
                        logger_1.logger.warn("RealTimeDataIntegration: Unknown event type ".concat(event.type));
                        _b.label = 22;
                    case 22: return [3 /*break*/, 24];
                    case 23:
                        error_1 = _b.sent();
                        logger_1.logger.error("RealTimeDataIntegration: Error processing event ".concat(event.type), error_1);
                        return [3 /*break*/, 24];
                    case 24: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handle user data updates
     */
    RealTimeDataIntegrationService.prototype.handleUserDataUpdated = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userData = event.payload;
                        // Update storage
                        storage_1.storageManager.setUserData(userData);
                        return [4 /*yield*/, data_management_service_1.dataManagementService.getChatContext()];
                    case 1:
                        context = _a.sent();
                        if (context) {
                            // In a real implementation, we would send this to Chat Maestro
                            // chatMaestroService.notifyUserDataChange(context);
                        }
                        logger_1.logger.info('RealTimeDataIntegration: User data updated successfully');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handle workout start events
     */
    RealTimeDataIntegrationService.prototype.handleWorkoutStarted = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, workoutPlan, session;
            return __generator(this, function (_b) {
                _a = event.payload, workoutPlan = _a.workoutPlan, session = _a.session;
                // Store the session
                storage_1.storageManager.addWorkoutSession(session);
                // Notify other modules
                this.emitEvent({
                    type: 'workout_started',
                    timestamp: new Date(),
                    userId: event.userId,
                    payload: { workoutPlan: workoutPlan, session: session },
                    sourceModule: 'RealTimeDataIntegration',
                    priority: 'high'
                });
                logger_1.logger.info('RealTimeDataIntegration: Workout started successfully');
                return [2 /*return*/];
            });
        });
    };
    /**
     * Handle workout completion events
     */
    RealTimeDataIntegrationService.prototype.handleWorkoutCompleted = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var session, sessions, index, context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        session = event.payload;
                        sessions = storage_1.storageManager.getWorkoutSessions();
                        index = sessions.findIndex(function (s) { return s.id === session.id; });
                        if (index !== -1) {
                            sessions[index] = session;
                            storage_1.storageManager.setWorkoutSessions(sessions);
                        }
                        // Update progress data
                        storage_1.storageManager.addProgressData({
                            workoutId: session.workoutPlanId,
                            date: session.date,
                            notes: session.notes
                        });
                        return [4 /*yield*/, data_management_service_1.dataManagementService.getChatContext()];
                    case 1:
                        context = _a.sent();
                        if (context) {
                            // In a real implementation, we would send this to Chat Maestro
                            // chatMaestroService.notifyWorkoutCompleted(context, session);
                        }
                        logger_1.logger.info('RealTimeDataIntegration: Workout completed successfully');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handle biometric data received from wearables
     */
    RealTimeDataIntegrationService.prototype.handleBiometricDataReceived = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var wearableData, insights, context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wearableData = event.payload;
                        insights = wearable_integration_service_1.wearableIntegrationService.processWearableData(event.userId, wearableData);
                        return [4 /*yield*/, data_management_service_1.dataManagementService.getChatContext()];
                    case 1:
                        context = _a.sent();
                        if (context) {
                            // In a real implementation, we would send this to Chat Maestro
                            // chatMaestroService.notifyBiometricDataReceived(context, insights);
                        }
                        // Trigger real-time modifications if needed
                        if (insights.adjustments.length > 0) {
                            this.emitEvent({
                                type: 'workout_started', // This would trigger modifications
                                timestamp: new Date(),
                                userId: event.userId,
                                payload: { adjustments: insights.adjustments },
                                sourceModule: 'RealTimeDataIntegration',
                                priority: 'high'
                            });
                        }
                        logger_1.logger.info('RealTimeDataIntegration: Biometric data received and processed successfully');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handle nutrition logging events
     */
    RealTimeDataIntegrationService.prototype.handleNutritionLogged = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var nutritionData, context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nutritionData = event.payload;
                        // Store nutrition data
                        storage_1.storageManager.addDailyNutrition(nutritionData);
                        return [4 /*yield*/, data_management_service_1.dataManagementService.getChatContext()];
                    case 1:
                        context = _a.sent();
                        if (context) {
                            // In a real implementation, we would send this to Chat Maestro
                            // chatMaestroService.notifyNutritionLogged(context, nutritionData);
                        }
                        logger_1.logger.info('RealTimeDataIntegration: Nutrition data logged successfully');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handle recovery metric updates
     */
    RealTimeDataIntegrationService.prototype.handleRecoveryMetricUpdated = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var recoveryMetric, analysis, context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recoveryMetric = event.payload;
                        // Store recovery metric
                        storage_1.storageManager.addRecoveryMetric(recoveryMetric);
                        analysis = recovery_service_1.recoveryService.analyzeRecovery(event.userId, recoveryMetric.date);
                        // Store analysis
                        storage_1.storageManager.addRecoveryAnalysis(analysis);
                        return [4 /*yield*/, data_management_service_1.dataManagementService.getChatContext()];
                    case 1:
                        context = _a.sent();
                        if (context) {
                            // In a real implementation, we would send this to Chat Maestro
                            // chatMaestroService.notifyRecoveryUpdated(context, analysis);
                        }
                        logger_1.logger.info('RealTimeDataIntegration: Recovery metric updated successfully');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handle progression adjustments
     */
    RealTimeDataIntegrationService.prototype.handleProgressionAdjusted = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var progressionPlan, context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        progressionPlan = event.payload;
                        return [4 /*yield*/, data_management_service_1.dataManagementService.getChatContext()];
                    case 1:
                        context = _a.sent();
                        if (context) {
                            // In a real implementation, we would send this to Chat Maestro
                            // chatMaestroService.notifyProgressionAdjusted(context, progressionPlan);
                        }
                        logger_1.logger.info('RealTimeDataIntegration: Progression adjusted successfully');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handle habit tracking events
     */
    RealTimeDataIntegrationService.prototype.handleHabitTracked = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var habit, habits, index, context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        habit = event.payload;
                        habits = storage_1.storageManager.getUserHabits();
                        index = habits.findIndex(function (h) { return h.id === habit.id; });
                        if (index !== -1) {
                            habits[index] = habit;
                            storage_1.storageManager.setUserHabits(habits);
                        }
                        return [4 /*yield*/, data_management_service_1.dataManagementService.getChatContext()];
                    case 1:
                        context = _a.sent();
                        if (context) {
                            // In a real implementation, we would send this to Chat Maestro
                            // chatMaestroService.notifyHabitTracked(context, habit);
                        }
                        logger_1.logger.info('RealTimeDataIntegration: Habit tracked successfully');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handle goal achievement events
     */
    RealTimeDataIntegrationService.prototype.handleGoalAchieved = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var goal, context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        goal = event.payload;
                        return [4 /*yield*/, data_management_service_1.dataManagementService.getChatContext()];
                    case 1:
                        context = _a.sent();
                        if (context) {
                            // In a real implementation, we would send this to Chat Maestro
                            // chatMaestroService.notifyGoalAchieved(context, goal);
                        }
                        logger_1.logger.info('RealTimeDataIntegration: Goal achieved successfully');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handle chat interactions
     */
    RealTimeDataIntegrationService.prototype.handleChatInteraction = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var interaction;
            return __generator(this, function (_a) {
                interaction = event.payload;
                // Log chat interaction
                // In a real implementation, we would store this
                // Update user context based on chat interaction
                // In a real implementation, we would update context
                logger_1.logger.info('RealTimeDataIntegration: Chat interaction processed successfully');
                return [2 /*return*/];
            });
        });
    };
    /**
     * Clean up resources
     */
    RealTimeDataIntegrationService.prototype.cleanup = function () {
        if (this.processingInterval) {
            clearInterval(this.processingInterval);
            this.processingInterval = null;
        }
    };
    return RealTimeDataIntegrationService;
}());
exports.RealTimeDataIntegrationService = RealTimeDataIntegrationService;
// Export singleton instance
exports.realTimeDataIntegrationService = RealTimeDataIntegrationService.getInstance();
