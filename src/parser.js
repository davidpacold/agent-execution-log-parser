// Log parsing functions
import { formatDateTime } from './utils.js';

// Function to parse log file data
export function parseLogFile(logData) {
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
      } else if (step.StepType === 'DataSearch') {
        // Parse DataSearch information
        if (step.Result?.Value) {
          try {
            const dataSearchResult = JSON.parse(step.Result.Value);
            if (dataSearchResult.Chunks && Array.isArray(dataSearchResult.Chunks)) {
              // Add DataSearch results to stepInfo
              stepInfo.dataSearch = {
                datastoreId: step.Result?.DatastoreId || 'N/A',
                chunks: dataSearchResult.Chunks.map(chunk => {
                  return {
                    score: chunk.Score,
                    documentId: chunk.DocumentId,
                    documentName: chunk.Metadata?.DocumentName || 'N/A',
                    pageNumber: chunk.Metadata?.pageNumber || 'N/A',
                    content: chunk.Chunk,
                    sequenceNumber: chunk.SequenceNumber
                  };
                })
              };
              
              // Sort chunks by score (highest first)
              stepInfo.dataSearch.chunks.sort((a, b) => b.score - a.score);
            }
          } catch (e) {
            stepInfo.dataSearch = {
              error: 'Failed to parse data search results: ' + e.message,
              rawValue: step.Result.Value
            };
          }
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
      return new Date(a.startedAt) - new Date(b.startedAt);
    });
  }
  
  return result;
}