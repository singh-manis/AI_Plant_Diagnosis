import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { plantsAPI } from '../../services/api';
import { handleApiError } from '../../utils/errorHandler';
import Toast from '../common/Toast';

const PlantList = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    health: '',
    size: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlants();
  }, []);

  useEffect(() => {
    filterAndSortPlants();
  }, [plants, searchTerm, filters, sortBy, sortOrder]);

  const fetchPlants = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await plantsAPI.getAll();
      setPlants(response.data);
    } catch (error) {
      const errorMessage = handleApiError(error, 'plants');
      setError(errorMessage);
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPlants = () => {
    let filtered = [...plants];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(plant =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.location) {
      filtered = filtered.filter(plant => plant.location === filters.location);
    }
    if (filters.health) {
      filtered = filtered.filter(plant => plant.health === filters.health);
    }
    if (filters.size) {
      filtered = filtered.filter(plant => plant.size === filters.size);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredPlants(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plant?')) return;
    setDeletingId(id);
    try {
      await plantsAPI.delete(id);
      setPlants((prev) => prev.filter((p) => p._id !== id));
      setToast({ message: 'Plant deleted successfully!', type: 'success' });
    } catch (error) {
      const errorMessage = handleApiError(error, 'plant deletion');
      setToast({ message: errorMessage, type: 'error' });
    }
    setDeletingId(null);
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: '', type: toast.type }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      location: '',
      health: '',
      size: ''
    });
    setSortBy('name');
    setSortOrder('asc');
  };

  const getHealthColor = (health) => {
    const colors = {
      healthy: 'bg-green-100 text-green-800',
      needs_attention: 'bg-yellow-100 text-yellow-800',
      sick: 'bg-red-100 text-red-800'
    };
    return colors[health] || 'bg-gray-100 text-gray-800';
  };

  const getSizeIcon = (size) => {
    const icons = {
      small: '🌱',
      medium: '🌿',
      large: '🌳'
    };
    return icons[size] || '🌱';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-8 w-40 bg-gray-700 rounded mb-2 animate-pulse" />
            <div className="h-4 w-64 bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-700 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-800/80 border border-gray-700 rounded-2xl shadow-lg p-8 animate-pulse">
              <div className="h-8 w-24 bg-gray-700 rounded mb-4 mx-auto" />
              <div className="h-6 w-32 bg-gray-700 rounded mb-2 mx-auto" />
              <div className="h-4 w-40 bg-gray-800 rounded mb-6 mx-auto" />
              <div className="h-10 w-24 bg-gray-700 rounded-full mx-auto mb-2" />
              <div className="h-4 w-20 bg-gray-800 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error && plants.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Unable to load plants
          </h3>
          <p className="text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={fetchPlants}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  // Get unique values for filters
  const locations = [...new Set(plants.map(plant => plant.location).filter(Boolean))];
  const healthStatuses = [...new Set(plants.map(plant => plant.health).filter(Boolean))];
  const sizes = [...new Set(plants.map(plant => plant.size).filter(Boolean))];

  return (
    <>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: toast.type })} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Plants</h1>
            <p className="text-gray-600 mt-2">Manage and track your plant collection</p>
          </div>
          <Link
            to="/plants/add"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <span>+</span>
            Add Plant
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800/80 border border-emerald-900/30 rounded-2xl shadow-lg p-6 mb-8 text-white backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search plants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Health Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Health</label>
              <select
                value={filters.health}
                onChange={(e) => setFilters({...filters, health: e.target.value})}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Health</option>
                {healthStatuses.map(health => (
                  <option key={health} value={health}>{health.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {/* Size Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Size</label>
              <select
                value={filters.size}
                onChange={(e) => setFilters({...filters, size: e.target.value})}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Sizes</option>
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-200">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2 py-1 border border-gray-700 rounded text-sm bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="name">Name</option>
                  <option value="species">Species</option>
                  <option value="location">Location</option>
                  <option value="health">Health</option>
                  <option value="createdAt">Date Added</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1 hover:bg-gray-700 rounded text-white"
                  title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>

              {/* Results Count */}
              <span className="text-sm text-gray-400">
                {filteredPlants.length} of {plants.length} plants
              </span>
            </div>

            {/* Clear Filters */}
            {(searchTerm || filters.location || filters.health || filters.size) && (
              <button
                onClick={clearFilters}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {filteredPlants.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {plants.length === 0 ? 'No plants yet' : 'No plants match your search'}
            </h3>
            <p className="text-gray-400 mb-6">
              {plants.length === 0 
                ? 'Start building your plant collection' 
                : 'Try adjusting your search or filters'
              }
            </p>
            {plants.length === 0 && (
              <Link
                to="/plants/add"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Add Your First Plant
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPlants.map(plant => (
              <div key={plant._id} className="bg-gray-800/80 border border-emerald-900/30 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-200 text-white backdrop-blur">
                {plant.photoUrl && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${plant.photoUrl}`}
                      alt={plant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white mb-1">{plant.name}</h3>
                      <p className="text-sm text-gray-300">{plant.species}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/plants/${plant._id}/edit`}
                        className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                        title="Edit plant"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(plant._id)}
                        disabled={deletingId === plant._id}
                        className="text-gray-400 hover:text-red-400 transition-colors duration-200 disabled:opacity-50"
                        title="Delete plant"
                      >
                        {deletingId === plant._id ? '⏳' : '🗑️'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Location:</span>
                      <span>{plant.location || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Health:</span>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(plant.health)}`}>
                        {plant.health ? plant.health.replace('_', ' ') : 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Size:</span>
                      <span className="flex items-center gap-1">
                        {getSizeIcon(plant.size)} {plant.size || 'Not specified'}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/plants/${plant._id}`}
                    className="text-emerald-400 hover:text-emerald-300 text-sm font-medium mt-4 inline-block"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PlantList; 