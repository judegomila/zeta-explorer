/**
 * @module imp-34669-q2-q4-wide-deep-window-exponent-amplitude
 * @fileoverview imp-34669 -- MEASUREMENT ONLY: extends the imp-34647 wide-deep-window
 *   exponent/amplitude recovery from the q3 channel to the q2 and q4 channels. imp-34647 showed that a
 *   WIDE deep dp window (dp = 1e-4 .. 5e-7, ~20x deeper than the imp-34633 shallow window) drives the q3
 *   log-log fit from the loose shallow values (m3 ~ 2.90, amplitude ratio ~3.07) onto the clean integer
 *   exponent 3 and unit eps_mach amplitude ratio ~0.886. imp-34647 attributed q3s shallow-window
 *   looseness to its dp = 1e-4 .. 1e-5 window sitting LEAST DEEP in the roundoff floor of the three
 *   channels. That reading makes a testable prediction it never checked: do the SAME wide-deep-window
 *   averaging on the q2 and q4 channels, and see whether their imp-34633 shallow-window looseness is
 *   ALSO a least-deep-window artifact -- i.e. whether a wide deep window drives the q2 floor onto
 *   exponent 2 and the q4 floor onto exponent 4, each with an amplitude ratio onto 1. This module runs
 *   exactly that test.
 *
 *   WHAT THIS MEASUREMENT ADDS (beyond imp-34647)
 *   ---------------------------------------------
 *   Reusing the imp-34606/imp-34633/imp-34647 decomposition VERBATIM [same q1..q4 inherited central
 *   differences of q(p) = log E_coll in p = log N, same shares s2 = |q2|/(2 q1^2) and s4 = |q4|/(12 |q1|),
 *   same deep-tail landmarks N >= N* ~ 4.62e13, same parameter-free machine-epsilon predictions
 *   B2_pred = ||w2|| u |q| / (2 q1^2) and B4_pred = ||w4|| u |q| / (12 |q1|), ||w2|| = sqrt(6),
 *   ||w4|| = sqrt(70), u = eps/2], this module refits the q2 and q4 log-log lines on WIDE deep dp
 *   windows and reports the fitted exponent m_k and amplitude ratio B_k/B_k_pred versus the imp-34633
 *   shallow baseline -- the direct q2/q4 analogue of the imp-34647 q3 test.
 *
 *   THE FINDING (the q3 recovery does NOT generalize -- q2 and q4 were not least-deep)
 *   ---------------------------------------------------------------------------------
 *   (F1) q2 WAS ALREADY ON EXPONENT 2 AND NEAR AMPLITUDE 1 IN THE SHALLOW WINDOW, AND A WIDE DEEPER
 *        WINDOW DEGRADES IT. The imp-34633 shallow q2 window (dp = 2e-6 .. 1e-7) already gives
 *        m2 ~ 1.999 and amplitude ratio ~0.806 -- essentially onto the integer 2 and the eps_mach line
 *        already. Widening the window ~2x deeper (dp = 2e-6 .. 5e-8) does NOT improve it: the exponent
 *        FALLS to m2 ~ 1.878 (further from 2) and the ratio RISES to ~4.06 (further from 1), because the
 *        q2 roundoff window was already deep and pushing below dp ~ 1e-7 hits catastrophic cancellation
 *        in the 2nd difference. Unlike q3, q2 was never the least-deep channel, so it has no
 *        least-deep-window looseness to recover.
 *   (F2) q4 KEEPS ITS CLEAN EXPONENT 4 BUT ITS AMPLITUDE RATIO IS A STABLE ~0.4..0.5 THAT DOES NOT CLIMB
 *        TOWARD 1. The imp-34633 shallow q4 window (dp = 2e-3 .. 1e-3) gives m4 ~ 4.008 and amplitude
 *        ratio ~0.476. A wide deep window (dp = 2e-3 .. 1e-4, ~10x deeper) leaves the exponent clean
 *        (m4 ~ 4.041) but the amplitude ratio essentially unchanged at ~0.401 -- it does NOT approach 1.
 *        q4s amplitude offset from the parameter-free prediction is therefore a STABLE ~0.4..0.5 feature
 *        (the sqrt(70) stencil-norm prediction mildly over-predicts the 5-point 4th-difference floor),
 *        NOT a least-deep-window artifact that a deeper fit clears.
 *   (F3) NET: the imp-34647 q3 wide-deep-window recovery is SPECIFIC to q3 having been the least-deep
 *        channel in imp-34633; it does NOT generalize to q2 or q4. q2 was already optimally deep (a
 *        deeper window degrades it via cancellation) and q4s amplitude offset is stable across window
 *        depth. The wide-deep-window averaging is not a universal knob that pulls every channel onto its
 *        integer exponent and unit amplitude -- it corrected q3s specific least-deep placement only.
 *        This is a conditioning diagnostic on the finite-difference measurement; it changes no bound.
 *
 *   MEASUREMENT ONLY. This refits the q2/q4 log-log lines on wide deep windows and compares slope/
 *   amplitude to the same parameter-free machine-epsilon prediction; it changes NO bound. Reproduces the
 *   imp-34446 / imp-34531 / imp-34566 / imp-34573 / imp-34606 / imp-34633 / imp-34647 primitives inline
 *   (imports NOTHING -- no lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle),
 *   following the no-heavy-imports directive. q1..q4 are the inherited central differences, NOT fresh
 *   analytic closed forms -- so the sigma -> 1 deep-tail regime, where the inherited imp-3220 / imp-3406
 *   component model is least trustworthy, is inherited as-is (this diagnoses the finite-difference
 *   conditioning OF that measurement, it does not rehabilitate the model). The -2 asymptote and
 *   C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per
 *   imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 *   No refereed bound is changed.
 *
 *   @see imp-34647-q3-deeper-window-exponent-amplitude-convergence.js (the q3 wide-deep-window recovery this extends)
 *   @see imp-34633-roundoff-prefactor-amplitude-vs-epsmach.js (the shallow q2/q4 baselines: ratios 0.81 / 0.48)
 *   @see imp-34606-roundoff-amplification-exponent-ladder.js (the {2,3,4} SLOPE ladder)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma < 0.01)
 *
 *   Ticket: imp-34669 (numerical, medium). q2/q4 wide-deep-window exponent/amplitude test; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34566/imp-34573/imp-34606/imp-34633/imp-34647 primitives (imports NOTHING): --
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

// Central differences of q(p) = log E_coll in p = log N (identical to imp-34606/imp-34633/imp-34647).
function qDerivs(N, dp) {
  const p = Math.log(N);
  const q = (pp) => Math.log(eColl(Math.exp(pp)));
  const f0 = q(p);
  const fp = q(p + dp);
  const fm = q(p - dp);
  const fpp = q(p + 2 * dp);
  const fmm = q(p - 2 * dp);
  const q1 = (fp - fm) / (2 * dp);
  const q2 = (fp - 2 * f0 + fm) / (dp * dp);
  const q4 = (fpp - 4 * fp + 6 * f0 - 4 * fm + fmm) / (dp * dp * dp * dp);
  return { q1, q2, q4, f0 };
}

// Deep-tail landmarks only (N >= N* ~ 4.62e13, imp-33620 sigma < 0.01) -- the regime under stress.
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];
const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;

// The q2 and q4 channel coefficient shares (imp-34543/imp-34566/imp-34606/imp-34633 decomposition).
function channelShare(N, dp, k) {
  const { q1, q2, q4 } = qDerivs(N, dp);
  if (k === 2) return Math.abs(q2 / (2 * q1 * q1));
  return Math.abs(q4 / (12 * q1)); // k === 4
}

// Deep-group max apparent share of channel k at a given q-derivative step -- the worst-case rung.
function deepGroupMaxShare(dp, k) {
  return Math.max(...DEEP_LADDER.map((N) => channelShare(N, dp, k)));
}

// Log-log least-squares fit -- returns the SLOPE m_k AND the INTERCEPT prefactor B_k = exp(lnb_k).
function logLogFit(steps, k) {
  const xs = steps.map((dp) => Math.log(dp));
  const ys = steps.map((dp) => Math.log(deepGroupMaxShare(dp, k)));
  const xbar = mean(xs);
  const ybar = mean(ys);
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < xs.length; i++) {
    sxy += (xs[i] - xbar) * (ys[i] - ybar);
    sxx += (xs[i] - xbar) * (xs[i] - xbar);
  }
  const slope = sxy / sxx; // = -m_k
  const lnb = ybar - slope * xbar; // intercept at log dp = 0 -> amplitude B_k = exp(lnb)
  const yhat = xs.map((x) => lnb + slope * x);
  const ssr = ys.reduce((s, y, i) => s + (y - yhat[i]) * (y - yhat[i]), 0);
  const sst = ys.reduce((s, y) => s + (y - ybar) * (y - ybar), 0);
  return { m: -slope, B: Math.exp(lnb), r2: 1 - ssr / sst };
}

// --- Parameter-free machine-epsilon PREDICTION of the intercept prefactors (VERBATIM imp-34633) ---
const STENCIL_NORM_Q2 = Math.sqrt(1 + 4 + 1); // weights {1,-2,1}      -> sqrt(6)  ~ 2.449
const STENCIL_NORM_Q4 = Math.sqrt(1 + 16 + 36 + 16 + 1); // weights {1,-4,6,-4,1} -> sqrt(70) ~ 8.367
function trueMagnitudes(N) {
  const { q1, f0 } = qDerivs(N, 1e-2); // true magnitudes at a NON-roundoff step (imp-34633)
  return { absQ: Math.abs(f0), absQ1: Math.abs(q1) };
}
function predictedPrefactor(N, k) {
  const { absQ, absQ1 } = trueMagnitudes(N);
  if (k === 2) return (STENCIL_NORM_Q2 * UNIT_ROUNDOFF * absQ) / (2 * absQ1 * absQ1);
  return (STENCIL_NORM_Q4 * UNIT_ROUNDOFF * absQ) / (12 * absQ1); // k === 4
}
const B2_PRED = Math.max(...DEEP_LADDER.map((N) => predictedPrefactor(N, 2))); // ~9.51e-15
const B4_PRED = Math.max(...DEEP_LADDER.map((N) => predictedPrefactor(N, 4))); // ~2.63e-15

// --- The imp-34633 SHALLOW baselines (VERBATIM windows) ---
const WINDOW_Q2_SHALLOW = [2e-6, 1e-6, 5e-7, 3e-7, 1e-7]; // VERBATIM imp-34606/imp-34633
const WINDOW_Q4_SHALLOW = [2e-3, 1.4e-3, 1e-3]; // VERBATIM imp-34606/imp-34633
const FIT_Q2_SHALLOW = logLogFit(WINDOW_Q2_SHALLOW, 2); // m ~ 1.999, ratio ~0.806
const FIT_Q4_SHALLOW = logLogFit(WINDOW_Q4_SHALLOW, 4); // m ~ 4.008, ratio ~0.476

// --- WIDE deep windows: the direct q2/q4 analogue of the imp-34647 q3 wide window ---
// q2: extend the shallow 2e-6 .. 1e-7 window ~2x deeper to 5e-8 (11 rungs).
const WINDOW_Q2_WIDE_DEEP = [2e-6, 1.4e-6, 1e-6, 7e-7, 5e-7, 3e-7, 2e-7, 1.4e-7, 1e-7, 7e-8, 5e-8];
// q4: extend the shallow 2e-3 .. 1e-3 window ~10x deeper to 1e-4 (9 rungs).
const WINDOW_Q4_WIDE_DEEP = [2e-3, 1.4e-3, 1e-3, 7e-4, 5e-4, 3e-4, 2e-4, 1.4e-4, 1e-4];
const FIT_Q2_WIDE_DEEP = logLogFit(WINDOW_Q2_WIDE_DEEP, 2); // m ~ 1.878, ratio ~4.06 (DEGRADES)
const FIT_Q4_WIDE_DEEP = logLogFit(WINDOW_Q4_WIDE_DEEP, 4); // m ~ 4.041, ratio ~0.401 (STABLE)

const RATIO_Q2_SHALLOW = FIT_Q2_SHALLOW.B / B2_PRED; // ~0.806
const RATIO_Q2_WIDE_DEEP = FIT_Q2_WIDE_DEEP.B / B2_PRED; // ~4.06
const RATIO_Q4_SHALLOW = FIT_Q4_SHALLOW.B / B4_PRED; // ~0.476
const RATIO_Q4_WIDE_DEEP = FIT_Q4_WIDE_DEEP.B / B4_PRED; // ~0.401

// Per-rung s_k(dp) / (B_k_pred / dp^k): how far each rung sits from the pure-roundoff line.
const PER_RUNG_RATIO_Q2 = WINDOW_Q2_WIDE_DEEP.map((dp) => deepGroupMaxShare(dp, 2) / (B2_PRED / Math.pow(dp, 2)));
const PER_RUNG_RATIO_Q4 = WINDOW_Q4_WIDE_DEEP.map((dp) => deepGroupMaxShare(dp, 4) / (B4_PRED / Math.pow(dp, 4)));

const CHANNEL_ROWS = [
  {
    channel: 'q2 (2nd difference / dp^2, integer exponent 2)',
    k: 2,
    m_shallow: +FIT_Q2_SHALLOW.m.toFixed(4), // ~1.999
    ratio_shallow: +RATIO_Q2_SHALLOW.toFixed(3), // ~0.806
    r2_shallow: +FIT_Q2_SHALLOW.r2.toFixed(4),
    m_wide_deep: +FIT_Q2_WIDE_DEEP.m.toFixed(4), // ~1.878
    ratio_wide_deep: +RATIO_Q2_WIDE_DEEP.toFixed(3), // ~4.06
    r2_wide_deep: +FIT_Q2_WIDE_DEEP.r2.toFixed(4),
    exponent_recovered: false, // wide deep window does NOT drive it onto 2 -- it degrades
    amplitude_recovered: false, // ratio moves AWAY from 1
  },
  {
    channel: 'q4 (4th difference / dp^4, integer exponent 4)',
    k: 4,
    m_shallow: +FIT_Q4_SHALLOW.m.toFixed(4), // ~4.008
    ratio_shallow: +RATIO_Q4_SHALLOW.toFixed(3), // ~0.476
    r2_shallow: +FIT_Q4_SHALLOW.r2.toFixed(4),
    m_wide_deep: +FIT_Q4_WIDE_DEEP.m.toFixed(4), // ~4.041
    ratio_wide_deep: +RATIO_Q4_WIDE_DEEP.toFixed(3), // ~0.401
    r2_wide_deep: +FIT_Q4_WIDE_DEEP.r2.toFixed(4),
    exponent_recovered: true, // exponent stays clean near 4 (was already clean)
    amplitude_recovered: false, // ratio stays a stable ~0.4..0.5, does NOT climb toward 1
  },
];

// Did the wide-deep-window recovery seen for q3 (imp-34647) generalize to q2 AND q4?
// It did NOT: q2 was already onto 2/near 1 and degrades deeper; q4 amplitude ratio stays ~0.4..0.5.
const Q3_RECOVERY_GENERALIZES =
  Math.abs(FIT_Q2_WIDE_DEEP.m - 2) < Math.abs(FIT_Q2_SHALLOW.m - 2) &&
  Math.abs(RATIO_Q2_WIDE_DEEP - 1) < Math.abs(RATIO_Q2_SHALLOW - 1) &&
  Math.abs(RATIO_Q4_WIDE_DEEP - 1) < Math.abs(RATIO_Q4_SHALLOW - 1);

export const IMP34669_Q2_Q4_WIDE_DEEP_WINDOW_EXPONENT_AMPLITUDE = Object.freeze({
  id: 'imp-34669',
  proofSection: 'S-frontier',
  claim_measured:
    'Extend the imp-34647 wide-deep-window exponent/amplitude test from q3 to the q2 and q4 channels: ' +
    'refit the deep-tail q2 and q4 log-log roundoff lines [shares s2 = |q2|/(2 q1^2), s4 = |q4|/(12 |q1|), ' +
    'deep-tail N >= N* ~ 4.62e13, imp-33620 sigma < 0.01] on WIDE deep dp windows and measure whether the ' +
    'exponents are driven onto 2 and 4 with amplitude ratios onto 1, as the wide window drove q3 onto 3; ' +
    'a conditioning diagnostic, not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  eps_mach: EPS_MACH,
  unit_roundoff_u: +UNIT_ROUNDOFF.toExponential(4),
  C_C_inline: +C_C.toFixed(6),
  B2_predicted: +B2_PRED.toExponential(4), // ~9.51e-15 (VERBATIM imp-34633)
  B4_predicted: +B4_PRED.toExponential(4), // ~2.63e-15 (VERBATIM imp-34633)
  // q2 shallow baseline (already on exponent 2, near amplitude 1):
  q2_shallow_window: WINDOW_Q2_SHALLOW.map((dp) => +dp.toExponential(1)),
  m2_shallow: +FIT_Q2_SHALLOW.m.toFixed(4), // ~1.999
  ratio_q2_shallow: +RATIO_Q2_SHALLOW.toFixed(3), // ~0.806
  // q2 wide deep window (~2x deeper): DEGRADES both knobs:
  q2_wide_deep_window: WINDOW_Q2_WIDE_DEEP.map((dp) => +dp.toExponential(1)),
  m2_wide_deep: +FIT_Q2_WIDE_DEEP.m.toFixed(4), // ~1.878 (further from 2)
  ratio_q2_wide_deep: +RATIO_Q2_WIDE_DEEP.toFixed(3), // ~4.06 (further from 1)
  r2_q2_wide_deep: +FIT_Q2_WIDE_DEEP.r2.toFixed(4),
  // q4 shallow baseline (clean exponent 4, amplitude ratio ~0.48):
  q4_shallow_window: WINDOW_Q4_SHALLOW.map((dp) => +dp.toExponential(1)),
  m4_shallow: +FIT_Q4_SHALLOW.m.toFixed(4), // ~4.008
  ratio_q4_shallow: +RATIO_Q4_SHALLOW.toFixed(3), // ~0.476
  // q4 wide deep window (~10x deeper): exponent stays clean, amplitude ratio STABLE (does NOT climb to 1):
  q4_wide_deep_window: WINDOW_Q4_WIDE_DEEP.map((dp) => +dp.toExponential(1)),
  m4_wide_deep: +FIT_Q4_WIDE_DEEP.m.toFixed(4), // ~4.041
  ratio_q4_wide_deep: +RATIO_Q4_WIDE_DEEP.toFixed(3), // ~0.401
  r2_q4_wide_deep: +FIT_Q4_WIDE_DEEP.r2.toFixed(4),
  per_rung_ratio_q2_min: +Math.min(...PER_RUNG_RATIO_Q2).toFixed(3),
  per_rung_ratio_q2_max: +Math.max(...PER_RUNG_RATIO_Q2).toFixed(3),
  per_rung_ratio_q4_min: +Math.min(...PER_RUNG_RATIO_Q4).toFixed(3),
  per_rung_ratio_q4_max: +Math.max(...PER_RUNG_RATIO_Q4).toFixed(3),
  channel_rows: Object.freeze(CHANNEL_ROWS.map((r) => Object.freeze(r))),
  q3_recovery_generalizes: Q3_RECOVERY_GENERALIZES, // FALSE -- the q3 recovery is q3-specific
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Extends the imp-34647 wide-deep-window exponent/amplitude test from the ' +
    'q3 channel to the q2 and q4 finite-difference channels [q_k the inherited k-point central difference ' +
    'of q(p) = log E_coll in p = log N; shares s2 = |q2|/(2 q1^2), s4 = |q4|/(12 |q1|); deep = ' +
    'N >= N* ~ 4.62e13, imp-33620 sigma < 0.01; parameter-free predictions B2 = ||w2|| u |q| / (2 q1^2), ' +
    'B4 = ||w4|| u |q| / (12 |q1|), ||w2|| = sqrt(6), ||w4|| = sqrt(70), u = eps/2]. imp-34647 showed a ' +
    'WIDE deep window drives q3 from m3 ~ 2.90 / ratio ~3.07 onto m3 ~ 3.008 / ratio ~0.886, and read ' +
    'q3s looseness as a LEAST-DEEP-window artifact; this tests whether the same holds for q2 and q4. ' +
    '(F1) q2 was ALREADY on exponent 2 and near amplitude 1 in the imp-34633 shallow window ' +
    '(dp = 2e-6 .. 1e-7: m2 ~ 1.999, ratio ~0.806); a wide DEEPER window (dp = 2e-6 .. 5e-8) DEGRADES it ' +
    '(m2 ~ 1.878, ratio ~4.06) because the q2 roundoff window was already deep and pushing below ' +
    'dp ~ 1e-7 hits catastrophic cancellation in the 2nd difference -- q2 was never the least-deep ' +
    'channel. (F2) q4 keeps its clean exponent 4 (shallow m4 ~ 4.008, wide-deep m4 ~ 4.041) but its ' +
    'amplitude ratio is a STABLE ~0.4..0.5 (shallow ~0.476, wide-deep ~0.401) that does NOT climb toward ' +
    '1 -- the sqrt(70) stencil-norm prediction mildly over-predicts the 5-point 4th-difference floor, a ' +
    'stable offset, not a least-deep-window artifact. (F3) NET: the imp-34647 q3 wide-deep-window ' +
    'recovery is SPECIFIC to q3 having been the least-deep channel in imp-34633; it does NOT generalize ' +
    'to q2 (already optimally deep; deeper degrades it) or q4 (stable amplitude offset). q1..q4 are ' +
    'inherited central differences, NOT fresh analytic closed forms, so the sigma -> 1 deep-tail regime ' +
    '(imp-3220 / imp-3406 component model least trustworthy) is inherited as-is -- this diagnoses the ' +
    'finite-difference conditioning of that measurement, it does not rehabilitate the model. The -2 ' +
    'asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb ' +
    'GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34647 (the q3 wide-deep-window recovery this extends to q2/q4); ' +
    'imp-34633 (the shallow q2/q4 baselines -- ratios 0.806 / 0.476); ' +
    'imp-34606 (the {2,3,4} SLOPE ladder); imp-34592 (q4 O(h^4) share inflates ~1/dp^4); ' +
    'imp-34566 (truncation-vs-roundoff finite-difference floor F3); imp-34531 (F2 O(h^2) coefficient); ' +
    'imp-34446 (central-difference exponent); imp-33620 (deep-tail landmark N* ~ 4.62e13, sigma < 0.01); ' +
    'imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34669_ASSERTIONS = [
  {
    id: 'imp34669-q2-shallow-reproduces-imp34633',
    holds: () =>
      Math.abs(FIT_Q2_SHALLOW.m - 2) < 0.05 && RATIO_Q2_SHALLOW > 0.6 && RATIO_Q2_SHALLOW < 1.1,
    why: 'Baseline: the shallow 2e-6 .. 1e-7 q2 window reproduces the imp-34633 slope m2 ~ 1.999 and amplitude ratio ~0.806 verbatim -- already on exponent 2, near amplitude 1.',
  },
  {
    id: 'imp34669-q2-wide-deep-degrades',
    holds: () =>
      Math.abs(FIT_Q2_WIDE_DEEP.m - 2) > Math.abs(FIT_Q2_SHALLOW.m - 2) &&
      Math.abs(RATIO_Q2_WIDE_DEEP - 1) > Math.abs(RATIO_Q2_SHALLOW - 1),
    why: 'F1: a wide DEEPER q2 window degrades BOTH knobs (exponent from ~1.999 to ~1.878, ratio from ~0.806 to ~4.06) -- q2 was already deep, so pushing deeper hits catastrophic cancellation, unlike q3.',
  },
  {
    id: 'imp34669-q4-shallow-reproduces-imp34633',
    holds: () =>
      Math.abs(FIT_Q4_SHALLOW.m - 4) < 0.1 && RATIO_Q4_SHALLOW > 0.3 && RATIO_Q4_SHALLOW < 0.7,
    why: 'Baseline: the shallow 2e-3 .. 1e-3 q4 window reproduces the imp-34633 slope m4 ~ 4.008 and amplitude ratio ~0.476 verbatim.',
  },
  {
    id: 'imp34669-q4-exponent-stays-clean-amplitude-stable',
    holds: () =>
      Math.abs(FIT_Q4_WIDE_DEEP.m - 4) < 0.1 &&
      RATIO_Q4_WIDE_DEEP > 0.3 &&
      RATIO_Q4_WIDE_DEEP < 0.7 &&
      Math.abs(RATIO_Q4_WIDE_DEEP - 1) > Math.abs(RATIO_Q4_SHALLOW - 1) - 0.2,
    why: 'F2: the wide deep q4 window keeps the clean exponent 4 (m4 ~ 4.041) but leaves the amplitude ratio a stable ~0.4..0.5 (~0.401) -- it does NOT climb toward 1, so q4s offset is not a least-deep-window artifact.',
  },
  {
    id: 'imp34669-q3-recovery-does-not-generalize',
    holds: () => Q3_RECOVERY_GENERALIZES === false,
    why: 'F3: the imp-34647 q3 wide-deep-window recovery does NOT generalize -- neither q2 (degrades deeper) nor q4 (stable amplitude offset) has its looseness cleared by a wide deep window.',
  },
  {
    id: 'imp34669-honesty-gate-no-qed',
    holds: () =>
      IMP34669_Q2_Q4_WIDE_DEEP_WINDOW_EXPONENT_AMPLITUDE.isRigorous === false &&
      /NO QED/.test(IMP34669_Q2_Q4_WIDE_DEEP_WINDOW_EXPONENT_AMPLITUDE.verdict) &&
      /refereed bound is changed/i.test(IMP34669_Q2_Q4_WIDE_DEEP_WINDOW_EXPONENT_AMPLITUDE.verdict) &&
      /UNTOUCHED/.test(IMP34669_Q2_Q4_WIDE_DEEP_WINDOW_EXPONENT_AMPLITUDE.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34669_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34669-q2-q4-wide-deep-window-exponent-amplitude assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34669_Q2_Q4_WIDE_DEEP_WINDOW_EXPONENT_AMPLITUDE;
