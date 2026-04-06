#!/usr/bin/env node
// Generates static HTML files for each blog post for SEO
// Run: node build-posts.js

const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'posts');
const index = JSON.parse(fs.readFileSync(path.join(postsDir, 'index.json'), 'utf8'));
const template = fs.readFileSync(path.join(__dirname, 'post.html'), 'utf8');

index.forEach(post => {
  const md = fs.readFileSync(path.join(postsDir, `${post.slug}.md`), 'utf8');

  // Strip markdown to plain text for noscript (rough but effective)
  const plainText = md
    .replace(/^#{1,6}\s+/gm, '')        // headings
    .replace(/\*\*([^*]+)\*\*/g, '$1')   // bold
    .replace(/\*([^*]+)\*/g, '$1')       // italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/`([^`]+)`/g, '$1')         // inline code
    .replace(/```[\s\S]*?```/g, '')      // code blocks
    .replace(/^[-*]\s+/gm, '• ')         // list items
    .replace(/\n{3,}/g, '\n\n')          // excess newlines
    .trim();

  // Take first ~500 chars for a meaningful excerpt
  const excerpt = plainText.substring(0, 500) + (plainText.length > 500 ? '...' : '');

  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const noscriptBlock = `
    <noscript>
      <div class="container prose" style="padding-top: 120px;">
        <h1>${post.title}</h1>
        <p><em>${date}${post.tags ? ' &middot; ' + post.tags.join(', ') : ''}</em></p>
        <p>${excerpt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        <p><a href="blog.html">Back to Blog</a></p>
      </div>
    </noscript>`;

  // Inject noscript block and update meta tags
  let html = template
    .replace('<title>Blog Post — SecurityShrimp</title>',
      `<title>${post.title} — SecurityShrimp Blog</title>`)
    .replace('</head>',
      `  <meta name="description" content="${post.excerpt.replace(/"/g, '&quot;')}">\n` +
      `  <link rel="canonical" href="https://securityshrimp.com/post.html?slug=${post.slug}">\n` +
      `  <meta property="og:title" content="${post.title} — SecurityShrimp Blog">\n` +
      `  <meta property="og:description" content="${post.excerpt.replace(/"/g, '&quot;')}">\n` +
      `  <meta property="og:url" content="https://securityshrimp.com/post.html?slug=${post.slug}">\n` +
      `</head>`)
    .replace('<p class="text-dim">Loading post...</p>',
      `<p class="text-dim">Loading post...</p>${noscriptBlock}`)
    // Fix relative paths for /blog/ subdirectory
    .replace(/href="(?!https?:\/\/|\/|#|mailto:)([^"]+)"/g, 'href="/$1"')
    .replace(/src="(?!https?:\/\/|\/|data:)([^"]+)"/g, 'src="/$1"');

  // Write static file
  const outDir = path.join(__dirname, 'blog');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  fs.writeFileSync(path.join(outDir, `${post.slug}.html`), html);
  console.log(`Generated: blog/${post.slug}.html`);
});

console.log('Done!');
