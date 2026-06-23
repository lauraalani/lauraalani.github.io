// ============================================================
//  LAURA ALANI — PORTFOLIO CONTENT
//  Edit this file to add, remove, or reorder portfolio items.
// ============================================================
//
//  To add an IMAGE:
//  {
//    type: 'image',
//    src:  'images/filename.jpg',   ← put the file in the images/ folder
//    title: 'My Title',
//    category: 'Photography',       ← shown as a label
//    description: 'Optional caption',
//    color: '#6b4c9a'               ← optional tile accent color
//  }
//
//  To add a YOUTUBE VIDEO:
//  {
//    type: 'youtube',
//    id: 'VIDEO_ID',                ← the part after ?v= in the YouTube URL
//    title: 'My Video',
//    category: 'Video',
//    description: 'Optional caption',
//    color: '#c0392b'
//  }
//  Thumbnail is fetched automatically from YouTube.
// ============================================================

const PORTFOLIO = [
  {
    type: 'youtube',
    id: 'dQw4w9WgXcQ',
    title: 'Sample Video',
    category: 'Video',
    description: 'Replace this with your YouTube video ID.',
    color: '#8e44ad'
  },
  {
    type: 'image',
    src: 'images/placeholder.jpg',
    title: 'Sample Work',
    category: 'Photography',
    description: 'Add your image to the images/ folder and update this entry.',
    color: '#2980b9'
  },
];

// Contact info shown in the footer
const CONTACT = {
  email: 'laura@example.com',        // ← your email
  instagram: '',                      // ← Instagram URL or leave empty
};
