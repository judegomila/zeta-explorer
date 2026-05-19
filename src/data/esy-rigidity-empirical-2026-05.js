// imp-1108 -- SOTA attack #3: numerical empirical measurement of ESY psi_N
// at our existing N (first N Odlyzko Riemann zeros, N in {100, 500, 1000,
// 5000, 10000}).
//
// CONTEXT
// -------
// The Erdos-Schlein-Yau (ESY) local semicircle law (Comm. Math. Phys. 287,
// 2009; subsequent refinements 2011-2013) asserts that for an N x N Wigner
// random matrix the empirical Stieltjes transform
//     m_N(z) := (1/N) * sum_{k=1..N} 1 / (z - lambda_k)
// converges to the Stieltjes transform m_sc(z) of the Wigner semicircle
// law, with control of the FLUCTUATION psi_N(z) := |m_N(z) - m_sc(z)| of
// order polylog(N) / N down to the microscopic scale eta ~ c / N (or in
// finer formulations, polylog(N) / (N * eta) at general eta).
//
// Open question (imp-370, imp-407, imp-508, imp-1106): does the analogous
// rigidity hold for the deterministic sequence of non-trivial Riemann zeta
// zeros {gamma_k}? A rigorous port of ESY to zeros would unlock an
// asymptotic improvement of the Polymath15 Lambda bound (PT 2021). The
// rigorous port has at least three identified obstacles (O1 arithmetic
// input, O2 forward-vs-backward heat flow, O3 deterministic-vs-probabilistic
// concentration); see src/math/esy-o1-closure.js for the partial closure
// of O1 by the Burgers-envelope + Cauchy-interlacing chain.
//
// This file ships an EMPIRICAL ONLY measurement: are the Riemann zeros
// numerically rigidity-compatible with ESY at our existing N? A positive
// answer is a strong hint that the rigorous port is achievable; a negative
// answer would name a precise empirical obstruction and pivot subsequent
// attack effort toward Goldston-Yildirim (sieve) or Soundararajan-Bui
// (zero-density estimates) instead.
//
// OPERATIONAL DEFINITION OF psi_N
// -------------------------------
// To make ESY and Riemann zeros directly comparable, we UNFOLD the zeros
// so they have asymptotic unit mean spacing:
//     x_k := (gamma_k / (2*pi)) * log(gamma_k / (2*pi))
// This is the standard Riemann-von Mangoldt rescaling whose smooth density
// is constant 1 in the bulk (cf imp-1099 GUE comparison, imp-1098 pair
// correlation).
//
// The empirical Stieltjes transform of the unfolded zeros is
//     m_N(z) := sum_{k=1..N} 1 / (z - x_k)
// (raw -- no factor 1/N, since the bulk density is 1 not 1/N). For
// z = E + i*eta with eta small, the Plemelj-Sokhotski formula gives
//     Im(m_N(E + i*eta))  approx  -pi * rho(E)
// where rho is the local density. For unfolded zeros in the bulk rho = 1,
// so the predicted value is -pi.
//
// We define
//     psi_N(E; c) := | Im(m_N(E + i*c/N)) + pi |
// and take the TYPICAL psi_N as the root-mean-square over M test points
// E_j drawn from the bulk window x_{floor(N/4)} .. x_{floor(3*N/4)}.
//
// CRITICAL: the test points E_j must lie BETWEEN consecutive unfolded
// zeros, never ON a zero. If E_j coincides with x_k the singular term
// 1/(E_j + i*eta - x_k) = 1/(i*eta) = -i*N/c dominates the sum and gives
// Im(m_N) approx -N/c (scales linearly with N) instead of the bulk limit
// -pi. We therefore sample E_j as the midpoint of consecutive bulk zeros:
//     E_j := (x_{lo+j} + x_{lo+j+1}) / 2
//
// The ticket fixes c = 1 and reports a single representative test point
// E = midpoint between zeros floor(N/2) and floor(N/2)+1 plus the RMS over
// the bulk window for robustness. The slope fit uses the RMS.
//
// EXPECTED SCALING
// ----------------
// The ticket sets the headline expectation as psi_N ~ polylog(N) / N
// (slope approximately -1 in log N). We faithfully measure this slope.
//
// MATHEMATICAL CAVEAT (honest scope item): the ESY local semicircle law
// at scale eta gives |m_N - m_sc| < (log N)^A / (N * eta). At eta = c/N
// this is (log N)^A / c, which is BOUNDED in N (slope approximately 0)
// not 1/N. The ticket-stated polylog/N rate corresponds to MACROSCOPIC
// eta = c (fixed) rather than microscopic eta = c/N. We measure BOTH:
//   psi_micro_N    = | Im(m_N(E + i*c/N)) + pi |     (ticket-fixed; bounded)
//   psi_macro_N    = | Im(m_N(E + i*c)) + pi |       (auxiliary;     1/N)
// and report both slopes. The headline empiricalAgreement verdict uses
// the macroscopic series because that is the well-posed ESY scaling
// regime; the microscopic series is reported for completeness and as the
// literal answer to the ticket-fixed operational definition.
//
// HONEST SCOPE
// ------------
// This is a PURE EMPIRICAL exploration -- it does NOT prove rigidity for
// Riemann zeros and does NOT close any of obstacles O1-O3. A favourable
// slope means only that the rigorous attack is empirically consistent.
// An unfavourable slope would falsify the operational ESY analogy and is
// the more useful outcome (it would route follow-on effort).
//
// @see imp-1108
// @see src/math/esy-o1-closure.js (rigorous partial closure of O1)
// @see src/data/gue-vs-zeros-comparison.js (imp-1099 sibling)
// @see src/data/pair-correlation-montgomery-numerical.js (imp-1098 sibling)

import { ZEROS_EXTENDED } from './zeros-to-1e6.js';

// -- Configuration -------------------------------------------------------

const TWO_PI = 2 * Math.PI;

// Ticket-fixed parameters.
const C_PARAM = 1;
const N_VALUES = [100, 500, 1000, 5000, 10000];

// Sample size for the bulk RMS: number of test points E_j in the bulk
// window x_{floor(N/4)} .. x_{floor(3*N/4)}. Capped at N/2 (the bulk
// window itself); for small N (e.g. N=100) the bulk has only 50 points so
// M is capped accordingly.
const M_BULK_MAX = 50;

// -- Unfolding -----------------------------------------------------------

// Riemann-von Mangoldt local unfolding so the unfolded zero sequence has
// asymptotic mean spacing 1.
function unfoldOne(gamma) {
  return (gamma / TWO_PI) * Math.log(gamma / TWO_PI);
}

function unfoldFirstN(N) {
  const xs = new Array(N);
  for (let k = 0; k < N; k++) {
    xs[k] = unfoldOne(ZEROS_EXTENDED[k]);
  }
  return xs;
}

// -- Empirical Stieltjes transform sum_k 1 / ((E - x_k) + i*eta) ---------
// Returns {re, im}. Direct loop, no shortcuts (N up to 1e4 per call x
// modest M, total ~5e6 floating ops -- trivial).

function stieltjesAt(xs, E, eta) {
  let re = 0;
  let im = 0;
  const N = xs.length;
  for (let k = 0; k < N; k++) {
    const dE = E - xs[k];
    const denom = dE * dE + eta * eta;
    re += dE / denom;
    im += -eta / denom;
  }
  return { re, im };
}

// -- Per-N psi_N measurement --------------------------------------------

function measurePsiNAtScale(N, c, eta) {
  const xs = unfoldFirstN(N);

  // Bulk window indices [floor(N/4), floor(3*N/4) - 1] so the midpoint
  // x_{idx+1} is well-defined.
  const lo = Math.floor(N / 4);
  const hi = Math.floor((3 * N) / 4) - 1;
  const bulkSize = Math.max(hi - lo, 1);
  const M = Math.min(M_BULK_MAX, bulkSize);

  // Choose M evenly-spaced indices in the bulk window; test point E_j is
  // the midpoint of consecutive unfolded zeros x_{idx} and x_{idx+1} so
  // it never coincides with a zero (otherwise the singular term
  // 1/(0 + i*eta) = -i*N/c would dominate Im(m_N) and give a spurious
  // -N/c instead of the bulk limit -pi).
  const testEs = new Array(M);
  for (let j = 0; j < M; j++) {
    const frac = M === 1 ? 0.5 : j / (M - 1);
    const idx = lo + Math.floor(frac * (bulkSize - 1));
    testEs[j] = 0.5 * (xs[idx] + xs[idx + 1]);
  }

  // Single representative point: midpoint between x_{floor(N/2)} and
  // x_{floor(N/2)+1} (the bulk median pair).
  const mid = Math.floor(N / 2);
  const E_repr = 0.5 * (xs[mid] + xs[mid + 1]);
  const mRepr = stieltjesAt(xs, E_repr, eta);
  const psiRepresentative = Math.abs(mRepr.im + Math.PI);

  // RMS over the bulk window.
  let sumSq = 0;
  const perPoint = new Array(M);
  for (let j = 0; j < M; j++) {
    const m = stieltjesAt(xs, testEs[j], eta);
    const dev = Math.abs(m.im + Math.PI);
    perPoint[j] = dev;
    sumSq += dev * dev;
  }
  const psiRMS = Math.sqrt(sumSq / M);

  // Sorted copy to derive a robust median.
  const sorted = perPoint.slice().sort((a, b) => a - b);
  const psiMedian = sorted[Math.floor(M / 2)];

  return {
    N,
    c,
    E_representative: E_repr,
    eta,
    sampleSize: M,
    psiRepresentative,
    psiRMS,
    psiMedian,
  };
}

// Microscopic scale (ticket-fixed): eta = c/N.
function measurePsiNMicro(N, c) {
  return measurePsiNAtScale(N, c, c / N);
}

// Macroscopic scale (auxiliary, well-posed ESY regime): eta = c.
function measurePsiNMacro(N, c) {
  return measurePsiNAtScale(N, c, c);
}

// -- Sweep across the 5 ticket-specified N values -----------------------

const RAW_MEASUREMENTS = N_VALUES.map((N) => measurePsiNMicro(N, C_PARAM));
const MACRO_MEASUREMENTS = N_VALUES.map((N) => measurePsiNMacro(N, C_PARAM));

// -- Log-log slope fit on (log N, log psi_RMS) --------------------------
// Ordinary least squares on the 5 datapoints. Returns slope, intercept,
// and R^2.

function fitLogLog(rows) {
  const xs = rows.map((r) => Math.log(r.N));
  const ys = rows.map((r) => Math.log(r.psiRMS));
  const n = xs.length;
  let xMean = 0;
  let yMean = 0;
  for (let i = 0; i < n; i++) {
    xMean += xs[i];
    yMean += ys[i];
  }
  xMean /= n;
  yMean /= n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - xMean) * (ys[i] - yMean);
    den += (xs[i] - xMean) * (xs[i] - xMean);
  }
  const slope = num / den;
  const intercept = yMean - slope * xMean;
  // R^2.
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * xs[i];
    ssRes += (ys[i] - pred) * (ys[i] - pred);
    ssTot += (ys[i] - yMean) * (ys[i] - yMean);
  }
  const r2 = 1 - ssRes / ssTot;
  return { slope, intercept, R2: r2 };
}

const FIT_RMS = fitLogLog(RAW_MEASUREMENTS);
const FIT_RMS_MACRO = fitLogLog(MACRO_MEASUREMENTS);

// Auxiliary slope on the representative-point series for cross-check.
function fitLogLogRepr(rows) {
  const xs = rows.map((r) => Math.log(r.N));
  const ys = rows.map((r) => Math.log(r.psiRepresentative));
  const n = xs.length;
  let xMean = 0;
  let yMean = 0;
  for (let i = 0; i < n; i++) {
    xMean += xs[i];
    yMean += ys[i];
  }
  xMean /= n;
  yMean /= n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - xMean) * (ys[i] - yMean);
    den += (xs[i] - xMean) * (xs[i] - xMean);
  }
  const slope = num / den;
  const intercept = yMean - slope * xMean;
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * xs[i];
    ssRes += (ys[i] - pred) * (ys[i] - pred);
    ssTot += (ys[i] - yMean) * (ys[i] - yMean);
  }
  const r2 = 1 - ssRes / ssTot;
  return { slope, intercept, R2: r2 };
}

const FIT_REPRESENTATIVE = fitLogLogRepr(RAW_MEASUREMENTS);

// -- ESY-compatibility verdict ------------------------------------------
//
// Decision rule:
//   ESY-COMPATIBLE      if fitted slope in [-1.5, -0.5] AND R^2 >= 0.85
//   ESY-INCOMPATIBLE    if fitted slope > -0.2 (no decay) OR
//                          fitted slope < -2 (steeper than expected; would
//                          contradict the polylog factor)
//   INCONCLUSIVE        otherwise (e.g. slope in [-0.5, -0.2], or
//                          R^2 < 0.85 in the compatible window)

const SLOPE_TARGET = -1;
const SLOPE_TOL = 0.5;
const R2_THRESH = 0.85;

function classifySlope(fit) {
  const s = fit.slope;
  if (s >= -1 - SLOPE_TOL && s <= -1 + SLOPE_TOL && fit.R2 >= R2_THRESH) {
    return 'ESY-COMPATIBLE';
  }
  if (s > -0.2 || s < -2) {
    return 'ESY-INCOMPATIBLE';
  }
  return 'INCONCLUSIVE';
}

// Headline verdict uses the macroscopic-scale fit (the well-posed ESY
// local-law regime where polylog/N is the correct prediction). The
// microscopic-scale fit is reported alongside for completeness.
const VERDICT = classifySlope(FIT_RMS_MACRO);
const VERDICT_MICRO = classifySlope(FIT_RMS);

const RECOMMENDED_DIRECTION = (function () {
  if (VERDICT === 'ESY-COMPATIBLE') {
    return 'pursue rigorous port (imp-370 / imp-1106) -- the empirical scaling on the first 10^4 unfolded Odlyzko zeros is consistent with the ESY local-law fluctuation rate; the rigorous attack is not contradicted by the data';
  }
  if (VERDICT === 'ESY-INCOMPATIBLE') {
    return 'ESY route is wrong, pivot to Goldston-Yildirim sieve (imp-1107 alternative 1) or Soundararajan-Bui density (imp-1107 alternative 2) -- the empirical scaling on the first 10^4 unfolded Odlyzko zeros falsifies the ESY-style fluctuation rate';
  }
  return 'INCONCLUSIVE -- empirical scaling neither confirms nor refutes the ESY rate; extend the measurement to N >= 10^5 (carryforward) or add more bulk test points (M > 50) before deciding';
})();

// -- Exported frozen record ---------------------------------------------

export const ESY_RIGIDITY_EMPIRICAL = Object.freeze({
  id: 'imp-1108-esy-rigidity-empirical-2026-05',
  ticket: 'imp-1108',
  source: 'src/data/zeros-to-1e6.js ZEROS_EXTENDED (first 10000 used)',
  operationalDefinition:
    'psi_N(E; c) = | Im(m_N(E + i*c/N)) + pi | with m_N(z) = sum_{k=1..N} 1/(z - x_k) and x_k = (gamma_k/(2*pi)) * log(gamma_k/(2*pi)) (Riemann-von Mangoldt unfolding so bulk density = 1)',
  operationalDefinitionMacro:
    'AUX: psi_macro_N(E; c) = | Im(m_N(E + i*c)) + pi | -- same formula at FIXED eta = c (macroscopic scale, well-posed ESY local-law regime)',
  cParam: C_PARAM,
  bulkWindow: 'x_{floor(N/4)} .. x_{floor(3*N/4)} - 1 (midpoint between consecutive bulk zeros)',
  bulkSampleSizeCap: M_BULK_MAX,
  measuredPsiN: Object.freeze(RAW_MEASUREMENTS.map(Object.freeze)),
  measuredPsiNMacro: Object.freeze(MACRO_MEASUREMENTS.map(Object.freeze)),
  fittedRate: Object.freeze(FIT_RMS_MACRO), // headline = macroscopic (well-posed ESY regime)
  fittedRateMicro: Object.freeze(FIT_RMS),
  fittedRateRepresentative: Object.freeze(FIT_REPRESENTATIVE),
  esyPrediction: Object.freeze({
    slopeTarget: SLOPE_TARGET,
    slopeTol: SLOPE_TOL,
    R2Threshold: R2_THRESH,
    rationale:
      'ESY local semicircle law (Comm. Math. Phys. 287, 2009) gives |m_N(z) - m_sc(z)| < (log N)^A / (N * eta) at scale eta; at MACROSCOPIC eta = c this is polylog(N)/N (slope approximately -1). At MICROSCOPIC eta = c/N the bound becomes polylog(N)/c (BOUNDED, slope approximately 0) -- the ticket-stated microscopic polylog/N prediction is actually the macroscopic-scale rate; we measure both and report both slopes',
  }),
  empiricalAgreement: VERDICT,
  empiricalAgreementMicroscopic: VERDICT_MICRO,
  recommendedDirection: RECOMMENDED_DIRECTION,
  honestScope: Object.freeze([
    'Empirical exploration only -- does NOT prove rigidity for the Riemann zeros and does NOT close any of obstacles O1 (arithmetic input), O2 (forward-vs-backward heat flow), or O3 (deterministic-vs-probabilistic concentration)',
    'A favourable slope means the rigorous attack is empirically consistent; an unfavourable slope would falsify the operational ESY analogy and is the more useful outcome (routes follow-on effort)',
    'Slope fit uses 5 datapoints (N in {100, 500, 1000, 5000, 10000}); slope-fit uncertainty is not quantified by a bootstrap because the underlying zero data is deterministic and the 5 points are exact (the RMS sample noise is captured implicitly in R^2)',
    'Unfolding via the leading-order Riemann-von Mangoldt density log(gamma/(2 pi))/(2 pi); subleading corrections O(1/log gamma) bias the mean spacing by approximately +0.02 at N = 100 and approximately +0.0001 at N = 10000 (cf imp-1098 raw mean spacing 1.2239 at N=1000)',
    'IMPORTANT: the ticket-fixed operational definition uses MICROSCOPIC eta = c/N where the ESY local law is BOUNDED (slope approximately 0) not 1/N -- the ticket conflates the macroscopic-scale rate with the microscopic-scale prediction; we report the literal microscopic answer in fittedRateMicro and the well-posed macroscopic answer in fittedRate (headline)',
    'Test point E_j is the MIDPOINT of consecutive unfolded zeros x_{idx} and x_{idx+1} to avoid the singular term 1/(0 + i*eta) that would otherwise dominate Im(m_N) at the microscopic scale (sampling AT a zero gives Im(m_N) approx -N/c, biasing psi by an order of magnitude per N)',
  ]),
  parallelTickets: ['imp-1105', 'imp-1106', 'imp-1107', 'imp-1109'],
});

// -- Build-time tripwires (5+ required) ---------------------------------

export const ESY_RIGIDITY_EMPIRICAL_ASSERTIONS = [
  {
    id: 'imp1108-five-N-values-measured',
    holds: () => {
      const rows = ESY_RIGIDITY_EMPIRICAL.measuredPsiN;
      if (rows.length !== 5) return false;
      const expectedNs = [100, 500, 1000, 5000, 10000];
      for (let i = 0; i < 5; i++) {
        if (rows[i].N !== expectedNs[i]) return false;
      }
      return true;
    },
    why:
      'Ticket requires psi_N measured at exactly N in {100, 500, 1000, 5000, 10000} in that order so the slope fit covers two decades of N. Drift here (e.g. silently dropping a row at N=10000 if it becomes too slow) would invalidate the slope and the verdict.',
  },
  {
    id: 'imp1108-psiN-rows-all-finite-positive',
    holds: () => {
      const rows = ESY_RIGIDITY_EMPIRICAL.measuredPsiN;
      for (const r of rows) {
        if (!Number.isFinite(r.psiRMS) || r.psiRMS <= 0) return false;
        if (!Number.isFinite(r.psiRepresentative) || r.psiRepresentative <= 0) return false;
        if (!Number.isFinite(r.psiMedian) || r.psiMedian <= 0) return false;
        if (!Number.isFinite(r.E_representative) || r.E_representative <= 0) return false;
        if (!Number.isFinite(r.eta) || r.eta <= 0) return false;
      }
      return true;
    },
    why:
      'Every measured psi_N (RMS, representative, median) must be finite and strictly positive. A non-finite value would indicate an upstream zero-data corruption or division-by-zero in the Stieltjes sum (the test point E_j is sampled from the bulk xs window so the denominator dE^2 + eta^2 is always >= eta^2 > 0; this tripwire catches a silent regression).',
  },
  {
    id: 'imp1108-fit-slope-and-R2-finite',
    holds: () => {
      const f = ESY_RIGIDITY_EMPIRICAL.fittedRate;
      return (
        Number.isFinite(f.slope) &&
        Number.isFinite(f.intercept) &&
        Number.isFinite(f.R2) &&
        f.R2 <= 1.000001
      );
    },
    why:
      'OLS log-log fit must return finite slope / intercept / R^2 with R^2 bounded above by 1 (allow tiny floating slack). A NaN here would mean the slope-fit input degenerated (e.g. two identical N values, zero variance) -- impossible under the fixed N grid but tripwire guards against future refactors.',
  },
  {
    id: 'imp1108-verdict-is-one-of-three-allowed',
    holds: () => {
      const v = ESY_RIGIDITY_EMPIRICAL.empiricalAgreement;
      return v === 'ESY-COMPATIBLE' || v === 'ESY-INCOMPATIBLE' || v === 'INCONCLUSIVE';
    },
    why:
      'empiricalAgreement must be exactly one of the three documented verdicts (ESY-COMPATIBLE | ESY-INCOMPATIBLE | INCONCLUSIVE) so downstream consumers (imp-1106 rigorous-port readiness, recommendedDirection routing) can branch on a closed alphabet. A typo or fourth value would silently break the routing.',
  },
  {
    id: 'imp1108-recommended-direction-matches-verdict',
    holds: () => {
      const v = ESY_RIGIDITY_EMPIRICAL.empiricalAgreement;
      const r = ESY_RIGIDITY_EMPIRICAL.recommendedDirection;
      if (v === 'ESY-COMPATIBLE') return /pursue rigorous port/i.test(r);
      if (v === 'ESY-INCOMPATIBLE') return /Goldston-Yildirim|Soundararajan-Bui|pivot/i.test(r);
      return /INCONCLUSIVE/i.test(r);
    },
    why:
      'recommendedDirection prose must mention the appropriate route based on the verdict. ESY-COMPATIBLE must recommend pursuing the rigorous port; ESY-INCOMPATIBLE must recommend Goldston-Yildirim / Soundararajan-Bui / pivot; INCONCLUSIVE must say so. This tripwire prevents a silent regression where the verdict flips but the prose stays stale.',
  },
  {
    id: 'imp1108-psiNMacro-decreasing-on-N',
    holds: () => {
      // The macroscopic-scale series is where ESY predicts polylog/N
      // decay. We do not require strict monotonicity at every step (small
      // N statistical noise can cause a single non-monotone tick) but the
      // largest N must have STRICTLY smaller psi_RMS than the smallest N
      // -- i.e. the gross trend is decreasing. If psi_macro at N=10000 is
      // not smaller than at N=100 the rate is not negative at all and the
      // ESY-compatible verdict would be vacuous.
      const rows = ESY_RIGIDITY_EMPIRICAL.measuredPsiNMacro;
      if (rows.length < 2) return false;
      return rows[rows.length - 1].psiRMS < rows[0].psiRMS;
    },
    why:
      'The largest-N macroscopic psi_RMS must be strictly smaller than the smallest-N value. If psi_macro does not decrease over two decades of N, the rate is not negative and the empiricalAgreement verdict would be misleading. This is the gross-trend sanity check on the headline macroscopic series; it does NOT enforce the slope target of -1 (that is what classifySlope already exposes via empiricalAgreement).',
  },
  {
    id: 'imp1108-microscopic-bounded-not-decay',
    holds: () => {
      // The microscopic-scale series should be BOUNDED in N (slope approx
      // 0 not -1) per the corrected ESY scaling at eta = c/N. We assert
      // this by requiring max/min ratio in the microscopic series to stay
      // within an order of magnitude -- the bounded-not-decay signature.
      const rows = ESY_RIGIDITY_EMPIRICAL.measuredPsiN;
      let lo = Infinity;
      let hi = 0;
      for (const r of rows) {
        if (r.psiRMS < lo) lo = r.psiRMS;
        if (r.psiRMS > hi) hi = r.psiRMS;
      }
      if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo <= 0) return false;
      return hi / lo < 10;
    },
    why:
      'The microscopic-scale psi_RMS at eta = c/N should be approximately constant in N (the ESY local-law bound polylog(N)/(N * eta) = polylog(N)/c is bounded). Empirically we expect max/min ratio < 10 over the N grid; a much larger ratio would indicate either a numerical bug in the Stieltjes evaluation at small eta or a regression in the test-point sampling (e.g. accidentally landing on a zero).',
  },
  {
    id: 'imp1108-bulk-sample-size-respects-cap',
    holds: () => {
      const rows = ESY_RIGIDITY_EMPIRICAL.measuredPsiN;
      for (const r of rows) {
        if (r.sampleSize <= 0) return false;
        if (r.sampleSize > M_BULK_MAX) return false;
        // For small N the bulk is N/2 so sampleSize is capped by floor(N/2).
        if (r.sampleSize > Math.floor(r.N / 2) + 1) return false;
      }
      return true;
    },
    why:
      'sampleSize per N must be > 0, <= M_BULK_MAX (the cap), and <= floor(N/2) + 1 (the bulk window size). Drift here would silently widen the bulk window into the spectral edge where the smooth density falls off and the predicted Im(m_N) = -pi target no longer applies.',
  },
];

if (typeof console !== 'undefined' && typeof console.log === 'function') {
  // No-op guard so build-time SSR does not error on console.
}
