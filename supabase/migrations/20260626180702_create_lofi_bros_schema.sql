/*
# Create Lofi Bros Database Schema

1. New Tables
- `artists` - Music artists/creators with name and image
- `playlists` - Music playlists with title, description, cover image, artist, and mood category
- `tracks` - Individual songs with title, duration, and associated playlist
- `categories` - Browse categories for the search page (gradient colors for UI)
- `mood_tags` - Mood-based tags (Study, Sleep, Focus, Relax)

2. Relationships
- Tracks belong to playlists (foreign key)
- Playlists have an optional artist reference
- Categories are independent reference data

3. Security
- Enable RLS on all tables
- Allow anon + authenticated full CRUD access (single-tenant, intentionally public data)
- All data is shared/public for the music streaming experience

4. Important Notes
- This is a single-tenant app with no user authentication
- All visitors can read and manage the same shared music library
- Gradient values stored as Tailwind CSS classes for category styling
*/

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Mood tags table
CREATE TABLE IF NOT EXISTS mood_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL UNIQUE,
  is_active boolean DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Categories table (for search/browse page)
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL UNIQUE,
  gradient text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text NOT NULL,
  description text,
  cover_url text NOT NULL,
  plays text,
  tracks_count int DEFAULT 0,
  is_live boolean DEFAULT false,
  mood_tag_id uuid REFERENCES mood_tags(id) ON DELETE SET NULL,
  artist_id uuid REFERENCES artists(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Tracks table
CREATE TABLE IF NOT EXISTS tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text NOT NULL,
  album text,
  duration text NOT NULL,
  plays text,
  playlist_id uuid REFERENCES playlists(id) ON DELETE CASCADE,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

-- Artists policies
DROP POLICY IF EXISTS "anon_select_artists" ON artists;
CREATE POLICY "anon_select_artists" ON artists FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_artists" ON artists;
CREATE POLICY "anon_insert_artists" ON artists FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_artists" ON artists;
CREATE POLICY "anon_update_artists" ON artists FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_artists" ON artists;
CREATE POLICY "anon_delete_artists" ON artists FOR DELETE
  TO anon, authenticated USING (true);

-- Mood tags policies
DROP POLICY IF EXISTS "anon_select_mood_tags" ON mood_tags;
CREATE POLICY "anon_select_mood_tags" ON mood_tags FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_mood_tags" ON mood_tags;
CREATE POLICY "anon_insert_mood_tags" ON mood_tags FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_mood_tags" ON mood_tags;
CREATE POLICY "anon_update_mood_tags" ON mood_tags FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_mood_tags" ON mood_tags;
CREATE POLICY "anon_delete_mood_tags" ON mood_tags FOR DELETE
  TO anon, authenticated USING (true);

-- Categories policies
DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_categories" ON categories;
CREATE POLICY "anon_insert_categories" ON categories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_categories" ON categories;
CREATE POLICY "anon_update_categories" ON categories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_categories" ON categories;
CREATE POLICY "anon_delete_categories" ON categories FOR DELETE
  TO anon, authenticated USING (true);

-- Playlists policies
DROP POLICY IF EXISTS "anon_select_playlists" ON playlists;
CREATE POLICY "anon_select_playlists" ON playlists FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_playlists" ON playlists;
CREATE POLICY "anon_insert_playlists" ON playlists FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_playlists" ON playlists;
CREATE POLICY "anon_update_playlists" ON playlists FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_playlists" ON playlists;
CREATE POLICY "anon_delete_playlists" ON playlists FOR DELETE
  TO anon, authenticated USING (true);

-- Tracks policies
DROP POLICY IF EXISTS "anon_select_tracks" ON tracks;
CREATE POLICY "anon_select_tracks" ON tracks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_tracks" ON tracks;
CREATE POLICY "anon_insert_tracks" ON tracks FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_tracks" ON tracks;
CREATE POLICY "anon_update_tracks" ON tracks FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_tracks" ON tracks;
CREATE POLICY "anon_delete_tracks" ON tracks FOR DELETE
  TO anon, authenticated USING (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_playlists_mood_tag ON playlists(mood_tag_id);
CREATE INDEX IF NOT EXISTS idx_tracks_playlist ON tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_mood_tags_sort ON mood_tags(sort_order);
