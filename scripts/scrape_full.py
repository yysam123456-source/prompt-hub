#!/usr/bin/env python3
"""
爬取 prompts.sorry.ink 数据（含 prompt 文本）
用法: python3 scrape_full.py [total_pages] [page_size]
默认: 50 页 x 20 条 = 1000 条
"""

import sys
import os
import json
import time
import urllib.request
import urllib.parse
from datetime import datetime

DATA_DIR = '/Users/Lenovo/WorkBuddy/2026-06-17-14-51-24/prompt-hub/public/data'
LISTS_DIR = f'{DATA_DIR}/lists'
DETAILS_DIR = f'{DATA_DIR}/details'
META_FILE = f'{DATA_DIR}/meta.json'

BASE_URL = 'https://prompts.sorry.ink'

def fetch_json(url, max_retries=3, delay=2):
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(url, headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Referer': 'https://prompts.sorry.ink/',
            })
            with urllib.request.urlopen(req, timeout=15) as resp:
                return json.loads(resp.read())
        except Exception as e:
            print(f'  ⚠️  第{attempt+1}次重试失败: {e}')
            if attempt < max_retries - 1:
                time.sleep(delay * (attempt + 1))
    return None

def transform_list_item(item):
    """列表数据转站点格式"""
    return {
        'id': item.get('id'),
        'slug': item.get('slug'),
        'title_zh': item.get('title', {}).get('zh', ''),
        'title_en': item.get('title', {}).get('en', ''),
        'category_slug': item.get('category', {}).get('slug', ''),
        'category_name_zh': item.get('category', {}).get('name', {}).get('zh', ''),
        'tags': [t.get('name', {}).get('zh', '') for t in item.get('tags', [])],
        'primary_image': item.get('primaryImage'),
        'view_count': item.get('viewCount', 0),
        'like_count': item.get('likeCount', 0),
        'sourceUrl': item.get('sourceUrl', ''),
        'contributor': item.get('contributor', {}).get('name', ''),
    }

def fetch_detail(slug):
    """爬取详情（含 prompt 文本）"""
    encoded = urllib.parse.quote(slug)
    url = f'{BASE_URL}/api/prompts/{encoded}'
    data = fetch_json(url, max_retries=2, delay=1)
    if not data:
        return None
    return {
        'id': data.get('id'),
        'slug': data.get('slug'),
        'title_zh': data.get('title', {}).get('zh', ''),
        'title_en': data.get('title', {}).get('en', ''),
        'prompt': data.get('prompt', {}).get('zh', '') or data.get('prompt', {}).get('en', ''),
        'negative_prompt': data.get('negativePrompt'),
        'notes': data.get('notes'),
        'category_slug': data.get('category', {}).get('slug', ''),
        'category_name_zh': data.get('category', {}).get('name', {}).get('zh', ''),
        'tags': [t.get('name', {}).get('zh', '') for t in data.get('tags', [])],
        'primary_image': data.get('primaryImage'),
        'view_count': data.get('viewCount', 0),
        'like_count': data.get('likeCount', 0),
        'sourceUrl': data.get('sourceUrl', ''),
        'contributor': data.get('contributor', {}).get('name', ''),
    }

def main():
    total_pages = int(sys.argv[1]) if len(sys.argv) > 1 else 50
    page_size = int(sys.argv[2]) if len(sys.argv) > 2 else 20

    print(f'🚀 开始爬取 {total_pages} 页 x {page_size} 条 = {total_pages*page_size} 条')
    print(f'⏰ 预计耗时: {total_pages*page_size*0.5/60:.1f} 分钟')
    print()

    all_items = []
    success_count = 0
    fail_count = 0

    for page in range(1, total_pages + 1):
        url = f'{BASE_URL}/api/prompts?page={page}&pageSize={page_size}&sort=latest'
        print(f'📄 第 {page}/{total_pages} 页...', end=' ', flush=True)

        data = fetch_json(url)
        if not data or 'items' not in data:
            print('❌ 列表获取失败')
            fail_count += 1
            continue

        items = data['items']
        print(f'✅ 获取 {len(items)} 条')

        # 保存列表数据
        list_file = f'{LISTS_DIR}/latest-{page}.json'
        with open(list_file, 'w') as f:
            json.dump([transform_list_item(item) for item in items], f, ensure_ascii=False, indent=2)

        # 逐条爬取详情
        for i, item in enumerate(items):
            slug = item.get('slug')
            if not slug:
                continue

            detail_file = f'{DETAILS_DIR}/{slug}.json'
            # 跳过已存在的
            if os.path.exists(detail_file):
                success_count += 1
                continue

            detail = fetch_detail(slug)
            if detail:
                with open(detail_file, 'w') as f:
                    json.dump(detail, f, ensure_ascii=False, indent=2)
                success_count += 1
                has_prompt = '✅' if detail.get('prompt') else '⚠️  无prompt'
                print(f'  📝 [{i+1}/{len(items)}] {has_prompt} {slug[:30]}')
            else:
                fail_count += 1
                print(f'  ❌ [{i+1}/{len(items)}] 详情获取失败: {slug[:30]}')

            time.sleep(0.3)  # 限速，避免被封

        # 每页完成后保存进度
        meta = {
            'total_crawled': success_count,
            'total_failed': fail_count,
            'last_page': page,
            'updated_at': datetime.now().isoformat(),
        }
        with open(META_FILE, 'w') as f:
            json.dump(meta, f, ensure_ascii=False, indent=2)

        print(f'  📊 进度: 成功 {success_count}, 失败 {fail_count}')
        print()

    print(f'🎉 爬取完成! 成功: {success_count}, 失败: {fail_count}')
    print(f'📁 数据目录: {DATA_DIR}')

if __name__ == '__main__':
    main()
