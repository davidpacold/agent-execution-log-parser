import { parseLogData } from './src/lib/log-parser.js';

// A simple test function
async function testLogParser() {
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
        }
    }
  };

  // Parse the log data
  const parsedData = parseLogData(sampleLogData);
  
  // Check if input/output extraction is working
  const steps = parsedData.steps;
  
  console.log("Total steps parsed:", steps.length);
  
  // Print each step with input and output
  steps.forEach((step, index) => {
    console.log(`\nStep ${index + 1}: ${step.type}`);
    console.log("  ID:", step.id);
    
    if (step.input) {
      console.log("  Input:", typeof step.input === 'string' ? step.input : JSON.stringify(step.input));
    } else {
      console.log("  Input: <none>");
    }
    
    if (step.output || step.response) {
      console.log("  Output:", typeof (step.output || step.response) === 'string' ? 
        (step.output || step.response) : 
        JSON.stringify(step.output || step.response));
    } else {
      console.log("  Output: <none>");
    }
  });
}

// Run the test
testLogParser().catch(console.error);