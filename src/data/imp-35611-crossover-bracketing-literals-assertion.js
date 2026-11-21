/**
 * @module imp-35611-crossover-bracketing-literals-assertion
 * @fileoverview imp-35611 -- ASSERTION-ONLY tripwire pinning the imp-35555 five-map
 *   E_coll = E_trunc floor-crossover bracketing-family literals against a silent
 *   height-map or bisection-locator drift.
 *
 *   imp-35555 extended the imp-35458 two-map E_coll = E_trunc floor-crossover
 *   height-map study to the imp-35536 multiplicative bracketing family
 *   RvM x {1.02, 0.98, 1.05, 0.95}, measuring per-map crossover-N by geometric
 *   bisection and a full bracketing-envelope span ~0.50 percent. It bakes, but its
 *   own tripwires never pin at storage precision, these five crossover-N and the span:
 *     RvM inverse (base)   3.280294352e9   (reproduces the imp-35337/imp-35417 landmark)
 *     RvM x 1.02           3.283556848e9   (+0.0995 percent)
 *     RvM x 0.98           3.276965783e9   (-0.1015 percent)
 *     RvM x 1.05           3.288332288e9   (+0.2450 percent)
 *     RvM x 0.95           3.271843029e9   (-0.2576 percent)
 *     bracketing envelope span (max - min): 5.026763e-3   (~0.50 percent)
 *   The source module carries only a MAX_ABS_REL / envelope-span range check (5e-6 on
 *   the widest arm, 4e-3..6e-3 on the span), so a silent change in effectiveHeightForN
 *   (the RvM inverse height map), C_C_PINNED or the geometric bisection could drift the
 *   four inner per-map crossover-N literals without tripping any build at storage precision.
 *
 *   This module INDEPENDENTLY recomputes each crossover N -- solving
 *   E_coll(N) = C_C sqrt(log T0(N) / N) = E_trunc = 3.06e-5 by the same geometric
 *   bisection under T0 = mult * effectiveHeightForN(N) for mult in
 *   {1.00, 1.02, 0.98, 1.05, 0.95} -- from an inlined verbatim effectiveHeightForN
 *   (no import of the height-map source), then asserts:
 *     (a) the full-precision recompute of all five crossover-N and the envelope span
 *         matches hard-coded 7-sig-fig reference literals within 1e-6 relative -- the
 *         storage-precision tolerance per [[storage_precision_assertion_tolerance]];
 *     (b) each baked imp-35555 field (N_cross_rvm_base, the four bracketing_family
 *         N_cross, envelope.span) reproduces EXACTLY when the source module's own
 *         display rounding (toExponential) is re-applied to this independent recompute --
 *         so any drift in the source recompute also trips.
 *
 *   Import-light: inlines the pure-Math effectiveHeightForN and C_C ansatz, and imports
 *   only the (import-light) imp-35555 record for the exact-reproduction cross-check;
 *   never the 16.7MB zeros bundle, per [[no_heavy_imports_in_pages]] /
 *   [[verify_heavy_assertion_modules]].
 *
 *   @see imp-35555-crossover-bracketing-family-sensitivity.js (source of every baked literal)
 *   @see imp-35458-crossover-height-map-sensitivity (the two-map -0.98 percent study extended)
 *   @see imp-35536-peak-height-map-sensitivity (the RvM x {1.02,0.98,1.05,0.95} family)
 *   @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse, inlined here)
 *
 *   Ticket: imp-35611 (accuracy, medium). Verification-tooling only; recomputes the same
 *   already-established measurement figures; adds no new Lambda bound; the C_C = (1/8) sqrt(3 pi)
 *   ansatz (imp-2642/imp-2643) and E_trunc = 3.06e-5 (imp-2631/imp-447) are UNTOUCHED; the C_mb
 *   GUE-conditional share per imp-486 is UNTOUCHED. No refereed bound is changed. NO QED.
 */

import { IMP35555_CROSSOVER_BRACKETING_FAMILY_SENSITIVITY } from './imp-35555-crossover-bracketing-family-sensitivity.js';

const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643/imp-2714 ansatz
const E_TRUNC = 3.06e-5; // imp-2631/imp-447 fixed truncation floor, cited UNTOUCHED

// The EXACT RvM inverse height map -- inlined verbatim from imp-35574/imp-35591.
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 60; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-12 * Math.max(1, T)) break;
  }
  return T;
}

// E_coll on a chosen height map (dominant GUE-conditional sub-term), verbatim imp-35555.
const eColl = (N, hmap) => C_C_PINNED * Math.sqrt(Math.log(hmap(N)) / N);

// Solve E_coll(N) = E_trunc by geometric bisection (E_coll monotone decreasing in N),
// identical lo/hi/iteration budget to imp-35555 so the recompute is apples-to-apples.
function solveCrossover(hmap) {
  let lo = 1e6;
  let hi = 1e12;
  for (let i = 0; i < 200; i++) {
    const mid = Math.sqrt(lo * hi);
    if (eColl(mid, hmap) > E_TRUNC) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}

// -- INDEPENDENT recompute of every imp-35555 crossover-N and the envelope span --
const N_CROSS_RVM = solveCrossover(effectiveHeightForN);
const MULTS = [1.02, 0.98, 1.05, 0.95]; // imp-35536 family order, verbatim imp-35555
const BRACKET_N = MULTS.map((mult) => solveCrossover((N) => mult * effectiveHeightForN(N)));
// Rebuild the envelope span the way imp-35555 does: from the display-rounded rel-shifts.
const REL_SHIFTS = BRACKET_N.map((n) => +((n - N_CROSS_RVM) / N_CROSS_RVM).toExponential(6));
const ENVELOPE_SPAN = Math.max(...REL_SHIFTS) - Math.min(...REL_SHIFTS);

// -- 7-sig-fig reference literals (storage-precision tolerance ~1e-6 relative) --
const REF = Object.freeze({
  nCrossRvmBase: 3.280294352e9, // RvM inverse base (imp-35337/imp-35417 landmark)
  nCrossX102: 3.283556848e9, // RvM x 1.02
  nCrossX098: 3.276965783e9, // RvM x 0.98
  nCrossX105: 3.288332288e9, // RvM x 1.05
  nCrossX095: 3.271843029e9, // RvM x 0.95
  envelopeSpan: 5.026763e-3, // full bracketing envelope span (max - min), ~0.50 percent
});

const STORAGE_REL_TOL = 1e-6; // 7-sig-fig storage tolerance
const relClose = (a, b) => Math.abs(a - b) <= STORAGE_REL_TOL * Math.abs(b);

export const IMP35611_CROSSOVER_BRACKETING_RECOMPUTE = Object.freeze({
  id: 'imp-35611',
  nCrossRvmBase: N_CROSS_RVM,
  nCrossX102: BRACKET_N[0],
  nCrossX098: BRACKET_N[1],
  nCrossX105: BRACKET_N[2],
  nCrossX095: BRACKET_N[3],
  envelopeSpan: ENVELOPE_SPAN,
});

export const IMP35611_CROSSOVER_BRACKETING_LITERALS_ASSERTIONS = [
  {
    // (1) full-precision recompute of the five crossover-N and the envelope span matches
    //     the 7-sig-fig references within 1e-6 relative -- guards effectiveHeightForN /
    //     C_C / bisection drift at storage precision.
    id: 'imp35611-recompute-matches-reference-at-storage-tol',
    description:
      'independently recomputing the five bracketing-family crossover-N (RvM base + x{1.02,0.98,' +
      '1.05,0.95}) and the ~0.50 percent envelope span matches the 7-sig-fig reference literals ' +
      'within 1e-6 relative',
    holds: () =>
      relClose(N_CROSS_RVM, REF.nCrossRvmBase) &&
      relClose(BRACKET_N[0], REF.nCrossX102) &&
      relClose(BRACKET_N[1], REF.nCrossX098) &&
      relClose(BRACKET_N[2], REF.nCrossX105) &&
      relClose(BRACKET_N[3], REF.nCrossX095) &&
      relClose(ENVELOPE_SPAN, REF.envelopeSpan),
  },
  {
    // (2) each baked imp-35555 field reproduces EXACTLY when the source module's own display
    //     rounding (toExponential) is re-applied to this INDEPENDENT recompute -- catches source drift.
    id: 'imp35611-baked-imp35555-fields-reproduce-exactly',
    description:
      'each imp-35555 baked field (N_cross_rvm_base, the four bracketing_family N_cross, envelope.span) ' +
      'equals the source display-rounding re-applied to this independent recompute',
    holds: () => {
      const m = IMP35555_CROSSOVER_BRACKETING_FAMILY_SENSITIVITY;
      return (
        m.N_cross_rvm_base === +N_CROSS_RVM.toExponential(9) &&
        m.bracketing_family[0].N_cross === +BRACKET_N[0].toExponential(9) &&
        m.bracketing_family[1].N_cross === +BRACKET_N[1].toExponential(9) &&
        m.bracketing_family[2].N_cross === +BRACKET_N[2].toExponential(9) &&
        m.bracketing_family[3].N_cross === +BRACKET_N[3].toExponential(9) &&
        m.envelope.span === +ENVELOPE_SPAN.toExponential(6)
      );
    },
  },
  {
    // (3) the qualitative envelope structure: every bracketing arm stays inside the imp-35458
    //     two-map -0.98 percent shift, and the span is a genuine ~0.50 percent two-sided band.
    id: 'imp35611-bracketing-inside-two-map-and-span-half-pct',
    description:
      'every bracketing crossover-N sits inside the imp-35458 two-map -0.98 percent shift and the ' +
      'envelope span is ~0.50 percent (4e-3..6e-3)',
    holds: () =>
      Math.max(...REL_SHIFTS.map(Math.abs)) < 9.826376e-3 &&
      ENVELOPE_SPAN > 4e-3 &&
      ENVELOPE_SPAN < 6e-3 &&
      IMP35555_CROSSOVER_BRACKETING_FAMILY_SENSITIVITY.envelope.bracketing_inside_two_map === true,
  },
  {
    // (4) honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35611-honesty-gate-no-qed',
    description: 'Measurement only: source isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35555_CROSSOVER_BRACKETING_FAMILY_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP35555_CROSSOVER_BRACKETING_FAMILY_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP35555_CROSSOVER_BRACKETING_FAMILY_SENSITIVITY.verdict),
  },
];

for (const a of IMP35611_CROSSOVER_BRACKETING_LITERALS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35611-crossover-bracketing-literals-assertion failed: ${a.id}`);
  }
}

export default Object.freeze({
  id: 'imp-35611-crossover-bracketing-literals-assertion',
  ticket: 'imp-35611',
  recompute: IMP35611_CROSSOVER_BRACKETING_RECOMPUTE,
  reference: REF,
  storageRelTol: STORAGE_REL_TOL,
});
