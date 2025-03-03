import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect, beforeEach } from 'vitest';
import worker from '../src';
import { parseLogData, LogFormat } from '../src/lib/log-parser';
import { formatDateTime, formatDuration } from '../src/lib/formatters';

// Mock log data for testing
const mockStandardFormat = {
  StepsExecutionContext: {
    "step1": {
      StepId: "step1",
      StepType: "InputStep",
      success: true,
      TimeTrackingData: {
        startedAt: "2023-01-01T10:00:00.000Z",
        finishedAt: "2023-01-01T10:00:01.000Z",
        duration: "1000ms"
      },
      Result: {
        Value: "Test input"
      }
    },
    "step2": {
      StepId: "step2",
      StepType: "OutputStep",
      success: true,
      TimeTrackingData: {
        startedAt: "2023-01-01T10:00:02.000Z",
        finishedAt: "2023-01-01T10:00:03.000Z",
        duration: "1000ms"
      },
      Input: [
        {
          Value: "Test output"
        }
      ]
    }
  },
  ExecutionId: "test-execution",
  UserId: "test-user",
  ProjectId: "test-project",
  Success: true,
  TimeTrackingData: {
    startedAt: "2023-01-01T10:00:00.000Z",
    finishedAt: "2023-01-01T10:00:03.000Z",
    duration: "3000ms"
  }
};

const mockDirectFormat = {
  "step1": {
    stepId: "step1",
    stepType: "InputStep",
    success: true,
    timeTrackingData: {
      startedAt: "2023-01-01T10:00:00.000Z",
      finishedAt: "2023-01-01T10:00:01.000Z",
      duration: "1000ms"
    },
    result: {
      value: "Test input"
    }
  },
  "step2": {
    stepId: "step2",
    stepType: "OutputStep",
    success: true,
    timeTrackingData: {
      startedAt: "2023-01-01T10:00:02.000Z",
      finishedAt: "2023-01-01T10:00:03.000Z",
      duration: "1000ms"
    },
    input: [
      {
        value: "Test output"
      }
    ]
  }
};

describe('Worker responses', () => {
  let ctx;
  
  beforeEach(() => {
    ctx = createExecutionContext();
  });
  
  it('serves HTML UI for GET requests', async () => {
    const request = new Request('http://example.com');
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
    
    const text = await response.text();
    expect(text).toContain('<!DOCTYPE html>');
  });

  it('handles POST requests with log data', async () => {
    const request = new Request('http://example.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mockStandardFormat)
    });
    
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    
    const result = await response.json();
    expect(result.overview.success).toBe(true);
    expect(result.overview.executionId).toBe('test-execution');
    expect(result.steps.length).toBe(2);
  });

  it('handles CORS preflight requests', async () => {
    const request = new Request('http://example.com', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://example.com',
        'Access-Control-Request-Method': 'POST'
      }
    });
    
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    
    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
  });
});

describe('Log Parser', () => {
  it('correctly parses standard format logs', () => {
    const result = parseLogData(mockStandardFormat);
    
    expect(result.overview.success).toBe(true);
    expect(result.overview.executionId).toBe('test-execution');
    expect(result.overview.format).toBe(LogFormat.STANDARD);
    expect(result.summary.userInput).toBe('Test input');
    expect(result.summary.finalOutput).toBe('Test output');
    expect(result.steps.length).toBe(2);
    
    // Check step details
    const inputStep = result.steps.find(s => s.type === 'InputStep');
    const outputStep = result.steps.find(s => s.type === 'OutputStep');
    
    expect(inputStep.input).toBe('Test input');
    expect(outputStep.output).toBe('Test output');
  });
  
  it('correctly parses direct format logs', () => {
    const result = parseLogData(mockDirectFormat);
    
    expect(result.overview.success).toBe(true);
    expect(result.overview.format).toBe(LogFormat.DIRECT);
    expect(result.summary.userInput).toBe('Test input');
    expect(result.summary.finalOutput).toBe('Test output');
    expect(result.steps.length).toBe(2);
  });
  
  it('handles unknown log formats', () => {
    const result = parseLogData({ randomData: true });
    
    expect(result.overview.success).toBe(false);
    expect(result.overview.error).toBe('Unknown log format');
    expect(result.steps.length).toBe(0);
    expect(result.errors.length).toBe(1);
  });
});

describe('Formatters', () => {
  it('formats date-time strings correctly', () => {
    const date = new Date('2023-01-01T12:34:56.789Z');
    const formatted = formatDateTime(date);
    
    expect(formatted).not.toBe('N/A');
    expect(formatted).toContain('2023');
  });
  
  it('handles invalid dates', () => {
    const formatted = formatDateTime(null);
    expect(formatted).toBe('N/A');
    
    const invalidFormatted = formatDateTime('not-a-date');
    expect(invalidFormatted).toBe('N/A');
  });
  
  it('formats durations correctly', () => {
    expect(formatDuration(1500)).toBe('1.50s');
    expect(formatDuration('1500ms')).toBe('1.50s');
    expect(formatDuration(500)).toBe('500ms');
    expect(formatDuration(90000)).toBe('1m 30.0s');
  });
});
