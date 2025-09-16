// Supabase configuration for SPARTAN 4
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
          fitness_level: string;
          goals: string[];
          age?: number;
          weight?: number;
          height?: number;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          fitness_level: string;
          goals: string[];
          age?: number;
          weight?: number;
          height?: number;
        };
        Update: {
          name?: string;
          fitness_level?: string;
          goals?: string[];
          age?: number;
          weight?: number;
          height?: number;
        };
      };
      workout_plans: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          exercises: any[]; // JSON
          duration: number;
          difficulty: string;
          created_at: string;
          tags: string[];
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          exercises: any[];
          duration: number;
          difficulty: string;
          tags?: string[];
        };
        Update: {
          name?: string;
          exercises?: any[];
          duration?: number;
          difficulty?: string;
          tags?: string[];
        };
      };
      progress_data: {
        Row: {
          id: string;
          user_id: string;
          workout_id: string;
          completed_at: string;
          duration?: number;
          notes?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          workout_id: string;
          duration?: number;
          notes?: string;
        };
        Update: {
          duration?: number;
          notes?: string;
        };
      };
    };
  };
}

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database operations
export const db = {
  // Users
  createUser: async (userData: Database['public']['Tables']['users']['Insert']) => {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    return { data, error };
  },

  getUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  updateUser: async (userId: string, updates: Database['public']['Tables']['users']['Update']) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Workout Plans
  createWorkoutPlan: async (planData: Database['public']['Tables']['workout_plans']['Insert']) => {
    const { data, error } = await supabase
      .from('workout_plans')
      .insert(planData)
      .select()
      .single();
    return { data, error };
  },

  getUserWorkoutPlans: async (userId: string) => {
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  getWorkoutPlan: async (planId: string) => {
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('id', planId)
      .single();
    return { data, error };
  },

  deleteWorkoutPlan: async (planId: string) => {
    const { error } = await supabase
      .from('workout_plans')
      .delete()
      .eq('id', planId);
    return { error };
  },

  // Progress tracking
  addProgressEntry: async (progressData: Database['public']['Tables']['progress_data']['Insert']) => {
    const { data, error } = await supabase
      .from('progress_data')
      .insert(progressData)
      .select()
      .single();
    return { data, error };
  },

  getUserProgress: async (userId: string, limit = 50) => {
    const { data, error } = await supabase
      .from('progress_data')
      .select(`
        *,
        workout_plans(name, difficulty)
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  getWorkoutProgress: async (workoutId: string) => {
    const { data, error } = await supabase
      .from('progress_data')
      .select('*')
      .eq('workout_id', workoutId)
      .order('completed_at', { ascending: false });
    return { data, error };
  },
};

// Real-time subscriptions (free tier: limited)
export const realtime = {
  subscribeToUserWorkouts: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`user_workouts_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workout_plans',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeToProgress: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`user_progress_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'progress_data',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },
};

export default supabase;