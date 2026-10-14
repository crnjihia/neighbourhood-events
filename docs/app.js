/**
 * Neighbourhood Events — Interactive Showcase & Live Simulation Engine
 * Hyperlocal Volunteer Finder for Nairobi
 */

(function () {
  'use strict';

  // --- Seed Nairobi Events Dataset ---
  const NAIROBI_EVENTS = [
    {
      id: 'event-1',
      title: 'Karura Forest Indigenous Tree Planting & Canopy Restoration',
      description:
        'Join community rangers to plant 1,200 indigenous seedlings (Warburgia & Croton) along Sigiria trail. Seedlings, spades, gloves, and mid-morning Kenyan chai provided by friends of Karura.',
      category: 'tree_planting',
      categoryLabel: 'Tree Planting',
      latitude: -1.2405,
      longitude: 36.8344,
      address: 'Sigiria Gate, Limuru Rd, Karura Forest, Nairobi',
      timeStr: 'Wed, 21 Oct • 09:00 AM',
      capacity: 120,
      rsvpCount: 68,
    },
    {
      id: 'event-2',
      title: 'Ngong Road Forest Green Belt Buffer Planting',
      description:
        'Community tree-planting initiative strengthening the ecological buffer zone around Jamhuri Park and Ngong Forest. Families and youth groups welcome.',
      category: 'tree_planting',
      categoryLabel: 'Tree Planting',
      latitude: -1.3056,
      longitude: 36.7583,
      address: 'Jamhuri Park Gate 2, Ngong Rd, Nairobi',
      timeStr: 'Sat, 24 Oct • 08:30 AM',
      capacity: 80,
      rsvpCount: 42,
    },
    {
      id: 'event-3',
      title: 'Nairobi Arboretum Rare Botanicals Nurturing Day',
      description:
        'Pruning, mulching, and planting endangered indigenous flora in the heart of Nairobi. Botanical guides will share tree identification tips.',
      category: 'tree_planting',
      categoryLabel: 'Tree Planting',
      latitude: -1.2758,
      longitude: 36.8042,
      address: 'Nairobi Arboretum, State House Rd, Kilimani',
      timeStr: 'Sun, 25 Oct • 10:00 AM',
      capacity: 60,
      rsvpCount: 29,
    },
    {
      id: 'event-4',
      title: 'Nairobi River Plastic Interception & Michuki Park Cleanup',
      description:
        'Community waste collection, sorting, and microplastic removal along the Michuki Memorial Park riverbanks. Collected recyclables are handed over to local youth recycling cooperatives.',
      category: 'cleanup',
      categoryLabel: 'Cleanup',
      latitude: -1.2789,
      longitude: 36.8193,
      address: 'Michuki Memorial Park, Kipande Rd, Nairobi',
      timeStr: 'Thu, 22 Oct • 08:00 AM',
      capacity: 90,
      rsvpCount: 54,
    },
    {
      id: 'event-5',
      title: 'Mathare Riverbank Community Cleanup & Tree Nursery Care',
      description:
        'Hands-on neighbourhood initiative to clear debris from drainage channels and river pathways in Mathare 4A. Gumboots and protective gear provided.',
      category: 'cleanup',
      categoryLabel: 'Cleanup',
      latitude: -1.2612,
      longitude: 36.8587,
      address: 'Mathare 4A Community Center Bridge, Nairobi',
      timeStr: 'Sat, 24 Oct • 09:30 AM',
      capacity: 75,
      rsvpCount: 37,
    },
    {
      id: 'event-6',
      title: 'Nairobi Dam Riparian Zone Waste Interception Drive',
      description:
        'Volunteers unite to clean up perimeter plastic and restore indigenous reeds around the historic Nairobi Dam wetlands.',
      category: 'cleanup',
      categoryLabel: 'Cleanup',
      latitude: -1.3175,
      longitude: 36.8021,
      address: 'Nairobi Dam Waterfront, Langata / Highrise',
      timeStr: 'Sun, 25 Oct • 08:30 AM',
      capacity: 65,
      rsvpCount: 31,
    },
    {
      id: 'event-7',
      title: 'KNBTS National Blood Transfusion Drive Nairobi CBD',
      description:
        'Help save lives across regional hospitals. Certified medical personnel will administer donations. Donor health check, fruit snacks, and recognition certificate provided.',
      category: 'blood_donation',
      categoryLabel: 'Blood Donation',
      latitude: -1.2854,
      longitude: 36.8238,
      address: 'Kencom Plaza Concourse, City Hall Way, Nairobi CBD',
      timeStr: 'Today • 10:00 AM - 04:00 PM',
      capacity: 200,
      rsvpCount: 94,
    },
    {
      id: 'event-8',
      title: 'Kenyatta National Hospital Emergency Blood Drive',
      description:
        'Urgent call for O-negative, A-positive, and universal donors to replenish KNH trauma center blood supplies. Rapid registration on site.',
      category: 'blood_donation',
      categoryLabel: 'Blood Donation',
      latitude: -1.3006,
      longitude: 36.8072,
      address: 'KNH Blood Bank Wing, Hospital Rd, Upper Hill',
      timeStr: 'Fri, 23 Oct • 09:00 AM',
      capacity: 150,
      rsvpCount: 81,
    },
    {
      id: 'event-9',
      title: 'Sarit Centre Community Blood Giving Camp',
      description:
        'Convenient weekend blood donation camp in Westlands in partnership with the Kenya Red Cross Society. Clean, hygienic, and air-conditioned venue.',
      category: 'blood_donation',
      categoryLabel: 'Blood Donation',
      latitude: -1.2608,
      longitude: 36.8037,
      address: 'Sarit Expo Ground Floor, Karuna Rd, Westlands',
      timeStr: 'Sat, 24 Oct • 10:00 AM',
      capacity: 100,
      rsvpCount: 46,
    },
    {
      id: 'event-10',
      title: 'Kilimani Neighbourhood Sustainability & Composting Workshop',
      description:
        'Meet your neighbours to learn balcony composting, zero-waste grocery buying, and organic balcony vegetable gardening. Tea and samosas provided.',
      category: 'meetup',
      categoryLabel: 'Meetup',
      latitude: -1.2941,
      longitude: 36.7877,
      address: 'Kilimani Community Library, Argwings Kodhek Rd',
      timeStr: 'Thu, 22 Oct • 05:30 PM',
      capacity: 45,
      rsvpCount: 33,
    },
    {
      id: 'event-11',
      title: 'Parklands Green Commute & Cycling Safety Meetup',
      description:
        'Neighbourhood breakfast gathering discussing safe urban cycling routes, road-sharing awareness, and upcoming group cycling Sunday rides.',
      category: 'meetup',
      categoryLabel: 'Meetup',
      latitude: -1.2639,
      longitude: 36.8197,
      address: 'Diamond Plaza 2 Courtyard, Masari Rd, Parklands',
      timeStr: 'Sat, 24 Oct • 07:30 AM',
      capacity: 50,
      rsvpCount: 28,
    },
    {
      id: 'event-12',
      title: 'Lavington Zero-Waste Swap & Community Skillshare',
      description:
        'Bring pre-loved books, household tools, clothes, and indoor plants to swap! Includes a DIY solar lamp demonstration and kids eco-craft station.',
      category: 'meetup',
      categoryLabel: 'Meetup',
      latitude: -1.2778,
      longitude: 36.7694,
      address: 'Lavington Green Gardens, James Gichuru Rd',
      timeStr: 'Sun, 25 Oct • 02:00 PM',
      capacity: 80,
      rsvpCount: 52,
    },
  ];

  // --- Nairobi Reference Anchor Locations ---
  const ANCHOR_LOCATIONS = {
    cbd: { name: 'Nairobi CBD (Kencom)', lat: -1.2854, lon: 36.8238 },
    westlands: { name: 'Westlands (Sarit Centre)', lat: -1.2608, lon: 36.8037 },
    kilimani: { name: 'Kilimani (Yaya Centre)', lat: -1.2941, lon: 36.7877 },
    karen: { name: 'Karen (The Hub)', lat: -1.3197, lon: 36.7067 },
    upperhill: { name: 'Upper Hill (KNH Area)', lat: -1.3006, lon: 36.8072 },
  };

  // --- Haversine Distance Formula ---
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = n => (n * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // --- Application State ---
  const state = {
    userLocKey: 'cbd',
    userLocation: ANCHOR_LOCATIONS.cbd,
    activeRadiusKm: 10, // 5, 10, 20, or null (all)
    selectedCategories: new Set(['tree_planting', 'cleanup', 'blood_donation', 'meetup']),
    searchQuery: '',
    rsvps: JSON.parse(localStorage.getItem('nbi_rsvps') || '{}'),
    isOnline: true,
    syncLog: [],
  };

  // --- DOM Elements ---
  const searchInput = document.getElementById('simSearchInput');
  const radiusButtons = document.querySelectorAll('.radius-btn');
  const categoryChips = document.querySelectorAll('.category-chip');
  const eventsListEl = document.getElementById('simEventsList');
  const eventsCountEl = document.getElementById('simEventsCount');
  const locationRadios = document.querySelectorAll('input[name="simLocation"]');
  const onlineToggle = document.getElementById('simOnlineToggle');
  const connectionPill = document.getElementById('simConnectionPill');
  const syncConsoleEl = document.getElementById('simSyncConsole');
  const forceSyncBtn = document.getElementById('simForceSyncBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const protocolTabs = document.querySelectorAll('.protocol-tab-btn');
  const protocolCodeBlock = document.getElementById('protocolCodeBlock');

  // --- Protocol Payloads ---
  const PROTOCOL_EXAMPLES = {
    pull: `// GET /sync/pull?lastPulledAt=1697280000000
// Express Backend -> WatermelonDB Client
{
  "changes": {
    "events": {
      "created": [
        {
          "id": "evt_karura_99",
          "title": "Karura Indigenous Tree Planting",
          "category": "tree_planting",
          "latitude": -1.2405,
          "longitude": 36.8344,
          "address": "Sigiria Gate, Limuru Rd",
          "capacity": 120,
          "rsvpCount": 69,
          "startsAt": 1697878800000
        }
      ],
      "updated": [],
      "deleted": []
    },
    "rsvps": {
      "created": [{ "id": "rsvp_usr_01", "eventId": "evt_karura_99", "status": "confirmed" }],
      "updated": [],
      "deleted": []
    }
  },
  "timestamp": 1697281452000
}`,
    push: `// POST /sync/push?lastPulledAt=1697280000000
// WatermelonDB Offline Mutation Queue -> Express Sync Router
{
  "changes": {
    "rsvps": {
      "created": [
        {
          "id": "rsvp_local_4a81",
          "event_id": "event-1",
          "user_id": "usr_kenya_254",
          "status": "confirmed",
          "created_at": 1697281200000
        }
      ],
      "updated": [],
      "deleted": []
    }
  }
}
// Response: 200 OK -> WatermelonDB marks records as synced (clean)`,
    push_notifications: `// POST /notifications/fanout (Expo Push Notification Gateway)
{
  "to": ["ExponentPushToken[xxxxxxxxxxxx]"],
  "sound": "default",
  "title": "🌱 Karura Tree Planting Tomorrow!",
  "body": "68 neighbours in your 5km radius have RSVP'd. Boots & spades ready?",
  "data": {
    "eventId": "event-1",
    "category": "tree_planting",
    "radiusKm": 5.2
  },
  "categoryId": "EVENT_REMINDER",
  "_displayInForeground": true
}`,
  };

  // --- Log Helper for Sync Engine ---
  function addSyncLog(msg, type = 'info') {
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    const entry = { time, msg, type };
    state.syncLog.unshift(entry);
    if (state.syncLog.length > 8) state.syncLog.pop();

    if (syncConsoleEl) {
      syncConsoleEl.innerHTML = state.syncLog
        .map(
          item => `
          <div class="sync-entry">
            <span class="sync-time">[${item.time}]</span>
            <span class="${item.type === 'push' ? 'sync-badge-push' : 'sync-badge-ok'}">${item.type.toUpperCase()}</span>
            <span>${item.msg}</span>
          </div>`
        )
        .join('');
    }
  }

  // --- Render Events Feed ---
  function renderEvents() {
    const filtered = NAIROBI_EVENTS.map(event => {
      const dist = haversineDistance(
        state.userLocation.lat,
        state.userLocation.lon,
        event.latitude,
        event.longitude
      );
      return { ...event, distanceKm: dist };
    })
      .filter(event => {
        // Category filter
        if (!state.selectedCategories.has(event.category)) return false;

        // Radius filter
        if (state.activeRadiusKm !== null && event.distanceKm > state.activeRadiusKm) {
          return false;
        }

        // Search query filter
        if (state.searchQuery.trim() !== '') {
          const q = state.searchQuery.toLowerCase();
          const matchTitle = event.title.toLowerCase().includes(q);
          const matchAddress = event.address.toLowerCase().includes(q);
          const matchDesc = event.description.toLowerCase().includes(q);
          const matchCat = event.categoryLabel.toLowerCase().includes(q);
          if (!matchTitle && !matchAddress && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);

    if (eventsCountEl) {
      eventsCountEl.textContent = `${filtered.length} event${filtered.length === 1 ? '' : 's'} found nearby`;
    }

    if (filtered.length === 0) {
      eventsListEl.innerHTML = `
        <div class="sim-empty-state">
          <div class="empty-icon">📍</div>
          <p><strong>No events found within ${state.activeRadiusKm ? state.activeRadiusKm + ' km' : 'this radius'}</strong></p>
          <p style="font-size:0.8rem; margin-top:0.35rem;">Try expanding the radius to 20 km or enabling all categories.</p>
        </div>
      `;
      return;
    }

    eventsListEl.innerHTML = filtered
      .map(event => {
        const isAttending = !!state.rsvps[event.id];
        const displayRsvpCount = event.rsvpCount + (isAttending ? 1 : 0);
        const distStr = event.distanceKm < 1 
          ? `${Math.round(event.distanceKm * 1000)} m away`
          : `${event.distanceKm.toFixed(1)} km away`;

        return `
          <div class="event-card" data-id="${event.id}">
            <div class="event-card-top">
              <span class="event-category-badge ${event.category}">
                ${getCategoryEmoji(event.category)} ${event.categoryLabel}
              </span>
              <span class="event-distance-badge">
                📍 ${distStr}
              </span>
            </div>

            <h3 class="event-card-title">${escapeHtml(event.title)}</h3>

            <div class="event-card-meta">
              <div class="meta-item">
                <span class="meta-icon">📅</span>
                <span>${event.timeStr}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">📌</span>
                <span>${escapeHtml(event.address)}</span>
              </div>
            </div>

            <p class="event-card-desc">${escapeHtml(event.description)}</p>

            <div class="event-card-footer">
              <div class="attendees-stat">
                👥 <strong>${displayRsvpCount}</strong> neighbours going
              </div>
              <button 
                class="rsvp-btn ${isAttending ? 'attending' : ''}" 
                data-id="${event.id}"
                aria-label="RSVP to event"
              >
                ${isAttending ? '✓ Attending' : '+ RSVP'}
              </button>
            </div>
          </div>
        `;
      })
      .join('');

    // Attach RSVP click handlers
    const rsvpButtons = eventsListEl.querySelectorAll('.rsvp-btn');
    rsvpButtons.forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        toggleRsvp(id);
      });
    });
  }

  function getCategoryEmoji(cat) {
    switch (cat) {
      case 'tree_planting': return '🌱';
      case 'cleanup': return '🧹';
      case 'blood_donation': return '🩸';
      case 'meetup': return '🤝';
      default: return '📌';
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- RSVP Mutation with WatermelonDB Sync Simulation ---
  function toggleRsvp(eventId) {
    const isNowAttending = !state.rsvps[eventId];
    if (isNowAttending) {
      state.rsvps[eventId] = true;
    } else {
      delete state.rsvps[eventId];
    }
    localStorage.setItem('nbi_rsvps', JSON.stringify(state.rsvps));

    const event = NAIROBI_EVENTS.find(e => e.id === eventId);
    const titleSnippet = event ? event.title.substring(0, 24) + '...' : eventId;

    if (state.isOnline) {
      addSyncLog(`RSVP ${isNowAttending ? 'confirmed' : 'cancelled'}: "${titleSnippet}"`, 'push');
      setTimeout(() => {
        addSyncLog(`Sync complete (Server commit #200)`, 'info');
      }, 350);
    } else {
      addSyncLog(`Offline: Queued mutation for "${titleSnippet}" in SQLite`, 'push');
    }

    renderEvents();
  }

  // --- Search Input Event ---
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      state.searchQuery = e.target.value;
      renderEvents();
    });
  }

  // --- Radius Buttons ---
  radiusButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      radiusButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const val = btn.getAttribute('data-radius');
      state.activeRadiusKm = val === 'all' ? null : parseInt(val, 10);
      renderEvents();
    });
  });

  // --- Category Filter Chips ---
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cat = chip.getAttribute('data-cat');
      if (state.selectedCategories.has(cat)) {
        if (state.selectedCategories.size > 1) {
          state.selectedCategories.delete(cat);
          chip.classList.remove('active');
        }
      } else {
        state.selectedCategories.add(cat);
        chip.classList.add('active');
      }
      renderEvents();
    });
  });

  // --- Location Anchor Switcher ---
  locationRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const val = radio.value;
      state.userLocKey = val;
      state.userLocation = ANCHOR_LOCATIONS[val];

      // Highlight active wrapper
      document.querySelectorAll('.location-radio-item').forEach(el => el.classList.remove('active'));
      radio.closest('.location-radio-item').classList.add('active');

      addSyncLog(`Location updated to ${state.userLocation.name}`, 'info');
      renderEvents();
    });
  });

  // --- Offline Mode Simulator Toggle ---
  if (onlineToggle) {
    onlineToggle.addEventListener('change', e => {
      state.isOnline = e.target.checked;
      if (connectionPill) {
        if (state.isOnline) {
          connectionPill.className = 'sim-status-pill online';
          connectionPill.innerHTML = '<span class="status-dot"></span> Online (Sync Ready)';
          addSyncLog('Network restored. Flushing queued offline mutations...', 'info');
          setTimeout(() => {
            addSyncLog('WatermelonDB bi-directional sync converged', 'info');
          }, 400);
        } else {
          connectionPill.className = 'sim-status-pill offline';
          connectionPill.innerHTML = '<span class="status-dot"></span> Offline (WatermelonDB)';
          addSyncLog('Switched to Offline Mode. WatermelonDB active on-device', 'info');
        }
      }
    });
  }

  // --- Force Sync Button ---
  if (forceSyncBtn) {
    forceSyncBtn.addEventListener('click', () => {
      forceSyncBtn.textContent = '🔄 Syncing...';
      forceSyncBtn.disabled = true;

      addSyncLog('Querying /sync/pull for remote changes...', 'info');
      setTimeout(() => {
        addSyncLog('WatermelonDB pull: 0 conflict(s), state fresh', 'info');
        forceSyncBtn.textContent = '🔄 Force WatermelonDB Sync';
        forceSyncBtn.disabled = false;
      }, 600);
    });
  }

  // --- Theme Toggle (Dark / Light) ---
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
    }
    localStorage.setItem('nbi_theme', theme);
  }

  const savedTheme = localStorage.getItem('nbi_theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      applyTheme(isLight ? 'dark' : 'light');
    });
  }

  // --- Architecture Protocol Tab Switcher ---
  protocolTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      protocolTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const protocolKey = tab.getAttribute('data-protocol');
      if (protocolCodeBlock && PROTOCOL_EXAMPLES[protocolKey]) {
        protocolCodeBlock.textContent = PROTOCOL_EXAMPLES[protocolKey];
      }
    });
  });

  // Initial Sync Log
  addSyncLog('WatermelonDB SQLite database initialized', 'info');
  addSyncLog('Loaded 12 Nairobi seed initiatives into reactive feed', 'info');

  // Initial Render
  renderEvents();
})();
