import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { User, Edit, Camera, Save, X } from 'lucide-react';
import { api } from '../utils/api';

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

        // First get basic user profile
        const profile = await api.getUserProfile(token);
        setUserProfile(profile);
        
        console.log('🔍 Basic profile loaded:', JSON.stringify(profile, null, 2));
        
        // Then get specific rider/owner profile data
        if (profile.role === 'rider') {
          try {
            const riderProfile = await api.getRiderProfile(token);
            console.log('✅ Rider profile loaded:', JSON.stringify(riderProfile, null, 2));
            setEditData(riderProfile);
          } catch (err) {
            console.log('❌ No rider profile found, will create new one');
            setEditData({});
          }
        } else if (profile.role === 'owner') {
          try {
            const ownerProfile = await api.getOwnerProfile(token);
            console.log('✅ Owner profile loaded:', JSON.stringify(ownerProfile, null, 2));
            setEditData(ownerProfile);
          } catch (err) {
            console.log('❌ No owner profile found, will create new one');
            setEditData({});
          }
        } else {
          setEditData({});
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

      console.log('💾 Saving profile data:', JSON.stringify(editData, null, 2));
      
      if (userProfile.role === 'rider') {
        // Try to create profile first if it doesn't exist
        try {
          await api.updateRiderProfile(token, editData);
        } catch (updateError: any) {
          if (updateError.message.includes('404')) {
            console.log('Profile not found, creating new one...');
            await api.createRiderProfile(token, editData);
          } else {
            throw updateError;
          }
        }
      } else if (userProfile.role === 'owner') {
        await api.updateOwnerProfile(token, editData);
      }

      // Reload profile data - get the specific profile type, not just basic user data
      if (userProfile.role === 'rider') {
        const updatedRiderProfile = await api.getRiderProfile(token);
        setEditData(updatedRiderProfile);
      } else if (userProfile.role === 'owner') {
        const updatedOwnerProfile = await api.getOwnerProfile(token);
        setEditData(updatedOwnerProfile);
      }
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

  // Photo upload handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const uploadedPhotos = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Create a data URL for preview (in production, upload to cloud storage)
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          uploadedPhotos.push(event.target.result as string);
          if (uploadedPhotos.length === files.length) {
            setEditData({
              ...editData,
              photos: [...(editData.photos || []), ...uploadedPhotos]
            });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove photo handler
  const removePhoto = (index: number) => {
    const updatedPhotos = [...(editData.photos || [])];
    updatedPhotos.splice(index, 1);
    setEditData({...editData, photos: updatedPhotos});
  };

  // Video upload handler
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a data URL for preview (in production, upload to cloud storage)
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditData({
          ...editData,
          video_intro_url: event.target.result as string
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // YouTube URL converter
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Geboortedatum
                  </label>
                  <input
                    type="date"
                    value={editData.date_of_birth || ''}
                    onChange={(e) => setEditData({...editData, date_of_birth: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max reisafstand (km)
                  </label>
                  <input
                    type="number"
                    value={editData.max_travel_distance_km || ''}
                    onChange={(e) => setEditData({...editData, max_travel_distance_km: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transport opties
                  </label>
                  <div className="space-y-2">
                    {['auto', 'openbaar_vervoer', 'fiets', 'te_voet'].map(transport => (
                      <label key={transport} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(editData.transport_options || []).includes(transport)}
                          onChange={(e) => {
                            const options = editData.transport_options || [];
                            if (e.target.checked) {
                              setEditData({...editData, transport_options: [...options, transport]});
                            } else {
                              setEditData({...editData, transport_options: options.filter((t: string) => t !== transport)});
                            }
                          }}
                          disabled={!isEditing}
                          className="mr-2"
                        />
                        <span className="capitalize">{transport.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Rider Profile Fields */}
            {userProfile?.role === 'rider' && (
              <>
                {/* Beschikbaarheid */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Beschikbaarheid</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Beschikbare dagen</label>
                      <div className="space-y-2">
                        {['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'].map(day => (
                          <label key={day} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={(editData.available_days || []).includes(day)}
                              onChange={(e) => {
                                const days = editData.available_days || [];
                                if (e.target.checked) {
                                  setEditData({...editData, available_days: [...days, day]});
                                } else {
                                  setEditData({...editData, available_days: days.filter((d: string) => d !== day)});
                                }
                              }}
                              disabled={!isEditing}
                              className="mr-2"
                            />
                            <span className="capitalize">{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tijdsblokken</label>
                      <div className="space-y-2">
                        {['ochtend', 'middag', 'avond'].map(time => (
                          <label key={time} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={(editData.available_time_blocks || []).includes(time)}
                              onChange={(e) => {
                                const times = editData.available_time_blocks || [];
                                if (e.target.checked) {
                                  setEditData({...editData, available_time_blocks: [...times, time]});
                                } else {
                                  setEditData({...editData, available_time_blocks: times.filter((t: string) => t !== time)});
                                }
                              }}
                              disabled={!isEditing}
                              className="mr-2"
                            />
                            <span className="capitalize">{time}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Sessie Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Min sessie duur (min)</label>
                      <input
                        type="number"
                        value={editData.session_duration_min || ''}
                        onChange={(e) => setEditData({...editData, session_duration_min: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max sessie duur (min)</label>
                      <input
                        type="number"
                        value={editData.session_duration_max || ''}
                        onChange={(e) => setEditData({...editData, session_duration_max: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start datum</label>
                      <input
                        type="date"
                        value={editData.start_date || ''}
                        onChange={(e) => setEditData({...editData, start_date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Arrangement duur</label>
                    <select
                      value={editData.arrangement_duration || ''}
                      onChange={(e) => setEditData({...editData, arrangement_duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!isEditing}
                    >
                      <option value="">Selecteer...</option>
                      <option value="temporary">Tijdelijk</option>
                      <option value="ongoing">Doorlopend</option>
                    </select>
                  </div>
                </div>

                {/* Budget */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum budget (€/maand)</label>
                      <input
                        type="number"
                        value={editData.budget_min_euro ? editData.budget_min_euro / 100 : ''}
                        onChange={(e) => setEditData({...editData, budget_min_euro: parseInt(e.target.value) * 100 || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Maximum budget (€/maand)</label>
                      <input
                        type="number"
                        value={editData.budget_max_euro ? editData.budget_max_euro / 100 : ''}
                        onChange={(e) => setEditData({...editData, budget_max_euro: parseInt(e.target.value) * 100 || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget type</label>
                    <select
                      value={editData.budget_type || ''}
                      onChange={(e) => setEditData({...editData, budget_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!isEditing}
                    >
                      <option value="">Selecteer...</option>
                      <option value="monthly">Per maand</option>
                      <option value="per_session">Per sessie</option>
                    </select>
                  </div>
                </div>

                {/* Disciplines */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Disciplines & Doelen</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discipline voorkeuren</label>
                      <div className="space-y-2">
                        {['dressuur', 'springen', 'eventing', 'western', 'buitenritten', 'natural_horsemanship'].map(discipline => (
                          <label key={discipline} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={(editData.discipline_preferences || []).includes(discipline)}
                              onChange={(e) => {
                                const disciplines = editData.discipline_preferences || [];
                                if (e.target.checked) {
                                  setEditData({...editData, discipline_preferences: [...disciplines, discipline]});
                                } else {
                                  setEditData({...editData, discipline_preferences: disciplines.filter((d: string) => d !== discipline)});
                                }
                              }}
                              disabled={!isEditing}
                              className="mr-2"
                            />
                            <span className="capitalize">{discipline.replace('_', ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rijdoelen</label>
                      <div className="space-y-2">
                        {['recreatie', 'training', 'wedstrijden', 'therapie', 'sociale_contacten'].map(goal => (
                          <label key={goal} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={(editData.riding_goals || []).includes(goal)}
                              onChange={(e) => {
                                const goals = editData.riding_goals || [];
                                if (e.target.checked) {
                                  setEditData({...editData, riding_goals: [...goals, goal]});
                                } else {
                                  setEditData({...editData, riding_goals: goals.filter((g: string) => g !== goal)});
                                }
                              }}
                              disabled={!isEditing}
                              className="mr-2"
                            />
                            <span className="capitalize">{goal.replace('_', ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ervaring */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ervaring</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Jaren ervaring</label>
                      <input
                        type="number"
                        value={editData.experience_years || ''}
                        onChange={(e) => setEditData({...editData, experience_years: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Certificeringsniveau</label>
                      <select
                        value={editData.certification_level || ''}
                        onChange={(e) => setEditData({...editData, certification_level: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={!isEditing}
                      >
                        <option value="">Selecteer niveau</option>
                        <option value="beginner">Beginner</option>
                        <option value="gevorderd_beginner">Gevorderd beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="gevorderd">Gevorderd</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Vorige instructeurs */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vorige instructeurs (referenties)</label>
                    <textarea
                      value={(editData.previous_instructors || []).join('\n')}
                      onChange={(e) => setEditData({...editData, previous_instructors: e.target.value.split('\n').filter(line => line.trim())})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly={!isEditing}
                      rows={3}
                      placeholder="Elke instructeur op een nieuwe regel..."
                    />
                  </div>
                  
                  {/* Persoonlijkheidsstijl */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Persoonlijkheidsstijl</label>
                    <div className="space-y-2">
                      {['geduldig', 'consistent', 'speels', 'competitief', 'rustig', 'energiek'].map(style => (
                        <label key={style} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(editData.personality_style || []).includes(style)}
                            onChange={(e) => {
                              const styles = editData.personality_style || [];
                              if (e.target.checked) {
                                setEditData({...editData, personality_style: [...styles, style]});
                              } else {
                                setEditData({...editData, personality_style: styles.filter((s: string) => s !== style)});
                              }
                            }}
                            disabled={!isEditing}
                            className="mr-2"
                          />
                          <span className="capitalize">{style}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Transport & Sessie Details */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Transport & Sessie Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transport opties</label>
                      <div className="space-y-2">
                        {['auto', 'openbaar_vervoer', 'fiets', 'te_voet'].map(transport => (
                          <label key={transport} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={(editData.transport_options || []).includes(transport)}
                              onChange={(e) => {
                                const options = editData.transport_options || [];
                                if (e.target.checked) {
                                  setEditData({...editData, transport_options: [...options, transport]});
                                } else {
                                  setEditData({...editData, transport_options: options.filter((t: string) => t !== transport)});
                                }
                              }}
                              disabled={!isEditing}
                              className="mr-2"
                            />
                            <span className="capitalize">{transport.replace('_', ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sessie duur (min)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={editData.session_duration_min || ''}
                          onChange={(e) => setEditData({...editData, session_duration_min: parseInt(e.target.value) || 60})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          readOnly={!isEditing}
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={editData.session_duration_max || ''}
                          onChange={(e) => setEditData({...editData, session_duration_max: parseInt(e.target.value) || 120})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comfort Levels */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Comfort Levels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      {[
                        { key: 'traffic', label: 'Verkeer' },
                        { key: 'outdoor_solo', label: 'Alleen buitenrijden' },
                        { key: 'nervous_horses', label: 'Nerveuze paarden' },
                        { key: 'young_horses', label: 'Jonge paarden' }
                      ].map(item => (
                        <label key={item.key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editData.comfort_levels?.[item.key] || false}
                            onChange={(e) => setEditData({
                              ...editData, 
                              comfort_levels: {
                                ...editData.comfort_levels,
                                [item.key]: e.target.checked
                              }
                            })}
                            disabled={!isEditing}
                            className="mr-2"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Springen hoogte (cm)</label>
                      <input
                        type="number"
                        value={editData.comfort_levels?.jumping_height || ''}
                        onChange={(e) => setEditData({
                          ...editData,
                          comfort_levels: {
                            ...editData.comfort_levels,
                            jumping_height: parseInt(e.target.value) || 0
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Taken & Materiaal */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Taken & Materiaal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bereid tot taken</label>
                      <div className="space-y-2">
                        {['uitrijden', 'voeren', 'poetsen', 'longeren', 'stalwerk', 'transport'].map(task => (
                          <label key={task} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={(editData.willing_tasks || []).includes(task)}
                              onChange={(e) => {
                                const tasks = editData.willing_tasks || [];
                                if (e.target.checked) {
                                  setEditData({...editData, willing_tasks: [...tasks, task]});
                                } else {
                                  setEditData({...editData, willing_tasks: tasks.filter((t: string) => t !== task)});
                                }
                              }}
                              disabled={!isEditing}
                              className="mr-2"
                            />
                            <span className="capitalize">{task}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Materiaal voorkeuren</label>
                      <div className="space-y-2">
                        {[
                          { key: 'bitless_ok', label: 'Bitloos rijden OK' },
                          { key: 'spurs', label: 'Sporen gebruiken' },
                          { key: 'auxiliary_reins', label: 'Hulpteugels OK' },
                          { key: 'own_helmet', label: 'Eigen helm' }
                        ].map(item => (
                          <label key={item.key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editData.material_preferences?.[item.key] || false}
                              onChange={(e) => setEditData({
                                ...editData,
                                material_preferences: {
                                  ...editData.material_preferences,
                                  [item.key]: e.target.checked
                                }
                              })}
                              disabled={!isEditing}
                              className="mr-2"
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                </div>

                {/* Gezondheid & No-gos */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Gezondheid & Restricties</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gezondheidsrestricties</label>
                      <div className="space-y-2">
                        {['hoogtevrees', 'rugproblemen', 'knieproblemen', 'allergieën', 'medicatie'].map(health => (
                          <label key={health} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={(editData.health_restrictions || []).includes(health)}
                              onChange={(e) => {
                                const restrictions = editData.health_restrictions || [];
                                if (e.target.checked) {
                                  setEditData({...editData, health_restrictions: [...restrictions, health]});
                                } else {
                                  setEditData({...editData, health_restrictions: restrictions.filter((h: string) => h !== health)});
                                }
                              }}
                              disabled={!isEditing}
                              className="mr-2"
                            />
                            <span className="capitalize">{health}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">No-gos</label>
                      <div className="space-y-2">
                        {['drukke_stallen', 'avond_afspraken', 'weekenden', 'slecht_weer', 'grote_groepen'].map(nogo => (
                          <label key={nogo} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={(editData.no_gos || []).includes(nogo)}
                              onChange={(e) => {
                                const nogos = editData.no_gos || [];
                                if (e.target.checked) {
                                  setEditData({...editData, no_gos: [...nogos, nogo]});
                                } else {
                                  setEditData({...editData, no_gos: nogos.filter((n: string) => n !== nogo)});
                                }
                              }}
                              disabled={!isEditing}
                              className="mr-2"
                            />
                            <span className="capitalize">{nogo.replace('_', ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editData.insurance_coverage || false}
                        onChange={(e) => setEditData({...editData, insurance_coverage: e.target.checked})}
                        disabled={!isEditing}
                        className="mr-2"
                      />
                      <span>Verzekeringsdekking aanwezig</span>
                    </label>
                  </div>
                </div>

                {/* Media */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>
                  
                  {/* Foto's */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Foto's</label>
                    
                    {/* Upload knop */}
                    {isEditing && (
                      <div className="mb-4">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="photo-upload"
                        />
                        <label
                          htmlFor="photo-upload"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Foto's toevoegen
                        </label>
                      </div>
                    )}
                    
                    {/* Foto preview grid */}
                    {editData.photos && editData.photos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                        {editData.photos.map((photo: string, index: number) => (
                          <div key={index} className="relative group">
                            <img
                              src={photo}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border"
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkM4LjY4NjI5IDE2IDYgMTMuMzEzNyA2IDEwQzYgNi42ODYyOSA4LjY4NjI5IDQgMTIgNEMxNS4zMTM3IDQgMTggNi42ODYyOSAxOCAxMEMxOCAxMy4zMTM3IDE1LjMxMzcgMTYgMTIgMTZaIiBzdHJva2U9IiM5Q0E0QUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMTIgMTJDMTMuMTA0NiAxMiAxNCAxMS4xMDQ2IDE0IDEwQzE0IDguODk1NDMgMTMuMTA0NiA4IDEyIDhDMTAuODk1NCA4IDEwIDguODk1NDMgMTAgMTBDMTAgMTEuMTA0NiAxMC44OTU0IDEyIDEyIDEyWiIgZmlsbD0iIzlDQTRBRiIvPgo8L3N2Zz4K';
                              }}
                            />
                            {isEditing && (
                              <button
                                onClick={() => removePhoto(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Video Intro */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video Introductie</label>
                    
                    {/* Video upload/URL input */}
                    <div className="space-y-3">
                      {isEditing && (
                        <div className="flex space-x-2">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="hidden"
                            id="video-upload"
                          />
                          <label
                            htmlFor="video-upload"
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Video uploaden
                          </label>
                          <span className="text-gray-500 self-center">of</span>
                        </div>
                      )}
                      
                      <input
                        type="url"
                        value={editData.video_intro_url || ''}
                        onChange={(e) => setEditData({...editData, video_intro_url: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly={!isEditing}
                        placeholder="YouTube URL of andere video link..."
                      />
                      
                      {/* Video preview */}
                      {editData.video_intro_url && (
                        <div className="mt-3">
                          {editData.video_intro_url.includes('youtube.com') || editData.video_intro_url.includes('youtu.be') ? (
                            <div className="aspect-video">
                              <iframe
                                src={getYouTubeEmbedUrl(editData.video_intro_url)}
                                className="w-full h-full rounded-lg"
                                frameBorder="0"
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <video
                              src={editData.video_intro_url}
                              controls
                              className="w-full max-h-64 rounded-lg"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
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
