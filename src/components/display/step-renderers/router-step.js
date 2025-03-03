/**
 * Renderer for Router steps
 */
import { sanitizeString } from '../../../lib/formatters.js';

/**
 * Render a router step
 * @param {object} step - The step data to render
 * @returns {string} - The rendered HTML
 */
export function renderRouterStep(step) {
  let html = "";
  
  // Display model information if available
  if (step.modelName) {
    html += "<tr><th>Model:</th><td>" + step.modelName + "</td></tr>";
  }
  
  if (step.modelProvider) {
    html += "<tr><th>Provider:</th><td>" + step.modelProvider + "</td></tr>";
  }
  
  // Display token information if available
  if (step.tokens) {
    html += "<tr><th>Tokens:</th><td>Input: " + step.tokens.input + 
      ", Output: " + step.tokens.output + 
      ", Total: " + step.tokens.total + "</td></tr>";
  }
  
  // Display routing decision if available
  if (step.routeDecision) {
    html += "<tr><th>Route Decision:</th><td>";
    
    if (typeof step.routeDecision === 'string') {
      html += sanitizeString(step.routeDecision);
    } else {
      try {
        const routeJson = JSON.stringify(step.routeDecision, null, 2);
        html += "<pre class=\"router-response\">" + sanitizeString(routeJson) + "</pre>";
      } catch (e) {
        html += sanitizeString(String(step.routeDecision));
      }
    }
    
    html += "</td></tr>";
  }
  
  // Display branch IDs if available
  if (step.branchIds && step.branchIds.length > 0) {
    html += "<tr><th>Branch IDs:</th><td>";
    html += "<ul class=\"branch-ids\">";
    
    step.branchIds.forEach(id => {
      html += "<li>" + id + "</li>";
    });
    
    html += "</ul></td></tr>";
  }
  
  return html;
}