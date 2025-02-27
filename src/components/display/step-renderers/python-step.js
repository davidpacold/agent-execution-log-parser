/**
 * Renderer for Python steps
 */
import { sanitizeString, formatJsonValue } from '../../../lib/formatters.js';

/**
 * Render a Python input or output item
 * @param {object} item - The input or output item to render
 * @returns {string} - The rendered HTML
 */
function renderPythonIO(item) {
  let html = "<div class=\"io-item\">";
  html += "<div class=\"io-type\">" + item.type + "</div>";
  
  let safeValue = item.value || "";
  if (safeValue) {
    // Try to format JSON if it looks like JSON
    safeValue = formatJsonValue(safeValue);
    safeValue = sanitizeString(safeValue);
  } else {
    safeValue = "<em>Empty</em>";
  }
  
  html += "<div class=\"io-value\">" + safeValue + "</div>";
  html += "</div>";
  
  return html;
}

/**
 * Render a Python step
 * @param {object} step - The step data to render
 * @returns {string} - The rendered HTML
 */
export function renderPythonStep(step) {
  let html = "";
  
  // Display Python inputs
  if (step.pythonInputs && step.pythonInputs.length > 0) {
    html += "<tr><th>Inputs:</th><td class=\"python-io\">";
    
    step.pythonInputs.forEach(input => {
      html += renderPythonIO(input);
    });
    
    html += "</td></tr>";
  }
  
  // Display Python output (Result)
  if (step.pythonOutput) {
    html += "<tr><th>Output:</th><td class=\"python-io\">";
    html += renderPythonIO(step.pythonOutput);
    html += "</td></tr>";
  }
  
  // Display additional outputs if available
  if (step.additionalOutputs && step.additionalOutputs.length > 0) {
    html += "<tr><th>Additional Outputs:</th><td class=\"python-io\">";
    
    step.additionalOutputs.forEach(output => {
      html += renderPythonIO(output);
    });
    
    html += "</td></tr>";
  }
  
  return html;
}