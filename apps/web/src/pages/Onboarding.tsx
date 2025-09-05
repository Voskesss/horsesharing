import { useState } from 'react';
import { motion } from 'framer-motion';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserIcon, HomeIcon } from '@heroicons/react/24/outline';
import { api } from '../utils/api';

const Onboarding = () => {
  const kindeAuth = useKindeAuth();
  const { user, isAuthenticated } = kindeAuth;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleUserTypeSelect = async (type: 'rider' | 'owner' | 'both') => {
    setIsSubmitting(true);
    
    // Create user via backend API
    try {
      // Get real Kinde token
      let token;
      try {
        // @ts-ignore - getToken exists but TypeScript doesn't recognize it
        token = await kindeAuth.getToken();
        console.log('Token received for user creation:', token ? 'Success' : 'Failed');
      } catch (tokenError) {
        console.error('Error getting token:', tokenError);
        token = 'placeholder-token';
      }
      
      await api.createUser({
        role: type.toUpperCase() as 'RIDER' | 'OWNER' | 'BOTH',
        phone: undefined,
        is_minor: false
      });
      
      console.log('User created successfully');
      
      // Navigate based on role selection
      if (type === 'both') {
        // If both, let user choose which profile to fill first
        navigate('/profile-choice', { replace: true });
      } else if (type === 'rider') {
        // Use new comprehensive rider onboarding
        navigate('/profile/rider-new', { replace: true });
      } else {
        // Owner still uses old profile page
        navigate(`/profile/${type}`, { replace: true });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      // For now, continue with flow even if API fails
      console.log('API call failed, continuing with profile setup');
      if (type === 'both') {
        navigate('/profile-choice', { replace: true });
      } else if (type === 'rider') {
        // Use new comprehensive rider onboarding
        navigate('/profile/rider-new', { replace: true });
      } else {
        // Owner still uses old profile page
        navigate(`/profile/${type}`, { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">🐎</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welkom bij HorseSharing!
          </h2>
          <p className="mt-2 text-gray-600">
            Hallo {user?.given_name}, vertel ons wat voor gebruiker je bent
          </p>
        </div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleUserTypeSelect('rider')}
            disabled={isSubmitting}
            className="w-full flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-semibold text-gray-900">Ik ben een Ruiter</h3>
              <p className="text-gray-600">Ik zoek paarden om te rijden</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleUserTypeSelect('owner')}
            disabled={isSubmitting}
            className="w-full flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-semibold text-gray-900">Ik ben een Eigenaar</h3>
              <p className="text-gray-600">Ik heb paarden die ik wil delen</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleUserTypeSelect('both')}
            disabled={isSubmitting}
            className="w-full flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-purple-600" />
                <HomeIcon className="w-6 h-6 text-purple-600 ml-2" />
              </div>
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-semibold text-gray-900">Ik ben Beide</h3>
              <p className="text-gray-600">Ik ben zowel ruiter als eigenaar</p>
            </div>
          </motion.button>
        </div>

        {isSubmitting && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Profiel wordt aangemaakt...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Onboarding;
