/**
 * @module concept-expositions/index
 * @fileoverview Lazy loader for the layered concept expositions (area-a/b/c, ~175 KB each).
 * Pages import only this file; the area module holding a slug is fetched on demand with a dynamic
 * import, so a concept page downloads one area chunk, not all three.
 *
 * The three area modules use slightly different export names and field shapes; loadExposition /
 * loadClassExposition normalise them (see normaliseExposition below for the common shape).
 *
 * If a slug is not in the maps below (an area file gained an entry after this map was written), the
 * loader falls back to searching all three areas. Import-free apart from the dynamic imports.
 */

const LOADERS = {
  a: () => import('./area-a.js'),
  b: () => import('./area-b.js'),
  c: () => import('./area-c.js'),
};

/** Registry slug -> area holding its exposition. */
export const EXPOSITION_AREA = Object.freeze({
  'functional-equation': 'a', 'xi-function': 'a', 'riemann-siegel-formula': 'a', 'davenport-heilbronn-function': 'a',
  'explicit-formula': 'a', 'weil-positivity': 'a', 'li-criterion': 'a', 'nyman-beurling-criterion': 'a',
  'hilbert-polya': 'a', 'zero-free-region': 'a', 'zero-density-estimate': 'a', 'critical-line-proportion': 'a',
  'levinsons-method': 'a', mollifier: 'a', 'pair-correlation': 'a',
  'de-bruijn-newman-constant': 'b', 'heat-flow-ht': 'b', 'zero-dynamics': 'b', 'theta-trap': 'b', 'barrier-method': 'b',
  'decreasing-zero-height-barrier': 'b', 'source-floor': 'b', 'kronecker-floor': 'b', 'structured-floor': 'b',
  'prefix-and-cell': 'b', 'weak-outer-lemma': 'b', 'two-band-lemma-b': 'b', 'local-rh-window': 'b',
  'platt-trudgian-verified-height': 'b', 'project-lambda-candidate': 'b', 'arb-interval-certificate': 'b',
  'twin-ladder': 'c', 'bridge-chi': 'c', 't3-strip': 'c', 'shift-bridge-threshold': 'c', 'closure-routes': 'c',
  'de-branges-spaces': 'c', 'davenport-heilbronn-twin': 'c', 'euler-blindness': 'c', 'flow-blindness': 'c',
  'ns-rigid': 'c', 'theorem-u': 'c', 'mirror-descent': 'c', 'route-vii-lane': 'c', 'route-i-weil-ladder': 'c',
  'toeplitz-krein-certificate': 'c',
});

/** CONCEPT_CLASSES slug -> areas holding a class exposition (zero-counting has one in a and one in b). */
export const CLASS_EXPOSITION_AREAS = Object.freeze({
  'zeta-and-l-functions': ['a'], 'primes-and-explicit-formulas': ['a'], 'equivalent-forms-of-rh': ['a'],
  'positivity-criteria': ['a'], 'zero-counting-and-verification': ['a', 'b'], 'random-matrices-and-quantum-chaos': ['a'],
  'heat-flow-and-dbn': ['b'], 'barrier-and-certification-methods': ['b'], 'interval-arithmetic-and-computer-assisted-proof': ['b'],
  'twin-ladder-model-objects': ['c'], 'no-go-theorems-and-walls': ['c'], 'project-routes': ['c'],
});

const ALL_AREAS = ['a', 'b', 'c'];
const cache = new Map();
const loaded = new Map(); // area -> resolved { concepts, classes }

function loadArea(area) {
  if (!cache.has(area)) {
    cache.set(area, LOADERS[area]().then((m) => {
      const data = {
        concepts: m.expositions || m.conceptExpositions || m.AREA_A_EXPOSITIONS || {},
        classes: m.classExpositions || m.AREA_A_CLASS_EXPOSITIONS || {},
      };
      loaded.set(area, data);
      return data;
    }).catch((err) => { cache.delete(area); throw err; }));
  }
  return cache.get(area);
}

const arr = (v) => (Array.isArray(v) ? v : v == null ? [] : [v]);
const asMath = (m) => (typeof m === 'string' ? { tex: m, note: '' } : { tex: m?.tex || '', note: m?.note || '' });
const asExample = (e) => {
  if (!e) return null;
  if (typeof e === 'string') return { title: '', text: e, steps: [], result: '', source: '' };
  return { title: e.title || '', text: e.text || e.body || '', steps: arr(e.steps), result: e.result || '', source: e.source || '', level: e.level || '' };
};

/**
 * Common shape:
 * { slug, intro, levels: [{ level, heading, paragraphs[], analogy, example, math[{tex,note}], details[] }],
 *   physicsAnalogy: { system, mapping[], whereItBreaks } | null, examples: [{ title, level, text, steps[], result, source }],
 *   whyItMatters, example: {title,text,steps,result,source} | null, pitfalls[], prerequisites[], mentions[],
 *   furtherReading: [{label, route|url}], sources: [{label, path|route|url}],
 *   diagrams: [{ id, placement: 'intro'|'beginner'|'intermediate'|'advanced'|'physics', caption, alt, title }] }
 */
export function normaliseExposition(slug, e) {
  if (!e) return null;
  const order = { beginner: 0, intermediate: 1, advanced: 2 };
  return {
    slug,
    intro: e.intro || '',
    levels: arr(e.levels).map((l) => ({
      level: l.level,
      heading: l.heading || '',
      paragraphs: arr(l.paragraphs),
      analogy: l.analogy || '',
      example: asExample(l.example),
      math: arr(l.math).map(asMath).filter((m) => m.tex),
      details: arr(l.details),
    })).sort((x, y) => (order[x.level] ?? 9) - (order[y.level] ?? 9)),
    physicsAnalogy: e.physicsAnalogy ? {
      system: e.physicsAnalogy.system || '',
      mapping: arr(e.physicsAnalogy.mapping),
      whereItBreaks: e.physicsAnalogy.whereItBreaks || '',
    } : null,
    examples: arr(e.examples).map(asExample).filter(Boolean),
    whyItMatters: e.whyItMatters || '',
    example: asExample(e.example),
    pitfalls: arr(e.pitfalls),
    prerequisites: arr(e.prerequisites),
    mentions: arr(e.mentions),
    furtherReading: arr(e.furtherReading),
    sources: arr(e.sources),
    diagrams: arr(e.diagrams).filter((d) => d && d.id && d.placement)
      .map((d) => ({ id: d.id, placement: d.placement, caption: d.caption || '', alt: d.alt || '', title: d.title || '' })),
  };
}

export function normaliseClassExposition(slug, e) {
  if (!e) return null;
  return {
    slug,
    name: e.name || '',
    intro: e.intro || '',
    membersOverview: arr(e.membersOverview).map((m) => (typeof m === 'string'
      ? { group: '', members: [], relation: m }
      : { group: m.group || '', members: arr(m.members), relation: m.relation || '' })),
    physicsAnalogy: e.physicsAnalogy ? {
      system: e.physicsAnalogy.system || '',
      mapping: arr(e.physicsAnalogy.mapping),
      whereItBreaks: e.physicsAnalogy.whereItBreaks || '',
    } : null,
    readingOrder: arr(e.readingOrder),
    mentions: arr(e.mentions),
  };
}

/** Resolve the exposition for a registry slug, or null. Loads one area module (all three on a map miss). */
export async function loadExposition(slug) {
  const areas = EXPOSITION_AREA[slug] ? [EXPOSITION_AREA[slug]] : ALL_AREAS;
  for (const area of areas) {
    const { concepts } = await loadArea(area);
    if (concepts[slug]) return normaliseExposition(slug, concepts[slug]);
  }
  return null;
}

/** Resolve the class exposition for a CONCEPT_CLASSES slug, or null. When two areas both have one, the longer is used. */
export async function loadClassExposition(slug) {
  const areas = CLASS_EXPOSITION_AREAS[slug] || ALL_AREAS;
  const found = [];
  for (const area of areas) {
    const { classes } = await loadArea(area);
    if (classes[slug]) found.push(classes[slug]);
  }
  if (!found.length) return null;
  const pick = found.reduce((best, x) => (JSON.stringify(x).length > JSON.stringify(best).length ? x : best));
  return normaliseClassExposition(slug, pick);
}

/**
 * Synchronous lookup in areas that have already been loaded: the exposition, null if the area is
 * loaded and has none, or undefined if its area has not been loaded yet. Lets a page revisit render
 * without a loading state.
 */
export function getLoadedExposition(slug) {
  const area = EXPOSITION_AREA[slug];
  if (!area) return undefined;
  const data = loaded.get(area);
  if (!data) return undefined;
  return data.concepts[slug] ? normaliseExposition(slug, data.concepts[slug]) : null;
}

/** Same as getLoadedExposition for class expositions (first loaded area that has it). */
export function getLoadedClassExposition(slug) {
  const areas = CLASS_EXPOSITION_AREAS[slug];
  if (!areas || !areas.every((a) => loaded.has(a))) return undefined;
  const found = areas.map((a) => loaded.get(a).classes[slug]).filter(Boolean);
  if (!found.length) return null;
  const pick = found.reduce((best, x) => (JSON.stringify(x).length > JSON.stringify(best).length ? x : best));
  return normaliseClassExposition(slug, pick);
}

/** True when the static map says an exposition exists (no loading). */
export function hasExposition(slug) {
  return Object.prototype.hasOwnProperty.call(EXPOSITION_AREA, slug);
}
