'use client';

import { useEffect, useState } from 'react';
import { isAdsEnabled, isAdsEnabledSync } from '@/lib/config/ads';

/**
 * AdLoader - Client component that conditionally loads ad scripts.
 *
 * Uses runtime config (remote or hardcoded) to decide whether to load ads.
 * This runs on the client after hydration, so remote config fetch works.
 *
 * Monetag vignette banner is loaded inline (no separate .js file)
 * to avoid Cloudflare 403 issues on static .js files.
 */
export function AdLoader() {
  const [adsEnabled, setAdsEnabled] = useState(isAdsEnabledSync());

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const enabled = await isAdsEnabled();
      if (!cancelled) {
        setAdsEnabled(enabled);
      }
    }

    check();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!adsEnabled) return;

    // Load Monetag vignette banner (inline, no separate .js file)
    const s = document.createElement('script');
    s.dataset.zone = '11117037';
    s.src = 'https://n6wxm.com/vignette.min.js';
    s.async = true;
    document.body.appendChild(s);

    return () => {
      // Cleanup: remove script when component unmounts
      const existing = document.querySelector('script[data-zone="11117037"]');
      if (existing) existing.remove();
    };
  }, [adsEnabled]);

  if (!adsEnabled) return null;

  return null;
}
