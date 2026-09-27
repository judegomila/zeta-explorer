/**
 * @module data/imp-124833-sigma-peak-cc-amplitude-elasticity
 * @fileoverview imp-124833 -- measure how the imp-3220/imp-3406 conditional-share
 *   peak (location N_peak, height sigma_max) responds to the E_coll amplitude
 *   C_C/C_H across a PLAUSIBLE band, and tabulate the peak-height ELASTICITY
 *   E_peak = d ln sigma_max / d ln C_C, to quantify how sensitive the
 *   empirical-vs-analytic conditional-gap headline is to the open Step-4 bridge
 *   constant C_H.
 *
 *   THE SETUP. The roadmap currentStatus reports the Step-4 fidelity conditional
 *   share sigma(N) = E_coll(N) / (E_trunc + E_flow + E_coll) peaks at sigma_max ~
 *   0.949 near N ~ 9.22e5, and that the quantitative G6/G6a/C_H bridge fixing the
 *   E_coll amplitude C_H remains OPEN. Because E_coll = C_H * R(N) with C_H a pure
 *   linear prefactor (imp-96311/imp-96349), scaling E_coll by f = C_C/C_C_pinned =
 *   C_H/(1/8) sweeps the amplitude without re-deriving the rate. imp-96370 measured
 *   the peak spread only over the narrow proven interval C_H in [1/8, 0.127]; this
 *   module widens the sweep to a plausible amplitude band f in [1/2, 2] (C_H ~
 *   [1/16, 1/4]) and reports the dimensionless log-log peak-height elasticity, which
 *   imp-96370 did not compute.
 *
 *   THE CLOSED FORM (measurement, then identity). Because C_C is a positive
 *   prefactor, the peak location is EXACTLY amplitude-invariant: writing E_rig =
 *   E_trunc + E_flow (both C_C-free), sigma(N) = 1/(1 + (1/f)(E_rig/E_coll0)) is
 *   monotone in E_rig/E_coll0 at fixed f, so argmax_N sigma = argmax_N (E_coll0/E_rig)
 *   carries no C_C. At the invariant peak N* let R = E_rig/E_coll0 (= 1/18.774 =
 *   0.0532646). Then along the amplitude axis
 *       sigma_max(f) = f / (f + R),
 *   and its elasticity in C_C is
 *       E_peak = d ln sigma_max / d ln C_C = R/(f + R) = 1 - sigma_max(f).
 *   So the peak-height elasticity equals the UNSATURATED REMAINDER 1 - sigma_max
 *   EXACTLY: the headline responds to the bridge amplitude only in proportion to how
 *   far the saturated share sits below 1.
 *
 *   THE FINDING (measurement only).
 *   (1) PEAK LOCATION IS AMPLITUDE-INVARIANT across the whole band f in [1/2, 2]:
 *       N_peak = 9.2186e5 at f = 1/2 and at f = 2 alike (reconfirms imp-96370, now
 *       over a 4x amplitude range rather than the 1.6% proven interval).
 *   (2) PEAK-HEIGHT ELASTICITY IS SMALL AND MONOTONE-DECREASING in C_C: at the
 *       ansatz f = 1 (C_H = 1/8) E_peak = 0.0505710 = 1 - 0.9494290, falling from
 *       0.0962733 at f = 1/2 to 0.0259414 at f = 2 as sigma_max saturates toward 1.
 *       A central-difference numeric elasticity matches the closed form 1 - sigma_max
 *       to 8 digits.
 *   (3) INTERPRETATION. A one-decade error in the open Step-4 amplitude C_H would move
 *       the conditional-gap headline sigma_max by an elasticity of only ~0.05 (a ~5%
 *       log response at the ansatz), and never enough to reposition the peak. The
 *       empirical-vs-analytic conditional-gap headline is robust to the unresolved
 *       bridge constant precisely at the level of its own unsaturated remainder.
 *
 *   MEASUREMENT/SENSITIVITY ONLY on the inherited imp-3220/imp-3406 extrapolation
 *   surrogate, NOT a rigorous asymptotic. C_mb stays GUE-conditional (imp-486); C_H
 *   remains UNPROVEN; this closes no gap, changes no bound, proves no constant, and
 *   does not close G6_polymath15_bridge. RH open. NO QED. Platt-Trudgian Lambda <= 0.2
 *   remains SOTA.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and this
 *   header avoids the close-comment terminator sequence inside prose.
 *
 * @see imp-3220-en-bridge-fidelity-frontier (sigma(N) U-shape, same repo formulas)
 * @see imp-3406-sigma-highN-extrapolation (interior peak N_max ~ 9.22e5, sigma_max ~ 0.9494)
 * @see imp-96370-sigma-peak-ch-sensitivity (peak spread over the narrow [1/8, 0.127] interval)
 * @see imp-96311-ecoll-rate-ch-independence-tabulation (E_coll = C_H * R(N), linear prefactor)
 * @see polymath15-constant-C-C (C_C_PINNED encodes C_H = 1/8)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const PT_BOUND = 0.2; // Platt-Trudgian 2021 SOTA unconditional Lambda upper bound.

// Same C_C-free sub-terms as imp-3220 / imp-3406 (identical repo formulas).
const E_TRUNC_PT = 3.06e-5; // fixed-strip Platt-Trudgian route, N-independent.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// The C_C-free pieces at N: E_rig = E_trunc + E_flow, and the baseline (f=1)
// collision term E_coll0 = C_C_PINNED * sqrt(log T0 / N).
function parts(N) {
  const T0 = effectiveHeightForN(N); // gamma_N via Riemann-von Mangoldt inverse
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // pinned prefactor (imp-398)
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll0 = C_C_PINNED * Math.sqrt(L / N); // C_C = C_C_pinned baseline
  return { E_rig: E_TRUNC_PT + E_flow, E_coll0 };
}

// sigma(N) with E_coll scaled by the amplitude factor f = C_C/C_C_pinned.
function sigma(N, f) {
  const { E_rig, E_coll0 } = parts(N);
  const E_coll = f * E_coll0;
  return E_coll / (E_rig + E_coll);
}

// The amplitude-invariant peak location: argmax_N (E_coll0/E_rig), which carries no
// f, found by ternary search in ln N over the unimodal right arm.
function argmaxPeakLnN(loN, hiN, f) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  const s = (N) => sigma(N, f);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (s(Math.exp(m1)) < s(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

const N_PEAK = argmaxPeakLnN(1e4, 1e9, 1.0); // ~9.2186e5, baseline
const { E_rig: E_RIG_STAR, E_coll0: E_COLL0_STAR } = parts(N_PEAK);
const R_STAR = E_RIG_STAR / E_COLL0_STAR; // ~0.0532646 (= 1 / 18.774)

// Closed form along the amplitude axis at the invariant peak.
const sigmaMaxOf = (f) => f / (f + R_STAR); // = sigma(N_PEAK, f)
const peakElasticityOf = (f) => R_STAR / (f + R_STAR); // = 1 - sigmaMaxOf(f)

// Plausible amplitude band: f = C_C/C_C_pinned = C_H/(1/8) in [1/2, 2] (C_H ~
// [1/16, 1/4]), a 4x span bracketing the ansatz C_H = 1/8 and the generous 0.127.
const BAND_F = [0.5, 0.75, 1.0, 1.016, 1.25, 1.5, 2.0];
const AMPLITUDE_LADDER = BAND_F.map((f) => {
  const sm = sigmaMaxOf(f);
  return {
    f: +f.toFixed(3),
    C_H: +(f * 0.125).toFixed(5),
    N_peak: +argmaxPeakLnN(1e4, 1e9, f).toExponential(4), // invariant: ~9.2186e5
    sigma_max: +sm.toFixed(7),
    elasticity: +peakElasticityOf(f).toFixed(7), // d ln sigma_max / d ln C_C
    unsaturated_remainder: +(1 - sm).toFixed(7), // equals elasticity exactly
  };
});

// Numeric central-difference elasticity at the ansatz f = 1, to confirm the closed
// form E_peak = 1 - sigma_max independently of the algebra.
const H_REL = 1e-4;
const NUMERIC_ELASTICITY_AT_1 =
  (Math.log(sigma(N_PEAK, 1 + H_REL)) - Math.log(sigma(N_PEAK, 1 - H_REL))) /
  (Math.log(1 + H_REL) - Math.log(1 - H_REL));

// Peak-location invariance across the band extremes (grid-free ternary).
const N_PEAK_LO = argmaxPeakLnN(1e4, 1e9, 0.5);
const N_PEAK_HI = argmaxPeakLnN(1e4, 1e9, 2.0);
const PEAK_SHIFT_DEX = Math.abs(Math.log10(N_PEAK_HI) - Math.log10(N_PEAK_LO));

export const IMP124833_SIGMA_PEAK_CC_AMPLITUDE_ELASTICITY = {
  id: 'imp-124833',
  proofSection: 'S-frontier',
  question:
    'How do the imp-3220/imp-3406 conditional-share peak location N_peak and height ' +
    'sigma_max respond to the E_coll amplitude C_C/C_H across a plausible band, and ' +
    'what is the peak-height elasticity d ln sigma_max / d ln C_C? Measurement/' +
    'sensitivity only on the inherited surrogate; no bound change, no QED.',
  model:
    'E_coll = f * E_coll0 with f = C_C/C_C_pinned = C_H/(1/8) a pure prefactor. Peak ' +
    'location is amplitude-invariant (argmax_N sigma = argmax_N E_coll0/E_rig, no f); ' +
    'at the invariant peak N* with R = E_rig/E_coll0, sigma_max(f) = f/(f+R) and its ' +
    'elasticity is d ln sigma_max / d ln C_C = R/(f+R) = 1 - sigma_max(f).',
  peak: {
    N_peak: +N_PEAK.toExponential(4), // ~9.2186e5
    log10_N_peak: +(Math.log10(N_PEAK)).toFixed(4), // ~5.9646
    R_at_peak: +R_STAR.toFixed(7), // ~0.0532646
    eColl0OverERigAtPeak: +(1 / R_STAR).toFixed(4), // ~18.774
    peakLocationShiftDex: +PEAK_SHIFT_DEX.toExponential(3), // ~0 across [1/2, 2]
    invarianceNote:
      'The peak location is EXACTLY amplitude-invariant across the whole band f in ' +
      '[1/2, 2]: N_peak = ' + N_PEAK.toExponential(4) + ' at both extremes (shift ' +
      PEAK_SHIFT_DEX.toExponential(3) + ' dex, i.e. none), because a positive ' +
      'prefactor cannot move argmax_N (E_coll0/E_rig).',
  },
  elasticityAtAnsatz: {
    f: 1.0,
    C_H: 0.125,
    sigma_max: +sigmaMaxOf(1).toFixed(7), // ~0.9494290
    elasticity_closed_form: +peakElasticityOf(1).toFixed(7), // ~0.0505710 = 1 - sigma_max
    elasticity_numeric: +NUMERIC_ELASTICITY_AT_1.toFixed(7),
    identity:
      'd ln sigma_max / d ln C_C = 1 - sigma_max EXACTLY (peak-height elasticity ' +
      'equals the unsaturated remainder); numeric central difference matches to 8 digits.',
  },
  amplitudeLadder: AMPLITUDE_LADDER,
  measurement: {
    peakLocationInvariant:
      'Over a 4x amplitude band the peak stays at N_peak ~ 9.22e5 (zero dex shift): ' +
      'C_C/C_H enters E_coll only as a linear prefactor, so it cannot reposition the ' +
      'conditional-share peak -- only rescale its height.',
    peakHeightElasticitySmall:
      'The peak-height elasticity d ln sigma_max / d ln C_C = 1 - sigma_max is only ' +
      peakElasticityOf(1).toFixed(6) + ' at the ansatz f = 1, falling from ' +
      peakElasticityOf(0.5).toFixed(6) + ' at f = 1/2 to ' +
      peakElasticityOf(2).toFixed(6) + ' at f = 2 as sigma_max saturates toward 1: ' +
      'the headline is elastic to the amplitude only in proportion to its distance below 1.',
    interpretation:
      'The empirical-vs-analytic conditional-gap headline sigma_max ~ 0.949 is robust ' +
      'to the unresolved Step-4 bridge constant C_H: a plausible-band amplitude error ' +
      'moves the location not at all and the height with an elasticity ~0.05 (the ' +
      'unsaturated remainder). What makes E(N) conditional is that C_H is finite-but-' +
      'UNPROVEN, not its precise value.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Sweeping the E_coll amplitude ' +
    'f = C_C/C_C_pinned = C_H/(1/8) across the plausible band [1/2, 2], the imp-3220/' +
    'imp-3406 conditional-share peak LOCATION is exactly amplitude-invariant (N_peak = ' +
    '9.2186e5, zero dex shift -- C_C is a pure prefactor) and its HEIGHT obeys ' +
    'sigma_max(f) = f/(f+R), R = 0.0532646, giving the peak-height elasticity d ln ' +
    'sigma_max / d ln C_C = 1 - sigma_max EXACTLY: 0.0505710 at the ansatz f = 1, ' +
    'declining from 0.0962733 (f=1/2) to 0.0259414 (f=2) as the share saturates. So the ' +
    'empirical-vs-analytic conditional-gap headline is robust to the open Step-4 bridge ' +
    'constant, elastic to the amplitude only at the level of its own unsaturated ' +
    'remainder. C_mb stays GUE-conditional (imp-486); C_H remains UNPROVEN; no gap ' +
    'closed, no bound changed, no closure of G6_polymath15_bridge. RH open. NO QED. ' +
    'Platt-Trudgian Lambda <= ' + PT_BOUND + ' remains SOTA.',
  citation:
    'imp-3220 (sigma(N) U-shape, same repo E(N) formulas); imp-3406 (interior peak ' +
    'N_max ~ 9.22e5, sigma_max ~ 0.9494); imp-96370 (peak spread over the narrow ' +
    '[1/8, 0.127] interval); imp-96311/imp-96349 (E_coll = C_H * R(N), linear ' +
    'prefactor); imp-2642 (C_H = 1/8 ansatz); imp-486 (C_mb GUE-conditional); ' +
    'polymath15-constant-C-C (C_C_PINNED encodes C_H = 1/8).',
};

export const IMP124833_SIGMA_PEAK_CC_AMPLITUDE_ELASTICITY_ASSERTIONS = [
  {
    id: 'imp124833-peak-location-amplitude-invariant',
    description: 'The sigma(N) peak location is amplitude-invariant across the band [1/2, 2]',
    holds: () => PEAK_SHIFT_DEX < 1e-6,
    why:
      'C_C/C_H enters E_coll only as a positive prefactor, so argmax_N sigma = argmax_N ' +
      '(E_coll0/E_rig) carries no amplitude; the peak cannot move over the band. If a ' +
      'future edit makes the peak location amplitude-dependent, this fails and the same ' +
      'commit must justify why.',
  },
  {
    id: 'imp124833-peak-near-9p22e5',
    description: 'The interior peak sits at N_peak ~ 9.22e5 (reproduces the imp-3406 locus)',
    holds: () => Math.abs(Math.log10(N_PEAK) - Math.log10(9.22e5)) < 0.01,
    why:
      'The tabulation must reproduce the imp-3406 interior peak locus N_max ~ 9.22e5, ' +
      'confirming it reuses the identical imp-3220/imp-3406 sub-term formulas, not a fresh model.',
  },
  {
    id: 'imp124833-elasticity-equals-unsaturated-remainder',
    description: 'The peak-height elasticity d ln sigma_max / d ln C_C equals 1 - sigma_max exactly',
    holds: () =>
      BAND_F.every(
        (f) => Math.abs(peakElasticityOf(f) - (1 - sigmaMaxOf(f))) < 1e-12,
      ),
    why:
      'sigma_max(f) = f/(f+R) gives d ln sigma_max / d ln C_C = R/(f+R) = 1 - sigma_max; ' +
      'the elasticity is the unsaturated remainder of the saturated share at every amplitude.',
  },
  {
    id: 'imp124833-numeric-matches-closed-form-at-ansatz',
    description: 'The numeric central-difference elasticity at f=1 matches 1 - sigma_max to 8 digits',
    holds: () =>
      Math.abs(NUMERIC_ELASTICITY_AT_1 - (1 - sigmaMaxOf(1))) < 1e-7,
    why:
      'An independent central-difference of ln sigma_max in ln C_C must reproduce the ' +
      'closed-form elasticity 1 - sigma_max, guarding the algebra against a sign or ' +
      'prefactor slip.',
  },
  {
    id: 'imp124833-elasticity-small-and-decreasing',
    description: 'The peak-height elasticity is small (~0.05 at f=1) and monotone-decreasing in C_C',
    holds: () =>
      Math.abs(peakElasticityOf(1) - 0.0505710) < 5e-6 &&
      peakElasticityOf(0.5) > peakElasticityOf(1) &&
      peakElasticityOf(1) > peakElasticityOf(2),
    why:
      'The headline is elastic to the open bridge amplitude only at the level of its ' +
      'unsaturated remainder (~0.05 at the ansatz), and that sensitivity shrinks as the ' +
      'share saturates toward 1 with larger C_C -- the robustness point of the ticket.',
  },
  {
    id: 'imp124833-honesty-gate-no-qed',
    description: 'Measurement only: names the C_H/C_mb conditional, no QED, PT stays SOTA',
    holds: () =>
      IMP124833_SIGMA_PEAK_CC_AMPLITUDE_ELASTICITY.isRigorous === false &&
      /C_H remains UNPROVEN/.test(IMP124833_SIGMA_PEAK_CC_AMPLITUDE_ELASTICITY.verdict) &&
      /NO QED/.test(IMP124833_SIGMA_PEAK_CC_AMPLITUDE_ELASTICITY.verdict) &&
      /remains SOTA/.test(IMP124833_SIGMA_PEAK_CC_AMPLITUDE_ELASTICITY.verdict),
    why:
      'This ticket is measurement/sensitivity only: it must not assert closure of ' +
      'G6_polymath15_bridge, must not change any bound, and must not reclassify the ' +
      'unproven C_H as rigorous.',
  },
];

for (const a of IMP124833_SIGMA_PEAK_CC_AMPLITUDE_ELASTICITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-124833-sigma-peak-cc-amplitude-elasticity assertion failed: ${a.id}`,
    );
  }
}
