/**
 * Ad configuration module
 *
 * Centralized control via craftisle-configs repo.
 * All Craftisle projects read from the same URL.
 */

// Hardcoded fallback (used when remote config is unavailable)
export const ADS_ENABLED = true;

// Set to true to fetch ad config from central URL
export const USE_REMOTE_CONFIG = true;

// Central config URL - all projects read from this same file
export const ADS_REMOTE_URL =
  'https://raw.githubusercontent.com/yysam123456-source/craftisle-configs/main/configs/ads-config.json';

const REMOTE_CACHE_TTL = 300_000;

let remoteCache: { value: boolean; fetchedAt: number } | null = null;

export interface AdsRemoteConfig {
  enabled: boolean;
  updatedAt: string;
  note?: string;
}

export async function isAdsEnabled(): Promise<boolean> {
  if (typeof window === 'undefined') return ADS_ENABLED;

  const override = localStorage.getItem('ads_override');
  if (override === 'true') return true;
  if (override === 'false') return false;

  if (USE_REMOTE_CONFIG && ADS_REMOTE_URL) {
    const cached = remoteCache;
    const now = Date.now();
    if (cached && now - cached.fetchedAt < REMOTE_CACHE_TTL) {
      return cached.value;
    }

    try {
      const res = await fetch(`${ADS_REMOTE_URL}?_t=${now}`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const config: AdsRemoteConfig = await res.json();
        remoteCache = { value: config.enabled, fetchedAt: now };
        return config.enabled;
      }
    } catch {
      // fetch failed - fall through to hardcoded fallback
    }
  }

  return ADS_ENABLED;
}

export function isAdsEnabledSync(): boolean {
  if (typeof window === 'undefined') return ADS_ENABLED;

  const override = localStorage.getItem('ads_override');
  if (override === 'true') return true;
  if (override === 'false') return false;

  return ADS_ENABLED;
}
