// Erstelle Sample User Accounts für die Sample Profiles
export function initializeSampleUsers() {
  if (typeof window === 'undefined') return;

  try {
    const existingUsersStr = localStorage.getItem('registeredUsers');
    const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
    
    if (!Array.isArray(existingUsers)) {
      console.error('registeredUsers ist kein Array, setze auf leeres Array');
      localStorage.setItem('registeredUsers', JSON.stringify([]));
      return;
    }

    const sampleUserIds = new Set(existingUsers.map((u: { email: string }) => {
      if (u.email && u.email.startsWith('test') && u.email.endsWith('@test.de')) {
        return parseInt(u.email.replace('test', '').replace('@test.de', ''));
      }
      return null;
    }).filter((id: number | null) => id !== null));

    // Erstelle Accounts für Sample Profiles (ID 1, 2, 3)
    const sampleUsers = [];
    for (let i = 1; i <= 3; i++) {
      if (!sampleUserIds.has(i)) {
        sampleUsers.push({
          id: `sample-${i}`,
          name: i === 1 ? 'Esche' : i === 2 ? 'Max Mustermann' : 'Anna Beispiel',
          email: `test${i}@test.de`,
          password: 'test',
          role: 'user' as const,
        });
      }
    }

    if (sampleUsers.length > 0) {
      const updatedUsers = [...existingUsers, ...sampleUsers];
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      console.log('Sample Users initialisiert:', sampleUsers.length);
    }
  } catch (error) {
    console.error('Fehler beim Initialisieren der Sample Users:', error);
    // Stelle sicher, dass registeredUsers mindestens ein Array ist
    if (!localStorage.getItem('registeredUsers')) {
      localStorage.setItem('registeredUsers', JSON.stringify([]));
    }
  }
}
