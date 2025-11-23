import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';

// POST - Lade ein Bild hoch
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const profileId = formData.get('profileId') as string;
    const userId = formData.get('userId') as string;
    const caption = formData.get('caption') as string | null;

    if (!file || !profileId || !userId) {
      return NextResponse.json(
        { error: 'Datei, Profil-ID und User-ID sind erforderlich' },
        { status: 400 }
      );
    }

    // Validiere Dateityp
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Nur Bilddateien (JPEG, PNG, WebP, GIF) sind erlaubt' },
        { status: 400 }
      );
    }

    // Validiere Dateigröße (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Datei ist zu groß. Maximum: 5MB' },
        { status: 400 }
      );
    }

    // Erstelle eindeutigen Dateinamen
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    // Konvertiere File zu ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Lade Bild in Supabase Storage hoch
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('profile-gallery')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload-Fehler:', uploadError);
      // Prüfe ob der Bucket fehlt
      if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('not found')) {
        return NextResponse.json(
          { 
            error: 'Storage-Bucket "profile-gallery" wurde nicht gefunden. Bitte erstelle den Bucket in Supabase Storage.',
            hint: 'Gehe zu Supabase Dashboard → Storage → Create bucket → Name: "profile-gallery" → Public bucket'
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: 'Fehler beim Hochladen des Bildes', details: uploadError.message },
        { status: 500 }
      );
    }

    // Hole öffentliche URL
    const { data: urlData } = supabaseAdmin.storage
      .from('profile-gallery')
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    // Speichere Metadaten in der Datenbank
    const { data: galleryData, error: dbError } = await supabaseAdmin
      .from('profile_gallery')
      .insert({
        profile_id: parseInt(profileId),
        user_id: userId,
        image_url: imageUrl,
        image_path: filePath,
        caption: caption || null,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Datenbank-Fehler:', dbError);
      // Lösche hochgeladenes Bild bei Fehler
      await supabaseAdmin.storage
        .from('profile-gallery')
        .remove([filePath]);
      
      // Prüfe ob die Tabelle fehlt
      if (dbError.message?.includes('relation') && dbError.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Tabelle "profile_gallery" wurde nicht gefunden. Bitte führe die Migration aus.',
            hint: 'Führe die SQL-Datei "supabase-gallery-migration.sql" im Supabase SQL Editor aus.'
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Fehler beim Speichern der Bildmetadaten', details: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        image: galleryData 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Fehler:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

