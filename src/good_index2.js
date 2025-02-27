/**
 * HTML template and CSS for the log parser UI
 * Includes overview section and improved UI
 */

function getStyles() {
  return '\
    :root {\
      --primary-color: #2563eb;\
      --primary-hover: #1d4ed8;\
      --success-color: #10b981;\
      --error-color: #ef4444;\
      --warning-color: #f59e0b;\
      --background: #f9fafb;\
      --card-bg: #ffffff;\
      --text-color: #1f2937;\
      --text-secondary: #6b7280;\
      --border-color: #e5e7eb;\
    }\
    \
    body {\
      font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Open Sans\', sans-serif;\
      line-height: 1.6;\
      color: var(--text-color);\
      background-color: var(--background);\
      padding-top: 20px;\
      padding-bottom: 60px;\
    }\
    \
    .container {\
      max-width: 1200px;\
      margin: 0 auto;\
      padding: 2rem 1rem;\
    }\
    \
    header {\
      text-align: center;\
      margin-bottom: 2rem;\
    }\
    \
    h1 {\
      margin-bottom: 0.5rem;\
      color: var(--primary-color);\
    }\
    \
    .description {\
      color: var(--text-secondary);\
      max-width: 600px;\
      margin: 0 auto 2rem auto;\
    }\
    \
    .hidden {\
      display: none;\
    }\
    \
    pre {\
      white-space: pre-wrap;\
    }\
    \
    .datasearch-container {\
      border-left: 4px solid #4e42d4;\
      padding-left: 15px;\
      margin-top: 10px;\
    }\
    \
    .score-badge {\
      display: inline-block;\
      padding: 3px 8px;\
      border-radius: 12px;\
      color: white;\
      font-weight: bold;\
      font-size: 0.75rem;\
      text-align: center;\
    }\
    \
    .source-doc {\
      font-weight: bold;\
    }\
    \
    .overview {\
      display: grid;\
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\
      gap: 1rem;\
      margin-bottom: 1rem;\
    }\
    \
    .metric {\
      padding: 0.75rem;\
      border-radius: 0.375rem;\
      background-color: #f3f4f6;\
    }\
    \
    .metric-label {\
      font-size: 0.875rem;\
      color: var(--text-secondary);\
      margin-bottom: 0.25rem;\
    }\
    \
    .metric-value {\
      font-weight: 600;\
      font-size: 1.125rem;\
      word-break: break-all;\
    }\
    \
    .success {\
      color: var(--success-color);\
    }\
    \
    .error {\
      color: var(--error-color);\
    }\
    \
    .copy-json-btn {\
      background-color: #6b7280;\
      margin-left: 0.5rem;\
    }\
    \
    .conversation-summary {\
      display: flex;\
      flex-direction: column;\
      gap: 1.5rem;\
    }\
    \
    .user-message, .ai-response {\
      padding: 1rem;\
      border-radius: 0.5rem;\
      max-width: 95%;\
    }\
    \
    .user-message {\
      background-color: #f3f4f6;\
      align-self: flex-start;\
      border-bottom-left-radius: 0;\
    }\
    \
    .ai-response {\
      background-color: #e9f5ff;\
      align-self: flex-end;\
      border-bottom-right-radius: 0;\
    }\
    \
    .message-label {\
      font-weight: bold;\
      margin-bottom: 0.5rem;\
      font-size: 0.875rem;\
      color: var(--text-secondary);\
    }\
    \
    .message-content {\
      white-space: pre-wrap;\
      overflow-wrap: break-word;\
    }\
    \
    .prompt-list {\
      margin-bottom: 1rem;\
    }\
    \
    .prompt-item {\
      padding: 0.75rem;\
      border-radius: 0.375rem;\
      margin-bottom: 0.5rem;\
    }\
    \
    .prompt-user {\
      background-color: #f3f4f6;\
      border-left: 3px solid #6b7280;\
    }\
    \
    .prompt-system {\
      background-color: #f0f9ff;\
      border-left: 3px solid #0ea5e9;\
    }\
    \
    .prompt-assistant {\
      background-color: #f0fdf4;\
      border-left: 3px solid #10b981;\
    }\
    \
    .prompt-role {\
      font-weight: bold;\
      margin-bottom: 0.25rem;\
      font-size: 0.75rem;\
      text-transform: uppercase;\
    }\
    \
    .tool-calls {\
      margin-top: 1rem;\
      border: 1px solid #e5e7eb;\
      border-radius: 0.5rem;\
      overflow: hidden;\
    }\
    \
    .tool-call {\
      margin-bottom: 0.5rem;\
      border-bottom: 1px solid #e5e7eb;\
    }\
    \
    .tool-call:last-child {\
      margin-bottom: 0;\
      border-bottom: none;\
    }\
    \
    .tool-header {\
      background-color: #f3f4f6;\
      padding: 0.5rem 0.75rem;\
      font-weight: bold;\
      display: flex;\
      justify-content: space-between;\
      align-items: center;\
    }\
    \
    .tool-name {\
      color: #4b5563;\
    }\
    \
    .tool-id {\
      font-size: 0.75rem;\
      color: #6b7280;\
    }\
    \
    .tool-body {\
      padding: 0.75rem;\
    }\
    \
    .tool-arguments {\
      background-color: #f8fafc;\
      padding: 0.75rem;\
      border-radius: 0.25rem;\
      font-family: monospace;\
      margin-bottom: 0.5rem;\
      white-space: pre-wrap;\
      overflow-wrap: break-word;\
      border-left: 3px solid #cbd5e1;\
    }\
    \
    .tool-result {\
      background-color: #f0f9ff;\
      padding: 0.75rem;\
      border-radius: 0.25rem;\
      font-family: monospace;\
      white-space: pre-wrap;\
      overflow-wrap: break-word;\
      border-left: 3px solid #0ea5e9;\
    }\
    \
    .search-results {\
      display: flex;\
      flex-direction: column;\
      gap: 1rem;\
    }\
    \
    .search-result {\
      padding: 0.5rem;\
      border-bottom: 1px solid #e5e7eb;\
    }\
    \
    .search-result:last-child {\
      border-bottom: none;\
    }\
    \
    .search-result-title {\
      font-weight: bold;\
      margin-bottom: 0.25rem;\
    }\
    \
    .search-result-title a {\
      color: #2563eb;\
      text-decoration: none;\
    }\
    \
    .search-result-title a:hover {\
      text-decoration: underline;\
    }\
    \
    .search-result-url {\
      color: #10b981;\
      font-size: 0.875rem;\
      margin-bottom: 0.25rem;\
      word-break: break-all;\
    }\
    \
    .search-result-snippet {\
      font-size: 0.875rem;\
      color: #4b5563;\
    }\
  ';
}

function getScripts() {
  // Instead of using template literals or multi-line strings with backslashes, we'll use an array of strings
  // and join them together. This avoids issues with unescaped quotes and newlines.
  const scriptParts = [
    'document.addEventListener("DOMContentLoaded", function() {',
    '  const logInput = document.getElementById("logInput");',
    '  const logFile = document.getElementById("logFile");',
    '  const parseBtn = document.getElementById("parseBtn");',
    '  const loadingIndicator = document.getElementById("loadingIndicator");',
    '  const resultsContainer = document.getElementById("results-container");',
    '  const overviewContent = document.getElementById("overview-content");',
    '  const summaryContent = document.getElementById("summary-content");',
    '  const stepsContent = document.getElementById("steps-content");',
    '  const rawContent = document.getElementById("raw-content");',
    '  const errorsSection = document.getElementById("errors-section");',
    '  const errorSummary = document.getElementById("error-summary");',
    '  const copyJsonBtn = document.getElementById("copyJsonBtn");',
    '  const expandAllBtn = document.getElementById("expandAllBtn");',
    '  ',
    '  let allExpanded = false;',
    '  let parsedResult = null;',
    '  ',
    '  // Handle file upload',
    '  logFile.addEventListener("change", function(e) {',
    '    const file = e.target.files[0];',
    '    if (file) {',
    '      const reader = new FileReader();',
    '      reader.onload = function(e) {',
    '        logInput.value = e.target.result;',
    '      };',
    '      reader.readAsText(file);',
    '    }',
    '  });',
    '',
    '  // Parse button click handler',
    '  parseBtn.addEventListener("click", function() {',
    '    const logData = logInput.value.trim();',
    '    if (!logData) {',
    '      alert("Please paste log data or upload a log file.");',
    '      return;',
    '    }',
    '    ',
    '    loadingIndicator.classList.remove("hidden");',
    '    resultsContainer.classList.add("hidden");',
    '    ',
    '    try {',
    '      // Parse the JSON data',
    '      const data = JSON.parse(logData);',
    '      ',
    '      // Use our server-side parsing function (adapted for client-side)',
    '      parsedResult = parseLogClient(data);',
    '      ',
    '      // Display overview metrics',
    '      displayOverview(parsedResult.overview);',
    '      ',
    '      // Display summary',
    '      displaySummary(parsedResult.summary);',
    '      ',
    '      // Display errors if any',
    '      displayErrors(parsedResult.errors);',
    '      ',
    '      // Display steps',
    '      displaySteps(parsedResult.steps);',
    '      ',
    '      // Display raw JSON',
    '      rawContent.textContent = JSON.stringify(parsedResult, null, 2);',
    '      ',
    '      // Show results',
    '      originalShowResults();',
    '    } catch (e) {',
    '      loadingIndicator.classList.add("hidden");',
    '      alert("Error parsing JSON: " + e.message);',
    '    }',
    '  });',
    '  ',
    '  // Toggle expand/collapse all steps',
    '  if (expandAllBtn) {',
    '    expandAllBtn.addEventListener("click", function() {',
    '      const stepBodies = document.querySelectorAll(".accordion-collapse");',
    '      allExpanded = !allExpanded;',
    '      ',
    '      stepBodies.forEach(body => {',
    '        if (allExpanded) {',
    '          body.classList.add("show");',
    '        } else {',
    '          body.classList.remove("show");',
    '        }',
    '      });',
    '      ',
    '      expandAllBtn.textContent = allExpanded ? "Collapse All" : "Expand All";',
    '    });',
    '  }',
    '  ',
    '  // Configure accordions to allow multiple open sections',
    '  const configureAccordions = function() {',
    '    const allAccordions = document.querySelectorAll(".accordion");',
    '    allAccordions.forEach(accordion => {',
    '      // Remove the data-bs-parent attribute from all accordion items',
    '      const items = accordion.querySelectorAll(".accordion-collapse");',
    '      items.forEach(item => {',
    '        item.removeAttribute("data-bs-parent");',
    '      });',
    '    });',
    '  };',
    '  ',
    '  // Run it when DOM is loaded',
    '  document.addEventListener("DOMContentLoaded", configureAccordions);',
    '  ',
    '  // Also run it after results are displayed',
    '  const originalShowResults = function() {',
    '    loadingIndicator.classList.add("hidden");',
    '    resultsContainer.classList.remove("hidden");',
    '    resultsContainer.scrollIntoView({ behavior: "smooth" });',
    '    ',
    '    // Configure accordions after results are shown',
    '    setTimeout(configureAccordions, 100);',
    '  };',
    '  ',
    '  // Copy processed JSON',
    '  if (copyJsonBtn) {',
    '    copyJsonBtn.addEventListener("click", function() {',
    '      if (parsedResult) {',
    '        navigator.clipboard.writeText(JSON.stringify(parsedResult, null, 2))',
    '          .then(() => {',
    '            const originalText = copyJsonBtn.textContent;',
    '            copyJsonBtn.textContent = "Copied!";',
    '            setTimeout(() => {',
    '              copyJsonBtn.textContent = originalText;',
    '            }, 2000);',
    '          })',
    '          .catch(err => {',
    '            console.error("Failed to copy: ", err);',
    '          });',
    '      }',
    '    });',
    '  }',
    '  ',
    '  // Display overview metrics',
    '  function displayOverview(overview) {',
    '    overviewContent.innerHTML = "";',
    '    for (const [key, value] of Object.entries(overview)) {',
    '      overviewContent.innerHTML += ' +
    '        "<div class=\"metric\">" +',
    '          "<div class=\"metric-label\">" + formatLabel(key) + "</div>" +',
    '          "<div class=\"metric-value " + (key === "success" ? (value ? "success" : "error") : "") + "\">" + (value === true ? "✓" : value === false ? "✗" : value) + "</div>" +',
    '        "</div>";',
    '    }',
    '  }',
    '  ',
    '  // Display conversation summary',
    '  function displaySummary(summary) {',
    '    summaryContent.innerHTML = "";',
    '    ',
    '    if (summary.userInput) {',
    '      summaryContent.innerHTML += ' +
    '        "<div class=\"user-message\">" +',
    '          "<div class=\"message-label\">User Input:</div>" +',
    '          "<div class=\"message-content\">" + summary.userInput + "</div>" +',
    '        "</div>";',
    '    }',
    '    ',
    '    if (summary.finalOutput) {',
    '      summaryContent.innerHTML += ' +
    '        "<div class=\"ai-response\">" +',
    '          "<div class=\"message-label\">Final Response:</div>" +',
    '          "<div class=\"message-content\">" + summary.finalOutput + "</div>" +',
    '        "</div>";',
    '    }',
    '    ',
    '    if (!summary.userInput && !summary.finalOutput) {',
    '      summaryContent.innerHTML = "<div class=\"alert alert-info\">No conversation data available.</div>";',
    '    }',
    '  }',
    '  ',
    '  // Display error summary',
    '  function displayErrors(errors) {',
    '    if (errors && errors.length > 0) {',
    '      errorsSection.style.display = "block";',
    '      ',
    '      let errorHtml = "<h3>Execution Errors (" + errors.length + ")</h3><ul>";',
    '      ',
    '      for (const error of errors) {',
    '        errorHtml += ',
    '          "<li>" +',
    '            "<strong>" + error.stepType + " (" + error.stepId.substring(0, 8) + "...):</strong>" +',
    '            "<div>" + error.message + "</div>" +',
    '          "</li>";',
    '      }',
    '      ',
    '      errorHtml += "</ul>";',
    '      errorSummary.innerHTML = errorHtml;',
    '    } else {',
    '      errorsSection.style.display = "none";',
    '    }',
    '  }',
    '  ',
    '  // Display steps',
    '  function displaySteps(steps) {',
    '    // Display steps',
    '    let stepsHtml = "<div class=\"accordion\" id=\"stepsAccordion\">";',
    '    ',
    '    steps.forEach((step, index) => {',
    '      const stepType = step.type || "Unknown";',
    '      ',
    '      stepsHtml += "<div class=\"accordion-item\">" +',
    '        "<h2 class=\"accordion-header\">" +',
    '        "<button class=\"accordion-button collapsed\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#collapse" + index + "\" " +',
    '        "aria-expanded=\"false\" aria-controls=\"collapse" + index + "\">" +',
    '        "Step " + (index + 1) + ": " + stepType + " <span class=\"ms-2 badge " + (step.success ? "bg-success" : "bg-danger") + "\">" + ',
    '        (step.success ? "Success" : "Failed") + "</span>" +',
    '        "</button></h2>" +',
    '        "<div id=\"collapse" + index + "\" class=\"accordion-collapse collapse\">" +',
    '        "<div class=\"accordion-body\">" +',
    '        "<table class=\"table table-sm\">" +',
    '        "<tr><th style=\"width: 150px;\">Step ID:</th><td>" + step.id + "</td></tr>" +',
    '        "<tr><th>Type:</th><td>" + stepType + "</td></tr>" +',
    '        "<tr><th>Duration:</th><td>" + step.duration + "</td></tr>" +',
    '        "<tr><th>Started:</th><td>" + step.startedAt + "</td></tr>" +',
    '        "<tr><th>Finished:</th><td>" + step.finishedAt + "</td></tr>";',
    '      ',
    '      // Add specific fields based on step type',
    '      if (step.type === "InputStep" && step.input) {',
    '        stepsHtml += "<tr><th>Input:</th><td>" + step.input + "</td></tr>";',
    '      }',
    '      ',
    '      if (step.type === "AIOperation") {',
    '        stepsHtml += ',
    '          "<tr><th>Model:</th><td>" + step.modelName + "</td></tr>" +',
    '          "<tr><th>Provider:</th><td>" + step.modelProvider + "</td></tr>" +',
    '          "<tr><th>Tokens:</th><td>Input: " + step.tokens.input + ',
    '          ", Output: " + step.tokens.output + ',
    '          ", Total: " + step.tokens.total + "</td></tr>";',
    '          ',
    '        // Add prompts if available',
    '        if (step.prompts && step.prompts.length > 0) {',
    '          stepsHtml += "<tr><th>Prompts:</th><td><div class=\"prompt-list\">";',
    '          ',
    '          step.prompts.forEach(prompt => {',
    '            const role = prompt.role || "user";',
    '            const content = prompt.content || "";',
    '            ',
    '            if (content) {',
    '              // Sanitize content: escape backslashes and handle newlines',
    '              let sanitizedContent = content;',
    '              // Replace backslashes with double backslashes (must be done via string replace, not regex)',
    '              sanitizedContent = sanitizedContent.split("\\\\").join("\\\\\\\\");',
    '              // Replace newlines with <br> tags',
    '              sanitizedContent = sanitizedContent.split("\\n").join("<br>");',
    '              ',
    '              // For system messages with large content (like instructions), add a collapsible section',
    '              if (role === "system" && content.length > 500) {',
    '                stepsHtml += "<div class=\"prompt-item prompt-" + role + "\">" +',
    '                  "<div class=\"prompt-role\">" + role + "</div>" +',
    '                  "<details>" +',
    '                  "<summary>View full system message (" + Math.round(content.length/100)/10 + "KB)</summary>" +',
    '                  "<div class=\"prompt-content\">" + sanitizedContent + "</div>" +',
    '                  "</details>" +',
    '                  "</div>";',
    '              } else {',
    '                stepsHtml += "<div class=\"prompt-item prompt-" + role + "\">" +',
    '                  "<div class=\"prompt-role\">" + role + "</div>" +',
    '                  "<div class=\"prompt-content\">" + sanitizedContent + "</div>" +',
    '                  "</div>";',
    '              }',
    '            }',
    '          });',
    '          ',
    '          stepsHtml += "</div></td></tr>";',
    '        }',
    '        ',
    '        // Add tool calls if available',
    '        if (step.tools && step.tools.length > 0) {',
    '          stepsHtml += "<tr><th>Tool Calls:</th><td><div class=\"tool-calls\">";',
    '          ',
    '          step.tools.forEach((tool, index) => {',
    '            const name = tool.name || "Unknown Tool";',
    '            const id = tool.id || index;',
    '            let args = tool.arguments || "";',
    '            let result = tool.result || "";',
    '            ',
    '            // Pretty format JSON if possible',
    '            try {',
    '              if (typeof args === "object") {',
    '                args = JSON.stringify(args, null, 2);',
    '              } else if (typeof args === "string") {',
    '                // Try to parse as JSON first',
    '                if (args.trim().startsWith("{") || args.trim().startsWith("[")) {',
    '                  args = JSON.stringify(JSON.parse(args), null, 2);',
    '                }',
    '              }',
    '            } catch (e) {',
    '              // Keep as is if not JSON',
    '            }',
    '            ',
    '            try {',
    '              if (typeof result === "object") {',
    '                result = JSON.stringify(result, null, 2);',
    '              } else if (typeof result === "string") {',
    '                // Try to parse as JSON first',
    '                if (result.trim().startsWith("{") || result.trim().startsWith("[")) {',
    '                  result = JSON.stringify(JSON.parse(result), null, 2);',
    '                }',
    '              }',
    '            } catch (e) {',
    '              // Keep as is if not JSON',
    '            }',
    '            ',
    '            stepsHtml += "<div class=\"tool-call\">" +',
    '              "<div class=\"tool-header\">" +',
    '              "<span class=\"tool-name\">" + name + "</span>" +',
    '              (id ? "<span class=\"tool-id\">ID: " + id + "</span>" : "") +',
    '              "</div>" +',
    '              "<div class=\"tool-body\">";',
    '            ',
    '            if (args) {',
    '              stepsHtml += "<div class=\"tool-arguments-label\"><strong>Arguments:</strong></div>" +',
    '                "<div class=\"tool-arguments\">" + args + "</div>";',
    '            }',
    '            ',
    '            // Sanitize result to prevent syntax errors',
    '            let displayResult = result;',
    '            if (typeof displayResult === "string") {',
    '              // Use string split/join instead of regex to avoid syntax errors',
    '              displayResult = displayResult.split("\\\\").join("\\\\\\\\");',
    '            }',
    '            ',
    '            // For Bing search results, try to extract and prettify the JSON',
    '            if (result && name.includes("Bing Search")) {',
    '              try {',
    '                const resultObj = typeof result === "object" ? result : JSON.parse(result);',
    '                ',
    '                if (resultObj.webPages && resultObj.webPages.value) {',
    '                  // Format search results in a more readable way',
    '                  stepsHtml += "<div class=\"tool-result-label\"><strong>Search Results:</strong></div>" +',
    '                    "<div class=\"search-results\" style=\"max-height: 350px; overflow-y: auto;\">";',
    '                  ',
    '                  resultObj.webPages.value.forEach((page, i) => {',
    '                    const pageUrl = page.url ? page.url.split("\\"").join("&quot;") : "";',
    '                    const pageName = page.name ? page.name.split("<").join("&lt;").split(">").join("&gt;") : "";',
    '                    const pageSnippet = page.snippet ? page.snippet.split("<").join("&lt;").split(">").join("&gt;") : "";',
    '                    ',
    '                    stepsHtml += "<div class=\"search-result\">" +',
    '                      "<div class=\"search-result-title\"><a href=\"" + pageUrl + "\" target=\"_blank\">" + pageName + "</a></div>" +',
    '                      "<div class=\"search-result-url\">" + pageUrl + "</div>" +',
    '                      "<div class=\"search-result-snippet\">" + pageSnippet + "</div>" +',
    '                      "</div>";',
    '                  });',
    '                  ',
    '                  stepsHtml += "</div>";',
    '                } else {',
    '                  // Fallback to showing raw JSON - safely stringified',
    '                  const safeJson = JSON.stringify(resultObj, null, 2).split("\\\\").join("\\\\\\\\");',
    '                  stepsHtml += "<div class=\"tool-result-label\"><strong>Result:</strong></div>" +',
    '                    "<div class=\"tool-result\">" + safeJson + "</div>";',
    '                }',
    '              } catch (e) {',
    '                // If parsing fails, show raw result (sanitized)',
    '                stepsHtml += "<div class=\"tool-result-label\"><strong>Result:</strong></div>" +',
    '                  "<div class=\"tool-result\">" + displayResult + "</div>";',
    '              }',
    '            } else if (result) {',
    '              // For other tool results',
    '              stepsHtml += "<div class=\"tool-result-label\"><strong>Result:</strong></div>" +',
    '                "<div class=\"tool-result\">" + displayResult + "</div>";',
    '            }',
    '            ',
    '            stepsHtml += "</div></div>";',
    '          });',
    '          ',
    '          stepsHtml += "</div></td></tr>";',
    '        }',
    '        ',
    '        // Add response if available',
    '        if (step.response) {',
    '          // Sanitize response to prevent syntax errors - use string methods instead of regex',
    '          let safeResponse = step.response;',
    '          safeResponse = safeResponse.split("\\\\").join("\\\\\\\\");',
    '          safeResponse = safeResponse.split("\\n").join("<br>");',
    '          ',
    '          stepsHtml += "<tr><th>Response:</th><td class=\"response\">" + safeResponse + "</td></tr>";',
    '        }',
    '      }',
    '      ',
    '      // Add error if present',
    '      if (step.error) {',
    '        stepsHtml += "<tr><th>Error:</th><td class=\"text-danger\">" + step.error + "</td></tr>";',
    '      }',
    '      ',
    '      stepsHtml += "</table>";',
    '      ',
    '      // Handle DataSearch step (from original code)',
    '      if (stepType === "DataSearch" && step.searchResults) {',
    '        try {',
    '          const searchData = step.searchResults;',
    '          ',
    '          if (searchData.Chunks && searchData.Chunks.length > 0) {',
    '            stepsHtml += "<div class=\"datasearch-container mt-3\">" +',
    '              "<h5>Data Search Results</h5>" +',
    '              "<p>Found " + searchData.Chunks.length + " results</p>" +',
    '              "<div class=\"table-responsive\">" +',
    '              "<table class=\"table table-sm\">" +',
    '              "<thead><tr><th>Score</th><th>Source</th><th>Content</th></tr></thead>" +',
    '              "<tbody>";',
    '            ',
    '            // Sort chunks by score',
    '            const sortedChunks = Array.from(searchData.Chunks).sort((a, b) => {',
    '              return (b.Score || 0) - (a.Score || 0);',
    '            });',
    '            ',
    '            // Show top 5 chunks',
    '            const topChunks = sortedChunks.slice(0, 5);',
    '            ',
    '            for (const chunk of topChunks) {',
    '              const score = chunk.Score || 0;',
    '              const scorePercent = Math.round(score * 100);',
    '              let scoreColor = "#dc3545"; // red',
    '              ',
    '              if (score > 0.7) {',
    '                scoreColor = "#28a745"; // green',
    '              } else if (score > 0.5) {',
    '                scoreColor = "#17a2b8"; // blue',
    '              }',
    '              ',
    '              const docName = chunk.Metadata && chunk.Metadata.DocumentName ? chunk.Metadata.DocumentName : "Unknown";',
    '              const pageNum = chunk.Metadata && chunk.Metadata.pageNumber ? chunk.Metadata.pageNumber : "";',
    '              let content = chunk.Chunk || "";',
    '              ',
    '              // Safe way to replace newlines',
    '              if (content.indexOf("\\\\n") !== -1) {',
    '                content = content.split("\\\\n").join("<br>");',
    '              }',
    '              ',
    '              stepsHtml += "<tr>" +',
    '                "<td><span class=\"score-badge\" style=\"background-color: " + scoreColor + ";\">" + scorePercent + "%</span></td>" +',
    '                "<td><div class=\"source-doc\">" + docName + "</div>";',
    '                ',
    '              if (pageNum) {',
    '                stepsHtml += "<div>Page " + pageNum + "</div>";',
    '              }',
    '              ',
    '              stepsHtml += "</td><td>" + content + "</td></tr>";',
    '            }',
    '            ',
    '            stepsHtml += "</tbody></table></div></div>";',
    '          }',
    '        } catch (e) {',
    '          stepsHtml += "<div class=\"alert alert-danger\">Error processing search results: " + e.message + "</div>";',
    '        }',
    '      }',
    '      ',
    '      stepsHtml += "</div></div></div>";',
    '    });',
    '    ',
    '    stepsHtml += "</div>";',
    '    stepsContent.innerHTML = stepsHtml;',
    '  }',
    '  ',
    '  // Format label for display',
    '  function formatLabel(key) {',
    '    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");',
    '  }',
    '  ',
    '  // Client-side log parsing function',
    '  function parseLogClient(logData) {',
    '    // Find input and output steps for summary',
    '    let userInput = "";',
    '    let finalOutput = "";',
    '    let inputStepIds = [];',
    '    let outputStepIds = [];',
    '    ',
    '    if (logData.StepsExecutionContext) {',
    '      // First, identify input and output steps',
    '      for (const stepId in logData.StepsExecutionContext) {',
    '        const step = logData.StepsExecutionContext[stepId];',
    '        if (step.StepType === "InputStep") {',
    '          inputStepIds.push(stepId);',
    '          if (step.Result?.Value) {',
    '            userInput = step.Result.Value;',
    '          }',
    '        } else if (step.StepType === "OutputStep") {',
    '          outputStepIds.push(stepId);',
    '          // We\'ll find the output value later after sorting',
    '        }',
    '      }',
    '    }',
    '    ',
    '    const result = {',
    '      overview: {',
    '        success: logData.Success,',
    '        executionId: logData.ExecutionId || "N/A",',
    '        userId: logData.UserId || "N/A",',
    '        projectId: logData.ProjectId || "N/A",',
    '        duration: logData.TimeTrackingData?.duration || "N/A",',
    '        startedAt: formatDateTime(logData.TimeTrackingData?.startedAt),',
    '        finishedAt: formatDateTime(logData.TimeTrackingData?.finishedAt),',
    '      },',
    '      summary: {',
    '        userInput: userInput,',
    '        finalOutput: finalOutput,',
    '      },',
    '      steps: [],',
    '      errors: [],',
    '    };',
    '    ',
    '    // Parse steps',
    '    if (logData.StepsExecutionContext) {',
    '      for (const stepId in logData.StepsExecutionContext) {',
    '        const step = logData.StepsExecutionContext[stepId];',
    '        ',
    '        const stepInfo = {',
    '          id: step.StepId,',
    '          type: step.StepType,',
    '          success: step.Success,',
    '          duration: step.TimeTrackingData?.duration || "N/A",',
    '          startedAt: formatDateTime(step.TimeTrackingData?.startedAt),',
    '          finishedAt: formatDateTime(step.TimeTrackingData?.finishedAt),',
    '        };',
    '        ',
    '        // Add step-specific data',
    '        if (step.StepType === "InputStep") {',
    '          stepInfo.input = step.Result?.Value || "";',
    '        } else if (step.StepType === "OutputStep") {',
    '          // For output steps, try to get the value from input array',
    '          // This is because output steps typically receive their value from a previous step',
    '          if (step.Input && step.Input.length > 0) {',
    '            const outputValue = step.Input[0]?.Value;',
    '            stepInfo.output = outputValue || "";',
    '          }',
    '        } else if (step.StepType === "AIOperation") {',
    '          stepInfo.modelName = step.DebugInformation?.modelDisplayName || step.DebugInformation?.modelName || "N/A";',
    '          stepInfo.modelProvider = step.DebugInformation?.modelProviderType || "N/A";',
    '          stepInfo.tokens = {',
    '            input: step.DebugInformation?.inputTokens || "0",',
    '            output: step.DebugInformation?.outputTokens || "0",',
    '            total: step.DebugInformation?.totalTokens || "0",',
    '          };',
    '          ',
    '          // Extract prompts from messages array or from Input array',
    '          if (step.DebugInformation?.messages && step.DebugInformation.messages.length > 0) {',
    '            // Standardize the prompt format',
    '            stepInfo.prompts = step.DebugInformation.messages.map(message => {',
    '              return {',
    '                role: message.Role?.toLowerCase() || message.role?.toLowerCase() || "user",',
    '                content: message.TextContent || message.content || message.text || ""',
    '              };',
    '            }).filter(prompt => prompt.content);',
    '          } else if (step.Input && step.Input.length > 0) {',
    '            // Try to get prompts from the Input array',
    '            stepInfo.prompts = step.Input.map(input => {',
    '              return {',
    '                role: "user",',
    '                content: input.Value || ""',
    '              };',
    '            }).filter(prompt => prompt.content);',
    '          }',
    '          ',
    '          // Extract tool calls information',
    '          if (step.DebugInformation?.tools && step.DebugInformation.tools.length > 0) {',
    '            // Enhance the tool information for better display',
    '            stepInfo.tools = step.DebugInformation.tools.map(tool => {',
    '              // Extract tool name from the RequestUrl if available and not already set',
    '              if (!tool.name && !tool.ToolName && tool.RequestUrl) {',
    '                try {',
    '                  const url = new URL(tool.RequestUrl);',
    '                  if (url.hostname.includes("bing.microsoft.com")) {',
    '                    tool.ToolName = "Microsoft Bing Search";',
    '                  } else if (url.hostname.includes("api.openai.com")) {',
    '                    tool.ToolName = "OpenAI API";',
    '                  } else if (url.hostname.includes("maps.googleapis.com")) {',
    '                    tool.ToolName = "Google Maps";',
    '                  }',
    '                } catch (e) {',
    '                  // Leave name as is if URL parsing fails',
    '                }',
    '              }',
    '              ',
    '              return {',
    '                name: tool.ToolName || tool.name || "Unknown Tool",',
    '                id: tool.id || tool.ToolId || "",',
    '                arguments: tool.ToolParameters || tool.arguments || "",',
    '                result: tool.ResponseContent || tool.result || ""',
    '              };',
    '            });',
    '          }',
    '          ',
    '          // In case the AI operation provides a response directly',
    '          if (step.Result?.Value) {',
    '            stepInfo.response = step.Result.Value;',
    '          }',
    '        } else if (step.StepType === "DataSearch" && step.Result && step.Result.Value) {',
    '          try {',
    '            stepInfo.searchResults = JSON.parse(step.Result.Value);',
    '          } catch (e) {',
    '            console.error("Error parsing DataSearch results:", e);',
    '          }',
    '        }',
    '        ',
    '        // Add error information if present',
    '        if (!step.Success && step.ExceptionMessage) {',
    '          stepInfo.error = step.ExceptionMessage;',
    '          result.errors.push({',
    '            stepId: step.StepId,',
    '            stepType: step.StepType,',
    '            message: step.ExceptionMessage,',
    '          });',
    '        }',
    '        ',
    '        result.steps.push(stepInfo);',
    '      }',
    '      ',
    '      // Sort steps by start time',
    '      result.steps.sort((a, b) => {',
    '        const dateA = new Date(a.startedAt === "N/A" ? 0 : a.startedAt);',
    '        const dateB = new Date(b.startedAt === "N/A" ? 0 : b.startedAt);',
    '        return dateA - dateB;',
    '      });',
    '      ',
    '      // Now that steps are sorted, find the final output from the last OutputStep',
    '      const outputSteps = result.steps.filter(step => step.type === "OutputStep");',
    '      if (outputSteps.length > 0) {',
    '        const lastOutputStep = outputSteps[outputSteps.length - 1];',
    '        if (lastOutputStep.output) {',
    '          result.summary.finalOutput = lastOutputStep.output;',
    '        }',
    '      }',
    '      ',
    '      // If we couldn\'t find the output from OutputStep, try the last AIOperation response',
    '      if (!result.summary.finalOutput) {',
    '        const aiSteps = result.steps.filter(step => step.type === "AIOperation" && step.response);',
    '        if (aiSteps.length > 0) {',
    '          const lastAIStep = aiSteps[aiSteps.length - 1];',
    '          result.summary.finalOutput = lastAIStep.response || "";',
    '        }',
    '      }',
    '    }',
    '    ',
    '    return result;',
    '  }',
    '  ',
    '  // Format date-time string',
    '  function formatDateTime(dateTimeStr) {',
    '    if (!dateTimeStr) return "N/A";',
    '    try {',
    '      const date = new Date(dateTimeStr);',
    '      return date.toLocaleString();',
    '    } catch (e) {',
    '      return dateTimeStr;',
    '    }',
    '  }',
    '});'
  ];
  
  // Join all the script parts to create the final JavaScript code
  return scriptParts.join('\n');
}

function renderHTML() {
  return '<!DOCTYPE html>' +
'<html lang="en">' +
'<head>' +
'  <meta charset="UTF-8">' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'  <title>Log File Parser</title>' +
'  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">' +
'  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github.min.css">' +
'  <style>' + getStyles() + '</style>' +
'</head>' +
'<body>' +
'  <div class="container">' +
'    <header>' +
'      <h1>Log File Parser</h1>' +
'      <p class="description">Paste your Airia Agent log file below to analyze and visualize its structure and execution flow.</p>' +
'    </header>' +
'    ' +
'    <div class="card mb-4">' +
'      <div class="card-header">' +
'        Upload or Paste Log Data' +
'      </div>' +
'      <div class="card-body">' +
'        <div class="mb-3">' +
'          <label for="logInput" class="form-label">Paste log content:</label>' +
'          <textarea class="form-control" id="logInput" rows="10" placeholder="Paste your log file content here..."></textarea>' +
'        </div>' +
'        <div class="mb-3">' +
'          <label for="logFile" class="form-label">Or upload a log file:</label>' +
'          <input class="form-control" type="file" id="logFile">' +
'        </div>' +
'        <button id="parseBtn" class="btn btn-primary">Parse Log</button>' +
'        <div id="loadingIndicator" class="mt-2 hidden">' +
'          <div class="spinner-border text-primary" role="status">' +
'            <span class="visually-hidden">Loading...</span>' +
'          </div>' +
'          Parsing log data...' +
'        </div>' +
'      </div>' +
'    </div>' +
'    ' +
'    <div id="results-container" class="mt-4 hidden">' +
'      <div class="card mb-4">' +
'        <div class="card-header">' +
'          <h2 class="h5 mb-0">Overview</h2>' +
'        </div>' +
'        <div class="card-body">' +
'          <div id="overview-content" class="overview"></div>' +
'        </div>' +
'      </div>' +
'      ' +
'      <div id="errors-section" class="mb-4" style="display: none;">' +
'        <div class="card border-danger">' +
'          <div class="card-header bg-danger text-white">' +
'            <h2 class="h5 mb-0">Errors</h2>' +
'          </div>' +
'          <div class="card-body" id="error-summary"></div>' +
'        </div>' +
'      </div>' +
'      ' +
'      <div class="card mb-4">' +
'        <div class="card-header d-flex justify-content-between align-items-center">' +
'          <h2 class="h5 mb-0">Execution Steps</h2>' +
'          <button id="expandAllBtn" class="btn btn-sm btn-outline-secondary">Expand All</button>' +
'        </div>' +
'        <div class="card-body">' +
'          <div id="steps-content"></div>' +
'        </div>' +
'      </div>' +
'      ' +
'      <div class="card mb-4">' +
'        <div class="card-header">' +
'          <h2 class="h5 mb-0">Conversation Summary</h2>' +
'        </div>' +
'        <div class="card-body">' +
'          <div id="summary-content" class="conversation-summary">' +
'            <!-- Will be filled dynamically -->' +
'          </div>' +
'        </div>' +
'      </div>' +
'      ' +
'      <div class="card">' +
'        <div class="card-header d-flex justify-content-between align-items-center">' +
'          <h2 class="h5 mb-0">Raw JSON</h2>' +
'          <button id="copyJsonBtn" class="btn btn-sm btn-outline-secondary">Copy JSON</button>' +
'        </div>' +
'        <div class="card-body">' +
'          <pre id="raw-content" class="bg-light p-3 rounded"></pre>' +
'        </div>' +
'      </div>' +
'    </div>' +
'  </div>' +
'' +
'  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>' +
'  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>' +
'  <script>' + getScripts() + '</script>' +
'</body>' +
'</html>';
}

export {
  renderHTML
}