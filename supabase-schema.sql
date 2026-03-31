-- =============================================
-- RetailMind AI — Supabase SQL Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- =============================================

-- Chat Sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text DEFAULT 'New Chat',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their sessions" ON chat_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  role text CHECK (role IN ('user', 'assistant')) NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their messages" ON chat_messages
  FOR ALL USING (
    session_id IN (
      SELECT id FROM chat_sessions WHERE user_id = auth.uid()
    )
  );

-- Saved Reports
CREATE TABLE IF NOT EXISTS saved_reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  report_type text CHECK (report_type IN ('demand', 'pricing', 'competitor', 'trend')) NOT NULL,
  product_name text NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE saved_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their reports" ON saved_reports
  FOR ALL USING (auth.uid() = user_id);

-- Watchlist (optional V2 feature)
CREATE TABLE IF NOT EXISTS watchlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their watchlist" ON watchlist
  FOR ALL USING (auth.uid() = user_id);
