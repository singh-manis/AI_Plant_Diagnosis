import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : 'http://localhost:5000/api';

/**
 * Axios instance configured with base URL and authentication interceptor
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Authentication API endpoints
 */
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/password', passwordData),
  deleteAccount: () => api.delete('/auth/account'),
  updateNotificationSettings: (settings) => api.put('/auth/notification-settings', settings),
};

/**
 * Plants API endpoints for managing plant data
 */
export const plantsAPI = {
  getAll: () => api.get('/plants'),
  getById: (id) => api.get(`/plants/${id}`),
  /**
   * Create a new plant with optional photo upload
   * @param {Object} plantData - Plant information and optional photo file
   * @returns {Promise} API response
   */
  create: (plantData) => {
    const formData = new FormData();
    Object.keys(plantData).forEach(key => {
      if (plantData[key] !== null && plantData[key] !== undefined) {
        formData.append(key, plantData[key]);
      }
    });
    return api.post('/plants', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  /**
   * Update an existing plant with optional photo upload
   * @param {string} id - Plant ID
   * @param {Object} plantData - Updated plant information and optional photo file
   * @returns {Promise} API response
   */
  update: (id, plantData) => {
    const formData = new FormData();
    Object.keys(plantData).forEach(key => {
      if (plantData[key] !== null && plantData[key] !== undefined) {
        formData.append(key, plantData[key]);
      }
    });
    return api.put(`/plants/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  delete: (id) => api.delete(`/plants/${id}`),
};

/**
 * Diary API endpoints for managing plant care diary entries
 */
export const diaryAPI = {
  getAll: () => api.get('/diary'),
  getByPlant: (plantId) => api.get(`/diary/plant/${plantId}`),
  getById: (id) => api.get(`/diary/${id}`),
  /**
   * Create a new diary entry with optional photo upload
   * @param {Object} entryData - Diary entry information and optional photo file
   * @returns {Promise} API response
   */
  create: (entryData) => {
    const formData = new FormData();
    Object.keys(entryData).forEach(key => {
      if (entryData[key] !== null && entryData[key] !== undefined) {
        formData.append(key, entryData[key]);
      }
    });
    return api.post('/diary', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  /**
   * Update an existing diary entry with optional photo upload
   * @param {string} id - Diary entry ID
   * @param {Object} entryData - Updated diary entry information and optional photo file
   * @returns {Promise} API response
   */
  update: (id, entryData) => {
    const formData = new FormData();
    Object.keys(entryData).forEach(key => {
      if (entryData[key] !== null && entryData[key] !== undefined) {
        formData.append(key, entryData[key]);
      }
    });
    return api.put(`/diary/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  delete: (id) => api.delete(`/diary/${id}`),
};

/**
 * AI API endpoints for plant identification and care advice
 */
export const aiAPI = {
  /**
   * Identify a plant from an uploaded image
   * @param {File} image - Plant image file
   * @returns {Promise} API response with plant identification
   */
  identifyPlant: (image) => {
    const formData = new FormData();
    formData.append('image', image);
    return api.post('/ai/identify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  /**
   * Diagnose plant health issues from an uploaded image
   * @param {File} image - Plant image file
   * @returns {Promise} API response with plant diagnosis
   */
  diagnosePlant: (image) => {
    const formData = new FormData();
    formData.append('image', image);
    return api.post('/ai/diagnose', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getCareAdvice: (plantSpecies, question) => api.post('/ai/care-advice', { plantSpecies, question }),
  generateCareSchedule: (plantSpecies, location, conditions) => 
    api.post('/ai/care-schedule', { plantSpecies, location, conditions }),
  predictGrowth: (plantData) => api.post('/ai/growth-prediction', plantData),
  getClimateBasedCare: (plantData, weatherData) => api.post('/ai/climate-care', { plantData, weatherData }),
};

/**
 * Reminders API endpoints for managing plant care reminders
 */
export const remindersAPI = {
  getAll: () => api.get('/reminders'),
  getByPlant: (plantId) => api.get(`/reminders/plant/${plantId}`),
  create: (reminderData) => api.post('/reminders', reminderData),
  update: (id, reminderData) => api.put(`/reminders/${id}`, reminderData),
  delete: (id) => api.delete(`/reminders/${id}`),
  markCompleted: (id) => api.put(`/reminders/${id}/complete`),
};

/**
 * Weather API endpoints for weather data and care recommendations
 */
export const weatherAPI = {
  getCurrent: (lat, lon) => api.get(`/weather/current?lat=${lat}&lon=${lon}`),
  getForecast: (lat, lon) => api.get(`/weather/forecast?lat=${lat}&lon=${lon}`),
  getByCity: (city) => api.get(`/weather/city/${city}`),
  getCareRecommendations: (lat, lon, plantType) => 
    api.get(`/weather/care-recommendations?lat=${lat}&lon=${lon}&plantType=${plantType}`),
};

/**
 * Notifications API endpoints for managing user notifications
 */
export const notificationsAPI = {
  getAll: (page = 1, limit = 20, unreadOnly = false) => 
    api.get(`/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`),
  getById: (id) => api.get(`/notifications/${id}`),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`),
  deleteRead: () => api.delete('/notifications/delete-read'),
  getStats: () => api.get('/notifications/stats'),
};

export default api; 