// Funktion zum Löschen aller Profile
export function clearAllProfiles() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('userProfiles');
  localStorage.removeItem('sampleProfiles');
  localStorage.removeItem('messages');
  
  console.log('Alle Profile und Nachrichten wurden gelöscht.');
}

