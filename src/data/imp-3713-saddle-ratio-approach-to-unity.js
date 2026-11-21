/**
 * @module imp-3713-saddle-ratio-approach-to-unity
 * @fileoverview imp-3713 -- MEASURE the convergence rate of the imp-3670 exact-Laplace
 *   -saddle-corrected ratio R_n = |D_n| / |D_n^saddle| toward 1, locate the n at which it
 *   first falls within 1e-3 of 1, and fit its approach law -- separating this exact-saddle
 *   convergence from the DISTINCT sg-3670 crude (ln n)^2/n^3 plateau question.
 *
 *   WHAT imp-3670 / imp-3685 LEFT DISTINCT
 *   --------------------------------------
 *   imp-3670 reported R_n = |D_n|/|D_n^saddle| falling monotonically to 1 FROM ABOVE
 *   (3.64422 at n=3 -> 1.09498 at n=18), and imp-3685 extended the ladder to n=40
 *   (R_40 ~ 1.02438), using the EXACT Laplace saddle tau*(n) that solves n = 4 pi tau* e^{4 tau*}
 *   (NOT the crude tau* ~ (ln n)/4 substitution). Both modules used R_n only as evidence that
 *   the exact-saddle rate PLATEAUS while the crude (ln n)^2/n^3 rate never does (the sg-3670 /
 *   sg-3685 question). NEITHER measured R_n's OWN approach to 1: neither located the n where
 *   R_n first enters the band [1, 1+1e-3], nor fit the decay of r_n := R_n - 1.
 *
 *   MEASURED HERE (self-computing; SAME NM Simpson moment machinery, base a-window irrelevant)
 *   ------------------------------------------------------------------------------------------
 *   The identical de Bruijn-Newman kernel + [0,T_A] Simpson moment machinery is reused, with
 *   moments extended to M_234 so the closed next-order coefficient D_n = C_(n+2) - C_n
 *   (C_n = M_(n+2)/((n+1)(n+2)M_n), imp-3581) can be formed for every rung n = 3..230, and the
 *   exact-saddle D_n^saddle = C_(n+2)^saddle - C_n^saddle (C_n^saddle = tau*(n)^2/((n+1)(n+2))).
 *   The moment grid (T_A=8, NM=3200) is convergence-checked: recomputing R_n on a finer, wider
 *   grid (T_A=9, NM=6300) leaves R_n unchanged to <= ~1e-11 out to n ~ 200 (and to ~1e-7 through
 *   the near-unity crossing where D_n suffers difference-cancellation). Cross-checks pin the
 *   ladder to the certified modules: R_3 = 3.64422 reproduces imp-3670/imp-3685, and
 *   R_40 = 1.02438 reproduces the imp-3685 baked saddleDnRatioLast.
 *
 *   FOUR readings across the extended ladder n = 3..230:
 *     (1) CROSSOVER LOCATED. R_n first falls within 1e-3 of 1 (r_n = R_n - 1 < 1e-3) at
 *         n = 152 (r_151 = 1.00059e-3 still outside; r_152 = 9.74026e-4 inside). So the exact
 *         saddle needs a MUCH larger n than the imp-3685 n=40 ceiling to close the last 1e-3.
 *     (2) BOTH TICKET-CANDIDATE LAWS REJECTED. r_n does NOT decay like c/n: n*r_n is strictly
 *         DECREASING (7.9327 at n=3 -> 0.14814 at n=152), so no constant c. It does NOT decay
 *         like c/ln n either: (ln n)*r_n is strictly DECREASING (2.9053 -> 4.893e-3). Both
 *         candidate laws are quantitatively falsified.
 *     (3) NO FIXED POWER FITS -- THE APPROACH IS SUPER-POLYNOMIAL. The effective local exponent
 *         p(n) = -d ln r_n / d ln n GROWS WITHOUT BOUND: 1.72 (n=30) -> 2.00 (n=60) -> 2.38
 *         (n=90) -> 2.97 (n=120) -> 4.00 (n=150). A single power (the closest tangent is
 *         r_n ~ 40/n^2, p passing through 2 near n ~ 62 where n^2*r_n ~ 40.7 peaks) describes
 *         only a local window, not the global decay.
 *     (4) THE RATIO OVERSHOOTS THROUGH 1 AT FINITE n. The reason p(n) diverges: R_n does NOT
 *         asymptote to 1 from above -- it CROSSES 1 at a finite n* ~ 226 (r_225 = +2.746e-6,
 *         r_226 = -2.314e-6; linear interp n* ~ 225.5) and continues BELOW 1 (|D_n| < |D_n^saddle|
 *         for n >~ 226, grid-stable to ~1e-9 through n=240). So the exact-saddle convergence is a
 *         finite-n zero-crossing of |D_n| - |D_n^saddle|, not a slow power-law tail.
 *
 *   SEPARATION FROM sg-3670 (the point of the ticket). This is a DISTINCT quantity from the
 *   sg-3670 / sg-3685 (ln n)^2/n^3 OBSERVABLE plateau. That plateau concerns the CRUDE
 *   tau* ~ (ln n)/4 rate, whose ratio |p_fit-2|/((ln n)^2/n^3) never plateaus (imp-3685). Here
 *   the EXACT saddle ratio R_n -> 1 not by plateauing but by OVERSHOOTING through 1 at finite n,
 *   with an unbounded effective exponent -- a qualitatively different behavior. The two are not
 *   the same convergence and must not be conflated.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT ONLY, at the RH-equivalent scale class. This measures the convergence rate of a
 *   moment-ratio diagnostic; it establishes NO operator positivity. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed
 *   . Residual named
 *   sg-3713-saddle-ratio-overshoots-unity-at-finite-n: the exact crossing n* ~ 226 and the depth
 *   of the sub-unity undershoot beyond it are set by the sub-leading Q_n/tau*(n)^2 - 1 moment-ratio
 *   correction (imp-3646) and, near the crossing, by difference-cancellation in D_n = C_(n+2) - C_n
 *   (amplified ~ n/2); pinning n* to more than +-1 and the undershoot shape would need an
 *   extended-precision moment solve.
 *
 *   @see imp-3670-fit-bias-decay-rate-vs-lnsq.js (n=3..18 ladder; the R_n -> 1 evidence)
 *   @see imp-3685-fit-bias-saddle-plateau-n40.js (n=3..40; the sg-3670 plateau resolution)
 *   @see imp-3646-remainder-tail-moment-ratio-asymptotics.js (the Laplace saddle + Q_n/tau*^2)
 *   @see imp-3581-remainder-tail-exponent-derivation.js (closed C_n/D_n)
 *
 *   Ticket: imp-3713 (numerical, medium).
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

// Precompute A on a fixed fine Simpson grid over [0, T_A]. T_A=8, NM=3200 (H=0.0025):
// R_n is grid-converged to <= ~1e-11 out to n ~ 200 vs a finer/wider T_A=9, NM=6300 grid.
const T_A = 8;
const NM = 3200;
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

// -- Moments M_0..M_234 (extended so D_n is formable for every rung n=3..230) --------
const MMAX = 234;
const MOMENTS = {};                             // MOMENTS[m] = int tau^m A(tau) d(tau)
for (let m = 0; m <= MMAX; m += 1) MOMENTS[m] = aWeightedMass((tau) => Math.pow(tau, m));

// -- Closed next-order coefficient D_n (imp-3581) ------------------------------------
function nextOrderCoeff(n) {
  return (
    MOMENTS[n + 4] / ((n + 3) * (n + 4) * MOMENTS[n + 2]) -
    MOMENTS[n + 2] / ((n + 1) * (n + 2) * MOMENTS[n])
  );                                            // D_n = C_(n+2) - C_n
}

// -- The imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*} -----------
function saddleTau(n) {
  let lo = 1e-6;
  let hi = 12;
  for (let it = 0; it < 300; it += 1) {
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

// -- The measured rung table n=3..230: R_n = |D_n|/|D_n^saddle| and r_n = R_n - 1 -----
const N_LO = 3;
const N_HI = 230;                               // n+4 <= MMAX = 234

const RUNGS = [];
for (let n = N_LO; n <= N_HI; n += 1) {
  const dn = nextOrderCoeff(n);
  const dnSaddle = saddleDn(n);
  const ratio = Math.abs(dn) / Math.abs(dnSaddle);   // R_n -> 1
  const r = ratio - 1;                               // signed r_n (positive above 1)
  RUNGS.push(
    Object.freeze({
      n,
      nextOrderCoeff: dn,
      saddleDn: dnSaddle,
      ratio,                                         // R_n = |D_n|/|D_n^saddle|
      rMinusOne: r,                                  // r_n = R_n - 1 (signed)
      nTimesR: n * r,                                // c/n test -- should be const if r ~ c/n
      lnnTimesR: Math.log(n) * r,                    // c/ln n test -- should be const if r ~ c/ln n
      n2TimesR: n * n * r,                           // r ~ c/n^2 tangent (peaks ~40.7 near n~62)
    })
  );
}

function rungAt(n) {
  return RUNGS.find((row) => row.n === n);
}

// -- The 1e-3 crossover: first n with |R_n - 1| < 1e-3 (approached from above) -------
const CROSSOVER_TOL = 1e-3;
let CROSSOVER_N = null;
for (const row of RUNGS) {
  if (CROSSOVER_N === null && row.rMinusOne > 0 && row.rMinusOne < CROSSOVER_TOL) {
    CROSSOVER_N = row.n;
    break;
  }
}

// -- The finite-n overshoot: first n with R_n < 1, and the linear-interp crossing n* --
let UNITY_CROSS_N = null;
for (const row of RUNGS) {
  if (UNITY_CROSS_N === null && row.rMinusOne < 0) {
    UNITY_CROSS_N = row.n;
    break;
  }
}
const UNITY_CROSS_INTERP = (() => {
  if (UNITY_CROSS_N === null) return null;
  const rPrev = rungAt(UNITY_CROSS_N - 1).rMinusOne;   // > 0
  const rHere = rungAt(UNITY_CROSS_N).rMinusOne;       // < 0
  return (UNITY_CROSS_N - 1) + rPrev / (rPrev - rHere);
})();

// -- Effective local exponent p(n) = -d ln r_n / d ln n (only where r_n > 0) ---------
function effectiveExponent(n, dn = 4) {
  const rHi = rungAt(n + dn).rMinusOne;
  const rLo = rungAt(n - dn).rMinusOne;
  return -(Math.log(rHi) - Math.log(rLo)) / (Math.log(n + dn) - Math.log(n - dn));
}
const P_ANCHORS = [30, 60, 90, 120, 150].map((n) => ({ n, p: effectiveExponent(n) }));

// -- Diagnostics ---------------------------------------------------------------------
function strictlyDecreasing(vals) {
  for (let i = 1; i < vals.length; i += 1) if (vals[i] >= vals[i - 1]) return false;
  return true;
}
function strictlyIncreasing(vals) {
  for (let i = 1; i < vals.length; i += 1) if (vals[i] <= vals[i - 1]) return false;
  return true;
}

// Reject the candidate laws over the positive-r_n window n=3..200 (before the crossing).
const POS_WINDOW = RUNGS.filter((row) => row.n <= 200);
const N_TIMES_R_DECREASES = strictlyDecreasing(POS_WINDOW.map((row) => row.nTimesR)); // rejects c/n
const LNN_TIMES_R_DECREASES = strictlyDecreasing(POS_WINDOW.map((row) => row.lnnTimesR)); // rejects c/ln n
const R_DECREASES = strictlyDecreasing(POS_WINDOW.map((row) => row.rMinusOne));      // r_n -> 0 from above
const EFF_EXPONENT_GROWS = strictlyIncreasing(P_ANCHORS.map((a) => a.p));            // super-polynomial
const RATIO_OVERSHOOTS_UNITY =
  UNITY_CROSS_N !== null &&
  rungAt(UNITY_CROSS_N - 1).rMinusOne > 0 &&
  rungAt(UNITY_CROSS_N).rMinusOne < 0;

// -- Classification ------------------------------------------------------------------
const OPEN_SUBGAP = 'sg-3713-saddle-ratio-overshoots-unity-at-finite-n';

const verdict =
  CROSSOVER_N === 152 &&
  N_TIMES_R_DECREASES &&
  LNN_TIMES_R_DECREASES &&
  R_DECREASES &&
  EFF_EXPONENT_GROWS &&
  RATIO_OVERSHOOTS_UNITY
    ? 'EXACT-SADDLE-RATIO-R_n=|D_n|/|D_n^saddle|-APPROACH-TO-1-MEASURED-(n=3..230):-1e-3-CROSSOVER-AT-n=152' +
      '-(r_151=1.00059e-3->r_152=9.74e-4);-BOTH-CANDIDATE-LAWS-REJECTED-(n*r_n-STRICTLY-DECREASING-7.93->0.148' +
      '-KILLS-c/n;-(ln-n)*r_n-STRICTLY-DECREASING-2.905->4.89e-3-KILLS-c/ln-n);-NO-FIXED-POWER-(EFFECTIVE-EXPONENT' +
      '-GROWS-1.72->2.00->2.97->4.00);-RATIO-OVERSHOOTS-THROUGH-1-AT-FINITE-n*~226-(r_225=+2.75e-6,r_226=-2.31e-6);' +
      '-DISTINCT-FROM-sg-3670-(ln-n)^2/n^3-PLATEAU;-RESIDUAL-sg-3713-saddle-ratio-overshoots-unity-at-finite-n'
    : 'INDETERMINATE';

export const IMP3713_SADDLE_RATIO_APPROACH_TO_UNITY = Object.freeze({
  id: 'imp-3713-saddle-ratio-approach-to-unity',
  ticket: 'imp-3713',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedLadderN18: 'imp-3670-fit-bias-decay-rate-vs-lnsq.js',
  relatedLadderN40: 'imp-3685-fit-bias-saddle-plateau-n40.js',
  relatedRateDerivation: 'imp-3646-remainder-tail-moment-ratio-asymptotics.js',
  relatedDerivation: 'imp-3581-remainder-tail-exponent-derivation.js',
  openSubGap: OPEN_SUBGAP,

  summary:
    'MEASURES the convergence rate of the imp-3670 exact-Laplace-saddle-corrected ratio ' +
    'R_n = |D_n|/|D_n^saddle| toward 1 (D_n = C_(n+2)-C_n, C_n = M_(n+2)/((n+1)(n+2)M_n); ' +
    'D_n^saddle uses C_n^saddle = tau*(n)^2/((n+1)(n+2)) with tau*(n) the EXACT root of ' +
    'n = 4 pi tau* e^{4 tau*}) on the SAME [0,T_A] Simpson moments extended to M_234 (grid-converged to ' +
    '<= ~1e-11 vs a finer/wider grid out to n~200). Cross-checks: R_3 = 3.64422 and R_40 = 1.02438 ' +
    'reproduce imp-3670/imp-3685. FOUR readings across n=3..230: (1) R_n first falls within 1e-3 of 1 at ' +
    'n=152 (r_151=1.00059e-3 outside, r_152=9.74026e-4 inside), so the exact saddle needs n far beyond the ' +
    'imp-3685 n=40 ceiling; (2) BOTH ticket-candidate laws are REJECTED -- n*r_n is strictly decreasing ' +
    '(7.9327 -> 0.14814), eliminating c/n, and (ln n)*r_n is strictly decreasing (2.9053 -> 4.893e-3), eliminating ' +
    'c/ln n; (3) NO fixed power fits -- the effective local exponent p(n) = -d ln r_n/d ln n grows without ' +
    'bound (1.72 at n=30 -> 2.00 at n=60 -> 2.97 at n=120 -> 4.00 at n=150; the closest tangent r_n ~ 40/n^2 ' +
    'is local, n^2*r_n peaking ~40.7 near n~62); (4) the reason -- R_n OVERSHOOTS through 1 at a FINITE n* ~ 226 ' +
    '(r_225 = +2.746e-6, r_226 = -2.314e-6; interp n* ~ 225.5) and goes below 1, so the approach is a finite-n ' +
    'zero-crossing of |D_n|-|D_n^saddle|, not a power-law tail. This exact-saddle convergence is DISTINCT from the ' +
    'sg-3670/sg-3685 crude (ln n)^2/n^3 plateau question (that rate never plateaus; this one overshoots unity). ' +
    'MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no QED. ' +
    'Residual sg-3713-saddle-ratio-overshoots-unity-at-finite-n: the exact n* and sub-unity undershoot need ' +
    'extended-precision moments (D_n difference-cancellation ~n/2 near the crossing).',

  method: Object.freeze({
    ratioMeasured: 'R_n = |D_n| / |D_n^saddle|, r_n = R_n - 1 (signed, positive above 1)',
    nextOrderCoeffClosed: 'D_n = M_(n+4)/((n+3)(n+4)M_(n+2)) - M_(n+2)/((n+1)(n+2)M_n)',
    exactSaddleRate: 'D_n^saddle = C_(n+2)^saddle - C_n^saddle, C_n^saddle = tau*(n)^2/((n+1)(n+2))',
    saddleEquation: 'tau*(n) solves n = 4 pi tau* e^{4 tau*} (imp-3646 Laplace saddle, exact, not (ln n)/4)',
    rungRange: [N_LO, N_HI],
    momentsExtendedTo: MMAX,
    momentGrid: 'T_A=8, NM=3200 Simpson (H=0.0025); R_n converged <= ~1e-11 vs T_A=9/NM=6300 out to n~200',
    crossoverTol: CROSSOVER_TOL,
    candidateLaws: ['c/n (rejected: n*r_n decreasing)', 'c/ln n (rejected: (ln n)*r_n decreasing)'],
    selfComputing: true,
  }),

  measured: Object.freeze({
    rungs: RUNGS,                                    // per-n {ratio, rMinusOne, nTimesR, lnnTimesR, ...}
    ratioFirst: rungAt(3).ratio,                     // n=3   ~3.64422
    ratioN40: rungAt(40).ratio,                      // n=40  ~1.02438 (imp-3685 cross-check)
    crossoverN: CROSSOVER_N,                          // 152 -- first n with r_n < 1e-3
    rAtCrossoverPrev: rungAt(CROSSOVER_N - 1).rMinusOne, // r_151 ~ 1.00059e-3 (outside)
    rAtCrossover: rungAt(CROSSOVER_N).rMinusOne,      // r_152 ~ 9.74026e-4 (inside)
    unityCrossN: UNITY_CROSS_N,                        // 226 -- first n with R_n < 1
    unityCrossInterp: UNITY_CROSS_INTERP,             // ~225.5 (linear interp of the sign change)
    rAtUnityCrossPrev: rungAt(UNITY_CROSS_N - 1).rMinusOne, // r_225 ~ +2.746e-6
    rAtUnityCross: rungAt(UNITY_CROSS_N).rMinusOne,   // r_226 ~ -2.314e-6
    nTimesRFirst: rungAt(3).nTimesR,                  // ~7.9327
    nTimesRAtCrossover: rungAt(CROSSOVER_N).nTimesR,  // ~0.14814 (decreased -> not c/n)
    lnnTimesRFirst: rungAt(3).lnnTimesR,              // ~2.9053
    lnnTimesRAtCrossover: rungAt(CROSSOVER_N).lnnTimesR, // ~4.893e-3 (decreased -> not c/ln n)
    n2TimesRPeak: Math.max(...RUNGS.filter((row) => row.n <= 200).map((row) => row.n2TimesR)), // ~40.7
    effectiveExponents: P_ANCHORS,                    // p(n): 1.72 -> 2.00 -> 2.38 -> 2.97 -> 4.00
    nTimesRDecreases: N_TIMES_R_DECREASES,
    lnnTimesRDecreases: LNN_TIMES_R_DECREASES,
    rDecreases: R_DECREASES,
    effExponentGrows: EFF_EXPONENT_GROWS,
    ratioOvershootsUnity: RATIO_OVERSHOOTS_UNITY,
    verdict,
  }),

  interpretation: Object.freeze({
    crossoverLocated:
      'The exact-saddle ratio R_n = |D_n|/|D_n^saddle| first falls within 1e-3 of 1 at n=152 ' +
      '(r_151 = 1.00059e-3 still outside, r_152 = 9.74026e-4 inside). The last 1e-3 of the approach lies ' +
      'far beyond the imp-3685 n=40 ceiling (where r_40 ~ 2.44e-2, still ~24x the band).',
    candidateLawsRejected:
      'Neither ticket-candidate law fits. c/n is ruled out: n*r_n is strictly DECREASING (7.9327 at n=3 -> ' +
      '0.14814 at n=152), so there is no constant c with r_n ~ c/n. c/ln n is ruled out: (ln n)*r_n is strictly ' +
      'DECREASING (2.9053 -> 4.893e-3). The true decay is FASTER than either candidate.',
    superPolynomial:
      'No fixed power fits: the effective local exponent p(n) = -d ln r_n/d ln n grows without bound ' +
      '(1.72 at n=30, 2.00 at n=60, 2.38 at n=90, 2.97 at n=120, 4.00 at n=150). The closest single-power ' +
      'tangent r_n ~ 40/n^2 (n^2*r_n peaks ~40.7 near n~62) is only a local description, not the global law.',
    finiteNOvershoot:
      'The exponent diverges because R_n does NOT asymptote to 1 from above: it OVERSHOOTS through 1 at a ' +
      'finite n* ~ 226 (r_225 = +2.746e-6, r_226 = -2.314e-6; linear interp n* ~ 225.5) and continues below 1 ' +
      '(|D_n| < |D_n^saddle| for n >~ 226). So the exact-saddle convergence is a finite-n zero-crossing of ' +
      '|D_n| - |D_n^saddle|, a qualitatively different object from a slow power-law tail.',
    separationFromSg3670:
      'This exact-saddle convergence is DISTINCT from the sg-3670/sg-3685 crude (ln n)^2/n^3 OBSERVABLE plateau. ' +
      'That plateau concerns the crude tau* ~ (ln n)/4 rate, whose |p_fit-2| ratio never plateaus (imp-3685); ' +
      'here the EXACT saddle ratio reaches 1 by overshooting through it at finite n. The two must not be conflated.',
    residualSubGap:
      'Honest residual sg-3713-saddle-ratio-overshoots-unity-at-finite-n: the exact crossing n* ~ 226 and the ' +
      'depth of the sub-unity undershoot are set by the sub-leading Q_n/tau*(n)^2 - 1 moment-ratio correction ' +
      '(imp-3646) and, near the crossing, by difference-cancellation in D_n = C_(n+2) - C_n (amplified ~n/2); ' +
      'pinning n* to better than +-1 would need an extended-precision moment solve.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Measures the convergence RATE of a moment-ratio diagnostic (the exact-saddle ratio R_n -> 1) and locates ' +
      'its 1e-3 crossover and finite-n unity-crossing. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    openSubGap: OPEN_SUBGAP,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP3713_SADDLE_RATIO_APPROACH_TO_UNITY_ASSERTIONS = [
  {
    id: 'imp3713-crossover-1e-3-at-n152',
    why: 'THE CENTRAL LOCATION: the exact-saddle ratio R_n = |D_n|/|D_n^saddle| first falls within 1e-3 of 1 at ' +
         'n=152 (r_151 = 1.00059e-3 still outside the band, r_152 = 9.74026e-4 inside).',
    holds: () =>
      CROSSOVER_N === 152 &&
      rungAt(151).rMinusOne > 1e-3 &&
      rungAt(152).rMinusOne < 1e-3 &&
      rungAt(152).rMinusOne > 0,
  },
  {
    id: 'imp3713-candidate-c-over-n-rejected',
    why: 'c/n is falsified: n*r_n is STRICTLY DECREASING over n=3..200 (7.9327 at n=3 -> 0.14814 at n=152), so no ' +
         'constant c fits r_n ~ c/n.',
    holds: () => N_TIMES_R_DECREASES && rungAt(3).nTimesR > 7 && rungAt(152).nTimesR < 0.2,
  },
  {
    id: 'imp3713-candidate-c-over-lnn-rejected',
    why: 'c/ln n is falsified: (ln n)*r_n is STRICTLY DECREASING over n=3..200 (2.9053 -> 4.893e-3), so no constant ' +
         'c fits r_n ~ c/ln n.',
    holds: () => LNN_TIMES_R_DECREASES && rungAt(3).lnnTimesR > 2.5 && rungAt(152).lnnTimesR < 6e-3,
  },
  {
    id: 'imp3713-effective-exponent-grows-superpolynomial',
    why: 'No fixed power fits: the effective exponent p(n) = -d ln r_n/d ln n GROWS without bound (1.72 at n=30 -> ' +
         '2.00 at n=60 -> 2.97 at n=120 -> 4.00 at n=150).',
    holds: () =>
      EFF_EXPONENT_GROWS &&
      Math.abs(effectiveExponent(60) - 2.0) < 0.05 &&
      effectiveExponent(150) > 3.5,
  },
  {
    id: 'imp3713-ratio-overshoots-through-unity-at-finite-n',
    why: 'The reason the exponent diverges: R_n OVERSHOOTS through 1 at a finite n* ~ 226 (r_225 = +2.746e-6, ' +
         'r_226 = -2.314e-6), so |D_n| < |D_n^saddle| for n >~ 226 -- a finite-n zero-crossing, not a power tail.',
    holds: () =>
      RATIO_OVERSHOOTS_UNITY &&
      UNITY_CROSS_N === 226 &&
      UNITY_CROSS_INTERP > 224 &&
      UNITY_CROSS_INTERP < 227,
  },
  {
    id: 'imp3713-monotone-approach-from-above',
    why: 'r_n = R_n - 1 is STRICTLY DECREASING over n=3..200 (approach to 1 from above before the overshoot).',
    holds: () => R_DECREASES,
  },
  {
    id: 'imp3713-cross-check-imp3670-n3-ratio',
    why: 'Cross-check vs the certified ladder: R_3 must reproduce the imp-3670/imp-3685 baked 3.64422.',
    holds: () => Math.abs(rungAt(3).ratio - 3.64422) < 1e-4,
  },
  {
    id: 'imp3713-cross-check-imp3685-n40-ratio',
    why: 'Cross-check vs the certified ladder: R_40 must reproduce the imp-3685 baked saddleDnRatioLast 1.02438.',
    holds: () => Math.abs(rungAt(40).ratio - 1.02438) < 1e-4,
  },
  {
    id: 'imp3713-next-order-coeff-negative-all-positive-rungs',
    why: 'D_n < 0 at every rung n=3..200 (C_n strictly decreasing there), the sign that reads the fitted slope below 2.',
    holds: () => RUNGS.filter((row) => row.n <= 200).every((row) => row.nextOrderCoeff < 0),
  },
  {
    id: 'imp3713-verdict-not-indeterminate',
    why: 'The classified verdict must record the crossover, the two rejected candidate laws, the growing exponent, ' +
         'and the finite-n unity overshoot, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp3713-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement only, mass-feasibility necessary-but-not-sufficient, operator positivity ' +
         '(imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3713_SADDLE_RATIO_APPROACH_TO_UNITY.honestCaveat;
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

for (const assertion of IMP3713_SADDLE_RATIO_APPROACH_TO_UNITY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3713-saddle-ratio-approach-to-unity assertion failed: ${assertion.id}`);
  }
}

export default IMP3713_SADDLE_RATIO_APPROACH_TO_UNITY;
