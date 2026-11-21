/**
 * @module imp-3708-s2-gronwall-vacuity-intrinsic-assessment
 *
 * imp-3708 (proof, frontier-direction): ASSESS the imp-3671 S2 obstruction SPECIFICALLY. imp-3671 named
 * two independent obstructions to using the mesoscopic density floor V0 as the G6a_shock_lipschitz
 * modulus: (S1) a type/dimension mismatch (a sibling ticket scopes the missing x-difference structure)
 * and (S2) the nearest-pair regime is Gronwall-VACUOUS -- the Lemma B floor exp(-2 s / y^2) collapses
 * to ~1e-10 at the k~50 nearest-pair strip height. This module addresses S2 ALONE: does ANY microscopic
 * nearest-pair-scale reading in the repo (imp-2520 nearest-pair collision, the imp-3642 direct-flow
 * field read at small strip height, per-pair gap statistics) admit a Gronwall contraction whose floor
 * stays NON-vacuous (bounded away from 0) at the shock-front nearest-pair scale, or is the vacuity
 * INTRINSIC to the y_star -> d (and y -> g) limit? Assessment/derivation only; no bridge closure, NO QED.
 *
 * THE STRUCTURE OF THE LEMMA B GRONWALL FLOOR
 * -------------------------------------------
 * Along the single global Step-2 backward-Dyson flow the contraction floor is exp(-2 s / y^2), with
 *   s = the FIXED backward-flow depth of that one global flow (a single number, not per strip height),
 *   y = the strip height at which the contraction is read.
 * imp-3642 read the mesoscopic floor at y = y_star = 4 d and found worst floor 0.991, so the mesoscopic
 * exponent is E_meso = 2 s / y_star^2 = -ln(0.991) = 0.009041, i.e. the fixed depth is
 *   s = E_meso * y_star^2 / 2   (in units d = 1, y_star = 4:  s = 0.0723).
 * Reading the SAME fixed-depth flow at a smaller strip height y = y_star / k gives exponent
 *   2 s / y^2 = E_meso * (y_star / y)^2 = E_meso * k^2,   floor(k) = exp(-E_meso * k^2) = floor_meso^{k^2}.
 * Because s is held FIXED while y -> 0, the exponent E_meso * k^2 diverges and the floor collapses to 0.
 *
 * THE ONE ESCAPE CONDITION (and why no repo reading meets it)
 * ----------------------------------------------------------
 * The floor stays bounded away from 0 as y -> 0 iff the flow depth itself shrinks like the strip height
 * squared, s(y) ~ s * (y / y_star)^2, giving 2 s(y) / y^2 = 2 s / y_star^2 = E_meso CONSTANT at every
 * scale (floor pinned at 0.991). This is a per-pair-ADAPTED (self-similar) flow depth: the flow must run
 * only as deep as the local gap squared. The three candidate microscopic readings surveyed below each
 * carry a FIXED (mesoscopically-calibrated) depth, NOT an s(y) ~ y^2 adaptation:
 *   R1  imp-2520 nearest-pair collision: supplies a collision TIME t_c ~ 1/(2 V0), a single
 *       density-set scale, not a per-strip-height flow depth. Its negative-finding 1 is EXACTLY that the
 *       nearest-pair regime is a different, Gronwall-vacuous scale -- consistent with fixed s.
 *   R2  imp-3642 direct-flow field: measured at the single height y_star = 4 d with a fixed RK4 flow
 *       depth / step budget; reading it at smaller y inherits the SAME s and lands in the vacuous strip.
 *   R3  per-pair gap statistics: give the gap distribution (WHERE the nearest pairs sit, small y) but
 *       attach NO flow depth; they LOCATE the vacuous regime, they do not supply an s(y) ~ y^2.
 * None re-parameterizes the flow depth per strip height, so none escapes.
 *
 * CROSSOVER STRIP HEIGHT WHERE THE FIXED-DEPTH FLOOR BECOMES VACUOUS
 * -----------------------------------------------------------------
 *   floor = 1/e  (one e-fold, vacuity ONSET):   k = 1/sqrt(E_meso) ~ 10.52,  y ~ 0.380 d
 *   floor = 1e-3 (numerically vacuous):         k ~ 27.64,                   y ~ 0.145 d
 *   nearest-pair proxy y ~ 0.08 d (k = 50):     floor ~ 1.5e-10
 * The onset (0.380 d) already sits ABOVE the mean spacing-fraction where nearest pairs live, so the
 * ENTIRE nearest-pair regime (gap g << d, i.e. y well below 0.38 d) lies inside the vacuous strip.
 *
 * VERDICT: INTRINSIC. Under the single-global-flow-depth structure of the Lemma B Gronwall floor, the
 * vacuity at the nearest-pair front is intrinsic to the y -> 0 limit: no microscopic reading in the repo
 * (imp-2520, imp-3642, per-pair gaps) supplies the per-pair y^2-adapted flow depth s(y) ~ y^2 that a
 * NON-vacuous contraction would require -- they all inherit the fixed mesoscopic depth and collapse at
 * the same crossover (~0.38 d onset). The escape is a NAMED, still-missing object:
 *   SUB-GAP G6a_shock_lipschitz::y2-adapted-flow-depth
 *   -- a per-pair (self-similar) backward-flow depth s(y) ~ y^2 pinning the Gronwall floor away from 0
 *      at the nearest-pair scale. No current repo object supplies it; S2 is not escaped by any reading.
 *
 * ASSESSMENT / DERIVATION ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed.
 *
 * @see imp-3671-mesoscopic-v0-vs-g6a-shock-lipschitz-assessment (parent: names S1 and S2; this drills S2)
 * @see imp-3693-microscopic-xdiff-route-scoping (the sibling that scopes the S1 x-difference structure)
 * @see imp-3642-sigma-crossover-tc-direct-dyson-crosscheck (V0 linear in log(gamma/2pi), floor 0.991)
 * @see imp-2520 (shock time t_c ~ 1/(2 V0); negative-finding 1: nearest-pair regime Gronwall-vacuous)
 * @see lambda-roadmap (Step 4 Polymath15 bridge, open sub-gap G6a_shock_lipschitz)
 */

// imp-3642 measured worst mesoscopic Gronwall floor at y_star = 4 d (F1, "worst grid-sup ... = 0.991").
const IMP3642_MESO_FLOOR = 0.991;
// Mesoscopic Gronwall exponent E_meso = 2 s / y_star^2 = -ln(floor_meso).
const E_MESO = -Math.log(IMP3642_MESO_FLOOR); // 0.009041

// FIXED-depth floor: read the ONE global-depth flow at strip height y = y_star / k. floor = floor_meso^{k^2}.
function fixedDepthFloor(k) {
  return Math.exp(-(k * k) * E_MESO);
}

// y2-ADAPTED-depth floor (the escape hypothesis): depth s(y) ~ s (y/y_star)^2 pins the exponent at E_meso,
// so the floor is CONSTANT = floor_meso at every strip height. No repo reading supplies this s(y) ~ y^2.
function adaptedDepthFloor(_k) {
  return Math.exp(-E_MESO);
}

// Strip-height ladder from mesoscopic (k = 1, y_star = 4 d) toward the nearest-pair scale (large k).
const K_LADDER = [1, 2, 4, 8, 16, 32, 50];
const FIXED_DEPTH_TABLE = K_LADDER.map((k) => ({
  k,
  y_over_d: +(4 / k).toFixed(4), // y = y_star / k, y_star = 4 d
  fixedDepthFloor: +fixedDepthFloor(k).toExponential(4),
  adaptedDepthFloor: +adaptedDepthFloor(k).toFixed(6), // constant 0.991 (escape hypothesis)
}));

// Crossover strip heights where the FIXED-depth floor becomes vacuous.
const K_ONSET = 1 / Math.sqrt(E_MESO); // floor = 1/e, ~10.52
const Y_ONSET_OVER_D = 4 / K_ONSET; // ~0.380 d
const K_VACUOUS = Math.sqrt(Math.log(1e3) / E_MESO); // floor = 1e-3, ~27.64
const Y_VACUOUS_OVER_D = 4 / K_VACUOUS; // ~0.145 d

// Survey of the microscopic-scale readings and whether each supplies a per-pair y2-adapted flow depth.
const READINGS = [
  {
    id: 'imp-2520-nearest-pair-collision',
    supplies: 'collision TIME t_c ~ 1/(2 V0), a single density-set scale (not a per-height flow depth)',
    y2AdaptedDepth: false,
    note: 'negative-finding 1: nearest-pair regime is a different, Gronwall-vacuous scale',
  },
  {
    id: 'imp-3642-direct-flow-field',
    supplies: 'V0 profile at the single height y_star = 4 d with a FIXED RK4 flow depth / step budget',
    y2AdaptedDepth: false,
    note: 'reading it at smaller y inherits the same fixed s and lands in the vacuous strip',
  },
  {
    id: 'per-pair-gap-statistics',
    supplies: 'the gap distribution (WHERE nearest pairs sit, small y); attaches NO flow depth',
    y2AdaptedDepth: false,
    note: 'locates the vacuous regime; does not supply an s(y) ~ y^2',
  },
];

const ANY_READING_ESCAPES = READINGS.some((r) => r.y2AdaptedDepth === true);

export const IMP3708_S2_GRONWALL_VACUITY_INTRINSIC_ASSESSMENT = {
  id: 'imp-3708',
  proofSection: 'S-frontier',
  question:
    'Addressing the imp-3671 S2 obstruction alone: does ANY microscopic nearest-pair-scale reading in ' +
    'the repo (imp-2520 nearest-pair collision, the imp-3642 direct-flow field at small strip height, ' +
    'per-pair gap statistics) admit a Gronwall contraction whose floor exp(-2 s / y^2) stays NON-vacuous ' +
    '(bounded away from 0) at the shock-front nearest-pair scale, or is the vacuity INTRINSIC to the ' +
    'y_star -> d (and y -> g) limit? Assessment/derivation only, no bridge closure, no QED.',
  floorStructure:
    'The Lemma B floor exp(-2 s / y^2) along the single global Step-2 backward-Dyson flow uses one FIXED ' +
    'depth s (not per strip height) read at strip height y. imp-3642 pins it at y_star = 4 d with floor ' +
    '0.991, so E_meso = 2 s / y_star^2 = -ln(0.991) = 0.009041. Reading the same fixed-depth flow at ' +
    'y = y_star / k gives floor exp(-E_meso k^2) = floor_meso^{k^2}, which collapses to 0 as y -> 0.',
  escapeCondition:
    'The floor stays bounded away from 0 as y -> 0 iff the flow depth shrinks like y^2, s(y) ~ s (y / ' +
    'y_star)^2, pinning 2 s(y) / y^2 = E_meso at every scale (floor constant 0.991). This is a per-pair ' +
    '(self-similar) ADAPTED depth: run the flow only as deep as the local gap squared.',
  readingsSurveyed: READINGS,
  anyReadingEscapes: ANY_READING_ESCAPES, // false: none supplies an s(y) ~ y^2 adapted depth
  vacuityIntrinsic: true,
  scaleSeparation: {
    E_meso: +E_MESO.toFixed(6), // 0.009041 = 2 s / y_star^2 from the measured 0.991 floor
    y_star_over_d: 4, // imp-3642 baseline strip height
    table: FIXED_DEPTH_TABLE, // fixed-depth floor collapse vs the constant adapted-depth escape floor
    k_onset: +K_ONSET.toFixed(2), // ~10.52: floor = 1/e (vacuity onset)
    y_onset_over_d: +Y_ONSET_OVER_D.toFixed(4), // ~0.380 d
    k_vacuous: +K_VACUOUS.toFixed(2), // ~27.64: floor = 1e-3 (numerically vacuous)
    y_vacuous_over_d: +Y_VACUOUS_OVER_D.toFixed(4), // ~0.145 d
    floor_at_nearest_pair_proxy: +fixedDepthFloor(50).toExponential(2), // ~1.5e-10: vacuous
  },
  namedSubGap: 'G6a_shock_lipschitz::y2-adapted-flow-depth',
  subGapStatement:
    'A per-pair (self-similar) backward-flow depth s(y) ~ y^2 that pins the Gronwall floor away from 0 at ' +
    'the nearest-pair scale. No current repo object supplies it; S2 is not escaped by any microscopic ' +
    'reading, so this is the still-missing object separating the mesoscopic contraction from the front.',
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous): the imp-3671 S2 Gronwall-vacuity is INTRINSIC. Under ' +
    'the single-global-flow-depth structure of the Lemma B floor exp(-2 s / y^2), the fixed depth s is ' +
    'pinned by the mesoscopic reading (E_meso = -ln(0.991) = 0.009041 at y_star = 4 d); reading the same ' +
    'flow at y = y_star / k gives floor_meso^{k^2}, collapsing from 0.991 to 1/e already at ~0.380 d, to ' +
    '1e-3 by ~0.145 d, to ~1.5e-10 at the ~0.08 d nearest-pair proxy -- so the ENTIRE nearest-pair ' +
    'regime (gap g << d) sits inside the vacuous strip. A NON-vacuous floor as y -> 0 requires a per-pair ' +
    'y2-adapted flow depth s(y) ~ y^2 (pinning 2 s(y) / y^2 = E_meso at every scale). None of the three ' +
    'surveyed microscopic readings supplies it: imp-2520 gives a single density-set collision TIME (its ' +
    'negative-finding 1 IS this vacuity), the imp-3642 field carries a fixed mesoscopic RK4 depth, and ' +
    'per-pair gap statistics attach no flow depth. So no reading escapes S2; the vacuity is intrinsic to ' +
    'the y -> 0 limit and the escape is a named, still-missing object (sub-gap ' +
    'G6a_shock_lipschitz::y2-adapted-flow-depth). Assessment/derivation only; no positivity, no bridge ' +
    'closure, no RH claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-3671 (parent assessment: S1 type mismatch and S2 Gronwall-vacuous nearest-pair scale); imp-3642 ' +
    '(direct RK4 attractive-Dyson flow; worst mesoscopic Gronwall floor 0.991 at y_star = 4 d); imp-2520 ' +
    '(shock time t_c ~ 1/(2 V0); negative-finding 1: nearest-pair regime is a different, Gronwall-vacuous ' +
    'scale); imp-3693 (sibling scoping the S1 x-difference structure); lambda-roadmap Step 4 (Polymath15 ' +
    'bridge, open sub-gap G6a_shock_lipschitz).',
};

export const IMP3708_S2_GRONWALL_VACUITY_INTRINSIC_ASSESSMENT_ASSERTIONS = [
  {
    // The mesoscopic exponent reproduces the imp-3642 measured floor 0.991 at y_star = 4 d (fixed depth k=1).
    id: 'imp3708-emeso-reproduces-imp3642-floor',
    description: 'E_meso = -ln(0.991) reconstructs the imp-3642 mesoscopic Gronwall floor at y_star=4d',
    holds: () =>
      Math.abs(Math.exp(-E_MESO) - IMP3642_MESO_FLOOR) < 1e-12 &&
      Math.abs(fixedDepthFloor(1) - IMP3642_MESO_FLOOR) < 1e-12,
  },
  {
    // Fixed-depth floor collapses monotonically to vacuous at the nearest-pair proxy.
    id: 'imp3708-fixed-depth-floor-collapses',
    description: 'fixed-depth floor > 0.98 at y_star (k=1) but < 1e-8 at the nearest-pair proxy (k=50), monotone',
    holds: () => {
      const monotone = FIXED_DEPTH_TABLE.every(
        (row, i) => i === 0 || row.fixedDepthFloor < FIXED_DEPTH_TABLE[i - 1].fixedDepthFloor,
      );
      return monotone && fixedDepthFloor(1) > 0.98 && fixedDepthFloor(50) < 1e-8;
    },
  },
  {
    // Crossover: vacuity onset (floor = 1/e) at ~0.38 d, numerically vacuous (1e-3) by ~0.145 d.
    id: 'imp3708-crossover-strip-heights',
    description: 'fixed-depth floor hits 1/e at y ~ 0.38 d and 1e-3 at y ~ 0.145 d (whole nearest-pair regime vacuous)',
    holds: () =>
      Math.abs(fixedDepthFloor(K_ONSET) - Math.exp(-1)) < 1e-12 &&
      Y_ONSET_OVER_D > 0.37 &&
      Y_ONSET_OVER_D < 0.39 &&
      Math.abs(fixedDepthFloor(K_VACUOUS) - 1e-3) < 1e-9 &&
      Y_VACUOUS_OVER_D > 0.14 &&
      Y_VACUOUS_OVER_D < 0.15,
  },
  {
    // The y2-adapted-depth escape floor is CONSTANT = 0.991 across the whole ladder (fixed depth is the culprit).
    id: 'imp3708-adapted-depth-floor-constant',
    description: 'the y2-adapted-depth escape floor stays pinned at 0.991 at every strip height (unlike fixed depth)',
    holds: () =>
      FIXED_DEPTH_TABLE.every((row) => Math.abs(row.adaptedDepthFloor - IMP3642_MESO_FLOOR) < 1e-9) &&
      Math.abs(adaptedDepthFloor(50) - adaptedDepthFloor(1)) < 1e-15,
  },
  {
    // Survey verdict: no microscopic reading supplies the y2-adapted depth, so vacuity is intrinsic.
    id: 'imp3708-vacuity-intrinsic-no-reading-escapes',
    description: 'none of the surveyed readings supplies an s(y) ~ y^2 adapted depth; vacuity intrinsic, sub-gap named',
    holds: () =>
      READINGS.length === 3 &&
      READINGS.every((r) => r.y2AdaptedDepth === false) &&
      IMP3708_S2_GRONWALL_VACUITY_INTRINSIC_ASSESSMENT.anyReadingEscapes === false &&
      IMP3708_S2_GRONWALL_VACUITY_INTRINSIC_ASSESSMENT.vacuityIntrinsic === true &&
      /y2-adapted-flow-depth/.test(IMP3708_S2_GRONWALL_VACUITY_INTRINSIC_ASSESSMENT.namedSubGap),
  },
  {
    // Honesty gate: assessment/derivation only, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp3708-honesty-gate-no-qed',
    description: 'Assessment/derivation only: no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP3708_S2_GRONWALL_VACUITY_INTRINSIC_ASSESSMENT.isRigorous === false &&
      /NO QED/.test(IMP3708_S2_GRONWALL_VACUITY_INTRINSIC_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP3708_S2_GRONWALL_VACUITY_INTRINSIC_ASSESSMENT.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3708_S2_GRONWALL_VACUITY_INTRINSIC_ASSESSMENT.verdict),
  },
];

for (const a of IMP3708_S2_GRONWALL_VACUITY_INTRINSIC_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3708-s2-gronwall-vacuity-intrinsic-assessment assertion failed: ${a.id}`);
  }
}
