import { parseLogData } from './src/lib/log-parser.js';

// Sample log data for testing
const sampleLogData = {
  "Success": true,
  "ExecutionId": "9690b939-b4be-4e9d-87a0-b63e27c7ffec",
  "UserId": "01945cac-9b05-75a6-8719-0525b73608a2",
  "TimeTrackingData": {
      "duration": "00:00:38.3285269",
      "startedAt": "2025-03-03T00:31:06.8843974Z",
      "finishedAt": "2025-03-03T00:31:45.2257542Z"
  },
  "StepsExecutionContext": {
      "9733f446-30ed-49cd-9d3b-d65e814c341d": {
          "StepId": "9733f446-30ed-49cd-9d3b-d65e814c341d",
          "StepType": "InputStep",
          "DebugInformation": {
              "streamed": false
          },
          "TimeTrackingData": {
              "duration": "00:00:00.0004355",
              "startedAt": "2025-03-03T00:31:06.898928Z",
              "finishedAt": "2025-03-03T00:31:06.898934Z"
          },
          "Input": [],
          "Result": {
              "$type": "input",
              "Value": "Research https://www.vic.gov.au/education for outreach to Robert Munoz.",
              "StepId": "9733f446-30ed-49cd-9d3b-d65e814c341d",
              "StepType": "InputStep"
          },
          "Success": true
      },
      "cdfba459-3e62-4821-9d4b-3f712dd8297c": {
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
      },
      "c9b43ba3-b1f2-4659-9c98-38d54c6079d2": {
          "StepId": "c9b43ba3-b1f2-4659-9c98-38d54c6079d2",
          "StepType": "ExecutePipelineStep",
          "DebugInformation": {
              "streamed": false
          },
          "TimeTrackingData": {
              "duration": "00:00:25.7275034",
              "startedAt": "2025-03-03T00:31:07.638334Z",
              "finishedAt": "2025-03-03T00:31:33.3650016Z"
          },
          "Input": [
              {
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
              }
          ],
          "Result": {
              "$type": "agent",
              "Value": "Based on the research of the Victoria Department of Education website...",
              "StepId": "c9b43ba3-b1f2-4659-9c98-38d54c6079d2",
              "StepType": "ExecutePipelineStep"
          },
          "Success": true
      }
  }
};

// Function to test the parser
async function testParser() {
  console.log("\n=== Testing Log Parser ===\n");
  
  try {
    // Parse the log data
    const parsedData = parseLogData(sampleLogData);
    
    // Print overview
    console.log("=== Overview ===");
    console.log(parsedData.overview);
    console.log();
    
    // Print all steps
    console.log("=== Steps ===");
    parsedData.steps.forEach((step, index) => {
      console.log(`\n----- Step ${index + 1}: ${step.type} -----`);
      console.log(JSON.stringify(step, null, 2));
    });
  } catch (error) {
    console.error("Error parsing log data:", error);
  }
}

// Run the test
testParser().catch(console.error);