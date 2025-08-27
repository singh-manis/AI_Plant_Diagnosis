const app = require('./app');
const mongoose = require('mongoose');
require('./services/schedulerService');

const PORT = process.env.PORT || 5000;

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file or environment configuration.');
  process.exit(1);
}

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed');
          process.exit(0);
        });
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed');
          process.exit(0);
        });
      });
    });

  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.error('Please check your MONGO_URI in the .env file');
    process.exit(1);
  }); 