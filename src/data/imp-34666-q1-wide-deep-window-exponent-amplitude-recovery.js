/**
 * @module imp-34666-q1-wide-deep-window-exponent-amplitude-recovery
 * @fileoverview imp-34666 -- MEASUREMENT ONLY: extends the imp-34647 WIDE-deep-window exponent/amplitude
 *   recovery DOWN one rung, to q1, the FIRST central difference (the well-conditioned DENOMINATOR q1^2 of
 *   the drift shares C_q2 = -q2/(2 q1^2), C_q3 = q3/(6 q1^2)). imp-34646 measured the q1 deep-tail roundoff
 *   floor on a NARROW 5-point window dp = 1e-6 .. 5e-8 and found it structurally correct but pinned LOOSELY
 *   (slope m1 ~ 1.07, amplitude ratio measured/predicted ~0.38, R^2 ~ 0.946) -- because q1 is well-
 *   conditioned its floor is a tiny ULP-jittery ABSOLUTE quantity. imp-34647 showed that for the ILL-
 *   conditioned q3 share a WIDE deep window (averaging over many rungs of the floor) recovers the clean
 *   exponent and the parameter-free amplitude that narrow windows miss. This module asks whether the same
 *   wide-deep-window averaging drives the q1 slope onto 1 and the amplitude ratio onto 1, extending the
 *   imp-34647 recovery to the k = 1 rung.
 *
 *   THE q1 CROSSOVER CONSTRAINT (why the q1 wide window must be built DIFFERENTLY from q3)
 *   -------------------------------------------------------------------------------------
 *   q1 = (q(p+dp) - q(p-dp)) / (2 dp) has truncation error O(dp^2) and roundoff floor ~ B1/dp, so its
 *   truncation/roundoff crossover sits at dp ~ u^(1/3) ~ 6e-6. The q3 share (imp-34647) could widen its
 *   window UP toward its own crossover with impunity because it is ILL-conditioned: its true numerator is
 *   ~0, so the share is roundoff all the way up. q1 is WELL-conditioned (true value O(1), |q1| ~ 0.485), so
 *   its ABSOLUTE error picks up a non-roundoff (finite-difference-vs-reference) contribution as dp climbs
 *   toward the ~6e-6 crossover. The wide q1 window must therefore stay ENTIRELY BELOW the crossover.
 *
 *   THE FINDING (recovery DOES reach k = 1 -- but only below the crossover, and R^2 does NOT tighten)
 *   ------------------------------------------------------------------------------------------------
 *   (F1) A WIDE window kept ENTIRELY DEEP (dp = 1e-6 .. 2e-8, 11 rungs, all below the ~6e-6 crossover)
 *        drives BOTH knobs onto the roundoff prediction: the slope from the narrow m1 ~ 1.069 to
 *        m1 ~ 0.992 (right onto the integer 1) and the amplitude ratio from the narrow ~0.379 to ~1.126
 *        (onto 1) -- each STRICTLY closer to 1 than the imp-34646 narrow baseline. The imp-34647 recovery
 *        therefore extends to the k = 1 rung: the narrow window's low amplitude ratio was a small-sample
 *        artifact, and wide-window averaging recovers the parameter-free eps_mach |q| line.
 *   (F2) BUT THE FIT DOES NOT TIGHTEN. Unlike q3 (imp-34647 R^2 ~ 0.994), the q1 wide-deep-window R^2
 *        stays ~0.927 -- NO better than the narrow ~0.946. Because q1 is well-conditioned its floor is a
 *        tiny ABSOLUTE quantity dominated by ULP jitter, so wide-window averaging recovers the CENTRAL
 *        slope and amplitude but the per-rung scatter around the line is irreducible. The eps_mach |q|
 *        amplitude is confirmed onto 1 IN THE MEAN, yet pinned no more tightly than before -- the noise
 *        is a property of the well-conditioned channel, not of the window width.
 *   (F3) A WIDE window that reaches UP toward the crossover REVERSES the recovery. Refitting over
 *        dp = 3e-6 .. 5e-8 (12 rungs, top rung above the ~6e-6-adjacent regime) pulls the slope DOWN to
 *        m1 ~ 0.917 and INFLATES the amplitude ratio to ~3.99; extending to dp = 5e-6 .. 5e-8 pushes it to
 *        ~8.83. This is the well-conditioned analogue absent from q3: the q1 ABSOLUTE error near the
 *        crossover carries a finite-difference-vs-reference contribution that biases the intercept up and
 *        the slope below 1, so the q1 wide window must stay ENTIRELY below the crossover for the recovery.
 *
 *   MEASUREMENT ONLY. This refits the q1 log-log floor over wide windows and compares slope/amplitude to
 *   the same parameter-free machine-epsilon prediction imp-34646 used; it changes NO bound. Reproduces the
 *   imp-34446 / imp-34531 / imp-34606 / imp-34633 / imp-34646 / imp-34647 primitives inline (imports
 *   NOTHING -- no lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle), following the
 *   no-heavy-imports directive. q1 is the inherited first central difference, NOT a fresh analytic closed
 *   form -- so the sigma -> 1 deep-tail regime, where the inherited imp-3220 / imp-3406 component model is
 *   least trustworthy, is inherited as-is (this diagnoses the finite-difference conditioning OF that
 *   measurement, it does not rehabilitate the model). The -2 asymptote and C_C = (1/8)sqrt(3 pi)
 *   (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED;
 *   imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34646-q1-first-difference-roundoff-floor.js (the narrow-window q1 baseline this widens)
 *   @see imp-34647-q3-deeper-window-exponent-amplitude-convergence.js (the wide-window recovery this extends to k=1)
 *   @see imp-34633-roundoff-prefactor-amplitude-vs-epsmach.js (the eps_mach |q| amplitude prediction)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma < 0.01)
 *
 *   Ticket: imp-34666 (numerical, medium). q1 wide-deep-window exponent/amplitude recovery; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34606/imp-34633/imp-34646/imp-34647 primitives (imports NOTHING): --
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

// The FIRST central difference of q(p) = log E_coll in p = log N (identical stencil to imp-34606/34633/34646).
// q1 = (q(p+dp) - q(p-dp)) / (2 dp) -- 2-point difference, weights {1,-1}, denom 2 dp.
function q1of(N, dp) {
  const p = Math.log(N);
  const q = (pp) => Math.log(eColl(Math.exp(pp)));
  return (q(p + dp) - q(p - dp)) / (2 * dp);
}

// The bare function value q(p) = log E_coll at the landmark -- the |q| magnitude the roundoff rides on.
function qValue(N) {
  const p = Math.log(N);
  return Math.log(eColl(Math.exp(p)));
}

// Deep-tail landmarks only (N >= N* ~ 4.62e13, imp-33620 sigma < 0.01) -- the regime under stress.
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];
const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;

// True q1 at a NON-roundoff step (dp = 1e-2) -- the well-conditioned reference (imp-34646, verbatim).
function q1True(N) {
  return q1of(N, 1e-2);
}

// Deep-group max ABSOLUTE roundoff error of q1 at step dp -- the worst-case rung (imp-34646, verbatim).
function deepGroupMaxAbsErr(dp) {
  return Math.max(...DEEP_LADDER.map((N) => Math.abs(q1of(N, dp) - q1True(N))));
}

// Log-log least-squares fit -- returns the SLOPE m1, INTERCEPT prefactor B1 = exp(lnb), and R^2 (imp-34646).
function logLogFit(steps) {
  const xs = steps.map((dp) => Math.log(dp));
  const ys = steps.map((dp) => Math.log(deepGroupMaxAbsErr(dp)));
  const xbar = mean(xs);
  const ybar = mean(ys);
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < xs.length; i++) {
    sxy += (xs[i] - xbar) * (ys[i] - ybar);
    sxx += (xs[i] - xbar) * (xs[i] - xbar);
  }
  const slope = sxy / sxx; // = -m1
  const lnb = ybar - slope * xbar; // intercept at log dp = 0 -> amplitude B1 = exp(lnb)
  const yhat = xs.map((x) => lnb + slope * x);
  const ssr = ys.reduce((s, y, i) => s + (y - yhat[i]) * (y - yhat[i]), 0);
  const sst = ys.reduce((s, y) => s + (y - ybar) * (y - ybar), 0);
  return { m: -slope, B: Math.exp(lnb), r2: 1 - ssr / sst };
}

// --- Parameter-free machine-epsilon PREDICTION of the q1 intercept prefactor B1 (VERBATIM imp-34646) ---
// err_q1(dp) ~ ||w1|| u |q| / (2 dp) = B1 / dp,  B1 = ||w1|| u |q| / 2,  ||w1|| = sqrt(2), u = eps/2.
const STENCIL_NORM_Q1 = Math.sqrt(1 + 1); // weights {1,-1} -> sqrt(2) ~ 1.4142
function predictedPrefactor(N) {
  return (STENCIL_NORM_Q1 * UNIT_ROUNDOFF * Math.abs(qValue(N))) / 2;
}
const B1_PRED = Math.max(...DEEP_LADDER.map(predictedPrefactor)); // ~1.294e-15 (deep-group max)

// --- The imp-34646 NARROW baseline (5-point deep window, loosely pinned: m1 ~ 1.07, ratio ~0.38) ---
const WINDOW_NARROW = [1e-6, 5e-7, 3e-7, 1e-7, 5e-8]; // VERBATIM from imp-34646
const FIT_NARROW = logLogFit(WINDOW_NARROW); // m ~ 1.0686, B ~ 4.90e-16, ratio ~0.379, R^2 ~ 0.946

// --- The WIDE window kept ENTIRELY DEEP: 11 rungs, all BELOW the ~6e-6 crossover (F1: recovery) ---
const WINDOW_WIDE_DEEP = [1e-6, 7e-7, 5e-7, 3e-7, 2e-7, 1.4e-7, 1e-7, 7e-8, 5e-8, 3e-8, 2e-8];
const FIT_WIDE_DEEP = logLogFit(WINDOW_WIDE_DEEP); // m ~ 0.9918, B ~ 1.457e-15, ratio ~1.126, R^2 ~ 0.9275

// --- WIDE windows that reach UP toward the crossover (F3: reverses -- well-conditioned truncation re-enters) ---
const CROSSOVER_WINDOWS = [
  { label: '3e-6..5e-8', window: [3e-6, 2e-6, 1.4e-6, 1e-6, 7e-7, 5e-7, 3e-7, 2e-7, 1.4e-7, 1e-7, 7e-8, 5e-8] },
  { label: '5e-6..5e-8', window: [5e-6, 3e-6, 2e-6, 1.4e-6, 1e-6, 7e-7, 5e-7, 3e-7, 2e-7, 1.4e-7, 1e-7, 7e-8, 5e-8] },
];

const RATIO_NARROW = FIT_NARROW.B / B1_PRED; // ~0.379 (imp-34646 baseline, well BELOW 1)
const RATIO_WIDE_DEEP = FIT_WIDE_DEEP.B / B1_PRED; // ~1.126 (recovered onto 1)

const CROSSOVER_ROWS = CROSSOVER_WINDOWS.map(({ label, window }) => {
  const fit = logLogFit(window);
  return {
    window: label,
    m1: +fit.m.toFixed(4),
    B1: +fit.B.toExponential(4),
    ratio_meas_over_pred: +(fit.B / B1_PRED).toFixed(3),
    r2: +fit.r2.toFixed(4),
  };
});
const FIT_CROSSOVER_LOWEST = logLogFit(CROSSOVER_WINDOWS[0].window); // the 3e-6..5e-8 top-crossover fit
const RATIO_CROSSOVER_LOWEST = FIT_CROSSOVER_LOWEST.B / B1_PRED; // ~3.99

// F1 pass: the wide DEEP window drives BOTH the exponent onto 1 AND the amplitude ratio onto 1,
// each STRICTLY better than the narrow imp-34646 baseline -- the imp-34647 recovery extended to k=1.
const WIDE_DEEP_RECOVERS =
  Math.abs(FIT_WIDE_DEEP.m - 1) < Math.abs(FIT_NARROW.m - 1) &&
  Math.abs(RATIO_WIDE_DEEP - 1) < Math.abs(RATIO_NARROW - 1) &&
  Math.abs(FIT_WIDE_DEEP.m - 1) < 0.05 &&
  RATIO_WIDE_DEEP > 0.5 &&
  RATIO_WIDE_DEEP < 2;

// F2: the fit does NOT tighten -- R^2 stays ~0.93, far from q3's ~0.994, no better than the narrow ~0.946.
const R2_DOES_NOT_TIGHTEN = FIT_WIDE_DEEP.r2 < 0.98 && FIT_WIDE_DEEP.r2 < FIT_NARROW.r2 + 0.02;

// F3: reaching UP toward the crossover REVERSES the recovery -- ratio inflates well above 1, slope below 1.
const CROSSOVER_REVERSES =
  RATIO_CROSSOVER_LOWEST > 2 && Math.abs(FIT_CROSSOVER_LOWEST.m - 1) > Math.abs(FIT_WIDE_DEEP.m - 1);

export const IMP34666_Q1_WIDE_DEEP_WINDOW_EXPONENT_AMPLITUDE_RECOVERY = Object.freeze({
  id: 'imp-34666',
  proofSection: 'S-frontier',
  claim_measured:
    'Assess whether the imp-34647 WIDE-deep-window averaging tightens the noisy imp-34646 q1 first-' +
    'difference roundoff-floor fit (slope m1 ~ 1.07, amplitude ratio ~0.38, R^2 ~ 0.946) toward the ' +
    'parameter-free eps_mach |q| prediction B1 = ||w1|| u |q| / 2, extending the imp-34647 exponent/' +
    'amplitude recovery DOWN to the k = 1 rung -- q1 being the well-conditioned DENOMINATOR q1^2 of the ' +
    'drift shares C_q2 = -q2/(2 q1^2), C_q3 = q3/(6 q1^2); a conditioning diagnostic, not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  eps_mach: EPS_MACH,
  unit_roundoff_u: +UNIT_ROUNDOFF.toExponential(4),
  C_C_inline: +C_C.toFixed(6),
  stencil_norm_q1: +STENCIL_NORM_Q1.toFixed(4), // sqrt(2) ~ 1.4142
  B1_predicted: +B1_PRED.toExponential(4), // ~1.294e-15 = sqrt(2) u |q| / 2 (deep-group max)
  q1_crossover_dp: +Math.pow(UNIT_ROUNDOFF, 1 / 3).toExponential(3), // ~6e-6, dp ~ u^(1/3)
  // Narrow imp-34646 baseline (loosely pinned):
  narrow_window: WINDOW_NARROW.map((dp) => +dp.toExponential(1)),
  m1_narrow: +FIT_NARROW.m.toFixed(4), // ~1.0686
  B1_narrow: +FIT_NARROW.B.toExponential(4), // ~4.90e-16
  ratio_narrow: +RATIO_NARROW.toFixed(3), // ~0.379 (below 1)
  r2_narrow: +FIT_NARROW.r2.toFixed(4), // ~0.9456
  // Wide window kept ENTIRELY DEEP (below the ~6e-6 crossover): BOTH knobs recover onto 1:
  wide_deep_window: WINDOW_WIDE_DEEP.map((dp) => +dp.toExponential(1)),
  m1_wide_deep: +FIT_WIDE_DEEP.m.toFixed(4), // ~0.9918 (onto the integer 1)
  B1_wide_deep: +FIT_WIDE_DEEP.B.toExponential(4), // ~1.457e-15
  ratio_wide_deep: +RATIO_WIDE_DEEP.toFixed(3), // ~1.126 (onto 1)
  r2_wide_deep: +FIT_WIDE_DEEP.r2.toFixed(4), // ~0.9275 -- NOT tighter than narrow (well-conditioned noise)
  // Wide windows that reach UP toward the crossover (reversal -- absent from the ill-conditioned q3):
  crossover_rows: Object.freeze(CROSSOVER_ROWS.map((r) => Object.freeze(r))),
  wide_deep_recovers: WIDE_DEEP_RECOVERS, // F1: exponent onto 1, amplitude onto 1
  r2_does_not_tighten: R2_DOES_NOT_TIGHTEN, // F2: scatter irreducible for the well-conditioned channel
  crossover_reverses: CROSSOVER_REVERSES, // F3: reaching toward the crossover inflates the amplitude
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Extends the imp-34647 WIDE-deep-window exponent/amplitude recovery DOWN ' +
    'one rung, to q1, the FIRST central difference [q1 = (q(p+dp) - q(p-dp)) / (2 dp), the well-' +
    'conditioned denominator q1^2 of the drift shares C_q2 = -q2/(2 q1^2), C_q3 = q3/(6 q1^2)]. imp-34646 ' +
    'measured the q1 deep-tail floor on a NARROW 5-point window dp = 1e-6 .. 5e-8 and found it loosely ' +
    'pinned (m1 ~ 1.069, amplitude ratio measured/predicted ~0.379, R^2 ~ 0.946) because q1 is well-' +
    'conditioned and its floor is a tiny ULP-jittery ABSOLUTE quantity. (F1) A WIDE window kept ENTIRELY ' +
    'DEEP (dp = 1e-6 .. 2e-8, 11 rungs, all below the truncation/roundoff crossover dp ~ u^(1/3) ~ 6e-6) ' +
    'drives BOTH knobs onto the parameter-free eps_mach |q| line: the slope from ~1.069 to ~0.992 (onto ' +
    'the integer 1) and the amplitude ratio from ~0.379 to ~1.126 (onto 1), each STRICTLY closer to 1 ' +
    'than the narrow baseline -- so the imp-34647 recovery does extend to the k = 1 rung and the narrow ' +
    'window low ratio was a small-sample artifact. (F2) BUT the fit does NOT tighten: unlike q3 ' +
    '(imp-34647 R^2 ~ 0.994) the q1 wide-deep-window R^2 stays ~0.927, no better than the narrow ~0.946, ' +
    'because q1 is well-conditioned so its floor scatter is a tiny ABSOLUTE ULP quantity -- wide-window ' +
    'averaging recovers the central slope/amplitude IN THE MEAN but the per-rung scatter is irreducible. ' +
    '(F3) A wide window that reaches UP toward the crossover REVERSES the recovery: dp = 3e-6 .. 5e-8 ' +
    'pulls the slope to m1 ~ 0.917 and inflates the amplitude ratio to ~3.99, and dp = 5e-6 .. 5e-8 to ' +
    '~8.83 -- the well-conditioned analogue absent from the ILL-conditioned q3 share (whose true ' +
    'numerator is ~0, roundoff all the way up), because the q1 ABSOLUTE error near the crossover carries ' +
    'a finite-difference-vs-reference contribution that biases the intercept up and the slope below 1; ' +
    'the q1 wide window must stay ENTIRELY below the crossover. NET: the imp-34647 wide-window method ' +
    'DOES recover the k = 1 exponent and the parameter-free amplitude (F1), with the refinement that the ' +
    'well-conditioned channel neither tightens the fit (F2) nor tolerates reaching toward its crossover ' +
    '(F3). q1 is the inherited first central difference, NOT a fresh analytic closed form, so the ' +
    'sigma -> 1 deep-tail regime (imp-3220 / imp-3406 component model least trustworthy) is inherited ' +
    'as-is -- this diagnoses the finite-difference conditioning of that measurement, it does not ' +
    'rehabilitate the model. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are ' +
    'UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; ' +
    'changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34647 (the wide-deep-window recovery this extends to k=1); ' +
    'imp-34646 (the narrow-window q1 baseline this widens -- m1 ~ 1.07, ratio ~0.38, R^2 ~ 0.946); ' +
    'imp-34633 (the eps_mach |q| amplitude prediction B1 = ||w1|| u |q| / 2); ' +
    'imp-34606 (the {2,3,4} SLOPE ladder q1 sits one below); ' +
    'imp-34531 (the C_q2/C_q3 drift shares q1^2 denominates); imp-34446 (central-difference exponent); ' +
    'imp-33620 (deep-tail landmark N* ~ 4.62e13, sigma < 0.01); imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34666_ASSERTIONS = [
  {
    id: 'imp34666-narrow-reproduces-imp34646',
    holds: () =>
      Math.abs(FIT_NARROW.m - 1.069) < 0.05 &&
      RATIO_NARROW > 0.3 &&
      RATIO_NARROW < 0.5 &&
      FIT_NARROW.r2 > 0.9 &&
      FIT_NARROW.r2 < 0.98,
    why: 'Baseline: the narrow 1e-6 .. 5e-8 window reproduces the imp-34646 q1 slope m1 ~ 1.069, amplitude ratio ~0.379 and R^2 ~ 0.946 verbatim.',
  },
  {
    id: 'imp34666-wide-deep-exponent-onto-1',
    holds: () => Math.abs(FIT_WIDE_DEEP.m - 1) < 0.05 && Math.abs(FIT_WIDE_DEEP.m - 1) < Math.abs(FIT_NARROW.m - 1),
    why: 'F1: the wide 1e-6 .. 2e-8 deep window drives the q1 exponent from ~1.069 onto the integer 1 (m1 ~ 0.992), strictly closer than the narrow baseline.',
  },
  {
    id: 'imp34666-wide-deep-amplitude-onto-1',
    holds: () =>
      RATIO_WIDE_DEEP > 0.6 &&
      RATIO_WIDE_DEEP < 1.6 &&
      Math.abs(RATIO_WIDE_DEEP - 1) < Math.abs(RATIO_NARROW - 1),
    why: 'F1: the wide deep window drives the q1 amplitude ratio from ~0.379 onto ~1.126 (toward 1) -- strictly closer than the narrow baseline.',
  },
  {
    id: 'imp34666-wide-deep-recovers',
    holds: () => WIDE_DEEP_RECOVERS,
    why: 'F1: the wide deep window recovers BOTH knobs (exponent onto 1, amplitude onto 1) strictly better than the narrow baseline -- the imp-34647 recovery extended to k=1.',
  },
  {
    id: 'imp34666-fit-does-not-tighten',
    holds: () => R2_DOES_NOT_TIGHTEN && FIT_WIDE_DEEP.r2 > 0.85,
    why: 'F2: the q1 wide-deep-window R^2 ~ 0.927 does NOT tighten (still ~0.93, unlike q3 ~0.994) because the well-conditioned floor scatter is a tiny irreducible ULP quantity.',
  },
  {
    id: 'imp34666-crossover-reverses',
    holds: () => CROSSOVER_REVERSES && RATIO_CROSSOVER_LOWEST > 2,
    why: 'F3: a wide window reaching toward the ~6e-6 crossover reverses the recovery -- the amplitude ratio inflates to ~3.99 and the slope falls below 1, the well-conditioned analogue absent from q3.',
  },
  {
    id: 'imp34666-honesty-gate-no-qed',
    holds: () =>
      IMP34666_Q1_WIDE_DEEP_WINDOW_EXPONENT_AMPLITUDE_RECOVERY.isRigorous === false &&
      /NO QED/.test(IMP34666_Q1_WIDE_DEEP_WINDOW_EXPONENT_AMPLITUDE_RECOVERY.verdict) &&
      /refereed bound is changed/i.test(IMP34666_Q1_WIDE_DEEP_WINDOW_EXPONENT_AMPLITUDE_RECOVERY.verdict) &&
      /UNTOUCHED/.test(IMP34666_Q1_WIDE_DEEP_WINDOW_EXPONENT_AMPLITUDE_RECOVERY.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34666_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34666-q1-wide-deep-window-exponent-amplitude-recovery assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34666_Q1_WIDE_DEEP_WINDOW_EXPONENT_AMPLITUDE_RECOVERY;
