import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateEmail,
  validatePhone,
  validateReferralCode,
  validateRegistrationForm,
  cleanPhoneNumber,
  KNOWN_REFERRAL_CODES
} from '../src/validation.js';

test('Email validation checks', () => {
  assert.equal(validateEmail('student@rvce.edu.in'), true);
  assert.equal(validateEmail('john.doe@gmail.com'), true);
  assert.equal(validateEmail('invalid-email'), false);
  assert.equal(validateEmail(''), false);
  assert.equal(validateEmail(null), false);
  assert.equal(validateEmail('@domain.com'), false);
});

test('Phone validation checks for 10-digit Indian numbers', () => {
  assert.equal(validatePhone('9845012345'), true);
  assert.equal(validatePhone('+91 98450 12345'), true);
  assert.equal(validatePhone('919845012345'), true);
  assert.equal(validatePhone('984-501-2345'), true);
  assert.equal(validatePhone('1234567890'), false); // Doesn't start with 6-9
  assert.equal(validatePhone('98450123'), false); // Too short
  assert.equal(validatePhone(''), false);
});

test('cleanPhoneNumber utility removes country codes and separators', () => {
  assert.equal(cleanPhoneNumber('+91 98765 43210'), '9876543210');
  assert.equal(cleanPhoneNumber('(91) 98765-43210'), '9876543210');
  assert.equal(cleanPhoneNumber('9876543210'), '9876543210');
});

test('validateReferralCode identifies known ambassador codes', () => {
  const result1 = validateReferralCode('NXT-RV-04');
  assert.equal(result1.valid, true);
  assert.equal(result1.details.ambassador, 'Pooja Nair');
  assert.equal(result1.details.college, 'RV College of Engineering');

  const result2 = validateReferralCode('nxt-bp-02'); // Lowercase should normalize
  assert.equal(result2.valid, true);
  assert.equal(result2.details.ambassador, 'Siddharth Menon');

  const resultUnknown = validateReferralCode('UNKNOWN-CODE-99');
  assert.equal(resultUnknown.valid, true); // Valid format partner code

  const resultInvalid = validateReferralCode('!?@#$');
  assert.equal(resultInvalid.valid, false);
});

test('validateRegistrationForm checks all required fields', () => {
  const validData = {
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@iitb.ac.in',
    phone: '9876543210',
    college: 'IIT Bombay',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    track: 'Generative AI Agents',
    referralCode: 'NXT-RV-04',
    termsAccepted: true
  };

  const validationResult = validateRegistrationForm(validData);
  assert.equal(validationResult.isValid, true);
  assert.equal(Object.keys(validationResult.errors).length, 0);
  assert.equal(validationResult.referral.valid, true);
});

test('validateRegistrationForm rejects invalid or missing fields', () => {
  const invalidData = {
    fullName: '',
    email: 'bad-email',
    phone: '12345',
    college: '',
    branch: '',
    year: '',
    track: '',
    referralCode: 'BAD!!CODE',
    termsAccepted: false
  };

  const validationResult = validateRegistrationForm(invalidData);
  assert.equal(validationResult.isValid, false);
  assert.ok(validationResult.errors.fullName);
  assert.ok(validationResult.errors.email);
  assert.ok(validationResult.errors.phone);
  assert.ok(validationResult.errors.college);
  assert.ok(validationResult.errors.branch);
  assert.ok(validationResult.errors.year);
  assert.ok(validationResult.errors.track);
  assert.ok(validationResult.errors.termsAccepted);
  assert.ok(validationResult.errors.referralCode);
});
