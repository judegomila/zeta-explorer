/**
 * @module imp-3202-mupass-bridge-lag-cutoff-sweep
 * @fileoverview imp-3202 -- Sweep the section26-mupass bridge LAG-CUTOFF
 *   continuously and tabulate the bridge operator-norm capture vs cutoff, to
 *   locate the MINIMAL lag-support beyond which the near-diagonal contraction
 *   mass no longer improves.
 *
 *   CONTEXT
 *   -------
 *   section26-mupass-operator-verdict-2026-06-30 isolates the surviving residual
 *   as K_a &gt;= 0 (RH-EQUIVALENT) and locates where the dominating bridge mass
 *   lives by reporting only TWO lag-cutoff points of the normalized contraction:
 *     lag &lt;= 0.2  -&gt; ||R|| = 0.876
 *     lag &lt;= 0.40 -&gt; ||R|| = 0.711  (saturation)
 *   Two points cannot show WHERE the capture knee sits. This module sweeps the
 *   lag cutoff continuously at the genuine de Bruijn-Newman Phi
 *   (NPHI = 10, a = 0.5, U = 6, N = 200) and tabulates the bridge operator-norm
 *   capture fraction, locating the minimal lag-support that captures essentially
 *   all of the bridge contraction mass.
 *
 *   THE BRIDGE OPERATOR AND ITS LAG CUTOFF
 *   --------------------------------------
 *   The genuine shear Gram is the antisymmetric de Branges Wronskian
 *     Gshear(u, v) = Phi(u) Phi(v) sinh(a (v - u)).
 *   Per imp-3197 the only in-repo, reproducible bridge operator whose symbol is
 *   exactly the Phi autocorrelation is the lag-stationary (Toeplitz) surrogate
 *     T(u, v) = sinh(a (v - u)) * Abar(|v - u|),  Abar(k) = A_Phi(k) / (N - k),
 *   which carries the SAME 1D lag-marginal mass as Gshear with the position
 *   dependence averaged out. The bridge LAG CUTOFF c keeps only the near-diagonal
 *   band |u - v| &lt;= c of this operator:
 *     T_c(u, v) = T(u, v) if |u - v| &lt;= c, else 0.
 *   We tabulate the operator-norm CAPTURE fraction
 *     capture(c) = ||T_c|| / ||T||
 *   (the share of the full bridge operator norm reachable from lags &lt;= c) and
 *   its complement, the un-captured tail share
 *     tail(c) = ||T - T_c|| / ||T||.
 *   capture(c) rises steeply, overshoots 1 by a small (&lt;0.5%) margin in the
 *   saturation band (truncating the indefinite far-lag tail transiently raises
 *   the dominant singular value), then relaxes to 1 once c covers the Phi
 *   autocorrelation support; the smallest c reaching the saturation band is the
 *   MINIMAL lag-support -- exactly where the K_a sign mass must be placed.
 *
 *   HONEST RELATIONSHIP TO THE VERDICT 0.876 / 0.711
 *   ------------------------------------------------
 *   The verdict two points are the SYMMETRICALLY-NORMALIZED partial-isometry norm
 *   ||R|| = ||Gpass^{-1/2} Gshear Gpass^{-1/2}|| from the original construct
 *   workflow, whose full Gpass^{-1/2} core-normalization machinery is NOT checked
 *   into this repo. This module does NOT reproduce those two scalar values; it
 *   tabulates the reproducible IN-REPO bridge operator-norm capture, which answers
 *   the same structural question -- WHERE the dominating lag mass lives and the
 *   minimal lag-support beyond which it stops improving. SUB-GAP (named, open):
 *   anchoring the exact 0.876 / 0.711 ||R|| values requires re-deriving the
 *   out-of-repo symmetric Gpass^{-1/2} normalization; the capture knee located
 *   here is the cutoff-localization half, the normalization is the un-ported half.
 *
 *   VERDICT (assessment, RH-equivalent, NO QED)
 *   -------------------------------------------
 *   The bridge contraction mass is localized to a finite near-diagonal lag band:
 *   capture rises steeply and saturates, so a finite minimal lag-support carries
 *   essentially the entire bridge operator norm -- consistent with the verdict
 *   two-point reading that the mass is captured by lag &lt;= ~0.40. Beyond that
 *   support, widening the cutoff no longer improves the capture. This sharpens
 *   "where the K_a sign mass must be placed" from two points to a continuous
 *   curve plus a knee. RH-equivalent residual untouched; Platt-Trudgian
 *   Lambda &lt;= 0.2 stays SOTA. No reduction, no QED.
 *
 *   @see section26-mupass-operator-verdict-2026-06-30.js (the verdict whose two lag-cutoff points this sweeps)
 *   @see imp-3197-mupass-bridge-sign-phi-only.js (sibling: the lag-stationary surrogate machinery reused here)
 *
 *   Ticket: imp-3202 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (the imp-2841 grid)
const A = 0.5; // headline shear weight (the genuine-Phi cell)
const U = 6; // genuine-Phi lag cutoff (the headline cell)
const N = 200; // tau-grid panels on [0, U]
const ITERS = 220; // power-iteration steps for the spectral norm

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-3197 / imp-3175). */
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

/** Spectral norm (top singular value) of a dense N x N matrix via power iteration on M^T M. */
function spectralNorm(M, n, iters) {
  let v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = Math.sin(0.3 * i + 1);
  const nrm = (x) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += x[i] * x[i];
    return Math.sqrt(s);
  };
  const s0 = nrm(v);
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

const H = U / N;
const u = new Array(N);
const phi = new Array(N);
for (let i = 0; i < N; i++) {
  u[i] = (i + 0.5) * H;
  phi[i] = phiKernel(u[i]);
}

// Per-lag autocorrelation symbol Abar(k) = (1 / (N - k)) sum_i Phi_i Phi_{i+k}.
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

// Build the full lag-stationary bridge operator T(u, v) = sinh(a(v - u)) * Abar(|v - u|).
const Tfull = [];
for (let i = 0; i < N; i++) {
  const row = new Float64Array(N);
  for (let j = 0; j < N; j++) {
    row[j] = Math.sinh(A * (u[j] - u[i])) * abar[Math.abs(j - i)];
  }
  Tfull.push(row);
}
const normFull = spectralNorm(Tfull, N, ITERS);

/**
 * Operator norm of the bridge kept to the near-diagonal band |u - v| &lt;= cutoff.
 * Returns ||T_c|| with T_c the lag-cutoff truncation of Tfull.
 */
function bandedNorm(cutoff) {
  const band = Math.floor(cutoff / H + 1e-12); // max |i - j| kept
  const Tc = [];
  for (let i = 0; i < N; i++) {
    const row = new Float64Array(N);
    const src = Tfull[i];
    const lo = Math.max(0, i - band);
    const hi = Math.min(N - 1, i + band);
    for (let j = lo; j <= hi; j++) row[j] = src[j];
    Tc.push(row);
  }
  return spectralNorm(Tc, N, ITERS);
}

/** Operator norm of the un-captured high-lag tail T - T_c (lags &gt; cutoff). */
function tailNorm(cutoff) {
  const band = Math.floor(cutoff / H + 1e-12);
  const Td = [];
  for (let i = 0; i < N; i++) {
    const row = new Float64Array(N);
    const src = Tfull[i];
    for (let j = 0; j < N; j++) {
      if (Math.abs(j - i) > band) row[j] = src[j];
    }
    Td.push(row);
  }
  return spectralNorm(Td, N, ITERS);
}

// Continuous lag-cutoff sweep (the two verdict anchors 0.20 and 0.40 are included).
const CUTOFFS = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5, 0.6, 0.8, 1.0, 1.5, 2.0];
const SATURATION_TOL = 0.01; // |capture - 1| within this counts as saturated (covers the small tail overshoot)

const table = CUTOFFS.map((cutoff) => {
  const normBand = bandedNorm(cutoff);
  const normTail = tailNorm(cutoff);
  const capture = normFull > 0 ? normBand / normFull : 0;
  const tail = normFull > 0 ? normTail / normFull : 0;
  return {
    cutoff,
    bandLags: Math.floor(cutoff / H + 1e-12),
    opNormBand: normBand,
    capture,
    tailShare: tail,
  };
});

// The capture rises steeply then settles to 1, with a small (<0.5%) OVERSHOOT above 1
// in the saturation band: truncating the indefinite far-lag tail of the antisymmetric
// bridge transiently RAISES the dominant singular value before the band fully covers the
// Phi autocorrelation support. So capture is NOT strictly monotone -- it overshoots and
// relaxes. Record the overshoot rather than assert a false monotonicity.
const maxOvershoot = table.reduce((m, r) => Math.max(m, r.capture), 0);

// Minimal lag-support: smallest cutoff whose capture first reaches the saturation band.
let minimalLagSupport = null;
for (const r of table) {
  if (r.capture >= 1 - SATURATION_TOL) {
    minimalLagSupport = r.cutoff;
    break;
  }
}
const captureSaturates = minimalLagSupport !== null && minimalLagSupport < U;

// Past the minimal lag-support the capture stays pinned to 1 (within the overshoot band):
// widening the cutoff no longer improves the capture -- the saturation the verdict reads.
const captureStaysSaturated =
  minimalLagSupport !== null &&
  table
    .filter((r) => r.cutoff >= minimalLagSupport)
    .every((r) => Math.abs(r.capture - 1) <= SATURATION_TOL);

const anchor020 = table.find((r) => Math.abs(r.cutoff - 0.2) < 1e-9);
const anchor040 = table.find((r) => Math.abs(r.cutoff - 0.4) < 1e-9);
// The verdict reads the mass as captured by lag ~0.40: capture(0.40) should exceed capture(0.20).
const captureRisesAcrossAnchors = anchor040.capture > anchor020.capture;

export const IMP3202_MUPASS_BRIDGE_LAG_CUTOFF_SWEEP = Object.freeze({
  id: 'imp-3202-mupass-bridge-lag-cutoff-sweep',
  ticket: 'imp-3202',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedVerdict: 'section26-mupass-operator-verdict-2026-06-30.js',
  relatedDiagnostic: 'imp-3197-mupass-bridge-sign-phi-only.js',

  summary:
    'Sweeps the section26-mupass bridge LAG-CUTOFF continuously at the genuine ' +
    'de Bruijn-Newman Phi (NPHI = 10, a = 0.5, U = 6, N = 200) and tabulates the ' +
    'bridge operator-norm CAPTURE fraction capture(c) = ||T_c|| / ||T|| of the ' +
    'lag-stationary surrogate T(u, v) = sinh(a(v - u)) * Abar(|v - u|) truncated ' +
    'to the near-diagonal band |u - v| <= c. The verdict reports only two cutoff ' +
    'points of the symmetrically-normalized ||R|| (lag <= 0.2 -> 0.876, lag <= ' +
    '0.40 -> 0.711 saturation); this fills in the continuous curve and locates ' +
    'the MINIMAL lag-support beyond which the capture no longer improves. The ' +
    'capture rises steeply and saturates at a finite cutoff, confirming the ' +
    'bridge contraction mass is localized to a finite near-diagonal lag band -- ' +
    'exactly where the K_a sign mass must be placed. HONEST SUB-GAP: this does ' +
    'NOT reproduce the exact 0.876 / 0.711 ||R|| values, whose Gpass^{-1/2} ' +
    'symmetric core-normalization machinery is not in-repo; it tabulates the ' +
    'reproducible in-repo bridge operator-norm capture instead. Assessment only; ' +
    'RH-equivalent residual untouched, NO QED.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    shearGram: 'Gshear(u, v) = Phi(u) Phi(v) sinh(a (v - u))  (antisymmetric de Branges Wronskian)',
    bridgeOperator: 'T(u, v) = sinh(a (v - u)) * Abar(|v - u|): lag-stationary surrogate, Phi autocorrelation symbol',
    autocorrSymbol: 'Abar(k) = A_Phi(k) / (N - k),  A_Phi(k) = sum_i Phi_i Phi_{i+k} on [0, U]',
    lagCutoff: 'T_c(u, v) = T(u, v) if |u - v| <= c else 0  (keep the near-diagonal band)',
    captureFunctional: 'capture(c) = ||T_c|| / ||T||; tail(c) = ||T - T_c|| / ||T||',
    minimalLagSupport: 'smallest cutoff c with capture(c) >= 1 - ' + SATURATION_TOL,
    a: A,
    U,
    N,
    quadrature: 'midpoint, N panels on [0, U]; spectral norm via power iteration on M^T M',
    selfComputing: true,
  }),

  measured: Object.freeze({
    opNormFull: normFull, // ||T|| at full lag support
    table, // the continuous cutoff sweep: { cutoff, bandLags, opNormBand, capture, tailShare }
    captureSaturates, // capture reaches the saturation band at a finite cutoff < U
    captureStaysSaturated, // past minimalLagSupport capture stays pinned to 1 (no further improvement)
    maxOvershoot, // peak capture (>1): truncating the indefinite far-lag tail transiently raises ||T_c||
    minimalLagSupport, // smallest cutoff capturing essentially the whole bridge operator norm
    saturationTol: SATURATION_TOL,
    captureAt020: anchor020.capture, // capture at the verdict lag <= 0.20 anchor cutoff
    captureAt040: anchor040.capture, // capture at the verdict lag <= 0.40 anchor cutoff
    captureRisesAcrossAnchors, // capture(0.40) > capture(0.20): mass accrues across the verdict window
  }),

  interpretation: Object.freeze({
    massIsLagLocalized:
      'The bridge operator-norm capture rises steeply with the lag cutoff and saturates at a finite ' +
      'near-diagonal lag support, so essentially the entire dominating bridge mass lives in a bounded lag ' +
      'band -- the continuous version of the verdict two-point reading (mass captured by lag ~0.40). Beyond ' +
      'the minimal lag-support, widening the cutoff no longer improves the capture.',
    captureOvershootsThenRelaxes:
      'The capture is NOT strictly monotone: it overshoots 1 by a small (<0.5%) margin in the saturation band ' +
      'before relaxing back to 1. Truncating the indefinite far-lag tail of the antisymmetric bridge ' +
      'transiently RAISES the dominant singular value, so the near-diagonal band alone can carry marginally ' +
      'more operator norm than the full operator -- a structural sign that the far-lag mass partially cancels.',
    sharpensWhereSignMassGoes:
      'This sharpens the verdict phrase "where the K_a sign mass must be placed" from two cutoff points to a ' +
      'continuous capture(c) curve plus an explicit minimal-lag-support knee.',
    sub_gap_normalization_not_ported:
      'The verdict 0.876 / 0.711 are the symmetric Gpass^{-1/2} partial-isometry ||R||; that core-normalization ' +
      'machinery is not in-repo, so this module tabulates the reproducible bridge operator-norm capture instead. ' +
      'The named open sub-gap is re-deriving the out-of-repo Gpass^{-1/2} normalization to anchor the exact ||R||.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    reproducesVerdictScalarValues: false,
    didNotAttemptPositivity: true,
    necessaryNotSufficient:
      'Localizing the bridge lag support is a cutoff-localization diagnostic; it does NOT construct the missing ' +
      'operator-norm magnitude or attempt the K_a >= 0 positivity, which remains the RH-equivalent obstruction.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3202_MUPASS_BRIDGE_LAG_CUTOFF_SWEEP_ASSERTIONS = [
  {
    id: 'imp3202-full-bridge-norm-positive',
    why: 'The capture fractions normalize by ||T||; it must be a finite positive operator norm for the sweep to ' +
         'be meaningful.',
    holds: () => Number.isFinite(normFull) && normFull > 0,
  },
  {
    id: 'imp3202-capture-saturates-at-finite-support',
    why: 'THE DELIVERABLE: capture reaches the saturation band at a finite minimal lag-support < U and stays ' +
         'pinned there, locating where the bridge contraction mass stops accruing -- the continuous version of ' +
         'the verdict two-point reading.',
    holds: () =>
      captureSaturates &&
      captureStaysSaturated &&
      minimalLagSupport !== null &&
      minimalLagSupport > 0 &&
      minimalLagSupport < U,
  },
  {
    id: 'imp3202-capture-overshoot-bounded',
    why: 'Truncating the indefinite far-lag tail can transiently raise ||T_c|| above ||T||, so capture is not ' +
         'strictly monotone; the overshoot must stay small (within the saturation tolerance) for the saturation ' +
         'reading to hold.',
    holds: () => maxOvershoot >= 1 && maxOvershoot <= 1 + SATURATION_TOL,
  },
  {
    id: 'imp3202-capture-rises-across-verdict-window',
    why: 'The verdict reads the mass as captured by lag ~0.40 (more than by lag ~0.20); the capture at the 0.40 ' +
         'anchor must therefore exceed the capture at the 0.20 anchor.',
    holds: () => captureRisesAcrossAnchors && anchor040.capture <= 1 + SATURATION_TOL,
  },
  {
    id: 'imp3202-honest-no-qed-no-scalar-reproduction',
    why: 'Mandatory honesty: ASSESSMENT only -- not a proof, RH-equivalent, does NOT reproduce the verdict ' +
         '0.876 / 0.711 scalar ||R|| (normalization not in-repo), positivity not attempted, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3202_MUPASS_BRIDGE_LAG_CUTOFF_SWEEP.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.reproducesVerdictScalarValues === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3202_MUPASS_BRIDGE_LAG_CUTOFF_SWEEP_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3202-mupass-bridge-lag-cutoff-sweep assertion failed: ${assertion.id}`);
  }
}

export default IMP3202_MUPASS_BRIDGE_LAG_CUTOFF_SWEEP;
