import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { diaryAPI, plantsAPI } from '../../services/api';
import Toast from '../common/Toast';

const Diary = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editFormData, setEditFormData] = useState({
    plant: '',
    activity: '',
    title: '',
    notes: '',
    photo: null
  });
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    plant: '',
    activityType: '',
    dateFrom: '',
    dateTo: ''
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Move filterAndSortEntries above useEffect and wrap in useCallback
  const filterAndSortEntries = useCallback(() => {
    let filtered = [...entries];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.plant?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.plant) {
      filtered = filtered.filter(entry => entry.plant?._id === filters.plant);
    }
    if (filters.activityType) {
      filtered = filtered.filter(entry => entry.activityType === filters.activityType);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(entry => new Date(entry.date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(entry => new Date(entry.date) <= new Date(filters.dateTo));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredEntries(filtered);
  }, [entries, searchTerm, filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchData();
    filterAndSortEntries();
  }, [plants, searchTerm, filters, sortBy, sortOrder, filterAndSortEntries]);

  const fetchData = async () => {
    try {
      const [entriesRes, plantsRes] = await Promise.all([
        diaryAPI.getAll(),
        plantsAPI.getAll()
      ]);
      
      setEntries(entriesRes.data);
      setPlants(plantsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setEditFormData({
      plant: entry.plant._id || entry.plant,
      activity: entry.activity,
      title: entry.title,
      notes: entry.notes || '',
      photo: null
    });
    setEditImagePreview(entry.photo ? `${process.env.REACT_APP_API_URL}/uploads/${entry.photo}` : null);
    setShowEditForm(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData({ ...editFormData, photo: file });
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('plant', editFormData.plant);
      formData.append('activity', editFormData.activity);
      formData.append('title', editFormData.title);
      formData.append('notes', editFormData.notes);
      if (editFormData.photo) {
        formData.append('photo', editFormData.photo);
      }
      const response = await diaryAPI.update(editingEntry._id, formData);
      setEntries(entries.map(entry => 
        entry._id === editingEntry._id ? response.data : entry
      ));
      setShowEditForm(false);
      setEditingEntry(null);
      setEditFormData({
        plant: '',
        activity: '',
        title: '',
        notes: '',
        photo: null
      });
      setEditImagePreview(null);
      setToast({ message: 'Diary entry updated successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Error updating entry', type: 'error' });
      console.error('Error updating entry:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await diaryAPI.delete(id);
        setEntries(entries.filter(entry => entry._id !== id));
        setToast({ message: 'Diary entry deleted successfully!', type: 'success' });
      } catch (error) {
        setToast({ message: 'Failed to delete entry', type: 'error' });
        console.error('Error deleting entry:', error);
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      plant: '',
      activityType: '',
      dateFrom: '',
      dateTo: ''
    });
    setSortBy('date');
    setSortOrder('desc');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActivityIcon = (activityType) => {
    const icons = {
      watering: '💧',
      fertilizing: '🌱',
      pruning: '✂️',
      repotting: '🪴',
      pest_control: '🐛',
      observation: '👁️',
      other: '📝'
    };
    return icons[activityType] || '📝';
  };

  const getActivityColor = (activityType) => {
    const colors = {
      watering: 'bg-blue-100 text-blue-800',
      fertilizing: 'bg-green-100 text-green-800',
      pruning: 'bg-orange-100 text-orange-800',
      repotting: 'bg-purple-100 text-purple-800',
      pest_control: 'bg-red-100 text-red-800',
      observation: 'bg-gray-100 text-gray-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[activityType] || 'bg-gray-100 text-gray-800';
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: '', type: toast.type }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Get unique values for filters
  const activityTypes = [...new Set(entries.map(entry => entry.activityType).filter(Boolean))];

  return (
    <>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: toast.type })} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Plant Diary</h1>
            <p className="text-gray-600 mt-2">Track your plant care activities and observations</p>
          </div>
          <Link
            to="/diary/add"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <span>+</span>
            Add Entry
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
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Plant Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Plant</label>
              <select
                value={filters.plant}
                onChange={(e) => setFilters({...filters, plant: e.target.value})}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Plants</option>
                {plants.map(plant => (
                  <option key={plant._id} value={plant._id}>{plant.name}</option>
                ))}
              </select>
            </div>

            {/* Activity Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Activity Type</label>
              <select
                value={filters.activityType}
                onChange={(e) => setFilters({...filters, activityType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Activities</option>
                {activityTypes.map(type => (
                  <option key={type} value={type}>{type ? type.replace('_', ' ') : 'Unknown'}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
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
                  <option value="date">Date</option>
                  <option value="title">Title</option>
                  <option value="activityType">Activity Type</option>
                  <option value="createdAt">Created</option>
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
                {filteredEntries.length} of {entries.length} entries
              </span>
            </div>

            {/* Clear Filters */}
            {(searchTerm || filters.plant || filters.activityType || filters.dateFrom || filters.dateTo) && (
              <button
                onClick={clearFilters}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {entries.length === 0 ? 'No diary entries yet' : 'No entries match your search'}
            </h3>
            <p className="text-gray-400 mb-6">
              {entries.length === 0 
                ? 'Start documenting your plant care journey' 
                : 'Try adjusting your search or filters'
              }
            </p>
            {entries.length === 0 && (
              <Link
                to="/diary/add"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Add Your First Entry
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEntries.map(entry => (
              <div key={entry._id} className="bg-gray-800/80 border border-emerald-900/30 rounded-2xl shadow-lg p-6 text-white backdrop-blur">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getActivityIcon(entry.activityType)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                        <span>{formatDate(entry.date)}</span>
                        {entry.plant && (
                          <span className="flex items-center gap-1">
                            <span>🌱</span>
                            {entry.plant.name}
                          </span>
                        )}
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(entry.activityType)}`}>
                          {entry.activityType ? entry.activityType.replace('_', ' ') : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/diary/${entry._id}/edit`}
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                      title="Edit entry"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="text-gray-400 hover:text-red-400 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                      title="Delete entry"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                {entry.description && (
                  <p className="text-gray-200 mb-4">{entry.description}</p>
                )}
                
                {entry.notes && (
                  <div className="bg-gray-900/80 border border-emerald-900/20 rounded-xl p-3">
                    <p className="text-sm text-gray-300 italic">{entry.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Edit Entry Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Diary Entry</h2>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingEntry(null);
                    setEditFormData({
                      plant: '',
                      activity: '',
                      title: '',
                      notes: '',
                      photo: null
                    });
                    setEditImagePreview(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plant
                  </label>
                  <select
                    value={editFormData.plant}
                    onChange={(e) => setEditFormData({...editFormData, plant: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select a plant</option>
                    {plants.map(plant => (
                      <option key={plant._id} value={plant._id}>
                        {plant.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity
                  </label>
                  <select
                    value={editFormData.activity}
                    onChange={(e) => setEditFormData({...editFormData, activity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select activity</option>
                    <option value="watering">Watering</option>
                    <option value="fertilizing">Fertilizing</option>
                    <option value="repotting">Repotting</option>
                    <option value="pruning">Pruning</option>
                    <option value="pest_control">Pest Control</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Watered the Monstera"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={editFormData.notes}
                    onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="3"
                    placeholder="Additional notes about the activity..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {editImagePreview && (
                    <div className="mt-2">
                      <img
                        src={editImagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-md border border-gray-200"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingEntry(null);
                      setEditFormData({
                        plant: '',
                        activity: '',
                        title: '',
                        notes: '',
                        photo: null
                      });
                      setEditImagePreview(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                  >
                    Update Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Diary; 