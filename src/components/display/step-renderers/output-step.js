/**
 * Renderer for Output steps
 */
import { sanitizeString, formatJsonValue } from '../../../lib/formatters.js';

/**
 * Render an output step
 * @param {object} step - The step data to render
 * @returns {string} - The rendered HTML
 */
export function renderOutputStep(step) {
  let html = "";
  
  // Always display destination information (with placeholder if missing)
  html += "<tr><th>Destination:</th><td>" + (step.destination || "<em>Default destination</em>") + "</td></tr>";
  html += "<tr><th>Output Type:</th><td>" + (step.outputType || "<em>Not specified</em>") + "</td></tr>";
  html += "<tr><th>Content Type:</th><td>" + (step.contentType || "<em>Not specified</em>") + "</td></tr>";
  
  // Output metadata if available
  html += "<tr><th>Metadata:</th><td>";
  if (step.metadata && Object.keys(step.metadata).length > 0) {
    try {
      const metadataJson = JSON.stringify(step.metadata, null, 2);
      html += "<pre class=\"output-metadata\">" + sanitizeString(metadataJson) + "</pre>";
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
  
  // Delivery status information
  html += "<tr><th>Delivery Status:</th><td>";
  if (step.deliveryStatus) {
    const statusClass = step.deliveryStatus.toLowerCase() === "delivered" ? "text-success" : 
                       (step.deliveryStatus.toLowerCase() === "failed" ? "text-danger" : "text-warning");
    html += "<span class=\"" + statusClass + "\">" + step.deliveryStatus + "</span>";
  } else {
    html += "<em>Status not available</em>";
  }
  html += "</td></tr>";
  
  // Delivery timestamp information
  html += "<tr><th>Delivered At:</th><td>" + (step.deliveredAt || "<em>Not recorded</em>") + "</td></tr>";
  
  // Recipients information
  html += "<tr><th>Recipients:</th><td>";
  if (step.recipients && step.recipients.length > 0) {
    if (Array.isArray(step.recipients)) {
      html += "<ul class=\"mb-0 ps-3\">";
      step.recipients.forEach(recipient => {
        html += "<li>" + recipient + "</li>";
      });
      html += "</ul>";
    } else {
      html += step.recipients;
    }
  } else {
    html += "<em>No recipients specified</em>";
  }
  html += "</td></tr>";
  
  return html;
}