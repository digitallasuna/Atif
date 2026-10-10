/**
 * Automated CLI Static Website Testing Harness
 * Run via: node test-runner.js or npm test
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  bold: "\x1b[1m"
};

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ${COLORS.green}✓ PASS${COLORS.reset} - ${testName}`);
  } else {
    console.error(`  ${COLORS.red}✗ FAIL${COLORS.reset} - ${testName}`);
    if (details) console.error(`    ${COLORS.yellow}Reason: ${details}${COLORS.reset}`);
  }
}

async function runStaticSiteTestSuite() {
  console.log(`\n${COLORS.bold}${COLORS.cyan}====================================================${COLORS.reset}`);
  console.log(`${COLORS.bold}${COLORS.cyan}   ATIF STATIC WEBSITE AUTOMATED TEST RUNNER        ${COLORS.reset}`);
  console.log(`${COLORS.bold}${COLORS.cyan}====================================================${COLORS.reset}\n`);

  const rootDir = __dirname;

  // ---------------------------------------------------------
  // 1. FILE SYSTEM & ASSET INTEGRITY
  // ---------------------------------------------------------
  console.log(`${COLORS.bold}Suite 1: File Architecture & Asset Integrity${COLORS.reset}`);
  
  const requiredFiles = [
    'index.html',
    'css/style.css',
    'js/app.js',
    'js/qa-runner.js',
    'assets/images/hero-avatar.jpg',
    'assets/images/project-dashboard.jpg',
    'assets/images/project-mobile.jpg',
    'package.json'
  ];

  for (const relPath of requiredFiles) {
    const fullPath = path.join(rootDir, relPath);
    const exists = fs.existsSync(fullPath);
    assert(exists, `Required file exists: ${relPath}`);
    if (exists) {
      const stats = fs.statSync(fullPath);
      assert(stats.size > 0, `File is non-empty (${stats.size} bytes): ${relPath}`);
    }
  }

  // ---------------------------------------------------------
  // 2. HTML STRUCTURE & SEO / ACCESSIBILITY AUDIT
  // ---------------------------------------------------------
  console.log(`\n${COLORS.bold}Suite 2: HTML5 Semantic, SEO & Accessibility Standards${COLORS.reset}`);
  
  const indexPath = path.join(rootDir, 'index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf-8');

  assert(indexHtml.includes('<!DOCTYPE html>'), 'Valid HTML5 doctype specified');
  assert(indexHtml.includes('<meta charset="UTF-8">'), 'Character encoding UTF-8 present');
  assert(indexHtml.includes('name="viewport"'), 'Mobile viewport configuration present');
  assert(indexHtml.includes('name="description"'), 'SEO meta description present');
  assert(indexHtml.includes('property="og:title"'), 'OpenGraph social preview metadata present');

  // Single <h1> rule
  const h1Matches = indexHtml.match(/<h1[\s>]/gi) || [];
  assert(h1Matches.length === 1, `Exactly one <h1> element present on page (Found: ${h1Matches.length})`);

  // Semantic elements check
  ['<header', '<nav', '<main', '<section', '<article', '<footer', '<aside'].forEach(tag => {
    assert(indexHtml.includes(tag), `Semantic HTML5 element present: ${tag.replace('<', '')}`);
  });

  // Verify all <img> elements have alt tags
  const imgTags = indexHtml.match(/<img[^>]*>/gi) || [];
  assert(imgTags.length > 0, `Images detected in markup (Found: ${imgTags.length})`);
  const imgsMissingAlt = imgTags.filter(img => !/alt\s*=\s*["'][^"']+["']/i.test(img));
  assert(imgsMissingAlt.length === 0, 'All images have non-empty accessible alt attributes');

  // ---------------------------------------------------------
  // 3. AUTOMATION & TEST ATTRIBUTES VERIFICATION
  // ---------------------------------------------------------
  console.log(`\n${COLORS.bold}Suite 3: E2E / QA Testable Element Identifiers${COLORS.reset}`);

  const requiredTestIds = [
    'brand-logo',
    'nav-home',
    'nav-features',
    'nav-projects',
    'nav-contact',
    'theme-toggle-btn',
    'mobile-menu-toggle',
    'hero-primary-cta',
    'hero-secondary-cta',
    'project-filters',
    'contact-form',
    'input-name',
    'input-email',
    'input-message',
    'submit-btn',
    'qa-toggle-btn',
    'qa-drawer',
    'run-smoke-tests-btn'
  ];

  requiredTestIds.forEach(id => {
    const hasTestId = indexHtml.includes(`data-testid="${id}"`) || indexHtml.includes(`id="${id}"`);
    assert(hasTestId, `Interactive test hook present: [data-testid="${id}"]`);
  });

  // ---------------------------------------------------------
  // 4. LOCAL HTTP WEBSERVER DEPLOYMENT & ROUTING TEST
  // ---------------------------------------------------------
  console.log(`\n${COLORS.bold}Suite 4: Local HTTP Server Delivery & Content-Type Headers${COLORS.reset}`);

  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
  };

  const TEST_PORT = 3899;
  const server = http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0];
    let filePath = path.join(rootDir, cleanUrl === '/' ? 'index.html' : cleanUrl);
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(data);
      }
    });
  });

  await new Promise(resolve => server.listen(TEST_PORT, resolve));

  const testEndpoints = [
    { url: '/', expectedType: 'text/html' },
    { url: '/css/style.css', expectedType: 'text/css' },
    { url: '/js/app.js', expectedType: 'text/javascript' },
    { url: '/js/qa-runner.js', expectedType: 'text/javascript' },
    { url: '/assets/images/hero-avatar.jpg', expectedType: 'image/jpeg' }
  ];

  for (const endpoint of testEndpoints) {
    await new Promise((resolve) => {
      http.get(`http://localhost:${TEST_PORT}${endpoint.url}`, (res) => {
        assert(res.statusCode === 200, `HTTP GET ${endpoint.url} returns 200 OK`);
        const contentType = res.headers['content-type'] || '';
        assert(contentType.includes(endpoint.expectedType), `HTTP GET ${endpoint.url} Content-Type is ${endpoint.expectedType}`);
        resolve();
      }).on('error', (err) => {
        assert(false, `HTTP GET ${endpoint.url} failed`, err.message);
        resolve();
      });
    });
  }

  // Gracefully close server
  await new Promise(resolve => server.close(resolve));

  // ---------------------------------------------------------
  // FINAL SCORE SUMMARY
  // ---------------------------------------------------------
  console.log(`\n${COLORS.bold}${COLORS.cyan}----------------------------------------------------${COLORS.reset}`);
  if (passedTests === totalTests) {
    console.log(`${COLORS.bold}${COLORS.green}✔ ALL STATIC SITE TESTS PASSED! (${passedTests}/${totalTests})${COLORS.reset}`);
  } else {
    console.log(`${COLORS.bold}${COLORS.red}✖ SOME TESTS FAILED: ${passedTests}/${totalTests} Passed.${COLORS.reset}`);
  }
  console.log(`${COLORS.bold}${COLORS.cyan}====================================================${COLORS.reset}\n`);

  process.exit(passedTests === totalTests ? 0 : 1);
}

runStaticSiteTestSuite().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
