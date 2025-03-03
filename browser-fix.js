// Fix for the step rendering issue - add this to your browser console when using the deployed worker

/**
 * This script fixes the missing step data issue when the router/pipeline steps are rendered
 * Run this in the browser console after loading the log parser app but before uploading your log file
 */
(function() {
  console.log("Applying browser-side fix for step rendering...");
  
  // Store a reference to the original fetch
  const originalFetch = window.fetch;
  
  // Replace fetch with our enhanced version
  window.fetch = async function(...args) {
    // Call the original fetch
    const response = await originalFetch.apply(this, args);
    
    // Only intercept responses from our API
    if (args[0].includes('/api/parse') && args[1]?.method === 'POST') {
      // Clone the response so we can read it twice
      const clone = response.clone();
      
      try {
        // Get the response as JSON
        const data = await clone.json();
        
        // Apply our fix to ensure all required fields are present
        if (data.steps && Array.isArray(data.steps)) {
          data.steps.forEach(step => {
            if (step.type === 'RouterStep') {
              // Add default fields if missing for RouterStep
              step.modelName = step.modelName || 'Unknown';
              step.modelProvider = step.modelProvider || 'Unknown';
              step.tokens = step.tokens || { input: '0', output: '0', total: '0' };
              step.routeDecision = step.routeDecision || null;
              step.branchIds = step.branchIds || [];
            }
            else if (step.type === 'ExecutePipelineStep') {
              // Add default fields if missing for ExecutePipelineStep
              step.pipelineName = step.pipelineName || 'Unknown Pipeline';
              step.pipelineId = step.pipelineId || '';
              step.pipelineVersion = step.pipelineVersion || '';
              step.executionMode = step.executionMode || 'Standard';
              step.configuration = step.configuration || {};
              step.parameters = step.parameters || {};
              step.stepsCount = step.stepsCount || 0;
              step.childSteps = step.childSteps || [];
            }
            else if (step.type === 'InputStep') {
              // Add default fields if missing for InputStep
              step.source = step.source || '';
              step.inputType = step.inputType || '';
              step.contentType = step.contentType || '';
              step.format = step.format || '';
              step.size = step.size || '';
              step.timestamp = step.timestamp || '';
              step.user = step.user || '';
              step.sessionId = step.sessionId || '';
            }
            else if (step.type === 'OutputStep') {
              // Add default fields if missing for OutputStep
              step.destination = step.destination || '';
              step.outputType = step.outputType || '';
              step.contentType = step.contentType || '';
              step.format = step.format || '';
              step.size = step.size || '';
              step.deliveryStatus = step.deliveryStatus || '';
              step.deliveredAt = step.deliveredAt || '';
              step.recipients = step.recipients || [];
            }
          });
        }
        
        // Replace the response with our fixed data
        return new Response(JSON.stringify(data), {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      } catch (e) {
        console.error("Error in fetch interceptor:", e);
        // If anything goes wrong, return the original response
        return response;
      }
    }
    
    // For all other requests, return the original response
    return response;
  };
  
  console.log("Fix applied\! Now upload your log file.");
})();
