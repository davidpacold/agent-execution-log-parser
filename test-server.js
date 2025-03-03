import { parseLogData } from './src/lib/log-parser.js';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the necessary renderer
import { renderSteps } from './src/components/display/steps.js';
import { renderOverview } from './src/components/display/overview.js';
import { renderSummary } from './src/components/display/summary.js';
import { renderErrors } from './src/components/display/errors.js';
// Create a simple template function for testing
function template(overview, summary, steps, errors) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Log File Parser</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>Log Parser Test</h1>
    </header>
    
    <div class="card mb-4">
      <div class="card-header">
        <h2 class="h5 mb-0">Overview</h2>
      </div>
      <div class="card-body">
        <div id="overview-content" class="overview">${overview}</div>
      </div>
    </div>
    
    <div id="errors-section" class="mb-4" ${errors ? '' : 'style="display: none;"'}>
      <div class="card border-danger">
        <div class="card-header bg-danger text-white">
          <h2 class="h5 mb-0">Errors</h2>
        </div>
        <div class="card-body" id="error-summary">${errors}</div>
      </div>
    </div>
    
    <div class="card mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h2 class="h5 mb-0">Execution Steps</h2>
        <button id="expandAllBtn" class="btn btn-sm btn-outline-secondary">Expand All</button>
      </div>
      <div class="card-body">
        <div id="steps-content">${steps}</div>
      </div>
    </div>
    
    <div class="card mb-4">
      <div class="card-header">
        <h2 class="h5 mb-0">Conversation Summary</h2>
      </div>
      <div class="card-body">
        <div id="summary-content" class="conversation-summary">${summary}</div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    // Simple script to expand all steps
    document.getElementById('expandAllBtn').addEventListener('click', function() {
      const buttons = document.querySelectorAll('.accordion-button.collapsed');
      buttons.forEach(button => {
        button.click();
      });
    });
  </script>
</body>
</html>`;
}

// Sample log data
const sampleLogData = {
  "Success": true,
  "ExecutionId": "9690b939-b4be-4e9d-87a0-b63e27c7ffec",
  "UserId": "01945cac-9b05-75a6-8719-0525b73608a2",
  "TimeTrackingData": {
      "duration": "00:00:38.3285269",
      "startedAt": "2025-03-03T00:31:06.8843974Z",
      "finishedAt": "2025-03-03T00:31:45.2257542Z"
  },
  "StepsExecutionContext": {
      "9733f446-30ed-49cd-9d3b-d65e814c341d": {
          "StepId": "9733f446-30ed-49cd-9d3b-d65e814c341d",
          "StepType": "InputStep",
          "DebugInformation": {
              "streamed": false
          },
          "TimeTrackingData": {
              "duration": "00:00:00.0004355",
              "startedAt": "2025-03-03T00:31:06.898928Z",
              "finishedAt": "2025-03-03T00:31:06.898934Z"
          },
          "Input": [],
          "Result": {
              "$type": "input",
              "Value": "Research https://www.vic.gov.au/education for outreach to Robert Munoz.",
              "StepId": "9733f446-30ed-49cd-9d3b-d65e814c341d",
              "StepType": "InputStep"
          },
          "Success": true
      },
      "cdfba459-3e62-4821-9d4b-3f712dd8297c": {
          "StepId": "cdfba459-3e62-4821-9d4b-3f712dd8297c",
          "StepType": "RouterStep",
          "DebugInformation": {
              "modelName": "gpt-4o",
              "modelDisplayName": "GPT-4o",
              "modelId": "4940b03e-98ca-466a-bf9f-72347d3f252f",
              "inputTokens": "533",
              "outputTokens": "12",
              "totalTokens": "545",
              "modelProviderType": "OpenAI",
              "streamed": true,
              "response": "{\"route\":\"route 4\"}"
          },
          "TimeTrackingData": {
              "duration": "00:00:00.7382941",
              "startedAt": "2025-03-03T00:31:06.8994532Z",
              "finishedAt": "2025-03-03T00:31:07.6372437Z"
          },
          "Input": [
              {
                  "$type": "input",
                  "Value": "Research https://www.vic.gov.au/education for outreach to Robert Munoz.",
                  "StepId": "9733f446-30ed-49cd-9d3b-d65e814c341d",
                  "StepType": "InputStep"
              }
          ],
          "Result": {
              "$type": "branch",
              "Value": [
                  {
                      "$type": "input",
                      "Value": "Research https://www.vic.gov.au/education for outreach to Robert Munoz.",
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
      },
      "c9b43ba3-b1f2-4659-9c98-38d54c6079d2": {
          "StepId": "c9b43ba3-b1f2-4659-9c98-38d54c6079d2",
          "StepType": "ExecutePipelineStep",
          "DebugInformation": {
              "streamed": false
          },
          "TimeTrackingData": {
              "duration": "00:00:25.7275034",
              "startedAt": "2025-03-03T00:31:07.638334Z",
              "finishedAt": "2025-03-03T00:31:33.3650016Z"
          },
          "Input": [
              {
                  "$type": "branch",
                  "Value": [
                      {
                          "$type": "input",
                          "Value": "Research https://www.vic.gov.au/education for outreach to Robert Munoz.",
                          "StepId": "9733f446-30ed-49cd-9d3b-d65e814c341d",
                          "StepType": "InputStep"
                      }
                  ],
                  "StepId": "cdfba459-3e62-4821-9d4b-3f712dd8297c",
                  "StepType": "RouterStep",
                  "BranchIds": [
                      "c9b43ba3-b1f2-4659-9c98-38d54c6079d2"
                  ]
              }
          ],
          "Result": {
              "$type": "agent",
              "Value": "Based on the research of the Victoria Department of Education website, I'll create a detailed dossier for outreach to Robert Munoz, focusing on relevant Airia use cases and opportunities:\n\nDOSSIER FOR ROBERT MUNOZ\nVictoria Department of Education Context\n\nOrganization Overview:\n- Large state government education department in Victoria, Australia\n- Oversees early childhood, primary, secondary, and further education\n- Major initiatives include \"The Education State\" reform agenda\n- Significant digital transformation efforts across educational services\n\nKey Areas of Responsibility:\n1. Early Childhood Education\n2. Primary and Secondary Schools\n3. Teacher Development & Support\n4. Educational Policy & Programs\n5. Research & Data Management\n\nPotential Pain Points & Opportunities:\n\n1. Data Management & Integration\n- Managing large volumes of educational data across multiple systems\n- Need for secure data integration between schools, early childhood centers, and department\nAiria Solution: Data Source Connectors could help integrate various educational databases while maintaining security and compliance\n\n2. Administrative Automation\n- Heavy administrative workload for teachers and staff\n- Multiple systems and processes requiring manual intervention\nAiria Solution: Airia agents could automate routine administrative tasks, document processing, and reporting\n\n3. Content Management\n- Large volume of educational resources and materials\n- Need for efficient content organization and distribution\nAiria Solution: Implement content management agents to organize, tag, and distribute educational materials\n\n4. Multilingual Support\n- Provides support in multiple languages for diverse community\n- Need for efficient translation and communication\nAiria Solution: Language processing agents could assist with translation and multilingual communication\n\n5. Research & Analytics\n- Extensive research programs and data collection\n- Need for efficient analysis and reporting\nAiria Solution: Analytics agents could help process research data and generate insights\n\nSpecific Use Cases for Airia:\n\n1. Educational Content Processing\n- Implement agents to:\n  * Organize and classify educational resources\n  * Generate summaries of research papers\n  * Create metadata for educational content\n  * Convert documents into multiple formats\n\n2. Administrative Automation\n- Deploy agents for:\n  * Processing student enrollment documents\n  * Automating response to common inquiries\n  * Generating regular reports\n  * Managing document workflows\n\n3. Research Support\n- Utilize agents for:\n  * Data analysis and visualization\n  * Research paper summarization\n  * Literature review automation\n  * Report generation\n\n4. Communication Enhancement\n- Implement agents for:\n  * Multilingual communication support\n  * Parent inquiry response automation\n  * Document translation\n  * Communication personalization\n\nRecommended Approach:\n1. Focus on efficiency gains through automation\n2. Emphasize data security and compliance\n3. Highlight multilingual capabilities\n4. Demonstrate ROI through administrative time savings\n5. Show scalability across different educational contexts\n\nKey Decision Factors:\n1. Data Security & Privacy Compliance\n2. Integration with Existing Systems\n3. Ease of Use for Staff\n4. Scalability\n5. Cost-Effectiveness\n\nNext Steps:\n1. Schedule initial meeting to discuss specific department pain points\n2. Prepare demo focused on educational use cases\n3. Develop proposal aligned with department's digital transformation goals\n4. Identify pilot program opportunities\n\nThis dossier provides a foundation for outreach to Robert Munoz, focusing on how Airia can address specific challenges in the Victorian education system while aligning with their digital transformation initiatives. The approach emphasizes practical solutions that can deliver immediate value while supporting longer-term strategic goals.",
              "StepId": "c9b43ba3-b1f2-4659-9c98-38d54c6079d2",
              "StepType": "ExecutePipelineStep"
          },
          "Success": true
      },
      "6b9a94d5-cb5e-463e-b99d-a7cbd0356d8e": {
          "StepId": "6b9a94d5-cb5e-463e-b99d-a7cbd0356d8e",
          "StepType": "OutputStep",
          "DebugInformation": {
              "streamed": false
          },
          "TimeTrackingData": {
              "duration": "00:00:00.0235255",
              "startedAt": "2025-03-03T00:31:45.1930892Z",
              "finishedAt": "2025-03-03T00:31:45.2160149Z"
          },
          "Input": [
              {
                  "$type": "agent",
                  "Value": "Let me craft a concise, focused outreach email to Robert Munoz based on the research and Airia's capabilities:\n\nSubject: Streamlining Education Workflows with AI - 20 Min Discussion?\n\nDear Robert,\n\nI noticed the Victorian Department of Education's extensive digital initiatives and thought you might be interested in how AI orchestration is helping education departments automate administrative processes while maintaining strict data security.\n\nAiria's AI orchestration platform is helping education organizations:\n• Automate document processing across multiple systems\n• Ensure sensitive student data remains protected with built-in DLP\n• Streamline multilingual communication workflows\n• Reduce manual effort in research and reporting tasks\n\nWould you be open to a 20-minute discussion next week to explore how Airia could support your department's digital transformation goals? I can share specific examples of how other education organizations are using AI automation while maintaining compliance.\n\nBest regards,\n[Name]\n\n---\n\nThis email is:\n1. Concise and focused on value\n2. Specific to education sector needs\n3. Highlights security/DLP (key differentiator)\n4. Includes clear call to action (20-min meeting)\n5. Demonstrates understanding of their domain\n\nThe email avoids technical jargon while touching on key pain points (document processing, data security, multilingual needs, administrative burden) that resonate with education departments.",
                  "StepId": "02f47762-96c5-4675-84e4-e5e6e51942f7",
                  "StepType": "ExecutePipelineStep"
              }
          ],
          "Result": {
              "$type": "output",
              "Value": "Let me craft a concise, focused outreach email to Robert Munoz based on the research and Airia's capabilities:\n\nSubject: Streamlining Education Workflows with AI - 20 Min Discussion?\n\nDear Robert,\n\nI noticed the Victorian Department of Education's extensive digital initiatives and thought you might be interested in how AI orchestration is helping education departments automate administrative processes while maintaining strict data security.\n\nAiria's AI orchestration platform is helping education organizations:\n• Automate document processing across multiple systems\n• Ensure sensitive student data remains protected with built-in DLP\n• Streamline multilingual communication workflows\n• Reduce manual effort in research and reporting tasks\n\nWould you be open to a 20-minute discussion next week to explore how Airia could support your department's digital transformation goals? I can share specific examples of how other education organizations are using AI automation while maintaining compliance.\n\nBest regards,\n[Name]\n\n---\n\nThis email is:\n1. Concise and focused on value\n2. Specific to education sector needs\n3. Highlights security/DLP (key differentiator)\n4. Includes clear call to action (20-min meeting)\n5. Demonstrates understanding of their domain\n\nThe email avoids technical jargon while touching on key pain points (document processing, data security, multilingual needs, administrative burden) that resonate with education departments.",
              "StepId": "6b9a94d5-cb5e-463e-b99d-a7cbd0356d8e",
              "StepType": "OutputStep"
          },
          "Success": true
      }
  },
  "ProjectId": "0193e594-0386-7c95-9ad6-a292a629db5d"
};

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Parse the log data
    const parsedData = parseLogData(sampleLogData);
    
    // Debug the RouterStep data
    const routerStep = parsedData.steps.find(s => s.type === 'RouterStep');
    console.log("Router step details:", JSON.stringify(routerStep, null, 2));
    
    // Render the components
    const overviewHtml = renderOverview(parsedData.overview);
    const summaryHtml = renderSummary(parsedData.summary);
    const stepsHtml = renderSteps(parsedData.steps);
    const errorsHtml = renderErrors(parsedData.errors);
    
    // Fill the template and send response
    const html = template(overviewHtml, summaryHtml, stepsHtml, errorsHtml);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else if (req.url === '/styles/main.css') {
    // Serve CSS file
    const cssPath = path.join(__dirname, 'src', 'styles', 'main.css');
    fs.readFile(cssPath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop');
});