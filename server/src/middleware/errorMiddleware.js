import multer from 'multer';

/**
 * Centralized error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Log internal error for developers/debugging
  console.error('[SERVER ERROR]:', err);

  // Multer specific errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds the allowed limit (10MB maximum).'
      });
    }
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`
    });
  }

  // Custom file type error from upload filter
  if (err.code === 'INVALID_FILE_TYPE' || err.message?.includes('Please upload a PDF')) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a PDF, JPG, JPEG or PNG resume.'
    });
  }

  // Handle known application errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Default fallback for unexpected internal errors
  return res.status(500).json({
    success: false,
    message: 'An unexpected error occurred. Please try again later.'
  });
};

/**
 * 404 Route Not Found handler
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
};
