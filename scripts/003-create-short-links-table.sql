CREATE TABLE IF NOT EXISTS short_links (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  short_code TEXT UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add row-level security
ALTER TABLE short_links ENABLE ROW LEVEL SECURITY;

-- Policies for short_links
CREATE POLICY "Users can insert their own short links"
  ON short_links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own short links"
  ON short_links FOR SELECT
  USING (auth.uid() = user_id);
