import React, { useState, useEffect } from 'react';
import { remindersAPI, plantsAPI } from '../../services/api';
import Toast from '../common/Toast';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [filteredReminders, setFilteredReminders] = useState([]);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterBy, setFilterBy] = useState('all');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    plant: 'all'
  });
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const reminderTypes = [
    'watering',
    'fertilizing', 
    'pruning',
    'repotting',
    'pest_control',
    'observation',
    'other'
  ];

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    plant: '',
    type: 'watering',
    scheduledDate: '',
    frequency: 'once',
    emailNotification: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortReminders();
  }, [reminders, searchTerm, sortBy, sortOrder, filterBy, filters]);

  const fetchData = async () => {
    try {
      const [remindersRes, plantsRes] = await Promise.all([
        remindersAPI.getAll(),
        plantsAPI.getAll()
      ]);
      
      setReminders(remindersRes.data);
      setPlants(plantsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortReminders = () => {
    let filtered = [...reminders];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(reminder =>
        reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reminder.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reminder.plant?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(reminder => {
        if (filters.status === 'completed') return reminder.completed;
        if (filters.status === 'overdue') return !reminder.completed && new Date(reminder.scheduledDate) < new Date();
        if (filters.status === 'upcoming') return !reminder.completed && new Date(reminder.scheduledDate) >= new Date();
        return true;
      });
    }

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(reminder => reminder.type === filters.type);
    }

    // Apply plant filter
    if (filters.plant !== 'all') {
      filtered = filtered.filter(reminder => reminder.plant?._id === filters.plant);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'scheduledDate') {
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

    setFilteredReminders(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReminder) {
        await remindersAPI.update(editingReminder._id, formData);
        setReminders(reminders.map(r => r._id === editingReminder._id ? { ...r, ...formData } : r));
        setToast({ message: 'Reminder updated successfully!', type: 'success' });
        setEditingReminder(null);
      } else {
        const response = await remindersAPI.create(formData);
        setReminders([...reminders, response.data]);
        setToast({ message: 'Reminder added successfully!', type: 'success' });
      }
      resetForm();
      setShowAddForm(false);
    } catch (error) {
      setToast({ message: 'Error saving reminder', type: 'error' });
      console.error('Error saving reminder:', error);
    }
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setFormData({
      title: reminder.title,
      description: reminder.description,
      plant: reminder.plant._id,
      type: reminder.type,
      scheduledDate: reminder.scheduledDate.split('T')[0],
      frequency: reminder.frequency,
      emailNotification: reminder.emailNotification
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        await remindersAPI.delete(id);
        setReminders(reminders.filter(r => r._id !== id));
        setToast({ message: 'Reminder deleted successfully!', type: 'success' });
      } catch (error) {
        setToast({ message: 'Error deleting reminder', type: 'error' });
        console.error('Error deleting reminder:', error);
      }
    }
  };

  const handleToggleComplete = async (reminder) => {
    try {
      const updatedReminder = { ...reminder, completed: !reminder.completed };
      await remindersAPI.update(reminder._id, updatedReminder);
      setReminders(reminders.map(r => r._id === reminder._id ? updatedReminder : r));
      setToast({ message: updatedReminder.completed ? 'Marked as completed!' : 'Marked as not completed!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Error updating reminder', type: 'error' });
      console.error('Error updating reminder:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      plant: '',
      type: 'watering',
      scheduledDate: '',
      frequency: 'once',
      emailNotification: true
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('dueDate');
    setSortOrder('asc');
    setFilters({
      status: 'all',
      type: 'all',
      plant: 'all'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReminderIcon = (reminderType) => {
    const icons = {
      watering: '💧',
      fertilizing: '🌱',
      pruning: '✂️',
      repotting: '🪴',
      pest_control: '🐛',
      observation: '👁️',
      other: '📝'
    };
    return icons[reminderType] || '📝';
  };

  const getReminderColor = (reminderType) => {
    const colors = {
      watering: 'bg-blue-100 text-blue-800',
      fertilizing: 'bg-green-100 text-green-800',
      pruning: 'bg-orange-100 text-orange-800',
      repotting: 'bg-purple-100 text-purple-800',
      pest_control: 'bg-red-100 text-red-800',
      observation: 'bg-gray-100 text-gray-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[reminderType] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (reminder) => {
    if (reminder.completed) return 'bg-green-100 text-green-800';
    if (new Date(reminder.scheduledDate) < new Date()) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (reminder) => {
    if (reminder.completed) return 'Completed';
    if (new Date(reminder.scheduledDate) < new Date()) return 'Overdue';
    return 'Upcoming';
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

  return (
    <>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: toast.type })} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Plant Reminders</h1>
            <p className="text-gray-600 mt-2">Never miss important plant care tasks</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingReminder(null);
              resetForm();
            }}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95 flex items-center gap-2"
          >
            <span className="group-hover:animate-bounce">+</span>
            Add Reminder
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800/80 border border-emerald-900/30 rounded-2xl shadow-lg p-6 mb-8 text-white backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search reminders..."
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

            {/* Reminder Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Reminder Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Types</option>
                {reminderTypes.map(type => (
                  <option key={type} value={type}>{type ? type.replace('_', ' ') : 'Unknown'}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="overdue">Overdue</option>
                <option value="completed">Completed</option>
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
                  <option value="scheduledDate">Due Date</option>
                  <option value="title">Title</option>
                  <option value="type">Type</option>
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
                {filteredReminders.length} of {reminders.length} reminders
              </span>
            </div>

            {/* Clear Filters */}
            {(searchTerm || filters.plant || filters.type || filters.status) && (
              <button
                onClick={clearFilters}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plant</label>
                  <select
                    value={formData.plant}
                    onChange={(e) => setFormData({...formData, plant: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select a plant</option>
                    {plants.map(plant => (
                      <option key={plant._id} value={plant._id}>{plant.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="watering">Watering</option>
                    <option value="fertilizing">Fertilizing</option>
                    <option value="pruning">Pruning</option>
                    <option value="repotting">Repotting</option>
                    <option value="pest_control">Pest Control</option>
                    <option value="observation">Observation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="once">Once</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotification"
                  checked={formData.emailNotification}
                  onChange={(e) => setFormData({...formData, emailNotification: e.target.checked})}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="emailNotification" className="ml-2 block text-sm text-gray-900">
                  Send email notification
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                >
                  {editingReminder ? 'Update Reminder' : 'Add Reminder'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingReminder(null);
                    resetForm();
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {filteredReminders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏰</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {reminders.length === 0 ? 'No reminders yet' : 'No reminders match your search'}
            </h3>
            <p className="text-gray-400 mb-6">
              {reminders.length === 0 
                ? 'Start setting up reminders for your plants' 
                : 'Try adjusting your search or filters'
              }
            </p>
            {reminders.length === 0 && (
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setEditingReminder(null);
                  resetForm();
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Add Your First Reminder
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReminders.map(reminder => (
              <div key={reminder._id} className={`bg-gray-800/80 border border-emerald-900/30 rounded-2xl shadow-lg p-6 text-white backdrop-blur ${reminder.completed ? 'opacity-75' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{getReminderIcon(reminder.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-lg font-semibold ${reminder.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                          {reminder.title}
                        </h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getReminderColor(reminder.type)}`}>
                          {reminder.type ? reminder.type.replace('_', ' ') : 'Unknown'}
                        </span>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reminder)}`}>
                          {getStatusText(reminder)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-300 mb-2">
                        <span>📅 {formatDate(reminder.scheduledDate)}</span>
                        {reminder.plant && (
                          <span className="flex items-center gap-1">
                            <span>🌱</span>
                            {reminder.plant.name}
                          </span>
                        )}
                        <span>🔄 {reminder.frequency}</span>
                      </div>
                      
                      {reminder.description && (
                        <p className="text-gray-200">{reminder.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleToggleComplete(reminder)}
                      className={`p-2 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95 ${reminder.completed ? 'bg-green-900/40 text-green-400 hover:bg-green-900/60' : 'bg-gray-900/40 text-gray-400 hover:bg-gray-900/60'}`}
                      title={reminder.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {reminder.completed ? '✓' : '○'}
                    </button>
                    <button
                      onClick={() => handleEdit(reminder)}
                      className="p-2 bg-blue-900/40 text-blue-400 hover:bg-blue-900/60 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                      title="Edit reminder"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(reminder._id)}
                      className="p-2 bg-red-900/40 text-red-400 hover:bg-red-900/60 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95"
                      title="Delete reminder"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Reminders; 