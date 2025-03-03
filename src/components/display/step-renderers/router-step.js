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
  console.log("ROUTER RENDERER RECEIVED:", JSON.stringify(step, null, 2));
  
  // Check if step is properly initialized
  const hasModelName = step.hasOwnProperty('modelName');
  const hasModelProvider = step.hasOwnProperty('modelProvider');
  const hasTokens = step.hasOwnProperty('tokens');
  const hasRouteDecision = step.hasOwnProperty('routeDecision');
  const hasBranchIds = step.hasOwnProperty('branchIds');
  
  console.log("ROUTER STEP FIELD CHECK:");
  console.log("- modelName:", hasModelName ? "Present" : "Missing");
  console.log("- modelProvider:", hasModelProvider ? "Present" : "Missing");
  console.log("- tokens:", hasTokens ? "Present" : "Missing");
  console.log("- routeDecision:", hasRouteDecision ? "Present" : "Missing");
  console.log("- branchIds:", hasBranchIds ? "Present" : "Missing");
  
  let html = "";
  
  // Always display model information, with default value if missing
  html += "<tr><th>Model:</th><td>" + (step.modelName || "Unknown") + "</td></tr>";
  html += "<tr><th>Provider:</th><td>" + (step.modelProvider || "Unknown") + "</td></tr>";
  
  // Always display token information, with default value if missing
  const tokens = step.tokens || { input: "0", output: "0", total: "0" };
  html += "<tr><th>Tokens:</th><td>Input: " + tokens.input + 
    ", Output: " + tokens.output + 
    ", Total: " + tokens.total + "</td></tr>";
  
  // Display routing decision if available, otherwise show placeholder
  html += "<tr><th>Route Decision:</th><td>";
  if (step.routeDecision) {
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
  } else {
    html += "<em>No routing decision data available</em>";
  }
  html += "</td></tr>";
  
  // Display branch IDs if available, otherwise show placeholder
  html += "<tr><th>Branch IDs:</th><td>";
  if (step.branchIds && step.branchIds.length > 0) {
    html += "<ul class=\"branch-ids\">";
    step.branchIds.forEach(id => {
      html += "<li>" + id + "</li>";
    });
    html += "</ul>";
  } else {
    html += "<em>No branch IDs available</em>";
  }
  html += "</td></tr>";
  
  console.log("ROUTER RENDERER GENERATED HTML:", html);
  
  return html;
}