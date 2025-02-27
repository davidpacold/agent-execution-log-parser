/**
 * Renderer for API Tool steps
 */
import { sanitizeString, formatBytes, formatDuration, formatJsonValue } from '../../../lib/formatters.js';

/**
 * Detect the tool type for custom response handling
 * @param {object} tool - The tool data
 * @returns {string} - The detected tool type
 */
function detectToolType(tool) {
  let toolType = "generic";
  
  if (tool.name && tool.name.includes("Bing") || tool.name && tool.name.includes("Search")) {
    toolType = "search";
  } else if (tool.name && tool.name.includes("Jira") || tool.url?.includes("atlassian")) {
    toolType = "jira";
  } else if (tool.name && tool.name.includes("Dataframe") || tool.name && tool.name.includes("Database") || tool.name && tool.name.includes("SQL")) {
    toolType = "data";
  } else if (tool.name && tool.name.includes("File") || tool.name && tool.name.includes("Document")) {
    toolType = "file";
  }
  
  return toolType;
}

/**
 * Render search results for Bing-like tools
 * @param {object} resultObj - The search results object
 * @returns {string} - The rendered HTML
 */
function renderSearchResults(resultObj) {
  let html = "<div class=\"search-results\" style=\"max-height: 350px; overflow-y: auto;\">";
    
  resultObj.webPages.value.forEach((page, i) => {
    const pageUrl = page.url ? page.url.split("\"").join("&quot;") : "";
    const pageName = page.name ? page.name.split("<").join("&lt;").split(">").join("&gt;") : "";
    const pageSnippet = page.snippet ? page.snippet.split("<").join("&lt;").split(">").join("&gt;") : "";
    
    html += "<div class=\"search-result\">" +
      "<div class=\"search-result-title\"><a href=\"" + pageUrl + "\" target=\"_blank\">" + pageName + "</a></div>" +
      "<div class=\"search-result-url\">" + pageUrl + "</div>" +
      "<div class=\"search-result-snippet\">" + pageSnippet + "</div>" +
      "</div>";
  });
  
  html += "</div>";
  return html;
}

/**
 * Render Jira projects data
 * @param {object} resultObj - The Jira data
 * @returns {string} - The rendered HTML
 */
function renderJiraProjects(resultObj) {
  let html = "<div class=\"jira-results\" style=\"max-height: 350px; overflow-y: auto;\">";
  
  html += "<table class=\"table table-sm jira-table\">" +
    "<thead><tr>" +
    "<th>Key</th><th>Name</th><th>Type</th><th>Style</th>" +
    "</tr></thead><tbody>";
  
  resultObj.values.forEach(project => {
    const key = project.key || "";
    const name = project.name || "";
    const type = project.projectTypeKey || "";
    const style = project.style || "";
    
    html += "<tr>" +
      "<td>" + key + "</td>" +
      "<td>" + name + "</td>" +
      "<td>" + type + "</td>" +
      "<td>" + style + "</td>" +
      "</tr>";
  });
  
  html += "</tbody></table>";
  html += "<div class=\"jira-meta\">Total: " + (resultObj.total || resultObj.values.length) + "</div>";
  html += "</div>";
  
  return html;
}

/**
 * Render Jira issues data
 * @param {object} resultObj - The Jira data
 * @returns {string} - The rendered HTML
 */
function renderJiraIssues(resultObj) {
  let html = "<div class=\"jira-results\" style=\"max-height: 350px; overflow-y: auto;\">";
  
  html += "<table class=\"table table-sm jira-table\">" +
    "<thead><tr>" +
    "<th>Key</th><th>Summary</th><th>Status</th><th>Priority</th>" +
    "</tr></thead><tbody>";
  
  resultObj.values.forEach(issue => {
    const key = issue.key || "";
    const summary = issue.fields?.summary || "";
    const status = issue.fields?.status?.name || "";
    const priority = issue.fields?.priority?.name || "";
    
    html += "<tr>" +
      "<td>" + key + "</td>" +
      "<td>" + summary + "</td>" +
      "<td>" + status + "</td>" +
      "<td>" + priority + "</td>" +
      "</tr>";
  });
  
  html += "</tbody></table>";
  html += "<div class=\"jira-meta\">Total: " + (resultObj.total || resultObj.values.length) + "</div>";
  html += "</div>";
  
  return html;
}

/**
 * Render data table for datasets
 * @param {Array} resultObj - The dataset array
 * @returns {string} - The rendered HTML
 */
function renderDataTable(resultObj) {
  let html = "<div class=\"data-results\" style=\"max-height: 350px; overflow-y: auto;\">";
  
  // Get all possible columns from the data
  const columns = new Set();
  resultObj.forEach(row => {
    if (typeof row === 'object' && row !== null) {
      Object.keys(row).forEach(key => columns.add(key));
    }
  });
  
  if (columns.size > 0) {
    html += "<table class=\"table table-sm data-table\">" +
      "<thead><tr>";
    
    columns.forEach(col => {
      html += "<th>" + col + "</th>";
    });
    
    html += "</tr></thead><tbody>";
    
    resultObj.forEach(row => {
      html += "<tr>";
      
      columns.forEach(col => {
        const value = row[col] !== undefined ? row[col] : "";
        html += "<td>" + value + "</td>";
      });
      
      html += "</tr>";
    });
    
    html += "</tbody></table>";
    html += "<div class=\"data-meta\">Rows: " + resultObj.length + "</div>";
  } else {
    // Not tabular data, show as JSON
    const safeJson = sanitizeString(JSON.stringify(resultObj, null, 2));
    html += "<pre class=\"api-response-content\">" + safeJson + "</pre>";
  }
  
  html += "</div>";
  
  return html;
}

/**
 * Render a single API tool
 * @param {object} tool - The API tool to render
 * @param {string} stepId - The ID of the parent step
 * @param {number} idx - The index of this tool
 * @returns {string} - The rendered HTML
 */
function renderApiTool(tool, stepId, idx) {
  const toolId = "api-" + stepId.replace(/[^a-zA-Z0-9]/g, "-") + "-" + idx;
  
  let html = "<div class=\"api-call\">";
  
  // Tool name and request info with collapse toggle
  html += "<div class=\"api-header\" data-bs-toggle=\"collapse\" data-bs-target=\"#" + toolId + "\" style=\"cursor: pointer;\">";
  html += "<div class=\"d-flex justify-content-between w-100 align-items-center\">";
  html += "<span class=\"api-name\">" + (tool.name || "Unknown") + "</span>";
  html += "<div>";
  html += "<span class=\"api-method mx-2\">" + tool.method + "</span>";
  if (tool.durationMs) {
    html += "<span class=\"text-muted me-2\" style=\"font-size: 0.8rem;\">" + formatDuration(tool.durationMs) + "</span>";
  }
  html += "<span class=\"collapse-indicator\">▼</span>";
  html += "</div></div></div>";
  html += "</div>";
  
  // Collapsible content
  html += "<div id=\"" + toolId + "\" class=\"collapse\">";
  
  // URL and summary info - make URL more prominent
  if (tool.url) {
    html += "<div class=\"api-url\" style=\"background-color: #ebf5ff; font-weight: bold;\"><strong>URL:</strong> " + tool.url + "</div>";
  }
  
  // Add request metrics summary
  if (tool.totalBytesSent || tool.totalBytesReceived || tool.durationMs) {
    html += "<div class=\"api-metrics\" style=\"font-size: 0.8rem; color: #6c757d; padding: 4px 8px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;\">";
    
    if (tool.durationMs) {
      html += "<span class=\"me-3\">⏱️ " + formatDuration(tool.durationMs) + "</span>";
    }
    
    if (tool.totalBytesSent) {
      html += "<span class=\"me-3\">📤 " + formatBytes(tool.totalBytesSent) + "</span>";
    }
    
    if (tool.totalBytesReceived) {
      html += "<span>📥 " + formatBytes(tool.totalBytesReceived) + "</span>";
    }
    
    html += "</div>";
  }
  
  // Parameters
  if (tool.parameters && Object.keys(tool.parameters).length > 0) {
    html += "<div class=\"api-section\">";
    html += "<div class=\"api-section-title\">Parameters:</div>";
    html += "<div class=\"api-parameters\">";
    
    try {
      let paramStr = "";
      if (typeof tool.parameters === 'object') {
        // Hide auth tokens with asterisks
        const safeParams = JSON.parse(JSON.stringify(tool.parameters));
        if (safeParams.Authorization) safeParams.Authorization = "****";
        if (safeParams.authorization) safeParams.authorization = "****";
        if (safeParams.token) safeParams.token = "****";
        
        paramStr = JSON.stringify(safeParams, null, 2);
      } else {
        paramStr = tool.parameters;
      }
      
      paramStr = sanitizeString(paramStr);
      html += "<pre class=\"api-parameter-content\">" + paramStr + "</pre>";
    } catch (e) {
      html += "<pre class=\"api-parameter-content\">" + 
        (typeof tool.parameters === 'string' ? tool.parameters : JSON.stringify(tool.parameters)) + 
        "</pre>";
    }
    
    html += "</div>";
    html += "</div>";
  }
  
  // Request content if available
  if (tool.requestContent) {
    html += "<div class=\"api-section\">";
    html += "<div class=\"api-section-title\">Request Body:</div>";
    
    try {
      let contentStr = formatJsonValue(tool.requestContent);
      contentStr = sanitizeString(contentStr);
      html += "<pre class=\"api-parameter-content\" style=\"background-color: #f5f5f5;\">" + contentStr + "</pre>";
    } catch (e) {
      html += "<pre class=\"api-parameter-content\" style=\"background-color: #f5f5f5;\">" + 
        String(tool.requestContent) + "</pre>";
    }
    
    html += "</div>";
  }
  
  // Response section
  html += "<div class=\"api-section\">";
  html += "<div class=\"api-section-title\">Response: <span class=\"api-status\">" + 
    (tool.statusCode ? "Status " + tool.statusCode : "No status code") + "</span></div>";
  
  if (tool.error) {
    html += "<div class=\"api-error\">" + tool.error + "</div>";
  }
  
  // First detect the tool type for custom handling
  let toolType = detectToolType(tool);
  
  if (tool.responseContent) {
    // Try to parse response as JSON, but don't fail if it's not
    let resultObj = null;
    let isValidJson = false;
    
    try {
      if (typeof tool.responseContent === 'string' && 
         (tool.responseContent.trim().startsWith('{') || tool.responseContent.trim().startsWith('['))) {
        resultObj = JSON.parse(tool.responseContent);
        isValidJson = true;
      } else if (typeof tool.responseContent === 'object') {
        resultObj = tool.responseContent;
        isValidJson = true;
      }
    } catch (e) {
      // Not valid JSON, will handle as text
    }
    
    // Format based on tool type
    if (toolType === "search" && isValidJson && resultObj.webPages && resultObj.webPages.value) {
      // Bing search results
      html += renderSearchResults(resultObj);
    } 
    else if (toolType === "jira" && isValidJson && resultObj.values && Array.isArray(resultObj.values)) {
      // Jira projects or issues
      if (resultObj.values.length > 0 && resultObj.values[0].key) {
        // Projects list
        html += renderJiraProjects(resultObj);
      } 
      else if (resultObj.values.length > 0 && resultObj.values[0].id) {
        // Issues list
        html += renderJiraIssues(resultObj);
      }
      else {
        // Generic Jira content, fallback to JSON
        const safeJson = sanitizeString(JSON.stringify(resultObj, null, 2));
        html += "<pre class=\"api-response-content\">" + safeJson + "</pre>";
      }
    }
    else if (toolType === "data" && isValidJson) {
      // Data response with potential table format
      if (Array.isArray(resultObj) && resultObj.length > 0) {
        // Try to render as table if it seems like a dataset
        html += renderDataTable(resultObj);
      } else {
        // Not an array, show as JSON
        const safeJson = sanitizeString(JSON.stringify(resultObj, null, 2));
        html += "<pre class=\"api-response-content\">" + safeJson + "</pre>";
      }
    }
    else if (isValidJson) {
      // Generic JSON formatting for all other tool types
      const safeJson = sanitizeString(JSON.stringify(resultObj, null, 2));
      html += "<pre class=\"api-response-content\">" + safeJson + "</pre>";
    } 
    else {
      // Plain text for non-JSON responses
      let formattedResponse = String(tool.responseContent);
      formattedResponse = sanitizeString(formattedResponse);
      html += "<div class=\"api-response-content\">" + formattedResponse + "</div>";
    }
  } else {
    html += "<div class=\"api-no-response\">No response content</div>";
  }
  
  html += "</div>";
  html += "</div></div>";
  
  return html;
}

/**
 * Render an API Tool step with multiple tools
 * @param {object} step - The step data to render
 * @returns {string} - The rendered HTML
 */
export function renderAPIToolStep(step) {
  let html = "<tr><th>Tool Name:</th><td>" + step.apiToolName + "</td></tr>";
  
  if (step.apiTools && step.apiTools.length > 0) {
    html += "<tr><th>API Calls:</th><td class=\"api-calls\">";
    
    step.apiTools.forEach((tool, idx) => {
      html += renderApiTool(tool, step.id, idx);
    });
    
    html += "</td></tr>";
  }
  
  return html;
}