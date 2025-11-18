import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// GET - Lade Profil eines bestimmten Users
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Kein Profil gefunden
        return NextResponse.json(
          { profile: null },
          { status: 200 }
        );
      }
      console.error('Supabase Fehler:', error);
      return NextResponse.json(
        { error: 'Fehler beim Laden des Profils' },
        { status: 500 }
      );
    }

    // Formatiere Antwort
    const formattedProfile = {
      id: profile.id,
      name: profile.name,
      age: profile.age,
      location: profile.location,
      status: profile.status,
      interests: profile.interests || [],
      height: profile.height,
      children: profile.children,
      education: profile.education,
      languages: profile.languages || [],
      description: profile.description,
      avatar: profile.avatar,
      online: profile.online,
      verified: profile.verified,
      seeking: profile.seeking,
      userId: profile.user_id,
    };

    return NextResponse.json({ profile: formattedProfile }, { status: 200 });
  } catch (error) {
    console.error('Fehler:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

