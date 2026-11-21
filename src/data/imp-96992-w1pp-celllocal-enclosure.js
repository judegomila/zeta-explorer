/**
 * @fileoverview imp-96992 -- LEVER MEASUREMENT (numerical): assess the imp-96978 Finding 3 lever.
 * Finding 3 showed the binding second-derivative bound C2=2.5752e6 at t=16.7 is 99.2% q^2 W1PP,
 * where W1PP=32.80 is the verifier CONSTANT bound of |w1-prime-prime| and q^2=(t^2+1/4)^2 is the
 * sigma_2 double factor. It named a cell-local (interval) enclosure of |w1-prime-prime| as the fix.
 * This leaf MEASURES that enclosure at the worst band cell m=16.697 and four flanking cells, and
 * recomputes the coarse-cell penalty / flow with it. Import-light: all values below are frozen
 * literals from tmp/imp-96992-w1pp-celllocal.py (mpmath dps=40 polygamma + the verify4 |w1|,|w1-prime|
 * interval machinery). No bound moves; certified reach stays 2a<=0.96; RH open; NO QED.
 *
 * SETUP. w1(t) = Re[psi(1/4 + i t/2)] - ln(pi) - sqrt2 ln2 cos(t ln2). By the chain rule with
 * z = 1/4 + i t/2 (dz over dt = i/2), the second derivative is
 *   w1-prime-prime(t) = -1/4 Re[psi-prime-prime(z)] + sqrt2 (ln2)^3 cos(t ln2).
 * The digamma piece psi-prime-prime(z) = -2 sum_n 1/(z+n)^3 decays like 1/|z|^2 ~ 1/t^2, so at large t
 * it is TINY; the crude verifier constant W1PP = 0.5 zeta(3,1/4) + sqrt2(ln2)^3 + 1e-6 = 32.80 is set
 * by the t=0 peak of the digamma piece and is a ~68x overestimate out at t~16-17. A cell-local upper
 * bound on the cell [t_lo, t_hi] is  sqrt2(ln2)^3 + (1/2) sum_n 1/((n+1/4)^2 + (t_lo/2)^2)^{3/2}.
 *
 * FINDING A -- THE CELL-LOCAL sup|w1-prime-prime| IS ~0.478, A 68.6x REDUCTION vs THE CONSTANT 32.80.
 * Across the five cells (m in {16.00, 16.35, 16.697, 17.00, 17.333}, hc=2e-3) the cell-local sup is
 * 0.479, 0.4787, 0.4784, 0.4781, 0.4778 -- essentially the cosine floor sqrt2(ln2)^3 = 0.4710 plus a
 * ~0.007 digamma tail. The exact point values |w1-prime-prime|(m) are even smaller (0.041, 0.152,
 * 0.254, 0.330, 0.398). The reduction factor W1PP / cell-bound is 68.5-68.7x throughout the band.
 *
 * FINDING B -- THIS COLLAPSES C2 BY 44.6x AND CLEARS THE WORST CELL AT THE BASE GRID hc=2e-3.
 * At m=16.697 the q^2 term falls from 2.5548e6 (const) to 3.7255e4 (cell-local 0.4784), so
 * C2 = 2.5752e6 -> 5.773e4 (44.6x smaller; the q^2 term drops from 99.2% to ~65% of a far smaller C2).
 * The binding coarse-cell sigma-Taylor penalty -0.5 C2 d^2 at the worst fine point (|d|~8e-4) falls
 * from -0.8241 to -0.0185, and the C2|d| part of rf|F-prime| from -0.412 to -0.009. Swapping just
 * these two C2-driven terms lifts the imp-96978 hc=2e-3 rigorous lower bound from -0.2706 to +0.938
 * (approaching the true point value +1.054). So the cell CLEARS at the ORIGINAL coarse grid --
 * NO hc refinement (and no doubled cell count) is needed.
 *
 * VERDICT. The imp-96978 Finding 3 lever is real and large: the cell-local |w1-prime-prime| enclosure
 * (~0.478 vs the constant 32.80, a 68.6x reduction) shrinks the dominant q^2 W1PP curvature penalty by
 * ~44x, eliminating the coarse-cell collapse at the SAME hc=2e-3 the imp-96956 run used, instead of
 * requiring hc<=1e-3 (which doubles the cell count). This means the full-domain 2a=1.00 rerun
 * (imp-96991) is tractable in-pool at the base grid, PROVIDED the verifier swaps the constant W1PP for
 * this large-t cell-local bound. Honest residual: SUB-GAP IMP96992_LARGET_ONLY_RERUN_NOT_RUN -- this
 * measures five cells in isolation with a large-t bound (the cosine floor 0.471 + a decaying digamma
 * tail); near t=0 the constant 32.80 is genuinely needed, and the full [0,40] re-verification with the
 * swapped bound to actually CERTIFY 2a=1.00 was not run here, so the certified reach stays 2a<=0.96.
 * Interval-rigorous reach unchanged; operator positivity not proved; RH open;
 * no refereed bound is changed; NO QED.
 *
 * @see imp-96978-krein-kmax5-100-guard-resolution.js (Finding 3 -- names q^2 W1PP as the binding term)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 * @see imp-96975-sigma2-tail-supercubic-derivation.js (the sigma_2 = (t^2+1/4)^2 w_1 curvature scaling)
 */

// Verifier CONSTANT bound of |w1-prime-prime| (verify4.py line 21): 0.5 zeta(3,1/4) + sqrt2(ln2)^3 + 1e-6.
export const IMP96992_W1PP_CONST = 32.802904;
// The cosine-term second-derivative amplitude sqrt2 (ln2)^3 -- the large-t floor of |w1-prime-prime|.
export const IMP96992_COSINE_FLOOR = 0.470968;

// Cell-local sup|w1-prime-prime| over each hc=2e-3 cell vs the exact point value and the constant.
// reduction = W1PP_CONST / cellBound. Values from tmp/imp-96992-w1pp-celllocal.py.
export const IMP96992_CELL_SCAN = Object.freeze([
  { m: 16.000, w1ppExact: 0.040662, cellBound: 0.479026, reduction: 68.48 },
  { m: 16.350, w1ppExact: 0.152155, cellBound: 0.478680, reduction: 68.53 },
  { m: 16.697, w1ppExact: 0.253685, cellBound: 0.478358, reduction: 68.57 },
  { m: 17.000, w1ppExact: 0.330403, cellBound: 0.478093, reduction: 68.61 },
  { m: 17.333, w1ppExact: 0.397675, cellBound: 0.477818, reduction: 68.65 },
]);

// Worst band cell m=16.697, cell [16.696,16.698], hc=2e-3: C2 recomputed with the cell-local bound.
export const IMP96992_WORST_CELL = Object.freeze({
  m: 16.697,
  hc: 2.0e-3,
  curvatureTerm: 1480.5,       // (12 t^2 + 1) |w1|
  crossTerm: 18993.4,          // 8 t (t^2+1/4) |w1-prime|
  qSqTermConst: 2554751.0,     // (t^2+1/4)^2 * W1PP(32.80)
  qSqTermLocal: 37255.4,       // (t^2+1/4)^2 * cell-local |w1-prime-prime|(0.4784)
  cellBound: 0.478358,
  C2Const: 2575224.8,
  C2Local: 57729.3,
  C2Reduction: 44.6,           // C2Const / C2Local
  worstFineD: 8.0e-4,
  sigTaylorPenConst: -0.8241,  // -0.5 C2Const d^2
  sigTaylorPenLocal: -0.0185,  // -0.5 C2Local d^2
  flowConst: -0.2706,          // imp-96978 rigorous lower bound at hc=2e-3
  flowLocalEst: +0.938,        // swap of the two C2-driven guard terms (true point F ~ +1.054)
  truePointF: 1.054,
});

export const IMP96992_VERDICT = Object.freeze({
  ticket: 'imp-96992',
  question: 'does a cell-local interval enclosure of |w1-prime-prime| (vs the constant W1PP=32.80) shrink the dominant q^2 W1PP curvature penalty enough to certify past 2a=0.96 at coarser hc?',
  // Finding A: the cell-local enclosure is ~0.478, a 68.6x reduction vs the constant 32.80
  cellLocalW1ppAtWorst: 0.478358,
  reductionVsConstant: 68.57,
  drivenByCosineFloor: true,   // sqrt2(ln2)^3 = 0.4710 dominates; digamma tail ~0.007 at t~16.7
  // Finding B: C2 collapses 44.6x and the worst cell clears at the base grid hc=2e-3
  c2ReductionAtWorst: 44.6,
  clearsAtBaseHc: true,        // flow -0.2706 -> +0.938 at hc=2e-3, no refinement needed
  baseHc: 2.0e-3,
  hcRefinementNeeded: false,   // vs imp-96978 which needed hc<=1e-3 (doubled cell count)
  makesFulldomainRerunTractable: true,
  // Honest residual + guardrails
  subGap: 'IMP96992_LARGET_ONLY_RERUN_NOT_RUN -- five cells measured in isolation with a large-t bound (cosine floor 0.471 + decaying digamma tail); near t=0 the constant 32.80 is still needed, and the full [0,40] re-verification with the swapped bound was not run.',
  intervalRigorousReachUnchanged: 0.96,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

// --- self-executing assertions (pure literals; import-light) ---
const IMP96992_ASSERTIONS = [
  {
    id: 'imp96992-celllocal-w1pp-is-68x-smaller-than-constant',
    holds: () => {
      // every cell-local bound is ~0.478 and ~68x below the constant, and above the cosine floor
      return IMP96992_CELL_SCAN.every(
        (c) =>
          c.cellBound < 0.5 &&
          c.cellBound > IMP96992_COSINE_FLOOR &&
          Math.abs(c.reduction - IMP96992_W1PP_CONST / c.cellBound) < 0.05 &&
          c.reduction > 68 &&
          c.reduction < 69,
      );
    },
    why: 'the cell-local sup|w1-prime-prime| over each hc=2e-3 cell in the t~16-17 band is ~0.478 (essentially the cosine floor 0.471 plus a ~0.007 digamma tail), a 68.5-68.7x reduction vs the crude t=0-peaked constant 32.80.',
  },
  {
    id: 'imp96992-celllocal-collapses-c2-44x-and-clears-base-hc',
    holds: () => {
      const w = IMP96992_WORST_CELL;
      return (
        w.C2Local < w.C2Const / 40 &&
        Math.abs(w.C2Const / w.C2Local - w.C2Reduction) < 0.5 &&
        w.qSqTermLocal < w.qSqTermConst / 40 &&
        w.sigTaylorPenLocal > w.sigTaylorPenConst &&
        w.flowConst < 0 &&
        w.flowLocalEst > 0.9 &&
        IMP96992_VERDICT.clearsAtBaseHc === true &&
        IMP96992_VERDICT.hcRefinementNeeded === false
      );
    },
    why: 'swapping the constant W1PP for the cell-local bound collapses C2 from 2.575e6 to 5.77e4 (44.6x) at the worst band cell, lifting the rigorous lower bound from -0.271 to +0.938 at the ORIGINAL hc=2e-3 -- so the cell clears without any hc refinement.',
  },
  {
    id: 'imp96992-lever-real-but-no-qed',
    holds: () =>
      IMP96992_VERDICT.reductionVsConstant > 68 &&
      IMP96992_VERDICT.c2ReductionAtWorst > 40 &&
      IMP96992_VERDICT.makesFulldomainRerunTractable === true &&
      IMP96992_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96992_VERDICT.operatorPositivityProved === false &&
      IMP96992_VERDICT.rhResolved === false &&
      IMP96992_VERDICT.qed === false,
    why: 'the Finding 3 lever is real and large (68x |w1-prime-prime| reduction, 44x C2 collapse, clears at base hc), making the full-domain 2a=1.00 rerun tractable in-pool, but the swapped-bound re-verification was not run, so the certified reach stays 2a<=0.96 and NO QED.',
  },
];

for (const a of IMP96992_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96992 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
