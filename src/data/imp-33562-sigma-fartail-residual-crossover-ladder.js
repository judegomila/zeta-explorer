/**
 * @module imp-33562-sigma-fartail-residual-crossover-ladder
 *
 * imp-33562 (numerical, frontier-direction): the imp-33291 far-tail sigma law and the imp-3444
 * crossover ladder both treat N_cross ~ 3.28e9 (E_coll = E_trunc) as the regime where the drop-
 * E_flow far-tail form is exact, and imp-33540 builds its closed-form overshoot decomposition on
 * that premise. imp-33540 measured the far-tail-vs-full residual OFF-regime, at the imp-3406
 * interior max (N ~ 9.22e5, 3.55 decades BELOW the crossover), finding a ~3.0e-2 overshoot there.
 * It never measured the residual AT the crossover, where the premise says it should be near-zero.
 * This module fills that hole: it evaluates the full and far-tail sigma on a reference-N ladder
 * BRACKETING N_cross and reports the far-tail-vs-full residual there, to check that the drop-E_flow
 * far-tail form is genuinely near-exact at the crossover as imp-33540/imp-3444 assume.
 *
 * THE QUANTITY (identical sub-terms to imp-3406 / imp-33291 / imp-33315 / imp-33540)
 * ---------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),   (full three-term share)
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 * The far-tail law DROPS E_flow:  sigma_ft = E_coll / (E_trunc + E_coll).
 * The far-tail-vs-full residual is exactly the imp-33540 closed-form product
 *     OS(N) = sigma_ft - sigma_full = sigma_ft * sigma_full * (E_flow / E_coll) >= 0,
 * so its size at any N is set by the single ratio E_flow / E_coll.
 *
 * THE LADDER (bracketing N_cross ~ 3.28e9, three decades either side)
 * ------------------------------------------------------------------
 *     N          T0         sigma_full   sigma_ft     OS = residual   E_flow/E_coll
 *     1.0e8      4.27e7     0.835378     0.840165     4.787e-3        6.820e-3
 *     3.0e8      1.20e8     0.754803     0.757434     2.631e-3        4.602e-3
 *     1.0e9      3.72e8     0.636702     0.637904     1.203e-3        2.961e-3
 *     3.28e9     1.14e9     0.499526     0.500000     4.744e-4        1.899e-3   <- N_cross
 *     1.0e10     3.29e9     0.369742     0.369912     1.700e-4        1.243e-3
 *     3.0e10     9.37e9     0.257522     0.257576     5.394e-5        8.131e-4
 *     1.0e11     2.95e10    0.162971     0.162985     1.348e-5        5.075e-4
 *     1.0e12     2.68e11    0.060440     0.060441     7.399e-7        2.025e-4
 * At the crossover E_coll = E_trunc so sigma_ft = E_coll/(2 E_coll) = 1/2 EXACTLY (a clean
 * landmark). The residual OS is MONOTONE-DECREASING in N across the whole ladder -- the far-tail
 * form is not just near-exact AT the crossover, it keeps tightening above it, because
 * E_flow/E_coll = sqrt(log T0) * sqrt(N) / T0 (up to Gronwall) falls as T0 outgrows sqrt(N).
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) THE FAR-TAIL FORM IS NEAR-EXACT AT THE CROSSOVER. At N_cross ~ 3.28e9 the far-tail-vs-full
 *        residual is OS ~ 4.74e-4 absolute (relative OS/sigma_full ~ 9.50e-4, i.e. ~0.095%), set by
 *        E_flow/E_coll ~ 1.90e-3. The drop-E_flow far-tail form the imp-33540/imp-3444 premise
 *        relies on IS genuinely near-exact at the crossover -- the premise checks out.
 *   (F2) IT IS ~63x TIGHTER THAN THE OFF-REGIME OVERSHOOT. The imp-33540 ~3.0e-2 overshoot at the
 *        imp-3406 interior max (N ~ 9.22e5) is ~63x the crossover residual; the far-tail form is
 *        good WHERE the law is built for it (the crossover) and degrades only when dragged the
 *        3.55 decades DOWN to the pre-crossover peak, exactly as imp-33540 reported.
 *   (F3) THE RESIDUAL IS MONOTONE-DECREASING THROUGH THE CROSSOVER. Across the full 1e8..1e12
 *        ladder OS falls monotonically (4.79e-3 -> 7.40e-7), tracking E_flow/E_coll; there is no
 *        local minimum or sign change at the crossover -- the far-tail form only improves at and
 *        above N_cross. The closed-form product identity holds to the arithmetic floor
 *        (|OS - OS_closed| < 1e-15) at every rung.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. C_C is GUE-conditional per
 * imp-486; extrapolation past the 10^6 empirical ceiling is a projection not a measurement
 * (imp-3406); changes no bound; imp-3066 K_a >= 0 untouched; no positivity, no bridge closure,
 * no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-33540-sigma-fartail-overshoot-two-power-decomposition (measured OS off-regime at the interior max)
 * @see imp-33291-sigma-fartail-two-parameter-lnN-lnlogT0-fit (the (-1/2, +1/2) joint power pair)
 * @see imp-33315-sigma-fartail-law-vs-interior-max-reconciliation (the ~3.0e-2 interior-max overshoot)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX N ~ 9.22e5, sigma_max ~ 0.9494)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33291/imp-33540)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33291/imp-33315/imp-33540 exactly

// EXACT imp-3406 / imp-33291 / imp-33540 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // super-poly negligible on the far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H) two-power form
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

const sigmaFull = (N) => parts(N).sigma;
const sigmaFarTail = (N) => {
  const p = parts(N);
  return p.E_coll / (E_TRUNC_PT + p.E_coll);
};

// Reproduce the imp-3444 crossover (E_coll = E_trunc) with the identical bisection as imp-33540.
function ecollEqualsEtrunc() {
  let a = Math.log(1e6);
  let b = Math.log(1e12);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).E_coll > E_TRUNC_PT) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_CROSS = ecollEqualsEtrunc(); // ~3.280e9 (reproduces imp-3444)

// The reference-N ladder bracketing N_cross (three decades either side), with N_cross inserted.
const LADDER_N = [1e8, 3e8, 1e9, N_CROSS, 1e10, 3e10, 1e11, 1e12];

const ladder = LADDER_N.map((N) => {
  const p = parts(N);
  const s_full = p.sigma;
  const s_ft = p.E_coll / (E_TRUNC_PT + p.E_coll);
  const os = s_ft - s_full; // far-tail-vs-full residual
  const os_closed = s_ft * s_full * (p.E_flow / p.E_coll); // imp-33540 closed-form product
  return {
    N: +N.toExponential(4),
    T0: +p.T0.toExponential(4),
    sigma_full: +s_full.toFixed(9),
    sigma_ft: +s_ft.toFixed(9),
    residual: +os.toExponential(4),
    residual_relative: +(os / s_full).toExponential(4),
    E_flow_over_E_coll: +(p.E_flow / p.E_coll).toExponential(4),
    identity_gap: +Math.abs(os - os_closed).toExponential(3),
    isCrossover: Math.abs(N / N_CROSS - 1) < 1e-6,
  };
});

// The crossover rung and its comparison to the imp-33540 off-regime overshoot at the interior max.
const CROSS_ROW = ladder.find((r) => r.isCrossover);
const OS_AT_CROSS = CROSS_ROW.residual; // ~4.744e-4
const OS_REL_AT_CROSS = CROSS_ROW.residual_relative; // ~9.50e-4
const SIGMA_FT_AT_CROSS = CROSS_ROW.sigma_ft; // 0.5 exactly (E_coll = E_trunc)
const OS_INTERIOR_MAX = 2.996e-2; // imp-33540 / imp-33315 overshoot at N ~ 9.22e5 (interior max)
const TIGHTER_FACTOR = +(OS_INTERIOR_MAX / OS_AT_CROSS).toFixed(2); // ~63x
const MAX_IDENTITY_GAP = Math.max(...ladder.map((r) => r.identity_gap)); // < 1e-15
// Monotone-decreasing residual across the whole ladder (no local min / sign change at the crossover).
let RESIDUAL_MONOTONE_DECREASING = true;
for (let i = 1; i < ladder.length; i++) {
  if (!(ladder[i].residual < ladder[i - 1].residual)) RESIDUAL_MONOTONE_DECREASING = false;
}

export const IMP33562_SIGMA_FARTAIL_RESIDUAL_CROSSOVER_LADDER = {
  id: 'imp-33562',
  proofSection: 'S-frontier',
  question:
    'Evaluate the full sigma = E_coll/(E_trunc+E_flow+E_coll) and the drop-E_flow far-tail form ' +
    'sigma_ft = E_coll/(E_trunc+E_coll) on a reference-N ladder bracketing the imp-3444 crossover ' +
    'N_cross ~ 3.28e9, and report the far-tail-vs-full residual there to check that the far-tail ' +
    'form is genuinely near-exact at the crossover as the imp-33540/imp-3444 premise assumes. ' +
    'Measurement only; C_C GUE-conditional per imp-486; no new bound; no QED.',
  N_cross: +N_CROSS.toExponential(6), // ~3.280294e9 (reproduces imp-3444)
  ladder,
  crossover: {
    N_cross: +N_CROSS.toExponential(6),
    sigma_ft_at_cross: SIGMA_FT_AT_CROSS, // 0.5 EXACTLY (E_coll = E_trunc)
    residual_at_cross: OS_AT_CROSS, // ~4.744e-4 (absolute)
    residual_relative_at_cross: OS_REL_AT_CROSS, // ~9.50e-4 (~0.095%)
    E_flow_over_E_coll_at_cross: CROSS_ROW.E_flow_over_E_coll, // ~1.899e-3
    overshoot_at_interior_max: OS_INTERIOR_MAX, // ~3.0e-2 (imp-33540, N ~ 9.22e5, off-regime)
    crossover_tighter_than_interior_max_by: TIGHTER_FACTOR, // ~63x
  },
  maxIdentityGap: +MAX_IDENTITY_GAP.toExponential(3), // < 1e-15 (closed-form product holds at every rung)
  residualMonotoneDecreasing: RESIDUAL_MONOTONE_DECREASING, // true (no local min / sign change)
  finding: {
    F1_fartail_near_exact_at_crossover:
      'At N_cross ~ 3.28e9 the far-tail-vs-full residual is OS ~ 4.74e-4 absolute (relative ~9.50e-4, ' +
      'i.e. ~0.095%), set by E_flow/E_coll ~ 1.90e-3. The drop-E_flow far-tail form the ' +
      'imp-33540/imp-3444 premise relies on IS genuinely near-exact at the crossover; sigma_ft = 1/2 ' +
      'exactly there since E_coll = E_trunc.',
    F2_63x_tighter_than_off_regime_overshoot:
      'The imp-33540 ~3.0e-2 overshoot at the imp-3406 interior max (N ~ 9.22e5) is ~63x the ' +
      'crossover residual: the far-tail form is good WHERE the law is built for it (the crossover) ' +
      'and degrades only when dragged the 3.55 decades DOWN to the pre-crossover peak.',
    F3_residual_monotone_decreasing_through_crossover:
      'Across the full 1e8..1e12 ladder OS falls monotonically (4.79e-3 -> 7.40e-7), tracking ' +
      'E_flow/E_coll = sqrt(log T0) sqrt(N)/T0; there is no local minimum or sign change at the ' +
      'crossover, so the far-tail form only improves at and above N_cross. The closed-form product ' +
      'OS = sigma_ft*sigma_full*(E_flow/E_coll) holds to the arithmetic floor (< 1e-15) at every rung.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Evaluating the full and drop-E_flow ' +
    'far-tail sigma on a reference-N ladder bracketing the imp-3444 crossover N_cross ~ 3.28e9, the ' +
    'far-tail-vs-full residual at the crossover is OS ~ 4.74e-4 absolute (relative ~9.50e-4, ~0.095%), ' +
    'set by E_flow/E_coll ~ 1.90e-3, with sigma_ft = 1/2 exactly there (E_coll = E_trunc). This is ' +
    '~63x tighter than the imp-33540 ~3.0e-2 overshoot at the imp-3406 interior max (N ~ 9.22e5, ' +
    '3.55 decades below), and the residual is monotone-decreasing through the crossover (no local ' +
    'min or sign change), so the drop-E_flow far-tail form IS genuinely near-exact at the crossover ' +
    'as the imp-33540/imp-3444 decomposition assumes -- the premise checks out. The closed-form ' +
    'product OS = sigma_ft*sigma_full*(E_flow/E_coll) holds to < 1e-15 at every rung. C_C is ' +
    'GUE-conditional per imp-486; extrapolation past the 10^6 empirical ceiling is a projection ' +
    '(imp-3406); changes no bound; imp-3066 K_a >= 0 untouched; no positivity, no bridge closure, ' +
    'no RH claim, NO QED. No refereed bound is changed.',
  citation:
    'imp-33540 (far-tail overshoot measured off-regime at the interior max); imp-33291 ((-1/2, +1/2) ' +
    'joint power law); imp-33315 (~3.0e-2 interior-max overshoot); imp-3406 (interior MAX N ~ 9.22e5); ' +
    'imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9); imp-486 (C_C GUE-conditional); imp-398 ' +
    '(E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping.',
};

export const IMP33562_SIGMA_FARTAIL_RESIDUAL_CROSSOVER_LADDER_ASSERTIONS = [
  {
    // Reuse gate: the crossover reproduces imp-3444 (N_cross ~ 3.28e9) and sigma_ft = 1/2 there,
    // proving the identical imp-3406 / imp-33291 / imp-33540 sub-term formulas are in use.
    id: 'imp33562-reproduces-imp3444-crossover-sigmaft-half',
    description: 'N_cross ~ 3.28e9 (imp-3444) reproduced and sigma_ft = 1/2 exactly there',
    holds: () =>
      Math.abs(N_CROSS / 3.280294e9 - 1) < 1e-3 &&
      Math.abs(SIGMA_FT_AT_CROSS - 0.5) < 1e-9,
  },
  {
    // (F1): the far-tail form is near-exact at the crossover -- residual small in both absolute
    // and relative terms, set by the E_flow/E_coll ratio.
    id: 'imp33562-fartail-near-exact-at-crossover',
    description: 'crossover residual OS ~ 4.7e-4 absolute (~9.5e-4 relative), E_flow/E_coll ~ 1.9e-3',
    holds: () =>
      OS_AT_CROSS > 0 && OS_AT_CROSS < 1e-3 &&
      OS_REL_AT_CROSS > 0 && OS_REL_AT_CROSS < 2e-3 &&
      CROSS_ROW.E_flow_over_E_coll > 1e-3 && CROSS_ROW.E_flow_over_E_coll < 3e-3,
  },
  {
    // (F2): the crossover residual is ~63x tighter than the imp-33540 off-regime interior-max overshoot.
    id: 'imp33562-crossover-63x-tighter-than-interior-max',
    description: 'imp-33540 ~3.0e-2 interior-max overshoot is ~63x the crossover residual',
    holds: () => TIGHTER_FACTOR > 40 && TIGHTER_FACTOR < 90,
  },
  {
    // (F3): the residual is monotone-decreasing across the whole ladder (no local min / sign change
    // at the crossover) and the closed-form product identity holds to the arithmetic floor.
    id: 'imp33562-residual-monotone-and-closed-form-exact',
    description: 'OS monotone-decreasing through the crossover; OS = sigma_ft*sigma_full*(E_flow/E_coll) to < 1e-15',
    holds: () =>
      RESIDUAL_MONOTONE_DECREASING === true &&
      ladder.length === 8 &&
      MAX_IDENTITY_GAP < 1e-15,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp33562-honesty-gate-no-qed',
    description: 'Measurement only: no QED, no refereed bound is changed',
    holds: () =>
      IMP33562_SIGMA_FARTAIL_RESIDUAL_CROSSOVER_LADDER.isRigorous === false &&
      /NO QED/.test(IMP33562_SIGMA_FARTAIL_RESIDUAL_CROSSOVER_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP33562_SIGMA_FARTAIL_RESIDUAL_CROSSOVER_LADDER.verdict),
  },
];

for (const a of IMP33562_SIGMA_FARTAIL_RESIDUAL_CROSSOVER_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33562-sigma-fartail-residual-crossover-ladder assertion failed: ${a.id}`);
  }
}
