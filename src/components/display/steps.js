/**
 * Renderer for execution steps
 */
import { renderInputStep } from './step-renderers/input-step.js';
import { renderOutputStep } from './step-renderers/output-step.js';
import { renderMemoryStep } from './step-renderers/memory-step.js';
import { renderPythonStep } from './step-renderers/python-step.js';
import { renderAIOperationStep } from './step-renderers/ai-operation-step.js';
import { renderAPIToolStep } from './step-renderers/api-tool-step.js';
import { renderDataSearchStep } from './step-renderers/data-search-step.js';
import { renderRouterStep } from './step-renderers/router-step.js';
import { sanitizeString } from '../../lib/formatters.js';

/**
 * Render the common step fields
 * @param {object} step - The step data
 * @returns {string} - The rendered HTML
 */
function renderStepCommon(step) {
  return "<table class=\"table table-sm\">" +
    "<tr><th style=\"width: 150px;\">Step ID:</th><td>" + step.id + "</td></tr>" +
    "<tr><th>Type:</th><td>" + step.type + "</td></tr>" +
    "<tr><th>Duration:</th><td>" + step.duration + "</td></tr>" +
    "<tr><th>Started:</th><td>" + step.startedAt + "</td></tr>" +
    "<tr><th>Finished:</th><td>" + step.finishedAt + "</td></tr>";
}

/**
 * Render input for a step if present
 * @param {object} step - The step data
 * @returns {string} - The rendered HTML or empty string
 */
function renderStepInput(step) {
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

/**
 * Render output for a step if present
 * @param {object} step - The step data
 * @returns {string} - The rendered HTML or empty string
 */
function renderStepOutput(step) {
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

/**
 * Render a single step
 * @param {object} step - The step data to render
 * @param {number} index - The index of this step
 * @returns {string} - The rendered HTML
 */
function renderStep(step, index) {
  const stepType = step.type || "Unknown";
  
  let html = "<div class=\"accordion-item\">" +
    "<h2 class=\"accordion-header\">" +
    "<button class=\"accordion-button collapsed\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#collapse" + index + "\" " +
    "aria-expanded=\"false\" aria-controls=\"collapse" + index + "\">" +
    "Step " + (index + 1) + ": " + stepType + " <span class=\"ms-2 " + (step.success ? "text-success" : "text-danger") + "\">" + 
    (step.success ? "✓ Success" : "✗ Failed") + "</span>" +
    "</button></h2>" +
    "<div id=\"collapse" + index + "\" class=\"accordion-collapse collapse\">" +
    "<div class=\"accordion-body\">";
  
  // Start the table
  let tableHtml = renderStepCommon(step);
  
  // Add input if present (for all step types)
  tableHtml += renderStepInput(step);
  
  // Add type-specific content
  if (stepType === "InputStep") {
    tableHtml += renderInputStep(step);
  } else if (stepType === "OutputStep") {
    tableHtml += renderOutputStep(step);
  } else if (stepType === "MemoryLoadStep" || stepType === "MemoryStoreStep") {
    tableHtml += renderMemoryStep(step);
  } else if (stepType === "PythonStep") {
    tableHtml += renderPythonStep(step);
  } else if (stepType === "AIOperation") {
    tableHtml += renderAIOperationStep(step);
  } else if (stepType === "APIToolStep" || stepType === "WebAPIPluginStep") {
    tableHtml += renderAPIToolStep(step);
  } else if (stepType === "RouterStep") {
    tableHtml += renderRouterStep(step);
  }
  
  // Add output if present (for all step types)
  // Only add if not an InputStep (which already shows input) or OutputStep (which already shows output)
  if (stepType !== "InputStep" && stepType !== "OutputStep") {
    tableHtml += renderStepOutput(step);
  }
  
  // Add error if present
  if (step.error) {
    tableHtml += "<tr><th>Error:</th><td class=\"text-danger\">" + step.error + "</td></tr>";
  }
  
  // Close the table
  tableHtml += "</table>";
  
  // Add the table to the main HTML
  html += tableHtml;
  
  // Handle DataSearch step specially (since it has a custom rendering outside the table)
  if (stepType === "DataSearch" && step.searchResults) {
    html += renderDataSearchStep(step);
  }
  
  html += "</div></div></div>";
  
  return html;
}

/**
 * Render the full step list
 * @param {Array} steps - The steps to render
 * @returns {string} - The rendered HTML
 */
export function renderSteps(steps) {
  if (!steps || steps.length === 0) {
    return "<div class=\"alert alert-info\">No execution steps found.</div>";
  }
  
  let html = "<div class=\"accordion\" id=\"stepsAccordion\">";
  
  steps.forEach((step, index) => {
    html += renderStep(step, index);
  });
  
  html += "</div>";
  
  return html;
}