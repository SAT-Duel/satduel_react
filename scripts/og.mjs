/**
 * Render every OG card in docs/og-image.html to public/og/<key>.png.
 *
 *     npm run og
 *
 * Cards are committed, so this only needs re-running when the copy or design
 * in docs/og-image.html changes. Uses headless Chrome because the card is a
 * real web page — no image library to keep in sync with the design.
 */
import {createServer} from 'node:http';
import {execFile} from 'node:child_process';
import {readFile, mkdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {promisify} from 'node:util';
import {extname, join, normalize} from 'node:path';
import {fileURLToPath} from 'node:url';

const execFileAsync = promisify(execFile);
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(ROOT, 'public/og');
const PORT = 8123;

// Keys must match VARIANTS in docs/og-image.html.
const VARIANTS = [
    'default', 'practice', 'math', 'english',
    'party', 'tournaments', 'studyGuide', 'diagnostic',
];

const CHROME = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
].find((p) => existsSync(p));

const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
};

// Serves the repo root so docs/og-image.html can reach ../public/logo512.png.
function serve() {
    const server = createServer(async (req, res) => {
        const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
        // normalize() collapses "..", so a leading one is the only escape to block.
        if (path.startsWith('..')) {
            res.writeHead(403).end();
            return;
        }
        try {
            const body = await readFile(join(ROOT, path));
            res.writeHead(200, {'Content-Type': TYPES[extname(path)] || 'application/octet-stream'});
            res.end(body);
        } catch {
            res.writeHead(404).end();
        }
    });
    return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

async function main() {
    if (!CHROME) {
        console.error('No Chrome/Chromium found. Install Google Chrome, then re-run.');
        process.exit(1);
    }

    await mkdir(OUT, {recursive: true});
    const server = await serve();

    try {
        for (const key of VARIANTS) {
            await execFileAsync(CHROME, [
                '--headless',
                '--disable-gpu',
                '--hide-scrollbars',
                '--force-device-scale-factor=1',
                '--window-size=1200,630',
                `--screenshot=${join(OUT, `${key}.png`)}`,
                // Fonts load from Google Fonts; give the page time to swap them in
                // before the shot, or the cards render in a fallback face.
                '--virtual-time-budget=5000',
                `http://localhost:${PORT}/docs/og-image.html?v=${key}`,
            ]);
            console.log(`  og/${key}.png`);
        }
        console.log(`\n${VARIANTS.length} cards written to public/og/`);
    } finally {
        server.close();
    }
}

main();
