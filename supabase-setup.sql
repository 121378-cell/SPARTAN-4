-- Supabase SQL setup for SPARTAN 4
-- Run these commands in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  fitness_level TEXT NOT NULL DEFAULT 'beginner',
  goals TEXT[] DEFAULT '{}',
  age INTEGER,
  weight DECIMAL,
  height DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout plans table
CREATE TABLE workout_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  exercises JSONB NOT NULL DEFAULT '[]',
  duration INTEGER NOT NULL, -- in minutes
  difficulty TEXT NOT NULL DEFAULT 'intermediate',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progress tracking table
CREATE TABLE progress_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  workout_id UUID REFERENCES workout_plans(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration INTEGER, -- actual workout duration in minutes
  notes TEXT
);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_data ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Workout plans policies
CREATE POLICY "Users can view own workout plans" ON workout_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own workout plans" ON workout_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workout plans" ON workout_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workout plans" ON workout_plans FOR DELETE USING (auth.uid() = user_id);

-- Progress data policies
CREATE POLICY "Users can view own progress" ON progress_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own progress" ON progress_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON progress_data FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress" ON progress_data FOR DELETE USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX idx_workout_plans_user_id ON workout_plans(user_id);
CREATE INDEX idx_workout_plans_created_at ON workout_plans(created_at);
CREATE INDEX idx_progress_data_user_id ON progress_data(user_id);
CREATE INDEX idx_progress_data_workout_id ON progress_data(workout_id);
CREATE INDEX idx_progress_data_completed_at ON progress_data(completed_at);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', 'User'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Views for analytics (optional)
CREATE VIEW user_stats AS
SELECT 
  u.id,
  u.name,
  u.fitness_level,
  COUNT(DISTINCT wp.id) as total_workouts,
  COUNT(DISTINCT pd.id) as completed_sessions,
  AVG(pd.duration) as avg_workout_duration,
  MAX(pd.completed_at) as last_workout
FROM users u
LEFT JOIN workout_plans wp ON u.id = wp.user_id
LEFT JOIN progress_data pd ON u.id = pd.user_id
GROUP BY u.id, u.name, u.fitness_level;

-- Grant access to authenticated users
GRANT SELECT ON user_stats TO authenticated;