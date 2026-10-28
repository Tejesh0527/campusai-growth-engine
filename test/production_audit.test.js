import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GrowthStore } from '../src/store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

test('Workshop title is strictly consistent everywhere', () => {
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const expectedTitle = 'Build Your First AI Project in 60 Minutes';
  assert.ok(indexHtml.includes(expectedTitle), 'index.html must feature the exact workshop title');

  // Verify it is in the banner header
  assert.ok(
    indexHtml.includes(`<h2 class="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white">\r\n              ${expectedTitle}`) ||
    indexHtml.includes(`<h2 class="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white">\n              ${expectedTitle}`)
  );
});

test('No unsupported claims or outdated dates exist in index.html', () => {
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

  // Unsupported perks / claims forbidden by audit requirements
  assert.equal(indexHtml.includes('Nov 5 – Nov 7, 2025'), false, 'Outdated Nov 2025 dates removed');
  assert.equal(indexHtml.includes('₹5,000 API Credits'), false, 'Unverified ₹5000 API credit claim removed');
  assert.equal(indexHtml.includes('100% Scholarship VIP'), false, 'Unverified VIP pass claim removed');
  assert.equal(indexHtml.includes('Certificate of Mastery'), false, 'Unverified accredited certificate claim removed');
  assert.equal(indexHtml.includes('http://localhost:3000'), false, 'No hardcoded localhost:3000 in index.html');
});

test('CSV export clearly distinguishes LIVE USER SUBMISSION from SIMULATED DEMO DATA', () => {
  const store = new GrowthStore();
  
  // Submit a live test student
  const regResult = store.addRegistration({
    fullName: 'Audit Test Student',
    email: 'audit.tester@rvce.edu.in',
    phone: '9845012345',
    college: 'RV College of Engineering',
    branch: 'Computer Science',
    year: '3rd Year (Batch 2026)',
    referralCode: 'NXT-RV-04',
    consent: true
  });
  assert.equal(regResult.success, true);

  const csv = store.exportToCSV();
  const lines = csv.split('\r\n');

  // Verify headers
  assert.ok(lines[0].includes('Record Type'), 'Header must contain Record Type column');

  // Verify that the newly registered student has LIVE USER SUBMISSION
  const liveRow = lines.find(line => line.includes('audit.tester@rvce.edu.in'));
  assert.ok(liveRow, 'Live test student must appear in CSV');
  assert.ok(liveRow.includes('"LIVE USER SUBMISSION"'), 'Live record must be flagged LIVE USER SUBMISSION');

  // Verify that initial baseline records have SIMULATED DEMO DATA
  const demoRow = lines.find(line => line.includes('p.nair@rvce.edu.in'));
  assert.ok(demoRow, 'Demo record must appear in CSV');
  assert.ok(demoRow.includes('"SIMULATED DEMO DATA"'), 'Demo record must be flagged SIMULATED DEMO DATA');
});

test('Referral code attribution updates ambassador referral tally', () => {
  const store = new GrowthStore();
  const targetAmbassador = store.state.ambassadors.find(a => a.code === 'NXT-BP-02');
  const initialReferrals = targetAmbassador.referrals;

  const regResult = store.addRegistration({
    fullName: 'Referred Peer',
    email: 'referred.peer@hyderabad.bits-pilani.ac.in',
    phone: '9876543210',
    college: 'BITS Pilani (Hyderabad)',
    branch: 'ECE',
    year: '4th Year (Batch 2025)',
    referralCode: 'NXT-BP-02',
    consent: true
  });

  assert.equal(regResult.success, true);
  const updatedAmbassador = store.state.ambassadors.find(a => a.code === 'NXT-BP-02');
  assert.equal(updatedAmbassador.referrals, initialReferrals + 1, 'Ambassador referral count must increment by 1');
});
