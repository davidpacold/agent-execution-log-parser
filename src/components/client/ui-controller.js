/**
 * UI controller for the log parser client
 */
import { renderOverview } from '../display/overview.js';
import { renderSummary } from '../display/summary.js';
import { renderErrors } from '../display/errors.js';
import { renderSteps } from '../display/steps.js';

/**
 * Configure Bootstrap accordions to allow multiple open sections
 */
export function configureAccordions() {
  const allAccordions = document.querySelectorAll(".accordion");
  allAccordions.forEach(accordion => {
    // Remove the data-bs-parent attribute from all accordion items
    const items = accordion.querySelectorAll(".accordion-collapse");
    items.forEach(item => {
      item.removeAttribute("data-bs-parent");
    });
  });
}

/**
 * Display the parsed results in the UI
 * @param {object} elements - DOM elements
 * @param {object} parsedResult - The parsed log data
 */
export function displayResults(elements, parsedResult) {
  // Display overview metrics
  elements.overviewContent.innerHTML = renderOverview(parsedResult.overview);
  
  // Display summary
  elements.summaryContent.innerHTML = renderSummary(parsedResult.summary);
  
  // Display errors if any
  if (parsedResult.errors && parsedResult.errors.length > 0) {
    elements.errorsSection.style.display = "block";
    elements.errorSummary.innerHTML = renderErrors(parsedResult.errors);
  } else {
    elements.errorsSection.style.display = "none";
  }
  
  // Display steps
  elements.stepsContent.innerHTML = renderSteps(parsedResult.steps);
  
  // Display raw JSON and log it for debugging
  const rawJson = JSON.stringify(parsedResult, null, 2);
  elements.rawContent.textContent = rawJson;
  
  // Check for RouterSteps in the raw JSON
  if (parsedResult && parsedResult.steps) {
    const routerSteps = parsedResult.steps.filter(s => s.type === 'RouterStep');
    if (routerSteps.length > 0) {
      console.log("RAW JSON ROUTER STEPS:", JSON.stringify(routerSteps, null, 2));
    }
  }
  
  // Show results
  elements.loadingIndicator.classList.add("hidden");
  elements.resultsContainer.classList.remove("hidden");
  elements.resultsContainer.scrollIntoView({ behavior: "smooth" });
  
  // Configure accordions after results are shown
  setTimeout(configureAccordions, 100);
}