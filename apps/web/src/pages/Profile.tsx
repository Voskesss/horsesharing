import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { User, Edit, Camera, Save, X } from 'lucide-react';
import { api } from '../utils/api';
import RiderProfileView from '../components/RiderProfileView';

interface UserProfile {
  id: number;
  role: 'rider' | 'owner';
  rider_profile?: any;
  owner_profile?: any;
}

const Profile = () => {
  const kindeAuth = useKindeAuth();
  const { user } = kindeAuth;
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        // @ts-ignore - getToken exists but TypeScript doesn't recognize it
        const token = await kindeAuth.getToken();
        if (!token) {
          setError('Geen authenticatie token gevonden');
          return;
        }

        const profile = await api.getUserProfile(token);
        setUserProfile(profile);
        
        // Initialize edit data with current profile
        if (profile.role === 'rider' && profile.rider_profile) {
          setEditData(profile.rider_profile);
        } else if (profile.role === 'owner' && profile.owner_profile) {
          setEditData(profile.owner_profile);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Kon profiel niet laden');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [kindeAuth]);

  const handleSave = async () => {
    try {
      // @ts-ignore - getToken exists but TypeScript doesn't recognize it
      const token = await kindeAuth.getToken();
      if (!token || !userProfile) return;

      if (userProfile.role === 'rider') {
        await api.updateRiderProfile(token, editData);
      } else if (userProfile.role === 'owner') {
        await api.updateOwnerProfile(token, editData);
      }

      // Reload profile data
      const updatedProfile = await api.getUserProfile(token);
      setUserProfile(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Fout bij opslaan profiel');
    }
  };

  const handleCancel = () => {
    // Reset edit data to current profile
    if (userProfile?.role === 'rider' && userProfile.rider_profile) {
      setEditData(userProfile.rider_profile);
    } else if (userProfile?.role === 'owner' && userProfile.owner_profile) {
      setEditData(userProfile.owner_profile);
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Fout</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mijn Profiel
              </h1>
              <p className="text-gray-600 mt-2">
                Beheer je persoonlijke gegevens en voorkeuren.
              </p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Bewerken
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Opslaan
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  Annuleren
                </button>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 text-center"
          >
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <User className="w-12 h-12 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {user?.given_name} {user?.family_name}
            </h2>
            <p className="text-gray-600 mb-2">{user?.email}</p>
            <p className="text-sm text-blue-600 font-medium mb-4">
              {userProfile?.role === 'rider' ? 'Ruiter' : 'Eigenaar'}
            </p>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Basis Informatie
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Voornaam
                  </label>
                  <input
                    type="text"
                    value={editData.first_name || user?.given_name || ''}
                    onChange={(e) => setEditData({...editData, first_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Achternaam
                  </label>
                  <input
                    type="text"
                    value={editData.last_name || user?.family_name || ''}
                    onChange={(e) => setEditData({...editData, last_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefoon
                  </label>
                  <input
                    type="tel"
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postcode
                  </label>
                  <input
                    type="text"
                    value={editData.postcode || ''}
                    onChange={(e) => setEditData({...editData, postcode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Role-specific profile view */}
            {userProfile?.role === 'rider' && (
              <RiderProfileView 
                profileData={editData}
                isEditing={isEditing}
                onDataChange={(field, value) => setEditData({...editData, [field]: value})}
              />
            )}

            {userProfile?.role === 'owner' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Eigenaar Voorkeuren
                </h3>
                <p className="text-gray-600">Owner profiel component wordt binnenkort toegevoegd...</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
