-- Supabase Datenbank Schema
-- Führe diese SQL-Befehle in der Supabase SQL Editor aus

-- Users Tabelle
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- User Profiles Tabelle
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL,
  interests TEXT[] DEFAULT '{}',
  height TEXT NOT NULL,
  children TEXT NOT NULL,
  education TEXT NOT NULL,
  languages TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  avatar TEXT NOT NULL,
  online BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  seeking TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Messages Tabelle
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_from_user_id ON messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_to_user_id ON messages(to_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Row Level Security (RLS) aktivieren
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies für Users (jeder kann lesen, aber nur eigene Daten ändern)
CREATE POLICY "Users sind öffentlich lesbar" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users können sich selbst erstellen" ON users
  FOR INSERT WITH CHECK (true);

-- Policies für User Profiles
CREATE POLICY "User Profiles sind öffentlich lesbar" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "User können ihr eigenes Profil erstellen" ON user_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "User können ihr eigenes Profil aktualisieren" ON user_profiles
  FOR UPDATE USING (true);

-- Policies für Messages
CREATE POLICY "User können ihre eigenen Nachrichten lesen" ON messages
  FOR SELECT USING (
    auth.uid()::text = from_user_id::text OR 
    auth.uid()::text = to_user_id::text
  );

CREATE POLICY "User können Nachrichten erstellen" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "User können ihre empfangenen Nachrichten als gelesen markieren" ON messages
  FOR UPDATE USING (auth.uid()::text = to_user_id::text);

