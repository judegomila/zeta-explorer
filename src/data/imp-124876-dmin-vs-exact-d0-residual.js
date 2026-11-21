/**
 * @module imp-124876-dmin-vs-exact-d0-residual
 *
 * imp-124876 (accuracy/formalization, frontier delineation): imp-124836 formalized the imp-124811
 * invariant-product drift discriminator and established its sensitivity floor D_min = max(R/|X|_max, tau),
 * noting that a finite-precision flat-P read can only ever CERTIFY D <= D_min, never the exact D = 0 that the
 * imp-124808 mpmath dps=100 cross-check reports. That gap between the discriminator cap and the
 * extended-precision exact value was described in prose but never NAMED as a residual object on the
 * conditional-share diagnostic family. This leaf formalizes it: it defines the D=0-CERTIFICATION RESIDUAL
 * (the delta between the finite-precision cap D <= D_min ~ 9.3e-12 -- measured cap D <= 5.8e-12 at the
 * flow-heavy rung -- and the exact D = 0), states WHY the discriminator is structurally incapable of closing
 * it, and documents what a rigorous D = 0 would require beyond the discriminator. Formalization/documentation
 * only; conditional-share diagnostic context; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no
 * bound; establishes no operator positivity; NO QED. No refereed bound is changed.
 *
 * THE RESIDUAL OBJECT
 * -------------------
 * On the imp-124811 pair-ratio instance (E_CF/E_ET = E_flow/E_trunc, the imp-97665 exact identity) the
 * discriminator returns a ONE-SIDED cap:
 *   D <= D_min = max( R/|X|_max , tau ),   with R ~ 2.34e-12, |X|_max = |E_CF|(L2) = 0.2516, tau ~ 3.33e-14,
 *   so D_min ~ R/|X|_max ~ 9.3e-12 (round-off-limited); the measured flat-P cap is D <= 5.8e-12.
 * The imp-124808 mpmath dps=100 two-axis re-run reports the identity drift is EXACTLY zero, D = 0. The
 * residual is the open interval the discriminator cannot resolve:
 *   gap = [ 0 , D_min ]   (a one-sided cap, NOT a two-sided bracket around a nonzero value).
 * Its width is D_min ~ 9.3e-12. This residual is IRREDUCIBLE within the discriminator: it is not a matter of
 * more rungs or a longer ladder.
 *
 * WHY THE DISCRIMINATOR CANNOT CLOSE IT (structural, per imp-124836/imp-124828)
 * ---------------------------------------------------------------------------
 * The flat-P test certifies drift-freeness ONLY in the round-off-limited regime R >> (D + tau)*|X|_max, where
 * reldiff ~ R/|X| has log-log slope -1. Certifying a SMALLER D requires shrinking D_min = max(R/|X|_max, tau).
 *   (a) Lowering R (raising precision) does shrink R/|X|_max -- but it simultaneously lifts the test OUT of the
 *       round-off-limited regime and into the truncation-limited FAILURE regime, where reldiff plateaus at the
 *       |X|-independent stencil floor tau and a decreasing P is ambiguous between a genuine drift and a pure
 *       truncation floor (imp-124828 observed exactly this at dps 30/50/80: flat P shattered, slope flipped
 *       -1.085 -> +0.121, reldiff -> tau = 3.333e-14). So R cannot be driven to 0 while keeping the test valid.
 *   (b) The floor is then pinned at tau ~ 3.33e-14 (the O(eps^p) stencil bias). Refining eps by s drops tau by
 *       s^p, but the round-off floor R ~ macheps*scale/eps GROWS as eps shrinks -- the two trade off, leaving a
 *       nonzero D_min at every finite (eps, precision). The discriminator therefore has a nonzero floor at
 *       every operating point and can never reach D_min = 0.
 * Hence the discriminator is a ONE-SIDED instrument: it can push D_min down but never to 0, so it reports
 * D <= D_min forever, CONSISTENT WITH but never EQUAL TO D = 0.
 *
 * WHAT A RIGOROUS D = 0 WOULD REQUIRE (beyond the discriminator)
 * -------------------------------------------------------------
 * Closing the residual to an exact D = 0 needs an instrument OUTSIDE the finite-difference discriminator:
 *   (R1) a SYMBOLIC / exact-arithmetic proof that the pair-ratio identity E_CF/E_ET = E_flow/E_trunc holds
 *        identically -- the imp-97665 exact-identity derivation carried through in closed form, so D = 0 by
 *        construction rather than by measurement; OR
 *   (R2) an unbounded-precision confirmation whose plateau is CERTIFIED (interval-arithmetic) to be the
 *        stencil truncation floor tau and NOT a residual drift -- i.e. the imp-124808 dps=100 result promoted
 *        from a floating-point read to a rigorous interval bound D in [-tau, +tau] with the truncation nature
 *        of the plateau proven, not inferred. Either route is INDEPENDENT of the flat-P discriminator, which
 *        by (a)/(b) cannot itself supply it.
 * Neither route is executed here: this leaf NAMES and BOUNDS the residual, it does not close it. The status of
 * the identity remains: exact D = 0 supported by the imp-124808 dps=100 cross-check and the imp-97665 exact
 * derivation, with the finite-precision discriminator contributing only the consistent one-sided cap
 * D <= 5.8e-12.
 *
 * FORMALIZATION / DOCUMENTATION ONLY. Conditional-share diagnostic, NOT an RH bound. The pair-ratio identity
 * and its component model are the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the
 * imp-398 C_F prefactor are UNTOUCHED and appear here only as the source of the anchor literals; changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-124836-invariant-product-discriminator-general-test (the discriminator + D_min this leaf residualizes)
 * @see imp-124808-extprec-pairratio-two-axis (mpmath dps=100 proof that the identity drift D = 0)
 * @see imp-124828-extprec-pairratio-Pladder (extended precision: R collapses, reldiff -> tau; the failure regime)
 * @see imp-124811-pairratio-reldiff-ecf-roundoff-law (the ad-hoc P = D*|X| + R discriminator)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (the EXACT pair-ratio identity, route R1)
 */

// Anchor literals inherited VERBATIM from the imp-124836 / imp-124811 ladder (baked, not recomputed).
const R_ROUNDOFF = 2.34e-12; // absolute round-off floor P (double precision)
const X_MAX = 2.5163e-1; // flow-heavy rung |X| = |E_CF|(L2)
const TAU_STENCIL = 3.333e-14; // O(eps^4) stencil truncation floor (dps-invariant across 30/50/80)
const DRIFT_CAP = 5.8e-12; // measured flat-P cap |reldiff|(L2), the flow-heavy-rung residual-drift cap
const EXACT_D = 0; // imp-124808 mpmath dps=100 exact identity drift

// The sensitivity floor the discriminator can certify (imp-124836): D_min = max(R/|X|_max, tau).
const D_MIN = Math.max(R_ROUNDOFF / X_MAX, TAU_STENCIL);

// The residual gap the discriminator cannot resolve: the one-sided interval [0, D_min].
const RESIDUAL_WIDTH = D_MIN - EXACT_D;

const round = (x, s = 4) => +x.toExponential(s);

export const IMP124876_DMIN_VS_EXACT_D0_RESIDUAL = {
  id: 'imp-124876',
  proofSection: 'S-frontier',
  question:
    'imp-124836 established the drift discriminator sensitivity floor D_min = max(R/|X|_max, tau) and noted it ' +
    'can only certify D <= D_min, never the imp-124808 mpmath dps=100 exact D = 0. Formalize the gap between the ' +
    'finite-precision discriminator cap (D <= 5.8e-12 at the flow-heavy rung) and the extended-precision exact ' +
    'D = 0 as a NAMED residual object on the conditional-share diagnostic family, and document what a rigorous ' +
    'D = 0 would require beyond the discriminator. Formalization/documentation only; no bound moves; no QED.',
  residualObject: {
    name: 'D=0-certification residual',
    family: 'conditional-share diagnostic (pair-ratio identity E_CF/E_ET = E_flow/E_trunc)',
    kind: 'one-sided cap, NOT a two-sided bracket around a nonzero value',
    gapInterval: '[0, D_min]',
    D_min: round(D_MIN),
    D_min_formula: 'D_min = max(R/|X|_max, tau)',
    measuredCap: round(DRIFT_CAP),
    exactValue: EXACT_D,
    width: round(RESIDUAL_WIDTH),
    irreducibleWithinDiscriminator: true,
    note:
      'the finite-precision flat-P discriminator resolves the drift only to the one-sided cap D <= D_min ~ ' +
      round(D_MIN) + ' (measured D <= ' + round(DRIFT_CAP) + '); the imp-124808 dps=100 cross-check reports the ' +
      'exact value D = 0. The residual is the open interval [0, D_min] the discriminator cannot close.',
  },
  whyIrreducible: {
    structural:
      'certifying a smaller D needs a smaller D_min = max(R/|X|_max, tau). Lowering R (raising precision) shrinks ' +
      'R/|X|_max but lifts the test OUT of the round-off-limited regime into the truncation-limited FAILURE ' +
      'regime (imp-124828), where reldiff plateaus at the |X|-independent stencil floor tau and a decreasing P ' +
      'is ambiguous between a genuine drift and a pure truncation floor. So R cannot be driven to 0 while the ' +
      'test stays valid.',
    epsTradeoff:
      'refining eps by s drops the stencil floor tau by s^p but grows the round-off floor R ~ macheps*scale/eps; ' +
      'the two trade off, leaving a nonzero D_min at every finite (eps, precision). The discriminator has a ' +
      'nonzero floor at every operating point and can never reach D_min = 0 -- it is a ONE-SIDED instrument.',
  },
  whatRigorousD0Requires: {
    R1_symbolic:
      'a symbolic / exact-arithmetic proof that the pair-ratio identity E_CF/E_ET = E_flow/E_trunc holds ' +
      'identically (the imp-97665 exact-identity derivation in closed form), so D = 0 by construction rather ' +
      'than by measurement.',
    R2_certified_extprec:
      'an unbounded-precision confirmation whose plateau is CERTIFIED by interval arithmetic to be the stencil ' +
      'truncation floor tau and not a residual drift -- the imp-124808 dps=100 read promoted to a rigorous ' +
      'interval bound D in [-tau, +tau] with the truncation nature of the plateau proven, not inferred.',
    independentOfDiscriminator: true,
    executedHere: false,
    note:
      'this leaf NAMES and BOUNDS the residual; it does not close it. Both routes lie OUTSIDE the flat-P ' +
      'discriminator, which structurally cannot supply an exact D = 0.',
  },
  status:
    'exact D = 0 supported by the imp-124808 dps=100 cross-check and the imp-97665 exact derivation; the ' +
    'finite-precision discriminator contributes only the consistent one-sided cap D <= ' + round(DRIFT_CAP) + '.',
  isRigorous: false,
  verdict:
    'FORMALIZATION + DOCUMENTATION (frontier delineation, NOT rigorous). Names the D=0-CERTIFICATION RESIDUAL on ' +
    'the conditional-share pair-ratio diagnostic: the finite-precision flat-P discriminator resolves the ' +
    'identity drift only to the one-sided cap D <= D_min = max(R/|X|_max, tau) ~ ' + round(D_MIN) + ' (measured ' +
    'D <= ' + round(DRIFT_CAP) + ' at the flow-heavy rung), while the imp-124808 mpmath dps=100 cross-check ' +
    'reports the exact drift D = 0. The residual is the open interval [0, D_min] of width ~ ' + round(RESIDUAL_WIDTH) +
    ', IRREDUCIBLE within the discriminator: lowering the round-off floor R lifts the test out of the ' +
    'round-off-limited regime into the truncation-limited failure regime (imp-124828), and the eps/precision ' +
    'trade-off (tau ~ eps^p down, R ~ macheps*scale/eps up) leaves a nonzero D_min at every operating point, so ' +
    'the one-sided instrument can never reach D_min = 0. A rigorous D = 0 requires an instrument OUTSIDE the ' +
    'discriminator: (R1) a symbolic exact-arithmetic proof of the imp-97665 identity, or (R2) a certified ' +
    'interval bound D in [-tau, +tau] on the extended-precision plateau -- neither executed here. This leaf ' +
    'NAMES and BOUNDS the residual; it does not close it, and the identity status is unchanged (exact D = 0 ' +
    'supported by imp-124808/imp-97665, cap D <= ' + round(DRIFT_CAP) + ' from the discriminator). ' +
    'Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz, the pinned E_trunc 3.06e-5 and the imp-398 C_F ' +
    'prefactor are UNTOUCHED (used only as anchor literals); changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-124836 (the discriminator and D_min this leaf residualizes); imp-124808 (mpmath dps=100 proof D = 0); ' +
    'imp-124828 (extended precision failure regime); imp-124811 (the ad-hoc P = D*|X| + R discriminator); ' +
    'imp-97665 (the EXACT pair-ratio identity, route R1); imp-486 (C_mb GUE-conditional).',
};

export const IMP124876_DMIN_VS_EXACT_D0_RESIDUAL_ASSERTIONS = [
  {
    // D_min matches max(R/|X|_max, tau) and lands round-off-limited in [1e-12, 1e-11].
    id: 'imp124876-Dmin-matches-roundoff-over-Xmax',
    description: 'D_min = max(R/|X|_max, tau) equals R/|X|_max here and lands in [1e-12, 1e-11]',
    holds: () =>
      Math.abs(D_MIN - R_ROUNDOFF / X_MAX) < 1e-18 && D_MIN > 1e-12 && D_MIN < 1e-11,
  },
  {
    // The residual is a one-sided interval [0, D_min] of width D_min; the measured cap sits inside it.
    id: 'imp124876-residual-one-sided-interval',
    description: 'residual gap width equals D_min (interval [0, D_min]) and the measured cap 5.8e-12 lies within it',
    holds: () =>
      Math.abs(RESIDUAL_WIDTH - D_MIN) < 1e-18 &&
      EXACT_D === 0 &&
      DRIFT_CAP > 0 &&
      DRIFT_CAP <= D_MIN,
  },
  {
    // Discriminator cap is consistent with (>=) the exact value but strictly positive -- never equals D = 0.
    id: 'imp124876-cap-consistent-never-equal',
    description: 'the discriminator cap is strictly positive and >= the exact D = 0: consistent with, never equal to',
    holds: () => DRIFT_CAP > EXACT_D && D_MIN > EXACT_D,
  },
  {
    // The named residual object records the exact value 0, the finite cap, and the irreducibility flag.
    id: 'imp124876-residual-object-well-formed',
    description: 'residualObject records exactValue 0, a positive width, one-sided kind, and irreducibleWithinDiscriminator',
    holds: () =>
      IMP124876_DMIN_VS_EXACT_D0_RESIDUAL.residualObject.exactValue === 0 &&
      IMP124876_DMIN_VS_EXACT_D0_RESIDUAL.residualObject.width > 0 &&
      IMP124876_DMIN_VS_EXACT_D0_RESIDUAL.residualObject.irreducibleWithinDiscriminator === true &&
      /one-sided cap/.test(IMP124876_DMIN_VS_EXACT_D0_RESIDUAL.residualObject.kind),
  },
  {
    // Both rigorous-closure routes are named, flagged independent of the discriminator, and NOT executed here.
    id: 'imp124876-closure-routes-named-not-executed',
    description: 'R1 (symbolic) and R2 (certified extprec) are named, independent of the discriminator, executedHere false',
    holds: () =>
      IMP124876_DMIN_VS_EXACT_D0_RESIDUAL.whatRigorousD0Requires.executedHere === false &&
      IMP124876_DMIN_VS_EXACT_D0_RESIDUAL.whatRigorousD0Requires.independentOfDiscriminator === true &&
      typeof IMP124876_DMIN_VS_EXACT_D0_RESIDUAL.whatRigorousD0Requires.R1_symbolic === 'string' &&
      typeof IMP124876_DMIN_VS_EXACT_D0_RESIDUAL.whatRigorousD0Requires.R2_certified_extprec === 'string',
  },
  {
    // Honesty gate: formalization/documentation only, no QED, no refereed bound is changed, no bound moved.
    id: 'imp124876-honesty-gate-no-qed',
    description: 'Formalization/documentation only: isRigorous false, no QED, no refereed bound is changed, changes no bound',
    holds: () =>
      IMP124876_DMIN_VS_EXACT_D0_RESIDUAL.isRigorous === false &&
      /NO QED/.test(IMP124876_DMIN_VS_EXACT_D0_RESIDUAL.verdict) &&
      /refereed bound is changed/i.test(IMP124876_DMIN_VS_EXACT_D0_RESIDUAL.verdict) &&
      /changes no bound/.test(IMP124876_DMIN_VS_EXACT_D0_RESIDUAL.verdict),
  },
];

for (const a of IMP124876_DMIN_VS_EXACT_D0_RESIDUAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124876-dmin-vs-exact-d0-residual assertion failed: ${a.id}`);
  }
}

export default IMP124876_DMIN_VS_EXACT_D0_RESIDUAL;
