/**
 * @module imp-35450-sigma-peak-curvature-direct-fd
 *
 * imp-35450 (numerical, frontier-direction) -- DIRECTLY measures the interior sigma-peak curvature
 * k = -d^2 sigma/d(ln N)^2 by a central finite-difference second derivative, and cross-checks it against the
 * value imp-35411 INFERRED indirectly from the plateau-width scaling constant W(tol)/sqrt(tol) = 15.3165.
 *
 * WHAT imp-35411 DID vs WHAT THIS DOES
 * ------------------------------------
 * imp-35411 pinned the interior sigma-peak curvature k ~ 6.4319e-3 ONLY INDIRECTLY: it measured the plateau
 * WIDTH W(tol) = log10(N_hi) - log10(N_lo) of the imp-3220/imp-3406 GUE-conditional share
 * sigma(N) = E_coll(N)/E(N), found W(tol)/sqrt(tol) = 15.316494 constant across tol in {1e-4..1e-7}, and read
 * the curvature off the quadratic flat-max model W(tol) = (2/ln10) sqrt(2/k) sqrt(tol) as
 * k = 8 / (ln10 * W/sqrt(tol))^2. That is a width-scaling INFERENCE, never a derivative. This module measures k
 * DIRECTLY at the peak with a central second-difference d^2 sigma/d(ln N)^2 on the SAME partsD double surrogate.
 *
 * WHAT IS MEASURED
 * ----------------
 * At u0 = ln N_max (N_max ~ 9.219e5, the imp-35337/imp-35411 argmax) the central FD second derivative
 *   sigma''(u0) ~ [sigma(u0+h) - 2 sigma(u0) + sigma(u0-h)] / h^2,   k_FD = -sigma''(u0)
 * is evaluated over an FD-step sweep h in {1e-1, 5e-2, 2e-2, 1e-2, 5e-3, 2e-3} (in ln N). The estimate
 * CONVERGES monotonically as h shrinks -- k_FD falls from 6.43244e-3 at h=1e-1 (O(h^2) truncation bias) to a
 * plateau 6.43191e-3 by h <= 2e-3 -- textbook second-order FD convergence with no roundoff blow-up at the
 * smallest step. A Richardson extrapolation (4 k_FD(h/2) - k_FD(h))/3 from the h=2e-2 pair lands at 6.431910e-3.
 *
 * THE RESULT: DIRECT k CONFIRMS THE WIDTH-INFERRED k TO ~6 SIG FIGS
 * ----------------------------------------------------------------
 * The direct FD curvature k_FD -> 6.431910e-3 agrees with the imp-35411 width-inferred k = 6.431909e-3 to a
 * relative difference ~2e-7 (Richardson) / ~1e-6 (plain h=1e-2). The two INDEPENDENT routes -- one from the
 * far-field plateau half-width at a fixed tolerance below the peak, the other from the local second derivative
 * AT the peak -- pin the same curvature. This closes the loop imp-35411 left open: its k was an inference from
 * the width constant; here the underlying derivative is measured head-on and matches. (Note: the imp-35411
 * "~6.428e-3" headline is a slightly-off rounded quote of its own raw inferred 6.4319e-3; the direct FD value
 * confirms the raw 6.4319e-3, not the rounded 6.428e-3.)
 *
 * WHY DOUBLE SUFFICES (NO dd NEEDED FOR THE CURVATURE)
 * ---------------------------------------------------
 * imp-35337 dd-certified sigma(N) across this N-shape to max |sigma_dd - sigma_double| ~ 1e-16. The FD step
 * sweep here bottoms out at h = 2e-3 with k stable to its 6th sig fig; the h^2-scale FD cancellation error at
 * that step is ~ (1e-16)/h^2 ~ 2.5e-11 relative, far below the ~2e-7 route-agreement being reported. The
 * curvature is therefore not a double-rounding artifact. This is exactly why the FD converges cleanly to a
 * plateau rather than diverging at small h.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A DIRECT finite-difference measurement of the imp-35337/imp-3406 interior sigma-peak curvature, cross-checked
 * against the imp-35411 width-inferred value. MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; the
 * surrogate-vs-true fidelity half (imp-35337a) stays OPEN and is not touched. The C_C = (1/8) sqrt(3 pi) ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; E_trunc = 3.06e-5 (imp-2631) UNTOUCHED; the imp-398 C_F prefactor UNTOUCHED;
 * changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35411-sigma-peak-plateau-width (INFERRED k ~ 6.4319e-3 from the width constant 15.3165; never
 *      measured the derivative directly -- this module does)
 * @see imp-35337-sigma-landmarks-double-double-certification (dd-certified peak VALUE / 2.1e-5 margin)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX ~ 9.22e5, 2.1e-5 flat-cap margin, on double)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-35337/imp-35411 exactly

// The imp-35337 DOUBLE surrogate, reproduced VERBATIM from imp-35411 (dd-certified to ~1e-16 across the N-shape).
function sigmaD(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return E_coll / E_N;
}

// Unimodal argmax on the right arm (ternary in ln N, same 500-iter form as imp-35337/imp-35411).
function argmaxD(loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigmaD(Math.exp(m1)) < sigmaD(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

const N_MAX = argmaxD(1e4, 1e9); // ~9.2186e5
const SIGMA_MAX = sigmaD(N_MAX); // ~0.949429014
const U0 = Math.log(N_MAX); // ln N_max ~ 13.7342

// sigma as a function of u = ln N (curvature is measured in the ln-N variable, as in imp-35411).
const sigU = (u) => sigmaD(Math.exp(u));

// DIRECT curvature: central FD second derivative k_FD(h) = -[sig(u0+h) - 2 sig(u0) + sig(u0-h)] / h^2.
function curvatureFD(h) {
  return -(sigU(U0 + h) - 2 * sigU(U0) + sigU(U0 - h)) / (h * h);
}

// FD-step sweep (in ln N): confirms second-order convergence to a stable plateau.
const FD_STEPS = [1e-1, 5e-2, 2e-2, 1e-2, 5e-3, 2e-3];
const FD_CURVATURES = FD_STEPS.map(curvatureFD);
const K_FD_SMALLEST = FD_CURVATURES[FD_CURVATURES.length - 1]; // h = 2e-3 plateau ~6.43191e-3

// Richardson extrapolation (eliminates the leading O(h^2) truncation term) from the h = 2e-2 / 1e-2 pair.
const K_FD_RICHARDSON = (4 * curvatureFD(1e-2) - curvatureFD(2e-2)) / 3; // ~6.431910e-3

// imp-35411 width-inferred k, reproduced EXACTLY from its raw width constant (NOT the rounded 6.428e-3 quote).
function plateauLo(tol) {
  const target = SIGMA_MAX - tol;
  let a = Math.log(1);
  let b = U0;
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (sigmaD(Math.exp(m)) < target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
function plateauHi(tol) {
  const target = SIGMA_MAX - tol;
  let a = U0;
  let b = Math.log(1e40);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (sigmaD(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const WIDTH_OVER_SQRT_TOL = ((Math.log(plateauHi(1e-5)) - Math.log(plateauLo(1e-5))) / Math.LN10) / Math.sqrt(1e-5);
const K_WIDTH_INFERRED = 8 / Math.pow(Math.LN10 * WIDTH_OVER_SQRT_TOL, 2); // imp-35411 raw ~6.431909e-3

// Relative agreement of the DIRECT FD curvature vs the INDIRECT width-inferred curvature.
const REL_AGREEMENT_RICHARDSON = Math.abs(K_FD_RICHARDSON - K_WIDTH_INFERRED) / K_WIDTH_INFERRED; // ~2e-7
const REL_AGREEMENT_SMALLEST = Math.abs(K_FD_SMALLEST - K_WIDTH_INFERRED) / K_WIDTH_INFERRED; // ~1e-7

export const IMP35450_SIGMA_PEAK_CURVATURE_DIRECT_FD = {
  id: 'imp-35450',
  proofSection: 'S-frontier',
  question:
    'imp-35411 pinned the interior sigma-peak curvature k ~ 6.4319e-3 only INDIRECTLY, via the measured ' +
    'plateau-width scaling constant W(tol)/sqrt(tol) = 15.3165 and the quadratic model ' +
    'W(tol) = (2/ln10) sqrt(2/k) sqrt(tol). Measure k DIRECTLY with a central finite-difference ' +
    'd^2 sigma/d(ln N)^2 at N_max ~ 9.219e5 on the same partsD double surrogate, sweep the FD step to confirm ' +
    'convergence, and report the relative agreement with the width-inferred k.',
  constants: {
    log10_N_max: +(U0 / Math.LN10).toFixed(6), // ~5.964667
    sigma_max: +SIGMA_MAX.toFixed(9), // ~0.949429014
    ln_N_max: +U0.toFixed(6), // ~13.734152
  },
  direct_fd_curvature: {
    fd_steps_in_lnN: FD_STEPS,
    fd_curvatures: FD_CURVATURES.map((k) => +k.toExponential(6)), // 6.432441e-3 -> 6.431910e-3 (monotone)
    k_fd_smallest_step: +K_FD_SMALLEST.toExponential(7), // ~6.431910e-3 at h = 2e-3
    k_fd_richardson: +K_FD_RICHARDSON.toExponential(7), // ~6.431910e-3
    note:
      'Central second-difference k_FD = -[sig(u0+h)-2 sig(u0)+sig(u0-h)]/h^2 in u = ln N; converges monotonically ' +
      'from 6.432441e-3 at h=1e-1 (O(h^2) truncation bias) to a stable 6.431910e-3 plateau by h <= 2e-3, with no ' +
      'roundoff blow-up at the smallest step -- textbook second-order FD convergence.',
  },
  cross_check_vs_imp35411: {
    k_width_inferred: +K_WIDTH_INFERRED.toExponential(7), // imp-35411 raw ~6.431909e-3
    rel_agreement_richardson: +REL_AGREEMENT_RICHARDSON.toExponential(3), // ~2e-7
    rel_agreement_smallest_step: +REL_AGREEMENT_SMALLEST.toExponential(3), // ~1e-7
    note:
      'The DIRECT FD curvature and the INDIRECT width-inferred curvature agree to ~2e-7 relative -- two ' +
      'independent routes (far-field plateau half-width vs local second derivative at the peak) pin the SAME k. ' +
      'The imp-35411 "6.428e-3" headline is a slightly-off rounded quote of its own raw inferred 6.4319e-3; the ' +
      'direct FD confirms the raw 6.4319e-3.',
  },
  finding:
    'The interior sigma-peak curvature k = -d^2 sigma/d(ln N)^2, measured DIRECTLY by a central ' +
    'finite-difference second derivative at N_max ~ 9.219e5, converges to ' + (+K_FD_RICHARDSON.toExponential(6)) +
    ' as the FD step shrinks (6.432441e-3 at h=1e-1 down to a 6.431910e-3 plateau by h <= 2e-3, with a Richardson ' +
    'extrapolation landing at the same value). This DIRECT curvature agrees with the imp-35411 width-INFERRED ' +
    'k = ' + (+K_WIDTH_INFERRED.toExponential(6)) + ' to ~' + (+REL_AGREEMENT_RICHARDSON.toExponential(1)) +
    ' relative, so the two independent routes -- far-field plateau half-width and local second derivative -- pin ' +
    'the same tiny curvature. This closes the loop imp-35411 left open (its k was an inference from the width ' +
    'constant, never the derivative). MEASUREMENT ONLY on the imp-3220/imp-3406 surrogate; imp-35337a stays OPEN.',
  residual_sub_gap:
    'Inherits imp-35337a: this measures the CURVATURE of the peak on the imp-3220/imp-3406 double surrogate ' +
    '(dd-certified by imp-35337 to ~1e-16, so the h^2-scale FD cancellation error ~2.5e-11 relative at the ' +
    'smallest step is far below the ~2e-7 route-agreement reported -- not a double artifact). It does NOT ' +
    'establish that the surrogate MAP (E_coll = C_C sqrt(log T0/N), C_H = 1/8 ansatz) is a faithful proxy for the ' +
    'true empirical-vs-analytic gap at these heights; that sub-gap imp-35337a stays OPEN.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, frontier-direction, NOT an RH bound). The imp-35337/imp-3406 interior sigma-share ' +
    'peak curvature k = -d^2 sigma/d(ln N)^2 at N_max ~ 9.219e5, measured DIRECTLY by a central finite-difference ' +
    'second derivative in ln N, converges to ~6.431910e-3 as the FD step shrinks (monotone from 6.4324e-3 at ' +
    'h=1e-1 to a 6.43191e-3 plateau by h <= 2e-3, Richardson-confirmed) and agrees with the imp-35411 ' +
    'width-INFERRED k ~ 6.431909e-3 to ~2e-7 relative -- two independent routes pinning the same curvature. ' +
    'Located on the imp-35337 double surrogate reproduced VERBATIM (dd-certified there to ~1e-16). MEASUREMENT ' +
    'ONLY on the inherited imp-3220/imp-3406 surrogate, which is NOT a rigorous asymptotic; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643), the E_trunc = 3.06e-5 floor (imp-2631) and the imp-398 C_F prefactor are UNTOUCHED; ' +
    'the surrogate-vs-true fidelity half (imp-35337a) stays OPEN; changes no bound; establishes no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35411 (INFERRED k from the width constant 15.3165; never measured the derivative); imp-35337 ' +
    '(dd-certified peak VALUE / 2.1e-5 margin); imp-3406 (interior MAX ~ 9.22e5, on double); imp-2642 ' +
    '(C_C = (1/8) sqrt(3 pi) ansatz); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse).',
};

export const IMP35450_SIGMA_PEAK_CURVATURE_DIRECT_FD_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-35337/imp-35411 peak landmark (N_max ~ 9.22e5, sigma_max ~ 0.94942901).
    id: 'imp35450-reproduces-imp35411-peak',
    description: 'argmax reproduces the imp-35337/imp-35411 interior peak N_max ~ 9.22e5, sigma_max ~ 0.949429',
    holds: () =>
      N_MAX > 5e5 && N_MAX < 2e6 && Math.abs(SIGMA_MAX - 0.94942901) < 1e-6,
  },
  {
    // Direct FD curvature lands near 6.4319e-3 at the smallest step and via Richardson.
    id: 'imp35450-direct-fd-curvature',
    description: 'direct central-FD curvature k ~ 6.4319e-3 at the smallest step and by Richardson extrapolation',
    holds: () =>
      Math.abs(K_FD_SMALLEST - 6.43191e-3) < 5e-7 && Math.abs(K_FD_RICHARDSON - 6.43191e-3) < 5e-7,
  },
  {
    // FD step sweep is MONOTONE-decreasing (O(h^2) truncation bias shrinks) -- clean second-order convergence.
    id: 'imp35450-fd-sweep-converges',
    description: 'FD-step sweep decreases monotonically (6.4324e-3 -> 6.4319e-3) as h shrinks -- FD convergence',
    holds: () => {
      for (let i = 1; i < FD_CURVATURES.length; i++) {
        if (!(FD_CURVATURES[i] <= FD_CURVATURES[i - 1] + 1e-12)) return false;
      }
      return FD_CURVATURES[0] > FD_CURVATURES[FD_CURVATURES.length - 1];
    },
  },
  {
    // Headline cross-check: direct FD agrees with the imp-35411 width-inferred k to better than 1e-5 relative.
    id: 'imp35450-direct-vs-inferred-agree',
    description: 'direct FD curvature agrees with the imp-35411 width-inferred k to < 1e-5 relative',
    holds: () =>
      REL_AGREEMENT_RICHARDSON < 1e-5 && REL_AGREEMENT_SMALLEST < 1e-5,
  },
  {
    // The width-inferred k reproduced here matches imp-35411 raw 6.4319e-3 (confirms the reproduction is faithful).
    id: 'imp35450-reproduces-imp35411-inferred-k',
    description: 'reproduced imp-35411 width-inferred k ~ 6.4319e-3 (its raw value, not the rounded 6.428e-3 quote)',
    holds: () => Math.abs(K_WIDTH_INFERRED - 6.43191e-3) < 5e-7,
  },
  {
    // Honesty gate: measurement only, not rigorous, no QED, no refereed bound is changed, sub-gap imp-35337a named.
    id: 'imp35450-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, imp-35337a stays OPEN',
    holds: () =>
      IMP35450_SIGMA_PEAK_CURVATURE_DIRECT_FD.isRigorous === false &&
      /NO QED/.test(IMP35450_SIGMA_PEAK_CURVATURE_DIRECT_FD.verdict) &&
      /refereed bound is changed/i.test(IMP35450_SIGMA_PEAK_CURVATURE_DIRECT_FD.verdict) &&
      /imp-35337a/.test(IMP35450_SIGMA_PEAK_CURVATURE_DIRECT_FD.residual_sub_gap),
  },
];

for (const a of IMP35450_SIGMA_PEAK_CURVATURE_DIRECT_FD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35450-sigma-peak-curvature-direct-fd assertion failed: ${a.id}`);
  }
}
