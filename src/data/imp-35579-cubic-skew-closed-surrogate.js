/**
 * @module imp-35579-cubic-skew-closed-surrogate
 *
 * imp-35579 (numerical, frontier-direction) -- tests whether the imp-35451 interior sigma-peak
 * CUBIC-SKEW SIGN (c3 < 0, so the rising arm is wider) is robust to the HEIGHT-MAP choice, by
 * recomputing the peak shape on the imp-35413 CLOSED surrogate map T0 = 2 pi N / log N and comparing
 * against the imp-35451 base RvM-inverse map effectiveHeightForN(N).
 *
 * WHAT WAS OPEN
 * ------------
 * imp-35451 measured c3 = sigma-triple-prime(u0)/6 ~ -2.623677e-4 (NEGATIVE => rising arm wider) and the
 * arm-imbalance slope A_skew ~ 11.01 it predicts, but ONLY on the RvM-inverse partsD surrogate. imp-35458
 * showed the E_coll = E_trunc CROSSOVER landmark is nearly height-map-insensitive (it sees only log T0, so
 * an ~18 percent raw-height gap compresses to ~1 percent). imp-35557 / imp-35615 then perturbed the map
 * MULTIPLICATIVELY (RvM x {1.02, 0.98, 1.05, 0.95}) and found the cubic skew log-linearly robust. But the
 * peak SHAPE derivatives were never cross-checked on the DIFFERENT closed surrogate map itself (a genuinely
 * distinct map, not a small multiplicative perturbation), which is what imp-35458 opened. This module does.
 *
 * WHAT IS MEASURED
 * ----------------
 * On BOTH height maps, using the imp-35337 partsD double surrogate reproduced VERBATIM from imp-35451:
 *   (A) RvM inverse         T0 = effectiveHeightForN(N)   (imp-35337/imp-35417/imp-35451 base map)
 *   (B) closed surrogate    T0 = 2 pi N / log N           (imp-35280/imp-35413/imp-35458 map)
 * re-locating the peak N_max by the same 500-iter ternary argmax, then re-running the imp-35451 5-point
 * third-derivative (c3) and central second-derivative (k) stencils plus the tol = 1e-5 arm half-widths and
 * the A_skew_pred = -4 c3 / (k^2 ln10) cross-check.
 *
 *   quantity                RvM base (A)     closed surrogate (B)   rel change (B vs A)
 *   log10 N_max             5.964667         6.122991               +2.65 percent (peak shifts up)
 *   sigma_max               0.949429014      0.941727211            -0.81 percent
 *   sigma-triple-prime      -1.5742059e-3    -1.6933275e-3          +7.57 percent (more negative)
 *   c3                      -2.6236765e-4    -2.8222125e-4          +7.57 percent (more negative)
 *   k (quadratic curvature)  6.431916e-3      7.799541e-3          +21.26 percent (sharper peak)
 *   A_skew_pred             11.01727          8.05927              -26.85 percent
 *
 * VERDICT: SIGN ROBUST, MAGNITUDE NOT INVARIANT
 * ---------------------------------------------
 * The cubic-skew SIGN survives the map swap cleanly: c3 stays NEGATIVE on BOTH maps, and on BOTH maps the
 * rising (low-N) arm is wider than the falling arm at tol = 1e-5 (imbalance > 0, width ratio > 1). The
 * cubic-predicts-imbalance cross-check A_skew_pred = -4 c3 / (k^2 ln10) also holds on the surrogate (matches
 * the directly-measured arm-imbalance slope to ~7.3e-4 relative). So the QUALITATIVE imp-35451 finding
 * (negative cubic, rising arm wider) is height-map-robust.
 *
 * The MAGNITUDE, however, is NOT map-invariant. The closed surrogate is a much larger effective perturbation
 * than the imp-35557/imp-35615 multiplicative arms: at the RvM peak height the effective multiplier
 * T0_surrogate / T0_rvm is only ~0.7567 (a ~-24 percent height move, ~5x the widest +/-5 percent arm),
 * consistent with imp-35616 finding the surrogate sits OUTSIDE the +/-5 percent bracket RANGE. Under it,
 * |c3| grows ~7.6 percent but k grows ~21 percent, and since A_skew ~ -4 c3 / k^2 the k^2 growth (~47 percent)
 * dominates, so the arm-imbalance slope A_skew DROPS ~27 percent (11.02 -> 8.06). The skew is genuine and
 * same-signed on both maps, but the arm-asymmetry slope is a map-dependent quantitative feature, not a
 * height-map invariant.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A cross-map measurement tying the imp-35451 cubic-skew SHAPE axis to the imp-35458 height-map axis on the
 * inherited imp-3220/imp-3406 double surrogate. MEASUREMENT ONLY; the surrogate-vs-true fidelity half
 * (imp-35337a) stays OPEN and is not touched. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; E_trunc = 3.06e-5 (imp-2631) UNTOUCHED; the imp-398 C_F prefactor UNTOUCHED; C_mb stays
 * GUE-conditional per imp-486; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35451-sigma-peak-arm-asymmetry (measured c3 ~ -2.6237e-4 on the RvM base map only)
 * @see imp-35458-crossover-height-map-sensitivity (opened the RvM-vs-closed-surrogate height-map axis)
 * @see imp-35557-cubic-skew-height-map-sensitivity (multiplicative RvM x {1.02, 0.98} skew robustness)
 * @see imp-35615-cubic-skew-height-map-5pct-arms (multiplicative RvM x {1.05, 0.95} skew robustness)
 * @see imp-35616-crossover-surrogate-effective-mult-reconciliation (surrogate ~ RvM x mult_eff, outside +/-5pct)
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (the closed surrogate map T0 = 2 pi N / log N)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-35337/imp-35451 exactly

// (A) RvM inverse height map (imp-35451 base) and (B) imp-35413 closed surrogate T0 = 2 pi N / log N.
const T0_rvm = (N) => effectiveHeightForN(N);
const T0_surrogate = (N) => (TWO_PI * N) / Math.log(N);

// The imp-35337 DOUBLE surrogate, reproduced VERBATIM from imp-35451 but PARAMETRIZED by the height map.
function makeSigma(T0map) {
  return function sigmaD(N) {
    const T0 = T0map(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
    const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
    const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
    const E_N = E_TRUNC_PT + E_flow + E_coll;
    return E_coll / E_N;
  };
}

// Re-run the FULL imp-35451 stencil pipeline (peak argmax, c3, k, arm widths, cross-check) on a given map.
function analyzeMap(T0map) {
  const sigmaD = makeSigma(T0map);
  const sigU = (u) => sigmaD(Math.exp(u));

  // Unimodal argmax on the right arm (ternary in ln N, same 500-iter form as imp-35451).
  let lo = Math.log(1e4);
  let hi = Math.log(1e9);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigmaD(Math.exp(m1)) < sigmaD(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  const N_MAX = Math.exp((lo + hi) / 2);
  const SIGMA_MAX = sigmaD(N_MAX);
  const U0 = Math.log(N_MAX);

  // Direct cubic coefficient c3 = sigma-triple-prime(u0)/6 via the 5-point third-difference stencil,
  // Richardson-extrapolated from the h = 2e-2 / 1e-2 pair (eliminates the leading O(h^2) stencil bias).
  const d3FD = (h) =>
    (sigU(U0 + 2 * h) - 2 * sigU(U0 + h) + 2 * sigU(U0 - h) - sigU(U0 - 2 * h)) / (2 * h * h * h);
  const SIGMA_TRIPLE_PRIME = (4 * d3FD(1e-2) - d3FD(2e-2)) / 3;
  const C3 = SIGMA_TRIPLE_PRIME / 6;

  // Quadratic curvature k = -sigma''(u0) (imp-35450), needed for the cubic->imbalance prediction.
  const K_CURVATURE = -(sigU(U0 + 1e-2) - 2 * sigU(U0) + sigU(U0 - 1e-2)) / (1e-2 * 1e-2);

  // Arm half-widths in decades at the well-resolved tol = 1e-5 (same bisection form as imp-35451).
  const tol = 1e-5;
  const target = SIGMA_MAX - tol;
  const bisect = (a0, b0, wantAbove) => {
    let a = a0;
    let b = b0;
    for (let i = 0; i < 500; i++) {
      const m = (a + b) / 2;
      const above = sigmaD(Math.exp(m)) > target;
      if (above === wantAbove) a = m;
      else b = m;
    }
    return Math.exp((a + b) / 2);
  };
  const nLo = bisect(Math.log(1), U0, false); // rising arm: below target on the left
  const nHi = bisect(U0, Math.log(1e40), true); // falling arm: above target near the peak
  const wRise = (U0 - Math.log(nLo)) / Math.LN10;
  const wFall = (Math.log(nHi) - U0) / Math.LN10;
  const IMBALANCE = wRise - wFall; // POSITIVE if the rising arm is wider
  const RATIO = wRise / wFall;
  const A_SKEW_MEASURED = IMBALANCE / tol;

  // Cross-check: the cubic coefficient predicts the arm-imbalance slope, A_skew_pred = -4 c3 / (k^2 ln10).
  const A_SKEW_PREDICTED = (-4 * C3) / (K_CURVATURE * K_CURVATURE * Math.LN10);
  const A_SKEW_REL_AGREEMENT = Math.abs(A_SKEW_PREDICTED - A_SKEW_MEASURED) / A_SKEW_PREDICTED;

  return {
    N_MAX,
    SIGMA_MAX,
    U0,
    SIGMA_TRIPLE_PRIME,
    C3,
    K_CURVATURE,
    wRise,
    wFall,
    IMBALANCE,
    RATIO,
    A_SKEW_MEASURED,
    A_SKEW_PREDICTED,
    A_SKEW_REL_AGREEMENT,
  };
}

const RVM = analyzeMap(T0_rvm); // reproduces imp-35451 exactly
const SUR = analyzeMap(T0_surrogate); // the closed surrogate map swap

// Effective multiplier of the closed surrogate at the RvM peak height (imp-35616 framing).
const MULT_EFF_AT_PEAK = T0_surrogate(RVM.N_MAX) / T0_rvm(RVM.N_MAX); // ~0.7567

// Map-swap relative changes.
const C3_REL_CHANGE = (SUR.C3 - RVM.C3) / RVM.C3; // ~+7.57 percent
const K_REL_CHANGE = (SUR.K_CURVATURE - RVM.K_CURVATURE) / RVM.K_CURVATURE; // ~+21.26 percent
const A_SKEW_REL_CHANGE = (SUR.A_SKEW_PREDICTED - RVM.A_SKEW_PREDICTED) / RVM.A_SKEW_PREDICTED; // ~-26.85 percent

const mapRow = (m) => ({
  log10_N_max: +(m.U0 / Math.LN10).toFixed(6),
  sigma_max: +m.SIGMA_MAX.toFixed(9),
  sigma_triple_prime: +m.SIGMA_TRIPLE_PRIME.toExponential(7),
  c3: +m.C3.toExponential(7),
  k_curvature: +m.K_CURVATURE.toExponential(6),
  w_rise_decades: +m.wRise.toExponential(6),
  w_fall_decades: +m.wFall.toExponential(6),
  imbalance_decades: +m.IMBALANCE.toExponential(5),
  arm_width_ratio: +m.RATIO.toFixed(7),
  a_skew_measured: +m.A_SKEW_MEASURED.toFixed(5),
  a_skew_predicted: +m.A_SKEW_PREDICTED.toFixed(5),
  a_skew_rel_agreement: +m.A_SKEW_REL_AGREEMENT.toExponential(3),
});

export const IMP35579_CUBIC_SKEW_CLOSED_SURROGATE = {
  id: 'imp-35579',
  proofSection: 'S-frontier',
  question:
    'imp-35451 measured the interior sigma-peak cubic-skew coefficient c3 ~ -2.623677e-4 (NEGATIVE, so the ' +
    'rising arm is wider) and the arm-imbalance slope A_skew ~ 11.01 it predicts, but ONLY on the RvM-inverse ' +
    'partsD surrogate. imp-35458 opened the height-map-sensitivity axis (RvM inverse vs the imp-35413 closed ' +
    'surrogate T0 = 2 pi N / log N) but never applied it to the peak SHAPE. Recompute sigma-triple-prime(u0), ' +
    'c3, k and A_skew on the closed surrogate and report whether the skew sign and magnitude survive the swap.',
  maps: {
    rvm_inverse: mapRow(RVM), // T0 = effectiveHeightForN(N) -- reproduces imp-35451
    closed_surrogate: mapRow(SUR), // T0 = 2 pi N / log N -- the imp-35413/imp-35458 map
  },
  map_swap: {
    mult_eff_at_peak: +MULT_EFF_AT_PEAK.toFixed(6), // ~0.7567 (imp-35616 framing: outside +/-5pct arms)
    c3_rel_change: +C3_REL_CHANGE.toExponential(4), // ~+7.57e-2 (|c3| grows)
    k_rel_change: +K_REL_CHANGE.toExponential(4), // ~+2.13e-1 (peak sharpens)
    a_skew_rel_change: +A_SKEW_REL_CHANGE.toExponential(4), // ~-2.68e-1 (slope drops)
    sign_robust: RVM.C3 < 0 && SUR.C3 < 0, // both NEGATIVE
    note:
      'The cubic-skew SIGN is robust: c3 stays NEGATIVE on BOTH maps and the rising arm is wider on BOTH ' +
      '(imbalance > 0, ratio > 1). The MAGNITUDE is NOT map-invariant: the closed surrogate is an effective ' +
      '~0.757 height multiplier at the peak (imp-35616: outside the +/-5 percent bracket), under which |c3| ' +
      'grows ~7.6 percent but k grows ~21 percent; since A_skew ~ -4 c3 / k^2 the k^2 growth dominates and the ' +
      'arm-imbalance slope DROPS ~27 percent (11.02 -> 8.06). The cubic-predicts-imbalance cross-check ' +
      'A_skew_pred = -4 c3 / (k^2 ln10) still holds on the surrogate (matches the direct slope to ~7.3e-4).',
  },
  finding:
    'The imp-35451 interior sigma-peak cubic-skew SIGN (c3 < 0, rising arm wider) SURVIVES the RvM-inverse -> ' +
    'closed-surrogate (T0 = 2 pi N / log N) height-map swap: c3 stays NEGATIVE (-2.6237e-4 -> -2.8222e-4) and ' +
    'the rising arm stays wider than the falling arm (positive imbalance, ratio > 1) on BOTH maps, with the ' +
    'A_skew_pred = -4 c3 / (k^2 ln10) cross-check holding on each. The MAGNITUDE is NOT map-invariant, though: ' +
    'the closed surrogate is a ~0.757 effective height multiplier at the peak (a ~-24 percent move, ~5x the ' +
    'widest imp-35615 +/-5 percent arm and outside its bracket per imp-35616), under which the peak sharpens ' +
    '(k +21 percent) faster than |c3| grows (+7.6 percent), so the arm-imbalance slope A_skew drops ~27 ' +
    'percent (11.02 -> 8.06). So the QUALITATIVE skew (negative cubic, rising arm wider) is a height-map ' +
    'invariant, but the arm-asymmetry SLOPE is a map-dependent quantitative feature. MEASUREMENT ONLY on the ' +
    'inherited imp-3220/imp-3406 double surrogate; imp-35337a stays OPEN.',
  residual_sub_gap:
    'Inherits imp-35337a: this cross-checks the cubic-skew sign/magnitude of the peak across the RvM-inverse ' +
    'and imp-35413 closed-surrogate height maps on the imp-3220/imp-3406 double surrogate, but does NOT ' +
    'establish that either surrogate MAP (E_coll = C_C sqrt(log T0/N), C_H = 1/8 ansatz) is a faithful proxy ' +
    'for the true empirical-vs-analytic gap at these heights; that sub-gap imp-35337a stays OPEN. Neither map ' +
    'is a rigorous asymptotic and the choice between them is not resolved here.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, frontier-direction, NOT an RH bound). Recomputing the imp-35451 interior ' +
    'sigma-peak cubic skew on the imp-35413 CLOSED surrogate height map T0 = 2 pi N / log N (vs the RvM-inverse ' +
    'effectiveHeightForN base): the skew SIGN is ROBUST -- c3 stays NEGATIVE (-2.6237e-4 -> -2.8222e-4), the ' +
    'rising arm stays wider on both maps, and the cubic-predicts-imbalance cross-check A_skew_pred = ' +
    '-4 c3 / (k^2 ln10) holds on each (surrogate rel ~7.3e-4). The MAGNITUDE is NOT map-invariant: the ' +
    'surrogate is a ~0.757 effective height multiplier at the peak (outside the imp-35615 +/-5 percent bracket ' +
    'per imp-35616), under which k grows ~21 percent while |c3| grows only ~7.6 percent, so A_skew drops ~27 ' +
    'percent (11.02 -> 8.06). MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate, which is NOT a ' +
    'rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643), the E_trunc = 3.06e-5 floor (imp-2631) and ' +
    'the imp-398 C_F prefactor are UNTOUCHED; C_mb stays GUE-conditional per imp-486; the surrogate-vs-true ' +
    'fidelity half (imp-35337a) stays OPEN; changes no bound; establishes no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35451 (cubic skew c3 ~ -2.6237e-4 on the RvM base map only); imp-35458 (RvM-vs-closed-surrogate ' +
    'height-map axis); imp-35557 / imp-35615 (multiplicative RvM x {1.02,0.98,1.05,0.95} skew robustness); ' +
    'imp-35616 (surrogate ~ RvM x mult_eff, outside +/-5pct); imp-35413/imp-35280 (closed surrogate ' +
    'T0 = 2 pi N / log N); imp-35450 (quadratic curvature k); imp-35337 (dd-certified peak VALUE); imp-2642 ' +
    '(C_C = (1/8) sqrt(3 pi) ansatz); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse).',
};

export const IMP35579_CUBIC_SKEW_CLOSED_SURROGATE_ASSERTIONS = [
  {
    // Reuse gate: the RvM map reproduces the imp-35451 base numbers (c3 ~ -2.6237e-4, k ~ 6.4319e-3).
    id: 'imp35579-reproduces-imp35451-rvm-base',
    description: 'RvM map reproduces imp-35451 base c3 ~ -2.6237e-4, sigma-triple-prime ~ -1.5742e-3, k ~ 6.4319e-3',
    holds: () =>
      Math.abs(RVM.C3 - -2.6236765e-4) < 5e-9 &&
      Math.abs(RVM.SIGMA_TRIPLE_PRIME - -1.5742059e-3) < 5e-8 &&
      Math.abs(RVM.K_CURVATURE - 6.431916e-3) < 5e-8,
  },
  {
    // The closed surrogate keeps c3 NEGATIVE (sign robust) and shifts it to ~ -2.8222e-4.
    id: 'imp35579-surrogate-c3-negative',
    description: 'closed surrogate keeps c3 < 0 (sign robust), c3 ~ -2.8222e-4, sigma-triple-prime ~ -1.6933e-3',
    holds: () =>
      SUR.C3 < 0 &&
      Math.abs(SUR.C3 - -2.8222125e-4) < 5e-9 &&
      Math.abs(SUR.SIGMA_TRIPLE_PRIME - -1.6933275e-3) < 5e-8,
  },
  {
    // Sign robustness of the arm asymmetry: the rising arm is wider on BOTH maps (positive imbalance, ratio > 1).
    id: 'imp35579-rising-arm-wider-both-maps',
    description: 'rising arm wider (imbalance > 0, ratio > 1) on BOTH the RvM and closed-surrogate maps',
    holds: () =>
      RVM.IMBALANCE > 0 && RVM.RATIO > 1 && SUR.IMBALANCE > 0 && SUR.RATIO > 1,
  },
  {
    // Magnitude is NOT invariant: A_skew drops materially (~27 percent) on the surrogate, from ~11.02 to ~8.06.
    id: 'imp35579-a-skew-drops-on-surrogate',
    description: 'A_skew NOT map-invariant: drops from ~11.02 (RvM) to ~8.06 (surrogate), rel change ~ -0.27',
    holds: () =>
      RVM.A_SKEW_PREDICTED > 10.9 && RVM.A_SKEW_PREDICTED < 11.1 &&
      SUR.A_SKEW_PREDICTED > 7.9 && SUR.A_SKEW_PREDICTED < 8.2 &&
      A_SKEW_REL_CHANGE < -0.2 && A_SKEW_REL_CHANGE > -0.35,
  },
  {
    // Mechanism: k grows FASTER than |c3| under the swap (k +21 percent vs |c3| +7.6 percent), so A_skew ~ -4c3/k^2 falls.
    id: 'imp35579-k-grows-faster-than-c3',
    description: 'k grows ~21 percent while |c3| grows only ~7.6 percent, so the k^2 term drives A_skew down',
    holds: () =>
      K_REL_CHANGE > 0.18 && K_REL_CHANGE < 0.24 &&
      C3_REL_CHANGE > 0.06 && C3_REL_CHANGE < 0.09 &&
      K_REL_CHANGE > C3_REL_CHANGE,
  },
  {
    // Cross-check holds on the surrogate too: A_skew_pred = -4 c3/(k^2 ln10) matches the direct slope to < 1e-2.
    id: 'imp35579-cross-check-holds-on-surrogate',
    description: 'A_skew_pred = -4 c3/(k^2 ln10) matches the direct arm-imbalance slope to < 1e-2 on BOTH maps',
    holds: () => RVM.A_SKEW_REL_AGREEMENT < 1e-2 && SUR.A_SKEW_REL_AGREEMENT < 1e-2,
  },
  {
    // The surrogate is a large effective perturbation at the peak (mult_eff ~ 0.757, outside the +/-5pct bracket).
    id: 'imp35579-surrogate-outside-5pct-bracket',
    description: 'closed surrogate is a ~0.757 effective height multiplier at the peak -- outside the +/-5pct arm',
    holds: () => MULT_EFF_AT_PEAK > 0.70 && MULT_EFF_AT_PEAK < 0.80 && MULT_EFF_AT_PEAK < 0.95,
  },
  {
    // Honesty gate: measurement only, not rigorous, no QED, no refereed bound is changed, sub-gap imp-35337a named.
    id: 'imp35579-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, imp-35337a stays OPEN',
    holds: () =>
      IMP35579_CUBIC_SKEW_CLOSED_SURROGATE.isRigorous === false &&
      /NO QED/.test(IMP35579_CUBIC_SKEW_CLOSED_SURROGATE.verdict) &&
      /refereed bound is changed/i.test(IMP35579_CUBIC_SKEW_CLOSED_SURROGATE.verdict) &&
      /imp-35337a/.test(IMP35579_CUBIC_SKEW_CLOSED_SURROGATE.residual_sub_gap),
  },
];

for (const a of IMP35579_CUBIC_SKEW_CLOSED_SURROGATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35579-cubic-skew-closed-surrogate assertion failed: ${a.id}`);
  }
}
