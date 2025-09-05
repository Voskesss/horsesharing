import { useState, useEffect } from 'react';
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
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  // Progress calculation based on answered questions
  const calculateProgress = () => {
    let totalQuestions = 0;
    let answeredQuestions = 0;

    // Step 1: Basic info (7 verplichte vragen)
    totalQuestions += 7;
    if (basicInfo.first_name) answeredQuestions++;
    if (basicInfo.last_name) answeredQuestions++;
    if (basicInfo.phone) answeredQuestions++;
    if (basicInfo.date_of_birth) answeredQuestions++;
    if (basicInfo.postcode) answeredQuestions++;
    if (basicInfo.max_travel_distance_km > 0) answeredQuestions++;
    if (basicInfo.transport_options.length > 0) answeredQuestions++;

    // Step 2: Availability (4 verplichte vragen)
    totalQuestions += 4;
    if (availability.available_days.length > 0) answeredQuestions++;
    if (availability.available_time_blocks.length > 0) answeredQuestions++;
    if (availability.session_duration_min > 0) answeredQuestions++;
    if (availability.session_duration_max > 0) answeredQuestions++;

    // Step 3: Budget (2 verplichte vragen)
    totalQuestions += 2;
    if (budget.budget_min_euro > 0) answeredQuestions++;
    if (budget.budget_max_euro > 0) answeredQuestions++;

    // Step 4: Experience (3 verplichte vragen - previous_instructors is optioneel)
    totalQuestions += 3;
    if (experience.experience_years >= 0) answeredQuestions++;
    if (experience.certification_level) answeredQuestions++;
    if (Object.keys(experience.comfort_levels).some(key => experience.comfort_levels[key as keyof typeof experience.comfort_levels])) answeredQuestions++;

    // Step 5: Goals (3 verplichte vragen)
    totalQuestions += 3;
    if (goals.riding_goals.length > 0) answeredQuestions++;
    if (goals.discipline_preferences.length > 0) answeredQuestions++;
    if (goals.personality_style.length > 0) answeredQuestions++;

    // Step 6: Tasks (1 verplichte vraag)
    totalQuestions += 1;
    if (tasks.willing_tasks.length > 0) answeredQuestions++;

    // Step 7: Insurance (1 verplichte vraag - health_restrictions en no_gos zijn optioneel)
    totalQuestions += 1;
    if (preferences.insurance_coverage !== undefined) answeredQuestions++;

    // Step 8: Media - volledig optioneel, telt niet mee

    return {
      totalQuestions,
      answeredQuestions,
      percentage: Math.round((answeredQuestions / totalQuestions) * 100)
    };
  };

  const progress = calculateProgress();

  const transportOptions = ['auto', 'openbaar_vervoer', 'fiets', 'te_voet'];
  const weekDays = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];
  const timeBlocks = ['ochtend', 'middag', 'avond'];
  const ridingGoals = ['recreatie', 'training', 'wedstrijden', 'therapie', 'sociale_contacten'];
  const disciplines = ['dressuur', 'springen', 'eventing', 'western', 'buitenritten', 'natural_horsemanship'];
  const availableTasks = ['uitrijden', 'voeren', 'poetsen', 'longeren', 'stalwerk', 'transport'];
  const healthRestrictions = ['hoogtevrees', 'rugproblemen', 'knieproblemen', 'allergieën', 'medicatie'];
  const noGos = ['drukke_stallen', 'avond_afspraken', 'weekenden', 'slecht_weer', 'grote_groepen'];
  const personalityStyles = ['rustig', 'energiek', 'geduldig', 'assertief', 'flexibel', 'gestructureerd'];

  // Load existing rider profile data
  useEffect(() => {
    const loadExistingProfile = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        setIsLoading(true);
        // Get Kinde token
        let token;
        try {
          // @ts-ignore - getToken exists but TypeScript doesn't recognize it
          token = await kindeAuth.getToken();
        } catch (tokenError) {
          console.error('Error getting token:', tokenError);
          token = 'placeholder-token';
        }
        
        // Try to get existing rider profile
        console.log('🔍 Loading existing profile for onboarding...');
        
        try {
          const existingProfile = await api.getRiderProfile(token);
          
          if (existingProfile) {
            console.log('✅ Existing rider profile found, pre-filling onboarding:', JSON.stringify(existingProfile, null, 2));
          
          // Fill basic info
          setBasicInfo(prev => ({
            ...prev,
            first_name: existingProfile.first_name || prev.first_name,
            last_name: existingProfile.last_name || prev.last_name,
            phone: existingProfile.phone || prev.phone,
            date_of_birth: existingProfile.date_of_birth || prev.date_of_birth,
            postcode: existingProfile.postcode || prev.postcode,
            max_travel_distance_km: existingProfile.max_travel_distance_km || prev.max_travel_distance_km,
            transport_options: existingProfile.transport_options || prev.transport_options
          }));
          
          // Fill availability
          setAvailability(prev => ({
            ...prev,
            available_days: existingProfile.available_days || prev.available_days,
            available_time_blocks: existingProfile.available_time_blocks || prev.available_time_blocks,
            session_duration_min: existingProfile.session_duration_min || prev.session_duration_min,
            session_duration_max: existingProfile.session_duration_max || prev.session_duration_max,
            start_date: existingProfile.start_date || prev.start_date,
            arrangement_duration: existingProfile.arrangement_duration || prev.arrangement_duration
          }));
          
          // Fill budget
          setBudget(prev => ({
            ...prev,
            budget_min_euro: existingProfile.budget_min_euro || prev.budget_min_euro,
            budget_max_euro: existingProfile.budget_max_euro || prev.budget_max_euro,
            budget_type: existingProfile.budget_type || prev.budget_type
          }));
          
          // Fill experience
          setExperience(prev => ({
            ...prev,
            experience_years: existingProfile.experience_years || prev.experience_years,
            certification_level: existingProfile.certification_level || prev.certification_level,
            previous_instructors: existingProfile.previous_instructors || prev.previous_instructors,
            comfort_levels: existingProfile.comfort_levels || prev.comfort_levels
          }));
          
          // Fill goals
          setGoals(prev => ({
            ...prev,
            riding_goals: existingProfile.riding_goals || prev.riding_goals,
            discipline_preferences: existingProfile.discipline_preferences || prev.discipline_preferences,
            personality_style: existingProfile.personality_style || prev.personality_style
          }));
          
          // Fill tasks
          setTasks(prev => ({
            ...prev,
            willing_tasks: existingProfile.willing_tasks || prev.willing_tasks,
            task_frequency: existingProfile.task_frequency || prev.task_frequency
          }));
          
          // Fill preferences
          setPreferences(prev => ({
            ...prev,
            material_preferences: existingProfile.material_preferences || prev.material_preferences,
            health_restrictions: existingProfile.health_restrictions || prev.health_restrictions,
            insurance_coverage: existingProfile.insurance_coverage || prev.insurance_coverage,
            no_gos: existingProfile.no_gos || prev.no_gos
          }));
          
          // Fill media
          setMedia(prev => ({
            ...prev,
            photos: existingProfile.photos || prev.photos,
            video_intro_url: existingProfile.video_intro_url || prev.video_intro_url
          }));
          } else {
            console.log('❌ No existing profile found, starting fresh onboarding');
          }
        } catch (error) {
          console.log('❌ Error loading profile:', error);
          // This is fine - user might not have a profile yet
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        console.log('❌ Error in loadExistingProfile:', error);
        setIsLoading(false);
      }
    };
    
    loadExistingProfile();
  }, [isAuthenticated, user, kindeAuth]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Profiel wordt geladen...</p>
        </div>
      </div>
    );
  }

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
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {progress.answeredQuestions} van {progress.totalQuestions} vragen beantwoord ({progress.percentage}%)
                </span>
                {isSaving && (
                  <span className="text-xs text-blue-600 flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600 mr-1"></div>
                    Opslaan...
                  </span>
                )}
                {lastSaved && !isSaving && (
                  <span className="text-xs text-green-600">
                    Opgeslagen om {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Vorige instructeurs (referenties)</label>
                <textarea
                  value={experience.previous_instructors.join('\n')}
                  onChange={(e) => setExperience({
                    ...experience,
                    previous_instructors: e.target.value.split('\n').filter(line => line.trim())
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Elke instructeur op een nieuwe regel..."
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
                
                {/* Bestaande foto's tonen */}
                {media.photos && media.photos.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Huidige foto's:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {media.photos.map((photo: any, index: number) => (
                        <div key={index} className="relative group">
                          <img
                            src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkM4LjY4NjI5IDE2IDYgMTMuMzEzNyA2IDEwQzYgNi42ODYyOSA4LjY4NjI5IDQgMTIgNEMxNS4zMTM3IDQgMTggNi42ODYyOSAxOCAxMEMxOCAxMy4zMTM3IDE1LjMxMzcgMTYgMTIgMTZaIiBzdHJva2U9IiM5Q0E0QUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMTIgMTJDMTMuMTA0NiAxMiAxNCAxMS4xMDQ2IDE0IDEwQzE0IDguODk1NDMgMTMuMTA0NiA4IDEyIDhDMTAuODk1NCA4IDEwIDguODk1NDMgMTAgMTBDMTAgMTEuMTA0NiAxMC44OTU0IDEyIDEyIDEyWiIgZmlsbD0iIzlDQTRBRiIvPgo8L3N2Zz4K';
                            }}
                          />
                          <button
                            onClick={() => {
                              const newPhotos = media.photos.filter((_: any, i: number) => i !== index);
                              setMedia({...media, photos: newPhotos});
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
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
                    {media.photos.length > 0 ? 'Meer foto\'s toevoegen' : 'Selecteer foto\'s'}
                  </label>
                </div>
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
