/**
 * Utility functions for log parsing
 */
import { parseLogData } from '../lib/log-parser.js';
import { formatDateTime } from '../lib/formatters.js';

// Define CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Handle CORS preflight requests
export function handleOptions(request) {
  return new Response(null, {
    headers: corsHeaders
  });
}

// Re-export the shared functions
export { parseLogData, formatDateTime };