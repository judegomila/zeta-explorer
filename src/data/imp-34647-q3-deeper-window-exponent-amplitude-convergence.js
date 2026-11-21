/**
 * @module imp-34647-q3-deeper-window-exponent-amplitude-convergence
 * @fileoverview imp-34647 -- MEASUREMENT ONLY: DIRECT TEST of the imp-34633 F2 "least-deep window"
 *   diagnosis. imp-34633 F2 attributed the q3 channel being the LOOSEST of q2/q3/q4 -- its fitted
 *   log-log slope m3 ~ 2.90 sitting BELOW the integer 3 and its intercept amplitude ratio ~3.07 sitting
 *   ABOVE the parameter-free eps_mach prediction -- to ONE coherent cause: its dp = 1e-4 .. 1e-5 window
 *   sits LEAST DEEP in the roundoff floor of the three, so a residual truncation contribution
 *   simultaneously biases the slope down and the amplitude up. That single-mechanism reading makes a
 *   sharp, falsifiable prediction it never itself tested: push the q3 window DEEPER (smaller dp, further
 *   into the roundoff floor) and BOTH the exponent should climb toward 3 and the amplitude ratio should
 *   fall toward 1 as the truncation contamination clears. This module runs exactly that test.
 *
 *   WHAT THIS MEASUREMENT ADDS (beyond imp-34633)
 *   ---------------------------------------------
 *   Reusing the imp-34606/imp-34633 decomposition VERBATIM [same q1..q4 inherited central differences of
 *   q(p) = log E_coll in p = log N, same q3 share s3 = |q3|/(6 q1^2), same deep-tail landmarks
 *   N >= N* ~ 4.62e13, same deep-group-max worst-rung reduction, same parameter-free machine-epsilon
 *   prediction B3_pred = ||w3|| u |q| / (12 q1^2) with u = eps/2 and ||w3|| = sqrt(10)], this module refits
 *   the q3 log-log line on dp windows pushed BELOW imp-34633's 1e-4 .. 1e-5 floor and reports the fitted
 *   exponent m3 and amplitude ratio B3/B3_pred as the window descends.
 *
 *   THE FINDING (the least-deep diagnosis is confirmed -- but ONLY via a WIDE deep window)
 *   ------------------------------------------------------------------------------------
 *   (F1) THE WIDE DEEP WINDOW DRIVES BOTH KNOBS ONTO THE ROUNDOFF PREDICTION. Refitting q3 over a WIDE
 *        15-rung window spanning dp = 1e-4 .. 5e-7 -- extending imp-34633's 1e-4 .. 1e-5 window ~20x
 *        DEEPER into the floor -- drives the exponent from m3 ~ 2.903 to m3 ~ 3.008 (right onto the
 *        integer 3) and the amplitude ratio from ~3.07 to ~0.886 (onto 1), with R^2 ~ 0.994. Both halves
 *        of the imp-34633 F2 prediction hold: the slope climbs to 3 and the amplitude falls to the
 *        parameter-free eps_mach line as the truncation contamination clears deeper in the floor.
 *   (F2) BUT A NARROW WINDOW RELOCATED DEEPER DOES NOT -- THE FLOOR IS ULP-STOCHASTIC. Simply moving a
 *        narrow 5-point window deeper does NOT monotonically improve the fit: the adjacent narrow windows
 *        3e-5 .. 3e-6, 1e-5 .. 1e-6 and 5e-6 .. 5e-7 give erratic exponents (m3 ~ 2.71, 3.16, 3.22) and
 *        wildly swinging amplitude ratios (~23.3, ~0.14, ~0.05), because the per-rung roundoff floor
 *        s3(dp) oscillates within [~0.61, ~1.84] of the B3_pred / dp^3 line at the ULP level. A 5-point
 *        fit latches onto whichever local cluster of that ULP noise it happens to span. The clean
 *        exponent 3 and unit amplitude only emerge when the fit AVERAGES over a wide span of the floor.
 *   (F3) NET: the imp-34633 F2 single-mechanism reading is CONFIRMED in its physically correct form --
 *        deeper-into-the-floor fitting recovers BOTH the integer exponent and the parameter-free
 *        amplitude the shallow 1e-4 .. 1e-5 window missed -- with the important refinement that the
 *        recovery is a WIDE-window (averaging) effect, not a narrow-window relocation, because the
 *        deep-tail finite-difference floor is genuinely ULP-stochastic rung-to-rung. This is a
 *        conditioning diagnostic on the finite-difference measurement; it changes no bound.
 *
 *   MEASUREMENT ONLY. This refits the q3 log-log line on windows pushed below the imp-34633 floor and
 *   compares slope/amplitude to the same parameter-free machine-epsilon prediction; it changes NO bound.
 *   Reproduces the imp-34446 / imp-34531 / imp-34566 / imp-34573 / imp-34606 / imp-34633 primitives inline
 *   (imports NOTHING -- no lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle),
 *   following the no-heavy-imports directive. q1..q4 are the inherited central differences, NOT fresh
 *   analytic closed forms -- so the sigma -> 1 deep-tail regime, where the inherited imp-3220 / imp-3406
 *   component model is least trustworthy, is inherited as-is (this diagnoses the finite-difference
 *   conditioning OF that measurement, it does not rehabilitate the model). The -2 asymptote and
 *   C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per
 *   imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 *   No refereed bound is changed.
 *
 *   @see imp-34633-roundoff-prefactor-amplitude-vs-epsmach.js (the F2 least-deep diagnosis this tests directly)
 *   @see imp-34606-roundoff-amplification-exponent-ladder.js (the {2,3,4} SLOPE ladder; q3 slope m3 ~ 2.90)
 *   @see imp-34592-q4-share-roundoff-floor-vs-dp.js (q4 O(h^4) share inflates ~1/dp^4; deep-tail dp floor)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma < 0.01)
 *
 *   Ticket: imp-34647 (numerical, medium). q3 deeper-window exponent/amplitude convergence; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34566/imp-34573/imp-34606/imp-34633 primitives (imports NOTHING): --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N* -- the deep-tail floor
const EPS_MACH = Number.EPSILON; // 2.220446049250313e-16 -- IEEE-754 double machine epsilon
const UNIT_ROUNDOFF = EPS_MACH / 2; // u = eps/2 ~ 1.11e-16 -- the per-value rounding half-ulp

function heightForN(N) {
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}

function eColl(N) {
  return C_C * Math.sqrt(Math.log(heightForN(N)) / N);
}

// Central differences of q(p) = log E_coll in p = log N (identical to imp-34566/imp-34573/imp-34606/imp-34633).
function qDerivs(N, dp) {
  const p = Math.log(N);
  const q = (pp) => Math.log(eColl(Math.exp(pp)));
  const f0 = q(p);
  const fp = q(p + dp);
  const fm = q(p - dp);
  const fpp = q(p + 2 * dp);
  const fmm = q(p - 2 * dp);
  const q1 = (fp - fm) / (2 * dp);
  const q3 = (fpp - 2 * fp + 2 * fm - fmm) / (2 * dp * dp * dp);
  return { q1, q3, f0 };
}

// Deep-tail landmarks only (N >= N* ~ 4.62e13, imp-33620 sigma < 0.01) -- the regime under stress.
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];
const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;

// The q3 channel coefficient SHARE s3 = |q3| / (6 q1^2) (imp-34543/imp-34566/imp-34606/imp-34633).
function q3Share(N, dp) {
  const { q1, q3 } = qDerivs(N, dp);
  return Math.abs(q3 / (6 * q1 * q1));
}

// Deep-group max apparent q3 share at a given q-derivative step -- the worst-case rung (imp-34633).
function deepGroupMaxShare(dp) {
  return Math.max(...DEEP_LADDER.map((N) => q3Share(N, dp)));
}

// Log-log least-squares fit -- returns the SLOPE m3 AND the INTERCEPT prefactor B3 = exp(lnb) (imp-34633).
function logLogFit(steps) {
  const xs = steps.map((dp) => Math.log(dp));
  const ys = steps.map((dp) => Math.log(deepGroupMaxShare(dp)));
  const xbar = mean(xs);
  const ybar = mean(ys);
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < xs.length; i++) {
    sxy += (xs[i] - xbar) * (ys[i] - ybar);
    sxx += (xs[i] - xbar) * (xs[i] - xbar);
  }
  const slope = sxy / sxx; // = -m3
  const lnb = ybar - slope * xbar; // intercept at log dp = 0 -> amplitude B3 = exp(lnb)
  const yhat = xs.map((x) => lnb + slope * x);
  const ssr = ys.reduce((s, y, i) => s + (y - yhat[i]) * (y - yhat[i]), 0);
  const sst = ys.reduce((s, y) => s + (y - ybar) * (y - ybar), 0);
  return { m: -slope, B: Math.exp(lnb), r2: 1 - ssr / sst };
}

// --- Parameter-free machine-epsilon PREDICTION of the q3 intercept prefactor B3 (VERBATIM imp-34633) ---
// B3 = ||w3|| u |q| / (12 q1^2), ||w3|| = sqrt(10) the RMS stencil-weight norm of {1,-2,2,-1}, u = eps/2.
const STENCIL_NORM_Q3 = Math.sqrt(1 + 4 + 4 + 1); // weights {1,-2,2,-1} -> sqrt(10) ~ 3.162
function trueMagnitudes(N) {
  const { q1, f0 } = qDerivs(N, 1e-2); // true magnitudes at a NON-roundoff step (imp-34633)
  return { absQ: Math.abs(f0), absQ1: Math.abs(q1) };
}
function predictedPrefactor(N) {
  const { absQ, absQ1 } = trueMagnitudes(N);
  return (STENCIL_NORM_Q3 * UNIT_ROUNDOFF * absQ) / (12 * absQ1 * absQ1);
}
const B3_PRED = Math.max(...DEEP_LADDER.map((N) => predictedPrefactor(N))); // ~2.047e-15 (deep-group max)

// --- The imp-34633 q3 window (the SHALLOW baseline: least deep in the floor, m3 ~ 2.90, ratio ~3.07) ---
const WINDOW_Q3_SHALLOW = [1e-4, 5e-5, 3e-5, 2e-5, 1e-5]; // VERBATIM from imp-34606/imp-34633
const FIT_SHALLOW = logLogFit(WINDOW_Q3_SHALLOW); // m ~ 2.903, B ~ 6.29e-15, ratio ~3.07

// --- The WIDE deep window: extends the shallow window ~20x DEEPER into the roundoff floor ---
const WINDOW_Q3_WIDE_DEEP = [
  1e-4, 7e-5, 5e-5, 3e-5, 2e-5, 1.4e-5, 1e-5, 7e-6, 5e-6, 3e-6, 2e-6, 1.4e-6, 1e-6, 7e-7, 5e-7,
];
const FIT_WIDE_DEEP = logLogFit(WINDOW_Q3_WIDE_DEEP); // m ~ 3.008, B ~ 1.81e-15, ratio ~0.886

// --- NARROW windows relocated DEEPER (F2: erratic, because the floor is ULP-stochastic) ---
const NARROW_DEEPER = [
  { label: '3e-5..3e-6', window: [3e-5, 2e-5, 1e-5, 5e-6, 3e-6] },
  { label: '1e-5..1e-6', window: [1e-5, 5e-6, 3e-6, 2e-6, 1e-6] },
  { label: '5e-6..5e-7', window: [5e-6, 3e-6, 2e-6, 1e-6, 5e-7] },
];

const RATIO_SHALLOW = FIT_SHALLOW.B / B3_PRED; // ~3.07 (imp-34633 baseline)
const RATIO_WIDE_DEEP = FIT_WIDE_DEEP.B / B3_PRED; // ~0.886 (converged onto 1)

const NARROW_ROWS = NARROW_DEEPER.map(({ label, window }) => {
  const fit = logLogFit(window);
  return {
    window: label,
    m3: +fit.m.toFixed(4),
    B3: +fit.B.toExponential(4),
    ratio_meas_over_pred: +(fit.B / B3_PRED).toFixed(3),
    r2: +fit.r2.toFixed(4),
  };
});

// Per-rung s3(dp) / (B3_pred / dp^3): how far each rung sits from the pure-roundoff line (ULP-stochastic).
const PER_RUNG_RATIO = WINDOW_Q3_WIDE_DEEP.map((dp) => deepGroupMaxShare(dp) / (B3_PRED / Math.pow(dp, 3)));
const RUNG_RATIO_MIN = Math.min(...PER_RUNG_RATIO); // ~0.61
const RUNG_RATIO_MAX = Math.max(...PER_RUNG_RATIO); // ~1.84

// F1 pass: the WIDE deep window drove BOTH the exponent onto 3 AND the amplitude ratio onto 1,
// each strictly BETTER than the shallow imp-34633 baseline.
const WIDE_DEEP_CONVERGES =
  Math.abs(FIT_WIDE_DEEP.m - 3) < Math.abs(FIT_SHALLOW.m - 3) &&
  Math.abs(RATIO_WIDE_DEEP - 1) < Math.abs(RATIO_SHALLOW - 1) &&
  Math.abs(FIT_WIDE_DEEP.m - 3) < 0.05 &&
  RATIO_WIDE_DEEP > 0.5 &&
  RATIO_WIDE_DEEP < 2;

export const IMP34647_Q3_DEEPER_WINDOW_EXPONENT_AMPLITUDE_CONVERGENCE = Object.freeze({
  id: 'imp-34647',
  proofSection: 'S-frontier',
  claim_measured:
    'DIRECT test of the imp-34633 F2 "least-deep window" diagnosis: push the q3 finite-difference dp ' +
    'window BELOW imp-34633s 1e-4 .. 1e-5 floor and measure whether the fitted exponent climbs from ' +
    'm3 ~ 2.90 toward the integer 3 AND the intercept amplitude ratio falls from ~3.07 toward the ' +
    'parameter-free eps_mach prediction B3 = ||w3|| u |q| / (12 q1^2) as the truncation contamination ' +
    'clears deeper in the roundoff floor; a conditioning diagnostic, not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  eps_mach: EPS_MACH,
  unit_roundoff_u: +UNIT_ROUNDOFF.toExponential(4),
  C_C_inline: +C_C.toFixed(6),
  B3_predicted: +B3_PRED.toExponential(4), // ~2.047e-15 (deep-group max, VERBATIM imp-34633)
  // Shallow imp-34633 baseline (least deep in the floor):
  shallow_window: WINDOW_Q3_SHALLOW.map((dp) => +dp.toExponential(1)),
  m3_shallow: +FIT_SHALLOW.m.toFixed(4), // ~2.903
  B3_shallow: +FIT_SHALLOW.B.toExponential(4), // ~6.29e-15
  ratio_shallow: +RATIO_SHALLOW.toFixed(3), // ~3.07
  r2_shallow: +FIT_SHALLOW.r2.toFixed(4),
  // Wide deep window (~20x deeper): BOTH knobs converge:
  wide_deep_window: WINDOW_Q3_WIDE_DEEP.map((dp) => +dp.toExponential(1)),
  m3_wide_deep: +FIT_WIDE_DEEP.m.toFixed(4), // ~3.008 (onto the integer 3)
  B3_wide_deep: +FIT_WIDE_DEEP.B.toExponential(4), // ~1.81e-15
  ratio_wide_deep: +RATIO_WIDE_DEEP.toFixed(3), // ~0.886 (onto 1)
  r2_wide_deep: +FIT_WIDE_DEEP.r2.toFixed(4), // ~0.994
  // Narrow windows relocated deeper (erratic -- the floor is ULP-stochastic):
  narrow_deeper_rows: Object.freeze(NARROW_ROWS.map((r) => Object.freeze(r))),
  per_rung_ratio_min: +RUNG_RATIO_MIN.toFixed(3), // ~0.61
  per_rung_ratio_max: +RUNG_RATIO_MAX.toFixed(3), // ~1.84
  wide_deep_converges: WIDE_DEEP_CONVERGES,
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). DIRECT test of the imp-34633 F2 "least-deep window" single-mechanism ' +
    'reading of the q3 finite-difference channel [q3 the inherited 4-point central difference of ' +
    'q(p) = log E_coll in p = log N; share s3 = |q3| / (6 q1^2); deep = N >= N* ~ 4.62e13, imp-33620 ' +
    'sigma < 0.01; parameter-free prediction B3 = ||w3|| u |q| / (12 q1^2), ||w3|| = sqrt(10), ' +
    'u = eps/2]. imp-34633 F2 attributed q3s loose slope (m3 ~ 2.90 vs 3) and high amplitude ratio ' +
    '(~3.07) to its dp = 1e-4 .. 1e-5 window sitting LEAST DEEP in the roundoff floor, predicting that ' +
    'pushing dp deeper would drive BOTH onto the roundoff line. (F1) CONFIRMED via a WIDE window: ' +
    'refitting q3 over dp = 1e-4 .. 5e-7 [15 rungs, ~20x deeper than imp-34633] drives the exponent ' +
    'from m3 ~ 2.903 to ~3.008 (onto the integer 3) and the amplitude ratio from ~3.07 to ~0.886 ' +
    '(onto 1), R^2 ~ 0.994 -- both halves of the F2 prediction hold. (F2) BUT a NARROW 5-point window ' +
    'merely RELOCATED deeper does NOT: the windows 3e-5 .. 3e-6, 1e-5 .. 1e-6, 5e-6 .. 5e-7 give ' +
    'erratic exponents (m3 ~ 2.71, 3.16, 3.22) and swinging amplitude ratios (~23.3, ~0.14, ~0.05), ' +
    'because the per-rung floor s3(dp) oscillates within [~0.61, ~1.84] of the B3_pred / dp^3 line at ' +
    'the ULP level and a 5-point fit latches onto whichever local cluster it spans. (F3) NET: the ' +
    'imp-34633 F2 diagnosis is CONFIRMED in its physically correct form -- deeper-into-the-floor ' +
    'fitting recovers BOTH the integer exponent and the parameter-free amplitude the shallow window ' +
    'missed -- with the refinement that the recovery is a WIDE-window (averaging) effect, not a ' +
    'narrow-window relocation, because the deep-tail finite-difference floor is genuinely ULP-stochastic ' +
    'rung-to-rung. q1..q4 are inherited central differences, NOT fresh analytic closed forms, so the ' +
    'sigma -> 1 deep-tail regime (imp-3220 / imp-3406 component model least trustworthy) is inherited ' +
    'as-is -- this diagnoses the finite-difference conditioning of that measurement, it does not ' +
    'rehabilitate the model. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz ' +
    'are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34633 (the F2 least-deep-window diagnosis this module tests directly); ' +
    'imp-34606 (the {2,3,4} SLOPE ladder -- q3 slope m3 ~ 2.90); ' +
    'imp-34592 (q4 O(h^4) share inflates ~1/dp^4; deep-tail dp floor); ' +
    'imp-34593 (q3-share relative-range excess free exponent m ~ 3.5); ' +
    'imp-34566 (truncation-vs-roundoff finite-difference floor F3); ' +
    'imp-34531 (F2 O(h^2) coefficient certification); imp-34446 (central-difference exponent); ' +
    'imp-33620 (deep-tail landmark N* ~ 4.62e13, sigma < 0.01); imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34647_ASSERTIONS = [
  {
    id: 'imp34647-shallow-reproduces-imp34633',
    holds: () =>
      Math.abs(FIT_SHALLOW.m - 2.903) < 0.05 &&
      RATIO_SHALLOW > 2.7 &&
      RATIO_SHALLOW < 3.5,
    why: 'Baseline: the shallow 1e-4 .. 1e-5 window reproduces the imp-34633 q3 slope m3 ~ 2.903 and amplitude ratio ~3.07 verbatim.',
  },
  {
    id: 'imp34647-wide-deep-exponent-onto-3',
    holds: () => Math.abs(FIT_WIDE_DEEP.m - 3) < 0.05 && FIT_WIDE_DEEP.r2 > 0.98,
    why: 'F1: the wide 1e-4 .. 5e-7 deep window drives the q3 exponent from ~2.903 onto the integer 3 (m3 ~ 3.008, R^2 ~ 0.994).',
  },
  {
    id: 'imp34647-wide-deep-amplitude-onto-1',
    holds: () =>
      RATIO_WIDE_DEEP > 0.6 &&
      RATIO_WIDE_DEEP < 1.5 &&
      Math.abs(RATIO_WIDE_DEEP - 1) < Math.abs(RATIO_SHALLOW - 1),
    why: 'F1: the wide deep window drives the q3 amplitude ratio from ~3.07 onto ~0.886 (toward 1) -- strictly closer than the shallow baseline.',
  },
  {
    id: 'imp34647-narrow-windows-erratic',
    holds: () => {
      const ratios = NARROW_ROWS.map((r) => r.ratio_meas_over_pred);
      const spread = Math.max(...ratios) / Math.min(...ratios);
      return spread > 50; // ~23.3 / ~0.05 -> spread ~440, hugely erratic
    },
    why: 'F2: narrow 5-point windows relocated deeper are ULP-stochastic -- their amplitude ratios span >50x (~23.3 down to ~0.05), NOT a monotone approach.',
  },
  {
    id: 'imp34647-floor-is-ulp-stochastic',
    holds: () => RUNG_RATIO_MIN > 0.4 && RUNG_RATIO_MIN < 0.9 && RUNG_RATIO_MAX > 1.3 && RUNG_RATIO_MAX < 2.5,
    why: 'F2: the per-rung floor s3(dp) oscillates within [~0.61, ~1.84] of the B3_pred / dp^3 line at the ULP level -- the source of the narrow-window erraticity.',
  },
  {
    id: 'imp34647-wide-deep-converges',
    holds: () => WIDE_DEEP_CONVERGES,
    why: 'F3: the wide deep window converges BOTH knobs (exponent onto 3, amplitude onto 1) strictly better than the shallow baseline -- the imp-34633 F2 diagnosis confirmed.',
  },
  {
    id: 'imp34647-honesty-gate-no-qed',
    holds: () =>
      IMP34647_Q3_DEEPER_WINDOW_EXPONENT_AMPLITUDE_CONVERGENCE.isRigorous === false &&
      /NO QED/.test(IMP34647_Q3_DEEPER_WINDOW_EXPONENT_AMPLITUDE_CONVERGENCE.verdict) &&
      /refereed bound is changed/i.test(IMP34647_Q3_DEEPER_WINDOW_EXPONENT_AMPLITUDE_CONVERGENCE.verdict) &&
      /UNTOUCHED/.test(IMP34647_Q3_DEEPER_WINDOW_EXPONENT_AMPLITUDE_CONVERGENCE.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34647_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34647-q3-deeper-window-exponent-amplitude-convergence assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34647_Q3_DEEPER_WINDOW_EXPONENT_AMPLITUDE_CONVERGENCE;
