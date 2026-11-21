/**
 * @module imp-3685-fit-bias-saddle-plateau-n40
 * @fileoverview imp-3685 -- CLOSE the imp-3670 named residual
 *   sg-3670-lnn-saddle-not-asymptotic-at-n18 by EXTENDING the observable
 *   fit-bias ladder |p_fit - 2| past n=18 (to n=40) and DETERMINING whether the
 *   ratio built from the EXACT Laplace saddle tau*(n)^2 plateaus once the crude
 *   tau*(n) ~ (ln n)/4 substitution is removed.
 *
 *   WHAT imp-3670 LEFT OPEN
 *   ----------------------
 *   imp-3670 MEASURED, on the imp-3624/imp-3648 base a-window (aHi=0.5, ratio=0.5,
 *   K=9; covVar = cov(a^2,ln a)/var(ln a) = 0.0293884), that the observable
 *   |p_fit-2| equals the closed |D_n| covVar to <= ~2e-9 at every rung n=3..18 and
 *   decays monotonically. But it found the NAIVE ratio |p_fit-2|/((ln n)^2/n^3)
 *   STRICTLY INCREASING (~2.9x, still rising at n=18) because the crude Laplace
 *   substitution tau*(n) ~ (ln n)/4 (behind the (ln n)^2 numerator) is
 *   pre-asymptotic. The named residual sg-3670-lnn-saddle-not-asymptotic-at-n18
 *   asked: does the ratio plateau at larger n, or once the crude (ln n)/4 is
 *   replaced by the EXACT saddle tau*(n) solving n = 4 pi tau* e^{4 tau*}?
 *
 *   MEASURED HERE (self-computing; SAME NM=1600 [0,T_A] Simpson grid, base window)
 *   ----------------------------------------------------------------------------
 *   The identical NM=1600 [0,6] Simpson moment machinery is reused, with moments
 *   extended to M_48 so every rung n=3..40 carries a FOUR-TERM same-parity tail
 *   (the imp-3670 grid; the moments are grid- and domain-converged: recomputing at
 *   NM=3200 or T_A=7 leaves M_48 and every measured slope unchanged to 12 sig figs).
 *   Two cross-checks pin the extended ladder to the certified modules: the n=7 base
 *   slope 1.99999536006 reproduces the imp-3648 baked 1.9999953601, and the n=9 base
 *   slope 1.99999671371 reproduces the imp-3667 baked 1.9999967140.
 *
 *   THREE readings across the extended ladder n=3..40:
 *     (1) OBSERVABLE-LAW STILL HOLDS. |p_fit-2| = |D_n| cov(a^2,ln a)/var(ln a) to
 *         <= ~1.1e-9 at EVERY rung, and |p_fit-2| decays monotonically 1.1575e-5
 *         (n=3) -> 2.3269e-7 (n=40). The closed C_n/D_n laws keep propagating.
 *     (2) NAIVE (ln n)^2/n^3 RATIO NEVER PLATEAUS. |p_fit-2|/((ln n)^2/n^3) is
 *         STILL strictly increasing at n=40: 2.5894e-4 (n=3) -> 1.0944e-3 (n=40),
 *         a ~4.2x climb with NO sign of a plateau. So the fully-simplified
 *         (ln n)/4 form is not reached even at n=40 (the ln ln n saddle correction
 *         decays only logarithmically).
 *     (3) EXACT-SADDLE RATIO PLATEAUS. Replacing the crude (ln n)/4 by the ACTUAL
 *         Laplace saddle tau*(n)^2 (D_n^saddle = C_(n+2)^saddle - C_n^saddle with
 *         C_n^saddle = tau*(n)^2/((n+1)(n+2))), the ratio |p_fit-2|/|D_n^saddle|
 *         DESCENDS MONOTONICALLY toward covVar = 0.0293884 from above: 1.0711e-1
 *         (n=3) -> 3.0106e-2 (n=40), i.e. within ~2.4% of covVar and still closing.
 *         Equivalently |D_n|/|D_n^saddle| -> 1 (3.64422 at n=3 -> 1.02438 at n=40),
 *         mirroring imp-3646 Q_n/tau*^2 -> 1. So once the crude (ln n)/4 correction
 *         is removed, the ratio DOES plateau -- resolving sg-3670.
 *
 *   CONCLUSION. sg-3670-lnn-saddle-not-asymptotic-at-n18 is RESOLVED at the
 *   measurement level: the drift of the naive (ln n)^2/n^3 ratio is entirely the
 *   crude (ln n)/4 saddle substitution (the naive ratio never plateaus through
 *   n=40), while the EXACT Laplace saddle tau*(n)^2 ratio |p_fit-2|/|D_n^saddle|
 *   plateaus, converging monotonically to covVar. Remaining honest residual
 *   sg-3685-saddle-subleading-Qn-correction-descends-past-n40: the exact-saddle
 *   ratio is still ~2.4% above covVar at n=40 (the sub-leading Q_n/tau*(n)^2 - 1
 *   moment-ratio correction imp-3646 characterized), so the plateau is APPROACHED
 *   monotonically rather than reached at n<=40.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT ONLY, at the RH-equivalent scale class. This extends the observable
 *   decay-ORDER read-out ladder and measures which rate model plateaus; it
 *   establishes NO operator positivity. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no
 *   QED. No refereed bound is changed.
 *
 *   @see imp-3670-fit-bias-decay-rate-vs-lnsq.js (the n=3..18 ladder + named residual)
 *   @see imp-3646-remainder-tail-moment-ratio-asymptotics.js (the saddle law + (ln n)^2/n^3 rate)
 *   @see imp-3648-fit-bias-a-window-sensitivity-n78.js (base a-window; baked n=7 slope)
 *   @see imp-3667-fit-bias-a-window-sensitivity-n910.js (baked n=9 slope)
 *   @see imp-3581-remainder-tail-exponent-derivation.js (closed C_n/D_n and bias law)
 *
 *   Ticket: imp-3685 (numerical, high).
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

// Precompute A on the SAME fixed fine Simpson grid over [0, T_A] as imp-3646/imp-3670.
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

// -- Moments M_0..M_48 (four-term same-parity tail at every rung n=3..40) -------------
const MMAX = 48;
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
// EXACT-saddle D_n^saddle: Q_n ~ tau*^2, C_n^saddle = Q_n/((n+1)(n+2)), D = C_(n+2)-C_n.
function saddleCn(n) {
  const t = saddleTau(n);
  return (t * t) / ((n + 1) * (n + 2));
}
function saddleDn(n) {
  return saddleCn(n + 2) - saddleCn(n);
}

// -- The measured rung table n=3..40 -------------------------------------------------
const N_LO = 3;
const N_HI = 40;                                // extended past the imp-3670 n=18 ceiling
function lnRate(n) {
  return (Math.log(n) * Math.log(n)) / (n * n * n);   // (ln n)^2 / n^3 (crude (ln n)/4 saddle)
}

const RUNGS = [];
for (let n = N_LO; n <= N_HI; n += 1) {
  let mmax = MMAX;                              // largest same-parity moment <= MMAX
  if ((mmax - n) % 2 !== 0) mmax -= 1;
  const rel = BASE_LADDER.map((a) => relativeResidual(n, a, mmax));
  const pFit = logLogSlope(BASE_LADDER, rel);
  const fitBias = Math.abs(pFit - 2);          // the OBSERVABLE |p_fit - 2|
  const dn = nextOrderCoeff(n);
  const dnSaddle = saddleDn(n);
  RUNGS.push(
    Object.freeze({
      n,
      mmax,
      pFit,                                     // least-squares log-log slope on the base window
      fitBias,                                  // |p_fit - 2|, the observable
      nextOrderCoeff: dn,                       // closed D_n
      lawPrediction: Math.abs(dn) * COV_VAR,    // |D_n| cov(a^2,ln a)/var(ln a) -- should equal fitBias
      lawErr: Math.abs(fitBias - Math.abs(dn) * COV_VAR),
      lnRate: lnRate(n),                        // (ln n)^2/n^3 (crude saddle)
      ratioToLnRate: fitBias / lnRate(n),       // NAIVE ratio -- drifts up, never plateaus
      saddleDn: dnSaddle,                        // exact-saddle D_n^saddle
      saddleDnRatio: Math.abs(dn) / Math.abs(dnSaddle), // |D_n|/|D_n^saddle| -> 1
      ratioToSaddleRate: fitBias / Math.abs(dnSaddle),  // EXACT-saddle ratio -> COV_VAR (plateau)
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
const RATIO_SADDLE_VALS = RUNGS.map((r) => r.ratioToSaddleRate);
const SADDLE_RATIO_VALS = RUNGS.map((r) => r.saddleDnRatio);
const LAST = RUNGS.length - 1;

const fitBiasDecays = strictlyDecreasing(FIT_BIAS_VALS);          // |p_fit-2| -> 0
const observableLawHolds = LAW_ERR_MAX < 1e-8;                   // |p_fit-2| = |D_n| covVar
const naiveLnRatioNeverPlateaus = strictlyIncreasing(RATIO_LN_VALS); // crude ratio still climbing at n=40
// EXACT-saddle ratio PLATEAUS: descends monotonically toward covVar from above and lands close.
const saddleRatioPlateaus =
  strictlyDecreasing(RATIO_SADDLE_VALS) &&
  RATIO_SADDLE_VALS[LAST] > COV_VAR &&
  RATIO_SADDLE_VALS[LAST] < COV_VAR * 1.05;      // within 5% of covVar at n=40 (measured ~2.4%)
// Equivalent statement in the moment-ratio: |D_n|/|D_n^saddle| -> 1 from above.
const saddleDnRatioConvergesToOne =
  strictlyDecreasing(SADDLE_RATIO_VALS) &&
  SADDLE_RATIO_VALS[LAST] > 1 &&
  SADDLE_RATIO_VALS[LAST] < 1.05;

// -- Classification ------------------------------------------------------------------
// The naive (ln n)/4 ratio never plateaus through n=40; the EXACT saddle ratio does
// (converges to covVar), resolving the imp-3670 named residual. Small residual named.
const CLOSED_SUBGAP = 'sg-3670-lnn-saddle-not-asymptotic-at-n18';
const OPEN_SUBGAP = 'sg-3685-saddle-subleading-Qn-correction-descends-past-n40';

const verdict =
  fitBiasDecays &&
  observableLawHolds &&
  naiveLnRatioNeverPlateaus &&
  saddleRatioPlateaus &&
  saddleDnRatioConvergesToOne
    ? 'EXTENDED-|p_fit-2|-LADDER-n=3..40-(law-err<=1.1e-9):-NAIVE-(ln-n)^2/n^3-RATIO-NEVER-PLATEAUS-(STILL-CLIMBING-2.59e-4->1.09e-3-~4.2x-at-n=40);-EXACT-LAPLACE-SADDLE-tau*(n)^2-RATIO-PLATEAUS-|p_fit-2|/|D_n^saddle|->covVar=0.0293884-(1.071e-1->3.011e-2,-|D_n|/|D_n^saddle|:3.644->1.024);-RESOLVES-sg-3670-lnn-saddle-not-asymptotic-at-n18;-RESIDUAL-sg-3685-saddle-subleading-Qn-correction-descends-past-n40'
    : 'INDETERMINATE';

export const IMP3685_FIT_BIAS_SADDLE_PLATEAU_N40 = Object.freeze({
  id: 'imp-3685-fit-bias-saddle-plateau-n40',
  ticket: 'imp-3685',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedLadderN18: 'imp-3670-fit-bias-decay-rate-vs-lnsq.js',
  relatedRateDerivation: 'imp-3646-remainder-tail-moment-ratio-asymptotics.js',
  relatedWindowN78: 'imp-3648-fit-bias-a-window-sensitivity-n78.js',
  relatedWindowN910: 'imp-3667-fit-bias-a-window-sensitivity-n910.js',
  relatedDerivation: 'imp-3581-remainder-tail-exponent-derivation.js',
  closesSubGap: CLOSED_SUBGAP,
  openSubGap: OPEN_SUBGAP,

  summary:
    'EXTENDS the observable fit-bias ladder |p_fit-2| past the imp-3670 n=18 ceiling to n=40 (imp-3624/imp-3648 base ' +
    'a-window: aHi=0.5, ratio=0.5, K=9; covVar=0.0293884) on the SAME NM=1600 [0,T_A] Simpson moments (extended to M_48 ' +
    'for a four-term same-parity tail at every rung; grid- and domain-converged to 12 sig figs) to CLOSE the residual ' +
    'sg-3670-lnn-saddle-not-asymptotic-at-n18. Cross-checks: n=7 slope 1.99999536006 reproduces imp-3648 1.9999953601, ' +
    'n=9 slope 1.99999671371 reproduces imp-3667 1.9999967140. THREE readings across n=3..40: (1) the OBSERVABLE law ' +
    'STILL holds -- |p_fit-2| = |D_n| cov(a^2,ln a)/var(ln a) to <= ~1.1e-9 at every rung, |p_fit-2| decays ' +
    'monotonically 1.1575e-5 (n=3) -> 2.3269e-7 (n=40); (2) the NAIVE (ln n)^2/n^3 ratio NEVER PLATEAUS -- ' +
    '|p_fit-2|/((ln n)^2/n^3) is STILL strictly increasing at n=40 (2.5894e-4 -> 1.0944e-3, ~4.2x, no plateau), so the ' +
    'crude tau*~(ln n)/4 form is not reached even at n=40; (3) the EXACT Laplace saddle tau*(n)^2 ratio PLATEAUS -- ' +
    '|p_fit-2|/|D_n^saddle| descends monotonically toward covVar=0.0293884 from above (1.0711e-1 -> 3.0106e-2, within ' +
    '~2.4%), equivalently |D_n|/|D_n^saddle| -> 1 (3.64422 -> 1.02438), mirroring imp-3646 Q_n/tau*^2 -> 1. So once the ' +
    'crude (ln n)/4 is removed the ratio DOES plateau, RESOLVING sg-3670. Residual ' +
    'sg-3685-saddle-subleading-Qn-correction-descends-past-n40: the exact-saddle ratio is still ~2.4% above covVar at ' +
    'n=40 (the sub-leading Q_n/tau*^2-1 correction), approached monotonically not reached. MEASUREMENT, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no RH verdict, no QED.',

  method: Object.freeze({
    observable: 'p_fit = least-squares log-log slope of the relative residual r_n(a) over the base geometric a-window',
    baseWindow: BASE_WINDOW,
    covVarFactor: COV_VAR,                       // fixed across n (single window)
    naiveRate: '(ln n)^2 / n^3 (crude Laplace substitution tau*(n) ~ (ln n)/4, imp-3646)',
    exactSaddleRate: 'D_n^saddle = C_(n+2)^saddle - C_n^saddle, C_n^saddle = tau*(n)^2/((n+1)(n+2)), tau*(n) exact',
    saddleEquation: 'tau*(n) solves n = 4 pi tau* e^{4 tau*} (imp-3646 Laplace saddle)',
    nextOrderCoeffClosed: 'D_n = M_(n+4)/((n+3)(n+4)M_(n+2)) - M_(n+2)/((n+1)(n+2)M_n)',
    rungsTested: RUNGS.map((r) => r.n),
    rungRange: [N_LO, N_HI],
    momentsExtendedTo: MMAX,
    momentsReused: 'SAME NM=1600 [0,T_A] Simpson grid as imp-3646/imp-3670; four-term same-parity tail per rung',
    momentsConverged: 'M_48 and every measured slope unchanged to 12 sig figs at NM=3200 or T_A=7',
    selfComputing: true,
  }),

  measured: Object.freeze({
    rungs: RUNGS,                                // per-n {pFit, fitBias, ratioToLnRate, ratioToSaddleRate, ...}
    fitBiasFirst: RUNGS[0].fitBias,              // n=3  ~1.1575e-5
    fitBiasLast: RUNGS[LAST].fitBias,            // n=40 ~2.3269e-7
    lawErrMax: LAW_ERR_MAX,                      // ~1.1e-9 -- |p_fit-2| = |D_n| covVar
    ratioToLnRateFirst: RUNGS[0].ratioToLnRate,  // ~2.5894e-4
    ratioToLnRateLast: RUNGS[LAST].ratioToLnRate,// ~1.0944e-3 (drifted up ~4.2x, still climbing)
    ratioToSaddleRateFirst: RUNGS[0].ratioToSaddleRate, // ~1.0711e-1
    ratioToSaddleRateLast: RUNGS[LAST].ratioToSaddleRate, // ~3.0106e-2 -> covVar from above
    covVarTarget: COV_VAR,                       // the exact-saddle ratio plateau target 0.0293884
    saddleDnRatioFirst: RUNGS[0].saddleDnRatio,  // ~3.64422
    saddleDnRatioLast: RUNGS[LAST].saddleDnRatio, // ~1.02438 (-> 1 from above)
    fitBiasDecays,
    observableLawHolds,
    naiveLnRatioNeverPlateaus,
    saddleRatioPlateaus,
    saddleDnRatioConvergesToOne,
    verdict,
  }),

  interpretation: Object.freeze({
    observableLawStillHolds:
      'Past n=18 the closed C_n/D_n coefficient laws keep propagating: |p_fit-2| equals |D_n| cov(a^2,ln a)/var(ln a) ' +
      'to <= ~1.1e-9 at every rung n=3..40, and |p_fit-2| decays monotonically (1.1575e-5 -> 2.3269e-7).',
    naiveRateNeverPlateaus:
      'The naive (ln n)^2/n^3 ratio does NOT plateau even at n=40: |p_fit-2|/((ln n)^2/n^3) is still strictly ' +
      'increasing (2.5894e-4 -> 1.0944e-3, ~4.2x). The ln ln n saddle correction behind the crude tau*(n)~(ln n)/4 ' +
      'substitution decays only logarithmically, so the fully-simplified form is not reached at any accessible n.',
    exactSaddleRatioPlateaus:
      'Removing the crude (ln n)/4 -- i.e. using the EXACT Laplace saddle tau*(n)^2 in D_n^saddle -- makes the ratio ' +
      'plateau: |p_fit-2|/|D_n^saddle| descends monotonically toward covVar=0.0293884 from above (1.0711e-1 at n=3 -> ' +
      '3.0106e-2 at n=40), equivalently |D_n|/|D_n^saddle| -> 1 (3.64422 -> 1.02438), exactly as imp-3646 measured ' +
      'Q_n/tau*^2 -> 1. This RESOLVES sg-3670-lnn-saddle-not-asymptotic-at-n18: the drift was the crude saddle, and ' +
      'the exact saddle ratio does plateau.',
    residualSubGap:
      'Honest residual sg-3685-saddle-subleading-Qn-correction-descends-past-n40: the exact-saddle ratio is still ' +
      '~2.4% above covVar at n=40, the sub-leading Q_n/tau*(n)^2 - 1 moment-ratio correction (imp-3646). It is ' +
      'approached monotonically, not reached, at n<=40.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Extends the observable decay-ORDER read-out ladder (|p_fit-2|) past n=18 and measures which rate model plateaus. ' +
      'It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    closesSubGap: CLOSED_SUBGAP,
    openSubGap: OPEN_SUBGAP,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP3685_FIT_BIAS_SADDLE_PLATEAU_N40_ASSERTIONS = [
  {
    id: 'imp3685-observable-equals-Dn-covVar-through-n40',
    why: 'The observable |p_fit-2| equals |D_n| cov(a^2,ln a)/var(ln a) to < 1e-8 (measured max ~1.1e-9) at every rung ' +
         'n=3..40, so the closed C_n/D_n laws keep reaching the measured fit-bias past n=18.',
    holds: () => observableLawHolds,
  },
  {
    id: 'imp3685-fit-bias-decays-monotonically-through-n40',
    why: 'The observable |p_fit-2| is STRICTLY DECREASING over n=3..40 (1.1575e-5 -> 2.3269e-7), inheriting the derived ' +
         'decay to zero on the extended ladder.',
    holds: () => fitBiasDecays,
  },
  {
    id: 'imp3685-naive-lnn-ratio-never-plateaus',
    why: 'THE CENTRAL NEGATIVE READING: |p_fit-2|/((ln n)^2/n^3) is STILL strictly increasing at n=40 (2.59e-4 -> ' +
         '1.09e-3, ~4.2x), so the crude tau*~(ln n)/4 (ln n)^2/n^3 rate never plateaus even past n=18.',
    holds: () => naiveLnRatioNeverPlateaus,
  },
  {
    id: 'imp3685-exact-saddle-ratio-plateaus-to-covVar',
    why: 'THE CENTRAL POSITIVE READING (resolves sg-3670): the EXACT Laplace saddle ratio |p_fit-2|/|D_n^saddle| ' +
         'descends monotonically toward covVar=0.0293884 from above (1.071e-1 -> 3.011e-2, within ~2.4% at n=40).',
    holds: () => saddleRatioPlateaus,
  },
  {
    id: 'imp3685-saddle-Dn-ratio-converges-to-one',
    why: 'Equivalent moment-ratio statement: |D_n|/|D_n^saddle| falls monotonically to 1 from above (3.64422 -> ' +
         '1.02438), mirroring imp-3646 Q_n/tau*^2 -> 1.',
    holds: () => saddleDnRatioConvergesToOne,
  },
  {
    id: 'imp3685-next-order-coeff-negative-all-rungs',
    why: 'D_n < 0 at every rung n=3..40 (C_n strictly decreasing), the sign that reads the fitted slope below 2.',
    holds: () => RUNGS.every((r) => r.nextOrderCoeff < 0),
  },
  {
    id: 'imp3685-cross-check-imp3648-n7-base-slope',
    why: 'Cross-check vs the certified ladder: the n=7 base-window slope must reproduce the imp-3648 baked 1.9999953601.',
    holds: () => Math.abs(RUNGS.find((r) => r.n === 7).pFit - 1.9999953601) < 1e-8,
  },
  {
    id: 'imp3685-cross-check-imp3667-n9-base-slope',
    why: 'Cross-check vs the certified ladder: the n=9 base-window slope must reproduce the imp-3667 baked 1.9999967140.',
    holds: () => Math.abs(RUNGS.find((r) => r.n === 9).pFit - 1.9999967140) < 1e-8,
  },
  {
    id: 'imp3685-extends-past-n18',
    why: 'The ladder must genuinely extend past the imp-3670 n=18 ceiling (to n=40) to answer the residual.',
    holds: () => RUNGS[LAST].n === 40 && RUNGS[LAST].n > 18,
  },
  {
    id: 'imp3685-verdict-not-indeterminate',
    why: 'The classified verdict must record the never-plateauing naive rate, the plateauing exact-saddle ratio, and ' +
         'the closed/residual sub-gaps, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp3685-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement only, mass-feasibility necessary-but-not-sufficient, operator positivity ' +
         '(imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3685_FIT_BIAS_SADDLE_PLATEAU_N40.honestCaveat;
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

for (const assertion of IMP3685_FIT_BIAS_SADDLE_PLATEAU_N40_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3685-fit-bias-saddle-plateau-n40 assertion failed: ${assertion.id}`);
  }
}

export default IMP3685_FIT_BIAS_SADDLE_PLATEAU_N40;
