const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  }

  async identifyPlant(imageBase64, mimeType = 'image/jpeg') {
    try {
      if (!this.apiKey) {
        throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file.');
      }
      
      const prompt = `You are a world-class plant identification expert and botanist. Analyze this plant image with the precision of a scientist.

Return ONLY valid minified JSON with these exact keys in snake_case:
{
  "species": string,                // scientific name if certain, else best guess common grouping
  "common_name": string,            // best common name if known
  "confidence": number,             // 0-100
  "description": string             // brief distinguishing features seen in THIS image
}

Rules:
- If unsure, lower confidence and state uncertainty in description. Do NOT hallucinate.
- Do not include markdown or backticks. Output must be raw JSON.`;

      const response = await this.callGeminiVision(prompt, imageBase64, mimeType);
      if (process.env.NODE_ENV !== 'test') {
        console.log('[AI][identify] mimeType=', mimeType, ' raw=', String(response).slice(0, 200));
      }
      const parsed = this.parseIdentificationJson(response);
      if (process.env.NODE_ENV === 'development') {
        parsed.debug = { raw: String(response).slice(0, 500) };
      }
      return parsed;
    } catch (error) {
      console.error('AI Identification error:', error);
      if (error.message.includes('GEMINI_API_KEY')) {
        throw new Error('AI service not configured. Please add GEMINI_API_KEY to your environment variables.');
      }
      throw new Error(`Plant identification failed: ${error.message}`);
    }
  }

  async diagnosePlant(imageBase64, mimeType = 'image/jpeg') {
    try {
      if (!this.apiKey) {
        throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file.');
      }
      
      const prompt = `You are a plant health expert. Analyze this plant image for health issues and provide:

**HEALTH ASSESSMENT:**
- Primary diagnosis with confidence level (0-100%)
- Severity: Low/Moderate/High/Critical
- Visual symptoms observed
- Likely root cause

**TREATMENT PLAN:**
- Immediate actions needed
- Step-by-step treatment
- Expected recovery timeline
- Prevention measures

**FORMAT:**
Use clear sections with emojis, bullet points, and structured formatting. Be specific and actionable.`;

      const response = await this.callGeminiVision(prompt, imageBase64, mimeType);
      return this.formatPlantDiagnosis(response);
    } catch (error) {
      console.error('AI Diagnosis error:', error);
      if (error.message.includes('GEMINI_API_KEY')) {
        throw new Error('AI service not configured. Please add GEMINI_API_KEY to your environment variables.');
      }
      throw new Error(`Plant diagnosis failed: ${error.message}`);
    }
  }

  async getCareAdvice(plantSpecies, question) {
    try {
      if (!this.apiKey) {
        throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file.');
      }
      
      // Make the AI truly intelligent and responsive
      let prompt;
      
      if (!question || question.trim() === '') {
        // No question provided - give comprehensive care overview
        prompt = `You are a world-class plant care specialist and personal plant doctor. ${plantSpecies} is your patient.

**TASK:** Provide a comprehensive, personalized care consultation for ${plantSpecies}.

**APPROACH:**
- Act like a real plant doctor doing a consultation
- Give specific, actionable advice for ${plantSpecies}
- Include common problems and solutions
- Make it feel personal and caring
- Be conversational but professional

**INCLUDE:**
🌱 **Essential Care Basics** (what this plant absolutely needs)
🌿 **Growth & Development** (how to help it thrive)
💧 **Watering & Feeding** (specific to this plant type)
☀️ **Light & Environment** (optimal conditions)
⚠️ **Common Issues & Solutions** (what to watch for)
💡 **Pro Tips** (expert secrets for this plant)

**FORMAT:** Be conversational, use emojis, give specific advice. Make it feel like a personal consultation with a plant expert.`;
      } else {
        // Question provided - give targeted, intelligent answer
        const questionType = this.analyzeQuestionType(question);
        
        prompt = `You are a world-class plant care specialist and personal plant doctor. ${plantSpecies} is your patient, and they've asked: "${question}"

**TASK:** Provide a targeted, intelligent answer to this specific question about ${plantSpecies}.

**APPROACH:**
- Answer the EXACT question asked - don't give generic advice
- Be like a real plant doctor answering a specific concern
- Provide different advice than you would for other plants
- Give specific, actionable steps
- Be conversational and caring

**RESPONSE STRUCTURE:**
🌱 **Direct Answer** - Specifically address "${question}"
🌿 **Why This Matters for ${plantSpecies}** - Plant-specific context
💡 **Step-by-Step Solution** - Clear, actionable steps
⚠️ **Important Notes** - Warnings and tips specific to this plant
🎯 **Pro Tips** - Expert advice for this specific situation

**IMPORTANT:** 
- Focus ONLY on what was asked
- Give different advice than generic care tips
- Make it feel like a personal consultation
- Be specific and actionable
- Use conversational, caring language`;
      }

      const response = await this.callGeminiText(prompt);
      return this.formatCareAdvice(response, plantSpecies, question);
    } catch (error) {
      console.error('AI Care Advice error:', error);
      if (error.message.includes('GEMINI_API_KEY')) {
        throw new Error('AI service not configured. Please add GEMINI_API_KEY to your environment variables.');
      }
      throw new Error(`Care advice failed: ${error.message}`);
    }
  }

  // Helper method to analyze question type for better responses
  analyzeQuestionType(question) {
    const q = question.toLowerCase();
    
    if (q.includes('plant') || q.includes('grow') || q.includes('propagate')) {
      return 'planting';
    } else if (q.includes('soil') || q.includes('potting') || q.includes('repot')) {
      return 'soil';
    } else if (q.includes('water') || q.includes('watering')) {
      return 'watering';
    } else if (q.includes('light') || q.includes('sun') || q.includes('shade')) {
      return 'lighting';
    } else if (q.includes('fertiliz') || q.includes('feed') || q.includes('nutrient')) {
      return 'fertilizing';
    } else if (q.includes('prune') || q.includes('trim') || q.includes('cut')) {
      return 'pruning';
    } else if (q.includes('temperature') || q.includes('cold') || q.includes('heat')) {
      return 'temperature';
    } else if (q.includes('pest') || q.includes('disease') || q.includes('problem')) {
      return 'problems';
    } else if (q.includes('flower') || q.includes('bloom') || q.includes('bud')) {
      return 'flowering';
    } else {
      return 'general';
    }
  }

  // Helper method to provide plant-specific context
  getPlantContext(plantSpecies) {
    const plant = plantSpecies.toLowerCase();
    
    // Provide specific context for common plants to get better responses
    if (plant.includes('monstera') || plant.includes('swiss cheese')) {
      return `Monstera deliciosa is a tropical plant native to Central America. It's known for its distinctive split leaves and aerial roots. It's a climbing plant that can grow quite large and prefers bright, indirect light with high humidity.`;
    } else if (plant.includes('snake') || plant.includes('sansevieria')) {
      return `Snake Plant (Sansevieria trifasciata) is a hardy, low-maintenance plant native to West Africa. It's excellent for beginners, tolerates low light, and is known for its air-purifying qualities. It's drought-tolerant and prefers well-draining soil.`;
    } else if (plant.includes('pothos') || plant.includes('epipremnum')) {
      return `Pothos (Epipremnum aureum) is a versatile trailing plant native to the Solomon Islands. It has heart-shaped leaves and can grow in various light conditions. It's excellent for hanging baskets and is very forgiving for beginners.`;
    } else if (plant.includes('zz') || plant.includes('zamioculcas')) {
      return `ZZ Plant (Zamioculcas zamiifolia) is a drought-tolerant plant native to Eastern Africa. It has glossy, dark green leaves and can survive in low-light conditions with minimal care. It's perfect for busy people or low-light spaces.`;
    } else if (plant.includes('ficus') || plant.includes('fig')) {
      return `Ficus plants are popular indoor trees native to tropical regions. They prefer bright, indirect light and consistent watering. They can be sensitive to changes in environment and may drop leaves when stressed.`;
    } else if (plant.includes('aloe') || plant.includes('succulent')) {
      return `Aloe and succulents are drought-tolerant plants that store water in their leaves. They prefer bright light, well-draining soil, and infrequent watering. They're perfect for sunny windowsills and low-maintenance care.`;
    } else if (plant.includes('orchid')) {
      return `Orchids are epiphytic plants that grow on trees in nature. They prefer bright, indirect light, high humidity, and well-draining orchid mix. They have specific watering and fertilizing needs that differ from regular houseplants.`;
    } else if (plant.includes('cactus')) {
      return `Cacti are desert plants adapted to dry, hot conditions. They need bright light, very well-draining soil, and minimal watering. They're excellent for sunny locations and require very little maintenance.`;
    } else if (plant.includes('fern')) {
      return `Ferns are moisture-loving plants that prefer indirect light and high humidity. They need consistently moist soil and regular misting. They're perfect for bathrooms or humid environments.`;
    } else if (plant.includes('palm')) {
      return `Palms are tropical plants that add a lush, tropical feel to spaces. They prefer bright, indirect light and consistent moisture. They can be sensitive to overwatering and need well-draining soil.`;
    } else {
      return `${plantSpecies} is a unique plant that may have specific care requirements. Consider its natural habitat, growth patterns, and specific needs when providing care advice.`;
    }
  }

  async generateCareSchedule(plantSpecies, location, conditions) {
    try {
      if (!this.apiKey) {
        throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file.');
      }
      
      const plantContext = this.getPlantContext(plantSpecies);
      
      const prompt = `You are an expert plant care specialist creating a personalized care schedule for ${plantSpecies}.

**PLANT CONTEXT:**
${plantContext}

**LOCATION:** ${location}
**CURRENT CONDITIONS:** ${conditions || 'Standard indoor conditions'}

**CREATE A DETAILED, PERSONALIZED CARE SCHEDULE INCLUDING:**

🌱 **WATERING SCHEDULE**
- Specific frequency for ${plantSpecies} in ${location}
- How to check soil moisture
- Seasonal adjustments needed
- Signs of over/under watering

🌿 **FERTILIZING PLAN**
- Best fertilizer type for ${plantSpecies}
- Application frequency and timing
- Seasonal adjustments
- How to apply safely

✂️ **MAINTENANCE TASKS**
- Pruning schedule and techniques
- Repotting timeline and process
- Cleaning and grooming needs
- Pest prevention measures

☀️ **ENVIRONMENTAL NEEDS**
- Optimal light positioning for ${location}
- Temperature and humidity requirements
- Seasonal location adjustments
- Protection from environmental stress

📅 **WEEKLY/MONTHLY CHECKLIST**
- Daily tasks (if any)
- Weekly maintenance
- Monthly deep care
- Seasonal special care

⚠️ **SPECIFIC CONSIDERATIONS FOR ${plantSpecies}**
- Unique needs of this plant type
- Common problems and solutions
- Growth patterns and expectations
- Special care requirements

**FORMAT:**
- Use clear sections with emojis
- Provide specific timeframes and measurements
- Include actionable steps
- Make it feel like a personal care plan for this specific plant`;

      const response = await this.callGeminiText(prompt);
      return this.formatCareSchedule(response, plantSpecies, location, conditions);
    } catch (error) {
      console.error('AI Care Schedule error:', error);
      if (error.message.includes('GEMINI_API_KEY')) {
        throw new Error('AI service not configured. Please add GEMINI_API_KEY to your environment variables.');
      }
      throw new Error(`Care schedule generation failed: ${error.message}`);
    }
  }

  async predictGrowth(plantData) {
    try {
      if (!this.apiKey) {
        throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file.');
      }
      
      const { species, ageWeeks, health, lastRepot, lastPrune, location, notes } = plantData;
      const plantContext = this.getPlantContext(species);
      
      const prompt = `You are an expert plant growth specialist predicting the development of a ${species} plant.

**PLANT CONTEXT:**
${plantContext}

**CURRENT PLANT STATUS:**
- Age: ${ageWeeks} weeks
- Health: ${health}
- Last repot: ${lastRepot || 'Unknown'}
- Last prune: ${lastPrune || 'Unknown'}
- Location: ${location}
- Notes: ${notes || 'None'}

**PROVIDE A DETAILED GROWTH PREDICTION FOR THE NEXT 3 MONTHS:**

🌱 **GROWTH EXPECTATIONS**
- New leaf development patterns
- Height and width changes
- Root growth and pot space needs
- Branching or trailing growth

📈 **DEVELOPMENT TIMELINE**
- Week 1-4: What to expect
- Week 5-8: Growth milestones
- Week 9-12: Mature development
- Seasonal growth patterns

💡 **CARE RECOMMENDATIONS FOR OPTIMAL GROWTH**
- Watering adjustments needed
- Fertilizing schedule for growth
- Light positioning changes
- Repotting timeline

⚠️ **POTENTIAL CHALLENGES & SOLUTIONS**
- Growth obstacles to watch for
- How to prevent stunted growth
- Signs of healthy vs. unhealthy growth
- When to intervene

🎯 **GROWTH OPTIMIZATION TIPS**
- Best practices for this specific plant
- Environmental adjustments
- Care routine modifications
- Growth monitoring techniques

**FORMAT:**
- Use encouraging, friendly language
- Include specific measurements and timeframes
- Provide actionable growth tips
- Make it feel like a personal growth consultation`;

      const response = await this.callGeminiText(prompt);
      return this.formatGrowthPrediction(response, plantData);
    } catch (error) {
      console.error('AI Growth Prediction error:', error);
      if (error.message.includes('GEMINI_API_KEY')) {
        throw new Error('AI service not configured. Please add GEMINI_API_KEY to your environment variables.');
      }
      throw new Error(`Growth prediction failed: ${error.message}`);
    }
  }

  async getClimateBasedCare(plantData, weatherData) {
    try {
      if (!this.apiKey) {
        throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file.');
      }
      
      const { species, location, conditions } = plantData;
      const { temperature, humidity, forecast, season } = weatherData;
      
      const prompt = `Provide climate-optimized care recommendations for ${species} in ${location}.

**CURRENT WEATHER:**
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- Season: ${season}
- Forecast: ${forecast || 'Stable conditions'}

**CARE ADJUSTMENTS NEEDED:**
🌡️ **Temperature Management**
- Protection measures
- Optimal positioning
- Seasonal adjustments

💧 **Watering Modifications**
- Frequency changes
- Amount adjustments
- Timing optimization

☀️ **Light & Positioning**
- Optimal placement
- Shade requirements
- Seasonal movement

🛡️ **Protection Strategies**
- Weather alerts
- Immediate actions
- Preventive measures

**FORMAT:** Use clear sections with emojis and actionable recommendations.`;

      const response = await this.callGeminiText(prompt);
      return this.formatClimateCare(response, plantData, weatherData);
    } catch (error) {
      console.error('AI Climate Care error:', error);
      if (error.message.includes('GEMINI_API_KEY')) {
        throw new Error('AI service not configured. Please add GEMINI_API_KEY to your environment variables.');
      }
      throw new Error(`Climate-based care failed: ${error.message}`);
    }
  }

  async callGeminiVision(prompt, imageBase64, mimeType = 'image/jpeg') {
    try {
      const response = await axios.post(
        `${this.baseURL}?key=${this.apiKey}`,
        {
          generationConfig: {
            temperature: 0.2,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 1024
          },
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType || 'image/jpeg',
                  data: imageBase64
                }
              }
            ]
          }]
        },
        {
          timeout: 30000, // 30 second timeout
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data.candidates || !response.data.candidates[0] || !response.data.candidates[0].content) {
        throw new Error('Invalid response from Gemini API');
      }

      const parts = response.data.candidates[0].content.parts || [];
      const text = parts.map(p => p.text).filter(Boolean).join('');
      if (!text) {
        throw new Error('Empty content from Gemini API');
      }
      return text;
    } catch (error) {
      if (error.response) {
        throw new Error(`Gemini API error: ${error.response.data.error?.message || error.response.statusText}`);
      } else if (error.request) {
        throw new Error('No response from Gemini API. Please check your internet connection.');
      } else {
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  }

  async callGeminiText(prompt) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          generationConfig: {
            temperature: 0.3,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 1200
          },
          contents: [{
            parts: [{ text: prompt }]
          }]
        },
        {
          timeout: 30000, // 30 second timeout
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data.candidates || !response.data.candidates[0] || !response.data.candidates[0].content) {
        throw new Error('Invalid response from Gemini API');
      }

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (error.response) {
        throw new Error(`Gemini API error: ${error.response.data.error?.message || error.response.statusText}`);
      } else if (error.request) {
        throw new Error('No response from Gemini API. Please check your internet connection.');
      } else {
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  }

  // Formatting methods for better response structure
  formatPlantIdentification(response) {
    // If the response is already well-formatted, return as is
    if (response.includes('**') || response.includes('🌱') || response.includes('•')) {
      return response;
    }

    // Otherwise, add some basic formatting
    return `🌱 **Plant Identification Results**

${response}

---
*Identified using AI-powered plant recognition*`;
  }

  // Strictly parse JSON returned by identifyPlant
  parseIdentificationJson(rawText) {
    // Some models wrap JSON in code fences or prose. Strip common wrappers.
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();
    let data;
    try {
      data = JSON.parse(cleaned);
    } catch (e) {
      // Fallback: try to extract JSON object via regex
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) {
        return {
          species: 'Unknown',
          commonName: 'Unknown',
          confidence: 0,
          description: 'Unable to parse AI identification response.'
        };
      }
      try {
        data = JSON.parse(match[0]);
      } catch {
        return {
          species: 'Unknown',
          commonName: 'Unknown',
          confidence: 0,
          description: 'Unable to parse AI identification response.'
        };
      }
    }

    const species = data.species || data.scientific_name || 'Unknown';
    const common = data.common_name || data.commonName || 'Unknown';
    const confidence = typeof data.confidence === 'number' ? Math.round(data.confidence) : 0;
    const description = data.description || '';

    return { species, commonName: common, confidence, description };
  }

  formatPlantDiagnosis(response) {
    if (response.includes('**') || response.includes('🌱') || response.includes('•')) {
      return response;
    }

    return `🔍 **Plant Health Diagnosis**

${response}

---
*Diagnosis provided by AI-powered plant health analysis*`;
  }

  formatCareAdvice(response, plantSpecies, question) {
    if (response.includes('**') || response.includes('🌱') || response.includes('•')) {
      return response;
    }

    return `🌿 **Care Advice for ${plantSpecies}**

${response}

---
*Care advice generated by AI plant care expert*`;
  }

  formatCareSchedule(response, plantSpecies, location, conditions) {
    if (response.includes('**') || response.includes('🌱') || response.includes('•')) {
      return response;
    }

    return `📅 **Care Schedule for ${plantSpecies}**

${response}

---
*Personalized for ${location} with conditions: ${conditions}*`;
  }

  formatGrowthPrediction(response, plantData) {
    if (response.includes('**') || response.includes('🌱') || response.includes('•')) {
      return response;
    }

    return `📈 **Growth Prediction for ${plantData.species}**

${response}

---
*Prediction based on current plant data and AI analysis*`;
  }

  formatClimateCare(response, plantData, weatherData) {
    if (response.includes('**') || response.includes('🌱') || response.includes('•')) {
      return response;
    }

    return `🌤️ **Climate-Based Care for ${plantData.species}**

${response}

---
*Optimized for current weather conditions*`;
  }
}

module.exports = new AIService(); 