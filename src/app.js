document.addEventListener('DOMContentLoaded', () => {
  const jsonInput = document.getElementById('jsonInput');
  const parseBtn = document.getElementById('parseBtn');
  const loadSampleBtn = document.getElementById('loadSampleBtn');
  const resultsDiv = document.getElementById('results');
  const overviewMetricsDiv = document.getElementById('overview-metrics');
  const stepsListDiv = document.getElementById('steps-list');
  const processedJsonPre = document.getElementById('processedJson');
  const errorSummaryDiv = document.getElementById('error-summary');
  const errorsSection = document.getElementById('errors-section');
  const expandAllBtn = document.getElementById('expandAllBtn');
  const copyJsonBtn = document.getElementById('copyJsonBtn');
  
  let allExpanded = false;
  let parsedResult = null;
  
  // Load sample log
  loadSampleBtn.addEventListener('click', () => {
    // This is the sample log from your example
    const sampleLog = `{
"Success": false,
"ExecutionId": "b1cab48c-9c31-486b-9ec9-382a07b60b0d",
"UserId": "0193acf8-5b27-7bdd-8a9e-461c8e5adea3",
"TimeTrackingData": {
    "duration": "00:00:00.2122681",
    "startedAt": "2025-02-26T16:34:39.2689906Z",
    "finishedAt": "2025-02-26T16:34:39.5840405Z"
},
"StepsExecutionContext": {
    "e5208eab-c730-4609-92d0-ba617a396424": {
        "StepId": "e5208eab-c730-4609-92d0-ba617a396424",
        "StepType": "InputStep",
        "DebugInformation": {
            "streamed": false
        },
        "TimeTrackingData": {
            "duration": "00:00:00.0000046",
            "startedAt": "2025-02-26T16:34:39.3719081Z",
            "finishedAt": "2025-02-26T16:34:39.3719108Z"
        },
        "Input": [],
        "Result": {
            "$type": "input",
            "Value": "what are the columns in the spreadsheet",
            "StepId": "e5208eab-c730-4609-92d0-ba617a396424",
            "StepType": "InputStep"
        },
        "Success": true
    },
    "83ccaae5-60d2-47cd-88cf-259d8da85921": {
        "StepId": "83ccaae5-60d2-47cd-88cf-259d8da85921",
        "StepType": "AIOperation",
        "DebugInformation": {
            "messages": [],
            "modelName": "chatgpt-4o-latest",
            "modelDisplayName": "ChatGPT 4o",
            "modelId": "f800c54c-f0dc-4d0e-b6df-479079f1e8cf",
            "inputTokens": "0",
            "outputTokens": "0",
            "totalTokens": "0",
            "modelProviderType": "OpenAI",
            "streamed": false,
            "tools": [],
            "apiKeyName": "OpenAI",
            "modelCallDuration": "00:00:00",
            "policyExecutionDuration": "00:00:00"
        },
        "TimeTrackingData": {
            "duration": "00:00:00.1958958",
            "startedAt": "2025-02-26T16:34:39.371919Z",
            "finishedAt": "2025-02-26T16:34:39.567814Z"
        },
        "Input": [
            {
                "$type": "input",
                "Value": "what are the columns in the spreadsheet",
                "StepId": "e5208eab-c730-4609-92d0-ba617a396424",
                "StepType": "InputStep"
            }
        ],
        "Result": {
            "$type": "string",
            "Value": null,
            "StepId": "83ccaae5-60d2-47cd-88cf-259d8da85921",
            "StepType": "AIOperation"
        },
        "Success": false,
        "ExceptionMessage": "Failed to process image from source: https://airiaimagesprod.blob.core.windows.net/airia-default/4d72ca11-41f7-418d-bcef-4e19e8d07ba3?sv=2025-01-05&spr=https&st=2025-02-26T16%3A34%3A30Z&se=2025-02-27T16%3A34%3A30Z&sr=b&sp=r&sig=kLvWYUpfmDhdvByJ6DTvgwyGn%2FHiaP1G%2F60wfyJQhd4%3D. Failed to resize and convert image to base64"
    },
    "66abf4d8-993a-4c7b-a2ff-e3f262a8b739": {
        "StepId": "66abf4d8-993a-4c7b-a2ff-e3f262a8b739",
        "StepType": "OutputStep",
        "DebugInformation": {
            "streamed": false
        },
        "TimeTrackingData": {
            "duration": "00:00:00.0000073",
            "startedAt": "2025-02-26T16:34:39.5678414Z",
            "finishedAt": "2025-02-26T16:34:39.5678443Z"
        },
        "Input": [
            {
                "$type": "string",
                "Value": null,
                "StepId": "83ccaae5-60d2-47cd-88cf-259d8da85921",
                "StepType": "AIOperation"
            }
        ],
        "Success": true
    }
},
"ProjectId": "01944c9b-5ad7-75d8-988b-bb7990776f6a"
}`;
    
    jsonInput.value = sampleLog;
  });
  
  // Parse the log file
  parseBtn.addEventListener('click', async () => {
    const jsonText = jsonInput.value.trim();
    if (!jsonText) {
      alert('Please enter a JSON log file');
      return;
    }
    
    try {
      // Send log data to server for parsing
      const response = await fetch('/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonText
      });
      
      if (!response.ok) {
        throw new Error('Failed to parse log file');
      }
      
      parsedResult = await response.json();
      
      // Display results
      displayResults(parsedResult);
      resultsDiv.style.display = 'block';
      
      // Scroll to results
      resultsDiv.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      alert('Failed to parse JSON: ' + error.message);
    }
  });
  
  // Toggle expand/collapse all steps
  expandAllBtn.addEventListener('click', () => {
    const stepBodies = document.querySelectorAll('.step-body');
    allExpanded = !allExpanded;
    
    stepBodies.forEach(body => {
      if (allExpanded) {
        body.classList.add('active');
      } else {
        body.classList.remove('active');
      }
    });
    
    expandAllBtn.textContent = allExpanded ? 'Collapse All' : 'Expand All';
  });
  
  // Copy processed JSON
  copyJsonBtn.addEventListener('click', () => {
    if (parsedResult) {
      navigator.clipboard.writeText(JSON.stringify(parsedResult, null, 2))
        .then(() => {
          const originalText = copyJsonBtn.textContent;
          copyJsonBtn.textContent
          copyJsonBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyJsonBtn.textContent = originalText;
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  });
  
  function displayResults(data) {
    // Display overview metrics
    overviewMetricsDiv.innerHTML = '';
    for (const [key, value] of Object.entries(data.overview)) {
      overviewMetricsDiv.innerHTML += `
        <div class="metric">
          <div class="metric-label">${formatLabel(key)}</div>
          <div class="metric-value ${key === 'success' ? (value ? 'success' : 'error') : ''}">${value === true ? '✓' : value === false ? '✗' : value}</div>
        </div>
      `;
    }
    
    // Display errors if any
    if (data.errors && data.errors.length > 0) {
      errorsSection.style.display = 'block';
      errorSummaryDiv.innerHTML = `
        <h3>Execution Errors (${data.errors.length})</h3>
        <ul>
          ${data.errors.map(error => `
            <li>
              <strong>${error.stepType} (${error.stepId.substring(0, 8)}...):</strong>
              <div>${error.message}</div>
            </li>
          `).join('')}
        </ul>
      `;
    } else {
      errorsSection.style.display = 'none';
    }
    
    // Display steps
    stepsListDiv.innerHTML = '';
    data.steps.forEach((step, index) => {
      const stepHtml = `
        <div class="step" data-step-id="${step.id}">
          <div class="step-header" onclick="toggleStep(this)">
            <div>
              <span class="step-type">${step.type}</span>
              <span class="step-id">ID: ${step.id.substring(0, 8)}...</span>
            </div>
            <div class="${step.success ? 'success' : 'error'}">
              ${step.success ? '✓ Success' : '✗ Failed'}
            </div>
          </div>
          <div class="step-body">
            <div class="detail-row">
              <div class="detail-label">Step ID:</div>
              <div class="detail-value">${step.id}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Type:</div>
              <div class="detail-value">${step.type}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Duration:</div>
              <div class="detail-value">${step.duration}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Started:</div>
              <div class="detail-value">${step.startedAt}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Finished:</div>
              <div class="detail-value">${step.finishedAt}</div>
            </div>
            ${step.type === 'InputStep' ? `
              <div class="detail-row">
                <div class="detail-label">Input:</div>
                <div class="detail-value">${step.input || 'N/A'}</div>
              </div>
            ` : ''}
            ${step.type === 'AIOperation' ? `
              <div class="detail-row">
                <div class="detail-label">Model:</div>
                <div class="detail-value">${step.modelName}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Provider:</div>
                <div class="detail-value">${step.modelProvider}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Tokens:</div>
                <div class="detail-value">Input: ${step.tokens.input}, Output: ${step.tokens.output}, Total: ${step.tokens.total}</div>
              </div>
            ` : ''}
            ${step.error ? `
              <div class="detail-row">
                <div class="detail-label">Error:</div>
                <div class="detail-value error">${step.error}</div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
      
      stepsListDiv.innerHTML += stepHtml;
    });
    
    // Display processed JSON
    processedJsonPre.textContent = JSON.stringify(data, null, 2);
  }
  
  function formatLabel(key) {
    return key.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }
  
  // Expose toggleStep to global scope
  window.toggleStep = function(element) {
    const stepBody = element.nextElementSibling;
    stepBody.classList.toggle('active');
  };
});