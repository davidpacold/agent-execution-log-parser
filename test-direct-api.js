// Test script that directly calls the API endpoint and checks the response
import { parseLogData } from './src/lib/log-parser.js';

// Sample log data with router step
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

// Direct API test function
async function testDirectApi() {
  console.log("\n=== Direct API Test ===\n");
  
  try {
    // 1. Process directly with the parser (our baseline)
    const parsedData = parseLogData(sampleData);
    
    // Find the router step in the parsed data
    const routerStep = parsedData.steps.find(s => s.type === "RouterStep");
    console.log("1. DIRECT PARSER OUTPUT:", JSON.stringify(routerStep, null, 2));
    
    // 2. Construct the final output object that would usually be returned by the API
    const apiResponse = {
      overview: parsedData.overview,
      summary: parsedData.summary,
      steps: parsedData.steps,
      errors: parsedData.errors,
      meta: {
        api_version: "1.0.2",
        parsed_at: new Date().toISOString()
      }
    };
    
    // Find the router step in the API response
    const apiRouterStep = apiResponse.steps.find(s => s.type === "RouterStep");
    console.log("2. API RESPONSE OUTPUT:", JSON.stringify(apiRouterStep, null, 2));
    
    // 3. Check if any fields are lost
    const originalProps = Object.keys(routerStep).sort();
    const apiProps = Object.keys(apiRouterStep).sort();
    
    console.log("\n=== Field Comparison ===");
    console.log("Original fields:", originalProps.join(', '));
    console.log("API response fields:", apiProps.join(', '));
    
    // Log missing fields
    const missingFields = originalProps.filter(prop => \!apiProps.includes(prop));
    if (missingFields.length > 0) {
      console.log("\nMISSING FIELDS IN API RESPONSE:", missingFields.join(', '));
    } else {
      console.log("\nNo fields missing\! The issue must be elsewhere.");
    }
    
  } catch (error) {
    console.error("Error in direct API test:", error);
  }
}

// Run the test
testDirectApi().catch(console.error);
