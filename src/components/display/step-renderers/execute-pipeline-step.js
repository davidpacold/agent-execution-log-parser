/**
 * Renderer for ExecutePipeline steps
 */
import { sanitizeString, formatJsonValue } from '../../../lib/formatters.js';

/**
 * Render an ExecutePipeline step
 * @param {object} step - The step data to render
 * @returns {string} - The rendered HTML
 */
export function renderExecutePipelineStep(step) {
  console.log("PIPELINE RENDERER RECEIVED:", JSON.stringify(step, null, 2));
  
  // Check if step is properly initialized
  const hasPipelineName = step.hasOwnProperty('pipelineName');
  const hasPipelineId = step.hasOwnProperty('pipelineId');
  const hasPipelineVersion = step.hasOwnProperty('pipelineVersion');
  const hasExecutionMode = step.hasOwnProperty('executionMode');
  const hasConfiguration = step.hasOwnProperty('configuration');
  const hasParameters = step.hasOwnProperty('parameters');
  const hasStepsCount = step.hasOwnProperty('stepsCount');
  const hasChildSteps = step.hasOwnProperty('childSteps');
  
  console.log("PIPELINE STEP FIELD CHECK:");
  console.log("- pipelineName:", hasPipelineName ? "Present" : "Missing");
  console.log("- pipelineId:", hasPipelineId ? "Present" : "Missing");
  console.log("- pipelineVersion:", hasPipelineVersion ? "Present" : "Missing");
  console.log("- executionMode:", hasExecutionMode ? "Present" : "Missing");
  console.log("- configuration:", hasConfiguration ? "Present" : "Missing");
  console.log("- parameters:", hasParameters ? "Present" : "Missing");
  console.log("- stepsCount:", hasStepsCount ? "Present" : "Missing");
  console.log("- childSteps:", hasChildSteps ? "Present" : "Missing");
  
  let html = "";
  
  // Always display pipeline information (with placeholder if missing)
  html += "<tr><th>Pipeline:</th><td>" + (step.pipelineName || "<em>Unknown pipeline</em>") + "</td></tr>";
  html += "<tr><th>Pipeline ID:</th><td>" + (step.pipelineId || "<em>No ID available</em>") + "</td></tr>";
  
  // Display version if available
  html += "<tr><th>Version:</th><td>" + (step.pipelineVersion || "<em>No version information</em>") + "</td></tr>";

  // Display execution mode if available
  html += "<tr><th>Execution Mode:</th><td>" + (step.executionMode || "<em>Standard execution</em>") + "</td></tr>";
  
  // Display configuration details if available
  html += "<tr><th>Configuration:</th><td>";
  if (step.configuration && Object.keys(step.configuration).length > 0) {
    try {
      const configJson = JSON.stringify(step.configuration, null, 2);
      html += "<pre class=\"pipeline-config\">" + sanitizeString(configJson) + "</pre>";
    } catch (e) {
      html += sanitizeString(String(step.configuration));
    }
  } else {
    html += "<em>No configuration data available</em>";
  }
  html += "</td></tr>";
  
  // Display parameters if available
  html += "<tr><th>Parameters:</th><td>";
  if (step.parameters && Object.keys(step.parameters).length > 0) {
    try {
      const paramsJson = JSON.stringify(step.parameters, null, 2);
      html += "<pre class=\"pipeline-params\">" + sanitizeString(paramsJson) + "</pre>";
    } catch (e) {
      html += sanitizeString(String(step.parameters));
    }
  } else {
    html += "<em>No parameters available</em>";
  }
  html += "</td></tr>";
  
  // Display steps count if available
  html += "<tr><th>Steps Count:</th><td>" + (step.stepsCount || "<em>Unknown</em>") + "</td></tr>";

  // Display child steps if available
  html += "<tr><th>Child Steps:</th><td>";
  if (step.childSteps && step.childSteps.length > 0) {
    html += "<div class=\"child-steps-list\">";
    
    step.childSteps.forEach(childStep => {
      const type = childStep.type || "Unknown";
      const status = childStep.success ? "<span class=\"text-success\">✓</span>" : "<span class=\"text-danger\">✗</span>";
      const duration = childStep.duration || "N/A";
      
      html += "<div class=\"child-step\">";
      html += "<div>" + status + " " + type + " (" + duration + ")</div>";
      
      if (childStep.id) {
        html += "<div class=\"text-muted small\">ID: " + childStep.id + "</div>";
      }
      
      html += "</div>";
    });
    
    html += "</div>";
  } else {
    html += "<em>No child steps information available</em>";
  }
  html += "</td></tr>";

  // Display execution stats if available
  html += "<tr><th>Execution Stats:</th><td>";
  if (step.stats) {
    try {
      const statsJson = JSON.stringify(step.stats, null, 2);
      html += "<pre class=\"pipeline-stats\">" + sanitizeString(statsJson) + "</pre>";
    } catch (e) {
      html += sanitizeString(String(step.stats));
    }
  } else {
    html += "<em>No execution statistics available</em>";
  }
  html += "</td></tr>";
  
  console.log("PIPELINE RENDERER GENERATED HTML:", html.substring(0, 100) + "...");
  
  return html;
}