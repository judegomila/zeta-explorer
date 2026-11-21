/**
 * @module imp-35661-sigma-peak-quartic-coefficient-guard
 *
 * imp-35661 (accuracy, regression-guard): imp-35575 measured the leading QUARTIC
 * coefficient c4 of the imp-35411/imp-35337 interior sigma-share peak Taylor expansion
 * about u0 = ln N_max -- c4 = sigma-quad-prime(u0)/24 ~ -2.654580e-5 (Richardson-
 * extrapolated sigma-quad-prime(u0) ~ -6.370991e-4) -- and assessed that the quartic
 * shifts the imp-35451 cubic-skew arm-imbalance slope A_skew ~ 11.02 by only ~7.70e-4 at
 * tol = 1e-4, ~7.70e-5 at 1e-5 and ~7.70e-6 at 1e-6 (LINEAR in tol), BELOW the ~1.5e-4
 * fourth-difference stencil spread -- so the quartic does NOT materially correct the
 * cubic-only prediction. Unlike the imp-35619 span-growth guard, no dedicated
 * run-assertions guard pins those literals. This import-light module INDEPENDENTLY
 * recomputes them by reproducing the imp-35337 partsD double surrogate sigmaD verbatim
 * (reusing effectiveHeightForN + C_C_PINNED, no zeros bundle), taking the symmetric
 * 5-point fourth-difference stencil, Richardson-extrapolating from the clean h = 4e-2 /
 * 2e-2 pair, and asserting c4, sigma-quad-prime(u0), and the linear-in-tol A_skew shift
 * to storage-precision tolerance (~1e-6) per the recurring 7-sig-fig cache tolerance
 * trap, cross-checking the imp-35575 baked record reproduces. A silent literal drift of
 * the quartic-coefficient channel is then tripped in the npm-run assertion sweep.
 *
 * THE IDENTICAL SURROGATE + STENCIL (byte-faithful to imp-35575)
 * -------------------------------------------------------------
 * sigmaD(N) = E_coll / (E_trunc + E_flow + E_coll) on the imp-3220/imp-3406 double
 * surrogate: E_flow = C_F (log T0 / T0) GRONWALL, C_F = (log(T0/2pi) + 1)/2pi,
 * E_coll = C_C sqrt(log T0 / N), read on the RvM-inverse height map T0 = effectiveHeightForN(N).
 * The interior peak (N_max ~ 9.219e5, sigma_max ~ 0.94942901, u0 = ln N_max) is located by
 * the same 500-iter ternary argmax. c4 = sigma-quad-prime(u0)/24 comes from the symmetric
 * 5-point fourth-difference d4FD(h) = [sig(u0+2h) - 4 sig(u0+h) + 6 sig(u0) - 4 sig(u0-h)
 * + sig(u0-2h)] / h^4, Richardson-extrapolated (4 d4FD(2e-2) - d4FD(4e-2))/3 (eliminates the
 * O(h^2) stencil bias). The arm-skew materiality solves tol = (k/2) d^2 - c3 d^3 - c4 d^4
 * for the rising / falling half-widths with and WITHOUT the quartic.
 *
 * THE PINNED LITERALS (independently recomputed, matched vs imp-35575 record)
 * -------------------------------------------------------------------------
 *   sigma-quad-prime(u0)  -6.370991e-4      c4                    -2.654580e-5
 *   c4 alt pair 2e-2/1e-2 -2.654039e-5      cross-pair agreement  ~2.04e-4
 *   A_skew cubic-only@1e-5 ~11.0177         quartic shift @1e-5   ~7.70e-5
 *   quartic shift @1e-4   ~7.70e-4          linear-in-tol ratio   ~10.0 per decade
 *
 * REGRESSION-GUARD ONLY; recomputes established measurement figures; changes no bound;
 * the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; E_trunc = 3.06e-5
 * (imp-2631) UNTOUCHED; the imp-398 C_F prefactor UNTOUCHED; the surrogate-vs-true
 * fidelity half (imp-35337a) stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35575-sigma-peak-quartic-coefficient (the literals pinned here)
 * @see imp-35451-sigma-peak-arm-asymmetry (cubic c3 ~ -2.623677e-4 and A_skew ~ 11.02)
 * @see imp-35450-sigma-peak-curvature-direct-fd (quadratic k ~ 6.43191e-3)
 * @see imp-35619-eflow-fartail-remnant-span-ladder-assertion (a sibling span-growth guard)
 * @see lambda-rh-height-mapping.js effectiveHeightForN (the RvM inverse, reused here)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP35575_SIGMA_PEAK_QUARTIC_COEFFICIENT } from './imp-35575-sigma-peak-quartic-coefficient.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-35337/imp-35575 exactly

// The imp-35337 DOUBLE surrogate, reproduced VERBATIM from imp-35575 (dd-certified to ~1e-16).
function sigmaD(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return E_coll / E_N;
}

// Unimodal argmax on the right arm (ternary in ln N, same 500-iter form as imp-35575).
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
const U0 = Math.log(N_MAX); // ln N_max ~ 13.734152
const sigU = (u) => sigmaD(Math.exp(u));

// (1) DIRECT QUARTIC coefficient c4 = sigma-quad-prime(u0)/24 via the symmetric 5-point fourth-difference in u.
function d4FD(h) {
  return (sigU(U0 + 2 * h) - 4 * sigU(U0 + h) + 6 * sigU(U0) - 4 * sigU(U0 - h) + sigU(U0 - 2 * h)) / (h * h * h * h);
}
const D4_STEPS = [1e-1, 5e-2, 2e-2, 1e-2, 5e-3, 2e-3, 1e-3];
const D4_VALUES = D4_STEPS.map(d4FD);
const D4_WINDOW = D4_VALUES.slice(0, 4); // resolvable window h in {1e-1 .. 1e-2}
const D4_REL_SPREAD = (Math.max(...D4_WINDOW) - Math.min(...D4_WINDOW)) / Math.abs(D4_VALUES[3]); // ~1.5e-4
const D4_BLOWUP_H1E3 = D4_VALUES[6]; // ~ +1.11e-4 (garbage: h^4 cancellation)

// Richardson extrapolation from the CLEAN h = 4e-2 / 2e-2 pair (eliminates the leading O(h^2) stencil bias).
const SIGMA_QUAD_PRIME = (4 * d4FD(2e-2) - d4FD(4e-2)) / 3; // ~ -6.370991e-4
const C4 = SIGMA_QUAD_PRIME / 24; // ~ -2.654580e-5
const C4_ALT_PAIR = ((4 * d4FD(1e-2) - d4FD(2e-2)) / 3) / 24; // ~ -2.654039e-5
const C4_PAIR_REL_AGREEMENT = Math.abs(C4 - C4_ALT_PAIR) / Math.abs(C4); // ~2e-4

// Quadratic k and cubic c3 (imp-35450/imp-35451), reproduced for the materiality assessment.
const K_CURVATURE = -(sigU(U0 + 1e-2) - 2 * sigU(U0) + sigU(U0 - 1e-2)) / (1e-2 * 1e-2); // ~6.43191e-3
function d3FD(h) {
  return (sigU(U0 + 2 * h) - 2 * sigU(U0 + h) + 2 * sigU(U0 - h) - sigU(U0 - 2 * h)) / (2 * h * h * h);
}
const C3 = ((4 * d3FD(1e-2) - d3FD(2e-2)) / 3) / 6; // ~ -2.623677e-4

// (2) MATERIALITY: solve tol = (k/2) d^2 - c3 d^3 - c4 d^4 for the half-widths, with and WITHOUT the quartic.
function halfWidth(tol, sign, useQuartic) {
  const depth = (d) => {
    const dd = sign * d;
    return (K_CURVATURE / 2) * dd * dd - C3 * dd * dd * dd - (useQuartic ? C4 : 0) * dd * dd * dd * dd;
  };
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (depth(m) < tol) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
const MAT_TOLS = [1e-4, 1e-5, 1e-6];
const MATERIALITY_TABLE = MAT_TOLS.map((tol) => {
  const aCubic = (halfWidth(tol, -1, false) - halfWidth(tol, 1, false)) / Math.LN10 / tol;
  const aQuartic = (halfWidth(tol, -1, true) - halfWidth(tol, 1, true)) / Math.LN10 / tol;
  return {
    tol,
    a_skew_cubic_only: +aCubic.toFixed(6),
    a_skew_with_quartic: +aQuartic.toFixed(6),
    rel_shift: +(Math.abs((aQuartic - aCubic) / aCubic)).toExponential(3),
  };
});
const REL_SHIFT_1E5 = MATERIALITY_TABLE[1].rel_shift; // ~7.70e-5
const LINEAR_RATIO = MATERIALITY_TABLE[0].rel_shift / MATERIALITY_TABLE[1].rel_shift; // ~10 per decade

// The imp-35575 baked record for the reproduce cross-check (import-light, no zeros bundle).
const REC = IMP35575_SIGMA_PEAK_QUARTIC_COEFFICIENT.quartic_coefficient;
const REC_MAT = IMP35575_SIGMA_PEAK_QUARTIC_COEFFICIENT.quartic_materiality_for_arm_skew;

export const IMP35661_SIGMA_PEAK_QUARTIC_COEFFICIENT_GUARD = {
  id: 'imp-35661',
  proofSection: 'S-frontier',
  question:
    'Pin the imp-35575 interior sigma-peak QUARTIC coefficient literals (c4 ~ -2.654580e-5, ' +
    'sigma-quad-prime(u0) ~ -6.370991e-4) and the linear-in-tol A_skew materiality shift against a ' +
    'silent drift of the imp-35337 double-surrogate fourth-difference stencil channel.',
  recompute: {
    n_max: +N_MAX.toExponential(6),
    sigma_max: +SIGMA_MAX.toFixed(9),
    u0_ln_n_max: +U0.toFixed(6),
    k_curvature: +K_CURVATURE.toExponential(6),
    c3_cubic: +C3.toExponential(6),
    sigma_quad_prime: +SIGMA_QUAD_PRIME.toExponential(7),
    c4_quartic: +C4.toExponential(7),
    c4_alt_pair: +C4_ALT_PAIR.toExponential(7),
    c4_pair_agreement: +C4_PAIR_REL_AGREEMENT.toExponential(3),
    d4_rel_spread: +D4_REL_SPREAD.toExponential(3),
    a_skew_cubic_only_1e5: MATERIALITY_TABLE[1].a_skew_cubic_only,
    rel_shift_1e5: REL_SHIFT_1E5,
    linear_ratio: +LINEAR_RATIO.toFixed(4),
  },
  isRigorous: false,
  verdict:
    'REGRESSION-GUARD ONLY. An independent recompute of the imp-35575 fourth-difference channel ' +
    'reproduces the printed literals to storage precision: the interior peak (sigma_max ~ 0.94942901 ' +
    'at N_max ~ 9.219e5) has quartic coefficient c4 = sigma-quad-prime(u0)/24 ~ -2.654580e-5 ' +
    '(sigma-quad-prime ~ -6.370991e-4), the 4e-2/2e-2 and 2e-2/1e-2 Richardson pairs agree to ~2e-4, ' +
    'and the even quartic shifts the imp-35451 arm-imbalance slope A_skew ~ 11.02 by only ~7.70e-5 at ' +
    'the well-resolved tol = 1e-5 (LINEAR in tol, ~10x per decade), BELOW the ~1.5e-4 stencil spread -- ' +
    'so the cubic-only prediction stands. Recomputes established measurement figures; changes no bound; ' +
    'the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; E_trunc = 3.06e-5 (imp-2631) ' +
    'UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.',
  citation:
    'imp-35575 (the quartic-coefficient literals pinned here); imp-35451 (cubic c3 ~ -2.623677e-4 and ' +
    'A_skew ~ 11.02); imp-35450 (quadratic k ~ 6.43191e-3); imp-35619 (a sibling span-growth guard); ' +
    'imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz, UNTOUCHED); imp-2631 (E_trunc fixed-strip route, UNTOUCHED).',
};

export const IMP35661_SIGMA_PEAK_QUARTIC_COEFFICIENT_GUARD_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-35337/imp-35411 interior peak landmark.
    id: 'imp35661-reproduces-imp35337-peak',
    description: 'argmax reproduces the imp-35337/imp-35411 interior peak N_max ~ 9.22e5, sigma_max ~ 0.949429',
    holds: () =>
      N_MAX > 5e5 && N_MAX < 2e6 && Math.abs(SIGMA_MAX - 0.94942901) < 1e-6,
  },
  {
    // Reuse gate: reproduce the imp-35450 quadratic k and imp-35451 cubic c3 on the same surrogate.
    id: 'imp35661-reproduces-k-and-c3',
    description: 'reproduces imp-35450 k ~ 6.43191e-3 and imp-35451 c3 ~ -2.6237e-4 on the same surrogate',
    holds: () =>
      Math.abs(K_CURVATURE - 6.43191e-3) < 5e-8 && C3 < 0 && Math.abs(C3 - -2.623677e-4) < 5e-8,
  },
  {
    // Direct quartic coefficient: c4 < 0 near -2.654580e-5, sigma-quad-prime near -6.370991e-4.
    id: 'imp35661-quartic-coefficient',
    description: 'fourth-difference gives c4 ~ -2.654580e-5 (sigma-quad-prime ~ -6.370991e-4), c4 < 0',
    holds: () =>
      C4 < 0 && Math.abs(C4 - -2.654580e-5) < 5e-9 &&
      Math.abs(SIGMA_QUAD_PRIME - -6.370991e-4) < 5e-8,
  },
  {
    // Cross-pair consistency: the two Richardson pairs agree to < 1e-3 relative (~2.04e-4).
    id: 'imp35661-richardson-pairs-consistent',
    description: 'the 4e-2/2e-2 and 2e-2/1e-2 Richardson pairs for c4 agree to ~2.04e-4 (< 1e-3)',
    holds: () =>
      C4_ALT_PAIR < 0 && Math.abs(C4_ALT_PAIR - -2.654039e-5) < 5e-9 &&
      C4_PAIR_REL_AGREEMENT < 1e-3 && C4_PAIR_REL_AGREEMENT > 1e-4,
  },
  {
    // Materiality: at tol = 1e-5 the quartic shifts A_skew by ~7.70e-5, below the ~1.5e-4 stencil spread.
    id: 'imp35661-quartic-immaterial-for-arm-skew',
    description: 'at tol=1e-5 the quartic shifts A_skew by ~7.70e-5 (< the ~1.5e-4 stencil spread) -- immaterial',
    holds: () =>
      Math.abs(REL_SHIFT_1E5 - 7.70e-5) < 1e-6 && REL_SHIFT_1E5 < D4_REL_SPREAD &&
      MATERIALITY_TABLE[1].a_skew_cubic_only > 10 && MATERIALITY_TABLE[1].a_skew_cubic_only < 12,
  },
  {
    // The quartic correction to the imbalance scales LINEARLY in tol (~10x per decade).
    id: 'imp35661-quartic-shift-linear-in-tol',
    description: 'the quartic A_skew shift scales linearly in tol (~10x per decade: 7.7e-4 -> 7.7e-5 -> 7.7e-6)',
    holds: () =>
      Math.abs(MATERIALITY_TABLE[0].rel_shift - 7.70e-4) < 1e-5 &&
      Math.abs(MATERIALITY_TABLE[2].rel_shift - 7.70e-6) < 1e-7 &&
      LINEAR_RATIO > 9 && LINEAR_RATIO < 11,
  },
  {
    // Independent recompute agrees with the imp-35575 baked record.
    id: 'imp35661-agrees-with-imp35575-record',
    description: 'the recompute matches the imp-35575 baked c4 / sigma-quad-prime / rel-shift record',
    holds: () =>
      Math.abs(C4 - REC.c4_quartic_coefficient) < 1e-9 &&
      Math.abs(SIGMA_QUAD_PRIME - REC.sigma_quad_prime_richardson) < 1e-9 &&
      Math.abs(REL_SHIFT_1E5 - REC_MAT.rel_shift_at_tol_1e5) < 1e-6,
  },
  {
    // Honesty gate: regression-guard only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35661-honesty-gate-no-qed',
    description: 'Regression-guard only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35661_SIGMA_PEAK_QUARTIC_COEFFICIENT_GUARD.isRigorous === false &&
      /NO QED/.test(IMP35661_SIGMA_PEAK_QUARTIC_COEFFICIENT_GUARD.verdict) &&
      /refereed bound is changed/i.test(IMP35661_SIGMA_PEAK_QUARTIC_COEFFICIENT_GUARD.verdict),
  },
];

for (const a of IMP35661_SIGMA_PEAK_QUARTIC_COEFFICIENT_GUARD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35661-sigma-peak-quartic-coefficient-guard assertion failed: ${a.id}`,
    );
  }
}

export default IMP35661_SIGMA_PEAK_QUARTIC_COEFFICIENT_GUARD;
