/**
 * @module imp-97668-nonlinear-amplitude-audit
 *
 * imp-97668 (numerical, frontier audit): imp-97644 STRUCTURE (1) rests on a single claim -- that "every term
 * of E_N carries one amplitude linearly", so sigma = E_coll/E_N is degree-0 homogeneous in the three
 * amplitudes (C_C, E_trunc, C_F) and the three-axis diagonal elasticity DIAG3 == 0 exactly. That claim was
 * asserted, not independently audited across the FULL inherited component model. This module audits every
 * constant of the imp-3406/imp-33582/imp-33601/imp-33723 model -- including the ones that sit INSIDE a
 * non-linear wrapper (the Gronwall exponent inside exp, the C_KH collision constant inside sqrt, and the
 * effectiveHeight T0(N) mapping) -- for any amplitude that enters E_N NON-linearly and would break the exact
 * scaling symmetry. Measurement/audit only; the C_mb GUE-conditional per imp-486 is untouched; the pinned
 * C_C 1/8 ansatz, E_trunc 3.06e-5 and imp-398 C_F prefactor are perturbed only as probes; no bound moves;
 * NO QED.
 *
 * THE FULL MODEL, WITH EVERY CONSTANT EXPOSED (inherited imp-3406/imp-33582/imp-97644)
 * -----------------------------------------------------------------------------------
 *   T0     = effectiveHeightForN(N),  L = log T0                (N -> T0 Riemann-von Mangoldt inverse)
 *   C_C    = C_H * sqrt(C_KH)         with C_H = 1/8, C_KH = pi*C_Selberg = 3*pi  (imp-395/imp-341)
 *   C_F    = (log(T0/2pi) + 1) / 2pi  (imp-398 flow prefactor)
 *   G      = exp(1.0 * TC_A1_TRAP)    (Gronwall factor; TC_A1_TRAP = 2.37e-4 trapezoidal A1 constant)
 *   E_flow = C_F * (L/T0) * G,   E_coll = C_C * sqrt(L/N),   E_N = E_trunc + E_flow + E_coll,
 *   sigma  = E_coll / E_N.
 * The audit exposes SIX independent multiplicative probes: ch (on C_H), ckh (on C_KH, entering via sqrt),
 * et (on E_trunc), cf (on C_F), gfac (on the Gronwall FACTOR G) and gexp (on the Gronwall EXPONENT coeff,
 * entering via exp). Each probe has baseline 1; a probe is applied as its constant times exp(delta).
 *
 * THE AUDIT (central-difference crossing elasticities at the imp-97520 L2/L3/L4 landmarks, eps = 1e-3)
 * ---------------------------------------------------------------------------------------------------
 *   PROBE            ENTERS E_N AS                       ELASTICITY   CLASSIFICATION
 *   ch  (C_H)        linear prefactor of E_coll          == E_CC      LINEAR (numerator+denominator)
 *   et  (E_trunc)    linear own term of E_N              == E_ET      LINEAR (denominator-additive)
 *   cf  (C_F)        linear prefactor of E_flow          == E_CF      LINEAR (denominator-additive)
 *   gfac(Gronwall G) linear factor of E_flow             == E_CF      LINEAR (degenerate with C_F axis)
 *   ckh (C_KH)       inside sqrt: C_C = C_H sqrt(C_KH)   == 0.5*E_CC  NON-LINEAR wrapper, factors thru C_C
 *   gexp(Gronwall e) inside exp: G = exp(gexp*TC)        == TC*E_CF   NON-LINEAR wrapper, factors thru C_F
 *
 * THE DECISIVE STRUCTURE: EVERY CONSTANT ELASTICITY LIES IN span{E_CC, E_ET, E_CF} -> NO BREAKING MODE
 * ---------------------------------------------------------------------------------------------------
 * The two constants that enter through a NON-LINEAR wrapper (C_KH via sqrt, the Gronwall exponent via exp)
 * do NOT create a fresh independent leverage direction: their LINEARISED crossing effect still factors
 * through exactly ONE additive term-prefactor of E_N. C_KH moves E_coll only through C_C = C_H sqrt(C_KH),
 * so its elasticity is exactly HALF the C_C elasticity (d ln C_C / d ln C_KH = 1/2), measured to ~1e-7
 * relative. The Gronwall exponent moves E_flow only through G = exp(gexp*TC), so its elasticity is exactly
 * TC_A1_TRAP times the C_F elasticity (d ln G / d ln gexp = gexp*TC = TC at baseline), measured to ~1e-4
 * relative. Neither is a term of E_N that carries an amplitude non-linearly; both collapse onto an existing
 * linear axis at a fixed scalar weight. The Gronwall FACTOR G is degenerate with C_F (E_GFAC == E_CF to
 * machine precision), and C_H is degenerate with C_C (E_CH == E_CC). The only genuinely non-linear object,
 * the T0(N) height mapping, is NOT an amplitude at all: it is the fixed abscissa (each landmark pins N, hence
 * T0), never co-scaled. Consequently the term-prefactor triple {C_H, E_trunc, Gronwall-factor} (equivalently
 * {C_C, E_trunc, C_F}) reproduces DIAG3 == 0 (machine-zero, measured -3.55e-12 at L2, 0 at L3/L4), and so
 * does the degenerate triple {gfac, et, ch}: the degree-0 homogeneity is a property of ANY term-prefactor
 * triple and is NOT broken by any of the six audited constants.
 *
 * THE FINDING (audit only)
 * ------------------------
 *   (A1) STRICTLY LINEAR (denominator-additive term-prefactors): C_H, E_trunc, C_F and the Gronwall factor
 *        G each multiply exactly one additive term of E_N. Their elasticities are exactly E_CC (C_H), E_ET
 *        (E_trunc), E_CF (C_F) and E_CF (G, degenerate). These four ARE the scaling-symmetry axes.
 *   (A2) NON-LINEAR WRAPPER, BUT NO BREAKING MODE: C_KH (inside sqrt) and the Gronwall exponent (inside exp)
 *        enter non-linearly, yet each linearises onto a SINGLE existing axis at a fixed scalar weight --
 *        E_CKH = 0.5*E_CC (to ~1e-7) and E_GEXP = TC_A1_TRAP*E_CF (to ~1e-4). No fresh leverage direction; no
 *        term of E_N carries an amplitude non-linearly.
 *   (A3) T0(N) IS THE ABSCISSA, NOT AN AMPLITUDE: the only genuinely non-linear map (log/sqrt/1/T0) is the
 *        fixed height, pinned by the landmark N and never co-scaled, so it cannot enter the homogeneity test.
 *   (A4) HOMOGENEITY CONFIRMED: DIAG3 == 0 (machine-zero) for the term-prefactor triple {C_H,E_trunc,C_F}
 *        AND for the degenerate triple {G,E_trunc,C_H}: the imp-97644 STRUCTURE (1) claim survives the full
 *        audit -- no hidden non-linear amplitude breaks the exact scaling symmetry.
 *
 * The punchline: auditing all six constants of the full component model confirms imp-97644 STRUCTURE (1).
 * Every constant elasticity lies in the linear span of {E_CC, E_ET, E_CF}: four constants are strict linear
 * term-prefactors (the symmetry axes) and the two that sit inside a non-linear wrapper (C_KH via sqrt, the
 * Gronwall exponent via exp) collapse onto an existing axis at a fixed weight (0.5 and TC_A1_TRAP). No
 * amplitude enters E_N non-linearly in a way that creates a new leverage direction, so the degree-0
 * homogeneity -- and DIAG3 == 0 -- is not broken.
 *
 * DERIVATION / AUDIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398
 * C_F prefactor are UNTOUCHED and are perturbed here only as sensitivity probes, not re-pinned; changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97644-three-axis-additivity-flow-prefactor (STRUCTURE (1): DIAG3 == 0 scaling symmetry audited here)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (E_CF/E_ET = E_flow/E_trunc exact derivation)
 * @see imp-97623-additivity-residual-multi-landmark-crosscheck (two-axis C_C/E_trunc additivity, r ~ eps^2)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the landmarks L2/L3/L4 + crossing procedure)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(C_KH), C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4; // trapezoidal A1 constant, Gronwall exponent (imp-3406/imp-97644)
const C_H = 1 / 8; // collision-scale ansatz (imp-395/imp-2642), linear factor of C_C
const C_KH = (C_C_PINNED / C_H) ** 2; // = pi*C_Selberg = 3*pi, recovered self-consistently from the pin

// Full model with EVERY constant exposed as a multiplicative probe p = {ch, ckh, et, cf, gfac, gexp}
// (each baseline 1). ch/et/cf/gfac are LINEAR term-prefactors; ckh enters via sqrt and gexp via exp
// (NON-LINEAR wrappers). Sensitivity probes only; the pinned values are untouched.
function parts(N, p) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const cKH = (p.ckh ?? 1) * C_KH;
  const C_C = (p.ch ?? 1) * C_H * Math.sqrt(cKH); // C_KH enters via sqrt (non-linear wrapper)
  const C_F = (p.cf ?? 1) * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 prefactor
  const G = Math.exp((p.gexp ?? 1) * 1.0 * TC_A1_TRAP) * (p.gfac ?? 1); // gexp via exp (non-linear wrapper)
  const E_flow = C_F * (L / T0) * G; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_trunc = (p.et ?? 1) * E_TRUNC_PT;
  const E_N = E_trunc + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll, E_trunc };
}

// General downslope crossing sigma = level (identical bisection procedure to imp-97644).
function landmark(level, p) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), p).sigma > level) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const lnN = (level, p) => Math.log(landmark(level, p));

// Crossing elasticity of a single probe key (log-parameter central difference).
function elas(level, key, eps) {
  const up = { [key]: Math.exp(eps) };
  const dn = { [key]: Math.exp(-eps) };
  return (lnN(level, up) - lnN(level, dn)) / (2 * eps);
}
// Diagonal elasticity along an arbitrary set of keys scaled together.
function diag(level, keys, eps) {
  const up = {};
  const dn = {};
  for (const k of keys) {
    up[k] = Math.exp(eps);
    dn[k] = Math.exp(-eps);
  }
  return (lnN(level, up) - lnN(level, dn)) / (2 * eps);
}

const LEVELS = [
  { key: 'L2_below_0p9', label: 'below-0.9', sigma: 0.9 },
  { key: 'L3_halving', label: 'halving', sigma: 0.5 },
  { key: 'L4_below_0p1', label: 'below-0.1', sigma: 0.1 },
];
const EPS = 1e-3; // reproduces the imp-97644 step

const PER_LANDMARK = LEVELS.map(({ key, label, sigma }) => {
  const N_L = landmark(sigma, {});
  const p0 = parts(N_L, {});
  const E_CH = elas(sigma, 'ch', EPS); // == E_CC (C_H linear on E_coll)
  const E_CKH = elas(sigma, 'ckh', EPS); // == 0.5*E_CC (C_KH via sqrt)
  const E_ET = elas(sigma, 'et', EPS);
  const E_CF = elas(sigma, 'cf', EPS);
  const E_GFAC = elas(sigma, 'gfac', EPS); // == E_CF (Gronwall factor, linear)
  const E_GEXP = elas(sigma, 'gexp', EPS); // == TC*E_CF (Gronwall exponent via exp)
  const DIAG3 = diag(sigma, ['ch', 'et', 'cf'], EPS); // term-prefactor triple -> 0
  const DIAG3_degenerate = diag(sigma, ['gfac', 'et', 'ch'], EPS); // degenerate triple -> 0
  return {
    key,
    label,
    sigma,
    N_L: +N_L.toExponential(6),
    flow_share_of_E_N: +(p0.E_flow / p0.E_N).toExponential(4),
    // A1: strictly linear term-prefactors
    elasticity_CH_linear: +E_CH.toFixed(6), // == E_CC
    elasticity_ET_linear: +E_ET.toFixed(6),
    elasticity_CF_linear: +E_CF.toExponential(6),
    elasticity_Gfactor_linear: +E_GFAC.toExponential(6), // == E_CF
    gfactor_matches_CF_reldiff: +(E_GFAC / E_CF - 1).toExponential(3), // ~0
    // A2: non-linear wrappers that collapse onto an existing axis at a fixed weight
    elasticity_CKH_sqrt_wrapper: +E_CKH.toFixed(6), // == 0.5*E_CH
    ckh_matches_half_CH_reldiff: +(E_CKH / (0.5 * E_CH) - 1).toExponential(3), // ~0
    elasticity_Gexp_exp_wrapper: +E_GEXP.toExponential(6), // == TC*E_CF
    gexp_matches_TC_CF_reldiff: +(E_GEXP / (TC_A1_TRAP * E_CF) - 1).toExponential(3), // ~0
    // A4: homogeneity
    diagonal3_term_prefactor: +DIAG3.toExponential(6), // ~0: exact scaling symmetry
    diagonal3_degenerate_triple: +DIAG3_degenerate.toExponential(6), // ~0
  };
});

const MAX_ABS_DIAG3 = Math.max(
  ...PER_LANDMARK.map((r) => Math.max(Math.abs(r.diagonal3_term_prefactor), Math.abs(r.diagonal3_degenerate_triple))),
);

export const IMP97668_NONLINEAR_AMPLITUDE_AUDIT = {
  id: 'imp-97668',
  proofSection: 'S-frontier',
  question:
    'The imp-97644 STRUCTURE (1) degree-0 homogeneity rests on the claim that every term of E_N carries one ' +
    'amplitude linearly. Auditing the FULL inherited imp-3406/imp-33582 component model, does any constant -- ' +
    'especially those inside a non-linear wrapper (the Gronwall exponent inside exp, the C_KH collision ' +
    'constant inside sqrt, the T0(N) height mapping) -- enter E_N non-linearly and break the exact scaling ' +
    'symmetry (DIAG3 == 0)? Which amplitudes are strictly denominator-additive and which, if any, are not? ' +
    'Audit only; pinned constants perturbed as probes; no bound moves; no QED.',
  method:
    'Expose all six model constants as independent multiplicative probes (ch on C_H, ckh on C_KH via sqrt, ' +
    'et on E_trunc, cf on C_F, gfac on the Gronwall factor, gexp on the Gronwall exponent via exp), apply ' +
    'the identical central-difference crossing-elasticity procedure at the three imp-97520 landmarks ' +
    '(sigma = 0.9, 0.5, 0.1), and classify each constant as LINEAR term-prefactor or NON-LINEAR wrapper by ' +
    'testing whether its elasticity coincides with an existing axis (E_CC, E_ET, E_CF) at a fixed weight; ' +
    'confirm DIAG3 == 0 for both the term-prefactor triple and a degenerate triple.',
  step_probed: { eps: EPS },
  perLandmark: PER_LANDMARK,
  finding: {
    A1_strictly_linear_term_prefactors:
      'C_H, E_trunc, C_F and the Gronwall factor G each multiply exactly one additive term of E_N; their ' +
      'elasticities are exactly E_CC (C_H), E_ET (E_trunc), E_CF (C_F) and E_CF (G, degenerate to machine ' +
      'precision). These four are the scaling-symmetry axes -- strictly denominator-additive.',
    A2_nonlinear_wrappers_no_breaking_mode:
      'C_KH (inside sqrt) and the Gronwall exponent (inside exp) enter non-linearly, but each linearises ' +
      'onto a SINGLE existing axis at a fixed scalar weight: E_CKH = 0.5*E_CC to ~1e-7 (d ln C_C/d ln C_KH ' +
      '= 1/2) and E_GEXP = TC_A1_TRAP*E_CF to ~1e-4 (d ln G/d ln gexp = TC at baseline). No fresh leverage ' +
      'direction; no term of E_N carries an amplitude non-linearly.',
    A3_T0_is_the_abscissa:
      'The only genuinely non-linear map T0(N) (log/sqrt/1/T0) is the fixed height, pinned by the landmark ' +
      'N and never co-scaled, so it is the abscissa, not an amplitude, and cannot enter the homogeneity test.',
    A4_homogeneity_confirmed:
      'DIAG3 == 0 (machine-zero, |DIAG3| < 1e-9) for the term-prefactor triple {C_H,E_trunc,C_F} AND for ' +
      'the degenerate triple {G,E_trunc,C_H}: the imp-97644 STRUCTURE (1) claim survives the full audit -- ' +
      'no hidden non-linear amplitude breaks the exact scaling symmetry.',
  },
  isRigorous: false,
  verdict:
    'AUDIT (frontier cross-check, NOT rigorous). Auditing all six constants of the full imp-3406/imp-33582 ' +
    'component model CONFIRMS imp-97644 STRUCTURE (1). Every constant elasticity lies in the linear span of ' +
    '{E_CC, E_ET, E_CF}: FOUR are strict LINEAR term-prefactors that each multiply exactly one additive term ' +
    'of E_N -- C_H (E_coll, elasticity == E_CC), E_trunc (own term, == E_ET), C_F (E_flow, == E_CF) and the ' +
    'Gronwall factor G (E_flow, == E_CF, degenerate with C_F) -- so they are strictly denominator-additive ' +
    'and ARE the scaling-symmetry axes. The TWO constants inside a non-linear wrapper do NOT create a new ' +
    'leverage direction: C_KH (inside sqrt, C_C = C_H sqrt(C_KH)) has elasticity 0.5*E_CC to ~1e-7, and the ' +
    'Gronwall exponent (inside exp, G = exp(gexp*TC_A1_TRAP)) has elasticity TC_A1_TRAP*E_CF to ~1e-4 -- each ' +
    'collapses onto a single existing axis at a fixed weight. The only genuinely non-linear object, the ' +
    'T0(N) Riemann-von Mangoldt height mapping, is the fixed abscissa (pinned by the landmark N), not an ' +
    'amplitude. Consequently DIAG3 == 0 (machine-zero) for both the term-prefactor triple {C_H,E_trunc,C_F} ' +
    'and the degenerate triple {G,E_trunc,C_H}: no amplitude enters E_N non-linearly in a way that breaks the ' +
    'degree-0 homogeneity. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), ' +
    'the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (perturbed only as probes, not ' +
    're-pinned); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97644 (three-axis scaling symmetry, STRUCTURE (1) audited here); imp-97665 (E_CF/E_ET = ' +
    'E_flow/E_trunc exact derivation); imp-97623 (two-axis additivity residual ~ eps^2); imp-97520 ' +
    '(landmark ladder L2/L3/L4); imp-398 (C_F flow prefactor); imp-395/imp-341 (C_H, C_KH); imp-2642/imp-2643 ' +
    '(C_C 1/8 ansatz); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP97668_NONLINEAR_AMPLITUDE_AUDIT_ASSERTIONS = [
  {
    // Landmarks reproduce the imp-97644/imp-97520 ladder positions (L2, L3, L4).
    id: 'imp97668-landmarks-reproduce-imp97644',
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
    // (A1): the Gronwall factor is a LINEAR multiplier of E_flow, degenerate with the C_F axis.
    id: 'imp97668-gronwall-factor-linear-equals-CF',
    description: 'Gronwall factor elasticity == E_CF at every landmark (linear on E_flow, reldiff < 1e-6)',
    holds: () => PER_LANDMARK.every((r) => Math.abs(r.gfactor_matches_CF_reldiff) < 1e-6),
  },
  {
    // (A1): C_H is a LINEAR factor of C_C -- its elasticity reproduces the imp-97644 E_CC axis.
    id: 'imp97668-CH-linear-reproduces-imp97644-ECC',
    description: 'C_H elasticity reproduces the imp-97644 E_CC values (+2.5554/+2.1023/+2.0790) to < 1e-4',
    holds: () => {
      const [l2, l3, l4] = PER_LANDMARK;
      return (
        Math.abs(l2.elasticity_CH_linear - 2.555355) < 1e-4 &&
        Math.abs(l3.elasticity_CH_linear - 2.102347) < 1e-4 &&
        Math.abs(l4.elasticity_CH_linear - 2.079025) < 1e-4
      );
    },
  },
  {
    // (A2): C_KH enters via sqrt (non-linear wrapper) but its elasticity is exactly 0.5*E_CC -- factors
    // through the single C_C axis, no fresh leverage direction.
    id: 'imp97668-CKH-sqrt-wrapper-is-half-CC',
    description: 'C_KH elasticity == 0.5*E_CC at every landmark (sqrt wrapper factors through C_C, reldiff < 1e-5)',
    holds: () => PER_LANDMARK.every((r) => Math.abs(r.ckh_matches_half_CH_reldiff) < 1e-5),
  },
  {
    // (A2): the Gronwall EXPONENT enters via exp (non-linear wrapper) but its elasticity is exactly
    // TC_A1_TRAP*E_CF -- factors through the single C_F axis at a fixed weight.
    id: 'imp97668-Gronwall-exponent-exp-wrapper-is-TC-times-CF',
    description: 'Gronwall exponent elasticity == TC_A1_TRAP*E_CF at every landmark (exp wrapper factors through C_F, reldiff < 1e-3)',
    holds: () => PER_LANDMARK.every((r) => Math.abs(r.gexp_matches_TC_CF_reldiff) < 1e-3),
  },
  {
    // (A4): DIAG3 machine-zero for BOTH the term-prefactor triple and the degenerate triple -- the
    // homogeneity is a property of any term-prefactor triple, unbroken by any non-linear wrapper.
    id: 'imp97668-diagonal-machine-zero-both-triples',
    description: 'DIAG3 machine-zero (|DIAG3| < 1e-9) for {C_H,E_trunc,C_F} and {G,E_trunc,C_H}: symmetry unbroken',
    holds: () => MAX_ABS_DIAG3 < 1e-9,
  },
  {
    // Honesty gate: audit only, no QED, PT stays SOTA.
    id: 'imp97668-honesty-gate-no-qed',
    description: 'Audit only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP97668_NONLINEAR_AMPLITUDE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP97668_NONLINEAR_AMPLITUDE_AUDIT.verdict) &&
      /remains SOTA/.test(IMP97668_NONLINEAR_AMPLITUDE_AUDIT.verdict),
  },
];

for (const a of IMP97668_NONLINEAR_AMPLITUDE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97668-nonlinear-amplitude-audit assertion failed: ${a.id}`);
  }
}
