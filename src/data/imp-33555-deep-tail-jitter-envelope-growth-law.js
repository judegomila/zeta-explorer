/**
 * @module imp-33555-deep-tail-jitter-envelope-growth-law
 * @fileoverview imp-33555 -- DERIVE the depth-growth LAW of the imp-33537 deep-tail plateau jitter
 *   envelope. imp-33537 measured that the worst-window ULP of the imp-33295 conservative
 *   grade4/400p=4000-node graded-GL plateau (scored vs the imp-33213 log-domain A_log target) GROWS
 *   with saddle depth across four dense width-31 integer windows W0..W3 centred on {300,395,495,595}
 *   (~50.2 ULP at n=300, ~37.5 at n=397, ~79.1 at n=510, ~74.0 at n=596), and NAMED a
 *   "depth-growing jitter envelope" but fit NO law. This module fits worst-window ULP vs rung n.
 *
 *       A(tau) = int_0^inf Phi(s) Phi(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel.
 *
 *   THE QUESTION imp-33537 LEFT OPEN
 *   --------------------------------
 *   imp-33537 established SPIKES-RECUR-AND-INTENSIFY: under a dense integer scan the fixed 4000-node
 *   plateau exceeds the strict 30-ULP bar on a rising fraction of deep-tail rungs and the worst-window
 *   ULP climbs from ~50 to ~79, crossing the imp-33316 widened 64-ULP band. It corrected the imp-33316
 *   "constant &lt; 64 ULP" reading to a "depth-growing jitter envelope", but it never quantified HOW the
 *   envelope grows -- whether the worst-window ULP follows a power law worstUlp ~ c n^p, a linear law,
 *   or a log law, and with what residual. Without a fitted law the "depth-growing" claim is qualitative.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   We take the FOUR worst-window ULP data points from the IDENTICAL imp-33537 dense-scan module
 *   (imported directly, so the grade4/400p=4000-node plateau rule and the imp-33213 A_log target are
 *   carried UNCHANGED) as (x_i, y_i) = (rung of the window worst, worst-window ULP), then least-squares
 *   fit THREE candidate growth laws and score each by R^2:
 *
 *     LINEAR   y = a + b x            (b = ULP per unit rung)
 *     POWER    y = c x^p   <=>  ln y = ln c + p ln x   (p = growth exponent, log-log fit)
 *     LOG      y = a + b ln x
 *
 *   MEASURED (data points from imp-33537 windowTable worst rungs):
 *
 *     window   rung (worst)   worst-window ULP
 *     W0        300            ~50.2
 *     W1        397            ~37.5
 *     W2        510            ~79.1
 *     W3        596            ~74.0
 *
 *   HEADLINE. The worst-window ULP shows a WEAK, POSITIVE depth trend -- the linear slope is
 *   positive (~0.12 ULP per rung), the log-log growth exponent is sub-linear positive (p ~ 0.8), and
 *   the crossover-anchored chord (deepest / shallowest worst ULP) exceeds 1. BUT NO candidate law
 *   fits cleanly: the best R^2 is only ~0.6, because the trend is NON-MONOTONE -- the W1 window (n~397)
 *   DIPS to ~37 ULP, BELOW the shallower W0 window (~50 ULP). A monotone power/linear/log growth law
 *   cannot reproduce that dip, so the fit residual is large by construction.
 *
 *   VERDICT. WEAK-NON-MONOTONE-DEPTH-TREND. The imp-33537 "depth-growing jitter envelope" is REAL as a
 *   loose trend (positive slope, positive exponent, chord &gt; 1) but is NOT a fittable growth law: with
 *   only four jittery lattice points, one of them a non-monotone dip, no power/linear/log law reaches
 *   R^2 &gt;= 0.75. The honest object is a depth-growing BAND CEILING (an upper envelope) rather than a
 *   tight power law: the central linear trend rises to ~77 ULP at the deepest rung and the empirical
 *   ceiling is the ~79 ULP worst window, but the per-window scatter (the W1 dip) is comparable to the
 *   depth trend itself. This QUANTIFIES the imp-33537 envelope without over-claiming a clean scaling law.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It fits the imp-33537
 *   worst-window ULP series to candidate growth laws; it changes NO bound, patches NO literal, and
 *   establishes NO operator positivity. The worst-window ULP is a JITTERY arithmetic-floor lattice
 *   property (imp-33249/imp-33277/imp-33296/imp-33537 latticeJitterCaveat): the exact per-rung ULP and
 *   which rung attains the window worst can shift under cross-platform libm exp/pow variation, so the
 *   fitted exponent and residual are themselves jittery -- the ROBUST reading is the QUALITATIVE
 *   "weak positive non-monotone trend, no clean law", not the exact exponent. Four data points is a
 *   thin fit basis by construction (a caveat the ticket demands). The NPHI = 10 Phi-series truncation
 *   is inherited upstream. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level
 *   K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict,
 *   no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-33537-deep-tail-plateau-spike-recurrence.js (the dense-scan worst-window ULP series fit here)
 *   @see imp-33316-graded-plateau-deep-tail-node-budget.js (the coarse-grid constant-band reading imp-33537 corrected)
 *   @see imp-33295-graded-inner-grid-a-node-budget.js (the conservative grade4/400p plateau rule carried unchanged)
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain A_log target)
 *
 *   Ticket: imp-33555 (numerical, medium).
 */

import { IMP33537_DEEP_TAIL_PLATEAU_SPIKE_RECURRENCE } from './imp-33537-deep-tail-plateau-spike-recurrence.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// -- Data points: (rung attaining the window worst, worst-window ULP) from the imp-33537 dense scan --
//    Imported directly so the imp-33295 grade4/400p=4000-node plateau rule and imp-33213 A_log target
//    are carried UNCHANGED (no re-derivation of the quadrature here -- this module fits the series).
const WINDOW_TABLE = IMP33537_DEEP_TAIL_PLATEAU_SPIKE_RECURRENCE.measured.windowTable;
const DATA = WINDOW_TABLE.map((w) => Object.freeze({
  label: w.label,
  center: w.center,
  rung: w.worstAtN,
  worstUlp: w.worstUlp,
}));
const XS = DATA.map((d) => d.rung);
const YS = DATA.map((d) => d.worstUlp);

// -- Ordinary least-squares y = a + b x with the coefficient of determination R^2 ------------------
function linreg(xs, ys) {
  const m = xs.length;
  let sx = 0;
  let sy = 0;
  for (let i = 0; i < m; i += 1) {
    sx += xs[i];
    sy += ys[i];
  }
  const mx = sx / m;
  const my = sy / m;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < m; i += 1) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    sxx += dx * dx;
    sxy += dx * dy;
    syy += dy * dy;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let ssRes = 0;
  for (let i = 0; i < m; i += 1) {
    const pred = intercept + slope * xs[i];
    const r = ys[i] - pred;
    ssRes += r * r;
  }
  const r2 = syy > 0 ? 1 - ssRes / syy : 0;
  const rmsResid = Math.sqrt(ssRes / m);
  return { slope, intercept, r2, rmsResid };
}

const LN_XS = XS.map((x) => Math.log(x));
const LN_YS = YS.map((y) => Math.log(y));

// LINEAR  y = a + b x
const LINEAR = linreg(XS, YS);
// POWER   y = c x^p  (log-log): fit ln y = ln c + p ln x; report exponent p and R^2 in log space,
//         plus a back-transformed R^2 measured against the raw ULP series.
const POWER_LOG = linreg(LN_XS, LN_YS);
const POWER_EXPONENT = POWER_LOG.slope;
const POWER_COEFF = Math.exp(POWER_LOG.intercept);
function powerPred(x) {
  return POWER_COEFF * Math.pow(x, POWER_EXPONENT);
}
// LOG     y = a + b ln x
const LOGFIT = linreg(LN_XS, YS);

// -- Back-transformed R^2 for the power law measured on the raw ULP series -------------------------
function rawR2(predFn) {
  const m = YS.length;
  let sy = 0;
  for (const y of YS) sy += y;
  const my = sy / m;
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < m; i += 1) {
    const r = YS[i] - predFn(XS[i]);
    ssRes += r * r;
    const t = YS[i] - my;
    ssTot += t * t;
  }
  return ssTot > 0 ? 1 - ssRes / ssTot : 0;
}
const POWER_RAW_R2 = rawR2(powerPred);
const LINEAR_RAW_R2 = LINEAR.r2;
const LOG_RAW_R2 = rawR2((x) => LOGFIT.intercept + LOGFIT.slope * Math.log(x));

// -- Model comparison: pick the best candidate by raw-ULP R^2 -------------------------------------
const MODELS = [
  Object.freeze({ name: 'linear', form: 'y = a + b n', param: LINEAR.slope, paramName: 'slope-b', rawR2: LINEAR_RAW_R2 }),
  Object.freeze({ name: 'power', form: 'y = c n^p', param: POWER_EXPONENT, paramName: 'exponent-p', rawR2: POWER_RAW_R2 }),
  Object.freeze({ name: 'log', form: 'y = a + b ln n', param: LOGFIT.slope, paramName: 'slope-b', rawR2: LOG_RAW_R2 }),
];
const BEST_MODEL = MODELS.reduce((best, m) => (m.rawR2 > best.rawR2 ? m : best), MODELS[0]);
const BEST_RAW_R2 = BEST_MODEL.rawR2;

// -- Trend diagnostics ----------------------------------------------------------------------------
const SHALLOWEST_ULP = YS[0]; // W0 (n~300)
const DEEPEST_ULP = YS[YS.length - 1]; // W3 (n~595)
const CHORD_GROWTH = DEEPEST_ULP / SHALLOWEST_ULP; // deepest / shallowest worst-window ULP
const EMPIRICAL_MAX_ULP = Math.max(...YS);

// Monotonicity of the worst-window ULP in window order (W0 -> W3):
let isMonotoneIncreasing = true;
for (let i = 1; i < YS.length; i += 1) {
  if (YS[i] <= YS[i - 1]) isMonotoneIncreasing = false;
}
// The W1 (n~397) dip below W0 (n~300) is the concrete non-monotonicity that breaks a clean law.
const W1_DIPS_BELOW_W0 = YS[1] < YS[0];

// -- Band-ceiling characterization: the central linear trend value at the deepest rung, and the
//    empirical upper envelope. The ceiling GROWS (positive linear slope) but with per-window scatter
//    comparable to the trend (the W1 dip), so it is an envelope, not a tight law.
const DEEPEST_RUNG = XS[XS.length - 1];
const LINEAR_CEILING_AT_DEEPEST = LINEAR.intercept + LINEAR.slope * DEEPEST_RUNG;
const CEILING_SLOPE_ULP_PER_RUNG = LINEAR.slope;

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The trend is POSITIVE: linear slope > 0, power exponent > 0, chord growth > 1.
const trendIsPositive = LINEAR.slope > 0 && POWER_EXPONENT > 0 && CHORD_GROWTH > 1;
// (2) NO candidate law fits cleanly: the best raw-ULP R^2 stays below 0.75 (thin, jittery basis).
const noCleanLaw = BEST_RAW_R2 < 0.75;
// (3) The obstruction is NON-MONOTONICITY: the series is not monotone increasing and W1 dips below W0.
const nonMonotoneObstruction = !isMonotoneIncreasing && W1_DIPS_BELOW_W0;
// (4) The power exponent is SUB-LINEAR positive (0 < p < 1.5) -- a weak growth, not a steep power law.
const exponentSubLinearPositive = POWER_EXPONENT > 0 && POWER_EXPONENT < 1.5;
// (5) Coverage: exactly the four imp-33537 windows W0..W3, and the ceiling grows (positive slope).
const coverageAndGrowingCeiling = DATA.length === 4 && CEILING_SLOPE_ULP_PER_RUNG > 0;

const verdict =
  trendIsPositive &&
  noCleanLaw &&
  nonMonotoneObstruction &&
  exponentSubLinearPositive &&
  coverageAndGrowingCeiling
    ? 'WEAK-NON-MONOTONE-DEPTH-TREND:-THE-imp-33537-DEEP-TAIL-PLATEAU-JITTER-ENVELOPE-GROWS-WITH-SADDLE-DEPTH-' +
      '(POSITIVE-LINEAR-SLOPE-~0.12-ULP/RUNG,-SUB-LINEAR-POWER-EXPONENT-p~0.8,-CHORD-DEEPEST/SHALLOWEST->1)-BUT-' +
      'FITS-NO-CLEAN-GROWTH-LAW:-THE-BEST-CANDIDATE-(LINEAR/POWER/LOG)-REACHES-ONLY-R^2~0.6-BECAUSE-THE-SERIES-IS-' +
      'NON-MONOTONE-(THE-W1-WINDOW-n~397-DIPS-TO-~37-ULP-BELOW-THE-SHALLOWER-W0-n~300-~50-ULP,-WHICH-NO-MONOTONE-' +
      'POWER/LINEAR/LOG-LAW-CAN-REPRODUCE).-THE-HONEST-OBJECT-IS-A-DEPTH-GROWING-BAND-CEILING-(CENTRAL-LINEAR-TREND-' +
      '~77-ULP-AT-THE-DEEPEST-RUNG,-EMPIRICAL-CEILING-~79-ULP)-NOT-A-TIGHT-SCALING-LAW;-PER-WINDOW-SCATTER-IS-' +
      'COMPARABLE-TO-THE-DEPTH-TREND.-FOUR-JITTERY-LATTICE-POINTS-IS-A-THIN-FIT-BASIS;-THE-ROBUST-READING-IS-THE-' +
      'QUALITATIVE-WEAK-POSITIVE-NON-MONOTONE-TREND,-NOT-THE-EXACT-EXPONENT.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-' +
      'JITTERY-LATTICE-FLOOR;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-' +
      'PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33555_DEEP_TAIL_JITTER_ENVELOPE_GROWTH_LAW = Object.freeze({
  id: 'imp-33555-deep-tail-jitter-envelope-growth-law',
  ticket: 'imp-33555',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33537-deep-tail-plateau-spike-recurrence.js',
  crossValidatesModules: [
    'imp-33537-deep-tail-plateau-spike-recurrence.js',
    'imp-33316-graded-plateau-deep-tail-node-budget.js',
    'imp-33295-graded-inner-grid-a-node-budget.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'GROWTH-LAW fit of the imp-33537 deep-tail plateau jitter envelope. The imp-33537 worst-window ULP series ' +
    '(~50.2 at n=300, ~37.5 at n=397, ~79.1 at n=510, ~74.0 at n=596; identical imp-33295 grade4/400p=4000-node ' +
    'plateau vs the imp-33213 A_log target) is least-squares fit to LINEAR (y=a+bn), POWER (y=c n^p) and LOG ' +
    '(y=a+b ln n) laws. RESULT: a WEAK POSITIVE depth trend (linear slope ~0.12 ULP/rung, power exponent p~0.8, ' +
    'chord deepest/shallowest &gt; 1) but NO clean law -- the best R^2 is only ~0.6 because the series is NON-MONOTONE ' +
    '(the W1 window n~397 DIPS to ~37 ULP below the shallower W0 n~300 ~50 ULP). VERDICT: WEAK-NON-MONOTONE-DEPTH-TREND ' +
    '-- the imp-33537 envelope is a depth-growing BAND CEILING (central linear trend ~77 ULP at the deepest rung, ' +
    'empirical ceiling ~79 ULP), NOT a fittable power law; per-window scatter is comparable to the depth trend. ' +
    'ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor (four ' +
    'points is a thin basis; the robust reading is qualitative); operator positivity (imp-3066) untouched; no QED. ' +
    'PT Lambda &lt;= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s)Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    dataSource: 'the imp-33537 dense-scan windowTable, imported directly so the imp-33295 grade4/400p=4000-node ' +
      'graded-GL plateau rule and the imp-33213 log-domain A_log target are carried UNCHANGED',
    dataPoints: 'four (rung, worst-window ULP) points -- (worstAtN, worstUlp) of the imp-33537 windows W0..W3 ' +
      'centred on {300,395,495,595}',
    fits: 'ordinary least squares of LINEAR y=a+bn, POWER ln y=ln c + p ln n (log-log), and LOG y=a+b ln n; ' +
      'each scored by the coefficient of determination R^2 on the raw ULP series',
    ceiling: 'the depth-growing band ceiling is characterized by the central linear trend value at the deepest ' +
      'rung and the empirical worst-window envelope, with the per-window scatter reported alongside',
    selfComputing: 'every fit, every R^2 and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    data: Object.freeze(DATA),
    linear: Object.freeze({ slope: LINEAR.slope, intercept: LINEAR.intercept, r2: LINEAR.r2, rmsResid: LINEAR.rmsResid }),
    power: Object.freeze({ exponent: POWER_EXPONENT, coeff: POWER_COEFF, logSpaceR2: POWER_LOG.r2, rawR2: POWER_RAW_R2 }),
    log: Object.freeze({ slope: LOGFIT.slope, intercept: LOGFIT.intercept, rawR2: LOG_RAW_R2 }),
    models: Object.freeze(MODELS),
    bestModelName: BEST_MODEL.name,
    bestRawR2: BEST_RAW_R2,
    powerExponent: POWER_EXPONENT,
    chordGrowth: CHORD_GROWTH,
    shallowestUlp: SHALLOWEST_ULP,
    deepestUlp: DEEPEST_ULP,
    empiricalMaxUlp: EMPIRICAL_MAX_ULP,
    isMonotoneIncreasing,
    w1DipsBelowW0: W1_DIPS_BELOW_W0,
    ceilingSlopeUlpPerRung: CEILING_SLOPE_ULP_PER_RUNG,
    linearCeilingAtDeepest: LINEAR_CEILING_AT_DEEPEST,
    deepestRung: DEEPEST_RUNG,
    trendIsPositive,
    noCleanLaw,
    nonMonotoneObstruction,
    exponentSubLinearPositive,
    coverageAndGrowingCeiling,
    verdict,
  }),

  interpretation: Object.freeze({
    weakPositiveTrend:
      'The worst-window ULP grows with saddle depth in a loose sense: the linear slope is positive (~0.12 ULP per ' +
      'rung), the log-log growth exponent is sub-linear positive (p ~ 0.8), and the chord ratio deepest/shallowest ' +
      'worst-window ULP exceeds 1. The imp-33537 "depth-growing jitter envelope" is real as a trend.',
    noCleanLaw:
      'But NO candidate law (linear, power, log) fits cleanly -- the best raw-ULP R^2 is only ~0.6. The obstruction ' +
      'is non-monotonicity: the W1 window (n~397) DIPS to ~37 ULP, BELOW the shallower W0 window (~50 ULP), which no ' +
      'monotone growth law can reproduce, so the residual is large by construction.',
    bandCeilingNotLaw:
      'The honest object is a depth-growing BAND CEILING (an upper envelope), not a tight scaling law: the central ' +
      'linear trend rises to ~77 ULP at the deepest rung and the empirical ceiling is the ~79 ULP worst window, but ' +
      'the per-window scatter (the W1 dip) is comparable to the depth trend itself.',
    thinBasis:
      'Four jittery lattice points -- one of them a non-monotone dip -- is a thin fit basis by construction. The ' +
      'fitted exponent and residual are themselves jittery; the robust reading is the qualitative weak-positive ' +
      'non-monotone trend, not the exact exponent.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    quantifiesPriorClaim:
      'QUANTIFIES the imp-33537 "depth-growing jitter envelope" without over-claiming: fits the worst-window ULP ' +
      'series to linear/power/log laws, reports a positive but weak trend (slope ~0.12 ULP/rung, exponent p ~ 0.8) ' +
      'and an honest best R^2 ~0.6 driven down by the non-monotone W1 dip, concluding a band ceiling not a clean law.',
    derivationScope:
      'Least-squares fit of the imp-33537 dense-scan worst-window ULP series to candidate growth laws. It changes ' +
      'NO bound, patches NO literal, and establishes NO operator positivity. Series-fit measurement only -- not a ' +
      'certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    thinFitBasisCaveat:
      'Four data points -- one a non-monotone dip -- is a thin fit basis by construction. The fitted exponent and ' +
      'residual are jittery; the robust reading is the qualitative weak-positive non-monotone trend and the ' +
      'depth-growing band ceiling, NOT the exact exponent or a certified scaling law.',
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33537/imp-33316/imp-33295/imp-33213; this fits the ' +
      'inner-quadrature jitter series, not that truncation.',
    latticeJitterCaveat:
      'The worst-window ULP is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537): ' +
      'the exact per-rung ULP and which rung attains the window worst can shift under cross-platform libm exp/pow ' +
      'variation, so the fitted exponent and residual are themselves jittery.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33555_DEEP_TAIL_JITTER_ENVELOPE_GROWTH_LAW_ASSERTIONS = [
  {
    id: 'imp33555-fits-the-four-imp33537-windows',
    why: 'The fit must run on exactly the four imp-33537 dense-scan windows W0..W3 (worstAtN, worstUlp) points.',
    holds: () => DATA.length === 4 && XS.every((x) => Number.isFinite(x)) && YS.every((y) => y > 0),
  },
  {
    id: 'imp33555-trend-is-positive',
    why: 'The depth trend must be POSITIVE: linear slope > 0, power exponent > 0, and chord (deepest/shallowest) > 1.',
    holds: () => trendIsPositive && LINEAR.slope > 0 && POWER_EXPONENT > 0 && CHORD_GROWTH > 1,
  },
  {
    id: 'imp33555-power-exponent-sub-linear-positive',
    why: 'THE FITTED EXPONENT: the log-log power exponent must be sub-linear positive (0 < p < 1.5; measured ~0.8).',
    holds: () => exponentSubLinearPositive && POWER_EXPONENT > 0 && POWER_EXPONENT < 1.5,
  },
  {
    id: 'imp33555-no-clean-law',
    why: 'THE HONEST FINDING: no candidate law fits cleanly -- the best raw-ULP R^2 must stay below 0.75.',
    holds: () => noCleanLaw && BEST_RAW_R2 < 0.75 && BEST_RAW_R2 >= 0,
  },
  {
    id: 'imp33555-non-monotone-obstruction',
    why: 'The obstruction must be NON-MONOTONICITY: the series is not monotone increasing and the W1 (n~397) window ' +
         'dips below the shallower W0 (n~300) window.',
    holds: () => nonMonotoneObstruction && !isMonotoneIncreasing && W1_DIPS_BELOW_W0,
  },
  {
    id: 'imp33555-depth-growing-band-ceiling',
    why: 'The band ceiling must GROW with depth (positive linear slope) and the empirical ceiling must exceed the ' +
         'shallowest window worst ULP (a genuine depth-growing envelope, not a fixed band).',
    holds: () => CEILING_SLOPE_ULP_PER_RUNG > 0 && EMPIRICAL_MAX_ULP > SHALLOWEST_ULP && LINEAR_CEILING_AT_DEEPEST > 0,
  },
  {
    id: 'imp33555-rule-carried-unchanged-from-imp33537',
    why: 'The imp-33295 conservative plateau rule (grade 4, 400 panels = 4000 nodes) must be carried UNCHANGED via ' +
         'the imported imp-33537 module.',
    holds: () => {
      const m = IMP33537_DEEP_TAIL_PLATEAU_SPIKE_RECURRENCE.measured;
      return m.plateauGrade === 4 && m.plateauPanels === 400 && m.plateauNodes === 4000;
    },
  },
  {
    id: 'imp33555-verdict-records-weak-non-monotone-trend',
    why: 'The classified verdict must record the WEAK-NON-MONOTONE-DEPTH-TREND reading, not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33555-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, quantifies the imp-33537 ' +
         'envelope without a clean law, thin jittery basis flagged, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33555_DEEP_TAIL_JITTER_ENVELOPE_GROWTH_LAW.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        /thin fit basis/.test(c.thinFitBasisCaveat) &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33555_DEEP_TAIL_JITTER_ENVELOPE_GROWTH_LAW_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33555-deep-tail-jitter-envelope-growth-law assertion failed: ${assertion.id}`);
  }
}

export default IMP33555_DEEP_TAIL_JITTER_ENVELOPE_GROWTH_LAW;
