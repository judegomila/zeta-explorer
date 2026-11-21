/**
 * @module imp-34754-dp-star-probe-band-ratio-deep-tail
 * @fileoverview imp-34754 -- MEASUREMENT / DERIVATION ONLY: extend the imp-34735 exact-model edge-ratio
 *   ladder [dp-star(N)/0.05 (finer edge) and dp-star(N)/0.1 (coarser edge)] from its N = 1e100 ceiling
 *   deeper into the tail toward N = 1e300, and MEASURE whether the two edge ratios converge to finite
 *   asymptotic limits -- confirming or refuting the imp-34735 no-crossing verdict deeper in the tail.
 *
 *   THE QUESTION
 *   -----------
 *   imp-34735 located the internal trust-boundary crossing where the imp-34711 rising smallest-usable
 *   step dp-star(N) = (W_max*eps*|q| / (240*|q3|))^(1/3) ~ (W_max*eps/480)^(1/3)(log N)^(4/3) meets the
 *   FIXED imp-34691 probe band (dp = 0.1 / 0.05), and reported that on the exact-model ratio ladder the
 *   two edges reach only dp-star/0.05 ~ 0.170 and dp-star/0.1 ~ 0.085 at N = 1e100, so the differencing
 *   step never outgrows the probe resolution below 1e100 (NO crossing). But imp-34735 STOPPED the exact
 *   ladder at 1e100 and read the crossing (log10 N ~ 374.6 finer, ~630.1 coarser) only off the closed-form
 *   extrapolation. This module carries the EXACT-model ratio ladder several more decades, toward N = 1e300,
 *   and asks the sharper question: do the two edge ratios CONVERGE to finite asymptotic limits, or keep
 *   rising -- and does the no-crossing verdict hold deeper in the tail?
 *
 *   THE MEASUREMENT (exact-model edge-ratio ladder, 1e100 .. 1e300)
 *   --------------------------------------------------------------
 *   On the identical imp-34691/imp-34711/imp-34735 footing [q3 = 9-point antisymmetric stencil
 *   [7,-72,338,-488,+488,-338,+72,-7]/240 on q(p) = log E_coll; physical q3 from the dp = 0.1/0.05 probe
 *   band; W_max = 488] we re-evaluate dp-star(N) = (W_max*eps*|q| / (240*|q3|))^(1/3) across a 20-decade
 *   grid from 1e100 to 1e300 and form the two edge ratios dp-star(N)/0.05 and dp-star(N)/0.1.
 *
 *   THE FINDING
 *   -----------
 *   (F1) THE EDGE RATIOS DO NOT CONVERGE TO FINITE LIMITS -- THEY DIVERGE. Both ratios rise monotonically
 *        and WITHOUT saturation across 1e100 .. 1e300: the finer dp-star/0.05 climbs from ~0.170 at 1e100
 *        to ~0.806 at 1e300 (a ~4.75x increase over 200 decades) and the coarser dp-star/0.1 from ~0.085
 *        to ~0.403. Because dp-star(N) ~ (log N)^(4/3) is unbounded, the asymptotic "limit" of each edge
 *        ratio is +infinity, NOT a finite plateau -- so the no-crossing result is asymptotically only a
 *        matter of HOW FAR the crossing sits, not whether one exists.
 *   (F2) THE NO-CROSSING VERDICT STILL HOLDS THROUGH 1e300, BUT ONLY JUST. The finer edge reaches
 *        dp-star/0.05 ~ 0.806 at 1e300 -- still below 1, so the differencing step has not yet outgrown the
 *        finer probe step and the inherited q3 ladder remains self-consistent at every N up to 1e300. But
 *        the finer probe edge is now ~81% of the way to corruption, versus only ~17% at 1e100: the margin
 *        the imp-34735 verdict rested on has largely closed by 1e300.
 *   (F3) THE EXACT dp-star RUNS ABOVE THE CLOSED-FORM ASYMPTOTE IN THE DEEP TAIL, SO THE TRUE CROSSING IS
 *        EARLIER THAN ~1e375. The exact-model dp-star exceeds the imp-34735 closed-form asymptote
 *        (W_max*eps/480)^(1/3)(log N)^(4/3) by a growing margin, up to ~7.7% at 1e300, so the exact finer
 *        edge reaches 1 SOMEWHAT SOONER than the closed-form log10 N ~ 374.6 extrapolation. Pinning the
 *        exact crossover exactly is beyond IEEE double: at N ~ 1e300 the argument p = log N ~ 690.8 leaves
 *        only ~19 in the exponent before exp(p + 4*dp) overflows (~1.8e308), and the exact ratio already
 *        loses monotonicity by ~1e305, so 1e300 is the numerically reliable ceiling of the exact ladder
 *        and the ~1e375 closed-form value remains the best available (extrapolated) crossover estimate.
 *
 *   MEASUREMENT / DERIVATION ONLY. An exact-model ratio ladder extending the imp-34735 exact ladder from
 *   1e100 to 1e300; NOT a new bound. Reproduces the imp-34446/imp-34531/imp-34543/imp-34573 primitives
 *   inline (imports NOTHING -- no lambda mapping, no polymath15 module, no zeros bundle), per the
 *   no-heavy-imports directive. q1..q3 are inherited central differences, NOT fresh analytic closed forms,
 *   so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is inherited
 *   as-is; the ratio ladder is a property of the inherited model, not an independent physical claim, and
 *   the crossover N remains an asymptotic extrapolation hundreds of decades past the imp-34711-validated
 *   1e100 window that certifies nothing about the true q3. The -2 asymptote and C_C = (1/8)sqrt(3 pi)
 *   (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED;
 *   imp-3066 K_a >= 0 untouched; changes no bound; no operator positivity; no RH verdict, NO QED.
 *   No refereed bound is changed.
 *
 *   @see imp-34735-dp-star-probe-band-crossover-N.js (exact ratio ladder to 1e100 + closed-form crossover)
 *   @see imp-34711-q3-trust-boundary-far-tail-extension.js (F1/F3 dp-star(N) ~ (log N)^(4/3), 1e13..1e100)
 *   @see imp-34691-q3-cancellation-floor-trust-boundary.js (the dp = 0.1/0.05 probe band + dp-star(N) ladder)
 *
 *   Ticket: imp-34754 (numerical, medium). Deep-tail edge-ratio extension/limit-measurement; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34573 primitives (imports NOTHING),
//    verbatim from imp-34735 so the deep-tail ratio ladder is on the identical footing: --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const EPS = Number.EPSILON; // double-precision machine epsilon ~2.22e-16

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

// imp-34626/imp-34673 6th-order 9-point antisymmetric q3 numerator stencil (verbatim). q3 estimate is
// (sum w_k q(p + k dp)) / (240 dp^3); W_MAX = 488 is the largest weight magnitude in the amplitude.
const Q3_TERMS = [[4, 7], [3, -72], [2, 338], [1, -488], [-1, 488], [-2, -338], [-3, 72], [-4, -7]];
const Q3_DENOM = 240;
const W_MAX = 488;

function q3Num(p, dp) {
  let s = 0;
  for (const [k, w] of Q3_TERMS) s += w * qOfP(p + k * dp);
  return s;
}

// Physical q3(p) from the imp-34691 well-conditioned probe band (dp = 0.1 and 0.05). THESE two steps ARE
// the fixed trust band: the FINER 0.05 is the first edge dp-star(N) can climb up to, the COARSER 0.1 last.
const PROBE_DP_A = 0.1; // coarser probe step (crossed last)
const PROBE_DP_B = 0.05; // finer probe step (crossed first)
function q3Phys(p) {
  const a = q3Num(p, PROBE_DP_A) / (Q3_DENOM * Math.pow(PROBE_DP_A, 3));
  const b = q3Num(p, PROBE_DP_B) / (Q3_DENOM * Math.pow(PROBE_DP_B, 3));
  return (a + b) / 2;
}

// The imp-34691 depth-only prefactor C(N) and trust boundary dp-star(N) = C(N)^(1/3) (smallest usable step).
function prefactorC(p) {
  const q = qOfP(p);
  const q3p = q3Phys(p);
  return (W_MAX * EPS * Math.abs(q)) / (Q3_DENOM * Math.abs(q3p));
}
const dpStar = (p) => Math.cbrt(prefactorC(p));

// The imp-34711 F3 far-tail closed-form asymptote dp-star(p) ~ (W_max*eps/480)^(1/3) p^(4/3), for the (F3)
// exact-vs-closed-form deviation check that shows the true crossing is EARLIER than the ~1e375 extrapolation.
const ASYMP_PREF = Math.cbrt((W_MAX * EPS) / 480); // ~6.09e-6 (imp-34711 asymptotic prefactor)
const dpStarAsymp = (p) => ASYMP_PREF * Math.pow(p, 4 / 3);

// (EXACT-model deep-tail ratio ladder) 1e100 .. 1e300 in 20-decade steps -- 1e100 anchors to imp-34735.
const LADDER_EXPS = [100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300];
const RATIO_TABLE = LADDER_EXPS.map((e) => {
  const p = Math.log(Math.pow(10, e));
  const ds = dpStar(p);
  const dsAsym = dpStarAsymp(p);
  return Object.freeze({
    N: `1e${e}`,
    dp_star: +ds.toExponential(4),
    ratio_to_finer_0p05: +(ds / PROBE_DP_B).toFixed(4), // must stay < 1 for the finer probe to be usable
    ratio_to_coarser_0p1: +(ds / PROBE_DP_A).toFixed(4), // must stay < 1 for the coarser probe to be usable
    exact_over_asymptote: +(ds / dsAsym).toFixed(4), // > 1 -> exact runs above the closed-form asymptote
  });
});

// F1: both edge ratios rise monotonically across 1e100..1e300 (no convergence to a finite limit).
const RATIOS_MONOTONE_RISING = RATIO_TABLE.every(
  (r, i) => i === 0 || r.ratio_to_finer_0p05 > RATIO_TABLE[i - 1].ratio_to_finer_0p05,
);
const FINER_RATIO_1E100 = RATIO_TABLE[0].ratio_to_finer_0p05; // ~0.170 (anchors to imp-34735)
const FINER_RATIO_1E300 = RATIO_TABLE[RATIO_TABLE.length - 1].ratio_to_finer_0p05; // ~0.806
const COARSER_RATIO_1E300 = RATIO_TABLE[RATIO_TABLE.length - 1].ratio_to_coarser_0p1; // ~0.403
// growth factor of the finer edge ratio over the 200-decade extension -- FAR from 1 (no finite limit).
const FINER_RATIO_GROWTH_FACTOR = +(FINER_RATIO_1E300 / FINER_RATIO_1E100).toFixed(2); // ~4.75

// F2: the no-crossing verdict still holds through 1e300 (finer edge still below 1), but the margin has
// largely closed -- the finer edge is now ~81% of the way to corruption, versus ~17% at 1e100.
const NO_CROSSING_BELOW_1E300 = RATIO_TABLE.every((r) => r.ratio_to_finer_0p05 < 1 && r.ratio_to_coarser_0p1 < 1);
const FINER_FRACTION_TO_CORRUPTION_1E300 = FINER_RATIO_1E300; // = dp-star/0.05, the fraction of the way to 1

// F3: the exact dp-star runs ABOVE the closed-form asymptote in the deep tail, so the true finer-edge
// crossing is EARLIER than the imp-34735 closed-form log10 N ~ 374.6 extrapolation.
const EXACT_OVER_ASYMP_1E300 = RATIO_TABLE[RATIO_TABLE.length - 1].exact_over_asymptote; // ~1.077
const EXACT_ABOVE_ASYMPTOTE_DEEP_TAIL = EXACT_OVER_ASYMP_1E300 > 1.04; // exact exceeds asymptote by > 4% at 1e300
// the imp-34735 closed-form finer-edge crossover (extrapolation, an UPPER estimate of the true N).
const LOG10N_CROSS_FINER_CLOSED_FORM =
  +(Math.pow(PROBE_DP_B / ASYMP_PREF, 3 / 4) / Math.log(10)).toFixed(2); // ~374.63

export const IMP34754_DP_STAR_PROBE_BAND_RATIO_DEEP_TAIL = Object.freeze({
  id: 'imp-34754',
  proofSection: 'S-frontier',
  claim_measured:
    'Extend the imp-34735 exact-model edge-ratio ladder [dp-star(N)/0.05, dp-star(N)/0.1] from its ' +
    'N = 1e100 ceiling toward N = 1e300 and MEASURE whether the two edge ratios converge to finite ' +
    'asymptotic limits. RESULT: they do NOT converge -- both ratios RISE monotonically without ' +
    'saturation (finer 0.05 edge ~0.170 at 1e100 -> ~0.806 at 1e300, a ~4.75x climb; coarser 0.1 edge ' +
    '~0.085 -> ~0.403), because dp-star(N) ~ (log N)^(4/3) is unbounded so each edge ratio diverges to ' +
    '+infinity. The imp-34735 no-crossing verdict STILL HOLDS through 1e300 (finer edge ~0.806 < 1) but ' +
    'only just: the finer probe edge is now ~81% of the way to corruption, versus ~17% at 1e100. The ' +
    'exact dp-star runs up to ~7.7% ABOVE the closed-form asymptote at 1e300, so the true finer-edge ' +
    'crossing is EARLIER than the ~1e375 closed-form extrapolation: a measurement/derivation, not a bound.',
  ladder_range: '1e100 .. 1e300 (20-decade steps); 1e100 anchors to the imp-34735 exact ladder',
  probe_dp_band: Object.freeze({ coarser_crossed_last: PROBE_DP_A, finer_crossed_first: PROBE_DP_B }),
  asymp_prefactor_Wmax_eps_over_480_cbrt: +ASYMP_PREF.toExponential(4), // ~6.09e-6
  // (EXACT-model deep-tail ratio ladder + the F1 divergence / F2 no-crossing / F3 exact-vs-asymptote reads)
  ratio_ladder: RATIO_TABLE,
  finer_ratio_1e100: FINER_RATIO_1E100, // ~0.170 (anchor)
  finer_ratio_1e300: FINER_RATIO_1E300, // ~0.806
  coarser_ratio_1e300: COARSER_RATIO_1E300, // ~0.403
  finer_ratio_growth_factor_over_200_decades: FINER_RATIO_GROWTH_FACTOR, // ~4.75 -> no finite limit
  ratios_monotone_rising: RATIOS_MONOTONE_RISING,
  edge_ratios_converge_to_finite_limit: false, // F1: they DIVERGE like (log N)^(4/3)
  no_crossing_below_1e300: NO_CROSSING_BELOW_1E300, // F2: still holds, finer edge still < 1
  finer_fraction_to_corruption_1e300: FINER_FRACTION_TO_CORRUPTION_1E300, // ~0.806 (~81% of the way)
  exact_over_asymptote_1e300: EXACT_OVER_ASYMP_1E300, // ~1.077 -> exact above closed-form asymptote
  exact_above_asymptote_deep_tail: EXACT_ABOVE_ASYMPTOTE_DEEP_TAIL, // F3: true crossing earlier than ~1e375
  log10N_crossover_finer_closed_form_upper_estimate: LOG10N_CROSS_FINER_CLOSED_FORM, // ~374.63 (extrapolation)
  numerically_reliable_ceiling: '1e300 (exp(p + 4*dp) overflows and the exact ratio loses monotonicity by ~1e305)',
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (NOT rigorous). Extends the imp-34735 exact-model edge-ratio ladder ' +
    '[dp-star(N)/0.05 (finer), dp-star(N)/0.1 (coarser)] from its N = 1e100 ceiling toward N = 1e300 on ' +
    'the identical imp-34691/imp-34711/imp-34735 footing [q3 = 9-point antisymmetric stencil ' +
    '[7,-72,338,-488,+488,-338,+72,-7]/240 on q(p) = log E_coll; physical q3 from the dp = 0.1/0.05 ' +
    'probe band]. (F1) THE EDGE RATIOS DO NOT CONVERGE TO FINITE LIMITS -- THEY DIVERGE: both rise ' +
    'monotonically without saturation across 1e100 .. 1e300, the finer dp-star/0.05 climbing from ~0.170 ' +
    'at 1e100 to ~0.806 at 1e300 (a ~4.75x increase) and the coarser dp-star/0.1 from ~0.085 to ~0.403, ' +
    'so because dp-star(N) ~ (W_max*eps/480)^(1/3)(log N)^(4/3) is unbounded the asymptotic limit of each ' +
    'edge ratio is +infinity, not a finite plateau. (F2) THE NO-CROSSING VERDICT STILL HOLDS THROUGH ' +
    '1e300 BUT ONLY JUST: the finer edge reaches ~0.806 at 1e300 -- still below 1, so the differencing ' +
    'step has not yet outgrown the finer probe step and the inherited q3 ladder is self-consistent at ' +
    'every N up to 1e300 -- yet the finer probe edge is now ~81% of the way to corruption, versus only ' +
    '~17% at 1e100, so the margin the imp-34735 verdict rested on has largely closed. (F3) THE EXACT ' +
    'dp-star RUNS ABOVE THE CLOSED-FORM ASYMPTOTE IN THE DEEP TAIL (by up to ~7.7% at 1e300), so the ' +
    'exact finer-edge crossing is EARLIER than the imp-34735 closed-form log10 N ~ 374.6 extrapolation; ' +
    'pinning it exactly is beyond IEEE double [at 1e300 the argument p = log N ~ 690.8 leaves only ~19 in ' +
    'the exponent before exp(p + 4*dp) overflows, and the exact ratio loses monotonicity by ~1e305], so ' +
    '1e300 is the numerically reliable ceiling and the ~1e375 closed-form value remains the best ' +
    'available (extrapolated, upper) crossover estimate. q1..q3 are inherited central differences, NOT ' +
    'fresh analytic closed forms, so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model ' +
    'least trustworthy) is inherited as-is and the ratio ladder is a property of the inherited model, ' +
    'not an independent physical claim; the crossover N is an asymptotic extrapolation that certifies ' +
    'nothing about the true q3. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz ' +
    'are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; ' +
    'changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34735 (exact-model ratio ladder to 1e100 + closed-form crossover log10 N ~ 374.6/630.1); ' +
    'imp-34711 (F1/F3 dp-star(N) ~ (log N)^(4/3) far-tail ladder, 1e13..1e100, validated to < 2%); ' +
    'imp-34691 (the dp = 0.1/0.05 well-conditioned q3 probe band + dp-star(N) ladder to 1e15); ' +
    'imp-34606 (clean {2,3,4} 1/dp^k exponent ladder); imp-2714 (C_C ansatz); imp-486 (C_mb GUE-conditional).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34754_ASSERTIONS = [
  {
    id: 'imp34754-q3-stencil-normalization',
    holds: () => {
      let m3 = 0;
      for (const [k, w] of Q3_TERMS) m3 += w * k * k * k;
      return Math.abs(m3 / Q3_DENOM / 6 - 1) < 1e-12 && W_MAX === Math.max(...Q3_TERMS.map(([, w]) => Math.abs(w)));
    },
    why: 'Guards the inherited q3 stencil: 3rd-derivative normalization sum c_k k^3/6 = 1 and W_max = 488.',
  },
  {
    id: 'imp34754-edge-ratios-diverge-not-converge',
    holds: () =>
      RATIOS_MONOTONE_RISING &&
      FINER_RATIO_1E100 > 0.15 && FINER_RATIO_1E100 < 0.2 && // ~0.170 anchor to imp-34735
      FINER_RATIO_1E300 > 0.75 && FINER_RATIO_1E300 < 0.85 && // ~0.806 at the deep-tail top rung
      FINER_RATIO_GROWTH_FACTOR > 3 && // ~4.75x over 200 decades -> NOT a finite limit
      IMP34754_DP_STAR_PROBE_BAND_RATIO_DEEP_TAIL.edge_ratios_converge_to_finite_limit === false,
    why: 'F1: both edge ratios rise monotonically ~4.75x over 1e100..1e300 (finer 0.170 -> 0.806) -- they diverge like (log N)^(4/3), no finite limit.',
  },
  {
    id: 'imp34754-no-crossing-holds-through-1e300-but-margin-closed',
    holds: () =>
      NO_CROSSING_BELOW_1E300 &&
      FINER_RATIO_1E300 < 1 && FINER_RATIO_1E300 > 0.75 && // finer edge below 1 but ~81% of the way
      COARSER_RATIO_1E300 < FINER_RATIO_1E300, // coarser edge lags the finer edge
    why: 'F2: no-crossing verdict still holds through 1e300 (finer edge ~0.806 < 1) but the margin has largely closed (~81% of the way to corruption vs ~17% at 1e100).',
  },
  {
    id: 'imp34754-exact-above-asymptote-crossing-earlier',
    holds: () =>
      EXACT_ABOVE_ASYMPTOTE_DEEP_TAIL &&
      EXACT_OVER_ASYMP_1E300 > 1.04 && EXACT_OVER_ASYMP_1E300 < 1.12 && // exact ~7.7% above asymptote at 1e300
      LOG10N_CROSS_FINER_CLOSED_FORM > 370 && LOG10N_CROSS_FINER_CLOSED_FORM < 380, // ~374.6 upper estimate
    why: 'F3: exact dp-star runs ~7.7% above the closed-form asymptote at 1e300, so the true crossing is earlier than the ~1e375 closed-form extrapolation (best-available upper estimate).',
  },
  {
    id: 'imp34754-honesty-gate-no-qed',
    holds: () =>
      IMP34754_DP_STAR_PROBE_BAND_RATIO_DEEP_TAIL.isRigorous === false &&
      /NO QED/.test(IMP34754_DP_STAR_PROBE_BAND_RATIO_DEEP_TAIL.verdict) &&
      /refereed bound is changed/i.test(IMP34754_DP_STAR_PROBE_BAND_RATIO_DEEP_TAIL.verdict) &&
      /UNTOUCHED/.test(IMP34754_DP_STAR_PROBE_BAND_RATIO_DEEP_TAIL.verdict) &&
      /extrapolation/.test(IMP34754_DP_STAR_PROBE_BAND_RATIO_DEEP_TAIL.verdict),
    why: 'Honesty gate: measurement/derivation only, crossover is an extrapolation, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34754_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34754-dp-star-probe-band-ratio-deep-tail assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34754_DP_STAR_PROBE_BAND_RATIO_DEEP_TAIL;
