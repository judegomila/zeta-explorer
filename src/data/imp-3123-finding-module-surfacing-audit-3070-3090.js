/**
 * @module imp-3123-finding-module-surfacing-audit-3070-3090
 * @fileoverview imp-3123 — Extend the per-page honest-status surfacing audit to
 * the finding modules NOT covered by imp-3083 or imp-3100:
 * imp-3070, imp-3084, imp-3085, imp-3086, imp-3087, imp-3088, imp-3089, imp-3090.
 *
 * imp-3100 audited imp-3064/3065/3066 and explicitly recommended follow-up surfacing
 * tickets for the orphans it found. This module audits the next cohort: the eight
 * tickets in the range imp-3070..imp-3090 that post-date both imp-3083 and imp-3100.
 * Note: imp-3089 and imp-3090 have no authored data module file on disk; those are
 * recorded as NOT-YET-AUTHORED rather than SURFACED or ORPHAN.
 *
 * METHOD (read-only, performed at author time). A transitive import-graph walk was
 * run from every page under src/pages over all `... from "..."` relative imports.
 * A module counts as SURFACED iff its file is reachable from some page node; ORPHAN
 * otherwise. String or comment mentions do NOT count — only real import edges.
 * The walk resolved bare, .js, .jsx and /index variants.
 *
 * RESULT (audited 2026-06-30):
 *   imp-3070-c-shock-n-dependence              : SURFACED
 *     (imported by src/pages/RouteMapPage.jsx as C_SHOCK_N_DEPENDENCE_IMP3070)
 *   imp-3084-offdiagonal-gap-degree-sweep       : SURFACED
 *     (imported by src/pages/ClosureRoutesPage.jsx as IMP3084_OFFDIAGONAL_GAP_DEGREE_SWEEP)
 *   imp-3085-hankel-gap-aU-grid                 : SURFACED
 *     (imported by src/pages/ClosureRoutesPage.jsx as IMP3085_HANKEL_GAP_AU_GRID)
 *   imp-3086-orthogonalized-basis-conditioning  : SURFACED
 *     (imported by ClosureRoutesPage.jsx and SpectralAttackPage.jsx)
 *   imp-3087-excess-fraction-onset-divergence   : ORPHAN
 *     (only imported by src/data/imp-3112; imp-3112 itself is not page-reachable)
 *   imp-3088-excess-fraction-large-s-decay      : ORPHAN
 *     (only imported by src/data/imp-3112; imp-3112 itself is not page-reachable)
 *   imp-3089                                    : NOT-YET-AUTHORED (no module file)
 *   imp-3090                                    : NOT-YET-AUTHORED (no module file)
 *
 * RECOMMENDATION. imp-3087 and imp-3088 are both present in the run-assertions
 * DATA_MODULES registry (their tripwires execute in npm run assert) but their data
 * is never rendered on any page. Mint follow-up surfacing tickets for each so the
 * excess-fraction onset / decay findings are displayed with their honest scope
 * caveat (degree-0 scalar only; no RH verdict). ClosureRoutesPage already references
 * the onset constant C and decay constant K in prose but does not import the modules.
 *
 * @see imp-3083 (first per-page surfacing audit)
 * @see imp-3100 (second surfacing audit; audited imp-3064/3065/3066)
 * @see imp-3014 (original per-page honest-status audit)
 */

export const IMP_3123_SURFACING_AUDIT = {
  id: 'imp-3123',
  auditedAt: '2026-06-30',
  method:
    'Transitive import-graph walk from every src/pages page over relative `from` imports; ' +
    'SURFACED iff the module file is reachable, ORPHAN otherwise. ' +
    'NOT-YET-AUTHORED if no module file exists on disk. Comment/string mentions do not count.',
  modules: [
    {
      file: 'imp-3070-c-shock-n-dependence.js',
      surfaced: true,
      surfacedBy: 'src/pages/RouteMapPage.jsx (C_SHOCK_N_DEPENDENCE_IMP3070)',
      honestScope: 'C_shock(N) monotone decay vs 1/3 cap; numerical uniformity; no RH verdict',
    },
    {
      file: 'imp-3084-offdiagonal-gap-degree-sweep.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx (IMP3084_OFFDIAGONAL_GAP_DEGREE_SWEEP)',
      honestScope: 'raw-basis operator/diagonal gap grows with DEG; truncation artifact; no RH verdict',
    },
    {
      file: 'imp-3085-hankel-gap-aU-grid.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx (IMP3085_HANKEL_GAP_AU_GRID)',
      honestScope: 'operator-gap collapses onto s=a*U; Hankel cross-term does NOT collapse; no RH verdict',
    },
    {
      file: 'imp-3086-orthogonalized-basis-conditioning.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx and src/pages/SpectralAttackPage.jsx',
      honestScope: 'orthogonalized basis collapses gap from ~3.63 to ~0.09; residual survives; no RH verdict',
    },
    {
      file: 'imp-3087-excess-fraction-onset-divergence.js',
      surfaced: false,
      surfacedBy: null,
      honestScope: 'excess fraction phi(s) onset divergence at s0=arcsinh(1); degree-0 scalar only; no RH verdict',
    },
    {
      file: 'imp-3088-excess-fraction-large-s-decay.js',
      surfaced: false,
      surfacedBy: null,
      honestScope: 'excess fraction phi(s) exponential decay phi ~ K*e^{-s}; degree-0 scalar only; no RH verdict',
    },
    {
      file: 'imp-3089',
      surfaced: false,
      surfacedBy: null,
      honestScope: 'NOT-YET-AUTHORED: module file does not exist on disk',
      notYetAuthored: true,
    },
    {
      file: 'imp-3090',
      surfaced: false,
      surfacedBy: null,
      honestScope: 'NOT-YET-AUTHORED: module file does not exist on disk',
      notYetAuthored: true,
    },
  ],
  orphanCount: 2,
  notYetAuthoredCount: 2,
  surfacedCount: 4,
  recommendation:
    'imp-3087 and imp-3088 are orphaned from pages despite being in run-assertions DATA_MODULES. ' +
    'Mint surfacing tickets to display their excess-fraction findings on ClosureRoutesPage or ' +
    'a dedicated phi(s) page, with the honest degree-0-scalar / no-RH-verdict scope caveat.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3123_ASSERTIONS = [
  {
    id: 'imp3123-exactly-eight-modules-audited',
    holds: () => IMP_3123_SURFACING_AUDIT.modules.length === 8,
    why: 'The audit must cover exactly the eight modules imp-3070..imp-3090.',
  },
  {
    id: 'imp3123-four-surfaced-two-orphan-two-not-authored',
    holds: () => {
      const m = IMP_3123_SURFACING_AUDIT.modules;
      const authored = m.filter((x) => !x.notYetAuthored);
      const surfaced = authored.filter((x) => x.surfaced).length;
      const orphan = authored.filter((x) => !x.surfaced).length;
      const notYet = m.filter((x) => x.notYetAuthored).length;
      return (
        surfaced === IMP_3123_SURFACING_AUDIT.surfacedCount &&
        orphan === IMP_3123_SURFACING_AUDIT.orphanCount &&
        notYet === IMP_3123_SURFACING_AUDIT.notYetAuthoredCount
      );
    },
    why: 'Exactly 4 surfaced, 2 orphaned, 2 not-yet-authored among the eight audited modules.',
  },
  {
    id: 'imp3123-covers-3070-3084-3085-3086-3087-3088',
    holds: () => {
      const files = IMP_3123_SURFACING_AUDIT.modules.map((x) => x.file);
      return ['3070', '3084', '3085', '3086', '3087', '3088'].every((n) =>
        files.some((f) => f.indexOf('imp-' + n) === 0));
    },
    why: 'The audit must name imp-3070, imp-3084, imp-3085, imp-3086, imp-3087, imp-3088.',
  },
  {
    id: 'imp3123-every-authored-module-carries-honest-scope',
    holds: () =>
      IMP_3123_SURFACING_AUDIT.modules
        .filter((x) => !x.notYetAuthored)
        .every((x) => typeof x.honestScope === 'string' && /no RH verdict|OPEN/.test(x.honestScope)),
    why: 'Each authored module records its honest scope caveat (no RH verdict).',
  },
  {
    id: 'imp3123-orphans-have-null-surfacedBy',
    holds: () =>
      IMP_3123_SURFACING_AUDIT.modules
        .filter((x) => !x.surfaced)
        .every((x) => x.surfacedBy === null),
    why: 'Unsurfaced modules must have surfacedBy === null.',
  },
  {
    id: 'imp3123-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_3123_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3123_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: read-only audit; no refereed bound is changed.',
  },
];

for (const a of IMP_3123_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3123 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3123_ASSERTIONS };
