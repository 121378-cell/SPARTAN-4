"use strict";
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
exports.realtime = exports.db = exports.auth = exports.supabase = void 0;
// Supabase configuration for SPARTAN 4
var supabase_js_1 = require("@supabase/supabase-js");
// Supabase configuration
var supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
var supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    realtime: {
        params: {
            eventsPerSecond: 2, // Limit for free tier
        },
    },
});
// Auth helpers
exports.auth = {
    signUp: function (email, password, userData) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, exports.supabase.auth.signUp({
                        email: email,
                        password: password,
                        options: {
                            data: userData,
                        },
                    })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    return [2 /*return*/, { data: data, error: error }];
            }
        });
    }); },
    signIn: function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, exports.supabase.auth.signInWithPassword({
                        email: email,
                        password: password,
                    })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    return [2 /*return*/, { data: data, error: error }];
            }
        });
    }); },
    signOut: function () { return __awaiter(void 0, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.supabase.auth.signOut()];
                case 1:
                    error = (_a.sent()).error;
                    return [2 /*return*/, { error: error }];
            }
        });
    }); },
    getCurrentUser: function () {
        return exports.supabase.auth.getUser();
    },
    onAuthStateChange: function (callback) {
        return exports.supabase.auth.onAuthStateChange(callback);
    },
};
// Database operations
exports.db = {
    // Users
    createUser: function (userData) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, exports.supabase
                        .from('users')
                        .insert(userData)
                        .select()
                        .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    return [2 /*return*/, { data: data, error: error }];
            }
        });
    }); },
    getUser: function (userId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, exports.supabase
                        .from('users')
                        .select('*')
                        .eq('id', userId)
                        .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    return [2 /*return*/, { data: data, error: error }];
            }
        });
    }); },
    updateUser: function (userId, updates) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, exports.supabase
                        .from('users')
                        .update(updates)
                        .eq('id', userId)
                        .select()
                        .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    return [2 /*return*/, { data: data, error: error }];
            }
        });
    }); },
    // Workout Plans
    createWorkoutPlan: function (planData) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, exports.supabase
                        .from('workout_plans')
                        .insert(planData)
                        .select()
                        .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    return [2 /*return*/, { data: data, error: error }];
            }
        });
    }); },
    getUserWorkoutPlans: function (userId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, exports.supabase
                        .from('workout_plans')
                        .select('*')
                        .eq('user_id', userId)
                        .order('created_at', { ascending: false })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    return [2 /*return*/, { data: data, error: error }];
            }
        });
    }); },
    getWorkoutPlan: function (planId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, exports.supabase
                        .from('workout_plans')
                        .select('*')
                        .eq('id', planId)
                        .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    return [2 /*return*/, { data: data, error: error }];
            }
        });
    }); },
    deleteWorkoutPlan: function (planId) { return __awaiter(void 0, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.supabase
                        .from('workout_plans')
                        .delete()
                        .eq('id', planId)];
                case 1:
                    error = (_a.sent()).error;
                    return [2 /*return*/, { error: error }];
            }
        });
    }); },
    // Progress tracking
    addProgressEntry: function (progressData) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, exports.supabase
                        .from('progress_data')
                        .insert(progressData)
                        .select()
                        .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    return [2 /*return*/, { data: data, error: error }];
            }
        });
    }); },
    getUserProgress: function (userId_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([userId_1], args_1, true), void 0, function (userId, limit) {
            var _a, data, error;
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, exports.supabase
                            .from('progress_data')
                            .select("\n        *,\n        workout_plans(name, difficulty)\n      ")
                            .eq('user_id', userId)
                            .order('completed_at', { ascending: false })
                            .limit(limit)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, { data: data, error: error }];
                }
            });
        });
    },
    getWorkoutProgress: function (workoutId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, exports.supabase
                        .from('progress_data')
                        .select('*')
                        .eq('workout_id', workoutId)
                        .order('completed_at', { ascending: false })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    return [2 /*return*/, { data: data, error: error }];
            }
        });
    }); },
};
// Real-time subscriptions (free tier: limited)
exports.realtime = {
    subscribeToUserWorkouts: function (userId, callback) {
        return exports.supabase
            .channel("user_workouts_".concat(userId))
            .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'workout_plans',
            filter: "user_id=eq.".concat(userId),
        }, callback)
            .subscribe();
    },
    subscribeToProgress: function (userId, callback) {
        return exports.supabase
            .channel("user_progress_".concat(userId))
            .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'progress_data',
            filter: "user_id=eq.".concat(userId),
        }, callback)
            .subscribe();
    },
};
exports.default = exports.supabase;
