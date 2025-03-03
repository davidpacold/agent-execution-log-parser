// Test sending JSON directly to the endpoint
import fs from 'fs';

// The sample RouterStep data that's not being fully displayed
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

// Write sample data to a temporary file
fs.writeFileSync('./sample.json', JSON.stringify(sampleData, null, 2));

// Run parse.js with this file via the command line
console.log("Testing with sample RouterStep data - sending to the endpoint directly");
console.log("Try running this test and viewing the output in your application:");
console.log("\ncurl -X POST http://localhost:8787 -d @sample.json\n");
