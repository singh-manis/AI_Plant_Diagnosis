import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { plantsAPI, diaryAPI, remindersAPI, weatherAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPlants: 0,
    healthyPlants: 0,
    needsAttention: 0
  });
  const [recentEntries, setRecentEntries] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [plantsRes, entriesRes, remindersRes] = await Promise.all([
        plantsAPI.getAll(),
        diaryAPI.getAll(),
        remindersAPI.getAll()
      ]);

      const plants = plantsRes.data;
      const entries = entriesRes.data;
      const reminders = remindersRes.data;

      // Calculate stats
      setStats({
        totalPlants: plants.length,
        healthyPlants: plants.filter(p => p.health === 'healthy').length,
        needsAttention: plants.filter(p => p.health === 'needs_attention').length
      });

      // Get recent diary entries (last 5)
      setRecentEntries(entries.slice(0, 5));

      // Get upcoming reminders (next 7 days)
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcoming = reminders.filter(reminder => {
        const reminderDate = new Date(reminder.scheduledDate);
        return reminderDate >= now && reminderDate <= nextWeek;
      }).slice(0, 5);
      setUpcomingReminders(upcoming);

      // Try to get weather if user allows location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const weatherRes = await weatherAPI.getCareRecommendations(
                pos.coords.latitude, 
                pos.coords.longitude
              );
              setWeather(weatherRes.data.weather);
            } catch (error) {
              console.log('Weather not available');
            }
          },
          () => console.log('Location not available')
        );
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (activity) => {
    const icons = {
      watering: '💧',
      fertilizing: '🌱',
      repotting: '🪴',
      pruning: '✂️',
      pest_control: '🐛',
      other: '📝'
    };
    return icons[activity] || '📝';
  };

  const getReminderTypeIcon = (type) => {
    const icons = {
      watering: '💧',
      fertilizing: '🌱',
      repotting: '🪴',
      pruning: '✂️',
      pest_control: '🐛',
      other: '📝'
    };
    return icons[type] || '📝';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDaysUntil = (dateString) => {
    const now = new Date();
    const reminderDate = new Date(dateString);
    const diffTime = reminderDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Overdue';
    return `In ${diffDays} days`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
          Welcome to Your Garden
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          "The glory of gardening: hands in the dirt, head in the sun, heart with nature."
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 rounded-2xl shadow-lg border border-emerald-700/30 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg">
              <span className="text-3xl">🌿</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-300">Total Plants</p>
              <p className="text-3xl font-bold text-white">{stats.totalPlants}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-2xl shadow-lg border border-blue-700/30 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-lg">
              <span className="text-3xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-300">Healthy Plants</p>
              <p className="text-3xl font-bold text-white">{stats.healthyPlants}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-900/20 to-yellow-900/20 rounded-2xl shadow-lg border border-orange-700/30 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-400 to-yellow-500 text-white shadow-lg">
              <span className="text-3xl">⚠️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-300">Need Attention</p>
              <p className="text-3xl font-bold text-white">{stats.needsAttention}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/50 rounded-2xl shadow-lg border border-gray-700 p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-3">⚡</span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Link
            to="/plants/add"
            className="flex flex-col items-center p-6 rounded-xl border-2 border-emerald-700/50 hover:border-emerald-500 hover:bg-emerald-900/20 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95 group"
          >
            <span className="text-4xl mb-3 group-hover:animate-bounce transition-transform duration-200">➕</span>
            <span className="text-sm font-semibold text-gray-300">Add Plant</span>
          </Link>
          
          <Link
            to="/diary/add"
            className="flex flex-col items-center p-6 rounded-xl border-2 border-blue-700/50 hover:border-blue-500 hover:bg-blue-900/20 transition-all duration-300 transform hover:scale-105 group"
          >
            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">📝</span>
            <span className="text-sm font-semibold text-gray-300">Log Activity</span>
          </Link>
          
          <Link
            to="/reminders"
            className="flex flex-col items-center p-6 rounded-xl border-2 border-purple-700/50 hover:border-purple-500 hover:bg-purple-900/20 transition-all duration-300 transform hover:scale-105 group"
          >
            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">⏰</span>
            <span className="text-sm font-semibold text-gray-300">Set Reminder</span>
          </Link>
          
          <Link
            to="/ai"
            className="flex flex-col items-center p-6 rounded-xl border-2 border-pink-700/50 hover:border-pink-500 hover:bg-pink-900/20 transition-all duration-300 transform hover:scale-105 group"
          >
            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🤖</span>
            <span className="text-sm font-semibold text-gray-300">AI Assistant</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Diary Entries */}
        <div className="bg-zinc-900/80 rounded-2xl shadow-lg border border-zinc-800 backdrop-blur p-8 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-zinc-100">Recent Activities</h2>
            <Link to="/diary" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
              View All →
            </Link>
          </div>
          
          {recentEntries.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-2 block">📝</span>
              <p className="text-zinc-500">No recent activities</p>
              <Link to="/diary/add" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium mt-2 inline-block">
                Add your first entry
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEntries.map(entry => (
                <div key={entry._id} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/80">
                  <span className="text-xl">{getActivityIcon(entry.activity)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-100 truncate">{entry.title}</p>
                    <p className="text-sm text-zinc-400">
                      {entry.plant?.name || 'Unknown Plant'} • {formatDate(entry.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Reminders */}
        <div className="bg-zinc-900/80 rounded-2xl shadow-lg border border-zinc-800 backdrop-blur p-8 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-zinc-100">Upcoming Reminders</h2>
            <Link to="/reminders" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
              View All →
            </Link>
          </div>
          
          {upcomingReminders.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-2 block">⏰</span>
              <p className="text-zinc-500">No upcoming reminders</p>
              <Link to="/reminders" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium mt-2 inline-block">
                Set a reminder
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingReminders.map(reminder => (
                <div key={reminder._id} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/80">
                  <span className="text-xl">{getReminderTypeIcon(reminder.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-100 truncate">{reminder.title}</p>
                    <p className="text-sm text-zinc-400">
                      {reminder.plant?.name || 'Unknown Plant'} • {getDaysUntil(reminder.scheduledDate)} at {formatTime(reminder.scheduledDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Weather Card */}
      {weather && (
        <div className="bg-gray-800/80 border border-emerald-900/30 rounded-2xl shadow-lg p-6 mt-8 text-white backdrop-blur">
          <h2 className="text-lg font-semibold text-white mb-4">Today's Weather</h2>
          <div className="flex items-center gap-4">
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="w-16 h-16"
            />
            <div>
              <p className="text-2xl font-bold text-white">{weather.temperature}°C</p>
              <p className="text-gray-300 capitalize">{weather.description}</p>
              <p className="text-sm text-gray-400">Humidity: {weather.humidity}%</p>
            </div>
            <div className="ml-auto">
              <Link to="/weather" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                View Details →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Plant Care Tips */}
      <div className="bg-gray-800/80 border border-emerald-900/30 rounded-2xl shadow-lg p-6 mt-8 text-white backdrop-blur">
        <h2 className="text-lg font-semibold text-white mb-4">💡 Plant Care Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900/80 border border-emerald-900/20 rounded-xl p-4 shadow-sm">
            <h3 className="font-medium text-white mb-2">Watering Tip</h3>
            <p className="text-sm text-gray-300">
              Check soil moisture with your finger before watering. Most plants prefer to dry out slightly between waterings.
            </p>
          </div>
          <div className="bg-gray-900/80 border border-emerald-900/20 rounded-xl p-4 shadow-sm">
            <h3 className="font-medium text-white mb-2">Light Tip</h3>
            <p className="text-sm text-gray-300">
              Rotate your plants regularly to ensure even growth. Most indoor plants prefer bright, indirect light.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 