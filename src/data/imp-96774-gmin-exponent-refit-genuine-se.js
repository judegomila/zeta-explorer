/**
 * @module imp-96774-gmin-exponent-refit-genuine-se
 * @fileoverview imp-96774 -- Re-fit the small-gaps running-min exponent b on a THEORETICAL GUE
 *   sample at substantially larger count, across many INDEPENDENT realizations, to measure a
 *   GENUINE standard error SE(b) and re-read how many SE b truly sits from the cube-root pole
 *   c = -1/3 that drives the imp-96654 / imp-96680 near-pole crossover fragility.
 *   Theoretical GUE (Wigner surmise, beta = 2), NOT real zeros. Measurement only; NO QED.
 *   No refereed bound is changed.
 *
 *   THE QUESTION
 *   -----------------------------------------------
 *   imp-96654 reproduced the imp-96616 OLS log-log fit of the running-min normalized-gap ratio
 *   g_min(N)/y_N over a single 14-rung ladder (N = 50..1e6) drawn from the real Odlyzko zeros,
 *   getting b = -0.395338 with SE(b) = 0.020615 (df = 12), i.e. b sitting (b - c)/SE = -3.006 SE
 *   below the pole c = -1/3. Because N* = (A/C)^{1/(c-b)} has c - b in the exponent denominator, a
 *   3-SE gap already made N* unlocalized. But that SE came from OLS across 14 running-min rungs of a
 *   SINGLE sample -- and running-min rungs are a heavily AUTOCORRELATED staircase (the numerator is
 *   frozen at the last record gap across whole plateaus), so the within-realization OLS SE need not be
 *   the genuine fit uncertainty. This module regenerates the sample as theoretical GUE at large count
 *   over MANY independent realizations and measures the genuine replicate spread of b.
 *
 *   METHOD
 *   -----------------------------------------------
 *   GUE nearest-neighbour spacing (Wigner surmise, beta = 2): p(s) = (32/pi^2) s^2 exp(-4 s^2/pi),
 *   mean 1. It samples exactly as s = sqrt(pi/8) * chi_3 with chi_3 = sqrt(Z1^2+Z2^2+Z3^2), Zi~N(0,1)
 *   (density propto s^2 exp(-4 s^2/pi) by construction). The small-s repulsion p(s) ~ (32/pi^2) s^2
 *   -- the s^2 power -- is exactly what drives the running-min exponent to -1/3, identical to true GUE;
 *   the Wigner surmise is the standard fast proxy for THIS exponent. For each of M = 100 independent
 *   realizations, N_MAX = 2,000,000 i.i.d. gaps are streamed, the running-min ratio is recorded at the
 *   same 15-rung grid, and log(ratio) = a + b log(N) is fit by OLS. The GENUINE SE(b) is the standard
 *   deviation of b across the 100 realizations (and SE-of-mean = SD/sqrt(100)). Reproduced by
 *   tmp/imp-96774-refit.mjs (17 s, one run).
 *
 *   FINDING
 *   -----------------------------------------------
 *   1. THE THEORETICAL GUE EXPONENT IS THE POLE. Mean b = -0.336315 +/- 0.056783 (genuine single-
 *      realization SD), SE-of-mean 0.005678 over M = 100 realizations at N_MAX = 2e6. That is only
 *      (b - c)/SD = -0.053 single-realization SD, or -0.525 SE-of-mean, from c = -1/3 -- statistically
 *      indistinguishable from the cube-root pole. The measured single-power running-min exponent for
 *      theoretical GUE IS -1/3 to measurement precision.
 *   2. THE imp-96654 OLS SE UNDERSTATES THE FIT UNCERTAINTY BY ~2.75x. The genuine single-realization
 *      SD(b) = 0.056783 is ~2.75x LARGER than the imp-96654 within-realization OLS SE = 0.020615,
 *      because the 14/15 running-min rungs are a strongly autocorrelated staircase (frozen-record
 *      plateaus), so ordinary least squares across them treats correlated points as independent and
 *      shrinks the reported SE.
 *   3. THE "3 SE FROM THE POLE" READING IS AN ARTIFACT. Re-scored against the genuine spread, the real-
 *      zeros fit b = -0.395338 sits only (b - c)/SD = -1.092 single-realization SD from the pole, NOT
 *      the 3.006 "SE" of imp-96654. The single Odlyzko sample is a steep-side ~1.1-sigma draw of an
 *      exponent whose true value is the pole itself.
 *   4. N* STRADDLES THE SINGULARITY, IT IS NOT MERELY NEAR IT. Propagating the genuine SD through
 *      N* = (A/C)^{1/(c-b)} (A/C = 2.464111): the steep edge b = -0.393099 gives N* = 3.58e6
 *      (log10 = 6.55); the mean b = -0.336315 gives N* ~ 2.2e131 (essentially +infinity); the shallow
 *      edge b = -0.279532 gives c - b < 0, i.e. NO finite crossing at all. The +/-1 SD band crosses the
 *      pole, so N* is unbounded on both sides -- this SHARPENS imp-96654/imp-96680: the crossover is
 *      not "near-singular", it is AT the singularity because the theoretical GUE exponent equals -1/3.
 *
 *   HONEST SUB-GAP (imp96774-wigner-surmise-iid-proxy)
 *   -----------------------------------------------
 *   The sample is i.i.d. Wigner-surmise (beta = 2) gaps, a proxy for GUE. It reproduces the s^2 small-s
 *   repulsion that governs the -1/3 running-min exponent (so the exponent reading b -> -1/3 and its
 *   spread are proxy-robust), but it ignores the multi-gap sine-kernel correlations and higher-order
 *   finite-N corrections of exact GUE, so the ladder PREFACTOR and sub-leading terms may differ from
 *   the exact sine-kernel ensemble. The verdict here is about the EXPONENT and its uncertainty, not the
 *   prefactor.
 *
 *   WHAT THIS IS AND IS NOT
 *   -----------------------------------------------
 *   A numerical re-measurement of an exponent and its genuine standard error on theoretical GUE. It
 *   uses NO real zeros, instantiates no interval, closes no analytic sub-gap, and moves no bound. The
 *   imp-96616 consequence is unchanged: beating the 1/log^2 surrogate still needs the unproved GUE
 *   cube-root small-gaps law. RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96654-gmin-crossover-sensitivity-oscillation.js (the OLS SE = 0.0206 / "3 SE" reading this re-scores)
 * @see imp-96680-crossover-near-pole-fragility-glossary-headword.js (the near-pole fragility headword)
 * @see imp-96637-gmin-fit-gue-crossover.js (the point-estimate crossover N* = 2.09e6)
 * @see imp-96616-gmin-ratio-extreme-gap-decay.js (the real-zeros fit A N^b, A=2.1147, b=-0.3953)
 *
 * Ticket: imp-96774 (numerical, medium, opus-4-8). Measurement only; theoretical GUE not real zeros;
 * changes no bound; NO QED; no refereed bound is changed.
 */

export const IMP96774_GMIN_EXPONENT_REFIT_GENUINE_SE = Object.freeze({
  id: 'imp-96774',
  proofSection: 'S-frontier',
  reScores: 'imp-96654',
  question:
    'imp-96654 reported the running-min small-gaps exponent b = -0.395338 as sitting -3.006 SE from ' +
    'the cube-root pole c = -1/3, using the OLS SE over a single autocorrelated 14-rung real-zeros ' +
    'ladder. Regenerating the sample as theoretical GUE at large count over many INDEPENDENT ' +
    'realizations, what is the GENUINE SE(b) and how many SE does b truly sit from the pole?',
  method: Object.freeze({
    ensemble: 'GUE nearest-neighbour spacing, Wigner surmise beta=2, p(s) = (32/pi^2) s^2 exp(-4 s^2/pi)',
    sampler: 's = sqrt(pi/8) * chi_3, chi_3 = sqrt(Z1^2+Z2^2+Z3^2), Zi~N(0,1) (exact Wigner surmise, mean 1)',
    nMax: 2000000,
    realizations: 100,
    grid: [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000,
      100000, 200000, 500000, 1000000, 2000000],
    ratioDefinition: 'running min over n<=N of the normalized gap s_n (streamed, no correlations added)',
    fit: 'OLS log(ratio) = a + b log(N) per realization; genuine SE(b) = SD of b across realizations',
    reproScript: 'tmp/imp-96774-refit.mjs',
    elapsedSec: 17.0,
  }),
  // (1) genuine replicate statistics of the exponent
  refit: Object.freeze({
    meanB: -0.336315,
    genuineSdB: 0.056783,       // SD of b across the 100 realizations = genuine single-realization SE
    seOfMeanB: 0.005678,        // SD / sqrt(100)
    bMin: -0.484768,
    bMax: -0.178647,
    poleC: -1 / 3,
    distToPoleInSD: -0.0525,        // (meanB - c) / genuineSdB
    distToPoleInSEofMean: -0.5252,  // (meanB - c) / seOfMeanB
    reading:
      'theoretical GUE running-min exponent b = -0.3363 +/- 0.0568 (single-realization SD) is ' +
      'statistically indistinguishable from the pole c = -1/3 (0.05 SD, 0.53 SE-of-mean)',
  }),
  // (2) the imp-96654 OLS SE is smaller than the genuine replicate SD
  seComparison: Object.freeze({
    imp96654OlsSe: 0.020615,
    genuineReplicateSd: 0.056783,
    ratioGenuineOverOls: 2.754, // 0.056783 / 0.020615
    cause:
      'the 14/15 running-min rungs are a strongly autocorrelated staircase (frozen-record plateaus), ' +
      'so OLS treats correlated points as independent and shrinks the reported SE',
  }),
  // (3) re-scoring the real-zeros point fit against the genuine spread
  realZerosReScore: Object.freeze({
    realZerosB: -0.395338, // imp-96616 / imp-96654
    distToPoleImp96654: -3.006,  // using OLS SE 0.020615
    distToPoleGenuine: -1.092,   // using genuine SD 0.056783
    verdict:
      'the real-zeros fit is a steep-side ~1.1-sigma draw of an exponent whose true value is the pole; ' +
      'the "-3.006 SE from the pole" reading is an artifact of the understated autocorrelated OLS SE',
  }),
  // (4) N* straddles the pole under the genuine spread
  crossoverSensitivity: Object.freeze({
    prefactorRatioAoverC: 2.464111,
    poleAt: -1 / 3,
    NstarAtMeanB: 2.16e131,   // c-b = +0.00299 => N* ~ (A/C)^{334} essentially +infinity
    log10NstarAtMeanB: 131.33,
    NstarSteepEdge: 3.5753e6, // b = meanB - SD = -0.393099
    log10NstarSteepEdge: 6.553,
    shallowEdgeB: -0.279532,  // meanB + SD
    shallowEdgeHasFiniteCrossing: false, // c - b < 0 => no finite crossing
    verdict:
      'the +/-1 SD band on the theoretical GUE exponent CROSSES the pole -- steep edge N* = 3.58e6, ' +
      'mean essentially +infinity, shallow edge no finite crossing -- so N* is unbounded on both sides; ' +
      'the crossover is AT the singularity, sharpening the imp-96654 near-singular reading',
  }),
  subGap: Object.freeze({
    key: 'imp96774-wigner-surmise-iid-proxy',
    statement:
      'sample is i.i.d. Wigner-surmise (beta=2) gaps, a GUE proxy that reproduces the s^2 small-s ' +
      'repulsion setting the -1/3 running-min exponent (exponent reading proxy-robust) but ignores ' +
      'multi-gap sine-kernel correlations and higher-order finite-N corrections, so the ladder ' +
      'prefactor and sub-leading terms may differ from exact sine-kernel GUE',
  }),
  anyBoundMoved: false,
  verdict:
    'NUMERICAL RE-MEASUREMENT (theoretical GUE, not real zeros). Over 100 independent Wigner-surmise ' +
    'realizations at N_max = 2e6, the running-min small-gaps exponent is b = -0.3363 +/- 0.0568 ' +
    '(genuine single-realization SD), i.e. only ~0.05 SD (0.53 SE-of-mean) from the cube-root pole ' +
    'c = -1/3: the theoretical GUE exponent IS the pole to measurement precision. The genuine SD is ' +
    '~2.75x the imp-96654 within-realization OLS SE = 0.0206, so that OLS SE understated the fit ' +
    'uncertainty; re-scored against the genuine spread the real-zeros b = -0.395338 sits only ~1.09 ' +
    'SD from the pole, not the 3.006 SE quoted. The +/-1 SD band on b crosses the pole, so N* is ' +
    'unbounded on both sides -- the crossover is AT the singularity. Changes no bound; the imp-96616 ' +
    'consequence (beating 1/log^2 needs the unproved GUE cube-root law) is unchanged; RH open; NO QED; ' +
    'no refereed bound is changed.',
  citation:
    'imp-96654 (OLS SE 0.0206 / -3.006 SE reading re-scored here); imp-96680 (near-pole fragility ' +
    'headword); imp-96637 (point-estimate crossover N* = 2.09e6); imp-96616 (real-zeros fit A N^b).',
});

export default IMP96774_GMIN_EXPONENT_REFIT_GENUINE_SE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96774_GMIN_EXPONENT_REFIT_GENUINE_SE_ASSERTIONS = [
  {
    id: 'imp96774-genuine-se-larger-than-ols',
    why: 'The core finding: the genuine replicate SD exceeds the imp-96654 autocorrelated OLS SE, ' +
      'so the reported "3 SE from the pole" was understated.',
    holds: () => {
      const c = IMP96774_GMIN_EXPONENT_REFIT_GENUINE_SE.seComparison;
      return c.genuineReplicateSd > c.imp96654OlsSe && Math.abs(c.ratioGenuineOverOls - 2.754) < 0.01;
    },
  },
  {
    id: 'imp96774-exponent-at-pole',
    why: 'The theoretical GUE mean exponent must sit within 1 SD of the cube-root pole -1/3.',
    holds: () => {
      const r = IMP96774_GMIN_EXPONENT_REFIT_GENUINE_SE.refit;
      return Math.abs(r.meanB - r.poleC) < r.genuineSdB && Math.abs(r.distToPoleInSD) < 1;
    },
  },
  {
    id: 'imp96774-honesty-gate-no-qed',
    why: 'Measurement only: no bound moved, honest sub-gap named, NO QED, no-refereed-bound-change line present.',
    holds: () => {
      const m = IMP96774_GMIN_EXPONENT_REFIT_GENUINE_SE;
      return (
        m.anyBoundMoved === false &&
        m.subGap.key === 'imp96774-wigner-surmise-iid-proxy' &&
        /NO QED/.test(m.verdict) &&
        /refereed bound is changed/i.test(m.verdict)
      );
    },
  },
];

for (const assertion of IMP96774_GMIN_EXPONENT_REFIT_GENUINE_SE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96774-gmin-exponent-refit-genuine-se assertion failed: ${assertion.id}`,
    );
  }
}
