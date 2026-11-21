/**
 * @module imp-34824-inflection-crossover-gap-cmb-sweep
 *
 * imp-34824 (numerical, frontier): imp-34800 tabulated three N_cross locators of the imp-3220/imp-3406
 * conditional-share curve and found the sigmoid-inflection knee (R3, imp-33721) sits ~+2.95% ABOVE the
 * Banach/Krawczyk crossover pair (R1/R2), attributing that gap to LANDMARK-DEFINITION / curvature (NOT
 * Gronwall E_flow, NOT discretization). Separately imp-34734 measured a ~0.048/unit C_mb elasticity of the
 * sigma PEAK height and proved the peak LOCATION is EXACTLY C_mb-invariant. The two were never cross-checked:
 * is the +2.95% inflection-vs-crossover offset a stable DEFINITIONAL constant (like the C_mb-invariant peak
 * location), or does it MOVE with the GUE-conditional constant C_mb (a saturation artifact of C_mb = 1)?
 * This module inserts C_mb as the same multiplicative factor on E_coll that imp-34734 uses, recomputes BOTH
 * landmarks over a C_mb grid, and measures how the relative gap responds.
 *
 * THE MODEL (identical sub-terms to imp-3406 / imp-33721 / imp-34734 -- C_mb factored onto E_coll only)
 * ----------------------------------------------------------------------------------------------------
 *     sigma(N; C_mb) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll  = C_mb * C_C_PINNED * sqrt(L / N),  L = log T0(N)   (dominant, GUE-conditional),
 *     E_flow  = C_F (L / T0) * Gronwall,          E_trunc = 3.06e-5   (both C_mb-free).
 * C_mb = 1 is the inherited baseline. The two landmarks recomputed at C_mb = 1 REPRODUCE their published
 * values: the crossover (R1/R2) at N ~ 3.28029e9 (imp-34800/imp-33723) and the sub-decade inflection knee
 * (R3) at log10 N* ~ 9.5285 (imp-33721), so the baseline gap reproduces the imp-34800 +2.95% residual.
 *
 * THE TWO LANDMARKS AS FUNCTIONS OF C_mb
 * --------------------------------------
 *   CROSSOVER N_cross(C_mb): the E_coll = E_trunc balance C_mb C_C sqrt(L/N) = E_trunc, i.e. the fixed point
 *     of N = (C_mb C_C / E_trunc)^2 log T0(N) = C_mb^2 K log T0(N), K = (C_C/E_trunc)^2 (the imp-33723/
 *     imp-34800 map with K scaled by C_mb^2). A FIRST-order balance; N_cross scales ~ C_mb^2 (log correction).
 *   INFLECTION N*(C_mb): the single D2 zero-crossing of the imp-33721 sub-decade OLS decay-exponent ramp of
 *     sigma(N; C_mb). Because sigma = f(r), r = C_mb rho(N), rho = e0/A, and the local exponent
 *     p(N) = -rho'/(rho (1 + C_mb rho)) carries C_mb in the (1 + C_mb rho) factor, its curvature knee is a
 *     SECOND-order landmark that does NOT scale like the crossover. To follow the moving landmark the
 *     imp-33721 [1e9,1e11] scan window is re-centred on log10 N_cross(C_mb) (preserving the grid geometry;
 *     at C_mb = 1 the shift is zero and the window is exactly imp-33721's).
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) THE +2.95% OFFSET IS NOT A C_mb-INVARIANT CONSTANT -- IT MOVES MONOTONICALLY WITH C_mb. Across
 *        C_mb in {1.00, 0.99, 0.90, 0.75, 0.50, 0.25} the inflection-vs-crossover relative gap falls
 *        monotonically {+2.95%, +2.93%, +2.70%, +2.11%, -0.18%, -9.38%}. This is the SHARP CONTRAST with
 *        imp-34734: the peak LOCATION is exactly C_mb-invariant (argmax of a monotone f of a constant-scaled
 *        ratio), but the SEPARATION of the crossover (first-order balance) and the inflection (second-order
 *        curvature knee) is NOT -- a constant rescaling of E_coll shifts the two landmarks by different laws.
 *   (F2) THE GAP CHANGES SIGN NEAR C_mb ~ 0.51. The inflection sits ABOVE the crossover only for C_mb above
 *        ~0.512; at C_mb ~ 0.512 the two landmarks COINCIDE, and for smaller C_mb the inflection falls BELOW
 *        the crossover. So the high-side (+) sign of the imp-34800 residual is itself a property of the GUE
 *        saturation C_mb = 1, not a definitional invariant.
 *   (F3) THE ELASTICITY AT THE GUE BOUND. d(relGap)/dC_mb ~ +2.15e-2 per unit C_mb at C_mb = 1 (a -1% C_mb
 *        shrinks the +2.95% offset by ~2.15e-2 of a percent of gap). So a future TIGHTER (< 1) C_mb (imp-486)
 *        would SHRINK the +2.95% high-side residual toward zero, not preserve it.
 *
 * THE VERDICT ON THE TICKET QUESTION (definitional gap vs GUE-conditional artifact)
 * --------------------------------------------------------------------------------
 *   BOTH, cleanly separated: the EXISTENCE of a nonzero separation is DEFINITIONAL (imp-34800 F2 -- the knee
 *   and the crossover are genuinely distinct landmarks, the inflection ~147 enclosure half-widths outside the
 *   Krawczyk bracket), but the MAGNITUDE and SIGN of the residual (+2.95%, high side) are a GUE-CONDITIONAL-
 *   CONSTANT ARTIFACT of C_mb = 1: they move monotonically with C_mb and invert near C_mb ~ 0.51. imp-34800's
 *   "NOT Gronwall E_flow" attribution stands; but the +2.95% is NOT a C_mb-free definitional constant either.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 surrogate crossover map, NOT a rigorous asymptotic; this does NOT discharge the GUE
 * conditional (imp-486) -- it treats C_mb as a free knob to measure the gap leverage, it does not tighten
 * C_mb; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34800-ncross-three-way-crossvalidation-banach-krawczyk-inflection (the +2.95% R3-vs-R1/R2 residual)
 * @see imp-34734-sigma-peak-cmb-elasticity (C_mb elasticity of the peak; peak LOCATION is C_mb-invariant)
 * @see imp-33721-sigma-ramp-inflection-subdecade (R3 sub-decade D2-zero inflection knee, log10 N* ~ 9.5285)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (R1 Banach crossover, N_cross ~ 3.280294e9)
 * @see imp-486 (C_mb GUE-conditional, bounded <= 1)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34800_NCROSS_THREE_WAY_CROSSVALIDATION_BANACH_KRAWCZYK_INFLECTION } from './imp-34800-ncross-three-way-crossvalidation-banach-krawczyk-inflection.js';
import { IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE } from './imp-33721-sigma-ramp-inflection-subdecade.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33721)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33721/imp-34734 exactly

// EXACT imp-33721/imp-34734 sigma with C_mb as a multiplicative factor on the GUE-conditional E_coll.
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
  const K = (cmb * C_C_PINNED / E_TRUNC_PT) ** 2; // imp-33723/imp-34800 K scaled by C_mb^2
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

// imp-33721 sub-decade D2-zero inflection knee of sigma(N; C_mb). The [1e9,1e11] scan window is re-centred
// on log10 N_cross(C_mb) so the moving landmark stays inside the grid (shift = 0 at C_mb = 1).
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
  let signChanges = 0;
  let cstar = null;
  for (let i = 1; i < D2.length; i++) {
    if (Math.sign(D2[i].d2) !== Math.sign(D2[i - 1].d2)) {
      signChanges += 1;
      if (cstar === null) {
        const c0 = D2[i - 1].cen;
        const c1 = D2[i].cen;
        const y0 = D2[i - 1].d2;
        const y1 = D2[i].d2;
        cstar = c0 + ((c1 - c0) * (0 - y0)) / (y1 - y0);
      }
    }
  }
  return { signChanges, cstar };
}

const W_PRIMARY = 0.25;
const PPD_PRIMARY = 40;

// The relative gap of the inflection above the crossover, as a function of C_mb.
function relGap(cmb) {
  const nc = crossover(cmb);
  const inf = inflectionLog10(cmb, W_PRIMARY, PPD_PRIMARY);
  if (inf.cstar === null) return null;
  const ns = Math.pow(10, inf.cstar);
  return ns / nc - 1;
}

// Baseline (C_mb = 1) reproduces the imp-34800 R1/R3 pair and its +2.95% residual.
const INF_BASE = inflectionLog10(1.0, W_PRIMARY, PPD_PRIMARY);
const NSTAR_BASE = Math.pow(10, INF_BASE.cstar); // ~3.37713e9
const REL_GAP_BASE = NSTAR_BASE / CROSS_BASE - 1; // ~+2.952e-2 (reproduces imp-34800 R3-vs-R1)

// The C_mb grid where the sub-decade knee stays cleanly resolvable (one D2 sign change). Below ~0.25 the
// crossover approaches the sigma peak (N ~ 9.2e5) and the sub-decade knee is no longer cleanly resolvable.
const CMB_GRID = [1.0, 0.99, 0.9, 0.75, 0.5, 0.25];
const GRID = CMB_GRID.map((cmb) => {
  const nc = crossover(cmb);
  const inf = inflectionLog10(cmb, W_PRIMARY, PPD_PRIMARY);
  const ns = Math.pow(10, inf.cstar);
  return {
    C_mb: +cmb.toFixed(5),
    N_cross: +nc.toExponential(5),
    log10_N_cross: +Math.log10(nc).toFixed(4),
    N_star_inflection: +ns.toExponential(5),
    log10_N_star: +inf.cstar.toFixed(4),
    D2_sign_changes: inf.signChanges,
    rel_gap_pct: +((ns / nc - 1) * 100).toFixed(4),
  };
});

// Elasticity of the gap at the GUE bound (central difference in C_mb).
const H_CMB = 5e-3;
const DGAP_DCMB = (relGap(1.0 + H_CMB) - relGap(1.0 - H_CMB)) / (2 * H_CMB); // ~+2.15e-2 per unit

// The C_mb at which the inflection COINCIDES with the crossover (gap = 0), by bisection.
function zeroGapCmb() {
  let lo = 0.4;
  let hi = 0.6;
  for (let k = 0; k < 50; k++) {
    const m = (lo + hi) / 2;
    const g = relGap(m);
    if (g === null || g > 0) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}
const CMB_ZERO_GAP = zeroGapCmb(); // ~0.5116

// Robustness of the baseline gap to the sub-bracket width (imp-33721 F2 style).
const ROBUST_WIDTHS = [
  { W: 0.25, ppd: 40 },
  { W: 0.2, ppd: 50 },
  { W: 0.125, ppd: 80 },
];
const ROBUST = ROBUST_WIDTHS.map(({ W, ppd }) => {
  const inf = inflectionLog10(1.0, W, ppd);
  const ns = Math.pow(10, inf.cstar);
  return { widthDecades: W, signChanges: inf.signChanges, rel_gap_pct: +((ns / CROSS_BASE - 1) * 100).toFixed(4) };
});

// Cross-checks against the published landmarks (storage-precision tolerant: 7-sig-fig literals).
const BASE_VS_IMP34800_CROSS = Math.abs(
  CROSS_BASE / IMP34800_NCROSS_THREE_WAY_CROSSVALIDATION_BANACH_KRAWCZYK_INFLECTION.routes.R1_banach_closed_form.N_cross - 1,
);
const BASE_VS_IMP33721_INFL_LOG10 = Math.abs(
  INF_BASE.cstar - IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.inflectionLog10Nstar,
);
const BASE_VS_IMP34800_GAP = Math.abs(
  REL_GAP_BASE - IMP34800_NCROSS_THREE_WAY_CROSSVALIDATION_BANACH_KRAWCZYK_INFLECTION.pairwiseGaps['rel(R3_infl,R1_banach)'],
);

export const IMP34824_INFLECTION_CROSSOVER_GAP_CMB_SWEEP = {
  id: 'imp-34824',
  proofSection: 'S-frontier',
  question:
    'imp-34800 found the sigmoid-inflection knee (R3, imp-33721) sits ~+2.95% ABOVE the Banach/Krawczyk ' +
    'crossover (R1/R2), a landmark-definition / curvature residual (NOT Gronwall E_flow). imp-34734 measured ' +
    'a ~0.048/unit C_mb elasticity of the sigma PEAK and proved the peak LOCATION is C_mb-invariant. Is the ' +
    '+2.95% inflection-vs-crossover offset a stable DEFINITIONAL constant, or does it MOVE with the ' +
    'GUE-conditional constant C_mb? Insert C_mb on E_coll (as imp-34734 does), recompute BOTH landmarks over ' +
    'a C_mb grid, and measure the gap response. Measurement only; does NOT discharge the GUE conditional; no QED.',
  measuredQuantity:
    'the relative gap (N_star_inflection / N_cross - 1) between the imp-33721 sub-decade D2-zero inflection ' +
    'knee and the imp-33723/imp-34800 E_coll = E_trunc crossover, both recomputed as functions of a ' +
    'multiplicative C_mb on E_coll, over C_mb in {1.00, 0.99, 0.90, 0.75, 0.50, 0.25}; plus the gap ' +
    'elasticity d(relGap)/dC_mb at C_mb = 1 and the C_mb at which the two landmarks coincide (gap = 0)',
  baseline: {
    N_cross: +CROSS_BASE.toExponential(6), // ~3.280294e9 (reproduces imp-34800 R1)
    log10_N_cross: +LOG10_CROSS_BASE.toFixed(4), // ~9.5159
    N_star_inflection: +NSTAR_BASE.toExponential(6), // ~3.377130e9 (reproduces imp-33721 R3)
    log10_N_star: +INF_BASE.cstar.toFixed(4), // ~9.5285
    rel_gap_pct: +(REL_GAP_BASE * 100).toFixed(4), // ~+2.9519 (reproduces imp-34800 R3-vs-R1 +2.95%)
  },
  grid: GRID,
  gapElasticity: {
    dRelGap_dCmb: +DGAP_DCMB.toExponential(5), // ~+2.153e-2 per unit C_mb at the GUE bound
    note:
      'A -1% C_mb shrinks the +2.95% high-side offset by ~2.15e-2 of a percent of gap; a tighter (< 1) C_mb ' +
      'therefore SHRINKS the residual toward zero, it does not preserve it.',
  },
  cmbZeroGap: +CMB_ZERO_GAP.toFixed(5), // ~0.51160 (inflection coincides with the crossover)
  robustness: ROBUST,
  crossChecks: {
    baseline_cross_vs_imp34800_R1_relerr: +BASE_VS_IMP34800_CROSS.toExponential(3), // ~1e-7 (7-sig-fig literal)
    baseline_inflection_log10_vs_imp33721_absdiff: +BASE_VS_IMP33721_INFL_LOG10.toExponential(3), // ~1e-4
    baseline_gap_vs_imp34800_R3_absdiff: +BASE_VS_IMP34800_GAP.toExponential(3), // ~1e-4
  },
  finding: {
    F1_offset_moves_monotonically_with_Cmb:
      'The +2.95% offset is NOT a C_mb-invariant constant: across C_mb in {1.00,0.99,0.90,0.75,0.50,0.25} ' +
      'the inflection-vs-crossover relative gap falls monotonically {+2.95%,+2.93%,+2.70%,+2.11%,-0.18%,' +
      '-9.38%}. SHARP CONTRAST with imp-34734: the peak LOCATION is EXACTLY C_mb-invariant, but the ' +
      'SEPARATION of the crossover (first-order E_coll=E_trunc balance) and the inflection (second-order ' +
      'curvature knee) is NOT -- a constant rescaling of E_coll shifts the two landmarks by different laws.',
    F2_gap_changes_sign_near_Cmb_half:
      'The gap changes sign near C_mb ~ 0.512: the inflection sits ABOVE the crossover only for C_mb above ' +
      '~0.512, the two landmarks COINCIDE at C_mb ~ 0.512, and for smaller C_mb the inflection falls BELOW ' +
      'the crossover. The high-side (+) SIGN of the imp-34800 residual is itself a property of the GUE ' +
      'saturation C_mb = 1, not a definitional invariant.',
    F3_elasticity_at_gue_bound:
      'd(relGap)/dC_mb ~ +2.15e-2 per unit C_mb at C_mb = 1. A future tighter (< 1) C_mb (imp-486) would ' +
      'SHRINK the +2.95% high-side residual toward zero (and, below C_mb ~ 0.512, invert it), not preserve it.',
    verdict_on_ticket_question:
      'BOTH, cleanly separated: the EXISTENCE of a nonzero separation is DEFINITIONAL (imp-34800 F2 -- the ' +
      'knee and the crossover are genuinely distinct landmarks, ~147 Krawczyk half-widths apart), but the ' +
      'MAGNITUDE and SIGN of the +2.95% residual are a GUE-CONDITIONAL-CONSTANT ARTIFACT of C_mb = 1 (they ' +
      'move monotonically with C_mb and invert near C_mb ~ 0.51). imp-34800 NOT-E_flow attribution stands; ' +
      'but +2.95% is not a C_mb-free definitional constant either.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier, NOT rigorous). Inserting the GUE-conditional many-body constant C_mb (bounded ' +
    '<= 1 via GUE, imp-486) as the same multiplicative factor on E_coll that imp-34734 uses, and recomputing ' +
    'BOTH the imp-33723/imp-34800 E_coll=E_trunc crossover (fixed point of N = C_mb^2 K log T0(N)) and the ' +
    'imp-33721 sub-decade D2-zero inflection knee of sigma(N; C_mb) over C_mb in {1.00,0.99,0.90,0.75,0.50,' +
    '0.25}: at C_mb = 1 the pair reproduces the published landmarks (N_cross ~ 3.28029e9, log10 N* ~ 9.5285) ' +
    'and the imp-34800 +2.95% high-side residual. The residual is NOT a C_mb-invariant constant -- it falls ' +
    'monotonically {+2.95%,+2.93%,+2.70%,+2.11%,-0.18%,-9.38%}, changing SIGN near C_mb ~ 0.512 (where the ' +
    'inflection coincides with the crossover), with elasticity d(relGap)/dC_mb ~ +2.15e-2 per unit at the ' +
    'GUE bound. This is the sharp contrast with imp-34734, where the peak LOCATION is EXACTLY C_mb-invariant: ' +
    'here the SEPARATION of a first-order balance (crossover) and a second-order curvature knee (inflection) ' +
    'depends on C_mb because a constant rescaling of E_coll shifts them by different laws. VERDICT on the ' +
    'ticket: BOTH -- the EXISTENCE of a nonzero separation is DEFINITIONAL (imp-34800 F2, ~147 Krawczyk ' +
    'half-widths apart), but the MAGNITUDE and SIGN of the +2.95% residual are a GUE-conditional-constant ' +
    'artifact of C_mb = 1; imp-34800 NOT-Gronwall-E_flow attribution stands, yet +2.95% is not a C_mb-free ' +
    'definitional constant. The component model is the inherited imp-3220/imp-3406 surrogate crossover map, ' +
    'NOT a rigorous asymptotic; this does NOT discharge the GUE conditional (imp-486) -- it treats C_mb as a ' +
    'free knob to measure the gap leverage; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'CLOSES the never-cross-checked question of whether the imp-34800 +2.95% inflection-vs-crossover residual ' +
    'is stable under the imp-34734 C_mb sweep: it is NOT -- the gap moves monotonically with C_mb and inverts ' +
    'near C_mb ~ 0.51, so the +2.95% VALUE is a GUE-saturation artifact while only the nonzero SEPARATION is ' +
    'definitional. What remains OPEN (deferred, not attempted here) is a rigorous derivation that actually ' +
    'PINS C_mb below the GUE bound of 1 (imp-486) and the imp-34714a machine certificate for the crossover ' +
    'enclosure -- the measurement quantifies the gap leverage but discharges neither conditional.',
  citation:
    'imp-34800 (three-way N_cross cross-validation, the +2.95% R3-vs-R1/R2 residual); imp-34734 (C_mb ' +
    'elasticity of the sigma peak; peak LOCATION C_mb-invariant); imp-33721 (sub-decade D2-zero inflection ' +
    'knee, log10 N* ~ 9.5285); imp-33723 (Banach crossover, N_cross ~ 3.280294e9); imp-486 (C_mb ' +
    'GUE-conditional, bounded <= 1); imp-2631 (E_trunc floor); imp-398 (E_flow C_F prefactor); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, RvM inverse).',
};

export const IMP34824_INFLECTION_CROSSOVER_GAP_CMB_SWEEP_ASSERTIONS = [
  {
    // Reuse gate: C_mb = 1 reproduces the imp-34800 crossover, the imp-33721 inflection log10 N*, and the
    // imp-34800 +2.95% R3-vs-R1 residual.
    id: 'imp34824-baseline-reproduces-imp34800-and-imp33721',
    description: 'C_mb=1 reproduces imp-34800 N_cross, imp-33721 log10 N* ~9.5285, and the +2.95% residual',
    holds: () =>
      BASE_VS_IMP34800_CROSS < 5e-6 &&
      BASE_VS_IMP33721_INFL_LOG10 < 5e-4 &&
      BASE_VS_IMP34800_GAP < 5e-4 &&
      REL_GAP_BASE > 0.02 &&
      REL_GAP_BASE < 0.04,
  },
  {
    // (F1): the gap falls MONOTONICALLY as C_mb decreases across the whole grid -- NOT C_mb-invariant.
    id: 'imp34824-gap-monotone-in-cmb',
    description: 'inflection-vs-crossover gap decreases monotonically as C_mb decreases (not C_mb-invariant)',
    holds: () => {
      for (let i = 1; i < GRID.length; i++) {
        if (!(GRID[i].rel_gap_pct < GRID[i - 1].rel_gap_pct)) return false;
      }
      // spread across the grid is large -- far from the C_mb-invariant peak-location behaviour of imp-34734.
      return GRID[0].rel_gap_pct - GRID[GRID.length - 1].rel_gap_pct > 5;
    },
  },
  {
    // (F1): every C_mb on the grid resolves exactly ONE D2 sign change (a well-defined single knee).
    id: 'imp34824-single-inflection-per-cmb',
    description: 'each grid C_mb yields exactly one sub-decade D2 sign change (a single knee)',
    holds: () => GRID.every((g) => g.D2_sign_changes === 1),
  },
  {
    // (F2): the gap changes SIGN -- positive at C_mb=1, negative at C_mb=0.25 -- and the zero-crossing sits
    // near C_mb ~ 0.51 (inflection coincides with the crossover there).
    id: 'imp34824-gap-changes-sign-near-half',
    description: 'gap positive at C_mb=1, negative at C_mb=0.25, zero-crossing C_mb ~ 0.51',
    holds: () =>
      GRID[0].rel_gap_pct > 0 &&
      GRID[GRID.length - 1].rel_gap_pct < 0 &&
      Math.abs(CMB_ZERO_GAP - 0.51) < 0.05 &&
      Math.abs(relGap(CMB_ZERO_GAP)) < 1e-4,
  },
  {
    // (F3): the gap elasticity at C_mb=1 is finite and positive (the offset shrinks for tighter C_mb) --
    // in sharp contrast with the EXACT C_mb-invariance of the imp-34734 peak LOCATION.
    id: 'imp34824-gap-elasticity-positive-finite',
    description: 'd(relGap)/dC_mb ~ +0.0215 per unit at C_mb=1: finite, positive (not invariant)',
    holds: () => DGAP_DCMB > 1e-2 && DGAP_DCMB < 4e-2,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2, sub-gap named, no QED, no refereed bound is changed.
    id: 'imp34824-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, sub-gap named, no QED, no refereed bound is changed',
    holds: () =>
      IMP34824_INFLECTION_CROSSOVER_GAP_CMB_SWEEP.isRigorous === false &&
      IMP34824_INFLECTION_CROSSOVER_GAP_CMB_SWEEP.farTailExponent === 0.5 &&
      typeof IMP34824_INFLECTION_CROSSOVER_GAP_CMB_SWEEP.subGap === 'string' &&
      /imp-486/.test(IMP34824_INFLECTION_CROSSOVER_GAP_CMB_SWEEP.subGap) &&
      /NO QED/.test(IMP34824_INFLECTION_CROSSOVER_GAP_CMB_SWEEP.verdict) &&
      /refereed bound is changed/i.test(IMP34824_INFLECTION_CROSSOVER_GAP_CMB_SWEEP.verdict),
  },
];

for (const a of IMP34824_INFLECTION_CROSSOVER_GAP_CMB_SWEEP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34824-inflection-crossover-gap-cmb-sweep assertion failed: ${a.id}`);
  }
}
