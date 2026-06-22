import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('public/data/prompts.json', 'utf-8'));
const items = data.items || [];

const OUT_DIR = 'public/images/prompts';
fs.mkdirSync(OUT_DIR, { recursive: true });

// Find items that still have pollinations.ai URLs (not yet downloaded)
const toDownload = [];
items.forEach(function(item) {
  if (item.primaryImage && item.primaryImage.remoteUrl) {
    const url = item.primaryImage.remoteUrl;
    if (url.includes('pollinations.ai')) {
      // Check if local file already exists
      const outFile = path.join(OUT_DIR, item.slug + '.jpg');
      if (!fs.existsSync(outFile) || fs.statSync(outFile).size < 1000) {
        toDownload.push({ slug: item.slug, url: url });
      }
    }
  }
});

console.log('Need to download: ' + toDownload.length + ' images (low concurrency mode)');
console.log('Using 2 concurrent, 1.5s delay between requests...');

let done = 0;
let failed = 0;
let success = 0;
const total = toDownload.length;

async function sleep(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

async function worker(queue, workerId) {
  while (queue.length > 0) {
    const { slug, url } = queue.shift();

    // Stagger workers
    if (workerId > 0 && done < 5) await sleep(workerId * 800);
    
    // Rate limit delay for all requests after first few
    if (done >= 3) await sleep(1500);

    const outFile = path.join(OUT_DIR, slug + '.jpg');

    try {
      const controller = new AbortController();
      const timer = setTimeout(function() { controller.abort(); }, 30000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'Accept': 'image/*' }
      });

      clearTimeout(timer);

      if (res.status === 429) {
        // Rate limited - wait longer and retry once
        console.log('[WARN] 429 on ' + slug + ', waiting 8s...');
        await sleep(8000);

        const res2 = await fetch(url, {
          headers: { 'Accept': 'image/*' }
        });
        if (!res2.ok) throw new Error('Retry HTTP ' + res2.status);
        const buf = Buffer.from(await res2.arrayBuffer());
        if (buf.length < 500) throw new Error('Too small');
        fs.writeFileSync(outFile, buf);
        success++;
        done++;
      } else if (!res.ok) {
        throw new Error('HTTP ' + res.status);
      } else {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length < 500) throw new Error('Too small: ' + buf.length);
        fs.writeFileSync(outFile, buf);
        success++;
        done++;
      }

      if (done % 10 === 0 || done === total) {
        process.stdout.write('\r[' + done + '/' + total + '] OK:' + success + ' Fail:' + failed + '   ');
      }
    } catch (e) {
      failed++;
      done++;
      if (done % 30 === 0 || done === total) {
        console.log('\n[FAIL] ' + slug + ': ' + e.message.substring(0, 80));
      }
    }
  }
}

// Split into 2 queues
const queue1 = [];
const queue2 = [];
toDownload.forEach(function(item, i) {
  if (i % 2 === 0) queue1.push(item);
  else queue2.push(item);
});

await Promise.all([worker(queue1, 0), worker(queue2, 1)]);

console.log('\n\n=== Retry Complete ===');
console.log('Success:', success, '| Failed:', failed, '| Total:', total);

// Final update of prompts.json - convert all remaining pollinations URLs to local paths
let updated = 0;
let stillRemote = 0;
items.forEach(function(item) {
  if (item.primaryImage && item.primaryImage.remoteUrl) {
    const url = item.primaryImage.remoteUrl;
    if (url.includes('pollinations.ai')) {
      // Check if file was downloaded this time
      const localFile = path.join(OUT_DIR, item.slug + '.jpg');
      if (fs.existsSync(localFile) && fs.statSync(localFile).size > 1000) {
        item.primaryImage.remoteUrl = '/images/prompts/' + item.slug + '.jpg';
        updated++;
      } else {
        stillRemote++;
      }
    }
  }
});

fs.writeFileSync('public/data/prompts.json', JSON.stringify(data, null, 2));
console.log('\nUpdated ' + updated + ' more items with local paths');
console.log(stillRemote + ' items still have remote URLs (will use fallback)');
