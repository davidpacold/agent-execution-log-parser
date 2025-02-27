/**
 * Rendering component for the summary section
 */

/**
 * Generate HTML for displaying the conversation summary
 * @param {object} summary - The summary data to display
 * @returns {string} - The HTML for the summary section
 */
export function renderSummary(summary) {
  let html = "";
  
  if (summary.userInput) {
    html += 
      "<div class=\"user-message\">" +
        "<div class=\"message-label\">User Input:</div>" +
        "<div class=\"message-content\">" + summary.userInput + "</div>" +
      "</div>";
  }
  
  if (summary.finalOutput) {
    html += 
      "<div class=\"ai-response\">" +
        "<div class=\"message-label\">Final Response:</div>" +
        "<div class=\"message-content\">" + summary.finalOutput + "</div>" +
      "</div>";
  }
  
  if (!summary.userInput && !summary.finalOutput) {
    html = "<div class=\"alert alert-info\">No conversation data available.</div>";
  }
  
  return html;
}