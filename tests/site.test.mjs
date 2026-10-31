import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');

function findHtmlFiles(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name.startsWith('.') ||
      entry.name === 'node_modules' ||
      entry.name === 'scripts' ||
      entry.name === 'tests'
    ) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findHtmlFiles(full, list);
    } else if (entry.name.endsWith('.html')) {
      list.push(full);
    }
  }
  return list;
}

describe('Nabat Persian Weddings — Static Site Integrity', () => {
  const htmlFiles = findHtmlFiles(REPO_ROOT);

  test('all expected HTML routes exist on disk', () => {
    assert.equal(htmlFiles.length, 28, 'Expected 28 HTML files across root, scroll-alias routes, blog, and locations');
  });

  test('vercel.json is valid JSON and configures clean redirects and headers', () => {
    const vercelConfig = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'vercel.json'), 'utf8'));
    assert.equal(vercelConfig.trailingSlash, true);
    assert.ok(Array.isArray(vercelConfig.headers) && vercelConfig.headers.length > 0);
    assert.ok(Array.isArray(vercelConfig.redirects) && vercelConfig.redirects.length > 0);
  });

  test('all JSON-LD structured data blocks parse without syntax errors', () => {
    for (const file of htmlFiles) {
      const rel = path.relative(REPO_ROOT, file);
      const content = fs.readFileSync(file, 'utf8');
      const matches = [...content.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
      assert.ok(matches.length > 0 || rel === '404.html' || rel === 'privacy/index.html', `Expected JSON-LD in ${rel}`);
      for (const m of matches) {
        assert.doesNotThrow(() => JSON.parse(m[1]), `Invalid JSON-LD in ${rel}`);
      }
    }
  });

  test('all local asset references and internal route links resolve to existing files', () => {
    for (const file of htmlFiles) {
      const rel = path.relative(REPO_ROOT, file);
      const content = fs.readFileSync(file, 'utf8');
      const attrMatches = [...content.matchAll(/\b(?:src|href|poster)="([^"]+)"/gi)];
      for (const m of attrMatches) {
        const ref = m[1];
        if (
          ref.startsWith('http://') ||
          ref.startsWith('https://') ||
          ref.startsWith('mailto:') ||
          ref.startsWith('tel:') ||
          ref.startsWith('#') ||
          ref.startsWith('data:') ||
          ref.startsWith('/_vercel/')
        ) {
          continue;
        }
        const cleanRef = ref.split('?')[0].split('#')[0];
        if (!cleanRef) continue;
        const targetPath = cleanRef.startsWith('/')
          ? path.join(REPO_ROOT, cleanRef)
          : path.join(path.dirname(file), cleanRef);
        assert.ok(
          fs.existsSync(targetPath),
          `Broken reference in ${rel}: "${ref}" -> ${targetPath} does not exist`
        );
      }
    }
  });

  test('sitemap.xml, robots.txt, and llms.txt feeds exist and reference valid routes', () => {
    for (const feed of ['sitemap.xml', 'robots.txt', 'llms.txt', 'llms-full.txt']) {
      assert.ok(fs.existsSync(path.join(REPO_ROOT, feed)), `Missing ${feed}`);
    }
    const sitemap = fs.readFileSync(path.join(REPO_ROOT, 'sitemap.xml'), 'utf8');
    const locs = [...sitemap.matchAll(/<loc>https:\/\/www\.nabatpersianweddings\.com(\/[^<]*)<\/loc>/g)];
    assert.ok(locs.length >= 20, 'Expected at least 20 URLs in sitemap.xml');
    for (const [, routePath] of locs) {
      const target =
        routePath === '/'
          ? path.join(REPO_ROOT, 'index.html')
          : path.join(REPO_ROOT, routePath, 'index.html');
      assert.ok(fs.existsSync(target), `Sitemap URL ${routePath} missing ${target}`);
    }
  });
});
