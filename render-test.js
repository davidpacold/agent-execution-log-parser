// Test rendering with minimal object
import { parseLogData } from './src/lib/log-parser.js';
import { renderRouterStep } from './src/components/display/step-renderers/router-step.js';

// Sample log data with RouterStep
const sampleData = {
  "StepsExecutionContext": {
    "cdfba459-3e62-4821-9d4b-3f712dd8297c": {
      "StepId": "cdfba459-3e62-4821-9d4b-3f712dd8297c",
      "StepType": "RouterStep",
      "DebugInformation": {
        "modelName": "gpt-4o",
        "modelDisplayName": "GPT-4o",
        "modelId": "4940b03e-98ca-466a-bf9f-72347d3f252f",
        "inputTokens": "551",
        "outputTokens": "12",
        "totalTokens": "563",
        "modelProviderType": "OpenAI",
        "streamed": true,
        "response": "{\"route\":\"route 4\"}"
      },
      "TimeTrackingData": {
        "duration": "00:00:00.6104932",
        "startedAt": "2025-03-03T03:09:11.7487035Z",
        "finishedAt": "2025-03-03T03:09:12.3580145Z"
      },
      "Input": [],
      "Result": {
        "$type": "branch",
        "StepId": "cdfba459-3e62-4821-9d4b-3f712dd8297c",
        "StepType": "RouterStep",
        "BranchIds": []
      },
      "Success": true
    }
  },
  "Success": true
};

// Run test
console.log("Starting test...");
const parsedData = parseLogData(sampleData);
const routerStep = parsedData.steps.find(s => s.type === "RouterStep");
console.log("Parsed RouterStep:", JSON.stringify(routerStep, null, 2));

// Create minimal object
const minimalStep = {
  id: "cdfba459-3e62-4821-9d4b-3f712dd8297c",
  type: "RouterStep",
  duration: "00:00:00.6104932",
  startedAt: "3/2/2025, 10:09:11 PM",
  finishedAt: "3/2/2025, 10:09:12 PM"
};
console.log("Minimal step:", JSON.stringify(minimalStep, null, 2));

// Try rendering both
console.log("\nRendering full RouterStep:");
console.log(renderRouterStep(routerStep));

console.log("\nRendering minimal RouterStep:");
console.log(renderRouterStep(minimalStep));
