const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const auth = require('../middleware/auth');

router.get('/current', auth, weatherController.getCurrentWeather);
router.get('/forecast', auth, weatherController.getWeatherForecast);
router.get('/city/:city', auth, weatherController.getWeatherByCity);
router.get('/care-recommendations', auth, weatherController.getCareRecommendations);

module.exports = router; 