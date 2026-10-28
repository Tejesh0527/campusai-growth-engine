import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { store } from './src/store.js';
import { validateRegistrationForm } from './src/validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Port and Host configuration for public cloud platforms (Render, Railway, Fly.io, Heroku)
const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Setup file-backed data persistence in Node.js (persists across server restarts without external DB credentials)
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

store.setPersistenceAdapter({
  load: () => {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {
      console.warn('[Persistence] Could not load state from disk, using baseline:', err.message);
    }
    return null;
  },
  save: (state) => {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[Persistence] Could not save state to disk:', err.message);
    }
  }
});

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.csv': 'text/csv; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Security & CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoints
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
        res.end(JSON.stringify({
          success: true,
          record: result.record,
          snapshot: store.getAnalyticsSnapshot()
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // Health check endpoint for cloud load balancers & monitoring
  if (pathname === '/health' || pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() }));
    return;
  }

  // Production static file resolution:
  // When 'dist/' exists (from 'npm run build'), prioritize compiled assets from dist/
  const DIST_DIR = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(DIST_DIR);

  let filePath;

  if (pathname === '/' || pathname === '/index.html') {
    filePath = hasDist && fs.existsSync(path.join(DIST_DIR, 'index.html'))
      ? path.join(DIST_DIR, 'index.html')
      : path.join(__dirname, 'index.html');
  } else if (hasDist && pathname.startsWith('/assets/')) {
    filePath = path.join(DIST_DIR, pathname);
  } else {
    // Check dist directory first, then root directory
    const distCandidate = path.join(DIST_DIR, pathname);
    const rootCandidate = path.join(__dirname, pathname);

    if (hasDist && fs.existsSync(distCandidate) && fs.statSync(distCandidate).isFile()) {
      filePath = distCandidate;
    } else {
      filePath = rootCandidate;
    }
  }

  // If path doesn't have an extension, try adding .html
  if (!path.extname(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA client-side routes
      const fallback = hasDist && fs.existsSync(path.join(DIST_DIR, 'index.html'))
        ? path.join(DIST_DIR, 'index.html')
        : path.join(__dirname, 'index.html');

      fs.readFile(fallback, (fallbackErr, content) => {
        if (fallbackErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, HOST, () => {
  const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`=======================================================`);
  console.log(` CampusAI Growth Engine is running!`);
  console.log(` Address:       http://${displayHost}:${PORT}`);
  console.log(` Raw Stitch:    http://${displayHost}:${PORT}/code.html`);
  console.log(` API Endpoint:  http://${displayHost}:${PORT}/api/kpis`);
  console.log(` Health Check:  http://${displayHost}:${PORT}/health`);
  console.log(` Environment:   ${process.env.NODE_ENV || 'production'}`);
  console.log(`=======================================================`);
});

export default server;
