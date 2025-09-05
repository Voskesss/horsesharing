import { motion } from 'framer-motion';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Link } from 'react-router-dom';
import { CalendarIcon, HeartIcon, ChatBubbleLeftIcon, CogIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { api } from '../utils/api';

const Dashboard = () => {
  const kindeAuth = useKindeAuth();
  const { user } = kindeAuth;
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileComplete, setProfileComplete] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfileCompleteness = async () => {
      try {
        // @ts-ignore - getToken exists but TypeScript doesn't recognize it
        const token = await kindeAuth.getToken();
        if (token && token !== 'placeholder-token') {
          const profile = await api.getUserProfile(token);
          setUserProfile(profile);
          
          if (profile) {
            let complete = false;
            
            if (profile.role === 'rider') {
              complete = profile.rider_profile && Object.keys(profile.rider_profile).length > 0;
            } else if (profile.role === 'owner') {
              complete = profile.owner_profile && Object.keys(profile.owner_profile).length > 0;
            } else if (profile.role === 'both') {
              const hasRiderProfile = profile.rider_profile && Object.keys(profile.rider_profile).length > 0;
              const hasOwnerProfile = profile.owner_profile && Object.keys(profile.owner_profile).length > 0;
              complete = hasRiderProfile || hasOwnerProfile;
            }
            
            setProfileComplete(complete);
          }
        }
      } catch (error) {
        console.error('Error checking profile completeness:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkProfileCompleteness();
  }, [kindeAuth]);

  const stats = [
    { name: 'Actieve Matches', value: '3', icon: HeartIcon },
    { name: 'Geplande Ritten', value: '8', icon: CalendarIcon },
    { name: 'Berichten', value: '12', icon: ChatBubbleLeftIcon },
    { name: 'Profiel Views', value: '24', icon: CogIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-text-primary">
            Welkom terug, {user?.given_name}! 👋
          </h1>
          <p className="text-text-secondary mt-2">
            Hier is een overzicht van je HorseSharing activiteiten.
          </p>
        </motion.div>

        {/* Profile Incomplete Warning */}
        {!loading && !profileComplete && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4"
          >
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mr-3" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  Profiel Incompleet
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Vul je profiel aan om matches te kunnen maken en alle functies te gebruiken.
                </p>
              </div>
              <div className="ml-4">
                {(userProfile as any)?.role === 'both' ? (
                  <Link
                    to="/profile-choice"
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                  >
                    Profiel Aanvullen
                  </Link>
                ) : (
                  <Link
                    to={(userProfile as any)?.role === 'rider' ? '/profile/rider-new' : `/profile/${(userProfile as any)?.role}`}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                  >
                    Profiel Aanvullen
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-text-secondary">{stat.name}</p>
                  <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 card"
          >
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Recente Activiteit
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">🐎</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">
                      Nieuwe match met Luna - Dressuurpaard
                    </p>
                    <p className="text-xs text-text-secondary">2 uur geleden</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Snelle Acties
            </h2>
            <div className="space-y-3">
              <Link to="/discover" className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 block text-center">
                Zoek Paarden
              </Link>
              <Link to="/horses" className="w-full bg-white text-blue-600 border-2 border-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 block text-center">
                Mijn Paarden
              </Link>
              <Link to="/messages" className="w-full bg-white text-blue-600 border-2 border-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 block text-center">
                Berichten
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
