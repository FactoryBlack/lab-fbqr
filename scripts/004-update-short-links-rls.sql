-- Add policies for updating and deleting short links
-- This ensures users can only modify their own entries.

CREATE POLICY "Users can update their own short links"
  ON short_links FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own short links"
  ON short_links FOR DELETE
  USING (auth.uid() = user_id);
