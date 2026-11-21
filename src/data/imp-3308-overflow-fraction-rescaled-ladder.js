/**
 * @module imp-3308-overflow-fraction-rescaled-ladder
 * @fileoverview imp-3308 -- MEASURE the mathematically-correct overflow fraction
 *   (U - tau_1)/U -&gt; 1 on a wider U ladder in a rescaled / log-domain arithmetic
 *   that stays representable PAST the double-precision underflow horizon
 *   tau_2 ~ 1.366, separating the genuine [tau_1, U] overflow region from the
 *   imp-3216 underflow-truncated measurement.
 *
 *   ASSESSMENT / DIAGNOSTIC ONLY. No new positivity, no RH verdict, not a
 *   reduction. No refereed bound is changed.
 *
 *   THE GAP THIS CLOSES (imp-3216 / imp-3306)
 *   -----------------------------------------
 *   imp-3216 showed the upper overflow endpoint tau_2 ~ 1.366 is the IEEE-754
 *   DOUBLE-PRECISION UNDERFLOW HORIZON of the de Bruijn-Newman kernel Phi(u)
 *   (its n = 1 term exp(-pi e^{4u}) drops below the smallest subnormal 2^-1074),
 *   NOT a mathematical nu &gt; mu down-crossing, and ARGUED that mathematically the
 *   overflow region is [tau_1, U] with true fraction (U - tau_1)/U -&gt; 1. imp-3306
 *   recorded that argument but only ever EVALUATED (U - tau_1)/U arithmetically:
 *   the comparison nu(tau) &gt; mu(tau) itself was never checked past tau ~ 1.366,
 *   because in double precision BOTH densities underflow to 0.0 there and the test
 *   degenerates to 0 &gt; 0 = false. This module supplies the missing MEASUREMENT.
 *
 *   THE RESCALED / LOG-DOMAIN EVALUATOR (how we see past the horizon)
 *   ----------------------------------------------------------------
 *   Write Phi(u) = exp(-pi w) B(w), w = e^{4u}, B(w) = sum_n (2 pi^2 n^4 w -
 *   3 pi n^2 sqrt w) exp(-pi (n^2 - 1) w) -- B is the underflow-free polynomial
 *   bracket (validated to match the direct kernel to full double precision wherever
 *   the direct kernel is representable). The tail densities factor as
 *     nu(tau) = int_0^tau Phi(u) [cosh(au) S_v - sinh(au) C_v] du = S_v Pc - C_v Ps
 *     mu(tau) = (1/2pi) int_tau^U Phi(u)^2 sinh(2 a u) du
 *   with S_v = int_tau^U Phi(v) sinh(av) dv, C_v = int_tau^U Phi(v) cosh(av) dv,
 *   Pc = int_0^tau Phi(u) cosh(au) du, Ps = int_0^tau Phi(u) sinh(au) du.
 *   Rescaling the tail by the common boundary factor exp(-pi w0), w0 = e^{4 tau}:
 *     S_v = exp(-pi w0) Stil,  C_v = exp(-pi w0) Ctil,  mu = exp(-2 pi w0) Mtil/2pi,
 *   so sign(nu - mu) = sign( (Stil Pc - Ctil Ps) - exp(-pi w0) Mtil/2pi ). As tau
 *   grows exp(-pi w0) -&gt; 0, leaving the strictly-positive shear term Stil Pc -
 *   Ctil Ps: nu &gt; mu holds for ALL representable tau. Two IEEE-754 traps had to be
 *   defused to see this: (i) the tail integrand near v = tau is a boundary-layer
 *   spike of width ~ 1/(4 pi e^{4 tau}) that a uniform v-grid misses -- the
 *   substitution w = e^{4v} makes it O(1)-wide (integrand ~ exp(-pi(w - w0))); and
 *   (ii) forming w = w0 + delta rounds delta away once w0 &gt; ~1e17, so the panel
 *   offset s = w - w0 is carried explicitly and the span is sized via expm1.
 *
 *   WHAT THIS MODULE FINDS (measured, then explained -- NOT proved)
 *   --------------------------------------------------------------
 *   On the wider ladder U in {6, 12, 20, 30} at a = 0.5, NPHI = 10:
 *
 *   (M1) OVERFLOW PERSISTS TO U. The rescaled test nu &gt; mu holds at every probe
 *        tau out to 0.99 U -- e.g. tau ~ 29.7 at U = 30, more than 21x past the
 *        double-precision horizon 1.366. The overflow region is MEASURED to be the
 *        full [tau_1, U), not the underflow-truncated [tau_1, 1.366].
 *
 *   (M2) THE TRUE FRACTION RISES TOWARD 1. (U - tau_1)/U = 0.98155, 0.99078,
 *        0.99446, 0.99631 across the ladder -- monotone increasing toward 1, the
 *        OPPOSITE direction to the imp-3175 ~0.209 anchor.
 *
 *   (M3) tau_1 IS U-INVARIANT. The genuine lower crossover, located by bisection of
 *        the rescaled test, is tau_1 ~ 0.11070 at every U (spread &lt; 1e-4),
 *        reproducing the imp-3216 tau_1 ~ 0.1109 to &lt; 3e-4.
 *
 *   (M4) DOUBLE PRECISION STOPS BEING TRUSTWORTHY AT ~1.366. The same densities
 *        computed directly (no rescaling) put the last overflow panel at ~1.366 at
 *        EVERY U (pinned at the horizon), so the direct measured fraction
 *        (tau_2 - tau_1)/U falls as ~1.255/U (0.2092, 0.1046, 0.0628, 0.0418) --
 *        exactly the imp-3175 / imp-3306 artifact, now bracketed against the
 *        rescaled truth on the same ladder.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DIAGNOSTIC at the genuine Phi. This measures the overflow-SUPPORT geometry only
 *   and confirms the imp-3216 / imp-3306 (U - tau_1)/U -&gt; 1 reading by direct
 *   arithmetic-independent measurement past the horizon; it re-derives no absolute
 *   deficit magnitude. A nonzero overflow fraction is necessary-but-NOT-sufficient
 *   at operator order; the off-diagonal endpoint-Hankel operator step (imp-3066)
 *   remains the lone obstruction. No RH verdict. No false QED. No refereed bound is changed.
 *
 *   @see imp-3216-overflow-support-length-closed-form.js (the underflow-horizon finding)
 *   @see imp-3306-overflow-fraction-anchor-underflow-reconcile.js (the anchor reconcile it measures)
 *   @see imp-3175-overflow-fraction-resolution-reconcile.js (the ~0.209 anchor)
 *
 *   Ticket: imp-3308 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// Shear weight, kernel truncation (identical to imp-3216 / imp-3306 lightweight cell).
const A_SHEAR = 0.5;
const NPHI = 10;

// Wider U ladder (imp-3216 stopped at U = 12; this goes well past to expose the -> 1 rise).
const U_LADDER = Object.freeze([6, 12, 20, 30]);

// Rescaled-evaluator quadrature. Np past-block panels, Nw tail panels in w = e^{4v} space.
const NP_PAST = 3000;
const NW_TAIL = 3000;
// Past-block integration is capped at the kernel underflow horizon: beyond it Phi(u) = 0
// so Pc, Ps saturate (the peak near u = 0 dominates) and a larger tau adds only zeros.
const PAST_CUT = 1.42;
// Tail width in w-space: exp(-pi * WSPAN) is far below the smallest subnormal, so the
// boundary layer near v = tau is fully captured.
const W_SPAN = 60;

// Direct (double-precision) reference resolution, used only to expose the ~1.366 horizon.
const N_DIRECT = 20000;

// The imp-3216 genuine lower crossover and the imp-3175 anchor for cross-checking.
const IMP3216_TAU1 = 0.1109;
const IMP3175_ANCHOR = 0.209;

/** de Bruijn-Newman kernel, direct double precision (imp-3216 form). Underflows to 0 past ~1.366. */
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
 * Underflow-free polynomial bracket B(w) with Phi(u) = exp(-pi w) B(w), w = e^{4u},
 * sqrt(w) = e^{2u}. Representable for all u up to ~177 (where e^{4u} itself overflows),
 * so the log-domain kernel sees far past the direct double-precision horizon at ~1.366.
 */
function bracketW(w) {
  const sw = Math.sqrt(w);
  let b = 0;
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    b += (2 * Math.PI * Math.PI * n4 * w - 3 * Math.PI * n2 * sw) * Math.exp(-Math.PI * (n2 - 1) * w);
  }
  return b;
}

/**
 * Rescaled overflow test at lag tau: returns a quantity with the SAME SIGN as
 * nu(tau) - mu(tau), computed in the exp(-pi w0)-rescaled domain (w0 = e^{4 tau}) so
 * it stays finite and correct past the double-precision underflow horizon.
 */
function overflowValueRescaled(tau, U) {
  // Past block Pc = int Phi cosh(au), Ps = int Phi sinh(au) over [0, min(tau, PAST_CUT)].
  const uTop = Math.min(tau, PAST_CUT);
  const hu = uTop / NP_PAST;
  let Pc = 0;
  let Ps = 0;
  for (let i = 0; i < NP_PAST; i++) {
    const u = (i + 0.5) * hu;
    const p = phiKernel(u);
    Pc += p * Math.cosh(A_SHEAR * u);
    Ps += p * Math.sinh(A_SHEAR * u);
  }
  Pc *= hu;
  Ps *= hu;

  // Tail in w = e^{4v} space, rescaled by exp(-pi w0). Offset s = w - w0 carried explicitly
  // (forming w0 + s rounds s away once w0 exceeds ~1e17); span sized via expm1 to avoid
  // subtracting two huge nearly-equal exponentials.
  const w0 = Math.exp(4 * tau);
  const dw = w0 * Math.expm1(4 * (U - tau)); // = e^{4U} - e^{4 tau}, may be +Infinity
  const sSpan = Math.min(W_SPAN, dw);
  const hw = sSpan / NW_TAIL;
  let Stil = 0;
  let Ctil = 0;
  let Mtil = 0;
  for (let j = 0; j < NW_TAIL; j++) {
    const s = (j + 0.5) * hw;
    const w = w0 + s;
    const v = 0.25 * Math.log(w);
    const B = bracketW(w);
    const decay = Math.exp(-Math.PI * s);
    const jac = 1 / (4 * w);
    Stil += decay * B * Math.sinh(A_SHEAR * v) * jac;
    Ctil += decay * B * Math.cosh(A_SHEAR * v) * jac;
    Mtil += Math.exp(-2 * Math.PI * s) * B * B * Math.sinh(2 * A_SHEAR * v) * jac;
  }
  Stil *= hw;
  Ctil *= hw;
  Mtil *= hw;

  const shearRescaled = Stil * Pc - Ctil * Ps; // = nu(tau) / exp(-pi w0), strictly positive
  const passiveRescaled = Math.exp(-Math.PI * w0) * (Mtil / (2 * Math.PI)); // = mu(tau) / exp(-pi w0)
  return shearRescaled - passiveRescaled;
}

/** Locate tau_1 (first overflow crossing) by bisection of the rescaled test on [0.02, 0.5]. */
function findTau1(U) {
  let lo = 0.02;
  let hi = 0.5;
  for (let it = 0; it < 50; it++) {
    const m = 0.5 * (lo + hi);
    if (overflowValueRescaled(m, U) > 0) hi = m;
    else lo = m;
  }
  return 0.5 * (lo + hi);
}

/** Direct double-precision last overflow lag (imp-3216 O(N) factorization) -- pins at ~1.366. */
function directLastOverflow(U) {
  const N = N_DIRECT;
  const H = U / N;
  const phi = new Array(N);
  const ch = new Array(N);
  const sh = new Array(N);
  for (let i = 0; i < N; i++) {
    const u = (i + 0.5) * H;
    phi[i] = phiKernel(u);
    ch[i] = Math.cosh(A_SHEAR * u);
    sh[i] = Math.sinh(A_SHEAR * u);
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
    ms += phi[k] * phi[k] * Math.sinh(2 * A_SHEAR * (k + 0.5) * H);
    muSuffix[k] = ms;
  }
  let last = -1;
  for (let k = 0; k < N; k++) {
    const nu = H * H * (futSinh[k] * pastCosh[k] - futCosh[k] * pastSinh[k]);
    const mu = (H / (2 * Math.PI)) * muSuffix[k];
    if (nu > mu) last = (k + 0.5) * H;
  }
  return last;
}

// -- Validate the log-domain kernel against the direct kernel where representable ----
const KERNEL_CHECK = Object.freeze(
  [0, 0.5, 1.0, 1.3].map((u) => {
    const direct = phiKernel(u);
    const viaLog = Math.exp(-Math.PI * Math.exp(4 * u)) * bracketW(Math.exp(4 * u));
    return Object.freeze({ u, direct, viaLog, relError: Math.abs(viaLog - direct) / direct });
  }),
);
const logKernelMatchesDirect = KERNEL_CHECK.every((r) => r.relError < 1e-12);

// -- Per-U rescaled ladder -----------------------------------------------------------
const LADDER_ROWS = Object.freeze(
  U_LADDER.map((U) => {
    const tau1 = findTau1(U);
    // Probe past the double-precision horizon out to 0.99 U.
    const probes = [1.5, 2.0, 3.0, U * 0.5, U * 0.75, U * 0.9, U * 0.99].filter((t) => t < U);
    const overflowAtAllProbes = probes.every((t) => overflowValueRescaled(t, U) > 0);
    const farthestProbe = Math.max(...probes);
    const directLast = directLastOverflow(U);
    return Object.freeze({
      U,
      tau1,
      trueFraction: (U - tau1) / U, // rises toward 1 -- the arithmetic-independent quantity
      overflowAtAllProbes, // rescaled nu > mu holds out to 0.99 U (past the horizon)
      farthestProbe,
      directLastOverflow: directLast, // pins at ~1.366 (the double-precision horizon)
      directMeasuredFraction: (directLast - tau1) / U, // falls as ~1.255/U (the artifact)
    });
  }),
);

// -- Aggregate checks ----------------------------------------------------------------
const tau1s = LADDER_ROWS.map((r) => r.tau1);
const tau1Mean = tau1s.reduce((s, x) => s + x, 0) / tau1s.length;
const tau1Spread = Math.max(...tau1s) - Math.min(...tau1s);

// Rescaled overflow persists past the horizon at every U.
const overflowPersistsPastHorizon = LADDER_ROWS.every(
  (r) => r.overflowAtAllProbes && r.farthestProbe > 1.366,
);
// True fraction rises monotonically toward 1.
const trueFractionRisesTowardOne = LADDER_ROWS.every(
  (r, i) => i === 0 || r.trueFraction > LADDER_ROWS[i - 1].trueFraction,
);
const trueFractionApproachesOne =
  LADDER_ROWS[LADDER_ROWS.length - 1].trueFraction > 0.99 &&
  LADDER_ROWS[LADDER_ROWS.length - 1].trueFraction < 1;
// Direct double precision pins the last overflow at ~1.366 at every U.
const directHorizonPinnedAt1366 = LADDER_ROWS.every(
  (r) => Math.abs(r.directLastOverflow - 1.366) < 0.02,
);
// The direct measured fraction falls (the imp-3175 / imp-3306 artifact) while the true one rises.
const directMeasuredFractionFalls = LADDER_ROWS.every(
  (r, i) => i === 0 || r.directMeasuredFraction < LADDER_ROWS[i - 1].directMeasuredFraction,
);
// At U = 6 the direct measured fraction reproduces the imp-3175 ~0.209 anchor.
const directFractionReproducesAnchorAtU6 =
  Math.abs(LADDER_ROWS[0].directMeasuredFraction - IMP3175_ANCHOR) < 0.01;

const verdict =
  logKernelMatchesDirect &&
  overflowPersistsPastHorizon &&
  trueFractionRisesTowardOne &&
  trueFractionApproachesOne &&
  directHorizonPinnedAt1366 &&
  directMeasuredFractionFalls
    ? 'RESCALED-MEASUREMENT-CONFIRMS-TRUE-FRACTION->1; OVERFLOW-REGION-IS-[tau_1,U)-PAST-THE-1.366-DOUBLE-PRECISION-HORIZON'
    : 'INDETERMINATE';

export const IMP3308_OVERFLOW_FRACTION_RESCALED_LADDER = Object.freeze({
  id: 'imp-3308-overflow-fraction-rescaled-ladder',
  ticket: 'imp-3308',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedUnderflowHorizon: 'imp-3216-overflow-support-length-closed-form.js',
  relatedAnchorReconcile: 'imp-3306-overflow-fraction-anchor-underflow-reconcile.js',
  relatedAnchorSweep: 'imp-3175-overflow-fraction-resolution-reconcile.js',

  summary:
    'MEASURES the mathematically-correct overflow fraction (U - tau_1)/U -> 1 on a wider ladder ' +
    'U in {6,12,20,30} using a rescaled / log-domain evaluator (Phi = exp(-pi w) B(w), w = e^{4u}) ' +
    'that stays representable PAST the imp-3216 double-precision underflow horizon tau_2 ~ 1.366. ' +
    'The rescaled comparison nu(tau) > mu(tau) is evaluated directly out to 0.99 U (e.g. tau ~ 29.7 ' +
    'at U = 30, over 21x past 1.366) and holds at every probe, so the overflow region is MEASURED to ' +
    'be the full [tau_1, U), not the underflow-truncated [tau_1, 1.366]. The true fraction ' +
    '(U - tau_1)/U rises monotonically toward 1 (0.98155, 0.99078, 0.99446, 0.99631) while the ' +
    'genuine lower crossover tau_1 ~ 0.11070 is U-invariant (reproducing imp-3216 to < 3e-4). The ' +
    'same densities computed directly pin the last overflow at ~1.366 at EVERY U, so the direct ' +
    'measured fraction falls as ~1.255/U (0.2092, 0.1046, 0.0628, 0.0418) -- the imp-3175 / imp-3306 ' +
    'artifact, now bracketed against the rescaled truth on the same ladder. This supplies the direct ' +
    'measurement imp-3306 only argued arithmetically. DIAGNOSTIC; NO RH verdict.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    logDomainKernel: 'Phi(u) = exp(-pi w) B(w), w = e^{4u}, B(w) = sum_n (2 pi^2 n^4 w - 3 pi n^2 sqrt w) exp(-pi (n^2-1) w)',
    shearDensity: 'nu(tau) = S_v Pc - C_v Ps, S_v = int_tau^U Phi(v) sinh(av) dv, C_v = int Phi(v) cosh(av) dv',
    passiveDensity: 'mu(tau) = (1/2pi) int_tau^U Phi(u)^2 sinh(2 a u) du',
    rescaledTest: 'sign(nu - mu) = sign( (Stil Pc - Ctil Ps) - exp(-pi w0) Mtil/2pi ), w0 = e^{4 tau}',
    boundaryLayerFix: 'w = e^{4v} substitution makes the tail spike near v = tau O(1)-wide (integrand ~ exp(-pi(w - w0)))',
    roundingFix: 'panel offset s = w - w0 carried explicitly; span sized via expm1 (w0 + s rounds s away once w0 > ~1e17)',
    lowerEndpoint: 'tau_1 ~ 0.11070 genuine a-scale-free nu/mu crossover past the Phi peak (bisection of the rescaled test)',
    uLadder: U_LADDER,
    aShear: A_SHEAR,
    nphi: NPHI,
    npPast: NP_PAST,
    nwTail: NW_TAIL,
    pastCut: PAST_CUT,
    wSpan: W_SPAN,
    nDirect: N_DIRECT,
    quadrature: 'midpoint; past block on [0, min(tau, PAST_CUT)], tail on [w0, w0 + W_SPAN] in w-space',
    selfComputing: true,
  }),

  measured: Object.freeze({
    kernelCheck: KERNEL_CHECK,
    logKernelMatchesDirect,
    ladderRows: LADDER_ROWS,
    tau1Mean,
    tau1Spread,
    imp3216Tau1: IMP3216_TAU1,
    imp3175Anchor: IMP3175_ANCHOR,
    overflowPersistsPastHorizon,
    trueFractionRisesTowardOne,
    trueFractionApproachesOne,
    directHorizonPinnedAt1366,
    directMeasuredFractionFalls,
    directFractionReproducesAnchorAtU6,
    verdict,
  }),

  interpretation: Object.freeze({
    measuredNotArgued:
      'imp-3306 recorded the (U - tau_1)/U -> 1 reading but only evaluated it arithmetically; the ' +
      'comparison nu > mu was never checked past tau ~ 1.366 because both densities underflow to 0.0 ' +
      'there. This module evaluates the SAME comparison in a rescaled domain and finds nu > mu holds ' +
      'out to 0.99 U at every U -- a direct arithmetic-independent measurement of the overflow region.',
    overflowRegionIsFullWindow:
      'The rescaled test nu > mu holds at every probe tau out to 0.99 U (e.g. ~29.7 at U = 30, over ' +
      '21x past the double-precision horizon 1.366), so the overflow region is MEASURED to be the ' +
      'full [tau_1, U), confirming the imp-3216 [tau_1, U] reading rather than the truncated [tau_1, 1.366].',
    trueFractionRises:
      'The true fraction (U - tau_1)/U rises monotonically toward 1 (0.98155 at U=6 to 0.99631 at U=30), ' +
      'the opposite direction to the imp-3175 ~0.209 anchor, whose direct measured fraction falls as ' +
      '~1.255/U (0.2092, 0.1046, 0.0628, 0.0418) on the identical ladder because tau_2 is pinned at the ' +
      'kernel underflow horizon.',
    whereDoublePrecisionBreaks:
      'The direct (non-rescaled) densities put the last overflow panel at ~1.366 at EVERY U, quantifying ' +
      'exactly where double precision stops being trustworthy: the region beyond ~1.366 is invisible to ' +
      'direct arithmetic (Phi underflows) but fully overflow-positive under the rescaled evaluator.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    confirmsImp3216AndImp3306:
      'This measures, past the double-precision horizon, the (U - tau_1)/U -> 1 reading that imp-3216 ' +
      'derived and imp-3306 recorded but only evaluated arithmetically. It does not revise their verdict; ' +
      'it supplies the missing direct measurement of nu > mu beyond tau ~ 1.366.',
    addressesOverflowSupportGeometryOnly:
      'This measures the overflow-SUPPORT interval geometry only; the absolute deg-2 deficit magnitude ' +
      '(a separate quantity carrying the offline normalization convention) is NOT re-derived here.',
    necessaryNotSufficient:
      'A nonzero overflow fraction is necessary-but-NOT-sufficient at operator order; the off-diagonal ' +
      'endpoint-Hankel operator step (imp-3066) remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------
export const IMP3308_OVERFLOW_FRACTION_RESCALED_LADDER_ASSERTIONS = [
  {
    id: 'imp3308-log-kernel-matches-direct',
    why: 'The log-domain kernel Phi = exp(-pi w) B(w) must reproduce the direct de Bruijn-Newman kernel to ' +
         'full double precision (rel err < 1e-12) wherever the direct kernel is representable, or the ' +
         'rescaled measurement is not measuring the same object.',
    holds: () => logKernelMatchesDirect,
  },
  {
    id: 'imp3308-overflow-persists-past-double-precision-horizon',
    why: 'THE MEASUREMENT: the rescaled comparison nu > mu must hold at every probe tau out to 0.99 U at ' +
         'every U on the ladder (probes reach far past the double-precision underflow horizon 1.366), so ' +
         'the overflow region is measured to be the full [tau_1, U), not the truncated [tau_1, 1.366].',
    holds: () => overflowPersistsPastHorizon,
  },
  {
    id: 'imp3308-true-fraction-rises-toward-one',
    why: 'THE FINDING: the true fraction (U - tau_1)/U must rise monotonically with U and approach 1 ' +
         '(> 0.99 at U = 30), the arithmetic-independent quantity that replaces the imp-3175 ~0.209 anchor.',
    holds: () => trueFractionRisesTowardOne && trueFractionApproachesOne,
  },
  {
    id: 'imp3308-tau1-u-invariant-and-matches-imp3216',
    why: 'The genuine lower crossover tau_1 must be U-invariant (spread < 1e-3) and reproduce the imp-3216 ' +
         'tau_1 ~ 0.1109 to < 3e-3, tying the rescaled bisection to the finding it extends.',
    holds: () => tau1Spread < 1e-3 && Math.abs(tau1Mean - IMP3216_TAU1) < 3e-3,
  },
  {
    id: 'imp3308-direct-horizon-pinned-and-fraction-falls',
    why: 'THE CONTRAST: the direct double-precision last overflow must pin at ~1.366 at every U (the ' +
         'underflow horizon) so the direct measured fraction falls as ~1.255/U -- the imp-3175 / imp-3306 ' +
         'artifact -- and at U = 6 must reproduce the ~0.209 anchor to 0.01.',
    holds: () =>
      directHorizonPinnedAt1366 && directMeasuredFractionFalls && directFractionReproducesAnchorAtU6,
  },
  {
    id: 'imp3308-verdict-is-rescaled-confirmation',
    why: 'The classified verdict must be the rescaled-measurement confirmation (true fraction -> 1, region ' +
         '[tau_1, U) past the horizon), not indeterminate; a flip means the kernel check, the past-horizon ' +
         'persistence, the -> 1 rise, or the direct-horizon contrast broke.',
    holds: () =>
      verdict ===
      'RESCALED-MEASUREMENT-CONFIRMS-TRUE-FRACTION->1; OVERFLOW-REGION-IS-[tau_1,U)-PAST-THE-1.366-DOUBLE-PRECISION-HORIZON',
  },
  {
    id: 'imp3308-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: DIAGNOSTIC that CONFIRMS the imp-3216 / imp-3306 reading by measurement, ' +
         'overflow-support geometry only, necessary-but-not-sufficient at operator order, positivity not ' +
         'attempted, no refereed bound is changed. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3308_OVERFLOW_FRACTION_RESCALED_LADDER.honestCaveat;
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

for (const assertion of IMP3308_OVERFLOW_FRACTION_RESCALED_LADDER_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3308-overflow-fraction-rescaled-ladder assertion failed: ${assertion.id}`);
  }
}

export default IMP3308_OVERFLOW_FRACTION_RESCALED_LADDER;
