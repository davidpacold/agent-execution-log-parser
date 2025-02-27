/**
 * JavaScript for the log parser UI
 */

export function getScripts() {
  return `
// Debug indicator to see if our script is loading properly
console.log("Log parser script starting");

document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM Content Loaded");
  
  // Check if all required elements exist
  const requiredElements = [
    "logInput", "logFile", "parseBtn", "loadingIndicator", 
    "results-container", "overview-content", "summary-content", 
    "steps-content", "raw-content"
  ];
  
  for (const id of requiredElements) {
    const element = document.getElementById(id);
    console.log(\`Element \${id} exists: \${!!element}\`);
  }
  const logInput = document.getElementById("logInput");
  const logFile = document.getElementById("logFile");
  const parseBtn = document.getElementById("parseBtn");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const resultsContainer = document.getElementById("results-container");
  const overviewContent = document.getElementById("overview-content");
  const summaryContent = document.getElementById("summary-content");
  const stepsContent = document.getElementById("steps-content");
  const rawContent = document.getElementById("raw-content");
  const errorsSection = document.getElementById("errors-section");
  const errorSummary = document.getElementById("error-summary");
  const copyJsonBtn = document.getElementById("copyJsonBtn");
  const expandAllBtn = document.getElementById("expandAllBtn");
  
  let allExpanded = false;
  let parsedResult = null;
  
  // Handle file upload
  logFile.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        logInput.value = e.target.result;
      };
      reader.readAsText(file);
    }
  });

  // Parse button click handler
  parseBtn.addEventListener("click", function() {
    console.log("Parse button clicked");
    
    try {
      const logData = logInput.value.trim();
      if (!logData) {
        alert("Please paste log data or upload a log file.");
        return;
      }
      
      loadingIndicator.classList.remove("hidden");
      resultsContainer.classList.add("hidden");
      
      try {
        console.log("Parsing JSON data");
        // Parse the JSON data
        const data = JSON.parse(logData);
        
        console.log("Processing log data");
        // Use our server-side parsing function (adapted for client-side)
        parsedResult = parseLogClient(data);
        
        console.log("Displaying results");
        // Display overview metrics
        displayOverview(parsedResult.overview);
        
        // Display summary
        displaySummary(parsedResult.summary);
        
        // Display errors if any
        displayErrors(parsedResult.errors);
        
        // Display steps
        displaySteps(parsedResult.steps);
        
        // Display raw JSON
        rawContent.textContent = JSON.stringify(parsedResult, null, 2);
        
        // Show results
        originalShowResults();
      } catch (e) {
        console.error("Error processing log:", e);
        loadingIndicator.classList.add("hidden");
        alert("Error parsing JSON: " + e.message);
      }
    } catch (outerError) {
      console.error("Critical error in click handler:", outerError);
      alert("An unexpected error occurred: " + outerError.message);
    }
  });
  
  // Toggle expand/collapse all steps
  if (expandAllBtn) {
    expandAllBtn.addEventListener("click", function() {
      const stepBodies = document.querySelectorAll(".accordion-collapse");
      allExpanded = !allExpanded;
      
      stepBodies.forEach(body => {
        if (allExpanded) {
          body.classList.add("show");
        } else {
          body.classList.remove("show");
        }
      });
      
      expandAllBtn.textContent = allExpanded ? "Collapse All" : "Expand All";
    });
  }
  
  // Configure accordions to allow multiple open sections
  const configureAccordions = function() {
    const allAccordions = document.querySelectorAll(".accordion");
    allAccordions.forEach(accordion => {
      // Remove the data-bs-parent attribute from all accordion items
      const items = accordion.querySelectorAll(".accordion-collapse");
      items.forEach(item => {
        item.removeAttribute("data-bs-parent");
      });
    });
  };
  
  // Run it when DOM is loaded
  document.addEventListener("DOMContentLoaded", configureAccordions);
  
  // Also run it after results are displayed
  const originalShowResults = function() {
    loadingIndicator.classList.add("hidden");
    resultsContainer.classList.remove("hidden");
    resultsContainer.scrollIntoView({ behavior: "smooth" });
    
    // Configure accordions after results are shown
    setTimeout(configureAccordions, 100);
  };
  
  // Copy processed JSON
  if (copyJsonBtn) {
    copyJsonBtn.addEventListener("click", function() {
      if (parsedResult) {
        navigator.clipboard.writeText(JSON.stringify(parsedResult, null, 2))
          .then(() => {
            const originalText = copyJsonBtn.textContent;
            copyJsonBtn.textContent = "Copied!";
            setTimeout(() => {
              copyJsonBtn.textContent = originalText;
            }, 2000);
          })
          .catch(err => {
            console.error("Failed to copy: ", err);
          });
      }
    });
  }
  
  // Display overview metrics
  function displayOverview(overview) {
    overviewContent.innerHTML = "";
    for (const [key, value] of Object.entries(overview)) {
      const cssClass = key === "success" ? (value ? "success" : "error") : "";
      const displayValue = value === true ? "✓" : value === false ? "✗" : value;
      
      overviewContent.innerHTML += 
        "<div class=\\"metric\\">" +
          "<div class=\\"metric-label\\">" + formatLabel(key) + "</div>" +
          "<div class=\\"metric-value " + cssClass + "\\">" + displayValue + "</div>" +
        "</div>";
    }
  }
  
  // Display conversation summary
  function displaySummary(summary) {
    summaryContent.innerHTML = "";
    
    if (summary.userInput) {
      summaryContent.innerHTML += 
        "<div class=\\"user-message\\">" +
          "<div class=\\"message-label\\">User Input:</div>" +
          "<div class=\\"message-content\\">" + summary.userInput + "</div>" +
        "</div>";
    }
    
    if (summary.finalOutput) {
      summaryContent.innerHTML += 
        "<div class=\\"ai-response\\">" +
          "<div class=\\"message-label\\">Final Response:</div>" +
          "<div class=\\"message-content\\">" + summary.finalOutput + "</div>" +
        "</div>";
    }
    
    if (!summary.userInput && !summary.finalOutput) {
      summaryContent.innerHTML = "<div class=\\"alert alert-info\\">No conversation data available.</div>";
    }
  }
  
  // Display error summary
  function displayErrors(errors) {
    if (errors && errors.length > 0) {
      errorsSection.style.display = "block";
      
      let errorHtml = "<h3>Execution Errors (" + errors.length + ")</h3><ul>";
      
      for (const error of errors) {
        const stepType = error.stepType || "Unknown";
        const stepId = error.stepId ? error.stepId.substring(0, 8) + "..." : "N/A";
        const message = error.message || "No error message";
        
        errorHtml += "<li>" +
          "<strong>" + stepType + " (" + stepId + "):</strong>" +
          "<div>" + message + "</div>" +
        "</li>";
      }
      
      errorHtml += "</ul>";
      errorSummary.innerHTML = errorHtml;
    } else {
      errorsSection.style.display = "none";
    }
  }
  
  // Display steps
  function displaySteps(steps) {
    // Display steps
    let stepsHtml = "<div class=\\"accordion\\" id=\\"stepsAccordion\\">";
    
    steps.forEach((step, index) => {
      const stepType = step.type || "Unknown";
      
      stepsHtml += "<div class=\\"accordion-item\\">" +
        "<h2 class=\\"accordion-header\\">" +
        "<button class=\\"accordion-button collapsed\\" type=\\"button\\" data-bs-toggle=\\"collapse\\" data-bs-target=\\"#collapse" + index + "\\" " +
        "aria-expanded=\\"false\\" aria-controls=\\"collapse" + index + "\\">" +
        "Step " + (index + 1) + ": " + stepType + " <span class=\\"ms-2 " + (step.success ? "text-success" : "text-danger") + "\\">" + 
        (step.success ? "✓ Success" : "✗ Failed") + "</span>" +
        "</button></h2>" +
        "<div id=\\"collapse" + index + "\\" class=\\"accordion-collapse collapse\\">" +
        "<div class=\\"accordion-body\\">" +
        "<table class=\\"table table-sm\\">" +
        "<tr><th style=\\"width: 150px;\\">Step ID:</th><td>" + step.id + "</td></tr>" +
        "<tr><th>Type:</th><td>" + stepType + "</td></tr>" +
        "<tr><th>Duration:</th><td>" + step.duration + "</td></tr>" +
        "<tr><th>Started:</th><td>" + step.startedAt + "</td></tr>" +
        "<tr><th>Finished:</th><td>" + step.finishedAt + "</td></tr>";
      
      // Add specific fields based on step type
      if (step.type === "InputStep" && step.input) {
        stepsHtml += "<tr><th>Input:</th><td>" + step.input + "</td></tr>";
      }
      
      if (step.type === "MemoryLoadStep" || step.type === "MemoryStoreStep") {
        // Add operation type indicator
        const opLabel = step.memoryOp === "store" ? "Store" : "Load";
        const badgeClass = step.memoryOp === "store" ? "bg-primary" : "bg-info";
        
        // Debugging the badge class issue
        console.log("Memory step type:", step.type);
        console.log("Memory operation:", step.memoryOp);
        console.log("Badge class:", badgeClass);
        
        // Try a completely different approach for the badge
        stepsHtml += "<tr><th>Operation:</th><td>" + 
          opLabel + "</td></tr>";
          
        stepsHtml += "<tr><th>Memory Key:</th><td>" + step.memoryKey + "</td></tr>";
        
        // For memory value, sanitize and handle as formatted content
        if (step.memoryValue) {
          // Sanitize memory value to prevent syntax errors
          let safeMemoryValue = step.memoryValue;
          // Use string split/join instead of regex to avoid syntax errors
          safeMemoryValue = safeMemoryValue.split("\\\\").join("\\\\\\\\");
          safeMemoryValue = safeMemoryValue.split("\\n").join("<br>");
          
          stepsHtml += "<tr><th>Memory Value:</th><td class=\\"memory-content\\">" + safeMemoryValue + "</td></tr>";
        }
        
        if (step.memoryType) {
          stepsHtml += "<tr><th>Memory Type:</th><td>" + step.memoryType + "</td></tr>";
        }
      }
      
      if (step.type === "PythonStep") {
        // Display Python inputs
        if (step.pythonInputs && step.pythonInputs.length > 0) {
          stepsHtml += "<tr><th>Inputs:</th><td class=\\"python-io\\">";
          
          step.pythonInputs.forEach((input, idx) => {
            stepsHtml += "<div class=\\"io-item\\">";
            stepsHtml += "<div class=\\"io-type\\">" + input.type + "</div>";
            
            let safeValue = input.value || "";
            if (safeValue) {
              // Try to format JSON if it looks like JSON
              try {
                if (typeof safeValue === 'string' && 
                   (safeValue.trim().startsWith('{') || safeValue.trim().startsWith('['))) {
                  safeValue = JSON.stringify(JSON.parse(safeValue), null, 2);
                }
              } catch (e) {
                // If parsing fails, use as is
              }
              
              safeValue = safeValue.split("\\\\").join("\\\\\\\\");
              safeValue = safeValue.split("\\n").join("<br>");
            } else {
              safeValue = "<em>Empty</em>";
            }
            
            stepsHtml += "<div class=\\"io-value\\">" + safeValue + "</div>";
            stepsHtml += "</div>";
          });
          
          stepsHtml += "</td></tr>";
        }
        
        // Display Python output (Result)
        if (step.pythonOutput) {
          stepsHtml += "<tr><th>Output:</th><td class=\\"python-io\\">";
          
          stepsHtml += "<div class=\\"io-item\\">";
          stepsHtml += "<div class=\\"io-type\\">" + step.pythonOutput.type + "</div>";
          
          let safeValue = step.pythonOutput.value || "";
          if (safeValue) {
            // Try to format JSON if it looks like JSON
            try {
              if (typeof safeValue === 'string' && 
                 (safeValue.trim().startsWith('{') || safeValue.trim().startsWith('['))) {
                safeValue = JSON.stringify(JSON.parse(safeValue), null, 2);
              }
            } catch (e) {
              // If parsing fails, use as is
            }
            
            safeValue = safeValue.split("\\\\").join("\\\\\\\\");
            safeValue = safeValue.split("\\n").join("<br>");
          } else {
            safeValue = "<em>Empty</em>";
          }
          
          stepsHtml += "<div class=\\"io-value\\">" + safeValue + "</div>";
          stepsHtml += "</div>";
          
          stepsHtml += "</td></tr>";
        }
        
        // Display additional outputs if available
        if (step.additionalOutputs && step.additionalOutputs.length > 0) {
          stepsHtml += "<tr><th>Additional Outputs:</th><td class=\\"python-io\\">";
          
          step.additionalOutputs.forEach((output, idx) => {
            stepsHtml += "<div class=\\"io-item\\">";
            stepsHtml += "<div class=\\"io-type\\">" + output.type + "</div>";
            
            let safeValue = output.value || "";
            if (safeValue) {
              // Try to format JSON if it looks like JSON
              try {
                if (typeof safeValue === 'string' && 
                   (safeValue.trim().startsWith('{') || safeValue.trim().startsWith('['))) {
                  safeValue = JSON.stringify(JSON.parse(safeValue), null, 2);
                }
              } catch (e) {
                // If parsing fails, use as is
              }
              
              safeValue = safeValue.split("\\\\").join("\\\\\\\\");
              safeValue = safeValue.split("\\n").join("<br>");
            } else {
              safeValue = "<em>Empty</em>";
            }
            
            stepsHtml += "<div class=\\"io-value\\">" + safeValue + "</div>";
            stepsHtml += "</div>";
          });
          
          stepsHtml += "</td></tr>";
        }
      }
      
      if (step.type === "APIToolStep" || step.type === "WebAPIPluginStep") {
        // Display API Tool information
        stepsHtml += "<tr><th>Tool Name:</th><td>" + step.apiToolName + "</td></tr>";
        
        if (step.apiTools && step.apiTools.length > 0) {
          stepsHtml += "<tr><th>API Calls:</th><td class=\\"api-calls\\">";
          
          step.apiTools.forEach((tool, idx) => {
            stepsHtml += "<div class=\\"api-call\\">";
            
            // Tool name and request info
            stepsHtml += "<div class=\\"api-header\\">";
            stepsHtml += "<span class=\\"api-name\\">" + tool.name + "</span>";
            stepsHtml += "<span class=\\"api-method\\">" + tool.method + "</span>";
            stepsHtml += "</div>";
            
            // URL
            if (tool.url) {
              stepsHtml += "<div class=\\"api-url\\">" + tool.url + "</div>";
            }
            
            // Parameters
            if (tool.parameters && Object.keys(tool.parameters).length > 0) {
              stepsHtml += "<div class=\\"api-section\\">";
              stepsHtml += "<div class=\\"api-section-title\\">Parameters:</div>";
              stepsHtml += "<div class=\\"api-parameters\\">";
              
              try {
                let paramStr = "";
                if (typeof tool.parameters === 'object') {
                  // Hide auth tokens with asterisks
                  const safeParams = JSON.parse(JSON.stringify(tool.parameters));
                  if (safeParams.Authorization) safeParams.Authorization = "****";
                  if (safeParams.authorization) safeParams.authorization = "****";
                  if (safeParams.token) safeParams.token = "****";
                  
                  paramStr = JSON.stringify(safeParams, null, 2);
                } else {
                  paramStr = tool.parameters;
                }
                
                paramStr = paramStr.split("\\\\").join("\\\\\\\\");
                stepsHtml += "<pre class=\\"api-parameter-content\\">" + paramStr + "</pre>";
              } catch (e) {
                stepsHtml += "<pre class=\\"api-parameter-content\\">" + 
                  (typeof tool.parameters === 'string' ? tool.parameters : JSON.stringify(tool.parameters)) + 
                  "</pre>";
              }
              
              stepsHtml += "</div>";
              stepsHtml += "</div>";
            }
            
            // Response section
            stepsHtml += "<div class=\\"api-section\\">";
            stepsHtml += "<div class=\\"api-section-title\\">Response: <span class=\\"api-status\\">" + 
              (tool.statusCode ? "Status " + tool.statusCode : "No status code") + "</span></div>";
            
            if (tool.error) {
              stepsHtml += "<div class=\\"api-error\\">" + tool.error + "</div>";
            }
            
            if (tool.responseContent) {
              try {
                // Try to format JSON response
                let formattedResponse = tool.responseContent;
                
                if (typeof formattedResponse === 'string' && 
                   (formattedResponse.trim().startsWith('{') || formattedResponse.trim().startsWith('['))) {
                  formattedResponse = JSON.stringify(JSON.parse(formattedResponse), null, 2);
                }
                
                formattedResponse = formattedResponse.split("\\\\").join("\\\\\\\\");
                formattedResponse = formattedResponse.split("\\n").join("<br>");
                
                stepsHtml += "<pre class=\\"api-response-content\\">" + formattedResponse + "</pre>";
              } catch (e) {
                // If not valid JSON, show as is
                stepsHtml += "<div class=\\"api-response-content\\">" + tool.responseContent + "</div>";
              }
            } else {
              stepsHtml += "<div class=\\"api-no-response\\">No response content</div>";
            }
            
            stepsHtml += "</div>";
            stepsHtml += "</div>";
          });
          
          stepsHtml += "</td></tr>";
        }
      }
      
      if (step.type === "AIOperation") {
        stepsHtml += 
          "<tr><th>Model:</th><td>" + step.modelName + "</td></tr>" +
          "<tr><th>Provider:</th><td>" + step.modelProvider + "</td></tr>" +
          "<tr><th>Tokens:</th><td>Input: " + step.tokens.input + 
          ", Output: " + step.tokens.output + 
          ", Total: " + step.tokens.total + "</td></tr>";
          
        // Add prompts if available
        if (step.prompts && step.prompts.length > 0) {
          stepsHtml += "<tr><th>Prompts:</th><td><div class=\\"prompt-list\\">";
          
          step.prompts.forEach(prompt => {
            const role = prompt.role || "user";
            const content = prompt.content || "";
            
            if (content) {
              // Sanitize content: escape backslashes and handle newlines
              let sanitizedContent = content;
              // Replace backslashes with double backslashes (must be done via string replace, not regex)
              sanitizedContent = sanitizedContent.split("\\\\").join("\\\\\\\\");
              // Replace newlines with <br> tags
              sanitizedContent = sanitizedContent.split("\\n").join("<br>");
              
              // For system messages with large content (like instructions), add a collapsible section
              if (role === "system" && content.length > 500) {
                stepsHtml += "<div class=\\"prompt-item prompt-" + role + "\\">" +
                  "<div class=\\"prompt-role\\">" + role + "</div>" +
                  "<details>" +
                  "<summary>View full system message (" + Math.round(content.length/100)/10 + "KB)</summary>" +
                  "<div class=\\"prompt-content\\">" + sanitizedContent + "</div>" +
                  "</details>" +
                  "</div>";
              } else {
                stepsHtml += "<div class=\\"prompt-item prompt-" + role + "\\">" +
                  "<div class=\\"prompt-role\\">" + role + "</div>" +
                  "<div class=\\"prompt-content\\">" + sanitizedContent + "</div>" +
                  "</div>";
              }
            }
          });
          
          stepsHtml += "</div></td></tr>";
        }
        
        // Add tool calls if available
        if (step.tools && step.tools.length > 0) {
          stepsHtml += "<tr><th>Tool Calls:</th><td><div class=\\"tool-calls\\">";
          
          step.tools.forEach((tool, index) => {
            const name = tool.name || "Unknown Tool";
            const id = tool.id || index;
            let args = tool.arguments || "";
            let result = tool.result || "";
            
            // Pretty format JSON if possible
            try {
              if (typeof args === "object") {
                args = JSON.stringify(args, null, 2);
              } else if (typeof args === "string") {
                // Try to parse as JSON first
                if (args.trim().startsWith("{") || args.trim().startsWith("[")) {
                  args = JSON.stringify(JSON.parse(args), null, 2);
                }
              }
            } catch (e) {
              // Keep as is if not JSON
            }
            
            try {
              if (typeof result === "object") {
                result = JSON.stringify(result, null, 2);
              } else if (typeof result === "string") {
                // Try to parse as JSON first
                if (result.trim().startsWith("{") || result.trim().startsWith("[")) {
                  result = JSON.stringify(JSON.parse(result), null, 2);
                }
              }
            } catch (e) {
              // Keep as is if not JSON
            }
            
            stepsHtml += "<div class=\\"tool-call\\">" +
              "<div class=\\"tool-header\\">" +
              "<span class=\\"tool-name\\">" + name + "</span>" +
              (id ? "<span class=\\"tool-id\\">ID: " + id + "</span>" : "") +
              "</div>" +
              "<div class=\\"tool-body\\">";
            
            if (args) {
              stepsHtml += "<div class=\\"tool-arguments-label\\"><strong>Arguments:</strong></div>" +
                "<div class=\\"tool-arguments\\">" + args + "</div>";
            }
            
            // Sanitize result to prevent syntax errors
            let displayResult = result;
            if (typeof displayResult === "string") {
              // Use string split/join instead of regex to avoid syntax errors
              displayResult = displayResult.split("\\\\").join("\\\\\\\\");
            }
            
            // For Bing search results, try to extract and prettify the JSON
            if (result && name.includes("Bing Search")) {
              try {
                const resultObj = typeof result === "object" ? result : JSON.parse(result);
                
                if (resultObj.webPages && resultObj.webPages.value) {
                  // Format search results in a more readable way
                  stepsHtml += "<div class=\\"tool-result-label\\"><strong>Search Results:</strong></div>" +
                    "<div class=\\"search-results\\" style=\\"max-height: 350px; overflow-y: auto;\\">";
                  
                  resultObj.webPages.value.forEach((page, i) => {
                    const pageUrl = page.url ? page.url.split("\\"").join("&quot;") : "";
                    const pageName = page.name ? page.name.split("<").join("&lt;").split(">").join("&gt;") : "";
                    const pageSnippet = page.snippet ? page.snippet.split("<").join("&lt;").split(">").join("&gt;") : "";
                    
                    stepsHtml += "<div class=\\"search-result\\">" +
                      "<div class=\\"search-result-title\\"><a href=\\"" + pageUrl + "\\" target=\\"_blank\\">" + pageName + "</a></div>" +
                      "<div class=\\"search-result-url\\">" + pageUrl + "</div>" +
                      "<div class=\\"search-result-snippet\\">" + pageSnippet + "</div>" +
                      "</div>";
                  });
                  
                  stepsHtml += "</div>";
                } else {
                  // Fallback to showing raw JSON - safely stringified
                  const safeJson = JSON.stringify(resultObj, null, 2).split("\\\\").join("\\\\\\\\");
                  stepsHtml += "<div class=\\"tool-result-label\\"><strong>Result:</strong></div>" +
                    "<div class=\\"tool-result\\">" + safeJson + "</div>";
                }
              } catch (e) {
                // If parsing fails, show raw result (sanitized)
                stepsHtml += "<div class=\\"tool-result-label\\"><strong>Result:</strong></div>" +
                  "<div class=\\"tool-result\\">" + displayResult + "</div>";
              }
            } else if (result) {
              // For other tool results
              stepsHtml += "<div class=\\"tool-result-label\\"><strong>Result:</strong></div>" +
                "<div class=\\"tool-result\\">" + displayResult + "</div>";
            }
            
            stepsHtml += "</div></div>";
          });
          
          stepsHtml += "</div></td></tr>";
        }
        
        // Add response if available
        if (step.response) {
          // Sanitize response to prevent syntax errors - use string methods instead of regex
          let safeResponse = step.response;
          safeResponse = safeResponse.split("\\\\").join("\\\\\\\\");
          safeResponse = safeResponse.split("\\n").join("<br>");
          
          stepsHtml += "<tr><th>Response:</th><td class=\\"response\\">" + safeResponse + "</td></tr>";
        }
      }
      
      // Add error if present
      if (step.error) {
        stepsHtml += "<tr><th>Error:</th><td class=\\"text-danger\\">" + step.error + "</td></tr>";
      }
      
      stepsHtml += "</table>";
      
      // Handle DataSearch step (from original code)
      if (stepType === "DataSearch" && step.searchResults) {
        try {
          const searchData = step.searchResults;
          
          if (searchData.Chunks && searchData.Chunks.length > 0) {
            stepsHtml += "<div class=\\"datasearch-container mt-3\\">" +
              "<h5>Data Search Results</h5>" +
              "<p>Found " + searchData.Chunks.length + " results</p>" +
              "<div class=\\"table-responsive\\">" +
              "<table class=\\"table table-sm\\">" +
              "<thead><tr><th>Score</th><th>Source</th><th>Content</th></tr></thead>" +
              "<tbody>";
            
            // Sort chunks by score
            const sortedChunks = Array.from(searchData.Chunks).sort((a, b) => {
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
              if (content.indexOf("\\\\n") !== -1) {
                content = content.split("\\\\n").join("<br>");
              }
              
              stepsHtml += "<tr>" +
                "<td><span class=\\"score-badge\\" style=\\"background-color: " + scoreColor + ";\\">" + scorePercent + "%</span></td>" +
                "<td><div class=\\"source-doc\\">" + docName + "</div>";
                
              if (pageNum) {
                stepsHtml += "<div>Page " + pageNum + "</div>";
              }
              
              stepsHtml += "</td><td>" + content + "</td></tr>";
            }
            
            stepsHtml += "</tbody></table></div></div>";
          }
        } catch (e) {
          stepsHtml += "<div class=\\"alert alert-danger\\">Error processing search results: " + e.message + "</div>";
        }
      }
      
      stepsHtml += "</div></div></div>";
    });
    
    stepsHtml += "</div>";
    stepsContent.innerHTML = stepsHtml;
  }
  
  // Format label for display
  function formatLabel(key) {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");
  }
  
  // Client-side log parsing function
  function parseLogClient(logData) {
    // Find input and output steps for summary
    let userInput = "";
    let finalOutput = "";
    let inputStepIds = [];
    let outputStepIds = [];
    
    if (logData.StepsExecutionContext) {
      // First, identify input and output steps
      for (const stepId in logData.StepsExecutionContext) {
        const step = logData.StepsExecutionContext[stepId];
        if (step.StepType === "InputStep") {
          inputStepIds.push(stepId);
          if (step.Result?.Value) {
            userInput = step.Result.Value;
          }
        } else if (step.StepType === "OutputStep") {
          outputStepIds.push(stepId);
          // We'll find the output value later after sorting
        }
      }
    }
    
    const result = {
      overview: {
        success: logData.Success,
        executionId: logData.ExecutionId || "N/A",
        userId: logData.UserId || "N/A",
        projectId: logData.ProjectId || "N/A",
        duration: logData.TimeTrackingData?.duration || "N/A",
        startedAt: formatDateTime(logData.TimeTrackingData?.startedAt),
        finishedAt: formatDateTime(logData.TimeTrackingData?.finishedAt),
      },
      summary: {
        userInput: userInput,
        finalOutput: finalOutput,
      },
      steps: [],
      errors: [],
    };
    
    // Parse steps
    if (logData.StepsExecutionContext) {
      for (const stepId in logData.StepsExecutionContext) {
        const step = logData.StepsExecutionContext[stepId];
        
        const stepInfo = {
          id: step.StepId,
          type: step.StepType,
          success: step.Success,
          duration: step.TimeTrackingData?.duration || "N/A",
          startedAt: formatDateTime(step.TimeTrackingData?.startedAt),
          finishedAt: formatDateTime(step.TimeTrackingData?.finishedAt),
        };
        
        // Add step-specific data
        if (step.StepType === "InputStep") {
          stepInfo.input = step.Result?.Value || "";
        } else if (step.StepType === "OutputStep") {
          // For output steps, try to get the value from input array
          // This is because output steps typically receive their value from a previous step
          if (step.Input && step.Input.length > 0) {
            const outputValue = step.Input[0]?.Value;
            stepInfo.output = outputValue || "";
          }
        } else if (step.StepType === "MemoryLoadStep") {
          stepInfo.memoryKey = step.Result?.Key || "";
          stepInfo.memoryValue = step.Result?.Value || "";
          stepInfo.memoryType = step.Result?.$type || "";
          stepInfo.memoryOp = "load";
        } else if (step.StepType === "MemoryStoreStep") {
          // For store steps, information is typically in the Input
          if (step.Input && step.Input.length > 0) {
            const input = step.Input[0];
            stepInfo.memoryKey = input?.Key || "";
            stepInfo.memoryValue = input?.Value || "";
            stepInfo.memoryType = input?.$type || "";
            stepInfo.memoryOp = "store";
          }
        } else if (step.StepType === "PythonStep") {
          // Handle Python steps
          // Result is the output of the Python execution
          stepInfo.pythonOutput = {
            type: step.Result?.$type || "python",
            value: step.Result?.Value || ""
          };
          
          // If there are inputs, capture them
          if (step.Input && step.Input.length > 0) {
            stepInfo.pythonInputs = step.Input.map(input => {
              return {
                type: input.$type || "unknown",
                value: input.Value || ""
              };
            });
          }
          
          // Also capture additional outputs if available
          if (step.Output && step.Output.length > 0) {
            stepInfo.additionalOutputs = step.Output.map(out => {
              return {
                type: out.$type || "unknown",
                value: out.Value || ""
              };
            });
          }
        } else if (step.StepType === "APIToolStep" || step.StepType === "WebAPIPluginStep") {
          // Handle API tool steps
          stepInfo.apiToolName = step.DebugInformation?.toolName || "Unknown API Tool";
          
          // Process the API parameters
          if (step.DebugInformation?.tools && step.DebugInformation.tools.length > 0) {
            stepInfo.apiTools = step.DebugInformation.tools.map(tool => {
              return {
                name: tool.ToolName || tool.name || "Unknown Tool",
                parameters: tool.ToolParameters || tool.RequestParameters || {},
                url: tool.RequestUrl || "",
                method: tool.RequestMethod || "GET",
                statusCode: tool.ResponseStatusCode || 0,
                responseContent: tool.ResponseContent || "",
                error: tool.ErrorMessage || ""
              };
            });
          }
        } else if (step.StepType === "AIOperation") {
          stepInfo.modelName = step.DebugInformation?.modelDisplayName || step.DebugInformation?.modelName || "N/A";
          stepInfo.modelProvider = step.DebugInformation?.modelProviderType || "N/A";
          stepInfo.tokens = {
            input: step.DebugInformation?.inputTokens || "0",
            output: step.DebugInformation?.outputTokens || "0",
            total: step.DebugInformation?.totalTokens || "0",
          };
          
          // Extract prompts from messages array or from Input array
          if (step.DebugInformation?.messages && step.DebugInformation.messages.length > 0) {
            // Standardize the prompt format
            stepInfo.prompts = step.DebugInformation.messages.map(message => {
              return {
                role: message.Role?.toLowerCase() || message.role?.toLowerCase() || "user",
                content: message.TextContent || message.content || message.text || ""
              };
            }).filter(prompt => prompt.content);
          } else if (step.Input && step.Input.length > 0) {
            // Try to get prompts from the Input array
            stepInfo.prompts = step.Input.map(input => {
              return {
                role: "user",
                content: input.Value || ""
              };
            }).filter(prompt => prompt.content);
          }
          
          // Extract tool calls information
          if (step.DebugInformation?.tools && step.DebugInformation.tools.length > 0) {
            // Enhance the tool information for better display
            stepInfo.tools = step.DebugInformation.tools.map(tool => {
              // Extract tool name from the RequestUrl if available and not already set
              if (!tool.name && !tool.ToolName && tool.RequestUrl) {
                try {
                  const url = new URL(tool.RequestUrl);
                  if (url.hostname.includes("bing.microsoft.com")) {
                    tool.ToolName = "Microsoft Bing Search";
                  } else if (url.hostname.includes("api.openai.com")) {
                    tool.ToolName = "OpenAI API";
                  } else if (url.hostname.includes("maps.googleapis.com")) {
                    tool.ToolName = "Google Maps";
                  }
                } catch (e) {
                  // Leave name as is if URL parsing fails
                }
              }
              
              return {
                name: tool.ToolName || tool.name || "Unknown Tool",
                id: tool.id || tool.ToolId || "",
                arguments: tool.ToolParameters || tool.arguments || "",
                result: tool.ResponseContent || tool.result || ""
              };
            });
          }
          
          // In case the AI operation provides a response directly
          if (step.Result?.Value) {
            stepInfo.response = step.Result.Value;
          }
        } else if (step.StepType === "DataSearch" && step.Result && step.Result.Value) {
          try {
            stepInfo.searchResults = JSON.parse(step.Result.Value);
          } catch (e) {
            console.error("Error parsing DataSearch results:", e);
          }
        }
        
        // Add error information if present
        if (!step.Success && step.ExceptionMessage) {
          stepInfo.error = step.ExceptionMessage;
          result.errors.push({
            stepId: step.StepId,
            stepType: step.StepType,
            message: step.ExceptionMessage,
          });
        }
        
        result.steps.push(stepInfo);
      }
      
      // Sort steps by start time
      result.steps.sort((a, b) => {
        const dateA = new Date(a.startedAt === "N/A" ? 0 : a.startedAt);
        const dateB = new Date(b.startedAt === "N/A" ? 0 : b.startedAt);
        return dateA - dateB;
      });
      
      // Now that steps are sorted, find the final output from the last OutputStep
      const outputSteps = result.steps.filter(step => step.type === "OutputStep");
      if (outputSteps.length > 0) {
        const lastOutputStep = outputSteps[outputSteps.length - 1];
        if (lastOutputStep.output) {
          result.summary.finalOutput = lastOutputStep.output;
        }
      }
      
      // If we couldn't find the output from OutputStep, try the last AIOperation response
      if (!result.summary.finalOutput) {
        const aiSteps = result.steps.filter(step => step.type === "AIOperation" && step.response);
        if (aiSteps.length > 0) {
          const lastAIStep = aiSteps[aiSteps.length - 1];
          result.summary.finalOutput = lastAIStep.response || "";
        }
      }
    }
    
    return result;
  }
  
  // Format date-time string
  function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return "N/A";
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleString();
    } catch (e) {
      return dateTimeStr;
    }
  }
});
  `;
}