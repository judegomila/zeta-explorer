/**
 * <ConceptText text="…" /> and linkConcepts(text, opts)
 *
 * Wraps the FIRST occurrence of each concept alias in a plain string with <ConceptTerm>
 * (longest alias first, word boundaries, never inside markdown links, URLs, $…$ TeX, `code` or
 * <a>…</a>); everything else is left unchanged. React elements passed in an array are left as
 * they are (so existing links are never re-linked).
 *
 * opts / props:
 *   exclude  – slugs never to link (e.g. the concept a page is about)
 *   seen     – a Set shared across several calls so each concept is linked once per scope;
 *              create it inside the render/useMemo that uses it
 *   max      – cap on links per string
 *   nested   – the text sits inside another link: terms render as <span role="link">
 *
 * The registry loads lazily; until then linkConcepts returns the input unchanged and
 * ConceptText re-renders when it arrives.
 */
import React, { useCallback, useMemo } from 'react';
import ConceptTerm from './ConceptTerm.jsx';
import { getConceptIndex, useConceptIndex, findConceptMatches } from './conceptRegistryClient.js';

function linkString(idx, text, opts, keyPrefix) {
  const matches = findConceptMatches(idx, text, opts);
  if (!matches.length) return text;
  const out = [];
  let at = 0;
  matches.forEach((m, i) => {
    if (m.start > at) out.push(text.slice(at, m.start));
    out.push(
      <ConceptTerm key={`${keyPrefix}-${i}-${m.slug}`} slug={m.slug} nested={!!opts.nested}>
        {text.slice(m.start, m.end)}
      </ConceptTerm>,
    );
    at = m.end;
  });
  if (at < text.length) out.push(text.slice(at));
  return out;
}

/**
 * Link concept aliases in `input` (a string, or an array of strings and React nodes).
 * Returns the input unchanged when the registry has not loaded or nothing matches.
 */
export function linkConcepts(input, opts = {}) {
  const idx = opts.index || getConceptIndex();
  if (!idx || input == null) return input;
  const o = { ...opts, seen: opts.seen || new Set() };
  const prefix = opts.keyPrefix || 'ct';
  if (typeof input === 'string') return linkString(idx, input, o, prefix);
  if (Array.isArray(input)) {
    return input.flatMap((part, i) => {
      if (typeof part !== 'string') return [part];
      const r = linkString(idx, part, o, `${prefix}-${i}`);
      return Array.isArray(r) ? r : [r];
    });
  }
  return input;
}

/**
 * Hook: returns a linker bound to the loaded registry. Call it to get `link(text, opts)`; pair
 * with a Set created in the same render (or useMemo) to link each concept once across many strings.
 */
export function useConceptLinker() {
  const idx = useConceptIndex();
  return useCallback((text, opts = {}) => (idx ? linkConcepts(text, { ...opts, index: idx }) : text), [idx]);
}

export default function ConceptText({ text, exclude, max, nested = false, as: Tag = React.Fragment, className }) {
  const idx = useConceptIndex();
  const excludeKey = Array.isArray(exclude) ? exclude.join('|') : exclude ? String(exclude) : '';
  const nodes = useMemo(
    () => (idx ? linkConcepts(text, { index: idx, exclude: excludeKey ? excludeKey.split('|') : [], max, nested, keyPrefix: 'ctx' }) : text),
    [idx, text, excludeKey, max, nested],
  );
  if (Tag === React.Fragment) return <>{nodes}</>;
  return <Tag className={className}>{nodes}</Tag>;
}
