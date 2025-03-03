/**
 * Core log parsing functionality
 * @module log-parser
 */
import { formatDateTime } from './formatters.js';

// Maximum file size to process - default to 10MB
// Note: Cloudflare Workers don't have process.env in the global scope
const MAX_LOG_SIZE_MB = 10;
export const MAX_LOG_SIZE = MAX_LOG_SIZE_MB * 1024 * 1024;

/**
 * Step types supported by the parser
 * @enum {string}
 */
export const StepType = {
  INPUT: 'InputStep',
  OUTPUT: 'OutputStep',
  MEMORY_LOAD: 'MemoryLoadStep',
  MEMORY_STORE: 'MemoryStoreStep',
  PYTHON: 'PythonStep',
  AI_OPERATION: 'AIOperation',
  API_TOOL: 'APIToolStep',
  WEB_API: 'WebAPIPluginStep',
  DATA_SEARCH: 'DataSearch',
  ROUTER: 'RouterStep'
};

/**
 * Log format types
 * @enum {string}
 */
export const LogFormat = {
  /** Traditional format with StepsExecutionContext */
  STANDARD: 'STANDARD',
  /** Direct format with step IDs as keys */
  DIRECT: 'DIRECT',
  /** Unknown format */
  UNKNOWN: 'UNKNOWN'
};

/**
 * Detect the format of log data
 * @param {object} logData - The log data to analyze
 * @returns {object} - Format info with stepsData, format, and format flags
 */
export function detectLogFormat(logData) {
  let stepsData = null;
  let format = LogFormat.UNKNOWN;
  let isFormat1 = false;
  let isFormat2 = false;
  
  if (!logData) {
    return { stepsData, format, isFormat1, isFormat2 };
  }
  
  if (logData.StepsExecutionContext) {
    stepsData = logData.StepsExecutionContext;
    format = LogFormat.STANDARD;
    isFormat1 = true;
  } else if (Object.keys(logData).length > 0 && 
           logData[Object.keys(logData)[0]]?.stepId && 
           logData[Object.keys(logData)[0]]?.stepType) {
    stepsData = logData;
    format = LogFormat.DIRECT;
    isFormat2 = true;
  }
  
  return { stepsData, format, isFormat1, isFormat2 };
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
  const resultValue = isFormat1 ? step.Result?.Value : step.result?.value;
  const memoryKey = isFormat1 ? step.Result?.Key : step.result?.key;
  const memoryType = isFormat1 ? step.Result?.$type : step.result?.$type;
  
  // For load steps, the result is the output
  const stepInfo = {
    memoryKey: memoryKey || '',
    memoryValue: resultValue || '',
    memoryType: memoryType || '',
    memoryOp: 'load'
  };
  
  // Add output field for common display
  if (resultValue) {
    stepInfo.output = resultValue;
  }
  
  return stepInfo;
}

/**
 * Parse a memory store step
 * @param {object} step - The step data
 * @param {boolean} isFormat1 - Whether the log is in format 1
 * @returns {object} - The parsed memory store step data
 */
export function parseMemoryStoreStep(step, isFormat1) {
  const inputs = isFormat1 ? step.Input : step.input;
  const resultValue = isFormat1 ? step.Result?.Value : step.result?.value;
  const stepInfo = { memoryOp: 'store' };
  
  if (inputs && inputs.length > 0) {
    const input = inputs[0];
    const inputValue = isFormat1 ? input?.Value : input?.value;
    
    if (isFormat1) {
      stepInfo.memoryKey = input?.Key || '';
      stepInfo.memoryValue = inputValue || '';
      stepInfo.memoryType = input?.$type || '';
    } else {
      stepInfo.memoryKey = input?.key || '';
      stepInfo.memoryValue = inputValue || '';
      stepInfo.memoryType = input?.$type || '';
    }
    
    // For store steps, the input value is what we're storing
    if (inputValue) {
      stepInfo.input = inputValue;
    }
  }
  
  // If there was a result, add it as output
  if (resultValue) {
    stepInfo.output = resultValue;
  }
  
  return stepInfo;
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
  const resultValue = isFormat1 ? step.Result?.Value : step.result?.value;
  if (isFormat1) {
    stepInfo.pythonOutput = {
      type: step.Result?.$type || 'python',
      value: resultValue || ''
    };
  } else {
    stepInfo.pythonOutput = {
      type: step.result?.$type || 'python',
      value: resultValue || ''
    };
  }
  
  // Also set the output field for the common output display
  if (resultValue) {
    stepInfo.output = resultValue;
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
    
    // Also set the input field for the common input display
    const inputValues = inputs.map(input => isFormat1 ? input.Value : input.value).filter(Boolean);
    if (inputValues.length > 0) {
      stepInfo.input = inputValues.length === 1 ? inputValues[0] : inputValues;
    }
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
  
  let promptInput = null;
  
  // Extract prompts from messages array or from Input array
  if (debugInfo?.messages && debugInfo.messages.length > 0) {
    // Standardize the prompt format
    stepInfo.prompts = debugInfo.messages.map(message => {
      const role = message.Role?.toLowerCase() || message.role?.toLowerCase() || 'user';
      const content = message.TextContent || message.textContent || message.content || message.text || '';
      
      // Capture the user message as input
      if (role === 'user' && content && !promptInput) {
        promptInput = content;
      }
      
      return {
        role: role,
        content: content
      };
    }).filter(prompt => prompt.content);
  } else {
    const inputs = isFormat1 ? step.Input : step.input;
    if (inputs && inputs.length > 0) {
      // Try to get prompts from the Input array
      stepInfo.prompts = inputs.map(input => {
        const content = isFormat1 ? input.Value || '' : input.value || '';
        
        // Capture the first input as input
        if (content && !promptInput) {
          promptInput = content;
        }
        
        return {
          role: 'user',
          content: content
        };
      }).filter(prompt => prompt.content);
    }
  }
  
  // Set the input for common display
  if (promptInput) {
    stepInfo.input = promptInput;
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
    
    // Extract input parameters for the common input display
    if (debugInfo.tools[0]?.ToolParameters || debugInfo.tools[0]?.RequestParameters) {
      stepInfo.input = debugInfo.tools[0]?.ToolParameters || debugInfo.tools[0]?.RequestParameters;
    } else if (debugInfo.tools[0]?.RequestContent) {
      stepInfo.input = debugInfo.tools[0]?.RequestContent;
    }
    
    // Extract output for the common output display
    if (debugInfo.tools[0]?.ResponseContent) {
      stepInfo.output = debugInfo.tools[0]?.ResponseContent;
    }
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
    
    // Extract input parameters for the common input display
    if (step.tools[0]?.ToolParameters || step.tools[0]?.RequestParameters) {
      stepInfo.input = step.tools[0]?.ToolParameters || step.tools[0]?.RequestParameters;
    } else if (step.tools[0]?.RequestContent) {
      stepInfo.input = step.tools[0]?.RequestContent;
    }
    
    // Extract output for the common output display
    if (step.tools[0]?.ResponseContent) {
      stepInfo.output = step.tools[0]?.ResponseContent;
    }
  }
  
  // Check for step-level result
  const resultValue = isFormat1 ? step.Result?.Value : step.result?.value;
  if (resultValue && !stepInfo.output) {
    stepInfo.output = resultValue;
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
  const resultValue = isFormat1 ? step.Result?.Value : step.result?.value;
  
  if (resultValue) {
    try {
      stepInfo.searchResults = JSON.parse(resultValue);
      // Add the parsed results as output for common display
      stepInfo.output = stepInfo.searchResults;
    } catch (e) {
      console.error('Error parsing DataSearch results:', e);
      stepInfo.error = 'Error parsing search results: ' + e.message;
      stepInfo.rawData = resultValue;
      // Add the raw data as output for common display
      stepInfo.output = resultValue;
    }
  }
  
  // Try to extract query from inputs
  const inputs = isFormat1 ? step.Input : step.input;
  if (inputs && inputs.length > 0) {
    const queryValue = isFormat1 ? inputs[0]?.Value : inputs[0]?.value;
    if (queryValue) {
      stepInfo.input = queryValue;
    }
  }
  
  return stepInfo;
}

/**
 * Extract input for a step
 * @param {object} step - The step data 
 * @param {boolean} isFormat1 - Whether the log is in format 1
 * @returns {string|Array|null} - The extracted input or null if none
 */
export function extractStepInput(step, isFormat1) {
  const inputs = isFormat1 ? step.Input : step.input;
  
  if (inputs && Array.isArray(inputs) && inputs.length > 0) {
    // If inputs is an array, get the values
    const inputValues = inputs.map(input => isFormat1 ? input.Value : input.value).filter(Boolean);
    return inputValues.length === 1 ? inputValues[0] : inputValues.length > 1 ? inputValues : null;
  }
  
  // Some steps might have input in different properties
  return null;
}

/**
 * Extract output/response for a step
 * @param {object} step - The step data
 * @param {boolean} isFormat1 - Whether the log is in format 1
 * @returns {string|object|null} - The extracted output or null if none
 */
export function extractStepOutput(step, isFormat1) {
  // Check if this is a RouterStep, which often has debug info with response
  const stepType = isFormat1 ? step.StepType : step.stepType;
  if (stepType === 'RouterStep') {
    const debugInfo = isFormat1 ? step.DebugInformation : step.debugInformation;
    if (debugInfo?.response) {
      try {
        // Router responses are often JSON strings
        return JSON.parse(debugInfo.response);
      } catch (e) {
        return debugInfo.response;
      }
    }
  }
  
  // Check for Result/result which is common for many steps
  const resultValue = isFormat1 ? step.Result?.Value : step.result?.value;
  if (resultValue) return resultValue;
  
  // Check for Output/output array
  const outputs = isFormat1 ? step.Output : step.output;
  if (outputs && Array.isArray(outputs) && outputs.length > 0) {
    const outputValues = outputs.map(output => isFormat1 ? output.Value : output.value).filter(Boolean);
    return outputValues.length === 1 ? outputValues[0] : outputValues.length > 1 ? outputValues : null;
  }
  
  // Check for DebugInformation which might contain response
  const debugInfo = isFormat1 ? step.DebugInformation : step.debugInformation;
  if (debugInfo?.response) return debugInfo.response;
  
  return null;
}

/**
 * Parse a router step
 * @param {object} step - The step data
 * @param {boolean} isFormat1 - Whether the log is in format 1
 * @returns {object} - The parsed router step data
 */
export function parseRouterStep(step, isFormat1) {
  const stepInfo = {};
  const debugInfo = isFormat1 ? step.DebugInformation : step.debugInformation;
  
  // Capture model information if available
  if (debugInfo) {
    stepInfo.modelName = debugInfo.modelDisplayName || debugInfo.modelName || 'N/A';
    stepInfo.modelProvider = debugInfo.modelProviderType || 'N/A';
    
    // Extract token information
    if (debugInfo.inputTokens || debugInfo.outputTokens || debugInfo.totalTokens) {
      stepInfo.tokens = {
        input: debugInfo.inputTokens || '0',
        output: debugInfo.outputTokens || '0',
        total: debugInfo.totalTokens || '0',
      };
    }
    
    // Extract routing decision
    if (debugInfo.response) {
      try {
        stepInfo.routeDecision = JSON.parse(debugInfo.response);
      } catch (e) {
        stepInfo.routeDecision = debugInfo.response;
      }
    }
  }
  
  // If the result contains branch information
  if ((isFormat1 && step.Result?.$type === 'branch') || 
      (!isFormat1 && step.result?.$type === 'branch')) {
    const branchIds = isFormat1 ? step.Result?.BranchIds : step.result?.BranchIds;
    if (branchIds && Array.isArray(branchIds)) {
      stepInfo.branchIds = branchIds;
    }
  }
  
  return stepInfo;
}

/**
 * Handle parsing for a specific step type
 * @param {object} step - The step data
 * @param {string} stepType - The type of step
 * @param {boolean} isFormat1 - Whether the log is in format 1
 * @returns {object} - Parsed step data specific to the step type
 */
export function parseStepByType(step, stepType, isFormat1) {
  // First get type-specific data
  let stepData = {};
  
  switch(stepType) {
    case StepType.INPUT:
      stepData = parseInputStep(step, isFormat1);
      break;
    case StepType.OUTPUT:
      stepData = parseOutputStep(step, isFormat1);
      break;
    case StepType.MEMORY_LOAD:
      stepData = parseMemoryLoadStep(step, isFormat1);
      break;
    case StepType.MEMORY_STORE:
      stepData = parseMemoryStoreStep(step, isFormat1);
      break;
    case StepType.PYTHON:
      stepData = parsePythonStep(step, isFormat1);
      break;
    case StepType.AI_OPERATION:
      stepData = parseAIOperationStep(step, isFormat1);
      break;
    case StepType.API_TOOL:
    case StepType.WEB_API:
      stepData = parseAPIToolStep(step, isFormat1);
      break;
    case StepType.DATA_SEARCH:
      stepData = parseDataSearchStep(step, isFormat1);
      break;
    case StepType.ROUTER:
      stepData = parseRouterStep(step, isFormat1);
      break;
    default:
      // Return empty object for unknown step types
      break;
  }
  
  // Try to extract input and output for all step types if not already captured
  if (!stepData.input) {
    const input = extractStepInput(step, isFormat1);
    if (input) stepData.input = input;
  }
  
  if (!stepData.output && !stepData.response) {
    const output = extractStepOutput(step, isFormat1);
    if (output) stepData.output = output;
  }
  
  return stepData;
}

/**
 * Find input and output information for summary
 * @param {object} stepsData - The steps data to analyze
 * @param {boolean} isFormat1 - Whether the log is in format 1
 * @returns {object} - Input, output and success information
 */
export function findInputAndOutput(stepsData, isFormat1) {
  let userInput = '';
  let inputStepIds = [];
  let outputStepIds = [];
  let overallSuccess = true;
  
  for (const stepId in stepsData) {
    const step = stepsData[stepId];
    const stepType = isFormat1 ? step.StepType : step.stepType;
    
    if (!step.success) {
      overallSuccess = false;
    }
    
    if (stepType === StepType.INPUT) {
      inputStepIds.push(stepId);
      const resultValue = isFormat1 ? step.Result?.Value : step.result?.value;
      if (resultValue) {
        userInput = resultValue;
      }
    } else if (stepType === StepType.OUTPUT) {
      outputStepIds.push(stepId);
    }
  }
  
  return {
    userInput,
    inputStepIds,
    outputStepIds,
    overallSuccess
  };
}

/**
 * Find the final output from the parsed steps
 * @param {Array} steps - The parsed steps
 * @returns {string} - The final output
 */
export function findFinalOutput(steps) {
  let finalOutput = '';
  
  // First try to get from the last OutputStep
  const outputSteps = steps.filter(step => step.type === StepType.OUTPUT);
  if (outputSteps.length > 0) {
    const lastOutputStep = outputSteps[outputSteps.length - 1];
    if (lastOutputStep.output) {
      finalOutput = lastOutputStep.output;
    }
  }
  
  // If no output found, try the last AIOperation response
  if (!finalOutput) {
    const aiSteps = steps.filter(step => step.type === StepType.AI_OPERATION && step.response);
    if (aiSteps.length > 0) {
      const lastAIStep = aiSteps[aiSteps.length - 1];
      finalOutput = lastAIStep.response || '';
    }
  }
  
  return finalOutput;
}

/**
 * Main function to parse log data
 * @param {object} logData - The log data to parse
 * @returns {object} - The parsed result with overview, summary, steps, and errors
 */
export function parseLogData(logData) {
  // Detect the format of the log data
  const { stepsData, format, isFormat1, isFormat2 } = detectLogFormat(logData);
  
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
  
  // Find input, output and success information
  const { userInput, overallSuccess } = findInputAndOutput(stepsData, isFormat1);
  
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
      format: format,
    },
    summary: {
      userInput: userInput,
      finalOutput: '', // Will be set after steps are parsed and sorted
    },
    steps: [],
    errors: [],
  };
  
  // Parse steps
  for (const stepId in stepsData) {
    const step = stepsData[stepId];
    
    // Extract common fields based on format
    const stepInfo = parseStepCommon(step, isFormat1);
    
    // Get the appropriate step type
    const stepType = stepInfo.type;
    
    // Add step-specific data based on step type
    Object.assign(stepInfo, parseStepByType(step, stepType, isFormat1));
    
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
  
  // Now that steps are sorted, find the final output
  result.summary.finalOutput = findFinalOutput(result.steps);
  
  return result;
}