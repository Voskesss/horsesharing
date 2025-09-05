import { useState } from 'react';
import { motion } from 'framer-motion';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { HomeIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { api } from '../utils/api';

const OwnerProfile = () => {
  const kindeAuth = useKindeAuth();
  const { user, isAuthenticated } = kindeAuth;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Persoonlijke gegevens
  const [personalData, setPersonalData] = useState({
    firstName: user?.given_name || '',
    lastName: user?.family_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    stableName: '',
  });

  // Paarden
  const [horses, setHorses] = useState<any[]>([]);
  const [currentHorse, setCurrentHorse] = useState({
    name: '',
    breed: '',
    age: '',
    gender: '',
    description: '',
    price: '',
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handlePersonalDataChange = (field: string, value: string) => {
    setPersonalData(prev => ({ ...prev, [field]: value }));
  };

  const handleHorseChange = (field: string, value: string) => {
    setCurrentHorse(prev => ({ ...prev, [field]: value }));
  };

  const addHorse = () => {
    if (currentHorse.name && currentHorse.breed) {
      setHorses(prev => [...prev, { ...currentHorse, id: Date.now() }]);
      setCurrentHorse({ name: '', breed: '', age: '', gender: '', description: '', price: '' });
      setCurrentStep(2);
    }
  };

  const removeHorse = (id: number) => {
    setHorses(prev => prev.filter(h => h.id !== id));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Get Kinde token for API call
      let token;
      try {
        // @ts-ignore - getToken exists but TypeScript doesn't recognize it
        token = await kindeAuth.getToken();
      } catch (tokenError) {
        console.error('Error getting token:', tokenError);
        token = 'placeholder-token';
      }

      // Prepare flexible profile data structure
      const profileData = {
        first_name: personalData.firstName,
        last_name: personalData.lastName,
        phone: personalData.phone,
        stable_data: {
          name: personalData.stableName,
          address: personalData.address,
          city: personalData.city,
          postal_code: personalData.postalCode,
          facilities: '',
          description: ''
        },
        horses_data: horses.map(horse => ({
          name: horse.name,
          age: horse.age,
          breed: horse.breed,
          gender: horse.gender,
          height: '',
          discipline: '',
          experience_level: '',
          character: '',
          special_needs: ''
        })),
        preferences_data: {
          // Can be extended later for owner preferences
        },
        media_data: {
          stable_photos: [], // TODO: Handle file uploads later
          horse_photos: {}
        },
        is_complete: true
      };

      console.log('Saving owner profile:', profileData);
      
      // Save profile via API
      await api.createOwnerProfile(token, profileData);
      console.log('Owner profile saved successfully!');
      
      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error saving owner profile:', error);
      // Still redirect for now, but show error
      alert('Er is een fout opgetreden bij het opslaan van je profiel. Probeer het later opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center">
                <HomeIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Eigenaar Profiel</h1>
            <p className="text-gray-600 mt-2">Vertel ons over jezelf en je paarden</p>
          </div>

          {/* Step 1: Persoonlijke Gegevens */}
          {currentStep === 1 && (
            <motion.div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Persoonlijke Gegevens</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Voornaam</label>
                  <input
                    type="text"
                    value={personalData.firstName}
                    onChange={(e) => handlePersonalDataChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Achternaam</label>
                  <input
                    type="text"
                    value={personalData.lastName}
                    onChange={(e) => handlePersonalDataChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={personalData.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefoon</label>
                <input
                  type="tel"
                  value={personalData.phone}
                  onChange={(e) => handlePersonalDataChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stal Naam</label>
                <input
                  type="text"
                  value={personalData.stableName}
                  onChange={(e) => handlePersonalDataChange('stableName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Volgende: Paarden Toevoegen
              </button>
            </motion.div>
          )}

          {/* Step 2: Paarden */}
          {currentStep === 2 && (
            <motion.div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Je Paarden</h2>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Paard Toevoegen
                </button>
              </div>

              {horses.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-600 mb-4">Je hebt nog geen paarden toegevoegd</p>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    Voeg je eerste paard toe
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {horses.map((horse) => (
                    <div key={horse.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{horse.name}</h3>
                          <p className="text-gray-600">{horse.breed} • {horse.age} jaar • {horse.gender}</p>
                          <p className="text-gray-600">€{horse.price}/uur</p>
                        </div>
                        <button
                          onClick={() => removeHorse(horse.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Vorige
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || horses.length === 0}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Opslaan...' : 'Profiel Voltooien'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Paard Toevoegen */}
          {currentStep === 3 && (
            <motion.div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Paard Toevoegen</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Naam</label>
                  <input
                    type="text"
                    value={currentHorse.name}
                    onChange={(e) => handleHorseChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ras</label>
                  <input
                    type="text"
                    value={currentHorse.breed}
                    onChange={(e) => handleHorseChange('breed', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leeftijd</label>
                  <input
                    type="number"
                    value={currentHorse.age}
                    onChange={(e) => handleHorseChange('age', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Geslacht</label>
                  <select
                    value={currentHorse.gender}
                    onChange={(e) => handleHorseChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecteer</option>
                    <option value="Merrie">Merrie</option>
                    <option value="Ruin">Ruin</option>
                    <option value="Hengst">Hengst</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prijs per uur (€)</label>
                <input
                  type="number"
                  value={currentHorse.price}
                  onChange={(e) => handleHorseChange('price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Beschrijving</label>
                <textarea
                  value={currentHorse.description}
                  onChange={(e) => handleHorseChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Terug
                </button>
                <button
                  onClick={addHorse}
                  disabled={!currentHorse.name || !currentHorse.breed}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Paard Toevoegen
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OwnerProfile;
