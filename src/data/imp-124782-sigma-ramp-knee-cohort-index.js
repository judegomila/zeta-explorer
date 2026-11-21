/**
 * @module imp-124782-sigma-ramp-knee-cohort-index
 * @fileoverview imp-124782 -- META cross-reference cohort index grouping the sigma-ramp knee
 *   cohort: imp-33721 (sub-decade knee discovery), imp-97708 (bracket-robustness), imp-97781
 *   (E_flow sensitivity), imp-97804 (closed-form derivation), imp-97805 (amplification ratio),
 *   imp-97822 (E_trunc floor-elasticity), mirroring the imp-97846 / imp-97092 cohort indices.
 *   Read individually, a scout may re-relocate the knee, re-derive its E_flow amplification, or
 *   re-sweep its floor sensitivity and mistake any one result for the whole picture. Index/meta
 *   only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (logical order, not chronological). All six characterise the SAME sigma(N) =
 *   E_coll/(E_trunc + E_flow + E_coll) post-peak exponent-ramp inflection knee first reported by
 *   imp-33701 on coarse whole-decade brackets.
 *     imp-33721 -- DISCOVERS the refined knee: sub-decade (quarter-decade) OLS local-exponent
 *       differencing relocates the single D2 (ramp-acceleration) zero-crossing to N* ~ 3.38e9
 *       (log10 ~ 9.529), a full decade below the imp-33701 whole-decade [1e10,1e11] reading, and
 *       robust across sub-bracket widths W in {0.1,0.125,0.2,0.25}; the refined knee sits ~3.3%
 *       above the sigma = 1/2 halving landmark / E_coll = E_trunc crossover.
 *     imp-97708 -- CONFIRMS the relocation is bracket-ROBUST, not a differencing artifact: a
 *       bracketing-free pointwise curvature locator (no OLS window at all) puts the single
 *       inflection at the identical log10 N* = 9.5291, invariant to stencil step, and every
 *       sub-decade width W <= 0.3 converges onto it; the imp-33701 whole-decade reading
 *       reconciles as pure resolution loss (the D2 sign change vanishes for W >= 0.4).
 *     imp-97781 -- MEASURES the knee's E_flow sensitivity: swapping an E_flow amplitude knob amp
 *       shows N_cross (E_coll = E_trunc) is EXACTLY amp-independent while the knee itself is
 *       strongly displaced (d(offset)/d(amp) ~ -1.77 pp/amp) even though E_flow/E_trunc ~ 1.9e-3
 *       at the knee -- a curvature landmark heuristically "amplifying" the flow term ~1000x.
 *     imp-97804 -- DERIVES a first-order E_flow-linear closed form for the knee shift, matching
 *       the imp-97781 measured slope to ~2%, and decomposes it into an ODDS sub-term (~23%,
 *       closed-form -phi/(g ln10)) and a CURVATURE sub-term (~77%, keyed to h/g ~ 1.79); this
 *       refines the imp-97781 "~1000x" heuristic to a pinned dimensionless amplification ~9.4x.
 *     imp-97805 -- DIRECTLY MEASURES the dimensionless amplification A = |d(offset)/d(amp)| /
 *       (E_flow/E_trunc at the knee) on the identical discrete estimator: A ~ 9.5 (grid band
 *       9.54..10.11), confirming the imp-97804 closed-form ~9.4 and closing the units-mismatch
 *       that produced the original "~1000x" heuristic (a percentage-point slope compared against
 *       a raw ratio).
 *     imp-97822 -- MEASURES the ORTHOGONAL floor axis imp-97708 held fixed: the bracketing-free
 *       knee survives the entire imp-33708 0.5x..5x E_trunc floor sweep as a single inflection,
 *       but its N-coordinate scales as N* ~ E_trunc^(-2.10) -- the SAME clean ~-2 exponent as the
 *       far-tail halving landmark, not the softer interior-peak ~-1.375 -- so the floor axis
 *       (+/-10% floor moves the knee ~0.183 decades) dwarfs the E_flow axis (~0.0017 decades, the
 *       imp-33767 displacement) by ~100x.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, imp-33721 looks like an isolated
 *   relocation, imp-97708 an isolated robustness check, imp-97781/imp-97804/imp-97805 three
 *   separate takes on the same amplification number, and imp-97822 an isolated floor sweep. Read
 *   together, the cohort is one relocation (sub-decade knee at N* ~ 3.38e9), one robustness proof
 *   (bracket-free, stencil-invariant), one sensitivity axis measured three ways and converging
 *   from a "~1000x" heuristic down to a pinned ~9.5x, and one orthogonal floor axis that
 *   dominates the E_flow axis by ~100x. This index bakes that reading verbatim so future work
 *   does not re-relocate the knee, does not re-open the amplification as though ~1000x were still
 *   live, and does not conflate the E_flow axis with the (100x larger) floor axis.
 *
 *   STATUS: a grouping/index note over six already-committed modules, not a new derivation. No
 *   bound changes; C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz untouched; imp-3066
 *   K_a >= 0 untouched; RH open; NO QED. No refereed bound is changed.
 *
 * @see imp-33721-sigma-ramp-inflection-subdecade.js (sub-decade knee discovery, N* ~ 3.38e9)
 * @see imp-97708-sigma-knee-bracket-width-sensitivity.js (bracket-robustness confirmation)
 * @see imp-97781-knee-crossover-eflow-sensitivity.js (E_flow sensitivity, ~1000x heuristic)
 * @see imp-97804-knee-eflow-linear-expansion.js (closed-form derivation, refines to ~9.4x)
 * @see imp-97805-knee-eflow-amplification-ratio.js (direct measurement, A ~ 9.5)
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity.js (floor-elasticity, ~100x the E_flow axis)
 * @see imp-97846-kernel-fold-diag3-cohort-index.js (sibling cohort-index this mirrors)
 *
 * Ticket: imp-124782 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

const LOG10_NSTAR = 9.5291; // imp-97708 bracketing-free pointwise knee (confirms imp-33721)
const NSTAR = 3.381e9;
const AMPLIFICATION_A = 9.5; // imp-97805 direct measurement, confirms imp-97804 closed-form ~9.4
const FLOOR_ELASTICITY_P_KNEE = -2.10; // imp-97822 measured N* ~ E_trunc^(p_knee)
const FLOOR_VS_EFLOW_RATIO = 100; // imp-97822 floor axis dwarfs the E_flow axis by ~100x

const SIGMA_RAMP_KNEE_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-33721',
    role: 'discovers the sub-decade knee relocation',
    result:
      'Quarter-decade OLS differencing relocates the single D2 ramp-acceleration zero-crossing ' +
      'to log10 N* ~ 9.529 (N* ~ 3.38e9), a full decade below the imp-33701 whole-decade ' +
      '[1e10,1e11] reading, robust across sub-bracket widths and ~3.3% above the sigma = 1/2 ' +
      'halving landmark.',
  }),
  Object.freeze({
    id: 'imp-97708',
    role: 'confirms the relocation is bracket-robust, not a differencing artifact',
    result:
      'A bracketing-free pointwise curvature locator (no OLS window) puts the single inflection ' +
      'at the identical log10 N* = ' + LOG10_NSTAR.toFixed(4) + ', invariant to stencil step; the ' +
      'imp-33701 whole-decade reading reconciles as pure resolution loss (D2 sign change vanishes ' +
      'for width W >= 0.4).',
  }),
  Object.freeze({
    id: 'imp-97781',
    role: 'measures the knee E_flow sensitivity, flags a ~1000x heuristic',
    result:
      'N_cross (E_coll = E_trunc) is exactly amp-independent while the knee offset moves ~-1.77 ' +
      'percentage points per unit E_flow amplitude despite E_flow/E_trunc ~ 1.9e-3 at the knee -- ' +
      'a curvature landmark heuristically "amplifying" the flow term ~1000x.',
  }),
  Object.freeze({
    id: 'imp-97804',
    role: 'derives the closed-form knee shift, refines the amplification to ~9.4x',
    result:
      'A first-order E_flow-linear closed form matches the imp-97781 measured slope to ~2%, ' +
      'decomposing it into an odds sub-term (~23%) and a curvature sub-term (~77%, keyed to ' +
      'h/g ~ 1.79); the pinned dimensionless amplification is ~9.4x, not ~1000x.',
  }),
  Object.freeze({
    id: 'imp-97805',
    role: 'directly measures the amplification, confirms ~9.4x as A ~ 9.5',
    result:
      'The dimensionless amplification A = |d(offset)/d(amp)| / (E_flow/E_trunc at the knee) ' +
      'measures A ~ ' + AMPLIFICATION_A.toFixed(1) + ' (grid band 9.54..10.11) directly on the ' +
      'discrete estimator, confirming imp-97804 and closing the units mismatch behind the ' +
      'original "~1000x" heuristic.',
  }),
  Object.freeze({
    id: 'imp-97822',
    role: 'measures the orthogonal E_trunc floor axis, dwarfing the E_flow axis',
    result:
      'The knee survives the imp-33708 0.5x..5x E_trunc floor sweep as a single inflection but ' +
      'scales as N* ~ E_trunc^(' + FLOOR_ELASTICITY_P_KNEE.toFixed(2) + '), the same clean ~-2 ' +
      'exponent as the far-tail halving landmark; the floor axis (+/-10% -> ~0.183 decades) ' +
      'dwarfs the E_flow axis (~0.0017 decades) by ~' + FLOOR_VS_EFLOW_RATIO + 'x.',
  }),
]);

export const IMP124782_SIGMA_RAMP_KNEE_COHORT_INDEX = Object.freeze({
  id: 'imp-124782',
  proofSection: 'S-frontier',
  cohort: SIGMA_RAMP_KNEE_COHORT,
  knee: {
    log10_Nstar: LOG10_NSTAR,
    Nstar: NSTAR,
  },
  amplification: AMPLIFICATION_A,
  floorElasticity: FLOOR_ELASTICITY_P_KNEE,
  floorVsEflowRatio: FLOOR_VS_EFLOW_RATIO,
  anyBoundMoved: false,
  question:
    'The sigma-ramp knee cohort (imp-33721, imp-97708, imp-97781, imp-97804, imp-97805, ' +
    'imp-97822) reads as six separate measurements around the imp-33701 exponent-ramp knee. ' +
    'Grouped, do they form one coherent picture -- a relocation, its robustness proof, a ' +
    'sensitivity axis converging to a pinned amplification, and an orthogonal dominant floor ' +
    'axis -- or could a future scout mistake any one result (e.g. a re-measured amplification) ' +
    'as new?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-33721 relocates the imp-33701 whole-decade ' +
    'knee to a sub-decade log10 N* ~ 9.529 (N* ~ 3.38e9); imp-97708 confirms that relocation is ' +
    'bracket-robust via a bracketing-free pointwise locator (identical log10 N* = ' +
    LOG10_NSTAR.toFixed(4) + '); imp-97781 measures the knee is strongly E_flow-displaced and ' +
    'flags a "~1000x" amplification heuristic; imp-97804 derives the closed-form shift and ' +
    'refines that heuristic to a pinned ~9.4x (23% odds + 77% curvature); imp-97805 directly ' +
    'measures the same dimensionless amplification as A ~ ' + AMPLIFICATION_A.toFixed(1) +
    ', confirming imp-97804 and closing the units mismatch; imp-97822 measures the orthogonal ' +
    'E_trunc floor axis, finding N* ~ E_trunc^(' + FLOOR_ELASTICITY_P_KNEE.toFixed(2) + ') dwarfs ' +
    'the E_flow axis by ~' + FLOOR_VS_EFLOW_RATIO + 'x. So the cohort as a whole is one ' +
    'relocation, one robustness proof, one sensitivity number pinned by three independent ' +
    'routes, and one dominant orthogonal axis. Future work on this thread should not re-relocate ' +
    'the knee from scratch, should not re-open the amplification as though ~1000x were still ' +
    'live, and should not conflate the E_flow sensitivity with the (100x larger) floor ' +
    'sensitivity. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation; ' +
    'C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; ' +
    'imp-3066 K_a >= 0 untouched; establishes nothing new; moves no bound; RH open; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33721 (sub-decade knee discovery, N* ~ 3.38e9); imp-97708 (bracket-robustness, ' +
    'bracketing-free pointwise locator); imp-97781 (E_flow sensitivity, ~1000x heuristic); ' +
    'imp-97804 (closed-form derivation, refines to ~9.4x); imp-97805 (direct measurement, ' +
    'A ~ 9.5); imp-97822 (floor-elasticity, ~100x the E_flow axis); imp-33701 (original ' +
    'whole-decade knee this cohort refines); imp-97846-kernel-fold-diag3-cohort-index.js ' +
    '(sibling cohort-index this mirrors).',
});

export default IMP124782_SIGMA_RAMP_KNEE_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124782_SIGMA_RAMP_KNEE_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp124782-cohort-has-all-six-members',
    why: 'The whole point of the index is grouping exactly these six modules; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP124782_SIGMA_RAMP_KNEE_COHORT_INDEX.cohort.map((c) => c.id);
      return [
        'imp-33721', 'imp-97708', 'imp-97781', 'imp-97804', 'imp-97805', 'imp-97822',
      ].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp124782-knee-and-amplification-consistent',
    why: 'The cohort shares one knee location and one amplification pin; both must match the ' +
      'committed literals from the underlying modules.',
    holds: () => {
      const idx = IMP124782_SIGMA_RAMP_KNEE_COHORT_INDEX;
      return (
        Math.abs(idx.knee.log10_Nstar - 9.5291) < 1e-3 &&
        Math.abs(idx.knee.Nstar - 3.381e9) / 3.381e9 < 1e-2 &&
        idx.amplification > 9 && idx.amplification < 10 &&
        idx.floorElasticity < -2 && idx.floorElasticity > -2.2
      );
    },
  },
  {
    id: 'imp124782-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP124782_SIGMA_RAMP_KNEE_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP124782_SIGMA_RAMP_KNEE_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP124782_SIGMA_RAMP_KNEE_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP124782_SIGMA_RAMP_KNEE_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124782-sigma-ramp-knee-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
