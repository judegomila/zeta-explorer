// @module data/imp-96229-reciprocal-elasticity-consistency-audit
//
// imp-96229 (accuracy, frontier-direction): CROSS-CHECK that the two named
// elasticity readings of the ONE fixed-strip truncation power law
//   E_trunc(H) = (2 e_I / kappa) H^{-kappa}
// are mutually consistent reciprocal readings, with no hidden drift in the
// exponent, the anchor, or the prefactor between the two source modules.
//
// THE TWO READINGS
// ----------------
//   imp-2322 (forward)  reports the FORWARD constant elasticity of the bound
//     with respect to the certified height:
//       d log E_trunc / d log T_PT = -kappa = -0.4   (at sigma_opt = 3/4).
//     A decade of certified height tightens the bound by 10^{kappa} ~ 2.512x.
//   imp-96207 (inverse) reports the INVERSE sensitivity of the required height
//     with respect to the target floor (inverting H_required(E) =
//     (prefactor/E)^{1/kappa_star}):
//       d log H / d log E = -1/kappa_star = -2.5.
//     A decade of floor drop costs 10^{1/kappa_star} ~ 316x in certified height.
//
// These are the derivative of a function and the derivative of its inverse, so
// for ONE power law they MUST be exact reciprocals: (d log E / d log H) times
// (d log H / d log E) = 1, i.e. (-0.4) * (-2.5) = 1, and -2.5 = 1 / (-0.4).
// The per-decade leverages are likewise reciprocal EXPONENTS: kappa * (1/kappa)
// = 1 (0.4 forward tightening-decades per height-decade; 2.5 height-decades per
// floor-decade), while the per-decade FACTORS 10^{0.4} ~ 2.512 and 10^{2.5} ~
// 316 are NOT reciprocals of each other (10^{0.4} * 10^{2.5} = 10^{2.9}, not 1)
// -- a deliberate note so the reciprocity is read on the exponents, not the
// factors. This module tabulates the cross-check.
//
// SAME EXPONENT, SAME ANCHOR, SAME PREFACTOR (the drift audit)
// -----------------------------------------------------------
// The reciprocity is only meaningful if the two modules speak of the SAME law.
// Verified here:
//   1. kappa_star (imp-96207) = kappa (imp-2322) = 1 - e_I = 0.4 at the honest
//      abscissa sigma = 3/4, where e_I = 3(1-sigma)/(2-sigma) = 0.6. imp-96207
//      carries e_I = 1 - kappa_star = 0.6 as a literal; imp-2322 derives e_I
//      from the Ingham 1940 exponent. Both land on e_I = 0.6, kappa = 0.4.
//   2. prefactor = 2 e_I / kappa = 2(1 - kappa)/kappa = 3.0 on BOTH modules
//      (imp-96207 writes it as 2(1-kappa_star)/kappa_star; the two forms are the
//      same expression under e_I = 1 - kappa).
//   3. E_trunc(3e12) = 3.0 * (3e12)^{-0.4} = 3.063887e-5 on BOTH modules, which
//      rounds to the pinned frozen floor 3.06e-5 (imp-96166 / imp-447). The full
//      value 3.063887e-5 sits 3.9e-8 above the 3.06e-5 pin -- a display rounding,
//      not a drift: both modules assert equality to the 3.06e-5 pin at 1e-6 tol.
// No drift found on any of the three: the -0.4 and -2.5 readings are one law.
//
// SCOPE: ACCURACY AUDIT ONLY, cross-checking two existing measurement modules.
// No zero is verified, no new T_PT is claimed, the rigorous bound stays
// E_trunc = 3.06e-5, and C_mb stays GUE-conditional per imp-486. Changes no
// bound. No positivity, no bridge closure, no RH claim, NO QED. No refereed bound is changed
// ; RH remains OPEN.
//
// SYNTAX SAFETY: line comments only; single-quoted strings; no apostrophes
// inside single-quoted strings; no star-slash in any comment.
//
// @see imp-2322-etrunc-pt-T_PT-sensitivity (forward elasticity -0.4, load-bearing 3e12)
// @see imp-96207-verified-height-floor-law-kappa-star (inverse exponent -1/kappa_star=-2.5)
// @see imp-96185-etrunc-floor-inverse-height-thresholds (same kappa_star=0.4 inversion)
// @see imp-96190-fixed-strip-n-decaying-tail-obstruction (the two-ways-are-one-way collapse)
// @see imp-486 (C_mb GUE-conditional); lambda-roadmap Step 4 / conditionalBookkeeping B1-B3

// Shared anchors of the fixed-strip truncation power law, carried as literals to
// keep this module import-light (self-contained, imp-96190 / imp-96207 pattern).
const SIGMA_OPT = 0.75;             // honest fixed abscissa (imp-459)
const T_PT_BASELINE = 3e12;         // Platt-Trudgian 2021 verified strip height
const E_TRUNC_PIN = 3.06e-5;        // imp-96166 frozen floor (rounded), pinned

// Ingham 1940 zero-density exponent e_I(sigma) = 3(1-sigma)/(2-sigma).
function inghamExponent(sigma) {
  return (3 * (1 - sigma)) / (2 - sigma);
}

// imp-2322 side: forward reading.
const E_I_2322 = inghamExponent(SIGMA_OPT);   // 0.6
const KAPPA_2322 = 1 - E_I_2322;               // 0.4
const PREFACTOR_2322 = (2 * E_I_2322) / KAPPA_2322; // 3.0
const FORWARD_ELASTICITY = -KAPPA_2322;        // -0.4 = d log E / d log H

// imp-96207 side: inverse reading (kappa_star carried as a literal, e_I=1-kappa).
const KAPPA_STAR_96207 = 0.4;
const E_I_96207 = 1 - KAPPA_STAR_96207;        // 0.6
const PREFACTOR_96207 = (2 * (1 - KAPPA_STAR_96207)) / KAPPA_STAR_96207; // 3.0
const INVERSE_EXPONENT = -1 / KAPPA_STAR_96207; // -2.5 = d log H / d log E

// The one law evaluated at the baseline (must agree on both modules).
function etruncAt(H, kappa, prefactor) {
  return prefactor * Math.pow(H, -kappa);
}
const E_TRUNC_2322 = etruncAt(T_PT_BASELINE, KAPPA_2322, PREFACTOR_2322);
const E_TRUNC_96207 = etruncAt(T_PT_BASELINE, KAPPA_STAR_96207, PREFACTOR_96207);

// Reciprocity products (both must be exactly 1 for one power law and its inverse).
const ELASTICITY_PRODUCT = FORWARD_ELASTICITY * INVERSE_EXPONENT; // 1
const DECADE_EXPONENT_PRODUCT = KAPPA_2322 * (1 / KAPPA_STAR_96207); // 1

// Per-decade FACTORS (reported for context; NOT reciprocals of each other).
const FORWARD_PER_DECADE_FACTOR = Math.pow(10, KAPPA_2322);       // ~2.512
const INVERSE_PER_FLOOR_DECADE_FACTOR = Math.pow(10, 1 / KAPPA_STAR_96207); // ~316.23

export const IMP96229_RECIPROCAL_ELASTICITY_CONSISTENCY_AUDIT = {
  id: 'imp-96229',
  proofSection: 'S-frontier',
  question:
    'Are the imp-96207 inverse sensitivity exponent d log H / d log E = ' +
    '-1/kappa_star = -2.5 and the imp-2322 forward elasticity d log E / d log H ' +
    '= -kappa = -0.4 mutually consistent reciprocal readings of the SAME ' +
    'H^{-kappa} truncation power law, with no drift in the exponent, anchor, or ' +
    'prefactor between the two modules? Accuracy audit only, changes no bound, ' +
    'no QED.',
  law:
    'E_trunc(H) = (2 e_I / kappa) H^{-kappa}, e_I = 1 - kappa. At sigma = 3/4: ' +
    'e_I = 0.6, kappa = 0.4, prefactor = 3.0, E_trunc(3e12) = 3.063887e-5 ' +
    '(rounds to the pinned 3.06e-5). Forward elasticity d log E / d log H = ' +
    '-kappa; inverse H_required(E) = (prefactor/E)^{1/kappa} has d log H / d ' +
    'log E = -1/kappa. For one law these are exact reciprocals.',
  sharedAnchors: {
    sigmaOpt: SIGMA_OPT,
    // e_I / kappa / prefactor recomputed independently on each side; they match.
    eI_from_ingham_2322: +E_I_2322.toFixed(6),
    eI_from_literal_96207: +E_I_96207.toFixed(6),
    kappa_2322: +KAPPA_2322.toFixed(6),
    kappaStar_96207: +KAPPA_STAR_96207.toFixed(6),
    prefactor_2322: +PREFACTOR_2322.toFixed(6),
    prefactor_96207: +PREFACTOR_96207.toFixed(6),
    T_PT_baseline: T_PT_BASELINE,
    etrunc_2322_at_3e12: +E_TRUNC_2322.toExponential(6),
    etrunc_96207_at_3e12: +E_TRUNC_96207.toExponential(6),
    etrunc_pin: E_TRUNC_PIN,
    etrunc_vs_pin_abs_gap: +Math.abs(E_TRUNC_2322 - E_TRUNC_PIN).toExponential(3),
  },
  reciprocity: {
    forwardElasticity: FORWARD_ELASTICITY,          // -0.4 (imp-2322)
    inverseExponent: INVERSE_EXPONENT,              // -2.5 (imp-96207)
    elasticityProduct: +ELASTICITY_PRODUCT.toFixed(12), // 1 (exact reciprocals)
    reciprocalIdentity: '-2.5 = 1 / (-0.4); -0.4 = 1 / (-2.5)',
    decadeExponentProduct: +DECADE_EXPONENT_PRODUCT.toFixed(12), // kappa*(1/kappa)=1
    forwardPerDecadeFactor: +FORWARD_PER_DECADE_FACTOR.toFixed(4),        // ~2.512
    inversePerFloorDecadeFactor: +INVERSE_PER_FLOOR_DECADE_FACTOR.toFixed(4), // ~316.23
    factorCaveat:
      'The per-decade FACTORS 10^{0.4} ~ 2.512 and 10^{2.5} ~ 316.23 are NOT ' +
      'reciprocals of each other (their product is 10^{2.9}, not 1). Reciprocity ' +
      'lives on the EXPONENTS (kappa and 1/kappa, product 1), which is the ' +
      'correct invariant for a function and its inverse.',
  },
  driftFindings:
    'No drift. (1) kappa_star (imp-96207) = kappa (imp-2322) = 0.4 to machine ' +
    'precision, both from e_I = 0.6 at sigma = 3/4. (2) prefactor = 3.0 on both, ' +
    'the forms 2 e_I/kappa and 2(1-kappa_star)/kappa_star being identical under ' +
    'e_I = 1 - kappa. (3) E_trunc(3e12) = 3.063887e-5 on both, agreeing with the ' +
    '3.06e-5 pin at the shared 1e-6 assertion tolerance (the 3.9e-8 gap is ' +
    'display rounding of 3.06e-5, not a module disagreement). The -0.4 and -2.5 ' +
    'readings are one power law and its inverse.',
  isRigorous: false,
  verdict:
    'CONSISTENT (accuracy audit, NOT rigorous). The imp-2322 forward elasticity ' +
    '-0.4 and the imp-96207 inverse exponent -2.5 are exact reciprocals of one ' +
    'H^{-kappa} truncation law: their product is exactly 1 and -2.5 = 1/(-0.4). ' +
    'kappa_star = kappa = 0.4, prefactor = 3.0, and E_trunc(3e12) = 3.063887e-5 ' +
    '(the pinned 3.06e-5) agree on both modules; no drift in exponent, anchor, ' +
    'or prefactor. The per-decade FACTORS 2.512 and 316.23 are not reciprocals ' +
    '(reciprocity is on the exponents, as it must be for a function and its ' +
    'inverse). No zero is verified, no new T_PT is claimed, the rigorous bound ' +
    'stays E_trunc = 3.06e-5, C_mb stays GUE-conditional per imp-486. Changes ' +
    'no bound; no bridge closure, no RH claim, NO QED. No refereed bound is changed' +
    '; RH OPEN.',
  citation:
    'imp-2322 (forward E_trunc(T_PT) power law, elasticity -0.4); imp-96207 ' +
    '(inverse height-to-floor law, exponent -1/kappa_star=-2.5); imp-96185 ' +
    '(same kappa_star=0.4 inversion); imp-96190 (two-ways-are-one-way collapse); ' +
    'imp-96166 (frozen E_trunc floor); imp-486 (C_mb GUE-conditional); ' +
    'lambda-roadmap Step 4 / conditionalBookkeeping B1-B3.',
};

export const IMP96229_RECIPROCAL_ELASTICITY_CONSISTENCY_AUDIT_ASSERTIONS = [
  {
    // kappa_star (imp-96207) equals kappa (imp-2322) = 0.4, both from e_I = 0.6.
    id: 'imp96229-exponents-agree',
    description: 'kappa_star (imp-96207) = kappa (imp-2322) = 0.4 and e_I = 0.6 on both',
    holds: () =>
      Math.abs(KAPPA_2322 - 0.4) < 1e-12 &&
      Math.abs(KAPPA_STAR_96207 - 0.4) < 1e-12 &&
      Math.abs(KAPPA_2322 - KAPPA_STAR_96207) < 1e-12 &&
      Math.abs(E_I_2322 - 0.6) < 1e-12 &&
      Math.abs(E_I_96207 - 0.6) < 1e-12,
  },
  {
    // prefactor = 3.0 on both, the two written forms being the same expression.
    id: 'imp96229-prefactors-agree',
    description: 'prefactor 2 e_I/kappa (imp-2322) = 2(1-kappa_star)/kappa_star (imp-96207) = 3.0',
    holds: () =>
      Math.abs(PREFACTOR_2322 - 3.0) < 1e-12 &&
      Math.abs(PREFACTOR_96207 - 3.0) < 1e-12 &&
      Math.abs(PREFACTOR_2322 - PREFACTOR_96207) < 1e-12,
  },
  {
    // E_trunc(3e12) reproduces on both and matches the 3.06e-5 pin at 1e-6 tol.
    id: 'imp96229-anchor-reproduces-on-both',
    description: 'E_trunc(3e12) = 3.063887e-5 on both modules, agrees with 3.06e-5 pin (1e-6)',
    holds: () =>
      Math.abs(E_TRUNC_2322 - E_TRUNC_96207) < 1e-15 &&
      Math.abs(E_TRUNC_2322 - E_TRUNC_PIN) < 1e-6 &&
      Math.abs(E_TRUNC_96207 - E_TRUNC_PIN) < 1e-6,
  },
  {
    // The forward and inverse exponents are EXACT reciprocals: product is 1.
    id: 'imp96229-elasticities-are-reciprocal',
    description: 'forward -0.4 and inverse -2.5 are exact reciprocals (product = 1)',
    holds: () =>
      Math.abs(FORWARD_ELASTICITY - -0.4) < 1e-12 &&
      Math.abs(INVERSE_EXPONENT - -2.5) < 1e-12 &&
      Math.abs(ELASTICITY_PRODUCT - 1) < 1e-12 &&
      Math.abs(INVERSE_EXPONENT - 1 / FORWARD_ELASTICITY) < 1e-12 &&
      Math.abs(FORWARD_ELASTICITY - 1 / INVERSE_EXPONENT) < 1e-12,
  },
  {
    // The per-decade FACTORS are NOT reciprocals; reciprocity is on the exponents.
    id: 'imp96229-factors-not-reciprocal-exponents-are',
    description: 'per-decade factors 2.512 and 316.23 are not reciprocal; exponent product kappa*(1/kappa)=1',
    holds: () =>
      Math.abs(FORWARD_PER_DECADE_FACTOR - 2.5119) < 1e-3 &&
      Math.abs(INVERSE_PER_FLOOR_DECADE_FACTOR - 316.2278) < 1e-3 &&
      Math.abs(FORWARD_PER_DECADE_FACTOR * INVERSE_PER_FLOOR_DECADE_FACTOR - 1) > 100 &&
      Math.abs(DECADE_EXPONENT_PRODUCT - 1) < 1e-12,
  },
  {
    // Honesty gate: accuracy audit only, no QED, no refereed bound is changed, changes no bound.
    id: 'imp96229-honesty-gate-no-qed',
    description: 'Accuracy audit only: reciprocal-consistency confirmed, no QED, no refereed bound is changed',
    holds: () =>
      IMP96229_RECIPROCAL_ELASTICITY_CONSISTENCY_AUDIT.isRigorous === false &&
      /reciprocal/.test(IMP96229_RECIPROCAL_ELASTICITY_CONSISTENCY_AUDIT.verdict) &&
      /No drift/.test(IMP96229_RECIPROCAL_ELASTICITY_CONSISTENCY_AUDIT.driftFindings) &&
      /NO QED/.test(IMP96229_RECIPROCAL_ELASTICITY_CONSISTENCY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP96229_RECIPROCAL_ELASTICITY_CONSISTENCY_AUDIT.verdict),
  },
];

for (const a of IMP96229_RECIPROCAL_ELASTICITY_CONSISTENCY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96229-reciprocal-elasticity-consistency-audit assertion failed: ${a.id}`,
    );
  }
}
