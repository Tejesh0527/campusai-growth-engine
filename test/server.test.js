import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { store } from '../src/store.js';
import { validateRegistrationForm } from '../src/validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_PORT = 3099;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8'
};

const testServer = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${TEST_PORT}`);
  const pathname = parsedUrl.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (pathname === '/health' || pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() }));
    return;
  }

  if (pathname === '/api/kpis' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(store.getAnalyticsSnapshot()));
    return;
  }

  if (pathname === '/api/registrations' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(store.getAllRegistrations()));
    return;
  }

  if (pathname === '/api/ambassadors' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(store.state.ambassadors));
    return;
  }

  if (pathname === '/api/export-csv' && req.method === 'GET') {
    const csvData = store.exportToCSV();
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="campusai_registrations_sprint.csv"'
    });
    res.end(csvData);
    return;
  }

  if (pathname === '/api/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const validation = validateRegistrationForm(data);
        if (!validation.isValid) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, errors: validation.errors }));
          return;
        }
        const result = store.addRegistration(data);
        if (!result.success) {
          const status = result.error === 'DUPLICATE' ? 409 : 400;
          res.writeHead(status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: result.error, message: result.message }));
          return;
        }
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, record: result.record, snapshot: store.getAnalyticsSnapshot() }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // Static files
  let filePath = path.join(__dirname, '..', pathname === '/' ? 'index.html' : pathname);
  if (!path.extname(filePath)) {
    if (fs.existsSync(filePath + '.html')) filePath = filePath + '.html';
    else if (fs.existsSync(path.join(filePath, 'index.html'))) filePath = path.join(filePath, 'index.html');
  }
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const fallback = path.join(__dirname, '..', 'index.html');
      fs.readFile(fallback, (fbErr, content) => {
        if (fbErr) { res.writeHead(404); res.end('404'); }
        else { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(content); }
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    fs.readFile(filePath, (readErr, content) => {
      if (readErr) { res.writeHead(500); res.end('500'); }
      else { res.writeHead(200, { 'Content-Type': contentType }); res.end(content); }
    });
  });
});

// Start test server before tests
await new Promise(resolve => testServer.listen(TEST_PORT, resolve));

// Tear down cleanly after all tests complete
after(() => new Promise(resolve => testServer.close(resolve)));

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://localhost:${TEST_PORT}${path}`, options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

test('server endpoint GET /health returns 200 ok for cloud load balancers', async () => {
  const res = await makeRequest('/health');
  assert.equal(res.statusCode, 200);
  const data = JSON.parse(res.body);
  assert.equal(data.status, 'ok');
  assert.ok(typeof data.uptime === 'number');
});

test('server endpoint GET /api/kpis returns valid analytics', async () => {
  store.resetState();
  const res = await makeRequest('/api/kpis');
  assert.equal(res.statusCode, 200);
  const data = JSON.parse(res.body);
  assert.ok(data.totalRegistrations >= 284);
  assert.equal(data.goal, 500);
});

test('server endpoint POST /api/register creates a student record', async () => {
  store.resetState();
  const payload = {
    fullName: 'Ananya Deshpande',
    email: 'ananya.d@iitm.ac.in',
    phone: '9845112233',
    college: 'IIT Madras',
    branch: 'Electrical Engineering',
    year: '3rd Year',
    track: 'LLM Fine-tuning & RAG',
    referralCode: 'NXT-IITM-01',
    termsAccepted: true
  };

  const res = await makeRequest('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  assert.equal(res.statusCode, 201);
  const response = JSON.parse(res.body);
  assert.equal(response.success, true);
  assert.ok(response.record.id.startsWith('REG-2025-'));
  assert.equal(response.record.name, 'Ananya Deshpande');
});

test('server endpoint POST /api/register rejects duplicate email with 409', async () => {
  store.resetState();
  const payload = {
    fullName: 'Duplicate Test Student',
    email: 'duplicate.test@college.edu',
    phone: '9876543210',
    college: 'Test College',
    branch: 'Computer Science',
    year: '2nd Year',
    track: 'Generative AI Agents',
    termsAccepted: true
  };

  const res1 = await makeRequest('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  assert.equal(res1.statusCode, 201);

  // Second attempt with same email
  const res2 = await makeRequest('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  assert.equal(res2.statusCode, 409);
  const response2 = JSON.parse(res2.body);
  assert.equal(response2.success, false);
  assert.equal(response2.error, 'DUPLICATE');
});

test('server endpoint GET /api/export-csv returns csv data', async () => {
  const res = await makeRequest('/api/export-csv');
  assert.equal(res.statusCode, 200);
  assert.ok(res.headers['content-type'].includes('text/csv'));
  assert.ok(res.body.includes('Registration ID'));
});

test('server endpoint GET / returns index.html', async () => {
  const res = await makeRequest('/');
  assert.equal(res.statusCode, 200);
  assert.ok(res.headers['content-type'].includes('text/html'));
  assert.ok(res.body.includes('CampusAI Growth Engine'));
  assert.ok(res.body.includes('id="screen-overview"'));
  assert.ok(res.body.includes('id="screen-registration"'));
  assert.ok(res.body.includes('id="screen-ambassadors"'));
});

test('server endpoint GET /code.html serves original Stitch export', async () => {
  const res = await makeRequest('/code.html');
  assert.equal(res.statusCode, 200);
  assert.ok(res.headers['content-type'].includes('text/html'));
  assert.ok(res.body.includes('Admin Growth Analytics • CampusAI Growth Engine'));
});

test('persistent adapter loads and saves state across server restarts', () => {
  const tempMemory = {};
  const mockAdapter = {
    load: () => tempMemory.state || null,
    save: (s) => { tempMemory.state = JSON.parse(JSON.stringify(s)); }
  };

  store.setPersistenceAdapter(mockAdapter);
  store.resetState();

  const newStudent = {
    fullName: 'Persistent Test Student',
    email: 'persistent@example.com',
    phone: '9876543210',
    college: 'BITS Pilani',
    branch: 'CS',
    year: '4th Year',
    track: 'Generative AI Agents',
    termsAccepted: true
  };

  store.addRegistration(newStudent);
  assert.equal(tempMemory.state.liveRegistrations.length, 1);
  assert.equal(tempMemory.state.liveRegistrations[0].email, 'persistent@example.com');

  // Detach adapter and clean up
  store.setPersistenceAdapter(null);
  store.resetState();
});
