import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface MatchCard {
  id: number;
  horse: {
    name: string;
    breed: string;
    age: number;
    photo: string;
  };
  owner: {
    name: string;
    location: string;
  };
  listing: {
    price: number;
    description: string;
  };
  score: number;
}

const mockMatches: MatchCard[] = [
  {
    id: 1,
    horse: {
      name: "Luna",
      breed: "KWPN",
      age: 8,
      photo: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400"
    },
    owner: {
      name: "Sarah",
      location: "Amsterdam, 5km"
    },
    listing: {
      price: 25,
      description: "Lieve merrie zoekt ervaren ruiter voor dressuur en buitenritten"
    },
    score: 92
  },
  {
    id: 2,
    horse: {
      name: "Storm",
      breed: "Friesian",
      age: 6,
      photo: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400"
    },
    owner: {
      name: "Mark",
      location: "Utrecht, 12km"
    },
    listing: {
      price: 30,
      description: "Energieke ruin voor springtraining en wedstrijden"
    },
    score: 87
  }
];

const Discover: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState(mockMatches);

  const handleSwipe = (direction: 'like' | 'pass') => {
    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reset or load more matches
      setCurrentIndex(0);
    }
  };

  const currentMatch = matches[currentIndex];

  if (!currentMatch) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Geen nieuwe matches
          </h2>
          <p className="text-gray-600">
            Kom later terug voor nieuwe paarden!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="max-w-sm mx-auto pt-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Ontdekken</h1>
          <p className="text-gray-600">Vind jouw perfecte paardenmatch</p>
        </div>

        <motion.div
          key={currentMatch.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Horse Photo */}
          <div className="relative h-80">
            <img
              src={currentMatch.horse.photo}
              alt={currentMatch.horse.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {currentMatch.score}% match
            </div>
          </div>

          {/* Horse Info */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentMatch.horse.name}
                </h2>
                <p className="text-gray-600">
                  {currentMatch.horse.breed} • {currentMatch.horse.age} jaar
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  €{currentMatch.listing.price}
                </p>
                <p className="text-sm text-gray-500">per sessie</p>
              </div>
            </div>

            <p className="text-gray-700 mb-4">
              {currentMatch.listing.description}
            </p>

            <div className="flex items-center text-sm text-gray-500">
              <span>{currentMatch.owner.name}</span>
              <span className="mx-2">•</span>
              <span>{currentMatch.owner.location}</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-8 mt-8">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('pass')}
            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shadow-lg"
          >
            <XMarkIcon className="w-8 h-8 text-gray-600" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('like')}
            className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <HeartIcon className="w-8 h-8 text-white" />
          </motion.button>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            {matches.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
