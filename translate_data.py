#!/usr/bin/env python3
"""Batch translate prompt-hub data Chinese -> English. Parallel version."""

import json
import urllib.request
import urllib.parse
import time
import os
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

DATA_FILE = 'public/data/prompts.json'
CACHE_FILE = 'public/data/translate_cache.json'
TAG_CACHE_FILE = 'public/data/translate_cache_tags.json'
MAX_WORKERS = 10
BATCH_SIZE = 30

def translate_batch(texts, src='zh-CN', dst='en'):
    if not texts:
        return texts
    joined = ' ||| '.join(str(t) for t in texts)
    encoded = urllib.parse.quote(joined)
    url = f'https://translate.googleapis.com/translate_a/single?client=gtx&sl={src}&tl={dst}&dt=t&q={encoded}'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
            translated = ''.join(seg[0] for seg in data[0] if seg[0])
            parts = translated.split(' ||| ')
            if len(parts) == len(texts):
                return [p.strip() for p in parts]
            return [translated.strip() if i == 0 else texts[i] for i in range(len(texts))]
    except Exception as e:
        return list(texts)  # return originals on error

def translate_chunk(chunk_texts):
    """Wrapper for thread pool."""
    return translate_batch(chunk_texts)

# Load data
print('Loading prompts.json...')
with open(DATA_FILE, 'r', encoding='utf-8') as f:
    prompts = json.load(f)
print(f'Total prompts: {len(prompts)}')

# Load caches
title_cache = {}
tag_cache = {}
if os.path.exists(CACHE_FILE):
    with open(CACHE_FILE, 'r', encoding='utf-8') as f:
        title_cache = json.load(f)
    print(f'✓ Loaded title cache: {len(title_cache)} entries')
if os.path.exists(TAG_CACHE_FILE):
    with open(TAG_CACHE_FILE, 'r', encoding='utf-8') as f:
        tag_cache = json.load(f)
    print(f'✓ Loaded tag cache: {len(tag_cache)} entries')

# ========== 1. Translate titles ==========
print('\n=== Step 1: Translating titles ===')
uniq_titles = list(set(
    p.get('title', '') for p in prompts
    if p.get('title', '') and p.get('title', '') not in title_cache
))
print(f'Unique titles to translate: {len(uniq_titles)} (cache hit: {len(title_cache)})')

# Process in parallel
chunks = [uniq_titles[i:i+BATCH_SIZE] for i in range(0, len(uniq_titles), BATCH_SIZE)]
print(f'Processing {len(chunks)} batches with {MAX_WORKERS} workers...')

start = time.time()
completed = 0
with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
    futures = {executor.submit(translate_batch, chunk): i for i, chunk in enumerate(chunks)}
    for future in as_completed(futures):
        idx = futures[future]
        try:
            results = future.result()
            chunk = chunks[idx]
            for orig, eng in zip(chunk, results):
                title_cache[orig] = eng
        except Exception as e:
            print(f'  ✗ Batch {idx} failed: {e}')
        completed += 1
        if completed % 10 == 0:
            print(f'  ✓ {completed}/{len(chunks)} batches ({len(title_cache)} cached)', end='\r')
        # Save cache periodically
        if completed % 50 == 0:
            with open(CACHE_FILE, 'w', encoding='utf-8') as f:
                json.dump(title_cache, f, ensure_ascii=False)

print(f'\n✓ Translated {len(uniq_titles)} unique titles in {time.time()-start:.1f}s')

# Apply titles
for p in prompts:
    t = p.get('title', '')
    if t in title_cache:
        p['titleEn'] = title_cache[t]
        p['title'] = title_cache[t]  # replace with English

# ========== 2. Translate tags ==========
print('\n=== Step 2: Translating tags ===')
all_tags = set()
for p in prompts:
    for t in p.get('tags', []):
        all_tags.add(t)

chinese_tags = [t for t in all_tags
                if t and any('\u4e00' <= c <= '\u9fff' for c in t)
                and t not in tag_cache]
print(f'Chinese tags to translate: {len(chinese_tags)}/{len(all_tags)} unique')

if chinese_tags:
    chunks = [chinese_tags[i:i+BATCH_SIZE] for i in range(0, len(chinese_tags), BATCH_SIZE)]
    print(f'Processing {len(chunks)} batches with {MAX_WORKERS} workers...')
    start = time.time()
    completed = 0
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(translate_batch, chunk): i for i, chunk in enumerate(chunks)}
        for future in as_completed(futures):
            idx = futures[future]
            try:
                results = future.result()
                chunk = chunks[idx]
                for orig, eng in zip(chunk, results):
                    tag_cache[orig] = eng.title()
            except Exception as e:
                print(f'  ✗ Batch {idx} failed: {e}')
            completed += 1
            if completed % 10 == 0:
                print(f'  ✓ {completed}/{len(chunks)} batches', end='\r')
            if completed % 50 == 0:
                with open(TAG_CACHE_FILE, 'w', encoding='utf-8') as f:
                    json.dump(tag_cache, f, ensure_ascii=False)

    print(f'\n✓ Translated {len(chinese_tags)} tags in {time.time()-start:.1f}s')

# Apply tags
for p in prompts:
    new_tags = []
    for t in p.get('tags', []):
        new_tags.append(tag_cache.get(t, t))
    p['tags'] = new_tags

# ========== 3. Save ==========
print('\n=== Saving ===')
with open(DATA_FILE, 'w', encoding='utf-8') as f:
    json.dump(prompts, f, ensure_ascii=False, indent=2)

with open(CACHE_FILE, 'w', encoding='utf-8') as f:
    json.dump(title_cache, f, ensure_ascii=False)
with open(TAG_CACHE_FILE, 'w', encoding='utf-8') as f:
    json.dump(tag_cache, f, ensure_ascii=False)

# Verify
en_count = sum(1 for p in prompts if not any('\u4e00' <= c <= '\u9fff' for c in p.get('title','')))
tag_en_count = sum(1 for p in prompts
                  for t in p.get('tags',[])
                  if any('\u4e00' <= c <= '\u9fff' for c in t))
print(f'✓ Saved to {DATA_FILE}')
print(f'✓ Titles in English: {en_count}/{len(prompts)}')
print(f'✓ Prompts with Chinese tags: {tag_en_count}')
print('\nDone!')
