import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

// GET - Lade alle Bilder einer Galerie
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  try {
    const { profileId } = await params;

    const { data: images, error } = await supabaseAdmin
      .from('profile_gallery')
      .select('*')
      .eq('profile_id', profileId)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Fehler:', error);
      // Prüfe ob die Tabelle fehlt
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Tabelle "profile_gallery" wurde nicht gefunden. Bitte führe die Migration aus.',
            hint: 'Führe die SQL-Datei "supabase-gallery-migration.sql" im Supabase SQL Editor aus.'
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: 'Fehler beim Laden der Galeriebilder', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ images: images || [] }, { status: 200 });
  } catch (error) {
    console.error('Fehler:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

