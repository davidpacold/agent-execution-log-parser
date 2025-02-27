/**
 * Renderer for Tool Calls within AI Operation steps
 */
import { sanitizeString, formatJsonValue } from '../../../lib/formatters.js';

/**
 * Render a list of tool calls
 * @param {Array} tools - The tool calls to render
 * @param {string} stepId - The ID of the parent step
 * @returns {string} - The rendered HTML
 */
export function renderToolCalls(tools, stepId) {
  if (!tools || tools.length === 0) return '';
  
  let html = "<div class=\"tool-calls\">";
  
  tools.forEach((tool, index) => {
    const name = tool.name || "Unknown Tool";
    const id = tool.id || index;
    let args = tool.arguments || "";
    let result = tool.result || "";
    
    // Pretty format JSON if possible
    try {
      if (typeof args === "object") {
        args = JSON.stringify(args, null, 2);
      } else if (typeof args === "string") {
        // Try to parse as JSON first
        if (args.trim().startsWith("{") || args.trim().startsWith("[")) {
          args = JSON.stringify(JSON.parse(args), null, 2);
        }
      }
    } catch (e) {
      // Keep as is if not JSON
    }
    
    try {
      if (typeof result === "object") {
        result = JSON.stringify(result, null, 2);
      } else if (typeof result === "string") {
        // Try to parse as JSON first
        if (result.trim().startsWith("{") || result.trim().startsWith("[")) {
          result = JSON.stringify(JSON.parse(result), null, 2);
        }
      }
    } catch (e) {
      // Keep as is if not JSON
    }
    
    const toolId = "tool-" + stepId.replace(/[^a-zA-Z0-9]/g, "-") + "-" + index;
    
    // Make each tool call collapsible (collapsed by default)
    html += "<div class=\"tool-call\">" +
      "<div class=\"tool-header\" data-bs-toggle=\"collapse\" data-bs-target=\"#" + toolId + "\" style=\"cursor: pointer;\">" +
      "<div class=\"d-flex justify-content-between w-100 align-items-center\">" +
      "<span class=\"tool-name\">" + name + "</span>" +
      "<div>" +
      (id ? "<span class=\"tool-id me-2\">ID: " + id + "</span>" : "") +
      "<span class=\"collapse-indicator\">▼</span>" +
      "</div></div>" +
      "</div>" +
      "<div id=\"" + toolId + "\" class=\"collapse\">" +
      "<div class=\"tool-body\">";
    
    if (args) {
      html += "<div class=\"tool-arguments-label\"><strong>Arguments:</strong></div>" +
        "<div class=\"tool-arguments\">" + sanitizeString(args) + "</div>";
    }
    
    // Sanitize result to prevent syntax errors
    let displayResult = sanitizeString(result);
    
    // Add request URL if available
    if (tool.requestUrl) {
      html += "<div class=\"tool-url\"><strong>URL:</strong> " + tool.requestUrl + "</div>";
    }
    
    if (result) {
      // For other tool results
      html += "<div class=\"tool-result-label\"><strong>Result:</strong></div>" +
        "<div class=\"tool-result\">" + displayResult + "</div>";
    }
    
    html += "</div></div></div>";
  });
  
  html += "</div>";
  
  return html;
}