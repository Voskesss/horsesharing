import { motion } from 'framer-motion';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Navigate } from 'react-router-dom';
import { ArrowRightIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const kindeAuth = useKindeAuth();
  const { isAuthenticated, isLoading, error } = kindeAuth;
  
  console.log('Login - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'error:', error);
  console.log('KindeAuth object:', kindeAuth);
  console.log('Available methods:', Object.keys(kindeAuth));
  console.log('Login function type:', typeof kindeAuth.login);
  console.log('Login function exists:', !!kindeAuth.login);
  
  if (kindeAuth.user) {
    console.log('Current user:', kindeAuth.user);
  }

  if (isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
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
            onClick={() => {
              console.log('Login button clicked, calling login()');
              console.log('Current URL:', window.location.href);
              console.log('isLoading:', isLoading);
              
              if (isLoading) {
                console.log('Still loading, please wait...');
                return;
              }
              
              console.log('About to call login function...');
              if (kindeAuth.login) {
                try {
                  const result = kindeAuth.login({});
                  console.log('Login function result:', result);
                } catch (error) {
                  console.error('Login error:', error);
                }
              } else {
                console.error('Login function not available');
              }
            }}
            disabled={isLoading}
            className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white transition-colors duration-200 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <ArrowRightIcon className="w-5 h-5 mr-2" />
            {isLoading ? 'Laden...' : 'Inloggen'}
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
            onClick={() => {
              if (kindeAuth.register) {
                kindeAuth.register({});
              } else {
                console.error('Register function not available');
              }
            }}
            className="w-full flex items-center justify-center px-4 py-3 border border-blue-600 text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
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
