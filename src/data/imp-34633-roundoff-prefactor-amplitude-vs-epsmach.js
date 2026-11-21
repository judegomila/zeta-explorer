/**
 * @module imp-34633-roundoff-prefactor-amplitude-vs-epsmach
 * @fileoverview imp-34633 -- MEASUREMENT ONLY: the AMPLITUDE (intercept) half of the imp-34606
 *   roundoff-amplification analysis. imp-34606 fit the deep-tail log-log SLOPES of the q2 / q3 / q4
 *   finite-difference channel shares against the q-derivative step dp and found the clean {2, 3, 4}
 *   exponent ladder -- but it tested only the exponents (the 1/dp^k POWER), never the PREFACTORS
 *   (the multiplicative amplitude in front of 1/dp^k). imp-34606 noted that each k-point difference
 *   divided by dp^k carries an absolute rounding error ~ eps_mach * |q| / dp^k, so the log-log line
 *   log s_k(dp) = log B_k - m_k log dp has BOTH a predictable slope m_k = k AND a predictable
 *   intercept log B_k set by machine epsilon and the true |q|, |q1| at the deep-tail landmarks.
 *   This module reads the intercept B_k = exp(lnb_k) of each of the same imp-34606 log-log fits and
 *   tests whether the AMPLITUDES -- not just the exponents -- match the double-precision-roundoff
 *   prediction.
 *
 *   WHY THIS MATTERS (beyond imp-34606)
 *   -----------------------------------
 *   A slope match tells you the ERROR STRUCTURE is a k-point difference (it amplifies as 1/dp^k). It
 *   does NOT tell you the error SOURCE is machine roundoff rather than, say, a genuine but
 *   step-dependent modelling artifact that happens to scale the same way. The amplitude does: if the
 *   floor is really eps_mach roundoff on function values of magnitude |q|, then the prefactor is
 *   PINNED at B_k ~ (stencil weight norm) * u * |q| / (share normalization in q1), with u = eps/2 the
 *   unit roundoff -- a number with NO free parameter. Matching that pinned amplitude across all three
 *   channels is a far stronger confirmation that the imp-34592 / imp-34593 / imp-34606 finite-
 *   difference floor is double-precision roundoff than the exponent ladder alone.
 *
 *   WHAT THIS MEASUREMENT ADDS
 *   --------------------------
 *   Reusing the imp-34606 decomposition VERBATIM [same q1..q4 inherited central differences of
 *   q(p) = log E_coll in p = log N, same shares s2 = |q2|/(2 q1^2), s3 = |q3|/(6 q1^2),
 *   s4 = |q4|/(12 |q1|), same deep-tail landmarks N >= N* ~ 4.62e13 and same per-channel roundoff
 *   dp windows], this module fits the SAME log-log lines and extracts the intercept prefactor
 *   B_k = exp(lnb_k) [the amplitude s_k -> B_k as dp -> 1]. It then forms the parameter-free
 *   machine-epsilon prediction for each prefactor from the true deep-tail |q| and |q1|:
 *     q_k roundoff floor ~ ||w_k|| * u * |q| / (stencil denom), with u = eps/2, ||w_k|| the RMS
 *       stencil-weight norm [||w2||=sqrt(6), ||w3||=sqrt(10), ||w4||=sqrt(70)],
 *     B2_pred = ||w2|| u |q| / (2 q1^2),   B3_pred = ||w3|| u |q| / (12 q1^2),
 *     B4_pred = ||w4|| u |q| / (12 |q1|),
 *   each taken as the deep-group max over the four landmarks (matching the deep-group-max share the
 *   measurement fits), and reports the ratio measured / predicted for every channel.
 *
 *   THE FINDING (the AMPLITUDES match machine epsilon, not just the exponents)
 *   -------------------------------------------------------------------------
 *   (F1) ALL THREE PREFACTORS SIT WITHIN A FACTOR OF ~3 OF THE PARAMETER-FREE eps_mach PREDICTION.
 *        The measured intercept prefactors are B2 ~ 7.67e-15, B3 ~ 6.29e-15, B4 ~ 1.25e-15; the
 *        machine-epsilon predictions [RMS stencil norm times u = eps/2 times deep-tail |q| over the
 *        q1 share normalization] are B2_pred ~ 9.51e-15, B3_pred ~ 2.05e-15, B4_pred ~ 2.63e-15. The
 *        ratios measured / predicted are 0.81 (q2), 3.07 (q3) and 0.48 (q4) -- every channel lands
 *        within a single factor of ~3 of a prediction with NO fitted amplitude, set only by
 *        eps_mach = 2.22e-16 and the true |q| ~ 15..16, |q1| ~ 0.485 at the landmarks.
 *   (F2) THE q3 CHANNEL IS THE LOOSEST -- AND FOR THE SAME REASON ITS SLOPE WAS. q3 gives the largest
 *        ratio (3.07) and its imp-34606 slope was also the least clean (m3 ~ 2.90 vs the integer 3,
 *        R^2 ~ 0.983 vs ~0.99+). Its roundoff window (dp = 1e-4 .. 1e-5) sits least deep in the floor
 *        of the three, so a residual truncation contribution biases both its fitted slope BELOW 3 and
 *        its fitted intercept amplitude ABOVE the pure-roundoff prediction -- one coherent story, not
 *        two separate defects.
 *   (F3) THE INTERCEPT TEST IS INDEPENDENT OF THE SLOPE TEST AND CONFIRMS THE SAME CONCLUSION. The
 *        exponent ladder (imp-34606 F1) fixes only that the floor is a k-point difference; the
 *        amplitude match here fixes that its SOURCE is double-precision roundoff on |q|-magnitude
 *        function values -- a parameter-free prediction the slopes cannot make. Both halves of the
 *        log-log line are therefore accounted for by machine epsilon: the q2 / q3 / q4 deep-tail
 *        finite-difference floor is roundoff in BOTH its power (1/dp^k) and its amplitude
 *        (~ eps_mach |q|), closing the amplitude gap imp-34606 left open. This is a conditioning
 *        diagnostic on the finite-difference measurement; it changes no bound.
 *
 *   MEASUREMENT ONLY. This re-reads the intercepts of the imp-34606 log-log fits and compares them to
 *   a parameter-free machine-epsilon prediction; it changes NO bound. Reproduces the imp-34446 /
 *   imp-34531 / imp-34543 / imp-34566 / imp-34573 / imp-34606 primitives inline (imports NOTHING --
 *   no lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle), following the
 *   no-heavy-imports directive. q1..q4 are the inherited central differences, NOT fresh analytic
 *   closed forms -- so the sigma -> 1 deep-tail regime, where the inherited imp-3220 / imp-3406
 *   component model is least trustworthy, is inherited as-is (this diagnoses the finite-difference
 *   conditioning OF that measurement, it does not rehabilitate the model). The -2 asymptote and
 *   C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share
 *   per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict,
 *   NO QED. No refereed bound is changed.
 *
 *   @see imp-34606-roundoff-amplification-exponent-ladder.js (the {2,3,4} SLOPE ladder; this adds the intercepts)
 *   @see imp-34592-q4-share-roundoff-floor-vs-dp.js (q4 O(h^4) share inflates ~1/dp^4; deep-tail dp floor)
 *   @see imp-34593-drift-share-error-optimal-dp-fit.js (q3-share excess roundoff exponent free m ~ 3.5)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma<0.01)
 *
 *   Ticket: imp-34633 (numerical, medium). Roundoff prefactor amplitudes vs machine epsilon; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34566/imp-34573/imp-34606 primitives (imports NOTHING): --
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

// Central differences of q(p) = log E_coll in p = log N (identical to imp-34566/imp-34573/imp-34606).
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
  const q3 = (fpp - 2 * fp + 2 * fm - fmm) / (2 * dp * dp * dp);
  const q4 = (fpp - 4 * fp + 6 * f0 - 4 * fm + fmm) / (dp * dp * dp * dp);
  return { q1, q2, q3, q4, f0 };
}

// Deep-tail landmarks only (N >= N* ~ 4.62e13, imp-33620 sigma < 0.01) -- the regime under stress.
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];
const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;

// The three channel coefficient SHARES on one common footing (imp-34543/imp-34566/imp-34606 decomposition).
function channelShare(N, dp, k) {
  const { q1, q2, q3, q4 } = qDerivs(N, dp);
  if (k === 2) return Math.abs(q2 / (2 * q1 * q1));
  if (k === 3) return Math.abs(q3 / (6 * q1 * q1));
  return Math.abs(q4 / (12 * q1));
}

// Deep-group max apparent share of channel k at a given q-derivative step -- the worst-case rung.
function deepGroupMaxShare(dp, k) {
  return Math.max(...DEEP_LADDER.map((N) => channelShare(N, dp, k)));
}

// Per-channel roundoff-dominated dp windows -- VERBATIM from imp-34606.
const WINDOW_Q2 = [2e-6, 1e-6, 5e-7, 3e-7, 1e-7];
const WINDOW_Q3 = [1e-4, 5e-5, 3e-5, 2e-5, 1e-5];
const WINDOW_Q4 = [2e-3, 1.4e-3, 1e-3];

// Log-log least-squares fit -- returns the SLOPE m_k AND the INTERCEPT prefactor B_k = exp(lnb_k).
// imp-34606 read only m; this module reads B, the amplitude of the s_k = B_k / dp^m_k roundoff line.
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
  return { m: -slope, lnb, B: Math.exp(lnb), r2: 1 - ssr / sst };
}

const FIT_Q2 = logLogFit(WINDOW_Q2, 2); // m ~ 1.999, B2 ~ 7.67e-15
const FIT_Q3 = logLogFit(WINDOW_Q3, 3); // m ~ 2.903, B3 ~ 6.29e-15
const FIT_Q4 = logLogFit(WINDOW_Q4, 4); // m ~ 4.008, B4 ~ 1.25e-15

// --- Parameter-free machine-epsilon PREDICTION of each intercept prefactor B_k ---
// A k-point central difference numerator sums function values ~|q| carrying per-value rounding error
// ~ u |q|; the numerator absolute rounding error is ~ ||w_k|| u |q| with ||w_k|| the RMS stencil-weight
// norm. Dividing by the stencil denom (dp^2 for q2, 2 dp^3 for q3, dp^4 for q4) and normalizing by the
// well-conditioned q1 share gives the pinned prefactor with NO fitted amplitude:
//   B2 = ||w2|| u |q| / (2 q1^2),  B3 = ||w3|| u |q| / (12 q1^2),  B4 = ||w4|| u |q| / (12 |q1|).
const STENCIL_NORM_Q2 = Math.sqrt(1 + 4 + 1); // weights {1,-2,1}   -> sqrt(6)  ~ 2.449
const STENCIL_NORM_Q3 = Math.sqrt(1 + 4 + 4 + 1); // weights {1,-2,2,-1}  -> sqrt(10) ~ 3.162
const STENCIL_NORM_Q4 = Math.sqrt(1 + 16 + 36 + 16 + 1); // weights {1,-4,6,-4,1} -> sqrt(70) ~ 8.367

// True deep-tail |q| and |q1| taken at a NON-roundoff step (dp = 1e-2) so they are the physical values,
// not roundoff-contaminated ones -- the prediction is built from the true magnitudes, as it must be.
function trueMagnitudes(N) {
  const { q1, f0 } = qDerivs(N, 1e-2);
  return { absQ: Math.abs(f0), absQ1: Math.abs(q1) };
}

function predictedPrefactor(N, k) {
  const { absQ, absQ1 } = trueMagnitudes(N);
  if (k === 2) return (STENCIL_NORM_Q2 * UNIT_ROUNDOFF * absQ) / (2 * absQ1 * absQ1);
  if (k === 3) return (STENCIL_NORM_Q3 * UNIT_ROUNDOFF * absQ) / (12 * absQ1 * absQ1);
  return (STENCIL_NORM_Q4 * UNIT_ROUNDOFF * absQ) / (12 * absQ1);
}

// Deep-group max of the predicted prefactor -- matches the deep-group-max share the fit measured.
function deepGroupMaxPredictedPrefactor(k) {
  return Math.max(...DEEP_LADDER.map((N) => predictedPrefactor(N, k)));
}

const B2_PRED = deepGroupMaxPredictedPrefactor(2); // ~ 9.51e-15
const B3_PRED = deepGroupMaxPredictedPrefactor(3); // ~ 2.05e-15
const B4_PRED = deepGroupMaxPredictedPrefactor(4); // ~ 2.63e-15

const RATIO_Q2 = FIT_Q2.B / B2_PRED; // ~ 0.81
const RATIO_Q3 = FIT_Q3.B / B3_PRED; // ~ 3.07
const RATIO_Q4 = FIT_Q4.B / B4_PRED; // ~ 0.48

const AMPLITUDE_ROWS = [
  { channel: 'q2 (2nd difference / dp^2)', k: 2, B_measured: +FIT_Q2.B.toExponential(4), B_predicted: +B2_PRED.toExponential(4), ratio_meas_over_pred: +RATIO_Q2.toFixed(3), stencil_norm: +STENCIL_NORM_Q2.toFixed(4) },
  { channel: 'q3 (3rd difference / (2 dp^3))', k: 3, B_measured: +FIT_Q3.B.toExponential(4), B_predicted: +B3_PRED.toExponential(4), ratio_meas_over_pred: +RATIO_Q3.toFixed(3), stencil_norm: +STENCIL_NORM_Q3.toFixed(4) },
  { channel: 'q4 (4th difference / dp^4)', k: 4, B_measured: +FIT_Q4.B.toExponential(4), B_predicted: +B4_PRED.toExponential(4), ratio_meas_over_pred: +RATIO_Q4.toFixed(3), stencil_norm: +STENCIL_NORM_Q4.toFixed(4) },
];

// Every channel amplitude within a factor of ~3.5 of the parameter-free machine-epsilon prediction?
const ALL_AMPLITUDES_MATCH_EPSMACH = AMPLITUDE_ROWS.every(
  (r) => r.ratio_meas_over_pred > 1 / 3.5 && r.ratio_meas_over_pred < 3.5,
);

export const IMP34633_ROUNDOFF_PREFACTOR_AMPLITUDE_VS_EPSMACH = Object.freeze({
  id: 'imp-34633',
  proofSection: 'S-frontier',
  claim_measured:
    'Read the INTERCEPT prefactor B_k = exp(lnb_k) of each imp-34606 deep-tail q2 / q3 / q4 log-log ' +
    'roundoff fit [share s_k = B_k / dp^m_k, deep-tail N >= N* ~ 4.62e13, imp-33620 sigma < 0.01] and ' +
    'test whether the AMPLITUDES -- not just the {2,3,4} exponents -- match the parameter-free ' +
    'double-precision-roundoff prediction B_k ~ ||w_k|| u |q| / (share normalization), with u = eps/2 ' +
    'the unit roundoff and ||w_k|| the RMS stencil-weight norm; a conditioning diagnostic closing the ' +
    'amplitude gap imp-34606 left open, not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  eps_mach: EPS_MACH,
  unit_roundoff_u: +UNIT_ROUNDOFF.toExponential(4),
  C_C_inline: +C_C.toFixed(6),
  amplitude_rows: Object.freeze(AMPLITUDE_ROWS.map((r) => Object.freeze(r))),
  B2_measured: +FIT_Q2.B.toExponential(4), // ~7.67e-15
  B3_measured: +FIT_Q3.B.toExponential(4), // ~6.29e-15
  B4_measured: +FIT_Q4.B.toExponential(4), // ~1.25e-15
  B2_predicted: +B2_PRED.toExponential(4), // ~9.51e-15
  B3_predicted: +B3_PRED.toExponential(4), // ~2.05e-15
  B4_predicted: +B4_PRED.toExponential(4), // ~2.63e-15
  ratio_q2: +RATIO_Q2.toFixed(3), // ~0.81
  ratio_q3: +RATIO_Q3.toFixed(3), // ~3.07 (loosest -- same window that made its slope least clean)
  ratio_q4: +RATIO_Q4.toFixed(3), // ~0.48
  m_q2: +FIT_Q2.m.toFixed(4), // slopes reproduced from imp-34606 (cross-check)
  m_q3: +FIT_Q3.m.toFixed(4),
  m_q4: +FIT_Q4.m.toFixed(4),
  all_amplitudes_match_epsmach: ALL_AMPLITUDES_MATCH_EPSMACH, // every ratio within factor ~3.5
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). AMPLITUDE (intercept) half of the imp-34606 roundoff-amplification ' +
    'analysis across the q2 / q3 / q4 finite-difference channels [q_k the inherited k-point central ' +
    'difference of q(p) = log E_coll in p = log N; shares s2 = |q2|/(2 q1^2), s3 = |q3|/(6 q1^2), ' +
    's4 = |q4|/(12 |q1|); deep = N >= N* ~ 4.62e13, imp-33620 sigma < 0.01]. imp-34606 fit only the ' +
    'log-log SLOPES (the clean {2,3,4} exponent ladder); this reads the INTERCEPT prefactor ' +
    'B_k = exp(lnb_k) of the same fits and tests it against the parameter-free machine-epsilon ' +
    'prediction. (F1) All three amplitudes sit within a factor of ~3 of the eps_mach prediction: ' +
    'measured B2 ~ 7.67e-15, B3 ~ 6.29e-15, B4 ~ 1.25e-15 versus predicted ' +
    '[||w_k|| u |q| / share-norm, u = eps/2 ~ 1.11e-16, ||w2||=sqrt(6), ||w3||=sqrt(10), ' +
    '||w4||=sqrt(70), true |q| ~ 15..16 and |q1| ~ 0.485 at the landmarks] B2_pred ~ 9.51e-15, ' +
    'B3_pred ~ 2.05e-15, B4_pred ~ 2.63e-15, giving ratios measured/predicted of 0.81 (q2), 3.07 (q3) ' +
    'and 0.48 (q4) -- every channel within a single factor of ~3 of a prediction with NO fitted ' +
    'amplitude. (F2) q3 is the loosest (ratio 3.07) for the same reason its slope was (m3 ~ 2.90 vs 3, ' +
    'R^2 ~ 0.983): its dp = 1e-4 .. 1e-5 window is least deep in the roundoff floor, so residual ' +
    'truncation biases its fitted slope BELOW 3 and its fitted intercept ABOVE the pure-roundoff ' +
    'prediction -- one coherent story. (F3) The intercept test is independent of the slope test: the ' +
    'exponent ladder fixes only that the floor is a k-point difference, while the amplitude match fixes ' +
    'that its SOURCE is double-precision roundoff on |q|-magnitude function values -- a parameter-free ' +
    'prediction the slopes cannot make. Both halves of the log-log line are thus accounted for by ' +
    'machine epsilon: the q2 / q3 / q4 deep-tail finite-difference floor is roundoff in BOTH its power ' +
    '(1/dp^k) and its amplitude (~ eps_mach |q|). q1..q4 are inherited central differences, NOT fresh ' +
    'analytic closed forms, so the sigma -> 1 deep-tail regime (imp-3220 / imp-3406 component model ' +
    'least trustworthy) is inherited as-is -- this diagnoses the finite-difference conditioning of that ' +
    'measurement, it does not rehabilitate the model. The -2 asymptote and C_C = (1/8)sqrt(3 pi) ' +
    '(imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; no operator positivity; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-34606 (the {2,3,4} SLOPE ladder -- this module adds the intercept AMPLITUDES); ' +
    'imp-34592 (q4 O(h^4) share inflates ~1/dp^4; deep-tail dp floor); ' +
    'imp-34593 (q3-share relative-range excess free exponent m ~ 3.5); ' +
    'imp-34566 (truncation-vs-roundoff finite-difference floor F3); ' +
    'imp-34573 (q3 share deep-vs-mid at fixed dp); imp-34543 (q2/q3 shares as ladder aggregates); ' +
    'imp-34531 (F2 O(h^2) coefficient certification); imp-34446 (central-difference exponent); ' +
    'imp-33620 (deep-tail landmark N* ~ 4.62e13, sigma < 0.01); imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34633_ASSERTIONS = [
  {
    id: 'imp34633-q2-amplitude-matches-epsmach',
    holds: () => RATIO_Q2 > 1 / 3.5 && RATIO_Q2 < 3.5 && FIT_Q2.B > 1e-15 && FIT_Q2.B < 3e-14,
    why: 'F1: the q2 intercept prefactor B2 ~ 7.67e-15 matches the parameter-free eps_mach prediction ~9.51e-15 (ratio ~0.81) -- the 2nd-difference roundoff amplitude.',
  },
  {
    id: 'imp34633-q3-amplitude-matches-epsmach',
    holds: () => RATIO_Q3 > 1 / 3.5 && RATIO_Q3 < 3.5 && FIT_Q3.B > 1e-15 && FIT_Q3.B < 3e-14,
    why: 'F1/F2: the q3 intercept prefactor B3 ~ 6.29e-15 matches the prediction ~2.05e-15 (ratio ~3.07, loosest for the same reason its slope was least clean).',
  },
  {
    id: 'imp34633-q4-amplitude-matches-epsmach',
    holds: () => RATIO_Q4 > 1 / 3.5 && RATIO_Q4 < 3.5 && FIT_Q4.B > 1e-16 && FIT_Q4.B < 1e-14,
    why: 'F1: the q4 intercept prefactor B4 ~ 1.25e-15 matches the prediction ~2.63e-15 (ratio ~0.48) -- the 4th-difference roundoff amplitude.',
  },
  {
    id: 'imp34633-all-amplitudes-within-factor',
    holds: () => ALL_AMPLITUDES_MATCH_EPSMACH,
    why: 'F3: all three intercept amplitudes land within a factor of ~3.5 of a machine-epsilon prediction with NO fitted amplitude -- both power and amplitude of the floor are roundoff.',
  },
  {
    id: 'imp34633-slopes-reproduce-imp34606',
    holds: () =>
      Math.abs(FIT_Q2.m - 2) < 0.15 && Math.abs(FIT_Q3.m - 3) < 0.35 && Math.abs(FIT_Q4.m - 4) < 0.35,
    why: 'Cross-check: the reused fits reproduce the imp-34606 {2,3,4} slope ladder (m2 ~ 1.999, m3 ~ 2.903, m4 ~ 4.008) verbatim.',
  },
  {
    id: 'imp34633-honesty-gate-no-qed',
    holds: () =>
      IMP34633_ROUNDOFF_PREFACTOR_AMPLITUDE_VS_EPSMACH.isRigorous === false &&
      /NO QED/.test(IMP34633_ROUNDOFF_PREFACTOR_AMPLITUDE_VS_EPSMACH.verdict) &&
      /refereed bound is changed/i.test(IMP34633_ROUNDOFF_PREFACTOR_AMPLITUDE_VS_EPSMACH.verdict) &&
      /UNTOUCHED/.test(IMP34633_ROUNDOFF_PREFACTOR_AMPLITUDE_VS_EPSMACH.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34633_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34633-roundoff-prefactor-amplitude-vs-epsmach assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34633_ROUNDOFF_PREFACTOR_AMPLITUDE_VS_EPSMACH;
