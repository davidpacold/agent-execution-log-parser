/**
 * Cloudflare Worker for log parsing
 * @module worker
 * 
 * This worker serves an HTML-based log parser that processes Airia Agent execution logs
 * and displays them in a structured, human-readable format.
 * 
 * It includes detailed metrics like execution steps, token usage, tool calls,
 * and API request details with request/response metrics.
 */

import { renderHTML } from './components/template.js';
import { 
  corsHeaders, 
  handleOptions, 
  parseLogData, 
  validateLogSize,
  addRequestMetadata
} from './components/utils.js';
import { extractRequestInfo } from './lib/utils.js';
import { handleError, ErrorTypes } from './lib/error-handler.js';
import { MAX_LOG_SIZE } from './lib/log-parser.js';

// API version - use environment variable if available
const API_VERSION = process.env.API_VERSION || '1.0.1';

/**
 * Process a POST request with log data
 * @param {Request} request - The incoming request
 * @returns {Promise<Response>} - The response with parsed log data
 */
async function handlePostRequest(request) {
  const url = new URL(request.url);
  console.log("Processing API request to:", url.pathname);
  
  try {
    // Get the request body
    const requestText = await request.text();
    
    // Check file size before parsing
    if (!validateLogSize(requestText)) {
      return handleError(
        'FILE_TOO_LARGE',
        `Log data exceeds maximum size of ${MAX_LOG_SIZE / (1024 * 1024)}MB`,
        url.toString(),
        null,
        corsHeaders
      );
    }
    
    // Parse the request body as JSON
    let logData;
    try {
      logData = JSON.parse(requestText);
    } catch (parseError) {
      return handleError(
        'PARSING_ERROR',
        'Invalid JSON format: ' + parseError.message,
        url.toString(),
        parseError,
        corsHeaders
      );
    }
    
    // Process the log data
    const result = parseLogData(logData);
    
    // Add request metadata to the response
    addRequestMetadata(result, request);
    
    // Add API version
    result.meta.api_version = API_VERSION;
    
    // Return the processed data
    return new Response(JSON.stringify(result, null, 2), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'X-API-Version': API_VERSION
      }
    });
  } catch (error) {
    return handleError(
      'PARSING_ERROR',
      error.message,
      url.toString(),
      error,
      corsHeaders
    );
  }
}

/**
 * Handle a GET request for the UI
 * @returns {Response} - The HTML UI response
 */
function handleGetRequest() {
  console.log("Serving HTML UI");
  return new Response(renderHTML(), {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
      'X-App-Version': API_VERSION
    },
  });
}

// Event handler for incoming requests
export default {
  async fetch(request, env, ctx) {
    // Make environment variables available to the application
    process.env = { ...process.env, ...env };
    
    // Log request information with environment context
    const requestInfo = extractRequestInfo(request);
    console.log(`[${process.env.ENVIRONMENT || 'development'}] Request received:`, requestInfo);
    
    // Add timing information to the context for performance monitoring
    const startTime = Date.now();
    ctx.waitUntil(
      new Promise(resolve => {
        request.addEventListener('close', () => {
          const duration = Date.now() - startTime;
          console.log(`[${process.env.ENVIRONMENT || 'development'}] Request completed in ${duration}ms`);
          resolve();
        });
      })
    );
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    // Route request based on method
    if (request.method === 'POST') {
      return handlePostRequest(request);
    }

    // Default: serve the HTML UI
    return handleGetRequest();
  },
};