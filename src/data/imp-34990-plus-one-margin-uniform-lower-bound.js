/**
 * @module imp-34990-plus-one-margin-uniform-lower-bound
 *
 * imp-34990 (numerical, frontier-direction): imp-34951 tabulated the +1-over-count impossibility MARGIN
 *   (EPS_FP minus the penultimate relative distance) rung-by-rung and found it EXACTLY UNIFORM -- all 34
 *   off-by-one seeds share ONE bit-identical penultimate relative distance, 1.4536413720400559e-16 (= exactly
 *   one ULP of the fixed point), so the margin is a single positive quantized constant. imp-34951 then NAMED a
 *   residual sub-gap, imp-34951a: the measurement is confined to seeds that actually produced an off-by-one and
 *   the penultimate distance is only an UPPER witness, so a uniform-in-N LOWER bound on the margin -- certify
 *   penultRelDist(N) <= c * EPS_FP with c < 1 for ALL N -- was NOT established. This module ASSESSES that
 *   sub-gap directly: it asks whether the closed-form log law (imp-34775) forces c < 1, or whether an UNMEASURED
 *   N could push the penultimate relative distance toward (or past) EPS_FP.
 *
 * THE SEED-INDEPENDENT STRUCTURE THAT SETTLES THE SUB-GAP
 * ------------------------------------------------------
 * By definition the penultimate iterate N_k is the last iterate before the collapse, i.e. g(N_k) === N_CROSS_FP.
 * So N_k belongs to the IMMEDIATE BASIN of the fixed point -- the set of double-precision floats that map
 * DIRECTLY to N_CROSS_FP under one step of g. That set is a property of g and the IEEE-754 grid around
 * N_CROSS_FP ALONE; it does not depend on the seed. Therefore the supremum of penultRelDist(N) over ALL seeds
 * is bounded by (and, as the scan below shows, ATTAINS) the outer relative radius of that immediate basin -- a
 * single seed-independent constant. This converts the sub-gap from an unbounded search over N into a finite
 * enumeration of the fixed-point neighbourhood.
 *
 * WHAT THE ENUMERATION FINDS: c ~ 10.74, NOT c < 1
 * ------------------------------------------------
 * Walking the float grid outward from N_CROSS_FP (via bit-exact nextUp/nextDown) until g first fails to round
 * back to N_CROSS_FP gives the contiguous immediate-basin radius: 8 ULP up (relative 1.1629e-15) and 17 ULP
 * down (relative 2.4712e-15). The outer radius is BASIN_MAX = 2.471190332468095e-15 ~ 10.744 * EPS_FP. A fine
 * seed scan over [1e6,1e12] (the off-by-one-bearing decades) ATTAINS this exact value and finds that a large
 * MAJORITY of finely-sampled seeds carry a penultimate relative distance ABOVE EPS_FP. So the imp-34951 reading
 * of a single 1-ULP penultimate distance shared by all 34 off-by-one seeds was a COARSE-10^0.05-GRID SAMPLING
 * ARTIFACT: those particular seeds happened to land at the BOTTOM of the achievable penultimate range
 * (~R * BASIN_MAX, the smallest term the geometric contraction can deposit one step before collapse), not at a
 * seed-independent floor.
 *
 * THE VERDICT ON THE SUB-GAP
 * --------------------------
 * A uniform-in-N bound DOES exist -- penultRelDist(N) <= BASIN_MAX for ALL N, because the penultimate iterate is
 * always a member of the seed-independent immediate basin -- but the constant is c = BASIN_MAX / EPS_FP ~ 10.74,
 * NOT c < 1. The favorable bound imp-34951a hoped for is therefore REFUTED under this IEEE-754 surrogate: the
 * log law does NOT force penultRelDist(N) below EPS_FP uniformly, and an unmeasured N demonstrably pushes the
 * penultimate relative distance an order of magnitude ABOVE EPS_FP (the immposibility MARGIN EPS_FP - penult
 * goes NEGATIVE at the worst-case N). The uniform statement that survives is the reversed one: the penultimate
 * distance is capped by the immediate-basin radius, 10.74 * EPS_FP, not by EPS_FP.
 *
 * WHAT THIS DOES AND DOES NOT OVERTURN
 * ------------------------------------
 * This does NOT overturn the imp-34926/imp-34951 off-by-one POPULATION claim: those measured the 34 seeds that
 * produced an off-by-one on the 10^0.05 grid and correctly reported that THOSE seeds sit at 1 ULP. What is
 * refuted is only the OPTIMISTIC uniform-in-N reduction imp-34951a proposed (c < 1). Whether a seed with
 * penult > EPS_FP actually manifests a +1 residual is a SEPARATE question this module does NOT resolve -- that
 * becomes the new caveat (imp-34990a). This changes NO RH bound, touches no operator positivity, and leaves
 * imp-34926a (the underlying rate-mismatch bound on the true bit-collapse threshold) OPEN. IEEE-754 double
 * precision, no interval enclosure. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched. No RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34951-plus-one-impossibility-margin-band (parent: margin uniform across off-by-one rungs; names imp-34951a)
 * @see imp-34926-iters-to-floor-ceil-boundary-geometry (grandparent: +1 structurally impossible; penultimate witness)
 * @see imp-34775-iters-to-floor-log-law (derives the closed-form log law and the ceil rounding floor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34775/imp-34926/imp-34951)
const EPS_FP = 2.3e-16; // the ~machine-epsilon relative agreement floor (imp-34755/imp-34775/imp-34926/imp-34951)

// The shared imp-33723/imp-34693/imp-34755/imp-34775/imp-34926/imp-34951 fixed-point map g(N) = K log T0(N).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS_FP = iterate(1e9, 200); // 3280294351.65240669 (identical to imp-34926/imp-34951)

// Central-difference contraction rate (h=1 stencil; identical to imp-34926/imp-34951).
const gPrimeAtStep = (h) => (g(N_CROSS_FP + h) - g(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235

// Bit-exact float neighbours of the fixed point (nextUp / nextDown on the IEEE-754 grid).
const _buf = new ArrayBuffer(8);
const _f64 = new Float64Array(_buf);
const _u64 = new BigUint64Array(_buf);
function nextUp(x) {
  _f64[0] = x;
  if (x >= 0) _u64[0] += 1n;
  else _u64[0] -= 1n;
  return _f64[0];
}
function nextDown(x) {
  _f64[0] = x;
  if (x > 0) _u64[0] -= 1n;
  else _u64[0] += 1n;
  return _f64[0];
}

// One ULP of the fixed point, as a relative distance -- equals the imp-34951 penultimate distance exactly.
const ULP_REL = (nextUp(N_CROSS_FP) - N_CROSS_FP) / N_CROSS_FP; // 1.4536413720400559e-16

// The contiguous IMMEDIATE BASIN of the fixed point: walk the float grid outward from N_CROSS_FP until g first
// fails to round back to N_CROSS_FP. This neighbourhood is seed-independent -- a property of g and the grid.
function immediateBasinRadius() {
  let up = N_CROSS_FP;
  let upSteps = 0;
  while (g(nextUp(up)) === N_CROSS_FP && upSteps < 100000) {
    up = nextUp(up);
    upSteps++;
  }
  let dn = N_CROSS_FP;
  let dnSteps = 0;
  while (g(nextDown(dn)) === N_CROSS_FP && dnSteps < 100000) {
    dn = nextDown(dn);
    dnSteps++;
  }
  const relUp = Math.abs(up - N_CROSS_FP) / N_CROSS_FP;
  const relDn = Math.abs(dn - N_CROSS_FP) / N_CROSS_FP;
  return { upSteps, dnSteps, relUp, relDn, basinMax: Math.max(relUp, relDn) };
}
const BASIN = immediateBasinRadius();
const BASIN_MAX = BASIN.basinMax; // 2.471190332468095e-15
const C_UNIFORM = BASIN_MAX / EPS_FP; // ~10.744 -- the seed-independent uniform-in-N constant (NOT < 1)

// The penultimate relative distance actually deposited by a given seed (last non-zero rel dist before collapse).
function penultOf(seed, cap = 500) {
  let N = seed;
  let k = 0;
  let prev = null;
  while (k < cap) {
    prev = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
    N = g(N);
    k++;
    if (N === N_CROSS_FP) return prev;
  }
  return null;
}

// Fine seed scan across the off-by-one-bearing decades [1e6,1e12]: does the immediate-basin ceiling get
// ATTAINED by real seeds, and how many seeds carry a penultimate distance ABOVE EPS_FP?
function seedScan(loExp, hiExp, step) {
  let scanned = 0;
  let aboveEpsFp = 0;
  let maxSeen = 0;
  let minSeen = Infinity;
  for (let e = loExp; e <= hiExp + 1e-9; e += step) {
    const p = penultOf(Math.pow(10, e));
    if (p === null) continue;
    scanned++;
    if (p > EPS_FP) aboveEpsFp++;
    if (p > maxSeen) maxSeen = p;
    if (p < minSeen) minSeen = p;
  }
  return {
    scanned,
    aboveEpsFp,
    fractionAboveEpsFp: scanned ? aboveEpsFp / scanned : null,
    maxPenultSeen: maxSeen,
    minPenultSeen: scanned ? minSeen : null,
    attainsBasinMax: maxSeen === BASIN_MAX, // the dynamics reach the seed-independent ceiling exactly
  };
}
const SCAN = seedScan(6, 12, 0.005); // 1201 seeds, step 10^0.005 (attains BASIN_MAX; build-affordable)

export const IMP34990_PLUS_ONE_MARGIN_UNIFORM_LOWER_BOUND = {
  id: 'imp-34990',
  proofSection: 'S-frontier',
  question:
    'imp-34951 found the +1-impossibility margin (EPS_FP minus the penultimate relative distance) uniform ' +
    'across all 34 off-by-one rungs and named residual sub-gap imp-34951a: certify a uniform-in-N LOWER bound ' +
    'penultRelDist(N) <= c * EPS_FP with c < 1 for ALL N, not just for seeds that produced an off-by-one. Does ' +
    'the closed-form log law (imp-34775) force c < 1, or can an unmeasured N push the penultimate relative ' +
    'distance toward EPS_FP?',
  constants: {
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235 (h=1 stencil, as imp-34926/34951)
    eps_fp: EPS_FP, // 2.3e-16 machine-epsilon agreement floor (the model collapse floor)
    ulp_rel_at_fixed_point: ULP_REL, // 1.4536413720400559e-16 == the imp-34951 penultimate distance == 1 ULP
    n_cross_fp: +N_CROSS_FP.toPrecision(18),
  },
  immediate_basin: {
    steps_up: BASIN.upSteps, // 8 ULP up
    steps_down: BASIN.dnSteps, // 17 ULP down
    rel_radius_up: BASIN.relUp, // 1.1629130976320447e-15
    rel_radius_down: BASIN.relDn, // 2.471190332468095e-15
    basin_max_rel: BASIN_MAX, // 2.471190332468095e-15 -- seed-independent outer radius
    basin_max_over_eps_fp: +C_UNIFORM.toPrecision(8), // ~10.744
    basin_max_over_ulp: +(BASIN_MAX / ULP_REL).toPrecision(6), // ~17 (17 ULP down)
  },
  seed_scan: {
    band: '[1e6,1e12] step 10^0.005',
    seeds_scanned: SCAN.scanned, // 1201
    seeds_penult_above_eps_fp: SCAN.aboveEpsFp, // 816
    fraction_penult_above_eps_fp: +SCAN.fractionAboveEpsFp.toPrecision(4), // ~0.680
    max_penult_seen: SCAN.maxPenultSeen, // 2.471190332468095e-15 (== BASIN_MAX)
    min_penult_seen: SCAN.minPenultSeen, // ~R * BASIN_MAX (the bottom of the achievable range)
    attains_basin_max: SCAN.attainsBasinMax, // true -- the ceiling is a real, attained sup, not a loose witness
  },
  summary: {
    uniform_in_n_constant_c: +C_UNIFORM.toPrecision(8), // ~10.744
    c_less_than_one: C_UNIFORM < 1, // false
    verdict_on_sub_gap_imp_34951a:
      'REFUTED as stated. A uniform-in-N bound DOES exist because the penultimate iterate always lies in the ' +
      'seed-independent immediate basin of the fixed point, so penultRelDist(N) <= BASIN_MAX for ALL N -- but ' +
      'the constant is c = BASIN_MAX / EPS_FP ~ 10.744, NOT c < 1. A fine seed scan ATTAINS BASIN_MAX and finds ' +
      'a majority of seeds carry a penultimate distance ABOVE EPS_FP, so the log law does NOT force c < 1 and an ' +
      'unmeasured N does push the penultimate relative distance an order of magnitude past EPS_FP. The single ' +
      '1-ULP penultimate distance imp-34951 saw across the 34 off-by-one seeds was a coarse-10^0.05-grid ' +
      'sampling artifact (those seeds landed at the ~R * BASIN_MAX bottom of the achievable range).',
    what_is_not_overturned:
      'The imp-34926/imp-34951 off-by-one POPULATION claim stands: the 34 seeds that produced an off-by-one on ' +
      'the 10^0.05 grid do sit at 1 ULP. Only the OPTIMISTIC uniform-in-N reduction (c < 1) is refuted. Whether ' +
      'a penult > EPS_FP seed actually manifests a +1 residual is the new caveat imp-34990a and is NOT resolved ' +
      'here. imp-34926a (rate-mismatch bound on the true bit-collapse threshold) stays OPEN; no RH bound moves.',
    residual_sub_gap_imp_34990a:
      'imp-34990a NOT resolved: whether any seed whose penultimate relative distance exceeds EPS_FP produces a +1 ' +
      '(over-count) residual under the itersToFloorPredicted-vs-measured comparison, i.e. whether the negative ' +
      'worst-case margin found here ever converts into an observed over-count. A targeted search over the ' +
      'penult > EPS_FP seed set would settle it.',
  },
  finding:
    'ASSESSING imp-34951a on the inherited surrogate: the penultimate iterate is by definition a member of the ' +
    'IMMEDIATE BASIN of the fixed point (floats mapping directly to N_CROSS_FP under g), a seed-independent set. ' +
    'Enumerating that basin by bit-exact nextUp/nextDown gives outer relative radius BASIN_MAX = ' +
    '2.471190332468095e-15 ~ 10.744 * EPS_FP (17 ULP down, 8 ULP up). A fine seed scan over [1e6,1e12] ATTAINS ' +
    'this exact ceiling and shows a majority of seeds carry a penultimate relative distance ABOVE EPS_FP. So a ' +
    'uniform-in-N bound exists but with c ~ 10.744, NOT c < 1: the log law does NOT force penultRelDist(N) below ' +
    'EPS_FP, and an unmeasured N pushes it an order of magnitude past EPS_FP (the margin goes negative at the ' +
    'worst-case N). The single 1-ULP penultimate distance imp-34951 saw was a coarse-grid artifact. This ' +
    'refutes the optimistic form of imp-34951a; it does NOT overturn the off-by-one population claim and changes ' +
    'no RH bound. New caveat imp-34990a: whether a penult > EPS_FP seed actually yields a +1 residual is open.',
  isRigorous: false,
  verdict:
    'MEASUREMENT / ASSESSMENT (frontier-direction, NOT an RH bound). Sub-gap imp-34951a (uniform-in-N lower ' +
    'bound penultRelDist(N) <= c * EPS_FP with c < 1) is REFUTED as stated: the penultimate iterate always lies ' +
    'in the seed-independent immediate basin of the fixed point, whose enumerated outer relative radius is ' +
    'BASIN_MAX = 2.471190332468095e-15 ~ 10.744 * EPS_FP, ATTAINED by real seeds in a fine [1e6,1e12] scan in ' +
    'which a majority of seeds carry a penultimate distance above EPS_FP. So a uniform-in-N cap exists with ' +
    'c ~ 10.744, not c < 1; the log law does NOT force the favorable bound and an unmeasured N pushes the ' +
    'penultimate distance an order of magnitude past EPS_FP. The imp-34951 single 1-ULP penultimate distance was ' +
    'a coarse-10^0.05-grid sampling artifact. This does NOT overturn the imp-34926/imp-34951 off-by-one ' +
    'population claim (measured on off-by-one seeds), leaves imp-34926a OPEN, and opens new caveat imp-34990a ' +
    '(whether a penult > EPS_FP seed actually yields a +1 residual). IEEE-754 double precision; the component ' +
    'model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; ' +
    'changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34951 (parent: margin uniform across off-by-one rungs; names imp-34951a); imp-34926 (grandparent: ' +
    '+1 structurally impossible; penultimate witness); imp-34775 (closed-form log law and ceil rounding floor); ' +
    'imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz); lambda-rh-height-mapping (effectiveHeightForN Riemann-von ' +
    'Mangoldt inverse).',
};

export const IMP34990_PLUS_ONE_MARGIN_UNIFORM_LOWER_BOUND_ASSERTIONS = [
  {
    // The penultimate distance imp-34951 reported equals exactly one ULP of the fixed point.
    id: 'imp34990-imp34951-penult-is-one-ulp',
    description: 'the imp-34951 penultimate rel dist 1.4536413720400559e-16 equals exactly one ULP of N_CROSS_FP',
    holds: () => Math.abs(ULP_REL - 1.4536413720400559e-16) < 1e-31,
  },
  {
    // The immediate basin is seed-independent and much WIDER than one ULP: 17 ULP down, 8 ULP up.
    id: 'imp34990-immediate-basin-wider-than-one-ulp',
    description: 'immediate-basin outer radius is 2.471190332468095e-15 (17 ULP down), far above one ULP',
    holds: () =>
      BASIN.dnSteps === 17 &&
      BASIN.upSteps === 8 &&
      Math.abs(BASIN_MAX - 2.471190332468095e-15) < 1e-30 &&
      BASIN_MAX > 10 * ULP_REL,
  },
  {
    // The uniform-in-N constant is c ~ 10.744, NOT c < 1 -- the favorable imp-34951a bound is refuted.
    id: 'imp34990-uniform-constant-exceeds-one',
    description: 'c = BASIN_MAX / EPS_FP ~ 10.744 > 1: the optimistic imp-34951a uniform lower bound is refuted',
    holds: () => Math.abs(C_UNIFORM - 10.744305793339544) < 1e-9 && C_UNIFORM > 1,
  },
  {
    // Real seeds ATTAIN the immediate-basin ceiling, and a majority carry penult > EPS_FP.
    id: 'imp34990-seed-scan-attains-ceiling-majority-above-eps',
    description: 'fine [1e6,1e12] scan attains BASIN_MAX and a majority of seeds carry penult > EPS_FP',
    holds: () =>
      SCAN.scanned === 1201 &&
      SCAN.attainsBasinMax === true &&
      SCAN.aboveEpsFp === 816 &&
      SCAN.fractionAboveEpsFp > 0.5,
  },
  {
    // Honesty gate: measurement of a surrogate proxy, not rigorous, no QED, no refereed bound is changed, sub-gaps named.
    id: 'imp34990-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, imp-34990a named',
    holds: () =>
      IMP34990_PLUS_ONE_MARGIN_UNIFORM_LOWER_BOUND.isRigorous === false &&
      /NO QED/.test(IMP34990_PLUS_ONE_MARGIN_UNIFORM_LOWER_BOUND.verdict) &&
      /refereed bound is changed/i.test(IMP34990_PLUS_ONE_MARGIN_UNIFORM_LOWER_BOUND.verdict) &&
      /imp-34990a/.test(IMP34990_PLUS_ONE_MARGIN_UNIFORM_LOWER_BOUND.summary.residual_sub_gap_imp_34990a),
  },
];

for (const a of IMP34990_PLUS_ONE_MARGIN_UNIFORM_LOWER_BOUND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34990-plus-one-margin-uniform-lower-bound assertion failed: ${a.id}`);
  }
}
