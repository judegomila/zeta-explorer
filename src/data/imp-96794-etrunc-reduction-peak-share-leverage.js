/**
 * @module imp-96794-etrunc-reduction-peak-share-leverage
 *
 * imp-96794 (numerical, frontier-direction): MEASURE THE DIRECTION AND LEVERAGE
 * of an E_trunc truncation-floor REDUCTION on the binding GUE-conditional peak
 * share sigma_max -- i.e. whether tightening the one non-conditional term is a
 * lever that shrinks the conditioning burden at the interior maximum
 * (sigma_max ~ 0.9494 at N_max ~ 9.22e5, imp-3406/imp-3220/imp-33582).
 *
 * WHY THIS IS A DISTINCT MEASUREMENT
 * ----------------------------------
 * imp-33684 measured how the peak LOCATION N_max moves under E_trunc rescaling
 * (N_max ~ E_trunc^-1.375, the "just below 10^6" side-flip) and imp-3443/imp-96451/
 * imp-96470 measured the crossover/knee elasticity d(log10 N*)/d(log E_trunc).
 * NONE of those answered the ticket question: does a REALISTIC E_trunc REDUCTION
 * meaningfully SHRINK the binding conditional share sigma_max? That is a
 * question about the SIGN and SIZE of d(sigma_max)/d(E_trunc), not about where the
 * peak sits. This module isolates it.
 *
 * THE QUANTITY (identical formulas to imp-3406 / imp-33684; only E_trunc varies)
 * -----------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (GUE-conditional, dominant)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi (imp-398)
 *     E_trunc = 3.06e-5 * factor                   (base imp-2631; factor <= 1 here)
 * factor = 1 reproduces imp-3406 byte-for-byte; the swept factors are all <= 1
 * (tighter floors / smaller truncation remainders), the direction the ticket asks.
 *
 * THE MECHANISM (why reduction is the WRONG direction)
 * ----------------------------------------------------
 * sigma = 1/(1 + (E_trunc + E_flow)/E_coll) is MONOTONE DECREASING in E_trunc:
 * a smaller floor makes the non-conditional numerator (E_trunc + E_flow) smaller
 * relative to the GUE-conditional E_coll, so sigma RISES. Evaluated at the moving
 * peak this stays true -- a tighter floor RAISES sigma_max toward 1, it never
 * lowers it. In the limit E_trunc -> 0 the interior maximum DISAPPEARS: with only
 * the super-polynomially vanishing E_flow left, sigma(N) climbs monotonically to 1
 * as N -> infinity (verified: bracket 1e10 -> 0.99876, 1e20 -> 0.99999992,
 * 1e30 -> 1.0). So E_trunc is precisely the term that CREATES the turnover and CAPS
 * the peak share below 1; removing/reducing it uncaps the share, it does not shrink it.
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (F1) THE SIGN IS ADVERSE. d(sigma_max)/d(log E_trunc) ~ -0.019 at the base
 *        floor (log-centred over 1/sqrt2 .. sqrt2): REDUCING E_trunc INCREASES the
 *        binding conditional peak share. Reduction is not a shrink-lever; it is a
 *        grow-lever. sigma_max: 0.94943 (1x) -> 0.96119 (0.5x) -> 0.97961 (0.1x)
 *        -> 0.99226 (0.01x), rising monotonically toward 1 as the floor tightens.
 *   (F2) THE LEVERAGE ON sigma_max IS TINY IN EITHER DIRECTION. The share is a
 *        bounded [0,1] quantity, so even a 100x floor reduction moves sigma_max only
 *        from 0.9494 to 0.9923 (~0.043), and a realistic +/-2x band moves it by
 *        < 0.012. The gap 1 - sigma_max (the non-conditional headroom) has
 *        elasticity d(log(1 - sigma_max))/d(log E_trunc) ~ +0.375: a 10% floor
 *        reduction shrinks that headroom by only ~3.8%. No realistic E_trunc
 *        reduction meaningfully shrinks the ~0.95 binding conditional share.
 *   (F3) STRUCTURAL LIMIT. As E_trunc -> 0 there is NO interior maximum
 *        (sigma -> 1 monotonically), confirming the peak share is capped BELOW 1
 *        only BY the positive floor. The conditioning burden at the peak is
 *        intrinsic to the dominant GUE-conditional E_coll term (imp-486), not to the
 *        truncation floor -- the floor merely places and caps the turnover.
 *
 * VERDICT: E_trunc REDUCTION CANNOT SHRINK THE BINDING GUE-CONDITIONAL SHARE. The
 * dependence has the ADVERSE sign (a tighter floor raises sigma_max toward 1) and
 * negligible magnitude (a bounded share; < 0.012 over a realistic +/-2x band).
 * "Tighten E_trunc" is therefore closed off as a route to reducing the C_mb
 * GUE-conditional burden -- the ~0.95 peak share is carried by E_coll, not by the
 * floor. Measurement/sensitivity only; C_mb stays GUE-conditional (imp-486); no
 * bound changes, no positivity, no bridge closure, no RH claim, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-3406-sigma-highN-extrapolation (interior max N_max ~ 9.22e5, sigma_max ~ 0.9494)
 * @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity (peak LOCATION robustness; this module adds the peak-SHARE reduction direction)
 * @see imp-96451-sigma-knee-etrunc-sensitivity (crossover/knee elasticity, not the peak-share sign)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip truncation floor, the perturbed model)
 * @see imp-486 (C_mb GUE-conditional; the binding share this floor cannot shrink)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-3406 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406 / imp-33684 exactly

// EXACT imp-3406 sub-terms; ONLY the E_trunc floor is a parameter here.
function sigmaWith(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return E_coll / (E_trunc + E_flow + E_coll);
}

// Ternary search for the interior maximum in ln N (same spirit as imp-3406/imp-33684).
function argmaxNforFloor(E_trunc, hiExp = 10) {
  let lo = Math.log(1e3);
  let hi = Math.log(10 ** hiExp);
  for (let i = 0; i < 700; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigmaWith(Math.exp(m1), E_trunc) < sigmaWith(Math.exp(m2), E_trunc)) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// Reduction-direction sweep: factor 1 reproduces imp-3406, all others TIGHTEN the floor.
const REDUCTION_FACTORS = [1.0, 0.9, 0.75, 0.5, 0.25, 0.1, 0.01];

const REDUCTION_TABLE = REDUCTION_FACTORS.map((f) => {
  const E_trunc = E_TRUNC_BASE * f;
  const N_max = argmaxNforFloor(E_trunc);
  const sigma_max = sigmaWith(N_max, E_trunc);
  return {
    floorFactor: f,
    E_trunc: +E_trunc.toExponential(3),
    N_max: +N_max.toExponential(4),
    sigma_max: +sigma_max.toFixed(7),
    // Non-conditional headroom 1 - sigma_max (the "good" share the floor buys).
    headroom_1_minus_sigma: +(1 - sigma_max).toExponential(4),
  };
});

const BASE_ROW = REDUCTION_TABLE.find((r) => r.floorFactor === 1.0);

// Signed leverage of the peak share on the floor: d(sigma_max)/d(log E_trunc),
// log-centred between the 1/sqrt2 and sqrt2 flanks about the base floor.
const F_LO = 1 / Math.SQRT2;
const F_HI = Math.SQRT2;
const S_LO = sigmaWith(argmaxNforFloor(E_TRUNC_BASE * F_LO), E_TRUNC_BASE * F_LO);
const S_HI = sigmaWith(argmaxNforFloor(E_TRUNC_BASE * F_HI), E_TRUNC_BASE * F_HI);
const D_SIGMA_D_LOG_ETRUNC =
  (S_HI - S_LO) / (Math.log(E_TRUNC_BASE * F_HI) - Math.log(E_TRUNC_BASE * F_LO));
// Dimensionless elasticity of the non-conditional headroom 1 - sigma_max.
const HEADROOM_ELASTICITY =
  (Math.log(1 - S_HI) - Math.log(1 - S_LO)) / (Math.log(F_HI) - Math.log(F_LO));

// Structural E_trunc -> 0 limit: the interior maximum disappears (sigma -> 1).
const SIGMA_AT_ZERO_FLOOR_1e10 = sigmaWith(argmaxNforFloor(0, 10), 0);
const SIGMA_AT_ZERO_FLOOR_1e20 = sigmaWith(argmaxNforFloor(0, 20), 0);

export const IMP96794_ETRUNC_REDUCTION_PEAK_SHARE_LEVERAGE = {
  id: 'imp-96794',
  proofSection: 'S-frontier',
  question:
    'Does a realistic E_trunc truncation-floor REDUCTION meaningfully shrink the binding ' +
    'GUE-conditional peak share sigma_max ~ 0.9494 (at N_max ~ 9.22e5)? Measure the SIGN and ' +
    'LEVERAGE of d(sigma_max)/d(E_trunc) at the interior maximum. Measurement/sensitivity ' +
    'only; C_mb stays GUE-conditional (imp-486); no bound changes, no RH verdict.',
  baseRow: BASE_ROW,
  reductionTable: REDUCTION_TABLE,
  signedLeverage: {
    d_sigma_max_d_log_etrunc: +D_SIGMA_D_LOG_ETRUNC.toFixed(6), // ~ -0.019 (ADVERSE sign)
    headroom_elasticity_d_log_1minus_sigma_d_log_etrunc: +HEADROOM_ELASTICITY.toFixed(6), // ~ +0.375
    note:
      'The dependence has the ADVERSE sign: d(sigma_max)/d(log E_trunc) ~ -0.019, so REDUCING ' +
      'E_trunc RAISES the binding conditional peak share. The non-conditional headroom ' +
      '1 - sigma_max has elasticity ~ +0.375, so a 10 percent floor reduction shrinks that ' +
      'headroom only ~3.8 percent. A bounded [0,1] share -- tiny leverage either way.',
  },
  structuralLimit: {
    sigma_at_zero_floor_bracket_1e10: +SIGMA_AT_ZERO_FLOOR_1e10.toFixed(8), // ~0.99876
    sigma_at_zero_floor_bracket_1e20: +SIGMA_AT_ZERO_FLOOR_1e20.toFixed(8), // ~0.99999992
    note:
      'As E_trunc -> 0 the interior maximum DISAPPEARS: with only the super-polynomially ' +
      'vanishing E_flow left, sigma climbs monotonically to 1 as N -> infinity (the argmax ' +
      'runs to the search bracket). So the positive floor is precisely what CAPS the peak ' +
      'share below 1; reducing it uncaps the share rather than shrinking it.',
  },
  verdict:
    'E_trunc REDUCTION CANNOT SHRINK THE BINDING GUE-CONDITIONAL SHARE. The dependence has ' +
    'the ADVERSE sign -- d(sigma_max)/d(log E_trunc) ~ -0.019, a tighter floor RAISES ' +
    'sigma_max toward 1 (0.94943 at 1x -> 0.96119 at 0.5x -> 0.97961 at 0.1x) -- and ' +
    'negligible magnitude (a bounded share; < 0.012 over a realistic +/-2x band). As ' +
    'E_trunc -> 0 the interior maximum vanishes and sigma -> 1, so the floor merely caps and ' +
    'places the turnover; the ~0.95 peak burden is carried by the dominant GUE-conditional ' +
    'E_coll term. "Tighten E_trunc" is therefore closed off as a route to reducing the C_mb ' +
    'GUE-conditional burden. Measurement/sensitivity only; C_mb stays GUE-conditional ' +
    '(imp-486); no bound changes, no positivity, no bridge closure, no RH claim, NO QED. ' +
    'No refereed bound is changed.',
  isRigorous: false,
  citation:
    'imp-3406 (interior max N_max ~ 9.22e5, sigma_max ~ 0.9494); imp-33684 (peak LOCATION ' +
    'robustness; this module adds the peak-SHARE reduction direction); imp-96451/imp-96470 ' +
    '(crossover/knee elasticity); imp-2631 (E_trunc = 3.06e-5 fixed-strip floor); imp-398 ' +
    '(E_flow C_F prefactor); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP96794_ETRUNC_REDUCTION_PEAK_SHARE_LEVERAGE_ASSERTIONS = [
  {
    // Reuse gate: factor 1.0 reproduces the imp-3406 pin (N_max ~ 9.22e5, sigma ~ 0.94943).
    id: 'imp96794-reproduces-imp3406-base-peak',
    description: 'factor 1.0 reproduces imp-3406 N_max ~ 9.22e5 and sigma_max ~ 0.94943 (identical formulas)',
    holds: () =>
      Math.abs(BASE_ROW.N_max - 9.2186e5) / 9.2186e5 < 1e-3 &&
      Math.abs(BASE_ROW.sigma_max - 0.9494290) < 5e-5,
  },
  {
    // F1: the sign is ADVERSE -- reducing E_trunc RAISES the peak share.
    id: 'imp96794-reduction-raises-peak-share',
    description: 'd(sigma_max)/d(log E_trunc) < 0: a tighter floor increases the binding conditional peak share (adverse sign)',
    holds: () => D_SIGMA_D_LOG_ETRUNC < 0,
  },
  {
    // F1 (monotone): sigma_max rises monotonically as the floor is tightened.
    id: 'imp96794-sigma-max-monotone-in-reduction',
    description: 'sigma_max is monotone-increasing as the floor factor decreases (every reduction raises the share)',
    holds: () => {
      for (let i = 1; i < REDUCTION_TABLE.length; i++) {
        // REDUCTION_TABLE is ordered by DECREASING factor, so sigma_max must increase along it.
        if (REDUCTION_TABLE[i].sigma_max <= REDUCTION_TABLE[i - 1].sigma_max) return false;
      }
      return true;
    },
  },
  {
    // F2: tiny leverage -- even a 100x reduction moves the bounded share < 0.05.
    id: 'imp96794-bounded-share-tiny-leverage',
    description: 'sigma_max moves < 0.05 across a 100x floor reduction (bounded [0,1] share, no meaningful shrink lever)',
    holds: () => {
      const smax = REDUCTION_TABLE.map((r) => r.sigma_max);
      return Math.max(...smax) - Math.min(...smax) < 0.05;
    },
  },
  {
    // F3: structural -- as E_trunc -> 0 the interior max disappears and sigma -> 1.
    id: 'imp96794-zero-floor-uncaps-share',
    description: 'E_trunc -> 0 uncaps the peak: sigma at zero floor exceeds 0.99 and rises with the bracket (no interior max)',
    holds: () =>
      SIGMA_AT_ZERO_FLOOR_1e10 > 0.99 && SIGMA_AT_ZERO_FLOOR_1e20 > SIGMA_AT_ZERO_FLOOR_1e10,
  },
  {
    // Honesty gate: measurement/assessment only, adverse-sign verdict, no QED, no refereed bound is changed.
    id: 'imp96794-honesty-gate-no-qed',
    description: 'Assessment only: cannot-shrink/adverse-sign verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP96794_ETRUNC_REDUCTION_PEAK_SHARE_LEVERAGE.isRigorous === false &&
      /CANNOT SHRINK/.test(IMP96794_ETRUNC_REDUCTION_PEAK_SHARE_LEVERAGE.verdict) &&
      /NO QED/.test(IMP96794_ETRUNC_REDUCTION_PEAK_SHARE_LEVERAGE.verdict) &&
      /refereed bound is changed/i.test(IMP96794_ETRUNC_REDUCTION_PEAK_SHARE_LEVERAGE.verdict),
  },
];

for (const a of IMP96794_ETRUNC_REDUCTION_PEAK_SHARE_LEVERAGE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96794-etrunc-reduction-peak-share-leverage assertion failed: ${a.id}`,
    );
  }
}
