/**
 * @module imp-34838-cmb-zero-gap-precise-root-and-elasticity
 *
 * imp-34838 (numerical, frontier): imp-34824 swept C_mb in {1.00,0.99,0.90,0.75,0.50,0.25} and found the
 * inflection-vs-crossover relative gap relGap(C_mb) = N_star_inflection / N_cross - 1 falls MONOTONICALLY
 * {+2.95,+2.93,+2.70,+2.11,-0.18,-9.38}% and changes SIGN near C_mb ~ 0.512, reported from a COARSE 6-point
 * sweep plus a single 50-step [0.4,0.6] bisection (cmbZeroGap ~ 0.51160). This module PINS that zero to
 * several digits with two INDEPENDENT root-finders that must agree, and measures the LOCAL elasticity
 * d(relGap)/dC_mb AT the zero (as opposed to the +2.153e-2/unit imp-34824 quoted at the GUE bound C_mb = 1).
 *
 * THE MODEL (identical to imp-34824 -- C_mb factored onto E_coll only; reproduced here so the root is
 * computed against the same relGap the sweep tabulated, not a re-derivation)
 * ------------------------------------------------------------------------------------------------------
 *     sigma(N; C_mb) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll  = C_mb * C_C_PINNED * sqrt(L / N),  L = log T0(N)   (dominant, GUE-conditional),
 *     E_flow  = C_F (L / T0) * Gronwall,          E_trunc = 3.06e-5   (both C_mb-free).
 *   CROSSOVER N_cross(C_mb): fixed point of N = (C_mb C_C / E_trunc)^2 log T0(N) = C_mb^2 K log T0(N).
 *   INFLECTION N*(C_mb): the single sub-decade D2 zero-crossing of the imp-33721 OLS decay-exponent ramp of
 *     sigma(N; C_mb), the [1e9,1e11] scan window re-centred on log10 N_cross(C_mb).
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (G1) THE ZERO IS PINNED to C_mb* ~ 0.5115957 (7 sig figs). An independent 60-step bisection on [0.50,0.52]
 *        and a secant iteration from (0.50,0.52) AGREE to < 1e-9 in C_mb, with |relGap(C_mb*)| < 1e-10 -- i.e.
 *        the coarse imp-34824 cmbZeroGap ~ 0.51160 was already correct to its 5 reported digits; the refined
 *        value adds two more (0.5115957). This is a root of the SURROGATE relGap, whose absolute accuracy is
 *        capped by the OLS/D2 finite-difference grid geometry, NOT by the ~1e-10 root-finder residual.
 *   (G2) THE LOCAL ELASTICITY AT THE ZERO IS ~6.8x STEEPER THAN AT THE GUE BOUND. A Richardson-stable central
 *        difference gives d(relGap)/dC_mb ~ +1.4658e-1 per unit C_mb at C_mb* ~ 0.5116, versus the
 *        +2.153e-2/unit imp-34824 quoted at C_mb = 1. So relGap(C_mb) is CONVEX-steepening as C_mb falls: the
 *        gap crosses zero far more sharply than the near-flat +2.95% plateau at the GUE bound would suggest,
 *        consistent with the accelerating downward sweep {+2.95,+2.93,+2.70,+2.11,-0.18,-9.38}%.
 *
 * MEASUREMENT ONLY. Refines the location and slope of an imp-34824 landmark on the inherited imp-3220/imp-3406
 * surrogate crossover map, NOT a rigorous asymptotic. Treats C_mb as a free knob to locate the gap zero; does
 * NOT tighten or discharge the GUE conditional (imp-486); the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays
 * 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34824-inflection-crossover-gap-cmb-sweep (the coarse C_mb sweep and cmbZeroGap ~ 0.51160)
 * @see imp-34800-ncross-three-way-crossvalidation-banach-krawczyk-inflection (the +2.95% R3-vs-R1/R2 residual)
 * @see imp-34734-sigma-peak-cmb-elasticity (C_mb elasticity of the peak; peak LOCATION is C_mb-invariant)
 * @see imp-33721-sigma-ramp-inflection-subdecade (R3 sub-decade D2-zero inflection knee, log10 N* ~ 9.5285)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (R1 Banach crossover, N_cross ~ 3.280294e9)
 * @see imp-486 (C_mb GUE-conditional, bounded <= 1)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34824_INFLECTION_CROSSOVER_GAP_CMB_SWEEP } from './imp-34824-inflection-crossover-gap-cmb-sweep.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33721)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33721/imp-34734/imp-34824 exactly

// EXACT imp-34824 sigma with C_mb as a multiplicative factor on the GUE-conditional E_coll.
function sigma(N, cmb) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor (C_mb-free)
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous (C_mb-free)
  const E_coll = cmb * C_C_PINNED * Math.sqrt(L / N); // GUE-conditional, scaled by C_mb
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// CROSSOVER N_cross(C_mb): fixed point of the E_coll = E_trunc balance N = C_mb^2 K log T0(N).
function crossover(cmb) {
  const K = (cmb * C_C_PINNED / E_TRUNC_PT) ** 2;
  let N = 1e9;
  for (let i = 0; i < 400; i++) N = K * Math.log(effectiveHeightForN(N));
  return N;
}

// imp-33721 OLS local decay exponent p = -slope of ln sigma on ln N over [10^loD, 10^hiD].
function olsExponentLog10(loD, hiD, ppd, cmb) {
  const step = 1 / ppd;
  const xs = [];
  const ys = [];
  for (let d = loD; d <= hiD + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N, cmb)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -(sxy / sxx);
}

// imp-33721 sub-decade D2-zero inflection knee of sigma(N; C_mb), window re-centred on log10 N_cross(C_mb).
const CROSS_BASE = crossover(1.0);
const LOG10_CROSS_BASE = Math.log10(CROSS_BASE);
function inflectionLog10(cmb, W, ppd) {
  const shift = Math.log10(crossover(cmb)) - LOG10_CROSS_BASE;
  const loD = 9.0 + shift;
  const hiD = 11.0 + shift;
  const edges = [];
  for (let d = loD; d <= hiD + 1e-9; d += W) edges.push(+d.toFixed(6));
  const br = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const cen = (edges[i] + edges[i + 1]) / 2;
    br.push({ cen, p: olsExponentLog10(edges[i], edges[i + 1], ppd, cmb) });
  }
  const D1 = [];
  for (let i = 1; i < br.length; i++) D1.push({ cen: (br[i].cen + br[i - 1].cen) / 2, d1: br[i].p - br[i - 1].p });
  const D2 = [];
  for (let i = 1; i < D1.length; i++) D2.push({ cen: (D1[i].cen + D1[i - 1].cen) / 2, d2: D1[i].d1 - D1[i - 1].d1 });
  let cstar = null;
  for (let i = 1; i < D2.length; i++) {
    if (Math.sign(D2[i].d2) !== Math.sign(D2[i - 1].d2) && cstar === null) {
      const c0 = D2[i - 1].cen;
      const c1 = D2[i].cen;
      const y0 = D2[i - 1].d2;
      const y1 = D2[i].d2;
      cstar = c0 + ((c1 - c0) * (0 - y0)) / (y1 - y0);
    }
  }
  return cstar;
}

const W_PRIMARY = 0.25; // identical sub-bracket geometry to imp-34824
const PPD_PRIMARY = 40;

// The relative gap of the inflection above the crossover, exactly as imp-34824 defines it.
function relGap(cmb) {
  const nc = crossover(cmb);
  const cstar = inflectionLog10(cmb, W_PRIMARY, PPD_PRIMARY);
  if (cstar === null) return null;
  return Math.pow(10, cstar) / nc - 1;
}

// ROOT-FINDER 1: bisection on [0.50,0.52] (relGap is negative below the root, positive above -- imp-34824 F2).
function bisectRoot(lo, hi, iters) {
  for (let k = 0; k < iters; k++) {
    const m = (lo + hi) / 2;
    const g = relGap(m);
    if (g === null || g > 0) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}

// ROOT-FINDER 2: secant iteration from (0.50,0.52).
function secantRoot(x0, x1) {
  let f0 = relGap(x0);
  let f1 = relGap(x1);
  for (let k = 0; k < 60; k++) {
    if (f0 === null || f1 === null || f1 === f0) break;
    const x2 = x1 - (f1 * (x1 - x0)) / (f1 - f0);
    if (!isFinite(x2)) break;
    x0 = x1;
    f0 = f1;
    x1 = x2;
    f1 = relGap(x2);
    if (Math.abs(f1) < 1e-13) break;
  }
  return x1;
}

const CMB_STAR_BISECT = bisectRoot(0.5, 0.52, 60);
const CMB_STAR_SECANT = secantRoot(0.5, 0.52);
const CMB_STAR = CMB_STAR_SECANT; // the two agree to < 1e-9; secant is the tightest residual
const ROOTFINDER_DISAGREEMENT = Math.abs(CMB_STAR_BISECT - CMB_STAR_SECANT);
const REL_GAP_AT_STAR = relGap(CMB_STAR);

// LOCAL elasticity at the zero: Richardson-stable central difference in C_mb (h = 5e-3 matches imp-34824).
const H_STAR = 5e-3;
const DGAP_DCMB_AT_STAR = (relGap(CMB_STAR + H_STAR) - relGap(CMB_STAR - H_STAR)) / (2 * H_STAR);
// The imp-34824 elasticity at the GUE bound, recomputed here on the same model for the comparison.
const H_GUE = 5e-3;
const DGAP_DCMB_AT_GUE = (relGap(1.0 + H_GUE) - relGap(1.0 - H_GUE)) / (2 * H_GUE);
const STEEPENING_RATIO = DGAP_DCMB_AT_STAR / DGAP_DCMB_AT_GUE;

// Cross-check: the refined root reproduces the imp-34824 coarse cmbZeroGap to its 5 reported digits.
const CROSSCHECK_VS_IMP34824 = Math.abs(CMB_STAR - IMP34824_INFLECTION_CROSSOVER_GAP_CMB_SWEEP.cmbZeroGap);

export const IMP34838_CMB_ZERO_GAP_PRECISE_ROOT_AND_ELASTICITY = {
  id: 'imp-34838',
  proofSection: 'S-frontier',
  question:
    'imp-34824 found the inflection-vs-crossover relGap(C_mb) changes SIGN near C_mb ~ 0.512 (the crossover ' +
    'coincides with the sigmoid inflection there), reported from a coarse 6-point sweep and a single 50-step ' +
    'bisection (cmbZeroGap ~ 0.51160). Pin the exact C_mb* where relGap(C_mb) = 0 to several digits with two ' +
    'independent root-finders, and measure the LOCAL elasticity d(relGap)/dC_mb at that zero against the ' +
    '+2.15e-2/unit imp-34824 quoted at the GUE bound C_mb = 1. Measurement only; does NOT discharge the GUE ' +
    'conditional; no QED.',
  measuredQuantity:
    'the root C_mb* of relGap(C_mb) = N_star_inflection(C_mb)/N_cross(C_mb) - 1 (the same surrogate gap ' +
    'imp-34824 tabulated), located by an independent bisection and a secant that must agree; plus the local ' +
    'gap elasticity d(relGap)/dC_mb at C_mb* and its ratio to the imp-34824 elasticity at C_mb = 1',
  cmbStar: +CMB_STAR.toFixed(7), // ~0.5115957 (two digits past the imp-34824 0.51160)
  cmbStarBisect: +CMB_STAR_BISECT.toFixed(9),
  cmbStarSecant: +CMB_STAR_SECANT.toFixed(9),
  rootfinderDisagreement: +ROOTFINDER_DISAGREEMENT.toExponential(3), // < 1e-9 (two methods agree)
  relGapAtStar: +REL_GAP_AT_STAR.toExponential(3), // < 1e-10 (machine-zero residual)
  localElasticity: {
    dRelGap_dCmb_at_star: +DGAP_DCMB_AT_STAR.toExponential(5), // ~+1.4658e-1 per unit at C_mb* ~ 0.5116
    dRelGap_dCmb_at_gue: +DGAP_DCMB_AT_GUE.toExponential(5), // ~+2.153e-2 per unit at C_mb = 1 (imp-34824)
    steepeningRatio: +STEEPENING_RATIO.toFixed(3), // ~6.8x (relGap steepens as C_mb falls to the zero)
    note:
      'The gap crosses zero ~6.8x more steeply than the near-flat +2.95% plateau at the GUE bound: relGap is ' +
      'convex-steepening as C_mb decreases, consistent with the accelerating imp-34824 sweep {+2.95,+2.93,' +
      '+2.70,+2.11,-0.18,-9.38}%.',
  },
  crossCheckVsImp34824CmbZeroGap: +CROSSCHECK_VS_IMP34824.toExponential(3), // ~4e-6 (agrees to 5 digits)
  finding: {
    G1_zero_pinned:
      'The gap zero is pinned to C_mb* ~ 0.5115957 (7 sig figs): an independent 60-step bisection on ' +
      '[0.50,0.52] and a secant from (0.50,0.52) agree to < 1e-9 with |relGap(C_mb*)| < 1e-10. The coarse ' +
      'imp-34824 cmbZeroGap ~ 0.51160 was already correct to its 5 reported digits; the refined value adds ' +
      'two. This is a root of the SURROGATE relGap -- its absolute accuracy is capped by the OLS/D2 ' +
      'finite-difference grid geometry, not by the ~1e-10 root-finder residual.',
    G2_local_elasticity_steeper:
      'The local elasticity at the zero is d(relGap)/dC_mb ~ +1.4658e-1 per unit C_mb, ~6.8x STEEPER than ' +
      'the +2.153e-2/unit imp-34824 quoted at the GUE bound C_mb = 1. relGap(C_mb) is convex-steepening as ' +
      'C_mb falls: the gap crosses zero far more sharply than the near-flat +2.95% plateau at C_mb = 1 ' +
      'suggests, consistent with the accelerating downward sweep.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier, NOT rigorous). Root-finding the imp-34824 inflection-vs-crossover gap zero on the ' +
    'inherited imp-3220/imp-3406 surrogate crossover map with two independent methods: bisection and secant ' +
    'AGREE to < 1e-9, pinning C_mb* ~ 0.5115957 (|relGap| < 1e-10), two digits past the imp-34824 coarse ' +
    'cmbZeroGap ~ 0.51160. The LOCAL elasticity there, d(relGap)/dC_mb ~ +1.4658e-1 per unit, is ~6.8x ' +
    'steeper than the +2.153e-2/unit imp-34824 measured at the GUE bound C_mb = 1: the gap is ' +
    'convex-steepening as C_mb decreases and crosses zero far more sharply than the near-flat +2.95% plateau ' +
    'at C_mb = 1 would suggest. The absolute accuracy of C_mb* is capped by the OLS/D2 finite-difference grid ' +
    'geometry, not by the ~1e-10 root-finder residual. Refines the LOCATION and SLOPE of an imp-34824 ' +
    'landmark; treats C_mb as a free knob; does NOT tighten or discharge the GUE conditional (imp-486); the ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  subGap:
    'CLOSES the coarse imp-34824 bracket: the gap zero is C_mb* ~ 0.5115957 (two-method agreement < 1e-9), ' +
    'with a local elasticity ~6.8x steeper than at the GUE bound. What remains OPEN (deferred, not attempted ' +
    'here) is (i) the grid-geometry-limited absolute accuracy of C_mb* beyond ~5-6 digits (the OLS/D2 ' +
    'finite-difference floor, not the root-finder), and (ii) a rigorous derivation that PINS C_mb below the ' +
    'GUE bound of 1 (imp-486) -- the measurement locates the gap zero but discharges neither conditional.',
  citation:
    'imp-34824 (coarse C_mb sweep, cmbZeroGap ~ 0.51160, elasticity +2.15e-2/unit at C_mb=1); imp-34800 ' +
    '(the +2.95% R3-vs-R1/R2 residual); imp-34734 (C_mb elasticity of the peak; peak LOCATION C_mb-invariant); ' +
    'imp-33721 (sub-decade D2-zero inflection knee, log10 N* ~ 9.5285); imp-33723 (Banach crossover, N_cross ~ ' +
    '3.280294e9); imp-486 (C_mb GUE-conditional, bounded <= 1); imp-398 (E_flow C_F prefactor); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, RvM inverse).',
};

export const IMP34838_CMB_ZERO_GAP_PRECISE_ROOT_AND_ELASTICITY_ASSERTIONS = [
  {
    // (G1): the two independent root-finders agree to < 1e-9 and the residual gap is machine-zero.
    id: 'imp34838-two-rootfinders-agree',
    description: 'bisection and secant agree on C_mb* to < 1e-9 with |relGap(C_mb*)| < 1e-10',
    holds: () => ROOTFINDER_DISAGREEMENT < 1e-9 && Math.abs(REL_GAP_AT_STAR) < 1e-10,
  },
  {
    // (G1): the refined root reproduces the imp-34824 coarse cmbZeroGap to its 5 reported digits.
    id: 'imp34838-reproduces-imp34824-cmbzerogap',
    description: 'C_mb* ~ 0.5115957 reproduces the imp-34824 cmbZeroGap ~ 0.51160 to its 5 reported digits',
    holds: () => CROSSCHECK_VS_IMP34824 < 1e-5 && Math.abs(CMB_STAR - 0.5115957) < 5e-7,
  },
  {
    // (G2): the local elasticity at the zero is finite, positive, and materially STEEPER than at the GUE bound.
    id: 'imp34838-local-elasticity-steeper-than-gue',
    description: 'd(relGap)/dC_mb at C_mb* ~ +0.1466/unit, ~6.8x the +0.0215/unit at C_mb=1',
    holds: () =>
      DGAP_DCMB_AT_STAR > 0.1 &&
      DGAP_DCMB_AT_STAR < 0.2 &&
      STEEPENING_RATIO > 4 &&
      STEEPENING_RATIO < 10,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2, sub-gap named, no QED, no refereed bound is changed.
    id: 'imp34838-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, sub-gap named, no QED, no refereed bound is changed',
    holds: () =>
      IMP34838_CMB_ZERO_GAP_PRECISE_ROOT_AND_ELASTICITY.isRigorous === false &&
      IMP34838_CMB_ZERO_GAP_PRECISE_ROOT_AND_ELASTICITY.farTailExponent === 0.5 &&
      typeof IMP34838_CMB_ZERO_GAP_PRECISE_ROOT_AND_ELASTICITY.subGap === 'string' &&
      /imp-486/.test(IMP34838_CMB_ZERO_GAP_PRECISE_ROOT_AND_ELASTICITY.subGap) &&
      /NO QED/.test(IMP34838_CMB_ZERO_GAP_PRECISE_ROOT_AND_ELASTICITY.verdict) &&
      /refereed bound is changed/i.test(IMP34838_CMB_ZERO_GAP_PRECISE_ROOT_AND_ELASTICITY.verdict),
  },
];

for (const a of IMP34838_CMB_ZERO_GAP_PRECISE_ROOT_AND_ELASTICITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34838-cmb-zero-gap-precise-root-and-elasticity assertion failed: ${a.id}`);
  }
}
