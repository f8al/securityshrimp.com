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

    // Inject structured data
    if (meta) {
      // Breadcrumbs
      injectJsonLd({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://securityshrimp.com/" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://securityshrimp.com/blog.html" },
          { "@type": "ListItem", "position": 3, "name": meta.title, "item": `https://securityshrimp.com/post.html?slug=${slug}` }
        ]
      });

      // Article schema
      injectJsonLd({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": meta.title,
        "datePublished": meta.date,
        "dateModified": meta.date,
        "author": { "@type": "Organization", "name": "SecurityShrimp", "url": "https://securityshrimp.com" },
        "publisher": {
          "@type": "Organization",
          "name": "SecurityShrimp",
          "logo": { "@type": "ImageObject", "url": "https://securityshrimp.com/img/og-image.png" }
        },
        "description": meta.excerpt,
        "image": "https://securityshrimp.com/img/og-image.png",
        "mainEntityOfPage": `https://securityshrimp.com/post.html?slug=${slug}`
      });

      // Event schema for KernelCon post
      if (slug === 'kernelcon-2026') {
        injectJsonLd({
          "@context": "https://schema.org",
          "@type": "Event",
          "name": "KernelCon 2026",
          "description": "SecurityShrimp presenting \"All Keys Lost: A Car Hacking Adventure\" at KernelCon 2026",
          "startDate": "2026-04-09",
          "endDate": "2026-04-10",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "eventStatus": "https://schema.org/EventScheduled",
          "location": {
            "@type": "Place",
            "name": "KernelCon",
            "address": { "@type": "PostalAddress", "addressLocality": "Omaha", "addressRegion": "NE", "addressCountry": "US" }
          },
          "performer": { "@type": "Organization", "name": "SecurityShrimp" },
          "organizer": { "@type": "Organization", "name": "KernelCon", "url": "https://kernelcon.org" }
        });
      }

      // Update OG meta tags dynamically
      setMeta('og:title', meta.title + ' — SecurityShrimp Blog');
      setMeta('og:description', meta.excerpt);
      setMeta('og:url', `https://securityshrimp.com/post.html?slug=${slug}`);
      setMeta('twitter:title', meta.title + ' — SecurityShrimp Blog');
      setMeta('twitter:description', meta.excerpt);
    }

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

function injectJsonLd(data) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function setMeta(property, content) {
  let el = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
  if (el) { el.setAttribute('content', content); }
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  loadBlogListing();
  loadPost();
});
