# Agent Execution Log Parser

A web-based tool to parse and visualize agent execution logs hosted on Cloudflare Workers.

## Features

- 📊 Clean visualization of complex log structures
- 🔍 Detailed breakdown of execution steps
- ⏱️ Performance timing analysis
- ❌ Error identification and summary
- 📱 Responsive design for desktop and mobile

## Demo

Access the live demo: [Agent Execution Log Parser](https://agent-execution-log-parser.david-pacold.workers.dev)

## How It Works

1. Paste a JSON log file into the text area
2. Click "Parse Log" or use the "Load Sample" button to try with example data
3. Explore the structured visualization of your log data:
   - Overview metrics show execution status and timing
   - Error summary identifies failures
   - Step-by-step breakdown of execution flow
   - Expandable details for each step
   - Raw processed JSON for further use

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) for Cloudflare Workers

### Local Development

1. Clone this repository
   ```
   git clone https://github.com/davidpacold/agent-execution-log-parser.git
   cd agent-execution-log-parser
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start local development server
   ```
   wrangler dev
   ```

4. Visit `http://localhost:8787` to see the application

### Deployment

Deploy to Cloudflare Workers:

```
wrangler publish
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.