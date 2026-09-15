/**
 * Post-build prune for Cloudflare Pages' 20,000-file deployment ceiling.
 *
 * The problem
 * -----------
 * Next.js App Router emits roughly nine files per prerendered page under
 * `output: 'export'`. Only one of them -- index.html -- is the page. The rest
 * are RSC payload artefacts that exist so the client router can move between
 * routes without a full page load.
 *
 * With 5,213 exported pages that is 46,941 files, which is 2.3x over Cloudflare
 * Pages' hard limit of 20,000 files per deployment. The build itself succeeds in
 * about 90 seconds; the deployment then fails at "Validating asset output
 * directory" with:
 *
 *   Pages only supports up to 20,000 files in a deployment.
 *
 * ...and the site silently keeps serving its previous successful deployment.
 *
 * What we keep
 * ------------
 *   index.html   the page itself
 *   index.txt    the RSC payload the client router fetches for that route
 *   everything else that is not an RSC segment artefact
 *
 * What we drop
 * ------------
 *   __next.*.txt        segment-cache copies of the same payload
 *   __next.<seg>/       nested segment directories
 *
 * Those are a redundant second copy: `__next._full.txt` had the same byte size
 * as `index.txt` on every page sampled. Dropping them takes the deployment from
 * ~47k files to ~10.5k.
 *
 * Why we copy rather than delete
 * ------------------------------
 * Deleting 36,000 files measured at roughly 5 files/sec through Node's
 * fs.rmSync on Windows -- several minutes locally and an unpredictable cost
 * inside a build that already has a 20-minute ceiling. Copying the ~10.5k files
 * we keep is an order of magnitude cheaper and behaves the same on Linux.
 *
 * The raw build output is renamed to `.out-raw` rather than deleted. It sits
 * outside the configured output directory, so it is never uploaded, and the
 * build container discards it.
 *
 * Safety
 * ------
 * Only entries whose name begins with the literal "__next." are skipped. That
 * prefix is deliberately distinct from "_next", which is the real static asset
 * directory and is always copied. robots.txt, llms.txt, sitemap.xml and the
 * IndexNow key file are unaffected.
 *
 * Usage: node scripts/prune-rsc-payloads.js
 * (wired as "postbuild" in package.json, after next build)
 */
const fs = require("node:fs");
const path = require("node:path");

const RSC_PREFIX = "__next.";
const LIMIT = 20000;
const MIN_EXPECTED = 1000; // refuse to swap in a suspiciously empty tree

const root = path.resolve(__dirname, "..");

// PRUNE_OUT_DIR exists so the script can be exercised against a fixture.
const outDir = process.env.PRUNE_OUT_DIR
	? path.resolve(process.env.PRUNE_OUT_DIR)
	: path.join(root, "out");

const parentDir = path.dirname(outDir);
const keepDir = path.join(parentDir, "out.keep");
const rawDir = path.join(parentDir, ".out-raw");

function countFiles(dir) {
	let n = 0;
	const stack = [dir];
	while (stack.length) {
		const cur = stack.pop();
		let entries;
		try {
			entries = fs.readdirSync(cur, { withFileTypes: true });
		} catch {
			continue;
		}
		for (const e of entries) {
			if (e.isDirectory()) stack.push(path.join(cur, e.name));
			else n++;
		}
	}
	return n;
}

/**
 * Copy src -> dst, skipping RSC segment artefacts.
 * Symlinks are copied as-is; the export contains none today, but we do not want
 * to silently turn one into a recursive copy.
 */
function copyFiltered(src, dst) {
	fs.mkdirSync(dst, { recursive: true });
	let copied = 0;

	for (const e of fs.readdirSync(src, { withFileTypes: true })) {
		if (e.name.startsWith(RSC_PREFIX)) continue;

		const s = path.join(src, e.name);
		const d = path.join(dst, e.name);

		if (e.isDirectory()) {
			copied += copyFiltered(s, d);
		} else if (e.isSymbolicLink()) {
			fs.symlinkSync(fs.readlinkSync(s), d);
			copied++;
		} else {
			fs.copyFileSync(s, d);
			copied++;
		}
	}

	return copied;
}

function removeDir(dir) {
	if (!fs.existsSync(dir)) return;
	try {
		fs.rmSync(dir, { recursive: true, force: true, maxRetries: 2 });
	} catch (err) {
		console.warn(`[prune] could not remove ${path.basename(dir)}: ${err.message}`);
	}
}

function main() {
	if (!fs.existsSync(outDir)) {
		console.log("[prune] no out/ directory -- skipped.");
		return;
	}

	const before = countFiles(outDir);

	removeDir(keepDir);
	const copied = copyFiltered(outDir, keepDir);
	const after = countFiles(keepDir);

	if (after < MIN_EXPECTED) {
		console.error(`[prune] filtered copy produced only ${after} files; refusing to swap.`);
		console.error("[prune] leaving the original out/ untouched.");
		removeDir(keepDir);
		process.exitCode = 1;
		return;
	}

	// Swap. Both operations are metadata-only.
	removeDir(rawDir);
	fs.renameSync(outDir, rawDir);
	fs.renameSync(keepDir, outDir);

	console.log("[prune] pruned RSC segment payloads from the export");
	console.log(`        files copied : ${copied}`);
	console.log(`        files before : ${before}`);
	console.log(`        files after  : ${after}`);
	console.log(`        limit        : ${LIMIT}`);

	if (after > LIMIT) {
		console.warn("");
		console.warn(`[warn] out/ still exceeds the Cloudflare Pages limit (${LIMIT}).`);
		console.warn("[warn] The deployment will fail validation. Options: reduce the number");
		console.warn("[warn] of prerendered routes, upgrade the Cloudflare zone to a paid plan");
		console.warn("[warn] (100,000 files), or move to Workers Static Assets.");
	} else {
		console.log(`        headroom     : ${LIMIT - after} files`);
	}
}

main();
