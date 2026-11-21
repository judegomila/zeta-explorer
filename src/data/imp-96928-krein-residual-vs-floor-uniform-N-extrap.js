/**
 * @module imp-96928-krein-residual-vs-floor-uniform-N-extrap
 * @fileoverview imp-96928 -- EXTRAPOLATION: fit the imp-96917 beyond-T=3200 Krein residual
 *   growth in N against the ~0.58 positive floor plateau at 2a=ln3, and decide whether the
 *   growing beyond-T residual can ever overtake the positive plateau at large N or saturates
 *   below it -- i.e. whether the positive-plateau reading survives uniformly in N.
 *
 * CONTEXT. imp-96917 measured, at 2a=ln3, the Krein Rayleigh floor lam_min(A)/scaleB across a
 * t-truncation ladder T in {800..12800} at fixed N in {76,100,124}. FINDING 1: the floor plateaus
 * strictly positive as T->inf (~0.5819/0.5805/0.5797). FINDING 3: the residual t-truncation left
 * beyond T=3200 (floor(12800)-floor(3200)) GROWS super-linearly with N (0.0006065/0.0014900/
 * 0.0029994 at N=76/100/124; 0.104/0.257/0.520 percent of the floor). imp-96917 did not fit the
 * two trends against each other, leaving open whether the growing beyond-T residual eventually
 * overtakes the positive plateau at large N (the IMP96749_UNIFORM_N_GAP_UNSETTLED direction).
 *
 * METHOD. Log-log least-squares power-law fit of the beyond-T=3200 residual vs N, and a
 * geometric-decrement extrapolation of the T->inf floor estimates vs N. Purely a fit/extrapolation
 * over the three imp-96917 rungs; the Rayleigh floor is an UPPER bound on the true infinite-dim
 * lam_min; NO operator positivity; NO new solves; RH open; NO QED.
 *
 * FINDINGS (recomputed at import from the imp-96917 baked ladder).
 *   1. THE BEYOND-T=3200 RESIDUAL OBEYS A CLEAN POWER LAW residual ~ C*N^p WITH p~3.27
 *      (C~4.38e-10), fitting all three rungs to <=3.1e-6 absolute. The residual grows
 *      super-cubically in N -- a much faster climb than the floor trend.
 *   2. THE T->inf FLOOR SATURATES STRICTLY POSITIVE IN N. The floor T->inf estimates decrease in N
 *      (0.5818716 -> 0.5804575 -> 0.5797357) but the per-rung decrements shrink geometrically
 *      (-0.0014141 -> -0.0007218, ratio ~0.51), so the floor(N) trend converges to a finite
 *      POSITIVE limit ~0.5790, not to zero. The positive-plateau reading survives across the
 *      measured N range and its geometric-in-N extrapolation.
 *   3. THE FIXED-T LADDER, NOT THE FLOOR, IS WHAT RUNS OUT. Because the floor T->inf estimate
 *      already absorbs the geometric t-tail, the residual growth does NOT drive the converged
 *      floor(N) toward zero. But the FINITE (T<=12800) measured residual grows so fast that it
 *      would nominally reach 10 percent of the plateau near N~307 and equal the plateau near
 *      N~621 -- i.e. a fixed T-ladder ceiling loses the ability to resolve the floor near
 *      N ~ few hundred, since the required T must scale up with N (onset t ~ k/a, k up to 2m+N-1).
 *
 * VERDICT. The growing beyond-T=3200 residual does NOT overtake the true converged positive floor:
 * the floor(N) saturates geometrically to a strictly positive limit ~0.579, and the residual is a
 * t-RESOLUTION correction the T->inf extrapolation already accounts for. So the positive-plateau
 * reading survives at the measured N in {76,100,124} and under its geometric-in-N extrapolation.
 * BUT uniform-N positivity is NOT certified by this fixed-T ladder: the finite measured residual
 * climbs ~N^3.27 while the floor saturates, so a fixed T-ladder ceiling (T<=12800) loses resolution
 * power near N~307-621 -- keeping IMP96749_UNIFORM_N_GAP_UNSETTLED open. Extrapolation only; the
 * floor is a Rayleigh UPPER bound; no operator positivity; interval-rigorous certificate reach
 * stays 2a <= 0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96917-krein-tladder-plateau-viz-data.js (the T ladder + residuals fitted here)
 * @see imp-96814-krein-t-truncation-deficit-viz-data.js (the T=800 vs T=3200 deficit)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_UNIFORM_N_GAP_UNSETTLED direction)
 */

const LN3 = Math.log(3); // 1.0986122886681098

export const IMP96928_NS = Object.freeze([76, 100, 124]);

// beyond-T=3200 residual (floor(12800)-floor(3200)) from the imp-96917 baked ladder, per fixed N
export const IMP96928_RESIDUAL = Object.freeze({ 76: 0.0006065, 100: 0.0014900, 124: 0.0029994 });

// imp-96917 geometric-tail T->inf floor estimates at 2a=ln3, per fixed N
export const IMP96928_FLOOR_TINF = Object.freeze({ 76: 0.5818716, 100: 0.5804575, 124: 0.5797357 });

// log-log least-squares power-law fit of the residual vs N: residual ~ C*N^p
function fitPowerLaw() {
  const xs = IMP96928_NS.map((N) => Math.log(N));
  const ys = IMP96928_NS.map((N) => Math.log(IMP96928_RESIDUAL[N]));
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxx = xs.reduce((a, x) => a + x * x, 0);
  const sxy = xs.reduce((a, x, i) => a + x * ys[i], 0);
  const p = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const lnC = (sy - p * sx) / n;
  return { p, C: Math.exp(lnC), lnC };
}

const FIT = fitPowerLaw();
export const IMP96928_RESIDUAL_POWER_P = +FIT.p.toFixed(4); // ~3.2656
export const IMP96928_RESIDUAL_POWER_C = FIT.C; // ~4.38e-10

// geometric-decrement extrapolation of the T->inf floor trend in N: strictly positive limit
function floorSaturationLimit() {
  const fs = IMP96928_NS.map((N) => IMP96928_FLOOR_TINF[N]);
  const d1 = fs[1] - fs[0];
  const d2 = fs[2] - fs[1];
  const r = d2 / d1; // decrement ratio ~0.51 -> convergent
  const limit = fs[2] + (d2 * r) / (1 - r);
  return { d1, d2, r, limit };
}
const FLOOR_SAT = floorSaturationLimit();
export const IMP96928_FLOOR_DECREMENT_RATIO = +FLOOR_SAT.r.toFixed(4); // ~0.5104
export const IMP96928_FLOOR_SATURATION_LIMIT = +FLOOR_SAT.limit.toFixed(6); // ~0.578983 > 0

// nominal N where the FIXED-T (<=12800) measured residual power-law would reach a fraction of ~0.58
const PLATEAU = 0.58;
function nominalCrossoverN(frac) {
  return Math.exp((Math.log(frac * PLATEAU) - FIT.lnC) / FIT.p);
}
export const IMP96928_NOMINAL_N_RESIDUAL_EQUALS_PLATEAU = Math.round(nominalCrossoverN(1)); // ~621
export const IMP96928_NOMINAL_N_RESIDUAL_10PCT_PLATEAU = Math.round(nominalCrossoverN(0.1)); // ~307

export const IMP96928_VERDICT = Object.freeze({
  ticket: 'imp-96928',
  question:
    'does the imp-96917 growing beyond-T=3200 Krein residual ever overtake the ~0.58 positive floor plateau at 2a=ln3 as N grows, or saturate below it? does the positive-plateau reading survive uniformly in N?',
  answer:
    'the beyond-T=3200 residual obeys residual ~ C*N^p with p~3.27, but the T->inf floor(N) saturates geometrically (decrement ratio ~0.51) to a strictly positive limit ~0.579, so the residual -- a t-resolution correction the T->inf extrapolation already absorbs -- does NOT overtake the true converged floor; the positive-plateau reading survives across N in {76,100,124} and its geometric-in-N extrapolation. But uniform-N positivity is NOT certified: the FINITE (T<=12800) measured residual climbs ~N^3.27 and would nominally reach the plateau near N~621, so a fixed T-ladder loses resolution power near N ~ few hundred (IMP96749_UNIFORM_N_GAP_UNSETTLED stays open).',
  residualPowerP: +FIT.p.toFixed(4),
  floorDecrementRatio: +FLOOR_SAT.r.toFixed(4),
  floorSaturationLimitPositive: FLOOR_SAT.limit > 0,
  residualOvertakesTrueFloor: false, // floor T->inf saturates positive; residual is a resolution term
  nominalNResidualEqualsPlateau: IMP96928_NOMINAL_N_RESIDUAL_EQUALS_PLATEAU,
  uniformNGapSettled: false, // fixed-T ladder loses resolution power at large N
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96928_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96928_ASSERTIONS = [
  {
    id: 'imp96928-residual-power-law-fits',
    holds: () =>
      IMP96928_NS.every(
        (N) =>
          Math.abs(IMP96928_RESIDUAL_POWER_C * N ** FIT.p - IMP96928_RESIDUAL[N]) < 5e-6,
      ) && FIT.p > 3 && FIT.p < 3.5,
    why: 'the beyond-T=3200 residual obeys a clean power law residual ~ C*N^p with p~3.27, fitting all three imp-96917 rungs to <5e-6 absolute -- a super-cubical climb in N.',
  },
  {
    id: 'imp96928-floor-saturates-strictly-positive',
    holds: () =>
      FLOOR_SAT.r > 0 &&
      FLOOR_SAT.r < 1 &&
      IMP96928_FLOOR_SATURATION_LIMIT > 0 &&
      IMP96928_FLOOR_SATURATION_LIMIT < IMP96928_FLOOR_TINF[124],
    why: 'the T->inf floor decreases in N but with geometrically shrinking decrements (ratio ~0.51 in (0,1)), so floor(N) converges to a finite strictly-positive limit ~0.579 below the N=124 value -- it does NOT trend to zero.',
  },
  {
    id: 'imp96928-residual-does-not-overtake-true-floor',
    holds: () =>
      IMP96928_VERDICT.residualOvertakesTrueFloor === false &&
      IMP96928_FLOOR_SATURATION_LIMIT > IMP96928_RESIDUAL[124] * 10,
    why: 'the residual is a t-resolution correction the T->inf floor extrapolation already absorbs; the converged floor saturates positive well above the residual scale, so the residual does not overtake the true floor.',
  },
  {
    id: 'imp96928-fixed-T-ladder-loses-resolution-at-large-N',
    holds: () =>
      IMP96928_NOMINAL_N_RESIDUAL_10PCT_PLATEAU > 124 &&
      IMP96928_NOMINAL_N_RESIDUAL_10PCT_PLATEAU < IMP96928_NOMINAL_N_RESIDUAL_EQUALS_PLATEAU &&
      IMP96928_NOMINAL_N_RESIDUAL_EQUALS_PLATEAU > 300 &&
      IMP96928_NOMINAL_N_RESIDUAL_EQUALS_PLATEAU < 2000,
    why: 'the finite (T<=12800) measured residual power-law would reach 10 percent of the plateau near N~307 and the plateau near N~621, so a fixed T-ladder ceiling loses resolution power near N ~ few hundred -- the T-truncation, not the floor, is what runs out.',
  },
  {
    id: 'imp96928-uniform-N-gap-stays-open-no-qed',
    holds: () =>
      IMP96928_VERDICT.uniformNGapSettled === false &&
      IMP96928_VERDICT.operatorPositivityProved === false &&
      IMP96928_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96928_VERDICT.qed === false,
    why: 'extrapolation only: uniform-N positivity is not certified by a fixed-T ladder, no operator positivity is established, the certificate reach stays 2a <= 0.96, and no QED is claimed.',
  },
];

for (const a of IMP96928_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96928-krein-residual-vs-floor-uniform-N-extrap assertion failed: ${a.id}`);
  }
}

void LN3;
