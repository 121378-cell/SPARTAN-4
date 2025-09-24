"use strict";
/**
 * Biomechanical Overload Detection AI System
 * Advanced analysis of training metrics to detect muscle and joint overload patterns
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
exports.BiomechanicalOverloadAI = void 0;
var BiomechanicalOverloadAI = /** @class */ (function () {
    function BiomechanicalOverloadAI() {
    }
    /**
     * Main analysis function that integrates all data sources
     */
    BiomechanicalOverloadAI.prototype.analyzeOverloadRisk = function (trainingMetrics, wearableData, exerciseHistory) {
        return __awaiter(this, void 0, void 0, function () {
            var overloadRisks, correctiveProtocols, loadManagement;
            return __generator(this, function (_a) {
                console.log('🔬 Iniciando análisis biomecánico avanzado...');
                overloadRisks = this.detectOverloadRisks(exerciseHistory, wearableData);
                correctiveProtocols = this.generateCorrectiveProtocols(overloadRisks);
                loadManagement = this.createLoadManagementStrategy(overloadRisks, trainingMetrics);
                return [2 /*return*/, {
                        overloadRisks: overloadRisks,
                        correctiveProtocols: correctiveProtocols,
                        loadManagement: loadManagement
                    }];
            });
        });
    };
    /**
     * Detect overload risks based on exercise data and wearable metrics
     */
    BiomechanicalOverloadAI.prototype.detectOverloadRisks = function (exerciseHistory, wearableData) {
        var risks = [];
        // Analyze each body region
        var bodyRegions = [
            { name: 'hombros', exercises: ['overhead press', 'bench press', 'lateral raise'] },
            { name: 'columna_lumbar', exercises: ['deadlift', 'squat', 'row'] },
            { name: 'caderas', exercises: ['squat', 'deadlift', 'lunge'] },
            { name: 'rodillas', exercises: ['squat', 'lunge', 'leg press'] }
        ];
        var _loop_1 = function (region) {
            var relevantExercises = exerciseHistory.filter(function (ex) {
                return region.exercises.some(function (regEx) { return ex.exerciseName.toLowerCase().includes(regEx); });
            });
            if (relevantExercises.length > 0) {
                var riskScore = this_1.calculateRegionalRiskScore(relevantExercises, wearableData);
                if (riskScore > 30) {
                    var risk = {
                        bodyPart: region.name,
                        riskLevel: this_1.categorizeRiskLevel(riskScore),
                        riskScore: riskScore,
                        primaryCause: this_1.identifyPrimaryCause(relevantExercises, wearableData),
                        secondaryCauses: this_1.identifySecondaryCauses(relevantExercises),
                        adaptationStatus: this_1.assessAdaptationStatus(wearableData),
                        timeToInjury: this_1.estimateTimeToInjury(riskScore),
                        confidenceLevel: 85
                    };
                    risks.push(risk);
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, bodyRegions_1 = bodyRegions; _i < bodyRegions_1.length; _i++) {
            var region = bodyRegions_1[_i];
            _loop_1(region);
        }
        return risks.sort(function (a, b) { return b.riskScore - a.riskScore; });
    };
    /**
     * Calculate risk score for a specific body region
     */
    BiomechanicalOverloadAI.prototype.calculateRegionalRiskScore = function (exercises, wearableData) {
        var riskScore = 0;
        // High RPE factor (excessive intensity)
        var avgRPE = exercises.reduce(function (sum, ex) { return sum + ex.rpe; }, 0) / exercises.length;
        if (avgRPE > 8.5)
            riskScore += 25;
        else if (avgRPE > 7.5)
            riskScore += 15;
        // Low RIR factor (insufficient reserve)
        var avgRIR = exercises.reduce(function (sum, ex) { return sum + ex.rir; }, 0) / exercises.length;
        if (avgRIR < 1)
            riskScore += 25;
        else if (avgRIR < 2)
            riskScore += 15;
        // Form quality deterioration
        var avgForm = exercises.reduce(function (sum, ex) { return sum + ex.formQuality; }, 0) / exercises.length;
        if (avgForm < 6)
            riskScore += 20;
        else if (avgForm < 7)
            riskScore += 10;
        // Volume progression too rapid
        var volumeIncrease = this.calculateVolumeIncrease(exercises);
        if (volumeIncrease > 20)
            riskScore += 20;
        else if (volumeIncrease > 10)
            riskScore += 10;
        // Recovery deficits
        var recoveryScore = wearableData.recovery.recoveryScore;
        if (recoveryScore < 60)
            riskScore += 20;
        else if (recoveryScore < 70)
            riskScore += 10;
        // HRV decline
        if (wearableData.recovery.hrv < 45)
            riskScore += 15;
        else if (wearableData.recovery.hrv < 55)
            riskScore += 8;
        // Sleep quality impact
        if (wearableData.sleep.quality < 70)
            riskScore += 15;
        else if (wearableData.sleep.quality < 80)
            riskScore += 8;
        return Math.min(100, riskScore);
    };
    BiomechanicalOverloadAI.prototype.calculateVolumeIncrease = function (exercises) {
        if (exercises.length < 2)
            return 0;
        var firstHalf = exercises.slice(0, Math.floor(exercises.length / 2));
        var secondHalf = exercises.slice(Math.floor(exercises.length / 2));
        var firstVolume = firstHalf.reduce(function (sum, ex) { return sum + (ex.actualWeight * ex.completedSets); }, 0);
        var secondVolume = secondHalf.reduce(function (sum, ex) { return sum + (ex.actualWeight * ex.completedSets); }, 0);
        return ((secondVolume - firstVolume) / firstVolume) * 100;
    };
    BiomechanicalOverloadAI.prototype.categorizeRiskLevel = function (score) {
        if (score >= 80)
            return 'crítico';
        if (score >= 60)
            return 'alto';
        if (score >= 40)
            return 'moderado';
        return 'bajo';
    };
    BiomechanicalOverloadAI.prototype.identifyPrimaryCause = function (exercises, wearableData) {
        var avgRPE = exercises.reduce(function (sum, ex) { return sum + ex.rpe; }, 0) / exercises.length;
        var avgRIR = exercises.reduce(function (sum, ex) { return sum + ex.rir; }, 0) / exercises.length;
        var avgForm = exercises.reduce(function (sum, ex) { return sum + ex.formQuality; }, 0) / exercises.length;
        if (avgRPE > 8.5 && avgRIR < 1)
            return 'Intensidad excesiva y fatiga acumulada';
        if (avgForm < 6)
            return 'Deterioro de la técnica por sobrecarga';
        if (wearableData.recovery.recoveryScore < 60)
            return 'Déficit de recuperación sistémica';
        if (this.calculateVolumeIncrease(exercises) > 20)
            return 'Progresión de volumen demasiado rápida';
        return 'Sobrecarga multifactorial';
    };
    BiomechanicalOverloadAI.prototype.identifySecondaryCauses = function (exercises) {
        var causes = [];
        var inconsistentPerformance = exercises.some(function (ex, i) {
            return i > 0 && Math.abs(ex.rpe - exercises[i - 1].rpe) > 2;
        });
        if (inconsistentPerformance)
            causes.push('Variabilidad excesiva en el rendimiento');
        var frequentDeload = exercises.filter(function (ex) { return ex.actualWeight < ex.plannedWeight; }).length;
        if (frequentDeload > exercises.length * 0.3) {
            causes.push('Necesidad frecuente de reducir cargas');
        }
        return causes;
    };
    BiomechanicalOverloadAI.prototype.assessAdaptationStatus = function (wearableData) {
        var recoveryScore = wearableData.recovery.recoveryScore;
        var hrv = wearableData.recovery.hrv;
        if (recoveryScore < 60 && hrv < 45)
            return 'sobrecargado';
        if (recoveryScore > 85 && hrv > 65)
            return 'adaptándose';
        if (recoveryScore >= 70 && recoveryScore <= 85)
            return 'en_recuperación';
        return 'estancado';
    };
    BiomechanicalOverloadAI.prototype.estimateTimeToInjury = function (riskScore) {
        if (riskScore >= 90)
            return 7;
        if (riskScore >= 80)
            return 14;
        if (riskScore >= 70)
            return 21;
        if (riskScore >= 60)
            return 35;
        return 56;
    };
    /**
     * Generate corrective protocols for detected risks
     */
    BiomechanicalOverloadAI.prototype.generateCorrectiveProtocols = function (risks) {
        var _this = this;
        return risks.map(function (risk) { return _this.createProtocolForRisk(risk); });
    };
    BiomechanicalOverloadAI.prototype.createProtocolForRisk = function (risk) {
        var exercises = this.getCorrectiveExercises(risk.bodyPart, risk.riskLevel);
        return {
            priority: risk.riskLevel === 'crítico' ? 'inmediata' :
                risk.riskLevel === 'alto' ? 'alta' :
                    risk.riskLevel === 'moderado' ? 'media' : 'baja',
            type: this.determineProtocolType(risk),
            targetStructure: risk.bodyPart,
            exercises: exercises,
            expectedTimeline: this.getExpectedTimeline(risk.riskLevel),
            biomechanicalGoals: this.getBiomechanicalGoals(risk.bodyPart)
        };
    };
    BiomechanicalOverloadAI.prototype.getCorrectiveExercises = function (bodyPart, riskLevel) {
        var exerciseDatabase = {
            'hombros': [
                {
                    name: "Movilización capsular posterior",
                    category: "movilización",
                    description: "Estiramiento suave de la cápsula posterior del hombro",
                    biomechanicalPurpose: "Restaurar flexibilidad capsular y reducir tensión",
                    targetTissues: ["cápsula articular", "deltoides posterior"],
                    dosage: { sets: 3, reps: "30 seg", hold: 30, rest: 30, frequency: "2x/día" },
                    equipment: "toalla o banda"
                },
                {
                    name: "Fortalecimiento del manguito rotador",
                    category: "fortalecimiento",
                    description: "Ejercicios de rotación externa con resistencia",
                    biomechanicalPurpose: "Restaurar equilibrio muscular y estabilidad dinámica",
                    targetTissues: ["infraespinoso", "redondo menor", "supraespinoso"],
                    dosage: { sets: 3, reps: "15", rest: 60, frequency: "día alternos" },
                    equipment: "banda elástica"
                }
            ],
            'columna_lumbar': [
                {
                    name: "Activación del core profundo",
                    category: "activación",
                    description: "Respiración diafragmática con activación del transverso",
                    biomechanicalPurpose: "Restaurar estabilidad segmentaria lumbar",
                    targetTissues: ["transverso del abdomen", "multífidos", "diafragma"],
                    dosage: { sets: 3, reps: "10", hold: 10, rest: 45, frequency: "diario" },
                    equipment: "ninguno"
                },
                {
                    name: "Movilización de caderas",
                    category: "movilización",
                    description: "Flexión y extensión controlada de caderas",
                    biomechanicalPurpose: "Reducir compensación lumbar por rigidez de cadera",
                    targetTissues: ["flexores de cadera", "glúteos", "isquiotibiales"],
                    dosage: { sets: 2, reps: "15", rest: 30, frequency: "2x/día" },
                    equipment: "ninguno"
                }
            ],
            'caderas': [
                {
                    name: "Activación del glúteo medio",
                    category: "activación",
                    description: "Abducción lateral con resistencia",
                    biomechanicalPurpose: "Mejorar estabilidad pélvica y control de cadera",
                    targetTissues: ["glúteo medio", "glúteo menor"],
                    dosage: { sets: 3, reps: "15", rest: 45, frequency: "día alternos" },
                    equipment: "banda elástica"
                }
            ],
            'rodillas': [
                {
                    name: "Fortalecimiento del glúteo mayor",
                    category: "fortalecimiento",
                    description: "Puentes de glúteo con progresión",
                    biomechanicalPurpose: "Prevenir valgo de rodilla y mejorar control de cadera",
                    targetTissues: ["glúteo mayor", "isquiotibiales"],
                    dosage: { sets: 3, reps: "15", rest: 45, frequency: "día alternos" },
                    equipment: "ninguno"
                },
                {
                    name: "Estiramiento del cuádriceps",
                    category: "movilización",
                    description: "Estiramiento en posición de pie con soporte",
                    biomechanicalPurpose: "Reducir tensión anterior y mejorar flexibilidad",
                    targetTissues: ["recto femoral", "vasto lateral"],
                    dosage: { sets: 3, reps: "30 seg", hold: 30, rest: 30, frequency: "2x/día" },
                    equipment: "ninguno"
                }
            ]
        };
        return exerciseDatabase[bodyPart] || [];
    };
    BiomechanicalOverloadAI.prototype.determineProtocolType = function (risk) {
        if (risk.primaryCause.includes('técnica') || risk.primaryCause.includes('forma'))
            return 'control_motor';
        if (risk.primaryCause.includes('recuperación') || risk.primaryCause.includes('fatiga'))
            return 'recuperación';
        if (risk.primaryCause.includes('intensidad'))
            return 'estabilidad';
        return 'movilidad';
    };
    BiomechanicalOverloadAI.prototype.getExpectedTimeline = function (riskLevel) {
        switch (riskLevel) {
            case 'crítico': return '2-4 semanas para mejora inicial';
            case 'alto': return '3-6 semanas para resolución';
            case 'moderado': return '4-8 semanas para normalización';
            default: return '2-4 semanas para prevención';
        }
    };
    BiomechanicalOverloadAI.prototype.getBiomechanicalGoals = function (bodyPart) {
        var goals = {
            'hombros': [
                "Restaurar rango de movimiento completo",
                "Mejorar estabilidad escapular",
                "Equilibrar fuerza rotacional"
            ],
            'columna_lumbar': [
                "Optimizar activación del core",
                "Mejorar movilidad de caderas",
                "Reducir compensaciones posturales"
            ],
            'caderas': [
                "Restaurar movilidad en todos los planos",
                "Fortalecer estabilizadores pélvicos",
                "Mejorar control neuromuscular"
            ],
            'rodillas': [
                "Optimizar alineación durante movimientos",
                "Fortalecer cadena posterior",
                "Mejorar control excéntrico"
            ]
        };
        return goals[bodyPart] || ["Optimizar función biomecánica"];
    };
    /**
     * Create load management strategy
     */
    BiomechanicalOverloadAI.prototype.createLoadManagementStrategy = function (risks, trainingMetrics) {
        var maxRisk = Math.max.apply(Math, __spreadArray(__spreadArray([], risks.map(function (r) { return r.riskScore; }), false), [0], false));
        var phase;
        var loadReduction = 0;
        if (maxRisk > 80) {
            phase = 'descarga';
            loadReduction = 40;
        }
        else if (maxRisk > 60) {
            phase = 'adaptación';
            loadReduction = 20;
        }
        else if (maxRisk > 40) {
            phase = 'mantenimiento';
            loadReduction = 10;
        }
        else {
            phase = 'progresión';
            loadReduction = 0;
        }
        return {
            phase: phase,
            durationWeeks: this.calculatePhaseDuration(maxRisk),
            loadReduction: loadReduction,
            recoveryEnhancement: this.getRecoveryStrategies(risks),
            monitoringMarkers: this.getMonitoringMarkers()
        };
    };
    BiomechanicalOverloadAI.prototype.calculatePhaseDuration = function (maxRisk) {
        if (maxRisk > 80)
            return 4;
        if (maxRisk > 60)
            return 6;
        if (maxRisk > 40)
            return 8;
        return 4;
    };
    BiomechanicalOverloadAI.prototype.getRecoveryStrategies = function (risks) {
        var strategies = [
            "Optimización del sueño (7-9 horas)",
            "Técnicas de manejo del estrés",
            "Nutrición antiinflamatoria",
            "Hidratación adecuada"
        ];
        var highRiskCount = risks.filter(function (r) { return r.riskLevel === 'alto' || r.riskLevel === 'crítico'; }).length;
        if (highRiskCount > 0) {
            strategies.push("Terapia de frío/calor", "Masaje terapéutico", "Liberación miofascial");
        }
        return strategies;
    };
    BiomechanicalOverloadAI.prototype.getMonitoringMarkers = function () {
        return [
            "Niveles de dolor (escala 1-10)",
            "Calidad del sueño",
            "Variabilidad de la frecuencia cardíaca",
            "Puntuación RPE en ejercicios",
            "Rango de movimiento articular",
            "Fuerza muscular funcional"
        ];
    };
    return BiomechanicalOverloadAI;
}());
exports.BiomechanicalOverloadAI = BiomechanicalOverloadAI;
