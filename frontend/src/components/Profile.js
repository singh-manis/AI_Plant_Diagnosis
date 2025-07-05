import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Toast from './common/Toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });
  
  // Profile form data
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
    bio: user?.bio || ''
  });

  // Password change form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: true,
    email: true,
    push: true,
    reminders: true,
    weather: true,
    aiInsights: true
  });

  useEffect(() => {
    // Load user's notification settings if available
    if (user?.notificationSettings) {
      setNotificationSettings(user.notificationSettings);
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast({ type: '', message: '' });

    try {
      const response = await authAPI.updateProfile(profileData);
      setToast({ type: 'success', message: 'Profile updated successfully!' });
      
      // Update local user context if needed
      // You might need to update the auth context here
      
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.msg || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast({ type: '', message: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ type: 'error', message: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setToast({ type: 'error', message: 'Password must be at least 6 characters long' });
      setLoading(false);
      return;
    }

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setToast({ type: 'success', message: 'Password changed successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.msg || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSettingsUpdate = async () => {
    setLoading(true);
    setToast({ type: '', message: '' });

    try {
      await authAPI.updateNotificationSettings(notificationSettings);
      setToast({ type: 'success', message: 'Notification settings updated successfully!' });
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to update notification settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.')) {
      return;
    }

    if (!window.confirm('This is your final warning. All your plants, diary entries, reminders, and data will be permanently deleted. Are you absolutely sure?')) {
      return;
    }

    setLoading(true);
    setToast({ type: '', message: '' });

    try {
      await authAPI.deleteAccount();
      setToast({ type: 'success', message: 'Account deleted successfully!' });
      logout();
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.msg || 'Failed to delete account' });
      setLoading(false);
    }
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: '', type: toast.type }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: toast.type })} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-100 mb-2">Profile & Settings</h1>
            <p className="text-zinc-400">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-zinc-900/80 rounded-2xl shadow-lg border border-zinc-800 backdrop-blur p-8 mb-8">
                <h2 className="text-xl font-semibold text-zinc-100 mb-4">Personal Information</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-zinc-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-zinc-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                      Location (optional)
                    </label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-zinc-400"
                      placeholder="e.g., New York, NY"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                      Bio (optional)
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-zinc-400"
                      rows="3"
                      placeholder="Tell us about your plant care journey..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-medium transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95 disabled:opacity-50 shadow"
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              </div>

              {/* Change Password */}
              <div className="bg-zinc-900/80 rounded-2xl shadow-lg border border-zinc-800 backdrop-blur p-8 mb-8">
                <h2 className="text-xl font-semibold text-zinc-100 mb-4">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-zinc-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-zinc-400"
                      required
                      minLength="6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-zinc-400"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-medium transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95 disabled:opacity-50 shadow"
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>

              {/* Notification Settings */}
              <div className="bg-zinc-900/80 rounded-2xl shadow-lg border border-zinc-800 backdrop-blur p-8 mb-8">
                <h2 className="text-xl font-semibold text-zinc-100 mb-4">Notification Settings</h2>
                <div className="space-y-4">
                  {/* Master Toggle */}
                  <div className="flex items-center justify-between p-3 bg-zinc-800/80 rounded-lg">
                    <div>
                      <h3 className="font-medium text-zinc-100">Enable Notifications</h3>
                      <p className="text-sm text-zinc-400">Master switch for all notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.enabled}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          enabled: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {/* Notification Channels */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-zinc-100">Notification Channels</h4>
                    {/* Email */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-zinc-100">Email Notifications</span>
                        <p className="text-sm text-zinc-400">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.email}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            email: e.target.checked
                          })}
                          disabled={!notificationSettings.enabled}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 disabled:opacity-50"></div>
                      </label>
                    </div>
                    {/* Push */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-zinc-100">Push Notifications</span>
                        <p className="text-sm text-zinc-400">Browser push notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.push}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            push: e.target.checked
                          })}
                          disabled={!notificationSettings.enabled}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 disabled:opacity-50"></div>
                      </label>
                    </div>
                  </div>

                  {/* Notification Types */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-zinc-100">Notification Types</h4>
                    {/* Reminders */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-zinc-100">Reminder Notifications</span>
                        <p className="text-sm text-zinc-400">Plant care reminders and alerts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.reminders}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            reminders: e.target.checked
                          })}
                          disabled={!notificationSettings.enabled}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 disabled:opacity-50"></div>
                      </label>
                    </div>
                    {/* Plant Care */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-zinc-100">Plant Care Alerts</span>
                        <p className="text-sm text-zinc-400">Plant health and care recommendations</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.weather}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            weather: e.target.checked
                          })}
                          disabled={!notificationSettings.enabled}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 disabled:opacity-50"></div>
                      </label>
                    </div>
                    {/* Weather Alerts */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-zinc-100">Weather Alerts</span>
                        <p className="text-sm text-zinc-400">Weather conditions affecting plants</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.weather}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            weather: e.target.checked
                          })}
                          disabled={!notificationSettings.enabled}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 disabled:opacity-50"></div>
                      </label>
                    </div>
                    {/* AI Insights */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-zinc-100">AI Insights</span>
                        <p className="text-sm text-zinc-400">AI-powered plant care recommendations</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.aiInsights}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            aiInsights: e.target.checked
                          })}
                          disabled={!notificationSettings.enabled}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 disabled:opacity-50"></div>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleNotificationSettingsUpdate}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-medium transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95 disabled:opacity-50 shadow"
                  >
                    {loading ? 'Saving...' : 'Save Notification Settings'}
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Info */}
              <div className="bg-zinc-900/80 rounded-2xl shadow-lg border border-zinc-800 backdrop-blur p-8 mb-8">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Account Information</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-zinc-400">Member Since</span>
                    <p className="text-sm text-zinc-100">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-400">Account Status</span>
                    <p className="text-sm text-emerald-400 font-medium">Active</p>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-zinc-900/80 rounded-2xl shadow-lg border border-red-800 backdrop-blur p-8 mb-8">
                <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
                <p className="text-sm text-zinc-400 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={handleAccountDeletion}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 shadow"
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile; 