/**
 * Cloudflare Worker for log parsing
 */

import { renderHTML } from './components/template.js';

// Event handler for incoming requests
export default {
  async fetch(request, env, ctx) {
    return new Response(renderHTML(), {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    });
  },
};