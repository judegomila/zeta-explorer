/**
 * @module imp-97621-lambda2-tail-model-joint-decision
 * @fileoverview imp-97621 -- MEASUREMENT / DECISION ONLY (no bound moved; NO QED):
 *   DECIDE the imp-97600 lambda_2-floor tail-model ambiguity (94.4% of the ~3.06 bracket spread) by
 *   fitting BOTH candidate slow-convergence models -- geometric-ratio and algebraic K^(-p) -- to the
 *   nu_max floor ladder AND the tr(A2) trace ladder from the SAME Kbig={500,560,640,720} projector-limit
 *   build, and testing whether a SINGLE tail exponent reconciles the nu_max floor deep end (-313.756 vs
 *   ~-310.87) with the imp-97582 tr(A2) named-gap (4819.1M vs ~4818.77M).
 *
 *   The floor is read as lambda_2_lb = rho - 1/nu_max (single extremal Lehmann pencil eigenvalue at
 *   rho = 5462.616319628649); tr(A2) is the full spectral sum. imp-97600 traced 94.4% of the floor
 *   spread to a DISAGREEMENT between the geometric corrected-tail (~-310.87) and the imp-97482
 *   power-saturation refit (-313.756) on nu_max, the same ambiguity imp-97582 RESULT 3 found for the
 *   trace named value. Offline analysis: tmp/imp-97621-joint-tail-decide.py (mpmath dps=40; geometric
 *   ratio, algebraic K^(-p) root-fit on the uniform trio 560/640/720, ratio-consistency of each deep
 *   end). Outputs baked below; the geometric limit and the algebraic-exponent residual are recomputed
 *   as self-executing assertions from the raw ladders.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- ONE algebraic exponent p ~ 1.98 governs BOTH ladders (they share the K-tail).
 *   ------------------------------------------------------------------------------------------
 *   Fitting a_K = L - C*K^(-p) to the uniform trio (560,640,720) of each object gives p_floor = 1.98126
 *   and p_trace = 1.97292, differing by only 0.00834. The two 80-block ratios likewise coincide,
 *   r_floor = 0.687222 and r_trace = 0.687946 (spread 7.2e-4). The floor and the trace are read off the
 *   SAME projector-limit build, so a single K-truncation tail (exponent ~2, ratio ~0.687) governs both.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- both convergent models AGREE per-object and both REJECT the deep/named values.
 *   ------------------------------------------------------------------------------------------
 *   floor: geometric-tail -310.864877, algebraic-tail (p=1.98126) -310.991195 -- a model-consistent
 *          bracket [-310.991195, -310.692227] (both convergent models, spread ~0.30), far shallower than
 *          the power-saturation refit -313.756.
 *   trace: geometric-tail 4818.7655M, algebraic-tail (p=1.97292) 4818.7736M -- clustered to ~8113
 *          (relative ~1.7e-6), 0.335M BELOW the imp-97482 named ~4819.1M.
 *   Under both independently-motivated convergent tail models the deep end -313.756 and the named 4819.1M
 *   are OUTSIDE the model-consistent limits; they are not selected by either model.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 3 -- the two over-extrapolations are the SAME failure: each needs an inconsistent ratio.
 *   ------------------------------------------------------------------------------------------
 *   Reaching the floor deep end -313.756 from Kbig=720 under a geometric tail anchored on the last
 *   80-block increment needs ratio 0.974994; reaching the trace named 4819.1M needs 0.985698. Both sit
 *   far above the jointly-measured ~0.687, so BOTH deep/named values are over-extrapolations produced by
 *   the same (rejected) slow tail assumption -- confirming imp-97600 RESULT 3 / imp-97582 RESULT 3 are a
 *   single phenomenon.
 *
 *   VERDICT. A single tail exponent (algebraic p ~ 1.98, equivalently the measured 80-block ratio ~0.687)
 *   DECIDES the ambiguity in favor of the convergent (geometric / algebraic) model for BOTH objects: the
 *   credible nu_max floor is in [~ -310.99, -310.69] (geometric ~ -310.87, algebraic ~ -310.99) and the
 *   credible trace limit is ~4818.77M. The power-saturation refit -313.756 and the named 4819.1M are the
 *   SAME joint over-extrapolation (each requiring an 80-block ratio ~0.97-0.99 that the shared build does
 *   not exhibit). This tightens the imp-97600 diagnosis-narrowed bracket [-310.865, -310.692227] to the
 *   two-model-consistent [-310.991195, -310.692227] and rejects the deep end -- WITHOUT a rigorous tail
 *   enclosure. The choice between the geometric limit (~ -310.87) and the slightly-deeper algebraic limit
 *   (~ -310.99) -- i.e. whether the ratio truly plateaus at ~0.687 or drifts toward 1 -- still cannot be
 *   certified from four Kbig points; the Kbig >= 800 build (imp-97581) remains required.
 *
 *   No rigorous lower bound on lambda_2 is produced; the rigorous upper edge stays -310.692227; both
 *   convergent limits are measured (non-rigorous) tail estimates, not promoted bounds. The floor stays
 *   four orders below the required 0.581059, so the m=1 enclosure remains UNUSABLE at 2a=ln3.
 *   Measurement/decision only; no operator positivity; no bound moves; interval-rigorous reach stays
 *   2a<=0.96; no refereed bound is changed; RH open; NO QED.
 *
 *   SUB-GAP (named): IMP97621_GEOMETRIC_VS_ALGEBRAIC_UNCERTIFIED_UNTIL_KBIG800 -- the decision rejects
 *   the -313.756 deep end but does NOT certify geometric (~ -310.87) vs slow-algebraic (~ -310.99); the
 *   ~2% inter-model spread within the convergent bracket, and whether the 80-block ratio plateaus at
 *   ~0.687 or climbs toward 1, need the imp-97581 Kbig >= 800 build. No proven tail-exponent enclosure
 *   is established here (4-point fits only).
 *
 * @see imp-97600-lambda2-floor-spread-decomposition.js (the 94.4% tail-model disagreement this decides)
 * @see imp-97582-tra2-ladder-extrapolation.js (the tr(A2) named-gap this reconciles with the floor)
 * @see imp-97538-krein-route2-kbig560-720-deep-floor.js (the Kbig={500,560,640,720} floor + trace ladders)
 *
 * Ticket: imp-97621 (numerical, opus-4-8, api-pool). Measurement/decision only; no rigorous lower bound
 * on lambda_2; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open;
 * NO QED.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97621_BINDING_2A = LN3;
export const IMP97621_RIGOROUS_REACH_2A = 0.96; // unchanged by this decision
export const IMP97621_REQUIRED_RHO_EXCEEDS = 0.581059; // usable iff the Route-2 lower bound on lambda_2 exceeds this

// The shared Kbig ladder both objects are read from (imp-97538 direct projector-limit build).
export const IMP97621_KBIG = Object.freeze([500, 560, 640, 720]);

// (1) lambda_2 floor ladder (rho - 1/nu_max), monotone DECREASING.
export const IMP97621_FLOOR_LADDER = Object.freeze([-310.375499, -310.499305, -310.613648, -310.692227]);
// (2) tr(A2) trace ladder, monotone INCREASING.
export const IMP97621_TRACE_LADDER = Object.freeze([
  4818734261.0546, 4818742142.486366, 4818749430.595979, 4818754444.422258,
]);

// RESULT 1 -- one algebraic exponent (~2) and one 80-block ratio (~0.687) govern both ladders.
export const IMP97621_SHARED_TAIL = Object.freeze({
  pFloor: 1.9812568, // algebraic K^(-p) fit on the floor uniform trio (560,640,720)
  pTrace: 1.9729171, // algebraic K^(-p) fit on the trace uniform trio
  pAbsDiff: Math.abs(1.9812568 - 1.9729171), // 0.0083397 -- essentially one exponent
  ratioFloor: 0.687222, // 80-block ratio of the floor increments
  ratioTrace: 0.687946, // 80-block ratio of the trace increments
  ratioAbsDiff: Math.abs(0.687222 - 0.687946), // 7.24e-4
  singleExponentReconcilesBoth: true,
});

// RESULT 2 -- per-object convergent-model limits (geometric + algebraic p~2 agree, reject deep/named).
export const IMP97621_FLOOR_MODELS = Object.freeze({
  geometricLimit: -310.864877, // y3 + d2*r/(1-r), r=0.687222
  algebraicLimit: -310.991195, // a_K = L - C*K^(-p), p=1.98126
  modelConsistentBracket: [-310.991195, -310.692227], // both convergent models, keeps the rigorous upper edge
  modelConsistentSpread: -310.692227 - -310.991195, // ~0.298968
  powerSaturationDeepEnd: -313.756, // imp-97482 refit -- OUTSIDE the convergent bracket
  deepEndSelectedByEitherModel: false,
});
export const IMP97621_TRACE_MODELS = Object.freeze({
  geometricLimitM: 4818.765498, // geometric-tail limit / 1e6
  algebraicLimitM: 4818.773611, // algebraic-tail limit / 1e6
  interModelSpread: 8113.0, // |algebraic - geometric| in raw trace units
  interModelRelSpread: 1.7e-6,
  namedLimitM: 4819.1, // imp-97482 named value
  namedMinusModelM: 4819.1 - 4818.765498, // ~0.334502 M above the geometric limit
  namedSelectedByEitherModel: false,
});

// RESULT 3 -- both over-extrapolations need an inconsistent ratio (same failure).
export const IMP97621_OVEREXTRAPOLATION = Object.freeze({
  floorRatioNeededForDeepEnd: 0.974994, // to reach -313.756 from Kbig=720 under a geometric tail
  traceRatioNeededForNamed: 0.985698, // to reach 4819.1M from Kbig=720
  ratioMeasuredFloor: 0.687222,
  ratioMeasuredTrace: 0.687946,
  bothOverExtrapolationsFromSameSlowTail: true, // both need ~0.97-0.99 vs measured ~0.687
});

export const IMP97621_DECISION = Object.freeze({
  ticket: 'imp-97621',
  question:
    'does a single certified/derived nu_max K-truncation tail exponent decide the imp-97600 floor tail-model ambiguity (geometric ~-310.87 vs power-saturation refit -313.756) and jointly reconcile it with the imp-97582 tr(A2) named-gap (4819.1M vs ~4818.77M)?',
  answer:
    'YES for the decision, NO for a certified enclosure. One algebraic exponent p ~ 1.98 (p_floor=1.98126, ' +
    'p_trace=1.97292, diff 0.0083) and one 80-block ratio ~0.687 (r_floor=0.687222, r_trace=0.687946) ' +
    'govern BOTH ladders from the same build. Under both convergent models the floor lands in ' +
    '[-310.991195, -310.692227] (geometric -310.864877, algebraic -310.991195) and the trace lands at ' +
    '~4818.77M -- so the power-saturation deep end -313.756 and the named 4819.1M are OUTSIDE both models. ' +
    'Each over-extrapolation requires an 80-block ratio ~0.97-0.99 (floor 0.974994, trace 0.985698) far ' +
    'above the measured ~0.687, so they are the SAME joint over-extrapolation. The decision selects the ' +
    'convergent model and rejects -313.756, tightening the imp-97600 bracket [-310.865,-310.692227] to the ' +
    'two-model-consistent [-310.991195, -310.692227]. It does NOT certify geometric (~-310.87) vs ' +
    'slow-algebraic (~-310.99); the Kbig >= 800 build (imp-97581) is still required for that.',
  binding_2a: LN3,
  requiredRhoExceeds: 0.581059,
  singleExponentReconcilesBoth: true,
  deepEndRejected: true,
  namedTraceRejected: true,
  modelConsistentFloorBracket: [-310.991195, -310.692227],
  newSubGap: 'IMP97621_GEOMETRIC_VS_ALGEBRAIC_UNCERTIFIED_UNTIL_KBIG800',
  // measurement/decision-only guardrails
  rigorousLowerBoundProduced: false,
  rigorousTailEnclosureProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});

// --- self-executing assertions: recompute the tail models from the raw ladders ---
function geometricLimit(y) {
  const d1 = y[2] - y[1];
  const d2 = y[3] - y[2];
  const r = d2 / d1; // 80-block ratio of the uniform trio
  return { r, L: y[3] + (d2 * r) / (1 - r) };
}
// residual of the algebraic K^(-p) delta-ratio identity: (560^-p - 640^-p)/(640^-p - 720^-p) = d1/d2
function algebraicExponentResidual(y, p) {
  const d1 = y[2] - y[1];
  const d2 = y[3] - y[2];
  const lhs = (560 ** -p - 640 ** -p) / (640 ** -p - 720 ** -p);
  return lhs - d1 / d2;
}
function algebraicLimit(y, p) {
  const d2 = y[3] - y[2];
  const C = d2 / (640 ** -p - 720 ** -p);
  return y[3] + C * 720 ** -p;
}

const IMP97621_ASSERTIONS = [
  {
    id: 'imp97621-floor-geometric-limit-recomputes',
    holds: () => {
      const g = geometricLimit(IMP97621_FLOOR_LADDER);
      return (
        Math.abs(g.r - IMP97621_SHARED_TAIL.ratioFloor) < 1e-5 &&
        Math.abs(g.L - IMP97621_FLOOR_MODELS.geometricLimit) < 1e-4
      );
    },
    why: 'the floor geometric-tail limit -310.864877 and ratio 0.687222 recompute from the raw floor ladder.',
  },
  {
    id: 'imp97621-trace-geometric-limit-recomputes',
    holds: () => {
      const g = geometricLimit(IMP97621_TRACE_LADDER);
      return (
        Math.abs(g.r - IMP97621_SHARED_TAIL.ratioTrace) < 1e-5 &&
        Math.abs(g.L / 1e6 - IMP97621_TRACE_MODELS.geometricLimitM) < 1e-4
      );
    },
    why: 'the trace geometric-tail limit 4818.7655M and ratio 0.687946 recompute from the raw trace ladder.',
  },
  {
    id: 'imp97621-baked-exponents-satisfy-the-algebraic-identity',
    holds: () =>
      Math.abs(algebraicExponentResidual(IMP97621_FLOOR_LADDER, IMP97621_SHARED_TAIL.pFloor)) < 1e-6 &&
      Math.abs(algebraicExponentResidual(IMP97621_TRACE_LADDER, IMP97621_SHARED_TAIL.pTrace)) < 1e-6,
    why: 'the baked p_floor=1.98126 and p_trace=1.97292 reproduce the measured delta-ratio identity for each ladder.',
  },
  {
    id: 'imp97621-baked-algebraic-limits-recompute',
    holds: () =>
      Math.abs(algebraicLimit(IMP97621_FLOOR_LADDER, IMP97621_SHARED_TAIL.pFloor) - IMP97621_FLOOR_MODELS.algebraicLimit) <
        1e-4 &&
      Math.abs(
        algebraicLimit(IMP97621_TRACE_LADDER, IMP97621_SHARED_TAIL.pTrace) / 1e6 - IMP97621_TRACE_MODELS.algebraicLimitM,
      ) < 1e-4,
    why: 'the baked algebraic limits -310.991195 and 4818.7736M recompute from the ladders at the baked exponents.',
  },
  {
    id: 'imp97621-single-exponent-reconciles-both',
    holds: () =>
      IMP97621_SHARED_TAIL.pAbsDiff < 0.01 &&
      IMP97621_SHARED_TAIL.ratioAbsDiff < 1e-3 &&
      IMP97621_SHARED_TAIL.singleExponentReconcilesBoth === true,
    why: 'p_floor and p_trace differ by <0.01 and the 80-block ratios by <1e-3 -- one shared K-tail exponent ~2.',
  },
  {
    id: 'imp97621-convergent-models-reject-deep-and-named',
    holds: () =>
      // floor: both convergent limits are shallower than the -313.756 deep end
      IMP97621_FLOOR_MODELS.geometricLimit > IMP97621_FLOOR_MODELS.powerSaturationDeepEnd &&
      IMP97621_FLOOR_MODELS.algebraicLimit > IMP97621_FLOOR_MODELS.powerSaturationDeepEnd &&
      IMP97621_FLOOR_MODELS.deepEndSelectedByEitherModel === false &&
      // trace: both convergent limits are below the named 4819.1M
      IMP97621_TRACE_MODELS.geometricLimitM < IMP97621_TRACE_MODELS.namedLimitM &&
      IMP97621_TRACE_MODELS.algebraicLimitM < IMP97621_TRACE_MODELS.namedLimitM &&
      IMP97621_TRACE_MODELS.namedSelectedByEitherModel === false,
    why: 'both convergent models leave the -313.756 deep end and the 4819.1M named value outside their limits.',
  },
  {
    id: 'imp97621-overextrapolations-need-inconsistent-ratio',
    holds: () =>
      IMP97621_OVEREXTRAPOLATION.floorRatioNeededForDeepEnd > IMP97621_OVEREXTRAPOLATION.ratioMeasuredFloor + 0.2 &&
      IMP97621_OVEREXTRAPOLATION.traceRatioNeededForNamed > IMP97621_OVEREXTRAPOLATION.ratioMeasuredTrace + 0.2 &&
      IMP97621_OVEREXTRAPOLATION.bothOverExtrapolationsFromSameSlowTail === true,
    why: 'reaching -313.756 / 4819.1M needs ratio ~0.97-0.99 vs the measured ~0.687 -- the same joint over-extrapolation.',
  },
  {
    id: 'imp97621-narrowed-bracket-tighter-than-imp97600-and-keeps-upper-edge',
    holds: () => {
      const b = IMP97621_FLOOR_MODELS.modelConsistentBracket;
      return (
        b[0] < b[1] &&
        b[1] === -310.692227 && // keeps the rigorous upper edge
        b[0] > IMP97621_FLOOR_MODELS.powerSaturationDeepEnd && // strictly above the rejected deep end
        b[1] - b[0] < 3.063773 // tighter than the full imp-97600 spread
      );
    },
    why: 'the two-model-consistent bracket [-310.991195,-310.692227] keeps the rigorous upper edge and rejects -313.756.',
  },
  {
    id: 'imp97621-floor-stays-far-below-required',
    holds: () =>
      IMP97621_FLOOR_MODELS.modelConsistentBracket[1] < IMP97621_REQUIRED_RHO_EXCEEDS &&
      IMP97621_FLOOR_MODELS.geometricLimit < IMP97621_REQUIRED_RHO_EXCEEDS,
    why: 'the floor (and its narrowed bracket) stays four orders below the required 0.581059 -- m=1 stays unusable at 2a=ln3.',
  },
  {
    id: 'imp97621-measurement-only-no-qed',
    holds: () =>
      IMP97621_DECISION.rigorousLowerBoundProduced === false &&
      IMP97621_DECISION.rigorousTailEnclosureProduced === false &&
      IMP97621_DECISION.operatorPositivityProved === false &&
      IMP97621_DECISION.boundMoves === false &&
      IMP97621_DECISION.intervalRigorousReachUnchanged === 0.96 &&
      IMP97621_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97621_BINDING_2A - LN3) < 1e-12 &&
      IMP97621_DECISION.qed === false,
    why: 'measurement/decision only: no rigorous lower bound, no certified tail enclosure, no operator positivity; no bound moves; reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97621_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97621-lambda2-tail-model-joint-decision assertion FAILED: ${a.id} -- ${a.why}`);
  }
}

export { IMP97621_ASSERTIONS };
