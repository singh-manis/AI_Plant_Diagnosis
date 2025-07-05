const axios = require('axios');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
  }

  async getCurrentWeather(lat, lon) {
    try {
      const response = await axios.get(
        `${this.baseURL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      return {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        windSpeed: response.data.wind.speed,
        pressure: response.data.main.pressure
      };
    } catch (error) {
      throw new Error('Failed to fetch weather data');
    }
  }

  async getWeatherForecast(lat, lon) {
    try {
      const response = await axios.get(
        `${this.baseURL}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      return response.data.list.slice(0, 5).map(item => ({
        date: new Date(item.dt * 1000),
        temperature: item.main.temp,
        humidity: item.main.humidity,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      }));
    } catch (error) {
      throw new Error('Failed to fetch weather forecast');
    }
  }

  async getWeatherByCity(city) {
    try {
      const response = await axios.get(
        `${this.baseURL}/weather?q=${city}&appid=${this.apiKey}&units=metric`
      );
      return {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        windSpeed: response.data.wind.speed,
        pressure: response.data.main.pressure,
        city: response.data.name,
        country: response.data.sys.country,
        lat: response.data.coord.lat,
        lon: response.data.coord.lon
      };
    } catch (error) {
      console.error('Weather API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch weather data for city');
    }
  }

  getCareRecommendations(weather, plantType) {
    const recommendations = {
      watering: this.getWateringRecommendation(weather, plantType),
      sunlight: this.getSunlightRecommendation(weather),
      protection: this.getProtectionRecommendation(weather)
    };
    return recommendations;
  }

  getWateringRecommendation(weather, plantType) {
    const temp = weather.temperature;
    const humidity = weather.humidity;
    
    if (temp > 30) {
      return "High temperature detected. Consider extra watering for most plants.";
    } else if (temp < 10) {
      return "Low temperature detected. Reduce watering frequency.";
    } else if (humidity < 30) {
      return "Low humidity detected. Plants may need more frequent watering.";
    } else if (humidity > 80) {
      return "High humidity detected. Reduce watering to prevent root rot.";
    }
    
    return "Normal watering schedule recommended.";
  }

  getSunlightRecommendation(weather) {
    const description = weather.description.toLowerCase();
    
    if (description.includes('rain') || description.includes('cloud')) {
      return "Cloudy/rainy weather. Plants may need less direct sunlight protection.";
    } else if (description.includes('clear') || description.includes('sun')) {
      return "Clear weather. Ensure proper sunlight exposure for sun-loving plants.";
    }
    
    return "Normal sunlight conditions.";
  }

  getProtectionRecommendation(weather) {
    const temp = weather.temperature;
    const windSpeed = weather.windSpeed;
    
    if (temp < 5) {
      return "Freezing temperatures possible. Protect sensitive plants.";
    } else if (windSpeed > 20) {
      return "High winds detected. Secure potted plants and protect from wind damage.";
    }
    
    return "No special protection needed.";
  }
}

module.exports = new WeatherService(); 