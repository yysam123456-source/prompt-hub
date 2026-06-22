import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('public/data/prompts.json', 'utf-8'));
const items = data.items || [];

const OUT_DIR = 'public/images/prompts';
fs.mkdirSync(OUT_DIR, { recursive: true });

// Build unique URL list
const urlMap = new Map();
items.forEach(item => {
  if (item.primaryImage?.remoteUrl && !urlMap.has(item.primaryImage.remoteUrl)) {
    urlMap.set(item.primaryImage.remoteUrl, item.slug);
  }
});

const total = urlMap.size;
let done = 0;
let failedCount = 0;
let skipped = 0;

async function downloadBatch(entries, concurrency = 15) {
  const results = new Map();

  async function worker(queue) {
    while (queue.length > 0) {
      const { url, slug } = queue.shift();
      const outFile = path.join(OUT_DIR, slug + '.jpg');

      // Skip if already exists and has content
      if (fs.existsSync(outFile)) {
        const stat = fs.statSync(outFile);
        if (stat.size > 1000) {
          skipped++;
          done++;
          results.set(url, '/images/prompts/' + slug + '.jpg');
          if (done % 50 === 0 || done === total) {
            console.log('[' + done + '/' + total + '] ' + skipped + ' skipped, ' + failedCount + ' failed');
          }
          continue;
        }
      }

      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);

        const res = await fetch(url, {
          signal: controller.signal,
          headers: { 'Accept': 'image/*' }
        });

        clearTimeout(timer);

        if (!res.ok) throw new Error('HTTP ' + res.status);

        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length < 500) throw new Error('Too small: ' + buf.length + ' bytes');

        fs.writeFileSync(outFile, buf);
        results.set(url, '/images/prompts/' + slug + '.jpg');
        done++;

        if (done % 20 === 0 || done === total) {
          process.stdout.write('\r[' + done + '/' + total + '] ' + failedCount + ' fail, ' + skipped + ' skip     ');
        }
      } catch (e) {
        failedCount++;
        done++;
        results.set(url, null);
        if (done % 50 === 0 || done === total) {
          console.log('\n[' + done + '/' + total + '] Failed: ' + slug + ' - ' + e.message.substring(0, 60));
        }
      }
    }
  }

  const queues = Array.from({ length: concurrency }, () => []);
  entries.forEach((u, i) => queues[i % concurrency].push(u));

  await Promise.all(queues.map(q => worker(q)));
  return results;
}

console.log('Starting download of ' + total + ' images...');
const entries = Array.from(urlMap.entries()).map(function(arr) {
  return { url: arr[0], slug: arr[1] };
});
const resultMap = await downloadBatch(entries, 15);

console.log('\n\nDone! Downloaded: ' + (done - failedCount - skipped) + ', Skipped: ' + skipped + ', Failed: ' + failedCount);

// Update prompts.json with local paths
let updated = 0;
items.forEach(function(item) {
  if (item.primaryImage && item.primaryImage.remoteUrl) {
    const localPath = resultMap.get(item.primaryImage.remoteUrl);
    if (localPath) {
      item.primaryImage.remoteUrl = localPath;
      updated++;
    }
  }
});

fs.writeFileSync('public/data/prompts.json', JSON.stringify(data, null, 2));
console.log('Updated ' + updated + ' items with local image paths');
