// ============================================================
//  LAURA ALANI — PORTFOLIO CONTENT
//  Edit this file to add, remove, or reorder items.
//  Then commit and push — the site updates automatically.
// ============================================================
//
//  To add a PHOTO (upload to Cloudinary first, then paste the URL):
//  { type: 'image', src: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/photo.jpg', title: 'Title', category: 'Photography', description: 'Optional caption' }
//
//  To add a YOUTUBE VIDEO (paste only the ID — the part after ?v= in the URL):
//  { type: 'youtube', id: 'dQw4w9WgXcQ', title: 'Title', category: 'Video', description: 'Optional caption' }
//
//  Optional: add  color: '#8e44ad'  to any item to set the tile background color.
// ============================================================

const PORTFOLIO = [
  {
    type: 'youtube',
    id: 'dQw4w9WgXcQ',
    title: 'Sample Video',
    category: 'Video',
    description: 'Replace with your YouTube video ID.',
  },
  {
    type: 'image',
    src: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    title: 'Sample Photo',
    category: 'Photography',
    description: 'Replace with your Cloudinary image URL.',
  },
];

// ── Contact ──────────────────────────────────────────────────
const CONTACT = {
  email:     'laura@example.com',   // ← your email
  instagram: '',                     // ← Instagram URL or leave empty
};
