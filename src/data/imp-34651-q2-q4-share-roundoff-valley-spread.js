/**
 * @module imp-34651-q2-q4-share-roundoff-valley-spread
 * @fileoverview imp-34651 -- MEASUREMENT ONLY: does the imp-34630 F3 diagnosis -- that the imp-34611
 *   F2 ~2.2e-5 4th-order q3-share large-dp "spread" is a small-dp roundoff-valley artifact (both
 *   extremes at the two smallest steps dp in {1.5e-2, 2e-2}, collapsing under dp >= 3e-2) -- also
 *   hold for the q2-share and q4-share? imp-34630 established the roundoff-valley reading ONLY for the
 *   q3 share. This module measures the analogous deep-vs-mid drift SPREAD of the q2-share and q4-share
 *   across the SAME imp-34611 dp tail (dp = 1.5e-2 .. 3e-1) and asks, for each, whether its reported
 *   spread is likewise dominated by the small-dp roundoff valley (largest excursion at the smallest
 *   steps, collapsing once dp >= 3e-2) or whether some share carries a genuine resolvable large-dp
 *   truncation drift.
 *
 *   METHOD (the imp-34611/imp-34630 share family, extended to a 3-term partition)
 *   ----------------------------------------------------------------------------
 *   The drift-residual leading coefficient is C_th = C_q2 + C_q3 + C_q4 with the pure Taylor terms
 *     C_q2 = -q2/(2 q1^2),  C_q3 = q3/(6 q1^2),  C_q4 = -q4/(24 q1^2)
 *   (the q1^2 cancels in every share ratio). imp-34611/imp-34630 studied the q3 share of the 2-term
 *   partition C_q3/(C_q2 + C_q3). To give the q4 term a share at all, this module uses the natural
 *   3-term partition and reports, for each k in {q2, q3, q4},
 *     share_qk(N, dp) = C_qk / (C_q2 + C_q3 + C_q4).
 *   q2, q3 are taken from the imp-34611 4th-order-accurate 7-point central-difference stencil VERBATIM;
 *   q4 is the imp-34592 5-point central 4th difference q4 = (fpp - 4 fp + 6 f0 - 4 fm + fmm)/dp^4
 *   VERBATIM (imports NOTHING). The deep-vs-mid drift and the MID/DEEP landmark partition at
 *   N* ~ 4.62e13 (imp-33620 sigma < 0.01) are the imp-34611/imp-34630 ones verbatim:
 *     drift(share, dp) = (deepMean - midMean) / midMean.
 *   For each share we take the full imp-34611 tail grid dp = {1.5e-2 .. 3e-1}, the full-tail spread
 *   (max - min), the dp at which the extremes sit, and the FLAT-tail spread over dp >= 3e-2 (past the
 *   small-dp roundoff valley), then compare -- exactly the imp-34630 F3 test, now on q2 and q4.
 *
 *   THE FINDING (both q2 and q4 shares are ALSO small-dp roundoff-valley dominated; q4 the worst)
 *   ------------------------------------------------------------------------------------------------
 *   (F1) THE q2-SHARE SPREAD IS SMALL-dp ROUNDOFF-VALLEY DOMINATED, LIKE q3. Its full-tail spread is
 *        ~1.29e-6 with its single largest excursion at the smallest step dp = 1.5e-2; restricting to
 *        dp >= 3e-2 collapses the spread ~8.4x to ~1.5e-7. There is no resolvable large-dp truncation
 *        drift -- the flat tail is structureless ~1e-7 noise. (The q2-share is the LEAST sensitive of
 *        the three: q2 = (well-conditioned) 2nd central difference / dp^2 sits furthest from its
 *        roundoff floor, so its valley excursion is the smallest in absolute terms.)
 *   (F2) THE q4-SHARE SPREAD IS THE MOST STRONGLY ROUNDOFF-VALLEY DOMINATED. Its full-tail spread is
 *        ~4.17e-3 -- two orders LARGER than the q3 ~2.2e-5 -- with its largest excursion again at the
 *        smallest step dp = 1.5e-2; restricting to dp >= 3e-2 collapses it ~27.7x to ~1.5e-4. This is
 *        exactly the imp-34592 result that q4 = (5-point 4th difference)/dp^4 is the least
 *        well-conditioned channel (roundoff inflates it ~1/dp^4 as dp shrinks): the q4 share carries
 *        the LARGEST small-dp valley of the three and still NO resolvable large-dp truncation drift.
 *   (F3) NO SHARE CARRIES A GENUINE RESOLVABLE LARGE-dp TRUNCATION DRIFT. For all three shares the
 *        full-tail spread collapses by >= 5x (q2 ~8.4x, q3 ~10.8x, q4 ~27.7x) once the two smallest
 *        steps are dropped, and the largest excursion always sits at dp = 1.5e-2 -- the roundoff
 *        valley, not large dp. The collapse factor ORDERS the shares by finite-difference
 *        conditioning: q2 (2nd difference) < q3 (3rd) < q4 (4th), the same 1/dp^k ladder imp-34633/
 *        imp-34646 measured. CONCLUSION: the imp-34630 F3 diagnosis GENERALISES -- every share's
 *        reported large-dp spread is dominated by the small-dp roundoff valley rather than genuine
 *        truncation, and the effect grows monotonically with the difference order of the share.
 *
 *   MEASUREMENT ONLY. This re-aggregates the already-certified imp-34611/imp-34592 share stencils
 *   through the imp-34630 F3 spread/collapse test on two additional shares; it changes NO bound.
 *   Reproduces the imp-34446/imp-34531/imp-34543/imp-34592/imp-34611 primitives inline (imports
 *   NOTHING -- no lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle), following
 *   the no-heavy-imports directive. q1..q4 are inherited central differences, NOT fresh analytic
 *   closed forms, so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model least
 *   trustworthy) is inherited as-is -- this cross-checks that regime, it does not rehabilitate it. The
 *   -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb
 *   GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; the inherited
 *   surrogate is NOT rigorous; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34630-plateau-drift-large-dp-scaling-order.js (F3 q3-share small-dp roundoff artifact, generalised here)
 *   @see imp-34611-plateau-drift-independent-stencil-crosscheck.js (F2 ~2.2e-5 q3-share large-dp spread)
 *   @see imp-34592-q4-share-roundoff-floor-vs-dp.js (q4 = 5-point 4th difference /dp^4 roundoff inflation ~1/dp^4)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma<0.01)
 *
 *   Ticket: imp-34651 (numerical, medium). imp-34630 F3 spread/collapse test on q2 and q4; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34592/imp-34611 primitives
//    (imports NOTHING), reproduced VERBATIM so the stencils and shares are identical: --
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

const qOfP = (pp) => Math.log(eColl(Math.exp(pp))); // q(p) = log E_coll in p = log N

// The three Taylor-coefficient shares of C_th = C_q2 + C_q3 + C_q4 (q1^2 cancels). q2,q3 from the
// imp-34611 4th-order 7-point stencil VERBATIM; q4 from the imp-34592 5-point central 4th difference.
function sharesAt(N, dp) {
  const p = Math.log(N);
  const f0 = qOfP(p);
  const fp = qOfP(p + dp);
  const fm = qOfP(p - dp);
  const fpp = qOfP(p + 2 * dp);
  const fmm = qOfP(p - 2 * dp);
  const fppp = qOfP(p + 3 * dp);
  const fmmm = qOfP(p - 3 * dp);
  const q2 = (-fpp + 16 * fp - 30 * f0 + 16 * fm - fmm) / (12 * dp * dp); // imp-34611 4th-order q2
  const q3 = (-fppp + 8 * fpp - 13 * fp + 13 * fm - 8 * fmm + fmmm) / (8 * dp * dp * dp); // imp-34611 q3
  const q4 = (fpp - 4 * fp + 6 * f0 - 4 * fm + fmm) / (dp * dp * dp * dp); // imp-34592 5-point q4
  const cQ2 = -q2 / 2;
  const cQ3 = q3 / 6;
  const cQ4 = -q4 / 24;
  const tot = cQ2 + cQ3 + cQ4;
  return { q2: cQ2 / tot, q3: cQ3 / tot, q4: cQ4 / tot };
}

// Same MID/DEEP landmark partition and drift as imp-34611/imp-34630.
const MID_LADDER = [Math.pow(10, 12.0), Math.pow(10, 12.5), Math.pow(10, 13.0), Math.pow(10, 13.333)];
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];

const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;

// Deep-vs-mid mean-share drift for a chosen share key at finite-difference step dp.
function driftAt(key, dp) {
  const midMean = mean(MID_LADDER.map((N) => sharesAt(N, dp)[key]));
  const deepMean = mean(DEEP_LADDER.map((N) => sharesAt(N, dp)[key]));
  return (deepMean - midMean) / midMean;
}

// imp-34611 F2 full tail grid, and the imp-34630 F3 flat-tail (dp >= 3e-2, past the roundoff valley).
const IMP34611_TAIL_STEPS = [1.5e-2, 2e-2, 3e-2, 5e-2, 8e-2, 1e-1, 1.5e-1, 2e-1, 3e-1];
const FLAT_TAIL_STEPS = [3e-2, 5e-2, 8e-2, 1e-1, 1.5e-1, 2e-1, 3e-1];

// Per-share spread/collapse table -- the imp-34630 F3 test applied to each share.
function spreadReport(key) {
  const full = IMP34611_TAIL_STEPS.map((dp) => driftAt(key, dp));
  const flat = FLAT_TAIL_STEPS.map((dp) => driftAt(key, dp));
  const fullSpread = Math.max(...full) - Math.min(...full);
  const flatSpread = Math.max(...flat) - Math.min(...flat);
  const dpAtMin = IMP34611_TAIL_STEPS[full.indexOf(Math.min(...full))];
  const dpAtMax = IMP34611_TAIL_STEPS[full.indexOf(Math.max(...full))];
  // Largest excursion from the flat-tail plateau (mean of dp >= 3e-2): does it sit at the smallest dp?
  const plateau = mean(flat);
  let dpAtMaxDev = null;
  let maxDev = -Infinity;
  IMP34611_TAIL_STEPS.forEach((dp, i) => {
    const dev = Math.abs(full[i] - plateau);
    if (dev > maxDev) { maxDev = dev; dpAtMaxDev = dp; }
  });
  return { fullSpread, flatSpread, dpAtMin, dpAtMax, dpAtMaxDev, collapse: fullSpread / flatSpread };
}

const Q2 = spreadReport('q2'); // full ~1.29e-6, collapse ~8.4x, maxDev at dp = 1.5e-2
const Q3 = spreadReport('q3'); // full ~2.21e-5, collapse ~10.8x, maxDev at dp = 1.5e-2 (imp-34630 baseline)
const Q4 = spreadReport('q4'); // full ~4.17e-3, collapse ~27.7x, maxDev at dp = 1.5e-2

export const IMP34651_Q2_Q4_SHARE_ROUNDOFF_VALLEY_SPREAD = Object.freeze({
  id: 'imp-34651',
  proofSection: 'S-frontier',
  claim_measured:
    'Assess whether the imp-34630 F3 diagnosis -- that the imp-34611 F2 ~2.2e-5 4th-order q3-share ' +
    'large-dp spread is a small-dp roundoff-valley artifact (largest excursion at the smallest steps, ' +
    'collapsing under dp >= 3e-2) -- also holds for the q2-share (C_q2 = -q2/(2 q1^2)) and q4-share ' +
    '(C_q4 = -q4/(24 q1^2)): measure each share deep-vs-mid drift spread across the same imp-34611 dp ' +
    'tail and test whether it is roundoff-valley dominated or carries genuine resolvable truncation ' +
    'drift -- a cross-check on the inherited component model, not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  partition: 'share_qk = C_qk/(C_q2 + C_q3 + C_q4), C_q2=-q2/2, C_q3=q3/6, C_q4=-q4/24 (q1^2 cancels)',
  stencils: 'q2,q3 = imp-34611 4th-order 7-point; q4 = imp-34592 5-point central 4th difference',
  tail_steps: Object.freeze(IMP34611_TAIL_STEPS.slice()),
  flat_tail_steps: Object.freeze(FLAT_TAIL_STEPS.slice()),
  q2_full_tail_spread: +Q2.fullSpread.toExponential(3), // ~1.290e-6
  q2_flat_tail_spread: +Q2.flatSpread.toExponential(3), // ~1.528e-7
  q2_collapse_factor: +Q2.collapse.toFixed(2), // ~8.44
  q2_dp_at_max_deviation: +Q2.dpAtMaxDev.toExponential(2), // 1.5e-2 (smallest step)
  q3_full_tail_spread: +Q3.fullSpread.toExponential(3), // ~2.208e-5 (imp-34630/imp-34611 baseline)
  q3_flat_tail_spread: +Q3.flatSpread.toExponential(3), // ~2.046e-6
  q3_collapse_factor: +Q3.collapse.toFixed(2), // ~10.80
  q3_dp_at_max_deviation: +Q3.dpAtMaxDev.toExponential(2), // 1.5e-2
  q4_full_tail_spread: +Q4.fullSpread.toExponential(3), // ~4.172e-3 (two orders above q3)
  q4_flat_tail_spread: +Q4.flatSpread.toExponential(3), // ~1.504e-4
  q4_collapse_factor: +Q4.collapse.toFixed(2), // ~27.74 (the most roundoff-valley dominated)
  q4_dp_at_max_deviation: +Q4.dpAtMaxDev.toExponential(2), // 1.5e-2 (smallest step)
  collapse_ladder_ordered_by_difference_order: [
    +Q2.collapse.toFixed(2),
    +Q3.collapse.toFixed(2),
    +Q4.collapse.toFixed(2),
  ], // ~[8.44, 10.80, 27.74] -- monotone in the finite-difference order of the share
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Applies the imp-34630 F3 spread/collapse test to the q2-share and ' +
    'q4-share of the 3-term partition share_qk = C_qk/(C_q2 + C_q3 + C_q4) [C_q2 = -q2/(2 q1^2), ' +
    'C_q3 = q3/(6 q1^2), C_q4 = -q4/(24 q1^2); q2,q3 from the imp-34611 4th-order 7-point stencil, q4 ' +
    'the imp-34592 5-point central 4th difference], with the imp-34611/imp-34630 deep-vs-mid drift and ' +
    'MID/DEEP landmark partition at N* ~ 4.62e13 (imp-33620 sigma < 0.01) verbatim, across the ' +
    'imp-34611 F2 tail grid dp = 1.5e-2 .. 3e-1. (F1) The q2-share spread is small-dp roundoff-valley ' +
    'dominated like q3: full-tail spread ~1.29e-6 with its largest excursion at the smallest step ' +
    'dp = 1.5e-2, collapsing ~8.4x to ~1.5e-7 once dp >= 3e-2 -- no resolvable large-dp truncation ' +
    'drift, and the LEAST sensitive of the three (q2 = 2nd central difference /dp^2 sits furthest from ' +
    'its roundoff floor). (F2) The q4-share spread is the MOST strongly roundoff-valley dominated: ' +
    'full-tail spread ~4.17e-3 (two orders above the q3 ~2.2e-5) with its largest excursion again at ' +
    'dp = 1.5e-2, collapsing ~27.7x to ~1.5e-4 -- exactly the imp-34592 result that q4 = (5-point 4th ' +
    'difference)/dp^4 is the least well-conditioned channel (roundoff inflates it ~1/dp^4 as dp ' +
    'shrinks), so the q4 share carries the largest small-dp valley and still no resolvable truncation ' +
    'drift. (F3) NO share carries a genuine resolvable large-dp truncation drift: for all three the ' +
    'full-tail spread collapses >= 5x once the two smallest steps are dropped (q2 ~8.4x, q3 ~10.8x, ' +
    'q4 ~27.7x) and the largest excursion always sits at dp = 1.5e-2, the roundoff valley, and the ' +
    'collapse factor ORDERS the shares by finite-difference conditioning q2 < q3 < q4 -- the same ' +
    '1/dp^k ladder imp-34633/imp-34646 measured. CONCLUSION: the imp-34630 F3 diagnosis GENERALISES ' +
    '-- every share reported large-dp spread is dominated by the small-dp roundoff valley rather than ' +
    'genuine truncation, and the effect grows monotonically with the difference order of the share. ' +
    'q1..q4 are inherited central differences, NOT fresh analytic closed forms, so the sigma -> 1 ' +
    'deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is inherited as-is -- this ' +
    'cross-checks that regime, it does not rehabilitate it. The -2 asymptote and C_C = (1/8)sqrt(3 pi) ' +
    '(imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; the inherited surrogate is NOT rigorous; changes no ' +
    'bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34630 (F3 q3-share small-dp roundoff artifact, generalised here); imp-34611 (F2 ~2.2e-5 ' +
    'q3-share large-dp spread; 4th-order q2/q3 stencil); imp-34592 (q4 5-point 4th difference, ' +
    'roundoff inflation ~1/dp^4); imp-34646/imp-34633 (1/dp^k finite-difference floor ladder k in ' +
    '{1,2,3,4}); imp-34543 (q2/q3 shares as ladder aggregates); imp-33620 (deep-tail landmark N* ~ ' +
    '4.62e13, sigma < 0.01); imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34651_ASSERTIONS = [
  {
    id: 'imp34651-q2-share-roundoff-valley-dominated',
    holds: () =>
      Q2.dpAtMaxDev <= 2e-2 && // largest excursion at the smallest steps (roundoff valley)
      Q2.collapse > 5 && // dropping the small-dp valley collapses the spread >= 5x
      Q2.flatSpread < Q2.fullSpread / 5,
    why: 'F1: the q2-share full-tail spread has its largest excursion at dp = 1.5e-2 and collapses ~8.4x once dp >= 3e-2 -- small-dp roundoff-valley dominated like q3, no resolvable large-dp truncation drift.',
  },
  {
    id: 'imp34651-q4-share-most-roundoff-valley-dominated',
    holds: () =>
      Q4.dpAtMaxDev <= 2e-2 && // largest excursion at the smallest steps
      Q4.collapse > 10 && // strongest collapse of the three
      Q4.fullSpread > Q3.fullSpread && // q4 spread larger than q3 (5-point 4th difference least conditioned)
      Q4.collapse > Q3.collapse,
    why: 'F2: the q4-share spread ~4.17e-3 (two orders above q3) has its largest excursion at dp = 1.5e-2 and collapses ~27.7x once dp >= 3e-2 -- the most roundoff-valley dominated channel, matching imp-34592 q4 ~1/dp^4 inflation.',
  },
  {
    id: 'imp34651-collapse-ladder-monotone-in-difference-order',
    holds: () =>
      Q2.collapse < Q3.collapse &&
      Q3.collapse < Q4.collapse && // q2 < q3 < q4 -- ordered by finite-difference order
      Q2.dpAtMaxDev <= 2e-2 &&
      Q3.dpAtMaxDev <= 2e-2 &&
      Q4.dpAtMaxDev <= 2e-2,
    why: 'F3: no share carries a resolvable large-dp truncation drift -- all three collapse under dp >= 3e-2 with the largest excursion at dp = 1.5e-2, and the collapse factor orders them q2 < q3 < q4 by finite-difference conditioning (the 1/dp^k ladder).',
  },
  {
    id: 'imp34651-honesty-gate-no-qed',
    holds: () =>
      IMP34651_Q2_Q4_SHARE_ROUNDOFF_VALLEY_SPREAD.isRigorous === false &&
      /NO QED/.test(IMP34651_Q2_Q4_SHARE_ROUNDOFF_VALLEY_SPREAD.verdict) &&
      /refereed bound is changed/i.test(IMP34651_Q2_Q4_SHARE_ROUNDOFF_VALLEY_SPREAD.verdict) &&
      /UNTOUCHED/.test(IMP34651_Q2_Q4_SHARE_ROUNDOFF_VALLEY_SPREAD.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34651_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34651-q2-q4-share-roundoff-valley-spread assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34651_Q2_Q4_SHARE_ROUNDOFF_VALLEY_SPREAD;
