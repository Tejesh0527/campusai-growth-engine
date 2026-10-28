/**
 * CampusAI Growth Engine - Form Validation Module
 *
 * All validation functions here are used both by the client (browser)
 * and by the server-side API endpoint (server.js).
 */

export const WORKSHOP_TITLE = 'Build Your First AI Project in 60 Minutes';

export const KNOWN_REFERRAL_CODES = {
  'NXT-RV-04':      { ambassador: 'Pooja Nair',     college: 'RV College of Engineering',     type: 'ambassador' },
  'NXT-BP-02':      { ambassador: 'Siddharth Menon', college: 'BITS Pilani (Hyderabad)',       type: 'ambassador' },
  'NXT-COEP-01':    { ambassador: 'Tanvi Deshmukh',  college: 'COEP Tech University',           type: 'ambassador' },
  'NITT-ROBO-CLUB': { ambassador: 'Deepak Rajan',    college: 'NIT Trichy',                    type: 'club' },
  'VIT-AI-NODE':    { ambassador: 'Rohan Roy',        college: 'VIT Vellore',                   type: 'ambassador' },
  'NXT-IITM-01':   { ambassador: 'Ananya Kulkarni',  college: 'IIT Madras',                    type: 'ambassador' },
  'NXT-DTU-03':    { ambassador: 'Karan Sharma',     college: 'Delhi Technological University', type: 'ambassador' },
  'NXT-IITD-02':   { ambassador: 'Neha Gupta',       college: 'IIT Delhi',                     type: 'ambassador' },
  'NXT-IIITH-05':  { ambassador: 'Aditya Reddy',     college: 'IIIT Hyderabad',                type: 'ambassador' },
  'NXT-PESU-07':   { ambassador: 'Varun Rao',        college: 'PES University Bengaluru',      type: 'ambassador' },
};

export function cleanPhoneNumber(phone) {
  if (!phone) return '';
  let cleaned = phone.toString().replace(/[\s\-\(\)\+]/g, '');
  // Strip +91 / 91 country code prefix if resulting number would be 12 digits
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  }
  return cleaned;
}

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

export function validatePhone(phone) {
  const cleaned = cleanPhoneNumber(phone);
  // Valid Indian mobile: 10 digits starting with 6-9
  return /^[6-9]\d{9}$/.test(cleaned);
}

export function validateReferralCode(code) {
  if (!code || !code.trim()) {
    return { valid: false, code: '', details: null, message: '' };
  }
  const normalized = code.trim().toUpperCase();
  if (KNOWN_REFERRAL_CODES[normalized]) {
    const d = KNOWN_REFERRAL_CODES[normalized];
    return {
      valid: true,
      code: normalized,
      details: d,
      message: `Verified: ${d.ambassador} (${d.college})`
    };
  }
  // Accept reasonably-formatted unknown codes (4–20 uppercase alphanumeric + hyphens)
  if (/^[A-Z0-9\-]{4,20}$/.test(normalized)) {
    return {
      valid: true,
      code: normalized,
      details: { ambassador: 'Campus Ambassador Rep', college: 'Participating College', type: 'ambassador' },
      message: 'Active Campus Referral Code'
    };
  }
  return {
    valid: false,
    code: normalized,
    details: null,
    message: 'Invalid referral code format. Examples: NXT-RV-04, NITT-ROBO-CLUB'
  };
}

/**
 * Validates the workshop registration form.
 * Returns { isValid, errors, referral }.
 *
 * NOTE: phone is required by the form and validated here.
 * The server also calls this function, so validation is consistent.
 */
export function validateRegistrationForm(formData) {
  const errors = {};

  // Full name
  if (!formData.fullName || formData.fullName.trim().length < 2) {
    errors.fullName = 'Full name is required (minimum 2 characters).';
  }

  // Email
  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address (e.g. student@college.edu.in).';
  }

  // Phone — required per form design
  if (!formData.phone || !validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid 10-digit Indian mobile number (6–9XXXXXXXXX).';
  }

  // College
  if (!formData.college || formData.college.trim().length < 2) {
    errors.college = 'College or university name is required.';
  }

  // Branch / Degree
  if (!formData.branch || formData.branch.trim().length < 2) {
    errors.branch = 'Degree and branch of study is required.';
  }

  // Year
  if (!formData.year || !formData.year.trim()) {
    errors.year = 'Please select your current year of study.';
  }

  // Track — radio group has a default; we still validate server-side
  if (!formData.track || !formData.track.trim()) {
    errors.track = 'Please select an AI workshop focus track.';
  }

  // Terms / attendance commitment
  if (!formData.termsAccepted) {
    errors.termsAccepted = 'You must agree to the attendance commitment to register.';
  }

  // Optional referral code — only fail if code is provided but invalid
  let referralResult = null;
  if (formData.referralCode && formData.referralCode.trim()) {
    referralResult = validateReferralCode(formData.referralCode);
    if (!referralResult.valid) {
      errors.referralCode = referralResult.message;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    referral: referralResult
  };
}
