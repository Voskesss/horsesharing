import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  LockClosedIcon,
  CreditCardIcon 
} from '@heroicons/react/24/outline';

interface Message {
  id: number;
  text: string;
  isOwn: boolean;
  timestamp: string;
}

interface Chat {
  id: number;
  horse: {
    name: string;
    photo: string;
  };
  owner: {
    name: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isPaid: boolean;
}

const mockChats: Chat[] = [
  {
    id: 1,
    horse: {
      name: "Luna",
      photo: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400"
    },
    owner: {
      name: "Sarah"
    },
    lastMessage: "Wanneer kun je langskomen voor een proefrit?",
    lastMessageTime: "10:30",
    unreadCount: 2,
    isPaid: true
  },
  {
    id: 2,
    horse: {
      name: "Storm", 
      photo: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400"
    },
    owner: {
      name: "Mark"
    },
    lastMessage: "Hallo! Leuk dat we een match hebben.",
    lastMessageTime: "gisteren",
    unreadCount: 0,
    isPaid: false
  }
];

const mockMessages: Message[] = [
  {
    id: 1,
    text: "Hallo! Leuk dat we een match hebben 🐴",
    isOwn: false,
    timestamp: "14:30"
  },
  {
    id: 2,
    text: "Hoi Sarah! Ja, Luna ziet er geweldig uit. Wanneer kan ik haar ontmoeten?",
    isOwn: true,
    timestamp: "14:32"
  },
  {
    id: 3,
    text: "Wanneer kun je langskomen voor een proefrit?",
    isOwn: false,
    timestamp: "10:30"
  }
];

const Messages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Send message logic here
      setNewMessage('');
    }
  };

  const handleUnlockChat = (chatId: number) => {
    // Stripe payment logic here
    console.log('Unlock chat:', chatId);
  };

  if (selectedChat) {
    const chat = mockChats.find(c => c.id === selectedChat);
    if (!chat) return null;

    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center">
          <button
            onClick={() => setSelectedChat(null)}
            className="mr-4 text-primary"
          >
            ← Terug
          </button>
          <img
            src={chat.horse.photo}
            alt={chat.horse.name}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <h2 className="font-semibold text-gray-900">{chat.horse.name}</h2>
            <p className="text-sm text-gray-600">{chat.owner.name}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {mockMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  message.isOwn
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p>{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.isOwn ? 'text-primary-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Message Input */}
        {chat.isPaid ? (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Typ een bericht..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                className="p-2 bg-primary rounded-full"
              >
                <PaperAirplaneIcon className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <LockClosedIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">
                Ontgrendel chat om berichten te versturen
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleUnlockChat(chat.id)}
                className="bg-primary text-white px-6 py-2 rounded-full flex items-center mx-auto"
              >
                <CreditCardIcon className="w-4 h-4 mr-2" />
                Ontgrendel voor €2,99
              </motion.button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6 pt-8">
          <h1 className="text-2xl font-bold text-gray-900">Berichten</h1>
          <p className="text-gray-600">Chat met je matches</p>
        </div>

        {mockChats.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              💬
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Nog geen berichten
            </h2>
            <p className="text-gray-600">
              Matches verschijnen hier zodra je ze hebt!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {mockChats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedChat(chat.id)}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={chat.horse.photo}
                      alt={chat.horse.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {!chat.isPaid && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                        <LockClosedIcon className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 ml-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        {chat.horse.name} • {chat.owner.name}
                      </h3>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">
                          {chat.lastMessageTime}
                        </span>
                        {chat.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-medium">
                              {chat.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
