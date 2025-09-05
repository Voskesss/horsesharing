import { useState } from 'react';
import { motion } from 'framer-motion';

interface RiderProfileViewProps {
  profileData: any;
  isEditing: boolean;
  onDataChange: (field: string, value: any) => void;
}

const RiderProfileView = ({ profileData, isEditing, onDataChange }: RiderProfileViewProps) => {
  const handleArrayToggle = (field: string, value: string) => {
    const current = profileData[field] || [];
    const updated = current.includes(value)
      ? current.filter((item: string) => item !== value)
      : [...current, value];
    onDataChange(field, updated);
  };

  const disciplines = ['Dressuur', 'Springen', 'Eventing', 'Western', 'Recreatief', 'Buitenritten'];
  const experienceLevels = ['Beginner', 'Gevorderd beginner', 'Intermediate', 'Gevorderd', 'Expert'];
  const weekDays = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
  const timeBlocks = ['Ochtend (8-12)', 'Middag (12-17)', 'Avond (17-21)'];
  const ridingGoals = ['Recreatief rijden', 'Wedstrijden', 'Training verbeteren', 'Angst overwinnen', 'Nieuwe discipline leren'];
  const personalityStyles = ['Rustig en geduldig', 'Energiek en spontaan', 'Gestructureerd', 'Flexibel', 'Competitief'];
  const willingTasksList = ['Poetsen', 'Voeren', 'Paddock uitmesten', 'Stalwerk', 'Transport hulp'];
  const materialPrefs = ['Eigen zadel', 'Eigen hoofdstel', 'Stal materiaal', 'Geen voorkeur'];

  return (
    <div className="space-y-6">
      {/* Ervaring & Niveau */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ervaring & Niveau</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jaren ervaring</label>
            <input
              type="number"
              value={profileData.experience_years || ''}
              onChange={(e) => onDataChange('experience_years', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certificering niveau</label>
            <input
              type="text"
              value={profileData.certification_level || ''}
              onChange={(e) => onDataChange('certification_level', e.target.value)}
              placeholder="bijv. Galop 3, FNRS B1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly={!isEditing}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Comfort niveaus</label>
          {isEditing ? (
            <textarea
              value={JSON.stringify(profileData.comfort_levels || {}, null, 2)}
              onChange={(e) => {
                try {
                  onDataChange('comfort_levels', JSON.parse(e.target.value));
                } catch {}
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder='{"traffic": true, "outdoor_solo": false, "jumping_height": 60}'
            />
          ) : (
            <div className="text-sm text-gray-600">
              {profileData.comfort_levels ? JSON.stringify(profileData.comfort_levels, null, 2) : 'Niet ingevuld'}
            </div>
          )}
        </div>
      </motion.div>

      {/* Locatie & Beschikbaarheid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Locatie & Beschikbaarheid</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max reisafstand (km)</label>
            <input
              type="number"
              value={profileData.max_travel_distance_km || ''}
              onChange={(e) => onDataChange('max_travel_distance_km', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sessie duur (min)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={profileData.session_duration_min || ''}
                onChange={(e) => onDataChange('session_duration_min', parseInt(e.target.value) || 0)}
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={!isEditing}
              />
              <input
                type="number"
                value={profileData.session_duration_max || ''}
                onChange={(e) => onDataChange('session_duration_max', parseInt(e.target.value) || 0)}
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Beschikbare dagen</label>
          {isEditing ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {weekDays.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleArrayToggle('available_days', day.toLowerCase())}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    (profileData.available_days || []).includes(day.toLowerCase())
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {day.slice(0, 2)}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              {profileData.available_days ? profileData.available_days.join(', ') : 'Niet ingevuld'}
            </div>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tijdsblokken</label>
          {isEditing ? (
            <textarea
              value={JSON.stringify(profileData.available_time_blocks || [], null, 2)}
              onChange={(e) => {
                try {
                  onDataChange('available_time_blocks', JSON.parse(e.target.value));
                } catch {}
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder='[{"day": "monday", "blocks": ["morning", "afternoon"]}]'
            />
          ) : (
            <div className="text-sm text-gray-600">
              {profileData.available_time_blocks ? JSON.stringify(profileData.available_time_blocks, null, 2) : 'Niet ingevuld'}
            </div>
          )}
        </div>
      </motion.div>

      {/* Budget */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget min (€/maand)</label>
            <input
              type="number"
              value={profileData.budget_min_euro || ''}
              onChange={(e) => onDataChange('budget_min_euro', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget max (€/maand)</label>
            <input
              type="number"
              value={profileData.budget_max_euro || ''}
              onChange={(e) => onDataChange('budget_max_euro', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget type</label>
            <select
              value={profileData.budget_type || 'monthly'}
              onChange={(e) => onDataChange('budget_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isEditing}
            >
              <option value="monthly">Per maand</option>
              <option value="per_session">Per sessie</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Doelen & Voorkeuren */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Doelen & Voorkeuren</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rijdoelen</label>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ridingGoals.map(goal => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleArrayToggle('riding_goals', goal)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      (profileData.riding_goals || []).includes(goal)
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                {profileData.riding_goals ? profileData.riding_goals.join(', ') : 'Niet ingevuld'}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discipline voorkeuren</label>
            {isEditing ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {disciplines.map(discipline => (
                  <button
                    key={discipline}
                    type="button"
                    onClick={() => handleArrayToggle('discipline_preferences', discipline)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      (profileData.discipline_preferences || []).includes(discipline)
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {discipline}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                {profileData.discipline_preferences ? profileData.discipline_preferences.join(', ') : 'Niet ingevuld'}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Persoonlijkheidsstijl</label>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {personalityStyles.map(style => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => handleArrayToggle('personality_style', style)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      (profileData.personality_style || []).includes(style)
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                {profileData.personality_style ? profileData.personality_style.join(', ') : 'Niet ingevuld'}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Taken & Verantwoordelijkheden */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Taken & Verantwoordelijkheden</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bereid tot stalwerk</label>
          {isEditing ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {willingTasksList.map(task => (
                <button
                  key={task}
                  type="button"
                  onClick={() => handleArrayToggle('willing_tasks', task)}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    (profileData.willing_tasks || []).includes(task)
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {task}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              {profileData.willing_tasks ? profileData.willing_tasks.join(', ') : 'Niet ingevuld'}
            </div>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Taak frequentie</label>
          {isEditing ? (
            <textarea
              value={JSON.stringify(profileData.task_frequency || {}, null, 2)}
              onChange={(e) => {
                try {
                  onDataChange('task_frequency', JSON.parse(e.target.value));
                } catch {}
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder='{"mucking": "weekly", "feeding": "never"}'
            />
          ) : (
            <div className="text-sm text-gray-600">
              {profileData.task_frequency ? JSON.stringify(profileData.task_frequency, null, 2) : 'Niet ingevuld'}
            </div>
          )}
        </div>
      </motion.div>

      {/* Gezondheid & Restricties */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gezondheid & Restricties</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gezondheidsrestricties</label>
            {isEditing ? (
              <textarea
                value={JSON.stringify(profileData.health_restrictions || [], null, 2)}
                onChange={(e) => {
                  try {
                    onDataChange('health_restrictions', JSON.parse(e.target.value));
                  } catch {}
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder='["height_anxiety", "back_problems"]'
              />
            ) : (
              <div className="text-sm text-gray-600">
                {profileData.health_restrictions ? JSON.stringify(profileData.health_restrictions, null, 2) : 'Geen restricties'}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Verzekering (AVP)</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={profileData.insurance_coverage || false}
                onChange={(e) => onDataChange('insurance_coverage', e.target.checked)}
                className="mr-2"
                disabled={!isEditing}
              />
              <span className="text-sm text-gray-600">
                {profileData.insurance_coverage ? 'AVP verzekering actief' : 'Geen AVP verzekering'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No-gos</label>
            {isEditing ? (
              <textarea
                value={JSON.stringify(profileData.no_gos || [], null, 2)}
                onChange={(e) => {
                  try {
                    onDataChange('no_gos', JSON.parse(e.target.value));
                  } catch {}
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder='["busy_stables", "night_appointments"]'
              />
            ) : (
              <div className="text-sm text-gray-600">
                {profileData.no_gos ? JSON.stringify(profileData.no_gos, null, 2) : 'Geen no-gos'}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Media */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto's</label>
            <div className="text-sm text-gray-600">
              {profileData.photos ? `${profileData.photos.length} foto(s)` : 'Geen foto\'s'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video intro URL</label>
            <input
              type="url"
              value={profileData.video_intro_url || ''}
              onChange={(e) => onDataChange('video_intro_url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              readOnly={!isEditing}
              placeholder="https://..."
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RiderProfileView;
