/**
 * CSS styles for the log parser UI
 */

export function getStyles() {
  return `
    :root {
      --primary-color: #2563eb;
      --primary-hover: #1d4ed8;
      --success-color: #10b981;
      --error-color: #ef4444;
      --warning-color: #f59e0b;
      --background: #f9fafb;
      --card-bg: #ffffff;
      --text-color: #1f2937;
      --text-secondary: #6b7280;
      --border-color: #e5e7eb;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
      line-height: 1.6;
      color: var(--text-color);
      background-color: var(--background);
      padding-top: 20px;
      padding-bottom: 60px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    h1 {
      margin-bottom: 0.5rem;
      color: var(--primary-color);
    }
    
    .description {
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto 2rem auto;
    }
    
    .hidden {
      display: none;
    }
    
    pre {
      white-space: pre-wrap;
    }
    
    .datasearch-container {
      border-left: 4px solid #4e42d4;
      padding-left: 15px;
      margin-top: 10px;
    }
    
    .score-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 12px;
      color: white;
      font-weight: bold;
      font-size: 0.75rem;
      text-align: center;
    }
    
    .source-doc {
      font-weight: bold;
    }
    
    .overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .metric {
      padding: 0.75rem;
      border-radius: 0.375rem;
      background-color: #f3f4f6;
    }
    
    .metric-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 0.25rem;
    }
    
    .metric-value {
      font-weight: 600;
      font-size: 1.125rem;
      word-break: break-all;
    }
    
    .success {
      color: var(--success-color);
    }
    
    .error {
      color: var(--error-color);
    }
    
    .copy-json-btn {
      background-color: #6b7280;
      margin-left: 0.5rem;
    }
    
    .conversation-summary {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .user-message, .ai-response {
      padding: 1rem;
      border-radius: 0.5rem;
      max-width: 95%;
    }
    
    .user-message {
      background-color: #f3f4f6;
      align-self: flex-start;
      border-bottom-left-radius: 0;
    }
    
    .ai-response {
      background-color: #e9f5ff;
      align-self: flex-end;
      border-bottom-right-radius: 0;
    }
    
    .message-label {
      font-weight: bold;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .message-content {
      white-space: pre-wrap;
      overflow-wrap: break-word;
    }
    
    .prompt-list {
      margin-bottom: 1rem;
    }
    
    .prompt-item {
      padding: 0.75rem;
      border-radius: 0.375rem;
      margin-bottom: 0.5rem;
    }
    
    .prompt-user {
      background-color: #f3f4f6;
      border-left: 3px solid #6b7280;
    }
    
    .prompt-system {
      background-color: #f0f9ff;
      border-left: 3px solid #0ea5e9;
    }
    
    .prompt-assistant {
      background-color: #f0fdf4;
      border-left: 3px solid #10b981;
    }
    
    .prompt-role {
      font-weight: bold;
      margin-bottom: 0.25rem;
      font-size: 0.75rem;
      text-transform: uppercase;
    }
    
    .tool-calls {
      margin-top: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
    }
    
    .tool-call {
      margin-bottom: 0.5rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .tool-call:last-child {
      margin-bottom: 0;
      border-bottom: none;
    }
    
    .tool-header {
      background-color: #f3f4f6;
      padding: 0.5rem 0.75rem;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .tool-name {
      color: #4b5563;
    }
    
    .tool-id {
      font-size: 0.75rem;
      color: #6b7280;
    }
    
    .tool-body {
      padding: 0.75rem;
    }
    
    .tool-arguments {
      background-color: #f8fafc;
      padding: 0.75rem;
      border-radius: 0.25rem;
      font-family: monospace;
      margin-bottom: 0.5rem;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      border-left: 3px solid #cbd5e1;
    }
    
    .tool-result {
      background-color: #f0f9ff;
      padding: 0.75rem;
      border-radius: 0.25rem;
      font-family: monospace;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      border-left: 3px solid #0ea5e9;
    }
    
    .search-results {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .search-result {
      padding: 0.5rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .search-result:last-child {
      border-bottom: none;
    }
    
    .search-result-title {
      font-weight: bold;
      margin-bottom: 0.25rem;
    }
    
    .search-result-title a {
      color: #2563eb;
      text-decoration: none;
    }
    
    .search-result-title a:hover {
      text-decoration: underline;
    }
    
    .search-result-url {
      color: #10b981;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
      word-break: break-all;
    }
    
    .search-result-snippet {
      font-size: 0.875rem;
      color: #4b5563;
    }
    
    .memory-content {
      white-space: pre-wrap;
      overflow-wrap: break-word;
      background-color: #f8fafc;
      padding: 0.75rem;
      border-radius: 0.375rem;
      border-left: 3px solid #0ea5e9;
      font-family: monospace;
    }
    
    .code-content {
      white-space: pre-wrap;
      overflow-wrap: break-word;
      background-color: #f8f9fa;
      padding: 0.75rem;
      border-radius: 0.375rem;
      border-left: 3px solid #6366f1;
      font-family: monospace;
      max-height: 400px;
      overflow-y: auto;
    }
    
    .python-io {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .io-item {
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      overflow: hidden;
    }
    
    .io-type {
      background-color: #f3f4f6;
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
      font-weight: bold;
      color: #4b5563;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .io-value {
      padding: 0.5rem;
      white-space: pre-wrap;
      background-color: #ffffff;
      font-family: monospace;
    }
    
    /* API Tool styles */
    .api-calls {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .api-call {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
      background-color: #ffffff;
    }
    
    .api-header {
      background-color: #f3f4f6;
      padding: 0.5rem 0.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .api-name {
      font-weight: bold;
      color: #1f2937;
    }
    
    .api-method {
      font-size: 0.75rem;
      font-weight: bold;
      text-transform: uppercase;
      background-color: #4b5563;
      color: white;
      padding: 0.15rem 0.5rem;
      border-radius: 0.25rem;
    }
    
    .api-url {
      padding: 0.5rem 0.75rem;
      font-family: monospace;
      font-size: 0.875rem;
      background-color: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
      word-break: break-all;
    }
    
    .api-section {
      margin-top: 0.5rem;
      padding: 0.5rem 0.75rem;
    }
    
    .api-section-title {
      font-weight: bold;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      color: #4b5563;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .api-status {
      font-size: 0.75rem;
      padding: 0.15rem 0.5rem;
      border-radius: 0.25rem;
      background-color: #e5e7eb;
      color: #4b5563;
    }
    
    .api-parameters, .api-response-content {
      background-color: #f8fafc;
      padding: 0.75rem;
      border-radius: 0.25rem;
      border-left: 3px solid #6366f1;
      overflow-x: auto;
    }
    
    .api-parameter-content, .api-response-content {
      margin: 0;
      font-family: monospace;
      font-size: 0.875rem;
      white-space: pre-wrap;
    }
    
    .api-error {
      color: #ef4444;
      font-weight: bold;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      background-color: #fee2e2;
      border-radius: 0.25rem;
    }
    
    .api-no-response {
      color: #6b7280;
      font-style: italic;
      padding: 0.5rem;
    }
    
    /* Jira styling */
    .jira-results {
      margin: 0.5rem 0;
    }
    
    .jira-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
    }
    
    .jira-table th {
      background-color: #f3f4f6;
      font-weight: bold;
      text-align: left;
      padding: 0.5rem;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .jira-table td {
      padding: 0.5rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .jira-table tr:nth-child(even) {
      background-color: #f8fafc;
    }
    
    .jira-table tr:hover {
      background-color: #e5e7eb;
    }
    
    .jira-meta {
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: #4b5563;
      text-align: right;
      font-style: italic;
    }
    
    /* Data tables styling */
    .data-results {
      margin: 0.5rem 0;
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
      font-family: monospace;
    }
    
    .data-table th {
      background-color: #f3f4f6;
      font-weight: bold;
      text-align: left;
      padding: 0.5rem;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .data-table td {
      padding: 0.5rem;
      border-bottom: 1px solid #e5e7eb;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .data-table td:hover {
      white-space: normal;
      word-break: break-all;
    }
    
    .data-table tr:nth-child(even) {
      background-color: #f8fafc;
    }
    
    .data-meta {
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: #4b5563;
      text-align: right;
      font-style: italic;
    }
    
    /* Collapse indicators */
    .collapse-indicator {
      font-size: 0.75rem;
      transition: transform 0.2s;
    }
    
    .collapsed .collapse-indicator {
      transform: rotate(-90deg);
    }
  `;
}