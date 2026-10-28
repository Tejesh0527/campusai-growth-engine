/**
 * CampusAI Growth Engine - Main Client Application Logic
 */

import { store } from './store.js';
import { validateRegistrationForm, validateReferralCode, cleanPhoneNumber } from './validation.js';

document.addEventListener('DOMContentLoaded', () => {
  // Navigation elements
  const navItems = document.querySelectorAll('.nav-item');
  const screens = document.querySelectorAll('.screen-view');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const sidebarNav = document.getElementById('sidebarNav');
  const mobileSidebarBackdrop = document.getElementById('mobileSidebarBackdrop');

  // Overview elements
  const kpiTotalRegistrations = document.getElementById('kpiTotalRegistrations');
  const bannerPacingPercent = document.getElementById('bannerPacingPercent');
  const bannerCurrentRegistrations = document.getElementById('bannerCurrentRegistrations');
  const bannerBudgetRemaining = document.getElementById('bannerBudgetRemaining');
  const kpiRegistrationPercent = document.getElementById('kpiRegistrationPercent');
  const kpiRegistrationRemaining = document.getElementById('kpiRegistrationRemaining');
  const kpiProgressBar = document.getElementById('kpiProgressBar');
  const kpiReferralRegistrations = document.getElementById('kpiReferralRegistrations');
  const kpiReferralShareBadge = document.getElementById('kpiReferralShareBadge');
  const kpiCACValue = document.getElementById('kpiCACValue');
  const funnelCompletedCount = document.getElementById('funnelCompletedCount');
  const statRecordedVolume = document.getElementById('statRecordedVolume');
  const chanAmbassadorCount = document.getElementById('chanAmbassadorCount');
  const chanAmbassadorAchieved = document.getElementById('chanAmbassadorAchieved');
  const chanAmbassadorBar = document.getElementById('chanAmbassadorBar');
  const chanCommunityCount = document.getElementById('chanCommunityCount');
  const chanClubCount = document.getElementById('chanClubCount');
  const kpiExpenditureValue = document.getElementById('kpiExpenditureValue');
  const kpiExpenditureRemaining = document.getElementById('kpiExpenditureRemaining');
  const kpiExpenditureProgressBar = document.getElementById('kpiExpenditureProgressBar');

  // Table & Filter elements
  const searchInput = document.getElementById('searchInput');
  const channelFilter = document.getElementById('channelFilter');
  const dateFilter = document.getElementById('dateFilter');
  const tableBody = document.getElementById('tableBody');
  const tableContainer = document.getElementById('tableContainer');
  const emptyState = document.getElementById('emptyState');
  const toggleEmptyStateBtn = document.getElementById('toggleEmptyStateBtn');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const recordCountBadge = document.getElementById('recordCountBadge');
  const visibleCountText = document.getElementById('visibleCountText');
  const totalTableCountText = document.getElementById('totalTableCountText');
  const topExportReportBtn = document.getElementById('topExportReportBtn');
  const tableExportCsvBtn = document.getElementById('tableExportCsvBtn');

  // Registration Form elements
  const registrationForm = document.getElementById('registrationForm');
  const regFormSeatsRemaining = document.getElementById('regFormSeatsRemaining');
  const referralCodeInput = document.getElementById('referralCode');
  const referralFeedbackBox = document.getElementById('referralFeedbackBox');
  const referralFeedbackText = document.getElementById('referralFeedbackText');
  const referralValidationIcon = document.getElementById('referralValidationIcon');
  const registrationSuccessModal = document.getElementById('registrationSuccessModal');
  const confirmedStudentName = document.getElementById('confirmedStudentName');
  const confirmedTicketId = document.getElementById('confirmedTicketId');
  const confirmedCollege = document.getElementById('confirmedCollege');
  const confirmedTrack = document.getElementById('confirmedTrack');
  const viewInDashboardBtn = document.getElementById('viewInDashboardBtn');
  const registerAnotherStudentBtn = document.getElementById('registerAnotherStudentBtn');
  const topNavRegisterBtn = document.getElementById('topNavRegisterBtn');
  const exploreAmbassadorsLink = document.getElementById('exploreAmbassadorsLink');

  // Ambassador Hub elements
  const ambTotalReferrals = document.getElementById('ambTotalReferrals');
  const ambTotalPayouts = document.getElementById('ambTotalPayouts');
  const ambassadorSelect = document.getElementById('ambassadorSelect');
  const generatedReferralLink = document.getElementById('generatedReferralLink');
  const copyReferralLinkBtn = document.getElementById('copyReferralLinkBtn');
  const launchTestReferralBtn = document.getElementById('launchTestReferralBtn');
  const ambassadorLeaderboardBody = document.getElementById('ambassadorLeaderboardBody');

  // Marketing Copy elements
  const copyTemplateBtns = document.querySelectorAll('.copy-template-btn');

  // Toast
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  let forcedEmptyState = false;

  // =========================================================================
  // TOAST NOTIFICATIONS
  // =========================================================================
  function showToast(msg, isSuccess = true) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = msg;
    toastNotification.classList.remove('translate-y-24', 'opacity-0');
    toastNotification.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toastNotification.classList.remove('translate-y-0', 'opacity-100');
      toastNotification.classList.add('translate-y-24', 'opacity-0');
    }, 3200);
  }

  // =========================================================================
  // SCREEN NAVIGATION & ROUTING
  // =========================================================================
  function switchScreen(screenId, pushHash = true) {
    screens.forEach(screen => {
      if (screen.id === `screen-${screenId}`) {
        screen.classList.add('active-screen');
      } else {
        screen.classList.remove('active-screen');
      }
    });

    navItems.forEach(item => {
      const target = item.getAttribute('data-target');
      if (target === screenId) {
        item.classList.add('bg-brand-600', 'text-white', 'shadow-sm');
        item.classList.remove('text-slate-300', 'hover:bg-slate-800/80');
      } else {
        item.classList.remove('bg-brand-600', 'text-white', 'shadow-sm');
        item.classList.add('text-slate-300', 'hover:bg-slate-800/80');
      }
    });

    if (pushHash) {
      window.location.hash = screenId;
    }

    // Scroll to top of main area
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile sidebar if open
    closeMobileSidebar();
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = item.getAttribute('data-target');
      if (target) switchScreen(target);
    });
  });

  if (topNavRegisterBtn) {
    topNavRegisterBtn.addEventListener('click', () => switchScreen('registration'));
  }

  if (exploreAmbassadorsLink) {
    exploreAmbassadorsLink.addEventListener('click', () => switchScreen('ambassadors'));
  }

  if (viewInDashboardBtn) {
    viewInDashboardBtn.addEventListener('click', () => switchScreen('overview'));
  }

  // Mobile sidebar controls
  function openMobileSidebar() {
    sidebarNav?.classList.remove('-translate-x-full');
    mobileSidebarBackdrop?.classList.remove('hidden');
  }

  function closeMobileSidebar() {
    sidebarNav?.classList.add('-translate-x-full');
    mobileSidebarBackdrop?.classList.add('hidden');
  }

  mobileMenuBtn?.addEventListener('click', openMobileSidebar);
  closeSidebarBtn?.addEventListener('click', closeMobileSidebar);
  mobileSidebarBackdrop?.addEventListener('click', closeMobileSidebar);

  // =========================================================================
  // CSV EXPORT FUNCTIONALITY
  // =========================================================================
  function triggerCSVDownload() {
    const csvContent = store.exportToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', url);
    downloadLink.setAttribute('download', `campusai_registrations_sprint_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
    const count = store.getAllRegistrations().length;
    showToast(`CSV Export downloaded: ${count} student registration records`);
  }

  topExportReportBtn?.addEventListener('click', triggerCSVDownload);
  tableExportCsvBtn?.addEventListener('click', triggerCSVDownload);

  // =========================================================================
  // REFERRAL LINK GENERATOR (Ambassador Hub)
  // =========================================================================
  function updateGeneratedReferralLink() {
    if (!ambassadorSelect || !generatedReferralLink) return;
    const selectedCode = ambassadorSelect.value;
    const origin = (typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null')
      ? window.location.origin
      : 'https://campusai-growth-engine.onrender.com';
    const link = `${origin}/?screen=registration&ref=${selectedCode}`;
    generatedReferralLink.value = link;
  }

  ambassadorSelect?.addEventListener('change', updateGeneratedReferralLink);

  copyReferralLinkBtn?.addEventListener('click', () => {
    if (!generatedReferralLink) return;
    navigator.clipboard.writeText(generatedReferralLink.value).then(() => {
      showToast(`Copied referral link for ${ambassadorSelect.value}!`);
    }).catch(() => {
      generatedReferralLink.select();
      document.execCommand('copy');
      showToast(`Copied referral link for ${ambassadorSelect.value}!`);
    });
  });

  launchTestReferralBtn?.addEventListener('click', () => {
    const code = ambassadorSelect.value;
    switchScreen('registration');
    if (referralCodeInput) {
      referralCodeInput.value = code;
      checkReferralCode(code);
    }
    showToast(`Loaded referral code: ${code}`);
  });

  // =========================================================================
  // LIVE REFERRAL CODE VALIDATION ON REGISTRATION FORM
  // =========================================================================
  function checkReferralCode(code) {
    if (!code || !code.trim()) {
      referralFeedbackBox?.classList.add('hidden');
      referralValidationIcon?.classList.add('hidden');
      return;
    }

    const res = validateReferralCode(code);
    if (res.valid) {
      referralFeedbackBox?.classList.remove('hidden', 'bg-red-50', 'border-red-200', 'text-red-800');
      referralFeedbackBox?.classList.add('bg-emerald-50', 'border-emerald-200', 'text-emerald-800');
      if (referralFeedbackText) {
        referralFeedbackText.textContent = `Valid Ambassador Pass: ${res.details.ambassador} (${res.details.college}) • ${res.details.discount}`;
      }
      referralValidationIcon?.classList.remove('hidden');
    } else {
      referralFeedbackBox?.classList.remove('hidden', 'bg-emerald-50', 'border-emerald-200', 'text-emerald-800');
      referralFeedbackBox?.classList.add('bg-amber-50', 'border-amber-200', 'text-amber-800');
      if (referralFeedbackText) {
        referralFeedbackText.textContent = res.message || 'Invalid code format. Example: NXT-RV-04';
      }
      referralValidationIcon?.classList.add('hidden');
    }
  }

  referralCodeInput?.addEventListener('input', (e) => {
    checkReferralCode(e.target.value);
  });

  // =========================================================================
  // WORKSHOP REGISTRATION FORM SUBMISSION & VALIDATION
  // =========================================================================
  function clearFormErrors() {
    ['fullName', 'email', 'phone', 'college', 'branch', 'year', 'track', 'termsAccepted', 'referralCode'].forEach(field => {
      const errEl = document.getElementById(`err-${field}`);
      if (errEl) {
        errEl.classList.add('hidden');
        errEl.textContent = '';
      }
      const inputEl = document.getElementById(field);
      if (inputEl) {
        inputEl.classList.remove('border-red-500', 'ring-2', 'ring-red-500/20');
      }
    });
  }

  function displayFormErrors(errors) {
    Object.keys(errors).forEach(field => {
      const errEl = document.getElementById(`err-${field}`);
      if (errEl) {
        errEl.textContent = errors[field];
        errEl.classList.remove('hidden');
      }
      const inputEl = document.getElementById(field);
      if (inputEl) {
        inputEl.classList.add('border-red-500', 'ring-2', 'ring-red-500/20');
      }
    });
  }

  registrationForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors();

    const formData = new FormData(registrationForm);
    const data = {
      fullName: formData.get('fullName') || '',
      email: formData.get('email') || '',
      phone: formData.get('phone') || '',
      college: formData.get('college') || '',
      branch: formData.get('branch') || '',
      year: formData.get('year') || '',
      track: formData.get('track') || '',
      referralCode: formData.get('referralCode') || '',
      termsAccepted: formData.get('termsAccepted') === 'on'
    };

    const validation = validateRegistrationForm(data);

    if (!validation.isValid) {
      displayFormErrors(validation.errors);
      showToast('Please fix the errors in the registration form', false);
      return;
    }

    // Save registration
    const result = store.addRegistration(data);

    if (!result.success) {
      if (result.error === 'DUPLICATE') {
        displayFormErrors({ email: result.message });
        showToast('⚠️ ' + result.message, false);
      } else {
        showToast('Registration failed. Please try again.', false);
      }
      return;
    }

    const newRecord = result.record;

    // Asynchronously synchronize with backend API if running
    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(() => {
      // Offline/standalone mode - local store is authoritative
    });

    // Show confirmation modal
    if (confirmedStudentName) confirmedStudentName.textContent = newRecord.name;
    if (confirmedTicketId) confirmedTicketId.textContent = newRecord.id;
    if (confirmedCollege) confirmedCollege.textContent = newRecord.college;
    if (confirmedTrack) confirmedTrack.textContent = newRecord.track;

    registrationSuccessModal?.classList.remove('hidden');
    registrationForm?.classList.add('hidden');

    showToast(`Registration confirmed! Welcome to Cohort '25, ${newRecord.name}`);
  });

  registerAnotherStudentBtn?.addEventListener('click', () => {
    registrationForm?.reset();
    clearFormErrors();
    referralFeedbackBox?.classList.add('hidden');
    referralValidationIcon?.classList.add('hidden');
    registrationSuccessModal?.classList.add('hidden');
    registrationForm?.classList.remove('hidden');
  });

  // =========================================================================
  // MARKETING ASSISTANT (PROTOTYPE - TONE GENERATION, COPY, WHATSAPP SHARE)
  // =========================================================================
  const appOrigin = typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null'
    ? window.location.origin
    : 'https://campusai-growth-engine.onrender.com';

  const MARKETING_TEMPLATES = {
    t1: {
      friendly: `🚀 *Free AI Workshop by NxtWave!*\n\nHey everyone! Join a free 60-min live workshop:\n*"Build Your First AI Project in 60 Minutes"*\n\n🎯 What you'll build: a working AI project in 1 hour.\n100% Free — no prior experience needed!\n\n🎟️ Register here:\n${appOrigin}/?screen=registration\n\nOnly 500 seats across all campuses. Register now! ⚡`,
      professional: `📢 *Official Announcement: Hands-on AI Workshop by NxtWave*\n\nDear students,\n\nRegistrations are now open for the live workshop:\n*"Build Your First AI Project in 60 Minutes"*\n\nKey highlights:\n• 60-minute practical project development\n• Guided by industry practitioners\n• 100% complimentary access for enrolled engineering students\n\nRegistration link:\n${appOrigin}/?screen=registration\n\nNote: Admissions are strictly capped at 500 across participating institutions.`,
      energetic: `🔥 *LEVEL UP YOUR AI SKILLS IN 60 MINUTES!* ⚡\n\nStop watching tutorials — actually BUILD something!\nJoin NxtWave's high-energy masterclass:\n*"Build Your First AI Project in 60 Minutes"*\n\n💥 1 Hour. 1 Working AI Project. 0 Prior Experience Needed.\n\n⚡ Claim your free seat before the 500-seat cap runs out:\n${appOrigin}/?screen=registration\n\nLet's build something epic! 🚀`
    },
    t2: {
      friendly: `Hey [Name]! 👋\n\nI'm sharing NxtWave's free 60-min live workshop:\n*"Build Your First AI Project in 60 Minutes"*\n\nYou'll build something real in 1 hour. 100% free.\n\nRegister with my referral link:\n${appOrigin}/?screen=registration&ref=[YOUR_CODE]\n\nLet me know if you sign up! 😊`,
      professional: `Hello [Name],\n\nI wanted to share an educational opportunity from NxtWave:\n*"Build Your First AI Project in 60 Minutes"*\n\nThis 60-minute session delivers hands-on project creation for students looking to strengthen technical skills.\n\nYou can access registration via my campus ambassador link:\n${appOrigin}/?screen=registration&ref=[YOUR_CODE]\n\nBest regards,\n[Your Name]`,
      energetic: `Hey [Name]! Ready to build your first AI project this week? 💥\n\nNxtWave is hosting *"Build Your First AI Project in 60 Minutes"* and I've got an ambassador referral link!\n\n⚡ Sign up with my code:\n${appOrigin}/?screen=registration&ref=[YOUR_CODE]\n\nGrab a seat before all 500 slots vanish! Let's go! 🚀`
    },
    t3: {
      friendly: `📢 **Calling all Builders & Developers!**\n\nFree live AI workshop for engineers:\n**"Build Your First AI Project in 60 Minutes"**\n\n💡 Hands-on with modern AI frameworks.\nBuild a real project. Add it to your portfolio.\n\nRegister with our club code for priority access:\n👉 ${appOrigin}/?screen=registration&ref=NITT-ROBO-CLUB\n\nOnly 500 spots total! 🔥`,
      professional: `📢 **Technical Notice: Campus Club AI Workshop**\n\nOur club is pleased to present NxtWave's live workshop:\n**"Build Your First AI Project in 60 Minutes"**\n\nObjective: Fast-paced, project-driven orientation to contemporary AI workflows and tools.\n\nClub members may register with code:\n👉 ${appOrigin}/?screen=registration&ref=NITT-ROBO-CLUB\n\nRegistration limit: 500 nationwide cohort seats.`,
      energetic: `⚡ **HACKATHON & CODING CLUB ALERT!** 🚀\n\nGet ready to build! NxtWave is hosting:\n**"Build Your First AI Project in 60 Minutes"**\n\n🛠️ Zero fluff, 100% hands-on build lab.\nWalk away with code you built yourself in 60 minutes flat!\n\nUse our club code for instant registration:\n👉 ${appOrigin}/?screen=registration&ref=NITT-ROBO-CLUB\n\nClaim your spot NOW! 💥`
    },
    t4: {
      friendly: `🎓 Attention Students!\n\nNxtWave offers a free, beginner-friendly live workshop:\n**"Build Your First AI Project in 60 Minutes"**\n\n📅 Live interactive online session — 60 minutes.\n🆓 Cost: Completely FREE.\n🎯 Any student can join — no experience needed.\n\nLimited to 500 students across all colleges:\n${appOrigin}/?screen=registration ✅`,
      professional: `🎓 **Academic Community Circular**\n\nSubject: Complimentary Student AI Workshop\n\nStudents across engineering disciplines are invited to attend:\n**"Build Your First AI Project in 60 Minutes"**\n\n• Session duration: 60 minutes\n• Format: Live interactive instruction\n• Prerequisites: None (Beginner-friendly)\n\nEnrollment portal (500 capacity):\n${appOrigin}/?screen=registration`,
      energetic: `🎓 **CAMPUS COMMUNITY SHOUTOUT!** ⚡\n\nCurious about AI but don't know where to start?\nJoin NxtWave's live 60-minute build session:\n**"Build Your First AI Project in 60 Minutes"**\n\n🔥 100% Free. Live coding. Real takeaways.\n\nLock in your seat right now before registration closes:\n${appOrigin}/?screen=registration 🚀`
    },
    t5: {
      friendly: `Subject: Free AI Workshop for Students — "Build Your First AI Project in 60 Minutes"\n\nDear [Professor / Coordinator Name],\n\nI hope this message finds you well. I am writing to share a free learning opportunity for students in your department.\n\nNxtWave is hosting a live, hands-on workshop: "Build Your First AI Project in 60 Minutes"\n\nWorkshop Details:\n• Duration: 60 minutes (live, interactive session)\n• Cost: Completely free\n• Format: Practical, project-based learning\n• Target audience: Any enrolled student — no experience required\n\nRegistration Link (maximum 500 seats across all colleges):\n${appOrigin}/?screen=registration\n\nParticipants walk away with a working AI project for their resume.\n\nThank you for your time.\n\nWarm regards,\n[Your Name] | NxtWave Campus Ambassador`,
      professional: `Subject: Complimentary Educational Workshop Invitation: "Build Your First AI Project in 60 Minutes"\n\nDear Faculty Advisor / Department Coordinator,\n\nI am contacting you on behalf of the NxtWave Student Growth Initiative to inform your department of a fully sponsored technical training session titled:\n\n"Build Your First AI Project in 60 Minutes"\n\nThis 60-minute session provides structured, practical guidance enabling students to implement a functioning AI project.\n\nKey Program Information:\n• Modality: Online synchronous masterclass\n• Tuition: Fully waived (zero institutional or student cost)\n• Target Group: Undergraduate engineering and technology scholars\n\nOfficial Registration URL: ${appOrigin}/?screen=registration\n\nWe would welcome the distribution of this notice via official student communication channels.\n\nRespectfully,\nCampus Ambassador Team | NxtWave`,
      energetic: `Subject: Exciting Free AI Workshop for Students: "Build Your First AI Project in 60 Minutes" 🚀\n\nDear [Professor / Coordinator],\n\nWe are thrilled to bring a high-impact, hands-on AI opportunity to students on our campus!\n\nNxtWave is delivering a live, 60-minute intensive build sprint:\n"Build Your First AI Project in 60 Minutes"\n\nStudents will code and launch a live AI project in just 60 minutes — zero theory-only slides!\n\nLink to sign up (free for first 500 students):\n${appOrigin}/?screen=registration\n\nCould you please forward this to your student groups so they don't miss out on this rapid skill boost?\n\nCheers and thank you!\n[Your Name] | Campus Ambassador`
    }
  };

  function getSelectedTone() {
    const checked = document.querySelector('input[name="messageTone"]:checked');
    return checked ? checked.value : 'friendly';
  }

  // Template Copy Buttons
  document.querySelectorAll('.copy-template-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const textEl = document.getElementById(targetId);
      if (textEl) {
        navigator.clipboard.writeText(textEl.textContent.trim()).then(() => {
          showToast('Template copied to clipboard!');
        }).catch(() => {
          showToast('Copied template to clipboard!');
        });
      }
    });
  });

  // Template Generate (Tone Adaptation) Buttons
  document.querySelectorAll('.mkt-generate-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const templateKey = btn.getAttribute('data-template');
      const tone = getSelectedTone();
      const content = MARKETING_TEMPLATES[templateKey]?.[tone];
      if (content) {
        const textEl = document.getElementById(templateKey);
        if (textEl) {
          textEl.textContent = content;
          showToast(`Generated ${tone.toUpperCase()} tone variant for ${templateKey.toUpperCase()}!`);
        }
      }
    });
  });

  // WhatsApp Share Buttons for Marketing Templates
  document.querySelectorAll('.mkt-wa-share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const textEl = document.getElementById(targetId);
      if (textEl) {
        const text = textEl.textContent.trim();
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      }
    });
  });

  // Re-generate templates automatically if tone radio changes
  document.querySelectorAll('input[name="messageTone"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const tone = getSelectedTone();
      ['t1', 't2', 't3', 't4', 't5'].forEach(key => {
        const textEl = document.getElementById(key);
        if (textEl && MARKETING_TEMPLATES[key]?.[tone]) {
          textEl.textContent = MARKETING_TEMPLATES[key][tone];
        }
      });
      showToast(`Updated all templates to ${tone.toUpperCase()} tone`);
    });
  });

  // Initialize marketing template content with active origin
  const initialTone = getSelectedTone();
  ['t1', 't2', 't3', 't4', 't5'].forEach(key => {
    const textEl = document.getElementById(key);
    if (textEl && MARKETING_TEMPLATES[key]?.[initialTone]) {
      textEl.textContent = MARKETING_TEMPLATES[key][initialTone];
    }
  });

  // =========================================================================
  // TABLE RENDERING & FILTERING
  // =========================================================================
  function renderTable() {
    if (!tableBody) return;

    if (forcedEmptyState) {
      tableContainer?.classList.add('hidden');
      emptyState?.classList.remove('hidden');
      emptyState?.classList.add('flex');
      if (visibleCountText) visibleCountText.textContent = '0';
      return;
    }

    const allRecords = store.getAllRegistrations();
    const query = (searchInput?.value || '').toLowerCase().trim();
    const selectedChannel = channelFilter?.value || 'all';
    const selectedDate = dateFilter?.value || 'all';

    let visibleCount = 0;
    tableBody.innerHTML = '';

    allRecords.forEach(record => {
      const searchMatch = !query ||
        record.name.toLowerCase().includes(query) ||
        record.college.toLowerCase().includes(query) ||
        record.email.toLowerCase().includes(query) ||
        record.referralCode.toLowerCase().includes(query);

      const channelMatch = selectedChannel === 'all' || record.channel === selectedChannel;
      const dateMatch = selectedDate === 'all' || record.date.includes(selectedDate);

      if (searchMatch && channelMatch && dateMatch) {
        visibleCount++;
        const tr = document.createElement('tr');
        tr.className = `table-record hover:bg-slate-50/80 transition-colors ${record.isLiveUser ? 'bg-emerald-50/40 border-l-4 border-l-emerald-500' : ''}`;

        // Get initials
        const parts = record.name.split(' ');
        const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0].slice(0, 2).toUpperCase();

        // Channel badge color
        let channelBadgeClass = 'bg-slate-100 text-slate-700 border-slate-300';
        let channelDotClass = 'bg-slate-500';
        if (record.channel === 'Student Ambassador') {
          channelBadgeClass = 'bg-brand-50 text-brand-700 border-brand-200';
          channelDotClass = 'bg-brand-600';
        } else if (record.channel === 'WhatsApp Community') {
          channelBadgeClass = 'bg-sky-50 text-sky-700 border-sky-200';
          channelDotClass = 'bg-accent-500';
        }

        tr.innerHTML = `
          <td class="py-3.5 px-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full ${record.isLiveUser ? 'bg-emerald-600 text-white font-bold' : 'bg-brand-100 text-brand-700 font-bold'} flex items-center justify-center text-xs shadow-xs">
                ${initials}
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="font-bold text-navy-900">${record.name}</span>
                  ${record.isLiveUser ? '<span class="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">LIVE USER</span>' : '<span class="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">DEMO</span>'}
                </div>
                <span class="text-slate-500 text-[11px]">${record.email}</span>
              </div>
            </div>
          </td>
          <td class="py-3.5 px-4">
            <span class="font-semibold text-navy-900 block">${record.college}</span>
            <span class="text-slate-400 text-[11px]">${record.degree}</span>
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap text-slate-600">
            ${record.date}
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${channelBadgeClass}">
              <span class="w-1.5 h-1.5 rounded-full ${channelDotClass}"></span>
              ${record.channel}
            </span>
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap">
            ${record.referralCode !== 'Direct / Open'
              ? `<code class="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] font-semibold text-slate-700">${record.referralCode}</code>`
              : `<span class="text-slate-400 font-mono text-[11px]">Direct / Open</span>`}
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✓ Verified Email
              </span>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                WhatsApp Joined
              </span>
            </div>
          </td>
        `;

        tableBody.appendChild(tr);
      }
    });

    if (visibleCountText) visibleCountText.textContent = visibleCount;
    if (totalTableCountText) totalTableCountText.textContent = allRecords.length;

    if (visibleCount === 0) {
      tableContainer?.classList.add('hidden');
      emptyState?.classList.remove('hidden');
      emptyState?.classList.add('flex');
    } else {
      tableContainer?.classList.remove('hidden');
      emptyState?.classList.add('hidden');
      emptyState?.classList.remove('flex');
    }
  }

  // Filter change events
  searchInput?.addEventListener('input', renderTable);
  channelFilter?.addEventListener('change', renderTable);
  dateFilter?.addEventListener('change', renderTable);

  toggleEmptyStateBtn?.addEventListener('click', () => {
    forcedEmptyState = !forcedEmptyState;
    toggleEmptyStateBtn.classList.toggle('bg-brand-50', forcedEmptyState);
    toggleEmptyStateBtn.classList.toggle('border-brand-500', forcedEmptyState);
    toggleEmptyStateBtn.classList.toggle('text-brand-700', forcedEmptyState);
    renderTable();
  });

  resetFiltersBtn?.addEventListener('click', () => {
    forcedEmptyState = false;
    toggleEmptyStateBtn?.classList.remove('bg-brand-50', 'border-brand-500', 'text-brand-700');
    if (searchInput) searchInput.value = '';
    if (channelFilter) channelFilter.value = 'all';
    if (dateFilter) dateFilter.value = 'all';
    renderTable();
  });

  // =========================================================================
  // AMBASSADOR LEADERBOARD RENDERING
  // =========================================================================
  function renderAmbassadorLeaderboard() {
    if (!ambassadorLeaderboardBody) return;
    ambassadorLeaderboardBody.innerHTML = '';

    const ambassadors = store.state.ambassadors.slice().sort((a, b) => b.referrals - a.referrals);

    ambassadors.forEach((rep, idx) => {
      const pct = Math.min(100, Math.round((rep.referrals / rep.target) * 100));
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-50/80 transition-colors';

      tr.innerHTML = `
        <td class="py-3.5 px-4">
          <div class="flex items-center gap-3">
            <span class="w-5 text-center font-display font-bold ${idx < 3 ? 'text-brand-600' : 'text-slate-400'}">#${idx + 1}</span>
            <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
              ${rep.avatar}
            </div>
            <div>
              <span class="font-bold text-navy-900 block">${rep.name}</span>
              <span class="text-slate-500 text-[11px]">${rep.email}</span>
            </div>
          </div>
        </td>
        <td class="py-3.5 px-4 font-semibold text-navy-900">${rep.college}</td>
        <td class="py-3.5 px-4 whitespace-nowrap">
          <code class="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] font-semibold text-slate-700">${rep.code}</code>
        </td>
        <td class="py-3.5 px-4 whitespace-nowrap">
          <span class="text-sm font-extrabold text-navy-900 font-display">${rep.referrals}</span>
          <span class="text-slate-400 text-xs">/ ${rep.target}</span>
        </td>
        <td class="py-3.5 px-4">
          <div class="w-28">
            <div class="flex items-center justify-between text-[11px] mb-1">
              <span class="font-semibold text-brand-600">${pct}%</span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div class="h-full bg-brand-600 rounded-full" style="width: ${pct}%;"></div>
            </div>
          </div>
        </td>
        <td class="py-3.5 px-4 font-semibold text-emerald-600 whitespace-nowrap">${rep.conversionRate}</td>
        <td class="py-3.5 px-4 font-bold text-navy-900 whitespace-nowrap">₹${rep.incentiveEarned.toLocaleString()}</td>
        <td class="py-3.5 px-4 whitespace-nowrap">
          <div class="flex items-center gap-1.5 flex-wrap">
            <button class="copy-rep-code-btn px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors" data-code="${rep.code}">
              Copy Link
            </button>
            <button class="wa-share-btn px-2.5 py-1 rounded bg-teal-500 hover:bg-teal-600 text-white font-semibold text-[11px] transition-colors" data-code="${rep.code}" data-name="${rep.name}">
              WhatsApp
            </button>
          </div>
        </td>
      `;

      ambassadorLeaderboardBody.appendChild(tr);
    });

    // Attach copy actions
    document.querySelectorAll('.copy-rep-code-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-code');
        const origin = (typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null')
          ? window.location.origin
          : 'https://campusai-growth-engine.onrender.com';
        const url = `${origin}/?screen=registration&ref=${code}`;
        navigator.clipboard.writeText(url).then(() => {
          showToast(`Copied referral link for ${code}`);
        });
      });
    });

    // Attach WhatsApp share actions
    document.querySelectorAll('.wa-share-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-code');
        const name = btn.getAttribute('data-name');
        const origin = (typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null')
          ? window.location.origin
          : 'https://campusai-growth-engine.onrender.com';
        const url = `${origin}/?screen=registration&ref=${code}`;
        const text = `🚀 Hey! I'm sharing a free registration link for the NxtWave workshop: "Build Your First AI Project in 60 Minutes".\n\nUse my referral code ${code} to register free:\n${url}\n\nSeats are limited — register now! ⚡`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      });
    });
  }

  // =========================================================================
  // ANALYTICS & DASHBOARD SYNC
  // =========================================================================
  function syncDashboard(snapshot) {
    if (kpiTotalRegistrations) kpiTotalRegistrations.textContent = snapshot.totalRegistrations;
    if (bannerCurrentRegistrations) bannerCurrentRegistrations.textContent = snapshot.totalRegistrations;
    if (bannerPacingPercent) bannerPacingPercent.textContent = `${snapshot.percentCompleted}%`;
    if (bannerBudgetRemaining) bannerBudgetRemaining.textContent = snapshot.budgetRemaining;

    if (kpiRegistrationPercent) kpiRegistrationPercent.textContent = `${snapshot.percentCompleted}% Completed`;
    if (kpiRegistrationRemaining) kpiRegistrationRemaining.textContent = `${snapshot.remainingRunway} remaining`;
    if (kpiProgressBar) kpiProgressBar.style.width = `${Math.min(100, snapshot.percentCompleted)}%`;

    if (kpiReferralRegistrations) kpiReferralRegistrations.textContent = snapshot.totalReferrals;
    if (kpiReferralShareBadge) kpiReferralShareBadge.textContent = `${snapshot.referralSharePercent}% Share`;

    if (kpiCACValue) kpiCACValue.textContent = `₹${snapshot.cac.toFixed(2)}`;
    if (kpiExpenditureValue) kpiExpenditureValue.textContent = `₹${snapshot.totalExpenditure.toLocaleString()}`;
    if (kpiExpenditureRemaining) kpiExpenditureRemaining.textContent = `₹${snapshot.budgetRemaining.toLocaleString()} remaining (${(100 - snapshot.budgetSpentPercent).toFixed(0)}%)`;
    if (kpiExpenditureProgressBar) kpiExpenditureProgressBar.style.width = `${snapshot.budgetSpentPercent}%`;
    if (funnelCompletedCount) funnelCompletedCount.textContent = snapshot.totalRegistrations;
    if (statRecordedVolume) statRecordedVolume.textContent = `${snapshot.totalRegistrations} Students`;

    if (chanAmbassadorCount) chanAmbassadorCount.textContent = snapshot.channels.ambassadors.count;
    if (chanAmbassadorAchieved) chanAmbassadorAchieved.textContent = `(${snapshot.channels.ambassadors.pct}% achieved)`;
    if (chanAmbassadorBar) chanAmbassadorBar.style.width = `${snapshot.channels.ambassadors.pct}%`;

    if (chanCommunityCount) chanCommunityCount.textContent = snapshot.channels.communities.count;
    if (chanClubCount) chanClubCount.textContent = snapshot.channels.clubs.count;

    if (recordCountBadge) recordCountBadge.textContent = `${snapshot.totalRegistrations} Total`;
    if (regFormSeatsRemaining) regFormSeatsRemaining.textContent = snapshot.remainingRunway;

    if (ambTotalReferrals) ambTotalReferrals.textContent = snapshot.totalReferrals;
    const totalPayout = store.state.ambassadors.reduce((acc, a) => acc + a.incentiveEarned, 0);
    if (ambTotalPayouts) ambTotalPayouts.textContent = `₹${totalPayout.toLocaleString()}`;

    renderTable();
    renderAmbassadorLeaderboard();
  }

  // Subscribe to store updates
  store.subscribe(syncDashboard);

  // Initial render
  const initialSnapshot = store.getAnalyticsSnapshot();
  syncDashboard(initialSnapshot);
  updateGeneratedReferralLink();

  // Background sync with API server if available
  async function syncWithServer() {
    try {
      const res = await fetch('/api/registrations');
      if (res.ok) {
        const serverRecords = await res.json();
        const serverLive = serverRecords.filter(r => r.isLiveUser);
        let updated = false;
        serverLive.forEach(sRec => {
          const alreadyExists = store.state.liveRegistrations.some(
            r => r.email.toLowerCase() === sRec.email.toLowerCase()
          );
          if (!alreadyExists) {
            store.state.liveRegistrations.unshift(sRec);
            updated = true;
          }
        });
        if (updated) {
          store.saveState();
        }
      }
    } catch (_) {
      // Standalone mode without backend server
    }
  }
  syncWithServer();

  // =========================================================================
  // URL PARAMS & INITIAL ROUTE HANDLING
  // =========================================================================
  function handleUrlParams() {
    const url = new URL(window.location.href);
    const screenParam = url.searchParams.get('screen') || window.location.hash.replace('#', '') || 'overview';
    const refParam = url.searchParams.get('ref');

    if (refParam && referralCodeInput) {
      referralCodeInput.value = refParam.toUpperCase();
      checkReferralCode(refParam);
    }

    if (screenParam) {
      switchScreen(screenParam, false);
    }
  }

  handleUrlParams();
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) switchScreen(hash, false);
  });
});
