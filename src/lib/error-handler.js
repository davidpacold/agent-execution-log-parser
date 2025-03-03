/**
 * Error handling module for the log parser
 * @module error-handler
 */

/**
 * Standard error response format
 * @typedef {Object} ErrorResponse
 * @property {string} error - Short error description
 * @property {string} message - Detailed error message
 * @property {string} request_url - The URL of the request that caused the error
 * @property {number} status - HTTP status code
 */

/**
 * Error types with predefined messages and status codes
 * @type {Object}
 */
export const ErrorTypes = {
  INVALID_FORMAT: {
    error: 'Invalid log format',
    message: 'The provided log data does not match any known format',
    status: 400
  },
  PARSING_ERROR: {
    error: 'Parsing error',
    message: 'An error occurred while parsing the log data',
    status: 400
  },
  FILE_TOO_LARGE: {
    error: 'File too large',
    message: 'The provided log file exceeds the maximum size limit',
    status: 413
  },
  SERVER_ERROR: {
    error: 'Server error',
    message: 'An internal server error occurred',
    status: 500
  }
};

/**
 * Creates a standardized error response object
 * @param {string} errorType - The type of error from ErrorTypes
 * @param {string} [customMessage] - Optional custom error message
 * @param {string} [requestUrl] - The URL of the request
 * @param {Error} [originalError] - The original error object
 * @returns {ErrorResponse} - Formatted error response
 */
export function createErrorResponse(errorType, customMessage, requestUrl, originalError) {
  const errorTemplate = ErrorTypes[errorType] || ErrorTypes.SERVER_ERROR;
  
  const errorResponse = {
    error: errorTemplate.error,
    message: customMessage || errorTemplate.message,
    request_url: requestUrl || 'unknown',
    status: errorTemplate.status
  };
  
  // Log the original error for debugging
  if (originalError) {
    console.error(`${errorTemplate.error}: ${originalError.message}`, originalError);
  }
  
  return errorResponse;
}

/**
 * Handles errors by creating both a Response object and logging the error
 * @param {string} errorType - The type of error from ErrorTypes
 * @param {string} [customMessage] - Optional custom error message
 * @param {string} [requestUrl] - The URL of the request
 * @param {Error} [originalError] - The original error object
 * @param {Object} [corsHeaders] - CORS headers to include in the response
 * @returns {Response} - Response object with appropriate status and body
 */
export function handleError(errorType, customMessage, requestUrl, originalError, corsHeaders = {}) {
  const errorResponse = createErrorResponse(errorType, customMessage, requestUrl, originalError);
  
  return new Response(JSON.stringify(errorResponse), {
    status: errorResponse.status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}