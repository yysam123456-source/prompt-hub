import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('public/data/prompts.json', 'utf-8'));
const items = data.items || [];

const OUT_DIR = 'public/images/prompts';
fs.mkdirSync(OUT_DIR, { recursive: true });

// Find items that still need images
const toDownload = [];
items.forEach(function(item) {
  const outFile = path.join(OUT_DIR, item.slug + '.jpg');
  if (!fs.existsSync(outFile) || fs.statSync(outFile).size < 1000) {
    toDownload.push(item.slug);
  }
});

console.log('Need to download: ' + toDownload.length + ' images via picsum.photos');
console.log('Using 20 concurrent connections...');

let done = 0;
let failed = 0;
let success = 0;
const total = toDownload.length;

async function worker(queue) {
  while (queue.length > 0) {
    const slug = queue.shift();
    const outFile = path.join(OUT_DIR, slug + '.jpg');

    // Use seed-based URL for deterministic images per slug
    // picsum.photos/seed/{slug}/400/400 gives consistent image for same slug
    const url = 'https://picsum.photos/seed/' + slug + '/400/400';

    try {
      const controller = new AbortController();
      const timer = setTimeout(function() { controller.abort(); }, 10000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'Accept': 'image/*', 'User-Agent': 'Mozilla/5.0' }
      });

      clearTimeout(timer);

      if (!res.ok) throw new Error('HTTP ' + res.status);

      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 500) throw new Error('Too small: ' + buf.length);

      fs.writeFileSync(outFile, buf);
      success++;
      done++;
    } catch (e) {
      failed++;
      done++;
    }

    if (done % 50 === 0 || done === total) {
      process.stdout.write('\r[' + done + '/' + total + '] OK:' + success + ' Fail:' + failed + '   ');
    }
  }
}

// Split into 20 workers for fast parallel download
const queues = Array.from({ length: 20 }, function() { return []; });
toDownload.forEach(function(slug, i) { queues[i % 20].push(slug); });

await Promise.all(queues.map(function(q) { return worker(q); }));

console.log('\n\n=== Download Complete ===');
console.log('Success:', success, '| Failed:', failed, '| Total:', total);

// Update all prompts.json URLs to local paths
let updated = 0;
let noImage = 0;
items.forEach(function(item) {
  if (!item.primaryImage) {
    item.primaryImage = {};
  }

  const localFile = path.join(OUT_DIR, item.slug + '.jpg');
  if (fs.existsSync(localFile) && fs.statSync(localFile).size > 1000) {
    item.primaryImage.remoteUrl = '/images/prompts/' + item.slug + '.jpg';
    updated++;
  } else {
    // No image available - clear remoteUrl so fallback shows
    item.primaryImage.remoteUrl = undefined;
    noImage++;
  }
});

fs.writeFileSync('public/data/prompts.json', JSON.stringify(data, null, 2));
console.log('\nJSON updated: ' + updated + ' items with local paths, ' + noImage + ' without');
console.log('\nLocal image files: ' + fs.readdirSync(OUT_DIR).length);
