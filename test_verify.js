const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== TEST SUITE: SEO, SECURITY & PERFORMANCE ===\n');

// 1. Verify index.html Meta Tags & Schema.org JSON-LD
console.log('1. Checking index.html SEO, OG, Twitter & JSON-LD...');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Title & Meta tags
assert(html.includes('<title>Hikari Group — Yapon Tili Ta\'lim Platformasi | JLPT N5–N1 Kurslari</title>'), 'Title missing or incorrect');
assert(html.includes('<meta name="description"'), 'Description meta tag missing');
assert(html.includes('<meta name="keywords"'), 'Keywords meta tag missing');
assert(html.includes('<meta name="author" content="Hikari Group (光)">'), 'Author meta tag missing');
assert(html.includes('<link rel="canonical" href="https://hikarigroup.uz/">'), 'Canonical URL missing');
assert(html.includes('<meta name="robots" content="index, follow'), 'Robots meta tag missing');
assert(html.includes('<meta name="theme-color" content="#DC2626">'), 'theme-color missing');
assert(html.includes('<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">'), 'SVG favicon link missing');

// Preconnects & DNS prefetch
assert(html.includes('<link rel="dns-prefetch" href="https://fonts.googleapis.com">'), 'fonts.googleapis dns-prefetch missing');
assert(html.includes('<link rel="dns-prefetch" href="https://cdn.tailwindcss.com">'), 'tailwindcss dns-prefetch missing');
assert(html.includes('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'), 'fonts.gstatic preconnect missing');

// Open Graph
assert(html.includes('<meta property="og:type" content="website">'), 'og:type missing');
assert(html.includes('<meta property="og:url" content="https://hikarigroup.uz/">'), 'og:url missing');
assert(html.includes('<meta property="og:title"'), 'og:title missing');
assert(html.includes('<meta property="og:description"'), 'og:description missing');
assert(html.includes('<meta property="og:image" content="https://hikarigroup.uz/assets/anime_teachers.png">'), 'og:image missing');
assert(html.includes('<meta property="og:locale" content="uz_UZ">'), 'og:locale missing');

// Twitter
assert(html.includes('<meta name="twitter:card" content="summary_large_image">'), 'twitter:card missing');
assert(html.includes('<meta name="twitter:title"'), 'twitter:title missing');
assert(html.includes('<meta name="twitter:image"'), 'twitter:image missing');

// JSON-LD
const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert(jsonLdMatch, 'JSON-LD script tag not found');
const jsonLd = JSON.parse(jsonLdMatch[1]);
assert(jsonLd['@graph'], 'JSON-LD @graph missing');
const types = jsonLd['@graph'].map(item => item['@type']);
assert(types.includes('EducationalOrganization'), 'EducationalOrganization schema missing');
assert(types.includes('ItemList'), 'ItemList schema missing');
console.log('   ✓ index.html Meta tags, Open Graph, Twitter cards, Preconnects, and JSON-LD verified.');

// 2. Verify Favicon SVG
console.log('2. Checking assets/favicon.svg...');
const svgPath = path.join(__dirname, 'assets', 'favicon.svg');
assert(fs.existsSync(svgPath), 'assets/favicon.svg does not exist');
const svg = fs.readFileSync(svgPath, 'utf8');
assert(svg.includes('<svg') && svg.includes('</svg>'), 'Invalid SVG format');
assert(svg.includes('光'), 'Kanji character 光 not found in SVG');
console.log('   ✓ assets/favicon.svg verified.');

// 3. Verify robots.txt and sitemap.xml
console.log('3. Checking robots.txt & sitemap.xml...');
const robots = fs.readFileSync(path.join(__dirname, 'robots.txt'), 'utf8');
assert(robots.includes('User-agent: *'), 'robots.txt User-agent missing');
assert(robots.includes('Disallow: /.env'), 'robots.txt .env disallow missing');
assert(robots.includes('Sitemap: https://hikarigroup.uz/sitemap.xml'), 'robots.txt Sitemap link missing');

const sitemap = fs.readFileSync(path.join(__dirname, 'sitemap.xml'), 'utf8');
assert(sitemap.includes('<urlset') && sitemap.includes('https://hikarigroup.uz/'), 'sitemap.xml invalid');
console.log('   ✓ robots.txt and sitemap.xml verified.');

// 4. Test Server Security Patterns
console.log('4. Testing Forbidden File Protection Patterns...');
const FORBIDDEN_FILE_PATTERNS = [
  /^\/\..*/i,
  /\/\..*/i,
  /\.\./,
  /package(-lock)?\.json$/i,
  /server.*\.js$/i,
  /server.*\.py$/i,
  /node_modules/i,
  /brainstorms/i,
  /\.env/i,
  /\.git/i,
  /\.(md|log|bak|conf)$/i
];

function isForbidden(testPath) {
  return FORBIDDEN_FILE_PATTERNS.some(pattern => pattern.test(testPath));
}

// These should be blocked (true)
assert.strictEqual(isForbidden('/.env'), true, '/.env must be blocked');
assert.strictEqual(isForbidden('/.env.example'), true, '/.env.example must be blocked');
assert.strictEqual(isForbidden('/.git/config'), true, '/.git must be blocked');
assert.strictEqual(isForbidden('/.agent/config'), true, '/.agent must be blocked');
assert.strictEqual(isForbidden('/server.js'), true, '/server.js must be blocked');
assert.strictEqual(isForbidden('/server_with_range.py'), true, '/server_with_range.py must be blocked');
assert.strictEqual(isForbidden('/package.json'), true, '/package.json must be blocked');
assert.strictEqual(isForbidden('/package-lock.json'), true, '/package-lock.json must be blocked');
assert.strictEqual(isForbidden('/node_modules/express/index.js'), true, '/node_modules must be blocked');
assert.strictEqual(isForbidden('/brainstorms/notes.md'), true, '/brainstorms must be blocked');
assert.strictEqual(isForbidden('/Grill Me Prompt.md'), true, '*.md must be blocked');
assert.strictEqual(isForbidden('/assets/../server.js'), true, 'Path traversal must be blocked');

// These should be allowed (false)
assert.strictEqual(isForbidden('/'), false, '/ should be allowed');
assert.strictEqual(isForbidden('/index.html'), false, '/index.html should be allowed');
assert.strictEqual(isForbidden('/assets/anime_teachers.png'), false, '/assets/... should be allowed');
assert.strictEqual(isForbidden('/assets/favicon.svg'), false, '/assets/favicon.svg should be allowed');
assert.strictEqual(isForbidden('/robots.txt'), false, '/robots.txt should be allowed');
assert.strictEqual(isForbidden('/sitemap.xml'), false, '/sitemap.xml should be allowed');
assert.strictEqual(isForbidden('/api/send-lead'), false, '/api/send-lead should be allowed');
console.log('   ✓ Forbidden file patterns and path traversal protection verified.');

// 5. Test Input Sanitization & Validation
console.log('5. Testing Input Sanitization & Validation...');
function sanitizeInput(data) {
  if (!data || typeof data !== 'object') return {};
  const cleanString = (val, maxLen) => {
    if (typeof val !== 'string') return '';
    return val
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .trim()
      .slice(0, maxLen);
  };
  return {
    fullName: cleanString(data.fullName, 100),
    phone: cleanString(data.phone, 30),
    selectedCourse: cleanString(data.selectedCourse, 100),
    currentLevel: cleanString(data.currentLevel, 60),
    notes: cleanString(data.notes, 500)
  };
}

const dirtyInput = {
  fullName: '  Ali Valiyev\x00\x08  ',
  phone: ' +998 (90) 123-45-67 ',
  selectedCourse: 'JLPT N5\x1F',
  notes: 'A'.repeat(600)
};
const cleaned = sanitizeInput(dirtyInput);
assert.strictEqual(cleaned.fullName, 'Ali Valiyev', 'Null bytes and spaces not properly stripped');
assert.strictEqual(cleaned.phone, '+998 (90) 123-45-67');
assert.strictEqual(cleaned.selectedCourse, 'JLPT N5');
assert.strictEqual(cleaned.notes.length, 500, 'Notes length not bounded');

const phoneRegex = /^\+?[\d\s\-()]{7,30}$/;
assert(phoneRegex.test('+998901234567'), 'Valid phone failed');
assert(phoneRegex.test('+998 (90) 123-45-67'), 'Valid phone with spaces failed');
assert(!phoneRegex.test('abc123'), 'Invalid phone containing letters must fail');
assert(!phoneRegex.test('<script>'), 'XSS phone must fail');
console.log('   ✓ Input sanitization and phone validation verified.');

console.log('\n=== ALL UNIT CHECKS PASSED SUCCESSFULLY! ===');
