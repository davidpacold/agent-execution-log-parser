/**
 * HTML template for the log parser UI
 */

import { getStyles } from './styles.js';
import { getScripts } from './scripts.js';

export function renderHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Log File Parser</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github.min.css">
  <style>${getStyles()}</style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Log File Parser</h1>
      <p class="description">Paste your Airia Agent log file below to analyze and visualize its structure and execution flow.</p>
    </header>
    
    <div class="card mb-4">
      <div class="card-header">
        Upload or Paste Log Data
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="logInput" class="form-label">Paste log content:</label>
          <textarea class="form-control" id="logInput" rows="10" placeholder="Paste your log file content here..."></textarea>
        </div>
        <div class="mb-3">
          <label for="logFile" class="form-label">Or upload a log file:</label>
          <input class="form-control" type="file" id="logFile">
        </div>
        <button id="parseBtn" class="btn btn-primary">Parse Log</button>
        <div id="loadingIndicator" class="mt-2 hidden">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          Parsing log data...
        </div>
      </div>
    </div>
    
    <div id="results-container" class="mt-4 hidden">
      <div class="card mb-4">
        <div class="card-header">
          <h2 class="h5 mb-0">Overview</h2>
        </div>
        <div class="card-body">
          <div id="overview-content" class="overview"></div>
        </div>
      </div>
      
      <div id="errors-section" class="mb-4" style="display: none;">
        <div class="card border-danger">
          <div class="card-header bg-danger text-white">
            <h2 class="h5 mb-0">Errors</h2>
          </div>
          <div class="card-body" id="error-summary"></div>
        </div>
      </div>
      
      <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="h5 mb-0">Execution Steps</h2>
          <button id="expandAllBtn" class="btn btn-sm btn-outline-secondary">Expand All</button>
        </div>
        <div class="card-body">
          <div id="steps-content"></div>
        </div>
      </div>
      
      <div class="card mb-4">
        <div class="card-header">
          <h2 class="h5 mb-0">Conversation Summary</h2>
        </div>
        <div class="card-body">
          <div id="summary-content" class="conversation-summary">
            <!-- Will be filled dynamically -->
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="h5 mb-0">Raw JSON</h2>
          <button id="copyJsonBtn" class="btn btn-sm btn-outline-secondary">Copy JSON</button>
        </div>
        <div class="card-body">
          <pre id="raw-content" class="bg-light p-3 rounded"></pre>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
  <script type="text/javascript">
${getScripts()}
  </script>
</body>
</html>`;
}