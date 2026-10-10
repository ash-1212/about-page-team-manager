// ── Data source: reads from localStorage (seeded from team.json via fetch)
// ── Falls back gracefully if fetch fails

let allMembers = [];
let activeFilter = 'All';

// ── 1. Init AOS
AOS.init({ duration: 700, once: true, offset: 60 });

// ── 2. Navbar scroll
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 50);
});

// ── 3. Dark / Light Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateToggleIcon(savedTheme);

themeToggle?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateToggleIcon(next);
});

function updateToggleIcon(theme) {
  if (!themeToggle) return;
  themeToggle.innerHTML = theme === 'dark'
    ? '<i class="bi bi-sun-fill"></i>'
    : '<i class="bi bi-moon-fill"></i>';
}

// ── 4. Load team data
async function loadTeam() {
  // Try localStorage first (admin may have edited)
  const stored = localStorage.getItem('teamData');
  if (stored) {
    allMembers = JSON.parse(stored);
  } else {
    // Fetch from JSON file
    try {
      const res = await fetch('data/team.json');
      allMembers = await res.json();
      localStorage.setItem('teamData', JSON.stringify(allMembers));
    } catch (err) {
      console.error('Could not load team data:', err);
      allMembers = [];
    }
  }
  renderTeam(allMembers);
}

// ── 5. Render team cards
function renderTeam(members) {
  const grid = document.getElementById('teamGrid');
  const noResults = document.getElementById('noResults');
  if (!grid) return;

  grid.innerHTML = '';

  if (members.length === 0) {
    noResults.classList.remove('d-none');
    return;
  }
  noResults.classList.add('d-none');

  members.forEach((m, i) => {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-lg-4';
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', i * 80);

    col.innerHTML = `
      <div class="team-card" onclick="openModal(${m.id})">
        <div class="team-card-img-wrapper">
          <img src="${m.image}" alt="${m.name}" loading="lazy"/>
          <div class="team-card-overlay">
            <a href="${m.linkedin}" target="_blank" class="overlay-social" onclick="event.stopPropagation()" title="LinkedIn">
              <i class="bi bi-linkedin"></i>
            </a>
            <a href="${m.github}" target="_blank" class="overlay-social" onclick="event.stopPropagation()" title="GitHub">
              <i class="bi bi-github"></i>
            </a>
          </div>
        </div>
        <div class="team-card-body">
          <h5>${m.name}</h5>
          <span class="role-badge">${m.role}</span>
          <p class="team-card-bio">${m.bio}</p>
          <button class="view-profile-btn">
            View Profile <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });

  // Re-init AOS for dynamically added elements
  AOS.refresh();
}

// ── 6. Search
document.getElementById('searchInput')?.addEventListener('input', function () {
  applyFilters();
});

// ── 7. Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    activeFilter = this.dataset.filter;
    applyFilters();
  });
});

function applyFilters() {
  const query = document.getElementById('searchInput')?.value.toLowerCase() || '';
  let filtered = allMembers;

  if (activeFilter !== 'All') {
    filtered = filtered.filter(m => m.role === activeFilter);
  }

  if (query) {
    filtered = filtered.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.role.toLowerCase().includes(query)
    );
  }

  renderTeam(filtered);
}

// ── 8. Modal – Full Profile
function openModal(id) {
  const m = allMembers.find(x => x.id === id);
  if (!m) return;

  document.getElementById('modalImg').src = m.image;
  document.getElementById('modalImg').alt = m.name;
  document.getElementById('modalName').textContent = m.name;
  document.getElementById('modalRole').textContent = m.role;
  document.getElementById('modalBio').textContent = m.bio;
  document.getElementById('modalLinkedin').href = m.linkedin;
  document.getElementById('modalGithub').href = m.github;

  new bootstrap.Modal(document.getElementById('memberModal')).show();
}

// ── Start
loadTeam();