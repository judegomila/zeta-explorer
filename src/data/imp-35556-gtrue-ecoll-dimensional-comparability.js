/**
 * @module imp-35556-gtrue-ecoll-dimensional-comparability
 *
 * imp-35556 (proof/assessment, S-frontier): ASSESS whether the imp-35530 g_true
 * (a KL divergence of the RvM-unfolded nearest-neighbour spacing pdf vs the GUE
 * Wigner surmise) and the modeled surrogate collision term
 * E_coll(N) = C_C sqrt(log T0 / N) [C_C = (1/8) sqrt(3 pi), imp-2642/imp-2643]
 * are DIMENSIONALLY comparable quantities, and what the honest reading of the
 * imp-35530 projected ~10.5x g_true >> E_coll gap at the crossover height is.
 *
 * This scopes the "different units" caveat that imp-35530 flagged. NOTE the
 * queue title attaches that caveat to sub-gap imp-35530a, but imp-35530a is
 * actually the EXTRAPOLATION caveat; the UNITS-MISMATCH caveat is imp-35530b
 * (which itself inherits imp-35488b). This module assesses the imp-35530b
 * dimensional question and leaves both imp-35530a and imp-35530b OPEN.
 *
 * ASSESSMENT (no new measurement; reuses the imp-35530 baked literals):
 *
 *   1. NOT A NAIVE UNITS BARRIER. Both quantities are dimensionless pure numbers:
 *      the KL divergence is measured in nats (a pure number), and E_coll is a
 *      dimensionless sigma-share fraction. So there is no physical-units gate in
 *      the trivial sense -- the mismatch is subtler and is about FUNCTIONAL ORDER,
 *      not physical dimension.
 *
 *   2. THE REAL MISMATCH IS ORDER (quadratic vs linear). Let eps denote the
 *      amplitude of the spacing-pdf deviation dp = p_emp - p_GUE. The KL
 *      divergence is a SECOND-ORDER functional of the whole pdf,
 *      D_KL(p_emp || p_GUE) = (1/2) integral (dp)^2 / p_GUE ds + O(eps^3),
 *      so g_true = KL = O(eps^2). The surrogate E_coll is a FIRST-ORDER (amplitude)
 *      bound on a single scalar collision / sigma-share observable, E_coll = O(eps).
 *      Comparing 3.214e-4 (an eps^2 quantity) directly to 3.060e-5 (an eps
 *      quantity) compares different POWERS of the same small deviation -- a
 *      category mismatch, NOT a meaningful inequality in one common functional.
 *
 *   3. COMMON-FUNCTIONAL BRIDGE (Pinsker). The natural way to make the comparison
 *      apples-to-apples is to reduce the quadratic KL to a first-order amplitude
 *      that shares E_coll order. Pinsker inequality:
 *      TV(p_emp, p_GUE) <= sqrt(KL / 2). At the crossover this bounds the
 *      first-order total-variation deviation from ABOVE:
 *        free fit  KL=3.214e-4 -> TV <= 1.2677e-2  (414.3x E_coll)
 *        1/logT0   KL=1.146e-3 -> TV <= 2.3938e-2  (782.3x E_coll)
 *        1/logT0^2 KL=6.816e-4 -> TV <= 1.8460e-2  (603.3x E_coll)
 *      Under this reduction the number changes COMPLETELY (the 10.5x becomes a
 *      few-hundred-x UPPER bound), and because it is only an upper bound it does
 *      NOT lower-bound the true deviation -- so it cannot even certify the
 *      DIRECTION g_true > E_coll. No in-repo common functional lower-bounds the
 *      E_coll-observable amplitude from KL (that is the surrogate->observable
 *      "dictionary" imp-35337a leaves OPEN).
 *
 *   4. HONEST READING OF THE ~10.5x. It is a CATEGORY MISMATCH / diagnostic flag,
 *      NOT a certified inequality. Because the value is not preserved under any
 *      dimensional reconciliation (10.5x for the raw KL/E_coll ratio, ~414x as a
 *      Pinsker TV upper bound, undetermined under the OPEN dictionary), no
 *      specific multiplier is a certified quantity. The only dimension-robust
 *      statement is one-sided and qualitative: the surrogate E_coll = 3.060e-5
 *      sits well INSIDE the admissible first-order deviation band [0, ~1.27e-2]
 *      implied by the projected KL via Pinsker -- consistent with (but NOT proof
 *      of) the surrogate under-stating the true deviation at the crossover.
 *
 * This CONFIRMS and SHARPENS imp-35530b (units mismatch) / imp-35488b: the
 * barrier is an ORDER (quadratic-vs-linear functional) mismatch whose fix is a
 * common first-order functional that does not exist in-repo. New sub-gap
 * imp-35556a records that. ASSESSMENT ONLY; discharges nothing; imp-35488a,
 * imp-35530a, imp-35530b, imp-35337a stay OPEN; C_mb GUE-conditional per imp-486
 * UNTOUCHED; C_C ansatz (imp-2642/imp-2643), E_trunc floor (imp-2631) UNTOUCHED;
 * changes no bound; no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35530-crossover-gtrue-trend-extrapolation (the projected ~10.5x gap and sub-gaps imp-35530a/b)
 * @see imp-35488-route-ii-two-height-gtrue-spotcheck (units-mismatch origin imp-35488b; imp-35488a out-of-range)
 * @see imp-35337-sigma-landmarks-double-double-certification (imp-35337a surrogate->observable dictionary, OPEN)
 * @see imp-486 (GUE-conditional caveat the analytic prediction inherits)
 */

const ECOLL_CROSS = 0.00003059999999845239; // 3.060e-5 (imp-2631 E_trunc floor at the crossover)

// imp-35530 projected g_true (KL) at logT0 = 20.858 (EXTRAPOLATION, imp-35530a).
const KL_CROSS_FREE = 0.0003214254410014205; // free-exponent fit
const KL_CROSS_P1 = 0.001146045615034889; // forced 1/logT0
const KL_CROSS_P2 = 0.0006815647332400637; // forced 1/(logT0)^2

// imp-35530 raw ratio (the "10.5x"): KL is O(eps^2), E_coll is O(eps) -- category mismatch.
const RAW_KL_OVER_ECOLL = KL_CROSS_FREE / ECOLL_CROSS; // ~10.504

// Pinsker common-functional bridge: TV(p_emp,p_GUE) <= sqrt(KL/2) reduces the
// quadratic KL to a first-order (TV) amplitude sharing E_coll order. UPPER bound only.
const pinskerTV = (kl) => Math.sqrt(kl / 2);
const TV_UB_FREE = pinskerTV(KL_CROSS_FREE); // 1.2677e-2
const TV_UB_P1 = pinskerTV(KL_CROSS_P1); // 2.3938e-2
const TV_UB_P2 = pinskerTV(KL_CROSS_P2); // 1.8460e-2
const TV_UB_FREE_OVER_ECOLL = TV_UB_FREE / ECOLL_CROSS; // ~414.3x

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any dimensional-comparability assessment)

export const IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY = {
  id: 'imp-35556',
  proofSection: 'S-frontier',
  question:
    'Are the imp-35530 g_true (KL divergence of the unfolded spacing pdf vs GUE) and the modeled ' +
    'surrogate E_coll dimensionally comparable, and is the projected ~10.5x g_true >> E_coll gap a ' +
    'meaningful inequality or a category mismatch?',
  titleCaveatIndexNote:
    'The queue title attaches the "different units" caveat to imp-35530a, but imp-35530a is the ' +
    'EXTRAPOLATION caveat; the units-mismatch caveat is imp-35530b (inherits imp-35488b). This module ' +
    'assesses the imp-35530b question.',
  dimensionalReading: {
    naiveUnits:
      'Both are dimensionless pure numbers (KL in nats; E_coll a sigma-share fraction), so there is NO ' +
      'physical-units gate -- the mismatch is about functional ORDER, not physical dimension.',
    orderMismatch:
      'With eps the spacing-pdf deviation amplitude: KL = (1/2) integral (dp)^2/p_GUE ds + O(eps^3) = ' +
      'O(eps^2) (a second-order whole-pdf divergence); E_coll is a first-order amplitude bound on a scalar ' +
      'collision/sigma-share observable = O(eps). Comparing an eps^2 to an eps compares different POWERS ' +
      'of the same deviation -- a category mismatch, not one common functional.',
    rawRatio: RAW_KL_OVER_ECOLL, // ~10.504 (the imp-35530 number)
  },
  pinskerBridge: {
    inequality: 'TV(p_emp,p_GUE) <= sqrt(KL/2) (Pinsker): reduces quadratic KL to a first-order TV amplitude.',
    upperBoundOnly: true,
    freeFit: { kl: KL_CROSS_FREE, tvUpperBound: TV_UB_FREE, tvUbOverEcoll: TV_UB_FREE_OVER_ECOLL },
    p1: { kl: KL_CROSS_P1, tvUpperBound: TV_UB_P1, tvUbOverEcoll: TV_UB_P1 / ECOLL_CROSS },
    p2: { kl: KL_CROSS_P2, tvUpperBound: TV_UB_P2, tvUbOverEcoll: TV_UB_P2 / ECOLL_CROSS },
    ecollCross: ECOLL_CROSS,
    note:
      'Under the Pinsker reduction the multiplier changes completely (10.5x raw ratio -> ~414x TV upper ' +
      'bound), and because sqrt(KL/2) UPPER-bounds TV it cannot lower-bound the true deviation, so it does ' +
      'NOT even certify the direction g_true > E_coll. A lower bound needs the OPEN surrogate->observable ' +
      'dictionary (imp-35337a).',
  },
  honestReading:
    'The ~10.5x is a CATEGORY MISMATCH / diagnostic flag, NOT a certified inequality: the value is not ' +
    'preserved under any dimensional reconciliation (10.5x raw, ~414x as a Pinsker TV upper bound, ' +
    'undetermined under the OPEN dictionary), so no specific multiplier is certified. The only ' +
    'dimension-robust statement is one-sided and qualitative: E_coll = 3.060e-5 sits well INSIDE the ' +
    'admissible first-order deviation band [0, ~1.27e-2] implied by the projected KL via Pinsker -- ' +
    'consistent with, but NOT proof of, the surrogate under-stating the true deviation.',
  subGaps: {
    imp35556a:
      'NO IN-REPO COMMON FUNCTIONAL: KL (a second-order whole-pdf divergence) and the E_coll sigma-share ' +
      '(a first-order scalar-observable amplitude) are related by no in-repo functional that lower-bounds ' +
      'the E_coll observable from KL. Pinsker only UPPER-bounds the first-order TV amplitude. The missing ' +
      'map is the surrogate->observable dictionary imp-35337a leaves OPEN, so the ~10.5x stays diagnostic-only.',
  },
  inheritsOpen: ['imp-35488a', 'imp-35530a', 'imp-35530b', 'imp-35337a'],
  isRigorous: false,
  verdict:
    'ASSESSMENT: g_true (KL) and E_coll are NOT dimensionally comparable in the sense needed for a ' +
    'certified inequality. Both are dimensionless numbers, so there is no naive units barrier; the real ' +
    'mismatch is functional ORDER -- KL = O(eps^2) (a second-order whole-pdf divergence) vs E_coll = ' +
    'O(eps) (a first-order scalar-observable amplitude). The projected ~10.5x g_true >> E_coll gap is ' +
    'therefore a CATEGORY MISMATCH / diagnostic flag, not a meaningful inequality: the Pinsker bridge ' +
    'TV <= sqrt(KL/2) reduces KL to a first-order TV amplitude but changes the multiplier entirely ' +
    '(~414x upper bound) and, being an upper bound, cannot certify even the direction. The only ' +
    'dimension-robust reading is that E_coll = 3.060e-5 lies inside the admissible band [0, ~1.27e-2] the ' +
    'projected KL permits. CONFIRMS/SHARPENS imp-35530b/imp-35488b (the barrier is order, not physical ' +
    'units; the fix is a common first-order functional absent in-repo -- new sub-gap imp-35556a). ' +
    'ASSESSMENT ONLY; discharges nothing; imp-35488a, imp-35530a, imp-35530b, imp-35337a stay OPEN; C_mb ' +
    'GUE-conditional per imp-486 UNTOUCHED; C_C ansatz (imp-2642/imp-2643), E_trunc floor (imp-2631) ' +
    'UNTOUCHED; changes no bound; no operator positivity; no RH verdict; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35530 (projected ~10.5x gap, sub-gaps imp-35530a extrapolation / imp-35530b units); imp-35488 ' +
    '(units-mismatch origin imp-35488b, out-of-range imp-35488a); imp-35337 (imp-35337a surrogate->observable ' +
    'dictionary, OPEN); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz); imp-2631 (E_trunc floor); imp-486 ' +
    '(GUE-conditional caveat); Pinsker inequality TV <= sqrt(KL/2); Platt-Trudgian 2021 (no refereed bound is changed).',
  L_pt_unchanged: L_PT,
};

export const IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY_ASSERTIONS = [
  {
    // The dimensional mismatch is ORDER (quadratic KL vs linear E_coll), not physical units.
    id: 'imp35556-order-mismatch-not-naive-units',
    description: 'both quantities are dimensionless numbers, so the barrier is functional order (KL = O(eps^2) vs E_coll = O(eps)), not a physical-units gate; the raw KL/E_coll ratio reproduces the imp-35530 ~10.5x',
    holds: () =>
      Math.abs(RAW_KL_OVER_ECOLL - KL_CROSS_FREE / ECOLL_CROSS) < 1e-12 &&
      RAW_KL_OVER_ECOLL > 10 && RAW_KL_OVER_ECOLL < 11 && // ~10.5x
      KL_CROSS_FREE > 0 && ECOLL_CROSS > 0 &&
      /functional ORDER/i.test(IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY.dimensionalReading.naiveUnits) &&
      /O\(eps\^2\)/.test(IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY.dimensionalReading.orderMismatch),
  },
  {
    // Pinsker bridge: TV <= sqrt(KL/2); the multiplier changes entirely and stays an upper bound only.
    id: 'imp35556-pinsker-bridge-changes-the-multiplier',
    description: 'the Pinsker common-functional reduction TV <= sqrt(KL/2) recomputes the crossover TV upper bounds (~414x/782x/603x E_coll), showing the 10.5x is not preserved and is an upper bound only',
    holds: () => {
      const tvFree = Math.sqrt(KL_CROSS_FREE / 2);
      const tvP1 = Math.sqrt(KL_CROSS_P1 / 2);
      const tvP2 = Math.sqrt(KL_CROSS_P2 / 2);
      return (
        Math.abs(TV_UB_FREE - tvFree) < 1e-12 &&
        Math.abs(TV_UB_P1 - tvP1) < 1e-12 &&
        Math.abs(TV_UB_P2 - tvP2) < 1e-12 &&
        // all three reduced amplitudes are hundreds of x E_coll -- multiplier is NOT the raw 10.5x
        tvFree / ECOLL_CROSS > 400 && tvFree / ECOLL_CROSS < 420 &&
        tvP1 / ECOLL_CROSS > 700 && tvP2 / ECOLL_CROSS > 550 &&
        // Pinsker only UPPER-bounds TV
        IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY.pinskerBridge.upperBoundOnly === true &&
        // E_coll lies inside the admissible first-order band [0, ~1.27e-2]
        ECOLL_CROSS < tvFree
      );
    },
  },
  {
    // Honesty gate: assessment only, category mismatch, new sub-gap imp-35556a, no bound moves, no refereed bound is changed, NO QED.
    id: 'imp35556-honest-assessment-no-bound-moves-no-qed',
    description: 'ASSESSMENT ONLY: the ~10.5x is a category mismatch not an inequality (new sub-gap imp-35556a), the units caveat is imp-35530b not imp-35530a, no bound moves, PT 0.2 unchanged, NO QED',
    holds: () =>
      IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /CATEGORY MISMATCH/i.test(IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY.honestReading) &&
      /NO IN-REPO COMMON FUNCTIONAL/i.test(IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY.subGaps.imp35556a) &&
      /imp-35530b/.test(IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY.titleCaveatIndexNote) &&
      IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY.inheritsOpen.includes('imp-35337a') &&
      /imp-486/.test(IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY.verdict) &&
      /changes no bound/.test(IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY.verdict) &&
      /NO QED/.test(IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY.verdict) &&
      /refereed bound is changed/i.test(IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY.verdict),
  },
];

for (const a of IMP35556_GTRUE_ECOLL_DIMENSIONAL_COMPARABILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35556-gtrue-ecoll-dimensional-comparability assertion failed: ${a.id}`);
  }
}
