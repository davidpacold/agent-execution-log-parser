// This is a direct fix for the log viewer issue
// It provides a standalone web server that serves the HTML with properly parsed log data

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderHTML } from './src/components/template.js';
import { parseLogData } from './src/lib/log-parser.js';

// Constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

// Create a simple HTTP server
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    // Handle root path - serve the HTML UI
    if (url.pathname === '/') {
      // Intercept the default HTML and add our modified client-side JS
      let html = renderHTML();
      const clientJsContent = fs.readFileSync('./direct-fix-client.js', 'utf8');
      
      // Replace the existing script with our modified version
      html = html.replace(/(<script>)[\s\S]*?(<\/script>)/, `$1${clientJsContent}$2`);
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    }
    
    // Handle API requests
    if (url.pathname === '/api/parse' && req.method === 'POST') {
      // Read the request body
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      
      await new Promise((resolve, reject) => {
        req.on('end', resolve);
        req.on('error', reject);
      });
      
      console.log("Received log data for parsing...");
      
      // Parse the JSON data
      let logData;
      try {
        logData = JSON.parse(body);
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON: ' + error.message }));
        return;
      }
      
      console.log("Parsing log data...");
      
      // Parse the log data with our custom parser
      try {
        const parsedData = parseLogData(logData);
        
        // Debug log - RouterStep and ExecutePipelineStep
        const routerSteps = parsedData.steps.filter(s => s.type === 'RouterStep');
        console.log("Found RouterSteps:", routerSteps.length);
        if (routerSteps.length > 0) {
          console.log("Example RouterStep:", JSON.stringify(routerSteps[0], null, 2));
        }
        
        const executePipelineSteps = parsedData.steps.filter(s => s.type === 'ExecutePipelineStep');
        console.log("Found ExecutePipelineSteps:", executePipelineSteps.length);
        
        // The fix is now integrated into parseLogData, no need for additional processing
        
        // Return the enhanced parsed data
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(parsedData, null, 2));
      } catch (error) {
        console.error("Error parsing log data:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to parse log data: ' + error.message }));
      }
      
      return;
    }
    
    // Handle missing pages
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Direct fix server running at http://localhost:${PORT}/`);
  console.log('Use this server to test the log parser with proper step data');
  console.log('Press Ctrl+C to stop the server');
});