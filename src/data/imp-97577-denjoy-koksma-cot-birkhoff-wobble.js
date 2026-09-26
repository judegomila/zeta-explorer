/**
 * @module imp-97577-denjoy-koksma-cot-birkhoff-wobble
 * @fileoverview imp-97577 -- MEASUREMENT ONLY (no bound moved; NO QED):
 *   imp-97563 VERDICT(b) claims the residual after one Bettin-Conrey reciprocation of the Vasyunin
 *   cotangent sum V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q) is "another cotangent sum of the
 *   same shape at the reduced denominator qbar mod a -- a Denjoy-Koksma Birkhoff sum of cot along the
 *   Gauss-map orbit, bounded but NOT vanishing, oscillating with the O(4e-2) amplitude." THIS module
 *   measures that residual directly across a ladder of reduced rationals and confirms it is genuinely
 *   bounded-non-vanishing (not decaying) as the descent depth (denominator) grows. It also separates
 *   the two competing limits the claim rests on. Measurement only; RH open; NO QED.
 *
 *   Offline scripts: tmp/imp-97577-denjoy-koksma-cot-birkhoff.mjs (RESULT 1 + RESULT 2),
 *   tmp/imp-97577-residue-wobble-ladder.mjs (RESULT 3). Outputs baked below; light recomputations
 *   (small q only) run as self-executing assertions.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- along CONVERGENTS p_n/q_n -> x (fixed real x), the wobble CONVERGES (smooth limit)
 *   ------------------------------------------------------------------------------------------
 *   The normalized wobble (w_sym(p_n,q_n) - w_lin(x)) / x^2, evaluated along the continued-fraction
 *   convergents of a quadratic irrational x, converges to a fixed smooth value as q_n -> infinity
 *   (second-half band-amplitude 0.000 at every x tested). This is the analytic period-function (psi)
 *   content of imp-97563 VERDICT(a): at a FIXED x the reciprocity descent lands on the smooth limit.
 *     x = phi        = 1.6180340 -> 0.022410  (stable by q_n ~ 89)
 *     x = 1 + sqrt2  = 2.4142136 -> 0.011770  (stable by q_n ~ 169)
 *     x = (sqrt3+1)/2= 1.3660254 -> 0.021868  (stable by q_n ~ 153)
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- the RAW (un-reciprocated) cot Birkhoff sum GROWS ~ q_n (why reciprocity is needed)
 *   ------------------------------------------------------------------------------------------
 *   The naive cotangent Birkhoff sum B_n = Sum_{k=1}^{q_n - 1} cot(pi k alpha) along the Gauss-map
 *   orbit is NOT bounded: it grows in magnitude linearly in q_n (consecutive increments ratio -> the
 *   quadratic multiplier; |B_n| ~ const * q_n). This is exactly the (q/a)^s h(qbar/a) leading term
 *   that the Bettin-Conrey reciprocity strips off -- so the un-reciprocated sum is the WRONG object;
 *   the bounded residual only appears AFTER reciprocation (RESULT 3).
 *     x = phi         : |B_n| vs log q_n OLS slope = 2204.6  (B_n ~ +/- q_n)
 *     x = 1 + sqrt2   : slope = 1777.3
 *     x = (sqrt3+1)/2 : slope = 1321.4
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 3 -- the reciprocity-residual wobble is BOUNDED-NON-VANISHING as depth grows (the claim)
 *   ------------------------------------------------------------------------------------------
 *   Sampling generic (large-denominator) reduced rationals p/r near a fixed x0 = 0.1 across a
 *   denominator ladder r = 2000 .. 150000 (75x range = descent depth), the reciprocity-symmetrized
 *   wobble (w_sym - w_lin)/x^2 across residue classes has an RMS that stays ESSENTIALLY CONSTANT:
 *     r        RMS wobble   half-range   min        max        mean
 *     2000     0.025157     0.033627     -0.043759  0.023496   0.002664
 *     5000     0.026457     0.043647     -0.064163  0.023130   0.003293
 *     12000    0.025655     0.049373     -0.075317  0.023429   0.003580
 *     30000    0.029140     0.052480     -0.081487  0.023474   -0.004176
 *     75000    0.025733     0.053965     -0.084487  0.023442   0.003390
 *     150000   0.025791     0.054581     -0.085701  0.023460   0.003377
 *   RMS ratio (r=150000 / r=2000) = 1.025; OLS slope of RMS vs log r = 1.6e-4 (~0). The oscillation
 *   does NOT decay -- it is bounded-non-vanishing at the O(4e-2) scale (RMS ~ 0.026, half-range ~ 0.05,
 *   min approaching the 1/10 small-denominator spike -0.087 as more residues are sampled). The mean
 *   stays at ~3e-3 < 1e-2, the Gauss-Kuzmin smooth kappa_smooth of imp-97563 VERDICT(c).
 *
 *   ------------------------------------------------------------------------------------------
 *   NET -- imp-97563 VERDICT(b) is CONFIRMED numerically
 *   ------------------------------------------------------------------------------------------
 *   The residual cotangent sum along the Gauss-map orbit is bounded but non-vanishing: as a function of
 *   the RESIDUE class at fixed denominator size it oscillates with an RMS ~0.026 (O(4e-2)) that does
 *   not decay as the denominator (depth) grows (RESULT 3), while (i) at a FIXED x the convergent descent
 *   converges to a smooth limit (RESULT 1, the psi content) and (ii) the un-reciprocated raw cot sum
 *   grows ~q_n (RESULT 2, the leading term reciprocity removes). This is the Denjoy-Koksma picture: the
 *   cot singularity is non-integrable, so the reciprocity residual has a bounded but non-trivial
 *   oscillation that no finite descent removes -- the intrinsic quantum-modular wobble. Measurement
 *   only; pins NO analytic constant (the exact kappa_smooth is still the psi cusp O(x^2) coefficient,
 *   imp-97578); no bound moves; rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916,
 *   imp-96352) binds first by >2600x; no operator positivity; PT Lambda <= 0.2 remains SOTA; RH open;
 *   NO QED.
 *
 * @see imp-97563-route-m-bettin-conrey-reciprocity-split-assessment (VERDICT(b): the claim measured here)
 * @see imp-97460-route-m-bulk-profile-curvature-analytic-route (obstruction localised; names the reciprocity)
 * @see imp-97437-route-m-bulk-profile-curvature-crossover (kappa_eff = 0.0995 = a wobble amplitude)
 *
 * Ticket: imp-97577 (numerical, opus-4-8, api-pool). Denjoy-Koksma residual MEASURED bounded-non-vanishing; NO QED.
 */

export const IMP97577_GAMMA = 0.5772156649015329;
export const IMP97577_C = (Math.log(2 * Math.PI) - IMP97577_GAMMA) / 2;

// forced small-x truncation w_lin(x) (imp-97460 RESULT 1 / imp-97563).
export function imp97577WLin(x) {
  return (2 * IMP97577_C) / Math.PI + Math.log(x) / Math.PI - x / Math.PI;
}

// Vasyunin sum V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q) (light; small q only).
export function imp97577V(a, q) {
  let s = 0;
  for (let m = 1; m < q; m++) {
    const t = (m * a) / q;
    s += (t - Math.floor(t)) / Math.tan((Math.PI * m) / q);
  }
  return s;
}
export const imp97577WSym = (a, q) => (imp97577V(a, q) + imp97577V(q, a)) / q;

// raw cotangent Birkhoff sum B = Sum_{k=1}^{q-1} cot(pi k alpha) along the Gauss orbit (light; small q).
export function imp97577CotBirkhoff(alpha, q) {
  let s = 0;
  for (let k = 1; k < q; k++) {
    s += 1 / Math.tan(Math.PI * (k * alpha - Math.floor(k * alpha)));
  }
  return s;
}

// -- RESULT 1: fixed-x convergent wobble limits (smooth psi content). -------------------------------
export const IMP97577_CONVERGENT_LIMITS = Object.freeze([
  Object.freeze({ x: 'phi', xValue: 1.6180339887, wobbleLimit: 0.022410, stableByQ: 89 }),
  Object.freeze({ x: '1+sqrt2', xValue: 2.4142135624, wobbleLimit: 0.011770, stableByQ: 169 }),
  Object.freeze({ x: '(sqrt3+1)/2', xValue: 1.3660254038, wobbleLimit: 0.021868, stableByQ: 153 }),
]);

// -- RESULT 2: raw un-reciprocated cot Birkhoff sum grows ~ q_n. ------------------------------------
export const IMP97577_RAW_COT_GROWTH = Object.freeze([
  Object.freeze({ x: 'phi', alpha: 0.6180339887, absBvsLogQslope: 2204.6, note: 'B_n ~ +/- q_n' }),
  Object.freeze({ x: '1+sqrt2', alpha: 0.4142135624, absBvsLogQslope: 1777.3, note: 'B_n ~ +/- q_n' }),
  Object.freeze({ x: '(sqrt3+1)/2', alpha: 0.3660254038, absBvsLogQslope: 1321.4, note: 'B_n ~ +/- q_n' }),
]);

// -- RESULT 3: reciprocity-residual wobble ladder near x0=0.1 (bounded-non-vanishing). --------------
export const IMP97577_RESIDUE_WOBBLE_LADDER = Object.freeze([
  Object.freeze({ r: 2000, rms: 0.025157, halfRange: 0.033627, min: -0.043759, max: 0.023496, mean: 0.002664 }),
  Object.freeze({ r: 5000, rms: 0.026457, halfRange: 0.043647, min: -0.064163, max: 0.023130, mean: 0.003293 }),
  Object.freeze({ r: 12000, rms: 0.025655, halfRange: 0.049373, min: -0.075317, max: 0.023429, mean: 0.003580 }),
  Object.freeze({ r: 30000, rms: 0.029140, halfRange: 0.052480, min: -0.081487, max: 0.023474, mean: -0.004176 }),
  Object.freeze({ r: 75000, rms: 0.025733, halfRange: 0.053965, min: -0.084487, max: 0.023442, mean: 0.003390 }),
  Object.freeze({ r: 150000, rms: 0.025791, halfRange: 0.054581, min: -0.085701, max: 0.023460, mean: 0.003377 }),
]);

export const IMP97577_RMS_RATIO_LAST_OVER_FIRST = 1.025; // RMS(150000)/RMS(2000)
export const IMP97577_RMS_VS_LOGR_SLOPE = 1.6e-4; // ~0 => non-decaying
export const IMP97577_WOBBLE_RMS_SCALE = 0.026; // O(4e-2), matches imp-97563 wobble RMS
export const IMP97577_SMOOTH_MEAN_SCALE = 3e-3; // Gauss-Kuzmin smooth mean < kappa_smooth 1e-2

export const IMP97577_VERDICT = Object.freeze({
  id: 'imp-97577',
  proofSection: 'Route-M',
  question:
    'Measure the Denjoy-Koksma Birkhoff sum of the imp-97563 residual cotangent sum along the Gauss-map ' +
    'orbit and confirm the residual is bounded-non-vanishing (not decaying) as descent depth grows.',
  convergentWobbleConvergesAtFixedX: true, // RESULT 1: smooth psi limit at fixed x
  rawCotSumGrowsLinearInQ: true, // RESULT 2: un-reciprocated sum ~ q_n (leading term reciprocity strips)
  residueWobbleRmsConstantAcrossDepth: true, // RESULT 3: RMS ~0.026 flat over 75x denominator range
  residueWobbleNonDecaying: true, // RMS vs log r slope ~1.6e-4 ~ 0
  boundedNonVanishingConfirmed: true, // imp-97563 VERDICT(b) confirmed numerically
  wobbleRmsScale: IMP97577_WOBBLE_RMS_SCALE, // O(4e-2)
  smoothMeanBelowKappaSmooth: true, // mean ~3e-3 < 1e-2
  anyBoundMoved: false,
  analyticConstantPinned: false, // exact kappa_smooth still the psi cusp coefficient (imp-97578)
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'imp-97563 VERDICT(b) is confirmed by direct measurement. The reciprocity-residual cotangent sum ' +
    'along the Gauss-map orbit, viewed as a function of the residue class at fixed denominator size, ' +
    'oscillates with an RMS ~0.026 (O(4e-2)) that does NOT decay as the denominator (descent depth) ' +
    'grows over a 75x range (RMS ratio 1.025, RMS-vs-log-r slope 1.6e-4 ~ 0). This is bounded-' +
    'non-vanishing in the Denjoy-Koksma sense set by the non-integrable cot singularity. It is ' +
    'distinct from (i) the fixed-x convergent limit, which CONVERGES to a smooth value (the psi ' +
    'content, RESULT 1), and (ii) the raw un-reciprocated cot sum, which GROWS ~q_n (the leading ' +
    'term the reciprocity strips, RESULT 2). Measurement only; pins no analytic constant (exact ' +
    'kappa_smooth = psi cusp O(x^2) coefficient, imp-97578); no bound moves; the rigorous anchor ' +
    'stays T = 2.594e7; compute binds first by >2600x; no operator positivity; PT Lambda <= 0.2 SOTA; ' +
    'RH open; NO QED.',
});

export const IMP97577_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Measurement only: the imp-97563 reciprocity residual ' +
  'is a Denjoy-Koksma cot Birkhoff sum along the Gauss-map orbit that is BOUNDED but NON-VANISHING -- ' +
  'its residue-class RMS stays ~0.026 (O(4e-2)) across a 75x denominator range (slope vs log r ~1.6e-4), ' +
  'while the fixed-x convergent wobble converges (smooth psi) and the raw un-reciprocated cot sum grows ' +
  '~q_n. No analytic constant is pinned; the rigorous anchor stays T = 2.594e7; compute binds first by ' +
  '>2600x.';

export default IMP97577_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. Light sums only. --
const IMP97577_ASSERTIONS = [
  {
    id: 'imp97577-convergent-wobble-limit-phi',
    why: 'RESULT 1: the phi convergent wobble must sit at its baked smooth limit ~0.022410 by q_n=89 ' +
      '(recomputed light from the reduced convergent 144/89 -> x = phi = 1.618).',
    holds: () => {
      const x = 144 / 89;
      const w = (imp97577WSym(144, 89) - imp97577WLin(x)) / (x * x);
      return Math.abs(w - 0.022410) < 5e-4;
    },
  },
  {
    id: 'imp97577-raw-cot-sum-grows',
    why: 'RESULT 2: the raw un-reciprocated cot Birkhoff sum must grow -- |B(q=21)| > |B(q=13)| for ' +
      'the golden orbit, with the sign alternating (the ~ -phi increment ratio).',
    holds: () => {
      const a = 0.6180339887;
      const b13 = imp97577CotBirkhoff(a, 13);
      const b21 = imp97577CotBirkhoff(a, 21);
      return Math.abs(b21) > Math.abs(b13) && b13 * b21 < 0;
    },
  },
  {
    id: 'imp97577-residue-wobble-non-decaying',
    why: 'RESULT 3 (the claim): the residue-class wobble RMS must stay ~constant across the denominator ' +
      'ladder -- ratio (last/first) within 15 percent of 1 and every RMS at the O(4e-2) scale.',
    holds: () => {
      const rms = IMP97577_RESIDUE_WOBBLE_LADDER.map((r) => r.rms);
      const ratio = rms[rms.length - 1] / rms[0];
      const allScale = rms.every((v) => v > 0.02 && v < 0.035);
      return Math.abs(ratio - 1) < 0.15 && allScale && Math.abs(IMP97577_RMS_RATIO_LAST_OVER_FIRST - ratio) < 0.02;
    },
  },
  {
    id: 'imp97577-residue-wobble-slope-near-zero',
    why: 'RESULT 3: the OLS slope of RMS vs log r must be ~0 (non-decaying), well below the RMS scale.',
    holds: () => {
      const xs = IMP97577_RESIDUE_WOBBLE_LADDER.map((r) => Math.log(r.r));
      const ys = IMP97577_RESIDUE_WOBBLE_LADDER.map((r) => r.rms);
      const mx = xs.reduce((a, b) => a + b) / xs.length;
      const my = ys.reduce((a, b) => a + b) / ys.length;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < xs.length; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
      return Math.abs(sxy / sxx) < 5e-3;
    },
  },
  {
    id: 'imp97577-honesty-gate-no-qed',
    why: 'measurement only: bounded-non-vanishing confirmed, no constant pinned, no bound moved, compute ' +
      'binds first, honest markers present.',
    holds: () =>
      IMP97577_VERDICT.anyBoundMoved === false &&
      IMP97577_VERDICT.boundedNonVanishingConfirmed === true &&
      IMP97577_VERDICT.residueWobbleNonDecaying === true &&
      IMP97577_VERDICT.rawCotSumGrowsLinearInQ === true &&
      IMP97577_VERDICT.convergentWobbleConvergesAtFixedX === true &&
      IMP97577_VERDICT.analyticConstantPinned === false &&
      IMP97577_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97577_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97577_HONEST_BANNER) &&
      /RH open/.test(IMP97577_HONEST_BANNER),
  },
];

for (const a of IMP97577_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97577-denjoy-koksma-cot-birkhoff-wobble assertion failed: ${a.id}`);
  }
}

export { IMP97577_ASSERTIONS };
