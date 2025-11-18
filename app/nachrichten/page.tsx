"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

type Message = {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: number;
  read: boolean;
};

type UserProfile = {
  id: number;
  name: string;
  avatar: string;
};

type ChatPreview = {
  partnerUserId: string;
  partnerName: string;
  partnerAvatar: string;
  lastMessage: Message | null;
  unreadCount: number;
};

export default function NachrichtenPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatPreview[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadChats();
  }, [user]);

  const loadChats = async () => {
    if (!user || typeof window === 'undefined') return;

    // Lade alle registrierten User
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Lade alle Profile für Avatare
    let allProfiles: (UserProfile & { userId?: string })[] = [];
    try {
      const profilesResponse = await fetch('/api/profiles');
      const profilesData = await profilesResponse.json();
      if (profilesResponse.ok && profilesData.profiles) {
        allProfiles = profilesData.profiles;
      }
    } catch (e) {
      console.error('Fehler beim Laden der Profile:', e);
    }

    // Lade alle Nachrichten
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    
    // Gruppiere Nachrichten nach Chat-Partner (User-IDs)
    const chatMap = new Map<string, { messages: Message[]; unread: number }>();

    allMessages.forEach((msg: Message) => {
      let partnerUserId: string | null = null;
      let isUnread = false;
      
      if (msg.fromUserId === user.id) {
        // Nachricht von mir - Partner ist Empfänger
        partnerUserId = msg.toUserId;
      } else if (msg.toUserId === user.id) {
        // Nachricht an mich - Partner ist Absender
        partnerUserId = msg.fromUserId;
        isUnread = !msg.read;
      }

      if (partnerUserId && partnerUserId !== user.id) {
        if (!chatMap.has(partnerUserId)) {
          chatMap.set(partnerUserId, { messages: [], unread: 0 });
        }
        const chat = chatMap.get(partnerUserId)!;
        chat.messages.push(msg);
        if (isUnread) {
          chat.unread++;
        }
      }
    });

    // Erstelle Chat-Previews
    const chatPreviews: ChatPreview[] = [];
    
    chatMap.forEach((chatData, partnerUserId) => {
      // Finde User-Informationen
      const partnerUser = registeredUsers.find((u: { id: string; name: string }) => u.id === partnerUserId);
      if (partnerUser) {
        // Finde Profil für Avatar
        const partnerProfile = allProfiles.find((p: UserProfile & { userId?: string }) => p.userId === partnerUserId);
        
        // Sortiere Nachrichten nach Timestamp
        chatData.messages.sort((a, b) => b.timestamp - a.timestamp);
        const lastMessage = chatData.messages[0] || null;
        
        chatPreviews.push({
          partnerUserId,
          partnerName: partnerUser.name,
          partnerAvatar: partnerProfile?.avatar || `https://via.placeholder.com/150/4F46E5/FFFFFF?text=${partnerUser.name.charAt(0)}`,
          lastMessage,
          unreadCount: chatData.unread,
        });
      }
    });

    // Sortiere nach letzter Nachricht (neueste zuerst)
    chatPreviews.sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return b.lastMessage.timestamp - a.lastMessage.timestamp;
    });

    setChats(chatPreviews);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* VIDEO HINTERGRUND */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Ihr Browser unterstützt kein Video.
      </video>

      {/* DUNKLER OVERLAY */}
      <div className="fixed inset-0 bg-black opacity-50 z-10"></div>

      {/* INHALT */}
      <main className="relative z-20 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => router.push('/profil')}
              className="text-cyan-400 hover:text-cyan-300 mb-4"
            >
              ← Zurück zu Profilen
            </button>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Postfach
            </h1>
            <p className="text-xl text-cyan-300">
              Deine Nachrichten und Chats
            </p>
          </div>

          {chats.length === 0 ? (
            <div className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8 text-center">
              <p className="text-gray-400 text-lg">
                Noch keine Nachrichten. Starte einen Chat mit jemandem!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {chats.map((chat) => (
                <div
                  key={chat.partnerUserId}
                  onClick={() => router.push(`/chat/${chat.partnerUserId}`)}
                  className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-6 cursor-pointer hover:bg-opacity-95 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={chat.partnerAvatar}
                      alt={chat.partnerName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xl font-bold text-white">{chat.partnerName}</h3>
                        {chat.unreadCount > 0 && (
                          <span className="bg-cyan-600 text-white text-xs font-bold rounded-full px-2 py-1">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                      {chat.lastMessage && (
                        <>
                          <p className="text-gray-300 text-sm truncate">
                            {chat.lastMessage.fromUserId === user.id && 'Du: '}
                            {chat.lastMessage.content}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(chat.lastMessage.timestamp).toLocaleString('de-DE', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

