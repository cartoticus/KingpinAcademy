// Pulls the app's <script> out of index.html and loads it as a module,
// so the scoring and physics functions can be tested without a browser.
const fs = require('fs');
const path = require('path');
const Module = require('module');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/);
if (!match) throw new Error('No inline <script> found in index.html');
const m = new Module('kingpin-app');
m._compile(match[1], 'index.html#script');
module.exports = m.exports;
