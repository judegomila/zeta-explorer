/**
 * @module imp-97703-diag3-5point-stencil-refine
 *
 * imp-97703 (numerical, frontier refine): imp-97689 DERIVED the three-axis diagonal
 * DIAG3 = E_CC + E_ET + E_CF = 0 in closed form (Euler degree-0 homogeneity of sigma = E_coll/E_N) and
 * MEASURED it machine-zero via the closed-form amplitude partials, identifying the imp-97644 3-point
 * central-difference SUM3 residual (+3.282e-7 at L2 down to +5.684e-11 at L4, quartering with eps) as an
 * O(eps^2) stencil tail rather than a real additivity residual. This leaf CROSS-CHECKS that reading with
 * a purely FINITE-DIFFERENCE probe: it re-measures DIAG3 by differencing the three amplitude axes (c on
 * C_C, e on E_trunc, f on C_F) with the imp-97665 5-point O(eps^4) stencil at the imp-97520 L2/L3/L4
 * landmarks and asks whether the residual drops several orders to the machine-zero floor -- exactly as
 * imp-97665/imp-97686 cured the analogous sqrt-wrapper (E_CKH = 0.5 E_CC) residual. Measurement only;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-33582/imp-97644/imp-97689 crossing relation)
 * ----------------------------------------------------------------------------
 *   E_N     = E_trunc + E_flow + E_coll,   sigma(N; c, e, f) = E_coll / E_N,
 *   E_coll  = c * sqrt(log T0(N) / N)             (numerator; c = C_C amplitude),
 *   E_flow  = f * C_F0(N) * (log T0 / T0) * G     (denominator; f = C_F multiplier),
 *   E_trunc = e                                   (denominator; e = fixed-strip constant).
 * The landmark N_L(c, e, f) at level L is the downslope crossing sigma(N_L; c, e, f) = L. The crossing
 * elasticity of amplitude p in {c, e, f} is E_p = d ln N_L / d ln p, probed by p -> p*exp(delta) and
 * differenced in delta. DIAG3 = E_CC + E_ET + E_CF is the sum imp-97689 proved is identically zero.
 *
 * THE STENCILS
 * ------------
 *   3-point O(eps^2):  D3[f] = (f(eps) - f(-eps)) / (2 eps)                                (imp-97644)
 *   5-point O(eps^4):  D5[f] = (-f(2 eps) + 8 f(eps) - 8 f(-eps) + f(-2 eps)) / (12 eps)   (imp-97665)
 *
 * THE MEASUREMENT (DIAG3 = E_CC + E_ET + E_CF, eps = 1e-3, imp-97520 landmarks)
 * ---------------------------------------------------------------------------
 *   LANDMARK        DIAG3 3-point      DIAG3 5-point      5-pt cut
 *   L2 (sigma=0.9)  +3.2818e-7         ~-5.3e-12          ~6.2e4 x
 *   L3 (sigma=0.5)  +2.8528e-9         ~+2.4e-12          ~1.2e3 x
 *   L4 (sigma=0.1)  +5.6843e-11        ~+1.2e-12          ~48 x
 * The 3-point column reproduces the imp-97644 SUM3 exactly (+3.282e-7 at L2, +5.684e-11 at L4). Halving
 * eps quarters the 3-point residual (L2: 3.2818e-7 -> 8.2046e-8 -> 2.0520e-8 at eps = 1e-3, 5e-4, 2.5e-4;
 * ratio ~4.00 per halving), the exact O(eps^2) signature -- so it is central-difference truncation, not a
 * real residual. The 5-point rule collapses every landmark to the ~1e-12 IEEE-double round-off floor.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (R1) DIAG3 IS PURE 3-POINT TRUNCATION -> CURED. The 5-point O(eps^4) stencil drops the finite-
 *        difference DIAG3 to the ~1e-12 machine-zero floor at every landmark (a ~6.2e4x cut at L2,
 *        ~1.2e3x at L3, ~48x at L4). The residual that survives is IEEE-double round-off, not an
 *        O(eps^4) tail (it no longer follows a clean power law in eps), confirming the imp-97644 SUM3
 *        (+3.282e-7 .. +5.684e-11) was the O(eps^2) central-difference stencil tail, exactly as the
 *        imp-97689 exact Euler derivation DIAG3 == 0 predicts.
 *   (R2) THE 3-POINT RESIDUAL QUARTERS WITH EPS. Halving eps quarters the 3-point DIAG3 at the flow-heavy
 *        L2 (ratio ~4.00 per halving), the textbook O(eps^2) leading-error signature. The residual is
 *        thus tied to the stencil order, not to any additivity defect -- the 5-point higher-order rule
 *        removes it because it removes the O(eps^2) term.
 *   (R3) NO REAL ADDITIVITY RESIDUAL, NO NEW LEVER. The three-axis additivity E_CC + E_ET + E_CF = 0
 *        survives below its 3-point floor to machine precision by finite differencing, matching the
 *        closed-form imp-97689 result. Re-measurement with the higher-order stencil surfaces no hidden
 *        residual amplitude; the sigma scaling symmetry (imp-97644 STRUCTURE (1)) is untouched.
 *
 * The punchline: differenced directly on the three amplitude axes, DIAG3 behaves exactly like the
 * imp-97665/imp-97686 sqrt-wrapper residual -- its 3-point value is O(eps^2) central-difference
 * truncation (quarters when eps halves) and the 5-point O(eps^4) stencil cures it to the machine-zero
 * floor at every landmark. This closes the finite-difference side of the imp-97689 closed-form
 * derivation: DIAG3 == 0 is exact, and the imp-97644 ~1e-7 SUM3 was never a real additivity residual.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; the C_C 1/8 ansatz, the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are perturbed
 * here only as sensitivity probes, not re-pinned; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97689-diag3-additivity-euler-derivation (closed-form DIAG3 == 0; SUM3 identified as O(eps^2))
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (5-point O(eps^4) stencil vs 3-point truncation)
 * @see imp-97686-wrapper-elasticity-5point-refine (same 5-point cure for the sqrt-wrapper E_CKH residual)
 * @see imp-97644-three-axis-additivity-flow-prefactor (MEASURED DIAG3 == 0, SUM3 = O(eps^2))
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the landmarks L2/L3/L4 + crossing procedure)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4; // trapezoidal A1 constant, Gronwall exponent (imp-3406/imp-97644)
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97644/imp-97689 exactly

// EXACT imp-3406/imp-97644/imp-97689 sub-terms (baseline amplitudes c = C_C_PINNED, e = E_TRUNC_PT, f = 1).
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N };
}

// Downslope crossing sigma = level (identical bisection to imp-97644/imp-97689).
function landmark(level, cc, et, cf) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc, et, cf).sigma > level) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const lnN = (level, cc, et, cf) => Math.log(landmark(level, cc, et, cf));

// 3-point O(eps^2) central difference (imp-97644) and 5-point O(eps^4) central difference (imp-97665).
const deriv3 = (f, eps) => (f(eps) - f(-eps)) / (2 * eps);
const deriv5 = (f, eps) => (-f(2 * eps) + 8 * f(eps) - 8 * f(-eps) + f(-2 * eps)) / (12 * eps);

// The three amplitude-axis crossing elasticities (probe p -> p*exp(delta), difference in delta).
const E_CC = (level, deriv, eps) => deriv((d) => lnN(level, C_C_PINNED * Math.exp(d), E_TRUNC_PT, 1.0), eps);
const E_ET = (level, deriv, eps) => deriv((d) => lnN(level, C_C_PINNED, E_TRUNC_PT * Math.exp(d), 1.0), eps);
const E_CF = (level, deriv, eps) => deriv((d) => lnN(level, C_C_PINNED, E_TRUNC_PT, Math.exp(d)), eps);
const diag3 = (level, deriv, eps) => E_CC(level, deriv, eps) + E_ET(level, deriv, eps) + E_CF(level, deriv, eps);

const LEVELS = [
  { key: 'L2_below_0p9', label: 'below-0.9', sigma: 0.9 },
  { key: 'L3_halving', label: 'halving', sigma: 0.5 },
  { key: 'L4_below_0p1', label: 'below-0.1', sigma: 0.1 },
];
const EPS = 1e-3; // reproduces the imp-97644/imp-97689 primary step
const EPS_LADDER = [1e-3, 5e-4, 2.5e-4]; // eps-halving ladder for the O(eps^2) quartering diagnostic

const PER_LANDMARK = LEVELS.map(({ key, label, sigma }) => {
  const N_L = landmark(sigma, C_C_PINNED, E_TRUNC_PT, 1.0);
  const d3 = diag3(sigma, deriv3, EPS);
  const d5 = diag3(sigma, deriv5, EPS);
  // O(eps^2) confirmation: 3-point residual over the halving ladder (should quarter each step at L2).
  const ladder3 = EPS_LADDER.map((e) => diag3(sigma, deriv3, e));
  return {
    key,
    label,
    sigma,
    N_L: +N_L.toExponential(6),
    diag3_3pt: +d3.toExponential(4), // reproduces the imp-97644 SUM3
    diag3_5pt: +d5.toExponential(4), // machine-zero floor
    stencil_cut_x: +(Math.abs(d3 / d5)).toExponential(2),
    diag3_3pt_eps_ladder: ladder3.map((v) => +v.toExponential(4)), // O(eps^2): quarters per halving at L2
  };
});

// R1 diagnostic: the 5-point DIAG3 sits at the ~1e-12 machine-zero floor at every landmark.
const DIAG3_5PT_MAX_ABS = Math.max(...PER_LANDMARK.map((r) => Math.abs(r.diag3_5pt)));
// R1 diagnostic: the 5-point rule cuts the 3-point residual by orders at every landmark.
const DIAG3_5PT_CUTS_EVERY_LANDMARK = PER_LANDMARK.every((r) => r.stencil_cut_x > 10);
// R2 diagnostic: at L2 the 3-point residual quarters when eps halves (O(eps^2) leading-error signature).
const L2_LADDER = PER_LANDMARK[0].diag3_3pt_eps_ladder;
const L2_QUARTERING_RATIOS = [
  +(L2_LADDER[0] / L2_LADDER[1]).toFixed(3),
  +(L2_LADDER[1] / L2_LADDER[2]).toFixed(3),
];

export const IMP97703_DIAG3_5POINT_STENCIL_REFINE = {
  id: 'imp-97703',
  proofSection: 'S-frontier',
  question:
    'imp-97689 derived DIAG3 = E_CC + E_ET + E_CF = 0 in closed form and identified the imp-97644 3-point ' +
    'central-difference SUM3 residual (+3.282e-7 at L2 down to +5.684e-11 at L4, quartering with eps) as an ' +
    'O(eps^2) stencil tail, not a real additivity residual. Differenced directly on the three amplitude axes, ' +
    'does the 5-point O(eps^4) stencil cure the finite-difference DIAG3 to the machine-zero floor -- as ' +
    'imp-97665/imp-97686 cured the sqrt-wrapper residual? Measurement only; no bound moves; no QED.',
  method:
    'Re-measure DIAG3 = E_CC + E_ET + E_CF by differencing the three amplitude axes (c on C_C, e on E_trunc, ' +
    'f on C_F, probe p -> p*exp(delta)) with the imp-97665 5-point O(eps^4) stencil D5[f] = (-f(2eps) + ' +
    '8 f(eps) - 8 f(-eps) + f(-2eps)) / (12 eps) at the three imp-97520 landmarks (sigma = 0.9, 0.5, 0.1, ' +
    'eps = 1e-3), compare with the 3-point O(eps^2) values, and confirm the O(eps^2) reading by halving eps ' +
    'over a 1e-3/5e-4/2.5e-4 ladder (the 3-point residual should quarter each step at the flow-heavy L2).',
  step_probed: { eps: EPS, eps_ladder: EPS_LADDER },
  perLandmark: PER_LANDMARK,
  finding: {
    R1_diag3_pure_truncation_cured:
      'The 5-point O(eps^4) stencil drops the finite-difference DIAG3 to the ~1e-12 IEEE-double round-off ' +
      'floor at every landmark (a ~6.2e4x cut at L2, ~1.2e3x at L3, ~48x at L4). The surviving residual is ' +
      'round-off, not an O(eps^4) tail, confirming the imp-97644 SUM3 (+3.282e-7 .. +5.684e-11) was the ' +
      'O(eps^2) central-difference stencil tail -- exactly as the imp-97689 exact Euler derivation predicts.',
    R2_three_point_residual_quarters_with_eps:
      'Halving eps quarters the 3-point DIAG3 at the flow-heavy L2 (ratios ~4.00 per halving over the ' +
      '1e-3/5e-4/2.5e-4 ladder), the textbook O(eps^2) leading-error signature. The residual is tied to the ' +
      'stencil order, not to any additivity defect; the 5-point rule removes it by removing the O(eps^2) term.',
    R3_no_real_additivity_residual:
      'The three-axis additivity E_CC + E_ET + E_CF = 0 survives below its 3-point floor to machine precision ' +
      'by direct finite differencing, matching the closed-form imp-97689 result. The higher-order stencil ' +
      'surfaces no hidden residual amplitude; the sigma scaling symmetry (imp-97644 STRUCTURE (1)) is intact.',
  },
  diagnostics: {
    diag3_5pt_max_abs: +DIAG3_5PT_MAX_ABS.toExponential(3),
    diag3_5pt_cuts_every_landmark: DIAG3_5PT_CUTS_EVERY_LANDMARK,
    L2_three_point_quartering_ratios: L2_QUARTERING_RATIOS,
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier cross-check, NOT rigorous). Differenced directly on the three amplitude axes, the ' +
    'three-axis diagonal DIAG3 = E_CC + E_ET + E_CF behaves exactly like the imp-97665/imp-97686 sqrt-wrapper ' +
    'residual: its 3-point O(eps^2) value reproduces the imp-97644 SUM3 (+3.282e-7 at L2, +5.684e-11 at L4) ' +
    'and quarters when eps halves (~4.00 per step over 1e-3/5e-4/2.5e-4 at L2), the textbook central-' +
    'difference truncation signature; the imp-97665 5-point O(eps^4) stencil cures it to the ~1e-12 IEEE-' +
    'double round-off floor at all three imp-97520 landmarks (L2 sigma=0.9 N=2.572361e7, L3 halving ' +
    'N=3.267235e9, L4 sigma=0.1 N=3.213181e11), a ~6.2e4x/1.2e3x/48x cut. This closes the finite-difference ' +
    'side of the imp-97689 closed-form derivation: DIAG3 == 0 is exact (Euler degree-0 homogeneity of ' +
    'sigma = E_coll/E_N), and the imp-97644 ~1e-7 SUM3 was the O(eps^2) stencil tail, not a real additivity ' +
    'residual. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz, the pinned E_trunc 3.06e-5 and the ' +
    'imp-398 C_F prefactor are UNTOUCHED (perturbed here only as sensitivity probes, not re-pinned); changes ' +
    'no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97689 (closed-form DIAG3 == 0, SUM3 identified as O(eps^2)); imp-97665 (5-point O(eps^4) stencil vs ' +
    '3-point truncation); imp-97686 (same 5-point cure for the sqrt-wrapper E_CKH residual); imp-97644 ' +
    '(MEASURED DIAG3 == 0, SUM3 = O(eps^2)); imp-97520 (four-landmark ladder L1..L4); imp-398 (C_F flow ' +
    'prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP97703_DIAG3_5POINT_STENCIL_REFINE_ASSERTIONS = [
  {
    // Landmarks reproduce the imp-97520/imp-97644/imp-97689 ladder positions (L2, L3, L4).
    id: 'imp97703-landmarks-reproduce-imp97689',
    description: 'L2 ~2.572361e7, L3 ~3.267235e9, L4 ~3.213181e11 reproduce imp-97689 to < 5e-3 relative',
    holds: () => {
      const [l2, l3, l4] = PER_LANDMARK;
      return (
        Math.abs(l2.N_L / 2.572361e7 - 1) < 5e-3 &&
        Math.abs(l3.N_L / 3.267235e9 - 1) < 5e-3 &&
        Math.abs(l4.N_L / 3.213181e11 - 1) < 5e-3
      );
    },
  },
  {
    // The 3-point DIAG3 reproduces the imp-97644 SUM3 at L2 (+3.282e-7) and L4 (+5.684e-11).
    id: 'imp97703-3point-reproduces-imp97644-sum3',
    description: '3-point DIAG3 ~ +3.282e-7 at L2 and ~ +5.684e-11 at L4 (match imp-97644 to < 5e-3 relative)',
    holds: () => {
      const [l2, , l4] = PER_LANDMARK;
      return (
        Math.abs(l2.diag3_3pt / 3.2818e-7 - 1) < 5e-3 &&
        Math.abs(l4.diag3_3pt / 5.6843e-11 - 1) < 5e-3
      );
    },
  },
  {
    // (R1): the 5-point DIAG3 sits at the ~1e-12 machine-zero floor, below the imp-97644 3-point ~1e-7 floor.
    id: 'imp97703-5point-diag3-machine-zero',
    description: 'DIAG3 (5-point) < 1e-10 at every landmark (below the imp-97644 3-point ~1e-7 floor)',
    holds: () => PER_LANDMARK.every((r) => Math.abs(r.diag3_5pt) < 1e-10),
  },
  {
    // (R1): the 5-point stencil cuts the 3-point residual by more than an order at every landmark.
    id: 'imp97703-5point-cuts-every-landmark',
    description: '5-point DIAG3 is > 10x smaller than 3-point DIAG3 at every landmark',
    holds: () => DIAG3_5PT_CUTS_EVERY_LANDMARK,
  },
  {
    // (R2): at L2 the 3-point residual quarters when eps halves (O(eps^2) leading-error signature).
    id: 'imp97703-3point-quarters-with-eps',
    description: 'L2 3-point DIAG3 quarters per eps-halving (ratios in [3.5, 4.5] over the 1e-3/5e-4/2.5e-4 ladder)',
    holds: () => L2_QUARTERING_RATIOS.every((r) => r > 3.5 && r < 4.5),
  },
  {
    // Honesty gate: measurement only, no QED, PT stays SOTA.
    id: 'imp97703-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP97703_DIAG3_5POINT_STENCIL_REFINE.isRigorous === false &&
      /NO QED/.test(IMP97703_DIAG3_5POINT_STENCIL_REFINE.verdict) &&
      /remains SOTA/.test(IMP97703_DIAG3_5POINT_STENCIL_REFINE.verdict),
  },
];

for (const a of IMP97703_DIAG3_5POINT_STENCIL_REFINE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97703-diag3-5point-stencil-refine assertion failed: ${a.id}`);
  }
}

export default IMP97703_DIAG3_5POINT_STENCIL_REFINE;
