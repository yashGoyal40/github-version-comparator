#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create a minimal routes-manifest.json for Vercel
const routesManifest = {
  version: 3,
  pages404: true,
  caseSensitive: false,
  routes: [
    {
      page: '/',
      regex: '^/$'
    },
    {
      page: '/_not-found',
      regex: '^/_not-found$'
    }
  ],
  dynamicRoutes: [],
  dataRoutes: [],
  i18n: null,
  rsc: {
    header: {
      contentType: 'text/x-component'
    },
    varyHeader: 'RSC, Next-Router-State-Tree, Next-Router-Prefetch',
    prefetchHeader: 'Next-Router-Prefetch'
  },
  rewrites: [],
  redirects: [],
  headers: []
};

// Write the routes-manifest.json to the out directory
const outDir = path.join(__dirname, '..', 'out');
const manifestPath = path.join(outDir, 'routes-manifest.json');

// Ensure the out directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Write the manifest file
fs.writeFileSync(manifestPath, JSON.stringify(routesManifest, null, 2));

console.log('✅ Created routes-manifest.json for Vercel compatibility');
