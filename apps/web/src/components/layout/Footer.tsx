import { Link } from 'react-router-dom';
import { HeartIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🐎</span>
              </div>
              <span className="font-display font-semibold text-xl text-text-primary">
                HorseSharing
              </span>
            </div>
            <p className="text-text-secondary mb-4 max-w-md">
              Het platform dat bijrijders verbindt met paard/pony-eigenaren en stallen. 
              Vind je perfecte match en deel de liefde voor paarden.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:info@horsesharing.nl" className="text-text-secondary hover:text-primary-500">
                <EnvelopeIcon className="w-5 h-5" />
              </a>
              <a href="tel:+31612345678" className="text-text-secondary hover:text-primary-500">
                <PhoneIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-text-secondary hover:text-primary-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/horses" className="text-text-secondary hover:text-primary-500">
                  Paarden
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-text-secondary hover:text-primary-500">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="/help" className="text-text-secondary hover:text-primary-500">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" className="text-text-secondary hover:text-primary-500">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-text-secondary hover:text-primary-500">
                  Privacy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-text-secondary hover:text-primary-500">
                  Voorwaarden
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-secondary text-sm">
            2024 HorseSharing. Alle rechten voorbehouden.
          </p>
          <div className="flex items-center space-x-1 text-text-secondary text-sm mt-4 md:mt-0">
            <span>Gemaakt met</span>
            <HeartIcon className="w-4 h-4 text-red-500" />
            <span>voor paardenliefhebbers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
