/**
 * Shared formatting utilities
 * @module formatters
 */

/**
 * Date format options
 * @type {Intl.DateTimeFormatOptions}
 */
const DATE_FORMAT_OPTIONS = { 
  year: 'numeric', 
  month: '2-digit', 
  day: '2-digit',
  hour: '2-digit', 
  minute: '2-digit', 
  second: '2-digit',
  hour12: false
};

/**
 * Format a date time string or Date object
 * @param {string|Date} dateTime - The date time string or Date object to format
 * @returns {string} - The formatted date time string
 */
export function formatDateTime(dateTime) {
  if (!dateTime) return 'N/A';
  
  try {
    // Handle if already a Date object
    const date = dateTime instanceof Date ? dateTime : new Date(dateTime);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    
    return date.toLocaleString(undefined, DATE_FORMAT_OPTIONS);
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'N/A';
  }
}

/**
 * Format a label for display by converting camelCase to Title Case With Spaces
 * @param {string} key - The key to format
 * @returns {string} - The formatted label
 */
export function formatLabel(key) {
  if (typeof key !== 'string') return '';
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");
}

/**
 * Sanitize a string for safe HTML embedding
 * @param {string} str - The string to sanitize
 * @returns {string} - The sanitized string
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return String(str);
  
  // Escape special characters
  let result = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\\/g, '\\\\');
  
  // Convert newlines to <br> tags
  result = result.split("\n").join("<br>");
  
  return result;
}

/**
 * Try to format a value as JSON if it appears to be a JSON string or object
 * @param {string|object} value - The value to format
 * @returns {string} - The formatted value
 */
export function formatJsonValue(value) {
  if (value === null || value === undefined) {
    return '<em>Empty</em>';
  }

  try {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        // Parse and re-stringify for pretty formatting
        return JSON.stringify(JSON.parse(trimmed), null, 2);
      }
    } else if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
  } catch (e) {
    console.debug('JSON formatting failed, using string representation:', e);
  }
  
  return String(value);
}

/**
 * Format file size in bytes to human-readable string with appropriate units
 * @param {number} bytes - The size in bytes
 * @param {number} [decimals=1] - Number of decimal places to show
 * @returns {string} - Formatted size with units
 */
export function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 Bytes';
  if (bytes === null || bytes === undefined || isNaN(bytes)) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * Format a duration in milliseconds to a human-readable string
 * @param {number|string} ms - The duration in milliseconds or as a string
 * @returns {string} - The formatted duration string
 */
export function formatDuration(ms) {
  if (ms === null || ms === undefined) return 'N/A';
  
  // Handle string input (e.g. "1000ms")
  if (typeof ms === 'string') {
    if (ms.endsWith('ms')) {
      ms = parseInt(ms.slice(0, -2), 10);
    } else {
      ms = parseInt(ms, 10);
    }
  }
  
  if (isNaN(ms)) return 'N/A';
  
  // Format based on size
  if (ms < 1000) {
    return ms + "ms";
  } else if (ms < 60000) {
    return (ms / 1000).toFixed(2) + "s";
  } else {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(1);
    return minutes + "m " + seconds + "s";
  }
}