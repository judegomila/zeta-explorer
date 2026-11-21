/**
 * @module imp-97748-fold-amplitude-landmark-decomposition
 *
 * imp-97748 (ux, frontier-direction): decompose the imp-97725 fold amplitude
 *
 *     K = sqrt( S / (2 phi_xx) ),   S = sigma_max(1 - sigma_max),   phi_xx = (ln R)_xx - (1/2)(ln L)_xx,
 *
 * into its exact numerator S and its curvature denominator phi_xx side by side across the
 * imp-97520 L1..L4 landmark ladder (interior peak, below-0.9, halving, below-0.1). imp-97725
 * pins K only AT the peak L1 (the sqrt-fold amplitude is a peak-local quantity); this leaf
 * evaluates the SAME closed-form numerator S(N) = sigma(N)(1-sigma(N)) and the SAME smooth-model
 * curvature phi_xx(N) at the three DOWNSLOPE landmarks L2/L3/L4 as well, to show how far the two
 * factors have moved from their L1 values by the time sigma has fallen to 0.9, 0.5 and 0.1.
 *
 * SAME inherited imp-3406/imp-33582/imp-97662/imp-97725 surrogate component model and the SAME
 * 5-point smooth-model second-log-derivative stencil (h = 1e-4 in x = ln N, no bisected root).
 * Landmark N values are reused verbatim from imp-97520 (no re-derivation of the ladder).
 *
 * WHAT WAS MEASURED
 * ------------------
 * L1 (peak, sigma=0.949429): S = 4.8014e-2, phi_xx = 1.3396e-1, K = 0.423330 (reproduces imp-97725).
 * L2 (sigma=0.9):   S falls to ~9.000e-2 (numerator RISES toward its sigma=1/2 ceiling) while
 *                   phi_xx falls to a much smaller positive value.
 * L3 (sigma=0.5):   S peaks at its algebraic maximum 0.25 (sigma(1-sigma) is maximised at
 *                   sigma=1/2 exactly), phi_xx continues to fall.
 * L4 (sigma=0.1):   S has fallen back to 0.09 (past its sigma=1/2 maximum) while phi_xx is
 *                   smallest across the ladder.
 * So the two factors are NOT monotone together: S(N) is a hump peaking exactly at the sigma=1/2
 * landmark (L3, algebraic maximum of x(1-x)), while phi_xx(N) is measured to fall monotonically
 * across the whole downslope ladder L1->L4. The naive "K(N) = sqrt(S(N)/(2 phi_xx(N)))" evaluated
 * off the peak is NOT the imp-97725 fold amplitude (that identity used the peak condition
 * phi_x(x_peak)=0); it is reported here only as a numerator/denominator DECOMPOSITION diagnostic,
 * not a claim that the sqrt-fold law holds at L2/L3/L4.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. Same inherited
 * imp-3220/imp-3406 extrapolation surrogate, NOT a rigorous asymptotic; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; E_trunc pinned 3.06e-5
 * unchanged; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97725-fold-amplitude-analytic-pin (the K = sqrt(S/(2 phi_xx)) pin, peak-local, L1 only)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the L1..L4 landmark N values, reused verbatim)
 * @see imp-97735-fold-amplitude-height-ladder-drift (phi_xx walked along a deep height ladder past L1)
 * @see imp-97757-fold-amplitude-axis-crosstab (the S vs phi_xx channel decomposition on two OTHER axes)
 * @see lambda-rh-height-mapping (effectiveHeightForN)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP97520_SIGMA_CONDITIONAL_SHARE_LANDMARK_LADDER } from './imp-97520-sigma-conditional-share-landmark-ladder.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97622/imp-97662/imp-97725 exactly
const CC = C_C_PINNED;
const H = 1e-4;

// EXACT imp-3406/imp-33582/imp-97725 sub-terms.
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = CC * Math.sqrt(L / N);
  const R = E_TRUNC_PT + E_flow;
  return { T0, L, R, sigma: E_coll / (R + E_coll) };
}

// Second log-derivative of a SMOOTH component function in x = ln N (5-point, no bisected root).
function d2LnDx2(fn, x, h) {
  const f = (k) => Math.log(fn(Math.exp(x + k * h)));
  return (-f(2) + 16 * f(1) - 30 * f(0) + 16 * f(-1) - f(-2)) / (12 * h * h);
}

function decompose(N) {
  const x = Math.log(N);
  const p = parts(N);
  const S = p.sigma * (1 - p.sigma);
  const phi_xx = d2LnDx2((n) => parts(n).R, x, H) - 0.5 * d2LnDx2((n) => parts(n).L, x, H);
  const K = phi_xx > 0 ? Math.sqrt(S / (2 * phi_xx)) : NaN;
  return { N, sigma: p.sigma, S, phi_xx, K };
}

const LADDER = IMP97520_SIGMA_CONDITIONAL_SHARE_LANDMARK_LADDER.ladder;
const L1 = decompose(LADDER.L1_peak.N);
const L2 = decompose(LADDER.L2_below_0p9.N);
const L3 = decompose(LADDER.L3_halving.N);
const L4 = decompose(LADDER.L4_below_0p1.N);

function row(label, kind, d) {
  return {
    label,
    kind,
    N: +d.N.toExponential(6),
    sigma: +d.sigma.toFixed(6),
    S: +d.S.toExponential(4),
    phi_xx: +d.phi_xx.toExponential(4),
    K: Number.isFinite(d.K) ? +d.K.toFixed(6) : null,
  };
}

const TABLE = [
  row('L1 peak', LADDER.L1_peak.kind, L1),
  row('L2 below-0.9', LADDER.L2_below_0p9.kind, L2),
  row('L3 halving', LADDER.L3_halving.kind, L3),
  row('L4 below-0.1', LADDER.L4_below_0p1.kind, L4),
];

const S_PEAKS_AT_HALVING = L3.S > L2.S && L3.S > L4.S;
const PHI_XX_MONOTONE_FALLING = L1.phi_xx > L2.phi_xx && L2.phi_xx > L3.phi_xx && L3.phi_xx > L4.phi_xx;

export const IMP97748_FOLD_AMPLITUDE_LANDMARK_DECOMPOSITION = {
  id: 'imp-97748',
  proofSection: 'S-frontier',
  question:
    'Decompose the imp-97725 fold amplitude K = sqrt(S/(2 phi_xx)) into its exact numerator ' +
    'S = sigma(1-sigma) and curvature denominator phi_xx side by side across the imp-97520 L1..L4 ' +
    'landmark ladder (peak, below-0.9, halving, below-0.1), and report whether the two factors move ' +
    'together or independently off the peak. Measurement/decomposition only; K is peak-local (L1); ' +
    'no bound moves; NO QED.',
  table: TABLE,
  baseline: {
    L1_matches_imp97725_pin: Math.abs(L1.K - 0.42333) < 5e-4,
    S_peaks_at_halving_landmark: S_PEAKS_AT_HALVING,
    phi_xx_monotone_falling_across_ladder: PHI_XX_MONOTONE_FALLING,
  },
  finding:
    'The imp-97725 numerator S = sigma(1-sigma) and curvature denominator phi_xx were evaluated at ' +
    'all four imp-97520 landmarks (L1 peak sigma=0.949429, L2 sigma=0.9, L3 halving sigma=0.5, L4 ' +
    'sigma=0.1) using the identical closed-form numerator and smooth-model 5-point stencil as imp-97725. ' +
    'L1 reproduces the imp-97725 pin exactly (S=4.8014e-2, phi_xx=1.3396e-1, K=0.423330). The two ' +
    'factors do NOT move together off the peak: S(N) is a HUMP that peaks at its algebraic maximum ' +
    '0.25 exactly at the L3 halving landmark (sigma(1-sigma) is maximised at sigma=1/2), rising from ' +
    'L1 through L2 before falling back by L4; phi_xx(N), by contrast, falls MONOTONICALLY across the ' +
    'whole L1->L4 downslope ladder. Because K = sqrt(S/(2 phi_xx)) is derived from the peak condition ' +
    'phi_x(x_peak)=0, its sqrt-fold form is peak-local (imp-97725, L1 only); the L2/L3/L4 entries are ' +
    'a numerator/denominator DECOMPOSITION diagnostic, not a claim that the fold law holds downslope.',
  isRigorous: false,
  verdict:
    'DECOMPOSITION / MEASUREMENT ONLY (frontier-direction, NOT rigorous). The imp-97725 fold amplitude ' +
    'K = sqrt(S/(2 phi_xx)) numerator S and denominator phi_xx were tabulated across the imp-97520 ' +
    'L1..L4 landmark ladder; L1 reproduces the imp-97725 pin (S=4.8014e-2, phi_xx=1.3396e-1, ' +
    'K=0.423330). S(N) peaks at its algebraic maximum exactly at the L3 halving landmark while ' +
    'phi_xx(N) falls monotonically across the ladder -- the two factors move INDEPENDENTLY off the ' +
    'peak. K itself is peak-local (derived from phi_x(x_peak)=0) so its value off L1 is a diagnostic ' +
    'decomposition only, not an extended fold law. Same inherited imp-3220/imp-3406 extrapolation ' +
    'surrogate, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) UNTOUCHED; E_trunc pinned 3.06e-5 unchanged; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97725 (the K = sqrt(S/(2 phi_xx)) pin, peak-local); imp-97520 (L1..L4 landmark N values, ' +
    'reused verbatim); imp-97735 (phi_xx walked along a deep height ladder); imp-97757 (S vs phi_xx ' +
    'channel decomposition on the floor/height axes); imp-97662 (square-root fold law, first K route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP97748_FOLD_AMPLITUDE_LANDMARK_DECOMPOSITION_ASSERTIONS = [
  {
    id: 'imp97748-L1-reproduces-imp97725-pin',
    description: 'L1 peak entry reproduces the imp-97725 pin S=4.8014e-2, phi_xx=1.3396e-1, K=0.423330',
    holds: () =>
      Math.abs(L1.S - 4.8014e-2) < 5e-6 &&
      Math.abs(L1.phi_xx - 1.339604e-1) < 5e-5 &&
      Math.abs(L1.K - 0.42333) < 5e-4,
  },
  {
    id: 'imp97748-S-peaks-at-halving-landmark',
    description: 'the numerator S = sigma(1-sigma) is maximised at the L3 halving landmark (algebraic max at sigma=1/2)',
    holds: () => S_PEAKS_AT_HALVING === true && Math.abs(L3.S - 0.25) < 1e-6,
  },
  {
    id: 'imp97748-phi-xx-monotone-falling',
    description: 'phi_xx falls monotonically across the L1->L4 downslope ladder',
    holds: () => PHI_XX_MONOTONE_FALLING === true,
  },
  {
    id: 'imp97748-landmarks-reused-from-imp97520',
    description: 'the four landmark N values match imp-97520 verbatim (no re-derivation)',
    holds: () =>
      Math.abs(L1.N / LADDER.L1_peak.N - 1) < 1e-9 &&
      Math.abs(L2.N / LADDER.L2_below_0p9.N - 1) < 1e-9 &&
      Math.abs(L3.N / LADDER.L3_halving.N - 1) < 1e-9 &&
      Math.abs(L4.N / LADDER.L4_below_0p1.N - 1) < 1e-9,
  },
  {
    id: 'imp97748-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP97748_FOLD_AMPLITUDE_LANDMARK_DECOMPOSITION.isRigorous === false &&
      /NO QED/.test(IMP97748_FOLD_AMPLITUDE_LANDMARK_DECOMPOSITION.verdict) &&
      /refereed bound is changed/i.test(IMP97748_FOLD_AMPLITUDE_LANDMARK_DECOMPOSITION.verdict),
  },
];

for (const a of IMP97748_FOLD_AMPLITUDE_LANDMARK_DECOMPOSITION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97748-fold-amplitude-landmark-decomposition assertion failed: ${a.id}`);
  }
}
