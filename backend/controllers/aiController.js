const aiService = require('../services/aiService');
const fs = require('fs');

exports.identifyPlant = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No image provided' });
    }

    const imageBuffer = fs.readFileSync(req.file.path);
    const imageBase64 = imageBuffer.toString('base64');

    const result = await aiService.identifyPlant(imageBase64);
    
    // Parse the AI response to extract structured data
    const response = parsePlantIdentification(result);
    
    res.json(response);
  } catch (error) {
    console.error('AI Identification error:', error);
    res.status(500).json({ msg: 'Failed to identify plant. Please try again.' });
  }
};

exports.diagnosePlant = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No image provided' });
    }

    const imageBuffer = fs.readFileSync(req.file.path);
    const imageBase64 = imageBuffer.toString('base64');

    const result = await aiService.diagnosePlant(imageBase64);
    
    // Parse the AI response to extract structured data
    const response = parsePlantDiagnosis(result);
    
    res.json(response);
  } catch (error) {
    console.error('AI Diagnosis error:', error);
    res.status(500).json({ msg: 'Failed to diagnose plant. Please try again.' });
  }
};

exports.getCareAdvice = async (req, res) => {
  try {
    const { plantSpecies, question } = req.body;
    if (!plantSpecies) {
      return res.status(400).json({ msg: 'Plant species is required' });
    }

    const result = await aiService.getCareAdvice(plantSpecies, question || 'general care');
    res.json({ advice: result });
  } catch (error) {
    console.error('AI Care Advice error:', error);
    res.status(500).json({ msg: 'Failed to get care advice. Please try again.' });
  }
};

exports.generateCareSchedule = async (req, res) => {
  try {
    const { plantSpecies, location, conditions } = req.body;
    if (!plantSpecies || !location) {
      return res.status(400).json({ msg: 'Plant species and location are required' });
    }

    const result = await aiService.generateCareSchedule(plantSpecies, location, conditions);
    res.json({ schedule: result });
  } catch (error) {
    console.error('AI Care Schedule error:', error);
    res.status(500).json({ msg: 'Failed to generate care schedule. Please try again.' });
  }
};

exports.predictGrowth = async (req, res) => {
  try {
    const plantData = req.body;
    if (!plantData.species) {
      return res.status(400).json({ msg: 'Plant species is required' });
    }
    const result = await aiService.predictGrowth(plantData);
    res.json({ prediction: result });
  } catch (error) {
    console.error('AI Growth Prediction error:', error);
    res.status(500).json({ msg: 'Failed to predict growth. Please try again.' });
  }
};

exports.getClimateBasedCare = async (req, res) => {
  try {
    const { plantData, weatherData } = req.body;
    if (!plantData || !weatherData) {
      return res.status(400).json({ msg: 'Plant data and weather data are required' });
    }

    const result = await aiService.getClimateBasedCare(plantData, weatherData);
    res.json({ recommendations: result });
  } catch (error) {
    console.error('AI Climate Care error:', error);
    res.status(500).json({ msg: 'Failed to get climate-based care. Please try again.' });
  }
};

// Helper function to parse plant identification response
function parsePlantIdentification(aiResponse) {
  try {
    // Extract species name (usually the first line or prominent text)
    const lines = aiResponse.split('\n').filter(line => line.trim());
    const species = lines[0] || 'Unknown Plant';
    
    // Extract description (rest of the text)
    const description = lines.slice(1).join(' ').trim() || 'No description available';
    
    return {
      species: species.replace(/^[^a-zA-Z]*/, '').trim(), // Remove leading non-letters
      commonName: species,
      confidence: 85, // Default confidence
      description: description
    };
  } catch (error) {
    return {
      species: 'Unknown Plant',
      commonName: 'Unknown',
      confidence: 0,
      description: aiResponse || 'Unable to parse identification result'
    };
  }
}

// Helper function to parse plant diagnosis response
function parsePlantDiagnosis(aiResponse) {
  try {
    const lines = aiResponse.split('\n').filter(line => line.trim());
    const result = {
      condition: 'Unable to diagnose',
      severity: 'Unknown',
      confidence: 0,
      symptoms: 'Unable to detect symptoms',
      rootCause: 'Unknown cause',
      treatment: 'Please consult a plant expert',
      timeline: 'Unknown timeline',
      prevention: 'General care recommended',
      additionalNotes: ''
    };

    let currentSection = '';
    
    for (const line of lines) {
      if (line.includes('PRIMARY DIAGNOSIS:')) {
        result.condition = line.replace('PRIMARY DIAGNOSIS:', '').trim();
      } else if (line.includes('SEVERITY LEVEL:')) {
        result.severity = line.replace('SEVERITY LEVEL:', '').trim();
      } else if (line.includes('CONFIDENCE:')) {
        const confidenceMatch = line.match(/(\d+)%/);
        result.confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 0;
      } else if (line.includes('VISUAL SYMPTOMS:')) {
        currentSection = 'symptoms';
      } else if (line.includes('ROOT CAUSE:')) {
        currentSection = 'rootCause';
      } else if (line.includes('TREATMENT PLAN:')) {
        currentSection = 'treatment';
      } else if (line.includes('TIMELINE:')) {
        currentSection = 'timeline';
      } else if (line.includes('PREVENTION:')) {
        currentSection = 'prevention';
      } else if (line.includes('ADDITIONAL NOTES:')) {
        currentSection = 'additionalNotes';
      } else if (line.trim() && currentSection) {
        if (result[currentSection] === result.condition || result[currentSection] === 'Unable to detect symptoms') {
          result[currentSection] = line.trim();
        } else {
          result[currentSection] += '\n' + line.trim();
        }
      }
    }

    return result;
  } catch (error) {
    return {
      condition: 'Unable to diagnose',
      severity: 'Unknown',
      confidence: 0,
      symptoms: 'Unable to detect symptoms',
      rootCause: 'Unknown cause',
      treatment: 'Please consult a plant expert',
      timeline: 'Unknown timeline',
      prevention: 'General care recommended',
      additionalNotes: aiResponse || 'Unable to parse diagnosis result'
    };
  }
} 