const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allow only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    files: 1 // Allow only 1 file per request
  },
  fileFilter: fileFilter
});

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: `File size must be less than ${(parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024) / (1024 * 1024)}MB`
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        message: 'Only one file is allowed per request'
      });
    }
    return res.status(400).json({
      error: 'File upload error',
      message: err.message
    });
  }
  
  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({
      error: 'Invalid file type',
      message: 'Only image files (JPEG, PNG, GIF) are allowed'
    });
  }
  
  next(err);
};

module.exports = { upload, handleUploadError }; 