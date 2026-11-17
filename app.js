// =========================================
// MONSOON Cacao & Coffee - Interactive App
// Crafted via Tri-Tier Bonsai 9B Architecture
// =========================================

// --- PRECOMPUTED CONSTANTS ---
const POPUP_DATE = new Date('2026-11-24T10:00:00+05:30');
const CURRENCY = '₹';

// --- CURATED MENU ITEMS (INDIAN ORIGINS) ---
const menuItems = [
  {
    id: 1,
    name: 'Chikmagalur Arabica Pour-Over',
    category: 'coffee',
    price: 380,
    estate: 'Baba Budangiri, Karnataka',
    desc: 'Washed SLN-795 beans roasted light-medium with wild floral aroma, blueberry acidity, and sweet cane finish.'
  },
  {
    id: 2,
    name: 'Monsooned Malabar Cold Brew',
    category: 'coffee',
    price: 420,
    estate: 'Malabar Coast, Kerala',
    desc: 'Aged in monsoon winds for 16 weeks. Ultra-low acidity, intense earthy crema, and rich baker’s chocolate undertones.'
  },
  {
    id: 3,
    name: 'Coorg Peaberry Espresso',
    category: 'coffee',
    price: 320,
    estate: 'Madikeri, Coorg',
    desc: 'Dense rare peaberry beans extracted at 9 bars. Velvety mouthfeel with hints of roasted cardamom and dark caramel.'
  },
  {
    id: 4,
    name: 'Idukki 72% Single Estate Bar',
    category: 'chocolate',
    price: 490,
    estate: 'Idukki Hills, Kerala',
    desc: 'Fermented in wooden boxes, stone ground for 72 hours. Bright notes of tart cherry, raisin, and smoked oak wood.'
  },
  {
    id: 5,
    name: 'Anamalai Spiced Aztec Cacao',
    category: 'chocolate',
    price: 520,
    estate: 'Anamalai Foothills, Tamil Nadu',
    desc: 'Silky 68% stone-ground dark chocolate infused with native Tellicherry black pepper and wild nutmeg.'
  },
  {
    id: 6,
    name: 'The Monsoon Tasting Flight Pairing',
    category: 'pairings',
    price: 780,
    estate: 'Chikmagalur & Idukki Curated Duo',
    desc: 'A paired glass of nitro Monsooned Malabar paired alongside two single-origin chocolate disks.'
  }
];

// --- 1. STATE MANAGEMENT: TASTING FLIGHT BUILDER ---
const state = {
  items: [],
  maxFlightItems: 4
};

const getItemById = (id) => menuItems.find(item => item.id === id);

const addItemToFlight = (itemId) => {
  if (state.items.length >= state.maxFlightItems) {
    triggerToast(`Flight full (Max ${state.maxFlightItems} items)`);
    return;
  }

  const item = getItemById(itemId);
  if (!item) return;

  state.items.push(item);
  updateFlightUI();
  triggerToast(`Added ${item.name} to Flight`);
};

const removeItemFromFlight = (index) => {
  const removed = state.items.splice(index, 1)[0];
  updateFlightUI();
  if (removed) {
    triggerToast(`Removed ${removed.name}`);
  }
};

const updateFlightUI = () => {
  // Update badge on navbar button
  const badge = document.querySelector('.cta-btn .badge');
  if (badge) {
    badge.textContent = `${state.items.length} / ${state.maxFlightItems}`;
  }

  // Update Drawer items list
  const drawerItems = document.getElementById('drawer-items');
  if (drawerItems) {
    if (state.items.length === 0) {
      drawerItems.innerHTML = `<p style="color: var(--text-muted); text-align: center; margin-top: 2rem;">Your tasting flight is currently empty. Explore the menu and select your origin pairings.</p>`;
    } else {
      drawerItems.innerHTML = state.items.map((item, idx) => `
        <div class="drawer-item">
          <div class="drawer-item-info">
            <h4>${item.name}</h4>
            <span>${CURRENCY}${item.price} • ${item.estate}</span>
          </div>
          <button class="remove-btn" onclick="removeItemFromFlight(${idx})">✕</button>
        </div>
      `).join('');
    }
  }

  // Update total
  const total = state.items.reduce((sum, item) => sum + item.price, 0);
  const totalEl = document.querySelector('.drawer-total');
  if (totalEl) {
    totalEl.innerHTML = `<span>Total</span> <span>${CURRENCY}${total.toLocaleString()}</span>`;
  }
};

// --- 2. MENU RENDERER & CATEGORY FILTERING ---
const renderMenu = (filter = 'all') => {
  const container = document.querySelector('.menu-grid');
  if (!container) return;

  const filtered = filter === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === filter);

  container.innerHTML = filtered.map(item => `
    <div class="menu-item" data-category="${item.category}">
      <div>
        <div class="menu-header">
          <h4 class="item-name">${item.name}</h4>
          <span class="item-price">${CURRENCY}${item.price}</span>
        </div>
        <p class="item-desc">${item.desc}</p>
      </div>
      <div class="item-meta">
        <span class="badge">${item.estate}</span>
        <button class="add-flight-btn" onclick="addItemToFlight(${item.id})">+ Add to Flight</button>
      </div>
    </div>
  `).join('');
};

const setupFilters = () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');
      renderMenu(category);
    });
  });
};

// --- 3. OFF-CANVAS DRAWER TOGGLE ---
let isDrawerOpen = false;
let backdrop = null;

const createBackdrop = () => {
  backdrop = document.createElement('div');
  backdrop.className = 'drawer-backdrop';
  document.body.appendChild(backdrop);
  backdrop.addEventListener('click', closeDrawer);
};

const openDrawer = () => {
  const drawer = document.getElementById('flight-drawer');
  if (!drawer) return;
  drawer.classList.add('open');
  if (backdrop) backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
  isDrawerOpen = true;
};

const closeDrawer = () => {
  const drawer = document.getElementById('flight-drawer');
  if (!drawer) return;
  drawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
  document.body.style.overflow = '';
  isDrawerOpen = false;
};

const setupDrawerEvents = () => {
  createBackdrop();
  
  // Navbar button opens drawer
  const navFlightBtn = document.querySelector('.cta-btn');
  if (navFlightBtn) navFlightBtn.addEventListener('click', openDrawer);

  // Hero CTA scrolls or opens drawer
  const heroCta = document.querySelector('.hero-cta');
  if (heroCta) {
    heroCta.addEventListener('click', () => {
      const menuSection = document.getElementById('menu');
      if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Close button inside drawer
  const closeBtn = document.querySelector('.close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isDrawerOpen) {
      closeDrawer();
    }
  });

  // Checkout button simulation
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (state.items.length === 0) {
        triggerToast('Please select at least 1 pairing item');
        return;
      }
      triggerToast('Reserved! We will see you at the Bangalore Pop-up.');
      closeDrawer();
      state.items = [];
      updateFlightUI();
    });
  }
};

// --- 4. LIVE BANGALORE COUNTDOWN CLOCK ---
const setupCountdown = () => {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const container = document.getElementById('countdown');

  if (!container) return;

  // Enhance container HTML to structured cards
  container.innerHTML = `
    <div class="countdown-box"><span class="countdown-number" id="days">00</span><span class="countdown-label">Days</span></div>
    <div class="countdown-box"><span class="countdown-number" id="hours">00</span><span class="countdown-label">Hours</span></div>
    <div class="countdown-box"><span class="countdown-number" id="minutes">00</span><span class="countdown-label">Minutes</span></div>
    <div class="countdown-box"><span class="countdown-number" id="seconds">00</span><span class="countdown-label">Seconds</span></div>
  `;

  const tick = () => {
    const now = new Date();
    const diff = POPUP_DATE - now;

    if (diff <= 0) {
      container.innerHTML = `<span style="color: var(--accent-gold); font-size: 1.5rem; font-weight: 700;">POP-UP DOORS ARE OPEN NOW IN BANGALORE!</span>`;
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const dEl = document.getElementById('days');
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds');

    if (dEl) dEl.textContent = String(d).padStart(2, '0');
    if (hEl) hEl.textContent = String(h).padStart(2, '0');
    if (mEl) mEl.textContent = String(m).padStart(2, '0');
    if (sEl) sEl.textContent = String(s).padStart(2, '0');
  };

  tick();
  setInterval(tick, 1000);
};

// --- 5. AESTHETIC STEAM PARTICLE GENERATOR ---
const setupSteamParticles = () => {
  const container = document.querySelector('.steam-particles');
  if (!container) return;

  for (let i = 0; i < 7; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = 30 + Math.random() * 45;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 80 + 10}%`;
    particle.style.animationDelay = `${Math.random() * 2.5}s`;
    particle.style.animationDuration = `${2.8 + Math.random() * 1.5}s`;
    container.appendChild(particle);
  }
};

// --- 6. TOAST NOTIFICATIONS ---
const triggerToast = (message) => {
  const container = document.getElementById('toast');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 2600);
};

// Expose functions globally for inline HTML event handlers
window.addItemToFlight = addItemToFlight;
window.removeItemFromFlight = removeItemFromFlight;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  renderMenu('all');
  setupFilters();
  setupDrawerEvents();
  setupCountdown();
  setupSteamParticles();
  updateFlightUI();
});
