const TILE_COLORS = [
  '#6c3483','#1a5276','#117a65','#784212',
  '#922b21','#1f618d','#7d6608','#4a235a'
];

let PORTFOLIO = [];

function ytIdFromUrl(str) {
  const m = str.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : str;
}

function ytThumb(id) {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

// "1-animation" → { label: "Animation", order: 1 }
// "forest"      → { label: "Forest",    order: Infinity }
function parsePrefixed(str) {
  if (!str) return { label: '', order: Infinity };
  const m = str.match(/^(\d+)[-_]?(.*)/);
  const raw = m ? m[2] : str;
  return {
    order: m ? parseInt(m[1], 10) : Infinity,
    label: raw.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || str,
  };
}

// "1-animation/03-forest" → { title, itemOrder, category, categoryOrder }
function parsePublicId(publicId) {
  const parts   = publicId.split('/');
  const file    = parts[parts.length - 1];
  const folder  = parts.length >= 2 ? parts[parts.length - 2] : '';
  const cat     = parsePrefixed(folder);
  const item    = parsePrefixed(file);
  return {
    title:         item.label,
    itemOrder:     item.order,
    category:      cat.label,
    categoryOrder: cat.order,
  };
}

// ── Tile ────────────────────────────────────────────────────

function buildTile(item, index) {
  const color   = item.color || TILE_COLORS[index % TILE_COLORS.length];
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
      <span class="tile__category">${item.category || ''}</span>
      <h3 class="tile__title">${item.title}</h3>
    </div>`;

  tile.addEventListener('click', () => openModal(index));
  return tile;
}

// ── Load ────────────────────────────────────────────────────

async function loadPortfolio() {
  const grid = document.getElementById('portfolio-grid');

  const videos = VIDEOS.map(v => {
    const cat = parsePrefixed(v.category || '');
    return {
      type:          'youtube',
      id:            ytIdFromUrl(v.url),
      title:         v.title       || '',
      category:      cat.label,
      categoryOrder: cat.order,
      description:   v.description || '',
      _order:        v.order       ?? Infinity,
    };
  });

  if (!CLOUDINARY.cloud || CLOUDINARY.cloud === 'YOUR_CLOUD_NAME') {
    PORTFOLIO = videos.sort((a, b) =>
      a.categoryOrder !== b.categoryOrder
        ? a.categoryOrder - b.categoryOrder
        : a._order - b._order
    );
    render(grid);
    return;
  }

  const listUrl = `https://res.cloudinary.com/${CLOUDINARY.cloud}/image/list/${CLOUDINARY.tag}.json`;

  try {
    const res  = await fetch(listUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const images = (data.resources || []).map(r => {
      const p = parsePublicId(r.public_id);
      return {
        type:          'image',
        src:           `https://res.cloudinary.com/${CLOUDINARY.cloud}/image/upload/${r.public_id}.${r.format}`,
        title:         p.title,
        category:      p.category,
        categoryOrder: p.categoryOrder,
        description:   '',
        _order:        p.itemOrder,
      };
    });

    PORTFOLIO = [...images, ...videos].sort((a, b) =>
      a.categoryOrder !== b.categoryOrder
        ? a.categoryOrder - b.categoryOrder
        : a._order - b._order
    );
  } catch (err) {
    console.error('Cloudinary fetch failed:', err);
    PORTFOLIO = videos;
  }

  render(grid);
}

function render(grid) {
  grid.innerHTML = '';

  const cats = [...new Set(PORTFOLIO.map(i => i.category).filter(Boolean))];
  const showHeaders = cats.length >= 2;

  let lastCat = null;
  PORTFOLIO.forEach((item, index) => {
    if (showHeaders && item.category !== lastCat) {
      const div = document.createElement('div');
      div.className = 'category-divider';
      div.innerHTML = `<span>${item.category}</span>`;
      grid.appendChild(div);
      lastCat = item.category;
    }
    grid.appendChild(buildTile(item, index));
  });
}

// ── Modal ────────────────────────────────────────────────────

const modal      = document.getElementById('modal');
const modalBody  = document.getElementById('modal-body');
const modalTitle = document.getElementById('modal-title');
const modalDesc  = document.getElementById('modal-desc');

function openModal(index) {
  const item = PORTFOLIO[index];
  modalTitle.textContent = item.title;
  modalDesc.textContent  = item.description || '';

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
