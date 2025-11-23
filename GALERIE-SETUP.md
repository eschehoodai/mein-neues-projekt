# Bildergalerie Setup Anleitung

**⚠️ WICHTIG:** Diese Schritte müssen ausgeführt werden, bevor die Bildergalerie funktioniert!

## 1. Datenbank-Migration ausführen

1. Gehe zu deinem Supabase Dashboard (https://supabase.com/dashboard)
2. Wähle dein Projekt aus
3. Klicke auf **"SQL Editor"** im linken Menü
4. Klicke auf **"New query"** (oder das "+" Symbol)
5. Öffne die Datei `supabase-gallery-migration.sql` in diesem Projekt
6. Kopiere den **gesamten Inhalt** der Datei
7. Füge ihn in den SQL Editor ein
8. Klicke auf **"Run"** (oder drücke `Ctrl+Enter` / `Cmd+Enter`)

✅ **Erfolg:** Du solltest eine Erfolgsmeldung sehen. Die Tabelle `profile_gallery` wurde erstellt.

## 2. Supabase Storage Bucket erstellen

1. Gehe zu deinem Supabase Dashboard
2. Klicke auf **"Storage"** im linken Menü
3. Klicke auf **"Create a new bucket"** (oder "New bucket")
4. Gib den Namen **`profile-gallery`** ein (genau so, mit Bindestrich!)
5. ✅ Wähle **"Public bucket"** (damit die Bilder öffentlich zugänglich sind)
6. Klicke auf **"Create bucket"**

✅ **Erfolg:** Der Bucket `profile-gallery` sollte jetzt in der Liste erscheinen.

## 3. Storage Policies einrichten

**Hinweis:** Für die API-Routes (Server-seitig) sind die Policies optional, da die API mit dem Service-Role-Key arbeitet. Aber für bessere Sicherheit sollten sie eingerichtet werden.

1. Gehe zu **"Storage"** → **"Policies"** in deinem Supabase Dashboard
2. Wähle den Bucket **`profile-gallery`** aus der Dropdown-Liste
3. Klicke auf **"New Policy"** (oder "Create policy")

### Policy 1: Öffentliches Lesen
- **Policy Name:** `Öffentliches Lesen` (oder `Public Read`)
- **Allowed operation:** `SELECT` (oder `Read`)
- **Policy definition:**
```sql
true
```
- Klicke auf **"Review"** und dann **"Save policy"**

### Policy 2: User können hochladen
- **Policy Name:** `User können hochladen` (oder `User Upload`)
- **Allowed operation:** `INSERT` (oder `Upload`)
- **Policy definition:**
```sql
true
```
- Klicke auf **"Review"** und dann **"Save policy"**

### Policy 3: User können ihre eigenen Bilder löschen
- **Policy Name:** `User können ihre eigenen Bilder löschen` (oder `User Delete Own`)
- **Allowed operation:** `DELETE` (oder `Delete`)
- **Policy definition:**
```sql
bucket_id = 'profile-gallery' AND (storage.foldername(name))[1] = auth.uid()::text
```
- Klicke auf **"Review"** und dann **"Save policy"**

✅ **Erfolg:** Alle drei Policies sollten jetzt in der Liste erscheinen.

## 4. Testen

1. Starte den Development Server: `npm run dev`
2. Gehe zu http://localhost:3000/mein-profil
3. Klicke auf "Bild hinzufügen"
4. Wähle ein Bild aus und lade es hoch
5. Das Bild sollte in der Galerie erscheinen

## Hinweise

- Maximale Dateigröße: 5MB pro Bild
- Unterstützte Formate: JPEG, PNG, WebP, GIF
- Bilder werden im Format `gallery/{userId}/{timestamp}-{random}.{ext}` gespeichert
- Jeder User kann nur seine eigenen Bilder löschen

