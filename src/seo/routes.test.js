import test from 'node:test';
import assert from 'node:assert/strict';

import {SEO_ROUTES, SHARE_ROUTES, seoMeta} from './routes.js';
import {headFor, render, sitemap} from '../../scripts/prerender.mjs';

const SHELL = `<!DOCTYPE html>
<html lang="en"><head>
    <script>gtag('config', 'G-X');</script>
    <meta charset="utf-8"/>
    <!-- seo:start -->
    <meta name="description" content="fallback"/>
    <title>SAT Duel - Digital SAT Practice</title>
    <!-- seo:end -->
    <link rel="manifest" href="/manifest.json"/>
</head><body><div id="root"></div></body></html>`;

test('every route has the fields the prerenderer and sitemap need', () => {
    for (const r of [...SEO_ROUTES, ...SHARE_ROUTES]) {
        assert.ok(r.key, 'missing key');
        assert.match(r.path, /^\//, `${r.key}: path must be absolute`);
        assert.ok(r.title?.length, `${r.key}: missing title`);
        assert.ok(r.description?.length, `${r.key}: missing description`);
        assert.match(r.image, /^\/og\/.+\.png$/, `${r.key}: image must be a card in /og`);
    }
});

test('paths and keys are unique across both lists', () => {
    const all = [...SEO_ROUTES, ...SHARE_ROUTES];
    const paths = all.map((r) => r.path);
    const keys = all.map((r) => r.key);
    assert.equal(new Set(paths).size, paths.length, 'duplicate path');
    assert.equal(new Set(keys).size, keys.length, 'duplicate key');
});

test('share routes are noindex, carry no canonical, and stay out of the sitemap', () => {
    const xml = sitemap();
    for (const route of SHARE_ROUTES) {
        const head = headFor({...route, noindex: true});
        assert.ok(head.includes('content="noindex,nofollow"'), `${route.key}: not noindex`);
        assert.ok(!head.includes('rel="canonical"'), `${route.key}: canonical contradicts noindex`);
        assert.ok(head.includes(`content="https://satduel.com${route.image}"`), `${route.key}: wrong card`);
        assert.ok(!xml.includes(`${route.path}</loc>`), `${route.key}: leaked into the sitemap`);
    }
});

test('public routes stay indexable and keep their canonical', () => {
    const head = headFor(seoMeta('partyGame'));
    assert.ok(head.includes('content="index,follow"'));
    assert.ok(head.includes('rel="canonical"'));
});

test('seoMeta throws on an unknown key rather than rendering blank tags', () => {
    assert.throws(() => seoMeta('nope'), /Unknown SEO route key/);
});

test('render swaps only the marked block, keeping scripts and the app mount', () => {
    const out = render(SHELL, seoMeta('partyGame'));

    assert.ok(out.includes('https://satduel.com/og/party.png'), 'party card missing');
    assert.ok(out.includes('<link data-rh="true" rel="canonical" href="https://satduel.com/sat-party-game"/>'));
    assert.ok(!out.includes('content="fallback"'), 'fallback description survived');
    assert.ok(!out.includes('seo:start'), 'markers leaked into output');

    // Everything outside the markers must be untouched.
    assert.ok(out.includes("gtag('config', 'G-X')"), 'analytics dropped');
    assert.ok(out.includes('<div id="root"></div>'), 'app mount dropped');
    assert.ok(out.includes('<link rel="manifest" href="/manifest.json"/>'), 'manifest dropped');
});

test('render appends the site name to a title that lacks it, like <SEO> does', () => {
    assert.match(render(SHELL, seoMeta('pricing')), /<title>SAT Duel Pricing<\/title>/);
    assert.match(render(SHELL, seoMeta('about')), /<title>About SAT Duel<\/title>/);
    assert.match(render(SHELL, seoMeta('partyGame')), /<title>SAT Party Game: .* \| SAT Duel<\/title>/);
});

test('every managed tag carries data-rh so helmet replaces rather than duplicates', () => {
    const head = headFor(seoMeta('home'));
    const tags = head.match(/<(meta|link)\b[^>]*>/g);
    for (const tag of tags) {
        assert.ok(tag.includes('data-rh="true"'), `missing data-rh: ${tag}`);
    }
});

test('quotes in copy are escaped so they cannot break out of an attribute', () => {
    const head = headFor({
        path: '/x', image: '/og/default.png', title: 'A " B',
        description: 'say "hi" & <bye>',
    });
    assert.ok(head.includes('content="say &quot;hi&quot; &amp; &lt;bye&gt;"'));
    assert.ok(!/content="[^"]*"[^/>]*"/.test(head), 'unescaped quote broke an attribute');
});

test('render fails loudly if the markers are removed from index.html', () => {
    assert.throws(() => render('<html><head></head></html>', seoMeta('home')), /markers are missing/);
});

test('robots.txt does not block a route that has a share card', async () => {
    const {readFile} = await import('node:fs/promises');
    const robots = await readFile(new URL('../../public/robots.txt', import.meta.url), 'utf8');
    const blocked = robots.split('\n')
        .filter((l) => l.startsWith('Disallow:'))
        .map((l) => l.replace('Disallow:', '').trim());

    for (const route of SHARE_ROUTES) {
        // Blocking the fetch would hide the noindex AND kill the link preview.
        const hit = blocked.find((b) => route.path === b || route.path.startsWith(`${b}/`));
        assert.equal(hit, undefined, `${route.path} has a share card but robots.txt blocks ${hit}`);
    }
});

test('sitemap lists every route exactly once, absolute', () => {
    const xml = sitemap();
    assert.equal(xml.match(/<loc>/g).length, SEO_ROUTES.length);
    for (const r of SEO_ROUTES) {
        assert.ok(xml.includes(`<loc>https://satduel.com${r.path === '/' ? '/' : r.path}</loc>`), `${r.key} missing`);
    }
});
