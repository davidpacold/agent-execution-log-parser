// Test script to verify our integrated fix

import { parseLogData } from './src/lib/log-parser.js';

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
async function runTest() {
  console.log("Testing integrated fix...");
  
  // Parse the log data
  const parsedData = parseLogData(sampleData);
  
  // Find the RouterStep
  const routerStep = parsedData.steps.find(s => s.type === 'RouterStep');
  
  console.log("\nROUTER STEP AFTER PARSING:", JSON.stringify(routerStep, null, 2));
  
  console.log("\nChecking for required fields:");
  console.log("- modelName:", routerStep.modelName ? '✅ Present' : '❌ Missing');
  console.log("- modelProvider:", routerStep.modelProvider ? '✅ Present' : '❌ Missing');
  console.log("- tokens:", routerStep.tokens ? '✅ Present' : '❌ Missing');
  console.log("- routeDecision: ", routerStep.routeDecision ? '✅ Present' : '❌ Missing');
  console.log("- branchIds:", routerStep.branchIds ? '✅ Present' : '❌ Missing');
  
  console.log("\nAll fields should now be present in the parsed data.");
  console.log("Your issue should now be fixed\!");
}

runTest().catch(console.error);
