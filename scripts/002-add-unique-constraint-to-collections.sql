-- This script adds a UNIQUE constraint to the user_id column in the qr_collections table.
-- This is necessary for the "upsert" functionality to work correctly, ensuring each
-- user has only one collection record.

-- First, let's handle any potential duplicate user_id entries that might exist
-- by keeping only the most recently updated record for each user.
WITH duplicates AS (
  SELECT id, user_id, row_number() OVER(PARTITION BY user_id ORDER BY updated_at DESC) as rn
  FROM qr_collections
)
DELETE FROM qr_collections
WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

-- Now, add the UNIQUE constraint to the user_id column.
-- We need to drop the constraint first in case it was added in a partial success state.
ALTER TABLE qr_collections DROP CONSTRAINT IF EXISTS qr_collections_user_id_key;
ALTER TABLE qr_collections
ADD CONSTRAINT qr_collections_user_id_key UNIQUE (user_id);
