import { motion } from 'framer-motion';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { User, Mail, Phone, MapPin, Edit, Camera } from 'lucide-react';

const Profile = () => {
  const { user } = useKindeAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-text-primary">
            Mijn Profiel
          </h1>
          <p className="text-text-secondary mt-2">
            Beheer je persoonlijke gegevens en voorkeuren.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card text-center"
          >
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mx-auto">
                <User className="w-12 h-12 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center hover:bg-accent-600 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-1">
              {user?.given_name} {user?.family_name}
            </h2>
            <p className="text-text-secondary mb-4">{user?.email}</p>
            <button className="btn-primary w-full">
              <Edit className="w-4 h-4 mr-2" />
              Bewerk Profiel
            </button>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Persoonlijke Gegevens
                </h3>
                <button className="text-primary-500 hover:text-primary-600">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Voornaam
                  </label>
                  <input
                    type="text"
                    value={user?.given_name || ''}
                    className="input-field"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Achternaam
                  </label>
                  <input
                    type="text"
                    value={user?.family_name || ''}
                    className="input-field"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="input-field"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Telefoon
                  </label>
                  <input
                    type="tel"
                    placeholder="Nog niet ingevuld"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Riding Preferences */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Rij Voorkeuren
                </h3>
                <button className="text-primary-500 hover:text-primary-600">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Ervaring
                  </label>
                  <select className="input-field">
                    <option>Beginner</option>
                    <option>Gevorderd</option>
                    <option>Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Voorkeur Discipline
                  </label>
                  <select className="input-field">
                    <option>Dressuur</option>
                    <option>Springen</option>
                    <option>Recreatie</option>
                    <option>Western</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Maximale Afstand (km)
                  </label>
                  <input
                    type="number"
                    placeholder="25"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Budget per uur (€)
                  </label>
                  <input
                    type="number"
                    placeholder="30"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="card">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Account Instellingen
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text-primary">E-mail Notificaties</h4>
                    <p className="text-sm text-text-secondary">
                      Ontvang updates over nieuwe matches en berichten
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text-primary">SMS Notificaties</h4>
                    <p className="text-sm text-text-secondary">
                      Ontvang belangrijke updates via SMS
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
