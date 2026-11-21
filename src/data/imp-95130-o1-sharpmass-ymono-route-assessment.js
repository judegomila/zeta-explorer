/**
 * @module imp-95130-o1-sharpmass-ymono-route-assessment
 * @fileoverview imp-95130 (proof-route assessment, HONEST -- NO closure, NO
 * bound change, NO QED): scope candidate routes to the RESTATED O1 obligation
 * of the imp-95208 y-thaw 0.17759432 package.
 *
 * THE RESTATED OBLIGATION (imp-95208 STAGE1.obligationsRestated / refereeRecord)
 * ------------------------------------------------------------------------------
 * O1 was re-scoped upward by the 2026-09-10 independent referee pass. It is no
 * longer "run the triangle Dini cover down to 0.1808 and splice" (route (a),
 * STRUCK: the transfer runs upward from a bottom-edge anchor of the TRIANGLE
 * functional, and the package own sweep shows that triangle floor at 0.1808 has
 * COLLAPSED to the 7.91366e-7 artifact -- the anchor does not exist). The
 * restated O1 is a NEW theorem:
 *
 *   SHARP-MASS Y-MONOTONICITY of the per-n sharp summand
 *       s_n(y) = max( |B_n - g A_n| , c(g) |B_n + g A_n| ) n^{-sigma}
 *   with the y-dependent radius g = g_N(y) (gamma-disk bound) and the
 *   y-dependent kink coefficient c(g), across the gap y in [0.1808, 0.187272]
 *   (length 6.472e-3, BELOW the sealed 0.187272 Dini cover start).
 *
 * The STAGE2 re-sweep already certifies the SHARP floor at the single bottom
 * slice y = 0.1808 (global min 0.062718178029 at N = 690996, ~7.9e4x the sealed
 * triangle artifact). O1 is exactly the all-y TRANSFER of that single-slice
 * certificate across the gap.
 *
 * ROUTE MAP (scope only -- derive no closure without certificates)
 * ----------------------------------------------------------------
 * route (a) triangle-Dini extension + splice -- STRUCK by referee (anchor gone).
 *
 * route (b) DIRECT TERMWISE sharp-summand y-monotonicity. Claim each s_n(y) is
 *   monotone in y so the max and the sum are preserved and one-endpoint
 *   certification transfers. VERDICT: BLOCKED as stated -- this is the same
 *   double-cancellation obstruction already recorded for the sibling
 *   Lambda <= 0.1758354 y-transfer, where termwise monotonicity is FALSE: the
 *   max-of-two-branches KINK lets dg_{n}/dy flip sign at branch-switch cells, so
 *   no per-term monotone majorant exists. Not viable without cell structure.
 *
 * route (c) S0 RADIAL-MONOTONICITY LIFT (PRIMARY candidate -- reuses a proven
 *   sub-lemma). STAGE1.S0 is ALREADY proven: m(rho) = max(|B - rho A|/(1-rho),
 *   |B + rho A|/(1+rho)) is nondecreasing on [0,1). The gamma-disk radius g_N(y)
 *   is monotone in y, so composing S0 with y |-> g_N(y) makes the MAJORANT sum
 *   monotone in y in a FIXED direction (the sign is that of dg_N/dy), hence the
 *   floor (1-g) - sum ... is monotone in y with the opposite sign. The transfer
 *   then anchors at the WORSE of the two single y-slices under the SHARP weight.
 *   The bottom slice y = 0.1808 is already swept (0.0627); the ONLY new
 *   certificate this route needs is (i) the sign of dg_N/dy on the gap, and
 *   (ii) IF the worse endpoint is the top, one SHARP single-slice sweep at
 *   y = 0.187272 (cheap -- a single y-line, not a lane). No new monotonicity
 *   theorem is invented; S0 supplies it. NAMED RESIDUAL:
 *   imp-95130-subgap-gN-monotone-sign (establish dg_N/dy sign; then at most one
 *   sharp top-slice sweep).
 *
 * route (d) PROFILE-SECTOR CELLS + EXCISION BUDGET (ROBUST fallback -- matches
 *   the newO1 "new theorem + new producer + new certificates" cost). This is the
 *   fix pattern that already dissolved the sibling Lambda <= 0.1758354 y-transfer
 *   where route (b) failed: decompose the branch-switch cells into profile
 *   sectors on which a SINGLE branch is active, prove per-sector monotonicity
 *   (route (b) works inside a sector), and bound the mass lost across switch
 *   seams by an excision budget B that must sit below the certified margin.
 *   Here the margin is enormous -- the bottom-slice sharp floor is 0.0627, versus
 *   the ~2.5e-4 excision budgets that sufficed against a 1.87e-3 margin in the
 *   sibling -- so the budget headroom is not the bottleneck; building the
 *   profile-sector PRODUCER and the seam excision CERTIFICATE is.
 *
 * route (e) TWO-ENDPOINT SANDWICH + LIPSCHITZ EXCURSION. Certify both endpoints
 *   (bottom swept; top needs one sharp slice) and bound sup |dFloor/dy| on the
 *   gap so the interior cannot dip below min(endpoints) - L * (length/2). Coarser
 *   than (c); needs no monotonicity direction but DOES need a certified Lipschitz
 *   constant L for the sharp floor in y -- a genuinely new derivative certificate.
 *
 * RECOMMENDATION (assessment, not a decision to close)
 * ----------------------------------------------------
 *   PRIMARY  = route (c) S0-lift: cheapest, reuses the ALREADY-PROVEN S0
 *              sub-lemma; the only genuinely new object is the sign of dg_N/dy
 *              plus (conditionally) one sharp single-slice sweep.
 *   FALLBACK = route (d) profile-sector + excision: robust where (b)/(c) meet
 *              branch-switch kinks; matches the referee-quoted upward cost.
 *   route (b) is BLOCKED (double-cancellation), route (a) is STRUCK.
 *
 * This module CHANGES NO BOUND. 0.17759432 remains a package VALUE, not a bound;
 * O1-O6 stay OPEN; the sub-gap imp-95130-subgap-gN-monotone-sign is carried OPEN.
 * No refereed bound is changed. NO QED.
 *
 * @see imp-95208-ythaw-package-stage12.js (the package; STAGE1.S0, STAGE2 sweep, refereeRecord.o1Restated)
 * @see imp-95212-ythaw-o5-o3.js (siblings O5/O3; O4 is imp-95131, O6 is imp-95132)
 */

import { YTHAW_ROW, STAGE2 } from './imp-95208-ythaw-package-stage12.js';

// Gap the transfer must cover: [0.1808, sealed Dini anchor 0.187271994702891].
const GAP_LO = 113 / 625; // 0.1808 exactly (swept bottom slice)
const GAP_HI = YTHAW_ROW.sealedYAnchor; // 0.187271994702891 (sealed cover start)
const GAP_LEN = GAP_HI - GAP_LO; // ~6.472e-3

// Certified bottom-slice SHARP floor vs the collapsed sealed TRIANGLE artifact.
const BOTTOM_SHARP_FLOOR = STAGE2.globalMin.L12; // 0.062718178029 at N = 690996
const SEALED_TRIANGLE_FLOOR = STAGE2.sealedTriangleFloorAt690988; // 7.91366e-7
const SHARP_OVER_SEALED = BOTTOM_SHARP_FLOOR / SEALED_TRIANGLE_FLOOR; // ~7.9e4

const ROUTES = [
  Object.freeze({
    key: 'a',
    name: 'triangle-Dini extension + splice',
    status: 'STRUCK',
    viable: false,
    why: 'transfer runs upward from a bottom-edge anchor of the TRIANGLE functional, and the package own sweep shows the triangle floor at 0.1808 collapsed to the 7.91366e-7 artifact -- the anchor does not exist (referee 2026-09-10)',
  }),
  Object.freeze({
    key: 'b',
    name: 'direct termwise sharp-summand y-monotonicity',
    status: 'BLOCKED',
    viable: false,
    why: 'same double-cancellation obstruction as the sibling Lambda <= 0.1758354 y-transfer -- the max-of-two-branches kink lets dg_{n}/dy flip sign at branch-switch cells, so no per-term monotone majorant exists',
  }),
  Object.freeze({
    key: 'c',
    name: 'S0 radial-monotonicity lift',
    status: 'PRIMARY',
    viable: true,
    reusesProvenLemma: 'STAGE1.S0 (m(rho) nondecreasing on [0,1))',
    newCertificatesNeeded: [
      'sign of dg_N/dy on the gap (fixes transfer direction)',
      'IF worse endpoint is the top: one SHARP single-slice sweep at y = 0.187272 (single y-line, not a lane)',
    ],
    why: 'compose the already-proven S0 sub-lemma with the monotone radius g_N(y); the majorant sum is then monotone in y with a fixed sign, so the floor transfers by anchoring at the worse single y-slice under the sharp weight (the bottom slice 0.0627 is already swept)',
  }),
  Object.freeze({
    key: 'd',
    name: 'profile-sector cells + excision budget',
    status: 'FALLBACK',
    viable: true,
    newCertificatesNeeded: [
      'profile-sector PRODUCER (single active branch per sector)',
      'per-sector monotonicity (route (b) inside a sector)',
      'seam EXCISION budget B below the certified margin',
    ],
    why: 'the fix pattern that dissolved the sibling Lambda <= 0.1758354 y-transfer where the termwise route failed; the bottom-slice sharp margin 0.0627 dwarfs the ~2.5e-4 excision budgets that sufficed against a 1.87e-3 sibling margin, so budget headroom is not the bottleneck -- building the producer and the seam certificate is',
  }),
  Object.freeze({
    key: 'e',
    name: 'two-endpoint sandwich + Lipschitz excursion',
    status: 'COARSE-ALT',
    viable: true,
    newCertificatesNeeded: [
      'both endpoint sharp floors (bottom swept; top needs one sharp slice)',
      'certified sup |dFloor/dy| on the gap (new derivative certificate)',
    ],
    why: 'bound the interior by min(endpoints) - L * (length/2); needs no monotonicity direction but does need a certified Lipschitz constant L for the sharp floor in y',
  }),
];

export const IMP_95130_O1_SHARPMASS_YMONO_ROUTE_ASSESSMENT = Object.freeze({
  id: 'imp-95130',
  title:
    'Route assessment for the RESTATED O1: SHARP-MASS Y-MONOTONICITY of the max-of-kinked-branches ' +
    'summand with y-dependent c(g) on [0.1808, 0.187272]. PRIMARY = route (c) S0-lift (reuses the ' +
    'proven S0 sub-lemma; only new object = sign of dg_N/dy + at most one sharp single-slice sweep); ' +
    'FALLBACK = route (d) profile-sector + excision; route (b) BLOCKED (double-cancellation), (a) STRUCK',
  status: 'route-assessment',
  rhFree: true,
  changesBound: false,
  qed: false,
  obligation: 'imp-95208 STAGE1.obligationsRestated O1 (SHARP-MASS Y-MONOTONICITY)',
  summand: 's_n(y) = max(|B_n - g A_n|, c(g)|B_n + g A_n|) n^{-sigma}, g = g_N(y), c(g) y-dependent',
  gap: Object.freeze({ lo: GAP_LO, hi: GAP_HI, length: GAP_LEN }),
  bottomSliceSharpFloor: BOTTOM_SHARP_FLOOR, // already certified by STAGE2 at y = 0.1808
  sealedTriangleFloor: SEALED_TRIANGLE_FLOOR, // the collapsed anchor that struck route (a)
  sharpOverSealedRatio: SHARP_OVER_SEALED, // ~7.9e4
  routes: ROUTES,
  recommendation: Object.freeze({
    primary: 'c',
    fallback: 'd',
    struck: ['a'],
    blocked: ['b'],
    rationale:
      'route (c) reuses the ALREADY-PROVEN S0 sub-lemma and needs only the sign of dg_N/dy plus, ' +
      'conditionally, a single sharp y-slice sweep -- the cheapest live path. route (d) is the robust ' +
      'fallback matching the referee-quoted upward cost (new theorem + producer + certificates).',
  }),
  subGap: Object.freeze({
    name: 'imp-95130-subgap-gN-monotone-sign',
    open: true,
    statement:
      'establish the sign of dg_N/dy on [0.1808, 0.187272]; if the worse endpoint is the top, run one ' +
      'SHARP single-slice sweep at y = 0.187272 -- then route (c) S0-lift closes O1 as a transfer',
  }),
  scope:
    'Route assessment only. NO route is executed and NO certificate is produced here; the sub-gap ' +
    'imp-95130-subgap-gN-monotone-sign is carried OPEN. 0.17759432 stays a package VALUE (not a bound); ' +
    'O1-O6 remain OPEN; no refereed bound is changed; NO QED.',
});

// ── imp-95227: does O1 close by O3-style inclusion-isotonicity, or does it ───
// genuinely require a monotonicity-in-y argument? (the ticket dichotomy) ──────
//
// O3 (E_max budget) closed WITHOUT any monotonicity appeal: its sealed
// Prop-4.10 chain was re-run once with y replaced by the full interval hull
// [0.1808, y_max], and inclusion isotonicity of interval arithmetic made the
// single hull evaluation dominate every y automatically (imp-95212 O3 grade).
// That works because O3 is an UPPER bound on a smooth, sign-definite ERROR
// budget: hull over-estimation is exactly what you want (the worst case), and
// the composition has no cancellation, so the certified quotient just grows a
// structural 4.4471% over the gap (growthFactorUpper 1.044471048052).
//
// O1 is the OPPOSITE shape: a LOWER bound on the sharp floor
//   T_N(y) = (1 - g_N(y)) - sum_n s_n(y),
//   s_n(y) = max(|B_n - g A_n|, c(g)|B_n + g A_n|) n^{-sigma},  g = g_N(y).
// A single wide-y hull re-run (the cheap O3 move) does NOT transfer to O1.
// Inclusion isotonicity stays valid, but evaluating a max-of-two-branches sum
// whose FIRST branch is the difference B_n - g A_n (catastrophic cancellation)
// over a WIDE y-interval suffers the dependency/wrapping blowup: the same
// double-cancellation obstruction that BLOCKS route (b) termwise and that only
// cells dissolved in the sibling Lambda <= 0.1758354 transfer. The naive hull
// lower bound on T_N goes negative and vaporizes the 0.0627 bottom-slice
// margin. So the O3 single-hull re-run is INSUFFICIENT for O1.
//
// The dichotomy therefore resolves: O1 needs EITHER
//  (1) a genuine monotonicity-in-y argument (route (c) S0-lift) reducing the
//      transfer to the worse single y-endpoint -- CHEAP, only new object is the
//      sign of dg_{N}/dy plus at most one sharp top-slice sweep; OR
//  (2) inclusion isotonicity WITH y-subdivision -- a 2D N x y branch-and-bound
//      sweep whose y-cell count is set by how fast the dependency error shrinks
//      as each y-cell narrows -- rigorous and monotonicity-free, but it
//      multiplies the ~3.15M-row N-lane by the cell count (route (d) cells cast
//      in y), FAR costlier than O3.
// Cheap path = (1); rigorous-but-expensive fallback = (2). This changes no
// bound and closes nothing; it only fixes which mechanism O1 requires. The
// sub-gap stays imp-95130-subgap-gN-monotone-sign (route (c)); no new sub-gap.
export const O1_ISOTONICITY_VS_MONOTONICITY = Object.freeze({
  ticket: 'imp-95227',
  question:
    'can O1 (all-y transfer of the sharp floor) close by the O3-style single ' +
    'inclusion-isotonicity hull re-run, or is a genuine monotonicity-in-y ' +
    'argument required?',
  o3Mechanism: Object.freeze({
    kind: 'inclusion-isotonicity, single hull re-run, no monotonicity appeal',
    boundSense: 'UPPER bound on a smooth sign-definite error budget',
    whyItWorks:
      'hull over-estimation is the desired worst case; no cancellation, so one ' +
      'interval re-run over [0.1808, y_max] dominates every y (imp-95212 O3)',
    gapGrowthFactor: 1.044471048052, // imp-95212 O3 growthFactorUpper
  }),
  o1Mechanism: Object.freeze({
    boundSense: 'LOWER bound on the sharp floor T_N(y) = (1 - g_N) - sum s_n(y)',
    singleHullTransfers: false,
    obstruction:
      'the first branch B_n - g A_n is a difference (catastrophic cancellation); ' +
      'a wide-y interval hull of the max-of-branches sum suffers the ' +
      'dependency/wrapping blowup -- same double-cancellation that blocks route ' +
      '(b) and only cells dissolved in the sibling Lambda <= 0.1758354 transfer',
    consequence:
      'naive hull lower bound on T_N goes negative, vaporizing the 0.0627 ' +
      'bottom-slice margin',
  }),
  resolution: Object.freeze({
    o3IsotonicityInsufficientForO1: true,
    cheapPath: 'route (c) S0-lift (genuine monotonicity-in-y; worse endpoint)',
    rigorousFallback:
      'route (d)-in-y: inclusion isotonicity WITH y-subdivision (2D N x y ' +
      'branch-and-bound), monotonicity-free but multiplies the ~3.15M-row ' +
      'N-lane by the y-cell count',
    subGap: 'imp-95130-subgap-gN-monotone-sign (unchanged; no new sub-gap)',
  }),
  changesBound: false,
  qed: false,
});

export const IMP_95130_O1_SHARPMASS_YMONO_ROUTE_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp-95227: O3 inclusion-isotonicity does NOT transfer to O1; monotonicity (or subdivided isotonicity) required',
    holds: () => {
      const D = O1_ISOTONICITY_VS_MONOTONICITY;
      return (
        D.ticket === 'imp-95227' &&
        D.o1Mechanism.singleHullTransfers === false &&
        D.resolution.o3IsotonicityInsufficientForO1 === true &&
        /S0-lift/.test(D.resolution.cheapPath) &&
        D.resolution.subGap === 'imp-95130-subgap-gN-monotone-sign' &&
        D.changesBound === false &&
        D.qed === false &&
        Math.abs(D.o3Mechanism.gapGrowthFactor - 1.044471048052) < 1e-12
      );
    },
    why: 'O3 closed as an UPPER bound on a smooth error budget by one interval hull re-run (no monotonicity appeal, structural 4.4471% growth); O1 is a LOWER bound on a cancellation-heavy max-of-branches floor whose wide-y hull suffers the double-cancellation blowup, so the cheap O3 single-hull move is insufficient -- O1 genuinely needs route (c) monotonicity-in-y (cheap) or subdivided isotonicity (route (d)-in-y, expensive), sub-gap unchanged.',
  },
  {
    id: 'imp-95130: gap endpoints exact and length ~6.472e-3',
    holds: () =>
      GAP_LO === 0.1808 &&
      Math.abs(GAP_HI - 0.187271994702891) < 1e-15 &&
      GAP_LO < GAP_HI &&
      Math.abs(GAP_LEN - 0.006471994702891) < 1e-12,
    why: 'the O1 transfer gap [0.1808, 0.187272] has exact endpoints and length ~6.472e-3 below the sealed Dini cover start',
  },
  {
    id: 'imp-95130: route (a) STRUCK and route (b) BLOCKED, both non-viable',
    holds: () => {
      const a = ROUTES.find((r) => r.key === 'a');
      const b = ROUTES.find((r) => r.key === 'b');
      return a && b && a.status === 'STRUCK' && b.status === 'BLOCKED' && !a.viable && !b.viable;
    },
    why: 'the triangle-Dini route is struck (anchor collapsed) and the direct termwise route is blocked (double-cancellation kink)',
  },
  {
    id: 'imp-95130: PRIMARY route (c) is the S0-lift and is viable',
    holds: () => {
      const c = ROUTES.find((r) => r.key === 'c');
      return (
        c &&
        c.status === 'PRIMARY' &&
        c.viable === true &&
        /S0/.test(c.reusesProvenLemma) &&
        IMP_95130_O1_SHARPMASS_YMONO_ROUTE_ASSESSMENT.recommendation.primary === 'c'
      );
    },
    why: 'the recommended primary route reuses the already-proven S0 radial-monotonicity sub-lemma',
  },
  {
    id: 'imp-95130: bottom-slice sharp floor dwarfs the collapsed sealed triangle artifact',
    holds: () =>
      BOTTOM_SHARP_FLOOR > 0.06 &&
      SEALED_TRIANGLE_FLOOR > 0 &&
      SHARP_OVER_SEALED > 5e4,
    why: 'the certified bottom-slice sharp floor (0.0627) is ~7.9e4x the sealed triangle floor (7.9e-7) whose collapse struck route (a)',
  },
  {
    id: 'imp-95130: sub-gap carried OPEN, no bound change, no QED',
    holds: () => {
      const A = IMP_95130_O1_SHARPMASS_YMONO_ROUTE_ASSESSMENT;
      return A.subGap.open === true && A.changesBound === false && A.qed === false;
    },
    why: 'assessment only -- the sign-of-dg_N/dy sub-gap stays open, no route is executed, 0.17759432 remains a package value',
  },
];
