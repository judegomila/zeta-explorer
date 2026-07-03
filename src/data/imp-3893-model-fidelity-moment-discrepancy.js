/**
 * @module imp-3893-model-fidelity-moment-discrepancy
 * @fileoverview imp-3893 -- MEASURE the moment-by-moment discrepancy between the imp-3665
 *   super-exponential SURROGATE weight and the TRUE Phi-autocorrelation weight that imp-3871
 *   localized as the source of the L_n = 1 crossing gap (model crosses n ~ 18.4, measured
 *   n ~ 48.6). imp-3871 PROVED the ~30-unit gap is a MODEL-FIDELITY gap -- even the exact
 *   resummation of the surrogate integrand tau^n exp(-pi e^{4 tau}) crosses at n ~ 18.4, while
 *   the measurement built from the real A(tau) crosses at n ~ 48.6 -- but never quantified HOW
 *   the two weightings differ moment-by-moment. This module does exactly that.
 *
 *   THE OBJECT (reuses the imp-3735/imp-3848/imp-3871 machinery verbatim)
 *   -------------------------------------------------------------------
 *   The reduced moment-ratio drift factor is
 *       L_n = eps_n * n(1 + 4 tau*),   eps_n = Q_n / tau*^2 - 1,   Q_n = M_(n+2) / M_n,
 *   with tau*(n) the imp-3646 saddle (root of n = 4 pi tau* e^{4 tau*}) and M_m the m-th
 *   moment of the WEIGHT. Two weights feed the same saddle tau*(n):
 *       TRUE:      M_m^true  = int_0^inf tau^m A(tau) dtau,  A = real Phi-autocorrelation
 *       SURROGATE: M_m^model = int_0^inf tau^m exp(-pi e^{4 tau}) dtau  (imp-3665 super-exp)
 *   The imp-3690 residual r(tau) = -ln A(tau) - pi e^{4 tau} -> C_inf = -ln(pi Phi(0)/2) makes
 *   the two weights differ by the factor exp(-r(tau)); a CONSTANT r would cancel out of every
 *   moment RATIO, so the crossing gap is driven entirely by the tau-DEPENDENCE of r across the
 *   saddle window.
 *
 *   THE MOMENT-BY-MOMENT DISCREPANCY (this module)
 *   ----------------------------------------------
 *   Define the moment-ratio TILT (the "ratio of Q_n contributions" the ticket asks for)
 *       T_n := Q_n^true / Q_n^model = (M_(n+2)^true / M_n^true) / (M_(n+2)^model / M_n^model).
 *   Q_n^model is computed by direct saddle-centred Simpson quadrature of tau^k exp(n ln tau -
 *   pi e^{4 tau}) (grid-converged to ~1e-15, no series truncation); Q_n^true from the converged
 *   imp-3735 moment ladder (T_A = 8, NM = 3200, inner A resolution 4800). Writing
 *   Q_n^true = T_n Q_n^model and eps_n = Q_n / tau*^2 - 1 splits the drift discrepancy exactly:
 *       L_n^true - L_n^model = [ (T_n - 1) + eps_n^model (T_n - 1) ] * n(1 + 4 tau*)
 *                            = delta_n + eps_n^model (T_n - 1) n(1 + 4 tau*),
 *       delta_n := (T_n - 1) * n(1 + 4 tau*)   (the leading additive drift offset from the tilt).
 *
 *   THREE readings (self-computing)
 *   -------------------------------
 *     (1) THE WEIGHTING DISCREPANCY IS A SUB-3% MULTIPLICATIVE TILT. T_n = Q_n^true / Q_n^model
 *         is small and SHRINKS monotonically: 1.0313 at n = 10 down to 1.0023 at n = 80. The
 *         true and surrogate moment RATIOS Q_n agree to better than 3% everywhere -- the real
 *         A(tau) barely reweights the tilted moments relative to the super-exponential surrogate.
 *     (2) BUT THAT TINY TILT IS LEVERAGED BY THE eps_n NEAR-CANCELLATION INTO THE FULL CROSSING
 *         GAP. Because eps_n = Q_n / tau*^2 - 1 is a difference of two nearly-equal quantities
 *         (Q_n / tau*^2 within a few % of 1), the sub-3% tilt T_n enters L_n as an ADDITIVE
 *         offset delta_n = (T_n - 1) n(1 + 4 tau*) ~ 0.65-0.71 that accounts for 94% (n = 10)
 *         rising to 99.8% (n = 50) of the entire L_n^true - L_n^model discrepancy. The residual
 *         is the second-order eps_n^model (T_n - 1) piece.
 *     (3) THAT ~0.7 OFFSET SHIFTS THE L_n = 1 CROSSING BY ~30 UNITS -- THE FULL MODEL-FIDELITY
 *         GAP. The surrogate drift crosses 1 at n ~ 18.38; adding the measured offset delta_n
 *         pushes the crossing to n ~ 48.58 (reproducing the imp-3871 model/measured crossings).
 *         Since delta_n is a property of the WEIGHT (true A vs surrogate), NOT of the saddle
 *         expansion order, no number of Laplace terms can produce it -- confirming imp-3871.
 *
 *   BOTTOM LINE. The true-vs-surrogate weighting discrepancy is a sub-3% multiplicative tilt in
 *   the moment ratio Q_n, T_n = Q_n^true / Q_n^model (1.031 -> 1.002 over n = 10..80). The
 *   eps_n = Q_n / tau*^2 - 1 near-cancellation leverages that tilt into an additive drift offset
 *   delta_n = (T_n - 1) n(1 + 4 tau*) ~ 0.7 that supplies 94-99.8% of the L_n^true - L_n^model
 *   gap and moves the L_n = 1 crossing from n ~ 18.4 to n ~ 48.6. This QUANTIFIES the imp-3871
 *   model-fidelity gap moment-by-moment: it is a weight discrepancy amplified by a near-
 *   cancellation, not something any saddle order can close.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / CHARACTERIZATION ONLY, at the RH-equivalent scale class. This decomposes a
 *   fixed-weight moment-ratio drift factor into the true-vs-surrogate moment tilt and quantifies
 *   how the imp-3665 super-exponential surrogate A(tau) ~ exp(-pi e^{4 tau}) mis-weights the
 *   tilted moments relative to the real A(tau). It establishes NO operator positivity.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0 sign-
 *   positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA. Grid-CONVERGENCE stability only.
 *
 *   @see imp-3871-saddle-correction-fifth-sixth-derivative.js (localized the gap as model-fidelity; quantified here)
 *   @see imp-3690-a-weight-superexp-subleading-correction.js (r(tau) = -ln A - pi e^{4 tau} -> C_inf)
 *   @see imp-3735-moment-ratio-correction-tail.js (measured eps_n, L_n drift through 1)
 *   @see imp-3646-remainder-tail-moment-ratio-asymptotics.js (Q_n/tau*^2 -> 1, saddle relation)
 *
 *   Ticket: imp-3893 (numerical, medium).
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

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds. Inner resolution 4800 (imp-3735).
function makeAutocorr(innerN) {
  return (tau) => simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, innerN);
}

/** Build TRUE moments M_0..MMAX on a [0,T_A] Simpson grid of NM panels, inner A resolution innerN. */
function buildMoments(tAxisEndpoint, nPanels, mMax, innerN) {
  const autocorr = makeAutocorr(innerN);
  const h = tAxisEndpoint / nPanels;
  const aGrid = [];
  for (let j = 0; j <= nPanels; j += 1) aGrid.push(autocorr(j * h));
  const moments = {};
  for (let m = 0; m <= mMax; m += 1) {
    let sum = 0;
    for (let j = 0; j <= nPanels; j += 1) {
      const tau = j * h;
      const w = j === 0 || j === nPanels ? 1 : (j % 2 === 0 ? 2 : 4);
      sum += w * Math.pow(tau, m) * aGrid[j];
    }
    moments[m] = (sum * h) / 3;
  }
  return moments;
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

// -- Converged TRUE moment ladder identical to imp-3735/imp-3871 (T_A=8, NM=3200, inner=4800) --
const T_A = 8;
const NM = 3200;
const MMAX = 82;                                // need M_82 = M_(80+2) for Q_80
const INNER_FINE = 4800;
const M_TRUE = buildMoments(T_A, NM, MMAX, INNER_FINE);

/** TRUE moment ratio Q_n^true = M_(n+2)^true / M_n^true (real Phi-autocorrelation weight). */
function qTrue(n) {
  return M_TRUE[n + 2] / M_TRUE[n];
}

/**
 * SURROGATE moment ratio Q_n^model = <tau^2>_model of the integrand tau^n exp(-pi e^{4 tau})
 * by direct saddle-centred Simpson quadrature (log-domain, no series truncation, no underflow).
 */
function qModel(n, quadN, widthSigma) {
  const ts = saddleTau(n);
  const sig = Math.sqrt(saddleSigma2(n));
  const lo = Math.max(1e-12, ts - widthSigma * sig);
  const hi = ts + widthSigma * sig;
  const logf = (tau) => n * Math.log(tau) - Math.PI * Math.exp(4 * tau);
  const fmax = logf(ts);
  const num = simpson((t) => t * t * Math.exp(logf(t) - fmax), lo, hi, quadN);
  const den = simpson((t) => Math.exp(logf(t) - fmax), lo, hi, quadN);
  return num / den;
}

const QUAD_N = 150000;                          // grid-converged for the surrogate quadrature
const QUAD_W = 16;                              // saddle-window half-width in sigma

// -- Per-n drift factors under the two weights, same saddle tau*(n) -------------------
function driftTrue(n) {
  const ts = saddleTau(n);
  return (qTrue(n) / (ts * ts) - 1) * n * (1 + 4 * ts);   // L_n^true (real A(tau))
}
function driftModel(n) {
  const ts = saddleTau(n);
  return (qModel(n, QUAD_N, QUAD_W) / (ts * ts) - 1) * n * (1 + 4 * ts); // L_n^model (surrogate)
}

/** Moment-ratio tilt T_n = Q_n^true / Q_n^model -- the "ratio of Q_n contributions". */
function tilt(n) {
  return qTrue(n) / qModel(n, QUAD_N, QUAD_W);
}

/** Leading additive drift offset from the tilt: delta_n = (T_n - 1) * n(1 + 4 tau*). */
function driftOffset(n) {
  const ts = saddleTau(n);
  return (tilt(n) - 1) * n * (1 + 4 * ts);
}

// -- Crossing-of-one locator: scan integer n, linearly interpolate the >=1 -> <1 transition ------
function crossingOfOne(fn, nLo, nHi) {
  let prev = fn(nLo);
  let prevN = nLo;
  for (let n = nLo + 1; n <= nHi; n += 1) {
    const v = fn(n);
    if (prev >= 1 && v < 1) return prevN + (prev - 1) / (prev - v);
    prev = v;
    prevN = n;
  }
  return null;
}

const CROSS_TRUE = crossingOfOne(driftTrue, 10, 80);    // ~48.58 (real A(tau))
const CROSS_MODEL = crossingOfOne(driftModel, 10, 80);  // ~18.38 (surrogate)

// -- Rung table n = 10..80 (step 5): the moment-by-moment discrepancy decomposition ----
const RUNGS = [];
for (let n = 10; n <= 80; n += 5) {
  const ts = saddleTau(n);
  const qt = qTrue(n);
  const qm = qModel(n, QUAD_N, QUAD_W);
  const t = qt / qm;
  const lever = n * (1 + 4 * ts);
  const lt = (qt / (ts * ts) - 1) * lever;
  const lm = (qm / (ts * ts) - 1) * lever;
  const delta = (t - 1) * lever;
  RUNGS.push(
    Object.freeze({
      n,
      saddleTau: ts,
      qTrue: qt,
      qModel: qm,
      tilt: t,                                  // T_n = Q_n^true / Q_n^model
      driftTrue: lt,                            // L_n^true
      driftModel: lm,                           // L_n^model
      driftOffset: delta,                       // delta_n = (T_n-1) n(1+4 tau*)
      offsetFractionOfGap: delta / (lt - lm),   // delta_n / (L_n^true - L_n^model)
    })
  );
}

// -- Diagnostics ---------------------------------------------------------------------
// (1) The weighting discrepancy is a sub-3% multiplicative tilt that SHRINKS with n.
const TILT_GRID = [10, 20, 30, 40, 50, 60, 70, 80].map((n) => tilt(n));
function strictlyDecreasing(vals) {
  for (let i = 1; i < vals.length; i += 1) if (vals[i] >= vals[i - 1]) return false;
  return true;
}
const tiltShrinks = strictlyDecreasing(TILT_GRID);
const tiltIsSmall = TILT_GRID.every((t) => t > 1 && t < 1.05);   // all in (1, 1.05)
const TILT_MAX = TILT_GRID[0];                                   // ~1.0313 at n=10
const TILT_MIN = TILT_GRID[TILT_GRID.length - 1];               // ~1.0023 at n=80

// (2) The tiny tilt supplies the DOMINANT share of the L_n^true - L_n^model gap.
const OFFSET_FRAC_GRID = [10, 20, 30, 40, 50].map((n) => {
  const ts = saddleTau(n);
  const qt = qTrue(n);
  const qm = qModel(n, QUAD_N, QUAD_W);
  const lever = n * (1 + 4 * ts);
  const lt = (qt / (ts * ts) - 1) * lever;
  const lm = (qm / (ts * ts) - 1) * lever;
  return ((qt / qm - 1) * lever) / (lt - lm);
});
const offsetDominates = OFFSET_FRAC_GRID.every((f) => f > 0.9 && f <= 1.0);
const offsetShareRisesTowardOne =
  OFFSET_FRAC_GRID[OFFSET_FRAC_GRID.length - 1] > OFFSET_FRAC_GRID[0] &&
  OFFSET_FRAC_GRID[OFFSET_FRAC_GRID.length - 1] > 0.99;

// (3) The offset moves the crossing ~30 units: surrogate ~18.4 -> measured ~48.6.
const crossingGapIsModelFidelity =
  CROSS_MODEL > 15 && CROSS_MODEL < 22 && CROSS_TRUE > 45 && CROSS_TRUE < 52 &&
  CROSS_TRUE - CROSS_MODEL > 25;

// (4) The surrogate moment ratio is grid-converged (two resolutions agree tightly).
const Q_MODEL_COARSE_18 = qModel(18, 80000, 12);
const Q_MODEL_FINE_18 = qModel(18, 400000, 20);
const qModelConverged = Math.abs(Q_MODEL_COARSE_18 - Q_MODEL_FINE_18) < 1e-6;

// (5) cross-check: reproduce the imp-3735/imp-3871 measured drift anchors (2.064 at n=10, 0.567 at n=80).
const reproducesImp3735 =
  Math.abs(driftTrue(10) - 2.064) < 0.02 && Math.abs(driftTrue(80) - 0.567) < 0.02;

// -- Classification ------------------------------------------------------------------
const verdict =
  tiltShrinks &&
  tiltIsSmall &&
  offsetDominates &&
  offsetShareRisesTowardOne &&
  crossingGapIsModelFidelity &&
  qModelConverged &&
  reproducesImp3735
    ? 'THE-TRUE-vs-SURROGATE-WEIGHTING-DISCREPANCY-IS-A-SUB-3%-MULTIPLICATIVE-TILT-T_n=Q_n^true/Q_n^model-(1.0313-AT-n=10-SHRINKING-TO-1.0023-AT-n=80);-THE-eps_n=Q_n/tau*^2-1-NEAR-CANCELLATION-LEVERAGES-IT-INTO-AN-ADDITIVE-DRIFT-OFFSET-delta_n=(T_n-1)n(1+4tau*)~0.7-THAT-SUPPLIES-94%-TO-99.8%-OF-THE-L_n^true-L_n^model-GAP-AND-MOVES-THE-L_n=1-CROSSING-FROM-n~18.38-TO-n~48.58;-THE-imp-3871-MODEL-FIDELITY-GAP-IS-A-WEIGHT-DISCREPANCY-AMPLIFIED-BY-A-NEAR-CANCELLATION,-NOT-ANY-SADDLE-ORDER'
    : 'INDETERMINATE';

export const IMP3893_MODEL_FIDELITY_MOMENT_DISCREPANCY = Object.freeze({
  id: 'imp-3893-model-fidelity-moment-discrepancy',
  ticket: 'imp-3893',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  quantifiesModule: 'imp-3871-saddle-correction-fifth-sixth-derivative.js',
  relatedResidual: 'imp-3690-a-weight-superexp-subleading-correction.js',
  relatedDriftMeasurement: 'imp-3735-moment-ratio-correction-tail.js',
  relatedMomentRatio: 'imp-3646-remainder-tail-moment-ratio-asymptotics.js',

  summary:
    'QUANTIFIES moment-by-moment the imp-3871 model-fidelity gap between the imp-3665 super-exponential SURROGATE weight ' +
    'A(tau) ~ exp(-pi e^{4 tau}) and the TRUE Phi-autocorrelation weight that makes the reduced moment-ratio drift ' +
    'L_n = eps_n n(1+4 tau*) = (Q_n/tau*^2 - 1) n(1+4 tau*) cross 1 at n~18.4 (surrogate) versus n~48.6 (real A(tau)). ' +
    'Defining the moment-ratio TILT T_n = Q_n^true/Q_n^model = (M_(n+2)^true/M_n^true)/(M_(n+2)^model/M_n^model) -- ' +
    'Q_n^model by grid-converged saddle-centred quadrature of tau^k exp(n ln tau - pi e^{4 tau}), Q_n^true from the ' +
    'converged imp-3735 moment ladder -- gives: (1) the weighting discrepancy is a SUB-3% multiplicative tilt that ' +
    'SHRINKS monotonically (T_n: 1.0313 at n=10 down to 1.0023 at n=80); (2) the eps_n = Q_n/tau*^2 - 1 near-cancellation ' +
    'LEVERAGES that tilt into an additive drift offset delta_n = (T_n-1) n(1+4 tau*) ~ 0.65-0.71 that supplies 94% ' +
    '(n=10) rising to 99.8% (n=50) of the entire L_n^true - L_n^model gap; (3) that ~0.7 offset shifts the L_n=1 ' +
    'crossing ~30 units, from n~18.38 to n~48.58, reproducing the imp-3871 model/measured crossings. Since delta_n is a ' +
    'property of the WEIGHT (true A vs surrogate), not the saddle expansion order, no number of Laplace terms can ' +
    'produce it -- confirming and QUANTIFYING the imp-3871 localization: the gap is a weight discrepancy amplified by a ' +
    'near-cancellation. MEASUREMENT/CHARACTERIZATION, RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity ' +
    '(imp-3066) untouched; no RH verdict, no QED; Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  derivation: Object.freeze({
    driftDef: 'L_n = eps_n n(1+4 tau*) = (Q_n/tau*^2 - 1) n(1+4 tau*), Q_n = M_(n+2)/M_n, tau* root of n = 4 pi tau* e^{4 tau*}',
    twoWeights: 'M_m^true = int tau^m A(tau) dtau (real Phi-autocorrelation); M_m^model = int tau^m exp(-pi e^{4 tau}) dtau (imp-3665 surrogate)',
    residualLink: 'weights differ by exp(-r(tau)), r(tau) = -ln A - pi e^{4 tau} -> C_inf (imp-3690); a CONSTANT r cancels out of every moment ratio, so the gap is driven by the tau-dependence of r',
    tiltDef: 'T_n = Q_n^true/Q_n^model = (M_(n+2)^true/M_n^true)/(M_(n+2)^model/M_n^model) -- the ratio of Q_n contributions',
    exactSplit: 'L_n^true - L_n^model = [(T_n - 1) + eps_n^model (T_n - 1)] n(1+4 tau*) = delta_n + eps_n^model (T_n-1) n(1+4 tau*)',
    offsetDef: 'delta_n = (T_n - 1) n(1+4 tau*) -- the leading additive drift offset from the sub-3% moment tilt',
    qModelQuadrature: 'Q_n^model by saddle-centred Simpson of tau^k exp(n ln tau - pi e^{4 tau}) on [tau*-16 sigma, tau*+16 sigma], quadN=150000 (log-domain, no underflow, no truncation)',
    qTrueLadder: 'Q_n^true from the converged imp-3735/imp-3871 moment ladder: A(tau) inner Simpson n=4800 on [0,7], moments on T_A=8, NM=3200 grid',
    selfComputing: true,
  }),

  measured: Object.freeze({
    tAxisEndpoint: T_A,
    momentPanels: NM,
    innerFine: INNER_FINE,
    quadN: QUAD_N,
    quadWidthSigma: QUAD_W,
    crossingModel: CROSS_MODEL,                      // ~18.38 (surrogate)
    crossingTrue: CROSS_TRUE,                        // ~48.58 (real A(tau))
    crossingShift: CROSS_TRUE - CROSS_MODEL,         // ~30.2
    tiltMax: TILT_MAX,                               // ~1.0313 at n=10
    tiltMin: TILT_MIN,                               // ~1.0023 at n=80
    offsetFractionFirst: OFFSET_FRAC_GRID[0],        // ~0.938 (n=10)
    offsetFractionLast: OFFSET_FRAC_GRID[OFFSET_FRAC_GRID.length - 1], // ~0.998 (n=50)
    qModelConvergenceGap: Math.abs(Q_MODEL_COARSE_18 - Q_MODEL_FINE_18),
    driftTrueAt10: driftTrue(10),                    // ~2.064 (imp-3735 anchor)
    driftTrueAt80: driftTrue(80),                    // ~0.567 (imp-3735 anchor)
    rungs: Object.freeze(RUNGS),
    tiltShrinks,
    tiltIsSmall,
    offsetDominates,
    offsetShareRisesTowardOne,
    crossingGapIsModelFidelity,
    qModelConverged,
    reproducesImp3735,
    verdict,
  }),

  interpretation: Object.freeze({
    discrepancyIsASubThreePercentTilt:
      'The moment-by-moment discrepancy between the true and surrogate weights is a SMALL multiplicative tilt in the ' +
      'moment RATIO: T_n = Q_n^true/Q_n^model runs from 1.0313 at n=10 down to 1.0023 at n=80, shrinking monotonically. ' +
      'The real Phi-autocorrelation A(tau) reweights the tilted moments by under 3% relative to the imp-3665 super-' +
      'exponential surrogate -- consistent with imp-3690, whose residual r(tau) approaches a constant so only its ' +
      'tau-dependence across the saddle window survives in the ratio.',
    nearCancellationLeveragesTheTilt:
      'That sub-3% tilt would be negligible were L_n not built from eps_n = Q_n/tau*^2 - 1, a difference of two nearly-' +
      'equal quantities (Q_n/tau*^2 sits within a few percent of 1). The near-cancellation amplifies the tilt into an ' +
      'ADDITIVE drift offset delta_n = (T_n - 1) n(1+4 tau*) ~ 0.65-0.71, which accounts for 94% of the L_n^true - ' +
      'L_n^model discrepancy at n=10 rising to 99.8% at n=50 (the small remainder is the second-order eps_n^model ' +
      '(T_n-1) piece). The weight discrepancy is tiny; its LEVERED effect on the drift is order-one.',
    offsetMovesTheCrossingThirtyUnits:
      'The ~0.7 additive offset shifts the L_n=1 crossing from the surrogate n~18.38 to the measured n~48.58 -- exactly ' +
      'the imp-3871 model/measured crossings, a ~30-unit gap. Because delta_n is a property of the WEIGHT (true A vs ' +
      'exp(-pi e^{4 tau})) and not of the saddle-expansion order, no number of higher-order Laplace terms can generate ' +
      'it. This QUANTIFIES the imp-3871 finding that the residual is a model-fidelity gap: it is a moment-weighting ' +
      'discrepancy amplified by the eps_n near-cancellation, and the honest next step is a better A(tau) surrogate.',
    answerToTicket:
      'DIRECT ANSWER to imp-3893: the surrogate-vs-true A(tau) weighting discrepancy is the sub-3% moment-ratio tilt ' +
      'T_n = Q_n^true/Q_n^model (1.031 -> 1.002 over n=10..80); it enters the drift as delta_n = (T_n-1) n(1+4 tau*) ~ ' +
      '0.7, supplying 94-99.8% of the L_n^true - L_n^model gap and moving the crossing from n~18.4 to n~48.6.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Decomposes a fixed-weight moment-ratio drift factor L_n into the true-vs-surrogate moment tilt T_n = ' +
      'Q_n^true/Q_n^model and the additive drift offset delta_n = (T_n-1) n(1+4 tau*), quantifying how the imp-3665 ' +
      'super-exponential surrogate A(tau) ~ exp(-pi e^{4 tau}) mis-weights the tilted moments relative to the real ' +
      'A(tau). Grid-CONVERGENCE stability only -- not a certified error bound. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP3893_MODEL_FIDELITY_MOMENT_DISCREPANCY_ASSERTIONS = [
  {
    id: 'imp3893-tilt-is-sub-3-percent-and-shrinks',
    why: 'The moment-ratio tilt T_n = Q_n^true/Q_n^model must be a small (>1, <1.05) multiplicative discrepancy that ' +
         'SHRINKS monotonically over n=10..80 (max ~1.0313 at n=10, min ~1.0023 at n=80).',
    holds: () => tiltShrinks && tiltIsSmall && Math.abs(TILT_MAX - 1.0313) < 0.01 && Math.abs(TILT_MIN - 1.0023) < 0.01,
  },
  {
    id: 'imp3893-offset-dominates-the-drift-gap',
    why: 'The additive offset delta_n = (T_n-1) n(1+4 tau*) must supply the DOMINANT share (>0.9, <=1.0) of the ' +
         'L_n^true - L_n^model gap, with the share rising toward 1 (94% at n=10 to 99.8% at n=50).',
    holds: () => offsetDominates && offsetShareRisesTowardOne,
  },
  {
    id: 'imp3893-offset-moves-crossing-thirty-units',
    why: 'The offset must move the L_n=1 crossing from the surrogate n~18.4 to the measured n~48.6 (a ~30-unit shift): ' +
         'crossingModel in (15,22), crossingTrue in (45,52), gap > 25.',
    holds: () => crossingGapIsModelFidelity,
  },
  {
    id: 'imp3893-crossings-match-imp3871',
    why: 'The reproduced surrogate/measured crossings must match the imp-3871 anchors: CROSS_MODEL ~18.38 (|.-18.38|<0.5) ' +
         'and CROSS_TRUE ~48.58 (|.-48.58|<0.7).',
    holds: () => Math.abs(CROSS_MODEL - 18.38) < 0.5 && Math.abs(CROSS_TRUE - 48.58) < 0.7,
  },
  {
    id: 'imp3893-qmodel-grid-converged',
    why: 'The surrogate moment ratio Q_n^model must be grid-converged: two saddle-centred quadrature resolutions agree ' +
         'to < 1e-6 at n=18.',
    holds: () => qModelConverged,
  },
  {
    id: 'imp3893-reproduces-imp3735-drift-anchors',
    why: 'Cross-check: the reused imp-3735/imp-3871 moment machinery must reproduce the measured L_n anchors 2.064 at ' +
         'n=10 and 0.567 at n=80 to ~0.02.',
    holds: () => reproducesImp3735,
  },
  {
    id: 'imp3893-verdict-quantifies-the-model-fidelity-gap',
    why: 'The classified verdict must record the sub-3% shrinking tilt, the offset dominance, and the ~30-unit crossing ' +
         'shift -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp3893-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement/characterization only, model-fidelity diagnostic not a certified bound, ' +
         'mass-feasibility necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3893_MODEL_FIDELITY_MOMENT_DISCREPANCY.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3893_MODEL_FIDELITY_MOMENT_DISCREPANCY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3893-model-fidelity-moment-discrepancy assertion failed: ${assertion.id}`);
  }
}

export default IMP3893_MODEL_FIDELITY_MOMENT_DISCREPANCY;
