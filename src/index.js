/**
 * Agent Execution Log Parser - Cloudflare Worker
 * Server-side handler for parsing log files
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
	// This function would now just read the HTML file from storage
	// For this example, I'll keep the HTML inline, but in a real-world scenario,
	// you'd read this from a separate file or asset
	return `<!DOCTYPE html>
  <html lang="en">
  <head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Log File Parser</title>
	<link rel="stylesheet" href="/styles.css">
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
  
	<script src="/app.js"></script>
  </body>
  </html>`;
  }