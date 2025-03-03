// E2E test for RouterStep processing
// This test validates that RouterStep data is correctly processed from input to rendered HTML

import { describe, it, expect, beforeEach } from 'vitest';
import { parseLogData } from '../src/lib/log-parser.js';
import { renderRouterStep } from '../src/components/display/step-renderers/router-step.js';
import { JSDOM } from 'jsdom';

// Sample RouterStep data that mirrors the production data
const routerStepSampleData = {
  "StepsExecutionContext": {
    "cdfba459-3e62-4821-9d4b-3f712dd8297c": {
      "StepId": "cdfba459-3e62-4821-9d4b-3f712dd8297c",
      "StepType": "RouterStep",
      "DebugInformation": {
        "modelName": "gpt-4o",
        "modelDisplayName": "GPT-4o",
        "modelId": "4940b03e-98ca-466a-bf9f-72347d3f252f",
        "inputTokens": "551",
        "outputTokens": "12",
        "totalTokens": "563",
        "modelProviderType": "OpenAI",
        "streamed": true,
        "response": "{\"route\":\"route 4\"}"
      },
      "TimeTrackingData": {
        "duration": "00:00:00.6104932",
        "startedAt": "2025-03-03T03:09:11.7487035Z",
        "finishedAt": "2025-03-03T03:09:12.3580145Z"
      },
      "Input": [
        {
          "$type": "input",
          "Value": "this was actually a blog post that Tal had writen so I am wanting to send him an email to summerise what jumped out from his blog to what Airia does",
          "StepId": "9733f446-30ed-49cd-9d3b-d65e814c341d",
          "StepType": "InputStep"
        }
      ],
      "Result": {
        "$type": "branch",
        "Value": [
          {
            "$type": "input",
            "Value": "this was actually a blog post that Tal had writen so I am wanting to send him an email to summerise what jumped out from his blog to what Airia does",
            "StepId": "9733f446-30ed-49cd-9d3b-d65e814c341d",
            "StepType": "InputStep"
          }
        ],
        "StepId": "cdfba459-3e62-4821-9d4b-3f712dd8297c", 
        "StepType": "RouterStep",
        "BranchIds": [
          "c9b43ba3-b1f2-4659-9c98-38d54c6079d2"
        ]
      },
      "Success": true
    }
  },
  "Success": true
};

// These are the fields we expect to be present in the parsed RouterStep
const EXPECTED_FIELDS = [
  'id',
  'type',
  'success',
  'duration',
  'startedAt',
  'finishedAt',
  'modelName',
  'modelProvider',
  'tokens',
  'routeDecision',
  'branchIds',
  'input',
  'output'
];

// Helper function to create a DOM element from HTML string
function createElementFromHTML(htmlString) {
  const dom = new JSDOM(htmlString);
  return dom.window.document.body;
}

describe('RouterStep End-to-End Processing', () => {
  let parsedData;
  let routerStep;
  
  beforeEach(() => {
    // Parse the sample data
    parsedData = parseLogData(routerStepSampleData);
    
    // Find the RouterStep in the parsed data
    routerStep = parsedData.steps.find(step => step.type === 'RouterStep');
  });
  
  it('should correctly extract a RouterStep from the log data', () => {
    expect(parsedData).toBeDefined();
    expect(parsedData.steps).toBeInstanceOf(Array);
    expect(routerStep).toBeDefined();
    expect(routerStep.type).toBe('RouterStep');
    expect(routerStep.id).toBe('cdfba459-3e62-4821-9d4b-3f712dd8297c');
  });
  
  it('should have all required fields in the parsed RouterStep', () => {
    // Check if all expected fields are present
    EXPECTED_FIELDS.forEach(field => {
      expect(routerStep).toHaveProperty(field);
    });
    
    // Verify specific important fields
    expect(routerStep.modelName).toBe('GPT-4o');
    expect(routerStep.modelProvider).toBe('OpenAI');
    expect(routerStep.tokens).toHaveProperty('input', '551');
    expect(routerStep.tokens).toHaveProperty('output', '12');
    expect(routerStep.tokens).toHaveProperty('total', '563');
    
    // Verify routeDecision is parsed
    expect(routerStep.routeDecision).toHaveProperty('route', 'route 4');
    
    // Verify branchIds is an array
    expect(routerStep.branchIds).toBeInstanceOf(Array);
    expect(routerStep.branchIds).toContain('c9b43ba3-b1f2-4659-9c98-38d54c6079d2');
  });
  
  it('should render the RouterStep with all important information', () => {
    // Render the RouterStep to HTML
    const html = renderRouterStep(routerStep);
    expect(html).toBeDefined();
    expect(typeof html).toBe('string');
    
    // Parse the HTML into a DOM element
    const element = createElementFromHTML(`<table>${html}</table>`);
    
    // Check for the model name in the rendered HTML
    const modelCell = element.querySelector('th:contains("Model:") + td');
    expect(modelCell.textContent).toBe('GPT-4o');
    
    // Check for the provider in the rendered HTML
    const providerCell = element.querySelector('th:contains("Provider:") + td');
    expect(providerCell.textContent).toBe('OpenAI');
    
    // Check for tokens in the rendered HTML
    const tokensCell = element.querySelector('th:contains("Tokens:") + td');
    expect(tokensCell.textContent).toContain('Input: 551');
    expect(tokensCell.textContent).toContain('Output: 12');
    expect(tokensCell.textContent).toContain('Total: 563');
    
    // Check for route decision in the rendered HTML
    const decisionCell = element.querySelector('th:contains("Route Decision:") + td');
    expect(decisionCell.textContent).toContain('route 4');
    
    // Check for branch IDs in the rendered HTML
    const branchCell = element.querySelector('th:contains("Branch IDs:") + td');
    expect(branchCell.textContent).toContain('c9b43ba3-b1f2-4659-9c98-38d54c6079d2');
  });
  
  it('should include all RouterStep fields in the final JSON result', () => {
    // Check the fields in the final JSON result
    const finalJson = JSON.stringify(parsedData);
    const finalParsed = JSON.parse(finalJson);
    
    // Find the RouterStep in the final JSON
    const finalRouterStep = finalParsed.steps.find(step => step.type === 'RouterStep');
    
    // Ensure all fields are present in the final JSON
    EXPECTED_FIELDS.forEach(field => {
      expect(finalRouterStep).toHaveProperty(field);
    });
    
    // Ensure critical fields have correct values
    expect(finalRouterStep.modelName).toBe('GPT-4o');
    expect(finalRouterStep.modelProvider).toBe('OpenAI');
    expect(finalRouterStep.tokens.input).toBe('551');
    expect(finalRouterStep.tokens.output).toBe('12');
    expect(finalRouterStep.routeDecision.route).toBe('route 4');
    expect(finalRouterStep.branchIds).toContain('c9b43ba3-b1f2-4659-9c98-38d54c6079d2');
  });
});
