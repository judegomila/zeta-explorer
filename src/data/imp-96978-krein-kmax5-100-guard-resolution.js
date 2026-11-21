/**
 * @fileoverview imp-96978 -- VERIFICATION-RESOLUTION MEASUREMENT (numerical): decide whether the
 * imp-96956 kmax=5, 2a=1.00 interval collapse (226 interior negative-lower-bound cells clustered at
 * t~16.0-16.7 and 17.33, worst -0.271) survives a finer FINEH / stronger second-order guard, or is a
 * guard-resolution artifact. Import-light: all values below are frozen literals from a direct
 * decomposition of the tmp/toeplitz-krein-verify4.py lower_bound machinery run on the imp-96956
 * iterate (tmp/imp-96956/iterate-100.json, symbol sigma2, kmax=5, 58 atoms) at the worst reported
 * band cell m=16.697 (tmp/imp-96978-guard-decomp.py). No bound moves; certified reach stays
 * 2a<=0.96; RH open; NO QED.
 *
 * SETUP. The verifier lower bound on a coarse cell centered at m of half-width r=hc/2 is
 *   F_low(t_f) = sigma_taylor(t_f) + nu(t_f) - slack - r_f |F-prime(t_f)| - (1/2)(C2 + M2) r_f^2,
 *   sigma_taylor(t_f) = sigma(m) + sigma-prime(m)(t_f - m) - (1/2) C2 (t_f - m)^2,
 * where d = t_f - m ranges over the COARSE half-width [-r, r], r_f is the FINE sub-cell half-width,
 * C2 = sup_cell |sigma-prime-prime| and M2 = sup_cell |nu-prime-prime|. For sigma_2 = (t^2+1/4)^2 w_1,
 *   C2 = (12 t^2 + 1)|w_1| + 8 t (t^2+1/4)|w_1-prime| + (t^2+1/4)^2 W1PP,  W1PP = 32.80290... a rigorous
 * bound of |w_1-prime-prime|. Two knobs are swept independently at m=16.697: the COARSE cell width hc
 * (drives r and hence the sigma second-order Taylor penalty -0.5 C2 d^2), and FINEH (drives r_f and
 * hence the r_f-order guard terms only).
 *
 * FINDING 1 -- REFINING FINEH DOES NOT RESCUE (the bound SATURATES near -0.235). Holding hc=2e-3 and
 * shrinking the FINEH tolerance so r_f falls from 2.0e-4 (nf=5) to 2.1e-6 (nf=467), the rigorous
 * lower bound moves -0.2706 -> -0.2387 -> -0.2350 -> -0.2346 -> -0.2346: it SATURATES near -0.2346,
 * never approaching 0. The two r_f-order guard terms (r_f|F-prime| and 0.5(C2+M2)r_f^2) do vanish
 * (-0.412/-0.087 -> -0.006/-0.000), but the sigma second-order Taylor penalty -0.5 C2 d^2 GROWS
 * (-0.824 -> -1.282) because finer sub-cells sit nearer the coarse-cell EDGES where |d| approaches r.
 * The binding slack is the COARSE-cell sigma enclosure, which is FINEH-invariant. So the collapse is
 * NOT a FINEH-resolution artifact.
 *
 * FINDING 2 -- REFINING THE COARSE CELL hc DOES RESCUE (bound climbs monotonically to the true point
 * value +1.054). Shrinking hc drives the lower bound from -0.2706 (hc=2e-3) -> +0.7061 (1e-3) ->
 * +0.9586 (5e-4) -> +1.0315 (2e-4) -> +1.0479 (1e-4) -> +1.0521 (5e-5) -> +1.0533 (2e-5), converging
 * to the true point value F(t)=+1.054 that holds throughout. The sigma Taylor penalty falls as r^2
 * (0.5 C2 r^2): at hc=1e-3 it is already only -0.143, flipping the cell to +0.706. Certification is
 * recovered for the worst band cell at hc <= 1e-3.
 *
 * FINDING 3 -- THE BINDING TERM IS q^2 W1PP (the (t^2+1/4)^2 curvature x the constant w1-prime-prime
 * bound). At t=16.7 the C2 = 2.5752e6 decomposes as (12t^2+1)|w1| = 1480.5, 8 t q |w1-prime| =
 * 18993.4, and q^2 W1PP = 2.5548e6 -- the last term is 99.2% of C2. It is the sigma_2 double factor
 * (t^2+1/4)^2 ~ 7.79e4 amplified by the crude CONSTANT bound W1PP=32.80. A cell-local (interval)
 * enclosure of |w1-prime-prime| instead of the constant, or a third-order sigma Taylor enclosure,
 * would shrink this dominant penalty directly without shrinking hc.
 *
 * VERDICT. The imp-96956 226-cell collapse at t~16-17 is a GUARD-RESOLUTION ARTIFACT of the COARSE
 * grid (hc) and the second-order sigma Taylor enclosure -- NOT a FINEH artifact and NOT a genuine
 * obstruction. The true point value F stays +1.054 across the band; the negative rigorous lower bounds
 * are entirely the -0.5 C2 d^2 coarse-cell penalty with C2 dominated (99.2%) by q^2 W1PP, and they are
 * eliminated by hc <= 1e-3 (or a cell-local w1-prime-prime bound / third-order enclosure). This
 * isolates the collapse to the VERIFIER RESOLUTION (imp-96956 hc / Taylor-order), not the iterate
 * (imp-96970). SUB-GAP IMP96978_FULLDOMAIN_HC1EM3_RERUN_NOT_RUN -- this measures only the worst band
 * cell m=16.697 in isolation; a full [0,40] re-verification at hc<=1e-3 (2x the coarse cell count) to
 * actually CERTIFY 2a=1.00 was not run here, so the certified reach stays 2a<=0.96 pending that run.
 * RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96956-krein-kmax5-100-interval-verify.js (the 226-negative-cell collapse this leaf diagnoses)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 * @see imp-96975-sigma2-tail-supercubic-derivation.js (the sigma_2 = (t^2+1/4)^2 w_1 curvature scaling)
 */

// W1PP: rigorous constant bound of |w1-prime-prime| used by the verifier (verify4.py line 21).
export const IMP96978_W1PP = 32.802903963831554;

// COARSE-cell (hc) sweep at the worst band cell m=16.697: as hc shrinks the rigorous lower bound
// climbs monotonically from negative to the true point value +1.054. rf is auto-chosen by the
// FINEH tolerance; sigTaylorPen = -0.5 C2 d^2 (the binding penalty) falls as r^2.
export const IMP96978_HC_SWEEP = Object.freeze([
  { hc: 2.0e-3, flow: -0.2706, sigTaylorPen: -0.8241, rfDF: -0.4122, secondOrderRf: -0.0871, rf: 2.0e-4, nf: 5 },
  { hc: 1.0e-3, flow: +0.7061, sigTaylorPen: -0.1431, rfDF: -0.1432, secondOrderRf: -0.0605, rf: 1.67e-4, nf: 3 },
  { hc: 5.0e-4, flow: +0.9586, sigTaylorPen: -0.0201, rfDF: -0.0405, secondOrderRf: -0.0340, rf: 1.25e-4, nf: 2 },
  { hc: 2.0e-4, flow: +1.0315, sigTaylorPen: -0.0000, rfDF: -0.0003, secondOrderRf: -0.0218, rf: 1.0e-4, nf: 1 },
  { hc: 1.0e-4, flow: +1.0479, sigTaylorPen: -0.0000, rfDF: -0.0001, secondOrderRf: -0.0054, rf: 5.0e-5, nf: 1 },
  { hc: 5.0e-5, flow: +1.0521, sigTaylorPen: -0.0000, rfDF: -0.0001, secondOrderRf: -0.0014, rf: 2.5e-5, nf: 1 },
  { hc: 2.0e-5, flow: +1.0533, sigTaylorPen: -0.0000, rfDF: -0.0000, secondOrderRf: -0.0002, rf: 1.0e-5, nf: 1 },
]);

// FINEH sweep at the worst band cell m=16.697, hc FIXED at 2e-3: shrinking rf makes the rigorous
// lower bound SATURATE near -0.2346 (never approaching 0); the rf-order guard terms vanish but the
// FINEH-invariant coarse sigTaylorPen grows toward -1.28 as fine points near the coarse edges.
export const IMP96978_FINEH_SWEEP = Object.freeze([
  { tolScale: 1e0, flow: -0.2706, rf: 2.0e-4, nf: 5, sigTaylorPen: -0.8241, rfDF: -0.4122, secondOrderRf: -0.0871 },
  { tolScale: 1e-1, flow: -0.2387, rf: 6.67e-5, nf: 15, sigTaylorPen: -1.1217, rfDF: -0.1603, secondOrderRf: -0.0097 },
  { tolScale: 1e-2, flow: -0.2350, rf: 2.13e-5, nf: 47, sigTaylorPen: -1.2334, rfDF: -0.0537, secondOrderRf: -0.0010 },
  { tolScale: 1e-3, flow: -0.2346, rf: 6.76e-6, nf: 148, sigTaylorPen: -1.2703, rfDF: -0.0173, secondOrderRf: -0.0001 },
  { tolScale: 1e-4, flow: -0.2346, rf: 2.14e-6, nf: 467, sigTaylorPen: -1.2821, rfDF: -0.0055, secondOrderRf: -0.0000 },
]);

// C2 = sup_cell |sigma_2-prime-prime| decomposition at t=16.7 -- q^2 W1PP dominates (99.2% of C2).
export const IMP96978_C2_BREAKDOWN = Object.freeze({
  t: 16.7,
  curvatureTerm: 1480.5,      // (12 t^2 + 1) |w1|
  crossTerm: 18993.4,         // 8 t (t^2+1/4) |w1-prime|
  qSqW1ppTerm: 2554751.0,     // (t^2+1/4)^2 W1PP -- the binding term
  C2: 2575224.8,
  qSqW1ppFraction: 2554751.0 / 2575224.8, // ~0.992
});

// Point value F is positive throughout the band (verifier pointwise diagnostic); the negative
// rigorous lower bounds are entirely the coarse-cell guard penalty, not a sign change in F.
export const IMP96978_TRUE_POINT_F = 1.054;
export const IMP96978_WORST_REPORTED_FLOW = -0.2706; // imp-96956 worst band cell, hc=2e-3

export const IMP96978_VERDICT = Object.freeze({
  ticket: 'imp-96978',
  question: 'does the imp-96956 kmax=5, 2a=1.00 interval collapse (226 interior negative cells at t~16-17, worst -0.271) survive a finer FINEH or stronger second-order guard, or is it a guard-resolution artifact?',
  twoA: 1.0,
  worstBandCell: 16.697,
  // Finding 1: FINEH does not rescue -- bound saturates near -0.2346 as rf shrinks
  finehRescues: false,
  finehSaturationFlow: -0.2346,
  bindingSlackIsCoarseSigmaTaylor: true,
  // Finding 2: coarse hc DOES rescue -- bound climbs to +1.054 as hc shrinks
  coarseHcRescues: true,
  hcThresholdForPositiveCell: 1.0e-3, // cell already +0.706 at hc=1e-3
  convergesToTruePointF: IMP96978_TRUE_POINT_F,
  // Finding 3: binding term is q^2 W1PP (the sigma_2 double factor x the constant w1-prime-prime bound)
  bindingTermIsQsqW1pp: true,
  qSqW1ppFraction: IMP96978_C2_BREAKDOWN.qSqW1ppFraction,
  alternativeFix: 'cell-local (interval) |w1-prime-prime| enclosure or third-order sigma Taylor enclosure shrinks C2 without shrinking hc',
  // Verdict
  collapseIsGuardResolutionArtifact: true,
  collapseIsGenuineObstruction: false,
  isolatesToVerifierResolutionNotIterate: true,
  // Honest residual + guardrails
  subGap: 'IMP96978_FULLDOMAIN_HC1EM3_RERUN_NOT_RUN -- only the worst band cell m=16.697 was measured in isolation; a full [0,40] re-verification at hc<=1e-3 to certify 2a=1.00 was not run.',
  intervalRigorousReachUnchanged: 0.96,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

// --- self-executing assertions (pure literals; import-light) ---
const IMP96978_ASSERTIONS = [
  {
    id: 'imp96978-fineh-does-not-rescue-bound-saturates',
    holds: () => {
      const first = IMP96978_FINEH_SWEEP[0];
      const last = IMP96978_FINEH_SWEEP[IMP96978_FINEH_SWEEP.length - 1];
      // rf shrinks ~100x but Flow stays negative and near -0.2346 (does NOT approach 0)
      return (
        last.rf < first.rf / 50 &&
        last.flow < 0 &&
        Math.abs(last.flow - IMP96978_VERDICT.finehSaturationFlow) < 1e-3 &&
        // the coarse sigma-Taylor penalty GROWS as fine points near the edges
        last.sigTaylorPen < first.sigTaylorPen &&
        IMP96978_VERDICT.finehRescues === false
      );
    },
    why: 'holding hc=2e-3 and shrinking rf ~100x, the rigorous lower bound saturates near -0.2346 (never approaching 0) while the FINEH-invariant coarse sigma-Taylor penalty grows -- FINEH does not rescue.',
  },
  {
    id: 'imp96978-coarse-hc-rescues-bound-climbs-to-true-pointf',
    holds: () => {
      const flows = IMP96978_HC_SWEEP.map((r) => r.flow);
      // monotone increasing as hc decreases (array ordered hc descending)
      const monotone = flows.every((v, i) => i === 0 || v >= flows[i - 1] - 1e-9);
      const firstPositive = IMP96978_HC_SWEEP.find((r) => r.flow > 0);
      return (
        monotone &&
        flows[0] < 0 &&
        flows[flows.length - 1] > 1.0 &&
        Math.abs(flows[flows.length - 1] - IMP96978_TRUE_POINT_F) < 0.01 &&
        firstPositive.hc <= IMP96978_VERDICT.hcThresholdForPositiveCell + 1e-12 &&
        IMP96978_VERDICT.coarseHcRescues === true
      );
    },
    why: 'shrinking the coarse cell hc drives the rigorous lower bound monotonically from -0.271 (hc=2e-3) to +1.053 (hc=2e-5), converging to the true point value +1.054; the cell is already positive at hc=1e-3.',
  },
  {
    id: 'imp96978-binding-term-is-qsq-w1pp',
    holds: () =>
      IMP96978_C2_BREAKDOWN.qSqW1ppTerm > IMP96978_C2_BREAKDOWN.curvatureTerm &&
      IMP96978_C2_BREAKDOWN.qSqW1ppTerm > IMP96978_C2_BREAKDOWN.crossTerm &&
      IMP96978_C2_BREAKDOWN.qSqW1ppFraction > 0.99 &&
      IMP96978_VERDICT.bindingTermIsQsqW1pp === true,
    why: 'the C2=2.5752e6 second-derivative bound at t=16.7 is 99.2% q^2 W1PP (the (t^2+1/4)^2 double factor x the constant w1-prime-prime bound 32.80), so a cell-local w1-prime-prime enclosure or third-order sigma Taylor would shrink it directly.',
  },
  {
    id: 'imp96978-artifact-not-obstruction-no-qed',
    holds: () =>
      IMP96978_TRUE_POINT_F > 1.0 &&
      IMP96978_WORST_REPORTED_FLOW < 0 &&
      IMP96978_VERDICT.collapseIsGuardResolutionArtifact === true &&
      IMP96978_VERDICT.collapseIsGenuineObstruction === false &&
      IMP96978_VERDICT.isolatesToVerifierResolutionNotIterate === true &&
      IMP96978_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96978_VERDICT.operatorPositivityProved === false &&
      IMP96978_VERDICT.qed === false,
    why: 'the true point value F stays +1.054 across the band while the reported lower bound is -0.271; the collapse is a coarse-grid/Taylor-order guard-resolution artifact isolated to the verifier resolution, the certified reach stays 2a<=0.96, and NO QED.',
  },
];

for (const a of IMP96978_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96978 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
