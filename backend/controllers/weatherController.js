const weatherService = require('../services/weatherService');

exports.getCurrentWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ msg: 'Latitude and longitude are required' });
    }

    const weather = await weatherService.getCurrentWeather(lat, lon);
    res.json(weather);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.getWeatherForecast = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ msg: 'Latitude and longitude are required' });
    }

    const forecast = await weatherService.getWeatherForecast(lat, lon);
    res.json(forecast);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.getWeatherByCity = async (req, res) => {
  try {
    const { city } = req.params;
    if (!city) {
      return res.status(400).json({ msg: 'City name is required' });
    }

    const weather = await weatherService.getWeatherByCity(city);
    res.json(weather);
  } catch (error) {
    console.error('Weather Controller Error:', error.message);
    res.status(500).json({ msg: error.message });
  }
};

exports.getCareRecommendations = async (req, res) => {
  try {
    const { lat, lon, plantType } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ msg: 'Latitude and longitude are required' });
    }

    const weather = await weatherService.getCurrentWeather(lat, lon);
    const recommendations = weatherService.getCareRecommendations(weather, plantType);
    
    res.json({
      weather,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}; 