const aiService = require('../services/aiService');
const fs = require('fs');

exports.identifyPlant = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No image provided',
        message: 'Please upload a clear image of the plant you want to identify'
      });
    }

    const imageBuffer = fs.readFileSync(req.file.path);
    const imageBase64 = imageBuffer.toString('base64');

    const result = await aiService.identifyPlant(imageBase64, req.file.mimetype);
    
    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json({
      success: true,
      identification: result,
      message: 'Plant identified successfully!'
    });
  } catch (error) {
    console.error('AI Identification error:', error);
    
    // Clean up the uploaded file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    // Provide specific error messages based on error type
    if (error.message.includes('GEMINI_API_KEY')) {
      return res.status(500).json({
        success: false,
        error: 'AI service not configured',
        message: 'Plant identification service is currently unavailable. Please contact support.'
      });
    }

    if (error.message.includes('timeout')) {
      return res.status(408).json({
        success: false,
        error: 'Request timeout',
        message: 'Plant identification took too long. Please try again with a clearer image.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Identification failed',
      message: 'Failed to identify plant. Please ensure the image is clear and try again.'
    });
  }
};

exports.diagnosePlant = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No image provided',
        message: 'Please upload a clear image of the plant for diagnosis'
      });
    }

    const imageBuffer = fs.readFileSync(req.file.path);
    const imageBase64 = imageBuffer.toString('base64');

    const result = await aiService.diagnosePlant(imageBase64, req.file.mimetype);
    
    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json({
      success: true,
      diagnosis: result,
      message: 'Plant health diagnosis completed successfully!'
    });
  } catch (error) {
    console.error('AI Diagnosis error:', error);
    
    // Clean up the uploaded file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    // Provide specific error messages based on error type
    if (error.message.includes('GEMINI_API_KEY')) {
      return res.status(500).json({
        success: false,
        error: 'AI service not configured',
        message: 'Plant diagnosis service is currently unavailable. Please contact support.'
      });
    }

    if (error.message.includes('timeout')) {
      return res.status(408).json({
        success: false,
        error: 'Request timeout',
        message: 'Plant diagnosis took too long. Please try again with a clearer image.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Diagnosis failed',
      message: 'Failed to diagnose plant. Please ensure the image is clear and try again.'
    });
  }
};

exports.getCareAdvice = async (req, res) => {
  try {
    const { plantSpecies, question } = req.body;
    
    if (!plantSpecies) {
      return res.status(400).json({ 
        success: false,
        error: 'Plant species required',
        message: 'Please provide the plant species for care advice'
      });
    }

    const result = await aiService.getCareAdvice(plantSpecies, question || 'general care');
    
    res.json({
      success: true,
      advice: result,
      plantSpecies,
      question: question || 'General care requirements',
      message: 'Care advice generated successfully!'
    });
  } catch (error) {
    console.error('AI Care Advice error:', error);
    
    if (error.message.includes('GEMINI_API_KEY')) {
      return res.status(500).json({
        success: false,
        error: 'AI service not configured',
        message: 'Care advice service is currently unavailable. Please contact support.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Care advice failed',
      message: 'Failed to generate care advice. Please try again.'
    });
  }
};

exports.generateCareSchedule = async (req, res) => {
  try {
    const { plantSpecies, location, conditions } = req.body;
    
    if (!plantSpecies || !location) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing information',
        message: 'Plant species and location are required for care schedule generation'
      });
    }

    const result = await aiService.generateCareSchedule(plantSpecies, location, conditions);
    
    res.json({
      success: true,
      schedule: result,
      plantSpecies,
      location,
      conditions: conditions || 'Standard conditions',
      message: 'Care schedule generated successfully!'
    });
  } catch (error) {
    console.error('AI Care Schedule error:', error);
    
    if (error.message.includes('GEMINI_API_KEY')) {
      return res.status(500).json({
        success: false,
        error: 'AI service not configured',
        message: 'Care schedule service is currently unavailable. Please contact support.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Schedule generation failed',
      message: 'Failed to generate care schedule. Please try again.'
    });
  }
};

exports.predictGrowth = async (req, res) => {
  try {
    const plantData = req.body;
    
    if (!plantData.species) {
      return res.status(400).json({ 
        success: false,
        error: 'Plant species required',
        message: 'Please provide the plant species for growth prediction'
      });
    }
    
    const result = await aiService.predictGrowth(plantData);
    
    res.json({
      success: true,
      prediction: result,
      plantData,
      message: 'Growth prediction generated successfully!'
    });
  } catch (error) {
    console.error('AI Growth Prediction error:', error);
    
    if (error.message.includes('GEMINI_API_KEY')) {
      return res.status(500).json({
        success: false,
        error: 'AI service not configured',
        message: 'Growth prediction service is currently unavailable. Please contact support.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Prediction failed',
      message: 'Failed to generate growth prediction. Please try again.'
    });
  }
};

exports.getClimateBasedCare = async (req, res) => {
  try {
    const { plantData, weatherData } = req.body;
    
    if (!plantData || !weatherData) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing data',
        message: 'Plant data and weather data are required for climate-based care recommendations'
      });
    }

    const result = await aiService.getClimateBasedCare(plantData, weatherData);
    
    res.json({
      success: true,
      recommendations: result,
      plantData,
      weatherData,
      message: 'Climate-based care recommendations generated successfully!'
    });
  } catch (error) {
    console.error('AI Climate Care error:', error);
    
    if (error.message.includes('GEMINI_API_KEY')) {
      return res.status(500).json({
        success: false,
        error: 'AI service not configured',
        message: 'Climate-based care service is currently unavailable. Please contact support.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Recommendations failed',
      message: 'Failed to generate climate-based care recommendations. Please try again.'
    });
  }
}; 