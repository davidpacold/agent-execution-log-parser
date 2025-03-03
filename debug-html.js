import { renderRouterStep } from './src/components/display/step-renderers/router-step.js';
import { sanitizeString } from './src/lib/formatters.js';
import fs from 'fs';

// First we create a mock for the functions we need
// since renderStepInput and renderStepOutput are not exported
function mockRenderStepInput(step) {
  if (!step.input) return '';
  
  let inputHtml = "<tr><th>Input:</th><td>";
  
  if (typeof step.input === 'string') {
    inputHtml += sanitizeString(step.input);
  } else if (Array.isArray(step.input)) {
    // If it's an array of inputs, display them as a list
    inputHtml += "<ol class=\"mb-0 ps-3\">";
    step.input.forEach(item => {
      inputHtml += "<li>" + sanitizeString(String(item)) + "</li>";
    });
    inputHtml += "</ol>";
  } else if (typeof step.input === 'object') {
    // If it's an object, display as JSON
    inputHtml += "<pre>" + sanitizeString(JSON.stringify(step.input, null, 2)) + "</pre>";
  } else {
    inputHtml += sanitizeString(String(step.input));
  }
  
  inputHtml += "</td></tr>";
  return inputHtml;
}

function mockRenderStepOutput(step) {
  // Check for either output or response (AI operations use response)
  const output = step.output || step.response;
  if (!output) return '';
  
  let outputHtml = "<tr><th>Output:</th><td>";
  
  if (typeof output === 'string') {
    outputHtml += sanitizeString(output);
  } else if (Array.isArray(output)) {
    // If it's an array of outputs, display them as a list
    outputHtml += "<ol class=\"mb-0 ps-3\">";
    output.forEach(item => {
      outputHtml += "<li>" + sanitizeString(String(item)) + "</li>";
    });
    outputHtml += "</ol>";
  } else if (typeof output === 'object') {
    // If it's an object, display as JSON
    outputHtml += "<pre>" + sanitizeString(JSON.stringify(output, null, 2)) + "</pre>";
  } else {
    outputHtml += sanitizeString(String(output));
  }
  
  outputHtml += "</td></tr>";
  return outputHtml;
}

// Create a test router step
const routerStep = {
  id: "cdfba459-3e62-4821-9d4b-3f712dd8297c",
  type: "RouterStep",
  duration: "00:00:00.7382941",
  startedAt: "03/02/2025, 19:31:06",
  finishedAt: "03/02/2025, 19:31:07",
  modelName: "GPT-4o",
  modelProvider: "OpenAI",
  tokens: {
    input: "533",
    output: "12",
    total: "545"
  },
  routeDecision: {
    route: "route 4"
  },
  branchIds: [
    "c9b43ba3-b1f2-4659-9c98-38d54c6079d2"
  ],
  input: "Research https://www.vic.gov.au/education for outreach to Robert Munoz.",
  output: {
    route: "route 4"
  },
  success: true
};

// Create HTML representation
function createHtmlPreview(step) {
  // Set up the common fields
  let tableHtml = `<table class="table table-sm">
  <tr><th style="width: 150px;">Step ID:</th><td>${step.id}</td></tr>
  <tr><th>Type:</th><td>${step.type}</td></tr>
  <tr><th>Duration:</th><td>${step.duration}</td></tr>
  <tr><th>Started:</th><td>${step.startedAt}</td></tr>
  <tr><th>Finished:</th><td>${step.finishedAt}</td></tr>`;
  
  // Add input
  tableHtml += mockRenderStepInput(step);
  
  // Add router-specific rendering
  tableHtml += renderRouterStep(step);
  
  // Add output
  tableHtml += mockRenderStepOutput(step);
  
  // Close the table
  tableHtml += "</table>";
  
  // Create a full HTML document
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Router Step HTML Test</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body { padding: 20px; }
    .router-response { background-color: #f8f9fa; padding: 10px; border-radius: 4px; }
    .branch-ids { margin-bottom: 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Router Step HTML Test</h1>
    <div class="card">
      <div class="card-header">Router Step Rendering</div>
      <div class="card-body">
        ${tableHtml}
      </div>
    </div>
  </div>
</body>
</html>`;
}

// Generate and save the HTML
const html = createHtmlPreview(routerStep);
fs.writeFileSync('router-step-test.html', html);
console.log("HTML test file created: router-step-test.html");
console.log("Open this file in a browser to see how the RouterStep renders");
console.log("\nRouter step specific HTML:");
console.log(renderRouterStep(routerStep));