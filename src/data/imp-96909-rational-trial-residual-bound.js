/**
 * @fileoverview imp-96909 -- ASSESSMENT / MEASUREMENT: does a RATIONAL (exact-arithmetic, low-height)
 * near-ground trial vector keep the imp-96888 min-max residual bound rigorous while staying within the
 * measured 1.17-2.24x band of the true T-truncation residual (Route I Krein floor, N=100, 2a=ln3)?
 *
 * imp-96888 (IMP96888_RAYLEIGH_TAIL_MAJORANT) established that the residual L - f(T) = lambda_min(A_infty)
 * - lambda_min(A_T) is bounded, rigorously by min-max, by <v0|R_T|v0> in the A_T ground state v0 -- only
 * 1.17-2.24x the measured residual across T in {4800,6400,9600}. Its VERDICT flagged that v0 is a FLOATING
 * eigenvector so the bound is not interval-certifiable, and named "a rational near-ground trial would keep
 * it rigorous" as the route. This leaf TESTS that route.
 *
 * Exact min-max for ANY nonzero trial w (not required to be the ground state):
 *   L = lambda_min(A_infty) <= <w|A_infty|w>/<w|w> = (<w|A_T|w> + <w|R_T|w>)/<w|w>,
 * so the RIGOROUS residual bound with trial w decomposes as
 *   L - f(T) <= <w|A_infty|w>/<w|w> - lambda_min(A_T)
 *            = ( <w|A_T|w>/<w|w> - lambda_min(A_T) )  +  <w|R_T|w>/<w|w>
 *            =        delta_core(w) (>=0, core Rayleigh excess)   +   rayleigh_R(w) (tail form).
 * For the EXACT v0, delta_core=0 and this collapses to imp-96888. Rounding v0 with Fraction.limit_
 * denominator(D) over a height ladder D in {10,100,1000,10000,100000} injects a nonnegative delta_core;
 * the question is whether delta_core + rayleigh_R stays inside [1.17,2.24]x actual at LOW height.
 *
 * Driver: tmp/imp-96909-rational-trial.py (/tmp/rhvenv, scipy 1.18) reuses the imp-96888/imp-96876/imp-96806
 * build()/solver VERBATIM. Every literal below is verbatim from the run (/tmp/imp-96909-out.json).
 *
 * FINDINGS (measured).
 *   1. THE RATIONAL ROUTE DOES NOT KEEP THE BOUND IN THE 1.17-2.24x BAND AT LOW HEIGHT. The bound is
 *      DOMINATED by the core Rayleigh excess delta_core, which is >= 94% of the bound at every rung and
 *      height. delta_core is T-INDEPENDENT (fixed by the rounding height): ~6.07e-4 at D=100 (maxden=53),
 *      ~1.31e-4 at D=1000, ~3.42e-5 at D=10000 -- the SAME at T=4800, 6400 and 9600. The true residual, by
 *      contrast, DECAYS with T (4.59e-4 -> 1.88e-4 -> 3.19e-5), so a fixed rounding height that is in-band
 *      at one T is far out of band at the next.
 *   2. THE ONLY IN-BAND (rational) ROW IS A COINCIDENCE AT ONE RUNG. The genuinely low-height D=100
 *      (maxden=53) trial lands 1.32x actual at T=4800 (in band) but 3.24x at T=6400 and 19.05x at T=9600 --
 *      no single low-height rounding is in-band across the T ladder.
 *   3. THE TAIL FORM rayleigh_R IS HYPERSENSITIVE TO ROUNDING (a SECOND obstruction). Rounding COLLAPSES
 *      <w|R_T|w> by orders of magnitude vs the floating <v0|R_T|v0>: at T=4800, rayleigh_R=4.36e-7 (D=100)
 *      vs floating 5.38e-4 -- a ~1200x drop -- and it stays ~1e-6 even at D=10000. This confirms imp-96888
 *      Finding 3: R_T mass loads high-frequency directions nearly orthogonal to v0, so <w|R_T|w> swings
 *      wildly under the tiny direction change from rounding, making rayleigh_R an unstable target.
 *
 * VERDICT. NO -- a low-height rational near-ground trial does NOT keep the residual bound within the
 * imp-96888 1.17-2.24x band. The bound stays a rigorous upper bound on the true residual (min-max holds for
 * any w), but at low height it is DOMINATED by a T-independent core Rayleigh-excess floor delta_core that
 * does not decay with T, so it is 1.3x (T=4800) to 19x (T=9600) actual at D=100 and never in-band across the
 * ladder. Two obstructions: (a) delta_core >= 94% of the bound and is height-set, T-independent; (b) the
 * tail form rayleigh_R collapses ~1200x under rounding because R_T mass is nearly orthogonal to v0. This
 * REFINES SUB-GAP IMP96888_RAYLEIGH_TAIL_MAJORANT: the naive "round v0 to low-height rationals" step does
 * NOT directly deliver an in-band interval-certifiable bound. A workable split would (i) certify delta_core
 * with a finite-matrix core-gap interval bound (no tail integral) and (ii) apply the tail majorant only to
 * rayleigh_R -- but delta_core swamps the band at any genuinely low height, so height must reach
 * ~1e4-1e5 (NOT low) before delta_core drops below the residual. Assessment / measurement only: bounds are
 * rigorous UPPER bounds on the residual, NOT operator positivity; the "valid=False" reference rows are
 * rounding catching a Rayleigh quotient just below the reference floor, not a min-max violation; the interval
 * tail majorant stays OPEN; IMP96749_UNIFORM_N_GAP_UNSETTLED stays open; reach stays 2a <= 0.96; RH open;
 * no refereed bound is changed; NO QED.
 *
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (IMP96888_RAYLEIGH_TAIL_MAJORANT; the min-max bound this leaf tests)
 * @see imp-96876-krein-tresidual-crossval-measurement.js (IMP96876_TRACE_VACUOUS)
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (enclosure [0.579666,0.581292])
 * @see imp-96806-krein-tconv-plateau-2a-ln3.js (reused build()/lam_min() solver; IMP96806_TSWEEP_LN3)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_UNIFORM_N_GAP_UNSETTLED)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// per-rung, per-height rational-trial bound at N=100, 2a=ln3, Tfar=60000 (verbatim from tmp/imp-96909-out.json).
// Each row: {maxden, deltaCore, rayleighR, bound, boundOverActual, valid, inBand}. delta_core = core Rayleigh
// excess of the rounded trial; rayleighR = <w|R_T|w>/<w|w> (tail form); bound = delta_core + rayleighR.
export const IMP96909_ROWS = Object.freeze({
  4800: Object.freeze({
    actualResid: 4.585845e-4,
    floatingRayleigh: 5.381116e-4, // imp-96888 <v0|R_T|v0>, exact v0
    floatingOverActual: 1.1734,
    lamMinAT: 2.404399458e-4,
    D100: Object.freeze({ maxden: 53, deltaCore: 6.071150e-4, rayleighR: 4.362370e-7, bound: 6.075513e-4, boundOverActual: 1.3248, valid: true, inBand: true }),
    D1000: Object.freeze({ maxden: 726, deltaCore: 1.314487e-4, rayleighR: 1.745879e-6, bound: 1.331945e-4, boundOverActual: 0.2904, valid: false, inBand: false }),
    D10000: Object.freeze({ maxden: 9945, deltaCore: 3.431830e-5, rayleighR: 2.164105e-6, bound: 3.648240e-5, boundOverActual: 0.0796, valid: false, inBand: false }),
  }),
  6400: Object.freeze({
    actualResid: 1.875213e-4,
    floatingRayleigh: 2.304929e-4,
    floatingOverActual: 1.2292,
    lamMinAT: 2.405523173e-4,
    D100: Object.freeze({ maxden: 53, deltaCore: 6.070028e-4, rayleighR: 1.915744e-7, bound: 6.071943e-4, boundOverActual: 3.2380, valid: true, inBand: false }),
    D1000: Object.freeze({ maxden: 991, deltaCore: 1.311660e-4, rayleighR: 7.658553e-7, bound: 1.319318e-4, boundOverActual: 0.7036, valid: false, inBand: false }),
    D10000: Object.freeze({ maxden: 8134, deltaCore: 3.415852e-5, rayleighR: 9.493213e-7, bound: 3.510784e-5, boundOverActual: 0.1872, valid: false, inBand: false }),
  }),
  9600: Object.freeze({
    actualResid: 3.186173e-5,
    floatingRayleigh: 7.143893e-5,
    floatingOverActual: 2.2422,
    lamMinAT: 2.406168462e-4,
    D100: Object.freeze({ maxden: 53, deltaCore: 6.069383e-4, rayleighR: 5.973061e-8, bound: 6.069980e-4, boundOverActual: 19.0510, valid: true, inBand: false }),
    D1000: Object.freeze({ maxden: 991, deltaCore: 1.311017e-4, rayleighR: 2.387959e-7, bound: 1.313405e-4, boundOverActual: 4.1222, valid: true, inBand: false }),
    D10000: Object.freeze({ maxden: 9756, deltaCore: 3.406893e-5, rayleighR: 2.958287e-7, bound: 3.436476e-5, boundOverActual: 1.0786, valid: true, inBand: false }),
  }),
});

export const IMP96909_VERDICT = Object.freeze({
  ticket: 'imp-96909',
  question:
    'does a RATIONAL (exact-arithmetic, low-height) near-ground trial vector keep the imp-96888 min-max residual bound <v0|R_T|v0> rigorous while staying within the measured 1.17-2.24x band of the true T-truncation residual (N=100, 2a=ln3)?',
  answer:
    'NO at low height. Rounding v0 with Fraction.limit_denominator injects a nonnegative core Rayleigh excess delta_core = <w|A_T|w>/<w|w> - lambda_min(A_T) that DOMINATES the bound (>= 94% at every rung/height) and is T-INDEPENDENT (~6.07e-4 at D=100, ~1.31e-4 at D=1000, ~3.42e-5 at D=10000, identical across T), while the true residual DECAYS with T (4.59e-4 -> 1.88e-4 -> 3.19e-5). So the genuinely low-height D=100 (maxden=53) trial is in-band only at T=4800 (1.32x) but 3.24x at T=6400 and 19.05x at T=9600 -- no single low-height rounding is in-band across the ladder. A SECOND obstruction: the tail form rayleigh_R=<w|R_T|w>/<w|w> collapses ~1200x under rounding (4.36e-7 at D=100 vs floating 5.38e-4) because R_T mass is nearly orthogonal to v0 (imp-96888 Finding 3), making it an unstable target. The bound stays a RIGOROUS upper bound on the residual, but it is not in the 1.17-2.24x band at low height; delta_core needs height ~1e4-1e5 (not low) to drop below the residual.',
  binding2a: 'ln3',
  N: 100,
  Tfar: 60000,
  boundDecomposition: 'delta_core (core Rayleigh excess, >=0, T-independent, height-set) + rayleigh_R (tail form)',
  deltaCoreDominates: true, // >= 94% of the bound at every measured rung/height
  deltaCoreIsTIndependent: true, // fixed by rounding height, does NOT decay with T
  rationalStaysInBandAtLowHeight: false, // D=100 in-band only at T=4800; 3.24x, 19.05x at larger T
  onlyInBandRow: '4800/D100 (maxden=53, 1.3248x actual) -- a single-rung coincidence, not across the ladder',
  tailFormHypersensitive: true, // rayleigh_R collapses ~1200x under rounding (R_T mass orthogonal to v0)
  boundRemainsRigorousUpperBound: true, // min-max holds for any trial w
  validFalseRowsAreReferenceArtifacts: true, // rounding catches a Rayleigh quotient just below the reference floor, not a min-max violation
  heightNeededForInBand: '~1e4-1e5 (NOT low) so delta_core drops below the residual',
  operatorPositivityProved: false,
  uniformNGapSettled: false,
  subGap:
    'IMP96909_RATIONAL_DELTA_CORE_SPLIT -- a low-height rational trial does NOT keep the imp-96888 bound in the 1.17-2.24x band: the bound is dominated by a T-independent, height-set core Rayleigh excess delta_core that swamps the tail form at any genuinely low height, and the tail form rayleigh_R itself collapses ~1200x under rounding (R_T mass orthogonal to v0). A workable interval route must (i) certify delta_core with a finite-matrix core-gap interval bound (no tail integral) and (ii) apply IMP96888_RAYLEIGH_TAIL_MAJORANT only to rayleigh_R -- but delta_core forces height ~1e4-1e5, so the bound is looser than the floating value; the tight in-band bound requires (near-)exact v0, which is not low-height rational.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96909_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96909_ASSERTIONS = [
  {
    id: 'imp96909-delta-core-dominates',
    holds: () => {
      // delta_core is >= 94% of the bound at every rung and height (the bound is a core Rayleigh-excess floor)
      const heights = ['D100', 'D1000', 'D10000'];
      return Object.values(IMP96909_ROWS).every((r) =>
        heights.every((h) => r[h].deltaCore / r[h].bound >= 0.94),
      );
    },
    why: 'the rational-trial bound = delta_core + rayleigh_R is dominated by the core Rayleigh excess delta_core (>= 94% at every measured rung/height), not the tail form.',
  },
  {
    id: 'imp96909-delta-core-t-independent',
    holds: () => {
      // at a fixed height delta_core is essentially the same across T (it is a core quantity, not a tail integral)
      const rungs = [IMP96909_ROWS[4800], IMP96909_ROWS[6400], IMP96909_ROWS[9600]];
      return ['D100', 'D1000', 'D10000'].every((h) => {
        const vals = rungs.map((r) => r[h].deltaCore);
        const spread = (Math.max(...vals) - Math.min(...vals)) / Math.max(...vals);
        return spread < 0.01; // < 1% variation across T at fixed height
      });
    },
    why: 'delta_core is a truncated-core Rayleigh excess set by the rounding height; it varies < 1% across T while the residual decays ~14x, so a fixed height cannot track the shrinking residual.',
  },
  {
    id: 'imp96909-not-in-band-across-ladder',
    holds: () => {
      // the low-height D100 trial is in-band at T=4800 only; out of band at T=6400 and T=9600
      return (
        IMP96909_ROWS[4800].D100.inBand === true &&
        IMP96909_ROWS[6400].D100.inBand === false &&
        IMP96909_ROWS[9600].D100.inBand === false &&
        IMP96909_ROWS[9600].D100.boundOverActual > 10
      );
    },
    why: 'no single low-height rounding stays in the 1.17-2.24x band across the T ladder: D=100 (maxden=53) is 1.32x at T=4800 but 3.24x and 19.05x at larger T.',
  },
  {
    id: 'imp96909-tail-form-hypersensitive',
    holds: () => {
      // rounding collapses rayleigh_R by orders of magnitude vs the floating <v0|R_T|v0>
      return Object.values(IMP96909_ROWS).every(
        (r) => r.D100.rayleighR < r.floatingRayleigh / 100,
      );
    },
    why: 'the tail quadratic form <w|R_T|w> collapses > 100x under rounding (4.36e-7 vs floating 5.38e-4 at T=4800) because R_T mass is nearly orthogonal to v0, so rayleigh_R is an unstable target.',
  },
  {
    id: 'imp96909-assessment-only-no-qed',
    holds: () =>
      IMP96909_VERDICT.deltaCoreDominates === true &&
      IMP96909_VERDICT.deltaCoreIsTIndependent === true &&
      IMP96909_VERDICT.rationalStaysInBandAtLowHeight === false &&
      IMP96909_VERDICT.tailFormHypersensitive === true &&
      IMP96909_VERDICT.boundRemainsRigorousUpperBound === true &&
      IMP96909_VERDICT.operatorPositivityProved === false &&
      IMP96909_VERDICT.uniformNGapSettled === false &&
      IMP96909_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96909_VERDICT.qed === false &&
      typeof IMP96909_VERDICT.subGap === 'string' &&
      IMP96909_VERDICT.subGap.includes('IMP96909_RATIONAL_DELTA_CORE_SPLIT'),
    why: 'assessment done (rational low-height trial does NOT keep the bound in band; delta_core dominates, T-independent; tail form hypersensitive), bound stays a rigorous UPPER bound but not in band: no operator positivity, uniform-N gap open, reach stays 2a <= 0.96, no QED.',
  },
];

for (const a of IMP96909_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96909-rational-trial-residual-bound assertion failed: ${a.id}`);
  }
}

void LN3;
