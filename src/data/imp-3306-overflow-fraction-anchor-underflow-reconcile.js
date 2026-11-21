/**
 * @module imp-3306-overflow-fraction-anchor-underflow-reconcile
 * @fileoverview imp-3306 -- Reconcile the widely re-pointed imp-3175 ~0.209
 *   "resolution-converged genuine overflow fraction" against the imp-3216 finding
 *   that the upper support endpoint tau_2 ~ 1.366 is the IEEE-754 kernel UNDERFLOW
 *   HORIZON, not a mathematical nu &gt; mu down-crossing.
 *
 *   ASSESSMENT / DIAGNOSTIC ONLY. No new positivity, no RH verdict, not a
 *   reduction. No refereed bound is changed.
 *
 *   THE TWO CLAIMS IN TENSION
 *   -------------------------
 *   (A) imp-3175 swept the tau-grid resolution N (100..204800) at the fixed
 *       lightweight-Phi cell (a = 0.5, U = 6, NPHI = 10) and found the overflow
 *       fraction |{tau : nu(tau) &gt; mu(tau)}| / U MONOTONE INCREASING in N,
 *       converging to ~0.2092. It recorded ~0.209 as "the number to trust" for
 *       the genuine overflow-support fraction, and many pages/modules now quote it.
 *   (B) imp-3216 resolved the overflow set to a single contiguous interval
 *       [tau_1, tau_2] and showed tau_2 ~ 1.366 is NOT a mathematical crossover:
 *       it is the double-precision underflow horizon of the de Bruijn-Newman
 *       kernel Phi(u) (its n = 1 term exp(-pi e^{4u}) drops below 2^-1074 there),
 *       while across the whole representable interior nu &gt; mu with no genuine
 *       down-crossing. So MATHEMATICALLY the overflow region is [tau_1, U] and the
 *       true fraction (U - tau_1)/U -&gt; 1, not a fixed ~0.209.
 *
 *   WHAT THIS MODULE FINDS (measured, then explained -- NOT proved)
 *   --------------------------------------------------------------
 *   Recomputing the imp-3216 endpoints on the same fine grid (N = 51200) across
 *   the U ladder {6, 8, 10, 12} at a = 0.5, NPHI = 10 shows the imp-3175 anchor
 *   is EXACTLY the underflow-pinned measured fraction, so its "convergence" is a
 *   double-precision measurement artifact of holding U fixed at 6:
 *
 *   (R1) THE ANCHOR DECOMPOSES. At U = 6 the measured fraction is 0.20918, and
 *        it equals (tau_2 - tau_1)/U to &lt; 1e-4:
 *          tau_1 ~ 0.1109  (genuine nu/mu crossover, U-invariant to &lt; 1e-3)
 *          tau_2 ~ 1.3660  (kernel underflow horizon, U-invariant to &lt; 1e-3)
 *          (tau_2 - tau_1)/6 ~ 0.2092  ==  the imp-3175 anchor.
 *        So imp-3175 did not converge to a Phi-intrinsic fraction; its N sweep
 *        converged the GRID discretization of a quantity whose upper limit is the
 *        machine underflow horizon, evaluated at the single U = 6.
 *
 *   (R2) THE ANCHOR IS U-DEPENDENT AS 1/U (the artifact). Because tau_2 is pinned
 *        at the underflow horizon (support length tau_2 - tau_1 ~ 1.255 stays
 *        U-invariant), the measured fraction (tau_2 - tau_1)/U falls like 1/U as
 *        U grows: 0.2092 (U=6), 0.1569 (U=8), 0.1255 (U=10), 0.1046 (U=12), each
 *        ~ 1.255/U. A genuine Phi-intrinsic fraction would be U-stable; a value
 *        that scales as 1/U is a fixed absolute lag length divided by a growing
 *        window -- i.e. an artifact of the window, not a fraction of the kernel.
 *
 *   (R3) THE ARITHMETIC-INDEPENDENT REPLACEMENT. The only endpoint that is a
 *        genuine mathematical crossover is tau_1 ~ 0.111 (a-, U-, NPHI-invariant,
 *        the root of the transcendental Phi-moment balance of imp-3216 E1). The
 *        arithmetic-INDEPENDENT overflow-fraction quantity that should replace the
 *        ~0.209 anchor is therefore the TRUE fraction
 *          f_true(U) = (U - tau_1)/U  ->  1  as U -> inf,
 *        which RISES with U (0.9815, 0.9861, 0.9889, 0.9908 across the ladder),
 *        the opposite direction to the measured anchor. The single U-free invariant
 *        is the genuine crossover tau_1 itself (~0.111) together with the fact that
 *        NO upper crossing exists in exact arithmetic (nu &gt; mu for all tau &gt; tau_1).
 *
 *   THE RECONCILIATION
 *   ------------------
 *   Both imp-3175 and imp-3216 are internally correct: imp-3175 correctly resolved
 *   the N-limit of its functional at U = 6, and imp-3216 correctly identified the
 *   upper endpoint as machine underflow. The tension dissolves once one sees that
 *   the imp-3175 functional |{nu &gt; mu}|/U silently caps the overflow region at the
 *   representable horizon tau_2 rather than at U, so its converged ~0.209 is
 *   (horizon - tau_1)/U at U = 6, a DOUBLE-PRECISION MEASUREMENT ARTIFACT, not a
 *   Phi-intrinsic fraction. The corrected, arithmetic-independent statement is
 *   (R3): the genuine crossover is tau_1 ~ 0.111 and the true overflow fraction
 *   (U - tau_1)/U tends to 1. Pages quoting ~0.209 as THE genuine fraction should
 *   read it as "the double-precision-measured fraction at U = 6", not as a limit.
 *
 *   THE GENUINE DENSITIES (identical to imp-3175 / imp-3216 / imp-3154)
 *   ------------------------------------------------------------------
 *     nu(tau) = int_0^tau du int_tau^U dv  Phi(u) Phi(v) sinh(a(v-u))
 *     mu(tau) = (1 / 2pi) int_tau^U Phi(u)^2 sinh(2 a u) du
 *   with sinh(a(v-u)) = sinh(av)cosh(au) - cosh(av)sinh(au) giving O(N)
 *   prefix/suffix accumulators per tau grid.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DIAGNOSTIC at the genuine Phi. This reconciles the overflow-FRACTION anchor
 *   only; it re-derives no absolute deficit magnitude. A nonzero overflow fraction
 *   is necessary-but-NOT-sufficient at operator order; the off-diagonal
 *   endpoint-Hankel operator step (imp-3066) remains the lone obstruction. No RH
 *   verdict. No false QED. No refereed bound is changed.
 *
 *   @see imp-3175-overflow-fraction-resolution-reconcile.js (the ~0.209 anchor)
 *   @see imp-3216-overflow-support-length-closed-form.js (the underflow-horizon finding)
 *   @see imp-3199-overflow-fraction-cell-sweep.js (the cell sweep)
 *
 *   Ticket: imp-3306 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (imp-2841 grid)
const A = 0.5; // headline shear weight (the genuine-Phi cell)
const N_FINE = 51200; // fine tau-grid resolution (matches imp-3216)

// U ladder at fixed a, NPHI that exposes the 1/U scaling of the anchor.
const U_LADDER = Object.freeze([6, 8, 10, 12]);

// The imp-3175 recorded resolution-converged anchor (must be reproduced at U = 6).
const IMP3175_CONVERGED_ANCHOR = 0.2092;

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-3175 / imp-3216). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/**
 * Overflow geometry on an N-panel midpoint grid, O(N) via the sinh(a(v-u))
 * addition law: the contiguous overflow interval [tau_1, tau_2], the measured
 * fraction |{nu &gt; mu}|/U, and whether nu &gt; mu holds at every representable
 * panel past the Phi peak (no genuine upper down-crossing).
 */
function overflowGeometry(N, U) {
  const H = U / N;
  const phi = new Array(N);
  const ch = new Array(N);
  const sh = new Array(N);
  for (let i = 0; i < N; i++) {
    const u = (i + 0.5) * H;
    phi[i] = phiKernel(u);
    ch[i] = Math.cosh(A * u);
    sh[i] = Math.sinh(A * u);
  }
  const pastCosh = new Array(N);
  const pastSinh = new Array(N);
  let ac = 0;
  let asum = 0;
  for (let k = 0; k < N; k++) {
    ac += phi[k] * ch[k];
    asum += phi[k] * sh[k];
    pastCosh[k] = ac;
    pastSinh[k] = asum;
  }
  const futSinh = new Array(N);
  const futCosh = new Array(N);
  const muSuffix = new Array(N);
  let fs = 0;
  let fc = 0;
  let ms = 0;
  for (let k = N - 1; k >= 0; k--) {
    futSinh[k] = fs;
    futCosh[k] = fc;
    fs += phi[k] * sh[k];
    fc += phi[k] * ch[k];
    ms += phi[k] * phi[k] * Math.sinh(2 * A * (k + 0.5) * H);
    muSuffix[k] = ms;
  }
  let firstOverflow = -1;
  let lastOverflow = -1;
  let overflowPanels = 0;
  let noGenuineDownCrossing = true;
  for (let k = 0; k < N; k++) {
    const tau = (k + 0.5) * H;
    const nu = H * H * (futSinh[k] * pastCosh[k] - futCosh[k] * pastSinh[k]);
    const mu = (H / (2 * Math.PI)) * muSuffix[k];
    // Past the Phi peak, wherever BOTH densities are representable nu must dominate mu.
    if (nu > 0 && mu > 0 && tau > 0.15 && !(nu > mu)) noGenuineDownCrossing = false;
    if (nu > mu) {
      if (firstOverflow < 0) firstOverflow = tau;
      lastOverflow = tau;
      overflowPanels += 1;
    }
  }
  return {
    tau1: firstOverflow,
    tau2: lastOverflow,
    supportLength: lastOverflow - firstOverflow,
    measuredFraction: overflowPanels / N, // = (tau_2 - tau_1)/U (contiguous interval)
    trueFraction: (U - firstOverflow) / U, // (U - tau_1)/U -- the arithmetic-independent quantity
    noGenuineDownCrossing,
  };
}

// -- U-ladder reconciliation --------------------------------------------------
const LADDER = Object.freeze(
  U_LADDER.map((U) => Object.freeze({ U, ...overflowGeometry(N_FINE, U) })),
);

const rowAt6 = LADDER.find((r) => r.U === 6);

// (R1) The imp-3175 anchor equals the underflow-pinned measured fraction at U = 6,
// and that measured fraction equals (tau_2 - tau_1)/U exactly (contiguous interval).
const anchorMatchesMeasuredAt6 = Math.abs(rowAt6.measuredFraction - IMP3175_CONVERGED_ANCHOR) < 1e-3;
const anchorDecomposes = Math.abs(rowAt6.measuredFraction - rowAt6.supportLength / rowAt6.U) < 1e-4;

// tau_1 and the support length are U-invariant (< 1e-3); tau_2 is pinned at the horizon.
const tau1s = LADDER.map((r) => r.tau1);
const tau2s = LADDER.map((r) => r.tau2);
const lengths = LADDER.map((r) => r.supportLength);
const tau1Spread = Math.max(...tau1s) - Math.min(...tau1s);
const tau2Spread = Math.max(...tau2s) - Math.min(...tau2s);
const lengthSpread = Math.max(...lengths) - Math.min(...lengths);

// (R2) Measured fraction falls monotonically like 1/U (support length U-fixed);
// each row is ~ supportLength/U, i.e. (measuredFraction * U) is ~ constant.
const measuredFallsWithU = LADDER.every(
  (r, i) => i === 0 || r.measuredFraction < LADDER[i - 1].measuredFraction,
);
const measuredTimesUProducts = LADDER.map((r) => r.measuredFraction * r.U);
const measuredTimesUSpread =
  Math.max(...measuredTimesUProducts) - Math.min(...measuredTimesUProducts);

// (R3) True fraction rises monotonically toward 1; no genuine upper crossing anywhere.
const trueRisesWithU = LADDER.every(
  (r, i) => i === 0 || r.trueFraction > LADDER[i - 1].trueFraction,
);
const noGenuineDownCrossingAllU = LADDER.every((r) => r.noGenuineDownCrossing);
const trueFractionNear1 = LADDER[LADDER.length - 1].trueFraction > 0.98;

const verdict =
  anchorMatchesMeasuredAt6 &&
  anchorDecomposes &&
  measuredFallsWithU &&
  trueRisesWithU &&
  noGenuineDownCrossingAllU
    ? 'ANCHOR-0.209-IS-UNDERFLOW-PINNED-1/U-MEASUREMENT-ARTIFACT-AT-U=6; REPLACE-WITH-(U-tau_1)/U->1, tau_1~0.111-SOLE-GENUINE-ENDPOINT'
    : 'INDETERMINATE';

export const IMP3306_OVERFLOW_FRACTION_ANCHOR_UNDERFLOW_RECONCILE = Object.freeze({
  id: 'imp-3306-overflow-fraction-anchor-underflow-reconcile',
  ticket: 'imp-3306',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedAnchor: 'imp-3175-overflow-fraction-resolution-reconcile.js',
  relatedUnderflowHorizon: 'imp-3216-overflow-support-length-closed-form.js',
  relatedCellSweep: 'imp-3199-overflow-fraction-cell-sweep.js',

  summary:
    'RECONCILES the widely re-pointed imp-3175 ~0.209 "resolution-converged genuine overflow fraction" ' +
    'against the imp-3216 finding that the upper support endpoint tau_2 ~ 1.366 is the IEEE-754 kernel ' +
    'UNDERFLOW HORIZON, not a mathematical nu>mu down-crossing. Recomputing the imp-3216 endpoints on the ' +
    'same fine grid (N = 51200) across the U ladder {6,8,10,12} at a = 0.5, NPHI = 10 shows: (R1) at U = 6 ' +
    'the measured fraction is 0.20918 and equals (tau_2 - tau_1)/U to < 1e-4 (tau_1 ~ 0.1109 genuine, ' +
    'tau_2 ~ 1.3660 underflow horizon), so the imp-3175 anchor IS the underflow-pinned measured fraction, ' +
    'not a Phi-intrinsic limit; (R2) since tau_2 is pinned at the horizon (support length ~ 1.255 stays ' +
    'U-invariant to < 1e-3), the anchor falls like 1/U as U grows (0.2092, 0.1569, 0.1255, 0.1046, each ' +
    '~ 1.255/U) -- a fixed absolute lag length over a growing window, an ARTIFACT of the window; (R3) the ' +
    'arithmetic-independent replacement is the TRUE fraction (U - tau_1)/U -> 1 (0.9815 -> 0.9908 rising, ' +
    'opposite direction to the anchor), whose single U-free invariant is the genuine crossover tau_1 ~ 0.111 ' +
    'plus the fact that no upper crossing exists in exact arithmetic. VERDICT: the ~0.209 anchor is a ' +
    'double-precision measurement artifact of holding U = 6; the number to trust is (U - tau_1)/U -> 1 with ' +
    'tau_1 ~ 0.111 the sole genuine endpoint. DIAGNOSTIC; revises the imp-3175 re-pointing; NO RH verdict.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    shearDensity: 'nu(tau) = int_0^tau du int_tau^U dv Phi(u) Phi(v) sinh(a(v-u))  (past-future Volterra block)',
    passiveDensity: 'mu(tau) = (1/2pi) int_tau^U Phi(u)^2 sinh(2 a u) du  (integrated Phi^2-tail diagonal)',
    measuredFraction: '|{tau in [0,U] : nu(tau) > mu(tau)}| / U = (tau_2 - tau_1)/U  (the imp-3175 anchor)',
    trueFraction: '(U - tau_1)/U  (the arithmetic-independent overflow fraction, tau_2 removed as machine-pinned)',
    lowerEndpoint: 'tau_1 ~ 0.111  genuine a-scale-free nu/mu crossover past the Phi peak (sole genuine endpoint)',
    upperEndpoint: 'tau_2 ~ 1.366  IEEE-754 double underflow horizon of Phi(u), NOT a mathematical crossover',
    factorization: 'sinh(a(v-u)) = sinh(av)cosh(au) - cosh(av)sinh(au) -> past-prefix x future-suffix, O(N) per resolution',
    fineResolution: N_FINE,
    a: A,
    phiTruncationN: NPHI,
    uLadder: U_LADDER,
    quadrature: 'midpoint, N panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    ladder: LADDER, // per U: tau_1, tau_2, support length, measured fraction, true fraction
    imp3175ConvergedAnchor: IMP3175_CONVERGED_ANCHOR,
    measuredFractionAt6: rowAt6.measuredFraction, // reproduces the imp-3175 ~0.2092 anchor
    supportLengthAt6: rowAt6.supportLength,
    tau1At6: rowAt6.tau1,
    tau2At6: rowAt6.tau2,
    trueFractionAt6: rowAt6.trueFraction,
    anchorMatchesMeasuredAt6,
    anchorDecomposes, // measured fraction == (tau_2 - tau_1)/U to < 1e-4
    tau1Spread, // tau_1 U-invariant (< 1e-3)
    tau2Spread, // tau_2 U-invariant (< 1e-3), pinned at the underflow horizon
    lengthSpread, // support length U-invariant (< 1e-3)
    measuredFallsWithU, // (R2) anchor falls like 1/U
    measuredTimesUSpread, // measuredFraction * U ~ constant (~ 1.255) -> the 1/U signature
    trueRisesWithU, // (R3) true fraction rises toward 1
    trueFractionNear1,
    noGenuineDownCrossingAllU, // nu > mu at every representable panel past the Phi peak, all U
    verdict,
  }),

  interpretation: Object.freeze({
    anchorIsUnderflowPinned:
      'imp-3175 correctly converged the N-limit of |{nu > mu}|/U at the fixed cell U = 6, reaching ~0.2092. ' +
      'But that functional silently caps the overflow region at the largest representable lag tau_2 ~ 1.366 ' +
      '(the imp-3216 kernel underflow horizon), NOT at U. At U = 6 the converged anchor equals (tau_2 - ' +
      'tau_1)/U = (1.366 - 0.111)/6 ~ 0.2092 to < 1e-4, so it is the underflow-pinned measured fraction, not ' +
      'a Phi-intrinsic overflow fraction.',
    oneOverUSignature:
      'Because tau_2 is machine-pinned, the support length tau_2 - tau_1 ~ 1.255 is U-invariant (spread ' +
      '< 1e-3 across U in {6,8,10,12}), so the measured anchor (tau_2 - tau_1)/U falls like 1/U: 0.2092, ' +
      '0.1569, 0.1255, 0.1046, each ~ 1.255/U (measuredFraction * U ~ constant). A genuine Phi-intrinsic ' +
      'fraction would be U-stable; a value scaling as 1/U is a fixed absolute lag length over a growing ' +
      'window -- an artifact of the window, confirming the ~0.209 is not a limit.',
    arithmeticIndependentReplacement:
      'The only genuine mathematical endpoint is tau_1 ~ 0.111 (a-, U-, NPHI-invariant). The ' +
      'arithmetic-independent overflow-fraction quantity that should replace the ~0.209 anchor is the true ' +
      'fraction (U - tau_1)/U -> 1 as U -> inf (0.9815, 0.9861, 0.9889, 0.9908 -- rising, opposite to the ' +
      'anchor), whose single U-free invariant is tau_1 itself together with the fact that no upper crossing ' +
      'exists in exact arithmetic (nu > mu for every representable tau > tau_1, all U).',
    reconciliation:
      'Both prior modules are internally correct: imp-3175 resolved its functional at U = 6, imp-3216 ' +
      'identified the upper endpoint as machine underflow. The tension dissolves once the imp-3175 functional ' +
      'is seen to cap at the horizon rather than at U, making its ~0.209 a double-precision measurement ' +
      'artifact at U = 6, not a genuine fraction. Pages quoting ~0.209 as THE genuine fraction should read it ' +
      'as "the double-precision-measured fraction at U = 6"; the corrected quantity is (U - tau_1)/U -> 1.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    revisesImp3175Repointing:
      'This module revises the widespread re-pointing of the imp-3175 ~0.209 anchor as THE genuine overflow ' +
      'fraction: it is the underflow-pinned measured fraction at U = 6, a double-precision measurement ' +
      'artifact scaling as 1/U. The arithmetic-independent quantity is (U - tau_1)/U -> 1 with tau_1 ~ 0.111 ' +
      'the sole genuine endpoint.',
    addressesOverflowFractionOnlyNotAbsoluteDeficitMagnitude:
      'This reconciles the overflow-FRACTION anchor only. The absolute deg-2 deficit magnitude (a separate ' +
      'quantity carrying the offline normalization convention) is NOT re-derived here.',
    necessaryNotSufficient:
      'A nonzero overflow fraction is necessary-but-NOT-sufficient at operator order; the off-diagonal ' +
      'endpoint-Hankel operator step (imp-3066) remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3306_OVERFLOW_FRACTION_ANCHOR_UNDERFLOW_RECONCILE_ASSERTIONS = [
  {
    id: 'imp3306-anchor-equals-underflow-pinned-measured-fraction-at-U6',
    why: 'THE RECONCILIATION (R1): at U = 6 the fine-grid measured fraction must reproduce the imp-3175 ~0.2092 ' +
         'anchor (within 1e-3) AND equal (tau_2 - tau_1)/U to < 1e-4 -- proving the anchor is the ' +
         'underflow-pinned measured fraction over the contiguous overflow interval, not a Phi-intrinsic limit.',
    holds: () => anchorMatchesMeasuredAt6 && anchorDecomposes,
  },
  {
    id: 'imp3306-tau2-pinned-support-length-U-invariant',
    why: 'The upper endpoint tau_2 (~1.366) and the support length (~1.255) must be U-invariant (spread < 1e-3) ' +
         'because tau_2 is the machine underflow horizon, while tau_1 stays put -- the structural premise that ' +
         'makes the anchor scale as 1/U.',
    holds: () => tau2Spread < 1e-3 && lengthSpread < 1e-3 && tau1Spread < 1e-3,
  },
  {
    id: 'imp3306-measured-fraction-is-1-over-U-artifact',
    why: 'THE ARTIFACT (R2): the measured fraction (tau_2 - tau_1)/U must fall monotonically as U grows, and ' +
         'measuredFraction * U must stay ~ constant (~ 1.255, spread < 5e-3) -- the 1/U signature of a fixed ' +
         'absolute lag length over a growing window, not a convergent Phi-intrinsic fraction.',
    holds: () => measuredFallsWithU && measuredTimesUSpread < 5e-3,
  },
  {
    id: 'imp3306-true-fraction-rises-toward-1',
    why: 'THE REPLACEMENT (R3): the arithmetic-independent true fraction (U - tau_1)/U must rise monotonically ' +
         'toward 1 as U grows (opposite direction to the anchor) and exceed 0.98 at the top of the ladder, with ' +
         'no genuine upper down-crossing at any U (nu > mu for every representable tau past the Phi peak).',
    holds: () => trueRisesWithU && trueFractionNear1 && noGenuineDownCrossingAllU,
  },
  {
    id: 'imp3306-verdict-is-underflow-pinned-artifact',
    why: 'The classified verdict must be the underflow-pinned-artifact reconciliation (anchor = 1/U artifact at ' +
         'U = 6, replaced by (U - tau_1)/U -> 1 with tau_1 the sole genuine endpoint), not indeterminate; a flip ' +
         'means the decomposition, the 1/U scaling, or the true-fraction rise broke.',
    holds: () =>
      verdict ===
      'ANCHOR-0.209-IS-UNDERFLOW-PINNED-1/U-MEASUREMENT-ARTIFACT-AT-U=6; REPLACE-WITH-(U-tau_1)/U->1, tau_1~0.111-SOLE-GENUINE-ENDPOINT',
  },
  {
    id: 'imp3306-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: DIAGNOSTIC that REVISES the imp-3175 re-pointing, overflow-fraction anchor only, ' +
         'necessary-but-not-sufficient at operator order, positivity not attempted, no refereed bound is changed. If any ' +
         'flip the module is over-claiming.',
    holds: () => {
      const c = IMP3306_OVERFLOW_FRACTION_ANCHOR_UNDERFLOW_RECONCILE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3306_OVERFLOW_FRACTION_ANCHOR_UNDERFLOW_RECONCILE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3306-overflow-fraction-anchor-underflow-reconcile assertion failed: ${assertion.id}`);
  }
}

export default IMP3306_OVERFLOW_FRACTION_ANCHOR_UNDERFLOW_RECONCILE;
