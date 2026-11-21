/**
 * @module data/imp-96402-ecoll-anchor-from-tabulated-true-zero-height
 * @fileoverview imp-96402 -- supply the E_coll anchor that imp-96363's RESIDUAL
 *   said was still missing: one whose gamma_N is an EXTERNALLY TABULATED TRUE
 *   ZERO HEIGHT, not a von-Mangoldt count inversion.
 *
 *   imp-96363 (lines 252-255) recorded a RESIDUAL: every stored E_coll anchor
 *   (imp-96290 / imp-96349 / imp-96363) obtains gamma_N by inverting a count
 *   model (Riemann-von Mangoldt main term, or +7/8-corrected), so NO anchor is
 *   independent of the count model -- both imp-96363 paths (Lambert-W closed
 *   form; +7/8 bisection) still invert a count. This module closes that residual
 *   by taking gamma_N directly from a published true zero height and measuring
 *   the relative gap of the resulting E_coll to the count-inversion value.
 *
 *   PRIMARY ANCHOR -- Odlyzko 10^22-nd zero. Odlyzko (2001), "The 10^22-nd zero
 *     of the Riemann zeta function," computed the true imaginary part
 *     gamma_{1e22} = 1370919909931995308226.68016 . This is an externally
 *     tabulated TRUE zero height, not a count inversion. Cross-validation: the
 *     RvM smooth count evaluated at this height returns exactly 1.0000000000e+22
 *     to double precision, confirming the height belongs to index N = 1e22.
 *     Building E_coll = C_H * sqrt(C_KH) * sqrt(log gamma_N / N) from this true
 *     height gives the FIRST count-model-INDEPENDENT anchor:
 *       E_coll(0.125, 1e22) = 2.502828e-11 , E_coll(0.127, 1e22) = 2.542873e-11 .
 *     The relative gap to the reconstructed (Lambert count-inversion) value is
 *     -1.53e-15 in gamma_N and 0 in the rate / E_coll at double precision.
 *
 *   HONEST CAVEAT (why the primary gap is at the floor). At N = 1e22 the true
 *     zero fluctuation the count model omits, S(gamma)/N ~ log(gamma) / N, is of
 *     order 1e-21 -- far below the ~1e-16 double-precision resolution of a
 *     21-digit height. So the -1.53e-15 gamma gap is dominated by the STORAGE
 *     floor of the tabulated height, not by the count model: at 1e22 the count
 *     inversion is indistinguishable from the true height in double precision.
 *
 *   LOW-INDEX CONTRAST -- first zero. To exhibit that the gap being measured is
 *     genuinely the count model (and that it collapses below the floor by 1e22),
 *     the module repeats the construction at the first zero, an externally
 *     tabulated true height gamma_1 = 14.134725141734693790 (Odlyzko / LMFDB).
 *     There the RvM main-term inversion (which omits +7/8 and S(T)) gives
 *     gamma_count = 22.5637, a relative gap of 5.96e-1 in gamma_N and 8.47e-2 in
 *     the rate / E_coll -- macroscopic, and clearly the count model, not a
 *     storage artifact. Thus the count-model dependence of the anchor is REAL at
 *     small N and provably collapses below double precision at the operative
 *     large heights, validating the count-inversion anchor as count-model-
 *     independent to double precision at N = 1e22.
 *
 *   MEASUREMENT / ACCURACY AUDIT ONLY. Closes no gap, changes no bound, proves
 *   no constant, does not close G6_polymath15_bridge. The conditional bound
 *   C_H <= 0.127 stays UNPROVEN; C_H isRigorousUpperBound remains false
 *   (imp-2642 / imp-2701); the imp-2640 Gronwall discharge of C_Lip stays
 *   NEGATIVE. No refereed bound is changed. RH remains open. NO QED.
 *
 * Provenance of baked inputs (single sources of truth, cited not re-derived):
 *   - imp-96311-ecoll-rate-ch-independence-tabulation.js: rate factor
 *     R(N) = sqrt(C_KH) * sqrt(log gamma_N / N), C_KH = pi * 2.622.
 *   - imp-96363-ecoll-independent-second-anchor.js: the RESIDUAL this module
 *     answers (tabulated-true-height anchor still absent), and the Lambert-W
 *     count-inversion path reused here as the reconstructed reference.
 *   - Odlyzko (2001) 10^22-nd zero; first zero from Odlyzko / LMFDB tables.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and
 *   this header avoids the close-comment terminator sequence inside prose.
 */

// Koksma-Hlawka discrepancy factor of E_coll (imp-2641 Trudgian), as in imp-96311.
const C_KH = Math.PI * 2.622; // = 8.2373...

// Principal Lambert W by Halley iteration -- the imp-96363 count-inversion path,
// reused here verbatim so the reconstructed reference is apples-to-apples.
function lambertW(x) {
  let w = x < Math.E ? x / Math.E : Math.log(x) - Math.log(Math.log(x));
  for (let i = 0; i < 200; i += 1) {
    const ew = Math.exp(w);
    const f = w * ew - x;
    const wp = w + 1;
    const dw = f / (ew * wp - ((w + 2) * f) / (2 * wp));
    w -= dw;
    if (Math.abs(dw) < 1e-16) break;
  }
  return w;
}

// Count-inversion gamma_N (RvM main term): (T/2pi)(log(T/2pi)-1)=N solved as
// T = 2pi * exp(1 + W(N/e)). This is the RECONSTRUCTED reference to compare to.
function gammaCountInversion(N) {
  return 2 * Math.PI * Math.exp(1 + lambertW(N / Math.E));
}

// RvM smooth count, used only to cross-validate that a tabulated true height
// belongs to the claimed index N.
function smoothCount(T) {
  const u = T / (2 * Math.PI);
  return u * (Math.log(u) - 1);
}

function rateFromGamma(gamma, N) {
  return Math.sqrt(C_KH) * Math.sqrt(Math.log(gamma) / N);
}
function eCollFromGamma(CH, gamma, N) {
  return CH * rateFromGamma(gamma, N);
}

const CH_A = 0.125;
const CH_B = 0.127;

// One measured anchor from an externally tabulated TRUE zero height, compared to
// the count-inversion (reconstructed) anchor at the same index.
function measureAnchor(N, gammaTrue, source) {
  const gammaCount = gammaCountInversion(N);
  const rateTrue = rateFromGamma(gammaTrue, N);
  const rateCount = rateFromGamma(gammaCount, N);
  return {
    N,
    source,
    gammaTrue,
    gammaCount,
    gammaRelGap: (gammaCount - gammaTrue) / gammaTrue,
    smoothCountAtTrue: smoothCount(gammaTrue),
    rateTrue,
    rateCount,
    rateRelGap: (rateCount - rateTrue) / rateTrue,
    E_coll_a_true: eCollFromGamma(CH_A, gammaTrue, N),
    E_coll_b_true: eCollFromGamma(CH_B, gammaTrue, N),
    E_coll_a_count: eCollFromGamma(CH_A, gammaCount, N),
    E_coll_b_count: eCollFromGamma(CH_B, gammaCount, N),
    eCollRelGap: (eCollFromGamma(CH_A, gammaCount, N) - eCollFromGamma(CH_A, gammaTrue, N)) /
      eCollFromGamma(CH_A, gammaTrue, N),
  };
}

// PRIMARY: Odlyzko (2001) 10^22-nd zero -- an externally tabulated true height.
const ANCHOR_ODLYZKO_1E22 = measureAnchor(
  1e22,
  1370919909931995308226.68016,
  'Odlyzko (2001), the 10^22-nd zero of the Riemann zeta function (true height)',
);

// CONTRAST: the first zero (Odlyzko / LMFDB) -- where the count-model gap is macroscopic.
const ANCHOR_FIRST_ZERO = measureAnchor(
  1,
  14.134725141734693790,
  'first nontrivial zero, gamma_1 (Odlyzko / LMFDB tabulated true height)',
);

export const IMP96402_ECOLL_ANCHOR_FROM_TABULATED_TRUE_ZERO_HEIGHT = {
  id: 'imp-96402',
  title:
    'Count-model-INDEPENDENT E_coll anchor from an externally tabulated true zero ' +
    'height (Odlyzko 10^22-nd zero), with a first-zero low-index contrast that ' +
    'resolves the count-model gap the 1e22 anchor pushes below the double floor',
  kind: 'measurement / accuracy audit (no closure, no bound change)',
  C_KH,
  primaryAnchorOdlyzko1e22: ANCHOR_ODLYZKO_1E22,
  contrastAnchorFirstZero: ANCHOR_FIRST_ZERO,
  measurement: {
    tabulatedTrueHeightAnchor:
      'The 10^22-nd zero true height gamma = 1370919909931995308226.68016 ' +
      '(Odlyzko 2001) gives the FIRST count-model-independent E_coll anchor: ' +
      'E_coll(0.125, 1e22) = ' +
      ANCHOR_ODLYZKO_1E22.E_coll_a_true.toExponential(6) +
      ', E_coll(0.127, 1e22) = ' +
      ANCHOR_ODLYZKO_1E22.E_coll_b_true.toExponential(6) +
      '. Its RvM smooth count is ' +
      ANCHOR_ODLYZKO_1E22.smoothCountAtTrue.toExponential(6) +
      ', confirming the height belongs to index N = 1e22.',
    relativeGapToReconstructed:
      'Relative gap of the tabulated-true-height anchor to the reconstructed ' +
      '(Lambert count-inversion) anchor at N = 1e22: ' +
      ANCHOR_ODLYZKO_1E22.gammaRelGap.toExponential(2) +
      ' in gamma_N and ' +
      ANCHOR_ODLYZKO_1E22.rateRelGap.toExponential(2) +
      ' in the rate / E_coll. This is at the double-precision STORAGE floor of a ' +
      '21-digit height, not a count-model gap: at 1e22 the omitted fluctuation ' +
      'S(gamma)/N ~ log(gamma)/N is of order 1e-21, far below double resolution, ' +
      'so the count inversion is indistinguishable from the true height here.',
    lowIndexContrast:
      'At the first zero (true height gamma_1 = 14.134725141734693790, index ' +
      'N = 1) the RvM main-term inversion gives gamma_count = ' +
      ANCHOR_FIRST_ZERO.gammaCount.toFixed(6) +
      ', a relative gap of ' +
      ANCHOR_FIRST_ZERO.gammaRelGap.toExponential(2) +
      ' in gamma_N and ' +
      ANCHOR_FIRST_ZERO.rateRelGap.toExponential(2) +
      ' in the rate / E_coll -- macroscopic, and clearly the count model (the ' +
      'omitted +7/8 and S(T)), not a storage artifact. The count-model ' +
      'dependence of the anchor is therefore REAL at small N and provably ' +
      'collapses below the double floor by N = 1e22, validating the ' +
      'count-inversion anchor as count-model-independent to double precision at ' +
      'the operative large heights.',
  },
  residualResolution:
    'imp-96363 RESIDUAL asked for an E_coll anchor whose gamma_N comes from a ' +
    'tabulated true zero height rather than a von-Mangoldt count inversion. This ' +
    'module supplies it (Odlyzko 10^22-nd zero) and measures the relative gap to ' +
    'the reconstructed count-inversion anchor: below the double-precision storage ' +
    'floor at 1e22 (so count-model-independent to that precision), while a ' +
    'first-zero contrast shows the gap is a genuine, macroscopic count-model ' +
    'effect at small N.',
  verdict:
    'TABULATED-TRUE-HEIGHT ANCHOR SUPPLIED. E_coll(0.125, 1e22) = ' +
    ANCHOR_ODLYZKO_1E22.E_coll_a_true.toExponential(6) +
    ' from the Odlyzko true height matches the count-inversion anchor to relative ' +
    ANCHOR_ODLYZKO_1E22.gammaRelGap.toExponential(2) +
    ' in gamma_N (double storage floor); the first-zero contrast resolves the ' +
    'count-model gap at ' +
    ANCHOR_FIRST_ZERO.rateRelGap.toExponential(2) +
    ' in the rate. Accuracy audit only: no gap closed, no bound changed, ' +
    'G6_polymath15_bridge not closed, conditional C_H <= 0.127 stays UNPROVEN, ' +
    'C_H isRigorousUpperBound = false (imp-2642/imp-2701), imp-2640 Gronwall ' +
    'discharge of C_Lip NEGATIVE. No refereed bound is changed. RH open. NO QED.',
  provenance:
    'imp-96311-ecoll-rate-ch-independence-tabulation.js (rate factor, C_KH); ' +
    'imp-96363-ecoll-independent-second-anchor.js (RESIDUAL answered; Lambert-W ' +
    'count-inversion reused as reference); Odlyzko (2001) 10^22-nd zero; first ' +
    'zero from Odlyzko / LMFDB tables.',
};

export const IMP96402_ECOLL_ANCHOR_FROM_TABULATED_TRUE_ZERO_HEIGHT_ASSERTIONS = [
  {
    id: 'imp96402-1e22-height-belongs-to-index',
    holds: () =>
      Math.abs(ANCHOR_ODLYZKO_1E22.smoothCountAtTrue / 1e22 - 1) < 1e-9,
    why:
      'The RvM smooth count evaluated at the tabulated Odlyzko 10^22-nd zero ' +
      'height must return N = 1e22 to double precision, cross-validating that the ' +
      'externally tabulated true height belongs to the claimed index.',
  },
  {
    id: 'imp96402-1e22-gap-at-storage-floor',
    holds: () =>
      Math.abs(ANCHOR_ODLYZKO_1E22.gammaRelGap) < 1e-13 &&
      Math.abs(ANCHOR_ODLYZKO_1E22.eCollRelGap) < 1e-12,
    why:
      'At N = 1e22 the tabulated-true-height anchor and the count-inversion ' +
      'anchor must agree to the double-precision storage floor (~1e-15 gamma, ' +
      'zero in the rate / E_coll), because the omitted S(gamma)/N ~ 1e-21 ' +
      'fluctuation is below double resolution -- the count model is ' +
      'indistinguishable from the true height at that height.',
  },
  {
    id: 'imp96402-first-zero-gap-is-macroscopic-count-model',
    holds: () =>
      Math.abs(ANCHOR_FIRST_ZERO.rateRelGap) > 1e-2 &&
      Math.abs(ANCHOR_FIRST_ZERO.gammaRelGap) > 1e-1,
    why:
      'At the first zero the RvM main-term inversion (omitting +7/8 and S(T)) ' +
      'must miss the tabulated true height by a macroscopic relative amount ' +
      '(order 8e-2 in the rate, 6e-1 in gamma), demonstrating the measured gap ' +
      'is a genuine count-model effect at small N, not a storage-floor artifact.',
  },
  {
    id: 'imp96402-no-closure-c-h-still-open',
    holds: () =>
      /no gap closed|NO QED|no bound changed/i.test(
        IMP96402_ECOLL_ANCHOR_FROM_TABULATED_TRUE_ZERO_HEIGHT.verdict,
      ) &&
      IMP96402_ECOLL_ANCHOR_FROM_TABULATED_TRUE_ZERO_HEIGHT.kind.includes(
        'no closure',
      ),
    why:
      'This ticket is measurement/accuracy only: it must not assert closure of ' +
      'G6_polymath15_bridge, must not change any bound, and must not reclassify ' +
      'the unproven conditional C_H <= 0.127 as rigorous.',
  },
];
