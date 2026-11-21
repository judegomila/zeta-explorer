/**
 * @module imp-3913-moment-tilt-saddle-crossing-regime
 * @fileoverview imp-3913 -- EXTEND the imp-3893 moment-ratio tilt T_n = Q_n^true / Q_n^model
 *   and its additive drift offset delta_n = (T_n - 1) n(1 + 4 tau*) from the imp-3893 range
 *   n = 10..80 into the imp-3849 exact-saddle crossing regime n ~ 215, to ANSWER TWO questions
 *   imp-3893 left open: (Q1) does the sub-3% multiplicative tilt keep shrinking monotonically or
 *   does it PLATEAU, and (Q2) does the additive offset delta_n approach a LIMIT.
 *
 *   WHAT imp-3893 MEASURED, AND WHAT IT LEFT OPEN
 *   ---------------------------------------------
 *   imp-3893 defined the moment-ratio TILT T_n = Q_n^true / Q_n^model between the real
 *   Phi-autocorrelation weight A(tau) and the imp-3665 super-exponential surrogate
 *   exp(-pi e^{4 tau}), with Q_n = M_(n+2)/M_n and tau*(n) the imp-3646 saddle. It reported the
 *   tilt is a SUB-3% multiplicative discrepancy shrinking monotonically (T_n: 1.0313 at n = 10
 *   to 1.0023 at n = 80) that the eps_n = Q_n/tau*^2 - 1 near-cancellation LEVERAGES into an
 *   additive drift offset delta_n = (T_n - 1) n(1 + 4 tau*) ~ 0.65-0.71 -- but it measured ONLY
 *   n = 10..80 and never reached the imp-3849/imp-3895 exact-saddle crossing regime near n ~ 215
 *   (where the converged R_n = |D_n|/|D_n^saddle| crosses 1 at n* = 215.231 and eps_n^true changes
 *   sign at n = 149). Whether the tilt plateaus or the offset stabilizes past n = 80 was unknown.
 *
 *   METHOD (self-computing; imp-3849 inner-converged TRUE ladder + imp-3893 surrogate quadrature)
 *   ------------------------------------------------------------------------------------------
 *   To reach n ~ 215 the TRUE moment ladder must be formed to M_217 = M_(215+2). imp-3893 built
 *   moments on a T_A = 8 grid with the inner A(tau) quadrature on [0,7] -- but at T_A = 8 the
 *   tau^m weight overflows to Inf*(A = 0) = NaN once m exceeds ~340, and (imp-3735/imp-3849) the
 *   INNER A(tau) resolution, not the outer moment grid, limits the ratio at large n. So this module
 *   forms the TRUE moments with the imp-3849 INNER-CONVERGED machinery verbatim: Neumaier-
 *   compensated Simpson, inner A(tau) on [0,2] with 4800 panels (A(tau) is supported on tau in
 *   [0,~1.4] since Phi underflows beyond u ~ 1.37), outer T_A = 2, NM = 3200, and the tau > 1.45
 *   => A = 0 guard that keeps tau^m finite. The surrogate Q_n^model is the imp-3893 saddle-centred
 *   Simpson quadrature of tau^k exp(n ln tau - pi e^{4 tau}) (quadN = 150000, +-16 sigma window,
 *   log-domain, no truncation). The inner grid is self-checked against 7200 panels. The tilt is
 *   evaluated at INTEGER n = 6..215 so the offset argmax and the monotonicity are located exactly.
 *
 *   MEASURED (extends imp-3893 to the imp-3849 crossing regime)
 *   ----------------------------------------------------------
 *     (Q1) THE SUB-3% TILT KEEPS SHRINKING MONOTONICALLY -- IT DOES NOT PLATEAU. T_n falls
 *          strictly and stays above 1 across the whole extended range: T_10 = 1.031274,
 *          T_80 = 1.002322 (reproducing imp-3893), T_149 = 1.000958, T_215 = 1.000564. The
 *          multiplicative discrepancy shrinks below one part in 1700 at the crossing regime and
 *          keeps falling -- Q_n^true stays above Q_n^model at EVERY n (the real A(tau) always
 *          over-weights the tilted moment ratio slightly relative to the surrogate).
 *     (Q2) THE ADDITIVE OFFSET delta_n DOES NOT APPROACH A NONZERO LIMIT -- IT PEAKS EARLY AND
 *          DECAYS. delta_n rises to a single interior maximum delta_max = 0.7159 at n = 24, then
 *          DECLINES MONOTONICALLY: delta_80 = 0.6266, delta_149 = 0.5457, delta_215 = 0.4965 and
 *          still falling. The ~0.7 offset imp-3893 reported over n = 10..80 sat near this peak; by
 *          the imp-3849 crossing regime it has decayed ~30% and shows no sign of a plateau. So the
 *          leading drift offset is a decaying hump, not a stabilizing constant.
 *     (3)  THE TILT PASSES THROUGH THE imp-3849 eps_n SIGN-CHANGE WITHOUT A FEATURE. The extended
 *          TRUE ladder reproduces the imp-3849 converged eps_n^true sign-change at n = 149
 *          (eps_148 = +7.60e-6, eps_149 = -3.46e-6) -- a cross-check tying this ladder to imp-3849.
 *          Yet T_n shows no kink there, because T_n - 1 = eps_n^true - eps_n^model (leading) and
 *          BOTH corrections go negative at large n with eps_n^model MORE negative (eps_200^true =
 *          -3.43e-4 vs eps_200^model = -9.69e-4). Their positive difference is what keeps T_n > 1
 *          and shrinking smoothly through the sign-change.
 *     (4)  GRID-CONVERGED. The tilt is inner-resolution-pinned: max|T_n(inner 4800) - T_n(7200)|
 *          = 2.4e-8 over n = 6..215, so the shrinking-tilt / decaying-offset picture is a stable
 *          located property of the truncated-kernel model, not a quadrature artifact.
 *
 *   BOTTOM LINE. Extending imp-3893 to the imp-3849 crossing regime: (Q1) the sub-3% moment-ratio
 *   tilt T_n = Q_n^true/Q_n^model keeps shrinking monotonically to 1.000564 at n = 215 -- it does
 *   NOT plateau; (Q2) the additive drift offset delta_n = (T_n - 1) n(1 + 4 tau*) does NOT approach
 *   a limit -- it peaks at 0.716 near n = 24 and decays to 0.497 by n = 215. The imp-3893 ~0.7
 *   offset was a near-peak reading of a decaying hump. The tilt threads the imp-3849 eps_n = 0
 *   sign-change (n = 149) featurelessly because T_n - 1 is the positive gap eps^true - eps^model.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / CHARACTERIZATION ONLY, at the RH-equivalent scale class. This extends a
 *   fixed-weight moment-ratio tilt diagnostic to larger n and reports whether it plateaus and
 *   whether the derived additive offset stabilizes. It establishes NO operator positivity.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-
 *   Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA. Values are grid-CONVERGENCE stable (inner
 *   4800 vs 7200 panels agree to ~2.4e-8); the shared finite NPHI = 10 kernel truncation and
 *   Simpson order remain the residual floor. imp-3893 and imp-3849 assertions are LEFT INTACT.
 *
 *   @see imp-3893-model-fidelity-moment-discrepancy.js (the n=10..80 tilt/offset this extends)
 *   @see imp-3849-saddle-ratio-well-depth-inner-converged.js (the inner-converged ladder + eps sign-change at n=149)
 *   @see imp-3735-moment-ratio-correction-tail.js (the eps_n Laplace-order tail and inner-resolution lesson)
 *   @see imp-3646-remainder-tail-moment-ratio-asymptotics.js (Q_n/tau*^2 -> 1, saddle relation)
 *
 *   Ticket: imp-3913 (numerical, medium).
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

/** Composite Simpson quadrature with Neumaier COMPENSATED accumulation (imp-3849). */
function simpsonCompensated(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = 0;
  let c = 0;
  const add = (x) => {
    const t = sum + x;
    if (Math.abs(sum) >= Math.abs(x)) c += (sum - t) + x;
    else c += (x - t) + sum;
    sum = t;
  };
  add(f(lo));
  add(f(hi));
  for (let i = 1; i < m; i += 1) add((i % 2 === 0 ? 2 : 4) * f(lo + i * h));
  return ((sum + c) * h) / 3;
}

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds on [0, innerHi] with innerN panels.
function makeAutocorr(innerHi, innerN) {
  return (tau) => simpsonCompensated((s) => phiKernel(s) * phiKernel(s + tau), 0, innerHi, innerN);
}

// -- The imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*} -----------
function saddleTau(n) {
  let lo = 1e-9;
  let hi = 12;
  for (let it = 0; it < 300; it += 1) {
    const mid = (lo + hi) / 2;
    if (4 * Math.PI * mid * Math.exp(4 * mid) < n) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Gaussian peak variance sigma^2 = -1/f''(tau*) of the surrogate log-integrand. */
function saddleSigma2(n) {
  const ts = saddleTau(n);
  const P = Math.PI * Math.exp(4 * ts);
  const f2 = -n / (ts * ts) - 16 * P;           // f'' = -(n/tau*^2)(1 + 4 tau*)
  return -1 / f2;
}

/**
 * TRUE moments M_0..MMAX built with the imp-3849 INNER-CONVERGED machinery: inner A(tau) on
 * [0, innerHi] with innerN panels, outer [0, T_A] with NM Simpson panels, Neumaier-compensated,
 * and the tau > 1.45 => A = 0 guard (both skips the numerically-zero A tail and keeps tau^m finite).
 */
function buildTrueMoments(mMax, innerHi, innerN, T_A, NM) {
  const autocorr = makeAutocorr(innerHi, innerN);
  const H_A = T_A / NM;
  const A_GRID = new Array(NM + 1);
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    A_GRID[j] = tau > 1.45 ? 0 : autocorr(tau);
  }
  const M = new Array(mMax + 1);
  for (let m = 0; m <= mMax; m += 1) {
    let sum = 0;
    let c = 0;
    for (let j = 0; j <= NM; j += 1) {
      const aj = A_GRID[j];
      if (aj === 0) continue;
      const tau = j * H_A;
      const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
      const x = w * Math.pow(tau, m) * aj;
      const t = sum + x;
      if (Math.abs(sum) >= Math.abs(x)) c += (sum - t) + x;
      else c += (x - t) + sum;
      sum = t;
    }
    M[m] = ((sum + c) * H_A) / 3;
  }
  return M;
}

/**
 * SURROGATE moment ratio Q_n^model = <tau^2>_model of tau^n exp(-pi e^{4 tau}) by direct
 * saddle-centred Simpson quadrature (imp-3893; log-domain, no series truncation, no underflow).
 */
function qModel(n, quadN, widthSigma) {
  const ts = saddleTau(n);
  const sig = Math.sqrt(saddleSigma2(n));
  const lo = Math.max(1e-12, ts - widthSigma * sig);
  const hi = ts + widthSigma * sig;
  const logf = (tau) => n * Math.log(tau) - Math.PI * Math.exp(4 * tau);
  const fmax = logf(ts);
  const num = simpsonCompensated((t) => t * t * Math.exp(logf(t) - fmax), lo, hi, quadN);
  const den = simpsonCompensated((t) => Math.exp(logf(t) - fmax), lo, hi, quadN);
  return num / den;
}

// -- Converged configuration (imp-3849 inner-converged ladder; imp-3893 surrogate quadrature) --
const N_MAX = 215;                              // reach the imp-3849 crossing regime n ~ 215
const MMAX = N_MAX + 2;                         // need M_217 = M_(215+2) for Q_215
const T_A = 2;                                  // A(tau)=0 beyond ~1.4, so [0,2] equals [0,8]
const NM = 3200;
const INNER_HI = 2;
const INNER_FINE = 4800;                        // inner A(tau) panels (imp-3849 converged)
const INNER_FINER = 7200;                       // inner self-check panels
const QUAD_N = 150000;                          // surrogate quadrature panels (imp-3893)
const QUAD_W = 16;                              // saddle-window half-width in sigma

const M_TRUE = buildTrueMoments(MMAX, INNER_HI, INNER_FINE, T_A, NM);
const M_TRUE_FINER = buildTrueMoments(MMAX, INNER_HI, INNER_FINER, T_A, NM);

function qTrue(M, n) {
  return M[n + 2] / M[n];
}

// -- Integer ladder n = 6..215: tilt, offset, and both eps corrections ----------------
const N_LO = 6;
const ROWS = [];
for (let n = N_LO; n <= N_MAX; n += 1) {
  const ts = saddleTau(n);
  const qt = qTrue(M_TRUE, n);
  const qm = qModel(n, QUAD_N, QUAD_W);
  const t = qt / qm;                            // T_n = Q_n^true / Q_n^model
  const lever = n * (1 + 4 * ts);
  ROWS.push(
    Object.freeze({
      n,
      saddleTau: ts,
      tilt: t,                                  // T_n
      driftOffset: (t - 1) * lever,             // delta_n = (T_n-1) n(1+4 tau*)
      epsTrue: qt / (ts * ts) - 1,              // eps_n^true
      epsModel: qm / (ts * ts) - 1,             // eps_n^model
      tiltFiner: qTrue(M_TRUE_FINER, n) / qm,   // inner-7200 tilt for the grid self-check
    })
  );
}

function rowAt(n) {
  return ROWS[n - N_LO];
}

// -- Display rungs at step 5 (compact export table) ----------------------------------
const RUNGS = ROWS.filter((r) => r.n % 5 === 0 && r.n >= 10).map((r) =>
  Object.freeze({
    n: r.n,
    saddleTau: r.saddleTau,
    tilt: r.tilt,
    driftOffset: r.driftOffset,
    epsTrue: r.epsTrue,
    epsModel: r.epsModel,
  })
);

// -- (Q1) The tilt keeps shrinking monotonically and stays above 1 (no plateau) ------
let tiltStrictlyShrinks = true;
let tiltAllAbove1 = true;
for (let i = 1; i < ROWS.length; i += 1) {
  if (ROWS[i].tilt >= ROWS[i - 1].tilt) tiltStrictlyShrinks = false;
  if (!(ROWS[i].tilt > 1)) tiltAllAbove1 = false;
}
if (!(ROWS[0].tilt > 1)) tiltAllAbove1 = false;
const TILT_N10 = rowAt(10).tilt;                // ~1.031274 (imp-3893 anchor)
const TILT_N80 = rowAt(80).tilt;               // ~1.002322 (imp-3893 anchor)
const TILT_N215 = rowAt(215).tilt;             // ~1.000564

// -- (Q2) The additive offset delta_n peaks early, then declines (no limit) -----------
let OFFSET_ARGMAX = ROWS[0];
for (const r of ROWS) if (r.driftOffset > OFFSET_ARGMAX.driftOffset) OFFSET_ARGMAX = r;
let offsetMonotoneDeclineAfterPeak = true;
for (let i = OFFSET_ARGMAX.n - N_LO + 1; i < ROWS.length; i += 1) {
  if (ROWS[i].driftOffset >= ROWS[i - 1].driftOffset) offsetMonotoneDeclineAfterPeak = false;
}
const OFFSET_N80 = rowAt(80).driftOffset;      // ~0.6266
const OFFSET_N215 = rowAt(215).driftOffset;    // ~0.4965
// offset at 215 sits well below its peak -- the ~0.7 imp-3893 offset was a near-peak reading.
const offsetDecayedFromPeak = OFFSET_N215 < 0.75 * OFFSET_ARGMAX.driftOffset;

// -- (3) eps_n^true sign-change reproduces the imp-3849 converged crossing at n = 149 --
let EPS_TRUE_SIGN_CHANGE_N = null;
for (let i = 1; i < ROWS.length; i += 1) {
  if (EPS_TRUE_SIGN_CHANGE_N === null && ROWS[i - 1].epsTrue > 0 && ROWS[i].epsTrue < 0) {
    EPS_TRUE_SIGN_CHANGE_N = ROWS[i].n;
    break;
  }
}
// at large n both eps corrections are negative with eps_model MORE negative (keeps T_n > 1).
const EPS_TRUE_N200 = rowAt(200).epsTrue;      // ~ -3.43e-4
const EPS_MODEL_N200 = rowAt(200).epsModel;    // ~ -9.69e-4
const modelMoreNegativeAt200 = EPS_MODEL_N200 < EPS_TRUE_N200 && EPS_TRUE_N200 < 0;

// -- (4) Inner-resolution convergence self-check (4800 vs 7200 inner panels) ----------
let MAX_GRID_DELTA = 0;
for (const r of ROWS) {
  const d = Math.abs(r.tilt - r.tiltFiner);
  if (d > MAX_GRID_DELTA) MAX_GRID_DELTA = d;
}

// -- Classification ------------------------------------------------------------------
const verdict =
  tiltStrictlyShrinks &&
  tiltAllAbove1 &&
  Math.abs(TILT_N10 - 1.031274) < 1e-4 &&
  Math.abs(TILT_N80 - 1.002322) < 1e-4 &&
  Math.abs(TILT_N215 - 1.000564) < 1e-4 &&
  OFFSET_ARGMAX.n >= 20 &&
  OFFSET_ARGMAX.n <= 30 &&
  offsetMonotoneDeclineAfterPeak &&
  offsetDecayedFromPeak &&
  EPS_TRUE_SIGN_CHANGE_N === 149 &&
  modelMoreNegativeAt200 &&
  MAX_GRID_DELTA < 5e-7
    ? 'EXTENDING-imp-3893-TO-THE-imp-3849-CROSSING-REGIME-n~215:-(Q1)-THE-SUB-3%-MOMENT-RATIO-TILT' +
      '-T_n=Q_n^true/Q_n^model-KEEPS-SHRINKING-MONOTONICALLY-(1.031274-AT-n=10-TO-1.000564-AT-n=215),' +
      '-STAYS-ABOVE-1-EVERYWHERE,-DOES-NOT-PLATEAU;-(Q2)-THE-ADDITIVE-OFFSET' +
      '-delta_n=(T_n-1)n(1+4tau*)-DOES-NOT-APPROACH-A-LIMIT:-IT-PEAKS-AT-0.7159-AT-n=24-THEN-DECLINES' +
      '-MONOTONICALLY-TO-0.4965-AT-n=215-(THE-imp-3893-~0.7-OFFSET-WAS-A-NEAR-PEAK-READING-OF-A-DECAYING' +
      '-HUMP);-THE-TILT-THREADS-THE-imp-3849-eps_n^true-SIGN-CHANGE-AT-n=149-FEATURELESSLY-BECAUSE' +
      '-T_n-1=eps^true-eps^model-STAYS-POSITIVE-(eps^model-MORE-NEGATIVE-AT-LARGE-n)'
    : 'INDETERMINATE';

export const IMP3913_MOMENT_TILT_SADDLE_CROSSING_REGIME = Object.freeze({
  id: 'imp-3913-moment-tilt-saddle-crossing-regime',
  ticket: 'imp-3913',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-3893-model-fidelity-moment-discrepancy.js',
  usesInnerConvergedLadder: 'imp-3849-saddle-ratio-well-depth-inner-converged.js',
  relatedDriftTail: 'imp-3735-moment-ratio-correction-tail.js',
  relatedMomentRatio: 'imp-3646-remainder-tail-moment-ratio-asymptotics.js',

  summary:
    'EXTENDS the imp-3893 moment-ratio tilt T_n = Q_n^true/Q_n^model and its additive drift offset ' +
    'delta_n = (T_n-1) n(1+4 tau*) from n = 10..80 into the imp-3849 exact-saddle crossing regime n ~ 215, ' +
    'answering the two questions imp-3893 left open. The TRUE moments are formed to M_217 with the imp-3849 ' +
    'INNER-CONVERGED machinery (Neumaier-compensated Simpson, inner A(tau) on [0,2] with 4800 panels, outer ' +
    'T_A = 2, NM = 3200, tau > 1.45 => A = 0 guard; self-checked vs 7200 inner panels) because at T_A = 8 the ' +
    'tau^m weight overflows once m > ~340 and the inner (not outer) resolution limits the ratio at large n; the ' +
    'surrogate Q_n^model is the imp-3893 saddle-centred quadrature. FINDINGS: (Q1) the sub-3% tilt KEEPS ' +
    'SHRINKING MONOTONICALLY and does NOT plateau -- T_n falls strictly and stays above 1 (T_10 = 1.031274, ' +
    'T_80 = 1.002322 reproducing imp-3893, T_215 = 1.000564), so Q_n^true exceeds Q_n^model at every n; ' +
    '(Q2) the additive offset delta_n does NOT approach a limit -- it peaks at delta_max = 0.7159 at n = 24 then ' +
    'declines monotonically (delta_80 = 0.6266, delta_215 = 0.4965 and still falling), so the imp-3893 ~0.7 ' +
    'offset was a near-peak reading of a decaying hump; (3) the extended ladder reproduces the imp-3849 ' +
    'converged eps_n^true sign-change at n = 149 and the tilt threads it featurelessly because T_n - 1 = ' +
    'eps^true - eps^model stays positive (eps^model is more negative at large n); (4) grid-converged, ' +
    'max|T_n(4800)-T_n(7200)| = 2.4e-8. MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; operator ' +
    'positivity (imp-3066) untouched; no QED; no refereed bound is changed. imp-3893/imp-3849 intact.',

  method: Object.freeze({
    tiltDef: 'T_n = Q_n^true/Q_n^model, Q_n = M_(n+2)/M_n, tau* root of n = 4 pi tau* e^{4 tau*}',
    offsetDef: 'delta_n = (T_n - 1) n(1+4 tau*) -- the imp-3893 leading additive drift offset from the tilt',
    trueLadder: 'imp-3849 inner-converged: inner A(tau) on [0,2] with 4800 panels, Neumaier-compensated, outer T_A=2 NM=3200, tau>1.45 => A=0 guard, moments to M_217',
    whyInnerConverged: 'at T_A=8 tau^m overflows to Inf*(A=0)=NaN once m > ~340, and (imp-3735/imp-3849) the INNER A(tau) resolution not the outer grid limits the ratio at large n',
    surrogateRatio: 'Q_n^model by saddle-centred Simpson of tau^k exp(n ln tau - pi e^{4 tau}) on [tau*-16 sigma, tau*+16 sigma], quadN=150000 (imp-3893)',
    innerSelfCheck: 'tilt recomputed with 7200 inner panels; max deviation over n=6..215 reported',
    evaluatedAtIntegerN: 'n = 6..215 integer, so the offset argmax and monotonicity are located exactly',
    selfComputing: true,
  }),

  measured: Object.freeze({
    nMax: N_MAX,
    momentMax: MMAX,
    tAxisEndpoint: T_A,
    momentPanels: NM,
    innerHi: INNER_HI,
    innerFine: INNER_FINE,
    innerFiner: INNER_FINER,
    quadN: QUAD_N,
    quadWidthSigma: QUAD_W,
    // (Q1) the tilt keeps shrinking monotonically, no plateau
    tiltN10: TILT_N10,                          // ~1.031274 (imp-3893 anchor)
    tiltN80: TILT_N80,                          // ~1.002322 (imp-3893 anchor)
    tiltN149: rowAt(149).tilt,                  // ~1.000958
    tiltN215: TILT_N215,                        // ~1.000564
    tiltStrictlyShrinks,
    tiltAllAbove1,
    // (Q2) the additive offset peaks then declines, no limit
    offsetArgmaxN: OFFSET_ARGMAX.n,             // ~24
    offsetMax: OFFSET_ARGMAX.driftOffset,       // ~0.7159
    offsetN80: OFFSET_N80,                      // ~0.6266
    offsetN149: rowAt(149).driftOffset,         // ~0.5457
    offsetN215: OFFSET_N215,                    // ~0.4965
    offsetMonotoneDeclineAfterPeak,
    offsetDecayedFromPeak,
    // (3) eps sign-change cross-check to imp-3849
    epsTrueSignChangeN: EPS_TRUE_SIGN_CHANGE_N, // 149 (imp-3849 converged crossing)
    epsTrueN200: EPS_TRUE_N200,                 // ~ -3.43e-4
    epsModelN200: EPS_MODEL_N200,               // ~ -9.69e-4
    modelMoreNegativeAt200,
    // (4) grid convergence
    maxGridDelta: MAX_GRID_DELTA,               // ~2.4e-8
    rungs: Object.freeze(RUNGS),
    verdict,
  }),

  interpretation: Object.freeze({
    tiltKeepsShrinkingNoPlateau:
      'ANSWER to imp-3893 Q1: the sub-3% moment-ratio tilt T_n = Q_n^true/Q_n^model does NOT plateau -- it keeps ' +
      'shrinking strictly and monotonically from 1.031274 at n = 10 to 1.000564 at n = 215, staying above 1 at ' +
      'every n. The real Phi-autocorrelation A(tau) over-weights the tilted moment ratio relative to the imp-3665 ' +
      'super-exponential surrogate by a fraction that falls below one part in 1700 by the crossing regime and is ' +
      'still shrinking -- consistent with imp-3690 (the residual r(tau) approaching a constant, so only its ' +
      'tau-dependence across an ever-narrowing saddle window survives in the ratio).',
    offsetPeaksThenDecaysNoLimit:
      'ANSWER to imp-3893 Q2: the additive drift offset delta_n = (T_n - 1) n(1+4 tau*) does NOT approach a nonzero ' +
      'limit. It is a decaying hump: rising to a single interior maximum delta_max = 0.7159 at n = 24, then ' +
      'declining monotonically (delta_80 = 0.6266, delta_149 = 0.5457, delta_215 = 0.4965) with no plateau. The ' +
      '~0.7 offset imp-3893 reported over n = 10..80 was a near-peak reading; by the imp-3849 crossing regime it has ' +
      'decayed ~30%. Because delta_n ~ (eps^true - eps^model) n(1+4 tau*) and both eps corrections shrink, the ' +
      'lever n(1+4 tau*) grows slower than the tilt gap eps^true - eps^model shrinks, so the product declines.',
    tiltThreadsEpsSignChange:
      'The extended TRUE ladder reproduces the imp-3849 converged eps_n^true sign-change at n = 149 (eps_148 > 0 > ' +
      'eps_149), a cross-check tying this ladder to imp-3849 despite forming moments only to M_217 (vs imp-3849 ' +
      'M_628). The tilt T_n shows NO feature at n = 149 because T_n - 1 = eps_n^true - eps_n^model (leading) and at ' +
      'large n BOTH corrections go negative with eps^model more negative (eps_200^true = -3.43e-4 vs eps_200^model ' +
      '= -9.69e-4). Their positive difference is exactly what keeps T_n above 1 and shrinking smoothly.',
    answerToTicket:
      'DIRECT ANSWER to imp-3913: extending the imp-3893 tilt/offset to n ~ 215, the sub-3% tilt keeps shrinking ' +
      'monotonically (no plateau; T_215 = 1.000564) and the additive offset delta_n does NOT stabilize -- it peaks ' +
      'at 0.7159 near n = 24 and decays to 0.4965 by n = 215, so the imp-3893 ~0.7 offset was a near-peak value of ' +
      'a decaying hump, not a limiting constant.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    leavesSiblingAssertionsIntact: true,
    derivationScope:
      'Extends the imp-3893 moment-ratio tilt T_n = Q_n^true/Q_n^model and additive offset delta_n = ' +
      '(T_n-1) n(1+4 tau*) from n=10..80 to n~215 using the imp-3849 inner-converged TRUE ladder, and reports ' +
      'whether the tilt plateaus (it does not) and whether the offset stabilizes (it does not, peaking then ' +
      'decaying). Grid-CONVERGENCE stability only -- not a certified error bound. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    gridStabilityNotCertifiedBound:
      'Values are grid-CONVERGENCE stable (inner 4800 vs 7200 panels agree to ~2.4e-8); the shared finite ' +
      'NPHI = 10 kernel truncation and Simpson order remain the residual floor, so the shrinking-tilt / ' +
      'decaying-offset picture is a stable located property of this truncated-kernel model, not a certified bound.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP3913_MOMENT_TILT_SADDLE_CROSSING_REGIME_ASSERTIONS = [
  {
    id: 'imp3913-reproduces-imp3893-tilt-anchors',
    why: 'Cross-check: the inner-converged ladder must reproduce the imp-3893 tilt anchors T_10 ~ 1.0313 and ' +
         'T_80 ~ 1.0023 (at small n the inner resolution is immaterial), to 1e-4.',
    holds: () => Math.abs(TILT_N10 - 1.031274) < 1e-4 && Math.abs(TILT_N80 - 1.002322) < 1e-4,
  },
  {
    id: 'imp3913-tilt-keeps-shrinking-no-plateau',
    why: 'ANSWER Q1: T_n must shrink STRICTLY and stay above 1 across n=6..215 (no plateau), reaching ' +
         'T_215 ~ 1.000564 -- a sub-0.1% tilt still falling at the imp-3849 crossing regime.',
    holds: () =>
      tiltStrictlyShrinks && tiltAllAbove1 && Math.abs(TILT_N215 - 1.000564) < 1e-4 && TILT_N215 < TILT_N80,
  },
  {
    id: 'imp3913-offset-peaks-then-declines-no-limit',
    why: 'ANSWER Q2: the additive offset delta_n must peak at an interior n in [20,30] (delta_max ~ 0.716 at ' +
         'n=24) then decline monotonically, ending well below its peak (delta_215 ~ 0.497, < 0.75 of the max).',
    holds: () =>
      OFFSET_ARGMAX.n >= 20 &&
      OFFSET_ARGMAX.n <= 30 &&
      Math.abs(OFFSET_ARGMAX.driftOffset - 0.7159) < 5e-3 &&
      offsetMonotoneDeclineAfterPeak &&
      offsetDecayedFromPeak &&
      Math.abs(OFFSET_N215 - 0.4965) < 5e-3,
  },
  {
    id: 'imp3913-eps-sign-change-matches-imp3849',
    why: 'Cross-check: the extended TRUE ladder must reproduce the imp-3849 converged eps_n^true sign-change at ' +
         'n = 149 (eps_148 > 0 > eps_149), and both eps corrections must be negative at n=200 with eps^model ' +
         'more negative (which keeps T_n above 1).',
    holds: () => EPS_TRUE_SIGN_CHANGE_N === 149 && modelMoreNegativeAt200,
  },
  {
    id: 'imp3913-inner-resolution-converged',
    why: 'The tilt must be inner-resolution-pinned: PRIMARY (4800 inner panels) and FINER (7200) agree to ' +
         '< 5e-7 across n=6..215 (max ~2.4e-8), so the plateau/limit answers are not quadrature artifacts.',
    holds: () => MAX_GRID_DELTA < 5e-7,
  },
  {
    id: 'imp3913-verdict-not-indeterminate',
    why: 'The classified verdict must record the monotone-shrinking tilt (no plateau) and the peak-then-decay ' +
         'offset (no limit) -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp3913-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement/characterization only, grid-stability not a certified bound, ' +
         'mass-feasibility necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3913_MOMENT_TILT_SADDLE_CROSSING_REGIME.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3913_MOMENT_TILT_SADDLE_CROSSING_REGIME_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3913-moment-tilt-saddle-crossing-regime assertion failed: ${assertion.id}`);
  }
}

export default IMP3913_MOMENT_TILT_SADDLE_CROSSING_REGIME;
