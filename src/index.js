/**
 * Agent Execution Log Parser
 * A Cloudflare Worker for parsing and visualizing execution logs
 * GitHub: https://github.com/davidpacold/agent-execution-log-parser
 */
addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
	const url = new URL(request.url);
	
	// Serve HTML for root path
	if (url.pathname === '/') {
	  return new Response(generateHTML(), {
		headers: {
		  'Content-Type': 'text/html;charset=UTF-8',
		},
	  });
	}
	
	// Handle API requests
	if (url.pathname === '/parse' && request.method === 'POST') {
	  try {
		const requestData = await request.json();
		const parsedData = parseLogFile(requestData);
		return new Response(JSON.stringify(parsedData), {
		  headers: {
			'Content-Type': 'application/json',
		  },
		});
	  } catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to parse log file' }), {
		  status: 400,
		  headers: {
			'Content-Type': 'application/json',
		  },
		});
	  }
	}
	
	// Return 404 for any other path
	return new Response('Not Found', { status: 404 });
  }
  
  function parseLogFile(logData) {
	const result = {
	  overview: {
		success: logData.Success,
		executionId: logData.ExecutionId,
		userId: logData.UserId,
		projectId: logData.ProjectId,
		duration: logData.TimeTrackingData?.duration || 'N/A',
		startedAt: formatDateTime(logData.TimeTrackingData?.startedAt),
		finishedAt: formatDateTime(logData.TimeTrackingData?.finishedAt),
	  },
	  steps: [],
	  errors: [],
	};
	
	// Parse steps
	if (logData.StepsExecutionContext) {
	  for (const stepId in logData.StepsExecutionContext) {
		const step = logData.StepsExecutionContext[stepId];
		
		const stepInfo = {
		  id: step.StepId,
		  type: step.StepType,
		  success: step.Success,
		  duration: step.TimeTrackingData?.duration || 'N/A',
		  startedAt: formatDateTime(step.TimeTrackingData?.startedAt),
		  finishedAt: formatDateTime(step.TimeTrackingData?.finishedAt),
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
		}
		
		// Add error information if present
		if (!step.Success && step.ExceptionMessage) {
		  stepInfo.error = step.ExceptionMessage;
		  result.errors.push({
			stepId: step.StepId,
			stepType: step.StepType,
			message: step.ExceptionMessage,
		  });
		}
		
		result.steps.push(stepInfo);
	  }
	  
	  // Sort steps by start time
	  result.steps.sort((a, b) => {
		return new Date(a.startedAt) - new Date(b.startedAt);
	  });
	}
	
	return result;
  }
  
  function formatDateTime(dateTimeStr) {
	if (!dateTimeStr) return 'N/A';
	try {
	  const date = new Date(dateTimeStr);
	  return date.toLocaleString();
	} catch (e) {
	  return dateTimeStr;
	}
  }
  
  function generateHTML() {
	return `<!DOCTYPE html>
  <html lang="en">
  <head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Log File Parser</title>
	<style>
	  :root {
		--primary-color: #2563eb;
		--primary-hover: #1d4ed8;
		--success-color: #10b981;
		--error-color: #ef4444;
		--warning-color: #f59e0b;
		--background: #f9fafb;
		--card-bg: #ffffff;
		--text-color: #1f2937;
		--text-secondary: #6b7280;
		--border-color: #e5e7eb;
	  }
	  
	  body {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
		line-height: 1.6;
		color: var(--text-color);
		background-color: var(--background);
		margin: 0;
		padding: 0;
	  }
	  
	  .container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	  }
	  
	  header {
		text-align: center;
		margin-bottom: 2rem;
	  }
	  
	  h1 {
		margin-bottom: 0.5rem;
		color: var(--primary-color);
	  }
	  
	  .description {
		color: var(--text-secondary);
		max-width: 600px;
		margin: 0 auto 2rem auto;
	  }
	  
	  .card {
		background-color: var(--card-bg);
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	  }
	  
	  textarea {
		width: 100%;
		min-height: 200px;
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		font-family: monospace;
		resize: vertical;
	  }
	  
	  button {
		background-color: var(--primary-color);
		color: white;
		font-weight: 600;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: background-color 0.2s;
	  }
	  
	  button:hover {
		background-color: var(--primary-hover);
	  }
	  
	  #results {
		display: none;
	  }
	  
	  .overview {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
		margin-bottom: 1rem;
	  }
	  
	  .metric {
		padding: 0.75rem;
		border-radius: 0.375rem;
		background-color: #f3f4f6;
	  }
	  
	  .metric-label {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin-bottom: 0.25rem;
	  }
	  
	  .metric-value {
		font-weight: 600;
		font-size: 1.125rem;
		word-break: break-all;
	  }
	  
	  .steps-container {
		margin-top: 1.5rem;
	  }
	  
	  .step {
		border: 1px solid var(--border-color);
		border-radius: 0.375rem;
		margin-bottom: 1rem;
		overflow: hidden;
	  }
	  
	  .step-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background-color: #f3f4f6;
		cursor: pointer;
	  }
	  
	  .step-body {
		padding: 1rem;
		display: none;
	  }
	  
	  .step-body.active {
		display: block;
	  }
	  
	  .step-type {
		font-weight: 600;
	  }
	  
	  .step-id {
		font-size: 0.875rem;
		color: var(--text-secondary);
	  }
	  
	  .detail-row {
		display: flex;
		margin-bottom: 0.5rem;
	  }
	  
	  .detail-label {
		flex: 0 0 150px;
		font-weight: 500;
	  }
	  
	  .detail-value {
		flex: 1;
		word-break: break-all;
	  }
	  
	  .success {
		color: var(--success-color);
	  }
	  
	  .error {
		color: var(--error-color);
	  }
	  
	  .sample-container {
		margin-top: 1rem;
	  }
	  
	  .sample-button {
		background-color: #6b7280;
		font-size: 0.875rem;
		padding: 0.5rem 0.75rem;
	  }
	  
	  .error-summary {
		background-color: #fef2f2;
		border: 1px solid #fecaca;
		border-radius: 0.375rem;
		padding: 1rem;
		margin-top: 1rem;
	  }
	  
	  .error-summary h3 {
		color: var(--error-color);
		margin-top: 0;
	  }
	  
	  .copy-json-btn {
		background-color: #6b7280;
		margin-left: 0.5rem;
	  }
	  
	  @media (max-width: 640px) {
		.detail-row {
		  flex-direction: column;
		}
		
		.detail-label {
		  margin-bottom: 0.25rem;
		}
	  }
	</style>
  </head>
  <body>
	<div class="container">
	  <header>
		<h1>Log File Parser</h1>
		<p class="description">Paste your Airia Agent log file below to analyze and visualize its structure and execution flow.</p>
	  </header>
	  
	  <div class="card">
		<textarea id="jsonInput" placeholder="Paste your JSON log file here..."></textarea>
		<div class="sample-container">
		  <button id="parseBtn">Parse Log</button>
		  <button id="loadSampleBtn" class="sample-button">Load Sample Log</button>
		</div>
	  </div>
	  
	  <div id="results" class="card">
		<div id="overview-section">
		  <h2>Overview</h2>
		  <div class="overview" id="overview-metrics"></div>
		</div>
		
		<div id="errors-section" style="display: none;">
		  <div class="error-summary" id="error-summary"></div>
		</div>
		
		<div class="steps-container">
		  <div class="steps-header">
			<h2>Execution Steps</h2>
			<button id="expandAllBtn">Expand All</button>
		  </div>
		  <div id="steps-list"></div>
		</div>
		
		<div style="margin-top: 1.5rem;">
		  <h2>Processed Data
			<button id="copyJsonBtn" class="copy-json-btn">Copy JSON</button>
		  </h2>
		  <pre id="processedJson" style="background: #f3f4f6; padding: 1rem; border-radius: 0.375rem; overflow: auto;"></pre>
		</div>
	  </div>
	</div>
	
	<script>
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
		  const sampleLog = \`{
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
  }\`;
		  
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
			// Local parsing for client-side
			const logData = JSON.parse(jsonText);
			parsedResult = parseLogClient(logData);
			
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
		
		// Client-side log parsing function (similar to the server-side one)
		function parseLogClient(logData) {
		  const result = {
			overview: {
			  success: logData.Success,
			  executionId: logData.ExecutionId,
			  userId: logData.UserId,
			  projectId: logData.ProjectId,
			  duration: logData.TimeTrackingData?.duration || 'N/A',
			  startedAt: formatDateTime(logData.TimeTrackingData?.startedAt),
			  finishedAt: formatDateTime(logData.TimeTrackingData?.finishedAt),
			},
			steps: [],
			errors: [],
		  };
		  
		  // Parse steps
		  if (logData.StepsExecutionContext) {
			for (const stepId in logData.StepsExecutionContext) {
			  const step = logData.StepsExecutionContext[stepId];
			  
			  const stepInfo = {
				id: step.StepId,
				type: step.StepType,
				success: step.Success,
				duration: step.TimeTrackingData?.duration || 'N/A',
				startedAt: formatDateTime(step.TimeTrackingData?.startedAt),
				finishedAt: formatDateTime(step.TimeTrackingData?.finishedAt),
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
			  }
			  
			  // Add error information if present
			  if (!step.Success && step.ExceptionMessage) {
				stepInfo.error = step.ExceptionMessage;
				result.errors.push({
				  stepId: step.StepId,
				  stepType: step.StepType,
				  message: step.ExceptionMessage,
				});
			  }
			  
			  result.steps.push(stepInfo);
			}
			
			// Sort steps by start time
			result.steps.sort((a, b) => {
			  return new Date(a.startedAt) - new Date(b.startedAt);
			});
		  }
		  
		  return result;
		}
		
		function formatDateTime(dateTimeStr) {
		  if (!dateTimeStr) return 'N/A';
		  try {
			const date = new Date(dateTimeStr);
			return date.toLocaleString();
		  } catch (e) {
			return dateTimeStr;
		  }
		}
		
		function displayResults(data) {
		  // Display overview metrics
		  overviewMetricsDiv.innerHTML = '';
		  for (const [key, value] of Object.entries(data.overview)) {
			overviewMetricsDiv.innerHTML += \`
			  <div class="metric">
				<div class="metric-label">\${formatLabel(key)}</div>
				<div class="metric-value \${key === 'success' ? (value ? 'success' : 'error') : ''}">\${value === true ? '✓' : value === false ? '✗' : value}</div>
			  </div>
			\`;
		  }
		  
		  // Display errors if any
		  if (data.errors && data.errors.length > 0) {
			errorsSection.style.display = 'block';
			errorSummaryDiv.innerHTML = \`
			  <h3>Execution Errors (\${data.errors.length})</h3>
			  <ul>
				\${data.errors.map(error => \`
				  <li>
					<strong>\${error.stepType} (\${error.stepId.substring(0, 8)}...):</strong>
					<div>\${error.message}</div>
				  </li>
				\`).join('')}
			  </ul>
			\`;
		  } else {
			errorsSection.style.display = 'none';
		  }
		  
		  // Display steps
		  stepsListDiv.innerHTML = '';
		  data.steps.forEach((step, index) => {
			const stepHtml = \`
			  <div class="step" data-step-id="\${step.id}">
				<div class="step-header" onclick="toggleStep(this)">
				  <div>
					<span class="step-type">\${step.type}</span>
					<span class="step-id">ID: \${step.id.substring(0, 8)}...</span>
				  </div>
				  <div class="\${step.success ? 'success' : 'error'}">
					\${step.success ? '✓ Success' : '✗ Failed'}
				  </div>
				</div>
				<div class="step-body">
				  <div class="detail-row">
					<div class="detail-label">Step ID:</div>
					<div class="detail-value">\${step.id}</div>
				  </div>
				  <div class="detail-row">
					<div class="detail-label">Type:</div>
					<div class="detail-value">\${step.type}</div>
				  </div>
				  <div class="detail-row">
					<div class="detail-label">Duration:</div>
					<div class="detail-value">\${step.duration}</div>
				  </div>
				  <div class="detail-row">
					<div class="detail-label">Started:</div>
					<div class="detail-value">\${step.startedAt}</div>
				  </div>
				  <div class="detail-row">
					<div class="detail-label">Finished:</div>
					<div class="detail-value">\${step.finishedAt}</div>
				  </div>
				  \${step.type === 'InputStep' ? \`
					<div class="detail-row">
					  <div class="detail-label">Input:</div>
					  <div class="detail-value">\${step.input || 'N/A'}</div>
					</div>
				  \` : ''}
				  \${step.type === 'AIOperation' ? \`
					<div class="detail-row">
					  <div class="detail-label">Model:</div>
					  <div class="detail-value">\${step.modelName}</div>
					</div>
					<div class="detail-row">
					  <div class="detail-label">Provider:</div>
					  <div class="detail-value">\${step.modelProvider}</div>
					</div>
					<div class="detail-row">
					  <div class="detail-label">Tokens:</div>
					  <div class="detail-value">Input: \${step.tokens.input}, Output: \${step.tokens.output}, Total: \${step.tokens.total}</div>
					</div>
				  \` : ''}
				  \${step.error ? \`
					<div class="detail-row">
					  <div class="detail-label">Error:</div>
					  <div class="detail-value error">\${step.error}</div>
					</div>
				  \` : ''}
				</div>
			  </div>
			\`;
			
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
	</script>
  </body>
  </html>`;
  }