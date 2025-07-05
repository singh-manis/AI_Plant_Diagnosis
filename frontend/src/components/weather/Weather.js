import React, { useState } from 'react';
import { weatherAPI } from '../../services/api';

const Weather = () => {
  const [location, setLocation] = useState({ lat: '', lon: '', city: '' });
  const [weather, setWeather] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [plantType, setPlantType] = useState('');

  // Get browser location
  const getLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude, city: '' });
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          setError('Location access denied. Please enter your city manually.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  // Fetch weather and care recommendations
  const fetchWeather = async (lat, lon, plantTypeOverride) => {
    setLoading(true);
    setError(null);
    try {
      const response = await weatherAPI.getCareRecommendations(lat, lon, plantTypeOverride || plantType);
      setWeather(response.data.weather);
      setRecommendations(response.data.recommendations);
    } catch (err) {
      setError('Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather by city
  const fetchWeatherByCity = async (e) => {
    e.preventDefault();
    if (!location.city) return;
    setLoading(true);
    setError(null);
    try {
      const response = await weatherAPI.getByCity(location.city);
      const weatherData = response.data;
      setLocation({ lat: weatherData.lat, lon: weatherData.lon, city: weatherData.city });
      setWeather(weatherData);
      // Get care recommendations
      const recResponse = await weatherAPI.getCareRecommendations(weatherData.lat, weatherData.lon, plantType);
      setRecommendations(recResponse.data.recommendations);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Failed to fetch weather for city. Please check the city name.');
    } finally {
      setLoading(false);
    }
  };

  // Handle plant type change
  const handlePlantTypeChange = (e) => {
    setPlantType(e.target.value);
    if (location.lat && location.lon) {
      fetchWeather(location.lat, location.lon, e.target.value);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">Weather & Plant Care</h1>
        <p className="text-zinc-400">Get local weather and personalized plant care recommendations</p>
      </div>

      <div className="max-w-xl mx-auto bg-zinc-900/80 rounded-2xl shadow-lg border border-zinc-800 backdrop-blur p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <button
            onClick={getLocation}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95 shadow"
          >
            Use My Location
          </button>
          <form onSubmit={fetchWeatherByCity} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Enter city name"
              value={location.city}
              onChange={e => setLocation({ ...location, city: e.target.value })}
              className="px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 w-full placeholder-zinc-400"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 shadow"
            >
              Search
            </button>
          </form>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-zinc-300 mb-1">Plant Type (optional)</label>
          <input
            type="text"
            placeholder="e.g., Monstera, Cactus, Fern"
            value={plantType}
            onChange={handlePlantTypeChange}
            className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-zinc-400"
          />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-800 rounded-lg p-4 text-red-300 text-center mb-6 backdrop-blur">
          {error}
        </div>
      )}

      {weather && (
        <div className="max-w-xl mx-auto bg-zinc-900/80 rounded-2xl shadow-lg border border-zinc-800 backdrop-blur p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="w-16 h-16"
            />
            <div>
              <h2 className="text-2xl font-bold text-zinc-100">
                {location.city ? location.city : 'Your Location'}
              </h2>
              <p className="text-zinc-400 capitalize">{weather.description}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-400">{weather.temperature}°C</div>
              <div className="text-xs text-zinc-400">Temperature</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">{weather.humidity}%</div>
              <div className="text-xs text-zinc-400">Humidity</div>
            </div>
            <div>
              <div className="text-lg font-bold text-zinc-300">{weather.windSpeed} m/s</div>
              <div className="text-xs text-zinc-400">Wind Speed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-zinc-300">{weather.pressure} hPa</div>
              <div className="text-xs text-zinc-400">Pressure</div>
            </div>
          </div>
        </div>
      )}

      {recommendations && (
        <div className="max-w-xl mx-auto bg-emerald-900/50 border border-emerald-800 rounded-2xl p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-emerald-300 mb-4">Care Recommendations</h3>
          <ul className="space-y-2">
            <li><span className="font-medium text-emerald-200">Watering:</span> <span className="text-emerald-100">{recommendations.watering}</span></li>
            <li><span className="font-medium text-emerald-200">Sunlight:</span> <span className="text-emerald-100">{recommendations.sunlight}</span></li>
            <li><span className="font-medium text-emerald-200">Protection:</span> <span className="text-emerald-100">{recommendations.protection}</span></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Weather; 