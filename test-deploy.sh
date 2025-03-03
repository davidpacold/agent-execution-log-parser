#\!/bin/bash
# Test deployment script for the agent execution log parser

echo "Testing the deployment process for the log parser worker..."

# Step 1: Build a local JS file to verify the fix is included
echo "Checking if the fix is properly included in the parser..."

# Use a simple grep to check if our fix code exists in the log-parser.js file
if grep -q "INTEGRATED FIX: Ensure all steps have complete data" src/lib/log-parser.js; then
  echo "✅ Fix is properly integrated in the source code"
else
  echo "❌ Fix is NOT found in the source code. Make sure you've saved the changes."
  exit 1
fi

# Step 2: Check if wrangler is available
if \! command -v wrangler &> /dev/null; then
  echo "❌ Wrangler (Cloudflare Workers CLI) is not installed or not in PATH."
  echo "Install with: npm install -g wrangler"
  exit 1
fi

# Step 3: Verify wrangler.toml is correctly set up
if [ \! -f wrangler.toml ]; then
  echo "❌ wrangler.toml file not found."
  exit 1
fi

echo "✅ wrangler.toml file found."

# Step 4: Provide deployment instructions
echo "
Deployment Instructions:
------------------------
1. Run a preview of your worker to test locally:
   npm run dev
   
2. To deploy to production:
   npm run deploy:prod
   
3. After deployment, test by uploading a log file with RouterStep data.

4. If the deployment doesn't fix the issue, use the browser-fix.js script as a temporary solution:
   - Open your browser's developer console (F12 or Ctrl+Shift+I)
   - Copy and paste the contents of browser-fix.js into the console
   - Press Enter to run the script
   - Upload your log file after running the script

Notes:
- Make sure you're logged in with Cloudflare credentials (run 'wrangler login' if needed)
- Verify all changes are saved and committed before deploying
"

echo "Test deployment script completed."
