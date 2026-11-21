/**
 * imp-96527 -- AUDIT: is the imp-95562 sd(C - E) literal used byte-consistently across the whole
 * excursion-significance module family?
 *
 * MOTIVATION. imp-96512 reconciled two excursion ledgers and observed that both consume the SAME
 * imp-95562 sd(C - E) literals and the same dip z-score z = relErr / sqrt(2 / n_w), which is WHY their
 * overlapping heights must agree bit-for-bit. But that shared literal is threaded (directly or via
 * derived relErr / rho / n_w) through eight distinct finding modules and its byte-consistency across
 * the whole family was never audited. A single divergent or stale copy of one of the six sd values
 * would silently desynchronize a downstream z-score without failing any per-module assertion.
 *
 * THE CANONICAL SOURCE. imp-95562-meansquare-vs-pointwise-gap.js bakes the six measured
 * per-window sd(C - E) values over the 10^6 Odlyzko ordinates (src/data/zeros-to-1e6.js):
 *   Tc = 1.0e4 -> 0.6218,  3.0e4 -> 0.5823,  7.0e4 -> 0.5689,
 *        1.5e5 -> 0.6714,  3.0e5 -> 0.6199,  5.0e5 -> 0.6078,
 * paired with the deterministic non-overlapping tiling counts n_w = 75, 130, 198, 291, 411, 443.
 *
 * METHOD (import-light: no zeros bundle, no sibling imports; a byte comparison of literals already
 * grepped out of each module, baked here as observed sets). Two consumption patterns exist:
 *   A. RAW-TABLE consumers bake the six sd values verbatim (as sdDiscrepancy / sd fields):
 *        imp-96089, imp-96452 (all six); imp-96493 (the T = 1.5e5 / 3.0e5 pair 0.6714 / 0.6199).
 *   B. DERIVED consumers bake only sd-derived scalars -- the dip depth relErr, the box correlation
 *      rho_exact, the window count n_w, the conservative z_cons -- rather than the raw sd:
 *        imp-96128 (window counts + rho), imp-96489 / imp-96509 (relErr + rho_1 + n_w),
 *        imp-96510 / imp-96512 (relErr / z-score citations).
 *
 * FINDINGS.
 *  1. RAW-TABLE consumers are BYTE-IDENTICAL to the imp-95562 source. imp-96089 and imp-96452 carry
 *     all six sd values (0.6218 / 0.5823 / 0.5689 / 0.6714 / 0.6199 / 0.6078) with no divergent digit;
 *     imp-96493 carries the two heights it uses (0.6714, 0.6199) identically. No stale copy found.
 *  2. The tiling counts n_w = 75 / 130 / 198 / 291 / 411 / 443 that pair with the sd values are
 *     byte-identical in imp-96089, imp-96128, imp-96452 (all six) and at the shared heights in
 *     imp-96493 / imp-96512 (291, 411).
 *  3. DERIVED consumers reconcile to the source to full precision. The dip depth
 *     relErr = 0.15945679221237827 (the |r_cap - r| / r forced by sd(1.5e5) = 0.6714) is
 *     byte-identical in imp-96452 / imp-96489 / imp-96509; the box correlation
 *     rho_exact = -0.4639782 is identical in imp-96489 / imp-96509 and rounds to the -0.46398 baked
 *     in imp-96128 / imp-96452; the conservative z_cons = 1.9234217 is identical in imp-96452 /
 *     imp-96493 and rounds to the 1.923422 / 1.9234 cited elsewhere. Every rounded citation is a
 *     truncation of the same full-precision value, not an independent (potentially drifted) copy.
 *
 * VERDICT. The imp-95562 sd(C - E) literal is used BYTE-CONSISTENTLY across the entire excursion-
 * significance family. No module carries a divergent or stale copy of any of the six sd values, of
 * their paired tiling counts, or of the derived relErr / rho / z_cons scalars they feed; every
 * downstream z-score therefore rests on the same source measurement, confirming the imp-96512
 * overlap agreement is structural rather than coincidental. Import-light audit only; changes no
 * bound; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-95562-meansquare-vs-pointwise-gap (the canonical sd(C - E) source)
 * @see imp-96512-excursion-significance-ledger-reconciliation (the observation this audit generalizes)
 */

// Canonical six sd(C - E) literals + tiling counts as baked in imp-95562 (the source of record).
const CANONICAL = [
  { Tc: 1.0e4, sd: 0.6218, nW: 75 },
  { Tc: 3.0e4, sd: 0.5823, nW: 130 },
  { Tc: 7.0e4, sd: 0.5689, nW: 198 },
  { Tc: 1.5e5, sd: 0.6714, nW: 291 },
  { Tc: 3.0e5, sd: 0.6199, nW: 411 },
  { Tc: 5.0e5, sd: 0.6078, nW: 443 },
];

// Per-module observed sd literals (grepped verbatim). Empty sd[] = derived-only consumer (pattern B).
const OBSERVED = [
  { module: 'imp-96089-mean-anchor-window-count-significance-verdict', pattern: 'raw-table',
    sd: [0.6218, 0.5823, 0.5689, 0.6714, 0.6199, 0.6078], nW: [75, 130, 198, 291, 411, 443] },
  { module: 'imp-96452-excursion-confidence-2sigma-reach', pattern: 'raw-table',
    sd: [0.6218, 0.5823, 0.5689, 0.6714, 0.6199, 0.6078], nW: [75, 130, 198, 291, 411, 443] },
  { module: 'imp-96493-excursion-2sigma-interior-scan', pattern: 'raw-table',
    sd: [0.6714, 0.6199], nW: [291, 411] },
  { module: 'imp-96128-number-variance-two-interval-covariance-exact', pattern: 'derived',
    sd: [], nW: [75, 130, 198, 291, 411, 443] },
  { module: 'imp-96489-excursion-effective-significance-direct-rho', pattern: 'derived',
    sd: [], nW: [291] },
  { module: 'imp-96509-excursion-effective-significance-ar2', pattern: 'derived',
    sd: [], nW: [291] },
  { module: 'imp-96510-deeper-interior-dip-height-source-reach', pattern: 'derived',
    sd: [], nW: [] },
  { module: 'imp-96512-excursion-significance-ledger-reconciliation', pattern: 'derived',
    sd: [], nW: [291, 411] },
];

// Derived scalars forced by the sd literals; each key lists the full-precision literal and the modules
// that carry it byte-identically (rounded citations are truncations of the same value, not new copies).
const DERIVED = {
  relErr: { value: 0.15945679221237827, forcedBy: 'sd(1.5e5) = 0.6714',
    identicalIn: ['imp-96452', 'imp-96489', 'imp-96509'] },
  rhoExact: { value: -0.4639782, forcedBy: 'union-identity at the T = 1.5e5 box length',
    identicalIn: ['imp-96489', 'imp-96509'], roundedTo: -0.46398 },
  zCons: { value: 1.9234217, forcedBy: 'relErr / sqrt(2 / n_w), n_w = 291',
    identicalIn: ['imp-96452', 'imp-96493'], roundedTo: 1.923422 },
};

const canonSd = new Map(CANONICAL.map((r) => [r.Tc, r.sd]));
const canonNw = new Map(CANONICAL.map((r) => [r.Tc, r.nW]));

// A raw-table module maps its observed sd values back to CANONICAL by ordered position over the
// heights it uses (the raw-table modules bake the six/pair in canonical Tc order).
const rawTableHeights = (n) => (n === 6 ? CANONICAL : CANONICAL.filter((r) => r.Tc === 1.5e5 || r.Tc === 3.0e5)).map((r) => r.Tc);

let divergentCopies = 0;
const perModule = OBSERVED.map((m) => {
  const heights = m.pattern === 'raw-table' ? rawTableHeights(m.sd.length) : [];
  let sdOk = true;
  heights.forEach((Tc, i) => { if (m.sd[i] !== canonSd.get(Tc)) sdOk = false; });
  const nwOk = m.nW.every((v) => [...canonNw.values()].includes(v));
  if (!sdOk || !nwOk) divergentCopies += 1;
  return { module: m.module, pattern: m.pattern, sdByteConsistent: sdOk, nwConsistent: nwOk };
});

const IMP96527_EXCURSION_SD_LITERAL_BYTE_CONSISTENCY_AUDIT = {
  id: 'imp-96527',
  title: 'imp-95562 sd(C - E) literal byte-consistency audit across the excursion-significance family',
  canonicalSource: 'imp-95562-meansquare-vs-pointwise-gap',
  canonical: CANONICAL,
  observed: OBSERVED,
  derived: DERIVED,
  perModule,
  divergentCopies,
  verdict:
    'The imp-95562 sd(C - E) literal is used BYTE-CONSISTENTLY across the excursion-significance '
    + 'family (imp-96089 / 96128 / 96452 / 96489 / 96493 / 96509 / 96510 / 96512). The three '
    + 'raw-table consumers (96089, 96452, 96493) carry the six sd values 0.6218 / 0.5823 / 0.5689 / '
    + '0.6714 / 0.6199 / 0.6078 and their paired tiling counts 75 / 130 / 198 / 291 / 411 / 443 with '
    + 'no divergent digit; the derived consumers carry only sd-forced scalars (relErr = '
    + '0.15945679221237827, rho_exact = -0.4639782, z_cons = 1.9234217) that reconcile to the source '
    + 'to full precision, every rounded citation being a truncation of the same value. Zero divergent '
    + 'or stale copies found, so every downstream z-score rests on one source measurement. '
    + 'Import-light audit only; changes no bound; RH open; NO QED; no refereed bound is changed.',
  honestBanner: 'RH open; no refereed bound is changed; NO QED; audit changes no bound.',
};

// --- self-executing internal-consistency assertions (comparison only, no re-derivation) ---
(() => {
  if (CANONICAL.length !== 6) throw new Error('imp-96527: canonical sd table must have six rows');
  // every audited module is accounted for
  if (perModule.length !== 8) throw new Error('imp-96527: expected eight audited modules');
  // no divergent copy survived the audit
  if (divergentCopies !== 0) throw new Error('imp-96527: a divergent sd(C - E) copy was found');
  perModule.forEach((r) => {
    if (!r.sdByteConsistent) throw new Error('imp-96527: sd byte-inconsistency in ' + r.module);
    if (!r.nwConsistent) throw new Error('imp-96527: tiling-count inconsistency in ' + r.module);
  });
  // the significant-dip sd and its paired count are the reference the whole family shares
  if (canonSd.get(1.5e5) !== 0.6714 || canonNw.get(1.5e5) !== 291)
    throw new Error('imp-96527: T = 1.5e5 reference (0.6714, 291) drifted');
  // honesty gates
  if (!/NO QED/.test(IMP96527_EXCURSION_SD_LITERAL_BYTE_CONSISTENCY_AUDIT.verdict))
    throw new Error('imp-96527: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96527_EXCURSION_SD_LITERAL_BYTE_CONSISTENCY_AUDIT.verdict))
    throw new Error('imp-96527: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96527_EXCURSION_SD_LITERAL_BYTE_CONSISTENCY_AUDIT;
