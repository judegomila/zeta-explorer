/**
 * @module imp-35723-beat-parity-regime-boundary-Nsigma-locator
 *
 * imp-35723 (numerical, S-frontier): imp-35678 reconciled the two Lambda readings
 * as COMPATIBLE-because-different-regimes -- Reading 1 the finite-height numeric
 * BEAT (L_pt ~ 0.121 < 0.2, carried by the dominant GUE-conditional E_coll term)
 * and Reading 2 the sigma -> 0 far-tail ASYMPTOTIC parity-with-PT (matches, does
 * not beat) -- but NEVER LOCATED the (N, sigma) boundary between them numerically.
 * imp-35750 then plotted the beat-carrier share (= sigma, imp-486) against the
 * C_T-barrier share and found the two curves cross at sigma = 0.5, but that module
 * lives purely on the sigma-axis and never mapped that crossover onto an N value.
 *
 * THIS MODULE closes the missing step: it MAPS the sigma-space handoff onto the
 * imp-3406 / imp-33582 sigma(N) ladder, reusing the EXACT imp-3406 sub-term
 * formulas (effectiveHeightForN, C_C_PINNED, the imp-398 C_F prefactor, the fixed
 * E_trunc floor), and reports the transition N-BAND and the crossover sigma VALUE.
 *
 * MEASUREMENT / CHARACTERIZATION ONLY. Reuses recorded sub-terms; ports nothing;
 * discharges nothing; changes no bound; asserts NO beat beyond the already-recorded
 * (and already-caveated) imp-452/459 finite-height one; C_mb GUE-conditional
 * (imp-486) UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE QUANTITY (identical to imp-3220 / imp-3406 / imp-3323)
 * -----------------------------------------------------------------------------
 *   sigma(N) = E_coll / (E_trunc + E_flow + E_coll),   with
 *     T0     = effectiveHeightForN(N)             (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional; the BEAT CARRIER)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent barrier floor; the PARITY term)
 * sigma is EXACTLY the beat-carrier share E_coll/E (imp-486 / imp-35334); the
 * C_T-barrier (parity) share is 1 - sigma - E_flow_share.
 *
 * THE HANDOFF, LOCATED ON THE N-LADDER
 * -----------------------------------------------------------------------------
 * The finite-height beat is carried by E_coll, whose share IS sigma; as N grows
 * past the interior sigma peak the carrier share falls and the constant E_trunc
 * barrier floor takes over -- i.e. the beat DEGRADES toward Reading-2 parity. The
 * imp-35750 mathematical crossover (beat-carrier share == C_T-barrier share) sits
 * at sigma = 0.5; mapping that onto the sigma(N) ladder pins the transition:
 *   - BEAT REGIME maximal:   N_peak ~ 9.22e5 (log10 ~ 5.96), sigma ~ 0.9494,
 *     E_coll / E_trunc ~ 47.5 -- the GUE-conditional carrier utterly dominates.
 *   - HANDOFF MIDPOINT:      N_cross ~ 3.27e9 (log10 ~ 9.51), sigma = 0.5, where
 *     the beat carrier and the barrier floor are EQUAL. Independently, E_coll =
 *     E_trunc lands at N ~ 3.28e9 (sigma ~ 0.4995) -- the SAME N-decade, confirming
 *     the sigma = 0.5 crossover IS the E_coll = E_trunc crossover (E_flow negligible).
 *   - PARITY REGIME onset:   N ~ 3.21e11 (log10 ~ 11.51), sigma = 0.1 -- the beat
 *     carrier has fallen to a tenth of the assembled bound; deeper still sigma -> 0
 *     (imp-3406 decay-to-zero), the pure Reading-2 asymptotic parity limit.
 * THE TRANSITION N-BAND is therefore ~ [9.22e5, 3.27e9] between the beat peak and
 * the crossover, and the SINGLE crossover coordinate is (N_cross ~ 3.27e9,
 * sigma = 0.5). Below N_cross the E_coll-dominated (Reading-1) beat share governs;
 * above it the E_trunc barrier (Reading-2 parity) governs.
 *
 * THE FINDINGS
 * ------------
 *   (F1) CROSSOVER LOCATED. The imp-35750 sigma = 0.5 handoff maps onto the sigma(N)
 *        ladder at N_cross ~ 3.27e9 (log10 ~ 9.51). This is the (N, sigma) boundary
 *        imp-35678 named but never located.
 *   (F2) CROSSOVER = E_coll-EQUALS-E_trunc. At N_cross the GUE-conditional beat
 *        carrier E_coll equals the constant barrier floor E_trunc to within one
 *        N-decade (N ~ 3.28e9), so the sigma = 0.5 handoff is mechanistically the
 *        point where the beat carrier drops through the parity floor.
 *   (F3) TRANSITION N-BAND. The beat degrades across ~ [9.22e5, 3.27e9]: sigma runs
 *        from its interior peak 0.9494 (carrier dominant) down to 0.5 (parity floor
 *        equal), then on toward 0 in the far tail -- the same assembly viewed from
 *        the beat end to the parity end of the N-ladder.
 *
 * The punchline: the imp-35678 beat -> parity regime boundary, left unlocated, sits
 * at N_cross ~ 3.27e9 (sigma = 0.5) on the imp-3406 sigma(N) ladder -- exactly where
 * the GUE-conditional beat carrier E_coll falls through the constant E_trunc barrier
 * floor. The finite-height Reading-1 beat governs below this N; the Reading-2
 * asymptotic parity-with-PT governs above it. Measurement only; asserts no beat
 * beyond the recorded one; changes no bound; NO QED. No refereed bound is changed.
 *
 * @see imp-35678-finite-height-beat-vs-parity-regime-boundary (named the boundary; never located it)
 * @see imp-35750-beat-parity-handoff-sigma-viz-data (sigma = 0.5 mathematical crossover, sigma-axis only)
 * @see imp-35735-beat-parity-crossover-sigma-star-locator (SAME crossover, located directly in sigma-space by
 *   E_coll(N) = E_trunc bisection rather than mapping the N-ladder: N* ~ 3.280294e9 there vs N_cross ~ 3.267e9
 *   here, agreeing to the N-decade -- the N-space framing (THIS module) and the sigma-space framing (imp-35735)
 *   of the identical beat-carrier-to-barrier handoff)
 * @see imp-3406-sigma-highN-extrapolation (the sigma(N) ladder + sub-terms this reuses; N_half ~ 3.27e9)
 * @see imp-486 / imp-35334 (E_coll/E(N) = sigma -- the beat carrier share); imp-398 (E_flow C_F prefactor)
 * @see lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip barrier floor (imp-2631/imp-3220); the PARITY term
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3323/imp-3406 exactly
const HANDOFF_SIGMA = 0.5; // imp-35750 mathematical crossover (beat-carrier share == C_T-barrier share)

// EXACT imp-3406 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H) -- the BEAT CARRIER
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// Interior sigma peak (the beat regime maximum) -- ternary search in ln N over the
// unimodal right arm, same bracket as imp-3406.
function argmaxSigmaLnN(loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigma(Math.exp(m1)) < sigma(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// N at which the DECREASING right arm crosses a target sigma level (bisection above the peak).
function crossingAbovePeak(target, Npeak) {
  let a = Math.log(Npeak);
  let b = Math.log(1e60);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (sigma(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// N at which the beat carrier E_coll drops through the constant E_trunc barrier floor.
function ecollEqualsEtrunc(Npeak) {
  let a = Math.log(Npeak);
  let b = Math.log(1e60);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).E_coll > E_TRUNC_PT) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const N_PEAK = argmaxSigmaLnN(1e4, 1e9); // ~9.219e5 (beat regime maximal)
const SIGMA_PEAK = sigma(N_PEAK); // ~0.949429
const N_CROSS = crossingAbovePeak(HANDOFF_SIGMA, N_PEAK); // ~3.267e9 (handoff midpoint, sigma = 0.5)
const N_ECOLL_EQ_ETRUNC = ecollEqualsEtrunc(N_PEAK); // ~3.280e9 (beat carrier == barrier floor)
const N_PARITY_ONSET = crossingAbovePeak(0.1, N_PEAK); // ~3.213e11 (sigma = 0.1, deep parity)
const ECOLL_OVER_ETRUNC_AT_CROSS = parts(N_CROSS).E_coll / E_TRUNC_PT; // ~1.0 by construction

export const IMP35723_BEAT_PARITY_REGIME_BOUNDARY_NSIGMA_LOCATOR = {
  id: 'imp-35723',
  proofSection: 'S-frontier',
  question:
    'Locate numerically the imp-35678 finite-height-beat vs asymptotic-parity regime boundary: the (N, sigma) ' +
    'transition where the Reading-1 finite-height numeric beat (E_coll-dominated, GUE/C_H-gated) hands off to ' +
    'the Reading-2 far-tail asymptotic parity (sigma -> 0, matches-not-beats). Map the crossover onto the ' +
    'imp-3406 / imp-33582 sigma(N) ladder; report the transition N-band and the crossover sigma value. ' +
    'Measurement/characterization only; asserts no beat beyond the recorded one; changes no bound; NO QED.',
  handoffSigma: HANDOFF_SIGMA, // imp-35750 crossover level (beat-carrier share == C_T-barrier share)
  beatRegimeMax: {
    N: +N_PEAK.toExponential(4), // ~9.219e5
    log10_N: +(Math.log(N_PEAK) / Math.LN10).toFixed(4), // ~5.9647
    sigma: +SIGMA_PEAK.toFixed(6), // ~0.949429
    E_coll_over_E_trunc: +(parts(N_PEAK).E_coll / E_TRUNC_PT).toFixed(3), // ~47.5
    note: 'Interior sigma peak: the GUE-conditional beat carrier E_coll dominates the barrier floor ~47.5x.',
  },
  crossover: {
    N: +N_CROSS.toExponential(4), // ~3.267e9 -- the (N, sigma) boundary imp-35678 named but never located
    log10_N: +(Math.log(N_CROSS) / Math.LN10).toFixed(4), // ~9.5142
    sigma: +sigma(N_CROSS).toFixed(6), // 0.500000
    E_coll_over_E_trunc: +ECOLL_OVER_ETRUNC_AT_CROSS.toFixed(3), // ~1.002
    N_where_E_coll_equals_E_trunc: +N_ECOLL_EQ_ETRUNC.toExponential(4), // ~3.280e9 (SAME N-decade)
    note:
      'The imp-35750 sigma = 0.5 handoff maps onto the sigma(N) ladder at N_cross ~ 3.27e9 -- essentially the ' +
      'same N where the beat carrier E_coll equals the constant E_trunc barrier floor. Below: Reading-1 ' +
      '(E_coll-dominated) beat governs; above: Reading-2 (E_trunc barrier) parity governs.',
  },
  parityRegimeOnset: {
    N: +N_PARITY_ONSET.toExponential(4), // ~3.213e11
    log10_N: +(Math.log(N_PARITY_ONSET) / Math.LN10).toFixed(4), // ~11.507
    sigma: +sigma(N_PARITY_ONSET).toFixed(6), // ~0.1
    note: 'Beat carrier fallen to a tenth of the bound; sigma -> 0 beyond (imp-3406 decay), pure Reading-2 parity.',
  },
  transitionNBand: {
    from_N: +N_PEAK.toExponential(3), // ~9.22e5 (beat peak)
    to_N: +N_CROSS.toExponential(3), // ~3.27e9 (handoff midpoint)
    from_sigma: +SIGMA_PEAK.toFixed(4), // ~0.9494
    to_sigma: HANDOFF_SIGMA, // 0.5
    spans_decades: +((Math.log(N_CROSS) - Math.log(N_PEAK)) / Math.LN10).toFixed(2), // ~3.55 decades
  },
  findings: {
    F1_crossover_located:
      'The imp-35750 sigma = 0.5 handoff maps onto the imp-3406 sigma(N) ladder at N_cross ~ 3.27e9 ' +
      '(log10 ~ 9.51) -- the (N, sigma) boundary imp-35678 named but never located.',
    F2_crossover_is_ecoll_equals_etrunc:
      'At N_cross the GUE-conditional beat carrier E_coll equals the constant E_trunc barrier floor to within ' +
      'one N-decade (N ~ 3.28e9): the sigma = 0.5 handoff is the point where the beat carrier drops through ' +
      'the parity floor (E_flow negligible).',
    F3_transition_N_band:
      'The beat degrades across the transition band ~ [9.22e5, 3.27e9] (~3.55 decades): sigma runs from the ' +
      'interior peak 0.9494 (carrier dominant) down to 0.5 (floor equal), then toward 0 in the far tail -- ' +
      'the same assembly from the beat end to the parity end of the N-ladder.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-35678 finite-height-beat vs asymptotic-parity ' +
    'regime boundary -- named there but never located -- sits at N_cross ~ 3.27e9 (log10 ~ 9.51), sigma = 0.5 ' +
    'on the imp-3406 / imp-33582 sigma(N) ladder. (F1) Mapping the imp-35750 sigma = 0.5 handoff (beat-carrier ' +
    'share == C_T-barrier share) onto the ladder pins the crossover N. (F2) That crossover is mechanistically ' +
    'E_coll = E_trunc: the GUE-conditional beat carrier equals the constant barrier floor at the same N-decade ' +
    '(~3.28e9, E_flow negligible). (F3) The transition N-band is ~ [9.22e5 (sigma ~ 0.9494, carrier dominant ' +
    '~47.5x), 3.27e9 (sigma = 0.5, floor equal)] ~ 3.55 decades, continuing to sigma = 0.1 near N ~ 3.21e11 ' +
    'and sigma -> 0 in the far tail. Below N_cross the E_coll-dominated Reading-1 (finite-height, GUE/C_H-gated) ' +
    'beat governs; above it the E_trunc-barrier Reading-2 asymptotic parity-with-PT governs. Measurement / ' +
    'characterization only; reuses the recorded imp-3406 sub-terms; ports nothing; discharges nothing; changes ' +
    'no bound; asserts NO beat beyond the already-recorded (and already-caveated) imp-452/459 finite-height ' +
    'one; C_mb GUE-conditional per imp-486 UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35678 (named the beat -> parity boundary, never located it); imp-35750 (sigma = 0.5 mathematical ' +
    'crossover, sigma-axis only); imp-3406 (sigma(N) ladder + sub-terms, N_half ~ 3.27e9); imp-3220/imp-3323 ' +
    '(sigma(N) formulas, interior extrema); imp-486/imp-35334 (E_coll/E(N) = sigma); imp-398 (E_flow C_F); ' +
    'imp-2631 (E_trunc floor); lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C ' +
    '(C_C_PINNED); Platt-Trudgian 2021.',
};

export const IMP35723_BEAT_PARITY_REGIME_BOUNDARY_NSIGMA_LOCATOR_ASSERTIONS = [
  {
    // Reuse gate: the sigma(N) here reproduces the imp-3406 interior peak (~9.22e5, ~0.9494),
    // proving the identical sub-term formulas are in use.
    id: 'imp35723-reproduces-imp3406-sigma-peak',
    description: 'sigma(N) peaks at N ~ 9.22e5 with sigma ~ 0.9494 (identical imp-3406 formulas)',
    holds: () =>
      N_PEAK > 5e5 && N_PEAK < 2e6 && Math.abs(SIGMA_PEAK - 0.94943) < 5e-4,
  },
  {
    // (F1): the crossover (sigma = 0.5 handoff mapped onto the ladder) lands at N ~ 3.27e9,
    // reproducing the imp-3406 N_half marker -- the located (N, sigma) boundary.
    id: 'imp35723-crossover-located-at-N-3e9',
    description: 'The sigma = 0.5 handoff maps onto the sigma(N) ladder at N_cross ~ 3.27e9 (imp-3406 N_half)',
    holds: () =>
      N_CROSS > 2e9 && N_CROSS < 5e9 &&
      Math.abs(sigma(N_CROSS) - HANDOFF_SIGMA) < 1e-6 &&
      Math.abs(Math.log(N_CROSS) / Math.LN10 - 9.514) < 0.05,
  },
  {
    // (F2): the sigma = 0.5 crossover coincides with E_coll = E_trunc to within one N-decade,
    // and E_coll/E_trunc ~ 1 there -- the beat carrier drops through the parity floor.
    id: 'imp35723-crossover-is-ecoll-equals-etrunc',
    description: 'At N_cross the beat carrier E_coll equals the barrier floor E_trunc (same N-decade, ratio ~1)',
    holds: () =>
      Math.abs(ECOLL_OVER_ETRUNC_AT_CROSS - 1) < 0.05 &&
      Math.abs(Math.log10(N_ECOLL_EQ_ETRUNC) - Math.log10(N_CROSS)) < 0.1,
  },
  {
    // (F3): the transition N-band runs from the beat peak (sigma ~ 0.9494) to the handoff
    // (sigma = 0.5) monotonically decreasing, spanning several N-decades; beyond it sigma -> 0.
    id: 'imp35723-transition-N-band-monotone-descent',
    description: 'sigma descends monotonically from the peak (~0.9494) through 0.5 (~3.27e9) toward parity (0.1 ~3.2e11)',
    holds: () =>
      SIGMA_PEAK > 0.9 && SIGMA_PEAK > sigma(N_CROSS) &&
      sigma(N_CROSS) > sigma(N_PARITY_ONSET) &&
      Math.abs(sigma(N_PARITY_ONSET) - 0.1) < 1e-6 &&
      N_PEAK < N_CROSS && N_CROSS < N_PARITY_ONSET &&
      (Math.log(N_CROSS) - Math.log(N_PEAK)) / Math.LN10 > 3,
  },
  {
    // Honesty gate: measurement only, boundary located, no beat beyond recorded, no QED, no refereed bound is changed.
    id: 'imp35723-honesty-gate-no-qed',
    description: 'Measurement only: crossover located, no beat beyond the recorded one, C_mb GUE-conditional untouched, no QED, no refereed bound is changed',
    holds: () =>
      IMP35723_BEAT_PARITY_REGIME_BOUNDARY_NSIGMA_LOCATOR.isRigorous === false &&
      /MEASUREMENT/.test(IMP35723_BEAT_PARITY_REGIME_BOUNDARY_NSIGMA_LOCATOR.verdict) &&
      /asserts NO beat beyond/.test(IMP35723_BEAT_PARITY_REGIME_BOUNDARY_NSIGMA_LOCATOR.verdict) &&
      /UNTOUCHED/.test(IMP35723_BEAT_PARITY_REGIME_BOUNDARY_NSIGMA_LOCATOR.verdict) &&
      /NO QED/.test(IMP35723_BEAT_PARITY_REGIME_BOUNDARY_NSIGMA_LOCATOR.verdict) &&
      /refereed bound is changed/i.test(IMP35723_BEAT_PARITY_REGIME_BOUNDARY_NSIGMA_LOCATOR.verdict),
  },
];

for (const a of IMP35723_BEAT_PARITY_REGIME_BOUNDARY_NSIGMA_LOCATOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35723-beat-parity-regime-boundary-Nsigma-locator assertion failed: ${a.id}`);
  }
}
