// Blog engine — loads posts from posts/index.json, renders markdown with marked.js

const POSTS_INDEX = 'posts/index.json?v=' + Date.now();

// Load and render blog listing
async function loadBlogListing() {
  const container = document.getElementById('blog-listing');
  if (!container) return;

  try {
    const res = await fetch(POSTS_INDEX);
    const posts = await res.json();

    if (!posts.length) {
      container.innerHTML = '<p class="text-dim" style="text-align:center;">No posts yet. Check back soon.</p>';
      return;
    }

    // Sort by date descending
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = posts.map(post => `
      <a href="post.html?slug=${encodeURIComponent(post.slug)}" class="blog-card">
        <div class="blog-card-meta">${formatDate(post.date)}${post.tags ? ' &middot; ' + post.tags.join(', ') : ''}</div>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.excerpt)}</p>
      </a>
    `).join('');
  } catch (e) {
    container.innerHTML = '<p class="text-dim" style="text-align:center;">Failed to load posts.</p>';
  }
}

// Load and render single post
async function loadPost() {
  const container = document.getElementById('post-content');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  if (!slug) {
    container.innerHTML = '<p>Post not found.</p>';
    return;
  }

  try {
    // Load post metadata
    const indexRes = await fetch(POSTS_INDEX);
    const posts = await indexRes.json();
    const meta = posts.find(p => p.slug === slug);

    // Load markdown
    const mdRes = await fetch(`posts/${slug}.md`);
    if (!mdRes.ok) throw new Error('Not found');
    const md = await mdRes.text();

    // Render
    const html = marked.parse(md);

    container.innerHTML = `
      <h1>${escapeHtml(meta ? meta.title : slug)}</h1>
      <div class="post-meta">${meta ? formatDate(meta.date) : ''}${meta && meta.tags ? ' &middot; ' + meta.tags.join(', ') : ''}</div>
      <div class="post-body">${html}</div>
    `;

    // Update page title
    if (meta) document.title = `${meta.title} — SecurityShrimp Blog`;

    // Highlight code blocks if hljs is available
    if (window.hljs) {
      container.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
    }
  } catch (e) {
    container.innerHTML = '<p>Post not found.</p>';
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  loadBlogListing();
  loadPost();
});
