/**
 * Client-side log parser logic
 * 
 * This is essentially the same as the server-side parser,
 * but adapted for client-side use.
 */
import { formatDateTime } from '../../lib/formatters.js';

/**
 * Main function to parse log data on the client side
 * @param {object} logData - The log data to parse
 * @returns {object} - The parsed result
 */
export function parseLogData(logData) {
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
      success: step.success,
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