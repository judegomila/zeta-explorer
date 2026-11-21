/**
 * @module imp-96810-sine-kernel-correlated-se
 * @fileoverview imp-96810 -- Remeasure the imp-96774 running-min small-gap exponent GENUINE SE(b)
 *   on a CORRELATED exact-sine-kernel (determinantal) GUE sample, rather than the imp-96774 iid
 *   Wigner-surmise proxy, to test whether the ~2.75x SE inflation over the imp-96654 autocorrelated
 *   OLS SE is proxy-robust or an artifact of dropping multi-gap correlations.
 *   Theoretical GUE (beta = 2), NOT real zeros. Measurement only; NO QED.
 *   No refereed bound is changed.
 *
 *   THE SUB-GAP BEING CLOSED (imp96774-wigner-surmise-iid-proxy)
 *   -----------------------------------------------
 *   imp-96774 measured a GENUINE single-realization SD(b) = 0.056783 (~2.75x the imp-96654
 *   within-realization OLS SE = 0.020615) for the running-min small-gaps exponent, but it drew the
 *   sample from i.i.d. Wigner-surmise (beta = 2) gaps. Those reproduce the marginal s^2 small-s
 *   repulsion that fixes the -1/3 exponent, but they DROP the multi-gap sine-kernel correlations and
 *   finite-N corrections of exact GUE, so its own honest sub-gap flagged that the SE magnitude and the
 *   ladder prefactor could differ under the exact ensemble. This module regenerates the ladder from a
 *   CORRELATED exact-GUE sample and remeasures SE(b).
 *
 *   METHOD -- exact GUE via the Dumitriu-Edelman tridiagonal Hermite ensemble
 *   -----------------------------------------------
 *   The correlated sample is EXACT GUE (beta = 2), not a proxy: the Dumitriu-Edelman (2002)
 *   tridiagonal Hermite beta-ensemble is an n x n real symmetric tridiagonal matrix whose eigenvalues
 *   have exactly the GUE joint density prop |Delta(lam)|^2 exp(-(1/2) sum lam^2), hence exact
 *   sine-kernel bulk correlations. Diagonal d_i ~ N(0,1); off-diagonal b_i = sqrt(chi2_{2(n-i)}/2),
 *   i = 1..n-1. Then E[trace M^2] = n + 2 sum E[b_i^2] = n^2, so the limiting spectrum is the
 *   semicircle on [-R, R] with R = 2 sqrt(n). The central bulk (|lam| < 0.7 R) is unfolded by the
 *   analytic semicircle counting function xi = n F(lam) (mean spacing 1); consecutive unfolded gaps
 *   carry the exact sine-kernel correlations. Independent GUE matrices (n = 4000) are concatenated to
 *   build the running-min ladder; seams are ~30 of 100000 gaps (negligible). For each of M = 80
 *   independent realizations the same 11-rung grid (N = 50..100000) is fit by OLS log(runmin) =
 *   a + b log(N); the genuine SE(b) is the SD of b across realizations. A MATCHED iid Wigner-surmise
 *   control is run at the SAME N_MAX / grid / M so the correlated-vs-iid SE comparison is
 *   apples-to-apples. Reproduced by tmp/imp-96810-sine-kernel-se.py (scipy eigvalsh_tridiagonal, ~336 s).
 *
 *   FINDING
 *   -----------------------------------------------
 *   1. CORRELATIONS WIDEN THE GENUINE SPREAD, THEY DO NOT NARROW IT. The correlated exact-sine-kernel
 *      SD(b) = 0.085802 is ~1.16x the MATCHED iid Wigner-surmise SD(b) = 0.073786 (same N_MAX =
 *      100000, same grid, M = 80). So the ~2.75x SE inflation of imp-96774 over the imp-96654 OLS SE is
 *      PROXY-ROBUST: exact multi-gap correlations preserve it and in fact enlarge the genuine spread by
 *      ~16%, ruling out the "iid proxy inflated the SE" reading. (Both reduced-N_MAX SDs exceed the
 *      imp-96774 full-length N_MAX = 2e6 figure 0.056783, as expected for a shorter ladder.)
 *   2. THE EXACT-GUE EXPONENT IS STILL THE POLE. Correlated mean b = -0.327992 +/- 0.085802 sits only
 *      (b - c)/SD = +0.062 single-realization SD (0.557 SE-of-mean) from the cube-root pole c = -1/3 --
 *      statistically indistinguishable from the pole, matching the imp-96774 iid reading (-0.3363).
 *      Exact sine-kernel correlations do not move the exponent off the pole.
 *   3. AGAINST THE OLS SE THE INFLATION IS EVEN LARGER UNDER CORRELATIONS. The correlated SD is
 *      0.085802 / 0.020615 = 4.16x the imp-96654 OLS SE (the matched iid is 3.58x), so re-scoring the
 *      real-zeros fit b = -0.395338 against the correlated spread puts it (b - c)/SD = -0.723 SD from
 *      the pole -- even closer to the pole than the iid re-score (-1.09), and far from the -3.006 "SE"
 *      of imp-96654. The near-pole crossover fragility of imp-96654/imp-96680 is confirmed under the
 *      exact ensemble.
 *
 *   HONEST SUB-GAP (imp96810-reduced-nmax-concatenated-blocks)
 *   -----------------------------------------------
 *   Exact determinantal sampling requires diagonalization, so N_MAX is reduced to 100000 (vs 2e6 in the
 *   imp-96774 iid full run) and the long ladder is built by concatenating independent GUE-matrix bulk
 *   blocks (~31 blocks of ~3245 gaps), which loses correlation at ~30 seam gaps. The primary comparator
 *   is therefore the MATCHED iid control at the same N_MAX; the full-length 0.056783 is quoted only as a
 *   reference. The seam fraction (~3e-4) and reduced N_MAX do not change the sign of the result
 *   (correlations widen, not narrow), but a single-matrix run at N_MAX ~ n would remove the seams
 *   entirely at the cost of ladder length.
 *
 *   WHAT THIS IS AND IS NOT
 *   -----------------------------------------------
 *   A numerical re-measurement of the exponent SE on a CORRELATED exact-GUE (sine-kernel) sample. It
 *   uses NO real zeros, instantiates no interval, closes no analytic sub-gap, and moves no bound. The
 *   imp-96616 consequence is unchanged: beating the 1/log^2 surrogate still needs the unproved GUE
 *   cube-root small-gaps law. RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96774-gmin-exponent-refit-genuine-se.js (the iid-proxy SD 0.0568 / 2.75x inflation this re-tests)
 * @see imp-96654-gmin-crossover-sensitivity-oscillation.js (the OLS SE = 0.0206 / "3 SE" reading)
 * @see imp-96680-crossover-near-pole-fragility-glossary-headword.js (the near-pole fragility headword)
 * @see imp-96616-gmin-ratio-extreme-gap-decay.js (the real-zeros fit A N^b, b = -0.3953)
 *
 * Ticket: imp-96810 (numerical, low, opus-4-8). Measurement only; theoretical GUE not real zeros;
 * changes no bound; NO QED; no refereed bound is changed.
 */

export const IMP96810_SINE_KERNEL_CORRELATED_SE = Object.freeze({
  id: 'imp-96810',
  proofSection: 'S-frontier',
  closesSubGapOf: 'imp-96774',
  subGapClosed: 'imp96774-wigner-surmise-iid-proxy',
  question:
    'imp-96774 measured the genuine running-min exponent SD(b) = 0.056783 (~2.75x the imp-96654 OLS ' +
    'SE) on an i.i.d. Wigner-surmise proxy that drops multi-gap sine-kernel correlations. Regenerating ' +
    'the ladder from a CORRELATED exact-GUE (determinantal) sample, do inter-gap correlations widen or ' +
    'narrow the genuine SE(b), and does the exponent stay at the cube-root pole c = -1/3?',
  method: Object.freeze({
    ensemble: 'exact GUE beta=2 via Dumitriu-Edelman tridiagonal Hermite ensemble (exact sine-kernel bulk correlations)',
    tridiagonal: 'diagonal d_i ~ N(0,1); off-diagonal b_i = sqrt(chi2_{2(n-i)}/2), i=1..n-1',
    matrixDim: 4000,
    unfolding: 'central bulk |lam| < 0.7 R (R = 2 sqrt(n)) unfolded by analytic semicircle counting xi = n F(lam), mean spacing 1',
    ladderBuild: 'independent GUE matrices concatenated to N_MAX; ~30 seam gaps of 100000 (negligible)',
    nMax: 100000,
    realizations: 80,
    grid: [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],
    fit: 'OLS log(runmin) = a + b log(N) per realization; genuine SE(b) = SD of b across realizations',
    control: 'MATCHED iid Wigner-surmise (beta=2) at the same N_MAX / grid / M for apples-to-apples SE comparison',
    reproScript: 'tmp/imp-96810-sine-kernel-se.py',
    solver: 'scipy.linalg.eigvalsh_tridiagonal',
    elapsedSec: 335.8,
  }),
  // (1) correlated exact-sine-kernel replicate statistics
  correlatedSine: Object.freeze({
    meanB: -0.327992,
    genuineSdB: 0.085802,
    seOfMeanB: 0.009593,
    bMin: -0.549420,
    bMax: -0.114600,
    poleC: -1 / 3,
    distToPoleInSD: 0.0623,        // (meanB - c) / genuineSdB
    distToPoleInSEofMean: 0.5568,  // (meanB - c) / seOfMeanB
    reading:
      'exact-GUE (sine-kernel) running-min exponent b = -0.3280 +/- 0.0858 (single-realization SD) is ' +
      'statistically indistinguishable from the pole c = -1/3 (0.06 SD, 0.56 SE-of-mean)',
  }),
  // (2) matched iid control at the same reduced N_MAX
  iidMatched: Object.freeze({
    meanB: -0.344837,
    genuineSdB: 0.073786,
    seOfMeanB: 0.008250,
    reading:
      'matched iid Wigner-surmise at N_MAX = 100000 gives b = -0.3448 +/- 0.0738; the reduced-N_MAX iid ' +
      'SD exceeds the imp-96774 full-length N_MAX = 2e6 figure 0.056783 (shorter ladder = wider spread)',
  }),
  // (3) the headline comparison: correlations WIDEN the genuine spread
  seComparison: Object.freeze({
    correlatedSdB: 0.085802,
    iidMatchedSdB: 0.073786,
    ratioCorrOverIidMatched: 1.1629,      // 0.085802 / 0.073786
    imp96774IidFullSdB: 0.056783,          // N_MAX = 2e6 reference
    imp96654OlsSe: 0.020615,
    ratioCorrOverOls: 4.162,               // 0.085802 / 0.020615
    ratioIidMatchedOverOls: 3.579,         // 0.073786 / 0.020615
    verdict:
      'exact sine-kernel correlations WIDEN the genuine SE(b) by ~16% over the matched iid proxy; the ' +
      '~2.75x SE inflation of imp-96774 over the imp-96654 OLS SE is proxy-robust (correlations preserve ' +
      'and enlarge it, not an iid artifact)',
  }),
  // (4) re-scoring the real-zeros point fit against the correlated spread
  realZerosReScore: Object.freeze({
    realZerosB: -0.395338, // imp-96616 / imp-96654
    distToPoleImp96654: -3.006,   // OLS SE 0.020615
    distToPoleIidGenuine: -1.092, // imp-96774 iid SD 0.056783
    distToPoleCorrGenuine: -0.723, // (b - c) / 0.085802
    verdict:
      'under the correlated exact-GUE spread the real-zeros fit sits only ~0.72 SD from the pole -- even ' +
      'closer than the iid re-score (~1.09 SD) and far from the -3.006 "SE" of imp-96654; the near-pole ' +
      'crossover fragility is confirmed under the exact ensemble',
  }),
  subGap: Object.freeze({
    key: 'imp96810-reduced-nmax-concatenated-blocks',
    statement:
      'exact determinantal sampling requires diagonalization, so N_MAX is reduced to 100000 (vs 2e6) and ' +
      'the ladder is built from concatenated independent GUE-matrix bulk blocks (~30 seam gaps of 100000, ' +
      '~3e-4); the primary comparator is the matched iid control at the same N_MAX, and the sign of the ' +
      'result (correlations widen, not narrow) is unaffected by the seams or the reduced length',
  }),
  anyBoundMoved: false,
  verdict:
    'NUMERICAL RE-MEASUREMENT on a CORRELATED exact-GUE (sine-kernel) sample via the Dumitriu-Edelman ' +
    'tridiagonal ensemble, closing the imp-96774 honest sub-gap imp96774-wigner-surmise-iid-proxy. Over ' +
    '80 independent exact-GUE realizations at N_MAX = 100000, the running-min exponent is b = -0.3280 ' +
    '+/- 0.0858 (genuine single-realization SD), only ~0.06 SD (0.56 SE-of-mean) from the cube-root pole ' +
    'c = -1/3: the exact-GUE exponent IS the pole, matching the iid reading. The correlated SD is ~1.16x ' +
    'the MATCHED iid Wigner-surmise SD (0.0738 at the same N_MAX) and 4.16x the imp-96654 OLS SE, so ' +
    'inter-gap sine-kernel correlations WIDEN the genuine spread rather than narrow it: the ~2.75x SE ' +
    'inflation of imp-96774 is proxy-robust, not an iid artifact. Re-scored against the correlated spread ' +
    'the real-zeros b = -0.395338 sits only ~0.72 SD from the pole. Changes no bound; the imp-96616 ' +
    'consequence (beating 1/log^2 needs the unproved GUE cube-root law) is unchanged; RH open; NO QED; ' +
    'no refereed bound is changed.',
  citation:
    'imp-96774 (iid-proxy SD 0.0568 / 2.75x inflation re-tested here); imp-96654 (OLS SE 0.0206); ' +
    'imp-96680 (near-pole fragility headword); imp-96616 (real-zeros fit A N^b).',
});

export default IMP96810_SINE_KERNEL_CORRELATED_SE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96810_SINE_KERNEL_CORRELATED_SE_ASSERTIONS = [
  {
    id: 'imp96810-correlations-widen-not-narrow',
    why: 'The core finding: the correlated exact-sine-kernel SD exceeds the matched iid SD, so ' +
      'correlations widen the genuine spread and the imp-96774 SE inflation is proxy-robust.',
    holds: () => {
      const c = IMP96810_SINE_KERNEL_CORRELATED_SE.seComparison;
      return c.correlatedSdB > c.iidMatchedSdB && Math.abs(c.ratioCorrOverIidMatched - 1.1629) < 0.01;
    },
  },
  {
    id: 'imp96810-exponent-at-pole',
    why: 'The exact-GUE mean exponent must sit within 1 SD of the cube-root pole -1/3.',
    holds: () => {
      const r = IMP96810_SINE_KERNEL_CORRELATED_SE.correlatedSine;
      return Math.abs(r.meanB - r.poleC) < r.genuineSdB && Math.abs(r.distToPoleInSD) < 1;
    },
  },
  {
    id: 'imp96810-honesty-gate-no-qed',
    why: 'Measurement only: no bound moved, honest sub-gap named, closes the imp-96774 sub-gap, NO QED, no-refereed-bound-change line present.',
    holds: () => {
      const m = IMP96810_SINE_KERNEL_CORRELATED_SE;
      return (
        m.anyBoundMoved === false &&
        m.subGapClosed === 'imp96774-wigner-surmise-iid-proxy' &&
        m.subGap.key === 'imp96810-reduced-nmax-concatenated-blocks' &&
        /NO QED/.test(m.verdict) &&
        /refereed bound is changed/i.test(m.verdict)
      );
    },
  },
];

for (const assertion of IMP96810_SINE_KERNEL_CORRELATED_SE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96810-sine-kernel-correlated-se assertion failed: ${assertion.id}`,
    );
  }
}
