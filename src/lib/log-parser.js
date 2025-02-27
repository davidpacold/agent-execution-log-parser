/**
 * Core log parsing functionality
 */
import { formatDateTime } from './formatters.js';

/**
 * Detect the format of log data
 * @param {object} logData - The log data to analyze
 * @returns {object} - Format info with stepsData, isFormat1, and isFormat2 flags
 */
export function detectLogFormat(logData) {
  let stepsData = null;
  let isFormat1 = false;
  let isFormat2 = false;
  
  if (logData.StepsExecutionContext) {
    stepsData = logData.StepsExecutionContext;
    isFormat1 = true;
  } else if (Object.keys(logData).length > 0 && 
           logData[Object.keys(logData)[0]]?.stepId && 
           logData[Object.keys(logData)[0]]?.stepType) {
    stepsData = logData;
    isFormat2 = true;
  }
  
  return { stepsData, isFormat1, isFormat2 };
}

/**
 * Parse execution metadata from log data
 * @param {object} logData - The log data
 * @param {boolean} isFormat1 - Whether the log is in format 1
 * @param {boolean} isFormat2 - Whether the log is in format 2
 * @param {object} stepsData - The extracted steps data
 * @returns {object} - Parsed metadata with timing info
 */
export function parseExecutionMetadata(logData, isFormat1, isFormat2, stepsData) {
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

  return {
    executionId,
    userId,
    projectId,
    startTime,
    endTime,
    duration
  };
}

/**
 * Parse step common fields based on format
 * @param {object} step - The step data
 * @param {boolean} isFormat1 - Whether the log is in format 1
 * @returns {object} - The common step fields
 */
export function parseStepCommon(step, isFormat1) {
  return {
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
}

/**
 * Parse an input step
 * @param {object} step - The step data
 * @param {boolean} isFormat1 - Whether the log is in format 1
 * @returns {object} - The parsed input step data
 */
export function parseInputStep(step, isFormat1) {
  const resultValue = isFormat1 ? step.Result?.Value : step.result?.value;
  return {
    input: resultValue || ''
  };
}

/**
 * Parse an output step
 * @param {object} step - The step data 
 * @param {boolean} isFormat1 - Whether the log is in format 1
 * @returns {object} - The parsed output step data
 */
export function parseOutputStep(step, isFormat1) {
  const inputs = isFormat1 ? step.Input : step.input;
  let output = '';
  
  if (inputs && inputs.length > 0) {
    const outputValue = isFormat1 ? inputs[0]?.Value : inputs[0]?.value;
    output = outputValue || '';
  }
  
  return { output };
}

/**
 * Parse a memory load step
 * @param {object} step - The step data
 * @param {boolean} isFormat1 - Whether the log is in format 1
 * @returns {object} - The parsed memory load step data
 */
export function parseMemoryLoadStep(step, isFormat1) {
  if (isFormat1) {
    return {
      memoryKey: step.Result?.Key || '',
      memoryValue: step.Result?.Value || '',
      memoryType: step.Result?.$type || '',
      memoryOp: 'load'
    };
  } else {
    return {
      memoryKey: step.result?.key || '',
      memoryValue: step.result?.value || '',
      memoryType: step.result?.$type || '',
      memoryOp: 'load'
    };
  }
}

/**
 * Parse a memory store step
 * @param {object} step - The step data
 * @param {boolean} isFormat1 - Whether the log is in format 1
 * @returns {object} - The parsed memory store step data
 */
export function parseMemoryStoreStep(step, isFormat1) {
  const inputs = isFormat1 ? step.Input : step.input;
  if (inputs && inputs.length > 0) {
    const input = inputs[0];
    if (isFormat1) {
      return {
        memoryKey: input?.Key || '',
        memoryValue: input?.Value || '',
        memoryType: input?.$type || '',
        memoryOp: 'store'
      };
    } else {
      return {
        memoryKey: input?.key || '',
        memoryValue: input?.value || '',
        memoryType: input?.$type || '',
        memoryOp: 'store'
      };
    }
  }
  return { memoryOp: 'store' };
}

/**
 * Parse a Python step
 * @param {object} step - The step data
 * @param {boolean} isFormat1 - Whether the log is in format 1
 * @returns {object} - The parsed Python step data
 */
export function parsePythonStep(step, isFormat1) {
  const stepInfo = {};
  
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
  
  return stepInfo;
}

/**
 * Parse an AI operation step
 * @param {object} step - The step data
 * @param {boolean} isFormat1 - Whether the log is in format 1
 * @returns {object} - The parsed AI operation step data
 */
export function parseAIOperationStep(step, isFormat1) {
  const stepInfo = {};
  const debugInfo = isFormat1 ? step.DebugInformation : step.debugInformation;
  const resultValue = isFormat1 ? step.Result?.Value : step.result?.value;
  
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
  
  return stepInfo;
}

/**
 * Parse an API tool step
 * @param {object} step - The step data
 * @param {boolean} isFormat1 - Whether the log is in format 1 
 * @returns {object} - The parsed API tool step data
 */
export function parseAPIToolStep(step, isFormat1) {
  const stepInfo = {};
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
  
  return stepInfo;
}

/**
 * Parse a data search step
 * @param {object} step - The step data
 * @param {boolean} isFormat1 - Whether the log is in format 1
 * @returns {object} - The parsed data search step data
 */
export function parseDataSearchStep(step, isFormat1) {
  const stepInfo = {};
  
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
  
  return stepInfo;
}

/**
 * Main function to parse log data
 * @param {object} logData - The log data to parse
 * @returns {object} - The parsed result with overview, summary, steps, and errors
 */
export function parseLogData(logData) {
  // Detect the format of the log data
  const { stepsData, isFormat1, isFormat2 } = detectLogFormat(logData);
  
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
  
  // Get execution metadata
  const metadata = parseExecutionMetadata(logData, isFormat1, isFormat2, stepsData);
  
  const result = {
    overview: {
      success: isFormat1 ? logData.Success : overallSuccess,
      executionId: metadata.executionId,
      userId: metadata.userId,
      projectId: metadata.projectId,
      duration: metadata.duration,
      startedAt: metadata.startTime ? formatDateTime(metadata.startTime) : 'N/A',
      finishedAt: metadata.endTime ? formatDateTime(metadata.endTime) : 'N/A',
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
    const stepInfo = parseStepCommon(step, isFormat1);
    
    // Get the appropriate step type (handling case sensitivity differences)
    const stepType = stepInfo.type;
    
    // Add step-specific data based on step type
    if (stepType === 'InputStep') {
      Object.assign(stepInfo, parseInputStep(step, isFormat1));
    } else if (stepType === 'OutputStep') {
      Object.assign(stepInfo, parseOutputStep(step, isFormat1));
    } else if (stepType === 'MemoryLoadStep') {
      Object.assign(stepInfo, parseMemoryLoadStep(step, isFormat1));
    } else if (stepType === 'MemoryStoreStep') {
      Object.assign(stepInfo, parseMemoryStoreStep(step, isFormat1));
    } else if (stepType === 'PythonStep') {
      Object.assign(stepInfo, parsePythonStep(step, isFormat1));
    } else if (stepType === 'AIOperation') {
      Object.assign(stepInfo, parseAIOperationStep(step, isFormat1));
    } else if (stepType === 'APIToolStep' || stepType === 'WebAPIPluginStep') {
      Object.assign(stepInfo, parseAPIToolStep(step, isFormat1));
    } else if (stepType === 'DataSearch') {
      Object.assign(stepInfo, parseDataSearchStep(step, isFormat1));
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
  
  return result;
}