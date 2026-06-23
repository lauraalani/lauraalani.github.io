const TILE_COLORS = [
  '#6c3483','#1a5276','#117a65','#784212',
  '#922b21','#1f618d','#7d6608','#4a235a'
];

let PORTFOLIO = [];

function ytThumb(id) {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

function parseCSV(text) {
  const rows = [];
  for (const line of text.trim().split('\n')) {
    const row = [];
    let cell = '', inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        row.push(cell.trim());
        cell = '';
      } else {
        cell += ch;
      }
    }
    row.push(cell.trim());
    rows.push(row);
  }
  return rows;
}

function csvToPortfolio(text) {
  const rows = parseCSV(text);
  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.toLowerCase().replace(/\s+/g, ''));
  const idx = k => headers.indexOf(k);

  return rows.slice(1)
    .filter(row => row[idx('src')])
    .map(row => {
      const src = row[idx('src')];
      const isYoutube = !/^https?:\/\//.test(src);
      return {
        type:        isYoutube ? 'youtube' : 'image',
        ...(isYoutube ? { id: src } : { src }),
        title:       row[idx('title')]       || '',
        category:    row[idx('category')]    || '',
        description: row[idx('description')] || '',
        color:       row[idx('color')]       || undefined,
      };
    });
}

// ── Tile ────────────────────────────────────────────────────

function buildTile(item, index) {
  const color  = item.color || TILE_COLORS[index % TILE_COLORS.length];
  const isVideo = item.type === 'youtube';
  const imgSrc  = isVideo ? ytThumb(item.id) : item.src;

  const tile = document.createElement('article');
  tile.className = 'tile' + (isVideo ? ' tile--video' : '');
  tile.style.setProperty('--accent', color);
  tile.dataset.index = index;

  tile.innerHTML = `
    <div class="tile__bg" style="background-color:${color}">
      <img src="${imgSrc}" alt="${item.title}" loading="lazy"
        ${isVideo ? `onerror="this.src='https://img.youtube.com/vi/${item.id}/hqdefault.jpg'"` : ''}>
    </div>
    <div class="tile__overlay">
      ${isVideo ? '<span class="tile__play">&#9654;</span>' : ''}
      <span class="tile__category">${item.category}</span>
      <h3 class="tile__title">${item.title}</h3>
    </div>`;

  tile.addEventListener('click', () => openModal(index));
  return tile;
}

// ── Portfolio load ───────────────────────────────────────────

async function loadPortfolio() {
  const grid = document.getElementById('portfolio-grid');

  if (!SHEET_CSV_URL || SHEET_CSV_URL.includes('PASTE_YOUR')) {
    grid.innerHTML = '<p class="grid-notice">Add your Google Sheet URL to portfolio.js to get started.</p>';
    return;
  }

  grid.innerHTML = '<p class="grid-notice grid-notice--loading">Loading&hellip;</p>';

  try {
    const res  = await fetch(SHEET_CSV_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    PORTFOLIO   = csvToPortfolio(text);

    grid.innerHTML = '';
    if (!PORTFOLIO.length) {
      grid.innerHTML = '<p class="grid-notice">No items in the sheet yet.</p>';
      return;
    }
    PORTFOLIO.forEach((item, i) => grid.appendChild(buildTile(item, i)));
  } catch (err) {
    grid.innerHTML = `<p class="grid-notice grid-notice--error">Could not load portfolio.<br><small>${err.message}</small></p>`;
  }
}

// ── Modal ────────────────────────────────────────────────────

const modal      = document.getElementById('modal');
const modalBody  = document.getElementById('modal-body');
const modalTitle = document.getElementById('modal-title');
const modalDesc  = document.getElementById('modal-desc');

function openModal(index) {
  const item = PORTFOLIO[index];
  modalTitle.textContent = item.title;
  modalDesc.textContent  = item.description;

  if (item.type === 'youtube') {
    modalBody.innerHTML = `
      <div class="video-wrap">
        <iframe src="https://www.youtube.com/embed/${item.id}?autoplay=1"
          frameborder="0" allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen></iframe>
      </div>`;
  } else {
    modalBody.innerHTML = `<img src="${item.src}" alt="${item.title}">`;
  }

  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('is-open');
  modalBody.innerHTML = '';
  document.body.style.overflow = '';
}

modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.getElementById('modal-close').addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Side menu ────────────────────────────────────────────────

const menuToggle = document.getElementById('menu-toggle');
const menuPanel  = document.getElementById('menu-panel');
const menuClose  = document.getElementById('menu-close');

menuToggle.addEventListener('click', e => {
  e.preventDefault();
  menuPanel.classList.toggle('is-open');
});
menuClose.addEventListener('click', () => menuPanel.classList.remove('is-open'));
menuPanel.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => menuPanel.classList.remove('is-open'))
);

// ── Contact ──────────────────────────────────────────────────

function renderContact() {
  const emailEl = document.getElementById('footer-email');
  const igEl    = document.getElementById('footer-instagram');
  const copy    = document.getElementById('footer-copy');

  if (CONTACT.email) {
    emailEl.href = `mailto:${CONTACT.email}`;
    emailEl.textContent = CONTACT.email;
  } else {
    emailEl.closest('li') && emailEl.closest('li').remove();
  }

  if (CONTACT.instagram) {
    igEl.href = CONTACT.instagram;
  } else {
    igEl.closest('li') && igEl.closest('li').remove();
  }

  copy.textContent = `© ${new Date().getFullYear()} Laura Alani`;
}

loadPortfolio();
renderContact();
