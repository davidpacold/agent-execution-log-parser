/**
 * Rendering component for error displays
 */

/**
 * Generate HTML for displaying execution errors
 * @param {Array} errors - The errors to display
 * @returns {string} - The HTML for the errors section
 */
export function renderErrors(errors) {
  if (!errors || errors.length === 0) {
    return "";
  }
  
  let html = "<h3>Execution Errors (" + errors.length + ")</h3><ul>";
  
  for (const error of errors) {
    const stepType = error.stepType || "Unknown";
    const stepId = error.stepId ? error.stepId.substring(0, 8) + "..." : "N/A";
    const message = error.message || "No error message";
    
    html += "<li>" +
      "<strong>" + stepType + " (" + stepId + "):</strong>" +
      "<div>" + message + "</div>" +
    "</li>";
  }
  
  html += "</ul>";
  
  return html;
}