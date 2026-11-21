/**
 * @module imp-3215-mupass-capture-ratio-n-scaling
 * @fileoverview imp-3215 -- N-scaling of the imp-3197 lag-stationary Toeplitz
 *   surrogate vs |Gshear| operator-norm CAPTURE RATIO at the genuine
 *   de Bruijn-Newman Phi cell (NPHI = 10, a = 0.5, U = 6).
 *
 *   CONTEXT
 *   -------
 *   imp-3197-mupass-bridge-sign-phi-only split "correct sign at correct lags"
 *   into a SIGN half (Phi-only and free) and a MAGNITUDE half (operator-level,
 *   RH-equivalent). Its MAGNITUDE probe built the lag-stationary Toeplitz
 *   surrogate
 *     T(u, v) = sinh(a (v - u)) * Abar(|v - u|),  Abar(k) = A_Phi(k) / (N - k),
 *   the stationary operator carrying EXACTLY the Phi autocorrelation as its
 *   symbol and the SAME 1D lag-marginal mass as the genuine shear Gram
 *     Gshear(u, v) = Phi(u) Phi(v) sinh(a (v - u)),
 *   with the position dependence averaged out. It reported that ||T|| captures
 *   only ~3% of the true ||Gshear|| (ratio ~0.0298), stating N-STABILITY only
 *   over the three grids N in {160, 240, 320}. That leaves open whether the
 *   ~97% position-concentration share is a fixed STRUCTURAL fraction or a
 *   resolution artifact that drifts as the tau-grid N grows.
 *
 *   WHAT THIS MODULE MEASURES
 *   -------------------------
 *   The SAME capture ratio r(N) = ||T|| / ||Gshear|| over a WIDER N ladder
 *   N in {160, 240, 320, 480, 640, 800} at the identical genuine cell, using
 *   the identical construction and power-iteration spectral norm as imp-3197.
 *
 *   WHY THE RATIO HAS A FINITE CONTINUUM LIMIT (the structural expectation)
 *   ----------------------------------------------------------------------
 *   Both matrices are UNSCALED midpoint discretizations of continuous kernels on
 *   L2[0, U]: the true integral operators carry a quadrature weight H = U / N, so
 *   ||G_matrix|| and ||T_matrix|| each scale like (1 / H) = (N / U) times a
 *   continuum operator norm and therefore GROW roughly linearly in N. But that
 *   common H factor cancels in the RATIO r(N) = ||T|| / ||Gshear||, which is
 *   quadrature-weight-independent and converges to the ratio of the two
 *   CONTINUUM operator norms as N -&gt; inf. So the prediction is: the individual
 *   norms grow, but the capture ratio holds at a finite fraction.
 *
 *   MEASURED VERDICT (assessment, RH-equivalent, NO QED)
 *   ----------------------------------------------------
 *   r(N) decreases MONOTONICALLY from ~0.03004 (N = 160) to ~0.02941 (N = 800),
 *   with the successive decrements shrinking (~3.7e-4 down to ~1.2e-5): it is
 *   converging from above to a finite continuum limit ~0.0294 (Richardson
 *   extrapolation of the top rungs ~0.02936). The ~3% capture DOES NOT decay to
 *   zero and DOES NOT grow -- it is a FIXED STRUCTURAL FRACTION. Equivalently the
 *   ~97% position-concentration share converges to ~97.06%, confirming it is a
 *   genuine operator-spectrum property of |Gshear| and NOT a grid artifact. The
 *   individual norms ||Gshear|| and ||T|| each grow ~linearly in N (the
 *   unscaled-quadrature 1/H factor), consistent with the ratio-is-invariant
 *   picture. This SHARPENS imp-3197: the magnitude gap the lag autocorrelation
 *   under-reports is a resolution-stable ~33x, so the binding RH-equivalent
 *   K_a &gt;= 0 obstruction (the imp-3066 off-diagonal endpoint-Hankel step) is
 *   NOT an artifact of finite N. No refereed bound is changed.
 *
 *   @see imp-3197-mupass-bridge-sign-phi-only.js (the parent MAGNITUDE probe, N in {160,240,320})
 *   @see section26-mupass-operator-verdict-2026-06-30.js (the verdict whose magnitude half this tracks)
 *
 *   Ticket: imp-3215 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (the imp-2841 grid), same as imp-3197
const A = 0.5; // headline shear weight (the genuine-Phi cell)
const U = 6; // genuine-Phi lag cutoff (the headline cell)
const N_LADDER = [160, 240, 320, 480, 640, 800]; // widens imp-3197 {160,240,320}
const ITERS = 400; // power-iteration steps (imp-3197 used 280 at N=200; 400 keeps the ratio converged to better than 1e-6 across the ladder)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (identical to imp-3197 / imp-2841). */
function phiKernel(uu) {
  let s = 0;
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Spectral norm (top singular value) of a dense n x n matrix via power iteration on M^T M (same routine as imp-3197). */
function spectralNorm(M, n, iters) {
  let v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = Math.sin(0.3 * i + 1);
  const nrm = (x) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += x[i] * x[i];
    return Math.sqrt(s);
  };
  let s0 = nrm(v);
  for (let i = 0; i < n; i++) v[i] /= s0;
  let lam = 0;
  for (let it = 0; it < iters; it++) {
    const Mv = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0;
      const Mi = M[i];
      for (let j = 0; j < n; j++) s += Mi[j] * v[j];
      Mv[i] = s;
    }
    const MtMv = new Float64Array(n);
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let i = 0; i < n; i++) s += M[i][j] * Mv[i];
      MtMv[j] = s;
    }
    lam = nrm(MtMv);
    if (lam === 0) break;
    for (let j = 0; j < n; j++) v[j] = MtMv[j] / lam;
  }
  return Math.sqrt(lam);
}

/** One ladder rung: build Gshear and the lag-stationary surrogate T at grid N, return the two norms and the capture ratio. */
function captureAt(N) {
  const H = U / N;
  const u = new Array(N);
  const phi = new Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i]);
  }
  // Per-lag autocorrelation profile Abar(k) = (1 / (N - k)) sum_i Phi_i Phi_{i+k} -- identical to imp-3197.
  const abar = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let s = 0;
    let c = 0;
    for (let i = 0; i + k < N; i++) {
      s += phi[i] * phi[i + k];
      c += 1;
    }
    abar[k] = c ? s / c : 0;
  }
  const G = [];
  const T = [];
  for (let i = 0; i < N; i++) {
    const rG = new Float64Array(N);
    const rT = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      const k = Math.abs(j - i);
      const sh = Math.sinh(A * (u[j] - u[i]));
      rG[j] = phi[i] * phi[j] * sh;
      rT[j] = sh * abar[k];
    }
    G.push(rG);
    T.push(rT);
  }
  const normGshear = spectralNorm(G, N, ITERS);
  const normLagStationary = spectralNorm(T, N, ITERS);
  const ratio = normGshear > 0 ? normLagStationary / normGshear : 0;
  return { N, normGshear, normLagStationary, ratio, positionConcentrationFraction: 1 - ratio };
}

const rungs = N_LADDER.map(captureAt);
const ratios = rungs.map((r) => r.ratio);
const normsGshear = rungs.map((r) => r.normGshear);

// Monotone strictly decreasing capture ratio (converging from above)?
let strictlyDecreasing = true;
for (let i = 1; i < ratios.length; i++) if (!(ratios[i] < ratios[i - 1])) strictlyDecreasing = false;

// Individual |Gshear| norm strictly increasing with N (unscaled 1/H quadrature growth)?
let normGrowsWithN = true;
for (let i = 1; i < normsGshear.length; i++) if (!(normsGshear[i] > normsGshear[i - 1])) normGrowsWithN = false;

// Successive decrements shrinking (a finite-limit convergence signature): first gap vs last gap.
const firstDecrement = ratios[0] - ratios[1];
const lastDecrement = ratios[ratios.length - 2] - ratios[ratios.length - 1];
const decrementsShrinking = lastDecrement > 0 && lastDecrement < firstDecrement;

// Richardson extrapolation r(N) ~ L + c / N on the top three rungs -> continuum limit L.
function richardsonLimit(a, b, c) {
  // a=(Na,ra), b=(Nb,rb): solve L + k/N; use the two largest N for the slope, then the limit.
  const kSlope = (a.ratio - b.ratio) / (1 / a.N - 1 / b.N);
  return b.ratio - kSlope / b.N;
}
const top = rungs.slice(-2);
const continuumLimit = richardsonLimit(top[0], top[1]);

const ratioMin = Math.min(...ratios);
const ratioMax = Math.max(...ratios);
const capturedFractionHolds = ratioMin > 0.028 && ratioMax < 0.031; // bounded away from 0 and from growth
const positionShareAtFinest = rungs[rungs.length - 1].positionConcentrationFraction;

const verdict =
  strictlyDecreasing && decrementsShrinking && capturedFractionHolds && normGrowsWithN
    ? 'CAPTURE-RATIO-CONVERGES-TO-FINITE-LIMIT-STRUCTURAL-FRACTION-NOT-ARTIFACT'
    : 'INDETERMINATE';

export const IMP3215_MUPASS_CAPTURE_RATIO_N_SCALING = Object.freeze({
  id: 'imp-3215-mupass-capture-ratio-n-scaling',
  ticket: 'imp-3215',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentDiagnostic: 'imp-3197-mupass-bridge-sign-phi-only.js',
  relatedVerdict: 'section26-mupass-operator-verdict-2026-06-30.js',

  summary:
    'N-scaling of the imp-3197 lag-stationary Toeplitz surrogate vs |Gshear| ' +
    'operator-norm CAPTURE RATIO r(N) = ||T|| / ||Gshear|| at the genuine ' +
    'de Bruijn-Newman Phi cell (NPHI = 10, a = 0.5, U = 6), over the WIDER ladder ' +
    'N in {160, 240, 320, 480, 640, 800} (imp-3197 reported N-stability only over ' +
    '{160, 240, 320}). RESULT: r(N) decreases MONOTONICALLY from ~0.03004 (N = 160) ' +
    'to ~0.02941 (N = 800) with the successive decrements shrinking (~3.7e-4 down to ' +
    '~1.2e-5), converging from above to a finite continuum limit ~0.0294 ' +
    '(Richardson extrapolation of the top rungs ~0.02936). The ~3% capture DOES NOT ' +
    'decay to zero and DOES NOT grow -- it is a FIXED STRUCTURAL FRACTION; the ~97% ' +
    'position-concentration share converges to ~97.06%. Both ||Gshear|| and ||T|| ' +
    'individually grow ~linearly in N (the unscaled midpoint quadrature 1/H = N/U ' +
    'factor, which cancels in the ratio), consistent with the ratio being a ' +
    'quadrature-weight-independent continuum invariant. This SHARPENS imp-3197: the ' +
    'magnitude the 1D autocorrelation under-reports is a resolution-stable ~33x, so ' +
    'the binding K_a >= 0 obstruction is NOT a finite-N artifact. Assessment only; ' +
    'RH-equivalent; carries NO RH verdict and NO QED.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    shearGram: 'Gshear(u, v) = Phi(u) Phi(v) sinh(a (v - u))',
    lagStationarySurrogate: 'T(u, v) = sinh(a (v - u)) * Abar(|v - u|),  Abar(k) = A_Phi(k) / (N - k)',
    captureRatio: 'r(N) = ||T|| / ||Gshear||  (both unscaled; the common quadrature weight H = U/N cancels)',
    a: A,
    U,
    nLadder: N_LADDER.slice(),
    iters: ITERS,
    quadrature: 'midpoint, N panels on [0, U]; spectral norm via power iteration on M^T M (identical to imp-3197)',
    selfComputing: true,
  }),

  measured: Object.freeze({
    rungs: Object.freeze(
      rungs.map((r) =>
        Object.freeze({
          N: r.N,
          normGshear: r.normGshear,
          normLagStationary: r.normLagStationary,
          ratio: r.ratio,
          positionConcentrationFraction: r.positionConcentrationFraction,
        }),
      ),
    ),
    ratioAtCoarsest: ratios[0], // ~0.03004 (N = 160)
    ratioAtFinest: ratios[ratios.length - 1], // ~0.02941 (N = 800)
    ratioMin,
    ratioMax,
    strictlyDecreasing, // true -> converging from above, not growing
    decrementsShrinking, // true -> successive gaps shrink (finite-limit signature)
    normGrowsWithN, // true -> individual norms grow ~linearly (unscaled 1/H), only the ratio is invariant
    continuumLimit, // Richardson r(N) ~ L + c/N on the top rungs -> ~0.02936
    positionConcentrationLimit: 1 - continuumLimit, // ~0.9706 fixed structural share
    positionShareAtFinest, // ~0.9706 at N = 800
    parentThreeGridRatios: '0.0295..0.0300 across N in {160,240,320} (imp-3197 baseline, reproduced here)',
    verdict, // CAPTURE-RATIO-CONVERGES-TO-FINITE-LIMIT-STRUCTURAL-FRACTION-NOT-ARTIFACT
  }),

  interpretation: Object.freeze({
    ratioIsAContinuumInvariant:
      'The capture ratio is quadrature-weight-independent: both ||Gshear|| and ||T|| are unscaled midpoint ' +
      'discretizations whose norms carry a common 1/H = N/U factor that cancels in the ratio. So r(N) converges ' +
      'to the ratio of the two continuum operator norms, and the measured monotone approach to ~0.0294 with ' +
      'shrinking decrements is exactly the finite-limit behavior expected -- not decay, not growth.',
    threePercentIsStructural:
      'The ~3% capture reported by imp-3197 over the three-grid window is NOT a resolution artifact: extending the ' +
      'ladder to N = 800 pins the limit at ~0.0294 (~2.94%). The ~97% position-concentration share is therefore a ' +
      'genuine structural property of the |Gshear| spectrum, converging to ~97.06%.',
    sharpensParent:
      'The magnitude that the 1D Phi autocorrelation under-reports is a resolution-stable ~33x factor. The binding ' +
      'RH-equivalent K_a >= 0 magnitude obstruction (the imp-3066 off-diagonal endpoint-Hankel step) is a genuine ' +
      'operator-level residual, not an artifact of finite tau-grid resolution.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    measuresRatioNotPositivity:
      'This module measures only the N-scaling of the operator-norm capture RATIO; it does NOT construct the ' +
      'missing magnitude and does NOT attempt the K_a >= 0 positivity.',
    necessaryNotSufficient:
      'The resolution-stability of the ~97% position-concentration share is diagnostic; the off-diagonal ' +
      'endpoint-Hankel operator magnitude (imp-3066) remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3215_MUPASS_CAPTURE_RATIO_N_SCALING_ASSERTIONS = [
  {
    id: 'imp3215-reproduces-parent-three-grid-band',
    why: 'The three imp-3197 grids {160,240,320} must reproduce the parent ~0.0295..0.0300 capture-ratio band ' +
         'under the identical construction; a departure means the surrogate build drifted from imp-3197.',
    holds: () => rungs[0].ratio > 0.0295 && rungs[0].ratio < 0.0302 && rungs[2].ratio > 0.0293 && rungs[2].ratio < 0.0300,
  },
  {
    id: 'imp3215-ratio-monotone-decreasing-converging',
    why: 'THE N-SCALING DELIVERABLE: the capture ratio decreases monotonically as the tau-grid N grows AND the ' +
         'successive decrements shrink -- the signature of convergence from above to a finite limit, i.e. the ' +
         '~3% capture neither decays to zero nor grows.',
    holds: () => strictlyDecreasing && decrementsShrinking,
  },
  {
    id: 'imp3215-capture-fraction-is-fixed-structural',
    why: 'The capture ratio stays bounded away from zero and from growth across the whole ladder, and its ' +
         'Richardson continuum limit sits in the ~0.0294 band -- a fixed structural fraction, not a resolution ' +
         'artifact.',
    holds: () =>
      capturedFractionHolds &&
      continuumLimit > 0.028 &&
      continuumLimit < 0.030 &&
      positionShareAtFinest > 0.9 &&
      positionShareAtFinest < 0.98,
  },
  {
    id: 'imp3215-norms-grow-ratio-invariant',
    why: 'The individual ||Gshear|| norm must grow with N (unscaled midpoint quadrature carries a 1/H factor); ' +
         'only the ratio is the quadrature-weight-independent invariant. If the norm stopped growing the ratio ' +
         'analysis would no longer be an operator-norm capture measure.',
    holds: () => normGrowsWithN && rungs.every((r) => r.normGshear > 0 && r.normLagStationary > 0),
  },
  {
    id: 'imp3215-verdict-converges-to-structural-fraction',
    why: 'The classified verdict must be the converges-to-finite-limit structural-fraction split, not ' +
         'indeterminate; a flip means the ratio started drifting (decaying or growing) with resolution.',
    holds: () => verdict === 'CAPTURE-RATIO-CONVERGES-TO-FINITE-LIMIT-STRUCTURAL-FRACTION-NOT-ARTIFACT',
  },
  {
    id: 'imp3215-honest-assessment-no-qed',
    why: 'Mandatory honesty: ASSESSMENT only -- not a proof, not a reduction below RH, RH-equivalent, positivity ' +
         'not attempted, no refereed bound is changed. Any flip is over-claiming.',
    holds: () => {
      const c = IMP3215_MUPASS_CAPTURE_RATIO_N_SCALING.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3215_MUPASS_CAPTURE_RATIO_N_SCALING_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3215-mupass-capture-ratio-n-scaling assertion failed: ${assertion.id}`);
  }
}

export default IMP3215_MUPASS_CAPTURE_RATIO_N_SCALING;
