import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Clock, Star } from 'lucide-react';

const Horses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data - will be replaced with API calls
  const horses = [
    {
      id: 1,
      name: 'Luna',
      breed: 'KWPN',
      age: 8,
      discipline: 'Dressuur',
      location: 'Amsterdam',
      price: 25,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=300&fit=crop',
      owner: 'Sarah van der Berg',
      available: true,
    },
    {
      id: 2,
      name: 'Storm',
      breed: 'Friesian',
      age: 6,
      discipline: 'Springen',
      location: 'Utrecht',
      price: 30,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      owner: 'Mark Jansen',
      available: true,
    },
    {
      id: 3,
      name: 'Bella',
      breed: 'Shetlander',
      age: 12,
      discipline: 'Recreatie',
      location: 'Den Haag',
      price: 15,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop',
      owner: 'Emma de Vries',
      available: false,
    },
  ];

  const filters = [
    { value: 'all', label: 'Alle Paarden' },
    { value: 'dressuur', label: 'Dressuur' },
    { value: 'springen', label: 'Springen' },
    { value: 'recreatie', label: 'Recreatie' },
  ];

  const filteredHorses = horses.filter(horse => {
    const matchesSearch = horse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         horse.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         horse.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         horse.discipline.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-text-primary mb-4">
            Vind je Perfecte Paard 🐎
          </h1>
          <p className="text-text-secondary">
            Ontdek beschikbare paarden in jouw buurt en vind je ideale rijpartner.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input
                type="text"
                placeholder="Zoek op naam, ras of locatie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedFilter === filter.value
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-text-secondary border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Horses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHorses.map((horse, index) => (
            <motion.div
              key={horse.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={horse.image}
                  alt={horse.name}
                  className="w-full h-48 object-cover"
                />
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                  horse.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {horse.available ? 'Beschikbaar' : 'Bezet'}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-text-primary">{horse.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-text-secondary">{horse.rating}</span>
                  </div>
                </div>
                
                <p className="text-text-secondary mb-2">
                  {horse.breed} • {horse.age} jaar
                </p>
                
                <div className="flex items-center text-text-secondary text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {horse.location}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-text-secondary">
                    Discipline: {horse.discipline}
                  </span>
                  <span className="text-lg font-semibold text-primary-500">
                    €{horse.price}/uur
                  </span>
                </div>
                
                <p className="text-sm text-text-secondary mb-4">
                  Eigenaar: {horse.owner}
                </p>
                
                <button 
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    horse.available
                      ? 'btn-primary'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!horse.available}
                >
                  {horse.available ? 'Bekijk Details' : 'Niet Beschikbaar'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredHorses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Geen paarden gevonden
            </h3>
            <p className="text-text-secondary">
              Probeer je zoekopdracht aan te passen of kies een ander filter.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Horses;
