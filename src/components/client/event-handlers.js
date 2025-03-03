/**
 * UI event handlers for the log parser
 */
import { parseLogData } from './client-parser.js';
import { displayResults } from './ui-controller.js';

/**
 * Initialize all event handlers for the UI
 * @param {object} elements - DOM elements
 * @param {object} state - Application state
 */
export function initEventHandlers(elements, state) {
  // Handle file upload
  elements.logFile.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        elements.logInput.value = e.target.result;
      };
      reader.readAsText(file);
    }
  });

  // Parse button click handler
  elements.parseBtn.addEventListener("click", function() {
    console.log("Parse button clicked");
    
    try {
      const logData = elements.logInput.value.trim();
      if (!logData) {
        alert("Please paste log data or upload a log file.");
        return;
      }
      
      elements.loadingIndicator.classList.remove("hidden");
      elements.resultsContainer.classList.add("hidden");
      
      try {
        console.log("Parsing JSON data");
        // Parse the JSON data
        const data = JSON.parse(logData);
        
        console.log("Processing log data");
        
        // Use our parsing function
        try {
          state.parsedResult = parseLogData(data);
          
          // Debug log the complete parsed data for troubleshooting
          console.log("FULL PARSED RESULT BEFORE DISPLAY:", 
            JSON.stringify(state.parsedResult.steps.map(s => {
              // Create a simplified view for logging
              return {
                id: s.id,
                type: s.type,
                hasModelData: s.type === 'RouterStep' ? !!s.modelName : false,
                hasRouteDecision: s.type === 'RouterStep' ? !!s.routeDecision : false,
                hasBranchIds: s.type === 'RouterStep' ? (s.branchIds?.length > 0) : false
              };
            }), null, 2)
          );
        } catch (e) {
          console.error("Error parsing log:", e);
          alert("Error parsing log data: " + e.message);
          elements.loadingIndicator.classList.add("hidden");
          return;
        }
        
        // Display the results
        displayResults(elements, state.parsedResult);
        
      } catch (e) {
        console.error("Error processing log:", e);
        elements.loadingIndicator.classList.add("hidden");
        alert("Error parsing JSON: " + e.message);
      }
    } catch (outerError) {
      console.error("Critical error in click handler:", outerError);
      alert("An unexpected error occurred: " + outerError.message);
    }
  });
  
  // Toggle expand/collapse all steps
  if (elements.expandAllBtn) {
    elements.expandAllBtn.addEventListener("click", function() {
      const stepBodies = document.querySelectorAll(".accordion-collapse");
      state.allExpanded = !state.allExpanded;
      
      stepBodies.forEach(body => {
        if (state.allExpanded) {
          body.classList.add("show");
        } else {
          body.classList.remove("show");
        }
      });
      
      elements.expandAllBtn.textContent = state.allExpanded ? "Collapse All" : "Expand All";
    });
  }
  
  // Copy processed JSON
  if (elements.copyJsonBtn) {
    elements.copyJsonBtn.addEventListener("click", function() {
      if (state.parsedResult) {
        navigator.clipboard.writeText(JSON.stringify(state.parsedResult, null, 2))
          .then(() => {
            const originalText = elements.copyJsonBtn.textContent;
            elements.copyJsonBtn.textContent = "Copied!";
            setTimeout(() => {
              elements.copyJsonBtn.textContent = originalText;
            }, 2000);
          })
          .catch(err => {
            console.error("Failed to copy: ", err);
          });
      }
    });
  }
}