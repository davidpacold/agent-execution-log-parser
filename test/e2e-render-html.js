/**
 * This is a standalone script that tests the end-to-end rendering process
 * from raw log data to HTML
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseLogData } from '../src/lib/log-parser.js';
import { renderRouterStep } from '../src/components/display/step-renderers/router-step.js';
import { renderExecutePipelineStep } from '../src/components/display/step-renderers/execute-pipeline-step.js';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample data to test with
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
          "Value": "this was actually a blog post that Tal had writen so I am wanting to send him an email to summerise what jumped out from his blog to what Airia does",
          "StepId": "9733f446-30ed-49cd-9d3b-d65e814c341d",
          "StepType": "InputStep"
        }
      ],
      "Result": {
        "$type": "branch",
        "Value": [
          {
            "$type": "input",
            "Value": "this was actually a blog post that Tal had writen so I am wanting to send him an email to summerise what jumped out from his blog to what Airia does",
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

// Fields that should be present in a valid RouterStep
const EXPECTED_ROUTER_FIELDS = [
  'id',
  'type',
  'success',
  'duration',
  'startedAt',
  'finishedAt',
  'modelName',
  'modelProvider',
  'tokens',
  'routeDecision',
  'branchIds',
  'input',
  'output'
];

// Run the test
function runTest() {
  console.log("=== STARTING END-TO-END TEST ===");
  console.log("\n1. Parsing log data...");
  
  // Parse the log data
  const parsedData = parseLogData(sampleData);
  console.log("Parsing complete - found", parsedData.steps.length, "steps");
  
  // Find the RouterStep
  const routerStep = parsedData.steps.find(step => step.type === 'RouterStep');
  if (\!routerStep) {
    console.error("❌ ERROR: No RouterStep found in parsed data\!");
    process.exit(1);
  }
  
  console.log("\n2. Validating RouterStep fields...");
  
  // Check for all expected fields
  let missingFields = [];
  EXPECTED_ROUTER_FIELDS.forEach(field => {
    if (\!routerStep.hasOwnProperty(field)) {
      missingFields.push(field);
    }
  });
  
  if (missingFields.length > 0) {
    console.error("❌ ERROR: RouterStep is missing fields:", missingFields.join(', '));
    process.exit(1);
  }
  
  console.log("✅ All expected fields are present in the parsed RouterStep");
  console.log("  - modelName:", routerStep.modelName);
  console.log("  - modelProvider:", routerStep.modelProvider);
  console.log("  - tokens.input:", routerStep.tokens.input);
  console.log("  - tokens.output:", routerStep.tokens.output);
  console.log("  - routeDecision:", JSON.stringify(routerStep.routeDecision));
  console.log("  - branchIds.length:", routerStep.branchIds.length);
  
  console.log("\n3. Rendering RouterStep to HTML...");
  
  // Render the RouterStep to HTML
  const html = renderRouterStep(routerStep);
  
  // Validate the HTML contains key information
  const checks = [
    { name: "Model Name", pattern: /GPT-4o/, success: html.includes("GPT-4o") },
    { name: "Provider", pattern: /OpenAI/, success: html.includes("OpenAI") },
    { name: "Input Tokens", pattern: /Input: 551/, success: html.includes("Input: 551") },
    { name: "Output Tokens", pattern: /Output: 12/, success: html.includes("Output: 12") },
    { name: "Route Decision", pattern: /"route": "route 4"/, success: html.includes("route 4") || html.includes("\"route\": \"route 4\"") },
    { name: "Branch IDs", pattern: /c9b43ba3-b1f2-4659-9c98-38d54c6079d2/, success: html.includes("c9b43ba3-b1f2-4659-9c98-38d54c6079d2") }
  ];
  
  let renderingErrors = false;
  checks.forEach(check => {
    if (check.success) {
      console.log("✅ Rendered HTML includes", check.name);
    } else {
      console.error("❌ ERROR: Rendered HTML is missing", check.name);
      renderingErrors = true;
    }
  });
  
  if (renderingErrors) {
    console.error("\nRendered HTML has errors - check the logs above");
    // Write the HTML to a file for inspection
    fs.writeFileSync(path.join(__dirname, 'router-step-output.html'), html);
    console.error("HTML output has been written to test/router-step-output.html for inspection");
    process.exit(1);
  }
  
  console.log("\n4. Creating final JSON for API response...");
  
  // Create the final JSON that would be sent to the client
  const finalJson = JSON.stringify(parsedData);
  
  // Parse it back to an object to simulate what the client would receive
  const clientData = JSON.parse(finalJson);
  
  // Find the RouterStep in the client data
  const clientRouterStep = clientData.steps.find(step => step.type === 'RouterStep');
  
  if (\!clientRouterStep) {
    console.error("❌ ERROR: RouterStep lost in JSON serialization\!");
    process.exit(1);
  }
  
  // Check if all fields survived the JSON serialization
  let lostFields = [];
  EXPECTED_ROUTER_FIELDS.forEach(field => {
    if (\!clientRouterStep.hasOwnProperty(field)) {
      lostFields.push(field);
    }
  });
  
  if (lostFields.length > 0) {
    console.error("❌ ERROR: Fields lost in JSON serialization:", lostFields.join(', '));
    process.exit(1);
  }
  
  console.log("✅ All fields preserved in JSON serialization");
  
  // Final verification of key values
  const valueChecks = [
    { name: "modelName", expected: "GPT-4o", actual: clientRouterStep.modelName },
    { name: "modelProvider", expected: "OpenAI", actual: clientRouterStep.modelProvider },
    { name: "tokens.input", expected: "551", actual: clientRouterStep.tokens.input },
    { name: "tokens.output", expected: "12", actual: clientRouterStep.tokens.output }
  ];
  
  let valueErrors = false;
  valueChecks.forEach(check => {
    if (check.actual === check.expected) {
      console.log(`✅ Field ${check.name} has correct value: ${check.actual}`);
    } else {
      console.error(`❌ ERROR: Field ${check.name} has wrong value. Expected: ${check.expected}, Actual: ${check.actual}`);
      valueErrors = true;
    }
  });
  
  if (valueErrors) {
    console.error("\nValue errors found - check the logs above");
    process.exit(1);
  }
  
  // Write test artifacts to files
  fs.writeFileSync(path.join(__dirname, 'router-step-parsed.json'), JSON.stringify(routerStep, null, 2));
  fs.writeFileSync(path.join(__dirname, 'router-step-html.html'), html);
  fs.writeFileSync(path.join(__dirname, 'router-step-client.json'), JSON.stringify(clientRouterStep, null, 2));
  
  console.log("\n=== END-TO-END TEST PASSED ✅ ===");
  console.log("Test artifacts have been written to:");
  console.log("  - test/router-step-parsed.json (Parsed RouterStep)");
  console.log("  - test/router-step-html.html (Rendered HTML)");
  console.log("  - test/router-step-client.json (Client-side RouterStep)");
}

// Run the test and catch any errors
try {
  runTest();
} catch (error) {
  console.error("❌ FATAL ERROR:", error);
  process.exit(1);
}
