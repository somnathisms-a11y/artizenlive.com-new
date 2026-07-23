// ArtizenLive - Core Script & Interactivity

// Theme Switcher (Dark & Pure White Light Mode Support)
function initTheme() {
  const savedTheme = localStorage.getItem('artizen_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButtonUI(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('artizen_theme', newTheme);
  updateThemeButtonUI(newTheme);
}

function updateThemeButtonUI(theme) {
  const btn = document.getElementById('themeToggleBtn');
  const drawerBtn = document.getElementById('drawerThemeToggleBtn');

  const isLight = theme === 'light';

  const moonSVG = `<svg class="theme-svg-icon moon-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" fill-opacity="0.2"/><circle cx="18" cy="5" r="0.8" fill="currentColor"/></svg>`;

  const sunSVG = `<svg class="theme-svg-icon sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5" fill="currentColor" fill-opacity="0.2"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

  const icon = isLight ? moonSVG : sunSVG;
  const labelText = isLight ? 'Dark Mode' : 'Light Mode';

  const updateBtn = (el) => {
    if (!el) return;
    el.innerHTML = `<span class="theme-icon">${icon}</span> <span class="theme-label">${labelText}</span>`;
    el.classList.add('theme-spin');
    setTimeout(() => el.classList.remove('theme-spin'), 500);
  };

  updateBtn(btn);
  updateBtn(drawerBtn);
}

// Mobile Drawer Navigation
const menuToggle = document.getElementById('menuToggle');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerClose = document.getElementById('drawerClose');
const drawerOverlay = document.getElementById('drawerOverlay');

function openDrawer() {
  if (mobileDrawer) {
    mobileDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeDrawer() {
  if (mobileDrawer) {
    mobileDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (menuToggle) menuToggle.addEventListener('click', openDrawer);
if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

document.querySelectorAll('.drawer-links a').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

// Scroll Reveal Observer
const revealElements = document.querySelectorAll('.reveal');
const observerOptions = { threshold: 0.12 };

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

revealElements.forEach(el => revealObserver.observe(el));

// Live Video Stream Toggle Controls
function toggleStreamPlayback() {
  const video = document.getElementById('liveStreamVideo');
  const btn = document.getElementById('streamPlayBtn');

  if (video) {
    if (video.paused) {
      video.play();
      if (btn) btn.textContent = '⏸';
    } else {
      video.pause();
      if (btn) btn.textContent = '▶';
    }
  }
}

// Artist Filtering Logic
function filterArtists(category) {
  const cards = document.querySelectorAll('.artist-card');
  const pills = document.querySelectorAll('.pill');
  const filterIndicator = document.getElementById('filterStatus');
  const filterText = document.getElementById('filterText');

  pills.forEach(pill => {
    if (pill.textContent.trim().toLowerCase() === category.toLowerCase()) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  let visibleCount = 0;
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'All' || cardCat.toLowerCase() === category.toLowerCase()) {
      card.style.display = 'block';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  if (category !== 'All') {
    if (filterIndicator) filterIndicator.style.display = 'flex';
    if (filterText) filterText.textContent = `${category} (${visibleCount} talent found)`;
  } else {
    if (filterIndicator) filterIndicator.style.display = 'none';
  }
}

function handleHeroSearch(event) {
  event.preventDefault();
  const cat = document.getElementById('searchCategory').value;
  const loc = document.getElementById('searchLocation').value;

  const cards = document.querySelectorAll('.artist-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    const cardLoc = card.getAttribute('data-location');

    const matchCat = (cat === 'All' || cardCat.toLowerCase().includes(cat.toLowerCase()));
    const matchLoc = (loc === 'All' || cardLoc.toLowerCase().includes(loc.toLowerCase()));

    if (matchCat && matchLoc) {
      card.style.display = 'block';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const filterIndicator = document.getElementById('filterStatus');
  const filterText = document.getElementById('filterText');

  if (filterIndicator) filterIndicator.style.display = 'flex';
  if (filterText) filterText.textContent = `Category: ${cat}, Location: ${loc} (${visibleCount} found)`;

  const artistsSection = document.getElementById('artists');
  if (artistsSection) {
    artistsSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Booking Modal Logic
let currentSelectedPrice = 25000;

function openBookingModal(artistName, artistRole, location, price) {
  const modal = document.getElementById('bookingModal');
  const nameEl = document.getElementById('modalArtistName');
  const roleEl = document.getElementById('modalArtistRole');
  const basePriceEl = document.getElementById('pbBasePrice');
  const totalPriceEl = document.getElementById('pbTotalPrice');

  currentSelectedPrice = price;

  if (nameEl) nameEl.textContent = `Book ${artistName}`;
  if (roleEl) roleEl.textContent = `${artistRole} • ${location}`;
  if (basePriceEl) basePriceEl.textContent = `₹${price.toLocaleString('en-IN')}`;
  if (totalPriceEl) totalPriceEl.textContent = `₹${price.toLocaleString('en-IN')}`;

  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 14);
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    dateInput.value = defaultDate.toISOString().split('T')[0];
  }

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function submitBooking(event) {
  event.preventDefault();
  const date = document.getElementById('bookDate').value;
  const eventType = document.getElementById('bookEventType').value;
  const clientName = document.getElementById('bookClientName').value;
  const clientPhone = document.getElementById('bookClientPhone').value;
  const artistName = document.getElementById('modalArtistName').textContent;

  alert(`🎉 Escrow Booking Request Submitted!\n\nThank you, ${clientName}! Your booking request for ${artistName} on ${date} (${eventType}) is locked.\n\nOur event concierge will contact you at ${clientPhone} within 2 hours to confirm artist tech riders & release your escrow contract details.`);

  closeBookingModal();
}

// Audio/Media Demo Player Modal
let isDemoPlaying = true;

function playAudioSample(artistName, trackTitle) {
  const modal = document.getElementById('demoModal');
  const nameEl = document.getElementById('demoArtistName');
  const trackEl = document.getElementById('demoTrackTitle');

  if (nameEl) nameEl.textContent = artistName;
  if (trackEl) trackEl.textContent = trackTitle;

  isDemoPlaying = true;
  const playBtn = document.getElementById('demoPlayBtn');
  if (playBtn) playBtn.textContent = 'Pause Sample ⏸';

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeDemoModal() {
  const modal = document.getElementById('demoModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function toggleDemoPlayback() {
  const playBtn = document.getElementById('demoPlayBtn');
  const visualizer = document.querySelector('.audio-visualizer');

  if (isDemoPlaying) {
    isDemoPlaying = false;
    if (playBtn) playBtn.textContent = 'Play Sample ▶';
    if (visualizer) {
      visualizer.querySelectorAll('.bar').forEach(bar => bar.style.animationPlayState = 'paused');
    }
  } else {
    isDemoPlaying = true;
    if (playBtn) playBtn.textContent = 'Pause Sample ⏸';
    if (visualizer) {
      visualizer.querySelectorAll('.bar').forEach(bar => bar.style.animationPlayState = 'running');
    }
  }
}

// Policies Modal & Tabs System
const policiesText = {
  privacy: `
    <h4>🔒 Privacy Policy</h4>
    <p>ArtizenLive prioritizes user data protection and privacy compliance across all booking operations.</p>
    <ul style="padding-left:20px; line-height:1.7;">
      <li><strong>Data Encryption:</strong> All personal data, contact details, and payment transactions are secured using 256-bit SSL encryption.</li>
      <li><strong>No Third-Party Sharing:</strong> Your contact numbers and email addresses are shared only with the booked artist after escrow lock confirmation.</li>
      <li><strong>Consent Management:</strong> Users may request account data deletion or communication opt-out at any time by emailing concierge@artizenlive.com.</li>
    </ul>
  `,
  escrow: `
    <h4>🛡️ Escrow Payment Protection Guarantee</h4>
    <p>ArtizenLive operates a zero-risk escrow payment engine for live performance security.</p>
    <ul style="padding-left:20px; line-height:1.7;">
      <li><strong>Payment Lock:</strong> Upon booking, client funds are safely locked in an audited escrow account.</li>
      <li><strong>Performance Verification:</strong> Escrow funds are released to the artist only after successful completion of the live performance event.</li>
      <li><strong>Dispute Concierge:</strong> In the rare case of sound issues or artist no-show, our 24/7 concierge cell manages instant resolution and emergency replacement dispatch.</li>
    </ul>
  `,
  refund: `
    <h4>↺ Refund & Cancellation Policy</h4>
    <p>Flexible cancellation terms safeguard both event hosts and performing artists.</p>
    <ul style="padding-left:20px; line-height:1.7;">
      <li><strong>Cancellation > 14 Days Before Event:</strong> 100% full escrow refund issued to the host.</li>
      <li><strong>Cancellation 7–14 Days Before Event:</strong> 80% refund issued (20% retained as artist calendar reservation deposit).</li>
      <li><strong>Cancellation < 7 Days Before Event:</strong> 50% refund issued to host.</li>
      <li><strong>Artist Unavailability:</strong> 100% immediate full refund or free replacement artist dispatch.</li>
    </ul>
  `,
  terms: `
    <h4>📄 Terms & Conditions of Service</h4>
    <p>By using ArtizenLive platform services, clients and artists agree to standard live event terms:</p>
    <ul style="padding-left:20px; line-height:1.7;">
      <li><strong>Technical Sound Rider:</strong> Hosts must provide agreed stage sound, power points, and monitor equipment specified in the artist rider.</li>
      <li><strong>Venue Clearance:</strong> Hosts are responsible for acquiring necessary local authority permissions, sound permits, and venue access passes.</li>
      <li><strong>Code of Conduct:</strong> Respectful, safe, and professional behavior is enforced for all event proceedings.</li>
    </ul>
  `
};

function openPolicyModal(type = 'privacy') {
  const modal = document.getElementById('policyModal');
  switchPolicyTab(type);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closePolicyModal() {
  const modal = document.getElementById('policyModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function switchPolicyTab(type) {
  const box = document.getElementById('policyContentBox');
  const tabs = document.querySelectorAll('.policy-tab');

  tabs.forEach(tab => {
    if (tab.id === `tab-${type}`) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  if (box && policiesText[type]) {
    box.innerHTML = policiesText[type];
  }
}

// Editorial Blog Reader Modal Data & Handlers
const blogArticles = {
  'wedding-singer': {
    tag: 'Event Tips',
    date: 'May 12, 2026',
    readTime: '5 min read',
    author: 'Aanya Sharma',
    role: 'Senior Event Producer',
    authorImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    title: 'How To Book The Perfect Wedding Singer for Your Special Day',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
    content: `
      <p class="lead-p">Live music elevates a wedding from a mere gathering to an unforgettable emotional experience. Whether you want acoustic melodies during your pheras or a high-energy Sufi-Bollywood performance at your sangeet, choosing the right vocalist is crucial.</p>
      <h3>1. Determine Your Performance Requirements</h3>
      <p>Start by mapping out the timeline of your event. Acoustic soloists excel at intimate cocktail dinners, whereas full Sufi fusion bands need a stage setup with monitor speakers and sound checks at least 3 hours prior to guest arrival.</p>
      <blockquote>"Sound quality and rider compliance make or break a live vocal performance. Always ensure your venue manager coordinates directly with the artist's sound engineer."</blockquote>
      <h3>2. Review Live Audio Demos & Unedited Clips</h3>
      <p>Studio-recorded tracks can be auto-tuned. Always request unedited live event clips or listen to demo samples provided directly on verified artist platforms like ArtizenLive to gauge real vocal tone, energy, and crowd interaction skills.</p>
      <h3>3. Secure Your Booking with Escrow Protection</h3>
      <p>Never transfer 100% upfront fees directly without a binding contract. With ArtizenLive's escrow system, your payment is held safely until the artist arrives and completes their performance smoothly.</p>
    `,
    categoryFilter: 'Singers',
    ctaText: 'Book A Verified Singer Now'
  },
  'right-dj': {
    tag: 'Music Guide',
    date: 'May 10, 2026',
    readTime: '4 min read',
    author: 'Rohan Mehta',
    role: 'Nightlife & Festival Curator',
    authorImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    title: 'Choosing The Right DJ For Your Party: A Complete Guide',
    image: 'images/dj_edm_producer.png',
    content: `
      <p class="lead-p">The DJ controls the pulse of your celebration. From reading the crowd’s energy to mixing seamless transitions across Punjabi beats, Commercial EDM, and Retro classics, an expert DJ keeps your dance floor packed all night long.</p>
      <h3>1. Match the DJ Genre to Your Guest Demographic</h3>
      <p>A corporate gala or anniversary dinner calls for lounge house and classic retro, while a Sangeet after-party demands high-octane Bollywood remixes and Punjabi trap tracks. Communicate your preferred setlist preferences early.</p>
      <h3>2. Check Technical Stage & Console Requirements</h3>
      <p>Top commercial DJs require industry-standard console equipment (e.g., Pioneer CDJ setups) alongside powered subwoofer speakers. Confirm whether your booking package includes full sound system rental or console-only performance.</p>
      <h3>3. Protect Your Booking Timeline</h3>
      <p>Popular wedding and festival DJs get booked 4 to 6 months in advance during peak season. Lock in your dates with verified contracts and transparent pricing via ArtizenLive.</p>
    `,
    categoryFilter: 'DJs',
    ctaText: 'Explore Verified DJs'
  },
  'trends-2026': {
    tag: 'Industry News',
    date: 'May 8, 2026',
    readTime: '6 min read',
    author: 'Priya Mukherjee',
    role: 'Editorial Director',
    authorImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    title: 'Top Event Entertainment Trends Shaping 2026',
    image: 'images/rock_fusion_band.png',
    content: `
      <p class="lead-p">2026 is seeing a revolution in live entertainment across India. Hosts are shifting away from generic playback tracks in favor of immersive live band fusion sets, interactive emcee segments, and personalized artist performances.</p>
      <h3>1. Sufi Rock & Indo-Western Fusion Bands</h3>
      <p>Blending electric guitars and western drum grooves with classical sarangi, sitar, and Sufi vocals has become the #1 most requested performance format for destination weddings in Goa, Udaipur, and Jaipur.</p>
      <h3>2. Interactive Content Creator & Photobooth Collaborations</h3>
      <p>Events are becoming digital spectacles. Booking live lifestyle content creators to capture high-definition reels and candid moments in real-time gives guests instant shareable memories.</p>
      <h3>3. Transparent Escrow & Direct Sound Rider Audits</h3>
      <p>Organizers prioritize financial transparency. Direct escrow bookings ensure zero hidden agency markups and guaranteed artist attendance.</p>
    `,
    categoryFilter: 'Bands',
    ctaText: 'Browse Trending Bands'
  },
  'gala-success': {
    tag: 'Success Story',
    date: 'May 5, 2026',
    readTime: '4 min read',
    author: 'Vikram Sengupta',
    role: 'Corporate Relations Head',
    authorImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    title: 'How ArtizenLive Made My Annual Corporate Gala Memorable',
    image: 'images/emcee_comedian.png',
    content: `
      <p class="lead-p">Organizing an annual corporate gala for 800+ executive attendees requires precision, punctual scheduling, and high-impact entertainment that engages diverse age groups seamlessly.</p>
      <h3>The Challenge</h3>
      <p>Our company needed an energetic celebrity host emcee, a smooth jazz ensemble during dinner, and a top-rated DJ for the awards ceremony after-party—all within a strict corporate procurement budget.</p>
      <h3>The Solution</h3>
      <p>Using ArtizenLive, we filtered background-checked performers by city, audited verified performance clips, and issued a single escrow payment. Communication with artist managers was direct and hassle-free.</p>
      <h3>The Outcome</h3>
      <p>The event received a 98% satisfaction score from executives, and final escrow funds were released immediately following the successful show.</p>
    `,
    categoryFilter: 'Anchors',
    ctaText: 'Book Corporate Talent'
  }
};

function openBlogModal(keyOrTitle) {
  const modal = document.getElementById('blogModal');
  if (!modal) return;

  // Find matching article data or fallback
  let article = blogArticles[keyOrTitle];
  if (!article) {
    // Search by title match if key is title string
    const matchKey = Object.keys(blogArticles).find(k => blogArticles[k].title.toLowerCase() === (keyOrTitle || '').toLowerCase());
    article = matchKey ? blogArticles[matchKey] : blogArticles['wedding-singer'];
  }

  // Populate modal fields
  const tagEl = document.getElementById('blogModalTag');
  const titleEl = document.getElementById('blogModalTitle');
  const dateEl = document.getElementById('blogModalDate');
  const authorImgEl = document.getElementById('blogModalAuthorImg');
  const authorNameEl = document.getElementById('blogModalAuthorName');
  const authorRoleEl = document.getElementById('blogModalAuthorRole');
  const coverImgEl = document.getElementById('blogModalCover');
  const contentEl = document.getElementById('blogModalContent');
  const ctaBtn = document.getElementById('blogModalCtaBtn');

  if (tagEl) tagEl.textContent = article.tag;
  if (titleEl) titleEl.textContent = article.title;
  if (dateEl) dateEl.textContent = `${article.date} · ${article.readTime}`;
  if (authorImgEl) authorImgEl.src = article.authorImg;
  if (authorNameEl) authorNameEl.textContent = article.author;
  if (authorRoleEl) authorRoleEl.textContent = article.role;
  if (coverImgEl) {
    coverImgEl.src = article.image;
    coverImgEl.alt = article.title;
  }
  if (contentEl) contentEl.innerHTML = article.content;

  if (ctaBtn) {
    ctaBtn.textContent = article.ctaText || 'Book Related Artist Now';
    ctaBtn.onclick = () => {
      closeBlogModal();
      filterArtists(article.categoryFilter || 'All');
      const artistsSec = document.getElementById('artists');
      if (artistsSec) artistsSec.scrollIntoView({ behavior: 'smooth' });
    };
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeBlogModal() {
  const modal = document.getElementById('blogModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Auth Modal Controls
const openAuthModalBtn = document.getElementById('openAuthModal');
const authModal = document.getElementById('authModal');

function openAuthModal() {
  if (authModal) {
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAuthModal() {
  if (authModal) {
    authModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (openAuthModalBtn) openAuthModalBtn.addEventListener('click', openAuthModal);

function handleAuthSubmit(event) {
  event.preventDefault();
  alert('Welcome back to ArtizenLive! Your account session is active.');
  closeAuthModal();
}

// WhatsApp Contact Dispatcher
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contactName').value;
  const phone = document.getElementById('contactPhone').value;
  const email = document.getElementById('contactEmail').value;
  const subject = document.getElementById('contactSubject').value;
  const message = document.getElementById('contactMessage').value;

  const waText = encodeURIComponent(`Hello ArtizenLive Concierge,\n\nName: ${name}\nWhatsApp: ${phone}\nEmail: ${email}\nQuery: ${subject}\nDetails: ${message}`);
  const waUrl = `https://wa.me/916293755369?text=${waText}`;

  window.open(waUrl, '_blank');
}

// Live Chat Message Sender
function sendChatMessage(btn) {
  const input = btn.previousElementSibling;
  const text = input.value.trim();
  if (!text) return;

  const feed = document.getElementById('liveChatMessages');
  if (!feed) return;

  // Remove typing indicator before adding new message
  const typingRow = feed.querySelector('.chat-typing-row');
  if (typingRow) typingRow.remove();

  // Build new message bubble
  const initials = ['Y', 'M', 'D', 'K', 'V'];
  const colors = [
    'linear-gradient(135deg, #3B82F6, #8B5CF6)',
    'linear-gradient(135deg, #10B981, #3B82F6)',
    'linear-gradient(135deg, #F59E0B, #EF4444)',
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const row = document.createElement('div');
  row.className = 'chat-bubble-row';
  row.innerHTML = `
    <div class="chat-avatar" style="background:${randomColor};">Y</div>
    <div class="chat-bubble-content">
      <div class="chat-bubble-meta">
        <span class="chat-name">You</span>
        <span class="chat-time">Just now</span>
      </div>
      <div class="chat-bubble-msg">${text}</div>
    </div>`;

  feed.appendChild(row);

  // Re-add typing indicator at bottom
  const typingNew = document.createElement('div');
  typingNew.className = 'chat-typing-row';
  typingNew.innerHTML = `
    <div class="chat-avatar" style="background:linear-gradient(135deg,#F59E0B,#EF4444);opacity:0.6;">K</div>
    <div class="chat-typing-indicator"><span></span><span></span><span></span></div>`;
  feed.appendChild(typingNew);

  // Scroll to bottom
  feed.scrollTop = feed.scrollHeight;

  input.value = '';
  input.focus();
}

// Paid VIP Masterclasses Data & Handlers
const paidGuides = {
  'wedding-budget-masterclass': {
    title: 'Destination Wedding Budgeting & Sound Rider Masterclass (2026 Edition)',
    category: 'VIP Masterclass',
    price: '₹499',
    rating: '4.9 ★ (182 buyers)',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
    description: 'The definitive handbook for planning high-end wedding entertainment. Includes 40-point technical rider audit checklist, cost negotiation scripts, and sound engineer requirements.',
    previewPoints: [
      '⚡ Complete sound & lighting rider specifications for beach & outdoor venues',
      '📄 Printable budget breakdown template (Excel + PDF format)',
      '🛡️ 15 Legal clause guarantees to include in artist contracts',
      '🎧 Direct contact protocol for sound engineers and stage directors'
    ],
    fullContent: `
      <div style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); border-radius:12px; padding:16px 20px; margin-bottom:20px; color:#D97706; font-weight:700; font-size:0.92rem;">
        ✅ VIP Access Granted! Full Masterclass & Printable Rider Kit Unlocked.
      </div>
      <h3>Masterclass Module 1: Stage Technical Rider Auditing</h3>
      <p>When hosting a destination wedding, improper venue audio setup is the #1 reason for acoustic feedback and performance delays. This guide provides exact wattage calculations for audiences from 100 to 1,500 guests.</p>
      
      <h3>Masterclass Module 2: Cost Negotiation & Escrow Timing</h3>
      <p>Learn how top event managers structure 50/50 escrow milestone payments to protect host capital while securing top-tier playback singers and celebrity DJs without paying exorbitant middleman agency surcharges.</p>

      <h3>Masterclass Module 3: Ready-to-Use Contract Clauses</h3>
      <p>Includes clause 4.2 (Overtime Fees), clause 6.1 (Force Majeure & Weather Cover), and clause 8.3 (Direct Soundcheck Audits).</p>
      
      <div style="margin-top:24px; padding:16px; background:var(--nav-hover-bg); border-radius:10px; font-weight:700; text-align:center;">
        📥 Download Masterclass Assets: <a href="#" onclick="alert('Downloading Destination_Wedding_Rider_Kit_2026.pdf...'); return false;" style="color:var(--violet-primary); text-decoration:underline;">Destination_Wedding_Rider_Kit_2026.pdf (4.2 MB)</a>
      </div>
    `
  },
  'escrow-contract-templates': {
    title: 'Artist Escrow Contract & Legal Template Kit',
    category: 'Legal & Procurement',
    price: '₹299',
    rating: '5.0 ★ (240 buyers)',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600',
    description: 'Official lawyer-drafted performer contract templates tailored for Indian event managers, brides, grooms, and corporate directors.',
    previewPoints: [
      '📄 4 Standard contracts: Live Singer, DJ/EDM, Dance Troupe & Emcee',
      '⚖️ Complete Escrow dispute resolution mechanism documentation',
      '🔒 Cancellation refund tier calculator (100% refund up to 14 days prior)',
      '🖊️ Fillable PDF & Word (.docx) formats included'
    ],
    fullContent: `
      <div style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); border-radius:12px; padding:16px 20px; margin-bottom:20px; color:#D97706; font-weight:700; font-size:0.92rem;">
        ✅ VIP Access Granted! Legal Contract Template Bundle Unlocked.
      </div>
      <h3>Module 1: The Standard Performer Service Agreement</h3>
      <p>Downloadable fillable template covering date, time, venue address, meal/hospitality rider specifications, and sound check clearance protocols.</p>

      <h3>Module 2: Escrow Disbursement Rules</h3>
      <p>Detailed step-by-step breakdown of ArtizenLive Escrow mechanisms: payment lock, performance arrival verification code, and instant 24-hour payout clearance.</p>

      <div style="margin-top:24px; padding:16px; background:var(--nav-hover-bg); border-radius:10px; font-weight:700; text-align:center;">
        📥 Download Legal Bundle: <a href="#" onclick="alert('Downloading Artist_Escrow_Contract_Templates.docx...'); return false;" style="color:var(--violet-primary); text-decoration:underline;">Artist_Escrow_Contract_Templates.docx (1.8 MB)</a>
      </div>
    `
  }
};

let activePaidGuideKey = null;

function openPaidGuideModal(guideKey) {
  const modal = document.getElementById('paidGuideModal');
  if (!modal) return;

  const guide = paidGuides[guideKey] || paidGuides['wedding-budget-masterclass'];
  activePaidGuideKey = guideKey;

  const titleEl = document.getElementById('paidGuideTitle');
  const priceEl = document.getElementById('paidGuidePrice');
  const previewEl = document.getElementById('paidGuidePreview');
  const checkoutSec = document.getElementById('paidCheckoutSection');
  const unlockedSec = document.getElementById('paidUnlockedSection');

  if (titleEl) titleEl.textContent = guide.title;
  if (priceEl) priceEl.textContent = guide.price;

  if (previewEl) {
    previewEl.innerHTML = `
      <p style="font-size:0.95rem; color:var(--text-body); margin-bottom:16px; line-height:1.6;">${guide.description}</p>
      <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:10px;">
        ${guide.previewPoints.map(pt => `<li style="font-size:0.9rem; font-weight:600; color:var(--text-bright); display:flex; align-items:center; gap:8px;">${pt}</li>`).join('')}
      </ul>
    `;
  }

  if (checkoutSec) checkoutSec.style.display = 'block';
  if (unlockedSec) {
    unlockedSec.style.display = 'none';
    unlockedSec.innerHTML = '';
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePaidGuideModal() {
  const modal = document.getElementById('paidGuideModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function handlePaidGuideCheckout(event) {
  event.preventDefault();
  const guide = paidGuides[activePaidGuideKey] || paidGuides['wedding-budget-masterclass'];

  const checkoutSec = document.getElementById('paidCheckoutSection');
  const unlockedSec = document.getElementById('paidUnlockedSection');

  if (checkoutSec) checkoutSec.style.display = 'none';
  if (unlockedSec) {
    unlockedSec.style.display = 'block';
    unlockedSec.innerHTML = guide.fullContent;
  }
}

// Blog Category & Search Filter
function filterBlogArticles(category, element) {
  const pills = document.querySelectorAll('.blog-filter-pill');
  pills.forEach(p => p.classList.remove('active'));
  if (element) element.classList.add('active');

  const cards = document.querySelectorAll('.blog-card');
  cards.forEach(card => {
    const cardCategory = card.getAttribute('data-category') || '';
    if (category === 'All' || cardCategory === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function searchBlogArticles(query) {
  const term = (query || '').toLowerCase().trim();
  const cards = document.querySelectorAll('.blog-card');

  cards.forEach(card => {
    const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
    const tag = card.querySelector('.blog-tag')?.textContent.toLowerCase() || '';

    if (!term || title.includes(term) || desc.includes(term) || tag.includes(term)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Initialize Theme on Page Load
document.addEventListener('DOMContentLoaded', initTheme);

