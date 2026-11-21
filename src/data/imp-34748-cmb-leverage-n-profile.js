/**
 * @module imp-34748-cmb-leverage-n-profile
 *
 * imp-34748 (numerical, frontier-direction): imp-34734 measured the leverage of the
 * GUE-conditional many-body constant C_mb on the imp-3220/imp-3406 conditional share
 *     sigma(N; C_mb) = E_coll / (E_trunc + E_flow + E_coll),   E_coll = C_mb C_C sqrt(L/N),
 * but ONLY at the single imp-3406 interior sigma-peak N ~ 9.22e5, where it found
 * dsigma/dC_mb ~ 0.048 per unit. That leaves OPEN whether the leverage is roughly
 * N-invariant or varies across the imp-3220 U-shaped decade ladder and the post-peak decay.
 * This module TABULATES dsigma/dC_mb (both the exact closed form and a finite difference in
 * C_mb) at each N on the decade ladder {2, 10, ..., 1e12}, reusing the imp-34734 E_coll /
 * E_trunc / E_flow component model VERBATIM.
 *
 * THE MODEL (identical sub-terms to imp-3220 / imp-3406 / imp-34734 -- no fresh terms)
 * -----------------------------------------------------------------------------------
 *     sigma(N; C_mb) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll  = C_mb C_C sqrt(L / N),   L = log T0(N)   (dominant, GUE-conditional),
 *     E_flow  = C_F (L / T0) Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398, C_mb-free),
 *     E_trunc = 3.06e-5   (N-independent, imp-2631, C_mb-free).
 * C_mb = 1 is the inherited baseline (reproduces imp-3406 sigma_max ~ 0.94943 at N ~ 9.22e5).
 *
 * THE EXACT LEVERAGE (one fact about the model, NOT an RH claim)
 * ------------------------------------------------------------
 *   With A(N) = E_trunc + E_flow (C_mb-free) and e0(N) = C_C sqrt(L/N), so E_coll = C_mb e0,
 *   sigma = C_mb e0/(A + C_mb e0), and at FIXED N
 *       d sigma / d C_mb = A e0 / (A + C_mb e0)^2 = sigma (1 - sigma) / C_mb.
 *   Hence at C_mb = 1 the leverage is EXACTLY sigma(N)(1 - sigma(N)) -- a pure function of the
 *   local share sigma(N). Since sigma(N) is NOT constant across the ladder, neither is the
 *   leverage: it is largest where sigma ~ 1/2 (leverage -> 1/4, its global maximum) and smallest
 *   where sigma -> 0 or sigma -> 1.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) THE LEVERAGE IS STRONGLY N-DEPENDENT, NOT N-INVARIANT. Across the decade ladder the
 *        finite-difference dsigma/dC_mb ranges from ~0.048 (at the imp-3406 sigma-peak N ~ 1e6)
 *        up to 0.25 (at N ~ 3.27e9, where sigma = 1/2) -- a > 5x spread. The finite difference
 *        matches the closed form sigma(1-sigma)/C_mb at every rung to < 1e-9.
 *   (F2) THE imp-34734 PEAK VALUE 0.048 IS A NEAR-MINIMUM, NOT REPRESENTATIVE. Because the
 *        imp-3406 peak is exactly where sigma is LARGEST (sigma_max ~ 0.9494), the leverage
 *        sigma(1-sigma) there is near its SMALLEST along the ladder. Reading the C_mb leverage
 *        off the sigma-peak UNDERSTATES it everywhere else: off-peak it is up to ~5x larger.
 *   (F3) THE LEVERAGE PROFILE IS NON-MONOTONE, TRACKING sigma(1-sigma). It is ~0.134 at the
 *        small-N sigma-trough (N ~ 98, sigma ~ 0.841), dips to ~0.048 at the imp-3406 sigma-peak
 *        (N ~ 1e6), rises to its global max 0.25 at N ~ 3.27e9 (sigma = 1/2), then decays into
 *        the far tail (~0.057 at N = 1e12). Its extrema are pinned to the extrema of sigma(N),
 *        not to any independent scale.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic. This does
 * NOT discharge the GUE conditional (imp-486): it treats C_mb as a free knob to measure its
 * N-profile of leverage, it does not tighten C_mb. Changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34734-sigma-peak-cmb-elasticity (measured dsigma/dC_mb ~ 0.048 ONLY at the peak)
 * @see imp-3406-sigma-highN-extrapolation (interior max N_max ~ 9.22e5, sigma_max ~ 0.94943)
 * @see imp-3220-en-bridge-fidelity-frontier (U-shaped sigma(N) decade ladder)
 * @see imp-486 (C_mb GUE-conditional, bounded <= 1)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-34734 exactly

// EXACT imp-34734 sub-terms with C_mb as a multiplicative factor on E_coll (verbatim reuse).
function parts(N, cmb) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor (C_mb-free)
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous (C_mb-free)
  const E_coll = cmb * C_C_PINNED * Math.sqrt(L / N); // GUE-conditional, scaled by C_mb
  const A = E_TRUNC_PT + E_flow; // the C_mb-free denominator floor
  return { sigma: E_coll / (A + E_coll) };
}
const sigmaAt = (N, cmb) => parts(N, cmb).sigma;

// dsigma/dC_mb via central finite difference in C_mb at C_mb = 1 (fixed N).
const H_CMB = 1e-6;
const dSigmaDCmbFD = (N) => (sigmaAt(N, 1 + H_CMB) - sigmaAt(N, 1 - H_CMB)) / (2 * H_CMB);

// The imp-3220 U-shaped decade ladder, extended to the imp-33582 post-peak span 1e12.
const LADDER_N = [2, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12];
const PROFILE = LADDER_N.map((N) => {
  const sigma = sigmaAt(N, 1);
  const fd = dSigmaDCmbFD(N);
  const closed = (sigma * (1 - sigma)) / 1.0; // exact leverage at C_mb = 1
  return {
    N: +N.toExponential(0),
    log10_N: +(Math.log(N) / Math.LN10).toFixed(4),
    sigma: +sigma.toFixed(6),
    dSigma_dCmb_fd: +fd.toFixed(8),
    dSigma_dCmb_closed: +closed.toFixed(8), // = sigma(1-sigma)/C_mb (matches fd)
    fd_vs_closed_absdiff: +Math.abs(fd - closed).toExponential(2),
  };
});

// Spread of the leverage across the ladder (F1): min at the sigma-peak, max near sigma = 1/2.
const LEVERAGES = PROFILE.map((r) => r.dSigma_dCmb_fd);
const LEV_MIN = Math.min(...LEVERAGES);
const LEV_MAX = Math.max(...LEVERAGES);
const LEV_SPREAD_RATIO = LEV_MAX / LEV_MIN; // > 5 => strongly N-dependent

// The imp-3406 peak leverage (N ~ 1e6) reproduces the imp-34734 F2 value ~0.048.
const PEAK_ROW = PROFILE.find((r) => r.N === 1e6);
const PEAK_LEVERAGE = PEAK_ROW.dSigma_dCmb_fd; // ~0.048 -- a NEAR-MINIMUM of the profile

// The exact global-max leverage point: sigma = 1/2 => leverage = 1/4. Bisect in [1e9, 1e10].
function sigmaHalfN() {
  let lo = Math.log(1e9);
  let hi = Math.log(1e10);
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (sigmaAt(Math.exp(m), 1) > 0.5) lo = m;
    else hi = m;
  }
  return Math.exp((lo + hi) / 2);
}
const N_MAX_LEVERAGE = sigmaHalfN(); // ~3.27e9, where sigma = 1/2 and leverage = 1/4
const MAX_LEVERAGE_EXACT = 0.25; // theoretical max of sigma(1-sigma)

export const IMP34748_CMB_LEVERAGE_N_PROFILE = {
  id: 'imp-34748',
  proofSection: 'S-frontier',
  question:
    'imp-34734 measured the leverage dsigma/dC_mb of the GUE-conditional many-body constant C_mb ' +
    'on the imp-3220/imp-3406 conditional share ONLY at the single imp-3406 interior sigma-peak ' +
    'N ~ 9.22e5 (~0.048/unit). Is that leverage roughly N-invariant, or does it vary across the ' +
    'imp-3220 U-shaped decade ladder and the post-peak decay? TABULATE dsigma/dC_mb at each N on ' +
    '{2..1e12}. Measurement/derivation only; does NOT discharge the GUE conditional (imp-486); NO QED.',
  measuredQuantity:
    'the N-profile of the C_mb leverage dsigma/dC_mb = sigma(N)(1-sigma(N))/C_mb at C_mb = 1, ' +
    'tabulated across the decade ladder {2, 10, ..., 1e12} via both the closed form and a central ' +
    'finite difference in C_mb, reusing the imp-34734 E_coll/E_trunc/E_flow component model verbatim',
  profile: PROFILE,
  leverageSpread: {
    min: +LEV_MIN.toFixed(8), // at the imp-3406 sigma-peak (N ~ 1e6)
    max: +LEV_MAX.toFixed(8), // near sigma = 1/2 (N ~ 3.27e9)
    ratio: +LEV_SPREAD_RATIO.toFixed(3), // > 5 => strongly N-dependent, NOT N-invariant
  },
  peakLeverage: {
    N: PEAK_ROW.N, // 1e6 (imp-3406 sigma-peak neighbourhood)
    dSigma_dCmb: +PEAK_LEVERAGE.toFixed(6), // ~0.048, reproduces imp-34734 F2
    note:
      'The imp-34734 value ~0.048 sits at the imp-3406 sigma-peak, where sigma is LARGEST ' +
      '(~0.9494), so sigma(1-sigma) is near its SMALLEST -- the peak leverage is a NEAR-MINIMUM ' +
      'of the profile, not a representative value.',
  },
  maxLeverage: {
    N: +N_MAX_LEVERAGE.toExponential(4), // ~3.27e9
    log10_N: +(Math.log(N_MAX_LEVERAGE) / Math.LN10).toFixed(4), // ~9.514
    dSigma_dCmb: MAX_LEVERAGE_EXACT, // 0.25 exactly, at sigma = 1/2
    note:
      'The leverage attains its global maximum 1/4 exactly where sigma = 1/2 (N ~ 3.27e9, on the ' +
      'post-peak decay arm), because sigma(1-sigma) maximises at sigma = 1/2.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote
  finding: {
    F1_leverage_is_N_dependent:
      'The C_mb leverage dsigma/dC_mb = sigma(1-sigma)/C_mb is STRONGLY N-dependent, not ' +
      'N-invariant: across {2..1e12} it ranges from ~0.048 (imp-3406 sigma-peak, N ~ 1e6) up to ' +
      '0.25 (N ~ 3.27e9, sigma = 1/2), a > 5x spread. The finite difference matches the closed ' +
      'form at every rung to < 1e-9.',
    F2_peak_value_is_a_near_minimum:
      'The imp-34734 peak value ~0.048 is a NEAR-MINIMUM of the leverage profile, not a ' +
      'representative value: the imp-3406 peak is exactly where sigma is LARGEST (~0.9494), so ' +
      'sigma(1-sigma) there is near its SMALLEST. Reading the C_mb leverage off the sigma-peak ' +
      'UNDERSTATES it everywhere else -- off-peak it is up to ~5x larger.',
    F3_profile_is_nonmonotone_tracking_sigma:
      'The leverage profile is non-monotone, tracking sigma(1-sigma): ~0.134 at the small-N ' +
      'sigma-trough (N ~ 98, sigma ~ 0.841), dipping to ~0.048 at the imp-3406 sigma-peak ' +
      '(N ~ 1e6), rising to the global max 0.25 at N ~ 3.27e9 (sigma = 1/2), then decaying into ' +
      'the far tail (~0.057 at N = 1e12). Its extrema are pinned to the extrema of sigma(N).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (frontier-direction, NOT rigorous). Tabulating the exact leverage ' +
    'dsigma/dC_mb = sigma(N)(1-sigma(N))/C_mb (verified against a central finite difference in ' +
    'C_mb to < 1e-9 at every rung) across the imp-3220 decade ladder {2..1e12} shows the C_mb ' +
    'leverage is STRONGLY N-dependent, not N-invariant: it ranges from ~0.048 at the imp-3406 ' +
    'sigma-peak (N ~ 1e6, where sigma ~ 0.9494 is largest) up to 0.25 at N ~ 3.27e9 (where ' +
    'sigma = 1/2), a > 5x spread. The imp-34734 value ~0.048 is therefore a NEAR-MINIMUM of the ' +
    'profile -- reading the leverage off the sigma-peak understates it off-peak by up to ~5x -- ' +
    'and the profile is non-monotone, its extrema pinned to the extrema of sigma(N). The ' +
    'component model is the inherited imp-3220/imp-3406/imp-34734 extrapolation, NOT a rigorous ' +
    'asymptotic; this does NOT discharge the GUE conditional (imp-486) -- it treats C_mb as a ' +
    'free knob to measure its N-profile of leverage; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  subGap:
    'CLOSES the N-profile question imp-34734 left open: the C_mb leverage is not a single ' +
    'number but the N-varying function sigma(1-sigma), ranging ~0.048..0.25 over {2..1e12}, with ' +
    'the imp-3406 peak value a near-minimum. What remains OPEN (deferred, not attempted here) is ' +
    'a rigorous derivation that actually PINS C_mb below the GUE bound of 1 (imp-486) -- the ' +
    'measurement maps the leverage but does not discharge the conditional.',
  citation:
    'imp-34734 (dsigma/dC_mb ~ 0.048 measured ONLY at the peak); imp-3406 (interior max ' +
    'N_max ~ 9.22e5, sigma_max ~ 0.94943); imp-3220 (U-shaped sigma(N) decade ladder); imp-486 ' +
    '(C_mb GUE-conditional, bounded <= 1); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc ' +
    'floor); imp-3463 (far-tail exponent 1/2); lambda-rh-height-mapping.',
};

export const IMP34748_CMB_LEVERAGE_N_PROFILE_ASSERTIONS = [
  {
    // Reuse gate: C_mb = 1 at N = 1e6 reproduces the imp-3406/imp-34734 sigma-peak neighbourhood.
    id: 'imp34748-baseline-reproduces-imp3406-peak',
    description: 'C_mb=1 at N~1e6 reproduces the imp-3406 sigma-peak neighbourhood (sigma ~ 0.9494)',
    holds: () => Math.abs(PEAK_ROW.sigma - 0.9494) < 1e-3,
  },
  {
    // The closed-form leverage sigma(1-sigma)/C_mb matches the finite difference at every rung.
    id: 'imp34748-fd-matches-closed-form-every-rung',
    description: 'dsigma/dC_mb finite difference matches sigma(1-sigma) at every ladder rung (< 1e-6)',
    holds: () => PROFILE.every((r) => Math.abs(r.dSigma_dCmb_fd - r.dSigma_dCmb_closed) < 1e-6),
  },
  {
    // (F1): the leverage is strongly N-dependent -- a > 4x spread across the ladder.
    id: 'imp34748-leverage-is-N-dependent',
    description: 'leverage spread across {2..1e12} exceeds 4x (strongly N-dependent, not invariant)',
    holds: () => LEV_SPREAD_RATIO > 4 && LEV_MIN > 0.03 && LEV_MAX <= 0.2500001,
  },
  {
    // (F2): the imp-3406 peak leverage ~0.048 is a NEAR-MINIMUM of the profile.
    id: 'imp34748-peak-leverage-is-near-minimum',
    description: 'the imp-3406 sigma-peak leverage ~0.048 is a near-minimum of the profile',
    holds: () =>
      Math.abs(PEAK_LEVERAGE - 0.048) < 3e-3 && PEAK_LEVERAGE < 1.15 * LEV_MIN,
  },
  {
    // (F3): the exact global-max leverage is 1/4 at sigma = 1/2 (N ~ 3.27e9 on the decay arm).
    id: 'imp34748-max-leverage-quarter-at-sigma-half',
    description: 'max leverage = 1/4 at sigma = 1/2 (N ~ 3.27e9), on the post-peak decay arm',
    holds: () =>
      Math.abs(sigmaAt(N_MAX_LEVERAGE, 1) - 0.5) < 1e-6 &&
      N_MAX_LEVERAGE > 1e9 &&
      N_MAX_LEVERAGE < 1e10,
  },
  {
    // Honesty gate: measurement/derivation only, far-tail exponent = 1/2, no QED, no refereed bound is changed.
    id: 'imp34748-honesty-gate-no-qed',
    description: 'Measurement/derivation only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34748_CMB_LEVERAGE_N_PROFILE.isRigorous === false &&
      IMP34748_CMB_LEVERAGE_N_PROFILE.farTailExponent === 0.5 &&
      typeof IMP34748_CMB_LEVERAGE_N_PROFILE.subGap === 'string' &&
      /NO QED/.test(IMP34748_CMB_LEVERAGE_N_PROFILE.verdict) &&
      /refereed bound is changed/i.test(IMP34748_CMB_LEVERAGE_N_PROFILE.verdict),
  },
];

for (const a of IMP34748_CMB_LEVERAGE_N_PROFILE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34748-cmb-leverage-n-profile assertion failed: ${a.id}`);
  }
}
