// Modified client-side code that correctly handles router steps
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
      
      // Send the log data to our custom parser
      fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: logData
      })
      .then(response => response.json())
      .then(parsedData => {
        loadingIndicator.classList.add('hidden');
        
        // Display the overview section
        displayOverview(parsedData);
        
        // Display the summary
        displaySummary(parsedData);
        
        // Display all steps execution
        displayStepsExecution(parsedData.steps);
        
        // Display raw JSON for debugging
        displayRawJson(parsedData);
      })
      .catch(error => {
        loadingIndicator.classList.add('hidden');
        console.error("Error parsing log data:", error);
        showError('Failed to parse log data: ' + error.message);
      });
      
    } catch (e) {
      loadingIndicator.classList.add('hidden');
      showError('Failed to parse log data: ' + e.message);
    }
  });
  
  function displayOverview(parsedData) {
    const overviewBox = document.getElementById('overview-box');
    const overviewMetrics = document.getElementById('overview-metrics');
    
    // Clear previous content
    overviewMetrics.innerHTML = '';
    
    // Add overview metrics
    for (const [key, value] of Object.entries(parsedData.overview)) {
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
    if (parsedData.errors && parsedData.errors.length > 0) {
      const metric = document.createElement('div');
      metric.className = 'metric';
      
      const label = document.createElement('div');
      label.className = 'metric-label';
      label.textContent = 'Errors';
      
      const metricValue = document.createElement('div');
      metricValue.className = 'metric-value success-false';
      metricValue.textContent = parsedData.errors.length;
      
      metric.appendChild(label);
      metric.appendChild(metricValue);
      overviewMetrics.appendChild(metric);
    }
    
    // Add step count
    if (parsedData.steps && parsedData.steps.length > 0) {
      const metric = document.createElement('div');
      metric.className = 'metric';
      
      const label = document.createElement('div');
      label.className = 'metric-label';
      label.textContent = 'Total Steps';
      
      const metricValue = document.createElement('div');
      metricValue.className = 'metric-value';
      metricValue.textContent = parsedData.steps.length;
      
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
  
  function displaySummary(parsedData) {
    const summaryBox = document.getElementById('summary-box');
    const summaryContent = document.getElementById('summary-content');
    
    if (!parsedData.summary) {
      summaryBox.classList.add('hidden');
      return;
    }
    
    let html = '<div class="card mb-3">';
    html += '<div class="card-header">User Input</div>';
    html += '<div class="card-body">';
    html += '<div class="alert alert-secondary">' + parsedData.summary.userInput + '</div>';
    html += '</div></div>';
    
    html += '<div class="card">';
    html += '<div class="card-header">Final Output</div>';
    html += '<div class="card-body">';
    html += '<div class="alert alert-info">' + parsedData.summary.finalOutput + '</div>';
    html += '</div></div>';
    
    summaryContent.innerHTML = html;
    summaryBox.classList.remove('hidden');
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
      
      html += '<div class="accordion-item" data-step-id="' + step.id + '" data-step-type="' + step.type + '">';
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
      
      // If it's a Router step, show more details
      if (step.type === 'RouterStep') {
        html += '<h5>Router Information:</h5>';
        html += '<table class="table">';
        
        // Model info if available
        if (step.modelName) {
          html += '<tr><th>Model Name</th><td>' + step.modelName + '</td></tr>';
          html += '<tr><th>Model Provider</th><td>' + step.modelProvider + '</td></tr>';
        }
        
        // Token info if available
        if (step.tokens) {
          html += '<tr><th>Input Tokens</th><td>' + step.tokens.input + '</td></tr>';
          html += '<tr><th>Output Tokens</th><td>' + step.tokens.output + '</td></tr>';
          html += '<tr><th>Total Tokens</th><td>' + step.tokens.total + '</td></tr>';
        }
        
        // Route decision if available
        if (step.routeDecision) {
          html += '<tr><th>Route Decision</th><td>';
          if (typeof step.routeDecision === 'string') {
            html += step.routeDecision;
          } else {
            html += '<pre>' + JSON.stringify(step.routeDecision, null, 2) + '</pre>';
          }
          html += '</td></tr>';
        }
        
        // Branch IDs if available
        if (step.branchIds && step.branchIds.length > 0) {
          html += '<tr><th>Branch IDs</th><td>';
          html += '<ul>';
          step.branchIds.forEach(id => {
            html += '<li>' + id + '</li>';
          });
          html += '</ul>';
          html += '</td></tr>';
        }
        
        html += '</table>';
      }
      
      // If it's an AI Operation, show more details
      else if (step.type === 'AIOperation' && step.modelName) {
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
      
      // Show input for all steps
      if (step.input) {
        html += '<div class="mt-3">';
        html += '<h5>Input:</h5>';
        if (typeof step.input === 'string') {
          html += '<div class="alert alert-secondary">' + step.input + '</div>';
        } else if (Array.isArray(step.input)) {
          html += '<ol class="alert alert-secondary">';
          step.input.forEach(item => {
            html += '<li>' + (typeof item === 'string' ? item : JSON.stringify(item)) + '</li>';
          });
          html += '</ol>';
        } else {
          html += '<div class="alert alert-secondary"><pre>' + JSON.stringify(step.input, null, 2) + '</pre></div>';
        }
        html += '</div>';
      }
      
      // Show output for all steps
      if (step.output || step.response) {
        const output = step.output || step.response;
        html += '<div class="mt-3">';
        html += '<h5>Output:</h5>';
        if (typeof output === 'string') {
          html += '<div class="alert alert-info">' + output + '</div>';
        } else if (Array.isArray(output)) {
          html += '<ol class="alert alert-info">';
          output.forEach(item => {
            html += '<li>' + (typeof item === 'string' ? item : JSON.stringify(item)) + '</li>';
          });
          html += '</ol>';
        } else {
          html += '<div class="alert alert-info"><pre>' + JSON.stringify(output, null, 2) + '</pre></div>';
        }
        html += '</div>';
      }
      
      html += '</div></div></div>';
    });
    
    html += '</div>';
    
    stepsContent.innerHTML = html;
    stepsBox.classList.remove('hidden');
    
    // Add event listener for expand all button
    const expandAllBtn = document.querySelector('#expandAllBtn');
    if (expandAllBtn) {
      expandAllBtn.addEventListener('click', function() {
        document.querySelectorAll('.accordion-button.collapsed').forEach(button => {
          button.click();
        });
      });
    }
  }
  
  function displayRawJson(data) {
    const rawJsonBox = document.getElementById('raw-json-box');
    const rawJsonContent = document.getElementById('raw-json-content');
    
    if (!rawJsonBox || !rawJsonContent) return;
    
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
});