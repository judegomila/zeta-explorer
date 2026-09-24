/**
 * @module data/imp-96349-ecoll-ratio-law-second-anchor-crossvalidation
 * @fileoverview imp-96349 -- extend the imp-96327 single-anchor cross-check of
 *   the imp-96311 cross-column E_coll ratio law to a SECOND independent anchor
 *   (a second N and a second C_H pair), so the constant-ratio claim is not a
 *   single-point coincidence.
 *
 *   imp-96327 verified that the two INDEPENDENTLY baked imp-96290 anchors at the
 *   single height N = 1e4,
 *
 *       E_coll(1/8,  1e4) = 0.0108806   (C_H = 0.125)
 *       E_coll(0.127, 1e4) = 0.0110547   (C_H = 0.127),
 *
 *   satisfy the imp-96311 cross-column ratio law
 *
 *       E_coll(C_H_a, N) / E_coll(C_H_b, N) = C_H_a / C_H_b
 *
 *   to their stored precision: anchor ratio 1.0160009558 vs target 1.016,
 *   residual 9.56e-7 inside the ~9.26e-6 propagated rounding band. That check
 *   ran at ONE anchor only. This module measures the same residual-vs-slack
 *   picture at TWO further anchors, using the imp-96311 rate factor
 *   R(N) = sqrt(C_KH) * sqrt(log gamma_N / N) and re-storing each E_coll value
 *   to the same 6-significant-figure convention the imp-96290 anchors carry:
 *
 *   SECOND ANCHOR A (different N, same C_H pair). At N = 1e6 the two columns are
 *   E_coll(0.125, 1e6) = 0.00130861 and E_coll(0.127, 1e6) = 0.00132955; the
 *   6-sig-fig ratio is 1.0160017 vs target 1.016, residual 1.71e-6 inside a
 *   propagated 7.70e-6 band. The constant ratio survives a 100x change of N.
 *
 *   SECOND ANCHOR B (same N, different C_H pair). At N = 1e4 the pair
 *   {C_H = 1.0, C_H = 0.127} gives E_coll(1.0, 1e4) = 0.0870445 and
 *   E_coll(0.127, 1e4) = 0.0110547; the 6-sig-fig ratio is 7.873981 vs target
 *   1.0/0.127 = 7.874016, residual -3.45e-5 inside a propagated 4.01e-5 band.
 *   The constant ratio survives a different C_H pair spanning ~8x.
 *
 *   In both second anchors the measured residual sits INSIDE the propagated
 *   6-sig-fig storage band, so the imp-96311 ratio law is not a single-N or
 *   single-pair artifact: it holds across a 100x span of N and across a distinct
 *   C_H pair, each to the precision the values carry.
 *
 *   SUB-GAP (honest scope). The corpus bakes exactly ONE independently stored
 *   E_coll anchor pair (the imp-96290 pair at N = 1e4). The two second anchors
 *   here are RECONSTRUCTED from the imp-96311 formula E_coll = C_H * R(N) and
 *   then re-rounded to 6 sig figs, so their unrounded ratios are exactly
 *   C_H_a / C_H_b (residual 0) by construction and the measured residuals above
 *   are pure re-rounding-floor artifacts. This is therefore a storage-floor
 *   confirmation of N-independence and C_H-pair-independence of the ratio law,
 *   NOT a second INDEPENDENT external corroboration. A genuinely independent
 *   second anchor would require a fresh high-precision E_coll evaluation at a
 *   second N or C_H (not present in the corpus); the one independent baked
 *   cross-check remains imp-96327 at N = 1e4.
 *
 *   ACCURACY AUDIT ONLY. Closes no gap, changes no bound, proves no constant,
 *   does not close G6_polymath15_bridge. The conditional bound C_H <= 0.127
 *   stays UNPROVEN; C_H isRigorousUpperBound remains false (imp-2642 / imp-2701);
 *   the imp-2640 Gronwall discharge of C_Lip stays NEGATIVE. RH remains open.
 *   NO QED.
 *
 * Provenance of baked inputs (single sources of truth, cited not re-derived):
 *   - imp-96290-step4-bridge-subconstant-inventory.js: the E_coll anchors
 *     0.0108806 (C_H = 1/8) and 0.0110547 (C_H = 0.127) at N = 1e4; C_KH form.
 *   - imp-96311-ecoll-rate-ch-independence-tabulation.js: the rate factor
 *     R(N) = sqrt(C_KH) * sqrt(log gamma_N / N), C_KH = pi * 2.622, the
 *     Riemann-von Mangoldt inversion for gamma_N, and the ratio law itself.
 *   - imp-96327-ecoll-ratio-law-vs-anchor-crossvalidation.js: the single-anchor
 *     cross-check this module extends.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{logE}/dg_{logN}
 *   and this header avoids the close-comment terminator sequence inside prose.
 */

// Koksma-Hlawka discrepancy factor of E_coll (imp-2641 Trudgian), as in imp-96311.
const C_KH = Math.PI * 2.622; // = 8.2373...

// Height of the N-th zero: invert the Riemann-von Mangoldt main-term count
// N(T) = (T / 2pi)(log(T / 2pi) - 1) by Newton (identical to imp-96311).
function gammaOfN(N) {
  let T = 2 * Math.PI * N;
  for (let i = 0; i < 200; i += 1) {
    const u = T / (2 * Math.PI);
    const f = u * (Math.log(u) - 1) - N;
    const df = Math.log(u) / (2 * Math.PI);
    const step = f / df;
    T -= step;
    if (Math.abs(step) < 1e-9) break;
  }
  return T;
}

// Pure C_H-free rate factor and the linear-in-C_H collision term (imp-96311).
function rateFactor(N) {
  return Math.sqrt(C_KH) * Math.sqrt(Math.log(gammaOfN(N)) / N);
}
function eColl(CH, N) {
  return CH * rateFactor(N);
}

// Re-store a value to 6 significant figures, matching the imp-96290 anchors
// (0.0108806 / 0.0110547 carry 6 sig figs). Number.toPrecision then back to
// Number reproduces the storage rounding without introducing string state.
function sig6(x) {
  return Number(x.toPrecision(6));
}

// Absolute half-ULP of a value stored to 6 significant figures. For x ~ 0.011
// this returns 0.5e-7, reproducing the imp-96327 propagation exactly.
function halfUlp6(x) {
  const exp = Math.floor(Math.log10(Math.abs(x)));
  return 0.5 * Math.pow(10, exp - 5);
}

// Propagated relative slack of a ratio b / a from the two operands 6-sig-fig
// storage: ratio * (halfUlp(a)/a + halfUlp(b)/b), the imp-96327 band rule.
function ratioBand(a, b) {
  const ratio = b / a;
  return ratio * (halfUlp6(a) / a + halfUlp6(b) / b);
}

// Build one anchor cross-check row from two (C_H, value) columns at a height N.
function crossCheck(N, chA, chB) {
  const valA = sig6(eColl(chA, N));
  const valB = sig6(eColl(chB, N));
  const anchorRatio = valB / valA;
  const targetRatio = chB / chA;
  const residual = anchorRatio - targetRatio;
  const band = ratioBand(valA, valB);
  // Unrounded ratio is exactly chB/chA by construction (E_coll linear in C_H).
  const exactResidual = eColl(chB, N) / eColl(chA, N) - targetRatio;
  return {
    N,
    C_H_a: chA,
    C_H_b: chB,
    valA,
    valB,
    anchorRatio,
    targetRatio,
    residual,
    relResidual: residual / targetRatio,
    band,
    withinBand: Math.abs(residual) < band,
    exactResidual,
  };
}

// The imp-96327 first anchor, recomputed from the RAW baked values for parity.
const BAKED_A = 0.0108806; // E_coll(0.125, 1e4)
const BAKED_B = 0.0110547; // E_coll(0.127, 1e4)
const FIRST_ANCHOR = {
  N: 1e4,
  C_H_a: 0.125,
  C_H_b: 0.127,
  valA: BAKED_A,
  valB: BAKED_B,
  anchorRatio: BAKED_B / BAKED_A,
  targetRatio: 0.127 / 0.125,
  residual: BAKED_B / BAKED_A - 0.127 / 0.125,
  band: ratioBand(BAKED_A, BAKED_B),
  withinBand: Math.abs(BAKED_B / BAKED_A - 0.127 / 0.125) < ratioBand(BAKED_A, BAKED_B),
  source: 'imp-96327 (INDEPENDENTLY baked imp-96290 anchors)',
};

// SECOND ANCHOR A: different N (1e6), same C_H pair -> N-independence.
const SECOND_ANCHOR_A = crossCheck(1e6, 0.125, 0.127);
// SECOND ANCHOR B: same N (1e4), different C_H pair -> C_H-pair-independence.
const SECOND_ANCHOR_B = crossCheck(1e4, 0.127, 1.0);

export const IMP96349_ECOLL_RATIO_LAW_SECOND_ANCHOR = {
  id: 'imp-96349',
  title:
    'Second-anchor cross-validation: the imp-96311 cross-column E_coll ratio ' +
    'law E_coll(C_H_a)/E_coll(C_H_b) = C_H_a/C_H_b holds at a second N (1e6) ' +
    'and a second C_H pair (1.0/0.127), each inside its 6-sig-fig storage band',
  kind: 'measurement / accuracy audit (no closure, no bound change)',
  C_KH,
  firstAnchor: FIRST_ANCHOR,
  secondAnchorA: SECOND_ANCHOR_A,
  secondAnchorB: SECOND_ANCHOR_B,
  bandRule:
    'Propagated relative slack = ratio * (halfUlp(a)/a + halfUlp(b)/b) with ' +
    'halfUlp = 0.5 * 10^(floor(log10|x|) - 5) (6-sig-fig storage), matching the ' +
    'imp-96327 band that reproduces the 0.5e-7 absolute ULP of the ~0.011 anchors.',
  measurement: {
    nIndependence:
      'Second anchor A at N = 1e6 with the same C_H pair {0.125, 0.127}: ' +
      '6-sig-fig ratio ' +
      SECOND_ANCHOR_A.anchorRatio.toFixed(7) +
      ' vs target 1.016, residual ' +
      SECOND_ANCHOR_A.residual.toExponential(3) +
      ' inside band ' +
      SECOND_ANCHOR_A.band.toExponential(3) +
      '. The constant ratio survives a 100x change of N.',
    cHPairIndependence:
      'Second anchor B at N = 1e4 with a distinct C_H pair {1.0, 0.127}: ' +
      '6-sig-fig ratio ' +
      SECOND_ANCHOR_B.anchorRatio.toFixed(6) +
      ' vs target ' +
      SECOND_ANCHOR_B.targetRatio.toFixed(6) +
      ', residual ' +
      SECOND_ANCHOR_B.residual.toExponential(3) +
      ' inside band ' +
      SECOND_ANCHOR_B.band.toExponential(3) +
      '. The constant ratio survives an ~8x-spanning distinct C_H pair.',
    exactByConstruction:
      'Both second anchors are reconstructed from E_coll = C_H * R(N), so their ' +
      'UNROUNDED ratios equal C_H_b / C_H_a exactly (residuals ' +
      SECOND_ANCHOR_A.exactResidual.toExponential(1) +
      ' and ' +
      SECOND_ANCHOR_B.exactResidual.toExponential(1) +
      '); the measured residuals above are pure 6-sig-fig re-rounding-floor.',
  },
  subGap:
    'The corpus bakes exactly ONE INDEPENDENTLY stored E_coll anchor pair ' +
    '(imp-96290 at N = 1e4). The two second anchors here are formula-' +
    'reconstructed and re-rounded, so this is a STORAGE-FLOOR confirmation of ' +
    'N-independence and C_H-pair-independence of the ratio law, NOT a second ' +
    'INDEPENDENT external corroboration. A genuinely independent second anchor ' +
    'needs a fresh high-precision E_coll evaluation at a second N or C_H; the ' +
    'lone independent baked cross-check stays imp-96327 at N = 1e4.',
  verdict:
    'SECOND-ANCHOR CROSS-CHECK COMPLETE. The imp-96311 cross-column E_coll ' +
    'ratio law holds at a second height (N = 1e6, residual ' +
    SECOND_ANCHOR_A.residual.toExponential(2) +
    ' inside band ' +
    SECOND_ANCHOR_A.band.toExponential(2) +
    ') and a second C_H pair (1.0/0.127, residual ' +
    SECOND_ANCHOR_B.residual.toExponential(2) +
    ' inside band ' +
    SECOND_ANCHOR_B.band.toExponential(2) +
    '), so the constant-ratio claim is not a single-point coincidence -- with ' +
    'the honest caveat that both second anchors are formula-reconstructed ' +
    '(storage-floor, not independent). Accuracy audit only: no gap closed, no ' +
    'bound changed, G6_polymath15_bridge not closed, conditional C_H <= 0.127 ' +
    'stays UNPROVEN, C_H isRigorousUpperBound = false (imp-2642/imp-2701), ' +
    'imp-2640 Gronwall discharge of C_Lip NEGATIVE. RH open. NO QED.',
  provenance:
    'imp-96290-step4-bridge-subconstant-inventory.js (baked E_coll anchors, ' +
    'C_KH); imp-96311-ecoll-rate-ch-independence-tabulation.js (rate factor, ' +
    'gamma_N inversion, ratio law); imp-96327-ecoll-ratio-law-vs-anchor-' +
    'crossvalidation.js (single-anchor cross-check being extended).',
};

export const IMP96349_ECOLL_RATIO_LAW_SECOND_ANCHOR_ASSERTIONS = [
  {
    id: 'imp96349-second-anchor-n-within-band',
    holds: () => SECOND_ANCHOR_A.withinBand,
    why:
      'At the second height N = 1e6 the 6-sig-fig anchor ratio must equal the ' +
      'C_H ratio 0.127/0.125 to within its propagated storage band, showing the ' +
      'imp-96311 ratio law is not tied to the single N = 1e4 anchor.',
  },
  {
    id: 'imp96349-second-anchor-c-h-pair-within-band',
    holds: () => SECOND_ANCHOR_B.withinBand,
    why:
      'At the distinct C_H pair {1.0, 0.127} the 6-sig-fig anchor ratio must ' +
      'equal 1.0/0.127 to within its propagated storage band, showing the ratio ' +
      'law is not tied to the single {0.125, 0.127} pair.',
  },
  {
    id: 'imp96349-second-anchors-exact-by-construction',
    holds: () =>
      Math.abs(SECOND_ANCHOR_A.exactResidual) < 1e-12 &&
      Math.abs(SECOND_ANCHOR_B.exactResidual) < 1e-12,
    why:
      'The unrounded reconstructed ratios must equal C_H_b/C_H_a to machine ' +
      'precision (E_coll linear in C_H), confirming the measured residuals are ' +
      'pure re-rounding-floor artifacts and the sub-gap (storage-floor, not ' +
      'independent) is stated honestly.',
  },
  {
    id: 'imp96349-first-anchor-parity-with-imp96327',
    holds: () =>
      Math.abs(FIRST_ANCHOR.residual - 9.5583e-7) < 1e-9 &&
      Math.abs(FIRST_ANCHOR.band - 9.2642e-6) < 1e-9,
    why:
      'The recomputed first-anchor residual and band must reproduce the ' +
      'imp-96327 numbers (residual 9.56e-7, band 9.26e-6) so the second-anchor ' +
      'band methodology is apples-to-apples with the single-anchor check.',
  },
  {
    id: 'imp96349-no-closure-c-h-still-open',
    holds: () =>
      /no gap closed|NO QED|no bound changed/i.test(
        IMP96349_ECOLL_RATIO_LAW_SECOND_ANCHOR.verdict,
      ) &&
      IMP96349_ECOLL_RATIO_LAW_SECOND_ANCHOR.kind.includes('no closure'),
    why:
      'This ticket is measurement/accuracy only: it must not assert closure of ' +
      'G6_polymath15_bridge, must not change any bound, and must not reclassify ' +
      'the unproven conditional C_H <= 0.127 as rigorous.',
  },
];
