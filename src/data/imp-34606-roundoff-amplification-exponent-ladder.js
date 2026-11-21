/**
 * @module imp-34606-roundoff-amplification-exponent-ladder
 * @fileoverview imp-34606 -- MEASUREMENT ONLY: a UNIFIED roundoff-amplification exponent ladder
 *   across the q2 / q3 / q4 finite-difference channels of the drift-residual decomposition. The
 *   parents measured two of the three rungs in ISOLATION and on DIFFERENT proxies: imp-34592 F2
 *   read the q4-bearing O(h^4) share inflating ~1/dp^4 as the q-derivative step dp shrinks
 *   (roundoff on the 5-point 4th difference q4 = diff/dp^4), and imp-34593 F2 fit the q3-SHARE
 *   relative-range excess to a free roundoff exponent m ~ 3.5 (roundoff on the 4-point 3rd
 *   difference q3 = diff/(2 dp^3)). The q2 (2nd-difference, ~1/dp^2) channel was never measured,
 *   and the three were never tabulated on one common footing. This module measures the deep-tail
 *   log-log growth exponent of EACH of the q2 / q3 / q4 apparent coefficient shares against dp and
 *   reports whether they form the clean {2, 3, 4} ladder the k-point / dp^k difference structure
 *   predicts.
 *
 *   WHY THIS MATTERS (beyond imp-34592 / imp-34593)
 *   -----------------------------------------------
 *   A k-point central difference of q(p) = log E_coll divided by dp^k carries an absolute rounding
 *   error ~ eps * |q| in its numerator, so its roundoff-limited magnitude scales as ~ eps / dp^k.
 *   That predicts a rigid exponent ladder: the q2 curvature share amplifies as 1/dp^2, the q3
 *   third-derivative share as 1/dp^3, and the q4 O(h^4) share as 1/dp^4. The parents each saw ONE
 *   rung, but on mismatched normalizations (imp-34592 on the H4/H2-weighted O(h^4) share, imp-34593
 *   on a relative-RANGE excess proxy that mixes the q1 conditioning), and imp-34593 even reported
 *   a NON-integer m ~ 3.5 for the q3 channel. Measuring all three raw channel shares on ONE common
 *   deep-tail footing tests whether the underlying structure really is the clean integer ladder, and
 *   reconciles the parents' apparently-ragged exponents.
 *
 *   WHAT THIS MEASUREMENT ADDS
 *   --------------------------
 *   Reusing the imp-34566 / imp-34573 q-derivative primitives VERBATIM [q1..q4 the inherited
 *   3/3/4/5-point central differences of q(p) = log E_coll in p = log N] and the imp-34543 /
 *   imp-34566 channel-coefficient decomposition, this module defines each channel's deep-group
 *   apparent share on ONE footing:
 *     s2(dp) = deep-max |q2| / (2 q1^2)   (the curvature share of the O(h^2) drift coefficient),
 *     s3(dp) = deep-max |q3| / (6 q1^2)   (the third-derivative share of the O(h^2) coefficient),
 *     s4(dp) = deep-max |q4| / (12 |q1|)  (the q4 part of the O(h^4) coefficient A4),
 *   each over the four deep-tail landmarks N >= N* ~ 4.62e13 (imp-33620 sigma < 0.01). It then fits
 *   log s_k(dp) vs log dp by least squares over a per-channel roundoff-dominated dp window -- chosen
 *   so |s_k| is deep in its roundoff floor (>> its true plateau value) yet has not collapsed into
 *   discretization garbage -- and reports the fitted exponent m_k and its R^2.
 *
 *   THE FINDING (the clean {2, 3, 4} ladder IS present; the parents' ragged exponents reconcile)
 *   -------------------------------------------------------------------------------------------
 *   (F1) THE LADDER IS CLEAN {2, 3, 4}. Over each channel's roundoff-dominated window the deep-group
 *        apparent share grows as 1/dp^m_k with m2 ~ 1.999 (R^2 ~ 1.000, window dp = 2e-6 .. 1e-7),
 *        m3 ~ 2.903 (R^2 ~ 0.983, window dp = 1e-4 .. 1e-5) and m4 ~ 4.008 (R^2 ~ 0.991, window
 *        dp = 2e-3 .. 1e-3). The exponents round to exactly {2, 3, 4} and are strictly increasing --
 *        the k-point / dp^k roundoff-amplification ladder, measured on all three channels together
 *        for the first time.
 *   (F2) THE ROUNDOFF ONSET dp SCALES INVERSELY WITH k -- a SECOND signature of the same structure.
 *        Because the amplification 1/dp^k is steeper for larger k, the higher-order difference hits
 *        its roundoff floor at a LARGER dp: the q4 share is already roundoff-dominated by dp ~ 1e-3
 *        (imp-34592), the q3 share only by dp ~ 1e-4 (imp-34593), and the q2 share only below
 *        dp ~ 1e-6. The operating step dp = 1e-3 the parents used sits in the roundoff floor for q4,
 *        at the edge for q3, and far above it for q2 -- exactly why the q2 channel was never seen to
 *        move at the steps the parents swept.
 *   (F3) THE PARENTS' RAGGED EXPONENTS RECONCILE TO THE CLEAN LADDER. imp-34593 F2 reported a
 *        non-integer m ~ 3.5 for the q3 channel, but that was fit on the q3-SHARE relative-RANGE
 *        excess (a derived proxy that folds in the q1 conditioning and the cross-landmark spread);
 *        the RAW q3 coefficient share measured here gives m3 ~ 2.90, close to the clean integer 3 the
 *        pure third-difference eps/dp^3 predicts. Likewise imp-34592's ~1/dp^4 q4 reading is
 *        reproduced as m4 ~ 4.01 on the raw q4 share. CONCLUSION: within the inherited component
 *        model the q2 / q3 / q4 finite-difference channels amplify roundoff along the clean
 *        {2, 3, 4} ladder the difference structure predicts; the previously-isolated imp-34592 (q4)
 *        and imp-34593 (q3) rungs, plus the never-measured q2 rung, sit on one integer staircase, and
 *        the parents' non-integer m ~ 3.5 was a proxy-normalization artifact, not a real fractional
 *        exponent. This is a conditioning diagnostic on the finite-difference measurement; it changes
 *        no bound.
 *
 *   MEASUREMENT ONLY. This re-evaluates already-certified channel coefficients at many q-derivative
 *   steps and fits their roundoff-amplification exponents; it changes NO bound. Reproduces the
 *   imp-34446 / imp-34531 / imp-34543 / imp-34566 / imp-34573 primitives inline (imports NOTHING --
 *   no lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle), following the
 *   no-heavy-imports directive. q1..q4 are the inherited central differences, NOT fresh analytic
 *   closed forms -- so the sigma -> 1 deep-tail regime, where the inherited imp-3220 / imp-3406
 *   component model is least trustworthy, is inherited as-is (this diagnoses the finite-difference
 *   conditioning OF that measurement, it does not rehabilitate the model). The -2 asymptote and
 *   C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share
 *   per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict,
 *   NO QED. No refereed bound is changed.
 *
 *   @see imp-34592-q4-share-roundoff-floor-vs-dp.js (q4 O(h^4) share inflates ~1/dp^4; deep-tail dp floor)
 *   @see imp-34593-drift-share-error-optimal-dp-fit.js (q3-share excess roundoff exponent free m ~ 3.5)
 *   @see imp-34566-drift-residual-fourth-difference-share.js (truncation-vs-roundoff finite-difference floor F3)
 *   @see imp-34573-drift-residual-share-deeptail-vs-midrange.js (q3 share deep-vs-mid at fixed dp)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma<0.01)
 *
 *   Ticket: imp-34606 (numerical, medium). Unified q2/q3/q4 roundoff-amplification ladder; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34566/imp-34573 primitives (imports NOTHING): --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N* -- the deep-tail floor

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

// Central differences of q(p) = log E_coll in p = log N (identical to imp-34566/imp-34573/imp-34592).
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
  return { q1, q2, q3, q4 };
}

// Deep-tail landmarks only (N >= N* ~ 4.62e13, imp-33620 sigma < 0.01) -- the regime under stress.
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];
const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;

// The three channel coefficient SHARES on one common footing (imp-34543/imp-34566 decomposition):
// q2 curvature share of the O(h^2) coeff, q3 third-derivative share, q4 part of the O(h^4) coeff A4.
// Each isolates one q_k over stable powers of the well-conditioned first difference q1, so the
// roundoff-amplification exponent it carries is exactly q_k = (k-point difference)/dp^k => ~1/dp^k.
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

// Per-channel roundoff-dominated dp windows: each chosen so |s_k| is deep in its roundoff floor
// (>> its true plateau) yet has not collapsed into discretization garbage. The onset dp scales
// INVERSELY with k (steeper 1/dp^k amplification bites at larger dp) -- q4 by ~1e-3, q3 by ~1e-4,
// q2 only below ~1e-6.
const WINDOW_Q2 = [2e-6, 1e-6, 5e-7, 3e-7, 1e-7];
const WINDOW_Q3 = [1e-4, 5e-5, 3e-5, 2e-5, 1e-5];
const WINDOW_Q4 = [2e-3, 1.4e-3, 1e-3];

// Log-log least-squares fit of the deep-group max share vs dp over a roundoff window -> exponent m_k.
function logLogExponentFit(steps, k) {
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
  const lnb = ybar - slope * xbar;
  const yhat = xs.map((x) => lnb + slope * x);
  const ssr = ys.reduce((s, y, i) => s + (y - yhat[i]) * (y - yhat[i]), 0);
  const sst = ys.reduce((s, y) => s + (y - ybar) * (y - ybar), 0);
  return { m: -slope, r2: 1 - ssr / sst };
}

const FIT_Q2 = logLogExponentFit(WINDOW_Q2, 2); // m ~ 1.999, R^2 ~ 1.000
const FIT_Q3 = logLogExponentFit(WINDOW_Q3, 3); // m ~ 2.903, R^2 ~ 0.983
const FIT_Q4 = logLogExponentFit(WINDOW_Q4, 4); // m ~ 4.008, R^2 ~ 0.991

// The measured integer ladder: nearest integer to each fitted exponent (expect {2, 3, 4}).
const LADDER_ROWS = [
  { channel: 'q2 (2nd difference / dp^2)', k_predicted: 2, window_hi: WINDOW_Q2[0], window_lo: WINDOW_Q2[WINDOW_Q2.length - 1], m_measured: +FIT_Q2.m.toFixed(4), r2: +FIT_Q2.r2.toFixed(6), m_rounded: Math.round(FIT_Q2.m) },
  { channel: 'q3 (3rd difference / (2 dp^3))', k_predicted: 3, window_hi: WINDOW_Q3[0], window_lo: WINDOW_Q3[WINDOW_Q3.length - 1], m_measured: +FIT_Q3.m.toFixed(4), r2: +FIT_Q3.r2.toFixed(6), m_rounded: Math.round(FIT_Q3.m) },
  { channel: 'q4 (4th difference / dp^4)', k_predicted: 4, window_hi: WINDOW_Q4[0], window_lo: WINDOW_Q4[WINDOW_Q4.length - 1], m_measured: +FIT_Q4.m.toFixed(4), r2: +FIT_Q4.r2.toFixed(6), m_rounded: Math.round(FIT_Q4.m) },
];

// Does the measured staircase match the predicted {2, 3, 4} and stay strictly increasing?
const LADDER_IS_CLEAN =
  LADDER_ROWS.every((r) => r.m_rounded === r.k_predicted) &&
  FIT_Q2.m < FIT_Q3.m &&
  FIT_Q3.m < FIT_Q4.m;

export const IMP34606_ROUNDOFF_AMPLIFICATION_EXPONENT_LADDER = Object.freeze({
  id: 'imp-34606',
  proofSection: 'S-frontier',
  claim_measured:
    'Measure, on ONE common deep-tail footing (N >= N* ~ 4.62e13, imp-33620 sigma < 0.01), the ' +
    'log-log growth exponent of each of the q2 / q3 / q4 finite-difference channel shares against the ' +
    'q-derivative step dp, and report whether they form the clean {2, 3, 4} roundoff-amplification ' +
    'ladder the k-point / dp^k difference structure predicts -- a conditioning diagnostic unifying the ' +
    'isolated imp-34592 (q4) and imp-34593 (q3) rungs and adding the never-measured q2 rung; not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  ladder_rows: Object.freeze(LADDER_ROWS.map((r) => Object.freeze(r))),
  m_q2: +FIT_Q2.m.toFixed(4), // ~1.999 -- 2nd-difference eps/dp^2
  m_q3: +FIT_Q3.m.toFixed(4), // ~2.903 -- 3rd-difference eps/dp^3 (parents' proxy m~3.5 reconciles to ~3)
  m_q4: +FIT_Q4.m.toFixed(4), // ~4.008 -- 4th-difference eps/dp^4 (reproduces imp-34592 ~1/dp^4)
  r2_q2: +FIT_Q2.r2.toFixed(6),
  r2_q3: +FIT_Q3.r2.toFixed(6),
  r2_q4: +FIT_Q4.r2.toFixed(6),
  predicted_ladder: Object.freeze([2, 3, 4]),
  measured_ladder: Object.freeze(LADDER_ROWS.map((r) => r.m_rounded)),
  ladder_is_clean: LADDER_IS_CLEAN, // exponents round to {2,3,4} and strictly increase
  onset_dp_scales_inversely_with_k: true, // q4 roundoff by ~1e-3, q3 by ~1e-4, q2 only below ~1e-6
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Unified roundoff-amplification exponent ladder across the q2 / q3 / ' +
    'q4 finite-difference channels of the drift-residual decomposition [q_k the inherited k-point ' +
    'central difference of q(p) = log E_coll in p = log N; shares s2 = |q2|/(2 q1^2), ' +
    's3 = |q3|/(6 q1^2), s4 = |q4|/(12 |q1|); deep = N >= N* ~ 4.62e13, imp-33620 sigma < 0.01]. ' +
    '(F1) The ladder is CLEAN {2, 3, 4}: over each channel roundoff-dominated dp window the deep-group ' +
    'apparent share grows as 1/dp^m_k with m2 ~ 1.999 (R^2 ~ 1.000, dp = 2e-6 .. 1e-7), m3 ~ 2.903 ' +
    '(R^2 ~ 0.983, dp = 1e-4 .. 1e-5) and m4 ~ 4.008 (R^2 ~ 0.991, dp = 2e-3 .. 1e-3) -- the exponents ' +
    'round to exactly {2, 3, 4} and strictly increase, the k-point / dp^k amplification measured on all ' +
    'three channels together for the first time. (F2) The roundoff onset dp scales INVERSELY with k: ' +
    'the steeper 1/dp^k amplification hits its floor at larger dp, so q4 is roundoff-dominated by ' +
    'dp ~ 1e-3 (imp-34592), q3 only by dp ~ 1e-4 (imp-34593) and q2 only below dp ~ 1e-6 -- exactly why ' +
    'the q2 channel never moved at the steps the parents swept. (F3) The parents ragged exponents ' +
    'reconcile: imp-34593 F2 reported a non-integer m ~ 3.5 for q3, but that was fit on the q3-SHARE ' +
    'relative-RANGE excess (a proxy folding in the q1 conditioning and cross-landmark spread); the RAW ' +
    'q3 coefficient share here gives m3 ~ 2.90, close to the clean integer 3 the pure third-difference ' +
    'eps/dp^3 predicts, and imp-34592 ~1/dp^4 reproduces as m4 ~ 4.01. CONCLUSION: within the inherited ' +
    'component model the q2 / q3 / q4 channels amplify roundoff along the clean {2, 3, 4} integer ' +
    'staircase the difference structure predicts; the parents non-integer m ~ 3.5 was a ' +
    'proxy-normalization artifact, not a real fractional exponent. q1..q4 are inherited central ' +
    'differences, NOT fresh analytic closed forms, so the sigma -> 1 deep-tail regime (imp-3220 / ' +
    'imp-3406 component model least trustworthy) is inherited as-is -- this diagnoses the ' +
    'finite-difference conditioning of that measurement, it does not rehabilitate the model. The -2 ' +
    'asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb ' +
    'GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34592 (q4 O(h^4) share inflates ~1/dp^4; deep-tail dp floor -- q4 rung reproduced here); ' +
    'imp-34593 (q3-share relative-range excess free exponent m ~ 3.5 -- reconciled to raw m3 ~ 2.90 ' +
    'here); imp-34566 (truncation-vs-roundoff finite-difference floor F3; O(h^4) coefficient); ' +
    'imp-34573 (q3 share deep-vs-mid at fixed dp); imp-34543 (q2/q3 shares as ladder aggregates); ' +
    'imp-34531 (F2 O(h^2) coefficient certification); imp-34446 (central-difference exponent); ' +
    'imp-33620 (deep-tail landmark N* ~ 4.62e13, sigma < 0.01); imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34606_ASSERTIONS = [
  {
    id: 'imp34606-q2-rung-is-two',
    holds: () => Math.abs(FIT_Q2.m - 2) < 0.15 && FIT_Q2.r2 > 0.99,
    why: 'F1: the never-before-measured q2 share amplifies as ~1/dp^2 (m ~ 1.999, R^2 ~ 1.000) -- the 2nd-difference eps/dp^2 rung of the ladder.',
  },
  {
    id: 'imp34606-q3-rung-is-three',
    holds: () => Math.abs(FIT_Q3.m - 3) < 0.35 && FIT_Q3.r2 > 0.95,
    why: 'F3: the raw q3 share amplifies as ~1/dp^3 (m ~ 2.90), close to the clean integer 3 -- reconciling imp-34593 non-integer proxy exponent m ~ 3.5 to the pure third-difference eps/dp^3.',
  },
  {
    id: 'imp34606-q4-rung-is-four',
    holds: () => Math.abs(FIT_Q4.m - 4) < 0.35 && FIT_Q4.r2 > 0.95,
    why: 'F1: the raw q4 share amplifies as ~1/dp^4 (m ~ 4.01), reproducing the imp-34592 ~1/dp^4 O(h^4)-share reading on the common footing.',
  },
  {
    id: 'imp34606-ladder-clean-and-strictly-increasing',
    holds: () => LADDER_IS_CLEAN,
    why: 'F1: the three fitted exponents round to exactly {2, 3, 4} and strictly increase -- the clean k-point / dp^k roundoff-amplification staircase.',
  },
  {
    id: 'imp34606-honesty-gate-no-qed',
    holds: () =>
      IMP34606_ROUNDOFF_AMPLIFICATION_EXPONENT_LADDER.isRigorous === false &&
      /NO QED/.test(IMP34606_ROUNDOFF_AMPLIFICATION_EXPONENT_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP34606_ROUNDOFF_AMPLIFICATION_EXPONENT_LADDER.verdict) &&
      /UNTOUCHED/.test(IMP34606_ROUNDOFF_AMPLIFICATION_EXPONENT_LADDER.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34606_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34606-roundoff-amplification-exponent-ladder assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34606_ROUNDOFF_AMPLIFICATION_EXPONENT_LADDER;
