# Backend Setup Anleitung

## 1. Supabase Projekt erstellen

1. Gehe zu https://supabase.com
2. Erstelle einen kostenlosen Account (falls noch nicht vorhanden)
3. Klicke auf "New Project"
4. Wähle einen Namen für dein Projekt (z.B. "mein-neues-projekt")
5. Wähle ein Passwort für die Datenbank
6. Wähle eine Region (z.B. "West Europe")
7. Klicke auf "Create new project"

## 2. Supabase Credentials holen

1. Gehe zu Project Settings (Zahnrad-Symbol)
2. Klicke auf "API" im linken Menü
3. Kopiere die folgenden Werte:
   - **Project URL** (z.B. `https://xxxxx.supabase.co`)
   - **anon public key** (lange Zeichenkette)

## 3. Environment Variables setzen

1. Erstelle eine Datei `.env.local` im Root-Verzeichnis des Projekts
2. Füge folgende Zeilen ein:

```
NEXT_PUBLIC_SUPABASE_URL=deine-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key
```

**Wichtig:** Ersetze `deine-project-url` und `dein-anon-key` mit den Werten aus Schritt 2!

## 4. Datenbank Schema erstellen

1. Gehe in dein Supabase Dashboard
2. Klicke auf "SQL Editor" im linken Menü
3. Klicke auf "New query"
4. Öffne die Datei `supabase-schema.sql` in diesem Projekt
5. Kopiere den gesamten Inhalt
6. Füge ihn in den SQL Editor ein
7. Klicke auf "Run" (oder drücke Ctrl+Enter)

Das erstellt die Tabellen:
- `users` - für Benutzer-Accounts
- `user_profiles` - für Benutzer-Profile
- `messages` - für Chat-Nachrichten

## 5. Vercel Environment Variables setzen

Wenn du auf Vercel deployst:

1. Gehe zu deinem Vercel Dashboard
2. Wähle dein Projekt
3. Gehe zu Settings → Environment Variables
4. Füge folgende Variablen hinzu:
   - `NEXT_PUBLIC_SUPABASE_URL` = deine Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = dein Supabase anon key
5. Klicke auf "Save"
6. Redeploy dein Projekt

## 6. Testen

1. Starte den Development Server: `npm run dev`
2. Gehe zu http://localhost:3000
3. Registriere einen neuen Account
4. Logge dich ein
5. Teste in einem anderen Browser - der Login sollte jetzt funktionieren!

## Wichtige Hinweise

- **Passwörter werden aktuell NICHT gehasht gespeichert!** Für Production sollte bcrypt oder ähnliches verwendet werden.
- Die Daten sind jetzt in der Supabase Datenbank gespeichert und funktionieren browserübergreifend.
- LocalStorage wird nur noch für die Session-Verwaltung verwendet (currentUser).

## Troubleshooting

### "Supabase URL oder Key fehlen"
- Stelle sicher, dass `.env.local` existiert und die richtigen Werte enthält
- Starte den Dev-Server neu nach dem Erstellen der `.env.local` Datei

### "Fehler beim Erstellen des Users"
- Prüfe, ob das Datenbank-Schema korrekt erstellt wurde
- Prüfe die Supabase Logs im Dashboard

### Login funktioniert nicht
- Prüfe die Browser-Konsole (F12) für Fehlermeldungen
- Prüfe die Network-Tab für API-Fehler
- Stelle sicher, dass die API Routes funktionieren (`/api/auth/login`)

