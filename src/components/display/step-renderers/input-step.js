/**
 * Renderer for Input steps
 */
import { sanitizeString } from '../../../lib/formatters.js';

/**
 * Render an input step
 * @param {object} step - The step data to render
 * @returns {string} - The rendered HTML
 */
export function renderInputStep(step) {
  if (!step.input) return '';
  
  return "<tr><th>Input:</th><td>" + sanitizeString(step.input) + "</td></tr>";
}