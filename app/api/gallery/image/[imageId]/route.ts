import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase';

// DELETE - Lösche ein Bild
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await params;

    // Hole Bildinformationen
    const { data: image, error: fetchError } = await supabaseAdmin
      .from('profile_gallery')
      .select('image_path')
      .eq('id', imageId)
      .single();

    if (fetchError || !image) {
      return NextResponse.json(
        { error: 'Bild nicht gefunden' },
        { status: 404 }
      );
    }

    // Lösche Bild aus Storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('profile-gallery')
      .remove([image.image_path]);

    if (storageError) {
      console.error('Storage-Fehler:', storageError);
      // Weiter mit DB-Löschung auch wenn Storage-Fehler
    }

    // Lösche Metadaten aus Datenbank
    const { error: dbError } = await supabaseAdmin
      .from('profile_gallery')
      .delete()
      .eq('id', imageId);

    if (dbError) {
      console.error('Datenbank-Fehler:', dbError);
      return NextResponse.json(
        { error: 'Fehler beim Löschen der Bildmetadaten' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Bild erfolgreich gelöscht' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fehler:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

// PUT - Aktualisiere Bild (z.B. Caption oder Reihenfolge)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await params;
    const body = await request.json();
    const { caption, display_order } = body;

    const updateData: any = {};
    if (caption !== undefined) updateData.caption = caption;
    if (display_order !== undefined) updateData.display_order = display_order;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Keine Daten zum Aktualisieren' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('profile_gallery')
      .update(updateData)
      .eq('id', imageId)
      .select()
      .single();

    if (error) {
      console.error('Supabase Fehler:', error);
      return NextResponse.json(
        { error: 'Fehler beim Aktualisieren des Bildes' },
        { status: 500 }
      );
    }

    return NextResponse.json({ image: data }, { status: 200 });
  } catch (error) {
    console.error('Fehler:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

