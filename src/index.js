/**
 * Cloudflare Worker for log parsing
 * Main entry point for the application
 * 
 * This worker serves an HTML-based log parser that processes Airia Agent execution logs
 * and displays them in a structured, human-readable format.
 * 
 * It includes detailed metrics like execution steps, token usage, tool calls,
 * and API request details with request/response metrics.
 */

import { renderHTML } from './components/template.js';
import { corsHeaders, parseLogData, formatDateTime } from './components/utils.js';

// Event handler for incoming requests
export default {
  async fetch(request, env, ctx) {
    // Extract information about the request
    const url = new URL(request.url);
    const requestInfo = {
      method: request.method,
      url: url.toString(),
      path: url.pathname,
      headers: Object.fromEntries(request.headers)
    };
    
    console.log("Request received:", requestInfo);
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    // Handle POST requests with log data
    if (request.method === 'POST') {
      try {
        // Log API endpoint being used
        console.log("Processing API request to:", url.pathname);
        
        // Parse the request body as JSON
        const logData = await request.json();
        
        // Process the log data
        const result = parseLogData(logData);
        
        // Add request metadata to the response
        result.meta = {
          processed_at: new Date().toISOString(),
          api_version: "1.0.0",
          request_url: url.toString(),
          request_method: request.method
        };
        
        // Return the processed data
        return new Response(JSON.stringify(result, null, 2), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-API-Version': '1.0.0'
          }
        });
      } catch (error) {
        console.error("Error processing log data:", error);
        
        // Return error response
        return new Response(JSON.stringify({ 
          error: 'Failed to parse log data',
          message: error.message,
          request_url: url.toString()
        }), {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
    }

    // For GET requests, return the HTML page with the log parser UI
    console.log("Serving HTML UI");
    return new Response(renderHTML(), {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
        'X-App-Version': '1.0.0'
      },
    });
  },
};