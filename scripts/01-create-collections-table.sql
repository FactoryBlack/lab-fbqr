-- This script creates the table for storing user-specific QR code collections.
-- It should be run on your Supabase SQL editor.
-- The user_id column links to the authenticated user.

CREATE TABLE IF NOT EXISTS qr_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  -- Let's just store the whole array for simplicity. A more complex app might normalize this.
  qr_codes JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: A function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if it exists to avoid errors on re-run
DROP TRIGGER IF EXISTS update_qr_collections_updated_at ON qr_collections;

CREATE TRIGGER update_qr_collections_updated_at
BEFORE UPDATE ON qr_collections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
