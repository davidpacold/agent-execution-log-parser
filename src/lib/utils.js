/**
 * Common utility functions
 * @module utils
 */
import { MAX_LOG_SIZE } from './log-parser.js';

// CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

/**
 * Handle CORS preflight requests
 * @param {Request} request - The incoming request
 * @returns {Response} - CORS preflight response
 */
export function handleOptions() {
  return new Response(null, {
    headers: corsHeaders
  });
}

/**
 * Validate log data size
 * @param {Object|string} logData - The log data to validate
 * @returns {boolean} - Whether the log data is valid
 */
export function validateLogSize(logData) {
  if (!logData) return false;
  
  const strLogData = typeof logData === 'string' 
    ? logData 
    : JSON.stringify(logData);
  
  return strLogData.length <= MAX_LOG_SIZE;
}

/**
 * Add request metadata to response
 * @param {Object} result - The result object
 * @param {Request} request - The request object
 * @returns {Object} - The result with metadata
 */
export function addRequestMetadata(result, request) {
  const url = new URL(request.url);
  
  result.meta = {
    processed_at: new Date().toISOString(),
    api_version: "1.0.0",
    request_url: url.toString(),
    request_method: request.method
  };
  
  return result;
}

/**
 * Extract information about a request for logging
 * @param {Request} request - The request object
 * @returns {Object} - Request information
 */
export function extractRequestInfo(request) {
  const url = new URL(request.url);
  
  return {
    method: request.method,
    url: url.toString(),
    path: url.pathname,
    headers: Object.fromEntries(request.headers)
  };
}