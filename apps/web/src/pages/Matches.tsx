import React from 'react';
import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, HeartIcon } from '@heroicons/react/24/outline';

interface Match {
  id: number;
  horse: {
    name: string;
    breed: string;
    photo: string;
  };
  owner: {
    name: string;
    location: string;
  };
  score: number;
  matchedAt: string;
  hasUnreadMessages: boolean;
}

const mockMatches: Match[] = [
  {
    id: 1,
    horse: {
      name: "Luna",
      breed: "KWPN",
      photo: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400"
    },
    owner: {
      name: "Sarah",
      location: "Amsterdam"
    },
    score: 92,
    matchedAt: "2 uur geleden",
    hasUnreadMessages: true
  },
  {
    id: 2,
    horse: {
      name: "Storm",
      breed: "Friesian", 
      photo: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400"
    },
    owner: {
      name: "Mark",
      location: "Utrecht"
    },
    score: 87,
    matchedAt: "1 dag geleden",
    hasUnreadMessages: false
  }
];

const Matches: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6 pt-8">
          <h1 className="text-2xl font-bold text-gray-900">Matches</h1>
          <p className="text-gray-600">Jouw wederzijdse likes</p>
        </div>

        {mockMatches.length === 0 ? (
          <div className="text-center py-12">
            <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Nog geen matches
            </h2>
            <p className="text-gray-600">
              Ga naar Ontdekken om paarden te liken!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="flex items-center p-4">
                  {/* Horse Photo */}
                  <div className="relative">
                    <img
                      src={match.horse.photo}
                      alt={match.horse.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <HeartIcon className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>

                  {/* Match Info */}
                  <div className="flex-1 ml-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        {match.horse.name}
                      </h3>
                      <span className="text-sm text-primary font-medium">
                        {match.score}% match
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {match.horse.breed} • {match.owner.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {match.owner.location} • {match.matchedAt}
                    </p>
                  </div>

                  {/* Message Button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="ml-4 p-3 bg-primary rounded-full relative"
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                    {match.hasUnreadMessages && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
