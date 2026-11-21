/**
 * @module imp-3239-overflow-support-invariance-mechanism
 * @fileoverview imp-3239 -- DERIVE / ASSESS the analytic mechanism behind the
 *   imp-3199 finding F3: WHY is the cell-invariant overflow-support length
 *   frac x U ~ 1.2535 invariant under the shear weight a and the kernel
 *   truncation NPHI, and dependent on U only through the trivial 1/U
 *   normalization? Executes the imp-3315 RE-POINT: rule out the arithmetic
 *   (underflow-horizon) explanation for the UPPER endpoint before attributing
 *   the invariance to a structural mechanism, and give the leading-order
 *   a-cancellation mechanism for the LOWER endpoint.
 *
 *   ASSESSMENT / DIAGNOSTIC ONLY. No new positivity, no RH verdict, not a
 *   reduction. No refereed bound is changed.
 *
 *   THE QUESTION (imp-3199 F3, re-pointed by imp-3216 / imp-3315)
 *   ------------------------------------------------------------
 *   imp-3199 measured the absolute overflow-support measure frac x U ~ 1.2535
 *   +- 0.001 as invariant across a in {0.3,0.5,0.7} and NPHI in {6,10,14}, and
 *   moving only with U. imp-3216 then resolved the overflow set {tau : nu &gt; mu}
 *   to N = 51200 and found it is a SINGLE contiguous interval [tau_1, tau_2]
 *   whose two endpoints have DIFFERENT origins. imp-3239 supplies the per-knob
 *   DERIVATION of the invariance that imp-3216 asserted qualitatively, and
 *   confirms the re-point: the upper endpoint IS the arithmetic underflow
 *   horizon, not a genuine a/NPHI-invariant structural crossover.
 *
 *   THE DECOMPOSITION (measured at N = 51200, then explained -- NOT proved)
 *   ----------------------------------------------------------------------
 *   The invariance factors CLEANLY into the two endpoints, one arithmetic and
 *   one genuine, and each endpoint's a / NPHI / U behaviour has its own reason:
 *
 *   (M1) UPPER ENDPOINT tau_2 ~ 1.367 -- ARITHMETIC, a-FREE BY CONSTRUCTION.
 *        tau_2 is the IEEE-754 double-precision underflow horizon of the kernel
 *        Phi(u) (the largest u with Phi(u) &gt; 0.0). NPHI-INVARIANCE IS EXACT:
 *        the underflow horizon is set by the SLOWEST-decaying term, n = 1
 *        (its exponent pi n^2 e^{4u} is smallest, so it is the LAST to
 *        underflow); adding higher-n terms cannot move where Phi last leaves
 *        0.0, so the horizon is IDENTICAL to all 16 digits for NPHI in
 *        {1,2,4,6,10,14} -- saturated already at NPHI = 1, not merely NPHI = 6.
 *        a-INVARIANCE IS STRUCTURAL: the kernel Phi(u) carries NO a (a enters
 *        only the sinh/cosh shear weights that MULTIPLY the already-zero kernel
 *        beyond the horizon), so the continuous horizon function takes no a
 *        argument at all. The discrete tau_2 endpoint drifts by only ~1e-3 over
 *        a in {0.1..1.5} -- a residual subnormal-product jitter (larger a keeps
 *        the tiny subnormal Phi products representable one or two panels
 *        further), itself an arithmetic effect bounded by the a-free horizon.
 *
 *   (M2) LOWER ENDPOINT tau_1 ~ 0.111 -- GENUINE nu/mu CROSSOVER, a CANCELS AT
 *        LEADING ORDER. As a -&gt; 0, sinh(a(v-u)) ~ a(v-u) and sinh(2 a u) ~ 2 a u,
 *        so nu(tau) ~ a x [int_0^tau int_tau^U Phi(u)Phi(v)(v-u)] and
 *        mu(tau) ~ a x [(1/pi) int_tau^U Phi(u)^2 u], and the shared factor a
 *        CANCELS in the crossover equation nu = mu. The a-free leading-order
 *        crossover tau_1^0 solving that a-independent Phi-moment balance is
 *        ~0.1108, matching the small-a measured tau_1 (a = 0.1 -&gt; 0.1108) to
 *        grid precision; the higher sinh terms leave only an O(a^2) residual, so
 *        tau_1 drifts by ~1.3e-3 across the whole a in {0.1..1.5} range.
 *        NPHI-invariance: the Phi peak near u = 0 is saturated by NPHI = 6, so
 *        tau_1 is IDENTICAL for NPHI in {6,10,14}.
 *
 *   (M3) U-DEPENDENCE IS TRIVIAL. Both endpoints live at fixed absolute lags
 *        (tau_1 ~ 0.111, tau_2 ~ 1.367) well inside [0, U] whenever U &gt; tau_2,
 *        so the interval [tau_1, tau_2] -- and hence the length ~ 1.255 -- is
 *        U-independent, and the FRACTION is just that fixed length divided by U
 *        (the imp-3199 1.2535 / U normalization; the imp-3216 revision that the
 *        true fraction (U - tau_1)/U -&gt; 1 stands).
 *
 *   VERDICT: the ~1.2535 length is a/NPHI-invariant because ONE endpoint is an
 *   a-free NPHI-saturated ARITHMETIC underflow horizon (M1) and the OTHER is a
 *   genuine crossover with leading-order a-cancellation (M2). The arithmetic
 *   explanation for the upper endpoint (imp-3315 re-point) is CONFIRMED, not a
 *   structural a/NPHI-invariance mechanism.
 *
 *   THE GENUINE DENSITIES (identical to imp-3216 / imp-3199 / imp-3175 / imp-3154)
 *   ----------------------------------------------------------------------------
 *     nu(tau) = int_0^tau du int_tau^U dv  Phi(u) Phi(v) sinh(a(v-u))
 *     mu(tau) = (1 / 2pi) int_tau^U Phi(u)^2 sinh(2 a u) du
 *   with the sinh(a(v-u)) = sinh(av)cosh(au) - cosh(av)sinh(au) factorization
 *   giving O(N) prefix/suffix accumulators per tau grid.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DIAGNOSTIC at the genuine Phi. This explains the a / NPHI / U invariance of
 *   the imp-3199 overflow-support length and CONFIRMS the imp-3216 / imp-3315
 *   underflow-horizon re-point for its upper endpoint; it re-derives no absolute
 *   deficit magnitude. A nonzero overflow fraction is necessary-but-NOT-
 *   sufficient at operator order; the off-diagonal endpoint-Hankel operator step
 *   (imp-3066) remains the lone obstruction. No RH verdict. No false QED.
 *   No refereed bound is changed.
 *
 *   @see imp-3199-overflow-fraction-cell-sweep.js (finding F3, the invariance measured)
 *   @see imp-3216-overflow-support-length-closed-form.js (the underflow-horizon finding)
 *   @see imp-3312-underflow-horizon-lock.js (the cross-module lock on that finding)
 *   @see imp-3315-overflow-support-repoint-audit.js (the RE-POINT this ticket executes)
 *
 *   Ticket: imp-3239 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// Fine tau-grid resolution (matches imp-3216) at which the interval endpoints resolve.
const N_FINE = 51200;

// The imp-3199 recorded cell-invariant support measure the mechanism must reproduce.
const IMP3199_SUPPORT_MEASURE = 1.2535;

// a-sweep (WIDER than the imp-3199 {0.3,0.5,0.7}) at fixed U, NPHI: exposes that
// tau_2 is pinned to the a-free horizon while tau_1 responds only at O(a^2).
const A_SWEEP = Object.freeze([0.1, 0.3, 0.5, 0.7, 0.9, 1.5]);
// NPHI-sweep of the pure underflow horizon: n=1 sets it, so all are identical.
const NPHI_HORIZON_SWEEP = Object.freeze([1, 2, 4, 6, 10, 14]);
// NPHI-sweep of the overflow interval at fixed a, U (saturated regime {6,10,14}).
const NPHI_INTERVAL_SWEEP = Object.freeze([6, 10, 14]);
// U-ladder at fixed a, NPHI: both endpoints stay fixed once U > tau_2 (interior).
const U_SWEEP = Object.freeze([6, 8, 10]);

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-3216). */
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

/** Only the n = 1 term of the kernel -- the slowest-decaying (last to underflow) mode. */
function phiKernelN1(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  return (2 * Math.PI * Math.PI * e4 - 3 * Math.PI * e2) * Math.exp(-Math.PI * e4);
}

/**
 * O(N) factorized genuine densities nu(tau_k), mu(tau_k) on an N-panel midpoint
 * grid via the sinh(a(v-u)) hyperbolic addition law (identical to imp-3216).
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

/** Overflow interval [tau_1, tau_2] and block count from the density pair. */
function overflowInterval(N, a, U, NPHI) {
  const { nu, mu, tau } = densitiesFactor(N, a, U, NPHI);
  let tau1 = -1;
  let tau2 = -1;
  let blocks = 0;
  let inRun = false;
  for (let k = 0; k < N; k++) {
    const overflow = nu[k] > mu[k];
    if (overflow) {
      if (tau1 < 0) tau1 = tau[k];
      tau2 = tau[k];
      if (!inRun) {
        blocks += 1;
        inRun = true;
      }
    } else {
      inRun = false;
    }
  }
  return { tau1, tau2, blocks, length: tau2 - tau1 };
}

/** Largest u with Phi(u) > 0 in IEEE double precision (the kernel underflow horizon), by bisection. */
function underflowHorizon(NPHI) {
  let lo = 1.0;
  let hi = 1.5;
  for (let i = 0; i < 80; i++) {
    const m = (lo + hi) / 2;
    if (phiKernel(m, NPHI) > 0) lo = m;
    else hi = m;
  }
  return lo;
}

/** Same bisection using ONLY the n = 1 term -- confirms n = 1 alone sets the horizon. */
function underflowHorizonN1() {
  let lo = 1.0;
  let hi = 1.5;
  for (let i = 0; i < 80; i++) {
    const m = (lo + hi) / 2;
    if (phiKernelN1(m) > 0) lo = m;
    else hi = m;
  }
  return lo;
}

/**
 * a -> 0 LEADING-ORDER crossover tau_1^0 with a divided out of both densities:
 *   nu / a  -> int_0^tau du int_tau^U dv Phi(u)Phi(v)(v-u)   (sinh(a(v-u)) ~ a(v-u))
 *   mu / a  -> (1/pi) int_tau^U Phi(u)^2 u du                (sinh(2au) ~ 2au, /2pi -> /pi)
 * a CANCELS, so the crossover is an a-free Phi-moment balance. O(N) via prefix sums.
 */
function zeroAcrossover(N, U, NPHI) {
  const H = U / N;
  const phi = new Array(N);
  const u = new Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i], NPHI);
  }
  const pastPhi = new Array(N);
  const pastPhiU = new Array(N);
  let a0 = 0;
  let a1 = 0;
  for (let k = 0; k < N; k++) {
    a0 += phi[k];
    a1 += phi[k] * u[k];
    pastPhi[k] = a0;
    pastPhiU[k] = a1;
  }
  const futPhi = new Array(N);
  const futPhiV = new Array(N);
  const muSuffix = new Array(N);
  let f0 = 0;
  let f1 = 0;
  let ms = 0;
  for (let k = N - 1; k >= 0; k--) {
    futPhi[k] = f0;
    futPhiV[k] = f1;
    f0 += phi[k];
    f1 += phi[k] * u[k];
    ms += phi[k] * phi[k] * u[k];
    muSuffix[k] = ms;
  }
  for (let k = 0; k < N; k++) {
    // int_0^tau du int_tau^U dv Phi(u)Phi(v)(v-u), factorized:
    const nu0 = H * H * (futPhiV[k] * pastPhi[k] - futPhi[k] * pastPhiU[k]);
    const mu0 = (H / Math.PI) * muSuffix[k];
    if (nu0 > mu0) return (k + 0.5) * H;
  }
  return -1;
}

// -- (M1) UPPER ENDPOINT: NPHI-exact, a-free underflow horizon -----------------
const horizonByNphi = NPHI_HORIZON_SWEEP.map((NPHI) => underflowHorizon(NPHI));
const horizonMean = horizonByNphi.reduce((s, x) => s + x, 0) / horizonByNphi.length;
const horizonNphiSpread = Math.max(...horizonByNphi) - Math.min(...horizonByNphi); // exactly 0 (n=1 sets it)
const horizonN1 = underflowHorizonN1();
const horizonN1MatchesFull = Math.abs(horizonN1 - horizonMean) < 1e-12; // n=1 alone == full kernel horizon

// -- (M1)/(M2) a-sweep of the overflow interval endpoints ----------------------
const aSweepRows = A_SWEEP.map((a) => {
  const iv = overflowInterval(N_FINE, a, 6, 10);
  return Object.freeze({ a, tau1: iv.tau1, tau2: iv.tau2, length: iv.length, blocks: iv.blocks });
});
const tau1s = aSweepRows.map((r) => r.tau1);
const tau2s = aSweepRows.map((r) => r.tau2);
const lengthsA = aSweepRows.map((r) => r.length);
const tau1aSpread = Math.max(...tau1s) - Math.min(...tau1s);      // small O(a^2) drift
const tau2aSpread = Math.max(...tau2s) - Math.min(...tau2s);      // subnormal-product jitter, <= 2e-3
const lengthaSpread = Math.max(...lengthsA) - Math.min(...lengthsA);
// tau_2 stays pinned to the a-free continuous horizon across the whole a-sweep.
const tau2TracksHorizon = tau2s.every((t) => Math.abs(t - horizonMean) < 3e-3);
// tau_1 responds to a (leading-order cancellation leaves O(a^2)) more than tau_2's
// distance-to-its-own-invariant does relative to the invariant it tracks -- both tiny.
const singleIntervalAllA = aSweepRows.every((r) => r.blocks === 1);

// -- (M2) a -> 0 leading-order crossover matches the small-a measured tau_1 ----
const tau1ZeroA = zeroAcrossover(N_FINE, 6, 10);
const smallestA_tau1 = aSweepRows[0].tau1; // a = 0.1
const zeroAmatchesSmallA = Math.abs(tau1ZeroA - smallestA_tau1) < 1e-3;

// -- (M1)/(M2) NPHI-sweep of the full interval (saturated regime) --------------
const nphiIntervalRows = NPHI_INTERVAL_SWEEP.map((NPHI) => {
  const iv = overflowInterval(N_FINE, 0.5, 6, NPHI);
  return Object.freeze({ NPHI, tau1: iv.tau1, tau2: iv.tau2, length: iv.length });
});
const nphiTau1Spread = Math.max(...nphiIntervalRows.map((r) => r.tau1)) - Math.min(...nphiIntervalRows.map((r) => r.tau1));
const nphiTau2Spread = Math.max(...nphiIntervalRows.map((r) => r.tau2)) - Math.min(...nphiIntervalRows.map((r) => r.tau2));
const nphiLengthSpread = Math.max(...nphiIntervalRows.map((r) => r.length)) - Math.min(...nphiIntervalRows.map((r) => r.length));
const nphiFullySaturated = nphiTau1Spread < 1e-9 && nphiTau2Spread < 1e-9; // identical to grid precision

// -- (M3) U-sweep: both endpoints fixed once U > tau_2 (interval is interior) --
const uSweepRows = U_SWEEP.map((U) => {
  const iv = overflowInterval(N_FINE, 0.5, U, 10);
  return Object.freeze({ U, tau1: iv.tau1, tau2: iv.tau2, length: iv.length, measuredFraction: iv.length / U });
});
const uTau1Spread = Math.max(...uSweepRows.map((r) => r.tau1)) - Math.min(...uSweepRows.map((r) => r.tau1));
const uTau2Spread = Math.max(...uSweepRows.map((r) => r.tau2)) - Math.min(...uSweepRows.map((r) => r.tau2));
const endpointsUInvariant = uTau1Spread < 1e-3 && uTau2Spread < 1e-3;

// -- Global reconciliation with imp-3199 ---------------------------------------
const lengthMean = lengthsA.reduce((s, x) => s + x, 0) / lengthsA.length;
const reproducesImp3199 = Math.abs(lengthMean - IMP3199_SUPPORT_MEASURE) < 0.01;

const verdict =
  horizonNphiSpread < 1e-12 &&
  horizonN1MatchesFull &&
  tau2TracksHorizon &&
  zeroAmatchesSmallA &&
  nphiFullySaturated &&
  endpointsUInvariant &&
  singleIntervalAllA &&
  reproducesImp3199
    ? 'INVARIANCE-DECOMPOSED: tau_2-IS-a-FREE-NPHI-EXACT-UNDERFLOW-HORIZON (n=1 sets it); tau_1-IS-GENUINE-CROSSOVER-WITH-LEADING-ORDER-a-CANCELLATION; LENGTH-U-INTERIOR -- ARITHMETIC-UPPER-ENDPOINT-CONFIRMED-PER-imp3216-imp3315'
    : 'INDETERMINATE';

export const IMP3239_OVERFLOW_SUPPORT_INVARIANCE_MECHANISM = Object.freeze({
  id: 'imp-3239-overflow-support-invariance-mechanism',
  ticket: 'imp-3239',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedCellSweep: 'imp-3199-overflow-fraction-cell-sweep.js',
  relatedClosedForm: 'imp-3216-overflow-support-length-closed-form.js',
  relatedLock: 'imp-3312-underflow-horizon-lock.js',
  relatedRepoint: 'imp-3315-overflow-support-repoint-audit.js',

  summary:
    'DERIVES the per-knob mechanism behind the imp-3199 F3 invariance of the overflow-support length ' +
    'frac x U ~ 1.2535 under a and NPHI (U only via 1/U), executing the imp-3315 re-point. The overflow ' +
    'set is a single interval [tau_1, tau_2] and the invariance factors into two endpoints of different ' +
    'origin. (M1) UPPER tau_2 ~ 1.367 is the IEEE-754 kernel underflow horizon: NPHI-EXACT because the ' +
    'slowest-decaying n=1 term sets the horizon (identical to 16 digits for NPHI in {1,2,4,6,10,14}; the ' +
    'n=1-only horizon equals the full-kernel horizon), and a-FREE by construction because Phi(u) carries ' +
    'no a (the discrete tau_2 drifts only ~1e-3 over a in {0.1..1.5}, a subnormal-product jitter bounded ' +
    'by the a-free horizon). (M2) LOWER tau_1 ~ 0.111 is a genuine nu/mu crossover: a CANCELS at leading ' +
    'order (nu ~ a x moment, mu ~ a x moment, so a divides out of nu=mu); the a-free leading-order ' +
    'crossover tau_1^0 ~ 0.1108 matches the small-a measured tau_1 to grid precision, leaving only O(a^2) ' +
    'drift (~1.3e-3 over a in {0.1..1.5}), and it is NPHI-saturated by NPHI=6. (M3) both endpoints are ' +
    'interior fixed lags so the length is U-invariant and the fraction is length/U. VERDICT: the ~1.2535 ' +
    'invariance is a/NPHI-invariant because one endpoint is an a-free NPHI-exact ARITHMETIC underflow ' +
    'horizon and the other a leading-order-a-cancelling genuine crossover -- the arithmetic explanation ' +
    'for the upper endpoint (imp-3315 re-point) is CONFIRMED. DIAGNOSTIC; carries NO RH verdict.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    shearDensity: 'nu(tau) = int_0^tau du int_tau^U dv Phi(u) Phi(v) sinh(a(v-u))  (past-future Volterra block)',
    passiveDensity: 'mu(tau) = (1/2pi) int_tau^U Phi(u)^2 sinh(2 a u) du  (integrated Phi^2-tail diagonal)',
    overflowInterval: '{tau in [0,U] : nu(tau) > mu(tau)} = single interval [tau_1, tau_2]',
    upperEndpointMechanism:
      'tau_2 = IEEE-754 underflow horizon of Phi(u); NPHI-exact (slowest-decaying n=1 term sets it) and ' +
      'a-free (Phi carries no a); discrete endpoint jitters < 2e-3 by subnormal-product underflow only',
    lowerEndpointMechanism:
      'tau_1 = genuine nu/mu crossover; a cancels at leading order (nu ~ a x moment, mu ~ a x moment), ' +
      'a-free limiting crossover tau_1^0 = root of int Phi Phi (v-u) = (1/pi) int Phi^2 u; O(a^2) residual',
    zeroAcrossoverDensities: 'nu/a -> int_0^tau int_tau^U Phi(u)Phi(v)(v-u); mu/a -> (1/pi) int_tau^U Phi(u)^2 u',
    factorization: 'sinh(a(v-u)) = sinh(av)cosh(au) - cosh(av)sinh(au) -> past-prefix x future-suffix, O(N)',
    fineResolution: N_FINE,
    aSweep: A_SWEEP,
    nphiHorizonSweep: NPHI_HORIZON_SWEEP,
    nphiIntervalSweep: NPHI_INTERVAL_SWEEP,
    uSweep: U_SWEEP,
    quadrature: 'midpoint, N panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    horizonByNphi,                 // underflow horizon per NPHI -- identical (n=1 sets it)
    horizonMean,
    horizonNphiSpread,             // exactly 0
    horizonN1,                     // n=1-only horizon
    horizonN1MatchesFull,          // n=1 alone == full kernel horizon
    aSweepRows,                    // per-a tau_1, tau_2, length, blocks
    tau1aSpread,                   // O(a^2) drift of the genuine crossover
    tau2aSpread,                   // subnormal-product jitter of the horizon endpoint
    lengthaSpread,
    tau2TracksHorizon,             // tau_2 pinned to the a-free horizon across all a
    singleIntervalAllA,
    tau1ZeroA,                     // a-free leading-order crossover ~0.1108
    smallestA_tau1,
    zeroAmatchesSmallA,            // leading-order crossover matches small-a measurement
    nphiIntervalRows,              // per-NPHI (saturated regime) tau_1, tau_2, length
    nphiTau1Spread,
    nphiTau2Spread,
    nphiLengthSpread,
    nphiFullySaturated,            // identical to grid precision for NPHI in {6,10,14}
    uSweepRows,                    // per-U endpoints + measured fraction length/U
    uTau1Spread,
    uTau2Spread,
    endpointsUInvariant,           // endpoints fixed once U > tau_2 (interval interior)
    lengthMean,
    imp3199SupportMeasure: IMP3199_SUPPORT_MEASURE,
    reproducesImp3199,
    verdict,
  }),

  interpretation: Object.freeze({
    upperEndpointArithmeticNphiExact:
      'The upper endpoint tau_2 ~ 1.367 is the kernel underflow horizon and its NPHI-invariance is EXACT, not ' +
      'merely "saturated by NPHI=6": the slowest-decaying n=1 term (smallest exponent pi n^2 e^{4u}) is the last ' +
      'to underflow, so it alone fixes where Phi last leaves 0.0. The horizon is identical to 16 digits for NPHI ' +
      'in {1,2,4,6,10,14}, and the n=1-only horizon equals the full-kernel horizon -- adding higher-n terms ' +
      '(all already zero there) cannot move it.',
    upperEndpointArithmeticAfree:
      'The a-invariance of tau_2 is structural: Phi(u) carries no a (a enters only the sinh/cosh shear weights, ' +
      'which multiply the already-zero kernel beyond the horizon), so the continuous horizon function takes no a ' +
      'argument. The discrete tau_2 endpoint drifts by only ~1e-3 over a in {0.1..1.5} -- a residual ' +
      'subnormal-product underflow jitter (larger a keeps the tiny subnormal Phi products representable a panel ' +
      'or two further), itself arithmetic and bounded by the a-free horizon. This CONFIRMS the imp-3315 ' +
      're-point: the upper endpoint is an arithmetic underflow horizon, not a structural a/NPHI-invariance.',
    lowerEndpointLeadingOrderACancellation:
      'The lower endpoint tau_1 ~ 0.111 is a genuine nu/mu crossover, and its a-invariance is a leading-order ' +
      'cancellation: as a -> 0 both densities scale as a x (Phi-moment), so a divides out of the crossover ' +
      'equation nu = mu. The a-free leading-order crossover tau_1^0 ~ 0.1108 matches the small-a measured tau_1 ' +
      '(a = 0.1 -> 0.1108) to grid precision, and the higher sinh terms leave only an O(a^2) residual, so tau_1 ' +
      'drifts by only ~1.3e-3 across the whole a in {0.1..1.5} range. It is NPHI-saturated by NPHI=6.',
    lengthUInterior:
      'Both endpoints are fixed absolute lags (tau_1 ~ 0.111, tau_2 ~ 1.367) interior to [0, U] whenever U > tau_2, ' +
      'so the interval and its length ~1.255 are U-independent and the fraction is just length/U -- the trivial ' +
      'imp-3199 1.2535/U normalization. (The imp-3216 revision that the mathematically-correct fraction ' +
      '(U - tau_1)/U -> 1 as U grows still stands; this module explains the a/NPHI/U structure of the MEASURED length.)',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    confirmsImp3216Imp3315Repoint:
      'This module executes the imp-3315 re-point of imp-3239: it CONFIRMS the imp-3216 finding that the upper ' +
      'overflow-support endpoint tau_2 is the IEEE-754 kernel underflow horizon (a-free by construction, ' +
      'NPHI-exact via the n=1 term), so the ~1.2535 length invariance is NOT a structural a/NPHI-invariance ' +
      'mechanism at its upper end -- only the lower endpoint tau_1 is a genuine (leading-order-a-cancelling) crossover.',
    addressesOverflowSupportGeometryOnly:
      'This assesses the overflow-SUPPORT interval endpoints only; the absolute deg-2 deficit magnitude (a ' +
      'separate quantity carrying the offline normalization convention) is NOT re-derived here.',
    necessaryNotSufficient:
      'A nonzero overflow fraction is necessary-but-NOT-sufficient at operator order; the off-diagonal ' +
      'endpoint-Hankel operator step (imp-3066) remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3239_OVERFLOW_SUPPORT_INVARIANCE_MECHANISM_ASSERTIONS = [
  {
    id: 'imp3239-M1-horizon-is-nphi-exact-via-n1',
    why: 'THE MECHANISM (M1, NPHI): the underflow horizon must be set by the slowest-decaying n=1 term alone -- ' +
         'identical to grid precision across NPHI in {1,2,4,6,10,14} (spread ~0) and the n=1-only horizon must ' +
         'equal the full-kernel horizon. This is why NPHI cannot move the upper endpoint (saturated at NPHI=1).',
    holds: () => horizonNphiSpread < 1e-12 && horizonN1MatchesFull,
  },
  {
    id: 'imp3239-M1-upper-endpoint-a-free-tracks-horizon',
    why: 'THE MECHANISM (M1, a): the upper endpoint tau_2 must stay pinned to the a-free continuous underflow ' +
         'horizon across the whole a in {0.1..1.5} sweep (< 3e-3), its only a-response being a small ' +
         'subnormal-product jitter (< 2e-3) -- so tau_2 is arithmetic and a-free, not a structural a-invariant.',
    holds: () => tau2TracksHorizon && tau2aSpread < 2e-3,
  },
  {
    id: 'imp3239-M2-lower-endpoint-leading-order-a-cancellation',
    why: 'THE MECHANISM (M2): the lower endpoint tau_1 must match its a-free LEADING-ORDER crossover (a divided ' +
         'out of both densities) to grid precision at small a, with only an O(a^2) residual drift (< 3e-3) over ' +
         'the whole a-sweep -- confirming a cancels at leading order in the genuine crossover.',
    holds: () => zeroAmatchesSmallA && tau1aSpread < 3e-3 && singleIntervalAllA,
  },
  {
    id: 'imp3239-M1-M2-nphi-saturated-interval',
    why: 'Both interval endpoints (and hence the length) must be identical to grid precision for NPHI in ' +
         '{6,10,14} -- the kernel is saturated near the Phi peak (tau_1) and the horizon (tau_2) by NPHI=6.',
    holds: () => nphiFullySaturated && nphiLengthSpread < 1e-9,
  },
  {
    id: 'imp3239-M3-length-is-U-interior',
    why: 'THE MECHANISM (M3): both endpoints are fixed interior lags for U > tau_2, so tau_1 and tau_2 (and the ' +
         'length) are U-invariant (spread < 1e-3) and the fraction is just length/U.',
    holds: () => endpointsUInvariant,
  },
  {
    id: 'imp3239-reproduces-imp3199-length',
    why: 'The mean support length across the a-sweep must reproduce the imp-3199 recorded ~1.2535 (within 0.01), ' +
         'tying this mechanism analysis to the invariance it explains.',
    holds: () => reproducesImp3199,
  },
  {
    id: 'imp3239-verdict-is-decomposed-arithmetic-upper',
    why: 'The classified verdict must be the decomposed-invariance identifier (a-free NPHI-exact underflow ' +
         'horizon upper endpoint + leading-order-a-cancelling genuine crossover lower endpoint), not ' +
         'indeterminate; a flip means a mechanism leg broke.',
    holds: () =>
      verdict ===
      'INVARIANCE-DECOMPOSED: tau_2-IS-a-FREE-NPHI-EXACT-UNDERFLOW-HORIZON (n=1 sets it); tau_1-IS-GENUINE-CROSSOVER-WITH-LEADING-ORDER-a-CANCELLATION; LENGTH-U-INTERIOR -- ARITHMETIC-UPPER-ENDPOINT-CONFIRMED-PER-imp3216-imp3315',
  },
  {
    id: 'imp3239-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: DIAGNOSTIC that CONFIRMS the imp-3216/imp-3315 underflow-horizon re-point, ' +
         'overflow-support geometry only, necessary-but-not-sufficient at operator order, positivity not ' +
         'attempted, no refereed bound is changed. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3239_OVERFLOW_SUPPORT_INVARIANCE_MECHANISM.honestCaveat;
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

for (const assertion of IMP3239_OVERFLOW_SUPPORT_INVARIANCE_MECHANISM_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3239-overflow-support-invariance-mechanism assertion failed: ${assertion.id}`);
  }
}

export default IMP3239_OVERFLOW_SUPPORT_INVARIANCE_MECHANISM;
