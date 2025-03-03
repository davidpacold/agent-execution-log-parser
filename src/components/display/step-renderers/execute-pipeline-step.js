/**
 * Renderer for ExecutePipeline steps
 */
import { sanitizeString } from '../../../lib/formatters.js';

/**
 * Render an ExecutePipeline step
 * @param {object} step - The step data to render
 * @returns {string} - The rendered HTML
 */
export function renderExecutePipelineStep(step) {
  console.log("Rendering ExecutePipelineStep:", step.id);
  let html = "";
  
  // If there's any specific execution details, add them here
  // For now, we'll just return an empty string since most of the
  // information (input/output) is already handled by the common renderer
  
  return html;
}