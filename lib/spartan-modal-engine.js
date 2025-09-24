"use strict";
// Modal scalability engine for Spartan
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
exports.SpartanModalEngine = void 0;
var SpartanModalEngine = /** @class */ (function () {
    function SpartanModalEngine(configuration) {
        this.registry = {};
        this.activeModals = new Set();
        this.eventHistory = [];
        this.performanceMetrics = new Map();
        this.conflicts = [];
        this.communicationLog = [];
        this.lifecycleEvents = [];
        this.discoveryMetadata = new Map();
        this.configuration = configuration || this.getDefaultConfiguration();
        this.analytics = this.initializeAnalytics();
    }
    SpartanModalEngine.prototype.getDefaultConfiguration = function () {
        return {
            maxConcurrentModals: 10,
            resourceAllocationStrategy: 'balanced',
            autoScalingEnabled: true,
            memoryLimitPerModal: 512,
            cpuLimitPerModal: 25,
            networkLimitPerModal: 10,
            enableModalCaching: true,
            cacheTTL: 3600, // 1 hour
            lazyLoadingEnabled: true,
            preloadStrategies: {}
        };
    };
    SpartanModalEngine.prototype.initializeAnalytics = function () {
        return {
            totalModals: 0,
            activeModals: 0,
            systemPerformance: {
                averageResponseTime: 0,
                systemLoad: 0,
                resourceUtilization: {
                    memory: 0,
                    cpu: 0,
                    network: 0
                }
            },
            modalMetrics: {},
            modalEvents: [],
            lastAnalysis: new Date()
        };
    };
    SpartanModalEngine.prototype.registerModal = function (modal) {
        try {
            // Validate modal
            if (!this.validateModal(modal)) {
                this.logEvent({
                    type: 'modal_error',
                    modalId: modal.id,
                    payload: { error: 'Invalid modal module' },
                    timestamp: new Date(),
                    severity: 'error'
                });
                return false;
            }
            // Register modal
            this.registry[modal.id] = modal;
            this.analytics.totalModals = Object.keys(this.registry).length;
            // Initialize performance metrics
            this.performanceMetrics.set(modal.id, {
                modalId: modal.id,
                activationCount: 0,
                averageExecutionTime: 0,
                errorRate: 0,
                resourceUsage: {
                    averageMemory: 0,
                    averageCpu: 0,
                    averageNetwork: 0
                },
                userSatisfaction: 0,
                lastUpdated: new Date()
            });
            // Log registration event
            this.logEvent({
                type: 'modal_registered',
                modalId: modal.id,
                payload: { name: modal.name, version: modal.version },
                timestamp: new Date(),
                severity: 'info'
            });
            // Record lifecycle event
            this.recordLifecycleEvent(modal.id, 'initialized');
            return true;
        }
        catch (error) {
            this.logEvent({
                type: 'modal_error',
                modalId: modal.id,
                payload: { error: error instanceof Error ? error.message : 'Unknown error' },
                timestamp: new Date(),
                severity: 'error'
            });
            return false;
        }
    };
    SpartanModalEngine.prototype.validateModal = function (modal) {
        // Check required fields
        if (!modal.id || !modal.name || !modal.version) {
            return false;
        }
        // Check for duplicate IDs
        if (this.registry[modal.id]) {
            return false;
        }
        // Validate dependencies exist
        for (var _i = 0, _a = modal.dependencies; _i < _a.length; _i++) {
            var dependency = _a[_i];
            if (!this.registry[dependency]) {
                return false;
            }
        }
        return true;
    };
    SpartanModalEngine.prototype.unregisterModal = function (modalId) {
        if (!this.registry[modalId]) {
            return false;
        }
        // Deactivate if currently active
        if (this.activeModals.has(modalId)) {
            this.deactivateModal(modalId);
        }
        // Remove from registry
        delete this.registry[modalId];
        this.analytics.totalModals = Object.keys(this.registry).length;
        // Remove performance metrics
        this.performanceMetrics.delete(modalId);
        return true;
    };
    SpartanModalEngine.prototype.activateModal = function (request) {
        var _a;
        var modal = this.registry[request.modalId];
        if (!modal) {
            return {
                success: false,
                modalId: request.modalId,
                activated: false,
                errorMessage: 'Modal not found',
                resourceUsage: { memory: 0, cpu: 0, network: 0 },
                executionTime: 0
            };
        }
        // Check if already active
        if (this.activeModals.has(request.modalId)) {
            return {
                success: true,
                modalId: request.modalId,
                activated: true,
                resourceUsage: { memory: 0, cpu: 0, network: 0 },
                executionTime: 0
            };
        }
        // Check resource limits
        if (!this.checkResourceAvailability(request)) {
            this.logEvent({
                type: 'resource_limit_exceeded',
                modalId: request.modalId,
                payload: { requiredResources: request.requiredResources },
                timestamp: new Date(),
                severity: 'warning'
            });
            return {
                success: false,
                modalId: request.modalId,
                activated: false,
                errorMessage: 'Insufficient resources',
                resourceUsage: { memory: 0, cpu: 0, network: 0 },
                executionTime: 0
            };
        }
        // Check for conflicts
        var conflicts = this.detectConflicts(request);
        if (conflicts.length > 0) {
            (_a = this.conflicts).push.apply(_a, conflicts);
            // Try to resolve conflicts
            if (!this.resolveConflicts(conflicts)) {
                return {
                    success: false,
                    modalId: request.modalId,
                    activated: false,
                    errorMessage: 'Unresolved conflicts',
                    resourceUsage: { memory: 0, cpu: 0, network: 0 },
                    executionTime: 0
                };
            }
        }
        // Activate modal
        this.activeModals.add(request.modalId);
        this.analytics.activeModals = this.activeModals.size;
        // Update performance metrics
        var metrics = this.performanceMetrics.get(request.modalId);
        if (metrics) {
            metrics.activationCount++;
            metrics.lastUpdated = new Date();
            this.performanceMetrics.set(request.modalId, metrics);
        }
        // Log activation event
        this.logEvent({
            type: 'modal_activated',
            modalId: request.modalId,
            payload: { reason: request.reason, priority: request.priority },
            timestamp: new Date(),
            severity: 'info'
        });
        // Record lifecycle event
        this.recordLifecycleEvent(request.modalId, 'activated');
        return {
            success: true,
            modalId: request.modalId,
            activated: true,
            resourceUsage: request.requiredResources,
            executionTime: Date.now() - request.context.systemLoad.cpuUsage // Simplified
        };
    };
    SpartanModalEngine.prototype.deactivateModal = function (modalId) {
        if (!this.activeModals.has(modalId)) {
            return false;
        }
        this.activeModals.delete(modalId);
        this.analytics.activeModals = this.activeModals.size;
        // Log deactivation event
        this.logEvent({
            type: 'modal_deactivated',
            modalId: modalId,
            payload: {},
            timestamp: new Date(),
            severity: 'info'
        });
        // Record lifecycle event
        this.recordLifecycleEvent(modalId, 'deactivated');
        return true;
    };
    SpartanModalEngine.prototype.checkResourceAvailability = function (request) {
        var _this = this;
        // Simplified resource check
        // In a real implementation, this would check actual system resources
        var totalMemory = Array.from(this.activeModals).reduce(function (sum, id) {
            var modal = _this.registry[id];
            // This is a placeholder - in reality we'd track actual resource usage
            return sum + (modal ? 100 : 0);
        }, 0);
        var totalCpu = this.activeModals.size * 5; // Placeholder
        var totalNetwork = this.activeModals.size * 2; // Placeholder
        return (totalMemory + request.requiredResources.memory <=
            this.configuration.memoryLimitPerModal * this.configuration.maxConcurrentModals &&
            totalCpu + request.requiredResources.cpu <=
                this.configuration.cpuLimitPerModal * this.configuration.maxConcurrentModals &&
            totalNetwork + request.requiredResources.network <=
                this.configuration.networkLimitPerModal * this.configuration.maxConcurrentModals);
    };
    SpartanModalEngine.prototype.detectConflicts = function (request) {
        var conflicts = [];
        // Check for resource conflicts
        for (var _i = 0, _a = this.activeModals; _i < _a.length; _i++) {
            var activeId = _a[_i];
            var activeModal = this.registry[activeId];
            if (!activeModal)
                continue;
            // Check if both modals require the same resources
            if (activeModal.category === this.registry[request.modalId].category) {
                conflicts.push({
                    modalIds: [request.modalId, activeId],
                    conflictType: 'resource',
                    description: "Resource conflict between ".concat(request.modalId, " and ").concat(activeId),
                    resolutionStrategy: 'priority',
                    resolved: false,
                    timestamp: new Date()
                });
            }
        }
        return conflicts;
    };
    SpartanModalEngine.prototype.resolveConflicts = function (conflicts) {
        // Simplified conflict resolution based on priority
        for (var _i = 0, conflicts_1 = conflicts; _i < conflicts_1.length; _i++) {
            var conflict = conflicts_1[_i];
            if (conflict.resolutionStrategy === 'priority') {
                // In a real implementation, we would implement more sophisticated resolution
                conflict.resolved = true;
                conflict.resolution = 'Priority-based resolution applied';
            }
        }
        return true;
    };
    SpartanModalEngine.prototype.getCompatibleModals = function (context) {
        var _this = this;
        var compatible = [];
        for (var _i = 0, _a = Object.entries(this.registry); _i < _a.length; _i++) {
            var _b = _a[_i], id = _b[0], modal = _b[1];
            if (!modal.enabled)
                continue;
            var _loop_1 = function (trigger) {
                if (trigger.test(context.conversationTopic) ||
                    trigger.test(context.userIntent) ||
                    context.relevantDataPoints.some(function (dp) { return trigger.test(dp); })) {
                    compatible.push(id);
                    return "break";
                }
            };
            // Check if any activation triggers match the context
            for (var _c = 0, _d = modal.activationTriggers; _c < _d.length; _c++) {
                var trigger = _d[_c];
                var state_1 = _loop_1(trigger);
                if (state_1 === "break")
                    break;
            }
        }
        // Sort by priority
        return compatible.sort(function (a, b) {
            var modA = _this.registry[a];
            var modB = _this.registry[b];
            return ((modB === null || modB === void 0 ? void 0 : modB.priority) || 0) - ((modA === null || modA === void 0 ? void 0 : modA.priority) || 0);
        });
    };
    SpartanModalEngine.prototype.sendCrossModalMessage = function (sender, receiver, message, data, requiresResponse) {
        if (requiresResponse === void 0) { requiresResponse = false; }
        // Validate modals exist
        if (!this.registry[sender] || !this.registry[receiver]) {
            return false;
        }
        // Log communication
        this.communicationLog.push({
            sender: sender,
            receiver: receiver,
            message: message,
            data: data,
            timestamp: new Date(),
            requiresResponse: requiresResponse
        });
        // In a real implementation, this would actually send the message to the receiver modal
        console.log("Cross-modal message from ".concat(sender, " to ").concat(receiver, ": ").concat(message));
        return true;
    };
    SpartanModalEngine.prototype.updateConfiguration = function (newConfig) {
        this.configuration = __assign(__assign({}, this.configuration), newConfig);
    };
    SpartanModalEngine.prototype.getConfiguration = function () {
        return __assign({}, this.configuration);
    };
    SpartanModalEngine.prototype.getRegistry = function () {
        return __assign({}, this.registry);
    };
    SpartanModalEngine.prototype.getActiveModals = function () {
        return Array.from(this.activeModals);
    };
    SpartanModalEngine.prototype.getPerformanceMetrics = function (modalId) {
        if (modalId) {
            return this.performanceMetrics.get(modalId) || {
                modalId: modalId,
                activationCount: 0,
                averageExecutionTime: 0,
                errorRate: 0,
                resourceUsage: {
                    averageMemory: 0,
                    averageCpu: 0,
                    averageNetwork: 0
                },
                userSatisfaction: 0,
                lastUpdated: new Date()
            };
        }
        return new Map(this.performanceMetrics);
    };
    SpartanModalEngine.prototype.logEvent = function (event) {
        this.eventHistory.push(event);
        this.analytics.modalEvents.push(event);
        // Limit event history
        if (this.eventHistory.length > 1000) {
            this.eventHistory = this.eventHistory.slice(-1000);
        }
        if (this.analytics.modalEvents.length > 100) {
            this.analytics.modalEvents = this.analytics.modalEvents.slice(-100);
        }
    };
    SpartanModalEngine.prototype.getEventHistory = function () {
        return __spreadArray([], this.eventHistory, true);
    };
    SpartanModalEngine.prototype.getAnalytics = function () {
        // Update active modals count
        this.analytics.activeModals = this.activeModals.size;
        // Update system performance metrics (simplified)
        this.analytics.systemPerformance.averageResponseTime = 100; // Placeholder
        this.analytics.systemPerformance.systemLoad = 25; // Placeholder
        return __assign({}, this.analytics);
    };
    SpartanModalEngine.prototype.getConflicts = function () {
        return __spreadArray([], this.conflicts, true);
    };
    SpartanModalEngine.prototype.getCommunicationLog = function () {
        return __spreadArray([], this.communicationLog, true);
    };
    SpartanModalEngine.prototype.recordLifecycleEvent = function (modalId, eventType, details) {
        this.lifecycleEvents.push({
            modalId: modalId,
            eventType: eventType,
            timestamp: new Date(),
            details: details
        });
    };
    SpartanModalEngine.prototype.getLifecycleEvents = function (modalId) {
        if (modalId) {
            return this.lifecycleEvents.filter(function (event) { return event.modalId === modalId; });
        }
        return __spreadArray([], this.lifecycleEvents, true);
    };
    SpartanModalEngine.prototype.registerDiscoveryMetadata = function (metadata) {
        this.discoveryMetadata.set(metadata.id, metadata);
    };
    SpartanModalEngine.prototype.getDiscoveryMetadata = function (modalId) {
        if (modalId) {
            return this.discoveryMetadata.get(modalId) || {
                id: modalId,
                name: '',
                version: '',
                description: '',
                category: '',
                capabilities: [],
                dependencies: [],
                supportedPlatforms: [],
                integrationType: 'embedded',
                registrationEndpoint: '',
                healthCheckEndpoint: '',
                dataExchangeFormat: ''
            };
        }
        return new Map(this.discoveryMetadata);
    };
    return SpartanModalEngine;
}());
exports.SpartanModalEngine = SpartanModalEngine;
