import React, { useState, useEffect } from 'react';
import { aiAPI, plantsAPI, weatherAPI } from '../../services/api';

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState('identify');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [careAdvice, setCareAdvice] = useState({
    plantSpecies: '',
    question: ''
  });
  const [plants, setPlants] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [growthPrediction, setGrowthPrediction] = useState(null);
  const [careSchedule, setCareSchedule] = useState(null);
  const [climateCare, setClimateCare] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // Fetch user's plants for the dropdown
    plantsAPI.getAll().then(res => setPlants(res.data)).catch(() => setPlants([]));
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleIdentifyPlant = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await aiAPI.identifyPlant(selectedImage);
      setResult({
        type: 'identification',
        data: response.data
      });
    } catch (error) {
      setError('Failed to identify plant. Please try again.');
      console.error('Error identifying plant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDiagnosePlant = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await aiAPI.diagnosePlant(selectedImage);
      setResult({
        type: 'diagnosis',
        data: response.data
      });
    } catch (error) {
      setError('Failed to diagnose plant. Please try again.');
      console.error('Error diagnosing plant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCareAdvice = async (e) => {
    e.preventDefault();
    if (!careAdvice.plantSpecies.trim()) {
      setError('Please enter a plant species');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await aiAPI.getCareAdvice(careAdvice.plantSpecies, careAdvice.question);
      setResult({
        type: 'care-advice',
        data: response.data
      });
    } catch (error) {
      setError('Failed to get care advice. Please try again.');
      console.error('Error getting care advice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGrowthPrediction = async (e) => {
    e.preventDefault();
    setError(null);
    setGrowthPrediction(null);
    setLoading(true);
    try {
      const plant = plants.find(p => p._id === selectedPlantId);
      if (!plant) {
        setError('Please select a plant.');
        setLoading(false);
        return;
      }
      // Prepare plant data for AI
      const plantData = {
        species: plant.species || plant.name,
        ageWeeks: plant.ageWeeks || 12,
        health: plant.health || 'healthy',
        lastRepot: plant.lastRepot || 'unknown',
        lastPrune: plant.lastPrune || 'unknown',
        location: plant.location || 'unknown',
        notes: plant.notes || ''
      };
      const response = await aiAPI.predictGrowth(plantData);
      setGrowthPrediction(response.data.prediction);
    } catch (err) {
      setError('Failed to get growth prediction.');
    } finally {
      setLoading(false);
    }
  };

  const handleCareSchedule = async (e) => {
    e.preventDefault();
    setError(null);
    setCareSchedule(null);
    setLoading(true);
    try {
      const plant = plants.find(p => p._id === selectedPlantId);
      if (!plant) {
        setError('Please select a plant.');
        setLoading(false);
        return;
      }
      // Prepare plant data for AI care schedule
      const plantData = {
        plantSpecies: plant.species || plant.name,
        location: plant.location || 'indoor',
        conditions: `Health: ${plant.health || 'healthy'}, Size: ${plant.size || 'medium'}, Light: ${plant.sunlight || 'moderate'}`
      };
      const response = await aiAPI.generateCareSchedule(plantData.plantSpecies, plantData.location, plantData.conditions);
      setCareSchedule(response.data.schedule);
    } catch (err) {
      setError('Failed to generate care schedule.');
    } finally {
      setLoading(false);
    }
  };

  const handleClimateCare = async (e) => {
    e.preventDefault();
    setError(null);
    setClimateCare(null);
    setLoading(true);
    try {
      const plant = plants.find(p => p._id === selectedPlantId);
      if (!plant) {
        setError('Please select a plant.');
        setLoading(false);
        return;
      }

      // Get current weather data (mock for now, can be enhanced with real weather API)
      const mockWeatherData = {
        temperature: '72°F',
        humidity: '45%',
        season: 'Spring',
        forecast: 'Partly cloudy with mild temperatures'
      };

      // Prepare plant data for AI climate care
      const plantData = {
        species: plant.species || plant.name,
        location: plant.location || 'indoor',
        conditions: `Health: ${plant.health || 'healthy'}, Size: ${plant.size || 'medium'}, Light: ${plant.sunlight || 'moderate'}`
      };

      const response = await aiAPI.getClimateBasedCare(plantData, mockWeatherData);
      setClimateCare(response.data.recommendations);
      setWeatherData(mockWeatherData);
    } catch (err) {
      setError('Failed to get climate-based care recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    switch (result.type) {
      case 'identification':
        return (
          <div className="bg-zinc-900/80 rounded-2xl p-8 shadow-lg border border-zinc-800 backdrop-blur mb-8">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Plant Identification Result</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌿</span>
                <div>
                  <p className="font-medium text-zinc-100">{result.data.species || 'Unknown Plant'}</p>
                  <p className="text-sm text-zinc-400">{result.data.commonName || 'No common name available'}</p>
                </div>
              </div>
              {result.data.confidence && (
                <div className="bg-zinc-800/80 rounded-lg p-3">
                  <p className="text-sm text-zinc-400">Confidence: <span className="font-medium text-emerald-400">{result.data.confidence}%</span></p>
                </div>
              )}
              {result.data.description && (
                <div>
                  <p className="text-sm text-zinc-300">{result.data.description}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'diagnosis':
        return (
          <div className="bg-zinc-900/80 rounded-2xl p-8 shadow-lg border border-zinc-800 backdrop-blur mb-8">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Advanced Plant Diagnosis</h3>
            <div className="space-y-4">
              {/* Primary Diagnosis */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔍</span>
                <div className="flex-1">
                  <p className="font-medium text-zinc-100">{result.data.condition || 'No specific condition detected'}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(result.data.severity)}`}>
                      {result.data.severity || 'Unknown'} Severity
                    </span>
                    {result.data.confidence && (
                      <span className="text-sm text-zinc-400">
                        Confidence: <span className="font-medium text-emerald-400">{result.data.confidence}%</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              {result.data.symptoms && (
                <div className="bg-yellow-900/50 border border-yellow-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-yellow-300 mb-2">🔍 Visual Symptoms:</p>
                  <p className="text-sm text-yellow-200 whitespace-pre-line">{result.data.symptoms}</p>
                </div>
              )}

              {/* Root Cause */}
              {result.data.rootCause && (
                <div className="bg-orange-900/50 border border-orange-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-orange-300 mb-2">🎯 Root Cause:</p>
                  <p className="text-sm text-orange-200">{result.data.rootCause}</p>
                </div>
              )}

              {/* Treatment Plan */}
              {result.data.treatment && (
                <div className="bg-emerald-900/50 border border-emerald-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-emerald-300 mb-2">💊 Treatment Plan:</p>
                  <div className="text-sm text-emerald-200 whitespace-pre-line">{result.data.treatment}</div>
                </div>
              )}

              {/* Timeline */}
              {result.data.timeline && (
                <div className="bg-blue-900/50 border border-blue-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-300 mb-2">⏰ Expected Timeline:</p>
                  <p className="text-sm text-blue-200">{result.data.timeline}</p>
                </div>
              )}

              {/* Prevention */}
              {result.data.prevention && (
                <div className="bg-purple-900/50 border border-purple-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-purple-300 mb-2">🛡️ Prevention:</p>
                  <p className="text-sm text-purple-200">{result.data.prevention}</p>
                </div>
              )}

              {/* Additional Notes */}
              {result.data.additionalNotes && (
                <div className="bg-zinc-800/80 rounded-lg p-4">
                  <p className="text-sm font-medium text-zinc-300 mb-2">📝 Additional Notes:</p>
                  <p className="text-sm text-zinc-200">{result.data.additionalNotes}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'care-advice':
        return (
          <div className="bg-zinc-900/80 rounded-2xl p-8 shadow-lg border border-zinc-800 backdrop-blur mb-8">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Care Advice</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-medium text-zinc-100">For: {careAdvice.plantSpecies}</p>
                  {careAdvice.question && (
                    <p className="text-sm text-zinc-400">Question: {careAdvice.question}</p>
                  )}
                </div>
              </div>
              <div className="bg-blue-900/50 border border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-200">{result.data.advice || 'No specific advice available'}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800',
      'Moderate': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-orange-100 text-orange-800',
      'Critical': 'bg-red-100 text-red-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">AI Plant Assistant</h1>
        <p className="text-zinc-400">Get instant plant identification, diagnosis, care advice, growth prediction, personalized care schedules, and climate-optimized recommendations</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-zinc-800/80 rounded-lg p-1 flex backdrop-blur">
          <button
            onClick={() => setActiveTab('identify')}
            className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
              activeTab === 'identify' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            🌿 Identify Plant
          </button>
          <button
            onClick={() => setActiveTab('diagnose')}
            className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
              activeTab === 'diagnose' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            🔍 Diagnose Issues
          </button>
          <button
            onClick={() => setActiveTab('advice')}
            className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
              activeTab === 'advice' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            💡 Care Advice
          </button>
          <button
            onClick={() => setActiveTab('growth')}
            className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${activeTab === 'growth' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-100'}`}
          >
            🌱 Growth Prediction
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${activeTab === 'schedule' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-100'}`}
          >
            📅 Care Schedule
          </button>
          <button
            onClick={() => setActiveTab('climate')}
            className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${activeTab === 'climate' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-100'}`}
          >
            🌤️ Climate Care
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Plant Identification */}
        {activeTab === 'identify' && (
          <div className="bg-zinc-900/80 rounded-2xl shadow-sm border border-zinc-800 backdrop-blur p-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Identify Your Plant</h2>
            <p className="text-zinc-400 mb-6">Upload a clear photo of your plant to get instant identification</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Upload Plant Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {imagePreview && (
                <div className="text-center">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-full h-64 object-cover rounded-lg border border-zinc-700"
                  />
                </div>
              )}

              <button
                onClick={handleIdentifyPlant}
                disabled={!selectedImage || loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-600 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95 flex items-center justify-center gap-2 shadow"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Identifying...
                  </>
                ) : (
                  <>
                    <span className="group-hover:animate-bounce">🔍</span> Identify Plant
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Plant Diagnosis */}
        {activeTab === 'diagnose' && (
          <div className="bg-zinc-900/80 rounded-2xl shadow-sm border border-zinc-800 backdrop-blur p-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Diagnose Plant Issues</h2>
            <p className="text-zinc-400 mb-6">Upload a photo of your sick plant to get diagnosis and treatment advice</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Upload Photo of Affected Plant
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {imagePreview && (
                <div className="text-center">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-full h-64 object-cover rounded-lg border border-zinc-700"
                  />
                </div>
              )}

              <button
                onClick={handleDiagnosePlant}
                disabled={!selectedImage || loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-600 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95 flex items-center justify-center gap-2 shadow"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Diagnosing...
                  </>
                ) : (
                  <>
                    <span className="group-hover:animate-bounce">🔍</span> Diagnose Issues
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Care Advice */}
        {activeTab === 'advice' && (
          <div className="bg-zinc-900/80 rounded-2xl shadow-sm border border-zinc-800 backdrop-blur p-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Get Care Advice</h2>
            <p className="text-zinc-400 mb-6">Ask specific questions about plant care</p>
            
            <form onSubmit={handleGetCareAdvice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Plant Species
                </label>
                <input
                  type="text"
                  value={careAdvice.plantSpecies}
                  onChange={(e) => setCareAdvice({...careAdvice, plantSpecies: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-zinc-400"
                  placeholder="e.g., Monstera deliciosa, Snake Plant, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Your Question (Optional)
                </label>
                <textarea
                  value={careAdvice.question}
                  onChange={(e) => setCareAdvice({...careAdvice, question: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-zinc-400"
                  rows="3"
                  placeholder="e.g., How often should I water it? What's the best soil mix?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-600 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95 flex items-center justify-center gap-2 shadow"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Getting Advice...
                  </>
                ) : (
                  <>
                    <span className="group-hover:animate-bounce">💡</span> Get Care Advice
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Growth Prediction */}
        {activeTab === 'growth' && (
          <div className="bg-zinc-900/80 rounded-2xl shadow-sm border border-zinc-800 backdrop-blur p-6 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Predict Plant Growth</h2>
            <form onSubmit={handleGrowthPrediction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Select Plant</label>
                <select
                  value={selectedPlantId}
                  onChange={e => setSelectedPlantId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                >
                  <option value="">-- Choose a plant --</option>
                  {plants.map(plant => (
                    <option key={plant._id} value={plant._id}>{plant.name} ({plant.species})</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={loading || !selectedPlantId}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-600 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95 flex items-center justify-center gap-2 shadow"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Predicting...
                  </>
                ) : (
                  <>
                    <span className="group-hover:animate-bounce">🌱</span> Predict Growth
                  </>
                )}
              </button>
            </form>
            {growthPrediction && (
              <div className="mt-6 bg-emerald-900/50 border border-emerald-800 rounded-lg p-4 backdrop-blur text-emerald-100">
                <h3 className="font-semibold mb-2">Growth Prediction</h3>
                <p>{growthPrediction}</p>
              </div>
            )}
            {error && (
              <div className="mt-4 bg-red-900/50 border border-red-800 rounded-lg p-4 backdrop-blur text-red-200">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Care Schedule */}
        {activeTab === 'schedule' && (
          <div className="bg-zinc-900/80 rounded-2xl shadow-sm border border-zinc-800 backdrop-blur p-6 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Generate Care Schedule</h2>
            <form onSubmit={handleCareSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Select Plant</label>
                <select
                  value={selectedPlantId}
                  onChange={e => setSelectedPlantId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                >
                  <option value="">-- Choose a plant --</option>
                  {plants.map(plant => (
                    <option key={plant._id} value={plant._id}>{plant.name} ({plant.species})</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={loading || !selectedPlantId}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-600 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95 flex items-center justify-center gap-2 shadow"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating Schedule...
                  </>
                ) : (
                  <>
                    <span className="group-hover:animate-bounce">📅</span> Generate Schedule
                  </>
                )}
              </button>
            </form>
            {careSchedule && (
              <div className="mt-6 bg-blue-900/50 border border-blue-800 rounded-lg p-4 backdrop-blur text-blue-100">
                <h3 className="font-semibold mb-2">Personalized Care Schedule</h3>
                <div className="whitespace-pre-line text-sm">{careSchedule}</div>
              </div>
            )}
            {error && (
              <div className="mt-4 bg-red-900/50 border border-red-800 rounded-lg p-4 backdrop-blur text-red-200">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Climate-Based Care */}
        {activeTab === 'climate' && (
          <div className="bg-zinc-900/80 rounded-2xl shadow-sm border border-zinc-800 backdrop-blur p-6 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">Climate-Optimized Care</h2>
            <form onSubmit={handleClimateCare} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Select Plant</label>
                <select
                  value={selectedPlantId}
                  onChange={e => setSelectedPlantId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                >
                  <option value="">-- Choose a plant --</option>
                  {plants.map(plant => (
                    <option key={plant._id} value={plant._id}>{plant.name} ({plant.species})</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={loading || !selectedPlantId}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-600 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-2xl active:scale-95 flex items-center justify-center gap-2 shadow"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analyzing Climate...
                  </>
                ) : (
                  <>
                    <span className="group-hover:animate-bounce">🌤️</span> Get Climate Care
                  </>
                )}
              </button>
            </form>
            {weatherData && (
              <div className="mt-4 bg-blue-900/50 border border-blue-800 rounded-lg p-4 backdrop-blur text-blue-100">
                <h3 className="font-semibold mb-2">Current Weather</h3>
                <div className="text-sm">
                  <p>Temperature: {weatherData.temperature}</p>
                  <p>Humidity: {weatherData.humidity}</p>
                  <p>Season: {weatherData.season}</p>
                  <p>Forecast: {weatherData.forecast}</p>
                </div>
              </div>
            )}
            {climateCare && (
              <div className="mt-6 bg-purple-900/50 border border-purple-800 rounded-lg p-4 backdrop-blur text-purple-100">
                <h3 className="font-semibold mb-2">Climate-Optimized Recommendations</h3>
                <div className="whitespace-pre-line text-sm">{climateCare}</div>
              </div>
            )}
            {error && (
              <div className="mt-4 bg-red-900/50 border border-red-800 rounded-lg p-4 backdrop-blur text-red-200">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-900/50 border border-red-800 rounded-lg p-4 backdrop-blur">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-6">
            {renderResult()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant; 