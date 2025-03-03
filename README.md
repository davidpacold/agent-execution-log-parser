# Agent Execution Log Parser

A web-based tool to parse and visualize Airia Agent execution logs hosted on Cloudflare Workers. This application helps developers and analysts understand agent execution flow, debug issues, and optimize agent performance.

## Features

- 📊 Clean visualization of complex log structures
- 🔍 Detailed breakdown of execution steps with expandable sections
- ⏱️ Performance timing analysis for each step and overall execution
- 🔄 API call visualization with request/response details
- 💬 Full conversation history with prompt/response pairs
- 💻 Python code execution display with inputs and outputs
- 🧠 Memory operation tracking (load/store)
- ❌ Error identification and summary
- 📱 Responsive design for desktop and mobile
- 🔄 Client-side and server-side parsing options

## Supported Log Formats

The parser can handle multiple log formats:

1. **Standard Format**: JSON with a `StepsExecutionContext` object containing execution steps
2. **Direct Format**: JSON with step IDs as top-level keys

## Demo

Access the live demo: [Agent Execution Log Parser](https://agent-execution-log-parser.david-pacold.workers.dev)

## How It Works

1. Paste a JSON log file into the text area or upload a file
2. Click "Parse Log" or use the "Load Sample" button to try with example data
3. Explore the structured visualization of your log data:
   - Overview metrics show execution status and timing
   - Error summary identifies failures
   - Step-by-step breakdown of execution flow
   - Expandable details for each step
   - Raw processed JSON for further use

## API Usage

The parser can also be used as a REST API:

```bash
# Parse a log file using the API
curl -X POST https://agent-execution-log-parser.david-pacold.workers.dev \
  -H "Content-Type: application/json" \
  -d @path/to/your/log.json
```

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) for Cloudflare Workers

### Local Development

1. Clone this repository
   ```bash
   git clone https://github.com/davidpacold/agent-execution-log-parser.git
   cd agent-execution-log-parser
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run tests
   ```bash
   npm test
   ```

4. Start local development server
   ```bash
   npm run dev
   # or
   wrangler dev
   ```

5. Visit `http://localhost:8787` to see the application

### Project Structure

```
agent-execution-log-parser/
├── src/                      # Source code
│   ├── index.js              # Entry point
│   ├── lib/                  # Core libraries
│   │   ├── error-handler.js  # Error handling utilities
│   │   ├── formatters.js     # Data formatting utilities
│   │   ├── log-parser.js     # Core parsing logic
│   │   └── utils.js          # Common utilities
│   └── components/           # UI components
│       ├── client/           # Client-side code
│       ├── display/          # Display components for steps
│       └── template.js       # HTML template
├── test/                     # Test files
└── wrangler.toml             # Cloudflare Worker configuration
```

### Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
# or
wrangler deploy
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes and add tests for new features
4. Ensure tests pass with `npm test`
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.