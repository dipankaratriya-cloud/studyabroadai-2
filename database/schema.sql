-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Chat Sessions Table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  student_profile JSONB,
  messages JSONB[] DEFAULT ARRAY[]::JSONB[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived'))
);

-- Universities Cache Table
CREATE TABLE IF NOT EXISTS universities_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  ranking INTEGER,
  programs JSONB[] DEFAULT ARRAY[]::JSONB[],
  tuition_fees JSONB,
  admission_requirements JSONB,
  deadlines JSONB,
  scholarships JSONB[] DEFAULT ARRAY[]::JSONB[],
  acceptance_rate DECIMAL(5,2),
  location JSONB,
  source_url TEXT,
  last_fetched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Countries Cache Table
CREATE TABLE IF NOT EXISTS countries_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  visa_requirements JSONB,
  cost_of_living JSONB,
  post_study_work_rights JSONB,
  language_requirements JSONB,
  popular_cities JSONB[] DEFAULT ARRAY[]::JSONB[],
  job_market_data JSONB,
  climate TEXT,
  source_urls TEXT[],
  last_fetched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Programs Cache Table
CREATE TABLE IF NOT EXISTS programs_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID REFERENCES universities_cache(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  degree_level TEXT CHECK (degree_level IN ('Undergraduate', 'Masters', 'PhD', 'Diploma')),
  field TEXT,
  duration_months INTEGER,
  tuition_fees JSONB,
  curriculum JSONB,
  career_outcomes JSONB,
  application_deadline DATE,
  requirements JSONB,
  last_fetched TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved Comparisons Table
CREATE TABLE IF NOT EXISTS saved_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  comparison_type TEXT CHECK (comparison_type IN ('university', 'country', 'program')),
  items JSONB[] DEFAULT ARRAY[]::JSONB[],
  chart_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_sessions_user ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_updated ON chat_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON chat_sessions(status);

CREATE INDEX IF NOT EXISTS idx_universities_country ON universities_cache(country);
CREATE INDEX IF NOT EXISTS idx_universities_ranking ON universities_cache(ranking);
CREATE INDEX IF NOT EXISTS idx_universities_fetched ON universities_cache(last_fetched);
CREATE INDEX IF NOT EXISTS idx_universities_name ON universities_cache(name);

CREATE INDEX IF NOT EXISTS idx_programs_university ON programs_cache(university_id);
CREATE INDEX IF NOT EXISTS idx_programs_field ON programs_cache(field);
CREATE INDEX IF NOT EXISTS idx_programs_level ON programs_cache(degree_level);

CREATE INDEX IF NOT EXISTS idx_countries_name ON countries_cache(name);
CREATE INDEX IF NOT EXISTS idx_countries_fetched ON countries_cache(last_fetched);

CREATE INDEX IF NOT EXISTS idx_comparisons_user ON saved_comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_comparisons_session ON saved_comparisons(session_id);
CREATE INDEX IF NOT EXISTS idx_comparisons_type ON saved_comparisons(comparison_type);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_comparisons ENABLE ROW LEVEL SECURITY;

-- Chat Sessions Policies
CREATE POLICY "Users can view their own chat sessions"
  ON chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions"
  ON chat_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions"
  ON chat_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Saved Comparisons Policies
CREATE POLICY "Users can view their own comparisons"
  ON saved_comparisons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own comparisons"
  ON saved_comparisons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comparisons"
  ON saved_comparisons FOR DELETE
  USING (auth.uid() = user_id);

-- Cache tables are public (read-only for authenticated users)
-- Service role will write to these tables
ALTER TABLE universities_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view universities cache"
  ON universities_cache FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view countries cache"
  ON countries_cache FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view programs cache"
  ON programs_cache FOR SELECT
  TO authenticated
  USING (true);

-- Functions

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for chat_sessions
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comment on tables
COMMENT ON TABLE chat_sessions IS 'Stores chat conversations with AI advisor including full message history';
COMMENT ON TABLE universities_cache IS 'Caches university data fetched from external sources';
COMMENT ON TABLE countries_cache IS 'Caches country information for study abroad';
COMMENT ON TABLE programs_cache IS 'Caches specific program details for universities';
COMMENT ON TABLE saved_comparisons IS 'User-saved comparisons of universities, countries, or programs';
