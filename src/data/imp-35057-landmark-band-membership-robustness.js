/**
 * @module imp-35057-landmark-band-membership-robustness
 *
 * imp-35057 (numerical): the imp-35018 cluster module asserts all three point-landmarks
 * (N_half, N_cross, N_star) sit inside the imp-34693 admissible seed band, but its
 * `imp35018-band-contains-all-locators` check tests only the WIDEST tabulated rung, k=10
 * (half-width rho ~ 1.712e8). This module MEASURES how much that "all inside band" conclusion
 * depends on the k=10 choice: it computes each landmark's distance from the band centre N_cross,
 * identifies the binding (furthest) landmark, and finds the tightest imp-34693 rung (smallest k)
 * whose half-width still contains all three.
 *
 * FINDING (fragile: the conclusion lives at the widest rung, with <1/3 of an iterate of slack)
 * ---------------------------------------------------------------------------------------------
 * The band is centred on N_cross ~ 3.280294e9 with closed-form half-width
 *   rho(1, k) = (1 - L)/[(1 - L_c) * L^k],  L = g_prime(1e9) ~ 0.148483,  L_c = g_prime(N_cross) ~ 0.045423,
 * growing by 1/L ~ 6.7348 per Picard iterate (imp-34693). Landmark distances from N_cross:
 *   N_half : |N - N_cross| ~ 1.309e7  (rel ~0.399%)
 *   N_cross: 0                        (the centre)
 *   N_star : |N - N_cross| ~ 9.681e7  (rel ~2.951%)  <- BINDING (furthest)
 * So band membership is set entirely by N_star. The band first covers N_star when
 *   rho(1, k) > 9.681e7  <=>  k > k_star := log[(1 - L)/((1 - L_c) * D_max)] / log(L) ~ 9.7009,
 * i.e. the tightest INTEGER rung containing all three is k = ceil(k_star) = 10 -- the very
 * widest tabulated imp-34693 rung. The next rung down, k = 9 (rho ~ 2.543e7), FAILS: its band
 * stops ~3.8x short of N_star. The k=10 band clears N_star by only rho(1,10)/D_max ~ 1.769x
 * (a slack of 10 - k_star ~ 0.299 of a single Picard iterate).
 *
 * READING: the imp-35018 "all three inside the band" conclusion is NOT robust to the rung choice
 * -- it holds ONLY on the widest tabulated rung and would flip to false at k <= 9. The dependence
 * on the k=10 choice is essentially total: there is no tighter rung that works, and the surviving
 * rung has under a third of an iterate of headroom. This is a direct consequence of N_star sitting
 * ~2.95% out from N_cross while each iterate multiplies the admissible half-width by only ~6.73:
 * covering a ~9.7e7 defect from a k=0 base of ~0.89 needs log_{1/L}(9.7e7/0.89) ~ 9.70 iterates.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map, in IEEE-754 double
 * precision. Every input literal (the three landmark N values, N_cross, L, L_c) is reused VERBATIM
 * from imp-35018 / imp-34693; nothing is recomputed and no bound is changed. Inherits the imp-34693a
 * sub-gap (L, L_c, g are double-precision, defect linearization not interval-enclosed). C_mb
 * GUE-conditional per imp-486; C_C = (1/8) sqrt(3 pi) 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35018-four-landmark-cluster-log-n-viz-data (the cluster + its k=10-only band-membership assertion)
 * @see imp-34693-crossover-contraction-seed-band (the seed-band rung table and rho(tol,k) closed form)
 */

import { IMP35018_ORDERED_LOCATORS } from './imp-35018-four-landmark-cluster-log-n-viz-data.js';
import { IMP34693_CROSSOVER_CONTRACTION_SEED_BAND } from './imp-34693-crossover-contraction-seed-band.js';

const N_CROSS = IMP34693_CROSSOVER_CONTRACTION_SEED_BAND.constants.N_cross; // ~3.280294e9
const L = IMP34693_CROSSOVER_CONTRACTION_SEED_BAND.constants.L_contraction; // ~0.148483
const L_C = IMP34693_CROSSOVER_CONTRACTION_SEED_BAND.constants.L_at_cross; // ~0.045423

// imp-34693 closed-form admissible seed half-width at tol=1: rho(1,k) = (1 - L)/[(1 - L_c) L^k].
const rho = (k) => (1 - L) / ((1 - L_C) * Math.pow(L, k));

// Distance of each landmark from the band centre N_cross (the band is symmetric about N_cross).
const LANDMARK_DISTANCES = IMP35018_ORDERED_LOCATORS.map((loc) => ({
  key: loc.key,
  N: loc.N,
  distFromNcross: Math.abs(loc.N - N_CROSS),
  relFromNcross: +(Math.abs(loc.N - N_CROSS) / N_CROSS).toExponential(4),
}));

// The furthest landmark sets band membership (the binding constraint).
const BINDING = LANDMARK_DISTANCES.reduce((a, b) => (b.distFromNcross > a.distFromNcross ? b : a));
const D_MAX = BINDING.distFromNcross;

// The tabulated imp-34693 rungs, and whether each contains ALL three landmarks.
const RUNG_GRID = IMP34693_CROSSOVER_CONTRACTION_SEED_BAND.seedBandTable.map((r) => r.k);
const RUNG_MEMBERSHIP = RUNG_GRID.map((k) => ({
  k,
  rho: +rho(k).toExponential(4),
  containsAllLandmarks: rho(k) > D_MAX,
}));

// Tightest tabulated rung (smallest tabulated k) whose band still contains all three landmarks.
const TIGHTEST_TABULATED_RUNG = RUNG_GRID.find((k) => rho(k) > D_MAX);
// Continuous and minimal-integer rung: rho(1,k) > D_max <=> k > log[(1-L)/((1-L_c)D_max)]/log(L).
const K_STAR_CONTINUOUS = Math.log((1 - L) / ((1 - L_C) * D_MAX)) / Math.log(L);
const K_MIN_INTEGER = Math.ceil(K_STAR_CONTINUOUS);
// How much the k=10 conclusion depends on the widest-rung choice.
const K10_SLACK_RATIO = rho(10) / D_MAX; // >1 means the k=10 band clears the binding landmark
const ITERATE_HEADROOM = 10 - K_STAR_CONTINUOUS; // fraction of one Picard iterate of slack at k=10
const K9_RHO = rho(9); // the next rung down (must FAIL to contain N_star)

export const IMP35057_LANDMARK_BAND_MEMBERSHIP_ROBUSTNESS = {
  id: 'imp-35057',
  proofSection: 'S-frontier',
  question:
    'imp-35018 asserts the three point-landmarks (N_half/N_cross/N_star) all sit inside the imp-34693 ' +
    'admissible seed band, but its band-contains-all-locators check uses only the WIDEST k=10 rung ' +
    '(half-width ~1.712e8). How tight can the imp-34693 rung be (smallest k) while still containing all ' +
    'three, and how much does the "all inside band" conclusion depend on the k=10 choice?',
  bandCentre_N_cross: N_CROSS,
  L,
  L_c: L_C,
  landmarkDistances: LANDMARK_DISTANCES,
  bindingLandmark: BINDING.key, // N_star (furthest from N_cross, ~2.95%)
  bindingDistance: +D_MAX.toExponential(4),
  rungMembership: RUNG_MEMBERSHIP,
  tightestTabulatedRung: TIGHTEST_TABULATED_RUNG, // 10 -- the widest tabulated rung
  kStarContinuous: +K_STAR_CONTINUOUS.toExponential(6), // ~9.7009
  kMinInteger: K_MIN_INTEGER, // 10
  k10SlackRatio: +K10_SLACK_RATIO.toExponential(4), // ~1.769
  iterateHeadroomAtK10: +ITERATE_HEADROOM.toExponential(4), // ~0.2991 of one iterate
  k9Rho: +K9_RHO.toExponential(4), // ~2.543e7 (fails: < D_max ~ 9.681e7)
  isRigorous: false,
  finding:
    'Band membership is set entirely by N_star, which sits ~2.951% (~9.681e7) out from the band centre ' +
    'N_cross while N_half is only ~0.399% (~1.309e7) out. Since the imp-34693 half-width grows by only ' +
    '1/L ~ 6.7348 per Picard iterate from a k=0 base of ~0.89, covering N_star needs k_star ~ 9.7009 ' +
    'iterates, so the tightest INTEGER rung containing all three is k = 10 -- exactly the widest tabulated ' +
    'rung imp-35018 already uses. The next rung down, k = 9 (rho ~ 2.543e7), stops ~3.8x short of N_star. ' +
    'The k=10 band clears N_star by only ~1.769x (~0.2991 of a single iterate of slack). So the imp-35018 ' +
    '"all three inside the band" conclusion is NOT robust to the rung choice: it holds only on the widest ' +
    'rung and would flip to false at any k <= 9.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT an RH bound). The imp-35018 band-contains-all-locators ' +
    'assertion is maximally rung-dependent: the tightest imp-34693 rung whose admissible seed half-width ' +
    'rho(1,k) = (1-L)/[(1-L_c)L^k] still contains all three landmarks is k = ceil(9.7009) = 10, i.e. the ' +
    'widest tabulated rung, and the binding landmark N_star (~2.951% out from N_cross) leaves only ~0.299 ' +
    'of a Picard iterate of headroom (a ~1.769x half-width margin); one rung tighter (k=9) fails by ~3.8x. ' +
    'Reuses the imp-35018 landmark literals and imp-34693 rho(tol,k) closed form VERBATIM; inherits the ' +
    'imp-34693a double-precision / non-interval-enclosed sub-gap. C_mb GUE-conditional per imp-486 and the ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35018 (four-landmark cluster + k=10-only band-membership assertion); imp-34693 (seed-band rung ' +
    'table, rho(tol,k) = tol*(1-L)/[(1-L_c)L^k]); imp-33723 (N_cross closed form); imp-33582 (N_half); ' +
    'imp-33721 (N_star inflection knee); imp-486 (C_mb GUE-conditional).',
};

export const IMP35057_LANDMARK_BAND_MEMBERSHIP_ROBUSTNESS_ASSERTIONS = [
  {
    id: 'imp35057-binding-landmark-is-N-star',
    description: 'the furthest landmark from N_cross (the band-membership constraint) is N_star, ~2.95% out',
    holds: () => BINDING.key === 'N_star' && Math.abs(BINDING.relFromNcross - 0.02951) < 1e-4,
  },
  {
    id: 'imp35057-tightest-rung-is-k10',
    description: 'the tightest TABULATED imp-34693 rung containing all three landmarks is k=10, the widest rung',
    holds: () => TIGHTEST_TABULATED_RUNG === 10 && RUNG_GRID[RUNG_GRID.length - 1] === 10,
  },
  {
    id: 'imp35057-min-integer-rung-is-10',
    description: 'continuous k_star ~ 9.70, so the minimal integer rung containing all three is 10',
    holds: () =>
      Math.abs(K_STAR_CONTINUOUS - 9.700943) < 1e-3 && K_MIN_INTEGER === 10,
  },
  {
    id: 'imp35057-k9-rung-fails',
    description: 'the next rung down (k=9) does NOT contain N_star: rho(1,9) ~ 2.54e7 < D_max ~ 9.68e7',
    holds: () => K9_RHO < D_MAX && rho(9) > D_MAX / 5,
  },
  {
    id: 'imp35057-k10-membership-is-fragile',
    description: 'the k=10 band clears N_star by only ~1.77x (~0.30 of one iterate of slack): conclusion is fragile',
    holds: () =>
      K10_SLACK_RATIO > 1 &&
      K10_SLACK_RATIO < 2 &&
      ITERATE_HEADROOM > 0 &&
      ITERATE_HEADROOM < 0.5,
  },
  {
    id: 'imp35057-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35057_LANDMARK_BAND_MEMBERSHIP_ROBUSTNESS.isRigorous === false &&
      /NO QED/.test(IMP35057_LANDMARK_BAND_MEMBERSHIP_ROBUSTNESS.verdict) &&
      /refereed bound is changed/i.test(IMP35057_LANDMARK_BAND_MEMBERSHIP_ROBUSTNESS.verdict),
  },
];

for (const a of IMP35057_LANDMARK_BAND_MEMBERSHIP_ROBUSTNESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35057-landmark-band-membership-robustness assertion failed: ${a.id}`);
  }
}
