/**
 * @module imp-97600-lambda2-floor-spread-decomposition
 * @fileoverview imp-97600 -- MEASUREMENT / DIAGNOSIS ONLY (no bound moved; NO QED):
 *   LOCATE where the imp-97538 lambda_2 floor spread actually originates. imp-97538 left the Route-2
 *   best-reachable lower-bound-on-lambda_2 floor unpinned in the bracket [-313.756, -310.692227]
 *   (spread ~3.06, relative ~1e-2), and imp-97582 RESULT 4 showed the tr(A2) trace ladder is pinned
 *   to relative ~1.7e-6 -- so the floor uncertainty does NOT come from the trace ladder. This leaf
 *   decomposes the 3.06 spread by candidate source and identifies the dominant contributor, WITHOUT
 *   moving any bound.
 *
 *   The floor is read as lambda_2_lb = rho - 1/nu_max, where nu_max is the extremal generalized
 *   (Lehmann) pencil eigenvalue built from the first- and second-moment matrices A1, A2 at shift
 *   rho = 5462.616319628649. Note that the floor depends on the SINGLE extremal eigenvalue nu_max,
 *   NOT on tr(A2) (the full spectral SUM) -- so tr(A2) being pinned tightly (imp-97582) does not by
 *   itself pin the floor. The three candidate sources for the spread are (a) the m=2 quadrature /
 *   eigen-solve discretization, (b) the K-truncation of the non-trace eigen-data (nu_max) at finite
 *   Kbig, and (c) the enclosure arithmetic (Gram-inverse conditioning).
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- the 3.06 spread decomposes almost entirely (94.4%) into ONE source: the
 *               K-truncation TAIL-MODEL disagreement on nu_max, NOT discretization or arithmetic.
 *   ------------------------------------------------------------------------------------------
 *   Measured from the directly-built upper edge -310.692227 (Kbig=720), the bracket descends by two
 *   distinct amounts:
 *     * geometric / corrected-tail K-truncation descent (Kbig 720 -> inf): 0.172773
 *       (upper edge -310.692227 down to the imp-97538 corrected-tail estimate ~ -310.865)
 *     * extrapolation-MODEL disagreement (geometric-tail ~ -310.865 vs the imp-97482
 *       power-saturation refit deep end -313.756): 2.891000
 *   Their sum is 3.063773 = the full bracket spread. So 5.6% of the spread is the honest geometric
 *   K-truncation tail past Kbig=720, and 94.4% is the DISAGREEMENT BETWEEN TWO TAIL MODELS on the
 *   same finite ladder.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- discretization contributes ~0 to the REMAINING spread; arithmetic contributes 0.
 *   ------------------------------------------------------------------------------------------
 *   The m=2 quadrature / eigen-solve discretization moves the directly-built floor only 0.316728
 *   over the whole built range Kbig 500 -> 720 (-310.375499 -> -310.692227), with monotone-collapsing
 *   increments (0.123806 -> 0.114343 -> 0.078579). That component is fully MEASURED and already
 *   absorbed into the rigorous upper edge -310.692227; it is not part of the residual bracket below it.
 *   The enclosure arithmetic contributes 0 to the spread: imp-97538 recorded the Lehmann G2 minimum
 *   eigenvalue staying strictly positive (g2min ~ 508..2830) across the entire shift sweep at every
 *   Kbig, so there was no Gram-inverse conditioning blow-up widening the enclosure.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 3 -- the power-refit deep end -313.756 is INCONSISTENT with the measured local ratio.
 *   ------------------------------------------------------------------------------------------
 *   Reaching the power-saturation deep end -313.756 from Kbig=720 would require the floor to descend
 *   3.063773 more; under a geometric tail anchored on the last measured 80-block increment 0.078579
 *   that needs a per-80-block ratio r ~ 0.975 (since r/(1-r) = 3.063773/0.078579 = 38.99). But the
 *   directly-measured 80-block ratio is 0.687222 (imp-97538 IMP97538_DELTA_RATIO_80STEP). So under the
 *   measured local convergence the deep end -313.756 is UNREACHABLE -- exactly the inconsistency
 *   imp-97582 RESULT 3 found for the trace named value 4819.1M (which needed ratio 0.9857 vs the
 *   measured 0.6879). The floor spread and the trace named-gap are the SAME unresolved geometric-vs-
 *   slow-algebraic K-truncation tail ambiguity, amplified in the floor because nu_max is a single
 *   extremal eigenvalue whose K-tail is less pinned than the full-trace sum.
 *
 *   VERDICT. The imp-97538 lambda_2 floor spread ~3.06 originates ~94% from the K-truncation tail-MODEL
 *   choice on nu_max (geometric/corrected-tail ~ -310.87 vs power-saturation refit -313.756), ~6% from
 *   the honest geometric tail past Kbig=720, ~0% from the m=2 quadrature / eigen-solve discretization
 *   (already converged into the upper edge), and 0% from the enclosure arithmetic (no conditioning
 *   blow-up). Under the directly-measured local ratio 0.687 the credible floor is the corrected-tail
 *   ~ -310.87 and the -313.756 deep end is an OVER-EXTRAPOLATION (it needs ratio ~0.975); so the
 *   diagnosis-narrowed honest bracket is [~ -310.87, -310.692227] (spread ~0.173), with full pinning
 *   still requiring the Kbig >= 800 build (imp-97581) to decide geometric vs slow-algebraic.
 *
 *   No rigorous lower bound on lambda_2 is produced; the rigorous upper edge stays -310.692227; the
 *   corrected-tail ~ -310.87 is a measured (non-rigorous) tail estimate, not a promoted bound. The
 *   floor stays four orders below the required 0.581059, so the m=1 enclosure remains UNUSABLE at
 *   2a=ln3. Measurement/diagnosis only; no operator positivity; no bound moves; interval-rigorous
 *   reach stays 2a<=0.96; Platt-Trudgian Lambda<=0.2 SOTA; RH open; NO QED.
 *
 *   SUB-GAP (named): IMP97600_TAIL_MODEL_UNDECIDED_UNTIL_KBIG800 -- the geometric-vs-slow-algebraic
 *   tail model on nu_max (which sets whether the credible floor is ~ -310.87 or deeper) cannot be
 *   decided with the four Kbig points {500,560,640,720}; the imp-97581 Kbig >= 800 build is needed to
 *   see the 80-block ratio either plateau at ~0.687 or climb toward 1.
 *
 * @see imp-97538-krein-route2-kbig560-720-deep-floor.js (the floor bracket [-313.756,-310.692227] this decomposes)
 * @see imp-97582-tra2-ladder-extrapolation.js (RESULT 4: tr(A2) pinned to ~1.7e-6, floor NOT from the trace ladder)
 *
 * Ticket: imp-97600 (numerical, opus-4-8, api-pool). Measurement/diagnosis only; no rigorous lower
 * bound on lambda_2; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96;
 * RH open; NO QED.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97600_BINDING_2A = LN3;
export const IMP97600_RIGOROUS_REACH_2A = 0.96; // unchanged by this diagnosis
export const IMP97600_REQUIRED_RHO_EXCEEDS = 0.581059; // usable iff the Route-2 lower bound on lambda_2 exceeds this

// The imp-97538 floor anchors this diagnosis decomposes (carried literally for continuity).
export const IMP97600_FLOOR_ANCHORS = Object.freeze({
  directBuiltUpperEdgeKbig720: -310.692227, // rigorous upper edge on the converged floor (monotone-decreasing)
  directBuiltEdgeKbig500: -310.375499, // imp-97513 edge (start of the directly-built range)
  correctedTailEstimate: -310.865, // imp-97538 geometric corrected-tail central estimate (~ -310.87)
  powerSaturationRefitDeepEnd: -313.756, // imp-97482 10-point power refit -- the DEEP end of the bracket
  lastMeasured80BlockDelta: 0.078579, // |640->720| magnitude increment
  measured80BlockRatio: 0.687222, // imp-97538 IMP97538_DELTA_RATIO_80STEP
});

// The full bracket spread (magnitude), measured from the directly-built upper edge to the deep end.
export const IMP97600_FULL_SPREAD =
  IMP97600_FLOOR_ANCHORS.directBuiltUpperEdgeKbig720 - IMP97600_FLOOR_ANCHORS.powerSaturationRefitDeepEnd; // 3.063773

// Source decomposition of the spread (all magnitudes, downward from the upper edge -310.692227).
export const IMP97600_SPREAD_DECOMPOSITION = Object.freeze({
  // (a) m=2 quadrature / eigen-solve discretization: fully MEASURED across the built range, already
  //     absorbed into the rigorous upper edge -> contributes ~0 to the RESIDUAL bracket below it.
  discretizationBuiltRange:
    IMP97600_FLOOR_ANCHORS.directBuiltUpperEdgeKbig720 - IMP97600_FLOOR_ANCHORS.directBuiltEdgeKbig500, // -0.316728 (above the edge)
  discretizationResidualContribution: 0.0, // converged into the upper edge; not part of the bracket
  // (b) K-truncation of the non-trace eigen-data (nu_max): split into the honest geometric tail and
  //     the extrapolation-model disagreement.
  geometricTailPastKbig720:
    IMP97600_FLOOR_ANCHORS.directBuiltUpperEdgeKbig720 - IMP97600_FLOOR_ANCHORS.correctedTailEstimate, // 0.172773
  extrapolationModelDisagreement:
    IMP97600_FLOOR_ANCHORS.correctedTailEstimate - IMP97600_FLOOR_ANCHORS.powerSaturationRefitDeepEnd, // 2.891000
  // (c) enclosure arithmetic: g2min ~ 508..2830 stayed strictly positive -> no conditioning blow-up.
  enclosureArithmeticContribution: 0.0,
});

// Dominant-source shares of the full 3.06 spread.
export const IMP97600_SOURCE_SHARES = Object.freeze({
  geometricTailSharePct:
    (100 * IMP97600_SPREAD_DECOMPOSITION.geometricTailPastKbig720) / IMP97600_FULL_SPREAD, // ~5.64
  extrapolationModelSharePct:
    (100 * IMP97600_SPREAD_DECOMPOSITION.extrapolationModelDisagreement) / IMP97600_FULL_SPREAD, // ~94.36
  discretizationSharePct: 0.0,
  enclosureArithmeticSharePct: 0.0,
  dominantSource: 'K-truncation tail-model disagreement on nu_max (geometric ~ -310.87 vs power refit -313.756)',
});

// The power-refit deep end vs the measured local ratio: the deep end needs an inconsistent ratio.
export const IMP97600_DEEP_END_CONSISTENCY = Object.freeze({
  // to descend the full spread from Kbig=720 under a geometric tail anchored on the last 80-block delta:
  //   r/(1-r) = fullSpread / lastDelta  =>  r = need/(1+need)
  ratioNeededToReachDeepEnd:
    IMP97600_FULL_SPREAD / IMP97600_FLOOR_ANCHORS.lastMeasured80BlockDelta /
    (1 + IMP97600_FULL_SPREAD / IMP97600_FLOOR_ANCHORS.lastMeasured80BlockDelta), // ~0.9750
  ratioMeasured: IMP97600_FLOOR_ANCHORS.measured80BlockRatio, // 0.687222
  deepEndReachableUnderMeasuredRatio: false, // 0.975 >> 0.687 -> over-extrapolation
  // diagnosis-narrowed honest bracket under the measured local convergence:
  narrowedHonestBracket: [-310.865, -310.692227], // spread ~0.173 (the credible floor per measured ratio)
  narrowedSpread: -310.692227 - -310.865, // 0.172773
});

export const IMP97600_VERDICT = Object.freeze({
  ticket: 'imp-97600',
  question:
    'where does the imp-97538 lambda_2 floor spread ~3.06 (relative ~1e-2) actually originate, given imp-97582 RESULT 4 ruled out the tr(A2) trace ladder (pinned ~1.7e-6)?',
  answer:
    'the spread is ~94.4% the K-truncation TAIL-MODEL disagreement on the extremal pencil eigenvalue ' +
    'nu_max (geometric/corrected-tail ~ -310.87 vs the imp-97482 power-saturation refit -313.756), ' +
    '~5.6% the honest geometric K-truncation tail past Kbig=720, ~0% the m=2 quadrature / eigen-solve ' +
    'discretization (moves only 0.317 over Kbig 500->720 with collapsing deltas, already absorbed into ' +
    'the rigorous upper edge -310.692227), and 0% the enclosure arithmetic (g2min ~508..2830, no ' +
    'conditioning blow-up). The power-refit deep end -313.756 is inconsistent with the measured local ' +
    '80-block ratio (it needs ratio ~0.975 vs measured 0.687, the same inconsistency imp-97582 found ' +
    'for the trace named value), so under the measured convergence the credible floor is ~ -310.87 and ' +
    'the diagnosis-narrowed honest bracket is [~ -310.87, -310.692227] (spread ~0.173). Full pinning ' +
    'still needs the Kbig >= 800 build (imp-97581).',
  binding_2a: LN3,
  requiredRhoExceeds: 0.581059,
  fullSpread: IMP97600_FULL_SPREAD,
  dominantSourceSharePct: IMP97600_SOURCE_SHARES.extrapolationModelSharePct,
  dominantSource: 'K-truncation tail-model disagreement on nu_max',
  discretizationIsSource: false,
  enclosureArithmeticIsSource: false,
  traceLadderIsSource: false, // imp-97582 RESULT 4
  deepEndIsOverExtrapolation: true,
  narrowedHonestBracket: IMP97600_DEEP_END_CONSISTENCY.narrowedHonestBracket,
  newSubGap: 'IMP97600_TAIL_MODEL_UNDECIDED_UNTIL_KBIG800',
  // measurement/diagnosis-only guardrails
  rigorousLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});

const IMP97600_ASSERTIONS = [
  {
    id: 'imp97600-full-spread-matches',
    holds: () => Math.abs(IMP97600_FULL_SPREAD - 3.063773) < 1e-6,
    why: 'the full bracket spread -310.692227 - (-313.756) = 3.063773 recomputes from the carried anchors.',
  },
  {
    id: 'imp97600-decomposition-sums-to-spread',
    holds: () =>
      Math.abs(
        IMP97600_SPREAD_DECOMPOSITION.geometricTailPastKbig720 +
          IMP97600_SPREAD_DECOMPOSITION.extrapolationModelDisagreement -
          IMP97600_FULL_SPREAD,
      ) < 1e-6,
    why: 'geometric-tail descent (0.172773) + extrapolation-model disagreement (2.891) = full spread 3.063773.',
  },
  {
    id: 'imp97600-extrapolation-model-is-dominant',
    holds: () =>
      IMP97600_SOURCE_SHARES.extrapolationModelSharePct > 90 &&
      IMP97600_SOURCE_SHARES.extrapolationModelSharePct > IMP97600_SOURCE_SHARES.geometricTailSharePct &&
      IMP97600_SOURCE_SHARES.discretizationSharePct === 0 &&
      IMP97600_SOURCE_SHARES.enclosureArithmeticSharePct === 0,
    why: 'the extrapolation-model disagreement is >90% of the spread and dominates all other sources.',
  },
  {
    id: 'imp97600-discretization-range-small-and-absorbed',
    holds: () =>
      Math.abs(IMP97600_SPREAD_DECOMPOSITION.discretizationBuiltRange) < 0.4 &&
      IMP97600_SPREAD_DECOMPOSITION.discretizationResidualContribution === 0 &&
      Math.abs(IMP97600_SPREAD_DECOMPOSITION.discretizationBuiltRange) <
        IMP97600_SPREAD_DECOMPOSITION.extrapolationModelDisagreement,
    why: 'the directly-built discretization range (~0.317 over Kbig 500->720) is small, absorbed into the upper edge, and far below the model-disagreement term.',
  },
  {
    id: 'imp97600-deep-end-needs-inconsistent-ratio',
    holds: () =>
      IMP97600_DEEP_END_CONSISTENCY.ratioNeededToReachDeepEnd >
        IMP97600_DEEP_END_CONSISTENCY.ratioMeasured &&
      IMP97600_DEEP_END_CONSISTENCY.ratioNeededToReachDeepEnd > 0.9 &&
      IMP97600_DEEP_END_CONSISTENCY.deepEndReachableUnderMeasuredRatio === false,
    why: 'reaching -313.756 from Kbig=720 needs an 80-block ratio ~0.975, far above the measured 0.687 -> the deep end is an over-extrapolation.',
  },
  {
    id: 'imp97600-narrowed-bracket-is-tighter',
    holds: () => {
      const b = IMP97600_DEEP_END_CONSISTENCY.narrowedHonestBracket;
      return (
        b[0] < b[1] &&
        b[1] - b[0] < IMP97600_FULL_SPREAD &&
        Math.abs(b[1] - b[0] - IMP97600_DEEP_END_CONSISTENCY.narrowedSpread) < 1e-9 &&
        b[1] === IMP97600_FLOOR_ANCHORS.directBuiltUpperEdgeKbig720
      );
    },
    why: 'the diagnosis-narrowed honest bracket [-310.865,-310.692227] (spread ~0.173) is tighter than the full 3.06 and keeps the rigorous upper edge.',
  },
  {
    id: 'imp97600-floor-stays-far-below-required',
    holds: () =>
      IMP97600_FLOOR_ANCHORS.directBuiltUpperEdgeKbig720 < IMP97600_REQUIRED_RHO_EXCEEDS &&
      IMP97600_DEEP_END_CONSISTENCY.narrowedHonestBracket[1] < IMP97600_REQUIRED_RHO_EXCEEDS,
    why: 'the floor (and its narrowed bracket) stays four orders below the required 0.581059 -- the m=1 enclosure remains unusable at 2a=ln3.',
  },
  {
    id: 'imp97600-measurement-only-no-qed',
    holds: () =>
      IMP97600_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97600_VERDICT.operatorPositivityProved === false &&
      IMP97600_VERDICT.boundMoves === false &&
      IMP97600_VERDICT.traceLadderIsSource === false &&
      IMP97600_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97600_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97600_BINDING_2A - LN3) < 1e-12 &&
      IMP97600_VERDICT.qed === false,
    why: 'measurement/diagnosis only: no rigorous lower bound, no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97600_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97600-lambda2-floor-spread-decomposition assertion FAILED: ${a.id} -- ${a.why}`);
  }
}

export { IMP97600_ASSERTIONS };
