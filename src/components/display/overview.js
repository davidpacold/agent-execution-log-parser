/**
 * Rendering component for the overview section
 */
import { formatLabel } from '../../lib/formatters.js';

/**
 * Generate HTML for displaying the overview section
 * @param {object} overview - The overview data to display
 * @returns {string} - The HTML for the overview section
 */
export function renderOverview(overview) {
  let html = "";
  
  // Add format badge if present
  if (overview.format) {
    html += '<div class="format-badge">Log Format: ' + overview.format + '</div>';
  }
  
  // Display all other metrics
  for (const [key, value] of Object.entries(overview)) {
    // Skip format as we display it separately
    if (key === 'format') continue;
    
    const cssClass = key === "success" ? (value ? "success" : "error") : "";
    const displayValue = value === true ? "✓" : value === false ? "✗" : value;
    
    html += 
      "<div class=\"metric\">" +
        "<div class=\"metric-label\">" + formatLabel(key) + "</div>" +
        "<div class=\"metric-value " + cssClass + "\">" + displayValue + "</div>" +
      "</div>";
  }
  
  return html;
}