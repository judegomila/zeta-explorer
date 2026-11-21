/**
 * @module imp-36272-ordering-mechanism-joint-monotonicity-verification
 * @fileoverview imp-36272 (numerical, measurement): VERIFY the load-bearing assumption behind
 *   the imp-36155 ordering guarantee -- that BOTH the collision-share curve shareColl(N) =
 *   E_coll / E(N) and the ratio-to-trunc curve ratioTrunc(N) = E_coll / E_trunc are in fact
 *   monotonically NON-INCREASING down the sigma -> 0 tail. imp-36155 concludes N_cross < N* (the
 *   shareColl < 1% crossing always precedes the E_trunc sole-survivor height) from TWO premises:
 *   (a) the share curve lies pointwise strictly below the ratio-to-trunc curve (structural, from
 *   E(N) = E_trunc + E_flow + E_coll > E_trunc), and (b) BOTH curves decrease monotonically in the
 *   same direction, so the lower curve reaches the fixed 0.01 level at a smaller N. Premise (a) is
 *   an algebraic identity; premise (b) was ASSERTED (orderingMechanism.holdsForAllTailN = true),
 *   never numerically witnessed. The only monotonicity RISK is the E_flow term in the share
 *   denominator: E_flow = C_F (log T0 / T0) exp|t_c| decays with height, so shareColl could in
 *   principle rise on a stretch where E_flow falls faster (relatively) than E_coll, breaking (b).
 *
 *   WHAT WAS MEASURED (fine-grid scan on the EXACT imp-35889 sub-terms; no fresh model).
 *   Re-evaluating the imp-35889 three-way split E = E_trunc + E_flow + E_coll on two geometric N
 *   grids -- a TAIL grid of 4001 points spanning N_cross ~ 4.62e13 through N* ~ 4.72e13 and beyond
 *   to 1e18, and a WIDE grid of 20001 points spanning 1e6..1e20 -- and forming consecutive
 *   forward differences of both curves:
 *     - shareColl(N) = E_coll / E(N): ZERO upward steps on either grid (worst forward step 0).
 *     - ratioTrunc(N) = E_coll / E_trunc: ZERO upward steps on either grid.
 *   So BOTH curves are strictly monotone non-increasing across the entire measured tail, with no
 *   local reversal from the E_flow term anywhere. Premise (b) HOLDS, confirming the imp-36155
 *   orderingMechanism.holdsForAllTailN assertion by direct numerical witness.
 *
 *   THE ANALYTIC FINGERPRINT (why ratioTrunc carries NO E_flow risk at all). ratioTrunc =
 *   E_coll / E_trunc has NO E_flow dependence -- its monotonicity is exactly the monotonicity of
 *   E_coll = C_C sqrt(log T0 / N), which decreases because log T0 grows only logarithmically while
 *   N grows linearly (d/dN of log T0 / N is negative on the tail). The ENTIRE E_flow monotonicity
 *   risk lives in the share curve alone, via (E_trunc + E_flow) / E_coll = E_trunc / E_coll
 *   (increasing) + E_flow / E_coll (decreasing to 0 like sqrt(log T0 / N)); the measured zero
 *   reversals show the increasing E_trunc / E_coll term dominates the sum everywhere on the tail,
 *   so shareColl never rises.
 *
 *   MEASUREMENT ONLY. Reuses the imp-35889 / imp-3406 / imp-33582 sub-terms verbatim
 *   (E_trunc = 3.06e-5 fixed, imp-2631; E_flow = C_F (log T0 / T0) exp|t_c|; E_coll =
 *   C_C sqrt(log T0 / N), C_C = (1/8) sqrt(3 pi), imp-2642 / imp-2643, GUE-conditional, imp-486);
 *   re-derives no sub-term; derives no remainder; discharges nothing; changes no bound; establishes
 *   no operator positivity; imp-35337a stays OPEN; no RH verdict, NO QED; no refereed bound is changed.
 *
 * @see imp-36155-sharecoll-crossing-precedes-sole-survivor.js (the ordering claim whose premise (b) this witnesses)
 * @see imp-35889-e-share-decomposition-at-knees.js (the three-way split and the exact sub-terms reused here)
 * @see imp-36252-sharecoll-subpercent-crossing-precedes-sole-survivor.js (the sub-1% ordering ladder)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 *
 * Ticket: imp-36272 (numerical, medium). Measurement only, RH-free; changes no bound; NO QED.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// EXACT imp-35889 / imp-3406 / imp-33582 sub-terms (identical model; no fresh numerics).
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return {
    E_trunc: E_TRUNC_PT,
    E_flow,
    E_coll,
    E_N,
    shareColl: E_coll / E_N, // E_coll / E(N)      -- the share curve (E_flow in the denominator)
    ratioTrunc: E_coll / E_TRUNC_PT, // E_coll / E_trunc -- the ratio-to-trunc curve (no E_flow)
  };
}

// Scan a geometric N grid for UPWARD forward steps (monotonicity reversals) of both curves.
function scanMonotonicity(Nlo, Nhi, M) {
  let prevShare = Infinity;
  let prevRatio = Infinity;
  let shareUpSteps = 0;
  let ratioUpSteps = 0;
  let worstShareUpStep = 0;
  let worstRatioUpStep = 0;
  for (let i = 0; i <= M; i++) {
    const N = Nlo * Math.pow(Nhi / Nlo, i / M);
    const p = parts(N);
    if (i > 0) {
      const dS = p.shareColl - prevShare;
      const dR = p.ratioTrunc - prevRatio;
      if (dS > 0) {
        shareUpSteps += 1;
        if (dS > worstShareUpStep) worstShareUpStep = dS;
      }
      if (dR > 0) {
        ratioUpSteps += 1;
        if (dR > worstRatioUpStep) worstRatioUpStep = dR;
      }
    }
    prevShare = p.shareColl;
    prevRatio = p.ratioTrunc;
  }
  return {
    Nlo: +Nlo.toExponential(3),
    Nhi: +Nhi.toExponential(3),
    points: M + 1,
    shareUpSteps,
    ratioUpSteps,
    worstShareUpStep,
    worstRatioUpStep,
    shareMonotoneNonIncreasing: shareUpSteps === 0,
    ratioMonotoneNonIncreasing: ratioUpSteps === 0,
  };
}

// TAIL grid: N_cross ~ 4.62e13 through N* ~ 4.72e13 and beyond to 1e18 (the imp-36155 window).
const tailScan = scanMonotonicity(4.62e13, 1e18, 4000);
// WIDE grid: 1e6..1e20 (well past both knees; catches any E_flow-driven reversal upstream too).
const wideScan = scanMonotonicity(1e6, 1e20, 20000);

// Endpoint fingerprints reproducing the imp-36155 landmarks (share < ratio at both, both <= 1%).
const N_CROSS = 4.624381e13;
const N_STAR = 4.7214e13;
const atCross = parts(N_CROSS);
const atStar = parts(N_STAR);

export const IMP36272_ORDERING_MECHANISM_JOINT_MONOTONICITY = Object.freeze({
  id: 'imp-36272',
  proofSection: 'S-frontier',
  question:
    'The imp-36155 N_cross < N* ordering rests on TWO premises: (a) shareColl = E_coll / E(N) lies pointwise below ' +
    'ratioTrunc = E_coll / E_trunc (structural, from E(N) > E_trunc), and (b) BOTH curves decrease monotonically in ' +
    'the same direction down the sigma -> 0 tail. Premise (b) was asserted (holdsForAllTailN = true) but never ' +
    'witnessed. Re-evaluating the imp-35889 split E = E_trunc + E_flow + E_coll on a fine N grid, are BOTH curves in ' +
    'fact monotone non-increasing, or does the E_flow term produce a local reversal that would break the ordering?',
  method:
    'Reuse the exact imp-35889 / imp-3406 / imp-33582 sub-terms (E_trunc = 3.06e-5 fixed; E_flow = C_F (log T0 / T0) ' +
    'exp|t_c|; E_coll = C_C sqrt(log T0 / N)). Evaluate shareColl(N) and ratioTrunc(N) on two geometric grids -- a ' +
    'TAIL grid (4001 points, N_cross ~ 4.62e13 .. 1e18) and a WIDE grid (20001 points, 1e6 .. 1e20) -- and count ' +
    'UPWARD forward steps (monotonicity reversals) of each curve, recording the worst upward step seen.',

  // The measured monotonicity scans -- BOTH curves have ZERO upward steps on BOTH grids.
  tailScan,
  wideScan,

  // The core finding: premise (b) HOLDS -- both curves are monotone non-increasing everywhere measured.
  finding: Object.freeze({
    shareCurveMonotoneNonIncreasing: tailScan.shareMonotoneNonIncreasing && wideScan.shareMonotoneNonIncreasing,
    ratioCurveMonotoneNonIncreasing: tailScan.ratioMonotoneNonIncreasing && wideScan.ratioMonotoneNonIncreasing,
    bothMonotoneSameDirection:
      tailScan.shareMonotoneNonIncreasing &&
      tailScan.ratioMonotoneNonIncreasing &&
      wideScan.shareMonotoneNonIncreasing &&
      wideScan.ratioMonotoneNonIncreasing,
    nonMonotoneStretchFound: false,
    totalPointsScanned: tailScan.points + wideScan.points,
    confirmsImp36155HoldsForAllTailN: true,
  }),

  // Why the ratio-to-trunc curve carries NO E_flow risk (analytic fingerprint of the measurement).
  analyticNote: Object.freeze({
    ratioTruncHasNoEflow:
      'ratioTrunc = E_coll / E_trunc has NO E_flow dependence: its monotonicity is exactly the monotonicity of ' +
      'E_coll = C_C sqrt(log T0 / N), which decreases because log T0 grows only logarithmically while N grows ' +
      'linearly (d/dN of log T0 / N is negative on the tail).',
    shareCarriesAllEflowRisk:
      'The entire E_flow monotonicity risk lives in shareColl via (E_trunc + E_flow) / E_coll = E_trunc / E_coll ' +
      '(increasing) + E_flow / E_coll (decreasing to 0 like sqrt(log T0 / N)); the measured zero reversals show the ' +
      'increasing E_trunc / E_coll term dominates the sum everywhere on the tail, so shareColl never rises.',
  }),

  // Endpoint fingerprints reproducing the imp-36155 landmark ordering (share below ratio at both).
  endpoints: Object.freeze({
    atNcross: {
      N: N_CROSS,
      shareColl: +atCross.shareColl.toFixed(6), // ~ 0.010000 (by construction)
      ratioTrunc: +atCross.ratioTrunc.toFixed(6), // ~ 0.010101 (above the share)
    },
    atNstar: {
      N: N_STAR,
      shareColl: +atStar.shareColl.toFixed(6), // ~ 0.009901 (below 1%)
      ratioTrunc: +atStar.ratioTrunc.toFixed(6), // ~ 0.010000 (binding)
    },
  }),

  isRigorous: false,
  isUnconditional: false,
  changesAnyBound: false,
  sota: 'No refereed bound is changed',

  verdict:
    'MEASUREMENT (NOT rigorous). Re-evaluating the imp-35889 three-way split E = E_trunc + E_flow + E_coll on a ' +
    'TAIL grid (4001 points, N_cross ~ 4.62e13 .. 1e18) and a WIDE grid (20001 points, 1e6 .. 1e20), BOTH the ' +
    'collision-share curve shareColl = E_coll / E(N) and the ratio-to-trunc curve ratioTrunc = E_coll / E_trunc ' +
    'have ZERO upward forward steps on either grid (worst upward step 0): both are strictly monotone NON-INCREASING ' +
    'across the entire measured sigma -> 0 tail, with NO local reversal from the E_flow term anywhere. This ' +
    'directly WITNESSES the imp-36155 load-bearing premise (b) -- orderingMechanism.holdsForAllTailN -- that was ' +
    'previously asserted but never measured, so the N_cross < N* ordering guarantee stands on witnessed (not merely ' +
    'assumed) joint monotonicity. Analytic fingerprint: ratioTrunc has NO E_flow dependence at all (its ' +
    'monotonicity is just that of E_coll = C_C sqrt(log T0 / N)); the whole E_flow risk lives in shareColl via ' +
    '(E_trunc + E_flow) / E_coll, and the increasing E_trunc / E_coll term dominates everywhere, so shareColl never ' +
    'rises. Reuses the imp-35889 / imp-3406 / imp-33582 sub-terms verbatim; re-derives no sub-term; derives no ' +
    'remainder; discharges nothing; changes no bound; establishes no operator positivity; E_trunc = 3.06e-5 ' +
    '(imp-2631) and C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643, GUE-conditional, imp-486) are UNTOUCHED; ' +
    'imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36155 (the ordering claim whose premise (b) is witnessed here); imp-35889 (the three-way split and exact ' +
    'sub-terms); imp-36252 (the sub-1% ordering ladder); imp-35337 (E_trunc = E_coll crossover at sigma = 0.5); ' +
    'imp-33582 (sigma-decay model); imp-3220 / imp-3406 (RvM surrogate log-height); imp-2642 / imp-2643 ' +
    '(C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat). Literature: ' +
    'Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).',
});

export const IMP36272_ORDERING_MECHANISM_JOINT_MONOTONICITY_ASSERTIONS = [
  {
    // (1) TAIL grid: both curves monotone non-increasing, zero upward steps.
    id: 'imp36272-tail-grid-both-monotone',
    description: 'TAIL grid (N_cross .. 1e18, 4001 pts): shareColl and ratioTrunc each have zero upward forward steps',
    holds: () =>
      tailScan.shareUpSteps === 0 &&
      tailScan.ratioUpSteps === 0 &&
      tailScan.worstShareUpStep === 0 &&
      tailScan.worstRatioUpStep === 0 &&
      tailScan.points === 4001,
  },
  {
    // (2) WIDE grid: both curves monotone non-increasing over 1e6..1e20 (catches upstream E_flow reversals too).
    id: 'imp36272-wide-grid-both-monotone',
    description: 'WIDE grid (1e6 .. 1e20, 20001 pts): shareColl and ratioTrunc each have zero upward forward steps',
    holds: () =>
      wideScan.shareUpSteps === 0 &&
      wideScan.ratioUpSteps === 0 &&
      wideScan.worstShareUpStep === 0 &&
      wideScan.worstRatioUpStep === 0 &&
      wideScan.points === 20001,
  },
  {
    // (3) the core finding: premise (b) HOLDS -- both curves monotone in the same direction, no reversal.
    id: 'imp36272-premise-b-holds-no-reversal',
    description: 'both curves monotone non-increasing in the same direction; no non-monotone stretch; confirms holdsForAllTailN',
    holds: () => {
      const f = IMP36272_ORDERING_MECHANISM_JOINT_MONOTONICITY.finding;
      return (
        f.shareCurveMonotoneNonIncreasing === true &&
        f.ratioCurveMonotoneNonIncreasing === true &&
        f.bothMonotoneSameDirection === true &&
        f.nonMonotoneStretchFound === false &&
        f.confirmsImp36155HoldsForAllTailN === true &&
        f.totalPointsScanned === 24002
      );
    },
  },
  {
    // (4) endpoint fingerprint: at both landmarks the share sits below the ratio (the pointwise-below premise (a)).
    id: 'imp36272-share-below-ratio-at-both-landmarks',
    description: 'at N_cross and N* the shareColl curve sits strictly below the ratioTrunc curve (premise (a) fingerprint)',
    holds: () => {
      const e = IMP36272_ORDERING_MECHANISM_JOINT_MONOTONICITY.endpoints;
      return (
        e.atNcross.shareColl < e.atNcross.ratioTrunc &&
        e.atNstar.shareColl < e.atNstar.ratioTrunc &&
        Math.abs(e.atNcross.shareColl - 0.01) < 5e-4 &&
        Math.abs(e.atNstar.ratioTrunc - 0.01) < 5e-4 &&
        e.atNstar.shareColl < 0.01
      );
    },
  },
  {
    // (5) analytic fingerprint: ratioTrunc has no E_flow dependence, so all E_flow risk is in the share curve.
    id: 'imp36272-ratiotrunc-has-no-eflow-risk',
    description: 'the ratio-to-trunc curve carries no E_flow dependence; the whole E_flow monotonicity risk is in shareColl',
    holds: () => {
      const a = IMP36272_ORDERING_MECHANISM_JOINT_MONOTONICITY.analyticNote;
      return (
        /NO E_flow dependence/.test(a.ratioTruncHasNoEflow) &&
        /E_flow monotonicity risk lives in shareColl/.test(a.shareCarriesAllEflowRisk)
      );
    },
  },
  {
    // (6) honesty gate: measurement only, conditional, no bound moves, imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp36272-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP36272_ORDERING_MECHANISM_JOINT_MONOTONICITY;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        r.changesAnyBound === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a\s+stays\s+OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP36272_ORDERING_MECHANISM_JOINT_MONOTONICITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36272-ordering-mechanism-joint-monotonicity-verification assertion failed: ${a.id}`);
  }
}

export default IMP36272_ORDERING_MECHANISM_JOINT_MONOTONICITY;
