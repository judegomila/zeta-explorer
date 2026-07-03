/**
 * @module imp-3648-fit-bias-a-window-sensitivity-n78
 * @fileoverview imp-3648 -- EXTEND the imp-3624 a-window sensitivity test of the
 *   imp-3581/imp-3600 fit-bias law
 *       p_fit = 2 + D_n * cov(a^2, ln a)/var(ln a)
 *   from the n=3..6 rungs to the imp-3618 higher rungs n=7 (odd sinh R_7) and n=8
 *   (even cosh R_8). imp-3624 certified the a-window robustness of the law (the
 *   fitted exponent moves as the a-grid moves, but the whole drift is captured by
 *   cov(a^2,ln a)/var(ln a) against a window-INVARIANT D_n) for n=3..6 only.
 *   imp-3618 extended the certified C_n/D_n ladder to n=7,8 (D_7 ~ -1.5787e-4,
 *   D_8 ~ -1.3198e-4) but on the SINGLE fixed nine-rung (odd) / six-rung (even)
 *   ladder per parity -- the a-window robustness at the deeper rungs was untested.
 *   This module runs the SAME six imp-3624 windows for n=7,8, reusing the SAME
 *   NM=1600 [0,T_A] Simpson moments M_0..M_16 (which already carry the M_11..M_14
 *   imp-3618 feeds the deep ladder). NO new moment computation.
 *
 *   WHAT imp-3624/imp-3618 LEFT OPEN
 *   -------------------------------
 *   imp-3624 measured the six-window sensitivity only for n=3..6; imp-3618 added the
 *   deep rungs n=7,8 but only on ONE ladder per parity. So the question "does the
 *   closed p_fit = 2 + D_n cov/var still track the least-squares slope as the a-window
 *   is varied, with a window-invariant D_n, at n=7,8?" was open. If the law is a
 *   genuine closed identity at the deeper rungs (and not a coincidence of the imp-3618
 *   ladder), then varying the window must (i) leave the residual slopeModelErr =
 *   |p_fit - fitted| at the imp-3624/imp-3600 ~1e-9 level, and (ii) make (fitted - 2)/
 *   covVar recover the SAME D_7, D_8 at every window to <= 1e-4 relative.
 *
 *   MEASURED (self-computing; same moments as imp-3618/imp-3624)
 *   -----------------------------------------------------------
 *   Six windows: base (aHi=0.5, r=0.5, K=9), deep (aHi=0.25, r=0.5, K=9),
 *   shallow (aHi=0.125, r=0.5, K=7), coarse (aHi=0.5, r=0.25, K=5),
 *   dense (aHi=0.5, r=1/sqrt2, K=12), short6 (aHi=0.5, r=0.5, K=6). covVar factor
 *   spans ~0.00286 (shallow) to ~0.05957 (short6), a ~20x range.
 *     n=7: C_7 = M_9/(72 M_7) ~ 8.25809e-4, D_7 ~ -1.5787e-4, fitted-exponent spread
 *          8.95e-6 across windows, max slopeModelErr 8.32e-10, (fitted-2)/covVar
 *          recovers D_7 to <= 9.58e-5 rel;
 *     n=8: C_8 = M_10/(90 M_8) ~ 7.39567e-4, D_8 ~ -1.3198e-4, fitted-exponent spread
 *          7.48e-6 across windows, max slopeModelErr 6.62e-10, (fitted-2)/covVar
 *          recovers D_8 to <= 9.11e-5 rel.
 *   GLOBAL: across all 12 (n in {7,8}, six-window) cells the slopeModelErr max is
 *   8.32e-10 (imp-3624 level), while the fitted exponent itself varies by up to
 *   8.95e-6 between windows. Two independent cross-checks vs imp-3618 pin the module
 *   to the certified ladder: the n=7 base window (nine odd rungs) reproduces the
 *   imp-3618 fitted 1.99999536, and the n=8 short6 window (six even rungs) reproduces
 *   the imp-3618 fitted 1.99999214. So at the deeper rungs too the read-out drift is
 *   NOT an unmodeled effect: it is exactly D_n cov(a^2,ln a)/var(ln a) with a
 *   window-invariant D_n -- the tail exponent is EXACTLY 2, window by window, and the
 *   sub-2 read-out is the derived O(a^2) curvature bias.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT ONLY, at the RH-equivalent scale class. This probes the a-grid
 *   robustness of a fixed-weight Taylor-remainder decay-ORDER read-out at the deeper
 *   rungs; it establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-
 *   NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian
 *   Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3624-fit-bias-a-window-sensitivity.js (the n=3..6 window sensitivity test)
 *   @see imp-3618-remainder-tail-exponent-ladder-n78.js (the certified n=7,8 rungs + C_n/D_n)
 *   @see imp-3600-remainder-tail-exponent-ladder-n56.js (the certified n=5,6 rungs)
 *   @see imp-3581-remainder-tail-exponent-derivation.js (closed C_n/D_n and the bias law)
 *   @see imp-3501-moment-ladder-general-derivation.js (R_n = sum a^m/m! M_m)
 *
 *   Ticket: imp-3648 (numerical, medium).
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

// Precompute A on the SAME fixed fine Simpson grid over [0, T_A] as imp-3600/imp-3624.
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

// -- Moments M_0..M_16 (the same tail-series coefficients as imp-3618/imp-3624) ------
const MMAX = 16;
const MOMENTS = {};                             // MOMENTS[m] = int tau^m A(tau) d(tau)
for (let m = 0; m <= MMAX; m += 1) MOMENTS[m] = aWeightedMass((tau) => Math.pow(tau, m));

// -- CLOSED-FORM leading/next-order relative-residual coefficients (imp-3581) --------
function leadingCoeff(n) {
  return MOMENTS[n + 2] / ((n + 1) * (n + 2) * MOMENTS[n]);
}
function nextOrderCoeff(n) {
  return (
    MOMENTS[n + 4] / ((n + 3) * (n + 4) * MOMENTS[n + 2]) -
    MOMENTS[n + 2] / ((n + 1) * (n + 2) * MOMENTS[n])
  );
}

// -- Cancellation-free remainder, tail, and relative residual (imp-3553/imp-3526) ---
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

// -- Least-squares log-log slope (the fitted exponent) -------------------------------
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

// The a-grid-dependent bias factor cov(a^2, ln a)/var(ln a) that drives the fitted slope.
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

/** Geometric a-window: aHi, aHi*ratio, aHi*ratio^2, ..., K rungs. */
function geometricWindow(aHi, ratio, K) {
  const ladder = [];
  let a = aHi;
  for (let i = 0; i < K; i += 1) {
    ladder.push(a);
    a *= ratio;
  }
  return Object.freeze(ladder);
}

// -- The a-windows under test (the SAME six imp-3624 windows) -------------------------
// covVar factor spans ~0.00286 (shallow) to ~0.05957 (short6), a ~20x range.
const WINDOWS = Object.freeze([
  { name: 'base', aHi: 0.5, ratio: 0.5, K: 9 },              // the imp-3618 odd nine-rung ladder
  { name: 'deep', aHi: 0.25, ratio: 0.5, K: 9 },            // shifted an octave deeper
  { name: 'shallow', aHi: 0.125, ratio: 0.5, K: 7 },        // deeper still, fewer rungs
  { name: 'coarse', aHi: 0.5, ratio: 0.25, K: 5 },          // wide spacing, few rungs
  { name: 'dense', aHi: 0.5, ratio: 1 / Math.SQRT2, K: 12 },// fine spacing, many rungs
  { name: 'short6', aHi: 0.5, ratio: 0.5, K: 6 },           // the imp-3618 even six-rung ladder
]);

const DERIVED_EXPONENT = 2;

// -- Per-(n, window) records + per-n window-sensitivity summary ----------------------
function analyseWindow(n, mmax, dn, w) {
  const ladder = geometricWindow(w.aHi, w.ratio, w.K);
  const rel = ladder.map((a) => relativeResidual(n, a, mmax));
  const fitted = logLogSlope(ladder, rel);
  const covVar = covVarFactor(ladder);
  const predicted = 2 + dn * covVar;
  return Object.freeze({
    window: w.name,
    aHi: w.aHi,
    ratio: w.ratio,
    K: w.K,
    covVarFactor: covVar,
    fittedExponent: fitted,                    // actual least-squares slope on this window
    predictedExponent: predicted,              // 2 + D_n covVar
    slopeModelErr: Math.abs(predicted - fitted),
    effectiveDn: (fitted - 2) / covVar,        // (fitted-2)/covVar -> D_n if the law holds
  });
}

function analyseRung(n) {
  const mmax = n % 2 === 0 ? 16 : 15;
  const dn = nextOrderCoeff(n);
  const cn = leadingCoeff(n);
  const records = WINDOWS.map((w) => analyseWindow(n, mmax, dn, w));
  const fits = records.map((r) => r.fittedExponent);
  const effDns = records.map((r) => r.effectiveDn);
  const maxSlopeModelErr = Math.max(...records.map((r) => r.slopeModelErr));
  const fittedSpread = Math.max(...fits) - Math.min(...fits);
  // How window-invariant is the extracted D_n? (relative to the closed D_n).
  const maxEffDnRelErr = Math.max(...effDns.map((d) => Math.abs(d - dn) / Math.abs(dn)));
  return Object.freeze({
    n,
    mmax,
    leadingCoeff: cn,
    nextOrderCoeff: dn,                        // closed D_n, window-independent
    records,
    maxSlopeModelErr,                          // predicted vs actual, across all windows
    fittedSpread,                              // how far the fitted exponent moves across windows
    maxEffectiveDnRelErr: maxEffDnRelErr,      // (fitted-2)/covVar recovers D_n to this rel error
  });
}

const RUNGS = Object.freeze([7, 8].map((n) => analyseRung(n)));

const GLOBAL_MAX_SLOPE_MODEL_ERR = Math.max(...RUNGS.map((r) => r.maxSlopeModelErr));
const GLOBAL_MIN_FITTED_SPREAD = Math.min(...RUNGS.map((r) => r.fittedSpread));
const GLOBAL_MAX_EFF_DN_REL_ERR = Math.max(...RUNGS.map((r) => r.maxEffectiveDnRelErr));

// -- Classification (SAME tolerances as imp-3624) ------------------------------------
const SLOPE_MODEL_TOL = 1e-8;   // predicted p_fit reproduces the actual slope at every window
const SENSITIVITY_MIN = 1e-6;   // the fitted exponent MUST move across windows (real sensitivity)
const EFF_DN_TOL = 1e-3;        // (fitted-2)/covVar recovers the closed D_n to this rel error

const windowSensitivityCertified =
  GLOBAL_MAX_SLOPE_MODEL_ERR < SLOPE_MODEL_TOL &&
  GLOBAL_MIN_FITTED_SPREAD > SENSITIVITY_MIN &&
  GLOBAL_MAX_EFF_DN_REL_ERR < EFF_DN_TOL;

const verdict = windowSensitivityCertified
  ? 'FIT-BIAS-LAW-p_fit=2+D_n-cov(a^2,ln-a)/var(ln-a)-TRACKS-THE-LEAST-SQUARES-SLOPE-ACROSS-a-WINDOWS-AT-n=7,8-(slopeModelErr<=8.32e-10-vs-fitted-spread-up-to-8.95e-6,-D_7/D_8-WINDOW-INVARIANT-TO-9.58e-5)'
  : 'INDETERMINATE';

export const IMP3648_FIT_BIAS_A_WINDOW_SENSITIVITY_N78 = Object.freeze({
  id: 'imp-3648-fit-bias-a-window-sensitivity-n78',
  ticket: 'imp-3648',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedWindowTest: 'imp-3624-fit-bias-a-window-sensitivity.js',
  relatedLadder: 'imp-3618-remainder-tail-exponent-ladder-n78.js',
  relatedDerivation: 'imp-3581-remainder-tail-exponent-derivation.js',
  relatedMomentIdentity: 'imp-3501-moment-ladder-general-derivation.js',

  summary:
    'EXTENDS the imp-3624 a-window sensitivity test of the imp-3581/imp-3600 fit-bias law p_fit = 2 + D_n ' +
    'cov(a^2,ln a)/var(ln a) from n=3..6 to the imp-3618 deeper rungs n=7,8, reusing the SAME NM=1600 [0,T_A] ' +
    'Simpson moments M_0..M_16 (which carry the M_11..M_14 imp-3618 feeds the deep ladder; no new moment ' +
    'computation). Across the SAME six imp-3624 a-windows (covVar factor ~0.00286 to ~0.05957, a ~20x range) the ' +
    'fitted least-squares exponent MOVES by up to 8.95e-6 (n=7) between windows while the residual slopeModelErr = ' +
    '|p_fit - fitted| stays at the imp-3624 ~1e-9 level (global max 8.32e-10 across all 12 (n,window) cells). The ' +
    'extracted (fitted-2)/covVar recovers the closed D_7 ~ -1.5787e-4 / D_8 ~ -1.3198e-4 to <= 9.58e-5 relative at ' +
    'every window, so D_n is window-invariant and the read-out drift IS the cov(a^2,ln a)/var(ln a) term at the ' +
    'deeper rungs too, not an unmodeled effect. Two cross-checks vs imp-3618 pin the module to the certified ladder: ' +
    'the n=7 base window reproduces the imp-3618 nine-rung fitted 1.99999536, the n=8 short6 window the six-rung ' +
    '1.99999214. So the tail exponent is EXACTLY 2 window by window at n=7,8 and the sub-2 read-out is the derived ' +
    'O(a^2) curvature bias. MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity ' +
    '(imp-3066) untouched; no RH verdict, no QED.',

  method: Object.freeze({
    biasLaw: 'p_fit = 2 + D_n * cov(a^2, ln a)/var(ln a) over the geometric a-window (imp-3581)',
    nextOrderCoeffClosed: 'D_n = M_(n+4)/((n+3)(n+4)M_(n+2)) - M_(n+2)/((n+1)(n+2)M_n) (window-independent)',
    leadingCoeffClosed: 'C_n = M_(n+2)/((n+1)(n+2)M_n); C_7 = M_9/(72 M_7), C_8 = M_10/(90 M_8)',
    rungsTested: [7, 8],
    windowsTested: WINDOWS,
    covVarRange: 'cov(a^2,ln a)/var(ln a) spans ~0.00286 (shallow) to ~0.05957 (short6)',
    momentsReused: 'SAME MOMENTS[0..16] on the NM=1600 [0,T_A] Simpson grid as imp-3618/imp-3624; no new moment computation',
    selfComputing: true,
  }),

  measured: Object.freeze({
    derivedExponent: DERIVED_EXPONENT,               // 2, exact
    rungs: RUNGS,                                    // per-n {records, maxSlopeModelErr, fittedSpread, maxEffectiveDnRelErr}
    globalMaxSlopeModelErr: GLOBAL_MAX_SLOPE_MODEL_ERR,   // ~8.32e-10
    globalMinFittedSpread: GLOBAL_MIN_FITTED_SPREAD,      // ~7.48e-6 (n=8)
    globalMaxEffectiveDnRelErr: GLOBAL_MAX_EFF_DN_REL_ERR,// ~9.58e-5
    windowSensitivityCertified,
    verdict,
  }),

  interpretation: Object.freeze({
    lawTracksTheWindowAtDeepRungs:
      'As the a-window (lo/hi endpoints, rung count) is varied at n=7,8, the fitted least-squares exponent moves by ' +
      'up to 8.95e-6, and the closed p_fit = 2 + D_n cov(a^2,ln a)/var(ln a) tracks it at every window: slopeModelErr ' +
      'stays at ~1e-9 (global max 8.32e-10), four orders below the drift it explains.',
    driftIsExactlyTheCovVarTerm:
      'The extracted (fitted-2)/covVar recovers the closed D_7, D_8 to <= 9.58e-5 relative across all six windows, so ' +
      'the window-to-window read-out drift at the deeper rungs is EXACTLY the cov(a^2,ln a)/var(ln a) factor times a ' +
      'window-invariant D_n -- not an unmodeled effect and not exponent drift.',
    exponentStillTwo:
      'Because the whole a-grid dependence is absorbed by the derived O(a^2) bias term at n=7,8 too, the underlying ' +
      'tail exponent is EXACTLY 2 independent of the chosen a-window; the sub-2 fitted read-out is the quantified ' +
      'curvature bias, extending the imp-3624 n=3..6 result up the certified imp-3618 ladder.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Probes the a-grid robustness of the closed fit-bias law for a fixed-weight Taylor-remainder decay ORDER (p=2) ' +
      'at the deeper rungs n=7,8. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP3648_FIT_BIAS_A_WINDOW_SENSITIVITY_N78_ASSERTIONS = [
  {
    id: 'imp3648-slope-model-reproduces-fit-across-windows-n78',
    why: 'THE KEY CERTIFICATION: across all 12 (n in {7,8}, six-window) cells the closed p_fit = 2 + D_n cov(a^2,ln a)/' +
         'var(ln a) reproduces the ACTUAL least-squares slope to < 1e-8 (measured max ~8.32e-10), the imp-3624 level.',
    holds: () => GLOBAL_MAX_SLOPE_MODEL_ERR < SLOPE_MODEL_TOL,
  },
  {
    id: 'imp3648-fitted-exponent-is-window-sensitive-n78',
    why: 'The fitted exponent MUST actually move across windows (else there is nothing to track): every n in {7,8} has ' +
         'a fitted spread > 1e-6 (measured 7.48e-6 .. 8.95e-6), driven by the ~20x covVar range.',
    holds: () => GLOBAL_MIN_FITTED_SPREAD > SENSITIVITY_MIN,
  },
  {
    id: 'imp3648-drift-is-exactly-the-cov-var-term-n78',
    why: 'The window-to-window read-out drift is EXACTLY the cov(a^2,ln a)/var(ln a) term at n=7,8: (fitted-2)/covVar ' +
         'recovers the closed D_n to < 1e-3 relative at every window (measured ~9.58e-5), so D_7, D_8 are window-invariant.',
    holds: () => GLOBAL_MAX_EFF_DN_REL_ERR < EFF_DN_TOL,
  },
  {
    id: 'imp3648-slope-model-err-below-fitted-spread-n78',
    why: 'The residual slopeModelErr must be far SMALLER than the fitted drift it explains (else the model is not ' +
         'actually capturing the window effect): global max slopeModelErr ~8.32e-10 << min fitted spread ~7.48e-6.',
    holds: () => GLOBAL_MAX_SLOPE_MODEL_ERR < 0.01 * GLOBAL_MIN_FITTED_SPREAD,
  },
  {
    id: 'imp3648-next-order-coeff-negative-both-rungs',
    why: 'D_n is negative at both deep rungs (D_7 ~ -1.5787e-4, D_8 ~ -1.3198e-4), so every window reads BELOW 2 -- ' +
         'the sign that produces the sub-2 read-out, consistent with imp-3618/imp-3624.',
    holds: () => RUNGS.every((r) => r.nextOrderCoeff < 0),
  },
  {
    id: 'imp3648-Dn-matches-imp3618',
    why: 'The closed D_7, D_8 must reproduce the imp-3618 values (D_7 ~ -1.5787e-4, D_8 ~ -1.3198e-4) to <1e-7, ' +
         'confirming this module reads the SAME moments as the certified ladder.',
    holds: () => {
      const n7 = RUNGS.find((r) => r.n === 7);
      const n8 = RUNGS.find((r) => r.n === 8);
      return (
        Math.abs(n7.nextOrderCoeff - -1.578701e-4) < 1e-7 &&
        Math.abs(n8.nextOrderCoeff - -1.319762e-4) < 1e-7
      );
    },
  },
  {
    id: 'imp3648-cross-check-imp3618-fitted-slopes',
    why: 'Two independent cross-checks vs imp-3618: the n=7 base window (nine odd rungs) reproduces the imp-3618 ' +
         'fitted 1.99999536, and the n=8 short6 window (six even rungs) reproduces the imp-3618 fitted 1.99999214.',
    holds: () => {
      const n7 = RUNGS.find((r) => r.n === 7);
      const n8 = RUNGS.find((r) => r.n === 8);
      const base7 = n7.records.find((rec) => rec.window === 'base');
      const short8 = n8.records.find((rec) => rec.window === 'short6');
      return (
        Math.abs(base7.fittedExponent - 1.9999953601) < 1e-8 &&
        Math.abs(short8.fittedExponent - 1.9999921381) < 1e-8
      );
    },
  },
  {
    id: 'imp3648-verdict-certifies-window-tracking-n78',
    why: 'The classified verdict must certify that the fit-bias law tracks the least-squares slope across a-windows ' +
         'at the deeper rungs n=7,8, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE' && windowSensitivityCertified === true,
  },
  {
    id: 'imp3648-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement only, mass-feasibility necessary-but-not-sufficient, operator positivity ' +
         '(imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3648_FIT_BIAS_A_WINDOW_SENSITIVITY_N78.honestCaveat;
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

for (const assertion of IMP3648_FIT_BIAS_A_WINDOW_SENSITIVITY_N78_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3648-fit-bias-a-window-sensitivity-n78 assertion failed: ${assertion.id}`);
  }
}

export default IMP3648_FIT_BIAS_A_WINDOW_SENSITIVITY_N78;
