/**
 * Renderer for Input steps
 */
import { sanitizeString, formatJsonValue } from '../../../lib/formatters.js';

/**
 * Render an input step
 * @param {object} step - The step data to render
 * @returns {string} - The rendered HTML
 */
export function renderInputStep(step) {
  let html = "";
  
  // Always display source information (with placeholder if missing)
  html += "<tr><th>Source:</th><td>" + (step.source || "<em>Unknown source</em>") + "</td></tr>";
  html += "<tr><th>Input Type:</th><td>" + (step.inputType || "<em>Not specified</em>") + "</td></tr>";
  html += "<tr><th>Content Type:</th><td>" + (step.contentType || "<em>Not specified</em>") + "</td></tr>";
  
  // Input metadata if available
  html += "<tr><th>Metadata:</th><td>";
  if (step.metadata && Object.keys(step.metadata).length > 0) {
    try {
      const metadataJson = JSON.stringify(step.metadata, null, 2);
      html += "<pre class=\"input-metadata\">" + sanitizeString(metadataJson) + "</pre>";
    } catch (e) {
      html += sanitizeString(String(step.metadata));
    }
  } else {
    html += "<em>No metadata available</em>";
  }
  html += "</td></tr>";
  
  // Always display format information (with placeholder if missing)
  html += "<tr><th>Format:</th><td>" + (step.format || "<em>Not specified</em>") + "</td></tr>";
  
  // Size information
  html += "<tr><th>Size:</th><td>";
  if (step.size) {
    html += step.size + " bytes";
  } else {
    html += "<em>Size information not available</em>";
  }
  html += "</td></tr>";
  
  // Timestamp information
  html += "<tr><th>Timestamp:</th><td>" + (step.timestamp || "<em>Not recorded</em>") + "</td></tr>";
  
  // User information
  html += "<tr><th>User:</th><td>" + (step.user || "<em>Anonymous</em>") + "</td></tr>";
  
  // Session information
  html += "<tr><th>Session ID:</th><td>" + (step.sessionId || "<em>Not available</em>") + "</td></tr>";
  
  return html;
}