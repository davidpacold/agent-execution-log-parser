import { parseLogData } from './src/lib/log-parser.js';

// Test the parser with a specific example
async function testSampleJson() {
  // This is the input data from your example that's not working correctly
  const sampleJson = {
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
            "Value": "this was actually a blog post that Tal had writen so I am wanting to send him an email to summerise what jumped out from his blog to what Airia does  ",
            "StepId": "9733f446-30ed-49cd-9d3b-d65e814c341d",
            "StepType": "InputStep"
          }
        ],
        "Result": {
          "$type": "branch",
          "Value": [
            {
              "$type": "input",
              "Value": "this was actually a blog post that Tal had writen so I am wanting to send him an email to summerise what jumped out from his blog to what Airia does  ",
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

  // Parse the data
  const parsedData = parseLogData(sampleJson);
  
  // Print the RouterStep result
  const routerStep = parsedData.steps.find(s => s.type === "RouterStep");
  console.log("PARSED ROUTER STEP:", JSON.stringify(routerStep, null, 2));
  
  // Now reconstruct the exact JSON that would be saved to your parsed result:
  const simplifiedJson = {
    "id": routerStep.id,
    "type": routerStep.type,
    "success": routerStep.success,
    "duration": routerStep.duration,
    "startedAt": routerStep.startedAt,
    "finishedAt": routerStep.finishedAt
  };
  
  console.log("\nSIMPLIFIED JSON (what you're seeing):", JSON.stringify(simplifiedJson, null, 2));
}

// Run the test
testSampleJson().catch(console.error);
