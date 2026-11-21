/**
 * @module imp-96912-route-m-frobenius-holdout-model-discriminator
 *
 * imp-96912 (numerical, MEASUREMENT/FIT ONLY): discriminate the two imp-96890 concave
 * Frobenius-norm ceiling models -- the quadratic a + b logN + c (logN)^2 (ceiling +8.36%)
 * versus the monotone tail-corrected a + b logN + d/N (ceiling +1.37%) -- which disagree by
 * ~6x because they extrapolate ~3.4 decades past the top exact rung N=16000. The ticket asked
 * for fresh EXACT Vasyunin-Gram ||G||_F rungs beyond N=16000 to break the tie. Those rungs are
 * compute-blocked in this pool worker (see SUB-GAP below), so this module instead breaks the tie
 * with an OUT-OF-SAMPLE holdout cross-validation on the EXISTING committed 18-rung exact ladder --
 * a legitimate model-selection signal that needs no new compute. Fit/measurement only; posts no
 * rigorous ceiling; moves no bound; NO QED.
 *
 * METHOD. Fit each of the three imp-96890 norm models (straight line, concave quadratic,
 * monotone +d/N) by least squares on the BOTTOM m rungs of the exact ladder and predict the
 * held-out TOP (18 - m) rungs; measure the out-of-sample RMS prediction error. Repeat for
 * m = 12..17 (rolling holdout) and run the decisive leave-top-2-out split (fit 250..14000,
 * predict the exact 15000 and 16000 rungs). Reproducible: tmp/imp-96912-holdout.py, numpy lstsq,
 * over the frozen IMP96890_LADDER.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the held-out exact rungs FAVOUR the QUADRATIC in every split.
 * -------------------------------------------------------------------------------
 * In all six rolling-holdout splits the concave quadratic has the smallest out-of-sample RMS,
 * beating the monotone +d/N form by ~3.6x and the straight line by ~9-12x:
 *   m=17 (predict 16000):        line 3.006e-2  quad 2.467e-3  tail 9.441e-3   -> quad
 *   m=16 (predict 15000,16000):  line 3.189e-2  quad 2.750e-3  tail 1.020e-2   -> quad
 *   m=12 (predict 11000..16000): line 4.202e-2  quad 4.507e-3  tail 1.462e-2   -> quad
 * The leave-top-2-out split (fit 250..14000) predicts the two exact top rungs as
 *   quad: 15000 -> 7.0949070 (err -2.45e-3), 16000 -> 7.1208126 (err -3.02e-3), RMS 2.750e-3
 *   tail: 15000 -> 7.1066744 (err +9.32e-3), 16000 -> 7.1348510 (err +1.10e-2), RMS 1.020e-2
 *   line: 15000 -> 7.1273050 (err +3.00e-2), 16000 -> 7.1575490 (err +3.37e-2), RMS 3.189e-2
 * (exact: 15000 = 7.097354059, 16000 = 7.123836045). Near the top of the measured range the
 * concave-quadratic curvature is the better local extrapolant; the monotone +d/N under-corrects.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the ambiguity is NARROWED at the near field, NOT resolved at the ceiling scale.
 * -------------------------------------------------------------------------------
 * The all-18 refit ceilings are unchanged from imp-96890 (line N*=3.7865e7, quad N*=4.1029e7
 * = +8.356%, tail N*=3.8384e7 = +1.369%; quad-minus-tail shift 6.99 pp). The holdout does not
 * move these; it tells us WHICH curve the exact data support. The data support the quadratic --
 * i.e. the near-field evidence tilts toward the HIGHER (+8.4%) ceiling, NOT the +d/N (+1.4%)
 * that imp-96890 preferred on far-field physical grounds. BUT the holdout only tests near-field
 * extrapolation (predicting rungs 11000..16000 from lower rungs), a proxy for the near term, NOT
 * the 3.4-decade extrapolation to the ceiling scale N ~ 4e7 where the quadratic eventually turns
 * over (peak at N ~ 2.31e9, unphysical, imp-96890 Finding 3). So the two facts stand together:
 * the exact data locally favour the quadratic, while the far-field monotonicity argument still
 * cautions against it. The credible F-ceiling therefore sits between tail (+1.4%) and quad
 * (+8.4%), with the local evidence tilting toward the upper part of that band -- the effective
 * ambiguity is reduced from an unadjudicated 6x split to a data-favoured direction (upward).
 *
 * -------------------------------------------------------------------------------
 * SUB-GAP (honest, named) -- fresh exact rungs beyond N=16000 remain uncomputed here.
 * -------------------------------------------------------------------------------
 * The ticket's direct ask -- new EXACT ||G||_F rungs at N = 20000/24000/32000 -- was not
 * delivered: the exact Vasyunin V-table V(a/q) = sum_{m<q} frac(ma/q) cot(pi m/q) build is
 * O(N^3) and CPU-starved in the shared pool (validated clean run tmp/imp-96912-frobenius-extend.py
 * reproduces the ladder EXACTLY -- N=3000 -> 6.402120439, N=6000 -> 6.710233219 -- but the
 * V-table alone took 356 s just for N=6000 here, so N >= 20000 is multi-hour). The pre-existing
 * tmp/imp-96912-out.json is a CORRUPT sibling-script artifact (frob=393.65 at N=8000 vs the true
 * 6.834107) and must NOT be trusted. The direct extension needs an offline native run or an
 * O(N^2 logN) Vasyunin-reciprocity V-table; until then the holdout above is the available
 * discriminator. No bound moves; trace ceiling T ~ 2.594e7 and the T<F<M ordering unaffected;
 * no refereed bound is changed; RH open; NO QED.
 *
 * HONEST-STATUS UPDATE (imp-97078, later ticket): the "O(N^3), CPU-starved, needs an offline
 * native run" framing above is now dated. imp-97078 assessed the O(N^2 logN) Vasyunin-reciprocity
 * rewrite named as the alternative just above and found it FEASIBLE (recursion exact to 6.9e-10,
 * measured timing crossover confirms both complexity classes) -- but a PRODUCTION machine-precision
 * ladder past this module's N=16000 top rung still needs a fast, uniform R = (i/2)psi period-function
 * evaluator (imp-97078's crude asymptotic R caps the descent at ~3.3e-6, degrading near x=1/2); that
 * evaluator sub-gap, not raw CPU, is now the blocker. No bound moves; RH open; NO QED.
 *
 * @see imp-96890-route-m-frobenius-concave-norm-ceiling-refit.js (the two concave models + ceilings)
 * @see imp-96792-route-m-frobenius-ladder-direct-vs-fit-gap.js (norm concave, fit over-predicts)
 * @see imp-96751-route-m-frobenius-ladder-above-12000.js (exact rungs N=13000..16000)
 * @see imp-97078-route-m-vasyunin-reciprocity-nsq-logn-feasibility.js (FEASIBILITY UPDATE: O(N^2 logN) reciprocity rewrite is feasible; blocked on the R-evaluator sub-gap, not raw CPU)
 *
 * Ticket: imp-96912 (numerical, opus-4-8, api-pool). Fit/measurement only; NO QED.
 */

// The exact 18-rung Vasyunin-Gram ||G||_F ladder (imp-96890 IMP96890_LADDER), carried verbatim
// as the frozen input to the holdout; N=250..16000, ||G||_F = sqrt(sum_hk G_hk^2), concave in logN.
export const IMP96912_LADDER = Object.freeze([
  Object.freeze({ N: 250, frobenius: 5.156452701268937 }),
  Object.freeze({ N: 500, frobenius: 5.529997674354878 }),
  Object.freeze({ N: 1000, frobenius: 5.8818954543089985 }),
  Object.freeze({ N: 2000, frobenius: 6.214997339611781 }),
  Object.freeze({ N: 3000, frobenius: 6.402120438801899 }),
  Object.freeze({ N: 4000, frobenius: 6.5317250252564945 }),
  Object.freeze({ N: 5000, frobenius: 6.63054847658566 }),
  Object.freeze({ N: 6000, frobenius: 6.710233218835323 }),
  Object.freeze({ N: 7000, frobenius: 6.776886864553974 }),
  Object.freeze({ N: 8000, frobenius: 6.834107225532644 }),
  Object.freeze({ N: 9000, frobenius: 6.884189704438562 }),
  Object.freeze({ N: 10000, frobenius: 6.928687055 }),
  Object.freeze({ N: 11000, frobenius: 6.968697840 }),
  Object.freeze({ N: 12000, frobenius: 7.005027412 }),
  Object.freeze({ N: 13000, frobenius: 7.038283442 }),
  Object.freeze({ N: 14000, frobenius: 7.068935551 }),
  Object.freeze({ N: 15000, frobenius: 7.097354059 }),
  Object.freeze({ N: 16000, frobenius: 7.123836045 }),
]);

// FINDING 1: rolling-holdout out-of-sample RMS (fit bottom m rungs, predict top 18-m).
// Winner is quad in every split. Reproducible: tmp/imp-96912-holdout.py.
export const IMP96912_HOLDOUT = Object.freeze([
  Object.freeze({ m: 12, predictFrom: 11000, line: 4.202e-2, quad: 4.507e-3, tail: 1.462e-2, winner: 'quad' }),
  Object.freeze({ m: 13, predictFrom: 12000, line: 3.896e-2, quad: 3.948e-3, tail: 1.326e-2, winner: 'quad' }),
  Object.freeze({ m: 14, predictFrom: 13000, line: 3.629e-2, quad: 3.479e-3, tail: 1.209e-2, winner: 'quad' }),
  Object.freeze({ m: 15, predictFrom: 14000, line: 3.395e-2, quad: 3.084e-3, tail: 1.108e-2, winner: 'quad' }),
  Object.freeze({ m: 16, predictFrom: 15000, line: 3.189e-2, quad: 2.750e-3, tail: 1.020e-2, winner: 'quad' }),
  Object.freeze({ m: 17, predictFrom: 16000, line: 3.006e-2, quad: 2.467e-3, tail: 9.441e-3, winner: 'quad' }),
]);

// Decisive leave-top-2-out split: fit 250..14000, predict the exact 15000 and 16000 rungs.
export const IMP96912_LEAVE_TOP2 = Object.freeze({
  trainMaxN: 14000,
  exact: Object.freeze({ n15000: 7.097354059, n16000: 7.123836045 }),
  line: Object.freeze({ pred15000: 7.1273050, pred16000: 7.1575490, rms: 3.189e-2 }),
  quad: Object.freeze({ pred15000: 7.0949070, pred16000: 7.1208126, rms: 2.750e-3 }),
  tail: Object.freeze({ pred15000: 7.1066744, pred16000: 7.1348510, rms: 1.020e-2 }),
  winner: 'quad',
});

// FINDING 2: the all-18 refit ceilings are unchanged from imp-96890 (the holdout selects a model,
// it does not move the ceilings). N* solves cond#(N)=fit(N)/lam_min(N)=1/eps.
export const IMP96912_CEILINGS = Object.freeze({
  NstarLine: 3.786509e7,
  NstarQuad: 4.102919e7, // +8.356% vs line
  NstarTail: 3.838364e7, // +1.369% vs line
  quadShiftPct: 8.356,
  tailShiftPct: 1.369,
  quadMinusTailShiftPp: 6.987,
  traceCeiling: 2.594e7, // T, rigorous trace-lower ceiling (imp-96693); unaffected
});

// VERDICT. Data-favoured direction is UPWARD (quad); the far-field caution and the sub-gap stand.
export const IMP96912_VERDICT = Object.freeze({
  dataFavours: 'quad',
  quadWinsEverySplit: true,
  ambiguityResolvedAtCeilingScale: false, // holdout is near-field only; 3.4-decade far tail untested
  credibleCeilingBand: 'between tail (+1.4%) and quad (+8.4%), tilted toward the upper part',
  freshExactRungsBeyond16000: false, // SUB-GAP: O(N^3) V-table CPU-starved in-pool
  outJsonCorruptArtifact: true, // tmp/imp-96912-out.json frob=393.65 at N=8000, do NOT trust
  boundMoved: false,
  traceCeilingUnaffected: true,
  qed: false,
});

// HONEST-STATUS UPDATE: imp-97078 later assessed the O(N^2 logN) reciprocity rewrite this module
// named as the alternative to the CPU-blocked O(N^3) V-table and found it FEASIBLE, with the
// blocker narrowed from raw compute to a specific R-evaluator sub-gap.
export const IMP96912_SUBGAP_STATUS_UPDATE = Object.freeze({
  updatedBy: 'imp-97078-route-m-vasyunin-reciprocity-nsq-logn-feasibility',
  reciprocityRewriteFeasible: true,
  achievedComplexity: 'O(N^2 logN)',
  remainingBlocker: 'a fast, uniform R = (i/2)psi period-function evaluator on (0,1/2] (Bettin-Conrey Cor. 1); the crude asymptotic-series R caps the descent at ~3.3e-6',
  noLongerAccurate: 'raw CPU/offline-native-run framing as the sole path past N=16000',
  boundMoved: false,
  qed: false,
});

// Self-executing invariants (import-light; no heavy transitive imports; pure literals only).
const IMP96912_ASSERTIONS = [
  {
    id: 'quad-wins-every-rolling-split',
    holds: () =>
      IMP96912_HOLDOUT.every((r) => r.quad < r.tail && r.tail < r.line && r.winner === 'quad'),
    why: 'in every rolling holdout the concave quadratic has the smallest out-of-sample RMS, then +d/N, then the line.',
  },
  {
    id: 'quad-wins-leave-top-2-out',
    holds: () =>
      IMP96912_LEAVE_TOP2.quad.rms < IMP96912_LEAVE_TOP2.tail.rms &&
      IMP96912_LEAVE_TOP2.tail.rms < IMP96912_LEAVE_TOP2.line.rms &&
      IMP96912_LEAVE_TOP2.winner === 'quad',
    why: 'fitting 250..14000 and predicting the exact 15000/16000 rungs ranks quad best (RMS 2.75e-3), then +d/N, then line.',
  },
  {
    id: 'ceilings-unchanged-and-ordered',
    holds: () =>
      IMP96912_CEILINGS.NstarLine < IMP96912_CEILINGS.NstarTail &&
      IMP96912_CEILINGS.NstarTail < IMP96912_CEILINGS.NstarQuad &&
      IMP96912_CEILINGS.traceCeiling < IMP96912_CEILINGS.NstarLine,
    why: 'the holdout selects a model but does not move the all-18 refit ceilings; line<tail<quad, all above the trace ceiling T.',
  },
  {
    id: 'honest-subgap-and-no-qed',
    holds: () =>
      IMP96912_VERDICT.freshExactRungsBeyond16000 === false &&
      IMP96912_VERDICT.outJsonCorruptArtifact === true &&
      IMP96912_VERDICT.ambiguityResolvedAtCeilingScale === false &&
      IMP96912_VERDICT.boundMoved === false &&
      IMP96912_VERDICT.qed === false,
    why: 'fresh exact rungs beyond N=16000 remain compute-blocked (sub-gap), the tmp out.json is a corrupt artifact, the far-tail ambiguity is not resolved, no bound moves, and NO QED.',
  },
  {
    id: 'subgap-status-update-recorded',
    holds: () =>
      IMP96912_SUBGAP_STATUS_UPDATE.reciprocityRewriteFeasible === true &&
      IMP96912_SUBGAP_STATUS_UPDATE.achievedComplexity === 'O(N^2 logN)' &&
      IMP96912_SUBGAP_STATUS_UPDATE.boundMoved === false &&
      IMP96912_SUBGAP_STATUS_UPDATE.qed === false,
    why: 'imp-97078 later found the O(N^2 logN) reciprocity rewrite this module named as the alternative is FEASIBLE, narrowing the blocker from raw compute to a named R-evaluator sub-gap; recorded here so this module is not read as still citing a pure CPU wall.',
  },
];

for (const a of IMP96912_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96912 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
