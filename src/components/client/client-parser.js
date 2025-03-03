/**
 * Client-side log parser wrapper
 * @module client-parser
 * 
 * This module imports and uses the shared log parser logic,
 * adapting it for client-side use if needed
 */
import { 
  parseLogData as coreParseLogData, 
  detectLogFormat, 
  MAX_LOG_SIZE,
  LogFormat
} from '../../lib/log-parser.js';

/**
 * Validate the size of log data for client-side parsing
 * @param {Object|string} logData - The log data to validate
 * @returns {boolean} - Whether the log data is valid for parsing
 */
export function validateLogSize(logData) {
  if (!logData) return false;
  
  // If we have a string (e.g. from a text area), check its length
  if (typeof logData === 'string') {
    return logData.length <= MAX_LOG_SIZE;
  }
  
  // If we have a JSON object, stringify it and check its length
  try {
    const strLogData = JSON.stringify(logData);
    return strLogData.length <= MAX_LOG_SIZE;
  } catch (e) {
    console.error('Error validating log size:', e);
    return false;
  }
}

/**
 * Client-side wrapper for log parsing
 * @param {object} logData - The log data to parse
 * @returns {object} - The parsed result
 */
export function parseLogData(logData) {
  try {
    console.log("Beginning client-side parsing...");
    
    // Validate log size to prevent browser hanging on large logs
    if (!validateLogSize(logData)) {
      console.error('Log data too large');
      return {
        overview: {
          success: false,
          error: 'Log data too large'
        },
        summary: {},
        steps: [],
        errors: [{
          message: `Log data exceeds maximum size of ${MAX_LOG_SIZE / (1024 * 1024)}MB.`
        }]
      };
    }
    
    // Check format
    const { format } = detectLogFormat(logData);
    console.log(`Detected format: ${format}`);
    
    if (format === LogFormat.UNKNOWN) {
      console.error('Unknown log format');
      return {
        overview: {
          success: false,
          error: 'Unknown log format'
        },
        summary: {},
        steps: [],
        errors: [{
          message: 'Could not parse log data. Unknown format.'
        }]
      };
    }
    
    // Use the core parse function
    const result = coreParseLogData(logData);
    
    console.log("Parsing complete, found", result.steps.length, "steps");
    
    // Add client-side metadata
    result.meta = {
      parsed_at: new Date().toISOString(),
      client_version: "1.0.0",
      environment: "client"
    };
    
    return result;
  } catch (error) {
    console.error("Error in client-side parsing:", error);
    return {
      overview: {
        success: false,
        error: 'Parsing error'
      },
      summary: {},
      steps: [],
      errors: [{
        message: `Error parsing log data: ${error.message}`
      }]
    };
  }
}