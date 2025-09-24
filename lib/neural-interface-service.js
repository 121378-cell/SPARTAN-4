"use strict";
/**
 * Neural Interface Service for SPARTAN 4
 * Direct integration with Spartan Nervous System for biometric feedback,
 * brain-computer interface for mental state monitoring, and neurofeedback training modules
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
exports.neuralInterfaceService = exports.NeuralInterfaceService = void 0;
var spartan_nervous_system_1 = require("./spartan-nervous-system");
var storage_1 = require("./storage");
var logger_1 = require("./logger");
var NeuralInterfaceService = /** @class */ (function () {
    function NeuralInterfaceService() {
        this.devices = new Map();
        this.signalBuffer = [];
        this.mentalStateBuffer = [];
        this.feedbackBuffer = [];
        this.protocols = [];
        this.isMonitoring = false;
        this.monitoringInterval = null;
    }
    NeuralInterfaceService.getInstance = function () {
        if (!NeuralInterfaceService.instance) {
            NeuralInterfaceService.instance = new NeuralInterfaceService();
        }
        return NeuralInterfaceService.instance;
    };
    /**
     * Initialize the neural interface service
     */
    NeuralInterfaceService.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var savedDevices;
            var _this = this;
            return __generator(this, function (_a) {
                logger_1.logger.info('NeuralInterfaceService: Initializing service');
                // Load saved protocols
                this.protocols = storage_1.storageManager.getNeurofeedbackProtocols() || [];
                savedDevices = storage_1.storageManager.getNeuralInterfaceDevices() || [];
                savedDevices.forEach(function (device) {
                    _this.devices.set(device.id, device);
                });
                logger_1.logger.info('NeuralInterfaceService: Service initialized successfully');
                return [2 /*return*/];
            });
        });
    };
    /**
     * Register a neural interface device
     */
    NeuralInterfaceService.prototype.registerDevice = function (device) {
        this.devices.set(device.id, device);
        storage_1.storageManager.setNeuralInterfaceDevices(Array.from(this.devices.values()));
        logger_1.logger.info("NeuralInterfaceService: Device ".concat(device.name, " registered"));
    };
    /**
     * Connect to a neural interface device
     */
    NeuralInterfaceService.prototype.connectToDevice = function (deviceId) {
        return __awaiter(this, void 0, void 0, function () {
            var device;
            return __generator(this, function (_a) {
                device = this.devices.get(deviceId);
                if (!device) {
                    logger_1.logger.error("NeuralInterfaceService: Device ".concat(deviceId, " not found"));
                    return [2 /*return*/, false];
                }
                try {
                    // Simulate device connection
                    device.connected = true;
                    device.lastSync = new Date();
                    this.devices.set(deviceId, device);
                    storage_1.storageManager.setNeuralInterfaceDevices(Array.from(this.devices.values()));
                    logger_1.logger.info("NeuralInterfaceService: Connected to device ".concat(device.name));
                    return [2 /*return*/, true];
                }
                catch (error) {
                    logger_1.logger.error("NeuralInterfaceService: Failed to connect to device ".concat(deviceId), error);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Disconnect from a neural interface device
     */
    NeuralInterfaceService.prototype.disconnectFromDevice = function (deviceId) {
        var device = this.devices.get(deviceId);
        if (device) {
            device.connected = false;
            this.devices.set(deviceId, device);
            storage_1.storageManager.setNeuralInterfaceDevices(Array.from(this.devices.values()));
            logger_1.logger.info("NeuralInterfaceService: Disconnected from device ".concat(device.name));
        }
    };
    /**
     * Start monitoring neural signals
     */
    NeuralInterfaceService.prototype.startMonitoring = function () {
        var _this = this;
        if (this.isMonitoring) {
            logger_1.logger.warn('NeuralInterfaceService: Monitoring already started');
            return;
        }
        this.isMonitoring = true;
        this.monitoringInterval = setInterval(function () {
            _this.collectNeuralData();
        }, 1000); // Collect data every second
        logger_1.logger.info('NeuralInterfaceService: Started monitoring neural signals');
    };
    /**
     * Stop monitoring neural signals
     */
    NeuralInterfaceService.prototype.stopMonitoring = function () {
        if (!this.isMonitoring) {
            logger_1.logger.warn('NeuralInterfaceService: Monitoring not started');
            return;
        }
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        this.isMonitoring = false;
        logger_1.logger.info('NeuralInterfaceService: Stopped monitoring neural signals');
    };
    /**
     * Collect neural data from connected devices
     */
    NeuralInterfaceService.prototype.collectNeuralData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var connectedDevices, signals, mentalState, feedback;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                connectedDevices = Array.from(this.devices.values()).filter(function (d) { return d.connected; });
                if (connectedDevices.length === 0) {
                    return [2 /*return*/];
                }
                signals = [];
                connectedDevices.forEach(function (device) {
                    device.supportedSignals.forEach(function (signalType) {
                        // Generate simulated signal data
                        var signal = {
                            type: signalType,
                            value: _this.generateSimulatedSignalValue(signalType),
                            timestamp: new Date(),
                            quality: Math.floor(Math.random() * 20) + 80, // 80-100 quality
                            channel: device.type === 'eeg_headset' ? "channel_".concat(Math.floor(Math.random() * 8) + 1) : undefined
                        };
                        signals.push(signal);
                    });
                });
                // Add signals to buffer
                (_a = this.signalBuffer).push.apply(_a, signals);
                // Keep buffer at reasonable size
                if (this.signalBuffer.length > 1000) {
                    this.signalBuffer = this.signalBuffer.slice(-1000);
                }
                mentalState = this.analyzeMentalState(signals);
                this.mentalStateBuffer.push(mentalState);
                // Keep mental state buffer at reasonable size
                if (this.mentalStateBuffer.length > 100) {
                    this.mentalStateBuffer = this.mentalStateBuffer.slice(-100);
                }
                feedback = this.generateNeuralFeedback(signals, mentalState);
                this.feedbackBuffer.push(feedback);
                // Keep feedback buffer at reasonable size
                if (this.feedbackBuffer.length > 50) {
                    this.feedbackBuffer = this.feedbackBuffer.slice(-50);
                }
                // Emit events to the nervous system
                this.emitNeuralEvents(signals, mentalState, feedback);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Generate simulated signal values for different signal types
     */
    NeuralInterfaceService.prototype.generateSimulatedSignalValue = function (signalType) {
        switch (signalType) {
            case 'eeg_alpha':
                return Math.random() * 15; // 0-15 μV
            case 'eeg_beta':
                return Math.random() * 30; // 0-30 μV
            case 'eeg_theta':
                return Math.random() * 10; // 0-10 μV
            case 'eeg_delta':
                return Math.random() * 8; // 0-8 μV
            case 'emg':
                return Math.random() * 100; // 0-100 μV
            case 'ecg':
                return Math.random() * 2; // 0-2 mV
            case 'hrv':
                return Math.random() * 100; // 0-100 ms
            case 'gal':
                return Math.random() * 5; // 0-5 μS
            case 'pupillometry':
                return Math.random() * 10; // 0-10 mm
            case 'respiration':
                return Math.random() * 30; // 0-30 breaths per minute
            default:
                return Math.random() * 100;
        }
    };
    /**
     * Analyze mental state from neural signals
     */
    NeuralInterfaceService.prototype.analyzeMentalState = function (signals) {
        // Simplified mental state analysis
        // In a real implementation, this would use ML models or signal processing algorithms
        var state = 'focused';
        var confidence = 80;
        // Analyze EEG signals for mental state
        var alphaSignals = signals.filter(function (s) { return s.type === 'eeg_alpha'; });
        var betaSignals = signals.filter(function (s) { return s.type === 'eeg_beta'; });
        var thetaSignals = signals.filter(function (s) { return s.type === 'eeg_theta'; });
        if (alphaSignals.length > 0 && betaSignals.length > 0) {
            var alphaAvg = alphaSignals.reduce(function (sum, s) { return sum + s.value; }, 0) / alphaSignals.length;
            var betaAvg = betaSignals.reduce(function (sum, s) { return sum + s.value; }, 0) / betaSignals.length;
            var thetaAvg = thetaSignals.reduce(function (sum, s) { return sum + s.value; }, 0) / thetaSignals.length;
            // Simple heuristic for mental state classification
            if (alphaAvg > betaAvg * 1.5) {
                state = 'relaxed';
            }
            else if (betaAvg > alphaAvg * 2) {
                state = 'focused';
            }
            else if (thetaAvg > alphaAvg && thetaAvg > betaAvg) {
                state = 'drowsy';
            }
            // Confidence based on signal quality
            var avgQuality = signals.reduce(function (sum, s) { return sum + s.quality; }, 0) / signals.length;
            confidence = Math.round(avgQuality);
        }
        return {
            state: state,
            confidence: confidence,
            timestamp: new Date(),
            associatedSignals: signals
        };
    };
    /**
     * Generate neural feedback from signals and mental state
     */
    NeuralInterfaceService.prototype.generateNeuralFeedback = function (signals, mentalState) {
        // Generate feedback based on signals and mental state
        var feedbackType = 'cognitive_load';
        var value = 50; // Default value
        var recommendations = [];
        // Analyze signals to generate feedback
        var hrvSignals = signals.filter(function (s) { return s.type === 'hrv'; });
        var emgSignals = signals.filter(function (s) { return s.type === 'emg'; });
        var eegBeta = signals.filter(function (s) { return s.type === 'eeg_beta'; });
        if (hrvSignals.length > 0) {
            var avgHRV = hrvSignals.reduce(function (sum, s) { return sum + s.value; }, 0) / hrvSignals.length;
            // HRV is inversely related to stress - higher HRV means lower stress
            value = Math.min(100, Math.max(0, (avgHRV / 100) * 100));
            feedbackType = 'stress_response';
        }
        else if (emgSignals.length > 0) {
            var avgEMG = emgSignals.reduce(function (sum, s) { return sum + s.value; }, 0) / emgSignals.length;
            // EMG relates to muscle activation
            value = Math.min(100, (avgEMG / 100) * 100);
            feedbackType = 'fatigue_index';
        }
        else if (eegBeta.length > 0) {
            var avgBeta = eegBeta.reduce(function (sum, s) { return sum + s.value; }, 0) / eegBeta.length;
            // Beta waves relate to cognitive load
            value = Math.min(100, (avgBeta / 30) * 100);
            feedbackType = 'cognitive_load';
        }
        // Generate recommendations based on feedback
        if (value < 30) {
            recommendations = [
                'Consider taking a break to reduce cognitive load',
                'Practice deep breathing exercises',
                'Hydrate and ensure proper nutrition'
            ];
        }
        else if (value > 70) {
            recommendations = [
                'Maintain current focus level',
                'Ensure adequate recovery between sessions',
                'Monitor for signs of overexertion'
            ];
        }
        return {
            type: feedbackType,
            value: value,
            timestamp: new Date(),
            targetRange: [40, 60], // Optimal range
            recommendations: recommendations
        };
    };
    /**
     * Emit neural events to the Spartan Nervous System
     */
    NeuralInterfaceService.prototype.emitNeuralEvents = function (signals, mentalState, feedback) {
        // Emit biometric data received event
        spartan_nervous_system_1.spartanNervousSystem.emitEvent({
            type: 'data_updated',
            timestamp: new Date(),
            userId: 'current_user', // Would be dynamic in real implementation
            payload: {
                neuralSignals: signals,
                mentalState: mentalState,
                neuralFeedback: feedback
            },
            sourceModule: 'NeuralInterfaceService',
            priority: 'high'
        });
        // Emit mental state event
        spartan_nervous_system_1.spartanNervousSystem.emitEvent({
            type: 'insight_generated',
            timestamp: new Date(),
            userId: 'current_user',
            payload: {
                type: 'mental_state',
                data: mentalState
            },
            sourceModule: 'NeuralInterfaceService',
            priority: 'medium'
        });
        // Emit feedback event
        spartan_nervous_system_1.spartanNervousSystem.emitEvent({
            type: 'recommendation_made',
            timestamp: new Date(),
            userId: 'current_user',
            payload: {
                type: 'neural_feedback',
                data: feedback
            },
            sourceModule: 'NeuralInterfaceService',
            priority: 'medium'
        });
    };
    /**
     * Create a new neurofeedback protocol
     */
    NeuralInterfaceService.prototype.createNeurofeedbackProtocol = function (protocol) {
        var newProtocol = __assign(__assign({}, protocol), { id: "protocol_".concat(Date.now()), progressTracking: {
                sessionsCompleted: 0,
                averageImprovement: 0
            } });
        this.protocols.push(newProtocol);
        storage_1.storageManager.setNeurofeedbackProtocols(this.protocols);
        logger_1.logger.info("NeuralInterfaceService: Created neurofeedback protocol ".concat(protocol.name));
        return newProtocol;
    };
    /**
     * Start a neurofeedback training session
     */
    NeuralInterfaceService.prototype.startNeurofeedbackSession = function (protocolId) {
        return __awaiter(this, void 0, void 0, function () {
            var protocol;
            return __generator(this, function (_a) {
                protocol = this.protocols.find(function (p) { return p.id === protocolId; });
                if (!protocol) {
                    logger_1.logger.error("NeuralInterfaceService: Protocol ".concat(protocolId, " not found"));
                    return [2 /*return*/, false];
                }
                try {
                    // In a real implementation, this would start the actual training session
                    logger_1.logger.info("NeuralInterfaceService: Starting neurofeedback session for protocol ".concat(protocol.name));
                    // Update protocol progress
                    protocol.progressTracking.sessionsCompleted += 1;
                    protocol.progressTracking.lastSessionDate = new Date();
                    // Update in storage
                    storage_1.storageManager.setNeurofeedbackProtocols(this.protocols);
                    return [2 /*return*/, true];
                }
                catch (error) {
                    logger_1.logger.error("NeuralInterfaceService: Failed to start neurofeedback session for protocol ".concat(protocolId), error);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Get current neural signals
     */
    NeuralInterfaceService.prototype.getCurrentSignals = function () {
        // Return recent signals (last 10 seconds)
        var cutoffTime = new Date(Date.now() - 10000);
        return this.signalBuffer.filter(function (signal) { return signal.timestamp > cutoffTime; });
    };
    /**
     * Get current mental state
     */
    NeuralInterfaceService.prototype.getCurrentMentalState = function () {
        if (this.mentalStateBuffer.length === 0) {
            return null;
        }
        return this.mentalStateBuffer[this.mentalStateBuffer.length - 1];
    };
    /**
     * Get current neural feedback
     */
    NeuralInterfaceService.prototype.getCurrentFeedback = function () {
        if (this.feedbackBuffer.length === 0) {
            return null;
        }
        return this.feedbackBuffer[this.feedbackBuffer.length - 1];
    };
    /**
     * Get all neurofeedback protocols
     */
    NeuralInterfaceService.prototype.getProtocols = function () {
        return __spreadArray([], this.protocols, true);
    };
    /**
     * Get connected devices
     */
    NeuralInterfaceService.prototype.getConnectedDevices = function () {
        return Array.from(this.devices.values()).filter(function (d) { return d.connected; });
    };
    /**
     * Clean up resources
     */
    NeuralInterfaceService.prototype.cleanup = function () {
        this.stopMonitoring();
        logger_1.logger.info('NeuralInterfaceService: Service cleaned up');
    };
    return NeuralInterfaceService;
}());
exports.NeuralInterfaceService = NeuralInterfaceService;
// Export singleton instance
exports.neuralInterfaceService = NeuralInterfaceService.getInstance();
