/**
 * Renderer for Memory Load and Store steps
 */
import { sanitizeString } from '../../../lib/formatters.js';

/**
 * Render a memory step (load or store)
 * @param {object} step - The step data to render
 * @returns {string} - The rendered HTML
 */
export function renderMemoryStep(step) {
  let html = "";
  
  // Add operation type indicator
  const opLabel = step.memoryOp === "store" ? "Store" : "Load";
  
  html += "<tr><th>Operation:</th><td>" + opLabel + "</td></tr>";
  
  if (step.memoryKey) {
    html += "<tr><th>Memory Key:</th><td>" + step.memoryKey + "</td></tr>";
  }
  
  // For memory value, sanitize and handle as formatted content
  if (step.memoryValue) {
    // Sanitize memory value to prevent syntax errors
    let safeMemoryValue = sanitizeString(step.memoryValue);
    
    html += "<tr><th>Memory Value:</th><td class=\"memory-content\">" + safeMemoryValue + "</td></tr>";
  }
  
  if (step.memoryType) {
    html += "<tr><th>Memory Type:</th><td>" + step.memoryType + "</td></tr>";
  }
  
  return html;
}