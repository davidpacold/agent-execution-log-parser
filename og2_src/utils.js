// Utility functions for the Log Parser

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

// Format a date time string
export function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return 'N/A';
  try {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  } catch (e) {
    return dateTimeStr;
  }
}