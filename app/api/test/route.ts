import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// Test-Route um zu prüfen ob Supabase funktioniert
export async function GET() {
  try {
    // Prüfe Environment Variables
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!hasUrl || !hasKey) {
      return NextResponse.json({
        success: false,
        error: 'Environment Variables fehlen',
        hasUrl,
        hasKey,
      }, { status: 500 });
    }

    // Teste Supabase-Verbindung
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        hint: error.hint,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase-Verbindung funktioniert!',
      hasUrl,
      hasKey,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Unbekannter Fehler',
    }, { status: 500 });
  }
}

