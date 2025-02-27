/**
 * Renderer for Data Search steps
 */
import { sanitizeString } from '../../../lib/formatters.js';

/**
 * Render a Data Search step
 * @param {object} step - The step data to render
 * @returns {string} - The rendered HTML
 */
export function renderDataSearchStep(step) {
  if (!step.searchResults || !step.searchResults.Chunks || step.searchResults.Chunks.length === 0) {
    return '';
  }
  
  let html = "<div class=\"datasearch-container mt-3\">" +
    "<h5>Data Search Results</h5>" +
    "<p>Found " + step.searchResults.Chunks.length + " results</p>" +
    "<div class=\"table-responsive\">" +
    "<table class=\"table table-sm\">" +
    "<thead><tr><th>Score</th><th>Source</th><th>Content</th></tr></thead>" +
    "<tbody>";
  
  // Sort chunks by score
  const sortedChunks = Array.from(step.searchResults.Chunks).sort((a, b) => {
    return (b.Score || 0) - (a.Score || 0);
  });
  
  // Show top 5 chunks
  const topChunks = sortedChunks.slice(0, 5);
  
  for (const chunk of topChunks) {
    const score = chunk.Score || 0;
    const scorePercent = Math.round(score * 100);
    let scoreColor = "#dc3545"; // red
    
    if (score > 0.7) {
      scoreColor = "#28a745"; // green
    } else if (score > 0.5) {
      scoreColor = "#17a2b8"; // blue
    }
    
    const docName = chunk.Metadata && chunk.Metadata.DocumentName ? chunk.Metadata.DocumentName : "Unknown";
    const pageNum = chunk.Metadata && chunk.Metadata.pageNumber ? chunk.Metadata.pageNumber : "";
    let content = chunk.Chunk || "";
    
    // Safe way to replace newlines
    content = sanitizeString(content);
    
    html += "<tr>" +
      "<td><span class=\"score-badge\" style=\"background-color: " + scoreColor + ";\">" + scorePercent + "%</span></td>" +
      "<td><div class=\"source-doc\">" + docName + "</div>";
      
    if (pageNum) {
      html += "<div>Page " + pageNum + "</div>";
    }
    
    html += "</td><td>" + content + "</td></tr>";
  }
  
  html += "</tbody></table></div></div>";
  
  return html;
}