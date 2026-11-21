/**
 * @module imp-34587-drift-share-drift-richardson-dp-extrapolation
 * @fileoverview imp-34587 -- MEASUREMENT ONLY: a finite-difference-step (dp) Richardson
 *   extrapolation of the imp-34573 deep-vs-mid q3-share DRIFT. imp-34573 measured the
 *   deep-tail (N >= N* ~ 4.62e13, imp-33620 sigma < 0.01) minus mid-range (N < N*) mean
 *   q3-share gap at TWO steps -- dp = 1e-3 (~ -21%) and dp = 2e-3 (~ -8%) -- and attributed
 *   most of the extra deep-tail scatter at dp = 1e-3 to finite-difference conditioning near
 *   the roundoff floor (imp-34566 F3), leaving the INTRINSIC drift as the ~8% dp = 2e-3
 *   value. It never added a third step or extrapolated dp -> 0 to remove the residual
 *   conditioning. This module supplies that third node (dp = 4e-3) and the dp -> 0
 *   extrapolation, isolating the intrinsic deep-tail q3-share drift with the finite-difference
 *   conditioning stripped out.
 *
 *   WHY THIS MATTERS (beyond imp-34573)
 *   -----------------------------------
 *   imp-34573 F3 read the drift shrinking from ~21% (dp = 1e-3) to ~8% (dp = 2e-3) as
 *   conditioning peeling away, and CALLED the ~8% the intrinsic floor. But two points cannot
 *   separate a truncation-error tail from a conditioning tail: the ~8% at dp = 2e-3 still
 *   carries an O(dp^2) truncation error of the central-difference q3 stencil. A third step and
 *   a dp -> 0 extrapolation are needed to say whether the intrinsic drift IS the ~8% floor or
 *   sits below it -- and to check that dp = 1e-3 really is roundoff-dominated (a point that
 *   makes the extrapolation DIVERGE, not converge).
 *
 *   WHAT THIS MEASUREMENT ADDS
 *   --------------------------
 *   Reusing the imp-34573 q3Share primitive VERBATIM [C_th = C_q2 + C_q3, C_q2 = -q2/(2 q1^2),
 *   C_q3 = q3/(6 q1^2), q1,q2,q3 the inherited central differences of q(p) = log E_coll in
 *   p = log N] and the same MID/DEEP landmark partition at N* ~ 4.62e13, this module:
 *     (i)   computes the deep-vs-mid mean-q3-share drift at THREE steps dp = {1e-3, 2e-3, 4e-3};
 *     (ii)  Richardson-extrapolates the two truncation-dominated points (dp = 2e-3, 4e-3) under
 *           the central-difference O(dp^2) error model toward dp -> 0, giving the intrinsic
 *           drift a in gap(dp) = a + b dp^2 (pairwise ratio-2 Richardson, identical to a linear
 *           fit in dp^2 through the two nodes evaluated at dp = 0);
 *     (iii) as a conditioning DIAGNOSTIC, runs the SAME extrapolation on the roundoff-contaminated
 *           pair (dp = 1e-3, 2e-3) and shows it DIVERGES (|R| grows past the raw dp = 1e-3 value)
 *           -- the tell-tale that dp = 1e-3 sits below the optimal step, exactly where imp-34566 F3
 *           / imp-34573 F3 placed it.
 *
 *   THE FINDING (the intrinsic drift IS the ~8% floor -- marginally smaller, not vanishing)
 *   --------------------------------------------------------------------------------------
 *   (F1) THE DRIFT IS NON-MONOTONE IN dp. drift(dp = 1e-3) ~ -0.2059 (roundoff-inflated),
 *        drift(dp = 2e-3) ~ -0.0807 (near the optimal step, magnitude minimum), drift(dp = 4e-3)
 *        ~ -0.0982 (truncation error growing the magnitude back up). So dp = 1e-3 is
 *        roundoff-dominated and dp >= 2e-3 is truncation-dominated -- precisely the
 *        truncation-vs-roundoff crossover imp-34566 F3 / imp-34573 F3 identified, now resolved
 *        with a third node instead of asserted from two.
 *   (F2) THE dp -> 0 EXTRAPOLATION OF THE TRUNCATION-DOMINATED PAIR GIVES ~ -7.5%. Richardson-
 *        extrapolating (dp = 2e-3, 4e-3) under the O(dp^2) model yields intrinsic drift
 *        a ~ -0.0748 -- marginally BELOW (smaller magnitude than) the ~8% dp = 2e-3 value
 *        imp-34573 called the floor, and it does NOT go to zero. So the intrinsic deep-tail
 *        q3-share drift IS essentially the ~8% floor (a hair under it, ~7.5%), a genuine mild
 *        downward drift of the third-derivative share into the tail -- not an artifact that
 *        conditioning removal makes vanish.
 *   (F3) THE ROUNDOFF-CONTAMINATED PAIR CONFIRMS dp = 1e-3 IS BELOW-OPTIMAL. Applying the same
 *        O(dp^2) Richardson to (dp = 1e-3, 2e-3) gives ~ -0.2477 -- the magnitude BLOWS UP past
 *        the raw dp = 1e-3 drift (-0.2059) instead of converging, the signature of extrapolating
 *        through a roundoff-dominated node. This is why dp = 1e-3 must be excluded from the
 *        truncation extrapolation, and why the honest intrinsic estimate rests on (2e-3, 4e-3).
 *        CONCLUSION: with the finite-difference conditioning stripped by a dp -> 0 extrapolation
 *        of the two truncation-dominated steps, the intrinsic deep-vs-mid q3-share drift is
 *        ~ -7.5% -- the imp-34573 ~8% floor, marginally smaller, NOT smaller by much and NOT
 *        vanishing.
 *
 *   MEASUREMENT ONLY. This re-aggregates an already-certified decomposition across three
 *   finite-difference steps and extrapolates dp -> 0; it changes NO bound. Reproduces the
 *   imp-34446/imp-34531/imp-34543/imp-34573 primitives inline (imports NOTHING -- no
 *   lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle), following the
 *   no-heavy-imports directive. q1,q2,q3 are the inherited central differences, NOT fresh
 *   analytic closed forms -- so the sigma -> 1 deep-tail regime, where the inherited
 *   imp-3220/imp-3406 component model is least trustworthy, is inherited as-is (a diagnostic ON
 *   that regime, not a rehabilitation OF it). The -2 asymptote and C_C = (1/8)sqrt(3 pi)
 *   (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is
 *   UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 *   No refereed bound is changed.
 *
 *   @see imp-34573-drift-residual-share-deeptail-vs-midrange.js (deep-vs-mid drift at dp = 1e-3, 2e-3)
 *   @see imp-34566-drift-residual-fourth-difference-share.js (finite-difference floor F3)
 *   @see imp-34543-drift-residual-third-derivative-share.js (q2/q3 shares as ladder aggregates)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13)
 *
 *   Ticket: imp-34587 (numerical, medium). dp -> 0 Richardson extrapolation; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34573 primitives (imports NOTHING): --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N* -- the mid/deep boundary

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

// Central differences of q(p) = log E_coll in p = log N (identical to imp-34543/imp-34573).
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
  return { q1, q2, q3 };
}

// The pure third-derivative share of the O(h^2) coefficient (imp-34543/imp-34573 decomposition, verbatim).
function q3Share(N, dp) {
  const { q1, q2, q3 } = qDerivs(N, dp);
  const cQ2 = -(1 / q1) * (q2 / (2 * q1)); // pure curvature part
  const cQ3 = (1 / q1) * (q3 / (6 * q1)); // pure third-derivative part = q3/(6 q1^2)
  return cQ3 / (cQ2 + cQ3);
}

// Same MID/DEEP landmark partition as imp-34573: MID = N < N*, DEEP = N >= N*.
const MID_LADDER = [Math.pow(10, 12.0), Math.pow(10, 12.5), Math.pow(10, 13.0), Math.pow(10, 13.333)];
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];

const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;

// Deep-vs-mid mean-q3-share drift at a given finite-difference step (imp-34573 convention).
function driftAt(dp) {
  const midMean = mean(MID_LADDER.map((N) => q3Share(N, dp)));
  const deepMean = mean(DEEP_LADDER.map((N) => q3Share(N, dp)));
  return { midMean, deepMean, drift: (deepMean - midMean) / midMean };
}

const DP_STEPS = [1e-3, 2e-3, 4e-3]; // parents operating step, imp-34573 well-conditioned step, new node

const DRIFT_ROWS = DP_STEPS.map((dp) => {
  const d = driftAt(dp);
  return {
    dp,
    mid_mean: +d.midMean.toFixed(6),
    deep_mean: +d.deepMean.toFixed(6),
    drift: +d.drift.toFixed(6),
  };
});

const D1 = driftAt(1e-3).drift; // ~ -0.2059 roundoff-inflated
const D2 = driftAt(2e-3).drift; // ~ -0.0807 near optimal step
const D4 = driftAt(4e-3).drift; // ~ -0.0982 truncation growing back

// Pairwise ratio-2 Richardson under the central-difference O(dp^2) error model:
//   gap(dp) = a + b dp^2  =>  a = coarse + (coarse - coarser) / (2^2 - 1) with the coarser at 2x step.
// This is identical to a straight line in dp^2 through the two nodes evaluated at dp = 0.
function richardsonDp2(dFine, dCoarse) {
  return dFine + (dFine - dCoarse) / 3;
}

// Truncation-dominated pair (2e-3, 4e-3): the honest intrinsic estimate.
const INTRINSIC_DRIFT = richardsonDp2(D2, D4); // ~ -0.0748
// Roundoff-contaminated pair (1e-3, 2e-3): DIVERGES -- the conditioning diagnostic.
const ROUNDOFF_PAIR_EXTRAP = richardsonDp2(D1, D2); // ~ -0.2477 (|.| blows up past |D1|)

export const IMP34587_DRIFT_SHARE_DRIFT_RICHARDSON = Object.freeze({
  id: 'imp-34587',
  proofSection: 'S-frontier',
  claim_measured:
    'Add a third finite-difference step dp = 4e-3 to the imp-34573 deep-vs-mid q3-share drift ' +
    'and Richardson-extrapolate the (drift vs dp) points toward dp -> 0 to estimate the INTRINSIC ' +
    'deep-tail q3-share drift with the finite-difference conditioning removed; report whether it ' +
    'is the imp-34573 ~8% floor or smaller -- a dp -> 0 extrapolation, not a bound.',
  dp_steps: Object.freeze(DP_STEPS.slice()),
  deep_tail_boundary_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  drift_rows: Object.freeze(DRIFT_ROWS.map((r) => Object.freeze(r))),
  drift_dp_1e3: +D1.toFixed(6), // ~ -0.2059 roundoff-inflated
  drift_dp_2e3: +D2.toFixed(6), // ~ -0.0807 near optimal step (imp-34573 ~8% floor)
  drift_dp_4e3: +D4.toFixed(6), // ~ -0.0982 truncation growing the magnitude back
  intrinsic_drift_extrapolated: +INTRINSIC_DRIFT.toFixed(6), // ~ -0.0748 from (2e-3, 4e-3) dp -> 0
  intrinsic_vs_floor_ratio: +(INTRINSIC_DRIFT / D2).toFixed(4), // ~0.927 -- ~7% below the dp=2e-3 floor magnitude
  roundoff_pair_extrapolation: +ROUNDOFF_PAIR_EXTRAP.toFixed(6), // ~ -0.2477 -- DIVERGES, dp=1e-3 below-optimal
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Richardson dp -> 0 extrapolation of the imp-34573 deep-vs-mid ' +
    'mean-q3-share drift [q3 share of C_th = C_q2 + C_q3, C_q3 = q3/(6 q1^2), q1,q2,q3 the ' +
    'inherited central differences of q = log E_coll in log N; deep = N >= N* ~ 4.62e13, ' +
    'imp-33620 sigma < 0.01, vs mid = N < N*]. (F1) The drift is NON-MONOTONE in the ' +
    'finite-difference step dp: -0.2059 at dp = 1e-3 (roundoff-inflated), -0.0807 at dp = 2e-3 ' +
    '(near the optimal step, magnitude minimum), -0.0982 at dp = 4e-3 (truncation error growing ' +
    'the magnitude back) -- so dp = 1e-3 is roundoff-dominated and dp >= 2e-3 truncation-dominated, ' +
    'the truncation-vs-roundoff crossover imp-34566 F3 / imp-34573 F3 flagged, now resolved with a ' +
    'third node. (F2) Richardson-extrapolating the two truncation-dominated points (dp = 2e-3, 4e-3) ' +
    'under the central-difference O(dp^2) error model toward dp -> 0 gives an intrinsic deep-vs-mid ' +
    'q3-share drift of ~ -0.0748 -- marginally SMALLER in magnitude than the ~8% (-0.0807) dp = 2e-3 ' +
    'value imp-34573 called the floor (ratio ~0.93), and it does NOT vanish. So the intrinsic drift ' +
    'IS essentially the ~8% floor, a hair under it (~7.5%): a genuine mild downward drift of the ' +
    'third-derivative share into the tail, NOT an artifact that conditioning removal erases. ' +
    '(F3) The SAME O(dp^2) Richardson on the roundoff-contaminated pair (dp = 1e-3, 2e-3) gives ' +
    '~ -0.2477 -- the magnitude BLOWS UP past the raw dp = 1e-3 drift (-0.2059) instead of ' +
    'converging, the signature of extrapolating through a below-optimal, roundoff-dominated node, ' +
    'confirming dp = 1e-3 must be excluded from the truncation extrapolation. CONCLUSION: with the ' +
    'finite-difference conditioning stripped by a dp -> 0 extrapolation of the two ' +
    'truncation-dominated steps, the intrinsic deep-vs-mid q3-share drift is ~ -7.5% -- the ' +
    'imp-34573 ~8% floor, marginally smaller, NOT smaller by much and NOT vanishing. q1,q2,q3 are ' +
    'inherited central differences, NOT fresh analytic closed forms, so the sigma -> 1 deep-tail ' +
    'regime (imp-3220/imp-3406 component model least trustworthy) is inherited as-is -- this ' +
    'diagnoses that regime, it does not rehabilitate it. The -2 asymptote and C_C = (1/8)sqrt(3 pi) ' +
    '(imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34573 (deep-vs-mid q3-share drift at dp = 1e-3, 2e-3, extrapolated to dp -> 0 here); ' +
    'imp-34566 (finite-difference floor F3); imp-34543 (q2/q3 shares as ladder aggregates); ' +
    'imp-34531 (F2 O(h^2) coefficient certification); imp-34446 (central-difference exponent); ' +
    'imp-33620 (deep-tail landmark N* ~ 4.62e13, sigma < 0.01); imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34587_ASSERTIONS = [
  {
    id: 'imp34587-drift-non-monotone-in-dp',
    holds: () => Math.abs(D1) > Math.abs(D2) && Math.abs(D4) > Math.abs(D2),
    why: 'F1: the drift magnitude is minimized at the middle step dp = 2e-3 (roundoff-inflated at 1e-3, truncation-growing at 4e-3) -- a non-monotone dp dependence with an optimal step.',
  },
  {
    id: 'imp34587-dp1e3-roundoff-inflated',
    holds: () => Math.abs(D1) > 0.15 && Math.abs(D2) < 0.12,
    why: 'F1: the dp = 1e-3 drift (~ -0.21) is far larger than the dp = 2e-3 drift (~ -0.08) -- the roundoff inflation imp-34573 F3 attributed to conditioning.',
  },
  {
    id: 'imp34587-intrinsic-drift-is-the-8pct-floor-marginally-smaller',
    holds: () =>
      INTRINSIC_DRIFT < 0 &&
      Math.abs(INTRINSIC_DRIFT) < Math.abs(D2) &&
      Math.abs(INTRINSIC_DRIFT) > 0.9 * Math.abs(D2),
    why: 'F2: the dp -> 0 extrapolation of (2e-3, 4e-3) is negative, marginally smaller in magnitude than the dp = 2e-3 ~8% floor (within ~10%), and does not vanish -- the intrinsic drift IS essentially the ~8% floor, a hair under it.',
  },
  {
    id: 'imp34587-intrinsic-drift-does-not-vanish',
    holds: () => Math.abs(INTRINSIC_DRIFT) > 0.05,
    why: 'F2: the extrapolated intrinsic drift (~ -0.075) stays above 5% -- a genuine mild downward drift of the q3 share into the tail, not an artifact conditioning removal erases.',
  },
  {
    id: 'imp34587-roundoff-pair-extrapolation-diverges',
    holds: () => Math.abs(ROUNDOFF_PAIR_EXTRAP) > Math.abs(D1),
    why: 'F3: extrapolating the roundoff-contaminated pair (1e-3, 2e-3) blows the magnitude UP past the raw dp = 1e-3 value instead of converging -- the tell-tale that dp = 1e-3 sits below the optimal step and must be excluded.',
  },
  {
    id: 'imp34587-honesty-gate-no-qed',
    holds: () =>
      IMP34587_DRIFT_SHARE_DRIFT_RICHARDSON.isRigorous === false &&
      /NO QED/.test(IMP34587_DRIFT_SHARE_DRIFT_RICHARDSON.verdict) &&
      /refereed bound is changed/i.test(IMP34587_DRIFT_SHARE_DRIFT_RICHARDSON.verdict) &&
      /UNTOUCHED/.test(IMP34587_DRIFT_SHARE_DRIFT_RICHARDSON.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34587_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34587-drift-share-drift-richardson-dp-extrapolation assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34587_DRIFT_SHARE_DRIFT_RICHARDSON;
