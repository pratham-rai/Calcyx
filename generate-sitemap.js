import fs from 'fs';
import path from 'path';
import { calculators, categories } from './src/calculators/registry.js';

const BASE_URL = 'https://calcyx.com';

function generateSitemap() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 1. Static Pages
  const staticPages = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/about', priority: '0.5', changefreq: 'monthly' },
    { path: '/contact', priority: '0.5', changefreq: 'monthly' },
    { path: '/privacy', priority: '0.3', changefreq: 'monthly' },
    { path: '/terms', priority: '0.3', changefreq: 'monthly' },
  ];

  staticPages.forEach(p => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${p.path}</loc>\n`;
    xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
    xml += `    <priority>${p.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // 2. Categories
  categories.forEach(c => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/category/${c.id}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  // 3. Calculators
  calculators.forEach(c => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/calculators/${c.slug}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += '</urlset>\n';

  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml);
  console.log(`✅ Generated sitemap.xml with ${staticPages.length + categories.length + calculators.length} URLs at ${sitemapPath}`);

  // Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt);
  console.log(`✅ Generated robots.txt at ${robotsPath}`);
}

generateSitemap();
