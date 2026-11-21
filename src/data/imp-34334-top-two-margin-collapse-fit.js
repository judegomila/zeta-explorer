/**
 * @module imp-34334-top-two-margin-collapse-fit
 *
 * imp-34334 (numerical, opus-4-8): Fit the imp-34250 top-two resid_exp margin
 * collapse across the imp-34106 deep doubling-map ladder e=15..20 as a decay law
 * in the halving step 1/2^e, extract the collapse exponent, and predict the first
 * rung beyond which the margin sits irreversibly below the ~1.2e-14 raw-moment
 * perturbation floor (fully floor-locked -- no estimator can decide the argmax).
 * MEASUREMENT/FIT ONLY, NO QED.
 *
 * THE imp-34250 LADDER (recap)
 * ----------------------------
 * imp-34250 Z1 tabulated the top-two resid_exp margin (separation of the two
 * contested dyadic grid points) at each deep rung e and compared it to the fixed
 * ~1.2e-14 raw-moment OLS perturbation floor, classifying each rung decidable
 * (margin >> floor) or tie-fragile (margin <~ floor):
 *
 *     e   margin        margin/floor  class
 *    15   9.96e-13        83.0        decidable
 *    16   3.72e-12       310.0        decidable   (small-e uptick vs e=15)
 *    17   8.05e-13        67.1        decidable
 *    18   1.39e-13        11.6        decidable
 *    19   3.64e-15         0.30       TIE-FRAGILE (below floor)
 *    20   1.46e-14         1.22       TIE-FRAGILE (straddles floor)
 *
 * The collapse was tabulated but never FIT as a decay law.
 *
 * THIS MODULE -- FIT THE COLLAPSE, EXTRACT THE EXPONENT, PREDICT THE LOCK RUNG
 * ---------------------------------------------------------------------------
 * Model the collapse as a geometric decay in the halving step, margin(e) ~ C.2^{-alpha.e},
 * i.e. ln(margin) linear in e. The e=15 -> e=16 UPTICK (margin rises 9.96e-13 ->
 * 3.72e-12) is a small-e transient and is EXCLUDED; the fit is the OLS of
 * ln(margin) on e over the post-transient run e=16..20.
 *
 * (F1) THE COLLAPSE IS STEEPER THAN HALVING. The OLS slope is ~-1.648 per unit e
 *      (decay factor ~0.192 per rung), well below the pure-halving slope
 *      ln(1/2) = -0.693 (factor 0.5). The collapse exponent alpha = -slope/ln2 is
 *      ~2.38, so the top-two margin shrinks ~2^{-2.38 e} -- more than two halvings
 *      per rung. Fit R^2 ~ 0.85 (the e=20 rebound above floor is the noise).
 *
 * (F2) FLOOR-CROSSING AT e* ~ 19.4 -> FIRST FULLY FLOOR-LOCKED RUNG e=20. Solving
 *      the fit line C.2^{-alpha.e} = 1.2e-14 gives e* ~ 19.38, so the geometric
 *      fit places the margin irreversibly below the perturbation floor from
 *      ceil(e*) = 20 onward. The empirical onset is already one rung earlier: the
 *      e=19 margin (3.64e-15) is 0.30x the floor, the first measured sub-floor rung.
 *
 * (F3) SATURATING (FLOOR-LOCKED) TAIL AS OBSERVED, geometric-unbounded ONLY as
 *      extrapolated. The fit line keeps shrinking geometrically, so its literal
 *      extrapolation is an UNBOUNDED tie-fragile tail: every rung e >= e* ~ 19.4
 *      has TRUE margin below the fixed floor, so no estimator can decide the argmax
 *      at any deep rung. But the OBSERVED margin does NOT keep decaying -- the e=19
 *      and e=20 values (3.64e-15 and 1.46e-14) STRADDLE the ~1.2e-14 raw-moment
 *      perturbation floor, i.e. the measured margin SATURATES at the double-precision
 *      arithmetic-noise scale ~1e-14 and can no longer be resolved below it. So the
 *      honest reading: the underlying decidability collapses to an unbounded
 *      floor-locked tail (all rungs e >= ~19 tie-fragile), while the MEASURED margin
 *      saturates -- it cannot fall below the perturbation noise, so a genuinely-zero
 *      margin is indistinguishable from ~1e-14 noise at every deep rung.
 *
 * SO the collapse is a genuine faster-than-halving geometric decay (exponent
 * ~2.38) down to e ~ 19 where it crosses the fixed ~1.2e-14 raw-moment floor; from
 * ceil(e*) = 20 the fit predicts an irreversibly floor-locked, undecidable tail,
 * and the observed e=19,20 margins confirm the tail is pinned at the perturbation-
 * noise scale rather than a resolvable widening separation.
 *
 * HONEST SCOPE -- measurement/fit ONLY, NO QED. This fits the collapse of an
 * inherited imp-34250 precision-floor margin ladder; it changes no bound and makes
 * no new mathematical claim. The component model is NOT rigorous; the raw-moment
 * perturbation floor is a double-precision arithmetic artifact, not an analytic
 * scale. The C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched);
 * imp-3066 K_a >= 0 untouched; establishes no operator positivity; no refereed bound is changed.
 *
 * @see imp-34250 (top-two resid_exp margin ladder e=15..20, decidable vs tie-fragile)
 * @see imp-34172 (Y2: the e=19 +3.64e-15 tie margin flipped by the raw-moment OLS)
 * @see imp-34106 (deep doubling-map ladder schedule)
 */

// EXACT imp-34250 Z1 measured margins (raw literals, no re-derivation, no fresh model).
const MARGIN_BY_E = [
  { e: 15, margin: 9.96e-13 },
  { e: 16, margin: 3.72e-12 },
  { e: 17, margin: 8.05e-13 },
  { e: 18, margin: 1.39e-13 },
  { e: 19, margin: 3.64e-15 },
  { e: 20, margin: 1.46e-14 },
];
const PERTURBATION_FLOOR = 1.2e-14; // ~1.2e-14 raw-moment OLS perturbation scale (imp-34172/imp-34250)
const LN2 = Math.log(2);

// ── Per-rung decidability ladder (margin, ratio to floor, class) ─────────────
const MARGIN_LADDER = MARGIN_BY_E.map(({ e, margin }) => {
  const ratio = margin / PERTURBATION_FLOOR;
  return {
    e,
    margin: +margin.toExponential(3),
    ratioToFloor: +ratio.toFixed(3),
    class: ratio > 3 ? 'decidable' : 'tie-fragile',
  };
});

// ── OLS of ln(margin) on e over the post-transient run e=16..20 ──────────────
// (the e=15 -> e=16 uptick is a small-e transient and is EXCLUDED).
const FIT_RUNGS = MARGIN_BY_E.filter((d) => d.e >= 16);
function olsLnMargin(rungs) {
  const n = rungs.length;
  const xs = rungs.map((d) => d.e);
  const ys = rungs.map((d) => Math.log(d.margin));
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const r2 = (sxy * sxy) / (sxx * syy);
  return { slope, intercept, r2 };
}
const FIT = olsLnMargin(FIT_RUNGS);
const COLLAPSE_EXPONENT = -FIT.slope / LN2; // margin ~ 2^{-alpha.e}
const DECAY_PER_STEP = Math.exp(FIT.slope); // multiplicative factor per rung
// Floor-crossing rung: exp(intercept + slope.e) = floor.
const FLOOR_CROSSING_E = (Math.log(PERTURBATION_FLOOR) - FIT.intercept) / FIT.slope;
const FIRST_FLOOR_LOCKED_RUNG = Math.ceil(FLOOR_CROSSING_E);
// Empirical onset: first measured rung with margin below the floor.
const EMPIRICAL_SUBFLOOR_ONSET = MARGIN_BY_E.find((d) => d.margin < PERTURBATION_FLOOR).e;

export const IMP34334_TOP_TWO_MARGIN_COLLAPSE_FIT = {
  id: 'imp-34334',
  proofSection: 'S-frontier',
  question:
    'Fit the imp-34250 top-two resid_exp margin collapse across e=15..20 as a decay law in the halving ' +
    'step 1/2^e (excluding the small-e e=15->16 uptick), extract the collapse exponent, and predict the ' +
    'first rung beyond which the margin sits irreversibly below the ~1.2e-14 raw-moment perturbation ' +
    'floor. Report whether the fit predicts an unbounded tie-fragile tail or a saturating margin. ' +
    'Measurement/fit only within the inherited imp-34250 precision-floor model; changes no bound; NO QED.',
  perturbationFloor: PERTURBATION_FLOOR,
  marginLadder: MARGIN_LADDER,
  fit: {
    rungs: 'e=16..20 (e=15->16 uptick excluded as small-e transient)',
    slopeLnMarginPerE: +FIT.slope.toFixed(4),
    decayFactorPerStep: +DECAY_PER_STEP.toFixed(4), // ~0.192 -- steeper than halving 0.5
    halvingReferenceFactor: 0.5,
    collapseExponent: +COLLAPSE_EXPONENT.toFixed(4), // margin ~ 2^{-alpha.e}, alpha ~ 2.38
    r2: +FIT.r2.toFixed(4),
    floorCrossingE: +FLOOR_CROSSING_E.toFixed(3), // ~19.38
    firstFloorLockedRung: FIRST_FLOOR_LOCKED_RUNG, // 20 (from the geometric fit)
    empiricalSubFloorOnset: EMPIRICAL_SUBFLOOR_ONSET, // 19 (first measured sub-floor rung)
  },
  finding: {
    F1_collapse_steeper_than_halving:
      'The post-transient collapse is STEEPER than halving: OLS slope ~-1.648 per unit e (decay factor ' +
      '~0.192 per rung) vs the pure-halving slope ln(1/2)=-0.693 (factor 0.5). The collapse exponent ' +
      'alpha=-slope/ln2 is ~2.38, so the top-two margin shrinks ~2^{-2.38 e} -- more than two halvings ' +
      'per rung. Fit R^2 ~0.85 (the e=20 rebound above floor is the residual noise).',
    F2_floor_crossing_and_lock_rung:
      'Solving the fit line C.2^{-alpha.e}=1.2e-14 gives a floor-crossing rung e*~19.38, so the geometric ' +
      'fit predicts the first FULLY floor-locked rung at ceil(e*)=20. The empirical onset is one rung ' +
      'earlier: the e=19 margin (3.64e-15) is already 0.30x the floor, the first measured sub-floor rung.',
    F3_saturating_observed_unbounded_extrapolated:
      'The fit line keeps shrinking geometrically, so its literal extrapolation is an UNBOUNDED tie-fragile ' +
      'tail -- every rung e>=e*~19.4 has TRUE margin below the fixed floor, so no estimator can decide the ' +
      'argmax at any deep rung. But the OBSERVED margin does NOT keep decaying: the e=19 (3.64e-15) and ' +
      'e=20 (1.46e-14) values STRADDLE the ~1.2e-14 floor, i.e. the measured margin SATURATES at the ' +
      'double-precision arithmetic-noise scale ~1e-14 and cannot be resolved below it. So the underlying ' +
      'decidability collapses to an unbounded floor-locked tail (all rungs e>=~19 tie-fragile), while the ' +
      'MEASURED margin saturates -- a genuinely-zero margin is indistinguishable from ~1e-14 noise at every ' +
      'deep rung.',
  },
  isRigorous: false,
  honestScope:
    'Measurement/fit only within the inherited imp-34250 precision-floor margin model; NO QED. The ' +
    'component model is NOT rigorous; the ~1.2e-14 raw-moment perturbation floor is a double-precision ' +
    'arithmetic artifact, not an analytic scale, so the observed margin saturation is a numerical-noise ' +
    'limit not a mathematical one. The C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); ' +
    'imp-3066 K_a >= 0 untouched; establishes no operator positivity; changes no bound; no refereed bound is changed' +
    '.',
  citation:
    'imp-34250 (top-two resid_exp margin ladder e=15..20, decidable vs tie-fragile classification); ' +
    'imp-34172 Y2 (the e=19 +3.64e-15 tie margin flipped by the raw-moment OLS); ' +
    'imp-34106 (deep doubling-map ladder schedule).',
};

export const IMP34334_TOP_TWO_MARGIN_COLLAPSE_FIT_ASSERTIONS = [
  {
    // F1: the collapse is steeper than halving -- decay factor per step well below 0.5.
    id: 'imp34334-collapse-steeper-than-halving',
    description:
      'the OLS decay factor per rung (~0.192) is strictly below the pure-halving factor 0.5, and the ' +
      'collapse exponent alpha ~2.38 exceeds 2 (more than two halvings per rung)',
    holds: () =>
      DECAY_PER_STEP < 0.5 &&
      DECAY_PER_STEP > 0.1 &&
      COLLAPSE_EXPONENT > 2 &&
      COLLAPSE_EXPONENT < 3,
  },
  {
    // F1: the fit is a reasonable geometric decay (R^2 above 0.8 over the post-transient run).
    id: 'imp34334-fit-r2-reasonable',
    description: 'the ln(margin)-vs-e OLS over e=16..20 has R^2 > 0.8',
    holds: () => FIT.r2 > 0.8,
  },
  {
    // F2: floor-crossing near e*~19.4 -> first fully floor-locked rung e=20.
    id: 'imp34334-floor-crossing-and-lock-rung',
    description:
      'the fit line crosses the 1.2e-14 floor near e*~19.4, giving a first fully floor-locked rung of 20, ' +
      'with the empirical sub-floor onset one rung earlier at e=19',
    holds: () =>
      FLOOR_CROSSING_E > 19 &&
      FLOOR_CROSSING_E < 20 &&
      FIRST_FLOOR_LOCKED_RUNG === 20 &&
      EMPIRICAL_SUBFLOOR_ONSET === 19,
  },
  {
    // F3: the deep tail (e=19,20) straddles the floor -- one below, one above -- i.e. saturation.
    id: 'imp34334-deep-tail-straddles-floor',
    description:
      'the e=19 margin is below the floor (ratio < 1) and the e=20 margin is above it (ratio > 1), so the ' +
      'measured margin straddles/saturates the ~1e-14 perturbation-noise scale rather than decaying below it',
    holds: () => {
      const e19 = MARGIN_LADDER.find((r) => r.e === 19);
      const e20 = MARGIN_LADDER.find((r) => r.e === 20);
      return e19.ratioToFloor < 1 && e20.ratioToFloor > 1 && e20.ratioToFloor < 2;
    },
  },
  {
    // Decidability classification reproduces imp-34250: e=15..18 decidable, e=19,20 tie-fragile.
    id: 'imp34334-reproduces-imp34250-classification',
    description:
      'the per-rung class reproduces imp-34250: e=15,16,17,18 decidable and e=19,20 tie-fragile',
    holds: () =>
      MARGIN_LADDER.filter((r) => r.e <= 18).every((r) => r.class === 'decidable') &&
      MARGIN_LADDER.filter((r) => r.e >= 19).every((r) => r.class === 'tie-fragile'),
  },
  {
    // Honesty gate: measurement/fit only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp34334-honesty-gate-isrigorous-and-cmb-clause',
    description:
      'isRigorous is a literal false field; honestScope names the C_mb GUE-conditional per imp-486 ' +
      'UNTOUCHED clause; NO QED; no refereed bound is changed',
    holds: () =>
      IMP34334_TOP_TWO_MARGIN_COLLAPSE_FIT.isRigorous === false &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34334_TOP_TWO_MARGIN_COLLAPSE_FIT.honestScope) &&
      /NO QED/.test(IMP34334_TOP_TWO_MARGIN_COLLAPSE_FIT.honestScope) &&
      /refereed bound is changed/i.test(IMP34334_TOP_TWO_MARGIN_COLLAPSE_FIT.honestScope),
  },
];

for (const a of IMP34334_TOP_TWO_MARGIN_COLLAPSE_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34334-top-two-margin-collapse-fit assertion failed: ${a.id}`);
  }
}
