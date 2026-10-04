/**
 * Client-side access to src/data/concepts-registry.js for ConceptTerm / ConceptText.
 *
 * The registry (~110 KB) is loaded with a dynamic import so that pages in the main bundle (the home
 * page) do not carry it; the first ConceptTerm on a page starts the load and every subscriber
 * re-renders once it resolves. Pages that import the registry statically (the concept pages) get
 * the same module instance, so this resolves immediately there.
 */
import { useEffect, useSyncExternalStore } from 'react';

let index = null;
let promise = null;
const listeners = new Set();

// Unicode letter/number/underscore: an alias must not start or end inside a word.
const WORD = /[\p{L}\p{N}_]/u;

function buildIndex(m) {
  const bySlug = new Map(m.CONCEPTS_REGISTRY.map((c) => [c.slug, c]));
  const classBySlug = new Map(m.CONCEPT_CLASSES.map((k) => [k.slug, k]));
  // Short aliases that contain capitals (RH, GUE, Arb, Λ, T3 ...) match case-sensitively; the rest
  // case-insensitively. ALIAS_INDEX is already sorted longest-first.
  const matchers = m.ALIAS_INDEX
    .filter((r) => r.alias.trim().length >= 1)
    .map((r) => {
      const alias = r.alias;
      const cs = alias.length <= 4 && alias !== alias.toLowerCase();
      return {
        alias,
        slug: r.slug,
        cs,
        needle: cs ? alias : alias.toLowerCase(),
        boundStart: WORD.test(alias[0]),
        boundEnd: WORD.test(alias[alias.length - 1]),
      };
    });
  return {
    registry: m.CONCEPTS_REGISTRY,
    classes: m.CONCEPT_CLASSES,
    bySlug,
    classBySlug,
    find: m.findConcept,
    matchers,
  };
}

function emit() { listeners.forEach((l) => l()); }

/** Start (or reuse) the registry load. Resolves to the index; never rejects (logs and resolves null). */
export function loadConceptRegistry() {
  if (!promise) {
    promise = import('../data/concepts-registry.js')
      .then((m) => { index = buildIndex(m); emit(); return index; })
      .catch((err) => {
        // A failed load leaves terms as plain text; retry on the next call.
        console.error('concepts-registry failed to load', err); // eslint-disable-line no-console
        promise = null;
        return null;
      });
  }
  return promise;
}

/** The loaded index, or null if it has not resolved yet. */
export function getConceptIndex() { return index; }

function subscribe(cb) { listeners.add(cb); return () => listeners.delete(cb); }
const snapshot = () => index;

/** React hook: returns the index (null until loaded) and triggers the load on first use. */
export function useConceptIndex() {
  const idx = useSyncExternalStore(subscribe, snapshot, snapshot);
  useEffect(() => { if (!index) loadConceptRegistry(); }, []);
  return idx;
}

/** Resolve a concept by slug, term or alias against a loaded index. */
export function resolveConcept(idx, slugOrTerm) {
  if (!idx || slugOrTerm == null || slugOrTerm === '') return null;
  return idx.bySlug.get(String(slugOrTerm)) || idx.find(String(slugOrTerm)) || null;
}

// Segments that must not be scanned: markdown links, bare URLs, $…$ TeX, `code`, HTML anchors.
const PROTECTED = /\[[^\]\n]*\]\([^)\n]*\)|https?:\/\/[^\s)]+|\$\$[\s\S]*?\$\$|\$[^$\n]+\$|`[^`\n]*`|<a\b[^>]*>[\s\S]*?<\/a>/gi;

function isBoundaryOk(text, start, end, m) {
  if (m.boundStart && start > 0 && WORD.test(text[start - 1])) return false;
  if (m.boundEnd && end < text.length && WORD.test(text[end])) return false;
  return true;
}

/**
 * Find concept matches in a plain string. Longest alias first; for each concept, its first
 * occurrence that does not overlap an earlier (longer) claim. Returns [{start, end, slug}] sorted.
 *
 * opts.exclude: iterable of slugs never to link; opts.seen: Set of slugs already linked in this
 * scope (mutated: matched slugs are added); opts.max: cap on links in this string.
 */
export function findConceptMatches(idx, text, opts = {}) {
  if (!idx || typeof text !== 'string' || !text) return [];
  const exclude = opts.exclude instanceof Set ? opts.exclude : new Set(opts.exclude || []);
  const seen = opts.seen || new Set();
  const max = opts.max ?? Infinity;

  const claimed = []; // [start, end)
  let p;
  PROTECTED.lastIndex = 0;
  while ((p = PROTECTED.exec(text))) claimed.push([p.index, p.index + p[0].length, null]);

  const lower = text.toLowerCase();
  const lowerOk = lower.length === text.length;
  const overlaps = (s, e) => claimed.some(([a, b]) => s < b && e > a);
  const out = [];

  for (const m of idx.matchers) {
    if (out.length >= max) break;
    if (seen.has(m.slug) || exclude.has(m.slug)) continue;
    const hay = m.cs || !lowerOk ? text : lower;
    const needle = m.cs || !lowerOk ? m.alias : m.needle;
    let from = 0;
    while (from <= hay.length - needle.length) {
      const at = hay.indexOf(needle, from);
      if (at < 0) break;
      const end = at + needle.length;
      if (isBoundaryOk(text, at, end, m) && !overlaps(at, end)) {
        claimed.push([at, end, m.slug]);
        out.push({ start: at, end, slug: m.slug });
        seen.add(m.slug);
        break;
      }
      from = at + 1;
    }
  }
  return out.sort((a, b) => a.start - b.start);
}
