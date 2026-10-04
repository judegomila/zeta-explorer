/**
 * Text renderer for the concept expositions (src/data/concept-expositions/*).
 *
 * Exposition text cross-references other concepts by registry slug, either as a bare
 * parenthetical "(critical-line)" or inline ("… (twin-ladder: a scattering model …)",
 * "slug riemann-zeta-function"). makeConceptRich(idx, opts) returns rich(text) which:
 *   1. turns bare hyphenated slugs into <ConceptTerm> labelled with the concept's name
 *      (dropping a preceding word "slug");
 *   2. removes "(slug)" / "(slug, slug)" parentheticals and links the first occurrence of each
 *      concept alias in the remaining text (shared `seen` set: one link per concept per page);
 *   3. for a removed parenthetical whose concept was not linked in that string or earlier on the
 *      page, inserts a small ↗ marker ConceptTerm in its place.
 * Create one rich() per render and call it in reading order.
 */
import React from 'react';
import ConceptTerm from './ConceptTerm.jsx';
import { findConceptMatches } from './conceptRegistryClient.js';

const PAREN = /\s?\(\s*([a-z0-9]+(?:-[a-z0-9]+)*(?:\s*[,;]\s*[a-z0-9]+(?:-[a-z0-9]+)*)*)\s*\)/g;
// No lookbehind (older Safari): the preceding character is captured in group 1 and kept as text.
const BARE = /(^|[^\p{L}\p{N}_-])(slug\s+)?([a-z0-9]+(?:-[a-z0-9]+)+)(?![\p{L}\p{N}_-])/gu;

export function makeConceptRich(idx, { exclude = [], nested = false } = {}) {
  const seen = new Set();
  const excl = new Set(exclude);
  let n = 0;

  return function rich(text) {
    if (typeof text !== 'string' || !text) return text ?? null;
    if (!idx) return text;
    const k = (n += 1);

    // Pass 1: split out slug parentheticals and bare slugs.
    const segs = [];
    let at = 0;
    const pushText = (s) => { if (s) segs.push({ t: 'text', s }); };
    const handleBare = (chunk) => {
      let a = 0; let m;
      BARE.lastIndex = 0;
      while ((m = BARE.exec(chunk))) {
        const slug = m[3];
        const c = idx.bySlug.get(slug);
        if (!c) continue;
        const start = m.index + m[1].length;
        const end = m.index + m[0].length;
        const after = chunk[end];
        if (!m[2] && chunk.slice(Math.max(0, start - 2), start) === ', ' && (after === ')' || after === ',')) {
          // "(the critical strip, critical-strip)" / "the Fourier transform, fourier-transform, which":
          // the slug repeats the phrase before it, so it becomes a marker after that phrase.
          pushText(chunk.slice(a, start - 2));
          segs.push({ t: 'marker', slugs: [slug] });
        } else {
          pushText(chunk.slice(a, start));
          if (m[2]) pushText('see ');
          segs.push({ t: 'term', slug, label: c.term });
        }
        a = end;
      }
      pushText(chunk.slice(a));
    };
    PAREN.lastIndex = 0;
    let m;
    while ((m = PAREN.exec(text))) {
      const slugs = m[1].split(/\s*[,;]\s*/);
      if (!slugs.every((s) => idx.bySlug.has(s))) continue;
      handleBare(text.slice(at, m.index));
      segs.push({ t: 'marker', slugs });
      at = m.index + m[0].length;
    }
    handleBare(text.slice(at));

    // Pass 2: link aliases in text segments; mark bare-slug terms as seen.
    for (const s of segs) if (s.t === 'term') seen.add(s.slug);
    const out = [];
    segs.forEach((s, i) => {
      if (s.t === 'term') {
        if (excl.has(s.slug)) { out.push(s.label); return; }
        out.push(<ConceptTerm key={`r${k}-${i}`} slug={s.slug} nested={nested}>{s.label}</ConceptTerm>);
        return;
      }
      if (s.t === 'marker') { out.push(s); return; }
      const matches = findConceptMatches(idx, s.s, { seen, exclude: excl });
      let a = 0;
      matches.forEach((mm, j) => {
        if (mm.start > a) out.push(s.s.slice(a, mm.start));
        out.push(<ConceptTerm key={`r${k}-${i}-${j}`} slug={mm.slug} nested={nested}>{s.s.slice(mm.start, mm.end)}</ConceptTerm>);
        a = mm.end;
      });
      if (a < s.s.length) out.push(s.s.slice(a));
    });

    // Pass 3: resolve markers now that this string's links are known; typeset plain-text
    // sub/superscripts ("x_{k+1}", "n^{−s}", "H_t") in the remaining text.
    return out.flatMap((x, i) => {
      if (typeof x === 'string') return prettyScripts(x, `r${k}-p${i}`);
      if (!x || typeof x !== 'object' || x.t !== 'marker') return [x];
      return x.slugs
        .filter((slug) => !excl.has(slug) && !seen.has(slug) && seen.add(slug))
        .map((slug, j) => <ConceptTerm key={`r${k}-m${i}-${j}`} slug={slug} nested={nested} marker />);
    });
  };
}

// Plain-text math notation used in the exposition prose: "_{…}" / "^{…}" become <sub>/<sup>,
// and a single-letter base (optionally after "d" or a superscript digit: "dx_k", "g²T_j") followed by "_x" (1–4 letters/digits) becomes base<sub>x</sub>.
// Identifiers such as acb_dirichlet_platt are untouched (the base must be a lone letter).
const SCRIPT = /([_^])\{([^{}]*)\}|(^d?|[^\p{L}\p{N}_./-]d?|[²³⁴])([\p{L}])_([\p{L}\p{N}∞]{1,4})(?![\p{L}\p{N}_])/gu;
export function prettyScripts(str, keyBase = 's') {
  if (!str || (str.indexOf('_') < 0 && str.indexOf('^{') < 0)) return [str];
  const res = [];
  let a = 0; let m; let j = 0;
  SCRIPT.lastIndex = 0;
  while ((m = SCRIPT.exec(str))) {
    if (m[1]) {
      if (m.index > a) res.push(str.slice(a, m.index));
      const Tag = m[1] === '_' ? 'sub' : 'sup';
      res.push(<Tag key={`${keyBase}-${j += 1}`}>{m[2]}</Tag>);
    } else {
      const head = m.index + m[3].length + m[4].length;
      if (head > a) res.push(str.slice(a, head));
      res.push(<sub key={`${keyBase}-${j += 1}`}>{m[5]}</sub>);
    }
    a = m.index + m[0].length;
  }
  if (a < str.length) res.push(str.slice(a));
  return res;
}
