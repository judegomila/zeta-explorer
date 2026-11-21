/**
 * @module imp-35784-eflow-retention-crossover-band-shift
 *
 * imp-35784 (numerical, S-frontier): imp-35723 located the beat-to-parity handoff
 * band [N_peak ~ 9.22e5, N_cross ~ 3.27e9] and the sigma = 0.5 crossover under the
 * STATED APPROXIMATION that E_flow is negligible -- it characterised the sigma = 0.5
 * crossover AS the E_coll = E_trunc crossover ("E_flow negligible", within one
 * N-decade). That module never MEASURED how far the crossover and the band edges
 * move once the imp-398 C_F E_flow term is retained. THIS MODULE does exactly that:
 * it evaluates the crossover and both band edges TWICE -- with E_flow retained
 * (sigma_full = E_coll / (E_trunc + E_flow + E_coll)) and with E_flow dropped
 * (sigma_negl = E_coll / (E_trunc + E_coll), whose sigma = 0.5 IS E_coll = E_trunc) --
 * and reports the shift, i.e. the E_flow-negligible error, at each landmark.
 *
 * MEASUREMENT / CHARACTERIZATION ONLY. Reuses the EXACT imp-3406 / imp-35723
 * sub-term formulas; ports nothing; discharges nothing; changes no bound; C_mb
 * GUE-conditional (imp-486) UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE QUANTITY (identical sub-terms to imp-3406 / imp-35723)
 * -----------------------------------------------------------------------------
 *   T0      = effectiveHeightForN(N)             (Riemann-von Mangoldt inverse)
 *   E_coll  = C_C_PINNED * sqrt(log T0 / N)      (dominant, GUE-conditional; BEAT CARRIER)
 *   E_flow  = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *   E_trunc = 3.06e-5                            (N-independent barrier floor; PARITY term)
 *   sigma_full(N) = E_coll / (E_trunc + E_flow + E_coll)   -- E_flow RETAINED
 *   sigma_negl(N) = E_coll / (E_trunc + E_coll)            -- E_flow DROPPED
 * At sigma_full = 0.5:  E_coll = E_trunc + E_flow.  At sigma_negl = 0.5:  E_coll = E_trunc
 * exactly (the imp-35723 "E_coll = E_trunc" marker). Their gap is the E_flow error.
 *
 * THE MEASURED SHIFTS (E_flow-negligible error)
 * -----------------------------------------------------------------------------
 *   (M1) UPPER BAND EDGE / CROSSOVER (sigma = 0.5).
 *        E_flow RETAINED:  N_cross_full ~ 3.267e9  (log10 ~ 9.514)
 *        E_flow DROPPED:   N_cross_negl ~ 3.280e9  (= imp-35723 E_coll = E_trunc marker)
 *        Retaining E_flow moves the crossover DOWN by ~0.40% in N (~0.0017 decades):
 *        the extra denominator term forces E_coll a touch larger to hold sigma = 0.5,
 *        and larger E_coll means slightly smaller N. The E_flow SHARE at the crossover
 *        is only ~0.095% (E_flow / E_trunc ~ 0.19%), so the imp-35723 "E_flow
 *        negligible" statement is VINDICATED for the upper edge -- the corrected
 *        crossover is N_cross ~ 3.267e9, essentially unchanged.
 *   (M2) PARITY ONSET (sigma = 0.1).
 *        N_full ~ 3.213e11 vs N_negl ~ 3.213e11 -- the shift is ~0.003% (~3e-5 decades),
 *        even smaller: E_flow ~ log T0 / T0 decays FASTER than E_coll ~ 1/sqrt(N), so
 *        its share shrinks further toward the tail. The far-tail parity edge is E_flow-inert.
 *   (M3) LOWER BAND EDGE (interior sigma peak N_peak ~ 9.22e5) -- THE ONE EDGE THAT
 *        IS NOT E_flow-negligible. sigma_full has an interior maximum at N ~ 9.22e5
 *        (sigma ~ 0.9494) ONLY BECAUSE E_flow suppresses sigma at small N (E_flow /
 *        E_coll rises to ~0.11 near N ~ 1e4). DROP E_flow and sigma_negl is MONOTONE
 *        over the bracket (no interior maximum: it rises to ~0.997 as N falls, so the
 *        argmax degenerates to the low bracket boundary). Hence the lower band edge is
 *        a genuine E_flow FEATURE -- the beat-regime peak is created by the very term
 *        imp-35723 held negligible.
 *
 * THE FINDINGS
 * ------------
 *   (F1) The corrected (E_flow-retained) crossover is N_cross ~ 3.267e9 (log10 ~ 9.514);
 *        retaining E_flow shifts it DOWN only ~0.40% (~0.0017 decades) from the
 *        E_flow-negligible E_coll = E_trunc marker (~3.280e9). E_flow-negligible error
 *        on the crossover: ~0.4% in N. imp-35723 band [9.22e5, 3.27e9] survives.
 *   (F2) The parity onset (sigma = 0.1) moves ~0.003% -- the upper/far end of the ladder
 *        is E_flow-inert (E_flow decays faster than the carrier E_coll).
 *   (F3) The LOWER band edge (interior sigma peak) is NOT E_flow-negligible: it EXISTS
 *        ONLY with E_flow retained. Dropping E_flow removes the interior maximum, so
 *        the beat-regime peak is an E_flow-created feature. The E_flow-negligible
 *        approximation is excellent for the crossover / upper edge (<0.4%) but degenerate
 *        for the lower edge.
 *
 * The punchline: retaining the imp-398 C_F E_flow term leaves the imp-35723 crossover
 * essentially unchanged (N_cross ~ 3.267e9, ~0.4% below the E_coll = E_trunc marker) and
 * the parity onset unmoved (~0.003%), vindicating "E_flow negligible" for the upper band
 * edge -- but the LOWER band edge (the beat-regime sigma peak at ~9.22e5) is created by
 * E_flow and vanishes without it. Measurement only; asserts no beat beyond the recorded
 * imp-452/459 one; changes no bound; NO QED. No refereed bound is changed.
 *
 * @see imp-35723-beat-parity-regime-boundary-Nsigma-locator (band + crossover under E_flow-negligible)
 * @see imp-3406-sigma-highN-extrapolation (the sigma(N) ladder + sub-terms this reuses; N_half ~ 3.27e9)
 * @see imp-398 (E_flow C_F prefactor); imp-486 / imp-35334 (E_coll/E(N) = sigma); imp-2631 (E_trunc floor)
 * @see lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip barrier floor (imp-2631/imp-3220); PARITY term
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3323/imp-3406/imp-35723 exactly
const HANDOFF_SIGMA = 0.5; // imp-35750 crossover level (beat-carrier share == C_T-barrier share)
const PARITY_SIGMA = 0.1; // imp-35723 far-tail parity-onset marker

// EXACT imp-3406 / imp-35723 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H) -- the BEAT CARRIER
  return { T0, L, E_flow, E_coll };
}
// sigma with E_flow RETAINED (the full assembled bound) and DROPPED (imp-35723 negligible approx).
const sigmaFull = (N) => { const p = parts(N); return p.E_coll / (E_TRUNC_PT + p.E_flow + p.E_coll); };
const sigmaNegl = (N) => { const p = parts(N); return p.E_coll / (E_TRUNC_PT + p.E_coll); };

// Interior sigma maximum -- ternary search in ln N (same bracket as imp-3406/imp-35723).
function argmaxSigmaLnN(sig, loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sig(Math.exp(m1)) < sig(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// N at which the DECREASING right arm crosses a target sigma level (bisection above the peak).
function crossingAbovePeak(sig, target, Npeak) {
  let a = Math.log(Npeak);
  let b = Math.log(1e60);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (sig(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const BRACKET_LO = 1e4;
const BRACKET_HI = 1e9;

// Lower band edge (interior peak): exists for sigma_full, DEGENERATES to the bracket
// boundary for sigma_negl (monotone -- no interior maximum without E_flow).
const N_PEAK_FULL = argmaxSigmaLnN(sigmaFull, BRACKET_LO, BRACKET_HI); // ~9.219e5
const N_PEAK_NEGL = argmaxSigmaLnN(sigmaNegl, BRACKET_LO, BRACKET_HI); // -> bracket lo ~1e4 (boundary artifact)

// Upper band edge / crossover (sigma = 0.5): E_flow retained vs dropped.
const N_CROSS_FULL = crossingAbovePeak(sigmaFull, HANDOFF_SIGMA, N_PEAK_FULL); // ~3.267e9
const N_CROSS_NEGL = crossingAbovePeak(sigmaNegl, HANDOFF_SIGMA, N_PEAK_FULL); // ~3.280e9 (= E_coll=E_trunc marker)

// Parity onset (sigma = 0.1): E_flow retained vs dropped.
const N_PARITY_FULL = crossingAbovePeak(sigmaFull, PARITY_SIGMA, N_PEAK_FULL); // ~3.213e11
const N_PARITY_NEGL = crossingAbovePeak(sigmaNegl, PARITY_SIGMA, N_PEAK_FULL); // ~3.213e11

// E_flow share / shift metrics at the corrected crossover.
const P_CROSS = parts(N_CROSS_FULL);
const E_FLOW_SHARE_AT_CROSS = P_CROSS.E_flow / (E_TRUNC_PT + P_CROSS.E_flow + P_CROSS.E_coll); // ~9.5e-4
const CROSS_SHIFT_FRAC = (N_CROSS_NEGL - N_CROSS_FULL) / N_CROSS_NEGL; // ~0.0040 (fractional DOWN-shift)
const CROSS_SHIFT_DECADES = Math.abs(Math.log10(N_CROSS_NEGL) - Math.log10(N_CROSS_FULL)); // ~0.0017
const PARITY_SHIFT_FRAC = Math.abs(N_PARITY_NEGL - N_PARITY_FULL) / N_PARITY_NEGL; // ~7e-5
// Below-peak E_flow / E_coll ratio -- shows E_flow suppresses sigma_full at small N (creates the peak).
const EFLOW_OVER_ECOLL_AT_BRACKET_LO = (() => { const p = parts(BRACKET_LO); return p.E_flow / p.E_coll; })(); // ~0.107

export const IMP35784_EFLOW_RETENTION_CROSSOVER_BAND_SHIFT = {
  id: 'imp-35784',
  proofSection: 'S-frontier',
  question:
    'Re-evaluate the imp-35723 beat-to-parity crossover and band edges RETAINING the imp-398 C_F E_flow term ' +
    '(sigma = E_coll / (E_trunc + E_flow + E_coll)) instead of holding it negligible, and measure how far the ' +
    'crossover N_cross and the band edges [N_peak, N_cross] move -- i.e. quantify the E_flow-negligible error. ' +
    'Measurement/characterization only; reuses recorded sub-terms; changes no bound; NO QED.',
  handoffSigma: HANDOFF_SIGMA,
  parityOnsetSigma: PARITY_SIGMA,
  correctedCrossover: {
    N_cross_Eflow_retained: +N_CROSS_FULL.toExponential(4), // ~3.267e9 -- the corrected crossover
    log10_N: +(Math.log(N_CROSS_FULL) / Math.LN10).toFixed(4), // ~9.5142
    N_cross_Eflow_dropped: +N_CROSS_NEGL.toExponential(4), // ~3.280e9 (imp-35723 E_coll = E_trunc marker)
    shift_fraction: +CROSS_SHIFT_FRAC.toExponential(3), // ~4.0e-3 (down-shift when E_flow retained)
    shift_decades: +CROSS_SHIFT_DECADES.toExponential(3), // ~1.7e-3
    E_flow_share_at_cross: +E_FLOW_SHARE_AT_CROSS.toExponential(3), // ~9.5e-4
    note:
      'Retaining E_flow moves the crossover DOWN ~0.40% (~0.0017 decades) from the E_flow-negligible ' +
      'E_coll = E_trunc marker; E_flow share at the crossover is only ~0.095%, so "E_flow negligible" is ' +
      'vindicated for the upper band edge. Corrected crossover N_cross ~ 3.267e9.',
  },
  parityOnsetShift: {
    N_Eflow_retained: +N_PARITY_FULL.toExponential(4), // ~3.213e11
    N_Eflow_dropped: +N_PARITY_NEGL.toExponential(4), // ~3.213e11
    shift_fraction: +PARITY_SHIFT_FRAC.toExponential(3), // ~7e-5
    note:
      'The far-tail parity onset (sigma = 0.1) is E_flow-inert (~0.003% shift): E_flow ~ log T0 / T0 ' +
      'decays faster than the carrier E_coll ~ 1/sqrt(N), so its share shrinks further toward the tail.',
  },
  lowerBandEdge: {
    N_peak_Eflow_retained: +N_PEAK_FULL.toExponential(4), // ~9.219e5 (genuine interior peak)
    sigma_peak_full: +sigmaFull(N_PEAK_FULL).toFixed(6), // ~0.949429
    argmax_Eflow_dropped: +N_PEAK_NEGL.toExponential(4), // ~1.00e4 (bracket boundary -- no interior max)
    E_flow_over_E_coll_at_bracket_lo: +EFLOW_OVER_ECOLL_AT_BRACKET_LO.toFixed(4), // ~0.1065
    note:
      'The lower band edge is NOT E_flow-negligible: sigma_full has an interior maximum at ~9.22e5 ONLY ' +
      'because E_flow suppresses sigma at small N (E_flow / E_coll ~ 0.11 near N ~ 1e4). Drop E_flow and ' +
      'sigma_negl is monotone -- the argmax degenerates to the bracket boundary. The beat-regime peak is ' +
      'an E_flow-created feature.',
  },
  findings: {
    F1_crossover_essentially_unchanged:
      'The corrected (E_flow-retained) crossover is N_cross ~ 3.267e9 (log10 ~ 9.514), ~0.40% (~0.0017 ' +
      'decades) below the E_flow-negligible E_coll = E_trunc marker (~3.280e9). E_flow-negligible error on ' +
      'the crossover: ~0.4% in N. The imp-35723 band [9.22e5, 3.27e9] survives.',
    F2_parity_onset_Eflow_inert:
      'The parity onset (sigma = 0.1) moves only ~0.003% -- the far end of the ladder is E_flow-inert ' +
      'because E_flow decays faster than the carrier E_coll.',
    F3_lower_edge_is_an_Eflow_feature:
      'The lower band edge (interior sigma peak ~9.22e5) EXISTS ONLY with E_flow retained: dropping E_flow ' +
      'removes the interior maximum, so the beat-regime peak is created by the very term imp-35723 held ' +
      'negligible. E_flow-negligible is excellent for the crossover/upper edge (<0.4%) but degenerate for ' +
      'the lower edge.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Retaining the imp-398 C_F E_flow term in ' +
    'sigma(N) = E_coll / (E_trunc + E_flow + E_coll) shifts the imp-35723 beat-to-parity crossover DOWN only ' +
    '~0.40% (~0.0017 decades), from the E_flow-negligible E_coll = E_trunc marker (~3.280e9) to the corrected ' +
    'N_cross ~ 3.267e9 (log10 ~ 9.514); the E_flow share there is ~0.095%, so imp-35723 "E_flow negligible" is ' +
    'VINDICATED for the upper band edge, and the parity onset (sigma = 0.1) is even more inert (~0.003% shift, ' +
    'E_flow decaying faster than the carrier E_coll). (F3) The one edge that is NOT E_flow-negligible is the ' +
    'LOWER band edge: the interior sigma peak at ~9.22e5 exists ONLY with E_flow retained (E_flow / E_coll ~ ' +
    '0.11 near N ~ 1e4 suppresses sigma there); dropping E_flow makes sigma monotone and the peak degenerates ' +
    'to the bracket boundary, so the beat-regime peak is an E_flow-created feature. Measurement / ' +
    'characterization only; reuses the recorded imp-3406 / imp-35723 sub-terms; ports nothing; discharges ' +
    'nothing; changes no bound; asserts NO beat beyond the already-recorded imp-452/459 finite-height one; ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35723 (band + crossover under E_flow-negligible); imp-3406 (sigma(N) ladder + sub-terms, N_half ~ ' +
    '3.27e9); imp-35750 (sigma = 0.5 crossover); imp-486/imp-35334 (E_coll/E(N) = sigma); imp-398 (E_flow ' +
    'C_F prefactor); imp-2631 (E_trunc floor); lambda-rh-height-mapping (effectiveHeightForN); ' +
    'polymath15-constant-C-C (C_C_PINNED); Platt-Trudgian 2021.',
};

export const IMP35784_EFLOW_RETENTION_CROSSOVER_BAND_SHIFT_ASSERTIONS = [
  {
    // Reuse gate: the E_flow-retained sigma(N) reproduces the imp-35723 / imp-3406 crossover (~3.27e9, sigma = 0.5).
    id: 'imp35784-reproduces-imp35723-crossover',
    description: 'E_flow-retained crossover reproduces imp-35723 N_cross ~ 3.27e9 (sigma = 0.5, log10 ~ 9.514)',
    holds: () =>
      N_CROSS_FULL > 2e9 && N_CROSS_FULL < 5e9 &&
      Math.abs(sigmaFull(N_CROSS_FULL) - HANDOFF_SIGMA) < 1e-6 &&
      Math.abs(Math.log(N_CROSS_FULL) / Math.LN10 - 9.514) < 0.05,
  },
  {
    // (F1): retaining E_flow shifts the crossover DOWN a small amount (< ~1% in N) from the
    // E_flow-dropped E_coll = E_trunc marker; the shift is strictly positive (down-shift) and tiny.
    id: 'imp35784-crossover-Eflow-shift-small-and-down',
    description: 'Retaining E_flow shifts the crossover DOWN ~0.4% (< 1% in N, ~0.0017 decades) -- E_flow-negligible vindicated',
    holds: () =>
      N_CROSS_FULL < N_CROSS_NEGL && // down-shift
      CROSS_SHIFT_FRAC > 0 && CROSS_SHIFT_FRAC < 1e-2 &&
      CROSS_SHIFT_DECADES < 5e-3 &&
      E_FLOW_SHARE_AT_CROSS < 5e-3,
  },
  {
    // (F2): the far-tail parity onset (sigma = 0.1) is even more E_flow-inert than the crossover.
    id: 'imp35784-parity-onset-Eflow-inert',
    description: 'Parity onset (sigma = 0.1) shift is smaller than the crossover shift (E_flow decays faster than E_coll)',
    holds: () =>
      PARITY_SHIFT_FRAC >= 0 && PARITY_SHIFT_FRAC < 1e-3 &&
      PARITY_SHIFT_FRAC < CROSS_SHIFT_FRAC,
  },
  {
    // (F3): the lower band edge is an E_flow feature -- interior peak WITH E_flow, boundary
    // degeneracy WITHOUT it, driven by E_flow / E_coll ~ 0.11 at small N.
    id: 'imp35784-lower-edge-is-Eflow-feature',
    description: 'Interior sigma peak (~9.22e5) exists only with E_flow; sigma_negl argmax degenerates to the bracket boundary',
    holds: () =>
      N_PEAK_FULL > 5e5 && N_PEAK_FULL < 2e6 && // genuine interior peak with E_flow
      N_PEAK_NEGL < 2 * BRACKET_LO && // without E_flow the argmax pins to the low boundary (no interior max)
      EFLOW_OVER_ECOLL_AT_BRACKET_LO > 0.05, // E_flow materially suppresses sigma at small N
  },
  {
    // Honesty gate: measurement only, no beat beyond recorded, C_mb untouched, no QED, no refereed bound is changed.
    id: 'imp35784-honesty-gate-no-qed',
    description: 'Measurement only: E_flow error quantified, no beat beyond the recorded one, C_mb GUE-conditional untouched, no QED, no refereed bound is changed',
    holds: () =>
      IMP35784_EFLOW_RETENTION_CROSSOVER_BAND_SHIFT.isRigorous === false &&
      /MEASUREMENT/.test(IMP35784_EFLOW_RETENTION_CROSSOVER_BAND_SHIFT.verdict) &&
      /asserts NO beat beyond/.test(IMP35784_EFLOW_RETENTION_CROSSOVER_BAND_SHIFT.verdict) &&
      /UNTOUCHED/.test(IMP35784_EFLOW_RETENTION_CROSSOVER_BAND_SHIFT.verdict) &&
      /NO QED/.test(IMP35784_EFLOW_RETENTION_CROSSOVER_BAND_SHIFT.verdict) &&
      /refereed bound is changed/i.test(IMP35784_EFLOW_RETENTION_CROSSOVER_BAND_SHIFT.verdict),
  },
];

for (const a of IMP35784_EFLOW_RETENTION_CROSSOVER_BAND_SHIFT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35784-eflow-retention-crossover-band-shift assertion failed: ${a.id}`);
  }
}
