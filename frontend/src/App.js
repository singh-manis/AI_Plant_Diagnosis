import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotFound from './components/common/NotFound';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import PlantList from './components/plants/PlantList';
import PlantDetail from './components/plants/PlantDetail';
import AddPlant from './components/plants/AddPlant';
import Diary from './components/diary/Diary';
import Reminders from './components/reminders/Reminders';
import AIAssistant from './components/ai/AIAssistant';
import Weather from './components/weather/Weather';
import Profile from './components/Profile';
import Navbar from './components/layout/Navbar';
import AddDiaryEntry from './components/diary/AddDiaryEntry';
import LandingPage from './components/LandingPage';
import PlantShowcase from './components/PlantShowcase';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return !user ? children : <Navigate to="/showcase" />;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900">
        {user && <Navbar />}
        <main className={user ? "pt-16" : ""}>
          <Routes>
            <Route path="/" element={
              user ? <Navigate to="/showcase" /> : <LandingPage />
            } />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/plants" element={
              <PrivateRoute>
                <PlantList />
              </PrivateRoute>
            } />
            <Route path="/plants/add" element={
              <PrivateRoute>
                <AddPlant />
              </PrivateRoute>
            } />
            <Route path="/plants/:id" element={
              <PrivateRoute>
                <PlantDetail />
              </PrivateRoute>
            } />
            <Route path="/diary" element={
              <PrivateRoute>
                <Diary />
              </PrivateRoute>
            } />
            <Route path="/diary/add" element={
              <PrivateRoute>
                <AddDiaryEntry />
              </PrivateRoute>
            } />
            <Route path="/reminders" element={
              <PrivateRoute>
                <Reminders />
              </PrivateRoute>
            } />
            <Route path="/ai" element={
              <PrivateRoute>
                <AIAssistant />
              </PrivateRoute>
            } />
            <Route path="/weather" element={
              <PrivateRoute>
                <Weather />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/showcase" element={
              <PrivateRoute>
                <PlantShowcase />
              </PrivateRoute>
            } />
            {/* 404 Route - Must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
