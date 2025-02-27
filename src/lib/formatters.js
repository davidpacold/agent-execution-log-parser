/**
 * Shared formatting utilities
 */

/**
 * Format a date time string
 * @param {string} dateTimeStr - The date time string to format
 * @returns {string} - The formatted date time string
 */
export function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return 'N/A';
  try {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  } catch (e) {
    return dateTimeStr;
  }
}

/**
 * Format a label for display by converting camelCase to Title Case With Spaces
 * @param {string} key - The key to format
 * @returns {string} - The formatted label
 */
export function formatLabel(key) {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");
}

/**
 * Sanitize a string for safe HTML embedding by escaping backslashes and converting newlines to <br> tags
 * @param {string} str - The string to sanitize
 * @returns {string} - The sanitized string
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  let result = str.split("\\").join("\\\\");
  result = result.split("\n").join("<br>");
  return result;
}

/**
 * Try to format a value as JSON if it appears to be a JSON string or object
 * @param {string|object} value - The value to format
 * @returns {string} - The formatted value
 */
export function formatJsonValue(value) {
  if (!value) return '<em>Empty</em>';

  try {
    if (typeof value === 'string' && 
      (value.trim().startsWith('{') || value.trim().startsWith('['))) {
      return JSON.stringify(JSON.parse(value), null, 2);
    } else if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
  } catch (e) {
    // If parsing fails, use as is
  }
  
  return String(value);
}

/**
 * Formats a size in bytes to a human-readable string
 * @param {number} bytes - The size in bytes
 * @returns {string} - The formatted size string
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  if (!bytes) return '0 B';
  
  return bytes > 1024 ? 
    (bytes/1024).toFixed(1) + " KB" : 
    bytes + " B";
}

/**
 * Format a duration in milliseconds to a human-readable string
 * @param {number} ms - The duration in milliseconds
 * @returns {string} - The formatted duration string
 */
export function formatDuration(ms) {
  if (!ms) return 'N/A';
  return (ms/1000).toFixed(2) + "s";
}