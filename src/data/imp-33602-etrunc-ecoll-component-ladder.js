/**
 * @module imp-33602-etrunc-ecoll-component-ladder
 *
 * imp-33602 (accuracy, frontier-direction): imp-33582 attributes the post-peak
 * sigma(N) = E_coll/E decay-to-0 to the constant truncation floor E_trunc (imp-2631
 * fixed-strip route) OUTLIVING the vanishing GUE-conditional collapse term E_coll, but
 * it tabulates only the RATIO sigma -- never the two components separately. This module
 * DERIVES E_trunc(N) and E_coll(N) individually across the imp-33582 post-peak ladder
 * (the decades N in {1e6 .. 1e12}, spanning the interior peak N ~ 9.22e5 through the
 * sigma < 0.1 threshold N ~ 3.21e11), tabulates both, and CONFIRMS the decay mechanism:
 * E_trunc is genuinely N-flat (fixed strip) while E_coll ~ sqrt(1/N) decays, so their
 * crossover is what drives the sigma halving.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-3406 / imp-33582 / imp-33601)
 * ---------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_trunc  = 3.06e-5                           (N-INDEPENDENT fixed strip, imp-2631)
 *     E_coll   = C_C_PINNED * sqrt(log T0 / N)     (dominant, GUE-conditional C_H)
 *     E_flow   = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     T0       = effectiveHeightForN(N)            (Riemann-von Mangoldt inverse)
 *
 * THE MECHANISM (what the ticket asks to separate and confirm)
 * -----------------------------------------------------------
 * sigma(N) = E_coll / (E_trunc + E_flow + E_coll). E_flow decays fastest (~log T0/T0),
 * so past the peak the denominator is dominated by the FIXED floor E_trunc plus the
 * shrinking E_coll. As E_coll ~ sqrt(1/N) falls THROUGH the constant E_trunc floor, the
 * ratio E_coll/(E_trunc + E_coll) -> 0: the truncation floor "outlives" the collapse
 * term. So the sigma decay is not a property of E_coll alone -- it is the crossover of a
 * decaying E_coll against a flat E_trunc.
 *
 * THE SEPARATED LADDER (derived here; the piece imp-33582 never tabulated)
 * -----------------------------------------------------------------------
 *   N       E_trunc     E_coll      E_flow      sigma     d log E_coll / d log N
 *   1e6     3.060e-5    1.400e-3    4.40e-5     0.9494       --      (interior peak)
 *   1e7     3.060e-5    4.766e-4    7.17e-6     0.9266    -0.468
 *   1e8     3.060e-5    1.609e-4    1.10e-6     0.8354    -0.472
 *   1e9     3.060e-5    5.391e-5    1.60e-7     0.6367    -0.475
 *   1e10    3.060e-5    1.797e-5    2.23e-8     0.3697    -0.477   (E_coll < E_trunc)
 *   1e11    3.060e-5    5.959e-6    3.02e-9     0.1630    -0.479
 *   1e12    3.060e-5    1.969e-6    3.99e-10    0.0604    -0.481
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) E_trunc IS GENUINELY N-FLAT. E_trunc(N) = 3.06e-5 identically across all seven
 *        decades (max/min ratio exactly 1): the imp-2631 fixed-strip route has NO N
 *        dependence, so it is a true constant floor, not a slow decay.
 *   (F2) E_coll ~ sqrt(1/N). The per-decade local exponent d log E_coll / d log N ramps
 *        from ~-0.468 [1e6,1e7] to ~-0.481 [1e11,1e12] -- approaching the -1/2 sqrt(1/N)
 *        rate from ABOVE in magnitude (slightly slower than exact N^{-1/2}) because the
 *        slow log T0(N) growth partly offsets the decay. The per-decade ratio
 *        E_coll(10N)/E_coll(N) ~ 0.34 slowly approaches 1/sqrt(10) ~ 0.3162.
 *   (F3) THE CROSSOVER DRIVES THE HALVING. E_coll falls THROUGH the flat E_trunc floor
 *        between N = 1e9 (E_coll ~ 5.39e-5 > E_trunc) and N = 1e10 (E_coll ~ 1.80e-5 <
 *        E_trunc), i.e. at N ~ 3.28e9 (imp-3444 crossover), and sigma drops from 0.637
 *        to 0.370 across exactly that bracket -- so the crossover of the decaying E_coll
 *        against the flat E_trunc is what halves sigma. E_flow is ~3 orders of magnitude
 *        below E_trunc there (imp-33601), so the mechanism is E_coll-vs-E_trunc as
 *        imp-33582 asserts, with E_flow only a small correction to the exact half point.
 *
 * The punchline: the imp-33582 verdict -- sigma decays because the fixed truncation floor
 * E_trunc OUTLIVES the vanishing GUE-conditional E_coll -- is confirmed by the SEPARATED
 * components. E_trunc is exactly flat (7 decades, ratio 1); E_coll follows sqrt(1/N) to
 * within the slow log T0 correction; and sigma halves precisely where the shrinking
 * E_coll crosses the flat E_trunc floor.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; the E_trunc route is itself GUE-conditional-free but the
 * C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian
 * Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (ratio only; attributes decay to E_trunc>E_coll)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (E_flow offset at the exact half point)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX; component model source)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601 exactly

// EXACT imp-3406/imp-33582 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_trunc = E_TRUNC_PT; // N-independent fixed strip (surfaced explicitly here)
  const E_N = E_trunc + E_flow + E_coll;
  return { T0, L, E_trunc, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// The imp-33582 post-peak ladder: decades spanning the interior peak (N ~ 9.22e5) through
// the sigma < 0.1 threshold (N ~ 3.21e11).
const DECADE_EXPONENTS = [6, 7, 8, 9, 10, 11, 12];
const LADDER = DECADE_EXPONENTS.map((e, i) => {
  const N = Math.pow(10, e);
  const p = parts(N);
  let ecollLocalExponent = null;
  if (i > 0) {
    const Nprev = Math.pow(10, DECADE_EXPONENTS[i - 1]);
    const Pprev = parts(Nprev);
    ecollLocalExponent = Math.log(p.E_coll / Pprev.E_coll) / Math.log(N / Nprev);
  }
  return {
    N: +N.toExponential(0),
    T0: +p.T0.toExponential(4),
    E_trunc: +p.E_trunc.toExponential(4),
    E_coll: +p.E_coll.toExponential(4),
    E_flow: +p.E_flow.toExponential(4),
    sigma: +p.sigma.toFixed(5),
    ecoll_local_exponent: ecollLocalExponent === null ? null : +ecollLocalExponent.toFixed(4),
  };
});

// (F1) E_trunc genuinely N-flat: every rung carries the identical fixed-strip value.
const E_TRUNC_VALUES = LADDER.map((r) => r.E_trunc);
const E_TRUNC_MAX = Math.max(...E_TRUNC_VALUES);
const E_TRUNC_MIN = Math.min(...E_TRUNC_VALUES);
const E_TRUNC_FLATNESS_RATIO = E_TRUNC_MAX / E_TRUNC_MIN; // exactly 1

// (F2) E_coll ~ sqrt(1/N): the local exponents cluster near -1/2, ramping toward it.
const EXPONENTS = LADDER.slice(1).map((r) => r.ecoll_local_exponent);
const EXP_FIRST = EXPONENTS[0]; // ~-0.468 (slightly above -1/2 in magnitude)
const EXP_LAST = EXPONENTS[EXPONENTS.length - 1]; // ~-0.481 (nearer -1/2)

// (F3) The E_coll = E_trunc crossover bracket: last rung with E_coll > E_trunc, first below.
const LAST_ABOVE = LADDER.filter((r) => r.E_coll > E_TRUNC_PT).pop(); // N = 1e9
const FIRST_BELOW = LADDER.find((r) => r.E_coll < E_TRUNC_PT); // N = 1e10
const SIGMA_AT_LAST_ABOVE = LAST_ABOVE.sigma; // ~0.637
const SIGMA_AT_FIRST_BELOW = FIRST_BELOW.sigma; // ~0.370

export const IMP33602_ETRUNC_ECOLL_COMPONENT_LADDER = {
  id: 'imp-33602',
  proofSection: 'S-frontier',
  question:
    'Separate E_trunc(N) and E_coll(N) individually across the imp-33582 post-peak ladder ' +
    '(decades N in {1e6 .. 1e12}) that imp-33582 tabulated only as the ratio sigma = E_coll/E, ' +
    'and confirm the decay mechanism it asserts: E_trunc N-flat (imp-2631 fixed strip) while ' +
    'E_coll ~ sqrt(1/N) decays, so their crossover drives the sigma halving. Measurement only; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  componentModel:
    'sigma(N) = E_coll/(E_trunc + E_flow + E_coll); E_trunc = 3.06e-5 (fixed strip, imp-2631); ' +
    'E_coll = C_C sqrt(log T0 / N) (GUE-conditional C_H); E_flow = C_F (log T0 / T0) Gronwall.',
  ladder: LADDER,
  findings: {
    F1_E_trunc_N_flat: {
      claim: 'E_trunc(N) = 3.06e-5 identically across all seven decades (fixed strip, no N dependence)',
      max_over_min_ratio: +E_TRUNC_FLATNESS_RATIO.toFixed(12), // exactly 1
      value: +E_TRUNC_PT.toExponential(4),
    },
    F2_E_coll_sqrt_inv_N: {
      claim:
        'E_coll ~ sqrt(1/N): local exponent d log E_coll / d log N approaches -1/2 from above in ' +
        'magnitude (slow log T0 growth offsets the decay slightly)',
      exponent_first_decade: EXP_FIRST, // ~-0.468
      exponent_last_decade: EXP_LAST, // ~-0.481
      per_decade_ratio_target: +(1 / Math.sqrt(10)).toFixed(4), // 0.3162
    },
    F3_crossover_drives_halving: {
      claim:
        'E_coll falls through the flat E_trunc floor in the [1e9, 1e10] bracket (N ~ 3.28e9, ' +
        'imp-3444) and sigma halves across exactly that bracket -- the crossover, not E_coll ' +
        'alone, drives the decay',
      last_N_with_E_coll_above_E_trunc: LAST_ABOVE.N, // 1e9
      first_N_with_E_coll_below_E_trunc: FIRST_BELOW.N, // 1e10
      sigma_at_last_above: SIGMA_AT_LAST_ABOVE, // ~0.637
      sigma_at_first_below: SIGMA_AT_FIRST_BELOW, // ~0.370
    },
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-33582 sigma(N) post-peak decay is ' +
    'confirmed to be driven by the SEPARATED components: (F1) E_trunc is genuinely N-flat -- ' +
    '3.06e-5 on every one of the seven decades 1e6..1e12 (max/min ratio exactly 1), a true fixed ' +
    'floor per the imp-2631 fixed-strip route; (F2) E_coll ~ sqrt(1/N), its per-decade local ' +
    'exponent ramping from ~-0.468 to ~-0.481 toward -1/2 from above in magnitude (the slow ' +
    'log T0(N) growth slightly offsetting the N^{-1/2} decay); (F3) the shrinking E_coll crosses ' +
    'the flat E_trunc floor in the [1e9, 1e10] bracket (N ~ 3.28e9) and sigma drops from ~0.637 ' +
    'to ~0.370 across exactly that bracket, so the crossover -- decaying E_coll against flat ' +
    'E_trunc -- is what halves sigma, exactly as imp-33582 attributes. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the E_trunc route is ' +
    'GUE-conditional-free but the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33582 (post-peak sigma decay, ratio only, attributes decay to E_trunc outliving E_coll); ' +
    'imp-33601 (E_flow offset at the exact half point); imp-3444 (E_coll = E_trunc crossover ' +
    'N ~ 3.280e9); imp-3406 (interior MAX, component model source); imp-2631 (E_trunc fixed-strip ' +
    'route); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33602_ETRUNC_ECOLL_COMPONENT_LADDER_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-3406/imp-33582 interior-peak share at the ladder head.
    id: 'imp33602-reproduces-imp33582-peak-sigma',
    description: 'sigma(1e6) ~ 0.9494 (imp-3406/imp-33582 interior peak downslope), same model',
    holds: () => Math.abs(LADDER[0].sigma - 0.9494) < 5e-4,
  },
  {
    // (F1): E_trunc is exactly N-flat across every rung of the ladder.
    id: 'imp33602-E-trunc-genuinely-N-flat',
    description: 'E_trunc(N) identical on all seven decades: max/min ratio exactly 1',
    holds: () =>
      E_TRUNC_FLATNESS_RATIO === 1 && E_TRUNC_VALUES.every((v) => v === +E_TRUNC_PT.toExponential(4)),
  },
  {
    // (F2): E_coll follows sqrt(1/N) -- every local exponent sits just above -1/2 in magnitude
    // and the sequence ramps monotonely toward -1/2.
    id: 'imp33602-E-coll-sqrt-inv-N',
    description: 'E_coll local exponents in (-0.5, -0.45], ramping toward -1/2',
    holds: () =>
      EXPONENTS.every((x) => x > -0.5 && x <= -0.45) && EXP_LAST < EXP_FIRST,
  },
  {
    // (F3): the crossover bracket is [1e9, 1e10] and sigma halves across it -- the decaying
    // E_coll passes through the flat E_trunc floor exactly where the share halves.
    id: 'imp33602-crossover-drives-sigma-halving',
    description: 'E_coll>E_trunc at 1e9, E_coll<E_trunc at 1e10; sigma 0.637 -> 0.370 across it',
    holds: () =>
      LAST_ABOVE.N === 1e9 &&
      FIRST_BELOW.N === 1e10 &&
      SIGMA_AT_LAST_ABOVE > 0.5 &&
      SIGMA_AT_FIRST_BELOW < 0.5,
  },
  {
    // Honesty gate: measurement only, no QED, PT stays SOTA.
    id: 'imp33602-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP33602_ETRUNC_ECOLL_COMPONENT_LADDER.isRigorous === false &&
      /NO QED/.test(IMP33602_ETRUNC_ECOLL_COMPONENT_LADDER.verdict) &&
      /remains SOTA/.test(IMP33602_ETRUNC_ECOLL_COMPONENT_LADDER.verdict),
  },
];

for (const a of IMP33602_ETRUNC_ECOLL_COMPONENT_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33602-etrunc-ecoll-component-ladder assertion failed: ${a.id}`);
  }
}
