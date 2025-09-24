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
Object.defineProperty(exports, "__esModule", { value: true });
exports.iotIntegrationService = exports.IoTIntegrationService = void 0;
var storage_1 = require("./storage");
var wearable_integration_service_1 = require("./wearable-integration-service");
var spartan_nervous_system_1 = require("./spartan-nervous-system");
var IoTIntegrationService = /** @class */ (function () {
    function IoTIntegrationService() {
        this.connectedEquipment = new Map();
        this.environmentalData = null;
        this.enhancedWearableData = null;
    }
    IoTIntegrationService.getInstance = function () {
        if (!IoTIntegrationService.instance) {
            IoTIntegrationService.instance = new IoTIntegrationService();
        }
        return IoTIntegrationService.instance;
    };
    /**
     * Register a new smart equipment device
     */
    IoTIntegrationService.prototype.registerEquipment = function (equipment) {
        console.log('🔌 Registering new equipment:', equipment.name);
        this.connectedEquipment.set(equipment.id, equipment);
        // Notify the nervous system of new equipment
        spartan_nervous_system_1.spartanNervousSystem.emitEvent({
            type: 'equipment_registered',
            timestamp: new Date(),
            userId: '', // Will be set by the caller
            payload: {
                equipment: equipment
            },
            sourceModule: 'IoTIntegrationService',
            priority: 'medium'
        });
    };
    /**
     * Update equipment data
     */
    IoTIntegrationService.prototype.updateEquipmentData = function (equipmentId, data) {
        var equipment = this.connectedEquipment.get(equipmentId);
        if (equipment) {
            var updatedEquipment = __assign(__assign({}, equipment), data);
            this.connectedEquipment.set(equipmentId, updatedEquipment);
            // Check for any issues
            var issues = this.checkEquipmentIssues(updatedEquipment);
            if (issues.length > 0) {
                spartan_nervous_system_1.spartanNervousSystem.emitEvent({
                    type: 'equipment_issue',
                    timestamp: new Date(),
                    userId: '', // Will be set by the caller
                    payload: {
                        equipmentId: equipmentId,
                        issues: issues
                    },
                    sourceModule: 'IoTIntegrationService',
                    priority: 'high'
                });
            }
        }
    };
    /**
     * Check for equipment issues
     */
    IoTIntegrationService.prototype.checkEquipmentIssues = function (equipment) {
        var issues = [];
        if (equipment.batteryLevel !== undefined && equipment.batteryLevel < 20) {
            issues.push("Low battery on ".concat(equipment.name, " (").concat(equipment.batteryLevel, "%)"));
        }
        var oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        var lastSync = new Date(equipment.lastSync);
        if (lastSync < oneHourAgo) {
            issues.push("".concat(equipment.name, " not synced recently"));
        }
        return issues;
    };
    /**
     * Process environmental sensor data
     */
    IoTIntegrationService.prototype.processEnvironmentalData = function (data) {
        console.log('🌡️ Processing environmental data');
        this.environmentalData = data;
        // Store environmental data
        storage_1.storageManager.setEnvironmentalData(data);
        // Notify the nervous system of environmental update
        spartan_nervous_system_1.spartanNervousSystem.emitEvent({
            type: 'environmental_data_updated',
            timestamp: new Date(),
            userId: '', // Will be set by the caller
            payload: {
                data: data
            },
            sourceModule: 'IoTIntegrationService',
            priority: 'medium'
        });
    };
    /**
     * Process enhanced wearable data
     */
    IoTIntegrationService.prototype.processEnhancedWearableData = function (userId, data) {
        console.log('⌚ Processing enhanced wearable data');
        this.enhancedWearableData = data;
        // Combine standard wearable data with enhanced metrics
        var combinedData = __assign(__assign({}, data.standardData), { 
            // Add enhanced metrics to vitals if they exist
            vitals: __assign(__assign(__assign({}, data.standardData.vitals), (data.additionalMetrics.muscleOxygen !== undefined && {
                muscleOxygen: data.additionalMetrics.muscleOxygen
            })), (data.additionalMetrics.bodyTemperature !== undefined && {
                bodyTemperature: data.additionalMetrics.bodyTemperature
            })) });
        // Process with existing wearable integration service
        var insights = wearable_integration_service_1.wearableIntegrationService.processWearableData(userId, combinedData);
        // Add enhanced recovery insights
        var enhancedInsights = this.generateEnhancedRecoveryInsights(data);
        // Store enhanced data
        storage_1.storageManager.setEnhancedWearableData(data);
        // Notify the nervous system of enhanced wearable update
        spartan_nervous_system_1.spartanNervousSystem.emitEvent({
            type: 'enhanced_wearable_data_updated',
            timestamp: new Date(),
            userId: userId,
            payload: {
                data: data,
                insights: enhancedInsights
            },
            sourceModule: 'IoTIntegrationService',
            priority: 'high'
        });
        return insights;
    };
    /**
     * Generate enhanced recovery insights from additional metrics
     */
    IoTIntegrationService.prototype.generateEnhancedRecoveryInsights = function (data) {
        var insights = {};
        // Muscle oxygen insights
        if (data.additionalMetrics.muscleOxygen !== undefined) {
            insights.muscleOxygenStatus = data.additionalMetrics.muscleOxygen > 60 ? 'optimal' :
                data.additionalMetrics.muscleOxygen > 50 ? 'good' : 'concern';
        }
        // Hydration insights (from existing data)
        if (data.standardData.vitals.hydration) {
            insights.hydrationStatus = data.standardData.vitals.hydration.level > 85 ? 'optimal' :
                data.standardData.vitals.hydration.level > 70 ? 'good' : 'concern';
        }
        // Thermal insights
        if (data.additionalMetrics.bodyTemperature !== undefined) {
            insights.thermalStatus = data.additionalMetrics.bodyTemperature >= 36.1 &&
                data.additionalMetrics.bodyTemperature <= 37.2 ? 'optimal' :
                data.additionalMetrics.bodyTemperature >= 35.5 &&
                    data.additionalMetrics.bodyTemperature <= 37.8 ? 'good' : 'concern';
        }
        return insights;
    };
    /**
     * Generate comprehensive IoT insights
     */
    IoTIntegrationService.prototype.generateIoTInsights = function () {
        var _this = this;
        // Equipment status
        var allEquipment = Array.from(this.connectedEquipment.values());
        var connectedEquipment = allEquipment.filter(function (e) { return e.connected; });
        var equipmentIssues = [];
        connectedEquipment.forEach(function (equipment) {
            var issues = _this.checkEquipmentIssues(equipment);
            equipmentIssues.push.apply(equipmentIssues, issues);
        });
        var equipmentStatus = {
            connected: connectedEquipment.length,
            total: allEquipment.length,
            issues: equipmentIssues
        };
        // Environmental conditions
        var environmentalConditions = {
            temperature: 0,
            humidity: 0,
            airQuality: 0,
            recommendations: []
        };
        if (this.environmentalData) {
            // Get average values from all sensors
            var tempSensors = this.environmentalData.sensors.filter(function (s) { return s.type === 'temperature'; });
            var humiditySensors = this.environmentalData.sensors.filter(function (s) { return s.type === 'humidity'; });
            var airQualitySensors = this.environmentalData.sensors.filter(function (s) { return s.type === 'air_quality'; });
            if (tempSensors.length > 0) {
                var avgTemp = tempSensors.reduce(function (sum, s) { return sum + (typeof s.value === 'number' ? s.value : 0); }, 0) / tempSensors.length;
                environmentalConditions.temperature = Math.round(avgTemp * 10) / 10;
            }
            if (humiditySensors.length > 0) {
                var avgHumidity = humiditySensors.reduce(function (sum, s) { return sum + (typeof s.value === 'number' ? s.value : 0); }, 0) / humiditySensors.length;
                environmentalConditions.humidity = Math.round(avgHumidity * 10) / 10;
            }
            if (airQualitySensors.length > 0) {
                var avgAirQuality = airQualitySensors.reduce(function (sum, s) { return sum + (typeof s.value === 'number' ? s.value : 0); }, 0) / airQualitySensors.length;
                environmentalConditions.airQuality = Math.round(avgAirQuality * 10) / 10;
            }
            // Generate environmental recommendations
            if (environmentalConditions.temperature < 18 || environmentalConditions.temperature > 24) {
                environmentalConditions.recommendations.push('Temperature outside optimal range for training (18-24°C)');
            }
            if (environmentalConditions.humidity < 40 || environmentalConditions.humidity > 60) {
                environmentalConditions.recommendations.push('Humidity outside optimal range for training (40-60%)');
            }
            if (environmentalConditions.airQuality < 50) {
                environmentalConditions.recommendations.push('Poor air quality may affect performance');
            }
        }
        // Enhanced recovery insights
        var enhancedRecovery = {
            muscleOxygenStatus: 'optimal',
            hydrationStatus: 'optimal',
            thermalStatus: 'optimal'
        };
        if (this.enhancedWearableData) {
            var enhancedInsights = this.generateEnhancedRecoveryInsights(this.enhancedWearableData);
            Object.assign(enhancedRecovery, enhancedInsights);
        }
        // Synchronization quality
        var synchronizationQuality = 'excellent';
        if (this.enhancedWearableData) {
            synchronizationQuality = this.enhancedWearableData.synchronizationQuality;
        }
        return {
            equipmentStatus: equipmentStatus,
            environmentalConditions: environmentalConditions,
            enhancedRecovery: enhancedRecovery,
            synchronizationQuality: synchronizationQuality
        };
    };
    /**
     * Get all connected equipment
     */
    IoTIntegrationService.prototype.getConnectedEquipment = function () {
        return Array.from(this.connectedEquipment.values()).filter(function (e) { return e.connected; });
    };
    /**
     * Get environmental data
     */
    IoTIntegrationService.prototype.getEnvironmentalData = function () {
        return this.environmentalData;
    };
    /**
     * Get enhanced wearable data
     */
    IoTIntegrationService.prototype.getEnhancedWearableData = function () {
        return this.enhancedWearableData;
    };
    return IoTIntegrationService;
}());
exports.IoTIntegrationService = IoTIntegrationService;
exports.iotIntegrationService = IoTIntegrationService.getInstance();
