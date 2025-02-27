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
  
  // Add common step fields
  html += renderStepCommon(step);
  
  // Add type-specific content
  if (stepType === "InputStep") {
    html += renderInputStep(step);
  } else if (stepType === "OutputStep") {
    html += renderOutputStep(step);
  } else if (stepType === "MemoryLoadStep" || stepType === "MemoryStoreStep") {
    html += renderMemoryStep(step);
  } else if (stepType === "PythonStep") {
    html += renderPythonStep(step);
  } else if (stepType === "AIOperation") {
    html += renderAIOperationStep(step);
  } else if (stepType === "APIToolStep" || stepType === "WebAPIPluginStep") {
    html += renderAPIToolStep(step);
  }
  
  // Add error if present
  if (step.error) {
    html += "<tr><th>Error:</th><td class=\"text-danger\">" + step.error + "</td></tr>";
  }
  
  html += "</table>";
  
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