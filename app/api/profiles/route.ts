import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// GET - Lade alle Profile
export async function GET(request: NextRequest) {
  try {
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Fehler:', error);
      return NextResponse.json(
        { error: 'Fehler beim Laden der Profile' },
        { status: 500 }
      );
    }

    // Konvertiere Datenbank-Format zu Frontend-Format
    const formattedProfiles = profiles.map((profile: any) => ({
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
    }));

    return NextResponse.json({ profiles: formattedProfiles }, { status: 200 });
  } catch (error) {
    console.error('Fehler:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

// POST - Erstelle neues Profil
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...profileData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User-ID ist erforderlich' },
        { status: 400 }
      );
    }

    // Prüfe ob User bereits ein Profil hat
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingProfile) {
      return NextResponse.json(
        { error: 'User hat bereits ein Profil. Verwende PUT zum Aktualisieren.' },
        { status: 400 }
      );
    }

    // Erstelle neues Profil
    const { data: newProfile, error } = await supabase
      .from('user_profiles')
      .insert([
        {
          user_id: userId,
          name: profileData.name,
          age: profileData.age,
          location: profileData.location,
          status: profileData.status,
          interests: profileData.interests || [],
          height: profileData.height,
          children: profileData.children,
          education: profileData.education,
          languages: profileData.languages || [],
          description: profileData.description,
          avatar: profileData.avatar,
          online: profileData.online || false,
          verified: profileData.verified || false,
          seeking: profileData.seeking,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase Fehler:', error);
      return NextResponse.json(
        { error: `Fehler beim Erstellen des Profils: ${error.message}` },
        { status: 500 }
      );
    }

    // Formatiere Antwort
    const formattedProfile = {
      id: newProfile.id,
      name: newProfile.name,
      age: newProfile.age,
      location: newProfile.location,
      status: newProfile.status,
      interests: newProfile.interests || [],
      height: newProfile.height,
      children: newProfile.children,
      education: newProfile.education,
      languages: newProfile.languages || [],
      description: newProfile.description,
      avatar: newProfile.avatar,
      online: newProfile.online,
      verified: newProfile.verified,
      seeking: newProfile.seeking,
      userId: newProfile.user_id,
    };

    return NextResponse.json(
      { profile: formattedProfile, message: 'Profil erfolgreich erstellt' },
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

// PUT - Aktualisiere Profil
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, userId, ...profileData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Profil-ID ist erforderlich' },
        { status: 400 }
      );
    }

    // Aktualisiere Profil
    const { data: updatedProfile, error } = await supabase
      .from('user_profiles')
      .update({
        name: profileData.name,
        age: profileData.age,
        location: profileData.location,
        status: profileData.status,
        interests: profileData.interests || [],
        height: profileData.height,
        children: profileData.children,
        education: profileData.education,
        languages: profileData.languages || [],
        description: profileData.description,
        avatar: profileData.avatar,
        online: profileData.online,
        verified: profileData.verified,
        seeking: profileData.seeking,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase Fehler:', error);
      return NextResponse.json(
        { error: `Fehler beim Aktualisieren des Profils: ${error.message}` },
        { status: 500 }
      );
    }

    // Formatiere Antwort
    const formattedProfile = {
      id: updatedProfile.id,
      name: updatedProfile.name,
      age: updatedProfile.age,
      location: updatedProfile.location,
      status: updatedProfile.status,
      interests: updatedProfile.interests || [],
      height: updatedProfile.height,
      children: updatedProfile.children,
      education: updatedProfile.education,
      languages: updatedProfile.languages || [],
      description: updatedProfile.description,
      avatar: updatedProfile.avatar,
      online: updatedProfile.online,
      verified: updatedProfile.verified,
      seeking: updatedProfile.seeking,
      userId: updatedProfile.user_id,
    };

    return NextResponse.json(
      { profile: formattedProfile, message: 'Profil erfolgreich aktualisiert' },
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

