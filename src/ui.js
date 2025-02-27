// UI components for the Log Parser

// Main HTML for the page
export function renderHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Log File Parser</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
  <style>
    body {
      padding-top: 20px;
      padding-bottom: 60px;
    }
    .hidden {
      display: none;
    }
    .card {
      margin-bottom: 20px;
    }
    .json-tree {
      font-family: monospace;
      font-size: 14px;
      overflow: auto;
      max-height: 600px;
    }
    .key {
      color: #881391;
    }
    .string {
      color: #1C00CF;
    }
    .number {
      color: #1A01CC;
    }
    .boolean {
      color: #0000FF;
    }
    .null {
      color: #808080;
    }
    .summary-table {
      width: 100%;
      margin-bottom: 20px;
    }
    .summary-table th {
      background-color: #f8f9fa;
      font-weight: bold;
    }
    .success-true {
      color: green;
    }
    .success-false {
      color: red;
    }
    .expandable-content {
      display: none;
      margin-left: 20px;
    }
    .expander {
      cursor: pointer;
      color: #0d6efd;
    }
    .timestamp {
      font-size: 0.9em;
      color: #6c757d;
    }
    pre {
      white-space: pre-wrap;
    }
    #summary-box {
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .tool-row:nth-child(odd) {
      background-color: #f8f9fa;
    }
    .loading {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid rgba(0, 0, 0, 0.3);
      border-radius: 50%;
      border-top-color: #0d6efd;
      animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Python Step Styles */
    .python-step-container {
      border-left: 4px solid #4B8BBE;
      padding-left: 15px;
      margin-top: 10px;
    }

    .python-code {
      background-color: #f6f8fa;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      margin-top: 10px;
    }

    .python-output {
      background-color: #f1f8ff;
      padding: 10px;
      border-radius: 5px;
      border-left: 4px solid #58a6ff;
      font-family: monospace;
      margin-top: 10px;
    }

    /* Data Search Styles */
    .datasearch-container {
      border-left: 4px solid #4e42d4;
      padding-left: 15px;
      margin-top: 10px;
      margin-bottom: 20px;
    }

    .datasearch-results {
      font-size: 0.9rem;
      margin-top: 10px;
    }

    .datasearch-raw {
      max-height: 300px;
      overflow-y: auto;
      background-color: #f8f9fa;
      border-radius: 5px;
      padding: 10px;
      font-size: 12px;
    }

    .score-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 12px;
      color: white;
      font-weight: bold;
      font-size: 0.75rem;
      text-align: center;
    }

    .source-doc {
      font-weight: bold;
      word-break: break-all;
    }

    .source-page {
      font-size: 0.8rem;
      color: #666;
      margin-top: 4px;
    }

    .chunk-content {
      font-size: 0.9rem;
      line-height: 1.4;
    }

    /* Overview Metrics */
    .overview-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      margin-bottom: 20px;
    }

    .metric {
      background-color: #f8f9fa;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .metric-label {
      font-size: 0.9rem;
      color: #6c757d;
      margin-bottom: 5px;
    }

    .metric-value {
      font-size: 1.1rem;
      font-weight: 500;
      word-break: break-all;
    }

  </style>
</head>
<body>
  <div class="container">
    <h1 class="mb-4">Log File Parser</h1>
    
    <div class="card">
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
          <div class="loading"></div> Parsing log data...
        </div>
      </div>
    </div>

    <div id="overview-box" class="card hidden">
      <div class="card-header">
        Overview
      </div>
      <div class="card-body">
        <div id="overview-metrics" class="overview-metrics"></div>
      </div>
    </div>

    <div id="summary-box" class="card hidden">
      <div class="card-header">
        Log Summary
      </div>
      <div class="card-body">
        <div id="summary-content"></div>
      </div>
    </div>

    <div id="execution-box" class="card hidden">
      <div class="card-header">
        Execution Details
      </div>
      <div class="card-body">
        <div id="execution-content"></div>
      </div>
    </div>

    <div id="steps-box" class="card hidden">
      <div class="card-header">
        Step Execution Details
      </div>
      <div class="card-body">
        <div id="steps-content"></div>
      </div>
    </div>

    <div id="tools-box" class="card hidden">
      <div class="card-header">
        Tools Used
      </div>
      <div class="card-body">
        <div id="tools-content"></div>
      </div>
    </div>

    <div id="errors-box" class="card hidden">
      <div class="card-header bg-danger text-white">
        Errors Detected
      </div>
      <div class="card-body">
        <div id="errors-content"></div>
      </div>
    </div>

    <div id="raw-json-box" class="card hidden">
      <div class="card-header">
        Raw JSON Data
      </div>
      <div class="card-body">
        <pre id="raw-json-content" class="json-tree"></pre>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/languages/json.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/languages/python.min.js"></script>
  
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Initialize highlight.js
      hljs.configure({ languages: ['json', 'python'] });
      const logInput = document.getElementById('logInput');
      const logFile = document.getElementById('logFile');
      const parseBtn = document.getElementById('parseBtn');
      const loadingIndicator = document.getElementById('loadingIndicator');
      
      // Handle file upload
      logFile.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            logInput.value = e.target.result;
          };
          reader.readAsText(file);
        }
      });
      
      // Parse button click handler
      parseBtn.addEventListener('click', function() {
        const logData = logInput.value.trim();
        if (!logData) {
          alert('Please paste log data or upload a log file.');
          return;
        }
        
        try {
          loadingIndicator.classList.remove('hidden');
          parseLogData(logData);
        } catch (e) {
          loadingIndicator.classList.add('hidden');
          showError('Failed to parse log data: ' + e.message);
        }
      });
      
      function parseLogData(logData) {
        try {
          console.log("Parsing log data:", logData.substring(0, 100) + "..."); // Log first 100 chars
          const data = JSON.parse(logData);
          console.log("JSON parsed successfully");
          loadingIndicator.classList.add('hidden');
          
          // Parse the log data for better overview display
          console.log("Creating parsed log structure");
          const parsedLog = {
            overview: {
              success: data.Success,
              executionId: data.ExecutionId,
              userId: data.UserId,
              projectId: data.ProjectId,
              duration: data.TimeTrackingData?.duration || 'N/A',
              startedAt: formatTimestamp(data.TimeTrackingData?.startedAt),
              finishedAt: formatTimestamp(data.TimeTrackingData?.finishedAt),
            },
            steps: [],
            errors: [],
          };
          
          // Parse steps
          if (data.StepsExecutionContext) {
            console.log("Parsing " + Object.keys(data.StepsExecutionContext).length + " steps");
            
            for (const stepId in data.StepsExecutionContext) {
              const step = data.StepsExecutionContext[stepId];
              
              const stepInfo = {
                id: step.StepId,
                type: step.StepType,
                success: step.Success,
                duration: step.TimeTrackingData?.duration || 'N/A',
                startedAt: formatTimestamp(step.TimeTrackingData?.startedAt),
                finishedAt: formatTimestamp(step.TimeTrackingData?.finishedAt),
              };
              
              // Add step-specific data
              if (step.StepType === 'InputStep') {
                stepInfo.input = step.Result?.Value || '';
              } else if (step.StepType === 'AIOperation') {
                stepInfo.modelName = step.DebugInformation?.modelDisplayName || step.DebugInformation?.modelName || 'N/A';
                stepInfo.modelProvider = step.DebugInformation?.modelProviderType || 'N/A';
                stepInfo.tokens = {
                  input: step.DebugInformation?.inputTokens || '0',
                  output: step.DebugInformation?.outputTokens || '0',
                  total: step.DebugInformation?.totalTokens || '0',
                };
              } else if (step.StepType === 'DataSearch') {
                console.log("Processing DataSearch step");
                // Parse DataSearch information
                if (step.Result?.Value) {
                  try {
                    const dataSearchResult = JSON.parse(step.Result.Value);
                    if (dataSearchResult.Chunks && Array.isArray(dataSearchResult.Chunks)) {
                      console.log("Found " + dataSearchResult.Chunks.length + " chunks in DataSearch results");
                      // Add DataSearch results to stepInfo
                      stepInfo.dataSearch = {
                        datastoreId: step.Result?.DatastoreId || 'N/A',
                        chunks: dataSearchResult.Chunks.map(function(chunk) {
                          return {
                            score: chunk.Score,
                            documentId: chunk.DocumentId,
                            documentName: chunk.Metadata?.DocumentName || 'N/A',
                            pageNumber: chunk.Metadata?.pageNumber || 'N/A',
                            content: chunk.Chunk,
                            sequenceNumber: chunk.SequenceNumber
                          };
                        })
                      };
                      
                      // Sort chunks by score (highest first)
                      stepInfo.dataSearch.chunks.sort(function(a, b) {
                        return b.score - a.score;
                      });
                    }
                  } catch (e) {
                    console.error("Error parsing DataSearch result:", e);
                    stepInfo.dataSearch = {
                      error: 'Failed to parse data search results: ' + e.message,
                      rawValue: step.Result.Value
                    };
                  }
                }
              }
              
              // Add error information if present
              if (!step.Success && step.ExceptionMessage) {
                stepInfo.error = step.ExceptionMessage;
                parsedLog.errors.push({
                  stepId: step.StepId,
                  stepType: step.StepType,
                  message: step.ExceptionMessage,
                });
              }
              
              parsedLog.steps.push(stepInfo);
            }
            
            // Sort steps by start time
            parsedLog.steps.sort(function(a, b) {
              return new Date(a.startedAt) - new Date(b.startedAt);
            });
          }
          
          console.log("Displaying parsed log data");
          
          // Display the overview section
          displayOverview(parsedLog);
          
          // Display the parsed data
          displaySummary(data);
          displayExecution(data);
          displayStepsExecution(parsedLog.steps);
          displayToolsUsed(data);
          displayErrors(data);
          displayRawJson(data);
          
        } catch (e) {
          console.error("Error parsing log data:", e);
          loadingIndicator.classList.add('hidden');
          showError('Invalid JSON format: ' + e.message);
        }
      }
      
      function displayOverview(parsedLog) {
        const overviewBox = document.getElementById('overview-box');
        const overviewMetrics = document.getElementById('overview-metrics');
        
        // Clear previous content
        overviewMetrics.innerHTML = '';
        
        // Add overview metrics
        for (const [key, value] of Object.entries(parsedLog.overview)) {
          const metric = document.createElement('div');
          metric.className = 'metric';
          
          const label = document.createElement('div');
          label.className = 'metric-label';
          label.textContent = formatLabel(key);
          
          const metricValue = document.createElement('div');
          metricValue.className = 'metric-value';
          if (key === 'success') {
            metricValue.className += value ? ' success-true' : ' success-false';
            metricValue.textContent = value ? '✓ Success' : '✗ Failed';
          } else {
            metricValue.textContent = value;
          }
          
          metric.appendChild(label);
          metric.appendChild(metricValue);
          overviewMetrics.appendChild(metric);
        }
        
        // Add error count if there are errors
        if (parsedLog.errors && parsedLog.errors.length > 0) {
          const metric = document.createElement('div');
          metric.className = 'metric';
          
          const label = document.createElement('div');
          label.className = 'metric-label';
          label.textContent = 'Errors';
          
          const metricValue = document.createElement('div');
          metricValue.className = 'metric-value success-false';
          metricValue.textContent = parsedLog.errors.length;
          
          metric.appendChild(label);
          metric.appendChild(metricValue);
          overviewMetrics.appendChild(metric);
        }
        
        // Add step count
        if (parsedLog.steps && parsedLog.steps.length > 0) {
          const metric = document.createElement('div');
          metric.className = 'metric';
          
          const label = document.createElement('div');
          label.className = 'metric-label';
          label.textContent = 'Total Steps';
          
          const metricValue = document.createElement('div');
          metricValue.className = 'metric-value';
          metricValue.textContent = parsedLog.steps.length;
          
          metric.appendChild(label);
          metric.appendChild(metricValue);
          overviewMetrics.appendChild(metric);
        }
        
        // Show the overview box
        overviewBox.classList.remove('hidden');
      }
      
      function formatLabel(key) {
        return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
      }
      
      function displaySummary(data) {
        const summaryBox = document.getElementById('summary-box');
        const summaryContent = document.getElementById('summary-content');
        
        let html = '<table class="table summary-table">';
        html += '<tr><th>Execution ID</th><td>' + (data.ExecutionId || 'N/A') + '</td></tr>';
        html += '<tr><th>Success</th><td class="success-' + data.Success + '">' + (data.Success ? 'Yes' : 'No') + '</td></tr>';
        
        if (data.TimeTrackingData) {
          html += '<tr><th>Duration</th><td>' + (data.TimeTrackingData.duration || 'N/A') + '</td></tr>';
          html += '<tr><th>Started At</th><td>' + formatTimestamp(data.TimeTrackingData.startedAt) + '</td></tr>';
          html += '<tr><th>Finished At</th><td>' + formatTimestamp(data.TimeTrackingData.finishedAt) + '</td></tr>';
        }
        
        html += '</table>';
        
        summaryContent.innerHTML = html;
        summaryBox.classList.remove('hidden');
      }
      
      function displayExecution(data) {
        const executionBox = document.getElementById('execution-box');
        const executionContent = document.getElementById('execution-content');
        
        if (!data.StepsExecutionContext) {
          executionBox.classList.add('hidden');
          return;
        }
        
        let html = '<div class="mb-3">Total Steps: ' + Object.keys(data.StepsExecutionContext).length + '</div>';
        
        executionContent.innerHTML = html;
        executionBox.classList.remove('hidden');
      }
      
      function displayStepsExecution(steps) {
        const stepsBox = document.getElementById('steps-box');
        const stepsContent = document.getElementById('steps-content');
        
        if (!steps || steps.length === 0) {
          stepsBox.classList.add('hidden');
          return;
        }
        
        let html = '<div class="accordion" id="stepsAccordion">';
        
        steps.forEach(function(step, stepCount) {
          const stepSuccess = step.success !== undefined ? step.success : true;
          const successClass = stepSuccess ? 'success-true' : 'success-false';
          
          html += '<div class="accordion-item">';
          html += '<h2 class="accordion-header" id="heading' + stepCount + '">';
          html += '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse' + stepCount + '" aria-expanded="false" aria-controls="collapse' + stepCount + '">';
          html += 'Step ' + (stepCount + 1) + ': ' + (step.type || 'Unknown') + ' <span class="ms-2 ' + successClass + '">(' + (stepSuccess ? 'Success' : 'Failed') + ')</span>';
          html += '</button></h2>';
          
          html += '<div id="collapse' + stepCount + '" class="accordion-collapse collapse" aria-labelledby="heading' + stepCount + '" data-bs-parent="#stepsAccordion">';
          html += '<div class="accordion-body">';
          
          // Add step details
          html += '<table class="table">';
          html += '<tr><th>Step ID</th><td>' + step.id + '</td></tr>';
          html += '<tr><th>Step Type</th><td>' + (step.type || 'N/A') + '</td></tr>';
          html += '<tr><th>Success</th><td class="' + successClass + '">' + (stepSuccess ? 'Yes' : 'No') + '</td></tr>';
          html += '<tr><th>Duration</th><td>' + (step.duration || 'N/A') + '</td></tr>';
          html += '<tr><th>Started At</th><td>' + step.startedAt + '</td></tr>';
          html += '<tr><th>Finished At</th><td>' + step.finishedAt + '</td></tr>';
          
          if (step.error) {
            html += '<tr><th>Error</th><td class="text-danger">' + step.error + '</td></tr>';
          }
          
          html += '</table>';
          
          // If it's an AI Operation, show more details
          if (step.type === 'AIOperation' && step.modelName) {
            html += '<h5>AI Model Information:</h5>';
            html += '<table class="table">';
            html += '<tr><th>Model Name</th><td>' + step.modelName + '</td></tr>';
            html += '<tr><th>Model Provider</th><td>' + step.modelProvider + '</td></tr>';
            
            if (step.tokens) {
              html += '<tr><th>Input Tokens</th><td>' + step.tokens.input + '</td></tr>';
              html += '<tr><th>Output Tokens</th><td>' + step.tokens.output + '</td></tr>';
              html += '<tr><th>Total Tokens</th><td>' + step.tokens.total + '</td></tr>';
            }
            
            html += '</table>';
          }

          // Handle Input Step
          if (step.type === 'InputStep' && step.input) {
            html += '<div class="mt-3">';
            html += '<h5>Input:</h5>';
            html += '<div class="alert alert-secondary">' + step.input + '</div>';
            html += '</div>';
          }
          
          // Handle Python Step - Not using from original since our step structure is different
          if (step.type === 'PythonStep') {
            html += '<div class="python-step-container">';
            html += '<h5>Python Step Execution:</h5>';
            // Add Python step specific content if needed
            html += '</div>';
          }
          
          // Handle DataSearch Step
          if (step.type === 'DataSearch' && step.dataSearch) {
            console.log("Rendering DataSearch step UI");
            html += '<div class="datasearch-container">';
            html += '<h5>Data Search Results:</h5>';
            
            // Show datastore ID
            if (step.dataSearch.datastoreId) {
              html += '<div><strong>Datastore ID:</strong> ' + step.dataSearch.datastoreId + '</div>';
            }
            
            // Show search error if present
            if (step.dataSearch.error) {
              html += '<div class="alert alert-danger mt-2">' + step.dataSearch.error + '</div>';
              if (step.dataSearch.rawValue) {
                html += '<div><strong>Raw Response:</strong></div>';
                html += '<div class="datasearch-raw"><pre>' + step.dataSearch.rawValue + '</pre></div>';
              }
            } else {
              // Display chunks
              if (step.dataSearch.chunks && step.dataSearch.chunks.length > 0) {
                // Summary 
                html += '<div class="mt-2 mb-2"><strong>Found ' + step.dataSearch.chunks.length + ' chunks from the knowledge base</strong></div>';
                
                // Create a table for results
                html += '<div class="table-responsive">';
                html += '<table class="table table-sm table-bordered datasearch-results">';
                html += '<thead class="table-light">';
                html += '<tr>';
                html += '<th style="width: 80px;">Score</th>';
                html += '<th style="width: 250px;">Source</th>';
                html += '<th>Content</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';
                
                // Add each chunk as a row
                step.dataSearch.chunks.forEach(function(chunk, index) {
                  const rowClass = chunk.score > 0.5 ? 'table-success' : ''; // Highlight high-scoring chunks
                  
                  html += '<tr class="' + rowClass + '">';
                  
                  // Score cell
                  html += '<td>';
                  if (chunk.score) {
                    const scorePercent = Math.round(chunk.score * 100);
                    html += '<div class="score-badge" style="background-color: ' + getScoreColor(chunk.score) + ';">' + scorePercent + '%</div>';
                  } else {
                    html += 'N/A';
                  }
                  html += '</td>';
                  
                  // Source cell
                  html += '<td>';
                  html += '<div class="source-doc">' + (chunk.documentName || 'Unknown') + '</div>';
                  if (chunk.pageNumber && chunk.pageNumber !== 'N/A') {
                    html += '<div class="source-page">Page ' + chunk.pageNumber + '</div>';
                  }
                  html += '</td>';
                  
                  // Content cell
                  html += '<td>';
                  html += '<div class="chunk-content">' + formatChunkContent(chunk.content) + '</div>';
                  html += '</td>';
                  
                  html += '</tr>';
                });
                
                html += '</tbody>';
                html += '</table>';
                html += '</div>';
              } else {
                html += '<div class="alert alert-warning">No search results found</div>';
              }
            }
            
            html += '</div>';
          }
          
          html += '</div></div></div>';
        });
        
        html += '</div>';
        
        stepsContent.innerHTML = html;
        stepsBox.classList.remove('hidden');
      }
      
      function handlePythonStep(step) {
        let html = '<div class="python-step-container">';
        html += '<h5>Python Step Execution:</h5>';
        
        // If we have input data, display it
        if (step.Input && step.Input.length > 0) {
          const inputData = step.Input[0];
          if (inputData && inputData.Value) {
            html += '<div><strong>Input:</strong></div>';
            html += '<div class="python-code">' + inputData.Value + '</div>';
          }
        }
        
        // If we have result data, display it
        if (step.Result && step.Result.Value) {
          html += '<div><strong>Output:</strong></div>';
          html += '<div class="python-output">';
          
          // Try to parse the JSON for better formatting
          try {
            const outputObj = JSON.parse(step.Result.Value);
            html += '<pre>' + JSON.stringify(outputObj, null, 2) + '</pre>';
          } catch (e) {
            // If not valid JSON, just display as-is
            html += '<pre>' + step.Result.Value + '</pre>';
          }
          
          html += '</div>';
        }
        
        html += '</div>';
        return html;
      }
      
      function handleDataSearchStep(step) {
        let html = '<div class="datasearch-container">';
        html += '<h5>Data Search Results:</h5>';
        
        // Show datastore ID
        if (step.dataSearch.datastoreId) {
          html += '<div><strong>Datastore ID:</strong> ' + step.dataSearch.datastoreId + '</div>';
        }
        
        // Show search error if present
        if (step.dataSearch.error) {
          html += '<div class="alert alert-danger mt-2">' + step.dataSearch.error + '</div>';
          if (step.dataSearch.rawValue) {
            html += '<div><strong>Raw Response:</strong></div>';
            html += '<div class="datasearch-raw"><pre>' + step.dataSearch.rawValue + '</pre></div>';
          }
          return html + '</div>';
        }
        
        // Display chunks
        if (step.dataSearch.chunks && step.dataSearch.chunks.length > 0) {
          // Summary 
          html += '<div class="mt-2 mb-2"><strong>Found ' + step.dataSearch.chunks.length + ' chunks from the knowledge base</strong></div>';
          
          // Create a table for results
          html += '<div class="table-responsive">';
          html += '<table class="table table-sm table-bordered datasearch-results">';
          html += '<thead class="table-light">';
          html += '<tr>';
          html += '<th style="width: 80px;">Score</th>';
          html += '<th style="width: 250px;">Source</th>';
          html += '<th>Content</th>';
          html += '</tr>';
          html += '</thead>';
          html += '<tbody>';
          
          // Add each chunk as a row
          step.dataSearch.chunks.forEach(function(chunk, index) {
            const rowClass = chunk.score > 0.5 ? 'table-success' : ''; // Highlight high-scoring chunks
            
            html += '<tr class="' + rowClass + '">';
            
            // Score cell
            html += '<td>';
            if (chunk.score) {
              const scorePercent = Math.round(chunk.score * 100);
              html += '<div class="score-badge" style="background-color: ' + getScoreColor(chunk.score) + ';">' + scorePercent + '%</div>';
            } else {
              html += 'N/A';
            }
            html += '</td>';
            
            // Source cell
            html += '<td>';
            html += '<div class="source-doc">' + (chunk.documentName || 'Unknown') + '</div>';
            if (chunk.pageNumber && chunk.pageNumber !== 'N/A') {
              html += '<div class="source-page">Page ' + chunk.pageNumber + '</div>';
            }
            html += '</td>';
            
            // Content cell
            html += '<td>';
            html += '<div class="chunk-content">' + formatChunkContent(chunk.content) + '</div>';
            html += '</td>';
            
            html += '</tr>';
          });
          
          html += '</tbody>';
          html += '</table>';
          html += '</div>';
        } else {
          html += '<div class="alert alert-warning">No search results found</div>';
        }
        
        html += '</div>';
        return html;
      }
      
      function formatChunkContent(content) {
        if (!content) return 'Empty content';
        // Convert line breaks to <br>
        content = content.toString();
        // First replace literal '\n' with <br>
        content = content.split('\\n').join('<br>');
        // Then replace actual line breaks with <br>
        content = content.split('\n').join('<br>');
        return content;
      }
      
      function getScoreColor(score) {
        // Return a color based on score (0-1)
        if (score > 0.8) return '#28a745'; // Green
        if (score > 0.5) return '#17a2b8'; // Teal
        if (score > 0.3) return '#ffc107'; // Yellow
        return '#dc3545'; // Red
      }
      
      function displayToolsUsed(data) {
        const toolsBox = document.getElementById('tools-box');
        const toolsContent = document.getElementById('tools-content');
        
        let tools = [];
        
        // Collect all tools
        if (data.StepsExecutionContext) {
          for (const stepId in data.StepsExecutionContext) {
            const step = data.StepsExecutionContext[stepId];
            if (step.DebugInformation && Array.isArray(step.DebugInformation.tools)) {
              // Add step ID to each tool for reference
              step.DebugInformation.tools.forEach(tool => {
                tool.sourceStepId = stepId;
              });
              tools = tools.concat(step.DebugInformation.tools);
            }
          }
        }
        
        if (tools.length === 0) {
          toolsBox.classList.add('hidden');
          return;
        }
        
        let html = '<div class="table-responsive">';
        html += '<table class="table table-striped">';
        html += '<thead><tr><th>Tool Name</th><th>Status</th><th>Request Method</th><th>Duration</th><th>Details</th></tr></thead>';
        html += '<tbody>';
        
        tools.forEach((tool, index) => {
          const rowClass = 'tool-row';
          html += '<tr class="' + rowClass + '">';
          html += '<td>' + (tool.ToolName || 'N/A') + '</td>';
          html += '<td>' + (tool.ResponseStatusCode ? tool.ResponseStatusCode : 'N/A') + '</td>';
          html += '<td>' + (tool.RequestMethod || 'N/A') + '</td>';
          html += '<td>' + (tool.DurationMilliseconds ? (tool.DurationMilliseconds + ' ms') : 'N/A') + '</td>';
          html += '<td><button class="btn btn-sm btn-outline-primary tool-details-btn" data-tool-index="' + index + '">View Details</button></td>';
          html += '</tr>';
        });
        
        html += '</tbody></table></div>';
        
        // Add a container for tool details modals
        html += '<div id="tool-modals-container"></div>';
        
        toolsContent.innerHTML = html;
        toolsBox.classList.remove('hidden');
        
        // Add event listeners to the buttons after they're added to the DOM
        document.querySelectorAll('.tool-details-btn').forEach((btn, index) => {
          btn.addEventListener('click', () => {
            showToolDetailsModal(tools[index], index);
          });
        });
      }
      
      function showToolDetailsModal(tool, index) {
        // Create modal HTML
        let modalHtml = '<div class="modal fade" id="toolModal' + index + '" tabindex="-1" aria-labelledby="toolModalLabel' + index + '" aria-hidden="true">';
        modalHtml += '<div class="modal-dialog modal-lg modal-dialog-scrollable">';
        modalHtml += '<div class="modal-content">';
        modalHtml += '<div class="modal-header">';
        modalHtml += '<h5 class="modal-title" id="toolModalLabel' + index + '">' + (tool.ToolName || 'Tool Details') + '</h5>';
        modalHtml += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
        modalHtml += '</div>';
        modalHtml += '<div class="modal-body">';
        
        // Tool details table
        modalHtml += '<table class="table">';
        modalHtml += '<tr><th>Tool Name</th><td>' + (tool.ToolName || 'N/A') + '</td></tr>';
        modalHtml += '<tr><th>Source Step ID</th><td>' + (tool.sourceStepId || 'N/A') + '</td></tr>';
        modalHtml += '<tr><th>Request Method</th><td>' + (tool.RequestMethod || 'N/A') + '</td></tr>';
        modalHtml += '<tr><th>Request URL</th><td>' + (tool.RequestUrl || 'N/A') + '</td></tr>';
        modalHtml += '<tr><th>Response Status</th><td>' + (tool.ResponseStatusCode || 'N/A') + '</td></tr>';
        modalHtml += '<tr><th>Duration</th><td>' + (tool.DurationMilliseconds ? (tool.DurationMilliseconds + ' ms') : 'N/A') + '</td></tr>';
        modalHtml += '<tr><th>Bytes Sent</th><td>' + (tool.TotalBytesSent || 'N/A') + '</td></tr>';
        modalHtml += '<tr><th>Bytes Received</th><td>' + (tool.TotalBytesReceived || 'N/A') + '</td></tr>';
        
        if (tool.ErrorMessage) {
          modalHtml += '<tr><th>Error</th><td class="text-danger">' + tool.ErrorMessage + '</td></tr>';
        }
        
        modalHtml += '</table>';
        
        // Tool parameters
        if (tool.ToolParameters && Object.keys(tool.ToolParameters).length > 0) {
          modalHtml += '<h6>Tool Parameters:</h6>';
          modalHtml += '<pre class="json-tree">' + JSON.stringify(tool.ToolParameters, null, 2) + '</pre>';
        }
        
        // Request/Response content (if available)
        if (tool.RequestContent) {
          modalHtml += '<h6>Request Content:</h6>';
          try {
            const requestContent = JSON.parse(tool.RequestContent);
            modalHtml += '<pre class="json-tree">' + JSON.stringify(requestContent, null, 2) + '</pre>';
          } catch (e) {
            modalHtml += '<pre class="json-tree">' + tool.RequestContent + '</pre>';
          }
        }
        
        if (tool.ResponseContent) {
          modalHtml += '<h6>Response Content:</h6>';
          try {
            const responseContent = JSON.parse(tool.ResponseContent);
            modalHtml += '<pre class="json-tree">' + JSON.stringify(responseContent, null, 2) + '</pre>';
          } catch (e) {
            modalHtml += '<pre class="json-tree">' + tool.ResponseContent + '</pre>';
          }
        }
        
        modalHtml += '</div>';
        modalHtml += '<div class="modal-footer">';
        modalHtml += '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>';
        modalHtml += '</div>';
        modalHtml += '</div>';
        modalHtml += '</div>';
        modalHtml += '</div>';
        
        // Add the modal to the container
        document.getElementById('tool-modals-container').innerHTML = modalHtml;
        
        // Initialize and show the modal
        const modalElement = document.getElementById('toolModal' + index);
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        // Highlight JSON in the modal
        modalElement.querySelectorAll('pre.json-tree').forEach(pre => {
          try {
            hljs.highlightElement(pre);
          } catch (e) {
            console.error('Error highlighting JSON:', e);
          }
        });
      }
      
      function displayErrors(data) {
        const errorsBox = document.getElementById('errors-box');
        const errorsContent = document.getElementById('errors-content');
        
        let errors = [];
        
        // Collect errors from steps
        if (data.StepsExecutionContext) {
          for (const stepId in data.StepsExecutionContext) {
            const step = data.StepsExecutionContext[stepId];
            if (!step.Success && step.ExceptionMessage) {
              errors.push({
                stepId: step.StepId,
                stepType: step.StepType,
                message: step.ExceptionMessage
              });
            }
          }
        }
        
        if (errors.length === 0) {
          errorsBox.classList.add('hidden');
          return;
        }
        
        let html = '<div class="alert alert-danger">Found ' + errors.length + ' error(s) during execution.</div>';
        html += '<div class="list-group">';
        
        errors.forEach(error => {
          html += '<div class="list-group-item">';
          html += '<h5 class="mb-1">Error in Step ' + error.stepId + ' (' + error.stepType + ')</h5>';
          html += '<p class="mb-1">' + error.message + '</p>';
          html += '</div>';
        });
        
        html += '</div>';
        
        errorsContent.innerHTML = html;
        errorsBox.classList.remove('hidden');
      }
      
      function displayRawJson(data) {
        const rawJsonBox = document.getElementById('raw-json-box');
        const rawJsonContent = document.getElementById('raw-json-content');
        
        const formattedJson = JSON.stringify(data, null, 2);
        rawJsonContent.textContent = formattedJson;
        
        // Highlight the JSON
        hljs.highlightElement(rawJsonContent);
        
        rawJsonBox.classList.remove('hidden');
      }
      
      function formatTimestamp(timestamp) {
        if (!timestamp) return 'N/A';
        
        try {
          const date = new Date(timestamp);
          return date.toLocaleString();
        } catch (e) {
          return timestamp;
        }
      }
      
      function showError(message) {
        console.error("Error:", message);
        alert(message);
      }
      // We're not using this anymore - all parsing is done inline in parseLogData
      function parseLogFile(data) {
        return data;
      }
    });
  </script>
</body>
</html>`;
}