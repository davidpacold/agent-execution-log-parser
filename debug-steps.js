import { parseLogData } from './src/lib/log-parser.js';

// Create a mock for the steps.js renderStep function to show each step's HTML
function mockRenderStep(step) {
  let html = "<div class=\"step\">\n";
  
  // Add common fields
  html += `  <div class="common">\n`;
  html += `    <div>ID: ${step.id}</div>\n`;
  html += `    <div>Type: ${step.type}</div>\n`;
  html += `    <div>Duration: ${step.duration}</div>\n`;
  html += `  </div>\n`;
  
  // Add input if present
  if (step.input) {
    html += `  <div class="input">\n`;
    html += `    <h3>Input:</h3>\n`;
    if (typeof step.input === 'string') {
      html += `    <div>${step.input}</div>\n`;
    } else {
      html += `    <pre>${JSON.stringify(step.input, null, 2)}</pre>\n`;
    }
    html += `  </div>\n`;
  }
  
  // Add type-specific fields
  html += `  <div class="specific">\n`;
  if (step.type === 'RouterStep') {
    if (step.modelName) html += `    <div>Model: ${step.modelName}</div>\n`;
    if (step.modelProvider) html += `    <div>Provider: ${step.modelProvider}</div>\n`;
    if (step.tokens) html += `    <div>Tokens: Input ${step.tokens.input}, Output ${step.tokens.output}, Total ${step.tokens.total}</div>\n`;
    if (step.routeDecision) html += `    <div>Route Decision: <pre>${JSON.stringify(step.routeDecision, null, 2)}</pre></div>\n`;
    if (step.branchIds) html += `    <div>Branch IDs: ${step.branchIds.join(', ')}</div>\n`;
  }
  html += `  </div>\n`;
  
  // Add output if present
  if (step.output || step.response) {
    const output = step.output || step.response;
    html += `  <div class="output">\n`;
    html += `    <h3>Output:</h3>\n`;
    if (typeof output === 'string') {
      html += `    <div>${output}</div>\n`;
    } else {
      html += `    <pre>${JSON.stringify(output, null, 2)}</pre>\n`;
    }
    html += `  </div>\n`;
  }
  
  html += "</div>\n";
  return html;
}

// Create the test
async function testSteps() {
  // Sample log data for a RouterStep
  const sampleLogData = {
    "Success": true,
    "ExecutionId": "9690b939-b4be-4e9d-87a0-b63e27c7ffec",
    "StepsExecutionContext": {
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
      }
    }
  };
  
  // Parse the data
  const parsedData = parseLogData(sampleLogData);
  
  // Render each step with our mock function
  parsedData.steps.forEach((step, index) => {
    console.log(`\n--- Step ${index + 1}: ${step.type} ---\n`);
    console.log(mockRenderStep(step));
  });
}

// Execute the test
testSteps().catch(console.error);