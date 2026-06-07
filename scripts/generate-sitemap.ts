import { writeFileSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'https://auraandstone.in';
const PAGES = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/shop', changefreq: 'daily', priority: 0.9 },
  { url: '/zodiac-calculator', changefreq: 'weekly', priority: 0.8 },
  { url: '/charging-station', changefreq: 'monthly', priority: 0.7 },
  { url: '/encyclopedia', changefreq: 'monthly', priority: 0.7 },
  { url: '/about', changefreq: 'monthly', priority: 0.6 },
  { url: '/checkout', changefreq: 'yearly', priority: 0.3 },
  { url: '/admin', changefreq: 'yearly', priority: 0.1 },
];

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${PAGES.map(page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  writeFileSync(join(__dirname, '../dist/sitemap.xml'), sitemap);
  console.log('Sitemap generated at dist/sitemap.xml');
}

function generateRobotsTxt() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml

Disallow: /admin/
Disallow: /checkout/
Disallow: /api/
`;

  writeFileSync(join(__dirname, '../dist/robots.txt'), robots);
  console.log('robots.txt generated at dist/robots.txt');
}

generateSitemap();
generateRobotsTxt();