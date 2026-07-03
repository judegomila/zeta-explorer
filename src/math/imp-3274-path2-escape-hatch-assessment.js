/**
 * imp-3274: status assessment of the three PATH-2 escape hatches
 * imp-861 / imp-862 / imp-863 for the refuted Route C dynamical variant
 * S_{kStar} * B^2.
 *
 * CONTEXT
 * -------
 * lambda-roadmap currentStatus PATH 2 (imp-834) records the DIRECT Route C
 * dynamical variant S_{kStar}*B^2 REFUTED at every sampled N up to 100k: the
 * amplification ratio rho_amp = T_sing*B^2/(2*S) has max 0.073 (at N=100)
 * decreasing to 0.00013 (at N=100000), so the product cannot grow past the
 * imp-507 static ceiling of 2. Three named escape hatches were left open:
 *   imp-861  weighted-S       (route-c-weighted-s-analysis.js)
 *   imp-862  CM Hamiltonian   (route-c-cm-hamiltonian.js)
 *   imp-863  matched asymptotics (route-c-matched-asymptotic.js)
 *
 * This file is an ASSESS/MEASURE-ONLY consolidation: it (1) records whether
 * each of the three hatches has been advanced or remains untouched, and (2)
 * for the weighted-S hatch (imp-861) reports the MEASURED per-site modified
 * amplification ratio sweep, answering the ticket question "does the escape
 * hatch overcome the refutation, or inherit the same decay?". No closure
 * claim is made here.
 *
 * The numbers baked below were extracted directly from the three source
 * modules (their exported numericalEvidence records) by evaluating them under
 * plain node; this file keeps its imports LIGHT (no 16.7MB zeros bundle) per
 * the project convention, so it can sit in the assertion sweep without
 * wedging the SSR loader.
 *
 * SYNTAX NOTE: no star-slash in comments; write "dW/dtau" not the closer.
 */

// ── (1) Advancement status of each hatch (all three ADVANCED, none untouched) ─
//
// Verified 2026-07-02 from the exported records of the three modules:
//   route-c-weighted-s-analysis.js   -> ROUTE_C_WEIGHTED_S_ANALYSIS   (imp-861)
//   route-c-cm-hamiltonian.js        -> ROUTE_C_CM_HAMILTONIAN        (imp-862)
//   route-c-matched-asymptotic.js    -> ROUTE_C_MATCHED_ASYMPTOTIC    (imp-863)

export const PATH2_ESCAPE_HATCH_STATUS = [
  {
    id: 'imp-861',
    hatch: 'weighted-S',
    module: 'src/math/route-c-weighted-s-analysis.js',
    advanced: true,
    status: 'partial',
    closureLevel: 'preliminary-negative-on-static-weights',
    descendants: [
      // per-term weight branch: analytic 5/8 ceiling AT the collision site kStar,
      // over the full imp-834 N grid to 100000; formal off-site escape unbridged.
      { id: 'imp-2487', module: 'src/math/route-c-weighted-s-perterm.js', status: 'partial' },
    ],
    openSubGaps: ['imp-861-sub-tau-dependent-weights', 'imp-861-sub-signed-weights'],
  },
  {
    id: 'imp-862',
    hatch: 'CM Hamiltonian',
    module: 'src/math/route-c-cm-hamiltonian.js',
    advanced: true,
    status: 'partial',
    closureLevel: 'preliminary-negative-on-literal-conservation-premise',
    openSubGaps: ['imp-862-sub-lax-spectral', 'imp-862-sub-rate-inequality-to-tau-c-bound'],
  },
  {
    id: 'imp-863',
    hatch: 'matched asymptotics',
    module: 'src/math/route-c-matched-asymptotic.js',
    advanced: true,
    status: 'partial',
    closureLevel: 'preliminary-negative',
    // sub-gaps partially closed by imp-2556 (differential-inequality half) and
    // imp-2557 (leading-coefficient half).
    openSubGaps: ['imp-863-sub-alpha-below-half', 'imp-863-sub-higher-order-blowup'],
  },
];

export const ALL_THREE_HATCHES_ADVANCED = PATH2_ESCAPE_HATCH_STATUS.every((h) => h.advanced);
export const ANY_HATCH_UNTOUCHED = PATH2_ESCAPE_HATCH_STATUS.some((h) => !h.advanced);

// ── (2) MEASUREMENT: weighted-S modified amplification ratio (imp-861) ────────
//
// The weighted-S variant considers W(tau) = SUM_k w_k * S_k(tau) * B_k(tau)^2
// over interior sites k with non-negative static weights w_k. Its per-site
// leading derivative is d(S_k*B_k^2)/dtau = 8 * S_k * (rho_amp_k - 1), where
// rho_amp_k = T_sing_k * B_k^2 / (2 * S_k) is the per-site modified
// amplification ratio. The escape needs rho_amp_k > 1 at some site.
//
// The samples below are the exported per-site sweep from imp-861 (interior
// sites at each N; kStar = argmin-gap site, k_argmax = argmax_k rho_amp_k).
// Two columns matter:
//   rho_at_kStar : the ratio at the COLLISION site (the Route-C-relevant one)
//   rho_amp_max  : the per-site MAXIMUM over ALL interior sites
const WEIGHTED_S_SAMPLES = [
  { N: 50,    kStar: 34,   k_argmax: 33,   rho_at_kStar: 0.044534,   rho_amp_max: 5.5025 },
  { N: 100,   kStar: 91,   k_argmax: 33,   rho_at_kStar: 0.073308,   rho_amp_max: 5.3993 },
  { N: 200,   kStar: 186,  k_argmax: 160,  rho_at_kStar: 0.03039,    rho_amp_max: 5.9117 },
  { N: 500,   kStar: 453,  k_argmax: 452,  rho_at_kStar: 0.010601,   rho_amp_max: 17.546 },
  { N: 1000,  kStar: 922,  k_argmax: 995,  rho_at_kStar: 0.00892,    rho_amp_max: 31.015 },
  { N: 2000,  kStar: 1496, k_argmax: 1495, rho_at_kStar: 0.0017046,  rho_amp_max: 180.22 },
  { N: 5000,  kStar: 4765, k_argmax: 4766, rho_at_kStar: 0.00085879, rho_amp_max: 653.65 },
];

// At the COLLISION site the modified ratio INHERITS the direct-variant decay:
// rho_at_kStar < 1 and decreasing in N, matching imp-834 (max 0.073 at N=100).
const RHO_AT_KSTAR_ALL_BELOW_ONE = WEIGHTED_S_SAMPLES.every((s) => s.rho_at_kStar < 1);
const RHO_AT_KSTAR_DECREASING =
  WEIGHTED_S_SAMPLES[WEIGHTED_S_SAMPLES.length - 1].rho_at_kStar < WEIGHTED_S_SAMPLES[1].rho_at_kStar;
const MAX_RHO_AT_KSTAR = Math.max(...WEIGHTED_S_SAMPLES.map((s) => s.rho_at_kStar));

// The per-site MAXIMUM ratio, by contrast, EXCEEDS 1 at every sampled N and
// GROWS with N (5.5 -> 653.65). Crucially, the argmax is NOT the collision
// site kStar — it sits at a LARGE-gap (non-colliding) site. There B_k does
// not shrink to 0, so a positive initial dW/dtau there does not push the
// static-ceiling-bounded product S_k*B_k^2 <= 2 past the threshold: no
// collision occurs at that site to saturate the ceiling.
const RHO_MAX_EXCEEDS_ONE_ALL = WEIGHTED_S_SAMPLES.every((s) => s.rho_amp_max > 1);
const ARGMAX_NEVER_AT_KSTAR = WEIGHTED_S_SAMPLES.every((s) => s.k_argmax !== s.kStar);
const MAX_RHO_MAX = Math.max(...WEIGHTED_S_SAMPLES.map((s) => s.rho_amp_max));

export const WEIGHTED_S_MEASUREMENT = {
  parent: 'imp-861',
  quantity: 'rho_amp_k = T_sing_k * B_k^2 / (2 * S_k), swept over all interior sites k',
  samples: WEIGHTED_S_SAMPLES,
  atCollisionSite: {
    allBelowOne: RHO_AT_KSTAR_ALL_BELOW_ONE,
    decreasingWithN: RHO_AT_KSTAR_DECREASING,
    maxObserved: +MAX_RHO_AT_KSTAR.toFixed(6),
    verdict:
      'At the argmin-gap (collision) site kStar the modified amplification ratio ' +
      'INHERITS the direct-variant decay: < 1 at every sampled N and decreasing ' +
      '(max ~0.073 at N=100, matching imp-834). The weighted variant does NOT ' +
      'overcome the refutation at the Route-C-relevant site.',
  },
  perSiteMaximum: {
    exceedsOneAtEveryN: RHO_MAX_EXCEEDS_ONE_ALL,
    argmaxNeverAtCollisionSite: ARGMAX_NEVER_AT_KSTAR,
    maxObserved: +MAX_RHO_MAX.toFixed(2),
    caveat:
      'The per-site MAX ratio exceeds 1 (up to ~653.65 at N=5000) but ONLY at ' +
      'large-gap, non-colliding sites (argmax is never kStar). Since B_k there ' +
      'does not go to 0, no collision saturates the imp-507 static ceiling ' +
      'S_k*B_k^2 <= 2; a positive dW/dtau at tau=0 at such a site does not ' +
      'establish c(N) > 2. Whether a non-collision site can nonetheless force ' +
      'the weighted sum past 2 is exactly the open imp-861 sub-gaps ' +
      '(tau-dependent / signed weights) — NOT resolved here.',
  },
  verdict:
    'MEASURE-ONLY: at the collision site the weighted-S modified amplification ' +
    'ratio inherits the same sub-1 decay as the refuted direct variant; the ' +
    'per-site maximum exceeds 1 only at physically-irrelevant non-collision ' +
    'sites, so it does not by itself overcome the refutation. No closure claim.',
};

// ── (3) Discovered inconsistency in the imp-861 source module (recorded, not fixed) ─
//
// The imp-861 module (route-c-weighted-s-analysis.js) carries a PRELIMINARY-
// NEGATIVE narrative asserting "rho_amp_max(N) < 1 at every sampled N" and
// "argmax coincides with the argmin-gap site kStar". Its OWN current computed
// evidence contradicts both: numericalEvidence.allRhoMaxBelowOne === false,
// argmaxSiteIsArgminGapSite === false, and static_weights_can_escape === true
// at every sampled N. The module is ALSO absent from scripts/run-assertions.mjs
// (only imp-834/862/863 are swept), so its now-failing assertions never fire.
// This assessment records the discrepancy as a follow-up sub-gap; it does not
// edit imp-861 (assess/measure-only scope).
export const IMP_861_NARRATIVE_INCONSISTENCY = {
  module: 'src/math/route-c-weighted-s-analysis.js',
  narrativeClaims: 'rho_amp_max(N) < 1 at every N; argmax coincides with kStar',
  measuredReality:
    'rho_amp_max grows 5.5 -> 653.65 over N in {50..5000}; argmax is a ' +
    'non-collision large-gap site, never kStar; static_weights_can_escape true everywhere',
  notInAssertionSweep: true,
  followUpSubGap: 'imp-861-narrative-vs-data-reconcile',
  note:
    'The per-site MAX being > 1 does NOT reopen Route C: the direct-variant ' +
    'refutation lives at the collision site kStar, where rho stays < 1 (see ' +
    'WEIGHTED_S_MEASUREMENT.atCollisionSite). The imp-861 structural lemma ' +
    'over-reached by requiring the ALL-site maximum < 1; the collision-site ' +
    'ratio is the physically-binding quantity. Reconciling the prose with the ' +
    'data (and either narrowing the lemma to kStar or adding the module to the ' +
    'assertion sweep) is the named follow-up — out of scope for this measure-only ticket.',
};

export const IMP_3274_ASSESSMENT = {
  id: 'imp-3274',
  title:
    'PATH-2 escape-hatch status assessment (imp-861/862/863) + weighted-S ' +
    'modified-amplification-ratio measurement',
  scope: 'assess/measure only; no closure claim',
  allThreeAdvanced: ALL_THREE_HATCHES_ADVANCED,
  anyUntouched: ANY_HATCH_UNTOUCHED,
  hatchStatus: PATH2_ESCAPE_HATCH_STATUS,
  weightedSMeasurement: WEIGHTED_S_MEASUREMENT,
  imp861Inconsistency: IMP_861_NARRATIVE_INCONSISTENCY,
  summary:
    'All three named PATH-2 escape hatches have been ADVANCED (none untouched): ' +
    'imp-861 (weighted-S), imp-862 (CM Hamiltonian) and imp-863 (matched ' +
    'asymptotics) are each status=partial with a preliminary-negative closure ' +
    'level. MEASUREMENT of the weighted-S modified amplification ratio: at the ' +
    'collision site kStar it stays < 1 and decreasing (inherits the refuted ' +
    'direct-variant decay, max ~0.073), so the hatch does not overcome the ' +
    'refutation at the Route-C-relevant site; the per-site maximum exceeds 1 ' +
    '(up to ~653.65) only at non-collision large-gap sites, which does not ' +
    'establish c(N) > 2. Incidental finding: the imp-861 module prose is stale ' +
    'relative to its own current data and it is absent from the assertion ' +
    'sweep — named as follow-up imp-861-narrative-vs-data-reconcile.',
};

// ── Build-time assertions (guard the MEASURED facts, not any closure claim) ───

export const IMP_3274_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp3274-all-three-hatches-advanced',
    holds: () => ALL_THREE_HATCHES_ADVANCED && !ANY_HATCH_UNTOUCHED,
    why:
      'The assessment records that imp-861/862/863 are all advanced (each has a ' +
      'partial preliminary-negative module). If a hatch record were to lose its ' +
      'module or flip advanced=false, the "none untouched" finding would no ' +
      'longer hold and this summary would be stale.',
  },
  {
    id: 'imp3274-collision-site-ratio-inherits-decay',
    holds: () => RHO_AT_KSTAR_ALL_BELOW_ONE && RHO_AT_KSTAR_DECREASING && MAX_RHO_AT_KSTAR < 0.1,
    why:
      'The core measurement: at the collision site kStar the weighted-S modified ' +
      'amplification ratio inherits the refuted direct-variant decay (< 1 and ' +
      'decreasing, max ~0.073). This is the physically-binding Route C quantity; ' +
      'a flip here would contradict imp-834 and require reassessing the refutation.',
  },
  {
    id: 'imp3274-per-site-max-exceeds-one-off-collision-site',
    holds: () => RHO_MAX_EXCEEDS_ONE_ALL && ARGMAX_NEVER_AT_KSTAR,
    why:
      'The per-site maximum ratio exceeds 1 at every sampled N but the argmax is ' +
      'never the collision site kStar. This guards the honest caveat that the ' +
      '> 1 excursions are at non-colliding large-gap sites and do not by ' +
      'themselves overcome the refutation, and it locks the discrepancy with the ' +
      'imp-861 module narrative that this assessment flags.',
  },
];
