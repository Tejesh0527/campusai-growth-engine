import test from 'node:test';
import assert from 'node:assert/strict';
import { store, CHANNEL_TARGETS, INITIAL_BASELINE_METRICS } from '../src/store.js';
import { validateRegistrationForm, validateEmail, validateReferralCode } from '../src/validation.js';

test('End-to-End Registration Flow: Valid submission, storage, and dynamic dashboard sync', () => {
  store.resetState();
  const initialSnap = store.getAnalyticsSnapshot();
  assert.equal(initialSnap.totalRegistrations, 284);
  assert.equal(initialSnap.remainingRunway, 216);

  // Exact test user from QA specification
  const validStudent = {
    fullName: 'QA Test Student',
    email: 'qa.test.student@example.com',
    phone: '9876543210',
    college: 'National Institute of Technology',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    track: 'Generative AI Agents',
    referralCode: 'NXT-RV-04',
    termsAccepted: true
  };

  // 1. Validation check
  const val = validateRegistrationForm(validStudent);
  assert.equal(val.isValid, true, 'Validation must pass for complete valid submission');
  assert.equal(val.referral.valid, true, 'Referral code NXT-RV-04 must be verified');

  // 2. Submission to store
  const result = store.addRegistration(validStudent);
  assert.equal(result.success, true, 'Registration must be saved successfully');
  assert.ok(result.record, 'Record must be returned upon successful registration');
  assert.equal(result.record.name, 'QA Test Student');
  assert.equal(result.record.email, 'qa.test.student@example.com');
  assert.equal(result.record.college, 'National Institute of Technology');
  assert.equal(result.record.channel, 'Student Ambassador');
  assert.equal(result.record.isLiveUser, true);
  assert.ok(result.record.id.startsWith('REG-2025-0285'));

  // 3. Dynamic KPI sync verification
  const updatedSnap = store.getAnalyticsSnapshot();
  assert.equal(updatedSnap.totalRegistrations, 285);
  assert.equal(updatedSnap.remainingRunway, 215);
  assert.equal(updatedSnap.percentCompleted, 57.0);
  assert.equal(updatedSnap.totalReferrals, 147);
  assert.equal(updatedSnap.cac, 3.93); // 1120 / 285 = 3.9298 -> 3.93

  // 4. Ambassador attribution check
  const rep = store.state.ambassadors.find(a => a.code === 'NXT-RV-04');
  assert.equal(rep.referrals, 49, 'Pooja Nair referrals should increment from 48 to 49');
  assert.equal(rep.incentiveEarned, 2450, 'Bounty should increase by ₹50');

  // 5. Duplicate prevention check
  const dupResult = store.addRegistration(validStudent);
  assert.equal(dupResult.success, false, 'Duplicate email registration must be rejected');
  assert.equal(dupResult.error, 'DUPLICATE');

  // Verify count did not increase after duplicate attempt
  const finalSnap = store.getAnalyticsSnapshot();
  assert.equal(finalSnap.totalRegistrations, 285);

  // 6. CSV Export contains newly registered student
  const csv = store.exportToCSV();
  assert.ok(csv.includes('QA Test Student'));
  assert.ok(csv.includes('qa.test.student@example.com'));
  assert.ok(csv.includes('LIVE USER SUBMISSION'));
  assert.ok(csv.includes('NXT-RV-04'));
});

test('Form Validation Edge Cases: Required fields and invalid email rejection', () => {
  // Missing required fields
  const emptyForm = {
    fullName: '',
    email: '',
    phone: '',
    college: '',
    branch: '',
    year: '',
    track: '',
    termsAccepted: false
  };

  const valEmpty = validateRegistrationForm(emptyForm);
  assert.equal(valEmpty.isValid, false);
  assert.ok(valEmpty.errors.fullName);
  assert.ok(valEmpty.errors.email);
  assert.ok(valEmpty.errors.phone);
  assert.ok(valEmpty.errors.college);
  assert.ok(valEmpty.errors.branch);
  assert.ok(valEmpty.errors.year);
  assert.ok(valEmpty.errors.termsAccepted);

  // Invalid email formats
  assert.equal(validateEmail('not-an-email'), false);
  assert.equal(validateEmail('missing-domain@'), false);
  assert.equal(validateEmail('@missing-user.com'), false);
  assert.equal(validateEmail('spaces in@email.com'), false);
  assert.equal(validateEmail('student@college.edu.in'), true);

  // Invalid referral code handling
  const invalidRef = validateReferralCode('INVALID!@#$');
  assert.equal(invalidRef.valid, false);
  assert.ok(invalidRef.message.includes('Invalid'));
});
