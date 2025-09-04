import { useState } from 'react';
import { motion } from 'framer-motion';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserIcon, HomeIcon } from '@heroicons/react/24/outline';

const ProfileChoice = () => {
  const { user, isAuthenticated } = useKindeAuth();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleProfileChoice = (profileType: 'rider' | 'owner') => {
    setIsNavigating(true);
    navigate(`/profile/${profileType}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">🐎</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welk profiel wil je eerst invullen?
          </h2>
          <p className="mt-2 text-gray-600">
            Hallo {user?.given_name}, je kunt later het andere profiel ook nog invullen
          </p>
        </div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleProfileChoice('rider')}
            disabled={isNavigating}
            className="w-full flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-semibold text-gray-900">Ruiter Profiel</h3>
              <p className="text-gray-600">Vertel over jezelf als ruiter</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleProfileChoice('owner')}
            disabled={isNavigating}
            className="w-full flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 disabled:opacity-50"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-semibold text-gray-900">Eigenaar Profiel</h3>
              <p className="text-gray-600">Voeg je paarden toe</p>
            </div>
          </motion.button>
        </div>

        {isNavigating && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600">Doorverwijzen...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileChoice;
