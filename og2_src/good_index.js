/**
 * Cloudflare Worker utility functions for handling requests
 * Agent Execution Log Parser
 */

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Handle CORS preflight requests
function handleOptions(request) {
  return new Response(null, {
    headers: corsHeaders
  });
}

// Format a date time string
function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return 'N/A';
  try {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  } catch (e) {
    return dateTimeStr;
  }
}

// Parse log data to extract structured information
function parseLogData(logData) {
  // Find input and output steps for summary
  let userInput = '';
  let finalOutput = '';
  let inputStepIds = [];
  let outputStepIds = [];
  
  if (logData.StepsExecutionContext) {
    // First, identify input and output steps
    for (const stepId in logData.StepsExecutionContext) {
      const step = logData.StepsExecutionContext[stepId];
      if (step.StepType === 'InputStep') {
        inputStepIds.push(stepId);
        if (step.Result?.Value) {
          userInput = step.Result.Value;
        }
      } else if (step.StepType === 'OutputStep') {
        outputStepIds.push(stepId);
        // We'll find the output value later after sorting
      }
    }
  }
  
  const result = {
    overview: {
      success: logData.Success,
      executionId: logData.ExecutionId || 'N/A',
      userId: logData.UserId || 'N/A',
      projectId: logData.ProjectId || 'N/A',
      duration: logData.TimeTrackingData?.duration || 'N/A',
      startedAt: formatDateTime(logData.TimeTrackingData?.startedAt),
      finishedAt: formatDateTime(logData.TimeTrackingData?.finishedAt),
    },
    summary: {
      userInput: userInput,
      finalOutput: finalOutput,
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
      } else if (step.StepType === 'OutputStep') {
        // For output steps, try to get the value from input array
        // This is because output steps typically receive their value from a previous step
        if (step.Input && step.Input.length > 0) {
          const outputValue = step.Input[0]?.Value;
          stepInfo.output = outputValue || '';
          
          // Update the final output if this is the last output step
          // We'll finalize this after sorting the steps
        }
      } else if (step.StepType === 'AIOperation') {
        stepInfo.modelName = step.DebugInformation?.modelDisplayName || step.DebugInformation?.modelName || 'N/A';
        stepInfo.modelProvider = step.DebugInformation?.modelProviderType || 'N/A';
        stepInfo.tokens = {
          input: step.DebugInformation?.inputTokens || '0',
          output: step.DebugInformation?.outputTokens || '0',
          total: step.DebugInformation?.totalTokens || '0',
        };
        
        // Extract prompts from messages array or from Input array
        if (step.DebugInformation?.messages && step.DebugInformation.messages.length > 0) {
          // Standardize the prompt format
          stepInfo.prompts = step.DebugInformation.messages.map(message => {
            return {
              role: message.Role?.toLowerCase() || message.role?.toLowerCase() || 'user',
              content: message.TextContent || message.content || message.text || ''
            };
          }).filter(prompt => prompt.content);
        } else if (step.Input && step.Input.length > 0) {
          // Try to get prompts from the Input array
          stepInfo.prompts = step.Input.map(input => {
            return {
              role: 'user',
              content: input.Value || ''
            };
          }).filter(prompt => prompt.content);
        }
        
        // Extract tool calls information
        if (step.DebugInformation?.tools && step.DebugInformation.tools.length > 0) {
          // Enhance the tool information for better display
          stepInfo.tools = step.DebugInformation.tools.map(tool => {
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
              result: tool.ResponseContent || tool.result || ''
            };
          });
        }
        
        // In case the AI operation provides a response directly
        if (step.Result?.Value) {
          stepInfo.response = step.Result.Value;
        }
      } else if (step.StepType === 'DataSearch' && step.Result && step.Result.Value) {
        try {
          stepInfo.searchResults = JSON.parse(step.Result.Value);
        } catch (e) {
          console.error('Error parsing DataSearch results:', e);
        }
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
  }
  
  return result;
}

export {
  corsHeaders,
  handleOptions,
  formatDateTime,
  parseLogData
};