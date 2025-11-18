import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    // Validierung
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'E-Mail, Passwort und Rolle sind erforderlich' },
        { status: 400 }
      );
    }

    // Suche nach User
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, password, role')
      .eq('email', email.toLowerCase())
      .eq('role', role)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Ungültige Anmeldedaten' },
        { status: 401 }
      );
    }

    // Prüfe Passwort (In Production sollte das gehasht werden!)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Ungültige Anmeldedaten' },
        { status: 401 }
      );
    }

    // Entferne Passwort aus der Antwort
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { user: userWithoutPassword, message: 'Login erfolgreich' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login-Fehler:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

