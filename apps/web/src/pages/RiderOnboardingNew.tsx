import { useState } from 'react';
import { motion } from 'framer-motion';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserIcon, ClockIcon, CurrencyEuroIcon, AcademicCapIcon, HeartIcon, WrenchScrewdriverIcon, ShieldCheckIcon, CameraIcon } from '@heroicons/react/24/outline';
import { api } from '../utils/api';

const RiderOnboardingNew = () => {
  const kindeAuth = useKindeAuth();
  const { user, isAuthenticated } = kindeAuth;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  // Step 1: Basis informatie
  const [basicInfo, setBasicInfo] = useState({
    first_name: user?.given_name || '',
    last_name: user?.family_name || '',
    phone: '',
    date_of_birth: '',
    postcode: '',
    max_travel_distance_km: 25,
    transport_options: [] as string[]
  });

  // Step 2: Beschikbaarheid
  const [availability, setAvailability] = useState({
    available_days: [] as string[],
    available_time_blocks: [] as any[],
    session_duration_min: 60,
    session_duration_max: 120,
    start_date: '',
    arrangement_duration: 'ongoing'
  });

  // Step 3: Budget
  const [budget, setBudget] = useState({
    budget_min_euro: 15000, // 150 euro in cents
    budget_max_euro: 25000, // 250 euro in cents
    budget_type: 'monthly'
  });

  // Step 4: Ervaring & Niveau
  const [experience, setExperience] = useState({
    experience_years: 0,
    certification_level: '',
    previous_instructors: [] as string[],
    comfort_levels: {
      traffic: false,
      outdoor_solo: false,
      jumping_height: 0,
      nervous_horses: false,
      young_horses: false
    }
  });

  // Step 5: Doelen & Voorkeuren
  const [goals, setGoals] = useState({
    riding_goals: [] as string[],
    discipline_preferences: [] as string[],
    personality_style: [] as string[]
  });

  // Step 6: Taken & Verantwoordelijkheden
  const [tasks, setTasks] = useState({
    willing_tasks: [] as string[],
    task_frequency: {} as Record<string, string>
  });

  // Step 7: Materiaal & Gezondheid
  const [preferences, setPreferences] = useState({
    material_preferences: {
      bitless_ok: false,
      spurs: false,
      auxiliary_reins: false,
      own_helmet: true
    },
    health_restrictions: [] as string[],
    insurance_coverage: false,
    no_gos: [] as string[]
  });

  // Step 8: Media
  const [media, setMedia] = useState({
    photos: [] as File[],
    video_intro_url: ''
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let token;
      try {
        // @ts-ignore
        token = await kindeAuth.getToken();
      } catch (tokenError) {
        console.error('Error getting token:', tokenError);
        token = 'placeholder-token';
      }

      // Combine all data into complete profile
      const profileData = {
        ...basicInfo,
        ...availability,
        ...budget,
        ...experience,
        ...goals,
        ...tasks,
        ...preferences,
        photos: [], // TODO: Handle file uploads
        video_intro_url: media.video_intro_url,
        is_complete: true
      };

      console.log('Saving complete rider profile:', profileData);
      await api.createRiderProfile(token, profileData);
      console.log('Rider profile saved successfully!');
      
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error saving rider profile:', error);
      alert('Er is een fout opgetreden bij het opslaan van je profiel. Probeer het later opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const toggleArrayItem = (array: string[], item: string, setter: (value: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const transportOptions = ['auto', 'openbaar_vervoer', 'fiets', 'te_voet'];
  const weekDays = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];
  const timeBlocks = ['ochtend', 'middag', 'avond'];
  const ridingGoals = ['recreatie', 'training', 'wedstrijden', 'therapie', 'sociale_contacten'];
  const disciplines = ['dressuur', 'springen', 'eventing', 'western', 'buitenritten', 'natural_horsemanship'];
  const personalityStyles = ['geduldig', 'consistent', 'speels', 'rustig', 'energiek', 'flexibel'];
  const availableTasks = ['uitrijden', 'voeren', 'poetsen', 'longeren', 'stalwerk', 'transport'];
  const healthRestrictions = ['hoogtevrees', 'rugproblemen', 'knieproblemen', 'allergieën', 'medicatie'];
  const noGos = ['drukke_stallen', 'avond_afspraken', 'weekenden', 'slecht_weer', 'grote_groepen'];

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
            <p className="text-gray-600 mt-2">Vertel ons alles over jezelf voor de beste matches</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">Stap {currentStep} van {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% voltooid</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Basis Informatie */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center mb-4">
                <UserIcon className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Basis Informatie</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Voornaam</label>
                  <input
                    type="text"
                    value={basicInfo.first_name}
                    onChange={(e) => setBasicInfo({...basicInfo, first_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Achternaam</label>
                  <input
                    type="text"
                    value={basicInfo.last_name}
                    onChange={(e) => setBasicInfo({...basicInfo, last_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefoon</label>
                <input
                  type="tel"
                  value={basicInfo.phone}
                  onChange={(e) => setBasicInfo({...basicInfo, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Geboortedatum</label>
                <input
                  type="date"
                  value={basicInfo.date_of_birth}
                  onChange={(e) => setBasicInfo({...basicInfo, date_of_birth: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postcode</label>
                  <input
                    type="text"
                    value={basicInfo.postcode}
                    onChange={(e) => setBasicInfo({...basicInfo, postcode: e.target.value})}
                    placeholder="1234AB"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max reisafstand (km)</label>
                  <input
                    type="number"
                    value={basicInfo.max_travel_distance_km}
                    onChange={(e) => setBasicInfo({...basicInfo, max_travel_distance_km: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vervoer opties</label>
                <div className="grid grid-cols-2 gap-2">
                  {transportOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleArrayItem(basicInfo.transport_options, option, (items) => setBasicInfo({...basicInfo, transport_options: items}))}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        basicInfo.transport_options.includes(option)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Beschikbaarheid */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center mb-4">
                <ClockIcon className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Beschikbaarheid</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Beschikbare dagen</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {weekDays.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleArrayItem(availability.available_days, day, (items) => setAvailability({...availability, available_days: items}))}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        availability.available_days.includes(day)
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
                <div className="grid grid-cols-3 gap-2">
                  {timeBlocks.map(block => (
                    <button
                      key={block}
                      type="button"
                      onClick={() => {
                        const newBlocks = availability.available_time_blocks.includes(block)
                          ? availability.available_time_blocks.filter((b: any) => b !== block)
                          : [...availability.available_time_blocks, block];
                        setAvailability({...availability, available_time_blocks: newBlocks});
                      }}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        availability.available_time_blocks.includes(block)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {block}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min sessie duur (min)</label>
                  <input
                    type="number"
                    value={availability.session_duration_min}
                    onChange={(e) => setAvailability({...availability, session_duration_min: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max sessie duur (min)</label>
                  <input
                    type="number"
                    value={availability.session_duration_max}
                    onChange={(e) => setAvailability({...availability, session_duration_max: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gewenste startdatum</label>
                <input
                  type="date"
                  value={availability.start_date}
                  onChange={(e) => setAvailability({...availability, start_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type arrangement</label>
                <select
                  value={availability.arrangement_duration}
                  onChange={(e) => setAvailability({...availability, arrangement_duration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="temporary">Tijdelijk</option>
                  <option value="ongoing">Doorlopend</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Step 3: Budget */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center mb-4">
                <CurrencyEuroIcon className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Budget</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget type</label>
                <select
                  value={budget.budget_type}
                  onChange={(e) => setBudget({...budget, budget_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="monthly">Maandelijks</option>
                  <option value="per_session">Per sessie</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum budget (€)</label>
                  <input
                    type="number"
                    value={budget.budget_min_euro / 100}
                    onChange={(e) => setBudget({...budget, budget_min_euro: parseInt(e.target.value) * 100})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum budget (€)</label>
                  <input
                    type="number"
                    value={budget.budget_max_euro / 100}
                    onChange={(e) => setBudget({...budget, budget_max_euro: parseInt(e.target.value) * 100})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Ervaring & Niveau */}
          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center mb-4">
                <AcademicCapIcon className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Ervaring & Niveau</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jaren ervaring</label>
                <input
                  type="number"
                  value={experience.experience_years}
                  onChange={(e) => setExperience({...experience, experience_years: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certificering niveau</label>
                <input
                  type="text"
                  value={experience.certification_level}
                  onChange={(e) => setExperience({...experience, certification_level: e.target.value})}
                  placeholder="bijv. FNRS B1, KNHS 3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comfort levels</label>
                <div className="space-y-3">
                  {Object.entries(experience.comfort_levels).map(([key, value]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) => setExperience({
                          ...experience,
                          comfort_levels: {...experience.comfort_levels, [key]: e.target.checked}
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{key.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Doelen & Voorkeuren */}
          {currentStep === 5 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center mb-4">
                <HeartIcon className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Doelen & Voorkeuren</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rij doelen</label>
                <div className="grid grid-cols-2 gap-2">
                  {ridingGoals.map(goal => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleArrayItem(goals.riding_goals, goal, (items) => setGoals({...goals, riding_goals: items}))}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        goals.riding_goals.includes(goal)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {goal.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discipline voorkeuren</label>
                <div className="grid grid-cols-2 gap-2">
                  {disciplines.map(discipline => (
                    <button
                      key={discipline}
                      type="button"
                      onClick={() => toggleArrayItem(goals.discipline_preferences, discipline, (items) => setGoals({...goals, discipline_preferences: items}))}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        goals.discipline_preferences.includes(discipline)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {discipline.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Persoonlijkheid stijl</label>
                <div className="grid grid-cols-2 gap-2">
                  {personalityStyles.map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleArrayItem(goals.personality_style, style, (items) => setGoals({...goals, personality_style: items}))}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        goals.personality_style.includes(style)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 6: Taken & Verantwoordelijkheden */}
          {currentStep === 6 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center mb-4">
                <WrenchScrewdriverIcon className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Taken & Verantwoordelijkheden</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bereid tot taken</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableTasks.map(task => (
                    <button
                      key={task}
                      type="button"
                      onClick={() => toggleArrayItem(tasks.willing_tasks, task, (items) => setTasks({...tasks, willing_tasks: items}))}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        tasks.willing_tasks.includes(task)
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {task.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 7: Materiaal & Gezondheid */}
          {currentStep === 7 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Materiaal & Gezondheid</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Materiaal voorkeuren</label>
                <div className="space-y-3">
                  {Object.entries(preferences.material_preferences).map(([key, value]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          material_preferences: {...preferences.material_preferences, [key]: e.target.checked}
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{key.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gezondheids beperkingen</label>
                <div className="grid grid-cols-2 gap-2">
                  {healthRestrictions.map(restriction => (
                    <button
                      key={restriction}
                      type="button"
                      onClick={() => toggleArrayItem(preferences.health_restrictions, restriction, (items) => setPreferences({...preferences, health_restrictions: items}))}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        preferences.health_restrictions.includes(restriction)
                          ? 'bg-red-100 border-red-500 text-red-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {restriction.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.insurance_coverage}
                    onChange={(e) => setPreferences({...preferences, insurance_coverage: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Ik heb AVP verzekering</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">No-gos</label>
                <div className="grid grid-cols-2 gap-2">
                  {noGos.map(nogo => (
                    <button
                      key={nogo}
                      type="button"
                      onClick={() => toggleArrayItem(preferences.no_gos, nogo, (items) => setPreferences({...preferences, no_gos: items}))}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        preferences.no_gos.includes(nogo)
                          ? 'bg-red-100 border-red-500 text-red-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {nogo.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 8: Media */}
          {currentStep === 8 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center mb-4">
                <CameraIcon className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Foto's & Video</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video intro URL (optioneel)</label>
                <input
                  type="url"
                  value={media.video_intro_url}
                  onChange={(e) => setMedia({...media, video_intro_url: e.target.value})}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto's (optioneel)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Sleep foto's hierheen of</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        setMedia({...media, photos: [...media.photos, ...Array.from(e.target.files)]});
                      }
                    }}
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

            {currentStep < totalSteps ? (
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

export default RiderOnboardingNew;
