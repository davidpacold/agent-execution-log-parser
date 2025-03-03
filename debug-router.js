import { parseLogData, parseRouterStep } from './src/lib/log-parser.js';

// Simple router step sample
const routerStepData = {
  "StepId": "cdfba459-3e62-4821-9d4b-3f712dd8297c",
  "StepType": "RouterStep",
  "DebugInformation": {
    "modelName": "gpt-4o",
    "modelDisplayName": "GPT-4o",
    "modelId": "4940b03e-98ca-466a-bf9f-72347d3f252f",
    "inputTokens": "533",
    "outputTokens": "12",
    "totalTokens": "545",
    "modelProviderType": "OpenAI",
    "streamed": true,
    "response": "{\"route\":\"route 4\"}"
  },
  "TimeTrackingData": {
    "duration": "00:00:00.7382941",
    "startedAt": "2025-03-03T00:31:06.8994532Z",
    "finishedAt": "2025-03-03T00:31:07.6372437Z"
  },
  "Input": [
    {
      "$type": "input",
      "Value": "Research https://www.vic.gov.au/education for outreach to Robert Munoz.",
      "StepId": "9733f446-30ed-49cd-9d3b-d65e814c341d",
      "StepType": "InputStep"
    }
  ],
  "Result": {
    "$type": "branch",
    "Value": [
      {
        "$type": "input",
        "Value": "Research https://www.vic.gov.au/education for outreach to Robert Munoz.",
        "StepId": "9733f446-30ed-49cd-9d3b-d65e814c341d",
        "StepType": "InputStep"
      }
    ],
    "StepId": "cdfba459-3e62-4821-9d4b-3f712dd8297c",
    "StepType": "RouterStep",
    "BranchIds": [
      "c9b43ba3-b1f2-4659-9c98-38d54c6079d2"
    ]
  },
  "Success": true
};

// Test the router step parser directly
console.log("=== Testing Router Step Parser ===");
const parsedRouterStep = parseRouterStep(routerStepData, true); // true = isFormat1
console.log("Parsed Router Step:", JSON.stringify(parsedRouterStep, null, 2));

// Full sample log with a router step
const sampleLog = {
  "Success": true,
  "ExecutionId": "9690b939-b4be-4e9d-87a0-b63e27c7ffec",
  "StepsExecutionContext": {
    "cdfba459-3e62-4821-9d4b-3f712dd8297c": routerStepData
  }
};

// Test the full log parser
console.log("\n=== Testing Full Log Parser ===");
const parsedLog = parseLogData(sampleLog);
console.log("Router step from full parse:", 
  JSON.stringify(parsedLog.steps.find(s => s.type === 'RouterStep'), null, 2));