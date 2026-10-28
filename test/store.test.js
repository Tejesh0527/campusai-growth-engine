import test from 'node:test';
import assert from 'node:assert/strict';
import { store, INITIAL_BASELINE_METRICS } from '../src/store.js';

test('store initializes with correct baseline demo metrics', () => {
  store.resetState();
  const snapshot = store.getAnalyticsSnapshot();

  assert.equal(snapshot.totalRegistrations, 284);
  assert.equal(snapshot.goal, 500);
  assert.equal(snapshot.remainingRunway, 216);
  assert.equal(snapshot.percentCompleted, 56.8);
  assert.equal(snapshot.totalReferrals, 146);
  assert.equal(snapshot.referralSharePercent, 51.4);
  assert.equal(snapshot.totalExpenditure, 1120);
  assert.equal(snapshot.cac, 3.94);
});

test('store records a live student registration and recalculates KPIs dynamically', () => {
  store.resetState();

  const newStudent = {
    fullName: 'Kavya Raman',
    email: 'kavya.raman@ceg.annauniv.edu',
    phone: '9840123456',
    college: 'College of Engineering Guindy',
    branch: 'Information Technology',
    year: '4th Year',
    track: 'Generative AI Agents',
    referralCode: 'NXT-RV-04',
    termsAccepted: true
  };

  const result = store.addRegistration(newStudent);
  assert.equal(result.success, true, 'Registration should succeed');
  const record = result.record;
  assert.ok(record.id.startsWith('REG-2025-'));
  assert.equal(record.isLiveUser, true);
  assert.equal(record.channel, 'Student Ambassador');

  const updatedSnapshot = store.getAnalyticsSnapshot();
  assert.equal(updatedSnapshot.totalRegistrations, 285);
  assert.equal(updatedSnapshot.totalReferrals, 147);
  assert.equal(updatedSnapshot.remainingRunway, 215);

  // Ambassador referrals for Pooja Nair (NXT-RV-04) should have incremented from 48 to 49
  const pooja = store.state.ambassadors.find(a => a.code === 'NXT-RV-04');
  assert.equal(pooja.referrals, 49);
  assert.equal(pooja.incentiveEarned, 2450); // 2400 + 50
});

test('store prevents duplicate email registration', () => {
  store.resetState();
  const student = {
    fullName: 'Test Student',
    email: 'unique.test@college.edu',
    phone: '9876543210',
    college: 'Test College',
    branch: 'Computer Science',
    year: '2nd Year',
    track: 'Generative AI Agents',
    termsAccepted: true
  };

  // First registration should succeed
  const r1 = store.addRegistration(student);
  assert.equal(r1.success, true, 'First registration should succeed');
  assert.ok(r1.record, 'Record should be returned on success');

  // Second registration with same email should fail
  const r2 = store.addRegistration(student);
  assert.equal(r2.success, false, 'Duplicate registration should fail');
  assert.equal(r2.error, 'DUPLICATE', 'Error type should be DUPLICATE');
  assert.ok(r2.message.includes('already been registered'), 'Error message should explain duplicate');

  // Total registrations should not have increased
  const snapshot = store.getAnalyticsSnapshot();
  assert.equal(snapshot.totalRegistrations, 285, 'Total should be 284 baseline + 1 live');
});

test('store also blocks duplicate registration using a demo email address', () => {
  store.resetState();
  // p.nair@rvce.edu.in is in the INITIAL_SAMPLE_RECORDS demo data
  const r = store.addRegistration({
    fullName: 'Pooja Nair Again',
    email: 'p.nair@rvce.edu.in',
    phone: '9845012345',
    college: 'RV College',
    branch: 'CSE',
    year: '4th Year',
    track: 'Generative AI Agents',
    termsAccepted: true
  });
  assert.equal(r.success, false);
  assert.equal(r.error, 'DUPLICATE');
});

test('store exports valid CSV with headers and escaped values', () => {
  store.resetState();
  const csv = store.exportToCSV();

  assert.ok(csv.includes('Registration ID,Student Name,Email'));
  assert.ok(csv.includes('Pooja Nair'));
  assert.ok(csv.includes('SIMULATED DEMO DATA'));
});

test('channel targets sum to 500', async () => {
  const { CHANNEL_TARGETS } = await import('../src/store.js');
  const sum = CHANNEL_TARGETS.ambassadors + CHANNEL_TARGETS.communities + CHANNEL_TARGETS.clubs;
  assert.equal(sum, 500);
  assert.equal(CHANNEL_TARGETS.ambassadors, 200);
  assert.equal(CHANNEL_TARGETS.communities, 200);
  assert.equal(CHANNEL_TARGETS.clubs, 100);
});

test('budget allocations sum to ₹2000', () => {
  const sum =
    INITIAL_BASELINE_METRICS.budgetAmbassadorIncentives +
    INITIAL_BASELINE_METRICS.budgetPromotionalExperiments +
    INITIAL_BASELINE_METRICS.budgetContingency;
  assert.equal(sum, 2000);
  assert.equal(INITIAL_BASELINE_METRICS.budgetAmbassadorIncentives, 1000);
  assert.equal(INITIAL_BASELINE_METRICS.budgetPromotionalExperiments, 700);
  assert.equal(INITIAL_BASELINE_METRICS.budgetContingency, 300);
});
