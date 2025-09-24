"use strict";
// Modal service for Spartan
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
exports.SpartanModalService = void 0;
var spartan_modal_engine_1 = require("./spartan-modal-engine");
var spartan_nervous_system_1 = require("./spartan-nervous-system");
var SpartanModalService = /** @class */ (function () {
    function SpartanModalService(configuration) {
        this.engine = new spartan_modal_engine_1.SpartanModalEngine(configuration);
        this.isModalSystemEnabled = true;
    }
    /**
     * Enable or disable modal system
     */
    SpartanModalService.prototype.setModalSystemEnabled = function (enabled) {
        this.isModalSystemEnabled = enabled;
    };
    /**
     * Register a modal loader function
     */
    SpartanModalService.prototype.registerModalLoader = function (loader) {
        this.modalLoader = loader;
    };
    /**
     * Register a modal executor function
     */
    SpartanModalService.prototype.registerModalExecutor = function (executor) {
        this.modalExecutor = executor;
    };
    /**
     * Register a data exchange handler
     */
    SpartanModalService.prototype.registerDataExchangeHandler = function (handler) {
        this.dataExchangeHandler = handler;
    };
    /**
     * Install a new modal
     */
    SpartanModalService.prototype.installModal = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, modal, dependenciesInstalled, _i, _a, dependencyId, dependencyRequest, dependencyResult, registered, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.isModalSystemEnabled || !this.modalLoader) {
                            return [2 /*return*/, {
                                    success: false,
                                    modalId: request.modalId,
                                    errorMessage: 'Modal system not enabled or modal loader not registered',
                                    installationTime: 0,
                                    dependenciesInstalled: []
                                }];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        startTime = Date.now();
                        return [4 /*yield*/, this.modalLoader(request.modalId)];
                    case 2:
                        modal = _b.sent();
                        if (!modal) {
                            return [2 /*return*/, {
                                    success: false,
                                    modalId: request.modalId,
                                    errorMessage: 'Failed to load modal',
                                    installationTime: Date.now() - startTime,
                                    dependenciesInstalled: []
                                }];
                        }
                        dependenciesInstalled = [];
                        _i = 0, _a = modal.dependencies;
                        _b.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        dependencyId = _a[_i];
                        if (!!this.engine.getRegistry()[dependencyId]) return [3 /*break*/, 5];
                        dependencyRequest = {
                            modalId: dependencyId,
                            source: '', // Would be populated in real implementation
                            checksum: '',
                            dependencies: [],
                            configuration: {}
                        };
                        return [4 /*yield*/, this.installModal(dependencyRequest)];
                    case 4:
                        dependencyResult = _b.sent();
                        if (dependencyResult.success) {
                            dependenciesInstalled.push(dependencyId);
                        }
                        else {
                            return [2 /*return*/, {
                                    success: false,
                                    modalId: request.modalId,
                                    errorMessage: "Failed to install dependency: ".concat(dependencyId),
                                    installationTime: Date.now() - startTime,
                                    dependenciesInstalled: dependenciesInstalled
                                }];
                        }
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        registered = this.engine.registerModal(modal);
                        if (!registered) {
                            return [2 /*return*/, {
                                    success: false,
                                    modalId: request.modalId,
                                    errorMessage: 'Failed to register modal',
                                    installationTime: Date.now() - startTime,
                                    dependenciesInstalled: dependenciesInstalled
                                }];
                        }
                        return [2 /*return*/, {
                                success: true,
                                modalId: request.modalId,
                                installedVersion: modal.version,
                                installationTime: Date.now() - startTime,
                                dependenciesInstalled: dependenciesInstalled
                            }];
                    case 7:
                        error_1 = _b.sent();
                        return [2 /*return*/, {
                                success: false,
                                modalId: request.modalId,
                                errorMessage: error_1 instanceof Error ? error_1.message : 'Unknown error during installation',
                                installationTime: 0,
                                dependenciesInstalled: []
                            }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Uninstall a modal
     */
    SpartanModalService.prototype.uninstallModal = function (modalId) {
        if (!this.isModalSystemEnabled) {
            return false;
        }
        var result = this.engine.unregisterModal(modalId);
        if (result) {
            // Notify the nervous system of modal deactivation
            spartan_nervous_system_1.spartanNervousSystem.emitEvent({
                type: 'modal_deactivated',
                timestamp: new Date(),
                userId: '', // This would need to be passed in a real implementation
                payload: {
                    modalId: modalId
                },
                sourceModule: 'SpartanModalService',
                priority: 'low'
            });
        }
        return result;
    };
    /**
     * Activate a modal based on context
     */
    SpartanModalService.prototype.activateModalWithContext = function (context) {
        if (!this.isModalSystemEnabled) {
            return [];
        }
        // Get compatible modals
        var compatibleIds = this.engine.getCompatibleModals(context);
        // Activate each compatible modal
        var responses = [];
        for (var _i = 0, compatibleIds_1 = compatibleIds; _i < compatibleIds_1.length; _i++) {
            var modalId = compatibleIds_1[_i];
            var modal = this.engine.getRegistry()[modalId];
            if (!modal)
                continue;
            var request = {
                modalId: modalId,
                context: context,
                priority: 'medium',
                reason: 'Context-based activation',
                requiredResources: {
                    memory: 100, // Placeholder values
                    cpu: 5,
                    network: 2
                }
            };
            var response = this.engine.activateModal(request);
            responses.push(response);
            // Notify the nervous system of modal activation
            spartan_nervous_system_1.spartanNervousSystem.emitEvent({
                type: 'modal_activated',
                timestamp: new Date(),
                userId: context.userId,
                payload: {
                    modalId: modalId,
                    response: response,
                    context: context
                },
                sourceModule: 'SpartanModalService',
                priority: 'medium'
            });
        }
        return responses;
    };
    /**
     * Execute a modal
     */
    SpartanModalService.prototype.executeModal = function (modalId, context, inputData) {
        return __awaiter(this, void 0, void 0, function () {
            var activationRequest, activationResponse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isModalSystemEnabled || !this.modalExecutor) {
                            throw new Error('Modal system not enabled or modal executor not registered');
                        }
                        // Check if modal is active
                        if (!this.engine.getActiveModals().includes(modalId)) {
                            activationRequest = {
                                modalId: modalId,
                                context: context,
                                priority: 'medium',
                                reason: 'Execution request',
                                requiredResources: {
                                    memory: 100,
                                    cpu: 5,
                                    network: 2
                                },
                                inputData: inputData
                            };
                            activationResponse = this.engine.activateModal(activationRequest);
                            if (!activationResponse.success) {
                                throw new Error("Failed to activate modal: ".concat(activationResponse.errorMessage));
                            }
                            // Notify the nervous system of modal activation
                            spartan_nervous_system_1.spartanNervousSystem.emitEvent({
                                type: 'modal_activated',
                                timestamp: new Date(),
                                userId: context.userId,
                                payload: {
                                    modalId: modalId,
                                    response: activationResponse,
                                    context: context
                                },
                                sourceModule: 'SpartanModalService',
                                priority: 'medium'
                            });
                        }
                        return [4 /*yield*/, this.modalExecutor(modalId, context, inputData)];
                    case 1:
                        result = _a.sent();
                        // Notify the nervous system of modal execution
                        spartan_nervous_system_1.spartanNervousSystem.emitEvent({
                            type: 'user_action',
                            timestamp: new Date(),
                            userId: context.userId,
                            payload: {
                                actionType: 'modal_execution',
                                modalId: modalId,
                                result: result,
                                context: context
                            },
                            sourceModule: 'SpartanModalService',
                            priority: 'medium'
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Get compatible modals for a context
     */
    SpartanModalService.prototype.getCompatibleModals = function (context) {
        if (!this.isModalSystemEnabled) {
            return [];
        }
        return this.engine.getCompatibleModals(context);
    };
    /**
     * Exchange data between modals
     */
    SpartanModalService.prototype.exchangeData = function (exchange) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isModalSystemEnabled || !this.dataExchangeHandler) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.dataExchangeHandler(exchange)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Update modal configuration
     */
    SpartanModalService.prototype.updateConfiguration = function (newConfig) {
        this.engine.updateConfiguration(newConfig);
    };
    /**
     * Get current configuration
     */
    SpartanModalService.prototype.getConfiguration = function () {
        return this.engine.getConfiguration();
    };
    /**
     * Get registry of installed modals
     */
    SpartanModalService.prototype.getRegistry = function () {
        return this.engine.getRegistry();
    };
    /**
     * Get active modals
     */
    SpartanModalService.prototype.getActiveModals = function () {
        return this.engine.getActiveModals();
    };
    /**
     * Get performance metrics
     */
    SpartanModalService.prototype.getPerformanceMetrics = function (modalId) {
        return this.engine.getPerformanceMetrics(modalId);
    };
    /**
     * Get system analytics
     */
    SpartanModalService.prototype.getAnalytics = function () {
        return this.engine.getAnalytics();
    };
    /**
     * Simulate user feedback for analytics
     */
    SpartanModalService.prototype.recordUserFeedback = function (modalId, satisfaction, comments) {
        console.log("User feedback recorded for ".concat(modalId, ": ").concat(satisfaction, "/5").concat(comments ? " - ".concat(comments) : ''));
        // In a real implementation, this would update analytics
    };
    return SpartanModalService;
}());
exports.SpartanModalService = SpartanModalService;
