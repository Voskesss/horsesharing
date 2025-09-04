import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { ArrowRightIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const { login, register, isAuthenticated } = useKindeAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">🐎</span>
            </div>
          </div>
          <h2 className="text-3xl font-display font-bold text-text-primary">
            Welkom bij HorseSharing
          </h2>
          <p className="mt-2 text-text-secondary">
            Log in of maak een account aan om te beginnen
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
          <button
            onClick={() => login({})}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors duration-200"
          >
            <ArrowRightIcon className="w-5 h-5 mr-2" />
            Inloggen
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">of</span>
            </div>
          </div>

          <button
            onClick={() => register({})}
            className="w-full flex items-center justify-center px-4 py-3 border border-primary text-base font-medium rounded-lg text-primary bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <UserPlusIcon className="w-5 h-5 mr-2" />
            Account Aanmaken
          </button>
        </div>

        <div className="text-center text-sm text-text-secondary">
          <p>
            Door in te loggen ga je akkoord met onze{' '}
            <a href="/terms" className="text-primary-500 hover:text-primary-600">
              Algemene Voorwaarden
            </a>{' '}
            en{' '}
            <a href="/privacy" className="text-primary-500 hover:text-primary-600">
              Privacybeleid
            </a>
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
