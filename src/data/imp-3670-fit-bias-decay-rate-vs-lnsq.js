/**
 * @module imp-3670-fit-bias-decay-rate-vs-lnsq
 * @fileoverview imp-3670 -- MEASURE the actual observable fit-bias decay
 *   |p_fit - 2| across the rung ladder n=3..18 (in the imp-3624/imp-3648 base
 *   a-window) against the imp-3646-derived slowly-varying rate (ln n)^2/n^3, to
 *   test whether the C_n/D_n log-divergent-prefactor laws propagate to the
 *   OBSERVABLE least-squares fit-bias.
 *
 *   WHAT imp-3646 DERIVED (and LEFT UNMEASURED at the observable)
 *   ------------------------------------------------------------
 *   imp-3646 derived, from the Laplace saddle of the moment integrand tau^n A(tau)
 *   (peak at tau*(n) solving n = 4 pi tau* e^{4 tau*}, with Q_n = M_(n+2)/M_n ~
 *   tau*(n)^2 and tau*(n) ~ (ln n)/4), the closed slowly-varying laws
 *       C_n = Q_n/((n+1)(n+2)) ~ (ln n)^2/(16 n^2),
 *       D_n = C_(n+2) - C_n < 0, -> 0 like O((ln n)^2/n^3),
 *   and hence |p_fit - 2| = |D_n| cov(a^2,ln a)/var(ln a) -> 0 at the same
 *   O((ln n)^2/n^3) rate. But that propagation to the OBSERVABLE p_fit was only
 *   argued through Q_n/C_n directly; the observable least-squares fit-bias
 *   |p_fit - 2| was never MEASURED against the (ln n)^2/n^3 rate across the ladder.
 *
 *   MEASURED (self-computing; SAME NM=1600 [0,T_A] Simpson grid, base a-window)
 *   -------------------------------------------------------------------------
 *   Using the imp-3624/imp-3648 base window (aHi=0.5, ratio=0.5, K=9; covVar
 *   factor cov(a^2,ln a)/var(ln a) = 0.0293884), the least-squares log-log slope
 *   p_fit of the relative residual is computed at n=3..18 (moments extended to
 *   M_26 so every rung carries a four-term same-parity tail). Two cross-checks pin
 *   the ladder to the certified modules: the n=7 base slope 1.999995360 reproduces
 *   the imp-3648 baked 1.9999953601, and the n=9 base slope 1.999996714 reproduces
 *   the imp-3667 baked 1.9999967140.
 *
 *   THREE readings across n=3..18:
 *     (1) OBSERVABLE-LAW CONFIRMED. |p_fit - 2| = |D_n| cov(a^2,ln a)/var(ln a)
 *         holds to <= ~2e-9 at EVERY rung (e.g. n=3: 1.1575e-5 vs 1.1574e-5;
 *         n=18: 1.0786e-6 vs 1.0785e-6). So the closed C_n/D_n coefficient laws
 *         DO propagate to the measured fit-bias, and |p_fit-2| decays monotonically
 *         1.1575e-5 (n=3) -> 1.0786e-6 (n=18).
 *     (2) NAIVE (ln n)^2/n^3 RATE DRIFTS (does NOT tend to a constant). The ratio
 *         |p_fit-2| / ((ln n)^2/n^3) is STRICTLY INCREASING: 2.59e-4 (n=3) ->
 *         7.53e-4 (n=18), a ~2.9x climb still rising at n=18. So the fully
 *         SIMPLIFIED (ln n)^2/n^3 asymptotic form is NOT yet reached at n<=18.
 *     (3) THE DRIFT IS THE (ln n)/4 SADDLE APPROXIMATION, NOT AN UNMODELED TERM.
 *         Replacing the crude tau*(n) ~ (ln n)/4 by the ACTUAL Laplace saddle
 *         tau*(n)^2 (imp-3646 saddle equation) is faithful: |D_n| / |D_n^saddle|
 *         (D_n^saddle built from tau*(n)^2/((n+1)(n+2))) falls MONOTONICALLY to 1
 *         from above (3.644 at n=3 -> 1.095 at n=18), exactly mirroring imp-3646's
 *         Q_n/tau*^2 -> 1. Pure 1/n^3 (no log) is even worse: |p_fit-2|/(1/n^3)
 *         drifts ~20x (3.13e-4 -> 6.29e-3), confirming a genuine slowly-GROWING
 *         (log) prefactor rather than pure n^-3.
 *
 *   CONCLUSION. The observable |p_fit-2| DOES inherit the derived decay -- it is
 *   EXACTLY |D_n| covVar and -> 0 -- confirming the C_n/D_n laws reach the
 *   observable; and the SADDLE-level rate Q_n ~ tau*(n)^2 is faithful at the
 *   observable. But the fully-simplified (ln n)^2/n^3 form has a large ln ln n
 *   saddle correction at these finite rungs, so dividing by (ln n)^2/n^3 does NOT
 *   give a constant at n<=18 (it drifts up ~2.9x). Named residual:
 *   sg-3670-lnn-saddle-not-asymptotic-at-n18 -- the (ln n)/4 substitution is
 *   pre-asymptotic through n=18; a larger-n ladder (or the exact tau*(n)) is needed
 *   to see the (ln n)^2/n^3 ratio plateau.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT ONLY, at the RH-equivalent scale class. This measures the
 *   observable decay of a fixed-weight Taylor-remainder decay-ORDER read-out
 *   against a derived slowly-varying rate; it establishes NO operator positivity.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0
 *   sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED.
 *   No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-3646-remainder-tail-moment-ratio-asymptotics.js (the derived (ln n)^2/n^3 rate + saddle law)
 *   @see imp-3648-fit-bias-a-window-sensitivity-n78.js (the base a-window; baked n=7 slope)
 *   @see imp-3667-fit-bias-a-window-sensitivity-n910.js (baked n=9 slope)
 *   @see imp-3581-remainder-tail-exponent-derivation.js (the closed C_n/D_n and bias law)
 *   @see imp-3501-moment-ladder-general-derivation.js (R_n = sum a^m/m! M_m)
 *
 *   Ticket: imp-3670 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Composite Simpson quadrature of f on [lo, hi] with n subintervals (n even). */
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) {
    sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return (sum * h) / 3;
}

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds (imp-3469 grid).
function autocorr(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, 1200);
}

// Precompute A on the SAME fixed fine Simpson grid over [0, T_A] as imp-3646/imp-3648.
const T_A = 6;
const NM = 1600;                                // even -> composite Simpson on [0, T_A]
const H_A = T_A / NM;
const A_GRID = [];
for (let j = 0; j <= NM; j += 1) A_GRID.push(autocorr(j * H_A));

/** int_0^{T_A} weight(tau) A(tau) d(tau) by composite Simpson on the precomputed grid. */
function aWeightedMass(weightFn) {
  let sum = 0;
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
    sum += w * weightFn(tau) * A_GRID[j];
  }
  return (sum * H_A) / 3;
}

/** n! for small integer n. */
function factorial(n) {
  let f = 1;
  for (let i = 2; i <= n; i += 1) f *= i;
  return f;
}

// -- Moments M_0..M_26 (four-term same-parity tail at every rung n=3..18) -------------
const MMAX = 26;
const MOMENTS = {};                             // MOMENTS[m] = int tau^m A(tau) d(tau)
for (let m = 0; m <= MMAX; m += 1) MOMENTS[m] = aWeightedMass((tau) => Math.pow(tau, m));

// -- Closed next-order coefficient D_n (imp-3581) ------------------------------------
function nextOrderCoeff(n) {
  return (
    MOMENTS[n + 4] / ((n + 3) * (n + 4) * MOMENTS[n + 2]) -
    MOMENTS[n + 2] / ((n + 1) * (n + 2) * MOMENTS[n])
  );                                            // D_n = C_(n+2) - C_n
}

// -- Cancellation-free remainder, tail, and relative residual (imp-3553/imp-3526) ----
function remainder(n, a, mmax) {
  let s = 0;
  for (let m = n; m <= mmax; m += 2) s += (Math.pow(a, m) / factorial(m)) * MOMENTS[m];
  return s;
}
function residualTail(n, a, mmax) {
  let s = 0;
  for (let m = n + 2; m <= mmax; m += 2) s += (Math.pow(a, m) / factorial(m)) * MOMENTS[m];
  return s;
}
function relativeResidual(n, a, mmax) {
  return residualTail(n, a, mmax) / remainder(n, a, mmax);
}

// -- Least-squares log-log slope (the fitted exponent p_fit) -------------------------
function logLogSlope(xs, ys) {
  const lx = xs.map((v) => Math.log(v));
  const ly = ys.map((v) => Math.log(v));
  const N = lx.length;
  const mx = lx.reduce((s, v) => s + v, 0) / N;
  const my = ly.reduce((s, v) => s + v, 0) / N;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < N; i += 1) {
    sxy += (lx[i] - mx) * (ly[i] - my);
    sxx += (lx[i] - mx) * (lx[i] - mx);
  }
  return sxy / sxx;
}

// -- The a-grid bias factor cov(a^2, ln a)/var(ln a) (window-fixed here) --------------
function covVarFactor(ladder) {
  const la = ladder.map((a) => Math.log(a));
  const a2 = ladder.map((a) => a * a);
  const mla = la.reduce((s, v) => s + v, 0) / la.length;
  const ma2 = a2.reduce((s, v) => s + v, 0) / a2.length;
  let cov = 0;
  let varla = 0;
  for (let i = 0; i < la.length; i += 1) {
    cov += (a2[i] - ma2) * (la[i] - mla);
    varla += (la[i] - mla) * (la[i] - mla);
  }
  return cov / varla;
}

// -- The imp-3624/imp-3648 base a-window (aHi=0.5, ratio=0.5, K=9) --------------------
const BASE_WINDOW = Object.freeze({ aHi: 0.5, ratio: 0.5, K: 9 });
const BASE_LADDER = (() => {
  const ladder = [];
  let a = BASE_WINDOW.aHi;
  for (let i = 0; i < BASE_WINDOW.K; i += 1) {
    ladder.push(a);
    a *= BASE_WINDOW.ratio;
  }
  return Object.freeze(ladder);
})();
const COV_VAR = covVarFactor(BASE_LADDER);      // ~0.0293884, fixed across n

// -- The imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*} -----------
function saddleTau(n) {
  let lo = 1e-6;
  let hi = 5;
  for (let it = 0; it < 200; it += 1) {
    const mid = (lo + hi) / 2;
    if (4 * Math.PI * mid * Math.exp(4 * mid) < n) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
// Saddle-faithful D_n^saddle: Q_n ~ tau*^2, C_n = Q_n/((n+1)(n+2)), D_n = C_(n+2)-C_n.
function saddleCn(n) {
  const t = saddleTau(n);
  return (t * t) / ((n + 1) * (n + 2));
}
function saddleDn(n) {
  return saddleCn(n + 2) - saddleCn(n);
}

// -- The measured rung table n=3..18 -------------------------------------------------
function lnRate(n) {
  return (Math.log(n) * Math.log(n)) / (n * n * n);   // (ln n)^2 / n^3
}

const RUNGS = [];
for (let n = 3; n <= 18; n += 1) {
  let mmax = MMAX;                              // largest same-parity moment <= MMAX
  if ((mmax - n) % 2 !== 0) mmax -= 1;
  const rel = BASE_LADDER.map((a) => relativeResidual(n, a, mmax));
  const pFit = logLogSlope(BASE_LADDER, rel);
  const fitBias = Math.abs(pFit - 2);          // the OBSERVABLE |p_fit - 2|
  const dn = nextOrderCoeff(n);
  const rate = lnRate(n);
  RUNGS.push(
    Object.freeze({
      n,
      mmax,
      pFit,                                     // least-squares log-log slope on the base window
      fitBias,                                  // |p_fit - 2|, the observable
      nextOrderCoeff: dn,                       // closed D_n
      lawPrediction: Math.abs(dn) * COV_VAR,    // |D_n| cov(a^2,ln a)/var(ln a) -- should equal fitBias
      lawErr: Math.abs(fitBias - Math.abs(dn) * COV_VAR),
      lnRate: rate,                             // (ln n)^2/n^3
      ratioToLnRate: fitBias / rate,            // -> const iff the (ln n)^2/n^3 rate is reached
      ratioToPureN3: fitBias / (1 / (n * n * n)),// -> const only if NO log factor (it drifts more)
      saddleDnRatio: Math.abs(dn) / Math.abs(saddleDn(n)), // |D_n|/|D_n^saddle| -> 1 (faithful rate)
    })
  );
}

// -- Diagnostics ---------------------------------------------------------------------
function strictlyIncreasing(vals) {
  for (let i = 1; i < vals.length; i += 1) if (vals[i] <= vals[i - 1]) return false;
  return true;
}
function strictlyDecreasing(vals) {
  for (let i = 1; i < vals.length; i += 1) if (vals[i] >= vals[i - 1]) return false;
  return true;
}

const FIT_BIAS_VALS = RUNGS.map((r) => r.fitBias);
const LAW_ERR_MAX = Math.max(...RUNGS.map((r) => r.lawErr));
const RATIO_LN_VALS = RUNGS.map((r) => r.ratioToLnRate);
const RATIO_N3_VALS = RUNGS.map((r) => r.ratioToPureN3);
const SADDLE_RATIO_VALS = RUNGS.map((r) => r.saddleDnRatio);

const fitBiasDecays = strictlyDecreasing(FIT_BIAS_VALS);           // |p_fit-2| -> 0
const observableLawHolds = LAW_ERR_MAX < 1e-8;                    // |p_fit-2| = |D_n| covVar
const lnRatioDrifts = strictlyIncreasing(RATIO_LN_VALS);         // NOT a constant -- climbs
const n3RatioDriftsMore =
  strictlyIncreasing(RATIO_N3_VALS) &&
  RATIO_N3_VALS[RATIO_N3_VALS.length - 1] / RATIO_N3_VALS[0] >
    RATIO_LN_VALS[RATIO_LN_VALS.length - 1] / RATIO_LN_VALS[0];   // pure n^-3 drifts MORE (log factor real)
const saddleRatioConvergesToOne =
  strictlyDecreasing(SADDLE_RATIO_VALS) &&
  SADDLE_RATIO_VALS[SADDLE_RATIO_VALS.length - 1] > 1 &&
  SADDLE_RATIO_VALS[SADDLE_RATIO_VALS.length - 1] < 1.15;         // |D_n|/|D_n^saddle| -> 1 from above

// -- Classification ------------------------------------------------------------------
// The observable law + saddle faithfulness are CONFIRMED; the fully-simplified
// (ln n)^2/n^3 form is NOT yet reached at n<=18 (its ratio drifts). Named residual.
const OPEN_SUBGAP = 'sg-3670-lnn-saddle-not-asymptotic-at-n18';

const verdict =
  fitBiasDecays &&
  observableLawHolds &&
  lnRatioDrifts &&
  n3RatioDriftsMore &&
  saddleRatioConvergesToOne
    ? 'OBSERVABLE-|p_fit-2|=|D_n|-cov(a^2,ln-a)/var(ln-a)-CONFIRMED-DECAYING-n=3..18-(law-err<=2e-9);-NAIVE-(ln-n)^2/n^3-RATIO-DRIFTS-UP-~2.9x-(NOT-CONSTANT-AT-n<=18)-BUT-EXACT-LAPLACE-SADDLE-tau*(n)^2-IS-FAITHFUL:-|D_n|/|D_n^saddle|->1-(3.644->1.095);-SUB-GAP-sg-3670-lnn-saddle-not-asymptotic-at-n18'
    : 'INDETERMINATE';

export const IMP3670_FIT_BIAS_DECAY_RATE_VS_LNSQ = Object.freeze({
  id: 'imp-3670-fit-bias-decay-rate-vs-lnsq',
  ticket: 'imp-3670',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedRateDerivation: 'imp-3646-remainder-tail-moment-ratio-asymptotics.js',
  relatedWindowN78: 'imp-3648-fit-bias-a-window-sensitivity-n78.js',
  relatedWindowN910: 'imp-3667-fit-bias-a-window-sensitivity-n910.js',
  relatedDerivation: 'imp-3581-remainder-tail-exponent-derivation.js',
  openSubGap: OPEN_SUBGAP,

  summary:
    'MEASURES the observable fit-bias decay |p_fit-2| across n=3..18 (imp-3624/imp-3648 base a-window: aHi=0.5, ' +
    'ratio=0.5, K=9; covVar=0.0293884) on the SAME NM=1600 [0,T_A] Simpson moments (extended to M_26 for a four-term ' +
    'same-parity tail at every rung) against the imp-3646-derived slowly-varying rate (ln n)^2/n^3. Cross-checks: ' +
    'the n=7 base slope 1.999995360 reproduces the imp-3648 baked 1.9999953601 and the n=9 base slope 1.999996714 the ' +
    'imp-3667 baked 1.9999967140. THREE readings: (1) the OBSERVABLE law is CONFIRMED -- |p_fit-2| = |D_n| ' +
    'cov(a^2,ln a)/var(ln a) to <= ~2e-9 at every rung, and |p_fit-2| decays monotonically 1.1575e-5 (n=3) -> ' +
    '1.0786e-6 (n=18), so the closed C_n/D_n laws DO propagate to the measured fit-bias; (2) the NAIVE (ln n)^2/n^3 ' +
    'ratio DRIFTS -- |p_fit-2|/((ln n)^2/n^3) is strictly increasing 2.59e-4 -> 7.53e-4 (~2.9x, still climbing at ' +
    'n=18), so the fully-simplified asymptotic form is NOT reached at n<=18; (3) the drift is the crude tau*(n)~(ln n)/4 ' +
    'substitution, NOT an unmodeled term -- the actual Laplace saddle is faithful: |D_n|/|D_n^saddle| falls ' +
    'monotonically to 1 from above (3.644 -> 1.095), mirroring imp-3646 Q_n/tau*^2 -> 1, while pure 1/n^3 drifts ~20x ' +
    '(confirming a real log-growing prefactor). Named residual sg-3670-lnn-saddle-not-asymptotic-at-n18: the (ln n)/4 ' +
    'substitution is pre-asymptotic through n=18. MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; operator ' +
    'positivity (imp-3066) untouched; no RH verdict, no QED.',

  method: Object.freeze({
    observable: 'p_fit = least-squares log-log slope of the relative residual r_n(a) over the base geometric a-window',
    baseWindow: BASE_WINDOW,
    covVarFactor: COV_VAR,                       // fixed across n (single window)
    derivedRate: '(ln n)^2 / n^3 (imp-3646, from D_n = C_(n+2)-C_n with C_n ~ (ln n)^2/(16 n^2))',
    saddleEquation: 'tau*(n) solves n = 4 pi tau* e^{4 tau*}; D_n^saddle uses Q_n ~ tau*(n)^2 (imp-3646)',
    nextOrderCoeffClosed: 'D_n = M_(n+4)/((n+3)(n+4)M_(n+2)) - M_(n+2)/((n+1)(n+2)M_n)',
    rungsTested: RUNGS.map((r) => r.n),
    momentsExtendedTo: MMAX,
    momentsReused: 'SAME NM=1600 [0,T_A] Simpson grid as imp-3646/imp-3648; four-term same-parity tail per rung',
    selfComputing: true,
  }),

  measured: Object.freeze({
    rungs: RUNGS,                                // per-n {pFit, fitBias, lawPrediction, ratioToLnRate, saddleDnRatio, ...}
    fitBiasFirst: RUNGS[0].fitBias,              // n=3  ~1.1575e-5
    fitBiasLast: RUNGS[RUNGS.length - 1].fitBias,// n=18 ~1.0786e-6
    lawErrMax: LAW_ERR_MAX,                      // ~2e-9 -- |p_fit-2| = |D_n| covVar
    ratioToLnRateFirst: RUNGS[0].ratioToLnRate,  // ~2.59e-4
    ratioToLnRateLast: RUNGS[RUNGS.length - 1].ratioToLnRate, // ~7.53e-4 (drifted up ~2.9x)
    saddleDnRatioFirst: RUNGS[0].saddleDnRatio,  // ~3.644
    saddleDnRatioLast: RUNGS[RUNGS.length - 1].saddleDnRatio, // ~1.095 (-> 1 from above)
    fitBiasDecays,
    observableLawHolds,
    lnRatioDrifts,
    n3RatioDriftsMore,
    saddleRatioConvergesToOne,
    verdict,
  }),

  interpretation: Object.freeze({
    lawPropagatesToObservable:
      'The closed C_n/D_n coefficient laws propagate EXACTLY to the observable: |p_fit-2| equals |D_n| ' +
      'cov(a^2,ln a)/var(ln a) to <= ~2e-9 at every rung n=3..18, and |p_fit-2| decays monotonically (1.1575e-5 -> ' +
      '1.0786e-6). So the fit-bias observable inherits the derived decay -- it goes to zero.',
    naiveLnRateNotReached:
      'Dividing the observable by the naive (ln n)^2/n^3 rate does NOT give a constant at n<=18: |p_fit-2|/((ln n)^2/' +
      'n^3) is strictly increasing (2.59e-4 -> 7.53e-4, ~2.9x, still climbing). The fully-simplified asymptotic form ' +
      'is not yet reached -- so the ratio drifts, but this is a finite-n pre-asymptotic effect, not a missing term.',
    driftIsTheSaddleApproximation:
      'The drift is the crudeness of the tau*(n) ~ (ln n)/4 substitution behind (ln n)^2/n^3. Using the ACTUAL Laplace ' +
      'saddle tau*(n)^2 is faithful: |D_n|/|D_n^saddle| falls monotonically to 1 from above (3.644 at n=3 -> 1.095 at ' +
      'n=18), exactly as imp-3646 measured Q_n/tau*^2 -> 1. Pure 1/n^3 (no log) drifts ~20x more, confirming the ' +
      'log-growing prefactor is real. Named residual sg-3670-lnn-saddle-not-asymptotic-at-n18.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Measures the observable decay of a fixed-weight Taylor-remainder decay-ORDER read-out (|p_fit-2|) against a ' +
      'derived slowly-varying rate. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    openSubGap: OPEN_SUBGAP,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP3670_FIT_BIAS_DECAY_RATE_VS_LNSQ_ASSERTIONS = [
  {
    id: 'imp3670-observable-equals-Dn-covVar',
    why: 'THE KEY PROPAGATION: the observable |p_fit-2| equals |D_n| cov(a^2,ln a)/var(ln a) to < 1e-8 (measured max ' +
         '~2e-9) at every rung n=3..18, so the closed C_n/D_n laws reach the measured fit-bias.',
    holds: () => observableLawHolds,
  },
  {
    id: 'imp3670-fit-bias-decays-monotonically',
    why: 'The observable |p_fit-2| is STRICTLY DECREASING over n=3..18 (1.1575e-5 -> 1.0786e-6), so it inherits the ' +
         'derived decay to zero.',
    holds: () => fitBiasDecays,
  },
  {
    id: 'imp3670-naive-lnn-ratio-drifts-not-constant',
    why: 'THE CENTRAL MEASUREMENT: |p_fit-2|/((ln n)^2/n^3) is STRICTLY INCREASING (2.59e-4 -> 7.53e-4, ~2.9x), so the ' +
         'fully-simplified (ln n)^2/n^3 rate is NOT reached at n<=18 -- the ratio drifts, it does not tend to a constant.',
    holds: () => lnRatioDrifts,
  },
  {
    id: 'imp3670-pure-n3-drifts-more-log-prefactor-real',
    why: 'Pure 1/n^3 (no log) drifts MORE than (ln n)^2/n^3 across n=3..18, confirming a genuine slowly-GROWING log ' +
         'prefactor rather than a pure power law.',
    holds: () => n3RatioDriftsMore,
  },
  {
    id: 'imp3670-exact-saddle-is-faithful',
    why: 'Replacing the crude tau*(n)~(ln n)/4 by the ACTUAL Laplace saddle tau*(n)^2 is faithful: |D_n|/|D_n^saddle| ' +
         'falls monotonically to 1 from above (3.644 -> 1.095), so the drift is the saddle approximation, not a ' +
         'missing physical term.',
    holds: () => saddleRatioConvergesToOne,
  },
  {
    id: 'imp3670-next-order-coeff-negative-all-rungs',
    why: 'D_n < 0 at every rung n=3..18 (C_n strictly decreasing), the sign that reads the fitted slope below 2.',
    holds: () => RUNGS.every((r) => r.nextOrderCoeff < 0),
  },
  {
    id: 'imp3670-cross-check-imp3648-n7-base-slope',
    why: 'Cross-check vs the certified ladder: the n=7 base-window slope must reproduce the imp-3648 baked 1.9999953601.',
    holds: () => Math.abs(RUNGS.find((r) => r.n === 7).pFit - 1.9999953601) < 1e-8,
  },
  {
    id: 'imp3670-cross-check-imp3667-n9-base-slope',
    why: 'Cross-check vs the certified ladder: the n=9 base-window slope must reproduce the imp-3667 baked 1.9999967140.',
    holds: () => Math.abs(RUNGS.find((r) => r.n === 9).pFit - 1.9999967140) < 1e-8,
  },
  {
    id: 'imp3670-verdict-not-indeterminate',
    why: 'The classified verdict must record the confirmed observable law, the drifting naive rate, and the faithful ' +
         'saddle (with the named sub-gap), not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp3670-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement only, mass-feasibility necessary-but-not-sufficient, operator positivity ' +
         '(imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3670_FIT_BIAS_DECAY_RATE_VS_LNSQ.honestCaveat;
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

for (const assertion of IMP3670_FIT_BIAS_DECAY_RATE_VS_LNSQ_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3670-fit-bias-decay-rate-vs-lnsq assertion failed: ${assertion.id}`);
  }
}

export default IMP3670_FIT_BIAS_DECAY_RATE_VS_LNSQ;
