/**
 * Renderer for AI Operation steps
 */
import { sanitizeString, formatJsonValue } from '../../../lib/formatters.js';
import { renderToolCalls } from './tool-calls.js';

/**
 * Render prompts list
 * @param {Array} prompts - The prompts to render
 * @returns {string} - The rendered HTML
 */
function renderPrompts(prompts) {
  if (!prompts || prompts.length === 0) return '';
  
  let html = "<div class=\"prompt-list\">";
  
  prompts.forEach(prompt => {
    const role = prompt.role || "user";
    const content = prompt.content || "";
    
    if (content) {
      // Sanitize content: escape backslashes and handle newlines
      let sanitizedContent = sanitizeString(content);
      
      // For system messages with large content (like instructions), add a collapsible section
      if (role === "system" && content.length > 500) {
        html += "<div class=\"prompt-item prompt-" + role + "\">" +
          "<div class=\"prompt-role\">" + role + "</div>" +
          "<details>" +
          "<summary>View full system message (" + Math.round(content.length/100)/10 + "KB)</summary>" +
          "<div class=\"prompt-content\">" + sanitizedContent + "</div>" +
          "</details>" +
          "</div>";
      } else {
        html += "<div class=\"prompt-item prompt-" + role + "\">" +
          "<div class=\"prompt-role\">" + role + "</div>" +
          "<div class=\"prompt-content\">" + sanitizedContent + "</div>" +
          "</div>";
      }
    }
  });
  
  html += "</div>";
  
  return html;
}

/**
 * Render an AI Operation step
 * @param {object} step - The step data to render
 * @returns {string} - The rendered HTML
 */
export function renderAIOperationStep(step) {
  let html = 
    "<tr><th>Model:</th><td>" + step.modelName + "</td></tr>" +
    "<tr><th>Provider:</th><td>" + step.modelProvider + "</td></tr>" +
    "<tr><th>Tokens:</th><td>Input: " + step.tokens.input + 
    ", Output: " + step.tokens.output + 
    ", Total: " + step.tokens.total + "</td></tr>";
    
  // Add prompts if available
  if (step.prompts && step.prompts.length > 0) {
    html += "<tr><th>Prompts:</th><td>" + renderPrompts(step.prompts) + "</td></tr>";
  }
  
  // Add tool calls if available
  if (step.tools && step.tools.length > 0) {
    html += "<tr><th>Tool Calls:</th><td>" + renderToolCalls(step.tools, step.id) + "</td></tr>";
  }
  
  // Add response if available
  if (step.response) {
    // Sanitize response to prevent syntax errors
    let safeResponse = sanitizeString(step.response);
    
    html += "<tr><th>Response:</th><td class=\"response\">" + safeResponse + "</td></tr>";
  }
  
  return html;
}