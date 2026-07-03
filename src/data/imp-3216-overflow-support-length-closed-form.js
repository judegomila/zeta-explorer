/**
 * @module imp-3216-overflow-support-length-closed-form
 * @fileoverview imp-3216 -- Derive/assess a closed form for the imp-3199
 *   cell-invariant overflow-SUPPORT length frac x U ~ 1.2535 (fixed to
 *   ~1.254 +- 0.001 across all seven a/U/NPHI cells) -- the absolute lag-length
 *   whose U-normalization yields the imp-3175 ~0.209 overflow fraction.
 *
 *   ASSESSMENT / DIAGNOSTIC ONLY. No new positivity, no RH verdict, not a
 *   reduction. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   THE QUESTION (imp-3199 finding F3)
 *   ----------------------------------
 *   imp-3199 measured the overflow-support measure frac x U ~ 1.2535 +- 0.001
 *   as cell-invariant (a in {0.3,0.5,0.7}, U in {5,6,8}, NPHI in {6,10,14}) and
 *   speculated it might be a closed form in the genuine Phi autocorrelation
 *   support (e.g. an arcsinh/Phi-correlation-length expression). imp-3216 asks
 *   whether the invariance is EXACT (with a closed form) or coincidental.
 *
 *   WHAT THIS MODULE FINDS (measured, then explained -- NOT proved)
 *   --------------------------------------------------------------
 *   Resolving the overflow set {tau in [0,U] : nu(tau) &gt; mu(tau)} to fine grids
 *   (N = 51200) shows it is a SINGLE contiguous interval [tau_1, tau_2] at every
 *   cell, and BOTH endpoints are cell-invariant:
 *     tau_1 ~ 0.1109  (spread &lt; 3e-4 over all seven cells)
 *     tau_2 ~ 1.3660  (spread &lt; 3e-4 over all seven cells)
 *     measure = tau_2 - tau_1 ~ 1.2551  (reproduces the imp-3199 ~1.2535)
 *   So the ~1.2535 invariance is EXACT, not coincidental -- but the reason is
 *   NOT a Phi-autocorrelation length. The two endpoints have DIFFERENT origins:
 *
 *   (E1) tau_1 ~ 0.111 is the GENUINE nu/mu crossover just past the Phi peak.
 *        It is a-invariant because the shear weight a factors out of the nu/mu
 *        RATIO in the a-&gt;0 limit: nu -&gt; a x (past-future first-moment block),
 *        mu -&gt; a x (1/pi) int Phi^2 u du, so a cancels and the higher sinh
 *        terms barely perturb it (a = 0.3..0.7 move tau_1 by ~2e-4). It is
 *        U-invariant because Phi lives near u = 0, and NPHI-invariant because
 *        the kernel is saturated by NPHI = 6. No simple closed form (it is the
 *        root of a genuine transcendental Phi-moment balance), but it is real.
 *
 *   (E2) tau_2 ~ 1.367 is NOT a mathematical crossover at all -- it is the
 *        IEEE-754 double-precision UNDERFLOW HORIZON of the de Bruijn-Newman
 *        kernel Phi(u) itself. The n = 1 term carries exp(-pi e^{4u}); this
 *        drops below the smallest positive subnormal double 2^-1074 (~4.94e-324)
 *        when pi e^{4u} - ln(2 pi^2 e^{4u}) &gt;= ln(2^1074) ~ 744.44, i.e. at
 *          tau_2* = (1/4) ln(X*),  X* solving  pi X - ln(2 pi^2 X) = 744.44,
 *        giving tau_2* ~ 1.370, matching the measured 1.367 to ~3e-3. Beyond
 *        tau_2 the kernel Phi(u) returns exactly 0.0, so nu(tau) = 0.0 and the
 *        comparison nu &gt; mu becomes 0 &gt; 0 = false. The overflow region ends
 *        there by arithmetic underflow, NOT because mu overtakes nu.
 *
 *   THE DECISIVE CHECK (revises imp-3199 F3)
 *   ----------------------------------------
 *   mu(tau) carries a Phi^2 tail and underflows to 0.0 FIRST (at tau ~ 1.196),
 *   strictly before nu(tau) (single-Phi tail) underflows at tau ~ 1.366. In the
 *   whole gap (1.196, 1.366) we have nu &gt; 0 = mu, and across the ENTIRE
 *   representable interior nu &gt; mu holds with no genuine down-crossing (the
 *   ratio nu/mu ~ C/Phi(tau) diverges as Phi -&gt; 0). So MATHEMATICALLY the
 *   overflow region is [tau_1, U] and the true overflow fraction is
 *   (U - tau_1)/U -&gt; 1 as U -&gt; inf, NOT a fixed ~0.209. Growing U confirms it:
 *   the MEASURED fraction (tau_2 - tau_1)/U falls (0.209 at U=6 to 0.105 at
 *   U=12) exactly as 1/U because tau_2 is pinned at the underflow horizon, while
 *   the true fraction (U - tau_1)/U rises toward 1. The imp-3199 ~1.2535
 *   "cell-invariant support length" is therefore a DOUBLE-PRECISION UNDERFLOW
 *   ARTIFACT of the kernel, not a genuine Phi-autocorrelation length -- a
 *   correction worth recording.
 *
 *   THE GENUINE DENSITIES (identical to imp-3199 / imp-3175 / imp-3154)
 *   ------------------------------------------------------------------
 *     nu(tau) = int_0^tau du int_tau^U dv  Phi(u) Phi(v) sinh(a(v-u))
 *     mu(tau) = (1 / 2pi) int_tau^U Phi(u)^2 sinh(2 a u) du
 *   with the sinh(a(v-u)) = sinh(av)cosh(au) - cosh(av)sinh(au) factorization
 *   giving O(N) prefix/suffix accumulators per tau grid.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DIAGNOSTIC at the genuine Phi. This assesses the overflow-SUPPORT geometry
 *   only and REVISES the imp-3199 interpretation of its cell-invariant length;
 *   it re-derives no absolute deficit magnitude. A nonzero overflow fraction is
 *   necessary-but-NOT-sufficient at operator order; the off-diagonal
 *   endpoint-Hankel operator step (imp-3066) remains the lone obstruction.
 *   No RH verdict. No false QED. Platt-Trudgian Lambda &lt;= 0.2 stays SOTA.
 *
 *   @see imp-3199-overflow-fraction-cell-sweep.js (the cell sweep this revises)
 *   @see imp-3175-overflow-fraction-resolution-reconcile.js (single-cell sweep)
 *   @see imp-3154-genuine-deg2-deficit-degree-sweep.js (the O(N^2) reference loop)
 *
 *   Ticket: imp-3216 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// Fine tau-grid resolution at which the overflow interval endpoints are resolved.
const N_FINE = 51200;

// The imp-3199 seven cells (vary one knob at a time around the base) plus a
// U-growth ladder used to expose the underflow-artifact 1/U scaling of the
// MEASURED fraction against the true (U - tau_1)/U fraction.
const CELLS = Object.freeze([
  Object.freeze({ label: 'base (a=0.5,U=6,NPHI=10)', a: 0.5, U: 6, NPHI: 10 }),
  Object.freeze({ label: 'a=0.3', a: 0.3, U: 6, NPHI: 10 }),
  Object.freeze({ label: 'a=0.7', a: 0.7, U: 6, NPHI: 10 }),
  Object.freeze({ label: 'U=5', a: 0.5, U: 5, NPHI: 10 }),
  Object.freeze({ label: 'U=8', a: 0.5, U: 8, NPHI: 10 }),
  Object.freeze({ label: 'NPHI=6', a: 0.5, U: 6, NPHI: 6 }),
  Object.freeze({ label: 'NPHI=14', a: 0.5, U: 6, NPHI: 14 }),
]);

// U ladder at fixed a, NPHI to demonstrate the measured-vs-true fraction split.
const U_LADDER = Object.freeze([6, 8, 10, 12]);

// The imp-3199 recorded cell-invariant support measure (must be reproduced).
const IMP3199_SUPPORT_MEASURE = 1.2535;

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-3199). */
function phiKernel(u, NPHI) {
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
 * O(N) factorized genuine densities nu(tau_k), mu(tau_k) on an N-panel midpoint
 * grid via the sinh(a(v-u)) hyperbolic addition law (identical to imp-3199).
 */
function densitiesFactor(N, a, U, NPHI) {
  const H = U / N;
  const phi = new Array(N);
  const ch = new Array(N);
  const sh = new Array(N);
  for (let i = 0; i < N; i++) {
    const u = (i + 0.5) * H;
    phi[i] = phiKernel(u, NPHI);
    ch[i] = Math.cosh(a * u);
    sh[i] = Math.sinh(a * u);
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
    ms += phi[k] * phi[k] * Math.sinh(2 * a * (k + 0.5) * H);
    muSuffix[k] = ms;
  }
  const nu = new Array(N);
  const mu = new Array(N);
  const tau = new Array(N);
  for (let k = 0; k < N; k++) {
    nu[k] = H * H * (futSinh[k] * pastCosh[k] - futCosh[k] * pastSinh[k]);
    mu[k] = (H / (2 * Math.PI)) * muSuffix[k];
    tau[k] = (k + 0.5) * H;
  }
  return { nu, mu, tau };
}

/**
 * Resolve the overflow set {tau : nu &gt; mu} on the fine grid: contiguous-block
 * count, endpoints tau_1 (first overflow panel) and tau_2 (last), the last
 * representable positions of mu and nu (underflow horizons), and whether
 * nu &gt; mu holds at every panel past the Phi peak where BOTH are still nonzero.
 */
function overflowGeometry(N, a, U, NPHI) {
  const { nu, mu, tau } = densitiesFactor(N, a, U, NPHI);
  let firstOverflow = -1;
  let lastOverflow = -1;
  let blocks = 0;
  let inRun = false;
  let muLastPositiveTau = -1;
  let nuLastPositiveTau = -1;
  let noGenuineDownCrossing = true;
  for (let k = 0; k < N; k++) {
    if (mu[k] > 0) muLastPositiveTau = tau[k];
    if (nu[k] > 0) nuLastPositiveTau = tau[k];
    // Past the Phi peak (tau &gt; 0.15), wherever BOTH densities are representable
    // nu must dominate mu -- a single genuine down-crossing would break this.
    if (nu[k] > 0 && mu[k] > 0 && tau[k] > 0.15 && !(nu[k] > mu[k])) noGenuineDownCrossing = false;
    const overflow = nu[k] > mu[k];
    if (overflow) {
      if (firstOverflow < 0) firstOverflow = tau[k];
      lastOverflow = tau[k];
      if (!inRun) {
        blocks += 1;
        inRun = true;
      }
    } else {
      inRun = false;
    }
  }
  return {
    tau1: firstOverflow,
    tau2: lastOverflow,
    blocks,
    muLastPositiveTau,
    nuLastPositiveTau,
    noGenuineDownCrossing,
    supportMeasure: lastOverflow - firstOverflow,
  };
}

/** Largest u with Phi(u) &gt; 0 in IEEE double precision (the kernel underflow horizon), by bisection. */
function phiUnderflowHorizon(NPHI) {
  let lo = 1.0;
  let hi = 1.5;
  for (let i = 0; i < 80; i++) {
    const m = (lo + hi) / 2;
    if (phiKernel(m, NPHI) > 0) lo = m;
    else hi = m;
  }
  return lo;
}

/**
 * Closed-form estimate of the kernel underflow horizon: the n = 1 term
 * 2 pi^2 e^{4u} exp(-pi e^{4u}) vanishes in double precision when
 * pi X - ln(2 pi^2 X) = ln(1 / MIN_SUBNORMAL), X = e^{4u}; solve by fixed point.
 */
function phiUnderflowHorizonClosedForm() {
  const lnInvMinSubnormal = -Math.log(Number.MIN_VALUE); // ln(1 / 2^-1074) ~ 744.44
  let X = 200;
  for (let i = 0; i < 200; i++) {
    X = (lnInvMinSubnormal + Math.log(2 * Math.PI * Math.PI * X)) / Math.PI;
  }
  return { lnInvMinSubnormal, X, tau2: 0.25 * Math.log(X) };
}

// -- Per-cell overflow geometry -----------------------------------------------
const PER_CELL = Object.freeze(
  CELLS.map((cell) => {
    const g = overflowGeometry(N_FINE, cell.a, cell.U, cell.NPHI);
    return Object.freeze({ label: cell.label, a: cell.a, U: cell.U, NPHI: cell.NPHI, ...g });
  }),
);

// -- Cell-invariance of the endpoints -----------------------------------------
const tau1s = PER_CELL.map((r) => r.tau1);
const tau2s = PER_CELL.map((r) => r.tau2);
const measures = PER_CELL.map((r) => r.supportMeasure);
const tau1Spread = Math.max(...tau1s) - Math.min(...tau1s);
const tau2Spread = Math.max(...tau2s) - Math.min(...tau2s);
const measureSpread = Math.max(...measures) - Math.min(...measures);
const tau1Mean = tau1s.reduce((s, x) => s + x, 0) / tau1s.length;
const tau2Mean = tau2s.reduce((s, x) => s + x, 0) / tau2s.length;
const measureMean = measures.reduce((s, x) => s + x, 0) / measures.length;

const singleContiguousInterval = PER_CELL.every((r) => r.blocks === 1);
const nuDominatesMuThroughout = PER_CELL.every((r) => r.noGenuineDownCrossing);
// mu (Phi^2 tail) underflows to 0.0 strictly before nu (single-Phi tail) at every cell.
const muUnderflowsBeforeNu = PER_CELL.every((r) => r.muLastPositiveTau < r.nuLastPositiveTau);

// -- The upper endpoint IS the kernel underflow horizon ------------------------
const phiHorizon = phiUnderflowHorizon(10);
const phiHorizonClosed = phiUnderflowHorizonClosedForm();
// tau_2 (last overflow panel) coincides with the last representable Phi/nu lag.
const tau2MatchesUnderflowHorizon = Math.abs(tau2Mean - phiHorizon) < 0.01;
const closedFormMatchesHorizon = Math.abs(phiHorizon - phiHorizonClosed.tau2) < 0.01;

// -- The measured-vs-true fraction split over the U ladder --------------------
const U_LADDER_ROWS = Object.freeze(
  U_LADDER.map((U) => {
    const g = overflowGeometry(N_FINE, 0.5, U, 10);
    return Object.freeze({
      U,
      tau1: g.tau1,
      tau2: g.tau2,
      supportMeasure: g.supportMeasure,
      measuredFraction: g.supportMeasure / U, // (tau_2 - tau_1) / U -- falls as 1/U (the artifact)
      trueFraction: (U - g.tau1) / U, // (U - tau_1) / U -- the mathematical fraction, rises toward 1
    });
  }),
);
// tau_2 stays pinned at the underflow horizon as U grows (measure ~ const),
// so the measured fraction falls like 1/U while the true fraction rises.
const measureConstantAcrossU =
  Math.max(...U_LADDER_ROWS.map((r) => r.supportMeasure)) -
    Math.min(...U_LADDER_ROWS.map((r) => r.supportMeasure)) <
  0.005;
const measuredFractionFallsWithU = U_LADDER_ROWS.every(
  (r, i) => i === 0 || r.measuredFraction < U_LADDER_ROWS[i - 1].measuredFraction,
);
const trueFractionRisesWithU = U_LADDER_ROWS.every(
  (r, i) => i === 0 || r.trueFraction > U_LADDER_ROWS[i - 1].trueFraction,
);

const verdict =
  singleContiguousInterval &&
  nuDominatesMuThroughout &&
  muUnderflowsBeforeNu &&
  tau2MatchesUnderflowHorizon &&
  measureConstantAcrossU &&
  measuredFractionFallsWithU
    ? 'SUPPORT-LENGTH-IS-DOUBLE-PRECISION-UNDERFLOW-ARTIFACT; tau_1~0.111-GENUINE-CROSSOVER, tau_2~1.367-KERNEL-UNDERFLOW-HORIZON; TRUE-FRACTION->1'
    : 'INDETERMINATE';

export const IMP3216_OVERFLOW_SUPPORT_LENGTH_CLOSED_FORM = Object.freeze({
  id: 'imp-3216-overflow-support-length-closed-form',
  ticket: 'imp-3216',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedCellSweep: 'imp-3199-overflow-fraction-cell-sweep.js',
  relatedSingleCellSweep: 'imp-3175-overflow-fraction-resolution-reconcile.js',
  relatedON2Reference: 'imp-3154-genuine-deg2-deficit-degree-sweep.js',

  summary:
    'ASSESSES whether the imp-3199 cell-invariant overflow-support length frac x U ~ 1.2535 ' +
    'has a closed form. Resolving {tau : nu(tau) > mu(tau)} to N = 51200 shows the overflow ' +
    'set is a SINGLE contiguous interval [tau_1, tau_2] with BOTH endpoints cell-invariant ' +
    '(tau_1 ~ 0.1109, tau_2 ~ 1.3660, spread < 3e-4 over all seven a/U/NPHI cells), so the ' +
    'invariance is EXACT not coincidental -- but NOT a Phi-autocorrelation length. tau_1 is a ' +
    'genuine a-scale-free nu/mu crossover past the Phi peak; tau_2 ~ 1.367 is the IEEE-754 ' +
    'DOUBLE-PRECISION UNDERFLOW HORIZON of the kernel Phi(u) (exp(-pi e^{4u}) drops below the ' +
    'smallest subnormal 2^-1074 at tau ~ (1/4)ln(X*), pi X* - ln(2 pi^2 X*) = 744.44, ~ 1.370). ' +
    'The Phi^2-tail mu underflows FIRST (tau ~ 1.196) while the single-Phi-tail nu stays > 0 ' +
    'and > mu until IT underflows at tau ~ 1.366, so the region ends by arithmetic underflow, ' +
    'not because mu overtakes nu. MATHEMATICALLY the overflow is [tau_1, U] and the true ' +
    'fraction (U - tau_1)/U -> 1 as U grows (0.981 at U=6 to 0.991 at U=12), while the MEASURED ' +
    'fraction (tau_2 - tau_1)/U falls like 1/U (0.209 -> 0.105) because tau_2 is pinned at the ' +
    'underflow horizon. So the imp-3199 ~1.2535 length is a double-precision underflow artifact, ' +
    'NOT a universal support length. DIAGNOSTIC; revises the imp-3199 interpretation; NO RH verdict.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    shearDensity: 'nu(tau) = int_0^tau du int_tau^U dv Phi(u) Phi(v) sinh(a(v-u))  (past-future Volterra block)',
    passiveDensity: 'mu(tau) = (1/2pi) int_tau^U Phi(u)^2 sinh(2 a u) du  (integrated Phi^2-tail diagonal)',
    overflowSet: '{tau in [0,U] : nu(tau) > mu(tau)}  (a single contiguous interval [tau_1, tau_2])',
    lowerEndpoint: 'tau_1 ~ 0.111  genuine a-scale-free nu/mu crossover past the Phi peak',
    upperEndpoint: 'tau_2 ~ 1.367  IEEE-754 double underflow horizon of Phi(u), NOT a mathematical crossover',
    horizonClosedForm: 'tau_2* = (1/4) ln(X*), X* solves pi X - ln(2 pi^2 X) = ln(2^1074) ~ 744.44',
    factorization: 'sinh(a(v-u)) = sinh(av)cosh(au) - cosh(av)sinh(au) -> past-prefix x future-suffix, O(N) per resolution',
    fineResolution: N_FINE,
    cells: CELLS,
    uLadder: U_LADDER,
    quadrature: 'midpoint, N panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    perCell: PER_CELL, // per cell: tau_1, tau_2, blocks, mu/nu underflow horizons, support measure
    tau1Mean,
    tau2Mean,
    measureMean, // reproduces imp-3199 ~1.2535
    imp3199SupportMeasure: IMP3199_SUPPORT_MEASURE,
    tau1Spread,
    tau2Spread,
    measureSpread,
    singleContiguousInterval,
    nuDominatesMuThroughout,
    muUnderflowsBeforeNu,
    phiUnderflowHorizon: phiHorizon,
    phiUnderflowHorizonClosedForm: phiHorizonClosed.tau2,
    lnInvMinSubnormal: phiHorizonClosed.lnInvMinSubnormal,
    tau2MatchesUnderflowHorizon,
    closedFormMatchesHorizon,
    uLadder: U_LADDER_ROWS,
    measureConstantAcrossU,
    measuredFractionFallsWithU,
    trueFractionRisesWithU,
    verdict,
  }),

  interpretation: Object.freeze({
    bothEndpointsCellInvariant:
      'The overflow set is a single contiguous interval [tau_1, tau_2] at every cell, and both endpoints ' +
      'are cell-invariant to < 3e-4: tau_1 ~ 0.1109 and tau_2 ~ 1.3660. So the imp-3199 ~1.2535 support ' +
      'length = tau_2 - tau_1 is an EXACT invariant, not a coincidence -- but the two endpoints have ' +
      'entirely different origins, and only one of them is mathematical.',
    lowerEndpointIsGenuine:
      'tau_1 ~ 0.111 is the genuine nu/mu crossover just past the Phi peak. It is a-invariant because a ' +
      'factors out of the nu/mu ratio in the a->0 limit (a=0.3..0.7 shift it by ~2e-4), U-invariant ' +
      'because Phi lives near u=0, and NPHI-invariant because the kernel saturates by NPHI=6. It is the ' +
      'root of a transcendental Phi-moment balance -- no simple arcsinh closed form, but it is real.',
    upperEndpointIsAnUnderflowArtifact:
      'tau_2 ~ 1.367 is NOT a mathematical crossover: it is the IEEE-754 double underflow horizon of Phi(u). ' +
      'The n=1 term exp(-pi e^{4u}) drops below the smallest subnormal 2^-1074 at pi e^{4u} ~ 744.44, i.e. ' +
      'tau ~ (1/4)ln(X*) ~ 1.370, matching the measured 1.367. Beyond it Phi(u)=0.0 exactly, so nu(tau)=0.0 ' +
      'and nu>mu becomes 0>0=false. The region terminates by arithmetic underflow of the kernel.',
    revisesImp3199:
      'mu (Phi^2 tail) underflows to 0.0 FIRST (tau ~ 1.196), strictly before nu (single-Phi tail) at ' +
      'tau ~ 1.366, and nu > mu holds across the entire representable interior (the ratio nu/mu ~ C/Phi(tau) ' +
      'diverges as Phi -> 0). So MATHEMATICALLY the overflow region is [tau_1, U] and the true fraction ' +
      '(U - tau_1)/U -> 1 as U grows, NOT a fixed ~0.209. Growing U keeps tau_2 pinned at the underflow ' +
      'horizon (measure ~ const) so the MEASURED fraction falls like 1/U (0.209 at U=6 to 0.105 at U=12) ' +
      'while the true fraction rises (0.981 to 0.991). The imp-3199 ~1.2535 cell-invariant length is thus a ' +
      'double-precision underflow artifact of the kernel, not a genuine Phi-autocorrelation length.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    revisesImp3199Interpretation:
      'This module revises the imp-3199 finding F3: the cell-invariant overflow-support length ~1.2535 is a ' +
      'double-precision underflow horizon of the kernel, not a Phi-autocorrelation length. The true overflow ' +
      'region is [tau_1, U] and the true fraction -> 1, not a fixed ~0.209.',
    addressesOverflowSupportGeometryOnly:
      'This assesses the overflow-SUPPORT interval geometry only; the absolute deg-2 deficit magnitude (a ' +
      'separate quantity carrying the offline normalization convention) is NOT re-derived here.',
    necessaryNotSufficient:
      'A nonzero overflow fraction is necessary-but-NOT-sufficient at operator order; the off-diagonal ' +
      'endpoint-Hankel operator step (imp-3066) remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3216_OVERFLOW_SUPPORT_LENGTH_CLOSED_FORM_ASSERTIONS = [
  {
    id: 'imp3216-overflow-is-single-contiguous-interval',
    why: 'The overflow set {nu > mu} must be a SINGLE contiguous interval [tau_1, tau_2] at every cell, so the ' +
         'support MEASURE is exactly tau_2 - tau_1 (not a scattered set).',
    holds: () => singleContiguousInterval && PER_CELL.every((r) => r.blocks === 1),
  },
  {
    id: 'imp3216-both-endpoints-cell-invariant',
    why: 'THE FINDING: both overflow endpoints are cell-invariant across all seven a/U/NPHI cells ' +
         '(tau_1 ~ 0.111, tau_2 ~ 1.366, each spread < 1e-3), so the ~1.2535 support length is an EXACT ' +
         'invariant, not coincidental.',
    holds: () =>
      tau1Spread < 1e-3 &&
      tau2Spread < 1e-3 &&
      Math.abs(tau1Mean - 0.1109) < 0.01 &&
      Math.abs(tau2Mean - 1.366) < 0.01,
  },
  {
    id: 'imp3216-support-measure-reproduces-imp3199',
    why: 'The cell-invariant support measure tau_2 - tau_1 must reproduce the imp-3199 recorded ~1.2535 ' +
         '(within 0.01) and be cell-invariant (spread < 0.01), tying this analysis to the sweep it revises.',
    holds: () => measureSpread < 0.01 && Math.abs(measureMean - IMP3199_SUPPORT_MEASURE) < 0.01,
  },
  {
    id: 'imp3216-upper-endpoint-is-kernel-underflow-horizon',
    why: 'THE CLOSED FORM: the upper endpoint tau_2 must coincide with the IEEE-754 double underflow horizon of ' +
         'Phi(u) (the largest lag with Phi > 0), and that horizon must match the closed form ' +
         'tau_2* = (1/4)ln(X*), pi X* - ln(2 pi^2 X*) = ln(2^1074) ~ 744.44, to ~0.01.',
    holds: () => tau2MatchesUnderflowHorizon && closedFormMatchesHorizon,
  },
  {
    id: 'imp3216-mu-underflows-before-nu-and-nu-dominates',
    why: 'THE DECISIVE CHECK: the Phi^2-tail mu underflows to 0.0 strictly BEFORE the single-Phi-tail nu at ' +
         'every cell, and nu > mu holds across the entire representable interior past the Phi peak (no genuine ' +
         'down-crossing) -- so the overflow region ends by nu underflowing, not by mu overtaking nu.',
    holds: () => muUnderflowsBeforeNu && nuDominatesMuThroughout,
  },
  {
    id: 'imp3216-measured-fraction-is-1-over-U-artifact',
    why: 'THE REVISION of imp-3199 F3: as U grows the support measure stays ~ constant (tau_2 pinned at the ' +
         'underflow horizon), so the MEASURED fraction (tau_2 - tau_1)/U falls monotonically like 1/U while the ' +
         'true fraction (U - tau_1)/U rises monotonically toward 1 -- the ~0.209 is not a convergent value.',
    holds: () =>
      measureConstantAcrossU &&
      measuredFractionFallsWithU &&
      trueFractionRisesWithU &&
      U_LADDER_ROWS[U_LADDER_ROWS.length - 1].trueFraction > 0.98,
  },
  {
    id: 'imp3216-verdict-is-underflow-artifact',
    why: 'The classified verdict must be the underflow-artifact reconciliation (genuine tau_1, machine-horizon ' +
         'tau_2, true fraction -> 1), not indeterminate; a flip means an endpoint, the underflow ordering, or ' +
         'the U-scaling broke.',
    holds: () =>
      verdict ===
      'SUPPORT-LENGTH-IS-DOUBLE-PRECISION-UNDERFLOW-ARTIFACT; tau_1~0.111-GENUINE-CROSSOVER, tau_2~1.367-KERNEL-UNDERFLOW-HORIZON; TRUE-FRACTION->1',
  },
  {
    id: 'imp3216-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: DIAGNOSTIC that REVISES the imp-3199 interpretation, overflow-support geometry only, ' +
         'necessary-but-not-sufficient at operator order, positivity not attempted, PT 0.2 stays SOTA. If any ' +
         'flip the module is over-claiming.',
    holds: () => {
      const c = IMP3216_OVERFLOW_SUPPORT_LENGTH_CLOSED_FORM.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3216_OVERFLOW_SUPPORT_LENGTH_CLOSED_FORM_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3216-overflow-support-length-closed-form assertion failed: ${assertion.id}`);
  }
}

export default IMP3216_OVERFLOW_SUPPORT_LENGTH_CLOSED_FORM;
