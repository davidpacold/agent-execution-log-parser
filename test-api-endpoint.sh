#\!/bin/bash
# Test script to validate that the API endpoint is correctly handling RouterStep data

# Create a temporary file with sample RouterStep data
echo '{
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
          "Value": "this was a test input",
          "StepId": "9733f446-30ed-49cd-9d3b-d65e814c341d",
          "StepType": "InputStep"
        }
      ],
      "Result": {
        "$type": "branch",
        "Value": [
          {
            "$type": "input",
            "Value": "this was a test input",
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
}' > /tmp/router-step-test.json

echo "=== TESTING API ENDPOINT ==="
echo "1. Starting local worker..."
npx wrangler dev --local &
SERVER_PID=$\!

# Wait for the server to start
echo "Waiting for server to start..."
sleep 3

echo "2. Sending request to API endpoint..."
curl -s -X POST -H "Content-Type: application/json" --data @/tmp/router-step-test.json http://localhost:8787/api/parse > /tmp/api-response.json

echo "3. Analyzing API response..."
# Check for RouterStep in the response
ROUTER_STEP=$(cat /tmp/api-response.json | grep -o '"type":"RouterStep"')
if [ -z "$ROUTER_STEP" ]; then
  echo "❌ ERROR: No RouterStep found in API response"
  kill $SERVER_PID
  exit 1
fi

echo "✅ Found RouterStep in API response"

# Check for modelName field
MODEL_NAME=$(cat /tmp/api-response.json | grep -o '"modelName":"GPT-4o"')
if [ -z "$MODEL_NAME" ]; then
  echo "❌ ERROR: modelName field not found in RouterStep"
  kill $SERVER_PID
  exit 1
fi

echo "✅ modelName field present and correct"

# Check for modelProvider field
MODEL_PROVIDER=$(cat /tmp/api-response.json | grep -o '"modelProvider":"OpenAI"')
if [ -z "$MODEL_PROVIDER" ]; then
  echo "❌ ERROR: modelProvider field not found in RouterStep"
  kill $SERVER_PID
  exit 1
fi

echo "✅ modelProvider field present and correct"

# Check for tokens field
TOKENS=$(cat /tmp/api-response.json | grep -o '"tokens":{"input":"551","output":"12","total":"563"}')
if [ -z "$TOKENS" ]; then
  echo "❌ ERROR: tokens field not found or incorrect in RouterStep"
  kill $SERVER_PID
  exit 1
fi

echo "✅ tokens field present and correct"

# Check for routeDecision field
ROUTE_DECISION=$(cat /tmp/api-response.json | grep -o '"routeDecision":{"route":"route 4"}')
if [ -z "$ROUTE_DECISION" ]; then
  echo "❌ ERROR: routeDecision field not found or incorrect in RouterStep"
  kill $SERVER_PID
  exit 1
fi

echo "✅ routeDecision field present and correct"

# Check for branchIds field
BRANCH_IDS=$(cat /tmp/api-response.json | grep -o '"branchIds":\["c9b43ba3-b1f2-4659-9c98-38d54c6079d2"\]')
if [ -z "$BRANCH_IDS" ]; then
  echo "❌ ERROR: branchIds field not found or incorrect in RouterStep"
  kill $SERVER_PID
  exit 1
fi

echo "✅ branchIds field present and correct"

echo ""
echo "=== API ENDPOINT TEST PASSED ✅ ==="
echo "API response has been saved to /tmp/api-response.json"

# Cleanup
kill $SERVER_PID
echo "Server stopped"
