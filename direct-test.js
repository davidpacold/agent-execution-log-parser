// Direct test for rendering step

import { parseLogData } from './src/lib/log-parser.js';
import { renderRouterStep } from './src/components/display/step-renderers/router-step.js';

// Sample log data with a RouterStep
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
      "Input": [
        {
          "$type": "input",
          "Value": "this was test input",
          "StepId": "9733f446-30ed-49cd-9d3b-d65e814c341d",
          "StepType": "InputStep"
        }
      ],
      "Result": {
        "$type": "branch",
        "Value": [
          {
            "$type": "input",
            "Value": "this was test input",
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
    }
  },
  "Success": true
};

// Run the test
function runTest() {
  // Parse the log data
  const parsedData = parseLogData(sampleData);
  const routerStep = parsedData.steps.find(s => s.type === "RouterStep");
  
  console.log("Parsed RouterStep object:", JSON.stringify(routerStep, null, 2));
  
  // Now render it
  const html = renderRouterStep(routerStep);
  console.log("\nRendered HTML output for RouterStep:");
  console.log(html);
  
  // Create a sample step object similar to what you're seeing in your UI
  const minimalStep = {
    id: routerStep.id,
    type: routerStep.type,
    duration: routerStep.duration,
    startedAt: routerStep.startedAt,
    finishedAt: routerStep.finishedAt
  };
  
  console.log("\nMinimal step that resembles what you see in UI:", JSON.stringify(minimalStep, null, 2));
  
  // Now try to render this minimal step
  const minimalHtml = renderRouterStep(minimalStep);
  console.log("\nRendered HTML output for minimal RouterStep:");
  console.log(minimalHtml);
  
  // Check for differences
  console.log("\nKey RouterStep fields that would be lost if using minimal object:");
  for (const key of Object.keys(routerStep)) {
    if (\!Object.keys(minimalStep).includes(key)) {
      console.log(`- ${key}`);
    }
  }
}

runTest();
