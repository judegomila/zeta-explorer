/**
 * Memoization utilities for expensive visualization computations.
 *
 * Provides LRU-bounded caches so that repeated calls with identical parameters
 * (e.g., during React re-renders) return instantly from cache.
 */

const DEFAULT_MAX_SIZE = 100;

/** Registry of all active caches — enables global `clearAllCaches()`. */
const _allCaches = [];

// ─── LRU Cache ───────────────────────────────────────────────────────────────

class LRUCache {
  constructor(maxSize = DEFAULT_MAX_SIZE) {
    this.maxSize = maxSize;
    /** Map preserves insertion order; we re-insert on access to maintain LRU. */
    this._map = new Map();
  }

  has(key) {
    return this._map.has(key);
  }

  get(key) {
    if (!this._map.has(key)) return undefined;
    // Move to end (most-recently used)
    const value = this._map.get(key);
    this._map.delete(key);
    this._map.set(key, value);
    return value;
  }

  set(key, value) {
    if (this._map.has(key)) {
      this._map.delete(key);
    } else if (this._map.size >= this.maxSize) {
      // Evict least-recently used (first key)
      const lruKey = this._map.keys().next().value;
      this._map.delete(lruKey);
    }
    this._map.set(key, value);
  }

  clear() {
    this._map.clear();
  }

  get size() {
    return this._map.size;
  }
}

// ─── memoize ─────────────────────────────────────────────────────────────────

/**
 * Memoize a pure function with LRU eviction.
 *
 * @param {Function} fn          - The function to memoize.
 * @param {Function} [keyFn]     - Derives a cache key from the arguments.
 *                                  Defaults to JSON.stringify(args).
 * @param {number}   [maxSize]   - Maximum cache entries (default 100).
 * @returns {Function} Memoized wrapper with the same signature as `fn`.
 *          The wrapper exposes `.cache` (the LRUCache) and `.clear()`.
 */
export function memoize(fn, keyFn, maxSize = DEFAULT_MAX_SIZE) {
  const cache = new LRUCache(maxSize);
  _allCaches.push(cache);

  const defaultKeyFn = (...args) => JSON.stringify(args);
  const resolvedKeyFn = keyFn || defaultKeyFn;

  function memoized(...args) {
    const key = resolvedKeyFn(...args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }

  memoized.cache = cache;
  memoized.clear = () => cache.clear();
  return memoized;
}

// ─── memoizeWithTTL ──────────────────────────────────────────────────────────

/**
 * Memoize with a time-to-live. Entries auto-expire after `ttlMs` milliseconds.
 *
 * @param {Function} fn       - The function to memoize.
 * @param {Function} [keyFn]  - Cache key derivation (default: JSON.stringify).
 * @param {number}   ttlMs    - Time-to-live in milliseconds.
 * @param {number}   [maxSize]- Maximum cache entries (default 100).
 * @returns {Function} Memoized wrapper. Exposes `.cache` and `.clear()`.
 */
export function memoizeWithTTL(fn, keyFn, ttlMs, maxSize = DEFAULT_MAX_SIZE) {
  const cache = new LRUCache(maxSize);
  _allCaches.push(cache);

  const defaultKeyFn = (...args) => JSON.stringify(args);
  const resolvedKeyFn = keyFn || defaultKeyFn;

  function memoized(...args) {
    const key = resolvedKeyFn(...args);
    if (cache.has(key)) {
      const entry = cache.get(key);
      if (Date.now() - entry.timestamp < ttlMs) {
        return entry.value;
      }
      // Expired — fall through to recompute
    }
    const result = fn(...args);
    cache.set(key, { value: result, timestamp: Date.now() });
    return result;
  }

  memoized.cache = cache;
  memoized.clear = () => cache.clear();
  return memoized;
}

// ─── clearAllCaches ──────────────────────────────────────────────────────────

/**
 * Clear every memoization cache created by `memoize` or `memoizeWithTTL`.
 * Useful for tests or when global parameters change (e.g., precision settings).
 */
export function clearAllCaches() {
  for (const cache of _allCaches) {
    cache.clear();
  }
}
