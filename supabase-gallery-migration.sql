-- Migration: Bildergalerie für Profile
-- Führe diese SQL-Befehle in der Supabase SQL Editor aus

-- Tabelle für Galeriebilder
CREATE TABLE IF NOT EXISTS profile_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id INTEGER REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL, -- Pfad im Storage
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_profile_gallery_profile_id ON profile_gallery(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_gallery_user_id ON profile_gallery(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_gallery_display_order ON profile_gallery(display_order);

-- Row Level Security aktivieren
ALTER TABLE profile_gallery ENABLE ROW LEVEL SECURITY;

-- Policies für Galeriebilder
CREATE POLICY "Galeriebilder sind öffentlich lesbar" ON profile_gallery
  FOR SELECT USING (true);

CREATE POLICY "User können ihre eigenen Galeriebilder erstellen" ON profile_gallery
  FOR INSERT WITH CHECK (true);

CREATE POLICY "User können ihre eigenen Galeriebilder aktualisieren" ON profile_gallery
  FOR UPDATE USING (true);

CREATE POLICY "User können ihre eigenen Galeriebilder löschen" ON profile_gallery
  FOR DELETE USING (true);

