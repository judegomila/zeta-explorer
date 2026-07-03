/**
 * @module imp-3322-spread-contraction-discriminator
 * @fileoverview imp-3322 -- Reconcile the imp-3224 finer-N verdict (the absolute
 *   overflow-support length frac x U N-CONVERGES to ~1.2552 and the cross-cell
 *   spread CONTRACTS monotonically with N, read there as the signature of a
 *   GENUINE cell-invariant length) against the imp-3216 / imp-3312 finding that the
 *   support upper endpoint tau_2 ~ 1.366 is the IEEE-754 kernel UNDERFLOW HORIZON
 *   (so the whole length is a double-precision artifact).
 *
 *   THE QUESTION (verbatim from the ticket)
 *   ---------------------------------------
 *   Is the imp-3224 spread-contraction-with-N convergence toward a genuine
 *   Phi-autocorrelation length, or is it simply the shared underflow horizon
 *   becoming better-resolved as N grows -- which would ALSO contract the spread?
 *
 *   ASSESSMENT / DIAGNOSTIC ONLY. No new positivity, no RH verdict, not a
 *   reduction. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   THE CONFOUND imp-3224 DID NOT CONTROL FOR
 *   -----------------------------------------
 *   imp-3224 argued (C2): "a finite-resolution coincidence would NOT systematically
 *   pull the cells toward a common value as N grows, so the tightening spread
 *   certifies the invariance is genuine and N-convergent." That inference is only
 *   valid if the common value the cells are pulled toward is a genuine length. But
 *   imp-3216 identified the upper endpoint tau_2 ~ 1.366 as the IEEE-754 double
 *   underflow horizon of the de Bruijn-Newman kernel Phi, i.e. the tau at which the
 *   kernel exp(-pi e^{4u}) drops below the smallest subnormal 2^-1074. That horizon
 *   is a MACHINE CONSTANT: it depends only on the arithmetic underflow level and the
 *   kernel shape, NOT on the cell parameters (a, U, NPHI). So it is EXACTLY
 *   cell-invariant by construction. Refining N sharpens every cell's estimate of the
 *   SAME machine horizon, so the cross-cell spread MUST contract with N -- whether or
 *   not tau_2 is a genuine length. C2 is therefore NON-DISCRIMINATING: it confirms
 *   the double-precision READING is N-stable and cell-common, but is silent on
 *   genuine-vs-artifact.
 *
 *   THE DISCRIMINATING TEST imp-3224 DID NOT RUN (this module)
 *   ---------------------------------------------------------
 *   The genuine-vs-artifact question is separated not by refining N (grid
 *   resolution) but by varying the ARITHMETIC TRUNCATION LEVEL (precision). If the
 *   upper endpoint is the underflow horizon, then raising the truncation threshold T
 *   (zeroing the kernel wherever |Phi(u)| &lt; T, for T well ABOVE the machine
 *   subnormal 2^-1074) must move the horizon INWARD and SHRINK the length, tracking
 *   the closed-form horizon tau_2(T) = (1/4) ln X(T), pi X - ln(2 pi^2 X) = ln(1/T).
 *   A GENUINE Phi-autocorrelation length would be INVARIANT to T (the truncation
 *   never touches the real nu/mu crossover). This module runs that sweep at fixed N
 *   and finds, on the base cell (a=0.5, U=6, NPHI=10):
 *
 *   (D1) THRESHOLD SWEEP -- the support length frac x U DECREASES monotonically as
 *        the truncation threshold T rises (2^-1074 native -> 1e-300 -> ... -> 1e-100),
 *        and the measured upper endpoint tracks the closed-form horizon tau_2(T) to
 *        the grid resolution at every T. The upper endpoint IS the arithmetic
 *        truncation horizon: it moves with the precision, so it is NOT a fixed
 *        Phi-autocorrelation length.
 *   (D2) THE CONFOUND, DEMONSTRATED -- at a FIXED, manifestly artificial threshold
 *        T0 = 1e-150 (twelve orders of magnitude above the machine subnormal, so the
 *        endpoint it induces is UNCONTESTABLY a truncation artifact) the imp-3224
 *        N-ladder cross-cell sweep reproduces the SAME C2 signature: the cross-cell
 *        spread of frac x U still contracts monotonically as N grows and the cells
 *        still converge to a common length. Since T0 is an artifact by construction,
 *        this proves the imp-3224 spread-contraction cannot distinguish a genuine
 *        length from a shared truncation horizon.
 *   (D3) THE LOWER ENDPOINT IS UNMOVED -- across the entire threshold sweep the lower
 *        endpoint tau_1 ~ 0.111 (the imp-3216 genuine a-scale-free nu/mu crossover,
 *        imp-3307) stays fixed, so ONLY the upper endpoint tracks the horizon. The
 *        length is [tau_1 (genuine), tau_2(T) (arithmetic)] -- one real endpoint and
 *        one machine endpoint, exactly the imp-3216 geometry.
 *
 *   VERDICT
 *   -------
 *   The imp-3224 C2 spread-contraction-with-N is NOT evidence of a genuine
 *   Phi-autocorrelation length. It is the shared, cell-invariant IEEE-754 underflow
 *   horizon (a machine constant independent of a/U/NPHI) being better-resolved as N
 *   grows -- exactly the alternative the ticket names. The N-converged ~1.2552 is the
 *   double-precision READING of an interval whose upper endpoint is arithmetic
 *   (confirming imp-3216 / imp-3312, and consistent with the imp-3308 log-domain
 *   measurement that the mathematically-correct fraction (U - tau_1)/U -> 1). What
 *   imp-3224 legitimately certifies is narrower than it claimed: the double-precision
 *   reading is N-stable and cell-common; it is NOT a genuine autocorrelation length.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DIAGNOSTIC at the genuine Phi. Overflow-support geometry only; the absolute
 *   deficit MAGNITUDE is not re-derived. A nonzero overflow measure is
 *   necessary-but-NOT-sufficient at operator order; the off-diagonal endpoint-Hankel
 *   step (imp-3066) remains the lone obstruction. RH-equivalent. No RH verdict, no
 *   false QED. Platt-Trudgian Lambda &lt;= 0.2 stays the rigorous SOTA.
 *
 *   @see imp-3224-overflow-support-finer-N-crossval.js (the C1/C2/C3 finer-N verdict)
 *   @see imp-3216-overflow-support-length-closed-form.js (the underflow-horizon endpoint)
 *   @see imp-3312-underflow-horizon-lock.js (the horizon build-lock)
 *   @see imp-3308-overflow-fraction-rescaled-ladder.js (the log-domain fraction -> 1 measurement)
 *
 *   Ticket: imp-3322 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// Smallest positive IEEE-754 double subnormal -- the true machine underflow level.
const MACHINE_SUBNORMAL = Number.MIN_VALUE; // 2^-1074 ~ 4.94e-324

// Base cell used for the threshold sweep (the imp-3199 / imp-3224 base cell).
const BASE_CELL = Object.freeze({ a: 0.5, U: 6, NPHI: 10 });

// Truncation-threshold ladder for D1/D3. threshold = 0 means "no floor" = native
// double precision (the imp-3224 / imp-3216 reading). The remaining thresholds sit
// FAR above the machine subnormal, so the endpoints they induce are unambiguously
// arithmetic-truncation artifacts.
const THRESHOLD_LADDER = Object.freeze([0, 1e-300, 1e-250, 1e-200, 1e-150, 1e-100]);

// Fixed N for the threshold sweep (isolates the threshold effect from grid effect).
const SWEEP_N = 25600;

// D2 reproduces the imp-3224 N-ladder at a FIXED artificial threshold to show the
// C2 spread-contraction survives for an admitted artifact.
const N_LADDER = Object.freeze([6400, 12800, 25600, 51200]);
const ARTIFICIAL_THRESHOLD = 1e-150;
// Cells that differ ONLY in the integration window U (same a, same NPHI). Both
// endpoints tau_1 (a-dependent) and tau_2 (kernel/threshold-dependent) are therefore
// identical across them, so the true frac x U is a provably cell-invariant constant
// and ANY residual cross-cell spread is pure grid quantization -- which contracts as
// ~U/N. This is the strongest confound form: imp-3224's "spread contracts with N =>
// genuine length" logic would (wrongly) certify this quantized truncation-artifact
// endpoint as a genuine autocorrelation length.
const D2_CELLS = Object.freeze([
  Object.freeze({ label: 'U=5.5', a: 0.5, U: 5.5, NPHI: 10 }),
  Object.freeze({ label: 'U=6', a: 0.5, U: 6, NPHI: 10 }),
  Object.freeze({ label: 'U=7', a: 0.5, U: 7, NPHI: 10 }),
  Object.freeze({ label: 'U=8', a: 0.5, U: 8, NPHI: 10 }),
]);

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (as imp-3224). */
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
 * O(N) factorized genuine densities nu(tau_k), mu(tau_k) via the sinh addition law,
 * with an OPTIONAL truncation threshold: any kernel sample with |Phi(u)| &lt; threshold
 * is zeroed, simulating a raised arithmetic underflow horizon. threshold = 0 recovers
 * the native double-precision computation (imp-3224).
 */
function densitiesFactor(N, a, U, NPHI, threshold) {
  const H = U / N;
  const phi = new Array(N);
  const ch = new Array(N);
  const sh = new Array(N);
  for (let i = 0; i < N; i++) {
    const u = (i + 0.5) * H;
    let p = phiKernel(u, NPHI);
    if (threshold > 0 && Math.abs(p) < threshold) p = 0;
    phi[i] = p;
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
    futSinh[k] = fs; // sum over j > k (set BEFORE folding in k)
    futCosh[k] = fc;
    fs += phi[k] * sh[k];
    fc += phi[k] * ch[k];
    ms += phi[k] * phi[k] * Math.sinh(2 * a * (k + 0.5) * H);
    muSuffix[k] = ms; // sum over j >= k
  }
  const nu = new Array(N);
  const mu = new Array(N);
  for (let k = 0; k < N; k++) {
    nu[k] = H * H * (futSinh[k] * pastCosh[k] - futCosh[k] * pastSinh[k]);
    mu[k] = (H / (2 * Math.PI)) * muSuffix[k];
  }
  return { nu, mu, H };
}

/**
 * Support geometry at a given (N, cell, threshold): the absolute overflow-support
 * measure |{tau : nu > mu}| = (panel count / N) * U, plus the first and last
 * overflow-panel tau (the measured lower/upper endpoints tau_1, tau_2).
 */
function supportGeometry(N, a, U, NPHI, threshold) {
  const { nu, mu, H } = densitiesFactor(N, a, U, NPHI, threshold);
  let panels = 0;
  let firstK = -1;
  let lastK = -1;
  for (let k = 0; k < N; k++) {
    if (nu[k] > mu[k]) {
      panels += 1;
      if (firstK < 0) firstK = k;
      lastK = k;
    }
  }
  return {
    measure: (panels / N) * U,
    tau1: firstK < 0 ? NaN : (firstK + 0.5) * H,
    tau2: lastK < 0 ? NaN : (lastK + 0.5) * H,
  };
}

/**
 * Closed-form arithmetic underflow horizon for truncation level T: the tau at which
 * the leading kernel term 2 pi^2 X exp(-pi X), X = e^{4u}, drops to T, i.e. the root
 * of pi X - ln(2 pi^2 X) = ln(1/T), tau_2 = (1/4) ln X. Bisection on X.
 */
function horizonTau(T) {
  const rhs = -Math.log(T); // = ln(1/T); computed as -ln T to avoid 1/T overflowing to Infinity for subnormal T
  const f = (X) => Math.PI * X - Math.log(2 * Math.PI * Math.PI * X) - rhs;
  let lo = 1e-6;
  let hi = rhs; // pi X > rhs is a comfortable upper bracket for X
  for (let it = 0; it < 200; it++) {
    const mid = 0.5 * (lo + hi);
    if (f(mid) > 0) hi = mid;
    else lo = mid;
  }
  return 0.25 * Math.log(0.5 * (lo + hi));
}

// -- D1: threshold sweep at fixed N (upper endpoint tracks the horizon) --------
const D1_SWEEP = Object.freeze(
  THRESHOLD_LADDER.map((T) => {
    const g = supportGeometry(SWEEP_N, BASE_CELL.a, BASE_CELL.U, BASE_CELL.NPHI, T);
    // For T = 0 (native) the horizon anchor is the machine subnormal; else T itself.
    const Teff = T === 0 ? MACHINE_SUBNORMAL : T;
    const predictedTau2 = horizonTau(Teff);
    return Object.freeze({
      threshold: T,
      effectiveThreshold: Teff,
      measure: g.measure,
      tau1: g.tau1,
      tau2: g.tau2,
      predictedTau2,
      tau2MatchesHorizon: Math.abs(g.tau2 - predictedTau2) < 3 * (BASE_CELL.U / SWEEP_N) + 5e-3,
    });
  }),
);

// The support length must DECREASE monotonically as the threshold RISES (upper
// endpoint moves inward). THRESHOLD_LADDER is ascending in T after the native anchor,
// so compare the strictly-positive-threshold tail.
const positiveThresholdRows = D1_SWEEP.filter((r) => r.threshold > 0);
const measureDecreasesWithThreshold = positiveThresholdRows.every(
  (r, i) => i === 0 || r.measure <= positiveThresholdRows[i - 1].measure + 1e-9,
);
const allUpperEndpointsTrackHorizon = D1_SWEEP.every((r) => r.tau2MatchesHorizon);

// D3: the LOWER endpoint tau_1 is unmoved across the whole sweep (genuine crossover).
const tau1Values = D1_SWEEP.map((r) => r.tau1);
const tau1Min = Math.min(...tau1Values);
const tau1Max = Math.max(...tau1Values);
const tau1SpreadUnderThreshold = tau1Max - tau1Min;
const lowerEndpointUnmoved = tau1SpreadUnderThreshold < 5e-3;

// Native (threshold 0) anchor must reproduce the imp-3216 endpoints ~[0.111, 1.366].
const nativeRow = D1_SWEEP[0];
const nativeReproducesImp3216 =
  Math.abs(nativeRow.tau1 - 0.111) < 0.01 && Math.abs(nativeRow.tau2 - 1.366) < 0.01;

// -- D2: imp-3224 N-ladder at a FIXED artificial threshold (confound demo) -----
const D2_PER_CELL = Object.freeze(
  D2_CELLS.map((cell) => {
    const ladder = N_LADDER.map((N) => ({
      N,
      measure: supportGeometry(N, cell.a, cell.U, cell.NPHI, ARTIFICIAL_THRESHOLD).measure,
    }));
    return Object.freeze({ label: cell.label, ladder: Object.freeze(ladder.map((r) => Object.freeze(r))) });
  }),
);
const D2_SPREAD_BY_N = Object.freeze(
  N_LADDER.map((N, iN) => {
    const ms = D2_PER_CELL.map((r) => r.ladder[iN].measure);
    const min = Math.min(...ms);
    const max = Math.max(...ms);
    const mean = ms.reduce((s, m) => s + m, 0) / ms.length;
    return Object.freeze({ N, min, max, mean, spread: max - min });
  }),
);
// The SAME imp-3224 C2 signature at an admitted artifact: spread contracts with N.
const artificialSpreadContractsWithN = D2_SPREAD_BY_N.every(
  (row, i) => i === 0 || row.spread <= D2_SPREAD_BY_N[i - 1].spread + 1e-9,
);
const artificialSpreadNetContraction =
  D2_SPREAD_BY_N[D2_SPREAD_BY_N.length - 1].spread < D2_SPREAD_BY_N[0].spread;

const verdict =
  measureDecreasesWithThreshold &&
  allUpperEndpointsTrackHorizon &&
  lowerEndpointUnmoved &&
  artificialSpreadContractsWithN &&
  artificialSpreadNetContraction
    ? 'IMP3224-C2-SPREAD-CONTRACTION-IS-NON-DISCRIMINATING; UPPER-ENDPOINT-TRACKS-THE-ARITHMETIC-UNDERFLOW-HORIZON (NOT-A-GENUINE-PHI-AUTOCORRELATION-LENGTH), CONFIRMS-imp-3216/imp-3312'
    : 'INDETERMINATE';

export const IMP3322_SPREAD_CONTRACTION_DISCRIMINATOR = Object.freeze({
  id: 'imp-3322-spread-contraction-discriminator',
  ticket: 'imp-3322',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedFinerNCrossval: 'imp-3224-overflow-support-finer-N-crossval.js',
  relatedEndpointClosedForm: 'imp-3216-overflow-support-length-closed-form.js',
  relatedHorizonLock: 'imp-3312-underflow-horizon-lock.js',
  relatedLogDomainLadder: 'imp-3308-overflow-fraction-rescaled-ladder.js',

  summary:
    'Reconciles the imp-3224 finer-N verdict (overflow-support length frac x U N-converges ' +
    'to ~1.2552 and the cross-cell spread CONTRACTS with N, read as a genuine cell-invariant ' +
    'length) against the imp-3216 / imp-3312 finding that the support upper endpoint tau_2 ~ ' +
    '1.366 is the IEEE-754 kernel underflow horizon. FINDING: the imp-3224 C2 ' +
    'spread-contraction is NON-DISCRIMINATING. Because the underflow horizon is a MACHINE ' +
    'CONSTANT (independent of a/U/NPHI), it is cell-invariant by construction, so refining N ' +
    'pulls every cell toward the SAME horizon and the spread contracts whether or not tau_2 ' +
    'is a genuine length. The discriminating test is not N (grid) but T (arithmetic ' +
    'truncation): (D1) sweeping a truncation threshold T at fixed N, the support length ' +
    'DECREASES monotonically as T rises and the measured upper endpoint tracks the ' +
    'closed-form horizon tau_2(T)=(1/4)ln X(T) at every T -- so the endpoint IS the ' +
    'arithmetic horizon, not a fixed length; (D2) at a FIXED manifestly-artificial threshold ' +
    'T0=1e-150 the imp-3224 N-ladder reproduces the SAME C2 spread-contraction, proving the ' +
    'signature cannot separate genuine from artifact; (D3) the lower endpoint tau_1~0.111 ' +
    '(the imp-3216/imp-3307 genuine crossover) is UNMOVED across the sweep. VERDICT: the ' +
    'N-converged ~1.2552 is the double-precision READING, not a genuine Phi-autocorrelation ' +
    'length -- confirming imp-3216/imp-3312 and consistent with the imp-3308 log-domain ' +
    '(U-tau_1)/U -> 1. DIAGNOSTIC; overflow-support only; carries NO RH verdict.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    shearDensity: 'nu(tau) = int_0^tau du int_tau^U dv Phi(u) Phi(v) sinh(a(v-u))',
    passiveDensity: 'mu(tau) = (1/2pi) int_tau^U Phi(u)^2 sinh(2 a u) du',
    truncationModel: 'zero any kernel sample with |Phi(u)| < T; T=0 recovers native double precision',
    horizonClosedForm: 'tau_2(T) = (1/4) ln X, X the root of pi X - ln(2 pi^2 X) = ln(1/T)',
    machineSubnormal: MACHINE_SUBNORMAL,
    baseCell: BASE_CELL,
    thresholdLadder: THRESHOLD_LADDER,
    sweepN: SWEEP_N,
    nLadder: N_LADDER,
    artificialThreshold: ARTIFICIAL_THRESHOLD,
    d2Cells: D2_CELLS,
    quadrature: 'midpoint, N panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    d1ThresholdSweep: D1_SWEEP, // per threshold: measure, tau1, tau2, predicted horizon, match flag
    measureDecreasesWithThreshold, // D1: length shrinks as T rises (endpoint moves inward)
    allUpperEndpointsTrackHorizon, // D1: measured tau2 matches closed-form horizon at every T
    nativeRow, // threshold=0 anchor
    nativeReproducesImp3216, // native endpoints ~[0.111, 1.366]
    tau1SpreadUnderThreshold, // D3: lower-endpoint spread across the sweep (~0)
    lowerEndpointUnmoved, // D3: tau1 fixed across the sweep
    d2PerCell: D2_PER_CELL, // D2: imp-3224 N-ladder at the artificial threshold
    d2SpreadByN: D2_SPREAD_BY_N, // D2: cross-cell spread at each N (still contracts)
    artificialSpreadContractsWithN, // D2: the imp-3224 C2 signature reproduces for an artifact
    artificialSpreadNetContraction,
    verdict,
  }),

  interpretation: Object.freeze({
    whyC2CannotDiscriminate:
      'imp-3224 C2 reads the cross-cell spread contracting with N as proof of a genuine length. But the ' +
      'imp-3216 upper endpoint tau_2 is the IEEE-754 underflow horizon, a machine constant fixed by the ' +
      'subnormal 2^-1074 and the kernel shape and INDEPENDENT of a/U/NPHI -- hence exactly cell-invariant by ' +
      'construction. Refining N sharpens every cell estimate of that SAME horizon, so the spread contracts ' +
      'regardless of whether tau_2 is a genuine length. C2 tests N-stability of the reading, not its nature.',
    theDiscriminatingKnobIsPrecisionNotResolution:
      'The genuine-vs-artifact axis is the arithmetic TRUNCATION level, not the grid resolution. A genuine ' +
      'Phi-autocorrelation length is invariant to a truncation threshold placed far below the real nu/mu ' +
      'crossover; an underflow-horizon endpoint moves with it. D1 shows the endpoint moves (tracks tau_2(T) ' +
      'to the grid resolution), so it is the horizon.',
    theConfoundMadeExplicit:
      'D2 runs the exact imp-3224 N-ladder cross-cell test at a fixed T0=1e-150 -- an endpoint that is ' +
      'UNCONTESTABLY a truncation artifact (12 orders of magnitude above the machine subnormal) -- and the ' +
      'imp-3224 C2 spread-contraction reproduces verbatim. A test that fires identically for a known artifact ' +
      'cannot be evidence the double-precision endpoint is genuine.',
    consistentWithTheHorizonProgram:
      'The verdict confirms imp-3216 (endpoint is the underflow horizon), imp-3312 (the horizon lock), and the ' +
      'imp-3308 log-domain measurement that the mathematically-correct fraction (U - tau_1)/U -> 1 once the ' +
      'arithmetic is carried past 1.366. imp-3224 legitimately certifies the READING is N-stable and ' +
      'cell-common; it does NOT establish a genuine autocorrelation length.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    resolvesTheImp3224VsImp3216Tension:
      'The two prior findings are not in conflict once C2 is read correctly: imp-3224 measured a real property ' +
      '(the double-precision reading is N-convergent and cell-common) but mislabeled it as a genuine length; ' +
      'imp-3216 is right that the upper endpoint is arithmetic. This module supplies the precision-sweep that ' +
      'imp-3224 omitted and shows C2 is non-discriminating -- so ~1.2552 is the double-precision reading, ' +
      'NOT a Phi-autocorrelation length.',
    addressesOverflowSupportOnlyNotAbsoluteDeficitMagnitude:
      'Overflow-support geometry only. The absolute deg-2 deficit magnitude (a separate quantity carrying the ' +
      'offline normalization convention) is NOT re-derived here.',
    necessaryNotSufficient:
      'A nonzero overflow measure is necessary-but-NOT-sufficient at operator order; the off-diagonal ' +
      'endpoint-Hankel operator step (imp-3066) remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3322_SPREAD_CONTRACTION_DISCRIMINATOR_ASSERTIONS = [
  {
    id: 'imp3322-native-reproduces-imp3216-endpoints',
    why: 'The threshold=0 (native double) anchor must reproduce the imp-3216 support interval endpoints ' +
         '~[0.111, 1.366]; a drift means the base computation no longer matches the finding being reconciled.',
    holds: () => nativeReproducesImp3216,
  },
  {
    id: 'imp3322-length-shrinks-as-truncation-rises',
    why: 'THE DELIVERABLE (D1): raising the arithmetic truncation threshold T must shrink the support length ' +
         'monotonically (the upper endpoint moves inward). If the length were a genuine T-invariant ' +
         'autocorrelation length it would NOT move; that it moves proves the endpoint is arithmetic.',
    holds: () => measureDecreasesWithThreshold,
  },
  {
    id: 'imp3322-upper-endpoint-tracks-closed-form-horizon',
    why: 'THE DELIVERABLE (D1): at every threshold the measured upper endpoint must match the closed-form ' +
         'underflow horizon tau_2(T)=(1/4)ln X(T) to the grid resolution -- identifying the endpoint AS the ' +
         'arithmetic horizon, not a coincidental length.',
    holds: () => allUpperEndpointsTrackHorizon,
  },
  {
    id: 'imp3322-lower-endpoint-unmoved-across-sweep',
    why: 'THE DELIVERABLE (D3): the lower endpoint tau_1 ~ 0.111 (the imp-3216/imp-3307 genuine a-scale-free ' +
         'nu/mu crossover) must stay fixed across the whole threshold sweep -- so ONLY the upper endpoint is ' +
         'arithmetic; the length is one genuine endpoint plus one machine endpoint.',
    holds: () => lowerEndpointUnmoved,
  },
  {
    id: 'imp3322-C2-signature-reproduces-for-an-artifact',
    why: 'THE DELIVERABLE (D2): at a fixed manifestly-artificial threshold T0=1e-150 the imp-3224 N-ladder ' +
         'cross-cell spread must STILL contract monotonically with N and net-contract overall. A test that ' +
         'fires identically for a known truncation artifact cannot certify a genuine length -- this is the ' +
         'proof that C2 is non-discriminating.',
    holds: () => artificialSpreadContractsWithN && artificialSpreadNetContraction,
  },
  {
    id: 'imp3322-verdict-is-non-discriminating-horizon',
    why: 'The classified verdict must be the NON-DISCRIMINATING / upper-endpoint-tracks-the-horizon ' +
         'reconciliation, not indeterminate; a flip means one of the four discriminating sub-tests broke.',
    holds: () =>
      verdict ===
      'IMP3224-C2-SPREAD-CONTRACTION-IS-NON-DISCRIMINATING; UPPER-ENDPOINT-TRACKS-THE-ARITHMETIC-UNDERFLOW-HORIZON (NOT-A-GENUINE-PHI-AUTOCORRELATION-LENGTH), CONFIRMS-imp-3216/imp-3312',
  },
  {
    id: 'imp3322-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: DIAGNOSTIC reconciliation, overflow-support-only (not the absolute deficit ' +
         'magnitude), necessary-but-not-sufficient at operator order, positivity not attempted, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3322_SPREAD_CONTRACTION_DISCRIMINATOR.honestCaveat;
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

for (const assertion of IMP3322_SPREAD_CONTRACTION_DISCRIMINATOR_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3322-spread-contraction-discriminator assertion failed: ${assertion.id}`);
  }
}

export default IMP3322_SPREAD_CONTRACTION_DISCRIMINATOR;
