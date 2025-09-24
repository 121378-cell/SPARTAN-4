"use strict";
/**
 * Spartan Nervous System - "Sistema Nervioso de Spartan"
 * Central nervous system for the SPARTAN 4 ecosystem that connects
 * Chat Maestro, modals, and data management for real-time communication
 * and coordination.
 *
 * This service handles:
 * - Bidirectional communication between all modules
 * - Instant data integration and propagation
 * - Contextual processing and decision making
 * - Intelligent alerts and notifications
 * - Coordinated event flow
 * - Data redundancy and consistency
 * - Latency optimization
 * - Proactive system behavior
 * - Modular scalability
 * - Continuous learning
 */
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
exports.spartanNervousSystem = exports.SpartanNervousSystem = void 0;
var logger_1 = require("./logger");
var data_management_service_1 = require("./data-management-service");
var real_time_data_integration_1 = require("./real-time-data-integration");
var spartan_modal_service_1 = require("./spartan-modal-service");
var SpartanNervousSystem = /** @class */ (function () {
    function SpartanNervousSystem() {
        var _this = this;
        this.eventQueue = [];
        this.processingInterval = null;
        this.subscribers = new Map();
        this.alerts = [];
        this.recommendations = [];
        this.proactiveActions = [];
        this.learningMemory = new Map();
        this.modalService = new spartan_modal_service_1.SpartanModalService();
        // Start processing events
        this.processingInterval = setInterval(function () {
            _this.processEventQueue();
        }, 500); // Process events every 500ms for real-time responsiveness
        // Subscribe to real-time data integration events
        this.subscribeToDataEvents();
        // Start proactive system monitoring
        setInterval(function () {
            _this.monitorAndActProactively();
        }, 10000); // Check for proactive actions every 10 seconds
        // Subscribe to system audit events from Continuous Ecosystem Optimization Service
        this.subscribe('system_audit_completed', function (event) {
            _this.handleSystemAuditCompleted(event);
        });
        // Initialize Continuous Ecosystem Optimization Service after a delay
        // to avoid circular dependency issues
        setTimeout(function () {
            Promise.resolve().then(function () { return require('./continuous-ecosystem-optimization-service'); }).then(function (_a) {
                var continuousEcosystemOptimizationService = _a.continuousEcosystemOptimizationService;
                continuousEcosystemOptimizationService.initialize({
                    auditInterval: 30000, // 30 seconds
                    autoApplyOptimizations: true,
                    performanceThreshold: 0.7,
                    enableDetailedLogging: false
                });
            }).catch(function (error) {
                logger_1.logger.error('Error initializing Continuous Ecosystem Optimization Service', error);
            });
        }, 0);
    }
    SpartanNervousSystem.getInstance = function () {
        if (!SpartanNervousSystem.instance) {
            SpartanNervousSystem.instance = new SpartanNervousSystem();
        }
        return SpartanNervousSystem.instance;
    };
    /**
     * Subscribe to real-time data integration events
     */
    SpartanNervousSystem.prototype.subscribeToDataEvents = function () {
        var _this = this;
        // Subscribe to all data events from the real-time integration service
        real_time_data_integration_1.realTimeDataIntegrationService.subscribe('user_data_updated', function (event) {
            _this.handleDataEvent(event);
        });
        real_time_data_integration_1.realTimeDataIntegrationService.subscribe('workout_started', function (event) {
            _this.handleDataEvent(event);
        });
        real_time_data_integration_1.realTimeDataIntegrationService.subscribe('workout_completed', function (event) {
            _this.handleDataEvent(event);
        });
        real_time_data_integration_1.realTimeDataIntegrationService.subscribe('biometric_data_received', function (event) {
            _this.handleDataEvent(event);
        });
        real_time_data_integration_1.realTimeDataIntegrationService.subscribe('nutrition_logged', function (event) {
            _this.handleDataEvent(event);
        });
        real_time_data_integration_1.realTimeDataIntegrationService.subscribe('recovery_metric_updated', function (event) {
            _this.handleDataEvent(event);
        });
        real_time_data_integration_1.realTimeDataIntegrationService.subscribe('progression_adjusted', function (event) {
            _this.handleDataEvent(event);
        });
        real_time_data_integration_1.realTimeDataIntegrationService.subscribe('habit_tracked', function (event) {
            _this.handleDataEvent(event);
        });
        real_time_data_integration_1.realTimeDataIntegrationService.subscribe('goal_achieved', function (event) {
            _this.handleDataEvent(event);
        });
        real_time_data_integration_1.realTimeDataIntegrationService.subscribe('chat_interaction', function (event) {
            _this.handleDataEvent(event);
        });
    };
    /**
     * Handle data events from real-time integration service
     */
    SpartanNervousSystem.prototype.handleDataEvent = function (event) {
        // Convert DataEvent to NervousSystemEvent
        var nervousEvent = {
            type: this.mapDataEventType(event.type),
            timestamp: event.timestamp,
            userId: event.userId,
            payload: event.payload,
            sourceModule: event.sourceModule,
            priority: event.priority,
            correlationId: this.generateCorrelationId()
        };
        // Add to queue for processing
        this.eventQueue.push(nervousEvent);
        // Notify subscribers immediately for critical events
        if (event.priority === 'critical') {
            this.notifySubscribers(nervousEvent);
        }
    };
    /**
     * Map DataEventType to NervousSystemEventType
     */
    SpartanNervousSystem.prototype.mapDataEventType = function (dataEventType) {
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
     * Generate a correlation ID for event tracking
     */
    SpartanNervousSystem.prototype.generateCorrelationId = function () {
        return 'corr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };
    /**
     * Emit a nervous system event to notify all interested modules
     */
    SpartanNervousSystem.prototype.emitEvent = function (event) {
        logger_1.logger.info("SpartanNervousSystem: Emitting event ".concat(event.type, " from ").concat(event.sourceModule));
        // Add to queue for processing
        this.eventQueue.push(event);
        // Notify immediate subscribers for high priority events
        if (event.priority === 'high' || event.priority === 'critical') {
            this.notifySubscribers(event);
        }
    };
    /**
     * Subscribe to specific nervous system events
     */
    SpartanNervousSystem.prototype.subscribe = function (eventType, callback) {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, []);
        }
        this.subscribers.get(eventType).push(callback);
    };
    /**
     * Notify subscribers of an event
     */
    SpartanNervousSystem.prototype.notifySubscribers = function (event) {
        var subscribers = this.subscribers.get(event.type) || [];
        subscribers.forEach(function (callback) {
            try {
                callback(event);
            }
            catch (error) {
                logger_1.logger.error("SpartanNervousSystem: Error in event callback for ".concat(event.type), error);
            }
        });
    };
    /**
     * Process the event queue
     */
    SpartanNervousSystem.prototype.processEventQueue = function () {
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
    SpartanNervousSystem.prototype.processEvent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 29, , 30]);
                        logger_1.logger.info("SpartanNervousSystem: Processing event ".concat(event.type, " from ").concat(event.sourceModule));
                        // Notify subscribers before processing
                        this.notifySubscribers(event);
                        _a = event.type;
                        switch (_a) {
                            case 'data_updated': return [3 /*break*/, 1];
                            case 'chat_interaction': return [3 /*break*/, 3];
                            case 'modal_activated': return [3 /*break*/, 5];
                            case 'modal_deactivated': return [3 /*break*/, 7];
                            case 'insight_generated': return [3 /*break*/, 9];
                            case 'alert_triggered': return [3 /*break*/, 11];
                            case 'recommendation_made': return [3 /*break*/, 13];
                            case 'user_action': return [3 /*break*/, 15];
                            case 'system_proactive': return [3 /*break*/, 17];
                            case 'learning_update': return [3 /*break*/, 19];
                            case 'neural_data_received': return [3 /*break*/, 21];
                            case 'mental_state_changed': return [3 /*break*/, 23];
                            case 'neural_feedback_received': return [3 /*break*/, 25];
                        }
                        return [3 /*break*/, 27];
                    case 1: return [4 /*yield*/, this.handleDataUpdated(event)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 28];
                    case 3: return [4 /*yield*/, this.handleChatInteraction(event)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 28];
                    case 5: return [4 /*yield*/, this.handleModalActivated(event)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 28];
                    case 7: return [4 /*yield*/, this.handleModalDeactivated(event)];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 28];
                    case 9: return [4 /*yield*/, this.handleInsightGenerated(event)];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 28];
                    case 11: return [4 /*yield*/, this.handleAlertTriggered(event)];
                    case 12:
                        _b.sent();
                        return [3 /*break*/, 28];
                    case 13: return [4 /*yield*/, this.handleRecommendationMade(event)];
                    case 14:
                        _b.sent();
                        return [3 /*break*/, 28];
                    case 15: return [4 /*yield*/, this.handleUserAction(event)];
                    case 16:
                        _b.sent();
                        return [3 /*break*/, 28];
                    case 17: return [4 /*yield*/, this.handleSystemProactive(event)];
                    case 18:
                        _b.sent();
                        return [3 /*break*/, 28];
                    case 19: return [4 /*yield*/, this.handleLearningUpdate(event)];
                    case 20:
                        _b.sent();
                        return [3 /*break*/, 28];
                    case 21: return [4 /*yield*/, this.handleNeuralDataReceived(event)];
                    case 22:
                        _b.sent();
                        return [3 /*break*/, 28];
                    case 23: return [4 /*yield*/, this.handleMentalStateChanged(event)];
                    case 24:
                        _b.sent();
                        return [3 /*break*/, 28];
                    case 25: return [4 /*yield*/, this.handleNeuralFeedbackReceived(event)];
                    case 26:
                        _b.sent();
                        return [3 /*break*/, 28];
                    case 27:
                        logger_1.logger.warn("SpartanNervousSystem: Unknown event type ".concat(event.type));
                        _b.label = 28;
                    case 28: return [3 /*break*/, 30];
                    case 29:
                        error_1 = _b.sent();
                        logger_1.logger.error("SpartanNervousSystem: Error processing event ".concat(event.type), error_1);
                        return [3 /*break*/, 30];
                    case 30: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handle data updated events
     */
    SpartanNervousSystem.prototype.handleDataUpdated = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var insights;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, data_management_service_1.dataManagementService.generateInsights()];
                    case 1:
                        insights = _a.sent();
                        if (insights) {
                            // Emit insight generated event
                            this.emitEvent({
                                type: 'insight_generated',
                                timestamp: new Date(),
                                userId: event.userId,
                                payload: insights,
                                sourceModule: 'SpartanNervousSystem',
                                priority: 'medium',
                                correlationId: event.correlationId
                            });
                            // Check for alerts based on insights
                            this.checkForAlerts(insights, event.userId);
                            // Generate recommendations based on insights
                            this.generateRecommendationsFromInsights(insights, event.userId);
                        }
                        logger_1.logger.info('SpartanNervousSystem: Data updated successfully');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handle chat interaction events
     */
    SpartanNervousSystem.prototype.handleChatInteraction = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, data_management_service_1.dataManagementService.getChatContext()];
                    case 1:
                        context = _a.sent();
                        if (context) {
                            // Process chat interaction for insights
                            // This would typically involve analyzing the conversation for patterns
                            // For now, we'll just log the interaction
                            logger_1.logger.info('SpartanNervousSystem: Chat interaction processed');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Handle modal activated events
     */
    SpartanNervousSystem.prototype.handleModalActivated = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Log modal activation
                logger_1.logger.info("SpartanNervousSystem: Modal ".concat(event.payload.modalId, " activated"));
                // Update learning memory with modal usage patterns
                this.updateLearningMemory('modal_activation', {
                    modalId: event.payload.modalId,
                    timestamp: event.timestamp,
                    userId: event.userId
                });
                return [2 /*return*/];
            });
        });
    };
    /**
     * Handle modal deactivated events
     */
    SpartanNervousSystem.prototype.handleModalDeactivated = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Log modal deactivation
                logger_1.logger.info("SpartanNervousSystem: Modal ".concat(event.payload.modalId, " deactivated"));
                return [2 /*return*/];
            });
        });
    };
    /**
     * Handle insight generated events
     */
    SpartanNervousSystem.prototype.handleInsightGenerated = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var insights;
            return __generator(this, function (_a) {
                insights = event.payload;
                // Process insights for actionable items
                logger_1.logger.info('SpartanNervousSystem: Insights generated and processed');
                return [2 /*return*/];
            });
        });
    };
    /**
     * Handle alert triggered events
     */
    SpartanNervousSystem.prototype.handleAlertTriggered = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            return __generator(this, function (_a) {
                alert = event.payload;
                this.alerts.push(alert);
                // Notify relevant modules
                logger_1.logger.info("SpartanNervousSystem: Alert triggered - ".concat(alert.title));
                return [2 /*return*/];
            });
        });
    };
    /**
     * Handle recommendation made events
     */
    SpartanNervousSystem.prototype.handleRecommendationMade = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var recommendation;
            return __generator(this, function (_a) {
                recommendation = event.payload;
                this.recommendations.push(recommendation);
                // Notify relevant modules
                logger_1.logger.info("SpartanNervousSystem: Recommendation made - ".concat(recommendation.title));
                return [2 /*return*/];
            });
        });
    };
    /**
     * Handle user action events
     */
    SpartanNervousSystem.prototype.handleUserAction = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Log user action for learning
                this.updateLearningMemory('user_action', {
                    actionType: event.payload.actionType,
                    timestamp: event.timestamp,
                    userId: event.userId
                });
                logger_1.logger.info("SpartanNervousSystem: User action processed - ".concat(event.payload.actionType));
                return [2 /*return*/];
            });
        });
    };
    /**
     * Handle system proactive events
     */
    SpartanNervousSystem.prototype.handleSystemProactive = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Process proactive system action
                logger_1.logger.info("SpartanNervousSystem: Proactive system action processed - ".concat(event.payload.action));
                return [2 /*return*/];
            });
        });
    };
    /**
     * Handle learning update events
     */
    SpartanNervousSystem.prototype.handleLearningUpdate = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var learningData;
            return __generator(this, function (_a) {
                learningData = event.payload;
                this.learningMemory.set(learningData.key, learningData.value);
                logger_1.logger.info("SpartanNervousSystem: Learning update processed - ".concat(learningData.key));
                return [2 /*return*/];
            });
        });
    };
    /**
     * Handle neural data received events
     */
    SpartanNervousSystem.prototype.handleNeuralDataReceived = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var neuralData;
            return __generator(this, function (_a) {
                neuralData = event.payload;
                // Generate insights from neural data
                // This would typically involve more complex analysis
                logger_1.logger.info('SpartanNervousSystem: Neural data received and processed');
                // Check for alerts based on neural data
                this.checkForNeuralAlerts(neuralData, event.userId);
                // Generate recommendations based on neural data
                this.generateRecommendationsFromNeuralData(neuralData, event.userId);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Handle mental state changed events
     */
    SpartanNervousSystem.prototype.handleMentalStateChanged = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var mentalStateData;
            return __generator(this, function (_a) {
                mentalStateData = event.payload.data;
                // Log mental state change
                logger_1.logger.info("SpartanNervousSystem: Mental state changed to ".concat(mentalStateData.state));
                // Generate recommendations based on mental state
                this.generateRecommendationsFromMentalState(mentalStateData, event.userId);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Handle neural feedback received events
     */
    SpartanNervousSystem.prototype.handleNeuralFeedbackReceived = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var feedbackData;
            return __generator(this, function (_a) {
                feedbackData = event.payload.data;
                // Log neural feedback
                logger_1.logger.info("SpartanNervousSystem: Neural feedback received - ".concat(feedbackData.type, ": ").concat(feedbackData.value));
                // Generate recommendations based on neural feedback
                this.generateRecommendationsFromNeuralData(event.payload, event.userId);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Update learning memory with new data
     */
    SpartanNervousSystem.prototype.updateLearningMemory = function (key, value) {
        this.learningMemory.set(key, __assign(__assign({}, value), { lastUpdated: new Date() }));
    };
    /**
     * Check for alerts based on data insights
     */
    SpartanNervousSystem.prototype.checkForAlerts = function (insights, userId) {
        var _this = this;
        var alerts = [];
        // Check for recovery status alerts
        if (insights.currentStatus.recoveryStatus === 'critical') {
            alerts.push({
                id: "alert_".concat(Date.now(), "_recovery"),
                type: 'danger',
                title: 'Estado de Recuperación Crítico',
                message: 'Tu estado de recuperación es crítico. Se recomienda descansar y consultar con un profesional.',
                priority: 'critical',
                timestamp: new Date(),
                actions: ['Descansar', 'Ver recomendaciones'],
                dismissible: true,
                autoDismiss: 30
            });
        }
        else if (insights.currentStatus.recoveryStatus === 'poor') {
            alerts.push({
                id: "alert_".concat(Date.now(), "_recovery"),
                type: 'warning',
                title: 'Estado de Recuperación Bajo',
                message: 'Tu estado de recuperación es bajo. Considera reducir la intensidad del entrenamiento.',
                priority: 'high',
                timestamp: new Date(),
                actions: ['Reducir intensidad', 'Ver recomendaciones'],
                dismissible: true
            });
        }
        // Check for energy level alerts
        if (insights.currentStatus.energyLevel === 'veryLow') {
            alerts.push({
                id: "alert_".concat(Date.now(), "_energy"),
                type: 'danger',
                title: 'Nivel de Energía Muy Bajo',
                message: 'Tu nivel de energía es muy bajo. Prioriza el descanso y la nutrición adecuada.',
                priority: 'high',
                timestamp: new Date(),
                actions: ['Descansar', 'Ver recomendaciones nutricionales'],
                dismissible: true
            });
        }
        // Check for training readiness alerts
        if (insights.currentStatus.trainingReadiness === 'rest') {
            alerts.push({
                id: "alert_".concat(Date.now(), "_training"),
                type: 'warning',
                title: 'No Listo para Entrenar',
                message: 'Según los datos, no estás listo para entrenar en este momento. Considera un día de descanso.',
                priority: 'high',
                timestamp: new Date(),
                actions: ['Descansar', 'Ver alternativas'],
                dismissible: true
            });
        }
        // Emit alert events for each alert
        alerts.forEach(function (alert) {
            _this.alerts.push(alert);
            _this.emitEvent({
                type: 'alert_triggered',
                timestamp: new Date(),
                userId: userId,
                payload: alert,
                sourceModule: 'SpartanNervousSystem',
                priority: alert.priority
            });
        });
    };
    /**
     * Check for alerts based on neural data
     */
    SpartanNervousSystem.prototype.checkForNeuralAlerts = function (neuralData, userId) {
        var _this = this;
        var alerts = [];
        // Check for high stress levels from neural feedback
        if (neuralData.neuralFeedback && neuralData.neuralFeedback.type === 'stress_response' && neuralData.neuralFeedback.value < 30) {
            alerts.push({
                id: "alert_".concat(Date.now(), "_neural_stress"),
                type: 'warning',
                title: 'Estrés Elevado Detectado',
                message: 'Los sensores neuronales detectan niveles elevados de estrés. Considera técnicas de relajación.',
                priority: 'high',
                timestamp: new Date(),
                actions: ['Técnicas de relajación', 'Descansar'],
                dismissible: true
            });
        }
        // Check for fatigue from neural feedback
        if (neuralData.neuralFeedback && neuralData.neuralFeedback.type === 'fatigue_index' && neuralData.neuralFeedback.value > 70) {
            alerts.push({
                id: "alert_".concat(Date.now(), "_neural_fatigue"),
                type: 'warning',
                title: 'Fatiga Neuromuscular Detectada',
                message: 'Se detecta fatiga neuromuscular elevada. Considera reducir la intensidad del entrenamiento.',
                priority: 'high',
                timestamp: new Date(),
                actions: ['Reducir intensidad', 'Descansar'],
                dismissible: true
            });
        }
        // Emit alert events for each alert
        alerts.forEach(function (alert) {
            _this.alerts.push(alert);
            _this.emitEvent({
                type: 'alert_triggered',
                timestamp: new Date(),
                userId: userId,
                payload: alert,
                sourceModule: 'SpartanNervousSystem',
                priority: alert.priority
            });
        });
    };
    /**
     * Generate recommendations from data insights
     */
    SpartanNervousSystem.prototype.generateRecommendationsFromInsights = function (insights, userId) {
        var _this = this;
        var recommendations = [];
        // Add recommendations based on insights
        insights.recommendations.forEach(function (rec, index) {
            recommendations.push({
                id: "rec_".concat(Date.now(), "_").concat(index),
                type: 'training',
                title: 'Recomendación Personalizada',
                description: rec,
                priority: 'medium',
                timestamp: new Date(),
                confidence: 0.8,
                actionable: true
            });
        });
        // Add specific recommendations based on trends
        if (insights.trends.performance === 'declining') {
            recommendations.push({
                id: "rec_".concat(Date.now(), "_performance"),
                type: 'training',
                title: 'Rendimiento en Descenso',
                description: 'Tu rendimiento ha estado en descenso. Considera revisar tu plan de entrenamiento y recuperación.',
                priority: 'high',
                timestamp: new Date(),
                confidence: 0.9,
                actionable: true
            });
        }
        if (insights.trends.adherence === 'poor') {
            recommendations.push({
                id: "rec_".concat(Date.now(), "_adherence"),
                type: 'habit',
                title: 'Baja Adherencia',
                description: 'Tu adherencia al plan ha sido baja. Establece recordatorios y metas pequeñas para mejorar.',
                priority: 'high',
                timestamp: new Date(),
                confidence: 0.85,
                actionable: true
            });
        }
        // Emit recommendation events for each recommendation
        recommendations.forEach(function (rec) {
            _this.recommendations.push(rec);
            _this.emitEvent({
                type: 'recommendation_made',
                timestamp: new Date(),
                userId: userId,
                payload: rec,
                sourceModule: 'SpartanNervousSystem',
                priority: rec.priority
            });
        });
    };
    /**
     * Generate recommendations from neural data
     */
    SpartanNervousSystem.prototype.generateRecommendationsFromNeuralData = function (neuralData, userId) {
        var _this = this;
        var recommendations = [];
        // Add recommendations based on neural feedback
        if (neuralData.neuralFeedback && neuralData.neuralFeedback.recommendations) {
            neuralData.neuralFeedback.recommendations.forEach(function (rec, index) {
                recommendations.push({
                    id: "neural_rec_".concat(Date.now(), "_").concat(index),
                    type: 'neural_feedback',
                    title: 'Recomendación Basada en Señales Neurales',
                    description: rec,
                    priority: 'medium',
                    timestamp: new Date(),
                    confidence: 0.85,
                    actionable: true
                });
            });
        }
        // Emit recommendation events for each recommendation
        recommendations.forEach(function (rec) {
            _this.recommendations.push(rec);
            _this.emitEvent({
                type: 'recommendation_made',
                timestamp: new Date(),
                userId: userId,
                payload: rec,
                sourceModule: 'SpartanNervousSystem',
                priority: rec.priority
            });
        });
    };
    /**
     * Generate recommendations from mental state
     */
    SpartanNervousSystem.prototype.generateRecommendationsFromMentalState = function (mentalStateData, userId) {
        var _this = this;
        var recommendations = [];
        // Add recommendations based on mental state
        switch (mentalStateData.state) {
            case 'stressed':
                recommendations.push({
                    id: "mental_rec_".concat(Date.now(), "_stress"),
                    type: 'recovery',
                    title: 'Manejo del Estrés',
                    description: 'Se detecta estado de estrés elevado. Considera técnicas de relajación como respiración profunda o meditación.',
                    priority: 'high',
                    timestamp: new Date(),
                    confidence: 0.9,
                    actionable: true
                });
                break;
            case 'fatigued':
                recommendations.push({
                    id: "mental_rec_".concat(Date.now(), "_fatigue"),
                    type: 'recovery',
                    title: 'Manejo de Fatiga',
                    description: 'Se detecta fatiga mental. Considera tomar un descanso o realizar una actividad de baja intensidad.',
                    priority: 'high',
                    timestamp: new Date(),
                    confidence: 0.85,
                    actionable: true
                });
                break;
            case 'focused':
                recommendations.push({
                    id: "mental_rec_".concat(Date.now(), "_focus"),
                    type: 'training',
                    title: 'Aprovecha tu Enfoque',
                    description: 'Se detecta un estado de enfoque óptimo. Este es un buen momento para realizar tareas cognitivamente demandantes.',
                    priority: 'medium',
                    timestamp: new Date(),
                    confidence: 0.9,
                    actionable: true
                });
                break;
            case 'relaxed':
                recommendations.push({
                    id: "mental_rec_".concat(Date.now(), "_relax"),
                    type: 'recovery',
                    title: 'Estado Relajado',
                    description: 'Se detecta un estado relajado. Este es un buen momento para la recuperación activa o estiramientos.',
                    priority: 'medium',
                    timestamp: new Date(),
                    confidence: 0.8,
                    actionable: true
                });
                break;
        }
        // Emit recommendation events for each recommendation
        recommendations.forEach(function (rec) {
            _this.recommendations.push(rec);
            _this.emitEvent({
                type: 'recommendation_made',
                timestamp: new Date(),
                userId: userId,
                payload: rec,
                sourceModule: 'SpartanNervousSystem',
                priority: rec.priority
            });
        });
    };
    /**
     * Determine if a modal should be activated proactively
     */
    SpartanNervousSystem.prototype.shouldActivateModalProactively = function (insights) {
        // Check if user needs recovery guidance
        if (insights.currentStatus.recoveryStatus === 'poor' ||
            insights.currentStatus.recoveryStatus === 'critical') {
            return true;
        }
        // Check if user has declining performance
        if (insights.trends.performance === 'declining') {
            return true;
        }
        // Check if user has low adherence
        if (insights.trends.adherence === 'poor') {
            return true;
        }
        return false;
    };
    /**
     * Monitor system and act proactively
     */
    SpartanNervousSystem.prototype.monitorAndActProactively = function () {
        return __awaiter(this, void 0, void 0, function () {
            var insights, shouldActivateModal, action, shouldSendChatMessage, action, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, data_management_service_1.dataManagementService.generateInsights()];
                    case 1:
                        insights = _a.sent();
                        if (insights) {
                            shouldActivateModal = this.shouldActivateModalProactively(insights);
                            if (shouldActivateModal) {
                                action = {
                                    id: "proactive_".concat(Date.now(), "_modal"),
                                    type: 'modal_activation',
                                    title: 'Activación Proactiva de Modal',
                                    description: 'El sistema ha detectado que sería beneficioso activar un modal específico.',
                                    priority: 'medium',
                                    timestamp: new Date(),
                                    executionTime: new Date(Date.now() + 5000), // Execute in 5 seconds
                                    executed: false
                                };
                                this.proactiveActions.push(action);
                                // Emit proactive event
                                this.emitEvent({
                                    type: 'system_proactive',
                                    timestamp: new Date(),
                                    userId: '', // Would be populated in real implementation
                                    payload: action,
                                    sourceModule: 'SpartanNervousSystem',
                                    priority: 'medium'
                                });
                            }
                            shouldSendChatMessage = this.shouldSendChatMessageProactively(insights);
                            if (shouldSendChatMessage) {
                                action = {
                                    id: "proactive_".concat(Date.now(), "_chat"),
                                    type: 'chat_message',
                                    title: 'Mensaje Proactivo de Chat',
                                    description: 'El sistema ha detectado que sería beneficioso enviar un mensaje proactivo al usuario.',
                                    priority: 'medium',
                                    timestamp: new Date(),
                                    executionTime: new Date(Date.now() + 3000), // Execute in 3 seconds
                                    executed: false
                                };
                                this.proactiveActions.push(action);
                                // Emit proactive event
                                this.emitEvent({
                                    type: 'system_proactive',
                                    timestamp: new Date(),
                                    userId: '', // Would be populated in real implementation
                                    payload: action,
                                    sourceModule: 'SpartanNervousSystem',
                                    priority: 'medium'
                                });
                            }
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        logger_1.logger.error('SpartanNervousSystem: Error in proactive monitoring', error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Determine if a chat message should be sent proactively
     */
    SpartanNervousSystem.prototype.shouldSendChatMessageProactively = function (insights) {
        // Check if user has critical recovery status
        if (insights.currentStatus.recoveryStatus === 'critical') {
            return true;
        }
        // Check if user has very low energy
        if (insights.currentStatus.energyLevel === 'veryLow') {
            return true;
        }
        // Check if user needs rest
        if (insights.currentStatus.trainingReadiness === 'rest') {
            return true;
        }
        return false;
    };
    /**
     * Execute a proactive action
     */
    SpartanNervousSystem.prototype.executeProactiveAction = function (action) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    switch (action.type) {
                        case 'modal_activation':
                            // Activate a relevant modal based on the context
                            // This would require more detailed implementation
                            logger_1.logger.info("SpartanNervousSystem: Executing proactive modal activation - ".concat(action.title));
                            break;
                        case 'chat_message':
                            // Send a proactive message to Chat Maestro
                            // This would require integration with the chat service
                            logger_1.logger.info("SpartanNervousSystem: Executing proactive chat message - ".concat(action.title));
                            break;
                        case 'data_update':
                            // Update data based on proactive action
                            logger_1.logger.info("SpartanNervousSystem: Executing proactive data update - ".concat(action.title));
                            break;
                        case 'recommendation':
                            // Generate and send a recommendation
                            logger_1.logger.info("SpartanNervousSystem: Executing proactive recommendation - ".concat(action.title));
                            break;
                        case 'neural_feedback_session':
                            // Start a neurofeedback session
                            logger_1.logger.info("SpartanNervousSystem: Executing neurofeedback session - ".concat(action.title));
                            break;
                    }
                    // Mark action as executed
                    action.executed = true;
                    action.result = { success: true, timestamp: new Date() };
                }
                catch (error) {
                    logger_1.logger.error("SpartanNervousSystem: Error executing proactive action ".concat(action.id), error);
                    action.result = { success: false, error: error, timestamp: new Date() };
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Get current system alerts
     */
    SpartanNervousSystem.prototype.getAlerts = function () {
        // Filter out expired alerts
        var now = new Date();
        this.alerts = this.alerts.filter(function (alert) {
            if (alert.autoDismiss) {
                var expiryTime = new Date(alert.timestamp.getTime() + alert.autoDismiss * 1000);
                return now < expiryTime;
            }
            return true;
        });
        return __spreadArray([], this.alerts, true);
    };
    /**
     * Get current system recommendations
     */
    SpartanNervousSystem.prototype.getRecommendations = function () {
        return __spreadArray([], this.recommendations, true);
    };
    /**
     * Get current proactive actions
     */
    SpartanNervousSystem.prototype.getProactiveActions = function () {
        return __spreadArray([], this.proactiveActions, true);
    };
    /**
     * Dismiss an alert
     */
    SpartanNervousSystem.prototype.dismissAlert = function (alertId) {
        this.alerts = this.alerts.filter(function (alert) { return alert.id !== alertId; });
    };
    /**
     * Execute a recommendation
     */
    SpartanNervousSystem.prototype.executeRecommendation = function (recId) {
        return __awaiter(this, void 0, void 0, function () {
            var recommendation;
            return __generator(this, function (_a) {
                recommendation = this.recommendations.find(function (rec) { return rec.id === recId; });
                if (recommendation && recommendation.actionable) {
                    // In a real implementation, this would execute the recommendation
                    logger_1.logger.info("SpartanNervousSystem: Executing recommendation ".concat(recId));
                    // Remove the recommendation after execution
                    this.recommendations = this.recommendations.filter(function (rec) { return rec.id !== recId; });
                    return [2 /*return*/, true];
                }
                return [2 /*return*/, false];
            });
        });
    };
    /**
     * Handle system audit completed events from Continuous Ecosystem Optimization Service
     */
    SpartanNervousSystem.prototype.handleSystemAuditCompleted = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var auditReport, criticalIssues, alert_1;
            var _this = this;
            return __generator(this, function (_a) {
                auditReport = event.payload;
                // Log the audit completion
                logger_1.logger.info('SpartanNervousSystem: System audit completed', {
                    timestamp: auditReport.timestamp,
                    recommendationsCount: auditReport.recommendations.length,
                    issuesCount: auditReport.issues.length
                });
                // If there are critical issues, generate alerts
                if (auditReport.issues.length > 0) {
                    criticalIssues = auditReport.issues.filter(function (issue) { return issue.includes('Critical'); });
                    if (criticalIssues.length > 0) {
                        alert_1 = {
                            id: "system_audit_alert_".concat(Date.now()),
                            type: 'danger',
                            title: 'System Performance Issues Detected',
                            message: "Critical system performance issues detected during audit: ".concat(criticalIssues.join(', ')),
                            priority: 'critical',
                            timestamp: new Date(),
                            actions: ['View Recommendations', 'Optimize System'],
                            dismissible: true
                        };
                        this.alerts.push(alert_1);
                        // Emit alert event
                        this.emitEvent({
                            type: 'alert_triggered',
                            timestamp: new Date(),
                            userId: event.userId || '',
                            payload: alert_1,
                            sourceModule: 'SpartanNervousSystem',
                            priority: 'critical'
                        });
                    }
                }
                // If there are recommendations, process them
                if (auditReport.recommendations.length > 0) {
                    // Generate system recommendations from audit recommendations
                    auditReport.recommendations.forEach(function (rec) {
                        var systemRec = {
                            id: "audit_rec_".concat(rec.id),
                            type: 'training', // Default type, could be more specific based on recommendation type
                            title: "System Optimization: ".concat(rec.description),
                            description: rec.implementation,
                            priority: rec.priority,
                            timestamp: new Date(),
                            confidence: 0.9, // High confidence for system-generated recommendations
                            actionable: true
                        };
                        _this.recommendations.push(systemRec);
                        // Emit recommendation event
                        _this.emitEvent({
                            type: 'recommendation_made',
                            timestamp: new Date(),
                            userId: event.userId || '',
                            payload: systemRec,
                            sourceModule: 'SpartanNervousSystem',
                            priority: rec.priority
                        });
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Get learning memory
     */
    SpartanNervousSystem.prototype.getLearningMemory = function () {
        return new Map(this.learningMemory);
    };
    /**
     * Clean up resources
     */
    SpartanNervousSystem.prototype.cleanup = function () {
        if (this.processingInterval) {
            clearInterval(this.processingInterval);
            this.processingInterval = null;
        }
    };
    return SpartanNervousSystem;
}());
exports.SpartanNervousSystem = SpartanNervousSystem;
// Export singleton instance
exports.spartanNervousSystem = SpartanNervousSystem.getInstance();
