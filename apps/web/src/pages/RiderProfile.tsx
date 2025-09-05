import { useState } from 'react';
import { motion } from 'framer-motion';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserIcon, CameraIcon } from '@heroicons/react/24/outline';
import { api } from '../utils/api';

const RiderProfile = () => {
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
    dateOfBirth: '',
  });

  // Ruiter voorkeuren - uitgebreid met alle matching velden
  const [riderPreferences, setRiderPreferences] = useState({
    // Basis ervaring
    experience: '',
    experienceYears: '',
    certificationLevel: '',
    comfortLevels: [] as string[],
    
    // Disciplines en doelen
    disciplines: [] as string[],
    disciplinePreferences: [] as string[],
    ridingGoals: [] as string[],
    
    // Locatie en reizen
    maxTravelDistance: '',
    
    // Beschikbaarheid
    availability: [] as string[],
    timeBlocks: [] as string[],
    sessionDuration: '',
    
    // Budget
    budgetMin: '',
    budgetMax: '',
    budgetType: 'monthly',
    
    // Persoonlijkheid en stijl
    personalityStyle: [] as string[],
    
    // Taken en verantwoordelijkheden
    willingTasks: [] as string[],
    taskFrequency: '',
    
    // Materiaal voorkeuren
    materialPreferences: [] as string[],
    
    // Gezondheid en restricties
    healthRestrictions: '',
    insuranceCoverage: '',
    
    // Legacy velden
    preferredAge: '',
    preferredSize: '',
    location: '',
    maxDistance: '',
    goals: '',
    description: '',
  });

  const [media, setMedia] = useState({
    photos: [] as File[],
    videos: [] as File[],
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handlePersonalDataChange = (field: string, value: string) => {
    setPersonalData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: string, value: string | string[]) => {
    setRiderPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleDisciplineToggle = (discipline: string) => {
    setRiderPreferences(prev => ({
      ...prev,
      disciplines: prev.disciplines.includes(discipline)
        ? prev.disciplines.filter(d => d !== discipline)
        : [...prev.disciplines, discipline]
    }));
  };

  const handleAvailabilityToggle = (day: string) => {
    setRiderPreferences(prev => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter(d => d !== day)
        : [...prev.availability, day]
    }));
  };

  const handleFileUpload = (type: 'photos' | 'videos', files: FileList | null) => {
    if (files) {
      setMedia(prev => ({
        ...prev,
        [type]: [...prev[type], ...Array.from(files)]
      }));
    }
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
        date_of_birth: personalData.dateOfBirth,
        address_data: {
          address: personalData.address,
          city: personalData.city,
          postal_code: personalData.postalCode
        },
        experience_data: {
          level: riderPreferences.experience,
          disciplines: riderPreferences.disciplines
        },
        preferences_data: {
          preferred_age: riderPreferences.preferredAge,
          preferred_size: riderPreferences.preferredSize,
          location: riderPreferences.location,
          max_distance: riderPreferences.maxDistance
        },
        availability_data: {
          days: riderPreferences.availability
        },
        goals_data: {
          description: riderPreferences.description,
          goals: riderPreferences.goals
        },
        media_data: {
          photos: [], // TODO: Handle file uploads later
          videos: []
        },
        is_complete: true
      };

      console.log('Saving rider profile:', profileData);
      
      // Save profile via API
      await api.createRiderProfile(token, profileData);
      console.log('Rider profile saved successfully!');
      
      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error saving rider profile:', error);
      // Still redirect for now, but show error
      alert('Er is een fout opgetreden bij het opslaan van je profiel. Probeer het later opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const disciplines = ['Dressuur', 'Springen', 'Eventing', 'Western', 'Recreatief', 'Buitenritten'];
  const experienceLevels = ['Beginner', 'Gevorderd beginner', 'Intermediate', 'Gevorderd', 'Expert'];
  const weekDays = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
  const timeBlocks = ['Ochtend (8-12)', 'Middag (12-17)', 'Avond (17-21)'];
  const comfortLevels = ['Beginner paarden', 'Ervaren paarden', 'Jonge paarden', 'Gevoelige paarden'];
  const ridingGoals = ['Recreatief rijden', 'Wedstrijden', 'Training verbeteren', 'Angst overwinnen', 'Nieuwe discipline leren'];
  const personalityStyles = ['Rustig en geduldig', 'Energiek en spontaan', 'Gestructureerd', 'Flexibel', 'Competitief'];
  const willingTasksList = ['Poetsen', 'Voeren', 'Paddock uitmesten', 'Stalwerk', 'Transport hulp'];
  const materialPrefs = ['Eigen zadel', 'Eigen hoofdstel', 'Stal materiaal', 'Geen voorkeur'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Ruiter Profiel</h1>
            <p className="text-gray-600 mt-2">Vertel ons over jezelf als ruiter</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">Stap {currentStep} van 6</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / 6) * 100)}% voltooid</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Persoonlijke Gegevens */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Persoonlijke Gegevens</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Voornaam</label>
                  <input
                    type="text"
                    value={personalData.firstName}
                    onChange={(e) => handlePersonalDataChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Achternaam</label>
                  <input
                    type="text"
                    value={personalData.lastName}
                    onChange={(e) => handlePersonalDataChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={personalData.email}
                  onChange={(e) => handlePersonalDataChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefoon</label>
                <input
                  type="tel"
                  value={personalData.phone}
                  onChange={(e) => handlePersonalDataChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Geboortedatum</label>
                <input
                  type="date"
                  value={personalData.dateOfBirth}
                  onChange={(e) => handlePersonalDataChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                  <input
                    type="text"
                    value={personalData.address}
                    onChange={(e) => handlePersonalDataChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postcode</label>
                  <input
                    type="text"
                    value={personalData.postalCode}
                    onChange={(e) => handlePersonalDataChange('postalCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plaats</label>
                <input
                  type="text"
                  value={personalData.city}
                  onChange={(e) => handlePersonalDataChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Ervaring & Niveau */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ervaring & Niveau</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ervaring niveau</label>
                  <select
                    value={riderPreferences.experience}
                    onChange={(e) => handlePreferenceChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecteer je ervaring</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jaren ervaring</label>
                  <input
                    type="number"
                    value={riderPreferences.experienceYears}
                    onChange={(e) => handlePreferenceChange('experienceYears', e.target.value)}
                    placeholder="bijv. 5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certificeringen</label>
                <input
                  type="text"
                  value={riderPreferences.certificationLevel}
                  onChange={(e) => handlePreferenceChange('certificationLevel', e.target.value)}
                  placeholder="bijv. Galop 3, FNRS instructeur"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comfort niveau met paarden</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {comfortLevels.map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        const current = riderPreferences.comfortLevels;
                        const updated = current.includes(level)
                          ? current.filter(l => l !== level)
                          : [...current, level];
                        handlePreferenceChange('comfortLevels', updated);
                      }}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        riderPreferences.comfortLevels.includes(level)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verzekering</label>
                <select
                  value={riderPreferences.insuranceCoverage}
                  onChange={(e) => handlePreferenceChange('insuranceCoverage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecteer verzekering</option>
                  <option value="avp">AVP (Aansprakelijkheidsverzekering)</option>
                  <option value="wa">WA verzekering</option>
                  <option value="both">Beide</option>
                  <option value="none">Geen</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gezondheidsrestricties</label>
                <textarea
                  value={riderPreferences.healthRestrictions}
                  onChange={(e) => handlePreferenceChange('healthRestrictions', e.target.value)}
                  placeholder="Eventuele beperkingen of aandachtspunten"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Doelen & Voorkeuren */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Doelen & Voorkeuren</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Disciplines</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {disciplines.map(discipline => (
                    <button
                      key={discipline}
                      type="button"
                      onClick={() => handleDisciplineToggle(discipline)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        riderPreferences.disciplines.includes(discipline)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {discipline}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rijdoelen</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {ridingGoals.map(goal => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => {
                        const current = riderPreferences.ridingGoals;
                        const updated = current.includes(goal)
                          ? current.filter(g => g !== goal)
                          : [...current, goal];
                        handlePreferenceChange('ridingGoals', updated);
                      }}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        riderPreferences.ridingGoals.includes(goal)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Persoonlijkheidsstijl</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {personalityStyles.map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => {
                        const current = riderPreferences.personalityStyle;
                        const updated = current.includes(style)
                          ? current.filter(s => s !== style)
                          : [...current, style];
                        handlePreferenceChange('personalityStyle', updated);
                      }}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        riderPreferences.personalityStyle.includes(style)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Voorkeur leeftijd paard</label>
                  <input
                    type="text"
                    value={riderPreferences.preferredAge}
                    onChange={(e) => handlePreferenceChange('preferredAge', e.target.value)}
                    placeholder="bijv. 8-15 jaar"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Voorkeur grootte</label>
                  <input
                    type="text"
                    value={riderPreferences.preferredSize}
                    onChange={(e) => handlePreferenceChange('preferredSize', e.target.value)}
                    placeholder="bijv. 1.60-1.70m"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Over jezelf</label>
                <textarea
                  value={riderPreferences.description}
                  onChange={(e) => handlePreferenceChange('description', e.target.value)}
                  placeholder="Vertel iets over jezelf als ruiter..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </motion.div>
          )}

          {/* Step 4: Locatie & Beschikbaarheid */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Locatie & Beschikbaarheid</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Locatie voorkeur</label>
                  <input
                    type="text"
                    value={riderPreferences.location}
                    onChange={(e) => handlePreferenceChange('location', e.target.value)}
                    placeholder="Stad of regio"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max reisafstand (km)</label>
                  <input
                    type="number"
                    value={riderPreferences.maxTravelDistance}
                    onChange={(e) => handlePreferenceChange('maxTravelDistance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Beschikbare dagen</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {weekDays.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleAvailabilityToggle(day)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        riderPreferences.availability.includes(day)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {day.slice(0, 2)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tijdsblokken</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {timeBlocks.map(block => (
                    <button
                      key={block}
                      type="button"
                      onClick={() => {
                        const current = riderPreferences.timeBlocks;
                        const updated = current.includes(block)
                          ? current.filter(b => b !== block)
                          : [...current, block];
                        handlePreferenceChange('timeBlocks', updated);
                      }}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        riderPreferences.timeBlocks.includes(block)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {block}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gewenste sessieduur</label>
                <select
                  value={riderPreferences.sessionDuration}
                  onChange={(e) => handlePreferenceChange('sessionDuration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecteer duur</option>
                  <option value="30min">30 minuten</option>
                  <option value="1hour">1 uur</option>
                  <option value="1.5hours">1,5 uur</option>
                  <option value="2hours">2 uur</option>
                  <option value="flexible">Flexibel</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Step 5: Budget & Taken */}
          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget & Taken</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget min (€/maand)</label>
                  <input
                    type="number"
                    value={riderPreferences.budgetMin}
                    onChange={(e) => handlePreferenceChange('budgetMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget max (€/maand)</label>
                  <input
                    type="number"
                    value={riderPreferences.budgetMax}
                    onChange={(e) => handlePreferenceChange('budgetMax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bereid tot stalwerk</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {willingTasksList.map(task => (
                    <button
                      key={task}
                      type="button"
                      onClick={() => {
                        const current = riderPreferences.willingTasks;
                        const updated = current.includes(task)
                          ? current.filter(t => t !== task)
                          : [...current, task];
                        handlePreferenceChange('willingTasks', updated);
                      }}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        riderPreferences.willingTasks.includes(task)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {task}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequentie stalwerk</label>
                <select
                  value={riderPreferences.taskFrequency}
                  onChange={(e) => handlePreferenceChange('taskFrequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecteer frequentie</option>
                  <option value="never">Nooit</option>
                  <option value="rarely">Zelden</option>
                  <option value="sometimes">Soms</option>
                  <option value="often">Vaak</option>
                  <option value="always">Altijd</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Materiaal voorkeuren</label>
                <div className="grid grid-cols-2 gap-2">
                  {materialPrefs.map(pref => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => {
                        const current = riderPreferences.materialPreferences;
                        const updated = current.includes(pref)
                          ? current.filter(p => p !== pref)
                          : [...current, pref];
                        handlePreferenceChange('materialPreferences', updated);
                      }}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        riderPreferences.materialPreferences.includes(pref)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 6: Media Upload */}
          {currentStep === 6 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Foto's en Video's</h2>
              <p className="text-gray-600 mb-6">Laat zien hoe je rijdt! Upload foto's en video's van jezelf te paard.</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto's</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Sleep foto's hierheen of</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload('photos', e.target.files)}
                    className="hidden"
                    id="photos"
                  />
                  <label
                    htmlFor="photos"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Selecteer foto's
                  </label>
                </div>
                {media.photos.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    {media.photos.length} foto(s) geselecteerd
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video's</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Sleep video's hierheen of</p>
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={(e) => handleFileUpload('videos', e.target.files)}
                    className="hidden"
                    id="videos"
                  />
                  <label
                    htmlFor="videos"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Selecteer video's
                  </label>
                </div>
                {media.videos.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    {media.videos.length} video(s) geselecteerd
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Vorige
            </button>

            {currentStep < 6 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Volgende
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Opslaan...' : 'Profiel Voltooien'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RiderProfile;
