/**
 * CSS for the log parser UI
 */

// Read the CSS file inline since we're running in a Cloudflare Worker environment
// where we don't have direct file system access
export function getStyles() {
  return `
/**
 * Main stylesheet for log parser UI
 */

/* General styling */
body {
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.container {
  padding: 20px;
  max-width: 1200px;
}

header {
  margin-bottom: 30px;
  text-align: center;
}

h1 {
  color: #343a40;
  margin-bottom: 10px;
}

.description {
  color: #6c757d;
}

/* Card styling */
.card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.card-header {
  background-color: #f1f3f5;
  border-bottom: 1px solid #e9ecef;
  padding: 15px 20px;
}

.hidden {
  display: none;
}

/* Overview section */
.overview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 10px;
}

.metric {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.metric-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #6c757d;
  margin-bottom: 5px;
}

.metric-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
}

.metric-value.success {
  color: #28a745;
}

.metric-value.error {
  color: #dc3545;
}

.format-badge {
  grid-column: 1 / -1;
  background-color: #e9ecef;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 0.9rem;
  color: #495057;
  margin-bottom: 10px;
}

/* Step styling */
.accordion-button {
  background-color: #f8f9fa;
  font-weight: 500;
}

.accordion-button:not(.collapsed) {
  background-color: #e9ecef;
  color: #212529;
  font-weight: 500;
}

/* Conversation summary */
.conversation-summary {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-message, .ai-response {
  border-radius: 8px;
  padding: 15px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.user-message {
  background-color: #e9ecef;
  border-left: 4px solid #6c757d;
}

.ai-response {
  background-color: #e3f2fd;
  border-left: 4px solid #0d6efd;
}

.message-label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #495057;
}

.message-content {
  white-space: pre-wrap;
  color: #212529;
  line-height: 1.6;
}

/* Prompt styling */
.prompt-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prompt-item {
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.prompt-role {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 6px;
}

.prompt-user {
  background-color: #e9ecef;
}

.prompt-assistant {
  background-color: #e3f2fd;
}

.prompt-system {
  background-color: #e7f5ea;
}

.prompt-content {
  white-space: pre-wrap;
  color: #212529;
  line-height: 1.5;
}

/* Tool styling */
.tool-calls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tool-call {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  overflow: hidden;
}

.tool-header {
  background-color: #f8f9fa;
  padding: 10px 15px;
  border-bottom: 1px solid #e9ecef;
}

.tool-name {
  font-weight: 600;
  color: #343a40;
}

.tool-id {
  font-size: 0.85rem;
  color: #6c757d;
}

.tool-arguments-label, .tool-result-label {
  margin-top: 10px;
  margin-bottom: 5px;
}

.tool-arguments, .tool-result {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 0.9rem;
  overflow-x: auto;
}

.tool-body {
  padding: 15px;
}

.tool-url {
  margin-bottom: 10px;
  color: #0d6efd;
  word-break: break-all;
}

/* API call styling */
.api-calls {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.api-call {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  overflow: hidden;
}

.api-header {
  background-color: #f8f9fa;
  padding: 10px 15px;
  border-bottom: 1px solid #e9ecef;
}

.api-name {
  font-weight: 600;
  color: #343a40;
}

.api-method {
  background-color: #e7f5ea;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.api-section {
  margin-top: 15px;
}

.api-section-title {
  font-weight: 600;
  margin-bottom: 10px;
  color: #343a40;
}

.api-parameters {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

.api-parameter-content, .api-response-content {
  margin: 0;
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 0.9rem;
}

.api-url {
  padding: 10px;
  margin-top: 10px;
  word-break: break-all;
}

.api-status {
  font-size: 0.9rem;
  color: #6c757d;
}

.api-error {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

.api-no-response {
  font-style: italic;
  color: #6c757d;
  padding: 10px 0;
}

/* Python IO styling */
.python-io {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.io-item {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  overflow: hidden;
}

.io-type {
  background-color: #f8f9fa;
  padding: 8px 12px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #495057;
  border-bottom: 1px solid #e9ecef;
}

.io-value {
  padding: 12px;
  white-space: pre-wrap;
  font-family: monospace;
  overflow-x: auto;
}

/* Memory styling */
.memory-content {
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 0.9rem;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

/* Search results styling */
.search-results {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.search-result {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 15px;
}

.search-result-title {
  font-weight: 600;
  margin-bottom: 5px;
}

.search-result-title a {
  color: #0d6efd;
  text-decoration: none;
}

.search-result-url {
  color: #28a745;
  font-size: 0.85rem;
  margin-bottom: 8px;
  word-break: break-all;
}

.search-result-snippet {
  color: #343a40;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Data search styling */
.datasearch-container {
  border: 1px solid #e9ecef;
  padding: 15px;
  border-radius: 6px;
  margin-top: 20px;
}

.score-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 15px;
  color: white;
  font-weight: 600;
  text-align: center;
  min-width: 40px;
}

.source-doc {
  font-weight: 600;
  margin-bottom: 5px;
}

/* Loading spinner */
#loadingIndicator {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
  gap: 10px;
}

/* Error display */
#errors-section {
  margin-bottom: 30px;
}

/* Raw JSON */
#raw-content {
  max-height: 500px;
  overflow-y: auto;
  font-size: 0.85rem;
  margin: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .overview {
    grid-template-columns: 1fr;
  }
  
  .card-header {
    padding: 12px 15px;
  }
  
  .card-body {
    padding: 15px;
  }
}
  `;
}