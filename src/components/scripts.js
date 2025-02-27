/**
 * JavaScript for the log parser UI
 * 
 * IMPORTANT: This file contains a client-side implementation of the log parser.
 * It can't directly import from other files since it's embedded in the HTML
 * response. It's similar to but separate from the server-side implementation
 * in ../lib/log-parser.js. If you make changes to one, you should generally
 * update both.
 */

export function getScripts() {
  return `
// Debug indicator to see if our script is loading properly
console.log("Log parser script v1.0.1 starting");

// Ensure we have all DOM elements before continuing
const initializePage = function() {
  console.log("DOM Content Loaded");
  
  // If the document is still loading, wait for it to complete
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
    return;
  }
  
  // No loading indicator anymore
  
  // Check if all required elements exist
  const requiredElements = [
    "logInput", "logFile", "parseBtn", 
    "results-container", "overview-content", "summary-content", 
    "steps-content", "raw-content"
  ];
  
  for (const id of requiredElements) {
    const element = document.getElementById(id);
    if (!element) {
      console.error(\`Required element \${id} not found!\`);
    }
  }
  
  // Get DOM elements
  const elements = {
    logInput: document.getElementById("logInput"),
    logFile: document.getElementById("logFile"),
    parseBtn: document.getElementById("parseBtn"),
    resultsContainer: document.getElementById("results-container"),
    overviewContent: document.getElementById("overview-content"),
    summaryContent: document.getElementById("summary-content"),
    stepsContent: document.getElementById("steps-content"),
    rawContent: document.getElementById("raw-content"),
    errorsSection: document.getElementById("errors-section"),
    errorSummary: document.getElementById("error-summary"),
    copyJsonBtn: document.getElementById("copyJsonBtn"),
    expandAllBtn: document.getElementById("expandAllBtn")
  };

  // Initialize application state
  const state = {
    allExpanded: false,
    parsedResult: null
  };

  // Handle file upload
  elements.logFile.addEventListener("change", function(e) {
    // Hide any previous results
    elements.resultsContainer.classList.add("hidden");
    
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        elements.logInput.value = e.target.result;
        
        // Automatically click the parse button after loading the file
        if (elements.logInput.value.trim()) {
          // Optional: Automatically parse the file after loading
          // elements.parseBtn.click();
        }
      };
      reader.readAsText(file);
    }
  });

  // Parse button click handler
  elements.parseBtn.addEventListener("click", function() {
    console.log("Parse button clicked");
    
    try {
      const logData = elements.logInput.value.trim();
      if (!logData) {
        alert("Please paste log data or upload a log file.");
        return;
      }
      
      // Hide any previous results
      elements.resultsContainer.classList.add("hidden");
      
      try {
        console.log("Parsing JSON data");
        // Parse the JSON data
        const data = JSON.parse(logData);
        
        console.log("Processing log data");
        
        // Use our client-side parsing function (defined below)
        try {
          state.parsedResult = parseLogClient(data);
          console.log("Parsed result:", state.parsedResult);
          
          // Display results
          displayResults();
        } catch (e) {
          console.error("Error parsing log:", e);
          alert("Error parsing log data: " + e.message);
        }
        
      } catch (e) {
        console.error("Error processing log:", e);
        alert("Error parsing JSON: " + e.message);
      }
    } catch (outerError) {
      console.error("Critical error in click handler:", outerError);
      alert("An unexpected error occurred: " + outerError.message);
    }
  });
  
  // Toggle expand/collapse all steps
  if (elements.expandAllBtn) {
    elements.expandAllBtn.addEventListener("click", function() {
      const stepBodies = document.querySelectorAll(".accordion-collapse");
      state.allExpanded = !state.allExpanded;
      
      stepBodies.forEach(body => {
        if (state.allExpanded) {
          body.classList.add("show");
        } else {
          body.classList.remove("show");
        }
      });
      
      elements.expandAllBtn.textContent = state.allExpanded ? "Collapse All" : "Expand All";
    });
  }
  
  // Configure accordions to allow multiple open sections
  const configureAccordions = function() {
    const allAccordions = document.querySelectorAll(".accordion");
    allAccordions.forEach(accordion => {
      // Remove the data-bs-parent attribute from all accordion items
      const items = accordion.querySelectorAll(".accordion-collapse");
      items.forEach(item => {
        item.removeAttribute("data-bs-parent");
      });
    });
  };
  
  // Run it when DOM is loaded
  configureAccordions();
  
  // Copy processed JSON
  if (elements.copyJsonBtn) {
    elements.copyJsonBtn.addEventListener("click", function() {
      if (state.parsedResult) {
        navigator.clipboard.writeText(JSON.stringify(state.parsedResult, null, 2))
          .then(() => {
            const originalText = elements.copyJsonBtn.textContent;
            elements.copyJsonBtn.textContent = "Copied!";
            setTimeout(() => {
              elements.copyJsonBtn.textContent = originalText;
            }, 2000);
          })
          .catch(err => {
            console.error("Failed to copy: ", err);
          });
      }
    });
  }
  
  // Format date-time string
  function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return "N/A";
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleString();
    } catch (e) {
      return dateTimeStr;
    }
  }
  
  // Format label for display
  function formatLabel(key) {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");
  }
  
  // Sanitize a string for safe HTML embedding
  function sanitizeString(str) {
    if (typeof str !== 'string') return str;
    let result = str.split("\\\\").join("\\\\\\\\");
    result = result.split("\\n").join("<br>");
    return result;
  }
  
  // Format a value as JSON if it appears to be a JSON string or object
  function formatJsonValue(value) {
    if (!value) return '<em>Empty</em>';

    try {
      if (typeof value === 'string' && 
        (value.trim().startsWith('{') || value.trim().startsWith('['))) {
        return JSON.stringify(JSON.parse(value), null, 2);
      } else if (typeof value === 'object') {
        return JSON.stringify(value, null, 2);
      }
    } catch (e) {
      // If parsing fails, use as is
    }
    
    return String(value);
  }
  
  // Format a size in bytes to a human-readable string
  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    if (!bytes) return '0 B';
    
    return bytes > 1024 ? 
      (bytes/1024).toFixed(1) + " KB" : 
      bytes + " B";
  }
  
  // Format a duration in milliseconds to a human-readable string
  function formatDuration(ms) {
    if (!ms) return 'N/A';
    return (ms/1000).toFixed(2) + "s";
  }
  
  // Display function implementations
  function displayOverview(overview) {
    elements.overviewContent.innerHTML = "";
    
    // Add format badge if present
    if (overview.format) {
      elements.overviewContent.innerHTML += '<div class="format-badge">Log Format: ' + overview.format + '</div>';
    }
    
    // Display all other metrics
    for (const [key, value] of Object.entries(overview)) {
      // Skip format as we display it separately
      if (key === 'format') continue;
      
      const cssClass = key === "success" ? (value ? "success" : "error") : "";
      const displayValue = value === true ? "✓" : value === false ? "✗" : value;
      
      elements.overviewContent.innerHTML += 
        "<div class=\\"metric\\">" +
          "<div class=\\"metric-label\\">" + formatLabel(key) + "</div>" +
          "<div class=\\"metric-value " + cssClass + "\\">" + displayValue + "</div>" +
        "</div>";
    }
  }
  
  // Display conversation summary
  function displaySummary(summary) {
    elements.summaryContent.innerHTML = "";
    
    if (summary.userInput) {
      elements.summaryContent.innerHTML += 
        "<div class=\\"user-message\\">" +
          "<div class=\\"message-label\\">User Input:</div>" +
          "<div class=\\"message-content\\">" + summary.userInput + "</div>" +
        "</div>";
    }
    
    if (summary.finalOutput) {
      elements.summaryContent.innerHTML += 
        "<div class=\\"ai-response\\">" +
          "<div class=\\"message-label\\">Final Response:</div>" +
          "<div class=\\"message-content\\">" + summary.finalOutput + "</div>" +
        "</div>";
    }
    
    if (!summary.userInput && !summary.finalOutput) {
      elements.summaryContent.innerHTML = "<div class=\\"alert alert-info\\">No conversation data available.</div>";
    }
  }
  
  // Display error summary
  function displayErrors(errors) {
    if (errors && errors.length > 0) {
      elements.errorsSection.style.display = "block";
      
      let errorHtml = "<h3>Execution Errors (" + errors.length + ")</h3><ul>";
      
      for (const error of errors) {
        const stepType = error.stepType || "Unknown";
        const stepId = error.stepId ? error.stepId.substring(0, 8) + "..." : "N/A";
        const message = error.message || "No error message";
        
        errorHtml += "<li>" +
          "<strong>" + stepType + " (" + stepId + "):</strong>" +
          "<div>" + message + "</div>" +
        "</li>";
      }
      
      errorHtml += "</ul>";
      elements.errorSummary.innerHTML = errorHtml;
    } else {
      elements.errorsSection.style.display = "none";
    }
  }
  
  // Main client-side parser function
  function parseLogClient(logData) {
    // Determine the format of the log data
    // Format 1: logData.StepsExecutionContext - traditional format
    // Format 2: Direct object with step IDs as keys - new format
    let stepsData = null;
    let isFormat1 = false;
    let isFormat2 = false;
    
    console.log("Detecting log format...");
    
    if (logData.StepsExecutionContext) {
      console.log("Detected Format 1 (StepsExecutionContext)");
      stepsData = logData.StepsExecutionContext;
      isFormat1 = true;
    } else if (Object.keys(logData).length > 0 && 
              logData[Object.keys(logData)[0]]?.stepId && 
              logData[Object.keys(logData)[0]]?.stepType) {
      console.log("Detected Format 2 (Direct step objects)");
      stepsData = logData;
      isFormat2 = true;
    }
    
    if (!stepsData) {
      console.error('Unknown log format');
      return {
        overview: {
          success: false,
          error: 'Unknown log format'
        },
        summary: {},
        steps: [],
        errors: [{
          message: 'Could not parse log data. Unknown format.'
        }]
      };
    }
    
    // Find input and output steps for summary
    let userInput = '';
    let finalOutput = '';
    let inputStepIds = [];
    let outputStepIds = [];
    let overallSuccess = true;
    
    // First, identify input and output steps and overall success
    for (const stepId in stepsData) {
      const step = stepsData[stepId];
      const stepType = isFormat1 ? step.StepType : step.stepType;
      
      if (!step.success) {
        overallSuccess = false;
      }
      
      if (stepType === 'InputStep') {
        inputStepIds.push(stepId);
        const resultValue = isFormat1 ? step.Result?.Value : step.result?.value;
        if (resultValue) {
          userInput = resultValue;
        }
      } else if (stepType === 'OutputStep') {
        outputStepIds.push(stepId);
      }
    }
    
    // Collect execution metadata
    const executionId = isFormat1 ? (logData.ExecutionId || 'N/A') : 'N/A';
    const userId = isFormat1 ? (logData.UserId || 'N/A') : 'N/A';
    const projectId = isFormat1 ? (logData.ProjectId || 'N/A') : 'N/A';
    let startTime = null;
    let endTime = null;
    let duration = 'N/A';
    
    // Find overall time span from steps if not directly available
    if (isFormat2) {
      for (const stepId in stepsData) {
        const step = stepsData[stepId];
        const timeData = step.timeTrackingData;
        
        if (timeData) {
          const startedAt = new Date(timeData.startedAt);
          const finishedAt = new Date(timeData.finishedAt);
          
          if (!startTime || startedAt < startTime) {
            startTime = startedAt;
          }
          
          if (!endTime || finishedAt > endTime) {
            endTime = finishedAt;
          }
        }
      }
      
      if (startTime && endTime) {
        duration = (endTime - startTime) + 'ms';
      }
    } else {
      duration = logData.TimeTrackingData?.duration || 'N/A';
      startTime = logData.TimeTrackingData?.startedAt ? new Date(logData.TimeTrackingData.startedAt) : null;
      endTime = logData.TimeTrackingData?.finishedAt ? new Date(logData.TimeTrackingData.finishedAt) : null;
    }
    
    const result = {
      overview: {
        success: isFormat1 ? logData.Success : overallSuccess,
        executionId: executionId,
        userId: userId,
        projectId: projectId,
        duration: duration,
        startedAt: startTime ? formatDateTime(startTime) : 'N/A',
        finishedAt: endTime ? formatDateTime(endTime) : 'N/A',
        format: isFormat1 ? 'Standard' : 'Direct',
      },
      summary: {
        userInput: userInput,
        finalOutput: finalOutput,
      },
      steps: [],
      errors: [],
    };
    
    // Parse steps
    for (const stepId in stepsData) {
      const step = stepsData[stepId];
      
      // Extract common fields based on format
      const stepInfo = {
        id: isFormat1 ? step.StepId : step.stepId,
        type: isFormat1 ? step.StepType : step.stepType,
        success: step.Success !== undefined ? step.Success : (step.success !== undefined ? step.success : true),
        duration: isFormat1 ? 
          (step.TimeTrackingData?.duration || 'N/A') : 
          (step.timeTrackingData?.duration || 'N/A'),
        startedAt: formatDateTime(isFormat1 ? 
          step.TimeTrackingData?.startedAt : 
          step.timeTrackingData?.startedAt),
        finishedAt: formatDateTime(isFormat1 ? 
          step.TimeTrackingData?.finishedAt : 
          step.timeTrackingData?.finishedAt),
      };
      
      // Get the appropriate step type (handling case sensitivity differences)
      const stepType = stepInfo.type;
      
      // Extract result value based on format
      const resultValue = isFormat1 ? step.Result?.Value : step.result?.value;
      
      // Add step-specific data
      if (stepType === 'InputStep') {
        stepInfo.input = resultValue || '';
      } else if (stepType === 'OutputStep') {
        // For output steps, try to get the value from input array
        // This is because output steps typically receive their value from a previous step
        const inputs = isFormat1 ? step.Input : step.input;
        if (inputs && inputs.length > 0) {
          const outputValue = isFormat1 ? inputs[0]?.Value : inputs[0]?.value;
          stepInfo.output = outputValue || '';
        }
      } else if (stepType === 'MemoryLoadStep') {
        if (isFormat1) {
          stepInfo.memoryKey = step.Result?.Key || '';
          stepInfo.memoryValue = step.Result?.Value || '';
          stepInfo.memoryType = step.Result?.$type || '';
        } else {
          stepInfo.memoryKey = step.result?.key || '';
          stepInfo.memoryValue = step.result?.value || '';
          stepInfo.memoryType = step.result?.$type || '';
        }
        stepInfo.memoryOp = 'load';
      } else if (stepType === 'MemoryStoreStep') {
        // For store steps, information is typically in the Input
        const inputs = isFormat1 ? step.Input : step.input;
        if (inputs && inputs.length > 0) {
          const input = inputs[0];
          if (isFormat1) {
            stepInfo.memoryKey = input?.Key || '';
            stepInfo.memoryValue = input?.Value || '';
            stepInfo.memoryType = input?.$type || '';
          } else {
            stepInfo.memoryKey = input?.key || '';
            stepInfo.memoryValue = input?.value || '';
            stepInfo.memoryType = input?.$type || '';
          }
          stepInfo.memoryOp = 'store';
        }
      } else if (stepType === 'PythonStep') {
        // Handle Python steps
        // Result is the output of the Python execution
        if (isFormat1) {
          stepInfo.pythonOutput = {
            type: step.Result?.$type || 'python',
            value: step.Result?.Value || ''
          };
        } else {
          stepInfo.pythonOutput = {
            type: step.result?.$type || 'python',
            value: step.result?.value || ''
          };
        }
        
        // If there are inputs, capture them
        const inputs = isFormat1 ? step.Input : step.input;
        if (inputs && inputs.length > 0) {
          stepInfo.pythonInputs = inputs.map(input => {
            return {
              type: input.$type || 'unknown',
              value: isFormat1 ? input.Value || '' : input.value || ''
            };
          });
        }
        
        // Also capture additional outputs if available
        const outputs = isFormat1 ? step.Output : step.output;
        if (outputs && outputs.length > 0) {
          stepInfo.additionalOutputs = outputs.map(out => {
            return {
              type: out.$type || 'unknown',
              value: isFormat1 ? out.Value || '' : out.value || ''
            };
          });
        }
      } else if (stepType === 'AIOperation') {
        const debugInfo = isFormat1 ? step.DebugInformation : step.debugInformation;
        
        stepInfo.modelName = debugInfo?.modelDisplayName || debugInfo?.modelName || 'N/A';
        stepInfo.modelProvider = debugInfo?.modelProviderType || 'N/A';
        stepInfo.tokens = {
          input: debugInfo?.inputTokens || '0',
          output: debugInfo?.outputTokens || '0',
          total: debugInfo?.totalTokens || '0',
        };
        
        // Extract prompts from messages array or from Input array
        if (debugInfo?.messages && debugInfo.messages.length > 0) {
          // Standardize the prompt format
          stepInfo.prompts = debugInfo.messages.map(message => {
            return {
              role: message.Role?.toLowerCase() || message.role?.toLowerCase() || 'user',
              content: message.TextContent || message.textContent || message.content || message.text || ''
            };
          }).filter(prompt => prompt.content);
        } else {
          const inputs = isFormat1 ? step.Input : step.input;
          if (inputs && inputs.length > 0) {
            // Try to get prompts from the Input array
            stepInfo.prompts = inputs.map(input => {
              return {
                role: 'user',
                content: isFormat1 ? input.Value || '' : input.value || ''
              };
            }).filter(prompt => prompt.content);
          }
        }
        
        // Extract tool calls information
        if (debugInfo?.tools && debugInfo.tools.length > 0) {
          // Enhance the tool information for better display
          stepInfo.tools = debugInfo.tools.map(tool => {
            // Extract tool name from the RequestUrl if available and not already set
            if (!tool.name && !tool.ToolName && tool.RequestUrl) {
              try {
                const url = new URL(tool.RequestUrl);
                if (url.hostname.includes('bing.microsoft.com')) {
                  tool.ToolName = "Microsoft Bing Search";
                } else if (url.hostname.includes('api.openai.com')) {
                  tool.ToolName = "OpenAI API";
                } else if (url.hostname.includes('maps.googleapis.com')) {
                  tool.ToolName = "Google Maps";
                }
              } catch (e) {
                // Leave name as is if URL parsing fails
              }
            }
            
            return {
              name: tool.ToolName || tool.name || "Unknown Tool",
              id: tool.id || tool.ToolId || '',
              arguments: tool.ToolParameters || tool.arguments || '',
              result: tool.ResponseContent || tool.result || '',
              requestContent: tool.RequestContent || '',
              requestUrl: tool.RequestUrl || '',
              totalBytesSent: tool.TotalBytesSent || 0,
              totalBytesReceived: tool.TotalBytesReceived || 0,
              durationMs: tool.DurationMilliseconds || 0,
              method: tool.RequestMethod || 'GET'
            };
          });
        }
        
        // In case the AI operation provides a response directly
        stepInfo.response = resultValue || '';
      } else if (stepType === 'APIToolStep' || stepType === 'WebAPIPluginStep') {
        // Handle API tool steps
        const debugInfo = isFormat1 ? step.DebugInformation : step.debugInformation;
        stepInfo.apiToolName = debugInfo?.toolName || 'Unknown API Tool';
        
        // Process the API parameters
        if (debugInfo?.tools && debugInfo.tools.length > 0) {
          stepInfo.apiTools = debugInfo.tools.map(tool => {
            return {
              name: tool.ToolName || tool.name || 'Unknown Tool',
              parameters: tool.ToolParameters || tool.RequestParameters || {},
              url: tool.RequestUrl || '',
              method: tool.RequestMethod || 'GET',
              statusCode: tool.ResponseStatusCode || 0,
              responseContent: tool.ResponseContent || '',
              responseHeaders: tool.ResponseHeaders || {},
              requestHeaders: tool.RequestHeaders || {},
              requestContent: tool.RequestContent || '',
              totalBytesSent: tool.TotalBytesSent || 0,
              totalBytesReceived: tool.TotalBytesReceived || 0,
              durationMs: tool.DurationMilliseconds || 0,
              error: tool.ErrorMessage || ''
            };
          });
        }
        // If there are no tools in DebugInformation but there are standalone tools
        else if (step.tools && step.tools.length > 0) {
          stepInfo.apiTools = step.tools.map(tool => {
            return {
              name: tool.ToolName || tool.name || 'Unknown Tool',
              parameters: tool.ToolParameters || tool.RequestParameters || {},
              url: tool.RequestUrl || '',
              method: tool.RequestMethod || 'GET',
              statusCode: tool.ResponseStatusCode || 0,
              responseContent: tool.ResponseContent || '',
              responseHeaders: tool.ResponseHeaders || {},
              requestHeaders: tool.RequestHeaders || {},
              requestContent: tool.RequestContent || '',
              totalBytesSent: tool.TotalBytesSent || 0,
              totalBytesReceived: tool.TotalBytesReceived || 0,
              durationMs: tool.DurationMilliseconds || 0,
              error: tool.ErrorMessage || ''
            };
          });
        }
      } else if (stepType === 'DataSearch') {
        if (isFormat1 && step.Result && step.Result.Value) {
          try {
            stepInfo.searchResults = JSON.parse(step.Result.Value);
          } catch (e) {
            console.error('Error parsing DataSearch results:', e);
          }
        } else if (!isFormat1 && step.result && step.result.value) {
          try {
            stepInfo.searchResults = JSON.parse(step.result.value);
          } catch (e) {
            console.error('Error parsing DataSearch results:', e);
          }
        }
      }
      
      // Add error information if present
      const exceptionMessage = isFormat1 ? step.ExceptionMessage : step.exceptionMessage;
      if (!step.success && exceptionMessage) {
        stepInfo.error = exceptionMessage;
        result.errors.push({
          stepId: stepInfo.id,
          stepType: stepInfo.type,
          message: exceptionMessage,
        });
      }
      
      result.steps.push(stepInfo);
    }
    
    // Sort steps by start time
    result.steps.sort((a, b) => {
      const dateA = new Date(a.startedAt === 'N/A' ? 0 : a.startedAt);
      const dateB = new Date(b.startedAt === 'N/A' ? 0 : b.startedAt);
      return dateA - dateB;
    });
    
    // Now that steps are sorted, find the final output from the last OutputStep
    const outputSteps = result.steps.filter(step => step.type === 'OutputStep');
    if (outputSteps.length > 0) {
      const lastOutputStep = outputSteps[outputSteps.length - 1];
      if (lastOutputStep.output) {
        result.summary.finalOutput = lastOutputStep.output;
      }
    }
    
    // If we couldn't find the output from OutputStep, try the last AIOperation response
    if (!result.summary.finalOutput) {
      const aiSteps = result.steps.filter(step => step.type === 'AIOperation' && step.response);
      if (aiSteps.length > 0) {
        const lastAIStep = aiSteps[aiSteps.length - 1];
        result.summary.finalOutput = lastAIStep.response || '';
      }
    }
    
    console.log("Parsing complete, found", result.steps.length, "steps");
    return result;
  }
  
  // Display the steps in the UI
  function displaySteps(steps) {
    // Display steps
    if (!steps || steps.length === 0) {
      elements.stepsContent.innerHTML = "<div class=\\"alert alert-info\\">No steps found in log data.</div>";
      return;
    }
    
    let stepsHtml = "<div class=\\"accordion\\" id=\\"stepsAccordion\\">";
    
    steps.forEach((step, index) => {
      const stepType = step.type || "Unknown";
      const isSuccess = step.success === true; // Make sure it's strictly a boolean true
      
      stepsHtml += "<div class=\\"accordion-item\\">" +
        "<h2 class=\\"accordion-header\\">" +
        "<button class=\\"accordion-button collapsed\\" type=\\"button\\" data-bs-toggle=\\"collapse\\" data-bs-target=\\"#collapse" + index + "\\" " +
        "aria-expanded=\\"false\\" aria-controls=\\"collapse" + index + "\\">" +
        "Step " + (index + 1) + ": " + stepType + " <span class=\\"ms-2 badge " + (isSuccess ? "bg-success" : "bg-danger") + "\\">" + 
        (isSuccess ? "Success" : "Failed") + "</span>" +
        "</button></h2>" +
        "<div id=\\"collapse" + index + "\\" class=\\"accordion-collapse collapse\\">" +
        "<div class=\\"accordion-body\\">" +
        "<table class=\\"table table-sm\\">" +
        "<tr><th style=\\"width: 150px;\\">Step ID:</th><td>" + step.id + "</td></tr>" +
        "<tr><th>Type:</th><td>" + stepType + "</td></tr>" +
        "<tr><th>Duration:</th><td>" + step.duration + "</td></tr>" +
        "<tr><th>Started:</th><td>" + step.startedAt + "</td></tr>" +
        "<tr><th>Finished:</th><td>" + step.finishedAt + "</td></tr>";
      
      // Add specific fields based on step type
      if (step.type === "InputStep" && step.input) {
        stepsHtml += "<tr><th>Input:</th><td>" + step.input + "</td></tr>";
      } else if (step.type === "OutputStep" && step.output) {
        stepsHtml += "<tr><th>Output:</th><td>" + step.output + "</td></tr>";
      } else if (step.type === "MemoryLoadStep" || step.type === "MemoryStoreStep") {
        // Add operation type indicator
        const opLabel = step.memoryOp === "store" ? "Store" : "Load";
        
        stepsHtml += "<tr><th>Operation:</th><td>" + opLabel + "</td></tr>";
          
        if (step.memoryKey) {
          stepsHtml += "<tr><th>Memory Key:</th><td>" + step.memoryKey + "</td></tr>";
        }
        
        // For memory value, sanitize and handle as formatted content
        if (step.memoryValue) {
          // Sanitize memory value to prevent syntax errors
          let safeMemoryValue = sanitizeString(step.memoryValue);
          
          stepsHtml += "<tr><th>Memory Value:</th><td class=\\"memory-content\\">" + safeMemoryValue + "</td></tr>";
        }
        
        if (step.memoryType) {
          stepsHtml += "<tr><th>Memory Type:</th><td>" + step.memoryType + "</td></tr>";
        }
      } else if (step.type === "PythonStep") {
        // Display Python inputs
        if (step.pythonInputs && step.pythonInputs.length > 0) {
          stepsHtml += "<tr><th>Inputs:</th><td class=\\"python-io\\">";
          
          step.pythonInputs.forEach((input, idx) => {
            stepsHtml += "<div class=\\"io-item\\">";
            stepsHtml += "<div class=\\"io-type\\">" + input.type + "</div>";
            
            let safeValue = formatJsonValue(input.value || "");
            safeValue = sanitizeString(safeValue);
            
            stepsHtml += "<div class=\\"io-value\\">" + safeValue + "</div>";
            stepsHtml += "</div>";
          });
          
          stepsHtml += "</td></tr>";
        }
        
        // Display Python output (Result)
        if (step.pythonOutput) {
          stepsHtml += "<tr><th>Output:</th><td class=\\"python-io\\">";
          
          stepsHtml += "<div class=\\"io-item\\">";
          stepsHtml += "<div class=\\"io-type\\">" + step.pythonOutput.type + "</div>";
          
          let safeValue = formatJsonValue(step.pythonOutput.value || "");
          safeValue = sanitizeString(safeValue);
          
          stepsHtml += "<div class=\\"io-value\\">" + safeValue + "</div>";
          stepsHtml += "</div>";
          
          stepsHtml += "</td></tr>";
        }
        
        // Display additional outputs if available
        if (step.additionalOutputs && step.additionalOutputs.length > 0) {
          stepsHtml += "<tr><th>Additional Outputs:</th><td class=\\"python-io\\">";
          
          step.additionalOutputs.forEach((output, idx) => {
            stepsHtml += "<div class=\\"io-item\\">";
            stepsHtml += "<div class=\\"io-type\\">" + output.type + "</div>";
            
            let safeValue = formatJsonValue(output.value || "");
            safeValue = sanitizeString(safeValue);
            
            stepsHtml += "<div class=\\"io-value\\">" + safeValue + "</div>";
            stepsHtml += "</div>";
          });
          
          stepsHtml += "</td></tr>";
        }
      } else if (step.type === "AIOperation") {
        stepsHtml += 
          "<tr><th>Model:</th><td>" + step.modelName + "</td></tr>" +
          "<tr><th>Provider:</th><td>" + step.modelProvider + "</td></tr>" +
          "<tr><th>Tokens:</th><td>Input: " + step.tokens.input + 
          ", Output: " + step.tokens.output + 
          ", Total: " + step.tokens.total + "</td></tr>";
          
        // Add prompts if available
        if (step.prompts && step.prompts.length > 0) {
          stepsHtml += "<tr><th>Prompts:</th><td><div class=\\"prompt-list\\">";
          
          step.prompts.forEach(prompt => {
            const role = prompt.role || "user";
            const content = prompt.content || "";
            
            if (content) {
              // Sanitize content: escape backslashes and handle newlines
              let sanitizedContent = sanitizeString(content);
              
              // For system messages with large content (like instructions), add a collapsible section
              if (role === "system" && content.length > 500) {
                stepsHtml += "<div class=\\"prompt-item prompt-" + role + "\\">" +
                  "<div class=\\"prompt-role\\">" + role + "</div>" +
                  "<details>" +
                  "<summary>View full system message (" + Math.round(content.length/100)/10 + "KB)</summary>" +
                  "<div class=\\"prompt-content\\">" + sanitizedContent + "</div>" +
                  "</details>" +
                  "</div>";
              } else {
                stepsHtml += "<div class=\\"prompt-item prompt-" + role + "\\">" +
                  "<div class=\\"prompt-role\\">" + role + "</div>" +
                  "<div class=\\"prompt-content\\">" + sanitizedContent + "</div>" +
                  "</div>";
              }
            }
          });
          
          stepsHtml += "</div></td></tr>";
        }
        
        // Add tool calls if available
        if (step.tools && step.tools.length > 0) {
          stepsHtml += "<tr><th>Tool Calls:</th><td><div class=\\"tool-calls\\">";
          
          step.tools.forEach((tool, index) => {
            const toolName = tool.name || "Unknown Tool";
            const id = tool.id || index;
            let args = tool.arguments || "";
            let result = tool.result || "";
            
            // Pretty format JSON if possible
            try {
              if (typeof args === "object") {
                args = JSON.stringify(args, null, 2);
              } else if (typeof args === "string") {
                // Try to parse as JSON first
                if (args.trim().startsWith("{") || args.trim().startsWith("[")) {
                  args = JSON.stringify(JSON.parse(args), null, 2);
                }
              }
            } catch (e) {
              // Keep as is if not JSON
            }
            
            try {
              if (typeof result === "object") {
                result = JSON.stringify(result, null, 2);
              } else if (typeof result === "string") {
                // Try to parse as JSON first
                if (result.trim().startsWith("{") || result.trim().startsWith("[")) {
                  result = JSON.stringify(JSON.parse(result), null, 2);
                }
              }
            } catch (e) {
              // Keep as is if not JSON
            }
            
            const toolId = "tool-" + step.id.replace(/[^a-zA-Z0-9]/g, "-") + "-" + index;
            
            // Make each tool call collapsible (collapsed by default)
            stepsHtml += "<div class=\\"tool-call\\">" +
              "<div class=\\"tool-header\\" data-bs-toggle=\\"collapse\\" data-bs-target=\\"#" + toolId + "\\" style=\\"cursor: pointer;\\">" +
              "<div class=\\"d-flex justify-content-between w-100 align-items-center\\">" +
              "<span class=\\"tool-name\\">" + toolName + "</span>" +
              "<div>" +
              (id ? "<span class=\\"tool-id me-2\\">ID: " + id + "</span>" : "") +
              "<span class=\\"collapse-indicator\\">▼</span>" +
              "</div></div>" +
              "</div>" +
              "<div id=\\"" + toolId + "\\" class=\\"collapse\\">" +
              "<div class=\\"tool-body\\">";
            
            if (args) {
              stepsHtml += "<div class=\\"tool-arguments-label\\"><strong>Arguments:</strong></div>" +
                "<div class=\\"tool-arguments\\">" + sanitizeString(args) + "</div>";
            }
            
            // Sanitize result to prevent syntax errors
            let displayResult = sanitizeString(result);
            
            // Add request URL if available
            if (tool.requestUrl) {
              stepsHtml += "<div class=\\"tool-url\\"><strong>URL:</strong> " + tool.requestUrl + "</div>";
            }
            
            if (result) {
              // For other tool results
              stepsHtml += "<div class=\\"tool-result-label\\"><strong>Result:</strong></div>" +
                "<div class=\\"tool-result\\">" + displayResult + "</div>";
            }
            
            stepsHtml += "</div></div></div>";
          });
          
          stepsHtml += "</div></td></tr>";
        }
        
        // Add response if available
        if (step.response) {
          // Sanitize response to prevent syntax errors
          let safeResponse = sanitizeString(step.response);
          
          stepsHtml += "<tr><th>Response:</th><td class=\\"response\\">" + safeResponse + "</td></tr>";
        }
      } else if (step.type === "APIToolStep" || step.type === "WebAPIPluginStep") {
        // Display API Tool information
        stepsHtml += "<tr><th>Tool Name:</th><td>" + step.apiToolName + "</td></tr>";
        
        if (step.apiTools && step.apiTools.length > 0) {
          stepsHtml += "<tr><th>API Calls:</th><td class=\\"api-calls\\">";
          
          step.apiTools.forEach((tool, idx) => {
            const toolId = "api-" + step.id.replace(/[^a-zA-Z0-9]/g, "-") + "-" + idx;
            
            stepsHtml += "<div class=\\"api-call\\">";
            
            // Tool name and request info with collapse toggle
            stepsHtml += "<div class=\\"api-header\\" data-bs-toggle=\\"collapse\\" data-bs-target=\\"#" + toolId + "\\" style=\\"cursor: pointer;\\">";
            stepsHtml += "<div class=\\"d-flex justify-content-between w-100 align-items-center\\">";
            stepsHtml += "<span class=\\"api-name\\">" + (tool.name || "Unknown") + "</span>";
            stepsHtml += "<div>";
            stepsHtml += "<span class=\\"api-method mx-2\\">" + tool.method + "</span>";
            if (tool.durationMs) {
              stepsHtml += "<span class=\\"text-muted me-2\\" style=\\"font-size: 0.8rem;\\">" + formatDuration(tool.durationMs) + "</span>";
            }
            stepsHtml += "<span class=\\"collapse-indicator\\">▼</span>";
            stepsHtml += "</div></div></div>";
            stepsHtml += "</div>";
            
            // Collapsible content
            stepsHtml += "<div id=\\"" + toolId + "\\" class=\\"collapse\\">";
            
            // URL and summary info - make URL more prominent
            if (tool.url) {
              stepsHtml += "<div class=\\"api-url\\" style=\\"background-color: #ebf5ff; font-weight: bold;\\"><strong>URL:</strong> " + tool.url + "</div>";
            }
            
            // Add request metrics summary
            if (tool.totalBytesSent || tool.totalBytesReceived || tool.durationMs) {
              stepsHtml += "<div class=\\"api-metrics\\" style=\\"font-size: 0.8rem; color: #6c757d; padding: 4px 8px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;\\">";
              
              if (tool.durationMs) {
                stepsHtml += "<span class=\\"me-3\\">⏱️ " + formatDuration(tool.durationMs) + "</span>";
              }
              
              if (tool.totalBytesSent) {
                stepsHtml += "<span class=\\"me-3\\">📤 " + formatBytes(tool.totalBytesSent) + "</span>";
              }
              
              if (tool.totalBytesReceived) {
                stepsHtml += "<span>📥 " + formatBytes(tool.totalBytesReceived) + "</span>";
              }
              
              stepsHtml += "</div>";
            }
            
            // Parameters
            if (tool.parameters && Object.keys(tool.parameters).length > 0) {
              stepsHtml += "<div class=\\"api-section\\">";
              stepsHtml += "<div class=\\"api-section-title\\">Parameters:</div>";
              stepsHtml += "<div class=\\"api-parameters\\">";
              
              try {
                let paramStr = "";
                if (typeof tool.parameters === 'object') {
                  // Hide auth tokens with asterisks
                  const safeParams = JSON.parse(JSON.stringify(tool.parameters));
                  if (safeParams.Authorization) safeParams.Authorization = "****";
                  if (safeParams.authorization) safeParams.authorization = "****";
                  if (safeParams.token) safeParams.token = "****";
                  
                  paramStr = JSON.stringify(safeParams, null, 2);
                } else {
                  paramStr = tool.parameters;
                }
                
                paramStr = sanitizeString(paramStr);
                stepsHtml += "<pre class=\\"api-parameter-content\\">" + paramStr + "</pre>";
              } catch (e) {
                stepsHtml += "<pre class=\\"api-parameter-content\\">" + 
                  (typeof tool.parameters === 'string' ? tool.parameters : JSON.stringify(tool.parameters)) + 
                  "</pre>";
              }
              
              stepsHtml += "</div>";
              stepsHtml += "</div>";
            }
            
            // Request content if available
            if (tool.requestContent) {
              stepsHtml += "<div class=\\"api-section\\">";
              stepsHtml += "<div class=\\"api-section-title\\">Request Body:</div>";
              
              try {
                let contentStr = formatJsonValue(tool.requestContent);
                contentStr = sanitizeString(contentStr);
                stepsHtml += "<pre class=\\"api-parameter-content\\" style=\\"background-color: #f5f5f5;\\">" + contentStr + "</pre>";
              } catch (e) {
                stepsHtml += "<pre class=\\"api-parameter-content\\" style=\\"background-color: #f5f5f5;\\">" + 
                  String(tool.requestContent) + "</pre>";
              }
              
              stepsHtml += "</div>";
            }
            
            // Response section
            stepsHtml += "<div class=\\"api-section\\">";
            stepsHtml += "<div class=\\"api-section-title\\">Response: <span class=\\"api-status\\">" + 
              (tool.statusCode ? "Status " + tool.statusCode : "No status code") + "</span></div>";
            
            if (tool.error) {
              stepsHtml += "<div class=\\"api-error\\">" + tool.error + "</div>";
            }
            
            // First detect the tool type for custom handling
            let toolType = "generic";
            
            if (tool.name && tool.name.includes("Bing") || tool.name && tool.name.includes("Search")) {
              toolType = "search";
            } else if (tool.name && tool.name.includes("Jira") || tool.url?.includes("atlassian")) {
              toolType = "jira";
            } else if (tool.name && tool.name.includes("Dataframe") || tool.name && tool.name.includes("Database") || tool.name && tool.name.includes("SQL")) {
              toolType = "data";
            } else if (tool.name && tool.name.includes("File") || tool.name && tool.name.includes("Document")) {
              toolType = "file";
            }
            
            if (tool.responseContent) {
              // Try to parse response as JSON, but don't fail if it's not
              let resultObj = null;
              let isValidJson = false;
              
              try {
                if (typeof tool.responseContent === 'string' && 
                   (tool.responseContent.trim().startsWith('{') || tool.responseContent.trim().startsWith('['))) {
                  resultObj = JSON.parse(tool.responseContent);
                  isValidJson = true;
                } else if (typeof tool.responseContent === 'object') {
                  resultObj = tool.responseContent;
                  isValidJson = true;
                }
              } catch (e) {
                // Not valid JSON, will handle as text
              }
              
              // Format based on tool type
              if (toolType === "search" && isValidJson && resultObj.webPages && resultObj.webPages.value) {
                // Render search results
                stepsHtml += "<div class=\\"search-results\\" style=\\"max-height: 350px; overflow-y: auto;\\">";
                  
                resultObj.webPages.value.forEach((page, i) => {
                  const pageUrl = page.url ? page.url.split("\\"").join("&quot;") : "";
                  const pageName = page.name ? page.name.split("<").join("&lt;").split(">").join("&gt;") : "";
                  const pageSnippet = page.snippet ? page.snippet.split("<").join("&lt;").split(">").join("&gt;") : "";
                  
                  stepsHtml += "<div class=\\"search-result\\">" +
                    "<div class=\\"search-result-title\\"><a href=\\"" + pageUrl + "\\" target=\\"_blank\\">" + pageName + "</a></div>" +
                    "<div class=\\"search-result-url\\">" + pageUrl + "</div>" +
                    "<div class=\\"search-result-snippet\\">" + pageSnippet + "</div>" +
                    "</div>";
                });
                
                stepsHtml += "</div>";
              } 
              else if (toolType === "jira" && isValidJson && resultObj.values && Array.isArray(resultObj.values)) {
                // Jira projects or issues
                if (resultObj.values.length > 0 && resultObj.values[0].key) {
                  // Projects list
                  stepsHtml += "<div class=\\"jira-results\\" style=\\"max-height: 350px; overflow-y: auto;\\">";
                  
                  // Render projects table
                  stepsHtml += "<table class=\\"table table-sm jira-table\\">" +
                    "<thead><tr>" +
                    "<th>Key</th><th>Name</th><th>Type</th><th>Style</th>" +
                    "</tr></thead><tbody>";
                  
                  resultObj.values.forEach(project => {
                    const key = project.key || "";
                    const name = project.name || "";
                    const type = project.projectTypeKey || "";
                    const style = project.style || "";
                    
                    stepsHtml += "<tr>" +
                      "<td>" + key + "</td>" +
                      "<td>" + name + "</td>" +
                      "<td>" + type + "</td>" +
                      "<td>" + style + "</td>" +
                      "</tr>";
                  });
                  
                  stepsHtml += "</tbody></table>";
                  stepsHtml += "<div class=\\"jira-meta\\">Total: " + (resultObj.total || resultObj.values.length) + "</div>";
                  stepsHtml += "</div>";
                } 
                else if (resultObj.values.length > 0 && resultObj.values[0].id) {
                  // Issues list
                  stepsHtml += "<div class=\\"jira-results\\" style=\\"max-height: 350px; overflow-y: auto;\\">";
                  
                  // Render issues table
                  stepsHtml += "<table class=\\"table table-sm jira-table\\">" +
                    "<thead><tr>" +
                    "<th>Key</th><th>Summary</th><th>Status</th><th>Priority</th>" +
                    "</tr></thead><tbody>";
                  
                  resultObj.values.forEach(issue => {
                    const key = issue.key || "";
                    const summary = issue.fields?.summary || "";
                    const status = issue.fields?.status?.name || "";
                    const priority = issue.fields?.priority?.name || "";
                    
                    stepsHtml += "<tr>" +
                      "<td>" + key + "</td>" +
                      "<td>" + summary + "</td>" +
                      "<td>" + status + "</td>" +
                      "<td>" + priority + "</td>" +
                      "</tr>";
                  });
                  
                  stepsHtml += "</tbody></table>";
                  stepsHtml += "<div class=\\"jira-meta\\">Total: " + (resultObj.total || resultObj.values.length) + "</div>";
                  stepsHtml += "</div>";
                }
                else {
                  // Generic Jira content, fallback to JSON
                  const safeJson = sanitizeString(JSON.stringify(resultObj, null, 2));
                  stepsHtml += "<pre class=\\"api-response-content\\">" + safeJson + "</pre>";
                }
              }
              else if (toolType === "data" && isValidJson) {
                // Data response with potential table format
                if (Array.isArray(resultObj) && resultObj.length > 0) {
                  // Try to render as table if it seems like a dataset
                  stepsHtml += "<div class=\\"data-results\\" style=\\"max-height: 350px; overflow-y: auto;\\">";
                  
                  // Get all possible columns from the data
                  const columns = new Set();
                  resultObj.forEach(row => {
                    if (typeof row === 'object' && row !== null) {
                      Object.keys(row).forEach(key => columns.add(key));
                    }
                  });
                  
                  if (columns.size > 0) {
                    // Render table
                    stepsHtml += "<table class=\\"table table-sm data-table\\">" +
                      "<thead><tr>";
                    
                    columns.forEach(col => {
                      stepsHtml += "<th>" + col + "</th>";
                    });
                    
                    stepsHtml += "</tr></thead><tbody>";
                    
                    resultObj.forEach(row => {
                      stepsHtml += "<tr>";
                      
                      columns.forEach(col => {
                        const value = row[col] !== undefined ? row[col] : "";
                        stepsHtml += "<td>" + value + "</td>";
                      });
                      
                      stepsHtml += "</tr>";
                    });
                    
                    stepsHtml += "</tbody></table>";
                    stepsHtml += "<div class=\\"data-meta\\">Rows: " + resultObj.length + "</div>";
                  } else {
                    // Not tabular data, show as JSON
                    const safeJson = sanitizeString(JSON.stringify(resultObj, null, 2));
                    stepsHtml += "<pre class=\\"api-response-content\\">" + safeJson + "</pre>";
                  }
                  
                  stepsHtml += "</div>";
                } else {
                  // Not an array, show as JSON
                  const safeJson = sanitizeString(JSON.stringify(resultObj, null, 2));
                  stepsHtml += "<pre class=\\"api-response-content\\">" + safeJson + "</pre>";
                }
              }
              else if (isValidJson) {
                // Generic JSON formatting for all other tool types
                const safeJson = sanitizeString(JSON.stringify(resultObj, null, 2));
                stepsHtml += "<pre class=\\"api-response-content\\">" + safeJson + "</pre>";
              } 
              else {
                // Plain text for non-JSON responses
                let formattedResponse = String(tool.responseContent);
                formattedResponse = sanitizeString(formattedResponse);
                stepsHtml += "<div class=\\"api-response-content\\">" + formattedResponse + "</div>";
              }
            } else {
              stepsHtml += "<div class=\\"api-no-response\\">No response content</div>";
            }
            
            stepsHtml += "</div>";
            stepsHtml += "</div></div>";
          });
          
          stepsHtml += "</td></tr>";
        }
      }
      
      // Add error if present
      if (step.error) {
        stepsHtml += "<tr><th>Error:</th><td class=\\"text-danger\\">" + step.error + "</td></tr>";
      }
      
      stepsHtml += "</table>";
      
      // Handle DataSearch step 
      if (stepType === "DataSearch") {
        try {
          const searchData = step.searchResults;
          
          if (searchData && searchData.Chunks && searchData.Chunks.length > 0) {
            stepsHtml += "<div class=\\"datasearch-container mt-3\\">" +
              "<h5>Data Search Results</h5>" +
              "<p>Found " + searchData.Chunks.length + " results</p>" +
              "<div class=\\"table-responsive\\">" +
              "<table class=\\"table table-sm\\">" +
              "<thead><tr><th>Score</th><th>Source</th><th>Content</th></tr></thead>" +
              "<tbody>";
            
            // Sort chunks by score
            const sortedChunks = Array.from(searchData.Chunks).sort((a, b) => {
              return (b.Score || 0) - (a.Score || 0);
            });
            
            // Show top 5 chunks
            const topChunks = sortedChunks.slice(0, 5);
            
            for (const chunk of topChunks) {
              const score = chunk.Score || 0;
              const scorePercent = Math.round(score * 100);
              let scoreColor = "#dc3545"; // red
              
              if (score > 0.7) {
                scoreColor = "#28a745"; // green
              } else if (score > 0.5) {
                scoreColor = "#17a2b8"; // blue
              }
              
              const docName = chunk.Metadata && chunk.Metadata.DocumentName ? chunk.Metadata.DocumentName : "Unknown";
              const pageNum = chunk.Metadata && chunk.Metadata.pageNumber ? chunk.Metadata.pageNumber : "";
              let content = chunk.Chunk || "";
              
              // Safe way to replace newlines
              content = sanitizeString(content);
              
              stepsHtml += "<tr>" +
                "<td><span class=\\"score-badge\\" style=\\"background-color: " + scoreColor + ";\\">" + scorePercent + "%</span></td>" +
                "<td><div class=\\"source-doc\\">" + docName + "</div>";
                
              if (pageNum) {
                stepsHtml += "<div>Page " + pageNum + "</div>";
              }
              
              stepsHtml += "</td><td>" + content + "</td></tr>";
            }
            
            stepsHtml += "</tbody></table></div></div>";
          }
        } catch (e) {
          stepsHtml += "<div class=\\"alert alert-danger\\">Error processing search results: " + e.message + "</div>";
        }
      }
      
      stepsHtml += "</div></div></div>";
    });
    
    stepsHtml += "</div>";
    elements.stepsContent.innerHTML = stepsHtml;
  }
  
  // Display all results
  function displayResults() {
    try {
      // If no result is available, don't try to display anything
      if (!state.parsedResult) {
        console.error("No parsed result available");
        return;
      }
      
      // Display overview metrics
      displayOverview(state.parsedResult.overview);
      
      // Display summary
      displaySummary(state.parsedResult.summary);
      
      // Display errors if any
      displayErrors(state.parsedResult.errors);
      
      // Display steps
      displaySteps(state.parsedResult.steps);
      
      // Display raw JSON
      elements.rawContent.textContent = JSON.stringify(state.parsedResult, null, 2);
      
      // Show results
      elements.resultsContainer.classList.remove("hidden");
      
      // Scroll to the results and configure accordions
      elements.resultsContainer.scrollIntoView({ behavior: "smooth" });
      setTimeout(configureAccordions, 100);
    } catch (e) {
      console.error("Error displaying results:", e);
    }
  }
};

// Start initialization when script loads
initializePage();
  `;
}