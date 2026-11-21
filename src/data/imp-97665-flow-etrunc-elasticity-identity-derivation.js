/**
 * @module imp-97665-flow-etrunc-elasticity-identity-derivation
 *
 * imp-97665 (numerical, frontier cross-check): imp-97644 STRUCTURE (3) MEASURED the crossing-elasticity
 * identity E_CF / E_ET = E_flow / E_trunc at the imp-97520 sigma landmarks, but confirmed it only to
 * ~2e-7 relative -- the central-difference O(eps^2) truncation floor of the 3-point stencil used there.
 * This leaf (a) DERIVES the identity EXACTLY from the implicit crossing relation (a common-factor
 * cancellation independent of the height mapping and the N-derivative), and (b) VERIFIES it with a
 * 5-point O(eps^4) stencil that pushes the residual far below 2e-7, confirming the imp-97644 value was
 * truncation, not a real deviation. Derivation/measurement only; the pinned constants are perturbed only
 * as probes; the C_mb GUE-conditional per imp-486 is untouched; no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-33582/imp-97623/imp-97644 crossing relation)
 * -----------------------------------------------------------------------------
 *   E_N   = E_trunc + E_flow + E_coll,   sigma(N; c, e, f) = E_coll / E_N,
 *   E_coll = c * g(N),   g(N) = sqrt(log T0(N) / N)        (numerator; c = C_C amplitude),
 *   E_flow = f * h(N),   h(N) = C_F0(N) * (log T0 / T0) * Gronwall   (denominator; f = C_F multiplier),
 *   E_trunc = e         (denominator; e = the fixed-strip constant, pinned 3.06e-5).
 * The landmark N_L(c, e, f) at level L is the downslope solution of sigma(N_L; c, e, f) = L.
 *
 * THE EXACT DERIVATION (the deliverable) -- E_CF / E_ET = E_flow / E_trunc, no approximation
 * ----------------------------------------------------------------------------------------
 * Differentiate the level condition sigma(N_L(p), p) = L implicitly in any amplitude p (p in {c, e, f}):
 *   0 = sigma_N * dN_L/dp + sigma_p   ==>   dN_L/dp = - sigma_p / sigma_N,
 * so the crossing-elasticity is  E_p = d ln N_L / d ln p = -(p * sigma_p) / (N_L * sigma_N).
 * Now E_trunc (e) and C_F (f) BOTH enter only the denominator E_N additively, so their partials of
 * sigma = E_coll / E_N are pure denominator responses:
 *   sigma_e = -E_coll / E_N^2 = -sigma / E_N              ==>  e * sigma_e = -(e)      * sigma / E_N,
 *   sigma_f = -E_coll * h / E_N^2 = -sigma * h / E_N      ==>  f * sigma_f = -(f * h)  * sigma / E_N = -E_flow * sigma / E_N.
 * Substituting into E_p, the ENTIRE crossing kernel  -(sigma / E_N) / (N_L * sigma_N)  -- which carries
 * all the model complexity (the N-derivative sigma_N, the height mapping T0(N), g and h) -- is IDENTICAL
 * for the two axes and CANCELS in the ratio:
 *   E_ET = (e     ) * sigma / E_N / (N_L * sigma_N),
 *   E_CF = (E_flow) * sigma / E_N / (N_L * sigma_N),
 *   ==>  E_CF / E_ET = E_flow / e = E_flow / E_trunc   (EXACT, for every level and every N_L).
 * The ratio depends on nothing but the two denominator shares. This is the fingerprint of a LINEAR
 * denominator-additive perturbation: C_F moves the crossing by exactly the E_trunc mechanism weighted by
 * E_flow/E_trunc, never entering the crossing relation nonlinearly. (Equivalently, since E_coll enters
 * both numerator and denominator, the numerator response adds E_CC and DIAG3 = E_CC + E_ET + E_CF = 0 is
 * the degree-0 homogeneity of imp-97644; that identity is orthogonal to the ratio derived here.)
 *
 * THE VERIFICATION (5-point O(eps^4) stencil vs the imp-97644 3-point O(eps^2) stencil)
 * ------------------------------------------------------------------------------------
 * The imp-97644 3-point central difference D3[f] = (f(eps) - f(-eps)) / (2 eps) carries an O(eps^2) tail;
 * its E_CF/E_ET reldiff floored at ~2e-7 (and quartered when eps halved, the signature of truncation).
 * Replacing it with the 5-point rule D5[f] = (-f(2eps) + 8 f(eps) - 8 f(-eps) + f(-2eps)) / (12 eps),
 * whose tail is O(eps^4), collapses the reldiff by ~5 orders of magnitude at the flow-heavy landmarks:
 *
 *   LANDMARK        N_L           E_flow/E_trunc   reldiff 3pt (imp-97644)   reldiff 5pt (this leaf)
 *   L2 below-0.9   2.572361e7     1.092281e-1      3.4e-7                    5.8e-12
 *   L3 halving     3.267235e9     1.905727e-3      1.7e-7                    4.8e-10
 *   L4 below-0.1   3.213181e11    3.548798e-5      1.8e-7                    2.3e-8
 * (eps = 1e-3 shown; the 5pt residual no longer quarters cleanly with eps because it has dropped into the
 * bisection / IEEE-double granularity of the landmark position -- at L2/L3 by 3-6 orders, at L4 the flow
 * share E_flow/E_N ~ 3.2e-5 is so small that E_CF itself is ~7.4e-5 and its finite-difference floor sits
 * near ~2e-8, still an order below the imp-97644 2e-7.) The residual is TRUNCATION, not a real deviation:
 * the exact identity above is what the numerics converge to as the stencil order rises.
 *
 * THE FINDING (derivation + measurement only)
 * -------------------------------------------
 *   (C1) THE IDENTITY IS EXACT. E_CF / E_ET = E_flow / E_trunc for every level and every N_L, because the
 *        crossing kernel -(sigma/E_N)/(N_L sigma_N) is common to the two denominator-additive axes and
 *        cancels in the ratio -- independent of the height mapping T0(N), the N-derivative sigma_N, and
 *        the specific g(N), h(N). No approximation; it is a common-factor cancellation.
 *   (C2) THE imp-97644 ~2e-7 RESIDUAL WAS TRUNCATION. A 5-point O(eps^4) stencil drops the E_CF/E_ET vs
 *        E_flow/E_trunc reldiff to 5.8e-12 (L2), 4.8e-10 (L3), 2.3e-8 (L4) -- below the 2e-7 the 3-point
 *        stencil reported -- confirming the finite-eps value was the central-difference truncation tail,
 *        not a genuine departure from linearity.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the
 * imp-398 C_F prefactor are UNTOUCHED and are perturbed here only as sensitivity probes, not re-pinned;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO
 * QED. No refereed bound is changed.
 *
 * @see imp-97644-three-axis-additivity-flow-prefactor (MEASURED E_CF/E_ET = E_flow/E_trunc to ~2e-7)
 * @see imp-97623-additivity-residual-multi-landmark-crosscheck (two-axis C_C/E_trunc additivity, r ~ eps^2)
 * @see imp-97584-sigma-landmark-etrunc-sensitivity (E_trunc-axis elasticity of N_half ~ -2.098)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the four landmarks L1..L4 + crossing procedure)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97623/imp-97644 exactly

// EXACT imp-3406/imp-97644 sub-terms; cc, et, cf are multiplicative/additive probes (baseline cf = 1).
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// Downslope crossing sigma = level (identical bisection to imp-97644).
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

// 3-point O(eps^2) central difference (the imp-97644 stencil) and 5-point O(eps^4) central difference.
const deriv3 = (f, eps) => (f(eps) - f(-eps)) / (2 * eps);
const deriv5 = (f, eps) => (-f(2 * eps) + 8 * f(eps) - 8 * f(-eps) + f(-2 * eps)) / (12 * eps);

// E_CF/E_ET reldiff against the analytic target E_flow/E_trunc, for a given stencil and step.
function ratioReldiff(level, deriv, eps) {
  const E_ET = deriv((d) => lnN(level, C_C_PINNED, E_TRUNC_PT * Math.exp(d), 1.0), eps);
  const E_CF = deriv((d) => lnN(level, C_C_PINNED, E_TRUNC_PT, 1.0 * Math.exp(d)), eps);
  return { E_ET, E_CF, elas_ratio: E_CF / E_ET };
}

const LEVELS = [
  { key: 'L2_below_0p9', label: 'below-0.9', sigma: 0.9 },
  { key: 'L3_halving', label: 'halving', sigma: 0.5 },
  { key: 'L4_below_0p1', label: 'below-0.1', sigma: 0.1 },
];
const EPS = 1e-3; // reproduces the imp-97644 primary step

const PER_LANDMARK = LEVELS.map(({ key, label, sigma }) => {
  const N_L = landmark(sigma, C_C_PINNED, E_TRUNC_PT, 1.0);
  const p = parts(N_L, C_C_PINNED, E_TRUNC_PT, 1.0);
  const target = p.E_flow / E_TRUNC_PT; // analytic exact value of E_CF/E_ET
  const r3 = ratioReldiff(sigma, deriv3, EPS);
  const r5 = ratioReldiff(sigma, deriv5, EPS);
  const reldiff3 = r3.elas_ratio / target - 1;
  const reldiff5 = r5.elas_ratio / target - 1;
  return {
    key,
    label,
    sigma,
    N_L: +N_L.toExponential(6),
    target_Eflow_over_Etrunc: +target.toExponential(6),
    elas_ratio_3pt: +r3.elas_ratio.toExponential(6),
    elas_ratio_5pt: +r5.elas_ratio.toExponential(6),
    reldiff_3pt: +reldiff3.toExponential(3), // ~2e-7: the imp-97644 truncation floor
    reldiff_5pt: +reldiff5.toExponential(3), // << 2e-7: identity confirmed, residual was truncation
  };
});

export const IMP97665_FLOW_ETRUNC_ELASTICITY_IDENTITY_DERIVATION = {
  id: 'imp-97665',
  proofSection: 'S-frontier',
  question:
    'The imp-97644 STRUCTURE (3) crossing identity E_CF/E_ET = E_flow/E_trunc was confirmed only to ' +
    '~2e-7 relative (3-point central-difference truncation-limited). Is it EXACT, and is the ~2e-7 ' +
    'residual pure truncation rather than a real deviation? Derive it from the implicit crossing relation ' +
    'and verify with a higher-order stencil. Derivation/measurement only; pinned constants perturbed only ' +
    'as probes; no bound moves; no QED.',
  method:
    'DERIVE: implicit-differentiate the level condition sigma(N_L(p), p) = L to get E_p = d ln N_L/d ln p ' +
    '= -(p sigma_p)/(N_L sigma_N); observe E_trunc and C_F enter only the denominator additively, so their ' +
    'partials share the crossing kernel -(sigma/E_N)/(N_L sigma_N), which cancels in the ratio leaving ' +
    'E_CF/E_ET = E_flow/E_trunc exactly. VERIFY: replace the imp-97644 3-point O(eps^2) central difference ' +
    'with a 5-point O(eps^4) stencil at the three imp-97520 landmarks and report the E_CF/E_ET vs ' +
    'E_flow/E_trunc reldiff for both stencils at eps = 1e-3.',
  eps_probed: EPS,
  perLandmark: PER_LANDMARK,
  finding: {
    C1_identity_is_exact:
      'E_CF/E_ET = E_flow/E_trunc for every level and every N_L: the crossing kernel ' +
      '-(sigma/E_N)/(N_L sigma_N) is common to the two denominator-additive axes (E_trunc, C_F) and ' +
      'cancels in the ratio, independent of the height mapping T0(N), the N-derivative sigma_N and the ' +
      'specific g(N), h(N). A common-factor cancellation, no approximation.',
    C2_imp97644_residual_was_truncation:
      'A 5-point O(eps^4) stencil drops the E_CF/E_ET vs E_flow/E_trunc reldiff to 5.8e-12 (L2), 4.8e-10 ' +
      '(L3), 2.3e-8 (L4) at eps = 1e-3 -- below the 2e-7 the imp-97644 3-point stencil reported -- ' +
      'confirming the finite-eps value was the central-difference truncation tail, not a genuine ' +
      'departure from linear denominator-additive entry.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION + MEASUREMENT (frontier cross-check, NOT rigorous). The imp-97644 STRUCTURE (3) identity ' +
    'E_CF/E_ET = E_flow/E_trunc is EXACT within the inherited component model: implicit differentiation of ' +
    'the crossing condition gives E_p = -(p sigma_p)/(N_L sigma_N), and because E_trunc and C_F enter only ' +
    'the denominator E_N additively their partials share the crossing kernel -(sigma/E_N)/(N_L sigma_N), ' +
    'which cancels in the ratio to leave E_CF/E_ET = E_flow/E_trunc for every level and N_L -- no ' +
    'approximation, a common-factor cancellation independent of the height mapping and the N-derivative. ' +
    'A 5-point O(eps^4) stencil confirms the imp-97644 ~2e-7 relative residual was pure central-difference ' +
    'truncation: the reldiff collapses to 5.8e-12 (L2), 4.8e-10 (L3) and 2.3e-8 (L4) at eps = 1e-3, well ' +
    'below 2e-7 (the L4 floor ~2e-8 reflects the tiny flow share E_flow/E_N ~ 3.2e-5 sitting near the ' +
    'IEEE-double landmark granularity, still an order below the 3-point value). Conditional-share ' +
    'diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and ' +
    'the imp-398 C_F prefactor are UNTOUCHED (perturbed only as probes, not re-pinned); changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97644 (three-axis additivity, MEASURED E_CF/E_ET = E_flow/E_trunc to ~2e-7); imp-97623 (two-axis ' +
    'additivity residual ~ eps^2); imp-97584 (E_trunc-axis elasticity); imp-97520 (four-landmark ladder ' +
    'L1..L4); imp-398 (C_F flow prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN inverse).',
};

export const IMP97665_FLOW_ETRUNC_ELASTICITY_IDENTITY_DERIVATION_ASSERTIONS = [
  {
    // Landmarks reproduce the imp-97520/imp-97644 ladder positions (L2, L3, L4).
    id: 'imp97665-landmarks-reproduce-imp97644',
    description: 'L2 ~2.572361e7, L3 ~3.267235e9, L4 ~3.213181e11 reproduce imp-97644 to < 5e-3 relative',
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
    // (C1)+(C2): the 3-point stencil reproduces the imp-97644 truncation floor (reldiff ~ 1e-7..4e-7).
    id: 'imp97665-3pt-reproduces-imp97644-floor',
    description: '3-point E_CF/E_ET vs E_flow/E_trunc reldiff sits at the imp-97644 ~2e-7 truncation floor',
    holds: () => PER_LANDMARK.every((r) => Math.abs(r.reldiff_3pt) > 1e-8 && Math.abs(r.reldiff_3pt) < 5e-7),
  },
  {
    // (C2): the 5-point O(eps^4) stencil pushes the residual strictly below the imp-97644 2e-7 at every landmark.
    id: 'imp97665-5pt-below-imp97644-2e7',
    description: '5-point O(eps^4) reldiff < 2e-7 at every landmark (imp-97644 residual was truncation)',
    holds: () => PER_LANDMARK.every((r) => Math.abs(r.reldiff_5pt) < 2e-7),
  },
  {
    // (C2): at the flow-heavy landmarks L2/L3 the 5-point stencil beats the 3-point one by >= 2 orders.
    id: 'imp97665-5pt-beats-3pt-by-orders',
    description: '5-point reldiff <= 3-point reldiff / 100 at L2 and L3 (higher-order stencil converges)',
    holds: () => {
      const [l2, l3] = PER_LANDMARK;
      return (
        Math.abs(l2.reldiff_5pt) <= Math.abs(l2.reldiff_3pt) / 100 &&
        Math.abs(l3.reldiff_5pt) <= Math.abs(l3.reldiff_3pt) / 100
      );
    },
  },
  {
    // (C1): the analytic target E_flow/E_trunc equals the measured 5-point elasticity ratio to < 2e-7.
    id: 'imp97665-analytic-target-matches-5pt',
    description: 'analytic E_flow/E_trunc matches the 5-point E_CF/E_ET to < 2e-7 relative at every landmark',
    holds: () =>
      PER_LANDMARK.every(
        (r) => Math.abs(r.elas_ratio_5pt / r.target_Eflow_over_Etrunc - 1) < 2e-7,
      ),
  },
  {
    // Honesty gate: derivation/measurement only, no QED, no refereed bound is changed.
    id: 'imp97665-honesty-gate-no-qed',
    description: 'Derivation/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP97665_FLOW_ETRUNC_ELASTICITY_IDENTITY_DERIVATION.isRigorous === false &&
      /NO QED/.test(IMP97665_FLOW_ETRUNC_ELASTICITY_IDENTITY_DERIVATION.verdict) &&
      /refereed bound is changed/i.test(IMP97665_FLOW_ETRUNC_ELASTICITY_IDENTITY_DERIVATION.verdict),
  },
];

for (const a of IMP97665_FLOW_ETRUNC_ELASTICITY_IDENTITY_DERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97665-flow-etrunc-elasticity-identity-derivation assertion failed: ${a.id}`);
  }
}
