import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Prüfe ob Supabase konfiguriert ist
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase nicht konfiguriert!');
      return NextResponse.json(
        { error: 'Backend nicht konfiguriert. Bitte .env.local Datei prüfen.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, password, role } = body;

    // Validierung
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Das Passwort muss mindestens 6 Zeichen lang sein' },
        { status: 400 }
      );
    }

    // Prüfe ob User bereits existiert
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Diese E-Mail ist bereits registriert' },
        { status: 400 }
      );
    }

    // Erstelle neuen User
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email: email.toLowerCase(),
          password, // In Production sollte das gehasht werden!
          role,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase Fehler:', error);
      // Detailliertere Fehlermeldung
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Tabelle "users" existiert nicht. Bitte führe das Datenbank-Schema aus.' },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: `Fehler beim Erstellen des Users: ${error.message || 'Unbekannter Fehler'}` },
        { status: 500 }
      );
    }

    // Entferne Passwort aus der Antwort
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { user: userWithoutPassword, message: 'Registrierung erfolgreich' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registrierungsfehler:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

