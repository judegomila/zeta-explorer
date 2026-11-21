/**
 * @module imp-34801-crossover-gpp-cross-band-resolution-matched
 *
 * imp-34801 (accuracy, S-frontier): imp-34777 pinned the cross-band envelope collapse of the
 * inherited imp-33723 surrogate crossover-map second derivative
 * g_double_prime(N) = -4 pi^2 K (u+1)/(T^2 u^3) against the FROZEN imp-34757 published per-band
 * literals as a cheap standing tripwire, at a single fixed 41-point-per-band grid. imp-34768
 * separately checked a 121-point live grid of |g_double_prime| directly. What NEITHER did is a
 * RESOLUTION-MATCHED sweep of the collapse ITSELF: recompute the per-band left-endpoint bound
 * B(band) and the per-band max |g_double_prime| across a LADDER of grid resolutions and ask
 * whether the strictly-descending ladder and the B(1e9) global dominance are a GENUINE property
 * of the map or an artifact of the coarse per-band tabulation. A coarse grid can only ever MISS an
 * interior maximum (never invent one), so if the per-band max were secretly interior the recomputed
 * max would GROW as the grid refines and the ratio B/max would fall below 1; if instead B/max stays
 * pinned at 1.000 as the resolution climbs, the endpoint really is the supremum and the collapse is
 * genuine, not a grid artifact.
 *
 * WHAT THIS ADDS (accuracy assessment, no new mathematics)
 * -------------------------------------------------------
 * Reusing the imp-34731/imp-34757/imp-34777 closed form VERBATIM this module:
 *   (R1) for a ladder of resolutions R in {41, 161, 641, 2561} points per band, live-recomputes
 *        the per-band left-endpoint bound B(band) (resolution-independent, = the k=0 grid point)
 *        and the per-band max |g_double_prime| over that R-point grid, on all three post-peak bands
 *        [1e9,1e10], [1e10,1e11], [1e11,1e12];
 *   (R2) confirms the strictly-descending ladder B(1e9) > B(1e10) > B(1e11) holds at EVERY
 *        resolution and the single leftmost constant B(1e9) dominates the max on EVERY band at
 *        EVERY resolution (the imp-34777 collapse is resolution-robust, not a 41-point accident);
 *   (R3) the ARTIFACT TEST: as R climbs 41 -> 2561 the recomputed per-band max does NOT grow
 *        (max_2561 <= max_41 to floating tolerance) and the ratio B(1e9)/union_max stays = 1.000
 *        at every resolution, so no interior maximum was hiding below the coarse grid -- the
 *        left-endpoint supremum and hence the whole collapse is a genuine property of the map.
 *
 * THE CLOSED FORM (inherited from imp-34731 / imp-34757 / imp-34777, unchanged)
 * ---------------------------------------------------------------------------
 *     g(N) = K log T0(N),   K = (C_C/E_trunc)^2 ~ 1.5727e8,   T = T0(N),   u = log(T/2pi),
 *     g_double_prime(N) = -4 pi^2 K (u+1) / (T^2 u^3).
 * T0 and u both increase in N and the T^2 u^3 denominator outgrows the (u+1) numerator, so
 * |g_double_prime| is strictly decreasing across the whole post-peak ramp; the band supremum is
 * therefore the left-endpoint value at ANY resolution and refining the grid cannot raise it.
 *
 * THE FINDING (accuracy assessment only)
 * --------------------------------------
 *   (R1)/(R2) THE COLLAPSE IS RESOLUTION-ROBUST. At each of the four resolutions 41/161/641/2561
 *        points per band the per-band bounds still descend B(1e9) > B(1e10) > B(1e11) and B(1e9)
 *        still dominates the max on every band -- the imp-34777 verdict was not a coarse-grid
 *        accident.
 *   (R3) NO HIDDEN INTERIOR MAX (NOT AN ARTIFACT). Refining 41 -> 2561 points per band does not
 *        raise the recomputed per-band max (a coarse grid could only have UNDER-estimated it), and
 *        B(1e9)/union_max stays 1.000 at every resolution, so the left-endpoint supremum -- and the
 *        cross-band collapse resting on it -- is a genuine property of the map, not a tabulation
 *        artifact.
 *
 * ACCURACY ASSESSMENT ONLY. This guards the curvature bound of the INHERITED imp-3220/imp-3406
 * surrogate crossover map; it changes NO bound. The C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; establishes no operator positivity; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34777-crossover-gpp-cross-band-envelope-collapse (frozen-literal tripwire at 41 pts/band)
 * @see imp-34768-crossover-gppp-global-envelope (121-point live grid; g_triple_prime > 0)
 * @see imp-34757-crossover-gpp-dense-cross-check (per-band B; monotone within each band)
 * @see imp-34731-crossover-map-second-derivative-bound (g_double_prime closed form; 5-probe check)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const FOUR_PI2 = 4 * Math.PI * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (imp-33723 amplitude)

// CLOSED FORM (inherited imp-34731): |g_double_prime| = 4 pi^2 K (u+1) / (T^2 u^3).
function absSecondDeriv(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (FOUR_PI2 * K_AMPL * (u + 1)) / (T * T * u * u * u);
}

// The three post-peak bands imp-34757/imp-34777 used, forming the union [1e9, 1e12].
const BANDS = [
  [1e9, 1e10],
  [1e10, 1e11],
  [1e11, 1e12],
];

// Resolution ladder: 41 is the imp-34777 grid; each rung roughly quadruples it (up to 2561).
const RESOLUTIONS = [41, 161, 641, 2561];

// Per-band max |g_double_prime| on an R-point log-spaced grid (left endpoint at k=0).
function bandMax(lo, hi, R) {
  let maxAbs = 0;
  for (let k = 0; k < R; k++) {
    const N = lo * Math.pow(hi / lo, k / (R - 1));
    const a = absSecondDeriv(N);
    if (a > maxAbs) maxAbs = a;
  }
  return maxAbs;
}

// (R1) For each resolution recompute per-band B (endpoint) and per-band max on the R-point grid.
const RESOLUTION_ROWS = RESOLUTIONS.map((R) => {
  const bands = BANDS.map(([lo, hi]) => ({
    band: [lo, hi],
    B: absSecondDeriv(lo), // resolution-independent left-endpoint supremum
    maxAbs: bandMax(lo, hi, R),
  }));
  const B_global = bands[0].B; // B(1e9), the candidate single envelope constant
  const unionMax = Math.max(...bands.map((b) => b.maxAbs));
  const DOM_SLACK = 1 + 1e-12;
  const ladderDescending = bands.every((b, i) => i === 0 || b.B < bands[i - 1].B);
  const globalDominatesAll = bands.every((b) => B_global * DOM_SLACK >= b.maxAbs);
  return {
    resolution: R,
    bands,
    B_global,
    unionMax,
    ladderDescending,
    globalDominatesAll,
    globalEnvelopeRatio: B_global / unionMax, // ~1.000
  };
});

// (R2) ladder + dominance hold at EVERY resolution.
const LADDER_AT_ALL_RESOLUTIONS = RESOLUTION_ROWS.every((r) => r.ladderDescending);
const DOMINANCE_AT_ALL_RESOLUTIONS = RESOLUTION_ROWS.every((r) => r.globalDominatesAll);
const RATIO_ONE_AT_ALL_RESOLUTIONS = RESOLUTION_ROWS.every(
  (r) => Math.abs(r.globalEnvelopeRatio - 1) < 1e-9,
);

// (R3) ARTIFACT TEST: refining the grid must not RAISE any per-band max (would reveal a hidden
// interior maximum the coarse grid missed). Compare coarsest (41) vs finest (2561) per band.
const COARSEST = RESOLUTION_ROWS[0];
const FINEST = RESOLUTION_ROWS[RESOLUTION_ROWS.length - 1];
let MAX_REFINEMENT_GROWTH = 0; // max over bands of (max_finest/max_coarsest - 1)
for (let i = 0; i < BANDS.length; i++) {
  const growth = FINEST.bands[i].maxAbs / COARSEST.bands[i].maxAbs - 1;
  if (growth > MAX_REFINEMENT_GROWTH) MAX_REFINEMENT_GROWTH = growth;
}
// A genuine (endpoint) supremum => refinement growth ~ 0 (a few ULP); an artifact => growth > 0.
const NO_HIDDEN_INTERIOR_MAX = MAX_REFINEMENT_GROWTH < 1e-12;

export const IMP34801_CROSSOVER_GPP_CROSS_BAND_RESOLUTION_MATCHED = {
  id: 'imp-34801',
  proofSection: 'S-frontier',
  question:
    'imp-34777 pinned the cross-band envelope collapse of g_double_prime = -4 pi^2 K (u+1)/(T^2 u^3) ' +
    'against the frozen imp-34757 literals at a single 41-point-per-band grid. Recomputing the ' +
    'per-band B(band) and per-band max |g_double_prime| across a resolution ladder 41/161/641/2561 ' +
    'points per band, do the strictly-descending ladder B(1e9) > B(1e10) > B(1e11) and the B(1e9) ' +
    'global dominance survive -- i.e. is the collapse a genuine property or a coarse-grid artifact? ' +
    'Accuracy assessment only; changes no bound; no QED.',
  closedFormSecondDerivative:
    'g_double_prime(N) = -4 pi^2 K (u + 1) / (T^2 u^3),  T = T0(N), u = log(T/2pi), K = (C_C/E_trunc)^2',
  resolutionLadder: RESOLUTIONS,
  resolutions: RESOLUTION_ROWS.map((r) => ({
    points_per_band: r.resolution,
    left_endpoint_bound_B_1e9: +r.B_global.toExponential(6),
    union_max_abs: +r.unionMax.toExponential(6),
    ladder_strictly_descending: r.ladderDescending,
    global_constant_dominates_all_bands: r.globalDominatesAll,
    global_envelope_ratio_B_over_unionMax: +r.globalEnvelopeRatio.toFixed(6), // ~1.000000
    per_band_max_abs: r.bands.map((b) => +b.maxAbs.toExponential(6)),
  })),
  maxRefinementGrowth_41_to_2561: +MAX_REFINEMENT_GROWTH.toExponential(3),
  finding: {
    R1_R2_collapse_is_resolution_robust:
      'At each of the four resolutions 41/161/641/2561 points per band the per-band bounds still ' +
      'descend B(1e9) > B(1e10) > B(1e11) and the single leftmost constant B(1e9) still dominates ' +
      'the max |g_double_prime| on every band -- the imp-34777 collapse was not a 41-point accident.',
    R3_no_hidden_interior_max_not_an_artifact:
      'Refining the grid 41 -> 2561 points per band does NOT raise the recomputed per-band max ' +
      '(max growth ' +
      (+MAX_REFINEMENT_GROWTH.toExponential(3)).toString() +
      '); since a coarse grid can only UNDER-estimate a max, no interior maximum was hiding below ' +
      'the coarse tabulation, and B(1e9)/union_max stays 1.000 at every resolution -- the ' +
      'left-endpoint supremum and hence the whole cross-band collapse is a genuine property of the ' +
      'map, not a coarse-grid artifact.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY ASSESSMENT (frontier-direction). imp-34777 pinned the cross-band envelope collapse of ' +
    'the inherited imp-33723 crossover-map second derivative against the frozen imp-34757 literals ' +
    'at a single 41-point-per-band grid; this module re-runs the collapse under a resolution-matched ' +
    'live recompute across 41/161/641/2561 points per band. The strictly-descending ladder ' +
    'B(1e9) > B(1e10) > B(1e11) and the B(1e9) global dominance hold at EVERY resolution, and ' +
    'refining 41 -> 2561 points per band does not raise any per-band max (max growth < 1e-12) so no ' +
    'interior maximum was hidden below the coarse grid and B(1e9)/union_max stays 1.000 throughout ' +
    '-- the cross-band collapse is a GENUINE property of the map, not a coarse-tabulation artifact. ' +
    'Accuracy assessment only on the INHERITED imp-3220/imp-3406 surrogate map; the C_mb ' +
    'GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes ' +
    'no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34777 (cross-band collapse tripwire vs frozen imp-34757 literals at 41 pts/band); imp-34768 ' +
    '(121-point global grid; g_triple_prime > 0); imp-34757 (per-band B; monotone within each band); ' +
    'imp-34731 (g_double_prime closed form; 5-probe check); lambda-rh-height-mapping ' +
    '(effectiveHeightForN, Riemann-von Mangoldt inverse); imp-2631 (E_trunc fixed-strip route); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34801_CROSSOVER_GPP_CROSS_BAND_RESOLUTION_MATCHED_ASSERTIONS = [
  {
    // (R2): the descending ladder holds at every resolution on the ladder.
    id: 'imp34801-ladder-descends-at-all-resolutions',
    description:
      'B(1e9) > B(1e10) > B(1e11) at every resolution 41/161/641/2561 points per band',
    holds: () => LADDER_AT_ALL_RESOLUTIONS,
  },
  {
    // (R2): the single leftmost constant dominates every band at every resolution; ratio = 1.000.
    id: 'imp34801-global-constant-dominates-at-all-resolutions',
    description:
      'B(1e9) dominates max |g_double_prime| on every band at every resolution and ' +
      'B(1e9)/union_max = 1.000 throughout',
    holds: () => DOMINANCE_AT_ALL_RESOLUTIONS && RATIO_ONE_AT_ALL_RESOLUTIONS,
  },
  {
    // (R3): the artifact test -- refining the grid does not reveal a larger (interior) max.
    id: 'imp34801-no-hidden-interior-max-under-refinement',
    description:
      'refining 41 -> 2561 points per band does not raise any per-band max (growth < 1e-12), so ' +
      'the collapse is genuine, not a coarse-grid artifact',
    holds: () => NO_HIDDEN_INTERIOR_MAX,
  },
  {
    // Honesty gate: accuracy assessment only, no QED, no refereed bound is changed.
    id: 'imp34801-honesty-gate-no-qed',
    description: 'Accuracy assessment only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34801_CROSSOVER_GPP_CROSS_BAND_RESOLUTION_MATCHED.isRigorous === false &&
      /NO QED/.test(IMP34801_CROSSOVER_GPP_CROSS_BAND_RESOLUTION_MATCHED.verdict) &&
      /refereed bound is changed/i.test(IMP34801_CROSSOVER_GPP_CROSS_BAND_RESOLUTION_MATCHED.verdict),
  },
];

for (const a of IMP34801_CROSSOVER_GPP_CROSS_BAND_RESOLUTION_MATCHED_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-34801-crossover-gpp-cross-band-resolution-matched assertion failed: ${a.id}`,
    );
  }
}
