const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  }

  async identifyPlant(imageBase64) {
    try {
      if (!this.apiKey) {
        // Mock response for testing when API key is not available
        return this.getMockPlantIdentification();
      }
      
      const prompt = "Identify this plant species. Return only the plant name and a brief description.";
      const response = await this.callGeminiVision(prompt, imageBase64);
      return response;
    } catch (error) {
      console.error('AI Identification error:', error);
      return this.getMockPlantIdentification();
    }
  }

  async diagnosePlant(imageBase64) {
    try {
      if (!this.apiKey) {
        return this.getMockPlantDiagnosis();
      }
      
      const prompt = `Analyze this plant image for comprehensive health assessment. Provide detailed analysis including:

1. PRIMARY DIAGNOSIS: Main health issue or condition
2. SEVERITY LEVEL: Low/Moderate/High/Critical
3. VISUAL SYMPTOMS: Specific symptoms visible in the image
4. ROOT CAUSE: Likely cause of the problem
5. TREATMENT PLAN: Step-by-step treatment recommendations
6. TIMELINE: Expected recovery time
7. PREVENTION: How to prevent this issue in the future
8. CONFIDENCE: Your confidence level in this diagnosis (0-100%)

Format the response in a structured, easy-to-read manner with clear sections.`;
      
      const response = await this.callGeminiVision(prompt, imageBase64);
      return response;
    } catch (error) {
      console.error('AI Diagnosis error:', error);
      return this.getMockPlantDiagnosis();
    }
  }

  async getCareAdvice(plantSpecies, question) {
    try {
      if (!this.apiKey) {
        // Mock response for testing when API key is not available
        return this.getMockCareAdvice(plantSpecies, question);
      }
      
      const prompt = `Provide specific care advice for ${plantSpecies}. Question: ${question}. Give practical, actionable recommendations.`;
      const response = await this.callGeminiText(prompt);
      return response;
    } catch (error) {
      console.error('AI Care Advice error:', error);
      return this.getMockCareAdvice(plantSpecies, question);
    }
  }

  async generateCareSchedule(plantSpecies, location, conditions) {
    try {
      if (!this.apiKey) {
        return this.getMockCareSchedule(plantSpecies, location, conditions);
      }
      
      const prompt = `Create a detailed, personalized care schedule for ${plantSpecies} in ${location} with these conditions: ${conditions}. 

Please provide a comprehensive schedule including:
- Watering frequency and best practices
- Fertilizing schedule and recommendations
- Pruning/trimming guidelines
- Repotting timeline and tips
- Light requirements and positioning
- Temperature and humidity preferences
- Seasonal adjustments
- Common issues to watch for

Format the response in a clear, easy-to-follow structure with specific timeframes and actionable steps.`;
      
      const response = await this.callGeminiText(prompt);
      return response;
    } catch (error) {
      console.error('AI Care Schedule error:', error);
      return this.getMockCareSchedule(plantSpecies, location, conditions);
    }
  }

  async predictGrowth(plantData) {
    try {
      if (!this.apiKey) {
        return this.getMockGrowthPrediction(plantData);
      }
      const { species, ageWeeks, health, lastRepot, lastPrune, location, notes } = plantData;
      const prompt = `Predict the growth of a ${species} plant over the next month. Current age: ${ageWeeks} weeks. Health: ${health}. Last repot: ${lastRepot}. Last prune: ${lastPrune}. Location: ${location}. Notes: ${notes}. Give a friendly, visual description of expected changes (new leaves, height, etc).`;
      const response = await this.callGeminiText(prompt);
      return response;
    } catch (error) {
      console.error('AI Growth Prediction error:', error);
      return this.getMockGrowthPrediction(plantData);
    }
  }

  async getClimateBasedCare(plantData, weatherData) {
    try {
      if (!this.apiKey) {
        return this.getMockClimateBasedCare(plantData, weatherData);
      }
      
      const { species, location, conditions } = plantData;
      const { temperature, humidity, forecast, season } = weatherData;
      
      const prompt = `Provide climate-optimized care recommendations for ${species} in ${location} with current conditions: ${conditions}.

Current weather data:
- Temperature: ${temperature}
- Humidity: ${humidity}
- Season: ${season}
- Forecast: ${forecast}

Please provide:
1. WATERING ADJUSTMENTS: How to modify watering based on current weather
2. LIGHT POSITIONING: Optimal placement considering current conditions
3. TEMPERATURE PROTECTION: Any needed adjustments for temperature
4. HUMIDITY MANAGEMENT: Recommendations for humidity levels
5. SEASONAL ADAPTATIONS: Specific changes for current season
6. WEATHER ALERTS: Any immediate actions needed based on forecast
7. OPTIMAL TIMING: Best times for care activities given weather

Format as clear, actionable recommendations.`;
      
      const response = await this.callGeminiText(prompt);
      return response;
    } catch (error) {
      console.error('AI Climate Care error:', error);
      return this.getMockClimateBasedCare(plantData, weatherData);
    }
  }

  async callGeminiVision(prompt, imageBase64) {
    const response = await axios.post(
      `${this.baseURL}?key=${this.apiKey}`,
      {
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }]
      }
    );
    return response.data.candidates[0].content.parts[0].text;
  }

  async callGeminiText(prompt) {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }]
      }
    );
    return response.data.candidates[0].content.parts[0].text;
  }

  // Mock responses for testing when API key is not available
  getMockPlantIdentification() {
    const plants = [
      "Monstera deliciosa\nA popular tropical plant known for its distinctive split leaves. Native to Central America, it's commonly called the Swiss Cheese Plant due to its unique leaf perforations.",
      "Snake Plant (Sansevieria trifasciata)\nA hardy, low-maintenance plant with tall, upright leaves. Excellent for beginners and known for its air-purifying qualities.",
      "Pothos (Epipremnum aureum)\nA versatile trailing plant with heart-shaped leaves. Perfect for hanging baskets and known for its ability to thrive in various light conditions.",
      "ZZ Plant (Zamioculcas zamiifolia)\nA drought-tolerant plant with glossy, dark green leaves. Known for its ability to survive in low-light conditions with minimal care."
    ];
    return plants[Math.floor(Math.random() * plants.length)];
  }

  getMockPlantDiagnosis() {
    const diagnoses = [
      {
        condition: "Overwatering",
        severity: "Moderate",
        confidence: 85,
        symptoms: "Yellowing leaves, soft/mushy stems, waterlogged soil, root rot visible",
        rootCause: "Excessive watering frequency or poor drainage",
        treatment: "1. Stop watering immediately\n2. Remove from pot and inspect roots\n3. Trim any black/mushy roots\n4. Repot in fresh, well-draining soil\n5. Resume watering only when top 2 inches are dry",
        timeline: "2-4 weeks for recovery",
        prevention: "Use well-draining soil, check moisture before watering, ensure pot has drainage holes",
        additionalNotes: "Consider using a moisture meter to prevent overwatering in the future."
      },
      {
        condition: "Nutrient Deficiency",
        severity: "Low",
        confidence: 78,
        symptoms: "Pale leaves with green veins, stunted growth, yellowing between veins",
        rootCause: "Insufficient fertilization or poor soil quality",
        treatment: "1. Apply balanced liquid fertilizer\n2. Consider repotting with fresh soil\n3. Monitor new growth for improvement\n4. Maintain regular feeding schedule",
        timeline: "3-6 weeks for visible improvement",
        prevention: "Use quality potting mix, fertilize regularly during growing season",
        additionalNotes: "Different deficiencies show different symptoms - this appears to be iron or nitrogen deficiency."
      },
      {
        condition: "Pest Infestation",
        severity: "High",
        confidence: 92,
        symptoms: "Small white spots, webbing, visible insects, sticky residue on leaves",
        rootCause: "Spider mites or mealybugs, likely due to dry conditions",
        treatment: "1. Isolate plant immediately\n2. Wash leaves with mild soap solution\n3. Apply neem oil or insecticidal soap\n4. Repeat treatment every 7 days\n5. Increase humidity around plant",
        timeline: "2-3 weeks to eliminate pests",
        prevention: "Regular inspection, maintain proper humidity, avoid overcrowding plants",
        additionalNotes: "Check other nearby plants for signs of infestation."
      },
      {
        condition: "Insufficient Light",
        severity: "Moderate",
        confidence: 81,
        symptoms: "Leggy growth, small leaves, pale coloring, leaning toward light source",
        rootCause: "Plant not receiving adequate light for its species",
        treatment: "1. Move to brighter location gradually\n2. Consider supplemental grow lights\n3. Rotate plant regularly for even growth\n4. Prune leggy stems to encourage bushiness",
        timeline: "4-8 weeks for new growth to appear",
        prevention: "Research light requirements for plant species, use light meters if needed",
        additionalNotes: "Sudden exposure to bright light can cause sunburn - acclimate gradually."
      }
    ];
    
    const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
    return `PRIMARY DIAGNOSIS: ${diagnosis.condition}
SEVERITY LEVEL: ${diagnosis.severity}
CONFIDENCE: ${diagnosis.confidence}%

VISUAL SYMPTOMS:
${diagnosis.symptoms}

ROOT CAUSE:
${diagnosis.rootCause}

TREATMENT PLAN:
${diagnosis.treatment}

TIMELINE:
${diagnosis.timeline}

PREVENTION:
${diagnosis.prevention}

ADDITIONAL NOTES:
${diagnosis.additionalNotes}`;
  }

  getMockCareAdvice(plantSpecies, question) {
    return `Care advice for ${plantSpecies}: ${question || 'general care'}\n\nWater when the top inch of soil feels dry. Provide bright, indirect light. Maintain humidity around 50-60%. Fertilize monthly during growing season with balanced fertilizer. Repot every 1-2 years in well-draining soil.`;
  }

  getMockCareSchedule(plantSpecies, location, conditions) {
    return `Personalized Care Schedule for ${plantSpecies} in ${location}:

🌱 WATERING SCHEDULE:
• Water every 7-10 days during growing season (spring/summer)
• Reduce to every 10-14 days in fall/winter
• Check soil moisture before watering - top 1-2 inches should be dry
• Use room temperature water and ensure good drainage

🌿 FERTILIZING:
• Apply balanced liquid fertilizer monthly during spring/summer
• Use half-strength fertilizer for young plants
• Stop fertilizing in fall/winter months
• Consider slow-release fertilizer for consistent nutrition

✂️ PRUNING & MAINTENANCE:
• Remove dead or yellowing leaves as needed
• Trim leggy growth to encourage bushiness
• Prune after flowering to maintain shape
• Clean leaves monthly with damp cloth

🪴 REPOTTING:
• Repot every 1-2 years in spring
• Choose pot 1-2 inches larger than current
• Use well-draining potting mix
• Water thoroughly after repotting

☀️ LIGHT & POSITIONING:
• Provide bright, indirect light
• Avoid direct sunlight to prevent leaf burn
• Rotate plant weekly for even growth
• Consider grow lights in low-light areas

🌡️ TEMPERATURE & HUMIDITY:
• Maintain 65-75°F (18-24°C) temperature
• Keep humidity around 50-60%
• Avoid cold drafts and heating vents
• Use humidifier in dry conditions

⚠️ WATCH FOR:
• Yellow leaves (overwatering)
• Brown tips (low humidity)
• Leggy growth (insufficient light)
• Pests (check regularly)

This schedule is based on your plant's current conditions: ${conditions}`;
  }

  getMockGrowthPrediction(plantData) {
    return `In the next month, your ${plantData.species} is likely to grow 2-3 new leaves and become noticeably fuller. Keep up the good care! 🌱`;
  }

  getMockClimateBasedCare(plantData, weatherData) {
    return `Climate-Optimized Care for ${plantData.species} in ${plantData.location}:

🌡️ TEMPERATURE ADJUSTMENTS:
• Current temperature: ${weatherData.temperature}
• Move plant away from cold drafts if temperature drops below 60°F
• Consider moving to warmer location during cold spells
• Monitor for temperature stress signs

💧 WATERING ADJUSTMENTS:
• Reduce watering frequency in cooler weather
• Increase humidity if indoor heating is active
• Check soil moisture more frequently during temperature changes
• Water in morning to allow drying before night

☀️ LIGHT POSITIONING:
• Maximize natural light exposure during shorter days
• Consider supplemental lighting if needed
• Rotate plant weekly for even growth
• Protect from intense afternoon sun if temperatures are high

🌧️ WEATHER-BASED RECOMMENDATIONS:
• ${weatherData.forecast ? `Based on forecast: ${weatherData.forecast}` : 'Monitor local weather for extreme conditions'}
• Bring outdoor plants inside if frost is expected
• Increase ventilation during humid periods
• Protect from strong winds if applicable

⏰ OPTIMAL CARE TIMING:
• Water early morning for best absorption
• Fertilize during active growth periods
• Prune during dormancy or early spring
• Repot in spring when temperatures are stable

🛡️ PROTECTIVE MEASURES:
• Use humidity trays during dry periods
• Consider plant covers for temperature protection
• Monitor for weather-related stress signs
• Adjust care schedule based on weather patterns`;
  }
}

module.exports = new AIService(); 