// ============================================================
//  LAURA ALANI — PORTFOLIO CONFIGURATION
// ============================================================
//
//  PHOTOS (one-time Cloudinary setup):
//  1. Go to cloudinary.com → Settings → Security
//  2. Enable "Resource list" → Save
//  3. Paste your cloud name below
//  4. Upload photos to Cloudinary and tag them "portfolio"
//     (select photos → right-click → Manage tags → add "portfolio")
//  → All tagged photos appear on the site automatically.
//
//  To control order: prefix filenames with numbers before uploading
//  e.g.  01-landscape.jpg, 02-portrait.jpg
//
//  VIDEOS — add YouTube video IDs to the list below:
// ============================================================

const CLOUDINARY = {
  cloud: 'YOUR_CLOUD_NAME',   // ← paste your Cloudinary cloud name here
  tag:   'portfolio',          // ← tag your photos with this in Cloudinary
};

const VIDEOS = [
  // {
  //   url:         'https://www.youtube.com/watch?v=dQw4w9WgXcQ',  // full YouTube link
  //   title:       'My Film',
  //   category:    'Video',
  //   description: 'Optional caption',
  //   order:       4,   // optional — sits between image 3 and image 5
  // },
];

// ── Contact ──────────────────────────────────────────────────
const CONTACT = {
  email:     'laura@example.com',   // ← your email
  instagram: '',                     // ← Instagram URL or leave empty
};
