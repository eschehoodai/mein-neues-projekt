"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';

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

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const partnerUserId = params.profileId as string; // Jetzt ist es eine User-ID, nicht mehr eine Profil-ID
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatPartner, setChatPartner] = useState<UserProfile | null>(null);
  const [chatPartnerName, setChatPartnerName] = useState<string>('');
  const [chatPartnerAvatar, setChatPartnerAvatar] = useState<string>('');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Prüfe ob versucht wird, mit sich selbst zu chatten
    if (partnerUserId === user.id) {
      setIsOwnProfile(true);
      return;
    }

    loadChatPartner();
    loadMessages();
  }, [partnerUserId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatPartner = async () => {
    if (typeof window === 'undefined' || !user) return;

    // Lade alle registrierten User, um den Namen zu finden
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const partnerUser = registeredUsers.find((u: { id: string; name: string }) => u.id === partnerUserId);
    
    if (partnerUser) {
      setChatPartnerName(partnerUser.name);
      
      // Lade Profil des Partners, um Avatar zu finden
      try {
        const profileResponse = await fetch(`/api/profiles/${partnerUserId}`);
        const profileData = await profileResponse.json();
        if (profileResponse.ok && profileData.profile) {
          setChatPartnerAvatar(profileData.profile.avatar);
          setChatPartner(profileData.profile);
        } else {
          // Fallback: Verwende Placeholder-Avatar
          setChatPartnerAvatar(`https://via.placeholder.com/150/4F46E5/FFFFFF?text=${partnerUser.name.charAt(0)}`);
        }
      } catch (e) {
        console.error('Fehler beim Laden des Partner-Profils:', e);
        setChatPartnerAvatar(`https://via.placeholder.com/150/4F46E5/FFFFFF?text=${partnerUser.name.charAt(0)}`);
      }
    }
  };

  const loadMessages = () => {
    if (!user) return;

    if (typeof window === 'undefined') return;

    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    
    // Filtere Nachrichten für diesen Chat (beide Richtungen)
    // Jetzt arbeiten wir direkt mit User-IDs
    const chatMessages = allMessages.filter((msg: Message) => {
      return (msg.fromUserId === user.id && msg.toUserId === partnerUserId) ||
             (msg.fromUserId === partnerUserId && msg.toUserId === user.id);
    });

    // Sortiere nach Timestamp
    chatMessages.sort((a: Message, b: Message) => a.timestamp - b.timestamp);
    
    setMessages(chatMessages);

    // Markiere Nachrichten als gelesen
    const unreadMessages = chatMessages.filter((msg: Message) => 
      !msg.read && msg.toUserId === user.id
    );
    
    if (unreadMessages.length > 0) {
      const updatedMessages = allMessages.map((msg: Message) => {
        if (unreadMessages.some((um: Message) => um.id === msg.id)) {
          return { ...msg, read: true };
        }
        return msg;
      });
      localStorage.setItem('messages', JSON.stringify(updatedMessages));
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !user || !partnerUserId) return;

    const message: Message = {
      id: Date.now().toString(),
      fromUserId: user.id,
      toUserId: partnerUserId, // Direkt die User-ID des Partners
      content: newMessage.trim(),
      timestamp: Date.now(),
      read: false,
    };

    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    allMessages.push(message);
    localStorage.setItem('messages', JSON.stringify(allMessages));

    setNewMessage('');
    loadMessages();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) {
    return null;
  }

  if (isOwnProfile) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="fixed inset-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>
        <div className="fixed inset-0 bg-black opacity-50 z-10"></div>
        <main className="relative z-20 min-h-screen flex items-center justify-center p-8">
          <div className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Nicht möglich</h2>
            <p className="text-gray-300 mb-6">
              Du kannst dir nicht selbst eine Nachricht schreiben.
            </p>
            <button
              onClick={() => router.push('/profil')}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg"
            >
              Zurück zu Profilen
            </button>
          </div>
        </main>
      </div>
    );
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
      <main className="relative z-20 min-h-screen flex flex-col p-8">
        <div className="max-w-4xl mx-auto w-full flex flex-col h-[calc(100vh-8rem)]">
          {/* Chat Header */}
          <div className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-t-2xl border border-gray-700 border-b-0 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/profil')}
                className="text-cyan-400 hover:text-cyan-300 mr-2"
              >
                ← Zurück
              </button>
              {chatPartnerName && (
                <>
                  <img
                    src={chatPartnerAvatar}
                    alt={chatPartnerName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white">{chatPartnerName}</h2>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => router.push('/nachrichten')}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm"
            >
              Postfach
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 bg-gray-900 bg-opacity-90 backdrop-blur-md border border-gray-700 border-y-0 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                <p>Noch keine Nachrichten. Starte die Unterhaltung!</p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.fromUserId === user.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        isOwnMessage
                          ? 'bg-cyan-600 text-white'
                          : 'bg-gray-800 text-gray-100'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${isOwnMessage ? 'text-cyan-100' : 'text-gray-400'}`}>
                        {new Date(message.timestamp).toLocaleTimeString('de-DE', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-b-2xl border border-gray-700 border-t-0 p-4">
            <div className="flex gap-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nachricht schreiben..."
                rows={2}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 resize-none"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
              >
                Senden ❤️
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

