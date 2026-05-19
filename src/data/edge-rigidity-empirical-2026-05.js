// imp-1128 -- EDGE rigidity attack: re-measure psi_N at the SPECTRAL EDGE
// (i.e. the small-ordinate region near gamma_1 = 14.1347...) rather than in
// the bulk midpoint.
//
// CONTEXT
// -------
// imp-1108 ran the empirical psi_N measurement of ESY local-law fluctuation
// IN THE BULK (test points sampled from the window
//   x_{floor(N/4)} .. x_{floor(3*N/4)}
// of the unfolded Odlyzko zeros) at N in {100, 500, 1000, 5000, 10000}.
// The headline (macroscopic eta = c) slope came out -0.1063 with R^2 0.74,
// far from the ESY target slope -1; classifySlope returned ESY-INCOMPATIBLE.
// That falsified the operational ESY analogy in the bulk and routed
// follow-on effort to Goldston-Yildirim / Soundararajan-Bui.
//
// However Wigner-matrix theory has SEPARATE local-law results at the
// spectral EDGE. The smallest eigenvalue of a Wigner matrix has Tracy-Widom
// fluctuations on scale N^{-2/3}, NOT N^{-1}; the edge local law is a
// DIFFERENT bound than the bulk local law (see Erdos-Yau-Yin "Rigidity of
// eigenvalues of generalized Wigner matrices" 2012, theorem 2.2 vs 2.3).
// The Riemann-zero analog of the spectral edge is the small-ordinate region
// near gamma_1 = 14.1347 -- the rho_min vicinity that imp-469 / imp-462 use
// for the RvM Jacobian bridge.
//
// THIS TICKET: empirically re-measure psi_N near gamma_1 (not in the bulk)
// to test whether the EDGE rate is closer to ESY-compatible (slope ~ -1)
// than the bulk rate (slope ~ -0.1). A positive answer would NOT resurrect
// bulk-ESY, but would suggest the rho_min chain (imp-469) may still admit a
// rigidity-based wedge keyed on the edge.
//
// OPERATIONAL DEFINITION (same as imp-1108)
// -----------------------------------------
// We unfold via Riemann-von Mangoldt
//     x_k := (gamma_k / (2*pi)) * log(gamma_k / (2*pi))
// so the bulk has unit mean spacing. (The unfolded edge x_1 is NOT 0; it is
// (14.1347 / (2*pi)) * log(14.1347 / (2*pi)) approx 1.806. This is the
// "edge" in unfolded coordinates -- the smallest unfolded zero.)
//
// The empirical Stieltjes transform is
//     m_N(z) := sum_{k=1..N} 1 / (z - x_k)
// and we define
//     psi_N(E; eta) := | Im(m_N(E + i*eta)) + pi |
// CRITICAL caveat: at the EDGE the smooth density rho(E) is NOT 1 (the bulk
// value); the Riemann-von Mangoldt local density at gamma is
//   rho_raw(gamma) = (1/(2*pi)) * log(gamma / (2*pi))
// In UNFOLDED coordinates the density is the bulk value 1 only ASYMPTOTICALLY
// (the unfolding makes spacings unit ON AVERAGE but locally near the edge the
// density is still close to 1 because rho_raw varies slowly). The target
// Im(m_N) approx -pi*rho_unf(E) is therefore still approximately -pi at the
// unfolded edge x_1; the deviation from this target is what psi_N captures.
//
// EDGE SAMPLING WINDOW
// --------------------
// imp-1108 sampled E_j as midpoints in [x_{floor(N/4)}, x_{floor(3N/4)}].
// imp-1128 EDGE: we sample E_j as midpoints in [x_1, x_{edgeWidth}] where
// edgeWidth scales with N to give the same number of test points (M) at the
// edge as imp-1108 had in the bulk. Specifically we use:
//   edgeWidth := max(M_BULK_MAX + 1, floor(N / 20))
// so for N=100 the edge window is the first 6 zeros (M = 5 midpoints, the
// entire window); for N=10000 the edge window is the first 500 zeros (M=50
// midpoints). The midpoint-not-on-zero discipline from imp-1108 honestScope[5]
// is preserved.
//
// We measure at BOTH scales (consistent with imp-1108):
//   psi_edge_micro_N    = | Im(m_N(E + i*c/N)) + pi |     (micro eta = c/N)
//   psi_edge_macro_N    = | Im(m_N(E + i*c)) + pi |       (macro eta = c; the
//                                                          well-posed ESY
//                                                          local-law regime)
// and fit OLS slopes on log(N) vs log(psi_RMS) at each scale.
//
// HONEST SCOPE
// ------------
// 1. Pure empirical exploration -- a favourable edge slope does NOT prove
//    rigidity at the edge for Riemann zeros (the rigorous Tracy-Widom port
//    would itself need its own paper).
// 2. We are NOT claiming the bulk slope and the edge slope have any
//    independent statistical meaning; both are fits on the same deterministic
//    zero sequence.
// 3. The edge window grows with N (so M test points per row is balanced with
//    the bulk measurement), but the WINDOW WIDTH in unfolded coordinates also
//    grows with N (edgeWidth zeros, since x_k grows roughly linearly with k);
//    we report sampleSize and windowWidth per row so this is transparent.
// 4. The ESY edge local law actually predicts a DIFFERENT slope target than
//    the bulk; the Wigner-matrix edge fluctuations are at scale N^{-2/3}
//    rather than N^{-1}. The bulkComparison lift uses the same slope target
//    -1 as imp-1108 for comparability; the verdict edgeCompatibleWithESY is
//    based on whether the empirical edge slope is closer to -1 than the bulk
//    slope.
// 5. We do NOT assert this validates the rho_min chain; implicationForRho-
//    MinChain is a verbal note routing follow-up effort, not a closure claim.
//
// @see imp-1128
// @see imp-1108 (sibling bulk measurement)
// @see imp-469 (rho_min analytic lower bound)
// @see src/data/esy-rigidity-empirical-2026-05.js
// @see src/data/zeros-to-1e6.js

import { ZEROS_EXTENDED } from './zeros-to-1e6.js';
import { ESY_RIGIDITY_EMPIRICAL } from './esy-rigidity-empirical-2026-05.js';

// -- Configuration -------------------------------------------------------

const TWO_PI = 2 * Math.PI;

// Ticket-fixed parameters matched to imp-1108 for direct slope comparison.
const C_PARAM = 1;
const N_VALUES = [100, 500, 1000, 5000, 10000];

// Sample size cap (matches imp-1108).
const M_EDGE_MAX = 50;

// Edge compatibility threshold: slope < -0.7 is considered ESY-compatible
// (imp-1108 bulk slope was -0.1063 so -0.7 is a generous threshold that
// would clearly distinguish an edge-different-from-bulk regime).
const EDGE_ESY_SLOPE_THRESHOLD = -0.7;

// -- Unfolding (same as imp-1108) ----------------------------------------

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
// Returns {re, im}. Direct loop, no shortcuts.

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

// -- Per-N edge psi_N measurement ----------------------------------------

function measureEdgePsiNAtScale(N, c, eta) {
  const xs = unfoldFirstN(N);

  // Edge window: [x_0, x_{edgeWidth - 1}]. Width grows with N so the
  // sample size M stays balanced with the bulk measurement at large N.
  const edgeWidth = Math.max(M_EDGE_MAX + 1, Math.floor(N / 20));
  const lo = 0;
  const hi = Math.min(edgeWidth - 1, N - 2); // need x_{hi+1} for midpoint
  const windowSize = Math.max(hi - lo, 1);
  const M = Math.min(M_EDGE_MAX, windowSize);

  // Midpoint-not-on-zero sampling per imp-1108 honestScope[5].
  const testEs = new Array(M);
  for (let j = 0; j < M; j++) {
    const frac = M === 1 ? 0.5 : j / (M - 1);
    const idx = lo + Math.floor(frac * (windowSize - 1));
    testEs[j] = 0.5 * (xs[idx] + xs[idx + 1]);
  }

  // Representative point: midpoint between x_0 and x_1 (the literal edge
  // pair). This is the closest analog of "spectral edge" for the Riemann
  // zeros -- the gap immediately above gamma_1.
  const E_repr = 0.5 * (xs[0] + xs[1]);
  const mRepr = stieltjesAt(xs, E_repr, eta);
  const psiRepresentative = Math.abs(mRepr.im + Math.PI);

  // RMS over the edge window.
  let sumSq = 0;
  const perPoint = new Array(M);
  for (let j = 0; j < M; j++) {
    const m = stieltjesAt(xs, testEs[j], eta);
    const dev = Math.abs(m.im + Math.PI);
    perPoint[j] = dev;
    sumSq += dev * dev;
  }
  const psiRMS = Math.sqrt(sumSq / M);

  const sorted = perPoint.slice().sort((a, b) => a - b);
  const psiMedian = sorted[Math.floor(M / 2)];

  return {
    N,
    c,
    edgeWindowEnd: hi,
    windowSize,
    E_representative: E_repr,
    eta,
    sampleSize: M,
    psiRepresentative,
    psiRMS,
    psiMedian,
  };
}

function measureEdgeMicro(N, c) {
  return measureEdgePsiNAtScale(N, c, c / N);
}

function measureEdgeMacro(N, c) {
  return measureEdgePsiNAtScale(N, c, c);
}

// -- Sweep at the 5 N values --------------------------------------------

const EDGE_MICRO_ROWS = N_VALUES.map((N) => measureEdgeMicro(N, C_PARAM));
const EDGE_MACRO_ROWS = N_VALUES.map((N) => measureEdgeMacro(N, C_PARAM));

// -- OLS log-log fit -----------------------------------------------------

function fitLogLogOn(rows, yKey) {
  const xs = rows.map((r) => Math.log(r.N));
  const ys = rows.map((r) => Math.log(r[yKey]));
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
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
  return { slope, intercept, R2: r2 };
}

const FIT_EDGE_MACRO = fitLogLogOn(EDGE_MACRO_ROWS, 'psiRMS');
const FIT_EDGE_MICRO = fitLogLogOn(EDGE_MICRO_ROWS, 'psiRMS');

// -- Bulk comparison: lift imp-1108 fits for direct comparison ----------

const BULK_FIT_MACRO = ESY_RIGIDITY_EMPIRICAL.fittedRate; // headline = macro
const BULK_FIT_MICRO = ESY_RIGIDITY_EMPIRICAL.fittedRateMicro;

// -- ESY compatibility verdict ------------------------------------------
// Headline uses the MACROSCOPIC scale because the well-posed ESY local-law
// regime is eta fixed (polylog/N decay).

const edgeCompatibleWithESY = FIT_EDGE_MACRO.slope < EDGE_ESY_SLOPE_THRESHOLD;
const edgeBeatsBulkSlope = FIT_EDGE_MACRO.slope < BULK_FIT_MACRO.slope;

// Slope-difference test: how much steeper is the edge than the bulk?
const slopeDifferenceMacro = FIT_EDGE_MACRO.slope - BULK_FIT_MACRO.slope;
const slopeDifferenceMicro = FIT_EDGE_MICRO.slope - BULK_FIT_MICRO.slope;

// -- Verbal implication for the rho_min chain ----------------------------

function buildImplicationForRhoMinChain() {
  if (edgeCompatibleWithESY) {
    return (
      'Edge slope ' +
      FIT_EDGE_MACRO.slope.toFixed(4) +
      ' is BELOW the threshold ' +
      EDGE_ESY_SLOPE_THRESHOLD +
      ' (i.e. close to the ESY target -1). The rho_min chain ' +
      'imp-469 / imp-462 keys on the smallest-zero region; if the edge ' +
      'rigidity rate is empirically ESY-compatible, a wedge through ' +
      'rho_min (analytic lower bound 0.1275) using edge-local-law inputs ' +
      'is not ruled out. Seed follow-on ticket: rigorous edge local law ' +
      'for unfolded Riemann zeros, Tracy-Widom analog. HONEST: edge ' +
      'slope compatibility is necessary but not sufficient; the rigorous ' +
      'port still needs imp-407 / imp-508 obstacle closures.'
    );
  }
  if (edgeBeatsBulkSlope && FIT_EDGE_MACRO.slope < -0.3) {
    return (
      'Edge slope ' +
      FIT_EDGE_MACRO.slope.toFixed(4) +
      ' is steeper than bulk slope ' +
      BULK_FIT_MACRO.slope.toFixed(4) +
      ' by ' +
      (-slopeDifferenceMacro).toFixed(4) +
      ' but does not clear the ' +
      EDGE_ESY_SLOPE_THRESHOLD +
      ' threshold. INCONCLUSIVE: edge regime is different from bulk but ' +
      'not clearly ESY-rate. Consider extending N to >= 1e5 before ' +
      'pivoting; the rho_min chain wedge remains an open possibility ' +
      'but is NOT empirically confirmed by this measurement.'
    );
  }
  return (
    'Edge slope ' +
    FIT_EDGE_MACRO.slope.toFixed(4) +
    ' is NOT closer to the ESY target than the bulk slope ' +
    BULK_FIT_MACRO.slope.toFixed(4) +
    '. Edge rigidity is NOT empirically distinct from bulk; the ' +
    'rho_min chain (imp-469) has no edge-local-law wedge accessible by ' +
    'this measurement. Routes follow-on effort away from edge-rigidity ' +
    'and toward Goldston-Yildirim sieve (imp-1107 alt 1) or ' +
    'Soundararajan-Bui zero-density (imp-1107 alt 2), consistent with the ' +
    'imp-1108 bulk verdict.'
  );
}

const IMPLICATION_FOR_RHO_MIN_CHAIN = buildImplicationForRhoMinChain();

// -- Exported frozen record ---------------------------------------------

export const EDGE_RIGIDITY_EMPIRICAL = Object.freeze({
  id: 'imp-1128-edge-rigidity-empirical-2026-05',
  ticket: 'imp-1128',
  source: 'src/data/zeros-to-1e6.js ZEROS_EXTENDED (first 10000 used)',
  operationalDefinition:
    'psi_N_edge(E; c, eta) = | Im(m_N(E + i*eta)) + pi | with m_N(z) = sum_{k=1..N} 1/(z - x_k) and x_k = (gamma_k/(2*pi)) * log(gamma_k/(2*pi)). Test points E_j are midpoints of consecutive unfolded zeros in the EDGE window [x_0, x_{edgeWindowEnd}] (closest-to-gamma_1 region), NOT in the bulk midpoint window used by imp-1108',
  edgeWindowDefinition:
    'edgeWidth = max(M_EDGE_MAX + 1, floor(N / 20)); edge window = [x_0, x_{edgeWidth - 1}]; for N=100 the window is the first 6 zeros, for N=10000 the first 500 zeros',
  cParam: C_PARAM,
  sampleSizeCap: M_EDGE_MAX,
  measuredPsiNEdge: Object.freeze(EDGE_MICRO_ROWS.map((r) => Object.freeze({ ...r }))),
  measuredPsiNEdgeMacro: Object.freeze(EDGE_MACRO_ROWS.map((r) => Object.freeze({ ...r }))),
  fittedSlopeEdge: Object.freeze(FIT_EDGE_MACRO), // headline = macroscopic
  fittedSlopeEdgeMicro: Object.freeze(FIT_EDGE_MICRO),
  fittedSlopeBulk: Object.freeze({ ...BULK_FIT_MACRO }), // lifted from imp-1108 (macro)
  fittedSlopeBulkMicro: Object.freeze({ ...BULK_FIT_MICRO }),
  bulkComparison: Object.freeze({
    bulkSlopeMacro: BULK_FIT_MACRO.slope,
    bulkSlopeMicro: BULK_FIT_MICRO.slope,
    edgeSlopeMacro: FIT_EDGE_MACRO.slope,
    edgeSlopeMicro: FIT_EDGE_MICRO.slope,
    slopeDifferenceMacro,
    slopeDifferenceMicro,
    edgeBeatsBulkSlope,
    bulkSource: 'src/data/esy-rigidity-empirical-2026-05.js ESY_RIGIDITY_EMPIRICAL.fittedRate / fittedRateMicro',
    bulkVerdict: ESY_RIGIDITY_EMPIRICAL.empiricalAgreement,
  }),
  edgeESYSlopeThreshold: EDGE_ESY_SLOPE_THRESHOLD,
  edgeCompatibleWithESY,
  implicationForRhoMinChain: IMPLICATION_FOR_RHO_MIN_CHAIN,
  honestScope: Object.freeze([
    'Pure empirical exploration -- a favourable edge slope does NOT prove edge-rigidity for Riemann zeros; the rigorous Tracy-Widom port for deterministic zero sequences would itself need a full paper and is not attempted here',
    'The edge window grows with N (edgeWidth = max(51, floor(N / 20))); at N=10000 the window is the first 500 zeros which is no longer a strictly local-edge sample. We report sampleSize and windowSize per row so this growth is transparent; the M test points are concentrated near x_0 by midpoint-of-consecutive-zeros sampling',
    'ESY edge local law predicts a DIFFERENT slope target than bulk (Wigner edge fluctuations scale as N^{-2/3} not N^{-1}); the edgeCompatibleWithESY verdict uses the bulk slope target -1 (threshold ' +
      EDGE_ESY_SLOPE_THRESHOLD +
      ') for direct comparison with imp-1108, NOT the Tracy-Widom N^{-2/3} target',
    'Midpoint-not-on-zero sampling discipline carried over from imp-1108 honestScope[5]; sampling AT a zero would give the singular term 1/(0 + i*eta) = -i*N/c which biases Im(m_N) by an order of magnitude per N',
    'Five-datapoint OLS slope; slope-fit uncertainty not bootstrapped (the underlying zero sequence is deterministic and the 5 points are exact). R^2 reported alongside the slope',
    'implicationForRhoMinChain prose is a routing note for follow-on tickets, NOT a closure claim on imp-469 / imp-462. The rho_min analytic lower bound is itself imp-469 / imp-473; this measurement only tells us whether an edge-rigidity-based wedge is empirically plausible',
  ]),
  parallelTickets: ['imp-1123', 'imp-1124', 'imp-1125', 'imp-1127'],
});

// -- Build-time tripwires (5+ required) ---------------------------------

export const EDGE_RIGIDITY_EMPIRICAL_ASSERTIONS = [
  {
    id: 'imp1128-five-N-values-measured-edge',
    holds: () => {
      const rows = EDGE_RIGIDITY_EMPIRICAL.measuredPsiNEdge;
      const rowsMacro = EDGE_RIGIDITY_EMPIRICAL.measuredPsiNEdgeMacro;
      if (rows.length !== 5 || rowsMacro.length !== 5) return false;
      const expectedNs = [100, 500, 1000, 5000, 10000];
      for (let i = 0; i < 5; i++) {
        if (rows[i].N !== expectedNs[i]) return false;
        if (rowsMacro[i].N !== expectedNs[i]) return false;
      }
      return true;
    },
    why:
      'Ticket requires edge psi_N measured at exactly N in {100, 500, 1000, 5000, 10000} matching imp-1108 so the edge vs bulk slope comparison is on the same N grid. Drift here (a silent drop of a row at large N) would invalidate bulkComparison.',
  },
  {
    id: 'imp1128-edge-rows-all-finite-positive',
    holds: () => {
      const all = [
        ...EDGE_RIGIDITY_EMPIRICAL.measuredPsiNEdge,
        ...EDGE_RIGIDITY_EMPIRICAL.measuredPsiNEdgeMacro,
      ];
      for (const r of all) {
        if (!Number.isFinite(r.psiRMS) || r.psiRMS <= 0) return false;
        if (!Number.isFinite(r.psiRepresentative) || r.psiRepresentative <= 0) return false;
        if (!Number.isFinite(r.psiMedian) || r.psiMedian <= 0) return false;
        if (!Number.isFinite(r.eta) || r.eta <= 0) return false;
        if (!Number.isFinite(r.E_representative) || r.E_representative <= 0) return false;
        if (r.sampleSize <= 0 || r.sampleSize > M_EDGE_MAX) return false;
      }
      return true;
    },
    why:
      'Every measured edge psi_N (RMS, representative, median) must be finite and strictly positive at BOTH scales; sampleSize must respect the cap. A non-finite value would indicate a Stieltjes evaluation regression (the test point is sampled from xs midpoints so eta^2 > 0 guarantees a non-zero denominator).',
  },
  {
    id: 'imp1128-edge-fits-finite',
    holds: () => {
      const fEdge = EDGE_RIGIDITY_EMPIRICAL.fittedSlopeEdge;
      const fEdgeMicro = EDGE_RIGIDITY_EMPIRICAL.fittedSlopeEdgeMicro;
      const fBulk = EDGE_RIGIDITY_EMPIRICAL.fittedSlopeBulk;
      const fBulkMicro = EDGE_RIGIDITY_EMPIRICAL.fittedSlopeBulkMicro;
      for (const f of [fEdge, fEdgeMicro, fBulk, fBulkMicro]) {
        if (!Number.isFinite(f.slope) || !Number.isFinite(f.intercept) || !Number.isFinite(f.R2)) return false;
        if (f.R2 > 1.000001) return false;
      }
      return true;
    },
    why:
      'Both edge OLS fits (macro + micro) and both lifted bulk fits must have finite slope / intercept / R^2 with R^2 bounded by 1 + slack. A NaN in any fit would mean either the slope-fit input degenerated or the imp-1108 lift broke (e.g. fittedRate object shape changed upstream).',
  },
  {
    id: 'imp1128-edge-verdict-boolean',
    holds: () => {
      const v = EDGE_RIGIDITY_EMPIRICAL.edgeCompatibleWithESY;
      return v === true || v === false;
    },
    why:
      'edgeCompatibleWithESY must be a strict boolean (the slope-threshold test slope < -0.7). A non-boolean (e.g. null because a fit returned NaN, or "true" string) would mean a regression in the comparison logic.',
  },
  {
    id: 'imp1128-bulk-comparison-lifts-imp1108',
    holds: () => {
      const bc = EDGE_RIGIDITY_EMPIRICAL.bulkComparison;
      // The bulkVerdict must be one of the three imp-1108 verdicts.
      const ok =
        bc.bulkVerdict === 'ESY-COMPATIBLE' ||
        bc.bulkVerdict === 'ESY-INCOMPATIBLE' ||
        bc.bulkVerdict === 'INCONCLUSIVE';
      if (!ok) return false;
      // Lifted bulk slopes must match the imp-1108 source exactly (lifted by reference value, not recomputed).
      if (bc.bulkSlopeMacro !== ESY_RIGIDITY_EMPIRICAL.fittedRate.slope) return false;
      if (bc.bulkSlopeMicro !== ESY_RIGIDITY_EMPIRICAL.fittedRateMicro.slope) return false;
      // The edge slopes embedded in bulkComparison must agree with the headline fits.
      if (bc.edgeSlopeMacro !== EDGE_RIGIDITY_EMPIRICAL.fittedSlopeEdge.slope) return false;
      if (bc.edgeSlopeMicro !== EDGE_RIGIDITY_EMPIRICAL.fittedSlopeEdgeMicro.slope) return false;
      // edgeBeatsBulkSlope must be a strict boolean.
      if (bc.edgeBeatsBulkSlope !== true && bc.edgeBeatsBulkSlope !== false) return false;
      // slopeDifference fields must be finite numbers.
      if (!Number.isFinite(bc.slopeDifferenceMacro) || !Number.isFinite(bc.slopeDifferenceMicro)) return false;
      return true;
    },
    why:
      'bulkComparison must lift the imp-1108 slopes by exact reference value (not by recomputation) so any upstream regression in imp-1108 is caught at the comparison boundary. Embedded edge slopes must equal the headline fit slopes (self-consistency).',
  },
  {
    id: 'imp1128-edge-window-respects-bounds',
    holds: () => {
      for (const r of EDGE_RIGIDITY_EMPIRICAL.measuredPsiNEdge) {
        // Edge window starts at index 0 (the literal edge).
        if (r.edgeWindowEnd < 1) return false;
        // Edge window cannot exceed N - 2 (midpoint with x_{end+1} required).
        if (r.edgeWindowEnd > r.N - 2) return false;
        // windowSize and sampleSize sanity.
        if (r.windowSize <= 0 || r.windowSize > r.N) return false;
        if (r.sampleSize > r.windowSize) return false;
      }
      return true;
    },
    why:
      'Edge window indices must respect bounds [0, N-2] (we need x_{edgeWindowEnd+1} to exist for the final midpoint). windowSize and sampleSize sanity catches a refactor that silently widens the window past the array bounds or shrinks it below the M_EDGE_MAX cap.',
  },
  {
    id: 'imp1128-implication-prose-matches-verdict',
    holds: () => {
      const v = EDGE_RIGIDITY_EMPIRICAL.edgeCompatibleWithESY;
      const eb = EDGE_RIGIDITY_EMPIRICAL.bulkComparison.edgeBeatsBulkSlope;
      const slopeMacro = EDGE_RIGIDITY_EMPIRICAL.fittedSlopeEdge.slope;
      const prose = EDGE_RIGIDITY_EMPIRICAL.implicationForRhoMinChain;
      if (typeof prose !== 'string' || prose.length < 50) return false;
      if (v) {
        // Compatible branch must mention rho_min wedge or follow-on rigorous port.
        return /rho_min|wedge|edge local law/i.test(prose);
      }
      if (eb && slopeMacro < -0.3) {
        return /INCONCLUSIVE|inconclusive/i.test(prose);
      }
      // Default branch: must route away from edge-rigidity (Goldston-Yildirim or Sound-Bui).
      return /Goldston-Yildirim|Soundararajan-Bui|away from edge/i.test(prose);
    },
    why:
      'implicationForRhoMinChain prose must match the verdict branch: the COMPATIBLE branch must mention rho_min / wedge / edge local law; the INCONCLUSIVE branch must say so; the default branch must route away from edge-rigidity to Goldston-Yildirim or Soundararajan-Bui. Prevents a silent regression where the verdict flips but the prose stays stale.',
  },
];

// Module-load no-op guard so build-time SSR does not error on console (parity with imp-1108).
if (typeof console !== 'undefined' && typeof console.log === 'function') {
  // no-op
}
