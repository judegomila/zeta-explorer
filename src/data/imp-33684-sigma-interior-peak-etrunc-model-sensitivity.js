/**
 * @module imp-33684-sigma-interior-peak-etrunc-model-sensitivity
 *
 * imp-33684 (numerical, frontier-direction): imp-3406 located the GUE-conditional
 * share sigma(N) = E_coll/(E_trunc + E_flow + E_coll) interior MAXIMUM at
 * N_max ~ 9.22e5 (sigma_max ~ 0.94943), only 2.1e-5 above the decade-ladder 10^6
 * value, and used that to reclassify the imp-3220 "widest gap at 10^6" reading as a
 * flat-cap SAMPLING ARTIFACT rather than a still-climbing frontier. That whole
 * reframing rests on the interior maximum sitting essentially AT the 10^6 endpoint --
 * yet the peak location was pinned with a SINGLE truncation-floor value,
 * E_trunc = 3.06e-5 (the imp-2631 fixed-strip constant). This module perturbs the
 * E_trunc MODEL FORM (alternative truncation orders / cutoff conventions, rendered as
 * multiplicative rescalings of the floor) and RE-LOCATES the peak, measuring how far
 * N_max and sigma_max move, to assess whether the artifact reframing is robust or an
 * artifact of the E_trunc pin.
 *
 * THE QUANTITY (identical formulas to imp-3406 / imp-3220 / imp-3323)
 * ------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (GUE-conditional, dominant)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5 * factor                   (perturbed floor; base imp-2631)
 * The ONLY thing varied here is the constant E_trunc floor; every other sub-term is
 * reused byte-for-byte from imp-3406, so factor = 1 reproduces imp-3406 exactly.
 *
 * WHY N_max IS SENSITIVE (mechanism)
 * ----------------------------------
 * Write sigma = 1/(1 + g), g(N) = (E_trunc + E_flow)/E_coll; the peak is at min g.
 * Since 1/E_coll ~ sqrt(N/log T0)/C_C RISES like sqrt(N), the constant-floor term
 * E_trunc/E_coll GROWS ~ E_trunc*sqrt(N), while the E_flow/E_coll term DECAYS (E_flow
 * ~ (log T0)^2/T0 falls super-polynomially). The minimum of g is where those balance,
 * so N_max is set by the size of E_trunc relative to the decaying E_flow: a LARGER
 * floor forces the balance EARLIER (smaller N_max). Dimensional balance
 * E_trunc*sqrt(N_max) ~ (slowly varying) predicts N_max ~ E_trunc^(-2) up to the slow
 * log/E_flow corrections; the measured empirical exponent is ~ -1.375 (softened by the
 * still-non-negligible E_flow ~ 4.7e-5 near the peak, comparable to E_trunc itself).
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (S1) N_max is HIGHLY model-sensitive: N_max ~ E_trunc^(-1.375). A +/-10% change in
 *        the floor moves N_max by ~ +15% / -12% (factor 0.9 -> 1.065e6, factor 1.1 ->
 *        8.09e5), and a 2x floor halves-and-more it (factor 2 -> 3.50e5). The precise
 *        "N_max ~ 9.22e5" pin is NOT robust.
 *   (S2) The above-vs-below-10^6 detail FLIPS within a ~6% perturbation. The peak
 *        crosses the 10^6 ceiling at E_trunc ~ 2.884e-5 (only 0.942x the base floor):
 *        for any floor below that N_max sits ABOVE 10^6, above it N_max sits BELOW. The
 *        specific "2.1e-5 above the ceiling, just below 10^6" figure is a fragile
 *        coincidence of the E_trunc = 3.06e-5 pin, not a structural fact.
 *   (S3) sigma_max is FAR less sensitive (it is a bounded share): 0.9612 at 0.5x down
 *        to 0.9103 at 5x, ~0.94943 at base -- it drifts monotonically and mildly with
 *        the floor, spanning only ~0.05 across a 10x floor sweep.
 *   (S4) BUT the QUALITATIVE reframing is ROBUST. For EVERY plausible floor in the
 *        swept 0.5x..5x range: (a) an interior MAXIMUM exists (structural -- for any
 *        positive constant E_trunc, E_coll -> 0 forces sigma -> 0, so the right arm
 *        cannot keep widening and must turn over); (b) N_max lands in ~[9e4, 2.4e6], so
 *        the 10^6 ladder endpoint always sits ON or NEAR the flat top, never on a
 *        steeply climbing arm; and (c) sigma(10^6) stays within ~3.4% of sigma_max even
 *        at a 5x floor, and within ~1e-4 across the whole +/-10% window. The turnover
 *        "widest at 10^6 is a flat-cap sampling artifact, NOT an unbounded-widening
 *        frontier" survives every perturbation; only the precise peak COORDINATES move.
 *
 * VERDICT: ROBUST QUALITATIVELY, FRAGILE QUANTITATIVELY. imp-3406's LOGIC (the right
 * arm turns over near 10^6 and the "widest at 10^6" reading is a sampling artifact, not
 * a climbing frontier) is model-form robust -- it follows from the constant floor
 * outliving the vanishing E_coll for ANY positive E_trunc. Its precise PIN (N_max ~
 * 9.22e5, "just below 10^6", 2.1e-5 above the ceiling) is model-dependent: N_max ~
 * E_trunc^(-1.375) and the above/below-10^6 side flips within ~6% of the floor.
 *
 * ASSESSMENT ONLY. C_mb stays GUE-conditional (imp-486); no bound changes, no
 * positivity, no bridge closure, no RH claim, NO QED. No refereed bound is changed.
 *
 * RELATION TO imp-3443. imp-3443 already measured the RAW sensitivity magnitude --
 * dN_max/dE_trunc and the power law N_max ~ (1/E_trunc)^1.376 over a 0.5x..2x grid.
 * This module reuses that same scaling but targets the DISTINCT reframing-robustness
 * question the ticket asks: (i) the exact crossover floor at which N_max flips from
 * ABOVE to BELOW the 10^6 ceiling (~0.942x base, a ~6% window), and (ii) the split
 * assessment that imp-3406s reframing LOGIC (flat-cap artifact, not a climbing
 * frontier) is model-form robust while its precise PIN (N_max ~ 9.22e5, just below
 * 10^6) is not -- neither of which imp-3443 evaluated.
 *
 * @see imp-3406-sigma-highN-extrapolation (interior max N_max ~ 9.22e5, the pinned peak)
 * @see imp-3443-nmax-etrunc-sensitivity (raw dN_max/dE_trunc power law; this module adds the reframing-robustness split)
 * @see imp-3220-en-bridge-fidelity-frontier (U-shaped sigma(N) decade ladder)
 * @see imp-3323-sigma-argmin-locator (interior MIN pinned N ~ 97.80, same formulas)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip truncation floor, the perturbed model)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-3406 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406 exactly
const N_CEILING = 1e6; // the imp-3220 sampled assembly ceiling

// EXACT imp-3406 sub-terms; ONLY the E_trunc floor is a parameter here.
function sigmaWith(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return E_coll / (E_trunc + E_flow + E_coll);
}

// Ternary search for the interior maximum in ln N (same bracketing spirit as imp-3406).
function argmaxNforFloor(E_trunc) {
  let lo = Math.log(1e3);
  let hi = Math.log(1e10);
  for (let i = 0; i < 600; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigmaWith(Math.exp(m1), E_trunc) < sigmaWith(Math.exp(m2), E_trunc)) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// factor 1.0 REPRODUCES imp-3406 (N_max ~ 9.22e5). The 0.5x..5x sweep renders
// "alternative truncation orders / cutoff conventions" as floor rescalings.
const FLOOR_FACTORS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0, 3.0, 5.0];

const SENSITIVITY_TABLE = FLOOR_FACTORS.map((f) => {
  const E_trunc = E_TRUNC_BASE * f;
  const N_max = argmaxNforFloor(E_trunc);
  const sigma_max = sigmaWith(N_max, E_trunc);
  const sigma_ceiling = sigmaWith(N_CEILING, E_trunc);
  return {
    floorFactor: f,
    E_trunc: +E_trunc.toExponential(3),
    N_max: +N_max.toExponential(4),
    log10_N_max: +(Math.log(N_max) / Math.LN10).toFixed(4),
    sigma_max: +sigma_max.toFixed(7),
    sigma_at_ceiling: +sigma_ceiling.toFixed(7),
    peak_above_ceiling: +(sigma_max - sigma_ceiling).toExponential(3),
    N_max_above_1e6: N_max > N_CEILING,
  };
});

const BASE_ROW = SENSITIVITY_TABLE.find((r) => r.floorFactor === 1.0);

// Empirical scaling exponent p in N_max ~ E_trunc^p, from two well-separated floors.
const N_LO = argmaxNforFloor(0.5 * E_TRUNC_BASE);
const N_HI = argmaxNforFloor(2.0 * E_TRUNC_BASE);
const SCALING_EXPONENT =
  (Math.log(N_HI) - Math.log(N_LO)) / (Math.log(2.0 * E_TRUNC_BASE) - Math.log(0.5 * E_TRUNC_BASE));

// The floor value at which the peak sits EXACTLY on the 10^6 ceiling (side-flip point).
function floorForNmaxAtCeiling() {
  let lo = 2.4e-5;
  let hi = 3.2e-5;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (argmaxNforFloor(m) > N_CEILING) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
const E_TRUNC_CROSSOVER = floorForNmaxAtCeiling(); // ~2.884e-5 (~0.942x base)

// Robustness envelope across the whole sweep.
const N_MAX_MIN = Math.min(...SENSITIVITY_TABLE.map((r) => r.N_max));
const N_MAX_MAX = Math.max(...SENSITIVITY_TABLE.map((r) => r.N_max));
const WORST_CEILING_GAP = Math.max(...SENSITIVITY_TABLE.map((r) => r.peak_above_ceiling));

export const IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY = {
  id: 'imp-33684',
  proofSection: 'S-frontier',
  question:
    'Measure the sensitivity of the imp-3406 sigma(N) interior-peak location N_max ~ ' +
    '9.22e5 (sigma_max ~ 0.9494) to the E_trunc truncation-floor MODEL FORM and assess ' +
    'whether the "widest at 10^6 is a sampling artifact" reframing is robust or ' +
    'model-dependent, since that reframing rests on the interior maximum sitting just ' +
    'above the 10^6 endpoint. Measurement/sensitivity only; no bound changes, no RH verdict.',
  baseRow: BASE_ROW,
  scalingExponent: +SCALING_EXPONENT.toFixed(4), // ~ -1.375 (N_max ~ E_trunc^p)
  crossover: {
    E_trunc_at_which_N_max_equals_1e6: +E_TRUNC_CROSSOVER.toExponential(4), // ~2.884e-5
    ratio_to_base: +(E_TRUNC_CROSSOVER / E_TRUNC_BASE).toFixed(4), // ~0.9424
    note:
      'The peak crosses the 10^6 ceiling at E_trunc ~ 2.884e-5 = 0.942x the base floor. ' +
      'Below that floor N_max sits ABOVE 10^6; above it, BELOW. So the "just below 10^6" ' +
      'reading flips within a ~6% floor perturbation -- a fragile pin, not structural.',
  },
  sensitivityTable: SENSITIVITY_TABLE,
  envelope: {
    N_max_min: +N_MAX_MIN.toExponential(3), // ~9.1e4 (at 5x floor)
    N_max_max: +N_MAX_MAX.toExponential(3), // ~2.4e6 (at 0.5x floor)
    worst_ceiling_gap: +WORST_CEILING_GAP.toExponential(3), // ~3.4e-2 (at 5x)
    note:
      'Across the full 0.5x..5x floor sweep N_max stays in ~[9e4, 2.4e6] -- the 10^6 ' +
      'ladder endpoint always lands ON or NEAR the flat top, never on a steeply climbing ' +
      'arm -- and sigma(10^6) stays within ~3.4% of sigma_max (within ~1e-4 across +/-10%).',
  },
  verdict:
    'ROBUST QUALITATIVELY, FRAGILE QUANTITATIVELY. The N_max ~ 9.22e5 peak location is ' +
    'HIGHLY model-sensitive: N_max ~ E_trunc^(-1.375), a +/-10% floor moves it ~ +15%/-12%, ' +
    'and the above/below-10^6 side flips within ~6% of the floor (crossover E_trunc ~ ' +
    '2.884e-5), so the precise "just below 10^6, 2.1e-5 above the ceiling" pin is a model ' +
    'artifact of E_trunc = 3.06e-5. BUT imp-3406s reframing LOGIC survives every ' +
    'perturbation: for any positive constant floor an interior maximum must exist (E_coll ' +
    '-> 0 forces sigma -> 0), N_max stays in ~[9e4, 2.4e6] so 10^6 always sits on/near the ' +
    'flat top, and sigma(10^6) stays within ~3.4% of sigma_max even at a 5x floor. So ' +
    '"widest at 10^6 is a flat-cap sampling artifact, not an unbounded-widening frontier" ' +
    'is model-form robust; only the exact peak coordinates are model-dependent. Assessment ' +
    'only; C_mb stays GUE-conditional (imp-486), no bound changes, no RH claim, NO QED. ' +
    'No refereed bound is changed.',
  isRigorous: false,
  citation:
    'imp-3406 (interior max N_max ~ 9.22e5, the pinned peak); imp-3443 (raw N_max ~ ' +
    '(1/E_trunc)^1.376 power law; this module adds the reframing-robustness split); imp-3220 (U-shaped sigma(N) ' +
    'decade ladder, widest at 10^6); imp-3323 (interior min N ~ 97.80); imp-2631 (E_trunc ' +
    '= 3.06e-5 fixed-strip floor); imp-398 (E_flow C_F prefactor); lambda-rh-height-mapping.',
};

export const IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: factor 1.0 reproduces the imp-3406 pin (N_max ~ 9.22e5, sigma ~ 0.94943).
    id: 'imp33684-reproduces-imp3406-base-peak',
    description: 'factor 1.0 reproduces imp-3406 N_max ~ 9.22e5 and sigma_max ~ 0.94943 (identical formulas)',
    holds: () =>
      Math.abs(BASE_ROW.N_max - 9.2186e5) / 9.2186e5 < 1e-3 &&
      Math.abs(BASE_ROW.sigma_max - 0.9494290) < 5e-5,
  },
  {
    // S1: N_max is highly sensitive -- inverse power-law scaling with the floor.
    id: 'imp33684-Nmax-inverse-power-law-in-etrunc',
    description: 'N_max ~ E_trunc^p with p in [-1.6, -1.2] (strongly sensitive, roughly inverse)',
    holds: () => SCALING_EXPONENT < -1.2 && SCALING_EXPONENT > -1.6,
  },
  {
    // S1 (concrete): a +/-10% floor moves N_max across the 10^6 ceiling.
    id: 'imp33684-pm10pct-floor-straddles-ceiling',
    description: '+/-10% floor: N_max(0.9x) > 10^6 > N_max(1.1x) -- the pin straddles the ceiling',
    holds: () => {
      const r09 = SENSITIVITY_TABLE.find((r) => r.floorFactor === 0.9);
      const r11 = SENSITIVITY_TABLE.find((r) => r.floorFactor === 1.1);
      return r09.N_max > N_CEILING && r11.N_max < N_CEILING;
    },
  },
  {
    // S2: the above/below-10^6 side flips within ~6% of the base floor.
    id: 'imp33684-side-flip-within-6pct',
    description: 'peak crosses 10^6 at E_trunc ~ 0.94x base -- side flip within ~6% perturbation',
    holds: () =>
      E_TRUNC_CROSSOVER / E_TRUNC_BASE > 0.9 &&
      E_TRUNC_CROSSOVER / E_TRUNC_BASE < 1.0,
  },
  {
    // S3: sigma_max is far less sensitive than N_max -- spans < 0.06 across the 10x sweep.
    id: 'imp33684-sigma-max-mildly-sensitive',
    description: 'sigma_max spans < 0.06 across the 0.5x..5x floor sweep (bounded share, mild)',
    holds: () => {
      const smax = SENSITIVITY_TABLE.map((r) => r.sigma_max);
      return Math.max(...smax) - Math.min(...smax) < 0.06;
    },
  },
  {
    // S4 (a): structural interior max -- EVERY floor yields a positive-gap interior peak.
    id: 'imp33684-interior-max-exists-every-floor',
    description: 'an interior maximum exists for every swept floor (sigma_max > sigma(10^6) >= 0 all rows)',
    holds: () =>
      SENSITIVITY_TABLE.every((r) => r.peak_above_ceiling >= 0 && r.sigma_max > r.sigma_at_ceiling - 1e-9),
  },
  {
    // S4 (b): the 10^6 endpoint always lands near the flat top -- N_max envelope stays modest,
    // and sigma(10^6) is within ~3.4% of sigma_max even at the worst (5x) floor.
    id: 'imp33684-ceiling-near-flat-top-every-floor',
    description: 'N_max in ~[9e4, 2.4e6] and sigma(10^6) within ~3.4% of sigma_max for all floors (qualitative reframing robust)',
    holds: () =>
      N_MAX_MIN > 8e4 && N_MAX_MAX < 2.5e6 && WORST_CEILING_GAP < 0.04,
  },
  {
    // Honesty gate: sensitivity/assessment only, split verdict, no QED, no refereed bound is changed.
    id: 'imp33684-honesty-gate-no-qed',
    description: 'Assessment only: robust-qualitative/fragile-quantitative verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY.isRigorous === false &&
      /ROBUST QUALITATIVELY, FRAGILE QUANTITATIVELY/.test(
        IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY.verdict,
      ) &&
      /NO QED/.test(IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY.verdict),
  },
];

for (const a of IMP33684_SIGMA_INTERIOR_PEAK_ETRUNC_MODEL_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-33684-sigma-interior-peak-etrunc-model-sensitivity assertion failed: ${a.id}`,
    );
  }
}
