import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { HeartIcon, UsersIcon, ShieldCheckIcon, StarIcon, MagnifyingGlassIcon, HomeIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const { isAuthenticated, isLoading, logout } = useKindeAuth();
  const navigate = useNavigate();
  
  console.log('Home - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
  
  const features = [
    {
      icon: HeartIcon,
      title: 'Veilig & Betrouwbaar',
      description: 'Alle gebruikers worden geverifieerd voor een veilige ervaring.',
    },
    {
      icon: UsersIcon,
      title: 'Perfecte Matches',
      description: 'Ons algoritme vindt de ideale match tussen rijders en eigenaren.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Verzekerd',
      description: 'Volledige dekking tijdens alle rijtijden via onze partners.',
    },
    {
      icon: StarIcon,
      title: 'Beoordelingen',
      description: 'Transparante reviews helpen je de juiste keuze te maken.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-accent-50 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold text-text-primary mb-6">
                Deel de liefde voor{' '}
                <span className="text-primary-500">paarden</span>
              </h1>
              <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
                HorseSharing verbindt bijrijders met paard/pony-eigenaren en stallen. 
                Vind je perfecte match en geniet samen van de mooiste sport ter wereld.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {!isLoading && isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate('/discover')}
                    className="flex-1 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                    Ontdek Paarden
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 bg-white text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200 flex items-center justify-center"
                  >
                    <HomeIcon className="w-5 h-5 mr-2" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => logout()}
                    className="flex-1 bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    Uitloggen
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="inline-block bg-blue-600 text-white font-semibold text-lg px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Vind Paarden
                  </Link>
                  <Link to="/login" className="inline-block bg-white text-blue-600 border-2 border-blue-600 font-semibold text-lg px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    Word Lid
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-20 right-10 text-6xl opacity-20"
        >
          🐎
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 left-10 text-4xl opacity-20"
        >
          🏇
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">
              Waarom HorseSharing?
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              We maken het delen van paarden veilig, eenvoudig en plezierig voor iedereen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-semibold text-lg text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Klaar om te beginnen?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Sluit je aan bij duizenden paardenliefhebbers die al gebruik maken van HorseSharing.
            </p>
            <Link
              to="/login"
              className="inline-block bg-white text-primary-500 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Gratis Aanmelden
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
