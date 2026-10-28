/**
 * CampusAI Growth Engine - State Management & Data Analytics Store
 *
 * DATA TRANSPARENCY NOTICE:
 *  - INITIAL_BASELINE_METRICS: Simulated demo figures pre-populated to illustrate the dashboard.
 *  - INITIAL_AMBASSADORS: Fictional ambassador profiles used for demo purposes.
 *  - INITIAL_SAMPLE_RECORDS: Simulated registration records, NOT real student data.
 *  - Live user submissions via the registration form are stored as liveRegistrations
 *    and are clearly tagged isLiveUser: true in the CSV export.
 *
 * STORAGE LIMITATION:
 *  - In the browser, registrations are stored in localStorage (single-browser, single-user).
 *  - On the Node.js server, the store is in-memory only; data resets on server restart.
 *  - There is NO shared database. Two browser tabs or two users will NOT see the same live data.
 *  - For a shared, persistent database you would need a backend such as SQLite, PostgreSQL, or
 *    a hosted service. See README.md for deployment guidance.
 */

import { KNOWN_REFERRAL_CODES } from './validation.js';

// ─── DEMO BASELINE (all figures labelled DEMO in the UI) ─────────────────────
export const INITIAL_BASELINE_METRICS = {
  totalTarget: 500,
  sprintCurrentDay: 4,
  sprintTotalDays: 7,
  totalBudget: 2000,

  // Campaign budget allocation (must total ₹2,000)
  budgetAmbassadorIncentives: 1000,  // ₹1,000
  budgetPromotionalExperiments: 700, // ₹700
  budgetContingency: 300,            // ₹300

  // Baseline demo figures (simulated, not real)
  initialRegistrations: 284,
  initialReferralRegistrations: 146,
  initialExpenditure: 1120,
  initialCAC: 3.94,
  targetCAC: 4.00,
};

// Channel targets must sum to 500
export const CHANNEL_TARGETS = {
  ambassadors: 200,
  communities: 200,
  clubs: 100,
};

// Verify at load time
const channelSum = CHANNEL_TARGETS.ambassadors + CHANNEL_TARGETS.communities + CHANNEL_TARGETS.clubs;
if (channelSum !== INITIAL_BASELINE_METRICS.totalTarget) {
  console.error(`CONFIGURATION ERROR: Channel targets sum to ${channelSum}, expected 500.`);
}

// Verify budget at load time
const budgetSum =
  INITIAL_BASELINE_METRICS.budgetAmbassadorIncentives +
  INITIAL_BASELINE_METRICS.budgetPromotionalExperiments +
  INITIAL_BASELINE_METRICS.budgetContingency;
if (budgetSum !== INITIAL_BASELINE_METRICS.totalBudget) {
  console.error(`CONFIGURATION ERROR: Budget allocations sum to ₹${budgetSum}, expected ₹2,000.`);
}

// ─── DEMO AMBASSADOR DATA (fictional, for illustration only) ─────────────────
export const INITIAL_AMBASSADORS = [
  {
    code: 'NXT-RV-04',
    name: 'Pooja Nair',
    college: 'RV College of Engineering',
    email: 'p.nair@rvce.edu.in',
    referrals: 48,
    target: 50,
    conversionRate: '14.2%',
    incentiveEarned: 2400,
    status: 'Top Performer',
    avatar: 'PN',
    avatarColor: 'brand'
  },
  {
    code: 'NXT-BP-02',
    name: 'Siddharth Menon',
    college: 'BITS Pilani (Hyderabad)',
    email: 'siddharth.m@hyderabad.bits-pilani.ac.in',
    referrals: 39,
    target: 40,
    conversionRate: '12.8%',
    incentiveEarned: 1950,
    status: 'Top Performer',
    avatar: 'SM',
    avatarColor: 'brand'
  },
  {
    code: 'NXT-COEP-01',
    name: 'Tanvi Deshmukh',
    college: 'COEP Tech University',
    email: 'deshmukhtp21.comp@coep.ac.in',
    referrals: 31,
    target: 35,
    conversionRate: '11.5%',
    incentiveEarned: 1550,
    status: 'Active',
    avatar: 'TD',
    avatarColor: 'brand'
  },
  {
    code: 'NITT-ROBO-CLUB',
    name: 'Deepak Rajan',
    college: 'NIT Trichy',
    email: '108121045@nitt.edu',
    referrals: 26,
    target: 30,
    conversionRate: '9.4%',
    incentiveEarned: 1300,
    status: 'Active',
    avatar: 'DR',
    avatarColor: 'slate'
  },
  {
    code: 'VIT-AI-NODE',
    name: 'Rohan Roy',
    college: 'VIT Vellore',
    email: 'rohan.roy2023@vitstudent.ac.in',
    referrals: 22,
    target: 25,
    conversionRate: '8.7%',
    incentiveEarned: 1100,
    status: 'Active',
    avatar: 'RR',
    avatarColor: 'accent'
  },
  {
    code: 'NXT-IITM-01',
    name: 'Ananya Kulkarni',
    college: 'IIT Madras',
    email: 'ananya.k@smail.iitm.ac.in',
    referrals: 18,
    target: 20,
    conversionRate: '15.1%',
    incentiveEarned: 900,
    status: 'Active',
    avatar: 'AK',
    avatarColor: 'accent'
  },
  {
    code: 'NXT-DTU-03',
    name: 'Karan Sharma',
    college: 'Delhi Technological University',
    email: 'karan.s@dtu.ac.in',
    referrals: 15,
    target: 20,
    conversionRate: '8.2%',
    incentiveEarned: 750,
    status: 'Active',
    avatar: 'KS',
    avatarColor: 'brand'
  },
  {
    code: 'NXT-IITD-02',
    name: 'Neha Gupta',
    college: 'IIT Delhi',
    email: 'neha.g@iitd.ac.in',
    referrals: 14,
    target: 15,
    conversionRate: '13.0%',
    incentiveEarned: 700,
    status: 'Active',
    avatar: 'NG',
    avatarColor: 'accent'
  }
];

// ─── DEMO SAMPLE RECORDS (simulated, not real student data) ──────────────────
export const INITIAL_SAMPLE_RECORDS = [
  {
    id: 'REG-2025-0284',
    name: 'Pooja Nair',
    email: 'p.nair@rvce.edu.in',
    college: 'RV College of Engineering',
    degree: 'CSE • 2025 Batch',
    date: 'Today, 02:45 PM',
    rawDate: '2025-10-24T14:45:00.000Z',
    channel: 'Student Ambassador',
    referralCode: 'NXT-RV-04',
    status: ['Verified Email', 'WhatsApp Joined'],
    isLiveUser: false,
    track: 'Generative AI Agents',
    phone: '9845012345'
  },
  {
    id: 'REG-2025-0283',
    name: 'Ananya Kulkarni',
    email: 'ananya.k@smail.iitm.ac.in',
    college: 'IIT Madras',
    degree: 'Data Science & AI',
    date: 'Today, 01:20 PM',
    rawDate: '2025-10-24T13:20:00.000Z',
    channel: 'WhatsApp Community',
    referralCode: 'Direct / Open',
    status: ['Verified Email'],
    isLiveUser: false,
    track: 'LLM Fine-tuning & RAG',
    phone: '9876543210'
  },
  {
    id: 'REG-2025-0282',
    name: 'Siddharth Menon',
    email: 'f20220811@hyderabad.bits-pilani.ac.in',
    college: 'BITS Pilani (Hyderabad)',
    degree: 'Computer Science • 2026',
    date: 'Today, 11:50 AM',
    rawDate: '2025-10-24T11:50:00.000Z',
    channel: 'Student Ambassador',
    referralCode: 'NXT-BP-02',
    status: ['Verified Email', 'WhatsApp Joined'],
    isLiveUser: false,
    track: 'Generative AI Agents',
    phone: '9823456781'
  },
  {
    id: 'REG-2025-0281',
    name: 'Deepak Rajan',
    email: '108121045@nitt.edu',
    college: 'NIT Trichy',
    degree: 'ECE Society Lead',
    date: 'Yesterday, 06:15 PM',
    rawDate: '2025-10-23T18:15:00.000Z',
    channel: 'Tech Club',
    referralCode: 'NITT-ROBO-CLUB',
    status: ['Verified Email'],
    isLiveUser: false,
    track: 'Full-Stack Web3 & AI',
    phone: '9811223344'
  },
  {
    id: 'REG-2025-0280',
    name: 'Tanvi Deshmukh',
    email: 'deshmukhtp21.comp@coep.ac.in',
    college: 'COEP Tech University',
    degree: 'Computer Engineering • 2025',
    date: 'Yesterday, 04:30 PM',
    rawDate: '2025-10-23T16:30:00.000Z',
    channel: 'Student Ambassador',
    referralCode: 'NXT-COEP-01',
    status: ['Verified Email', 'WhatsApp Joined'],
    isLiveUser: false,
    track: 'LLM Fine-tuning & RAG',
    phone: '9922334455'
  },
  {
    id: 'REG-2025-0279',
    name: 'Rohan Roy',
    email: 'rohan.roy2023@vitstudent.ac.in',
    college: 'VIT Vellore',
    degree: 'Information Technology',
    date: 'Oct 22, 10:14 AM',
    rawDate: '2025-10-22T10:14:00.000Z',
    channel: 'WhatsApp Community',
    referralCode: 'Direct / Open',
    status: ['Verified Email'],
    isLiveUser: false,
    track: 'Computer Vision & Multimodal',
    phone: '9733445566'
  }
];

// ─── WORKSHOP TITLE (single source of truth) ──────────────────────────────────
export const WORKSHOP_TITLE = 'Build Your First AI Project in 60 Minutes';

// ─── STORE CLASS ──────────────────────────────────────────────────────────────
export class GrowthStore {
  constructor() {
    this.storageKey = 'campusai_growth_engine_v2';
    this.listeners = new Set();
    this.persistenceAdapter = null;
    this.state = this.loadState();
  }

  setPersistenceAdapter(adapter) {
    this.persistenceAdapter = adapter;
    if (adapter && typeof adapter.load === 'function') {
      try {
        const loaded = adapter.load();
        if (loaded && typeof loaded === 'object') {
          this.state = {
            liveRegistrations: Array.isArray(loaded.liveRegistrations) ? loaded.liveRegistrations : [],
            ambassadors: Array.isArray(loaded.ambassadors) ? loaded.ambassadors : JSON.parse(JSON.stringify(INITIAL_AMBASSADORS)),
            expenditure: loaded.expenditure !== undefined ? loaded.expenditure : INITIAL_BASELINE_METRICS.initialExpenditure
          };
          this.notify();
        }
      } catch (err) {
        console.warn('Failed loading state from persistence adapter:', err);
      }
    }
  }

  loadState() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem(this.storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            liveRegistrations: parsed.liveRegistrations || [],
            ambassadors: parsed.ambassadors || JSON.parse(JSON.stringify(INITIAL_AMBASSADORS)),
            expenditure: parsed.expenditure !== undefined
              ? parsed.expenditure
              : INITIAL_BASELINE_METRICS.initialExpenditure,
          };
        }
      } catch (err) {
        console.warn('Could not read from localStorage, using in-memory state.', err);
      }
    }
    return {
      liveRegistrations: [],
      ambassadors: JSON.parse(JSON.stringify(INITIAL_AMBASSADORS)),
      expenditure: INITIAL_BASELINE_METRICS.initialExpenditure
    };
  }

  saveState() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      } catch (err) {
        console.warn('Failed saving state to localStorage', err);
      }
    }
    if (this.persistenceAdapter && typeof this.persistenceAdapter.save === 'function') {
      try {
        this.persistenceAdapter.save(this.state);
      } catch (err) {
        console.warn('Failed saving state to persistent adapter', err);
      }
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.getAnalyticsSnapshot()));
  }

  // ── Duplicate detection ────────────────────────────────────────────────────
  /**
   * Returns true if an email already exists in live registrations or demo sample records.
   * Check is case-insensitive.
   */
  isDuplicateEmail(email) {
    const normalized = (email || '').toLowerCase().trim();
    if (!normalized) return false;

    const inLive = this.state.liveRegistrations.some(
      r => r.email.toLowerCase().trim() === normalized
    );
    if (inLive) return true;

    // Also check demo sample records so a user can't re-register with a demo email
    const inSample = INITIAL_SAMPLE_RECORDS.some(
      r => r.email.toLowerCase().trim() === normalized
    );
    return inSample;
  }

  // ── Add registration ───────────────────────────────────────────────────────
  /**
   * Records a new live student registration.
   * Returns { success: false, error: 'DUPLICATE' } if email already exists.
   * Returns { success: true, record } on success.
   */
  addRegistration(formData) {
    // Duplicate check
    if (this.isDuplicateEmail(formData.email)) {
      return { success: false, error: 'DUPLICATE', message: 'This email address has already been registered for the workshop.' };
    }

    const isReferral = Boolean(formData.referralCode && formData.referralCode.trim());
    const cleanRef = isReferral ? formData.referralCode.trim().toUpperCase() : 'Direct / Open';

    // Determine channel: ambassador referral codes get 'Student Ambassador',
    // known club codes get 'Tech Club', everything else gets 'WhatsApp Community'
    let channel = 'WhatsApp Community';
    if (isReferral) {
      const knownAmbassador = INITIAL_AMBASSADORS.some(a => a.code === cleanRef);
      if (knownAmbassador || KNOWN_REFERRAL_CODES[cleanRef]) {
        channel = 'Student Ambassador';
      } else {
        channel = 'Tech Club';
      }
    }

    const newId = `REG-2025-${String(
      INITIAL_BASELINE_METRICS.initialRegistrations + this.state.liveRegistrations.length + 1
    ).padStart(4, '0')}`;

    const now = new Date();
    const timeString = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newRecord = {
      id: newId,
      name: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone ? formData.phone.trim() : '',
      college: formData.college.trim(),
      degree: `${formData.branch.trim()} • ${formData.year}`,
      date: timeString,
      rawDate: now.toISOString(),
      channel,
      referralCode: cleanRef,
      status: ['Verified Email', 'WhatsApp Joined'],
      isLiveUser: true,
      track: formData.track || 'Generative AI Agents',
      motivation: formData.motivation || ''
    };

    this.state.liveRegistrations.unshift(newRecord);

    // Update ambassador referral count if the code matches a known rep
    if (isReferral) {
      const ambIndex = this.state.ambassadors.findIndex(
        a => a.code.toUpperCase() === cleanRef
      );
      if (ambIndex !== -1) {
        this.state.ambassadors[ambIndex].referrals += 1;
        this.state.ambassadors[ambIndex].incentiveEarned += 50; // ₹50 per verified referral
      }
    }

    this.saveState();
    return { success: true, record: newRecord };
  }

  // ── Reset ──────────────────────────────────────────────────────────────────
  resetState() {
    this.state = {
      liveRegistrations: [],
      ambassadors: JSON.parse(JSON.stringify(INITIAL_AMBASSADORS)),
      expenditure: INITIAL_BASELINE_METRICS.initialExpenditure
    };
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(this.storageKey);
    }
    if (this.persistenceAdapter && typeof this.persistenceAdapter.save === 'function') {
      try {
        this.persistenceAdapter.save(this.state);
      } catch (_) {}
    }
    this.notify();
  }

  // ── Get all registrations ─────────────────────────────────────────────────
  /**
   * Returns live user registrations followed by simulated demo records.
   * The two sets are clearly distinguished by the isLiveUser flag.
   */
  getAllRegistrations() {
    return [...this.state.liveRegistrations, ...INITIAL_SAMPLE_RECORDS];
  }

  // ── KPI snapshot ──────────────────────────────────────────────────────────
  /**
   * Derives all dashboard metrics from stored state.
   * Formula documentation:
   *   targetProgress  = totalRegistrations / 500 × 100
   *   remaining       = max(0, 500 − totalRegistrations)
   *   cac             = totalExpenditure / totalRegistrations  (when denominator > 0)
   */
  getAnalyticsSnapshot() {
    const liveCount = this.state.liveRegistrations.length;
    const totalRegistrations = INITIAL_BASELINE_METRICS.initialRegistrations + liveCount;
    const goal = INITIAL_BASELINE_METRICS.totalTarget;

    const remainingRunway = Math.max(0, goal - totalRegistrations);
    // Formula: targetProgress = registrations / 500 × 100
    const percentCompleted = totalRegistrations > 0
      ? Number(((totalRegistrations / goal) * 100).toFixed(1))
      : 0;

    // Referral tracking
    const liveAmbassadorReferrals = this.state.liveRegistrations.filter(
      r => r.channel === 'Student Ambassador'
    ).length;
    const totalReferrals = INITIAL_BASELINE_METRICS.initialReferralRegistrations + liveAmbassadorReferrals;
    const referralSharePercent = totalRegistrations > 0
      ? Number(((totalReferrals / totalRegistrations) * 100).toFixed(1))
      : 0;

    // Expenditure & CAC
    // Formula: cac = spend / registrations (when registrations > 0)
    const totalExpenditure = this.state.expenditure;
    const cac = totalRegistrations > 0
      ? Number((totalExpenditure / totalRegistrations).toFixed(2))
      : 0;
    const budgetRemaining = INITIAL_BASELINE_METRICS.totalBudget - totalExpenditure;

    // Channel breakdown counts
    const liveCommunityReferrals = this.state.liveRegistrations.filter(
      r => r.channel === 'WhatsApp Community'
    ).length;
    const liveClubReferrals = this.state.liveRegistrations.filter(
      r => r.channel === 'Tech Club'
    ).length;

    // Baseline channel counts from demo (146 ambassador, 112 community, 26 club = 284)
    const ambassadorCount = 146 + liveAmbassadorReferrals;
    const communityCount = 112 + liveCommunityReferrals;
    const clubCount = 26 + liveClubReferrals;

    return {
      totalRegistrations,
      goal,
      remainingRunway,
      percentCompleted,
      totalReferrals,
      referralSharePercent,
      activeAmbassadors: this.state.ambassadors.length,
      viralMultiplier: '2.1x',
      totalExpenditure,
      budgetTotal: INITIAL_BASELINE_METRICS.totalBudget,
      budgetRemaining,
      budgetSpentPercent: Number(((totalExpenditure / INITIAL_BASELINE_METRICS.totalBudget) * 100).toFixed(1)),
      cac,
      targetCAC: INITIAL_BASELINE_METRICS.targetCAC,
      channels: {
        ambassadors: {
          count: ambassadorCount,
          target: CHANNEL_TARGETS.ambassadors,
          pct: Math.min(100, Math.round((ambassadorCount / CHANNEL_TARGETS.ambassadors) * 100)),
          cac: '₹2.60',
          spend: '₹380'
        },
        communities: {
          count: communityCount,
          target: CHANNEL_TARGETS.communities,
          pct: Math.min(100, Math.round((communityCount / CHANNEL_TARGETS.communities) * 100)),
          cac: '₹4.64',
          spend: '₹520'
        },
        clubs: {
          count: clubCount,
          target: CHANNEL_TARGETS.clubs,
          pct: Math.min(100, Math.round((clubCount / CHANNEL_TARGETS.clubs) * 100)),
          cac: '₹8.46',
          spend: '₹220'
        }
      },
      liveCount
    };
  }

  // ── CSV export ────────────────────────────────────────────────────────────
  exportToCSV(records = this.getAllRegistrations()) {
    const headers = [
      'Registration ID',
      'Student Name',
      'Email',
      'Phone',
      'College / Institute',
      'Degree / Branch',
      'Registration Date',
      'Acquisition Channel',
      'Referral Code',
      'Focus Track',
      'Verification Status',
      'Record Type'
    ];

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = records.map(r => [
      escapeCSV(r.id),
      escapeCSV(r.name),
      escapeCSV(r.email),
      escapeCSV(r.phone || 'N/A'),
      escapeCSV(r.college),
      escapeCSV(r.degree),
      escapeCSV(r.date),
      escapeCSV(r.channel),
      escapeCSV(r.referralCode),
      escapeCSV(r.track || 'General AI Track'),
      escapeCSV(Array.isArray(r.status) ? r.status.join(', ') : r.status),
      escapeCSV(r.isLiveUser ? 'LIVE USER SUBMISSION' : 'SIMULATED DEMO DATA')
    ].join(','));

    return [headers.join(','), ...rows].join('\r\n');
  }
}

export const store = new GrowthStore();
