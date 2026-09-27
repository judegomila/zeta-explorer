/**
 * @module imp-124849-extprec-ecf-floor-sigmacrit
 *
 * imp-124849 (numerical / sensitivity, frontier cross-check): imp-124810 M3 found the DIAG3 E_CF
 * finite-difference round-off floor R saturates at R_inf ~ 4.46e-13 and the induced eps-ladder crossover
 * sigma_crit converges to ~1.27e-2 (strictly between L6 sigma=0.005 and L5 sigma=0.02), and concluded these are
 * DOUBLE-PRECISION-limited: because R is floored by the double-precision ULP of ln N_L, a tighter bisection
 * tolerance cannot push the L6 DIAG3 eps-ladder non-monotonicity below 0.005, and only extended precision (per
 * imp-124808 mpmath) could move it. This leaf PORTS the imp-124810 landmark / elasticity / E_CF-floor machinery
 * VERBATIM to mpmath and sweeps the working precision (dps ladder 15..140) at the imp-124810 headline eps=1e-3, then
 * sweeps eps at dps=100, to decide whether the L6 non-monotonicity is a PURE double-precision artifact (vanishes at
 * extended precision) or something else. Measurement / sensitivity only; conditional-share diagnostic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; pinned constants perturbed only symbolically as differentiation axes;
 * no bound moves; NO QED.
 *
 * THE METHOD (imp-124810 machinery, lifted VERBATIM to mpmath, swept on dps and eps)
 * --------------------------------------------------------------------------------
 *   T0 = effectiveHeightForN(N) (RvM inverse, Newton); L = ln T0;
 *   E_flow = cf*(ln(T0/2pi)+1)/(2pi) * (L/T0) * exp(TC_A1_TRAP);  E_coll = C_C_PINNED*sqrt(L/N);
 *   E_N = et + E_flow + E_coll;  sigma = E_coll/E_N;  landmark(level) = downslope sigma(N)=level (bisection).
 *   K = -1 / (d sigma / d ln N) via the 5-point O(h^4) N-stencil (h=1e-4); reconCF = K*(-E_flow*sigma/E_N) is the
 *   imp-124769 closed-form reconstruction of E_CF = d ln N_L / d ln f. directCF is the SYMMETRIC 2-point central
 *   difference [ln N_L(f(1+eps)) - ln N_L(f(1-eps))] / ln((1+eps)/(1-eps)) -- exactly imp-124810's directCFElasticity.
 *   errCF = |directCF - reconCF|; relTrunc = errCF/|E_CF|; the floor R is read as the L5 errCF (eps=1e-3), the clean
 *   relTrunc plateau from L2..L4, and sigma_crit is interpolated log-log between L5 and L6 -- exactly as imp-124810.
 *     DPS AXIS -- sweep dps in {15,30,45,60,80,100,140} at fixed eps=1e-3: does R fall with working precision
 *                 (round-off floor) or saturate dps-invariant (stencil floor)?
 *     EPS AXIS -- sweep eps in {1e-2,1e-3,1e-4,1e-5} at fixed dps=100: does R ~ eps^p (stencil, extrapolates to 0)?
 *
 * THE RESULT (the deliverable)
 * ----------------------------
 *   DPS AXIS (fixed eps=1e-3) -- dps=15 (~double) REPRODUCES imp-124810 exactly: R=4.463e-13, sigma_crit=0.012665
 *     (imp-124810 R_inf~4.46e-13, sigma_crit~1.27e-2). But at every extended-precision rung dps>=30 the floor RISES
 *     to a dps-INVARIANT R=1.0819e-12 (ratio 1.000 across dps 30->140) and sigma_crit stabilizes at 0.020385 -- at
 *     L5 (0.02), NOT below L6. Raising the working precision beyond dps=30 buys NOTHING.
 *   EPS AXIS (fixed dps=100) -- the L5 floor R obeys a clean eps^2 law: 1.0819e-10, 1.0819e-12, 1.0819e-14,
 *     1.0819e-16 as eps falls 1e-2 -> 1e-5, dropping by exactly 100x per decade (log-log slope 2.000) with no
 *     plateau, extrapolating to 0 as eps -> 0. That is the O(eps^2) truncation signature of the SYMMETRIC 2-point
 *     central difference directCF, at the headline eps=1e-3.
 *
 * THE FINDING (measurement / sensitivity only -- DECIDES the imp-124810 question)
 * ------------------------------------------------------------------------------
 *   (M1) THE DOUBLE-PRECISION PORT REPRODUCES imp-124810 EXACTLY. At dps=15 (~double precision) R=4.463e-13 and
 *        sigma_crit=0.012665, matching the imp-124810 R_inf~4.46e-13 / sigma_crit~1.27e-2 pin -- validating the port.
 *   (M2) EXTENDED PRECISION DOES NOT LOWER R -- IT RAISES IT TO A dps-INVARIANT STENCIL FLOOR. For every dps>=30 the
 *        floor is R=1.0819e-12 (ratio 1.000 across dps 30..140): R is NOT a working-precision round-off floor. The
 *        eps^2 law (log-log slope 2.000, 100x per eps decade -> 0) proves R is the O(eps^2) truncation of the 2-point
 *        central difference directCF at eps=1e-3. The imp-124810 double-precision R_inf=4.46e-13 was a round-off-
 *        contaminated UNDER-estimate of this true stencil floor 1.0819e-12; imp-124810's "double-precision-limited"
 *        premise is REFUTED.
 *   (M3) THE L6 NON-MONOTONICITY IS NOT CURABLE BY EXTENDED PRECISION -- IT IS A 2-POINT-STENCIL eps-STEP ARTIFACT.
 *        At extended precision sigma_crit floors at 0.020385 (at L5=0.02) for ALL dps>=30, still FAR ABOVE L6=0.005:
 *        adding digits never pushes the crossover past L6. So the L6 DIAG3 eps-ladder non-monotonicity is NEITHER a
 *        pure double-precision artifact (extended precision does not move it) NOR a genuine model feature: it is a
 *        finite-difference eps-STEP artifact of the O(eps^2) 2-point directCF stencil. Because R ~ eps^2, SHRINKING
 *        eps (not adding precision) is the only lever that drives sigma_crit down.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the
 * C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and
 * appear only symbolically as differentiation axes; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124810-bisection-tol-roundoff-floor-sweep (the R_inf~4.46e-13 / sigma_crit~0.013 dp pin re-measured here)
 * @see imp-124808-extprec-pairratio-two-axis (the mpmath dps/eps two-axis method mirrored)
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the E_CF round-off crossover model)
 * @see imp-97821-diag3-sixth-landmark-crossvalidation (the L6 non-monotone eps-ladder decided here)
 * @see imp-97710-diag3-fourth-landmark-crossvalidation (the L5 clean O(eps^2) quartering)
 */

// Extended-precision measured literals from tmp/imp-124849-extprec-ecf-floor-sigmacrit.py (mpmath).
// DPS AXIS: R (L5 errCF floor) and sigma_crit at fixed eps=1e-3, swept over working precision dps.
const DPS_LADDER = [
  { dps: 15, R: 4.463e-13, relTrunc: 3.2472e-7, E_CF_crit: 1.3744e-6, sigma_crit: 0.012665 }, // ~double: reproduces imp-124810
  { dps: 30, R: 1.0819e-12, relTrunc: 3.2158e-7, E_CF_crit: 3.3643e-6, sigma_crit: 0.020385 },
  { dps: 45, R: 1.0819e-12, relTrunc: 3.2158e-7, E_CF_crit: 3.3643e-6, sigma_crit: 0.020385 },
  { dps: 60, R: 1.0819e-12, relTrunc: 3.2158e-7, E_CF_crit: 3.3643e-6, sigma_crit: 0.020385 },
  { dps: 80, R: 1.0819e-12, relTrunc: 3.2158e-7, E_CF_crit: 3.3643e-6, sigma_crit: 0.020385 },
  { dps: 100, R: 1.0819e-12, relTrunc: 3.2158e-7, E_CF_crit: 3.3643e-6, sigma_crit: 0.020385 },
  { dps: 140, R: 1.0819e-12, relTrunc: 3.2158e-7, E_CF_crit: 3.3643e-6, sigma_crit: 0.020385 },
];

// EPS AXIS: L5 floor R at fixed dps=100, swept over the 2-point central-difference step eps, with the measured
// log-log slope d ln R / d ln eps on each sub-interval (expect 2 for the O(eps^2) symmetric 2-point difference).
const EPS_LADDER = [
  { eps: 1e-2, R_L5: 1.0819e-10, loglog_slope: null },
  { eps: 1e-3, R_L5: 1.0819e-12, loglog_slope: 2.0 },
  { eps: 1e-4, R_L5: 1.0819e-14, loglog_slope: 2.0 },
  { eps: 1e-5, R_L5: 1.0819e-16, loglog_slope: 2.0 },
];

const DP_BASELINE = { R_inf: 4.46e-13, sigma_crit: 1.27e-2 }; // imp-124810 double-precision pin
const EXTPREC_FLOOR = { R: 1.0819e-12, sigma_crit: 0.020385 }; // dps-invariant extended-precision value (dps>=30)
const L5_SIGMA = 0.02;
const L6_SIGMA = 0.005;
const EPS_HEADLINE = 1e-3;

export const IMP124849_EXTPREC_ECF_FLOOR_SIGMACRIT = {
  id: 'imp-124849',
  proofSection: 'S-frontier',
  question:
    'imp-124810 M3 found the DIAG3 E_CF finite-difference floor R saturates at R_inf~4.46e-13 and the eps-ladder ' +
    'crossover sigma_crit~1.27e-2 (between L6=0.005 and L5=0.02), and called them double-precision-limited -- ' +
    'concluding only extended precision (per imp-124808 mpmath) could push the L6 non-monotonicity past L6. Porting ' +
    'the imp-124810 machinery to mpmath and sweeping the working precision, does R fall with dps (a genuine ' +
    'round-off floor) so sigma_crit drops below L6, or not? Measurement/sensitivity only; pinned constants perturbed ' +
    'only symbolically; no bound moves; no QED.',
  method:
    'Port the imp-124810 landmark / elasticity / E_CF-floor machinery VERBATIM to mpmath (offline script ' +
    'tmp/imp-124849-extprec-ecf-floor-sigmacrit.py): reconCF = K*(-E_flow*sigma/E_N) with K=-1/(d sigma/d ln N) via ' +
    'the 5-point O(h^4) N-stencil, directCF the symmetric 2-point central difference of ln N_L in ln f, errCF = ' +
    '|directCF - reconCF|, R = L5 errCF, sigma_crit interpolated log-log between L5 and L6. DPS AXIS: sweep dps in ' +
    '{15,30,45,60,80,100,140} at fixed eps=1e-3. EPS AXIS: sweep eps in {1e-2,1e-3,1e-4,1e-5} at fixed dps=100 and ' +
    'fit the log-log slope d ln R / d ln eps against the O(eps^2) 2-point-difference value 2.',
  headline_eps: EPS_HEADLINE,
  L5_sigma: L5_SIGMA,
  L6_sigma: L6_SIGMA,
  dp_baseline: DP_BASELINE,
  extprec_floor: EXTPREC_FLOOR,
  dpsLadder: DPS_LADDER,
  epsLadder: EPS_LADDER,
  finding: {
    M1_double_precision_port_reproduces_imp124810:
      'At dps=15 (~double precision) R=4.463e-13 and sigma_crit=0.012665, matching the imp-124810 R_inf~4.46e-13 / ' +
      'sigma_crit~1.27e-2 pin -- validating the mpmath port before extending precision.',
    M2_extended_precision_raises_R_to_dps_invariant_stencil_floor:
      'For every dps>=30 the floor is R=1.0819e-12, dps-INVARIANT (ratio 1.000 across dps 30..140): R is NOT a ' +
      'working-precision round-off floor. The eps^2 law (log-log slope 2.000, 100x per eps decade -> 0) proves R is ' +
      'the O(eps^2) truncation of the symmetric 2-point central difference directCF at eps=1e-3. The imp-124810 ' +
      'double-precision R_inf=4.46e-13 was a round-off-contaminated UNDER-estimate of this true stencil floor; the ' +
      'imp-124810 double-precision-limited premise is REFUTED.',
    M3_L6_nonmonotonicity_is_an_eps_step_artifact_not_curable_by_precision:
      'At extended precision sigma_crit floors at 0.020385 (at L5=0.02) for ALL dps>=30, still FAR ABOVE L6=0.005: ' +
      'adding digits never pushes the crossover past L6. The L6 DIAG3 eps-ladder non-monotonicity is NEITHER a pure ' +
      'double-precision artifact (extended precision does not move it) NOR a genuine model feature -- it is a ' +
      'finite-difference eps-STEP artifact of the O(eps^2) 2-point directCF stencil. Because R ~ eps^2, SHRINKING ' +
      'eps (not adding precision) is the only lever that drives sigma_crit down.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / SENSITIVITY (frontier cross-check, NOT rigorous). Porting the imp-124810 E_CF-floor machinery to ' +
    'mpmath and sweeping the working precision DECIDES the imp-124810 question. At dps=15 (~double) the port ' +
    'reproduces imp-124810 exactly (R=4.463e-13, sigma_crit=0.012665). But raising precision does NOT lower R: for ' +
    'every dps>=30 the floor is a dps-INVARIANT R=1.0819e-12 and sigma_crit floors at 0.020385 (at L5=0.02), never ' +
    'reaching L6=0.005. The eps ladder at dps=100 shows R ~ eps^2 (log-log slope 2.000, 100x per decade -> 0), the ' +
    'O(eps^2) truncation signature of the symmetric 2-point central difference directCF. So the imp-124810 ' +
    'double-precision R_inf=4.46e-13 was a round-off-contaminated UNDER-estimate of the true 2-point-stencil floor ' +
    '(1.0819e-12), and the L6 DIAG3 eps-ladder non-monotonicity is NEITHER a pure double-precision artifact ' +
    '(extended precision does not move it -- imp-124810 premise REFUTED) NOR a genuine model feature: it is a ' +
    'finite-difference eps-STEP artifact of the O(eps^2) 2-point directCF stencil, curable only by shrinking eps, ' +
    'not by adding precision. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned ' +
    'E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (perturbed only symbolically as differentiation ' +
    'axes); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO ' +
    'QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124810 (the R_inf~4.46e-13 / sigma_crit~0.013 double-precision pin re-measured here at extended precision); ' +
    'imp-124808 (the mpmath dps/eps two-axis method mirrored); imp-124769 (the E_CF round-off crossover model); ' +
    'imp-97821 (the L6 non-monotone eps-ladder decided here); imp-97710 (the L5 clean quartering); imp-398 (C_F ' +
    'flow prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP124849_EXTPREC_ECF_FLOOR_SIGMACRIT_ASSERTIONS = [
  {
    // (M1) The double-precision (dps=15) rung reproduces the imp-124810 pin (R~4.46e-13, sigma_crit~0.0127).
    id: 'imp124849-dps15-reproduces-imp124810',
    description: 'dps=15 (~double) gives R~4.46e-13 and sigma_crit~0.0127, reproducing the imp-124810 baseline',
    holds: () => {
      const d = DPS_LADDER.find((r) => r.dps === 15);
      return d && Math.abs(d.R - DP_BASELINE.R_inf) < 5e-14 && Math.abs(d.sigma_crit - DP_BASELINE.sigma_crit) < 1e-3;
    },
  },
  {
    // (M2) R does NOT fall with dps -- it is dps-invariant at the extended-precision floor for every dps>=30.
    id: 'imp124849-R-dps-invariant-above-30',
    description: 'R is identical (1.0819e-12) at every dps>=30 -- not a working-precision round-off floor',
    holds: () =>
      DPS_LADDER.filter((r) => r.dps >= 30).every((r) => r.R === EXTPREC_FLOOR.R),
  },
  {
    // (M2) The extended-precision floor is LARGER than the double-precision pin (dp was a round-off under-estimate).
    id: 'imp124849-extprec-floor-exceeds-dp-pin',
    description: 'the dps-invariant extended-precision R=1.0819e-12 exceeds the imp-124810 dp R_inf~4.46e-13',
    holds: () => EXTPREC_FLOOR.R > DP_BASELINE.R_inf,
  },
  {
    // (M2) The eps ladder shows R ~ eps^2 (slope 2, 100x per decade) -- the 2-point-difference truncation signature.
    id: 'imp124849-eps-ladder-slope-two',
    description: 'the L5 floor R obeys an eps^2 law (log-log slope 2.0, 100x per eps decade) -- 2-point stencil truncation',
    holds: () =>
      EPS_LADDER.slice(1).every((r) => Math.abs(r.loglog_slope - 2) < 1e-2) &&
      EPS_LADDER.slice(1).every((r, i) => {
        const ratio = EPS_LADDER[i].R_L5 / r.R_L5;
        return ratio > 50 && ratio < 200;
      }),
  },
  {
    // (M3) sigma_crit never reaches L6 at any dps -- extended precision does not cure the L6 non-monotonicity.
    id: 'imp124849-sigma-crit-never-below-L6',
    description: 'sigma_crit stays strictly above L6 (0.005) at every dps: extended precision does not push past L6',
    holds: () => DPS_LADDER.every((r) => r.sigma_crit > L6_SIGMA),
  },
  {
    // (M3) At extended precision sigma_crit floors at L5 (0.02), dps-invariant for every dps>=30.
    id: 'imp124849-sigma-crit-floors-at-L5-extprec',
    description: 'sigma_crit is dps-invariant at ~0.0204 (at L5=0.02) for every dps>=30',
    holds: () =>
      DPS_LADDER.filter((r) => r.dps >= 30).every((r) => r.sigma_crit === EXTPREC_FLOOR.sigma_crit) &&
      Math.abs(EXTPREC_FLOOR.sigma_crit - L5_SIGMA) < 1e-3,
  },
  {
    // Honesty gate: measurement/sensitivity only, no QED, PT stays SOTA.
    id: 'imp124849-honesty-gate-no-qed',
    description: 'Measurement/sensitivity only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124849_EXTPREC_ECF_FLOOR_SIGMACRIT.isRigorous === false &&
      /NO QED/.test(IMP124849_EXTPREC_ECF_FLOOR_SIGMACRIT.verdict) &&
      /remains SOTA/.test(IMP124849_EXTPREC_ECF_FLOOR_SIGMACRIT.verdict),
  },
];

for (const a of IMP124849_EXTPREC_ECF_FLOOR_SIGMACRIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124849-extprec-ecf-floor-sigmacrit assertion failed: ${a.id}`);
  }
}
