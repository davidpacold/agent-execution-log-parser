/**
 * Main client-side application
 */
import { initEventHandlers } from './event-handlers.js';
import { configureAccordions } from './ui-controller.js';

/**
 * Initialize the application
 */
export function initApp() {
  console.log("Log parser script v1.0.0 starting");

  // Initialize app when DOM is ready
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
      if (!element) {
        console.error(`Required element ${id} not found!`);
      }
    }

    // Get DOM elements
    const elements = {
      logInput: document.getElementById("logInput"),
      logFile: document.getElementById("logFile"),
      parseBtn: document.getElementById("parseBtn"),
      loadingIndicator: document.getElementById("loadingIndicator"),
      resultsContainer: document.getElementById("results-container"),
      overviewContent: document.getElementById("overview-content"),
      summaryContent: document.getElementById("summary-content"),
      stepsContent: document.getElementById("steps-content"),
      rawContent: document.getElementById("raw-content"),
      errorsSection: document.getElementById("errors-section"),
      errorSummary: document.getElementById("error-summary"),
      copyJsonBtn: document.getElementById("copyJsonBtn"),
      expandAllBtn: document.getElementById("expandAllBtn")
    };

    // Initialize application state
    const state = {
      allExpanded: false,
      parsedResult: null
    };

    // Initialize event handlers
    initEventHandlers(elements, state);
    
    // Run accordion configuration after initial load
    configureAccordions();
  });
}