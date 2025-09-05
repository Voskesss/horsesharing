import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { api } from '../utils/api';

interface MatchCandidate {
  listing_id: number;
  horse_name: string;
  horse_photos: string[];
  owner_name: string;
  location: string;
  contribution_euro: number;
  match_score: number;
  distance_km: number;
  highlights: string[];
}

const Discover: React.FC = () => {
  const kindeAuth = useKindeAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<MatchCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load match candidates on component mount
  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        // @ts-ignore - getToken exists but TypeScript doesn't recognize it
        const token = await kindeAuth.getToken();
        if (!token) {
          setError('Geen authenticatie token gevonden');
          return;
        }
        
        const candidates = await api.getMatchCandidates(token, 10);
        setMatches(candidates);
        setError(null);
      } catch (err) {
        console.error('Error loading matches:', err);
        setError('Kon matches niet laden');
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [kindeAuth]);

  const handleSwipe = async (direction: 'like' | 'pass') => {
    const currentMatch = matches[currentIndex];
    
    // If liking, send API call
    if (direction === 'like' && currentMatch) {
      try {
        // @ts-ignore - getToken exists but TypeScript doesn't recognize it
        const token = await kindeAuth.getToken();
        if (token) {
          await api.likeListing(token, currentMatch.listing_id);
        }
      } catch (err) {
        console.error('Error liking listing:', err);
      }
    }

    // Move to next match
    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Load more matches or reset
      setCurrentIndex(0);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Matches laden...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oeps!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Probeer opnieuw
          </button>
        </div>
      </div>
    );
  }

  const currentMatch = matches[currentIndex];

  if (!currentMatch) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Geen matches gevonden</h2>
          <p className="text-gray-600">Probeer je zoekfilters aan te passen</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ontdekken</h1>
          <p className="text-gray-600">Swipe door potentiële matches</p>
        </div>

        <motion.div
          key={currentMatch.listing_id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Horse Image */}
          <div className="relative h-80">
            <img
              src={currentMatch.horse_photos[0] || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400'}
              alt={currentMatch.horse_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1">
              <span className="text-sm font-semibold text-green-600">
                {Math.round(currentMatch.match_score)}% match
              </span>
            </div>
          </div>

          {/* Horse Info */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentMatch.horse_name}
              </h2>
              <span className="text-lg text-gray-600">
                {currentMatch.distance_km}km weg
              </span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span className="text-2xl font-bold text-green-600">
                €{currentMatch.contribution_euro}
              </span>
              <span className="text-gray-600 ml-2">per maand</span>
            </div>

            {/* Highlights */}
            {currentMatch.highlights && currentMatch.highlights.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Highlights:</h3>
                <div className="flex flex-wrap gap-2">
                  {currentMatch.highlights.map((highlight, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Owner Info */}
            <div className="flex items-center text-gray-600 mb-6">
              <span className="font-medium">{currentMatch.owner_name}</span>
              <span className="mx-2">•</span>
              <span>{currentMatch.location}</span>
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
