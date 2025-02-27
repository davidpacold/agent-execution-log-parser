/**
 * Renderer for Output steps
 */
import { sanitizeString } from '../../../lib/formatters.js';

/**
 * Render an output step
 * @param {object} step - The step data to render
 * @returns {string} - The rendered HTML
 */
export function renderOutputStep(step) {
  if (!step.output) return '';
  
  return "<tr><th>Output:</th><td>" + sanitizeString(step.output) + "</td></tr>";
}