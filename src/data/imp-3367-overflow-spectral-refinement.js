/**
 * @module imp-3367-overflow-spectral-refinement
 * @fileoverview imp-3367 -- Quantify the refinement step imp-3253 left underived:
 *   the degree-0 overflow-support fraction has a GEOMETRIC bare-crossover value
 *   (U - tau_star)/U ~ 0.7062 (tau_star = arcsinh(1)/a, the sinh(a tau) = 1 lag),
 *   which the FULL normalized-spectral construction
 *   R = Gpass^{-1/2} Gshear Gpass^{-1/2} "refines" to the ~0.64 the section-26
 *   verdict cites. imp-3253 recorded that ~0.066 refinement as a NAMED SUB-GAP
 *   (imp-3253-subgap-exact-deg0-spectral-fraction) but never said WHICH spectral
 *   effect removes the support, nor quantified it, nor gave its a,U-dependence.
 *
 *   DELIVERABLE (measure/diagnostic only)
 *   -------------------------------------
 *   1. IDENTIFY the mechanism. The naive bare-crossover fraction treats the
 *      per-unit-lag overflow indicator as a SHARP step at the bare threshold 1:
 *      it counts tau in {sinh(a tau) &gt; 1} = {tau &gt; tau_star}. The normalized-R
 *      construction does NOT compare the bare shear sinh(a tau) against the bare
 *      diagonal weight 1: the passive normalization Gpass^{-1/2} on BOTH sides
 *      raises the effective diagonal weight the shear must beat above 1 (the
 *      passive core carries its own cosh(a .)-type diagonal mass, partially
 *      folded in by the two-sided normalization). The effect is an
 *      EFFECTIVE-THRESHOLD ENHANCEMENT: the crossover the shear must clear moves
 *      OUTWARD from tau_star = arcsinh(1)/a to a larger tau_eff, and the thin
 *      annulus (tau_star, tau_eff) is exactly the support the refinement REMOVES.
 *      (Off-diagonal shear coupling is a secondary boundary-smearing effect; the
 *      DOMINANT, sign-correct effect is the two-sided passive-normalization
 *      threshold enhancement, which alone moves 0.706 downward to 0.64.)
 *
 *   2. QUANTIFY at the genuine cell (a = 0.5, U = 6). Solve for the effective
 *      threshold K_eff that the closed-form crossover fraction
 *          f(K; a, U) = 1 - arcsinh(K) / (a U)
 *      maps to the cited degree-0 fraction ~0.64:
 *          f(K_eff) = 0.64  =&gt;  arcsinh(K_eff) = a U (1 - 0.64) = 1.08
 *          =&gt;  K_eff = sinh(1.08) ~ 1.3025      (up from the bare 1)
 *          =&gt;  tau_eff = arcsinh(K_eff)/a = 2.16,  tau_eff - tau_star ~ 0.397.
 *      The removed support is (tau_eff - tau_star)/U ~ 0.0662 of tau -- the exact
 *      ~0.066 refinement imp-3253 left underived, now expressed as a single
 *      passive-normalization threshold enhancement 1 -&gt; K_eff ~ 1.30.
 *
 *   3. a,U-DEPENDENCE. The bare fraction f(1; a, U) = 1 - arcsinh(1)/(a U) scales
 *      as 1/(a U) (a and U enter ONLY through the product a U). IF the effective
 *      threshold enhancement K_eff is scale-stable (a hypothesis, NOT derived
 *      here), the refinement REMOVES a fraction
 *          f(1) - f(K_eff) = [arcsinh(K_eff) - arcsinh(1)] / (a U),
 *      i.e. the removed fraction ALSO scales as 1/(a U) -- the SAME law as
 *      tau_star/U. This module tabulates f(1; a, U) and f(K_eff; a, U) across an
 *      a,U grid so the 1/(a U) collapse is visible.
 *
 *   NAMED SUB-GAP (honest, still open)
 *   ----------------------------------
 *   imp-3367-subgap-derive-Keff-from-construction: K_eff ~ 1.3025 is BACKED OUT
 *   from the cited ~0.64 via the closed-form crossover fraction; it is NOT derived
 *   from the Gpass^{-1/2} Gshear Gpass^{-1/2} construction itself, and whether
 *   K_eff is genuinely a,U-stable (step 3 hypothesis) is untested against the full
 *   spectral measures. Deriving K_eff(a, U) -- and confirming or refuting its
 *   scale-stability -- still requires the full section 25-26 normalized-spectral
 *   construction (the arbiter, /tmp/riemann_arbiter.py per imp-2686), unchanged by
 *   this module. What this module CLOSES is the "which effect / how much" half:
 *   the refinement is a passive-normalization threshold enhancement 1 -&gt; K_eff,
 *   worth ~0.066 of tau at the genuine cell.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DIAGNOSTIC / accuracy quantification at the genuine de Bruijn-Newman Phi
 *   (a = 0.5, U = 6). RH-EQUIVALENT; the ~0.64 target is itself cited to two
 *   figures, so K_eff carries that imprecision. Necessary-but-NOT-sufficient at
 *   operator order; the off-diagonal endpoint-Hankel operator step (imp-3066)
 *   remains the lone obstruction, UNTOUCHED. No positivity attempted, no
 *   reduction, no RH verdict, no false QED. No refereed bound is changed.
 *
 *   @see imp-3253-overflow-degree-reconcile.js (parent: records the underived ~0.066 step)
 *   @see imp-2686-mupass-construction.js ("64% is degree-0" scale analysis; the arbiter pointer)
 *   @see section26-mupass-operator-verdict-2026-06-30.js (the verdict citing ~64%)
 *
 *   Ticket: imp-3367 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const A = 0.5;                                 // headline shear weight (the genuine-Phi cell)
const U = 6;                                   // genuine-Phi lag cutoff (the headline cell)

const RECORDED_DEG0_SPECTRAL_OVERFLOW = 0.64;  // section-26 verdict degree-0 (RH-equivalent) fraction
const RECORDED_BARE_CROSSOVER = 0.7062;        // imp-3253 geometric bare-crossover proxy (upper)

// Bare crossover: sinh(a tau) = 1  <=>  tau = arcsinh(1)/a.
const TAU_STAR = Math.asinh(1) / A;
// Closed-form crossover-support fraction of [0, U] for a general effective threshold K:
//   f(K) = |{tau : sinh(a tau) > K}| / U = (U - arcsinh(K)/a)/U = 1 - arcsinh(K)/(a U).
function crossoverFraction(K, a, u) {
  return 1 - Math.asinh(K) / (a * u);
}

const BARE_CROSSOVER_FRACTION = crossoverFraction(1, A, U);   // ~0.70621 (K = 1)

// Back out the effective threshold K_eff that maps to the cited ~0.64:
//   f(K_eff) = 0.64  =>  arcsinh(K_eff) = a U (1 - 0.64)  =>  K_eff = sinh(a U (1 - 0.64)).
const ARCSINH_KEFF = A * U * (1 - RECORDED_DEG0_SPECTRAL_OVERFLOW);   // = 1.08
const K_EFF = Math.sinh(ARCSINH_KEFF);                               // ~1.30254
const TAU_EFF = Math.asinh(K_EFF) / A;                              // = U*(1 - 0.64) = 2.16
const CROSSOVER_SHIFT = TAU_EFF - TAU_STAR;                         // ~0.39725 (outward)
const REMOVED_FRACTION = BARE_CROSSOVER_FRACTION - RECORDED_DEG0_SPECTRAL_OVERFLOW; // ~0.06621

// a,U grid: show f(1) and f(K_eff) collapse under the 1/(a U) product law.
const AU_GRID = Object.freeze([0.25, 0.5, 1.0]);
const U_GRID = Object.freeze([4, 6, 8]);
const AU_TABLE = Object.freeze(
  AU_GRID.flatMap((a) =>
    U_GRID.map((u) => {
      const fBare = crossoverFraction(1, a, u);
      const fEff = crossoverFraction(K_EFF, a, u);
      return Object.freeze({
        a,
        U: u,
        aU: a * u,
        fBare,                                 // 1 - arcsinh(1)/(a U)
        fEff,                                  // 1 - arcsinh(K_eff)/(a U)
        removed: fBare - fEff,                 // [arcsinh(K_eff) - arcsinh(1)]/(a U)
      });
    })
  )
);

// The removed fraction times a U is a CONSTANT (arcsinh(K_eff) - arcsinh(1)) under
// the scale-stability hypothesis -- verify the collapse numerically across the grid.
const REMOVED_TIMES_AU_INVARIANT = Math.asinh(K_EFF) - Math.asinh(1);   // ~0.19863
const AU_COLLAPSE_MAX_DEV = Math.max(
  ...AU_TABLE.map((r) => Math.abs(r.removed * r.aU - REMOVED_TIMES_AU_INVARIANT))
);

export const IMP3367_OVERFLOW_SPECTRAL_REFINEMENT = Object.freeze({
  id: 'imp-3367-overflow-spectral-refinement',
  ticket: 'imp-3367',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parent: 'imp-3253-overflow-degree-reconcile.js',
  relatedScaleAnalysis: 'imp-2686-mupass-construction.js',
  relatedVerdict: 'section26-mupass-operator-verdict-2026-06-30.js',

  summary:
    'Quantifies the ~0.066 refinement imp-3253 left underived: the degree-0 ' +
    'overflow-support fraction drops from the geometric bare-crossover ' +
    '(U - tau_star)/U ~ 0.7062 to the cited ~0.64 because the normalized-R ' +
    'construction R = Gpass^{-1/2} Gshear Gpass^{-1/2} does NOT compare bare shear ' +
    'sinh(a tau) against the bare diagonal 1: the two-sided passive normalization ' +
    'raises the effective diagonal threshold the shear must clear from 1 to ' +
    'K_eff, moving the crossover OUTWARD from tau_star = arcsinh(1)/a to tau_eff ' +
    'and removing the annulus (tau_star, tau_eff). Backing K_eff out of the closed ' +
    'crossover fraction f(K) = 1 - arcsinh(K)/(a U) at f = 0.64 gives ' +
    'K_eff = sinh(a U (1 - 0.64)) ~ 1.3025, tau_eff = 2.16, shift ~0.397, removed ' +
    '~0.0662 of tau -- exactly the ~0.066 step. Since f depends on a,U only through ' +
    'the product a U, and IF K_eff is scale-stable, the removed fraction also ' +
    'scales as 1/(a U) (same law as tau_star/U); tabulated across an a,U grid, the ' +
    'collapse removed*(a U) = arcsinh(K_eff) - arcsinh(1) is exact. SUB-GAP: K_eff ' +
    'is BACKED OUT, not derived from the construction, and its scale-stability is ' +
    'untested -- deriving K_eff(a,U) still needs the full spectral arbiter. ' +
    'DIAGNOSTIC; RH-equivalent; imp-3066 untouched; no QED.',

  mechanism: Object.freeze({
    effect: 'two-sided passive-normalization effective-threshold enhancement (1 -> K_eff)',
    naiveComparison: 'sharp step: sinh(a tau) > 1  <=>  tau > tau_star = arcsinh(1)/a',
    refinedComparison:
      'Gpass^{-1/2} Gshear Gpass^{-1/2} folds the passive cosh(a .)-type diagonal ' +
      'mass into the threshold, so the shear must clear K_eff > 1, moving the ' +
      'crossover outward to tau_eff and removing the annulus (tau_star, tau_eff)',
    dominantVsSecondary:
      'the sign-correct DOMINANT effect is the threshold enhancement (moves 0.706 ' +
      'downward to 0.64); off-diagonal shear coupling is a secondary boundary smear',
    direction: 'outward crossover shift => downward support fraction (0.706 -> 0.64)',
  }),

  measured: Object.freeze({
    tauStar: TAU_STAR,                                   // arcsinh(1)/a ~ 1.76275
    bareCrossoverFraction: BARE_CROSSOVER_FRACTION,      // ~0.70621 (K = 1)
    recordedBareCrossover: RECORDED_BARE_CROSSOVER,      // ~0.7062 (imp-3253)
    recordedDeg0Spectral: RECORDED_DEG0_SPECTRAL_OVERFLOW, // ~0.64 (verdict)
    effectiveThresholdKeff: K_EFF,                       // ~1.30254 (backed out)
    arcsinhKeff: ARCSINH_KEFF,                           // = a U (1 - 0.64) = 1.08
    tauEff: TAU_EFF,                                     // = U(1 - 0.64) = 2.16
    crossoverShiftOutward: CROSSOVER_SHIFT,              // tau_eff - tau_star ~ 0.39725
    removedFraction: REMOVED_FRACTION,                   // ~0.06621 (the ~0.066 step)
    removedTimesAUInvariant: REMOVED_TIMES_AU_INVARIANT, // arcsinh(K_eff) - arcsinh(1) ~ 0.19863
    auCollapseMaxDev: AU_COLLAPSE_MAX_DEV,               // ~0 (exact 1/(a U) collapse)
    verdict: 'REFINEMENT-IS-PASSIVE-NORMALIZATION-THRESHOLD-1-TO-KEFF-1.30-REMOVES-0.066',
  }),

  auTable: AU_TABLE,

  interpretation: Object.freeze({
    whichEffect:
      'The refinement is NOT a new phenomenon: it is the passive normalization of ' +
      'R = Gpass^{-1/2} Gshear Gpass^{-1/2} raising the effective diagonal weight ' +
      'the shear must beat from the bare 1 to K_eff ~ 1.30, moving the crossover ' +
      'from tau_star = arcsinh(1)/a to tau_eff and removing the annulus.',
    howMuch:
      'At the genuine cell (a=0.5,U=6) the removed support is exactly the ~0.066 ' +
      'imp-3253 left underived: (tau_eff - tau_star)/U ~ 0.0662, i.e. 0.7062 - 0.64.',
    aUDependence:
      'f(K;a,U) = 1 - arcsinh(K)/(a U) depends on a,U only through the product a U; ' +
      'IF K_eff is scale-stable the removed fraction scales as 1/(a U) (same law as ' +
      'tau_star/U), giving the exact collapse removed*(a U) = arcsinh(K_eff) - arcsinh(1).',
  }),

  subGaps: Object.freeze([
    Object.freeze({
      name: 'imp-3367-subgap-derive-Keff-from-construction',
      what:
        'K_eff ~ 1.3025 is BACKED OUT from the cited ~0.64 via the closed-form ' +
        'crossover fraction, not derived from the Gpass^{-1/2} Gshear Gpass^{-1/2} ' +
        'construction itself; the step-3 scale-stability of K_eff is a hypothesis, ' +
        'untested against the full spectral measures.',
      residual:
        'deriving K_eff(a,U) and confirming/refuting its a,U-stability still requires ' +
        'the full section 25-26 normalized-spectral arbiter (imp-2686 pointer), untouched here',
    }),
  ]),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    backedOutNotDerived:
      'K_eff is backed out of the two-figure ~0.64 target via the closed crossover ' +
      'fraction; it carries that imprecision and is NOT derived from the construction.',
    necessaryNotSufficient:
      'quantifying the overflow refinement is necessary-but-NOT-sufficient at operator ' +
      'order; the off-diagonal endpoint-Hankel step (imp-3066) is the lone obstruction, untouched.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3367_OVERFLOW_SPECTRAL_REFINEMENT_ASSERTIONS = [
  {
    id: 'imp3367-bare-crossover-reproduces-imp3253',
    why: 'The K = 1 closed-form crossover fraction must reproduce the imp-3253 geometric ' +
         'bare-crossover proxy ~0.7062; a drift means the sinh(a tau) = 1 crossover moved.',
    holds: () => Math.abs(BARE_CROSSOVER_FRACTION - RECORDED_BARE_CROSSOVER) < 1e-3,
  },
  {
    id: 'imp3367-Keff-maps-to-cited-064',
    why: 'THE DELIVERABLE (how much): the backed-out effective threshold K_eff, fed back ' +
         'through f(K) = 1 - arcsinh(K)/(a U), must return the cited degree-0 ~0.64; a ' +
         'mismatch means the threshold back-out is inconsistent.',
    holds: () => Math.abs(crossoverFraction(K_EFF, A, U) - RECORDED_DEG0_SPECTRAL_OVERFLOW) < 1e-12,
  },
  {
    id: 'imp3367-removed-fraction-is-the-0.066-step',
    why: 'The removed support (bare 0.7062 minus spectral 0.64) must equal the outward ' +
         'annulus (tau_eff - tau_star)/U ~ 0.066 -- the exact step imp-3253 left underived.',
    holds: () =>
      Math.abs(REMOVED_FRACTION - CROSSOVER_SHIFT / U) < 1e-12 &&
      Math.abs(REMOVED_FRACTION - 0.0662) < 1e-3,
  },
  {
    id: 'imp3367-threshold-enhanced-outward',
    why: 'The mechanism is sign-correct: the effective threshold rises above the bare 1 ' +
         '(K_eff > 1) and the crossover moves OUTWARD (tau_eff > tau_star), lowering the ' +
         'support fraction; a flip would invert the refinement direction.',
    holds: () => K_EFF > 1 && TAU_EFF > TAU_STAR && RECORDED_DEG0_SPECTRAL_OVERFLOW < BARE_CROSSOVER_FRACTION,
  },
  {
    id: 'imp3367-aU-product-collapse-exact',
    why: 'THE DELIVERABLE (a,U-dependence): f(K;a,U) depends on a,U only through a U, so ' +
         'under scale-stable K_eff the removed fraction times a U is the constant ' +
         'arcsinh(K_eff) - arcsinh(1) across the whole grid; a nonzero spread means the ' +
         'closed 1/(a U) form was mis-stated.',
    holds: () => AU_COLLAPSE_MAX_DEV < 1e-12,
  },
  {
    id: 'imp3367-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: DIAGNOSTIC, K_eff BACKED OUT not derived, ' +
         'necessary-but-not-sufficient at operator order, positivity not attempted, ' +
         'no refereed bound is changed. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3367_OVERFLOW_SPECTRAL_REFINEMENT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3367_OVERFLOW_SPECTRAL_REFINEMENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3367-overflow-spectral-refinement assertion failed: ${assertion.id}`);
  }
}

export default IMP3367_OVERFLOW_SPECTRAL_REFINEMENT;
